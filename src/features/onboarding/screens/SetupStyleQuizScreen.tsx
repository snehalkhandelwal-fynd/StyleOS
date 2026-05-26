import { useMemo, useRef, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";

import { PrimaryButton } from "../../../components/PrimaryButton";
import {
  getStyleCardsForFashionInterest,
  type StyleCard
} from "../../../data/styleQuiz";
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

type ResultStackCardPlacement = {
  overlayOpacity: number;
  rotate: string;
  zIndex: number;
};

type ResultCopy = {
  subtitle: string;
  title: string;
};

type ResultStackCard = {
  card: StyleCard;
};

const resultStackPlacements: ResultStackCardPlacement[] = [
  {
    overlayOpacity: 0,
    rotate: "4deg",
    zIndex: 3
  },
  {
    overlayOpacity: 0.1,
    rotate: "-1deg",
    zIndex: 2
  },
  {
    overlayOpacity: 0.2,
    rotate: "-5deg",
    zIndex: 1
  }
];

function getResultLabels(
  answers: StyleQuizAnswer[],
  visibleCards: ReturnType<typeof getStyleCardsForFashionInterest>
) {
  const likedIds = answers
    .filter((answer) => answer.preference === "liked")
    .map((answer) => answer.styleId);

  return visibleCards
    .filter((card) => likedIds.includes(card.id))
    .map((card) => card.label);
}

function getResultCopy(likedCount: number): ResultCopy {
  if (likedCount === 0) {
    return {
      title: "Your style is still open",
      subtitle: "We’ll start broad and keep learning from what you try on"
    };
  }

  if (likedCount === 1) {
    return {
      title: "Your style, decoded",
      subtitle: "Based on your swipe, this style stood out"
    };
  }

  return {
    title: "Your style, decoded",
    subtitle: "Based on your swipes, these styles stood out"
  };
}

function getResultCards(
  answers: StyleQuizAnswer[],
  visibleCards: StyleCard[]
): ResultStackCard[] {
  const cardById = new Map(visibleCards.map((card) => [card.id, card]));
  const likedIds = answers
    .filter((answer) => answer.preference === "liked")
    .map((answer) => answer.styleId);
  const fallbackIds =
    likedIds.length > 0 ? [] : visibleCards.map((card) => card.id);
  const orderedIds = Array.from(new Set([...likedIds, ...fallbackIds]));

  return orderedIds
    .map((styleId) => cardById.get(styleId))
    .filter((card): card is StyleCard => Boolean(card))
    .slice(0, 3)
    .map((card) => ({ card }));
}

function ResultProductStack({
  cardHeight,
  cardWidth,
  cards,
  deckWidth
}: {
  cardHeight: number;
  cardWidth: number;
  cards: ResultStackCard[];
  deckWidth: number;
}) {
  const centerLeft = Math.round((deckWidth - cardWidth) / 2);
  const sideOffset = spacing.lg;
  const frontLeft = cards.length === 1 ? centerLeft : centerLeft + sideOffset;
  const middleLeft = centerLeft;
  const backLeft = centerLeft - sideOffset;
  const frontTop = Math.round(cardHeight * (cards.length === 1 ? 0.1 : 0.15));
  const middleTop = Math.round(cardHeight * 0.08);
  const backTop = Math.round(cardHeight * 0.13);

  const cardPositions = [
    {
      left: frontLeft,
      top: frontTop
    },
    {
      left: middleLeft,
      top: middleTop
    },
    {
      left: backLeft,
      top: backTop
    }
  ];

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel="Product cards based on your style swipes"
      style={[
        styles.resultStack,
        {
          height: cardHeight + Math.round(cardHeight * 0.24),
          width: deckWidth
        }
      ]}
    >
      {[2, 1, 0].map((cardIndex) => {
        const resultCard = cards[cardIndex];

        if (!resultCard) {
          return null;
        }

        const { card } = resultCard;
        const placement = resultStackPlacements[cardIndex];
        const position = cardPositions[cardIndex];

        return (
          <View
            key={card.id}
            pointerEvents="none"
            style={[
              styles.resultProductCard,
              {
                height: cardHeight,
                left: position.left,
                top: position.top,
                transform: [{ rotate: placement.rotate }],
                width: cardWidth,
                zIndex: placement.zIndex
              }
            ]}
          >
            <Image
              resizeMode="cover"
              source={{ uri: card.image }}
              style={styles.resultProductImage}
            />
            {placement.overlayOpacity > 0 ? (
              <View
                pointerEvents="none"
                style={[
                  styles.resultCardOverlay,
                  { opacity: placement.overlayOpacity }
                ]}
              />
            ) : null}
          </View>
        );
      })}
    </View>
  );
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
  const cardWidth = Math.min(width - spacing.xxl * 2, 328);
  const cardHeight = Math.min(height * 0.56, cardWidth * 1.5, 500);

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
    const resultCopy = getResultCopy(resultLabels.length);
    const resultCards = getResultCards(answers, visibleCards);
    const resultCardWidth = Math.min(width * 0.58, 238);
    const resultCardHeight = Math.min(
      resultCardWidth * 1.34,
      Math.max(226, height * 0.34)
    );
    const resultDeckWidth = Math.min(
      width - spacing.screen * 2,
      resultCardWidth + 92
    );

    return (
      <SafeAreaView style={styles.resultScreen}>
        <View style={styles.resultContent}>
          <View style={styles.resultCopyGroup}>
            <Text style={styles.resultTitle}>{resultCopy.title}</Text>
            <Text style={styles.resultSubtitle}>{resultCopy.subtitle}</Text>
          </View>

          {resultLabels.length > 0 ? (
            <View style={styles.resultChipWrap}>
              {resultLabels.map((label) => (
                <View key={label} style={styles.resultChip}>
                  <Text style={styles.resultChipText}>{label}</Text>
                </View>
              ))}
            </View>
          ) : null}

          <ResultProductStack
            cardHeight={resultCardHeight}
            cardWidth={resultCardWidth}
            cards={resultCards}
            deckWidth={resultDeckWidth}
          />
        </View>

        <View style={styles.resultActions}>
          <PrimaryButton
            label="Check the feed out"
            onPress={onComplete}
            style={styles.resultPrimaryButton}
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
    marginTop: spacing.md,
    paddingHorizontal: 20
  },
  content: {
    flex: 1,
    paddingTop: spacing.xs
  },
  deckSection: {
    alignItems: "center",
    minHeight: 0
  },
  pressed: {
    opacity: 0.72
  },
  resultActions: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.screen,
    width: "100%"
  },
  resultChip: {
    alignItems: "center",
    backgroundColor: "#F5F2EC",
    borderColor: "#D9D4CA",
    borderRadius: radii.pill,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 34,
    paddingHorizontal: spacing.md
  },
  resultChipText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    includeFontPadding: false,
    lineHeight: 17
  },
  resultChipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    justifyContent: "center",
    marginTop: spacing.lg,
    maxWidth: 344
  },
  resultContent: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    minHeight: 0,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xl
  },
  resultCopyGroup: {
    alignItems: "center",
    gap: spacing.sm,
    maxWidth: 330
  },
  resultCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.text
  },
  resultPrimaryButton: {
    height: 56
  },
  resultProductCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    elevation: 3,
    overflow: "hidden",
    position: "absolute",
    shadowColor: "#000000",
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.09,
    shadowRadius: 18
  },
  resultProductImage: {
    height: "100%",
    width: "100%"
  },
  resultScreen: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "space-between"
  },
  resultStack: {
    marginTop: spacing.xl,
    overflow: "visible"
  },
  resultSubtitle: {
    color: colors.muted,
    maxWidth: 310,
    textAlign: "center",
    ...typography.bodyLarge
  },
  resultTitle: {
    color: colors.text,
    textAlign: "center",
    ...typography.displayHeadline,
    fontSize: 22,
    lineHeight: 27.5
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
    marginTop: spacing.lg
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
