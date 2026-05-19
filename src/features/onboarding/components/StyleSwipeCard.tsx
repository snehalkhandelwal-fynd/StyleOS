import { LinearGradient } from "expo-linear-gradient";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef
} from "react";
import {
  Animated,
  Easing,
  ImageBackground,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import Svg, { Path } from "react-native-svg";

import type { StyleCard } from "../../../data/styleQuiz";
import { colors, fonts, radii, spacing } from "../../../theme";

export type StylePreference = "liked" | "rejected";

export type StyleSwipeCardHandle = {
  swipe: (preference: StylePreference) => void;
};

type StyleSwipeCardProps = {
  card: StyleCard;
  cardHeight: number;
  cardNumber: number;
  cardWidth: number;
  nextCards: StyleCard[];
  onPreference: (preference: StylePreference) => void;
  totalCards: number;
};

type StyleSwipeActionsProps = {
  onPreference: (preference: StylePreference) => void;
};

const swipeThreshold = 80;
const swipeExitDistance = 520;
const cardRadius = 20;
const deckStackOffset = 24;

function XIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18M6 6L18 18"
        stroke={colors.text}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
      />
    </Svg>
  );
}

function HeartIcon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20.84 4.61C20.3292 4.099 19.7228 3.69365 19.0554 3.41699C18.3879 3.14033 17.6725 2.9978 16.95 2.9978C16.2275 2.9978 15.5121 3.14033 14.8446 3.41699C14.1772 3.69365 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.90831 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.033 10.6054C22.3097 9.93789 22.4522 9.22248 22.4522 8.5C22.4522 7.77752 22.3097 7.0621 22.033 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z"
        stroke={colors.inverseText}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </Svg>
  );
}

function DeckCard({
  card,
  cardHeight,
  cardWidth,
  index
}: {
  card: StyleCard;
  cardHeight: number;
  cardWidth: number;
  index: 1 | 2;
}) {
  return (
    <View
      pointerEvents="none"
      style={[
        styles.deckCard,
        {
          height: cardHeight,
          opacity: index === 1 ? 0.75 : 0.45,
          top: deckStackOffset,
          transform: [
            { translateY: index === 1 ? -12 : -deckStackOffset },
            { scale: index === 1 ? 0.96 : 0.92 }
          ],
          width: cardWidth,
          zIndex: index === 1 ? 2 : 1
        }
      ]}
    >
      <ImageBackground
        imageStyle={styles.cardImage}
        resizeMode="cover"
        source={{ uri: card.image }}
        style={styles.imageBackground}
      />
    </View>
  );
}

export const StyleSwipeCard = forwardRef<
  StyleSwipeCardHandle,
  StyleSwipeCardProps
