import { StyleSheet, View } from "react-native";

import { colors, radii, spacing } from "../../../theme";

type OnboardingProgressProps = {
  currentStep: 1 | 2 | 3 | 4 | 5;
};

const steps = [1, 2, 3, 4, 5] as const;

export function OnboardingProgress({ currentStep }: OnboardingProgressProps) {
  return (
    <View accessibilityRole="progressbar" style={styles.track}>
      {steps.map((step) => (
        <View
          key={step}
          style={[styles.segment, step <= currentStep ? styles.active : null]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  active: {
    backgroundColor: colors.text
  },
  segment: {
    backgroundColor: colors.border,
    borderRadius: radii.pill,
    flex: 1,
    height: 3
  },
  track: {
    flexDirection: "row",
    gap: spacing.xs
  }
});

