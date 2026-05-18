import { useEffect, useMemo, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import { NextCircleButton } from "../components/NextCircleButton";
import { colors, fonts, spacing, typography } from "../theme";

const itemHeight = 56;
const visiblePickerItems = 5;
const pickerHeight = itemHeight * visiblePickerItems;
const pickerSidePadding = itemHeight * 2;
const selectedBandHeight = itemHeight;
const selectedBandTop = (pickerHeight - selectedBandHeight) / 2;
const minHeightInches = 48;
const maxHeightInches = 84;

type HeightScreenProps = {
  heightInches: number;
  onBack: () => void;
  onChangeHeight: (heightInches: number) => void;
  onContinue: () => void;
};

function formatHeight(heightInches: number) {
  const feet = Math.floor(heightInches / 12);
  const inches = heightInches % 12;
  const centimeters = Math.round(heightInches * 2.54);

  return `${feet}’${inches} (${centimeters} cm)`;
}

export function HeightScreen({
  heightInches,
  onChangeHeight,
  onContinue
}: HeightScreenProps) {
  const scrollRef = useRef<ScrollView>(null);
  const [activeHeight, setActiveHeight] = useState(heightInches);
  const heights = useMemo(
    () =>
      Array.from(
        { length: maxHeightInches - minHeightInches + 1 },
        (_, index) => minHeightInches + index
      ),
    []
  );
  const selectedIndex = heightInches - minHeightInches;

  useEffect(() => {
    setActiveHeight(heightInches);
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        animated: false,
        y: selectedIndex * itemHeight
      });
    });
  }, [heightInches, selectedIndex]);

  const getIndexFromOffset = (offsetY: number) =>
    Math.max(
      0,
      Math.min(Math.round(offsetY / itemHeight), heights.length - 1)
    );

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setActiveHeight(
      heights[getIndexFromOffset(event.nativeEvent.contentOffset.y)]
    );
  };

  const snapToHeight = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = getIndexFromOffset(event.nativeEvent.contentOffset.y);
    const nextHeight = heights[nextIndex];

    setActiveHeight(nextHeight);
    onChangeHeight(nextHeight);
    scrollRef.current?.scrollTo({
      animated: true,
      y: nextIndex * itemHeight
    });
  };

  const handleScrollEndDrag = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const nativeEvent = event.nativeEvent as NativeScrollEvent & {
      velocity?: { y?: number };
    };
    const velocityY = nativeEvent.velocity?.y ?? 0;

    if (Math.abs(velocityY) < 0.1) {
      snapToHeight(event);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerSpacer} />

      <View style={styles.content}>
        <Text style={styles.title}>How tall are you?</Text>

        <View style={styles.pickerWrap}>
          <View pointerEvents="none" style={styles.selectionLines}>
            <View style={styles.selectionLine} />
            <View style={styles.selectionLine} />
          </View>

          <ScrollView
            alwaysBounceVertical={false}
            bounces={false}
            contentInsetAdjustmentBehavior="never"
            decelerationRate="fast"
            directionalLockEnabled
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            onMomentumScrollEnd={snapToHeight}
            onScroll={handleScroll}
            onScrollEndDrag={handleScrollEndDrag}
            overScrollMode="never"
            ref={scrollRef}
            scrollEnabled
            showsVerticalScrollIndicator={false}
            snapToAlignment="start"
            snapToInterval={itemHeight}
            scrollEventThrottle={16}
            style={styles.picker}
          >
            <View style={styles.pickerPadding} />
            {heights.map((height) => {
              const distance = Math.abs(height - activeHeight);

              return (
                <View key={height} style={styles.heightItem}>
                  <Text
                    style={[
                      styles.heightText,
                      distance === 1 ? styles.heightTextAdjacent : null,
                      distance >= 2 ? styles.heightTextFar : null,
                      distance === 0 ? styles.heightTextSelected : null
                    ]}
                  >
                    {formatHeight(height)}
                  </Text>
                </View>
              );
            })}
            <View style={styles.pickerPadding} />
          </ScrollView>
        </View>
      </View>

      <View style={styles.footer}>
        <NextCircleButton
          currentStep={2}
          onPress={onContinue}
          totalSteps={5}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing.screen,
    paddingTop: 24
  },
  footer: {
    alignItems: "flex-end",
    paddingBottom: 56,
    paddingHorizontal: spacing.screen
  },
  headerSpacer: {
    height: 48
  },
  heightItem: {
    alignItems: "center",
    height: itemHeight,
    justifyContent: "center"
  },
  heightText: {
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20
  },
  heightTextAdjacent: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24
  },
  heightTextFar: {
    color: colors.soft,
    opacity: 0.55
  },
  heightTextSelected: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 24,
    lineHeight: 32
  },
  picker: {
    height: pickerHeight
  },
  pickerPadding: {
    height: pickerSidePadding
  },
  pickerWrap: {
    height: pickerHeight,
    justifyContent: "center",
    marginTop: 36,
    overflow: "hidden",
    position: "relative"
  },
  screen: {
    flex: 1
  },
  selectionLine: {
    backgroundColor: colors.border,
    height: 1
  },
  selectionLines: {
    height: selectedBandHeight,
    justifyContent: "space-between",
    left: 0,
    position: "absolute",
    right: 0,
    top: selectedBandTop,
    zIndex: 2
  },
  title: {
    color: colors.text,
    marginTop: 28,
    ...typography.h2
  }
});
