import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

import { PrimaryButton } from "../../../components/PrimaryButton";
import { splashBanners } from "../../../data/onboarding";
import { colors, radii, spacing, typography } from "../../../theme";

type SplashScreenProps = {
  onExplore: () => void;
  onGetStarted: () => void;
};

type SplashBanner = (typeof splashBanners)[number];
type CarouselBanner = SplashBanner & {
  itemKey: string;
  realIndex: number;
};

const autoScrollMs = 3500;
const slideCount = splashBanners.length;
const carouselCycleCount = 31;
const centeredCycle = Math.floor(carouselCycleCount / 2);
const centeredStartIndex = centeredCycle * slideCount;

function getRealIndex(index: number) {
  return ((index % slideCount) + slideCount) % slideCount;
}

export function SplashScreen({ onExplore, onGetStarted }: SplashScreenProps) {
  const listRef = useRef<FlatList<CarouselBanner>>(null);
  const physicalIndexRef = useRef(centeredStartIndex);
  const isDraggingRef = useRef(false);
  const dragReleaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const { width } = useWindowDimensions();
  const pageWidth = Math.max(width, 1);
  const cardWidth = Math.max(width - spacing.screen * 2, 1);
  const carouselItems = useMemo<CarouselBanner[]>(
    () =>
      Array.from({ length: slideCount * carouselCycleCount }, (_, index) => {
        const realIndex = getRealIndex(index);
        const banner = splashBanners[realIndex];

        return {
          ...banner,
          itemKey: `${banner.id}-${index}`,
          realIndex
        };
      }),
    []
  );
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToPhysicalIndex = useCallback(
    (index: number, animated: boolean) => {
      physicalIndexRef.current = index;
      setActiveIndex(getRealIndex(index));
      listRef.current?.scrollToIndex({ animated, index });
    },
    []
  );

  const recenterIfNeeded = useCallback(
    (index: number) => {
      const buffer = slideCount * 4;
      const nearStart = index < buffer;
      const nearEnd = index > carouselItems.length - buffer;

      if (!nearStart && !nearEnd) {
        return;
      }

      const centeredIndex = centeredStartIndex + getRealIndex(index);
      requestAnimationFrame(() => {
        scrollToPhysicalIndex(centeredIndex, false);
      });
    },
    [carouselItems.length, scrollToPhysicalIndex]
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({
        animated: false,
        index: physicalIndexRef.current
      });
    });
  }, [pageWidth]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isDraggingRef.current) {
        return;
      }

      const nextIndex = physicalIndexRef.current + 1;
      scrollToPhysicalIndex(nextIndex, true);
      recenterIfNeeded(nextIndex);
    }, autoScrollMs);

    return () => clearInterval(timer);
  }, [recenterIfNeeded, scrollToPhysicalIndex]);

  useEffect(
    () => () => {
      if (dragReleaseTimeoutRef.current) {
        clearTimeout(dragReleaseTimeoutRef.current);
      }
    },
    []
  );

  const handleMomentumEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    if (dragReleaseTimeoutRef.current) {
      clearTimeout(dragReleaseTimeoutRef.current);
    }

    const rawIndex = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    physicalIndexRef.current = rawIndex;
    setActiveIndex(getRealIndex(rawIndex));
    isDraggingRef.current = false;
    recenterIfNeeded(rawIndex);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.brand}>Stylus</Text>

      <View style={styles.carouselWrap}>
        <FlatList
          data={carouselItems}
          decelerationRate="fast"
          getItemLayout={(_, index) => ({
            index,
            length: pageWidth,
            offset: pageWidth * index
          })}
          horizontal
          keyExtractor={(item) => item.itemKey}
          onMomentumScrollEnd={handleMomentumEnd}
          onScrollBeginDrag={() => {
            if (dragReleaseTimeoutRef.current) {
              clearTimeout(dragReleaseTimeoutRef.current);
            }

            isDraggingRef.current = true;
          }}
          onScrollEndDrag={() => {
            dragReleaseTimeoutRef.current = setTimeout(() => {
              isDraggingRef.current = false;
            }, 500);
          }}
          onMomentumScrollBegin={() => {
            if (dragReleaseTimeoutRef.current) {
              clearTimeout(dragReleaseTimeoutRef.current);
            }

            isDraggingRef.current = true;
          }}
          onScrollToIndexFailed={({ index }) => {
            requestAnimationFrame(() => {
              listRef.current?.scrollToIndex({ animated: false, index });
            });
          }}
          pagingEnabled
          ref={listRef}
          renderItem={({ item }) => (
            <View style={[styles.cardFrame, { width: pageWidth }]}>
              <ImageBackground
                imageStyle={styles.cardImage}
                resizeMode="cover"
                source={{ uri: item.image }}
                style={[styles.card, { width: cardWidth }]}
              >
                <View style={styles.overlay} />
                <View style={styles.cardCopy}>
                  <Text style={styles.kicker}>{item.kicker}</Text>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                </View>
              </ImageBackground>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
          snapToInterval={pageWidth}
        />

        <View style={styles.dots}>
          {splashBanners.map((banner, index) => (
            <View
              key={banner.id}
              style={[styles.dot, activeIndex === index ? styles.activeDot : null]}
            />
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Get Started" onPress={onGetStarted} />
        <Pressable
          accessibilityRole="button"
          onPress={onExplore}
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed ? styles.pressed : null
          ]}
        >
          <Text style={styles.secondaryText}>Explore without signing in</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.md,
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.xl
  },
  activeDot: {
    backgroundColor: colors.text,
    width: 22
  },
  brand: {
    color: colors.text,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xl,
    marginBottom: spacing.lg,
    ...typography.sectionHeading
  },
  card: {
    backgroundColor: colors.imageSurface,
    borderRadius: radii.card,
    flex: 1,
    justifyContent: "flex-end",
    overflow: "hidden"
  },
  cardCopy: {
    gap: spacing.sm,
    padding: spacing.lg
  },
  cardFrame: {
    alignItems: "center",
    paddingHorizontal: spacing.screen
  },
  cardImage: {
    backgroundColor: colors.imageSurface,
    borderRadius: radii.card
  },
  cardSubtitle: {
    color: colors.inverseText,
    ...typography.bodyLarge
  },
  cardTitle: {
    color: colors.inverseText,
    ...typography.displayHeadline
  },
  carouselWrap: {
    flex: 1,
    justifyContent: "center",
    overflow: "hidden"
  },
  dot: {
    backgroundColor: colors.border,
    borderRadius: radii.pill,
    height: 6,
    width: 6
  },
  dots: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
    justifyContent: "center",
    paddingTop: spacing.lg
  },
  kicker: {
    color: colors.inverseText,
    ...typography.caption
  },
  overlay: {
    backgroundColor: colors.scrimSoft,
    borderRadius: radii.card,
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  pressed: {
    opacity: 0.72
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: colors.secondaryBorder,
    borderRadius: radii.button,
    borderWidth: 1,
    height: 44,
    justifyContent: "center"
  },
  secondaryText: {
    color: colors.text,
    ...typography.bodyLarge
  }
});
