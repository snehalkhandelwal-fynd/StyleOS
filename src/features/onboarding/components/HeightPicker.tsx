import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View
} from "react-native";

import { colors, fonts, spacing } from "../../../theme";

type HeightPickerProps = {
  feet: number;
  inches: number;
  onChangeHeight: (feet: number, inches: number) => void;
};

type HeightOption = {
  centimeters: number;
  feet: number;
  id: string;
  inches: number;
  label: string;
};

const itemHeight = 56;
const minTotalInches = 54;
const maxTotalInches = 84;
const visibleItems = 5;
const pickerHeight = itemHeight * visibleItems;
const centerOffset = itemHeight * 2;

function createHeightOption(totalInches: number): HeightOption {
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  const centimeters = Math.round(totalInches * 2.54);

  return {
    centimeters,
    feet,
    id: `${feet}-${inches}`,
    inches,
    label: `${feet}' ${inches}" (${centimeters} cm)`
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function HeightPicker({
  feet,
  inches,
  onChangeHeight
}: HeightPickerProps) {
  const listRef = useRef<FlatList<HeightOption>>(null);
  const options = useMemo(
    () =>
      Array.from(
        { length: maxTotalInches - minTotalInches + 1 },
        (_, index) => createHeightOption(minTotalInches + index)
      ),
    []
  );
  const selectedTotalInches = feet * 12 + inches;
  const selectedIndex = clamp(
    selectedTotalInches - minTotalInches,
    0,
    options.length - 1
  );
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  const indexFromOffset = useCallback(
    (offsetY: number) =>
      clamp(Math.round(offsetY / itemHeight), 0, options.length - 1),
    [options.length]
  );

  const commitIndex = useCallback(
    (nextIndex: number) => {
      const nextHeight = options[nextIndex];

      if (!nextHeight) {
        return;
      }

      setActiveIndex(nextIndex);
      onChangeHeight(nextHeight.feet, nextHeight.inches);
    },
    [onChangeHeight, options]
  );

  const snapToIndex = useCallback(
    (nextIndex: number, animated = true) => {
      const boundedIndex = clamp(nextIndex, 0, options.length - 1);

      listRef.current?.scrollToOffset({
        animated,
        offset: boundedIndex * itemHeight
      });
      commitIndex(boundedIndex);
    },
    [commitIndex, options.length]
  );

  useEffect(() => {
    setActiveIndex(selectedIndex);
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({
        animated: false,
        offset: selectedIndex * itemHeight
      });
    });
  }, [selectedIndex]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setActiveIndex(indexFromOffset(event.nativeEvent.contentOffset.y));
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    snapToIndex(indexFromOffset(event.nativeEvent.contentOffset.y));
  };

  return (
    <View style={styles.wrap}>
      <View pointerEvents="none" style={styles.selectionLines}>
        <View style={styles.divider} />
        <View style={styles.divider} />
      </View>

      <FlatList
        bounces={false}
        contentContainerStyle={styles.listContent}
        data={options}
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          index,
          length: itemHeight,
          offset: itemHeight * index
        })}
        initialScrollIndex={selectedIndex}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        onMomentumScrollEnd={handleScrollEnd}
        onScroll={handleScroll}
        onScrollEndDrag={handleScrollEnd}
        ref={listRef}
        renderItem={({ item, index }) => {
          const distance = Math.abs(index - activeIndex);
          const isSelected = distance === 0;

          return (
            <View style={styles.item}>
              <Text
                style={[
                  styles.itemText,
                  distance === 1 ? styles.adjacentText : null,
                  distance >= 2 ? styles.farText : null,
                  isSelected ? styles.selectedText : null
                ]}
              >
                {item.label}
              </Text>
            </View>
          );
        }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        snapToInterval={itemHeight}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  adjacentText: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24
  },
  divider: {
    backgroundColor: colors.border,
    height: StyleSheet.hairlineWidth
  },
  farText: {
    color: colors.soft,
    opacity: 0.55
  },
  item: {
    alignItems: "center",
    height: itemHeight,
    justifyContent: "center"
  },
  itemText: {
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24
  },
  list: {
    height: pickerHeight
  },
  listContent: {
    paddingBottom: centerOffset,
    paddingTop: centerOffset
  },
  selectedText: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 24,
    lineHeight: 30
  },
  selectionLines: {
    height: itemHeight,
    justifyContent: "space-between",
    left: 0,
    position: "absolute",
    right: 0,
    top: centerOffset,
    zIndex: 2
  },
  wrap: {
    height: pickerHeight,
    marginTop: spacing.xxl
  }
});
