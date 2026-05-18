import { OnboardingStepShell } from "../components/OnboardingStepShell";
import { HeightPicker } from "../components/HeightPicker";

type SetupHeightScreenProps = {
  height: {
    feet: number;
    inches: number;
  };
  onChangeHeight: (feet: number, inches: number) => void;
  onContinue: () => void;
};

export function SetupHeightScreen({
  height,
  onChangeHeight,
  onContinue
}: SetupHeightScreenProps) {
  return (
    <OnboardingStepShell
      currentStep={2}
      nextButton={{
        accessibilityLabel: "Continue to fashion interest setup",
        disabled: false,
        onPress: onContinue
      }}
      title="How tall are you?"
    >
      <HeightPicker
        feet={height.feet}
        inches={height.inches}
        onChangeHeight={onChangeHeight}
      />
    </OnboardingStepShell>
  );
}

