import { useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  Pressable,
  useWindowDimensions,
  View
} from "react-native";

import { styleCards } from "../../../data/styleQuiz";
import { colors, fonts, spacing } from "../../../theme";
import { OnboardingStepShell } from "../components/OnboardingStepShell";
import {
  StyleSwipeActions,
  StyleSwipeCard,
  type StylePreference,
  type StyleSwipeCardHandle
} from "../components/StyleSwipeCard";

type SetupStyleQuizScreenProps = {
  onComplete: () => void;
  onPreference: (styleId: string, preference: StylePreference) => void;
  onSkip: () => void;
};

export function SetupStyleQuizScreen({
  onComplete,
  onPreference,
  onSkip
}: SetupStyleQuizScreenProps) {
  const { height, width } = useWindowDimensions();
  const deckRef = useRef<StyleSwipeCardHandle | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCards = useMemo(() => styleCards.slice(0, 6), []);
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

    if (currentIndex >= visibleCards.length - 1) {
      onComplete();
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

  return (
    <OnboardingStepShell
      currentStep={4}
      subtitle="Swipe on 6 looks. We'll learn your taste."
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
  }
});