>(function StyleSwipeCard(
  {
    card,
    cardHeight,
    cardNumber,
    cardWidth,
    nextCards,
    onPreference,
    totalCards
  },
  ref
) {
  const dragX = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;
  const isAnimatingAway = useRef(false);

  useEffect(() => {
    dragX.setValue(0);
    cardScale.setValue(0.98);
    isAnimatingAway.current = false;
    Animated.timing(cardScale, {
      duration: 180,
      easing: Easing.out(Easing.cubic),
      toValue: 1,
      useNativeDriver: true
    }).start();
  }, [card.id, cardScale, dragX]);

  const resetCard = useCallback(() => {
    Animated.spring(dragX, {
      damping: 20,
      mass: 0.7,
      stiffness: 190,
      toValue: 0,
      useNativeDriver: true
    }).start();
  }, [dragX]);

  const commitPreference = useCallback(
    (preference: StylePreference) => {
      if (isAnimatingAway.current) {
        return;
      }

      isAnimatingAway.current = true;
      const direction = preference === "liked" ? 1 : -1;

      Animated.timing(dragX, {
        duration: 190,
        easing: Easing.out(Easing.cubic),
        toValue: direction * swipeExitDistance,
        useNativeDriver: true
      }).start(({ finished }) => {
        if (finished) {
          onPreference(preference);
        }
      });
    },
    [dragX, onPreference]
  );

  useImperativeHandle(
    ref,
    () => ({
      swipe: commitPreference
    }),
    [commitPreference]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponderCapture: (_, gesture) =>
          Math.abs(gesture.dx) > Math.abs(gesture.dy) &&
          Math.abs(gesture.dx) > 4,
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > Math.abs(gesture.dy) &&
          Math.abs(gesture.dx) > 4,
        onPanResponderGrant: () => {
          dragX.stopAnimation();
        },
        onPanResponderMove: (_, gesture) => {
          dragX.setValue(gesture.dx);
        },
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx >= swipeThreshold) {
            commitPreference("liked");
            return;
          }

          if (gesture.dx <= -swipeThreshold) {
            commitPreference("rejected");
            return;
          }

          resetCard();
        },
        onPanResponderTerminate: resetCard,
        onPanResponderTerminationRequest: () => false,
        onShouldBlockNativeResponder: () => true
      }),
    [commitPreference, dragX, resetCard]
  );

  const cardRotation = dragX.interpolate({
    inputRange: [-swipeExitDistance, 0, swipeExitDistance],
    outputRange: ["-8deg", "0deg", "8deg"]
  });

  return (
    <View
      style={[
        styles.deck,
        {
          height: cardHeight + 24,
          width: cardWidth
        }
      ]}
    >
      {nextCards.slice(0, 2).map((nextCard, index) => (
        <DeckCard
          card={nextCard}
          cardHeight={cardHeight}
          cardWidth={cardWidth}
          index={(index + 1) as 1 | 2}
          key={nextCard.id}
        />
      ))}

      <Animated.View
        renderToHardwareTextureAndroid
        shouldRasterizeIOS
        style={[
          styles.currentCard,
          {
            height: cardHeight,
            top: deckStackOffset,
            transform: [
              { translateX: dragX },
              { rotate: cardRotation },
              { scale: cardScale }
            ],
            width: cardWidth,
            zIndex: 3
          }
        ]}
        {...panResponder.panHandlers}
      >
        <ImageBackground
          imageStyle={styles.cardImage}
          resizeMode="cover"
          source={{ uri: card.image }}
          style={styles.imageBackground}
        >
          <View style={styles.topRow}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>{card.label}</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>
                {cardNumber}/{totalCards}
              </Text>
            </View>
          </View>

          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.42)"]}
            pointerEvents="none"
            style={styles.bottomGradient}
          />
        </ImageBackground>
      </Animated.View>
    </View>
  );
});

export function StyleSwipeActions({ onPreference }: StyleSwipeActionsProps) {
  return (
    <View style={styles.actions}>
      <Pressable
        accessibilityLabel="Not my style"
        accessibilityRole="button"
        onPress={() => onPreference("rejected")}
        style={({ pressed }) => [
          styles.actionItem,
          pressed ? styles.pressed : null
        ]}
      >
        <View style={[styles.actionCircle, styles.rejectCircle]}>
          <XIcon />
        </View>
        <Text style={styles.actionLabel}>Not my style</Text>
      </Pressable>
      <Pressable
        accessibilityLabel="Loved it"
        accessibilityRole="button"
        onPress={() => onPreference("liked")}
        style={({ pressed }) => [
          styles.actionItem,
          pressed ? styles.pressed : null
        ]}
      >
        <View style={[styles.actionCircle, styles.loveCircle]}>
          <HeartIcon />
        </View>
        <Text style={styles.actionLabel}>Loved it</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },
  actionCircle: {
    alignItems: "center",
    borderRadius: radii.pill,
    height: 55,
    justifyContent: "center",
    width: 55
  },
  actionItem: {
    alignItems: "center",
    gap: spacing.sm,
    justifyContent: "center",
    width: 120
  },
  actionLabel: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 16,
    includeFontPadding: false,
    lineHeight: 22
  },
  bottomGradient: {
    bottom: 0,
    height: "30%",
    left: 0,
    position: "absolute",
    right: 0
  },
  cardImage: {
    borderRadius: cardRadius
  },
  chip: {
    backgroundColor: colors.surfaceTranslucent,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6
  },
  chipText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 15
  },
  currentCard: {
    backgroundColor: colors.imageSurface,
    borderRadius: cardRadius,
    elevation: 3,
    overflow: "hidden",
    position: "absolute",
    shadowColor: "#000000",
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    top: 0
  },
  deck: {
    alignItems: "center",
    justifyContent: "flex-start",
    overflow: "hidden"
  },
  deckCard: {
    backgroundColor: colors.imageSurface,
    borderRadius: cardRadius,
    overflow: "hidden",
    position: "absolute",
    top: 0
  },
  imageBackground: {
    flex: 1,
    justifyContent: "flex-start",
    overflow: "hidden",
    padding: spacing.lg
  },
  loveCircle: {
    backgroundColor: colors.text
  },
  pressed: {
    opacity: 0.74
  },
  rejectCircle: {
    backgroundColor: colors.background,
    borderColor: colors.text,
    borderWidth: 1
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  }
});
