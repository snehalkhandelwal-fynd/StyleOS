import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  type ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";

import { colors, fonts, radii, spacing } from "../../../theme";

type HeightUnit = "ft" | "cm";

type HeightPickerProps = {
  feet: number;
  inches: number;
  onChangeHeight: (feet: number, inches: number) => void;
  variant?: "default" | "compact";
};

type HeightOption = {
  centimeters: number;
  feet: number;
  id: string;
  inches: number;
  label: string;
  majorLabel?: string;
  totalInches: number;
  value: number;
};

const inchTickWidth = 18;
const cmTickWidth = 8;
const compactInchTickWidth = 16;
const compactCmTickWidth = 7;
const minTotalInches = 54;
const maxTotalInches = 84;
const minCentimeters = 137;
const maxCentimeters = 213;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getCentimeters(totalInches: number) {
  return Math.round(totalInches * 2.54);
}

function getHeightParts(totalInches: number) {
  return {
    feet: Math.floor(totalInches / 12),
    inches: totalInches % 12
  };
}

function formatFeetLabel(totalInches: number) {
  const { feet, inches } = getHeightParts(totalInches);

  return `${feet}'${inches}"`;
}

function getFtOptions(): HeightOption[] {
  return Array.from(
    { length: maxTotalInches - minTotalInches + 1 },
    (_, index) => {
      const totalInches = minTotalInches + index;
      const { feet, inches } = getHeightParts(totalInches);
      const centimeters = getCentimeters(totalInches);

      return {
        centimeters,
        feet,
        id: `ft-${totalInches}`,
        inches,
        label: `${formatFeetLabel(totalInches)} ft`,
        majorLabel: inches === 0 ? String(feet) : undefined,
        totalInches,
        value: totalInches
      };
    }
  );
}

function getCmOptions(): HeightOption[] {
  return Array.from(
    { length: maxCentimeters - minCentimeters + 1 },
    (_, index) => {
      const centimeters = minCentimeters + index;
      const totalInches = clamp(
        Math.round(centimeters / 2.54),
        minTotalInches,
        maxTotalInches
      );
      const { feet, inches } = getHeightParts(totalInches);

      return {
        centimeters,
        feet,
        id: `cm-${centimeters}`,
        inches,
        label: `${centimeters} cm`,
        majorLabel: centimeters % 25 === 0 ? String(centimeters) : undefined,
        totalInches,
        value: centimeters
      };
    }
  );
}

function getTickType(option: HeightOption, unit: HeightUnit) {
  if (unit === "ft") {
    if (option.inches === 0) {
      return "major";
    }

    if (option.inches % 6 === 0) {
      return "medium";
    }

    return "minor";
  }

  if (option.centimeters % 10 === 0) {
    return "major";
  }

  if (option.centimeters % 5 === 0) {
    return "medium";
  }

  return "minor";
}

