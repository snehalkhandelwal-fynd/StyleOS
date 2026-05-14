import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

import { PrimaryButton } from "../components/PrimaryButton";
import { SecondaryButton } from "../components/SecondaryButton";
import { splashBanners } from "../data/onboarding";
import { colors, fonts, radii, spacing } from "../theme";

type SplashScreenProps = {
  onExplore: () => void;
  onGetStarted: () => void;
};

type SplashBanner = (typeof splashBanners)[number];
type CarouselBanner = SplashBanner & {
  itemKey: string;
  realIndex: number;
};

const slideCount = splashBanners.length;
const carouselCycleCount = 15;
const centeredCycle = Math.floor(carouselCycleCount / 2);
const centeredStartIndex = centeredCycle * slideCount;

const getRealSlideIndex = (physicalIndex: number) =>
  ((physicalIndex % slideCount) + slideCount) % slideCount;

export function SplashScreen({ onExplore, onGetStarted }: SplashScreenProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const physicalSlideRef = useRef(centeredStartIndex);
  const isDraggingRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);
  const dragReleaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const programmaticScrollTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const { width } = useWindowDimensions();
  const pageWidth = Math.max(width, 1);
  const cardWidth = Math.max(width - spacing.screen * 2, 1);

  const carouselItems = useMemo<CarouselBanner[]>(
    () =>
      Array.from({ length: slideCount * carouselCycleCount }, (_, index) => {
        const realIndex = getRealSlideIndex(index);
        const banner = splashBanners[realIndex];

        return {
          ...banner,
          itemKey: `${banner.id}-${index}`,
          realIndex
        };
      }),
    []
  );

  const setActiveFromPhysicalIndex = useCallback((physicalIndex: number) => {
    const realIndex = getRealSlideIndex(physicalIndex);
    physicalSlideRef.current = physicalIndex;
    setActiveSlide((currentSlide) =>
      currentSlide === realIndex ? currentSlide : realIndex
    );

    return realIndex;
  }, []);

  const scrollToPhysicalIndex = useCallback(
    (physicalIndex: number, animated: boolean) => {
      if (programmaticScrollTimeoutRef.current) {
        clearTimeout(programmaticScrollTimeoutRef.current);
      }

      isProgrammaticScrollRef.current = animated;
      setActiveFromPhysicalIndex(physicalIndex);
      scrollRef.current?.scrollTo({
        animated,
        x: physicalIndex * pageWidth,
        y: 0
      });

      if (animated) {
        programmaticScrollTimeoutRef.current = setTimeout(() => {
          isProgrammaticScrollRef.current = false;
          setActiveFromPhysicalIndex(physicalIndex);
        }, 420);
      } else {
        isProgrammaticScrollRef.current = false;
      }
    },
    [pageWidth, setActiveFromPhysicalIndex]
  );

  const recenterIfNeeded = useCallback(
    (physicalIndex: number) => {
      const buffer = slideCount * 3;
      const isNearStart = physicalIndex < buffer;
      const isNearEnd = physicalIndex > carouselItems.length - buffer;

      if (!isNearStart && !isNearEnd) {
        return;
      }

      const centeredIndex =
        centeredStartIndex + getRealSlideIndex(physicalIndex);
      physicalSlideRef.current = centeredIndex;

      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({
          animated: false,
          x: centeredIndex * pageWidth,
          y: 0
        });
      });
    },
    [carouselItems.length, pageWidth]
  );

  const getPhysicalIndexFromOffset = useCallback(
    (offsetX: number) =>
      Math.max(
        0,
        Math.min(Math.round(offsetX / pageWidth), carouselItems.length - 1)
      ),
    [carouselItems.length, pageWidth]
  );

  const snapToNearestSlide = useCallback(
    (offsetX: number) => {
      const nextIndex = getPhysicalIndexFromOffset(offsetX);
      scrollToPhysicalIndex(nextIndex, true);
      recenterIfNeeded(nextIndex);
    },
    [getPhysicalIndexFromOffset, recenterIfNeeded, scrollToPhysicalIndex]
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isProgrammaticScrollRef.current) {
        return;
      }

      setActiveFromPhysicalIndex(
        getPhysicalIndexFromOffset(event.nativeEvent.contentOffset.x)
      );
    },
    [getPhysicalIndexFromOffset, setActiveFromPhysicalIndex]
  );

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (dragReleaseTimeoutRef.current) {
        clearTimeout(dragReleaseTimeoutRef.current);
      }

      if (isProgrammaticScrollRef.current) {
        return;
      }

      isDraggingRef.current = false;

      const boundedIndex = getPhysicalIndexFromOffset(
        event.nativeEvent.contentOffset.x
      );

      scrollToPhysicalIndex(boundedIndex, true);
      recenterIfNeeded(boundedIndex);
    },
    [
      getPhysicalIndexFromOffset,
      recenterIfNeeded,
      scrollToPhysicalIndex
    ]
  );

  const handleScrollEndDrag = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      snapToNearestSlide(event.nativeEvent.contentOffset.x);

      if (dragReleaseTimeoutRef.current) {
        clearTimeout(dragReleaseTimeoutRef.current);
      }

      dragReleaseTimeoutRef.current = setTimeout(() => {
        isDraggingRef.current = false;
      }, 350);
    },
    [snapToNearestSlide]
  );

  const goToSlide = useCallback(
    (index: number) => {
      const currentRealIndex = getRealSlideIndex(physicalSlideRef.current);
      let delta = index - currentRealIndex;

      if (delta > slideCount / 2) {
        delta -= slideCount;
      }

      if (delta < -slideCount / 2) {
        delta += slideCount;
      }

      scrollToPhysicalIndex(physicalSlideRef.current + delta, true);
    },
    [scrollToPhysicalIndex]
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        animated: false,
        x: physicalSlideRef.current * pageWidth,
        y: 0
      });
    });
  }, [pageWidth]);

  useEffect(
    () => () => {
      if (dragReleaseTimeoutRef.current) {
        clearTimeout(dragReleaseTimeoutRef.current);
      }

      if (programmaticScrollTimeoutRef.current) {
        clearTimeout(programmaticScrollTimeoutRef.current);
      }
    },
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (isDraggingRef.current) {
        return;
      }

      const isNearEnd =
        physicalSlideRef.current >= carouselItems.length - slideCount - 1;

      if (isNearEnd) {
        const centeredIndex =
          centeredStartIndex + getRealSlideIndex(physicalSlideRef.current);
        setActiveFromPhysicalIndex(centeredIndex);
        scrollRef.current?.scrollTo({
          animated: false,
          x: centeredIndex * pageWidth,
          y: 0
        });

        requestAnimationFrame(() => {
          scrollToPhysicalIndex(centeredIndex + 1, true);
        });

        return;
      }

      scrollToPhysicalIndex(physicalSlideRef.current + 1, true);
    }, 4000);

    return () => clearInterval(interval);
  }, [carouselItems.length, scrollToPhysicalIndex, setActiveFromPhysicalIndex]);

  return (
    <View style={styles.screen}>
      <View style={styles.brandRow}>
        <Text style={styles.brand}>Stylus</Text>
      </View>

      <View style={styles.heroCarousel}>
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.heroTrack}
          decelerationRate="fast"
          disableIntervalMomentum
          horizontal
          onContentSizeChange={() => {
            scrollRef.current?.scrollTo({
              animated: false,
              x: physicalSlideRef.current * pageWidth,
              y: 0
            });
          }}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          onScroll={handleScroll}
          onScrollBeginDrag={() => {
            if (dragReleaseTimeoutRef.current) {
              clearTimeout(dragReleaseTimeoutRef.current);
            }

            isDraggingRef.current = true;
          }}
          onScrollEndDrag={handleScrollEndDrag}
          pagingEnabled
          ref={scrollRef}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          snapToInterval={pageWidth}
          style={styles.heroScroller}
        >
          {carouselItems.map((item) => (
            <View key={item.itemKey} style={[styles.heroPage, { width: pageWidth }]}>
              <View style={[styles.heroCard, { width: cardWidth }]}>
                <Image source={{ uri: item.image }} style={styles.heroImage} />
                <View style={styles.heroShade} />

                <View style={styles.heroCopy}>
                  <Text style={styles.kicker}>{item.kicker}</Text>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.subtitle}>{item.subtitle}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View
        accessibilityLabel={`Intro carousel slide ${activeSlide + 1} of ${splashBanners.length}`}
        style={styles.carouselDots}
      >
        {splashBanners.map((banner, index) => (
          <Pressable
            accessibilityLabel={`Go to intro slide ${index + 1}`}
            accessibilityRole="button"
            key={banner.id}
            onPress={() => goToSlide(index)}
            style={[
              styles.carouselDot,
              activeSlide === index ? styles.carouselDotActive : null
            ]}
          />
        ))}
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Get Started" onPress={onGetStarted} />
        <SecondaryButton label="Explore without signing in" onPress={onExplore} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 12,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.screen
  },
  brand: {
    color: colors.text,
    fontFamily: fonts.serif,
    fontSize: 28,
    lineHeight: 34
  },
  brandRow: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg
  },
  carouselDot: {
    backgroundColor: colors.border,
    borderRadius: radii.pill,
    height: 6,
    width: 6
  },
  carouselDotActive: {
    backgroundColor: colors.text,
    width: 18
  },
  carouselDots: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: -4
  },
  heroCard: {
    backgroundColor: colors.cream,
    borderRadius: radii.card,
    height: "100%",
    overflow: "hidden"
  },
  heroCarousel: {
    flex: 1,
    marginTop: spacing.lg
  },
  heroCopy: {
    bottom: 22,
    left: 16,
    position: "absolute",
    right: 16
  },
  heroImage: {
    height: "100%",
    resizeMode: "cover",
    width: "100%"
  },
  heroPage: {
    alignItems: "center",
    height: "100%"
  },
  heroScroller: {
    height: "100%"
  },
  heroShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.18)"
  },
  heroTrack: {
    height: "100%"
  },
  kicker: {
    color: colors.inverseText,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6
  },
  screen: {
    flex: 1,
    gap: 16,
    justifyContent: "space-between"
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.86)",
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    maxWidth: 310
  },
  title: {
    color: colors.inverseText,
    fontFamily: fonts.serifRegular,
    fontSize: 26,
    lineHeight: 32
  },
});
