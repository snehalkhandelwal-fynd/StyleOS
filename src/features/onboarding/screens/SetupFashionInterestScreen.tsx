import { StyleSheet, View } from "react-native";

import { prototypeProductImages } from "../../home/data/prototypeProductImages";
import { spacing } from "../../../theme";
import { FashionInterestCard } from "../components/FashionInterestCard";
import {
  OnboardingStepShell,
  type OnboardingStepPresentation
} from "../components/OnboardingStepShell";
import type { FashionInterest } from "../viewModels/useOnboardingViewModel";

type SetupFashionInterestScreenProps = {
  interest?: FashionInterest;
  onChangeInterest: (interest: FashionInterest) => void;
  onContinue: () => void;
  presentation?: OnboardingStepPresentation;
};

const interestOptions = [
  {
    image: prototypeProductImages.maje.pinkRelaxedSet,
    label: "Women’s clothing",
    value: "womens"
  },
  {
    image: prototypeProductImages.men.tailoredLook,
    label: "Men’s clothing",
    value: "mens"
  }
] as const;

export function SetupFashionInterestScreen({
  interest,
  onChangeInterest,
  onContinue,
  presentation = "screen"
}: SetupFashionInterestScreenProps) {
  const totalSteps = presentation === "drawer" ? 5 : 4;

  return (
    <OnboardingStepShell
      currentStep={3}
      presentation={presentation}
      nextButton={{
        accessibilityLabel: "Continue to photo setup",
        disabled: !interest,
        onPress: onContinue
      }}
      subtitle="You can change this later"
      title="What do you want to explore?"
      totalSteps={totalSteps}
    >
      <View style={styles.body}>
        <View style={styles.cards}>
          {interestOptions.map((option) => (
            <FashionInterestCard
              image={option.image}
              isSelected={interest === option.value}
              key={option.value}
              label={option.label}
              onPress={() => onChangeInterest(option.value)}
            />
          ))}
        </View>
      </View>
    </OnboardingStepShell>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingTop: 0
  },
  cards: {
    flexDirection: "row",
    gap: spacing.lg,
    paddingTop: spacing.xl
  }
});