export function HeightPicker({
  feet,
  inches,
  onChangeHeight,
  variant = "default"
}: HeightPickerProps) {
  const listRef = useRef<FlatList<HeightOption>>(null);
  const activeIndexRef = useRef(0);
  const isMomentumScrollingRef = useRef(false);
  const isCompact = variant === "compact";
  const [unit, setUnit] = useState<HeightUnit>("ft");
  const [trackWidth, setTrackWidth] = useState(0);
  const totalInches = clamp(
    feet * 12 + inches,
    minTotalInches,
    maxTotalInches
  );
  const options = useMemo(
    () => (unit === "ft" ? getFtOptions() : getCmOptions()),
    [unit]
  );
  const tickWidth =
    unit === "ft"
      ? isCompact
        ? compactInchTickWidth
        : inchTickWidth
      : isCompact
        ? compactCmTickWidth
        : cmTickWidth;
  const selectedValue =
    unit === "ft" ? totalInches : getCentimeters(totalInches);
  const selectedIndex = clamp(
    options.findIndex((option) => option.value === selectedValue),
    0,
    options.length - 1
  );
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const activeOption = options[activeIndex] ?? options[selectedIndex];
  const centerPadding = Math.max(0, trackWidth / 2 - tickWidth / 2);
  const trackHeight = isCompact ? 58 : 72;
  const rulerContentStyle = useMemo(
    () => ({
      paddingHorizontal: centerPadding
    }),
    [centerPadding]
  );

  const updateActiveIndex = useCallback((index: number) => {
    if (activeIndexRef.current === index) {
      return;
    }

    activeIndexRef.current = index;
    setActiveIndex(index);
  }, []);

  const scrollToIndex = useCallback(
    (index: number, animated = true) => {
      listRef.current?.scrollToOffset({
        animated,
        offset: index * tickWidth
      });
    },
    [tickWidth]
  );

  useEffect(() => {
    activeIndexRef.current = selectedIndex;
    setActiveIndex(selectedIndex);

    if (trackWidth <= 0) {
      return;
    }

    requestAnimationFrame(() => scrollToIndex(selectedIndex, false));
  }, [scrollToIndex, selectedIndex, trackWidth, unit]);

  const indexFromOffset = useCallback(
    (offsetX: number) =>
      clamp(Math.round(offsetX / tickWidth), 0, options.length - 1),
    [options.length, tickWidth]
  );

  const commitIndex = useCallback(
    (index: number, shouldSnap = false) => {
      const option = options[index];

      if (!option) {
        return;
      }

      updateActiveIndex(index);
      onChangeHeight(option.feet, option.inches);

      if (shouldSnap) {
        scrollToIndex(index);
      }
    },
    [onChangeHeight, options, scrollToIndex, updateActiveIndex]
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      updateActiveIndex(indexFromOffset(event.nativeEvent.contentOffset.x));
    },
    [indexFromOffset, updateActiveIndex]
  );

  const handleMomentumScrollBegin = useCallback(() => {
    isMomentumScrollingRef.current = true;
  }, []);

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      isMomentumScrollingRef.current = false;
      commitIndex(indexFromOffset(event.nativeEvent.contentOffset.x));
    },
    [commitIndex, indexFromOffset]
  );

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const velocityX = Math.abs(event.nativeEvent.velocity?.x ?? 0);

      if (isMomentumScrollingRef.current || velocityX > 0.05) {
        return;
      }

      commitIndex(indexFromOffset(event.nativeEvent.contentOffset.x), true);
    },
    [commitIndex, indexFromOffset]
  );

  const renderHeightTick = useCallback(
    ({ item }: ListRenderItemInfo<HeightOption>) => {
      const tickType = getTickType(item, unit);

      return (
        <View
          style={[
            styles.tickColumn,
            isCompact ? styles.tickColumnCompact : null,
            { width: tickWidth }
          ]}
        >
          <View
            style={[
              styles.tick,
              tickType === "major" ? styles.majorTick : null,
              tickType === "medium" ? styles.mediumTick : null
            ]}
          />
          {item.majorLabel ? (
            <Text
              ellipsizeMode="clip"
              numberOfLines={1}
              style={styles.majorLabel}
            >
              {item.majorLabel}
            </Text>
          ) : null}
        </View>
      );
    },
    [isCompact, tickWidth, unit]
  );

  return (
    <View style={[styles.container, isCompact ? styles.containerCompact : null]}>
      <View style={styles.headerRow}>
        <Text style={styles.fieldLabel}>Height</Text>
        <View style={styles.segmentedControl}>
          {(["ft", "cm"] as const).map((nextUnit) => {
            const isSelected = unit === nextUnit;

            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                key={nextUnit}
                onPress={() => setUnit(nextUnit)}
                style={[
                  styles.segment,
                  isSelected ? styles.segmentSelected : null
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    isSelected ? styles.segmentTextSelected : null
                  ]}
                >
                  {nextUnit}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View
        onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
        style={[
          styles.rulerWrap,
          isCompact ? styles.rulerWrapCompact : null,
          { height: trackHeight }
        ]}
      >
        <FlatList
          bounces={false}
          contentContainerStyle={rulerContentStyle}
          data={options}
          decelerationRate="fast"
          disableIntervalMomentum
          getItemLayout={(_, index) => ({
            index,
            length: tickWidth,
            offset: tickWidth * index
          })}
          horizontal
          initialScrollIndex={selectedIndex}
          key={`${unit}-${tickWidth}`}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
          onMomentumScrollBegin={handleMomentumScrollBegin}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          onScroll={handleScroll}
          onScrollEndDrag={handleScrollEnd}
          ref={listRef}
          removeClippedSubviews={false}
          renderItem={renderHeightTick}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          snapToInterval={tickWidth}
        />

        <View pointerEvents="none" style={styles.selectedMarker}>
          <View
            style={[
              styles.markerLine,
              isCompact ? styles.markerLineCompact : null
            ]}
          />
          <View style={styles.markerBase} />
        </View>
      </View>

      <View
        style={[
          styles.selectedValueRow,
          isCompact ? styles.selectedValueRowCompact : null
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.selectedValue,
            isCompact ? styles.selectedValueCompact : null
          ]}
        >
          {unit === "ft"
            ? formatFeetLabel(activeOption.totalInches)
            : activeOption.centimeters}
        </Text>
        <Text style={styles.selectedUnit}>{unit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    marginTop: spacing.lg
  },
  containerCompact: {
    marginTop: spacing.md
  },
  fieldLabel: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  majorLabel: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    includeFontPadding: false,
    left: -22,
    lineHeight: 15,
    position: "absolute",
    textAlign: "center",
    top: 38,
    width: 52
  },
  majorTick: {
    backgroundColor: colors.muted,
    height: 28
  },
  markerBase: {
    backgroundColor: colors.text,
    borderRadius: 2,
    height: 8,
    transform: [{ rotate: "45deg" }],
    width: 8
  },
  markerLine: {
    backgroundColor: colors.text,
    borderRadius: 1,
    height: 36,
    width: 2
  },
  markerLineCompact: {
    height: 28
  },
  mediumTick: {
    height: 21
  },
  rulerWrap: {
    justifyContent: "center",
    overflow: "hidden"
  },
  rulerWrapCompact: {
    marginTop: spacing.sm
  },
  segment: {
    alignItems: "center",
    borderRadius: radii.pill,
    justifyContent: "center",
    minWidth: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: 7
  },
  segmentedControl: {
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    flexDirection: "row",
    padding: 4
  },
  segmentSelected: {
    backgroundColor: colors.text
  },
  segmentText: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18
  },
  segmentTextSelected: {
    color: colors.inverseText
  },
  selectedMarker: {
    alignItems: "center",
    left: "50%",
    marginLeft: -4,
    position: "absolute",
    top: 0
  },
  selectedUnit: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    includeFontPadding: false,
    lineHeight: 16,
    marginBottom: 3,
    marginLeft: 5
  },
  selectedValue: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 23,
    includeFontPadding: false,
    lineHeight: 29
  },
  selectedValueCompact: {
    fontSize: 18,
    lineHeight: 23
  },
  selectedValueRow: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "center"
  },
  selectedValueRowCompact: {
    marginBottom: spacing.xl,
    marginTop: -1
  },
  tick: {
    backgroundColor: colors.border,
    borderRadius: 1,
    height: 16,
    width: 1
  },
  tickColumn: {
    alignItems: "center",
    height: 54,
    overflow: "visible"
  },
  tickColumnCompact: {
    height: 50
  }
});
