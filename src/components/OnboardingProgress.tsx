import { StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { colors } from "../theme";

type OnboardingProgressProps = {
  currentStep: number;
  totalSteps: number;
};

function ActiveStepIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path
        d="M5.25 5V4.25C5.25 2.73 6.48 1.5 8 1.5C9.52 1.5 10.75 2.73 10.75 4.25V5"
        stroke={colors.text}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.4}
      />
      <Path
        d="M3.25 5H12.75L12.1 13.5H3.9L3.25 5Z"
        stroke={colors.text}
        strokeLinejoin="round"
        strokeWidth={1.4}
      />
    </Svg>
  );
}

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

        if (isActive) {
          return (
            <View key={index} style={styles.activeStep}>
              <ActiveStepIcon />
            </View>
          );
        }

        return (
          <View
            key={index}
            style={[styles.dot, isComplete ? styles.completeDot : null]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  activeStep: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.text,
    borderRadius: 999,
    borderWidth: 1.5,
    height: 34,
    justifyContent: "center",
    width: 34
  },
  completeDot: {
    backgroundColor: colors.text
  },
  dot: {
    backgroundColor: colors.border,
    borderRadius: 999,
    height: 4,
    width: 4
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    minHeight: 34
  }
});
