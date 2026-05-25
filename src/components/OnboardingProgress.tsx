import { StyleSheet, View } from "react-native";

import { colors, spacing } from "../theme";

type OnboardingProgressProps = {
  currentStep: number;
  totalSteps: number;
};

const dotSize = 8;

export function OnboardingProgress({
  currentStep,
  totalSteps
}: OnboardingProgressProps) {
  return (
    <View
      accessibilityLabel={`Step ${currentStep} of ${totalSteps}`}
      accessibilityRole="progressbar"
      style={styles.row}
    >
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        const isActive = step === currentStep;
        const isComplete = step < currentStep;

        return (
          <View
            key={index}
            style={[
              styles.dot,
              isComplete ? styles.completeDot : null,
              isActive ? styles.activeDot : null
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  activeDot: {
    backgroundColor: "transparent",
    borderColor: colors.text,
    borderWidth: 2
  },
  completeDot: {
    backgroundColor: colors.text
  },
  dot: {
    backgroundColor: colors.border,
    borderRadius: 999,
    height: dotSize,
    width: dotSize
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.lg,
    minHeight: dotSize
  }
});
