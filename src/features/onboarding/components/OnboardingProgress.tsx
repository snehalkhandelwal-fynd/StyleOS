import { OnboardingProgress as SharedOnboardingProgress } from "../../../components/OnboardingProgress";

type OnboardingProgressProps = {
  currentStep: number;
  totalSteps?: number;
};

export function OnboardingProgress({
  currentStep,
  totalSteps = 5
}: OnboardingProgressProps) {
  return (
    <SharedOnboardingProgress
      currentStep={currentStep}
      totalSteps={totalSteps}
    />
  );
}
