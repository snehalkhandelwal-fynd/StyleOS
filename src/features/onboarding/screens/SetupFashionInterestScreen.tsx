import { StyleSheet, View } from "react-native";

import { prototypeProductImages } from "../../home/data/prototypeProductImages";
import { spacing } from "../../../theme";
import { FashionInterestCard } from "../components/FashionInterestCard";
import { OnboardingStepShell } from "../components/OnboardingStepShell";
import type { FashionInterest } from "../viewModels/useOnboardingViewModel";

type SetupFashionInterestScreenProps = {
  interest?: FashionInterest;
  onChangeInterest: (interest: FashionInterest) => void;
  onContinue: () => void;
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
  onContinue
}: SetupFashionInterestScreenProps) {
  return (
    <OnboardingStepShell
      currentStep={3}
      nextButton={{
        accessibilityLabel: "Continue to style quiz",
        disabled: !interest,
        onPress: onContinue
      }}
      subtitle="You can change this later"
      title="What do you want to explore?"
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
    paddingTop: spacing.sm
  },
  cards: {
    flexDirection: "row",
    gap: spacing.lg,
    paddingTop: spacing.xl
  }
});
