import { StyleSheet, View } from "react-native";

import { spacing } from "../../../theme";
import { OnboardingStepShell } from "../components/OnboardingStepShell";
import { HeightPicker } from "../components/HeightPicker";
import type { OnboardingStepPresentation } from "../components/OnboardingStepShell";

type SetupHeightScreenProps = {
  height: {
    feet: number;
    inches: number;
  };
  onChangeHeight: (feet: number, inches: number) => void;
  onContinue: () => void;
  presentation?: OnboardingStepPresentation;
};

export function SetupHeightScreen({
  height,
  onChangeHeight,
  onContinue,
  presentation = "screen"
}: SetupHeightScreenProps) {
  const totalSteps = 4;

  return (
    <OnboardingStepShell
      currentStep={2}
      drawerCtaTopSpacing={presentation === "drawer" ? 0 : undefined}
      presentation={presentation}
      nextButton={{
        accessibilityLabel: "Continue to fashion interest setup",
        disabled: false,
        onPress: onContinue
      }}
      title={
        presentation === "drawer"
          ? "How tall are you?"
          : "Tell us about yourself"
      }
      totalSteps={totalSteps}
    >
      <View
        style={[
          styles.body,
          presentation === "drawer" ? styles.drawerBody : null
        ]}
      >
        <HeightPicker
          feet={height.feet}
          inches={height.inches}
          onChangeHeight={onChangeHeight}
          variant={presentation === "drawer" ? "compact" : "default"}
        />
      </View>
    </OnboardingStepShell>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: spacing.xl,
    paddingBottom: 96
  },
  drawerBody: {
    gap: spacing.xl,
    paddingBottom: 0
  }
});
