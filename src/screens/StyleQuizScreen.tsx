import { useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  type ViewStyle,
  useWindowDimensions,
  View
} from "react-native";

import { CloseIcon } from "../components/CloseIcon";
import { HeartIcon } from "../components/HeartIcon";
import { OnboardingProgress } from "../components/OnboardingProgress";
import { TertiaryButton } from "../components/TertiaryButton";
import { styleCards } from "../data/styleQuiz";
import { colors, fonts, radii, spacing, typography } from "../theme";

type StyleQuizScreenProps = {
  onBack: () => void;
  onComplete: () => void;
  onSkip: () => void;
};

type StyleAnswer = {
  id: string;
  liked: boolean;
};

const webSwipeCardStyle =
  Platform.OS === "web"
    ? ({
        cursor: "grab",
        touchAction: "none",
        userSelect: "none"
      } as unknown as ViewStyle)
    : null;

export function StyleQuizScreen({ onComplete, onSkip }: StyleQuizScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<StyleAnswer[]>([]);
  const translateX = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();
  const currentCard = styleCards[currentIndex];
  const isComplete = currentIndex >= styleCards.length;

  const moveToNextCard = (liked: boolean) => {
    if (!currentCard) {
      return;
    }

    setAnswers((currentAnswers) => [
      ...currentAnswers,
      { id: currentCard.id, liked }
    ]);
    if (currentIndex === styleCards.length - 1) {
      translateX.setValue(0);
      onComplete();
      return;
    }

    setCurrentIndex((index) => index + 1);
    translateX.setValue(0);
  };

  const animateChoice = (liked: boolean) => {
    Animated.timing(translateX, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
      toValue: liked ? width : -width,
      useNativeDriver: true
    }).start(({ finished }) => {
      if (finished) {
        moveToNextCard(liked);
      }
    });
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) =>
      Math.abs(gestureState.dx) > 10 &&
      Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
    onMoveShouldSetPanResponderCapture: (_, gestureState) =>
      Math.abs(gestureState.dx) > 8 &&
      Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
    onPanResponderGrant: () => {
      translateX.stopAnimation();
    },
    onPanResponderMove: (_, gestureState) => {
      translateX.setValue(gestureState.dx);
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 70) {
        animateChoice(true);
        return;
      }

      if (gestureState.dx < -70) {
        animateChoice(false);
        return;
      }

      Animated.spring(translateX, {
        bounciness: 0,
        speed: 18,
        toValue: 0,
        useNativeDriver: true
      }).start();
    },
    onPanResponderTerminate: () => {
      Animated.spring(translateX, {
        bounciness: 0,
        speed: 18,
        toValue: 0,
        useNativeDriver: true
      }).start();
    }
  });

  const rotation = translateX.interpolate({
    inputRange: [-width, 0, width],
    outputRange: ["-5deg", "0deg", "5deg"]
  });

  return (
    <View style={styles.screen}>
      <View style={styles.headerSpacer} />

      <View style={styles.content}>
        <OnboardingProgress currentStep={4} totalSteps={5} />
        <Text style={styles.title}>
          {isComplete ? "Your style is taking shape" : "What’s your style?"}
        </Text>

        {isComplete ? (
          <View style={styles.completeCard}>
            <Text style={styles.completeTitle}>Style quiz complete</Text>
            <Text style={styles.completeCopy}>
              We’ll use your choices to shape your first looks.
            </Text>
          </View>
        ) : (
          <>
            <Animated.View
              {...panResponder.panHandlers}
              style={[
                styles.card,
                webSwipeCardStyle,
                {
                  transform: [{ translateX }, { rotate: rotation }]
                }
              ]}
            >
              <View pointerEvents="none" style={styles.cardLayer}>
                <Image source={{ uri: currentCard.image }} style={styles.image} />
                <View style={styles.shade} />

                <View style={styles.cardTop}>
                  <View style={styles.pill}>
                    <Text style={styles.pillText}>{currentCard.label}</Text>
                  </View>
                  <Text style={styles.count}>
                    {currentIndex + 1} of {styleCards.length}
                  </Text>
                </View>

                <View style={styles.cardCopy}>
                  <Text style={styles.cardTitle}>{currentCard.title}</Text>
                </View>
              </View>
            </Animated.View>

            <Text style={styles.helper}>Swipe or tap buttons below</Text>

            <View style={styles.actions}>
              <View style={styles.choiceWrap}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => animateChoice(false)}
                  style={({ pressed }) => [
                    styles.choiceButton,
                    pressed ? styles.pressed : null
                  ]}
                >
                  <CloseIcon />
                </Pressable>
                <Text style={styles.choiceLabel}>Not my style</Text>
              </View>

              <View style={styles.choiceWrap}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => animateChoice(true)}
                  style={({ pressed }) => [
                    styles.choiceButton,
                    styles.choiceButtonLiked,
                    pressed ? styles.pressed : null
                  ]}
                >
                  <HeartIcon />
                </Pressable>
                <Text style={styles.choiceLabel}>Loved it</Text>
              </View>
            </View>

            <View style={styles.skipButton}>
              <TertiaryButton
                label="Skip quiz"
                onPress={onSkip}
              />
              <Text style={styles.skipContext}> - I’ll set my style later</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    paddingHorizontal: 26
  },
  card: {
    backgroundColor: colors.cream,
    borderRadius: radii.card,
    height: 398,
    marginTop: 26,
    overflow: "hidden"
  },
  cardCopy: {
    bottom: 18,
    left: 16,
    position: "absolute",
    right: 16
  },
  cardLayer: {
    ...StyleSheet.absoluteFillObject
  },
  cardTitle: {
    color: colors.inverseText,
    fontFamily: fonts.serifRegular,
    fontSize: 26,
    lineHeight: 32
  },
  cardTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    left: 12,
    position: "absolute",
    right: 12,
    top: 12
  },
  choiceButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.text,
    borderRadius: 999,
    borderWidth: 1,
    height: 58,
    justifyContent: "center",
    width: 58
  },
  choiceButtonLiked: {
    backgroundColor: colors.inverse,
    borderColor: colors.inverse
  },
  choiceLabel: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 8
  },
  choiceWrap: {
    alignItems: "center"
  },
  completeCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: 1,
    marginTop: 28,
    padding: 18
  },
  completeCopy: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8
  },
  completeTitle: {
    color: colors.text,
    ...typography.cardTitle
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screen,
    paddingTop: 24
  },
  count: {
    color: colors.inverseText,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 16
  },
  helper: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 12,
    textAlign: "center"
  },
  image: {
    height: "100%",
    resizeMode: "cover",
    width: "100%"
  },
  headerSpacer: {
    height: 48
  },
  pill: {
    backgroundColor: "rgba(255, 255, 255, 0.88)",
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  pillText: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14
  },
  pressed: {
    opacity: 0.72
  },
  screen: {
    flex: 1
  },
  shade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.14)"
  },
  skipButton: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 34
  },
  skipContext: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20
  },
  title: {
    color: colors.text,
    marginTop: 28,
    ...typography.h2
  }
});
