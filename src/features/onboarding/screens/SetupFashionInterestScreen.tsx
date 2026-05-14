import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "../../../theme";
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
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    label: "Women’s clothing",
    value: "womens"
  },
  {
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
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
      title="What do you want to explore?"
    >
      <View style={styles.body}>
        <Text style={styles.reassurance}>You can change this later</Text>
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
  },
  reassurance: {
    color: colors.soft,
    textAlign: "left",
    ...typography.caption
  }
});
