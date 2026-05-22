import { useMemo, useRef, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";
import Svg, { Path } from "react-native-svg";

import { PrimaryButton } from "../../../components/PrimaryButton";
import { getStyleCardsForFashionInterest } from "../../../data/styleQuiz";
import { colors, fonts, radii, spacing, typography } from "../../../theme";
import { OnboardingStepShell } from "../components/OnboardingStepShell";
import {
  StyleSwipeActions,
  StyleSwipeCard,
  type StylePreference,
  type StyleSwipeCardHandle
} from "../components/StyleSwipeCard";
import type { FashionInterest } from "../viewModels/useOnboardingViewModel";

type SetupStyleQuizScreenProps = {
  fashionInterest?: FashionInterest;
  onComplete: () => void;
  onPreference: (styleId: string, preference: StylePreference) => void;
  onRetake: () => void;
  onSkip: () => void;
};

type StyleQuizAnswer = {
  preference: StylePreference;
  styleId: string;
};

const resultChipColors = [
  {
    backgroundColor: "#F5F2EC",
    borderColor: "#D9D4CA"
  },
  {
    backgroundColor: "#F4E9DF",
    borderColor: "#DFCBBE"
  },
  {
    backgroundColor: "#EEF1F7",
    borderColor: "#D5DAE8"
  }
] as const;

const resultMoodByStyleId: Record<string, string> = {
  athleisure: "Everyday ease",
  bohemian: "Textured layers",
  classic: "Work ready",
  minimalist: "Clean polish",
  romantic: "Soft details",
  streetwear: "Street edge"
};

function SparklesIcon() {
  return (
    <Svg width={34} height={34} viewBox="0 0 34 34" fill="none">
      <Path
        d="M16.2 6.5L18.9 13.1L25.5 15.8L18.9 18.5L16.2 25.1L13.5 18.5L6.9 15.8L13.5 13.1L16.2 6.5Z"
        stroke={colors.text}
        strokeLinejoin="round"
        strokeWidth={2.4}
      />
      <Path
        d="M25.7 5.3L26.8 8L29.5 9.1L26.8 10.2L25.7 12.9L24.6 10.2L21.9 9.1L24.6 8L25.7 5.3Z"
        fill={colors.text}
      />
      <Path
        d="M25.7 21.1L26.8 23.8L29.5 24.9L26.8 26L25.7 28.7L24.6 26L21.9 24.9L24.6 23.8L25.7 21.1Z"
        fill={colors.text}
      />
    </Svg>
  );
}

function getResultLabels(
  answers: StyleQuizAnswer[],
  visibleCards: ReturnType<typeof getStyleCardsForFashionInterest>
) {
  const likedIds = answers
    .filter((answer) => answer.preference === "liked")
    .map((answer) => answer.styleId);
  const likedLabels = visibleCards
    .filter((card) => likedIds.includes(card.id))
    .map((card) => card.label);
  const firstLikedMood = likedIds
    .map((styleId) => resultMoodByStyleId[styleId])
    .find(Boolean);
  const labels = [
    ...likedLabels.slice(0, 2),
    firstLikedMood,
    "Fresh looks",
    "Try-on ready",
    "Easy styling"
  ];

  return Array.from(
    new Set(labels.filter((label): label is string => Boolean(label)))
  ).slice(0, 3);
}

export function SetupStyleQuizScreen({
  fashionInterest,
  onComplete,
  onPreference,
  onRetake,
  onSkip
}: SetupStyleQuizScreenProps) {
  const { height, width } = useWindowDimensions();
  const deckRef = useRef<StyleSwipeCardHandle | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<StyleQuizAnswer[]>([]);
  const [isDecoded, setIsDecoded] = useState(false);
  const visibleCards = useMemo(
    () => getStyleCardsForFashionInterest(fashionInterest).slice(0, 5),
    [fashionInterest]
  );
  const currentCard = visibleCards[currentIndex];
  const nextCards = visibleCards.slice(currentIndex + 1, currentIndex + 3);
  const cardWidth = width - 40;
  const cardHeight = Math.min(height * 0.48, 440);

  const handlePreference = (preference: StylePreference) => {
    if (!currentCard) {
      onComplete();
      return;
    }

    onPreference(currentCard.id, preference);
    setAnswers((currentAnswers) => [
      ...currentAnswers.filter((answer) => answer.styleId !== currentCard.id),
      {
        preference,
        styleId: currentCard.id
      }
    ]);

    if (currentIndex >= visibleCards.length - 1) {
      setIsDecoded(true);
      return;
    }

    setCurrentIndex((index) => index + 1);
  };

  const handleActionPreference = (preference: StylePreference) => {
    if (!currentCard) {
      onComplete();
      return;
    }

    deckRef.current?.swipe(preference);
  };

  const handleSkip = () => {
    onSkip();
    onComplete();
  };

  const handleRetake = () => {
    onRetake();
    setAnswers([]);
    setCurrentIndex(0);
    setIsDecoded(false);
  };

  if (isDecoded) {
    const resultLabels = getResultLabels(answers, visibleCards);

    return (
      <SafeAreaView style={styles.resultScreen}>
        <View style={styles.resultContent}>
          <View style={styles.resultIconWrap}>
            <SparklesIcon />
          </View>

          <View style={styles.resultCopyGroup}>
            <Text style={styles.resultTitle}>Your style, decoded</Text>
            <Text style={styles.resultSubtitle}>
              Based on your swipes, here’s what speaks to you
            </Text>
          </View>

          <View style={styles.resultChipWrap}>
            {resultLabels.map((label, index) => {
              const color = resultChipColors[index % resultChipColors.length];

              return (
                <View
                  key={label}
                  style={[
                    styles.resultChip,
                    {
                      backgroundColor: color.backgroundColor,
                      borderColor: color.borderColor
                    }
                  ]}
                >
                  <Text style={styles.resultChipText}>{label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.resultActions}>
          <PrimaryButton
            label="Check the feed out"
            onPress={onComplete}
          />
          <Pressable
            accessibilityRole="button"
            hitSlop={10}
            onPress={handleRetake}
            style={({ pressed }) => [
              styles.tertiaryAction,
              pressed ? styles.pressed : null
            ]}
          >
            <Text style={styles.tertiaryActionText}>Retake the quiz</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <OnboardingStepShell
      currentStep={4}
      subtitle="Swipe 5 looks. We'll learn your taste."
      title="What’s your style?"
    >
      <View style={styles.content}>
        <View style={styles.deckSection}>
          {currentCard ? (
            <StyleSwipeCard
              card={currentCard}
              cardHeight={cardHeight}
              cardNumber={currentIndex + 1}
              cardWidth={cardWidth}
              key={currentCard.id}
              nextCards={nextCards}
              onPreference={handlePreference}
              ref={deckRef}
              totalCards={visibleCards.length}
            />
          ) : null}
        </View>

        <View style={styles.actionsSection}>
          <StyleSwipeActions onPreference={handleActionPreference} />
        </View>

        <View style={styles.skipRow}>
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            onPress={handleSkip}
          >
            <Text style={styles.skipLink}>Skip quiz</Text>
          </Pressable>
          <Text style={styles.skipCopy}>I’ll set my style later</Text>
        </View>
      </View>
    </OnboardingStepShell>
  );
}

const styles = StyleSheet.create({
  actionsSection: {
    marginTop: spacing.lg,
    paddingHorizontal: 20
  },
  content: {
    flex: 1,
    paddingTop: spacing.xl
  },
  deckSection: {
    alignItems: "center",
    minHeight: 0
  },
  pressed: {
    opacity: 0.72
  },
  resultActions: {
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.screen,
    width: "100%"
  },
  resultChip: {
    alignItems: "center",
    borderRadius: radii.pill,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 42,
    minWidth: 126,
    paddingHorizontal: spacing.lg
  },
  resultChipText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    includeFontPadding: false,
    lineHeight: 20
  },
  resultChipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    justifyContent: "center",
    marginTop: spacing.lg,
    maxWidth: 330
  },
  resultContent: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xxl
  },
  resultCopyGroup: {
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.xxl
  },
  resultIconWrap: {
    alignItems: "center",
    backgroundColor: colors.surfaceTertiary,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    height: 112,
    justifyContent: "center",
    width: 112
  },
  resultScreen: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "space-between"
  },
  resultSubtitle: {
    color: colors.muted,
    maxWidth: 318,
    textAlign: "center",
    ...typography.bodyLarge,
    fontSize: 18,
    lineHeight: 25
  },
  resultTitle: {
    color: colors.text,
    textAlign: "center",
    ...typography.displayHeadline,
    fontSize: 34,
    lineHeight: 40
  },
  skipCopy: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22
  },
  skipLink: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    lineHeight: 22,
    textDecorationLine: "underline"
  },
  skipRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
    marginTop: spacing.xl
  },
  tertiaryAction: {
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs
  },
  tertiaryActionText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
    textDecorationLine: "underline"
  }
});
