import type { OnboardingDraft } from "../../onboarding/viewModels/useOnboardingViewModel";

const genericCardLabels = ["Popular", "Trending", "Work-ready", "New", "Try now"];
const minimumStyleInputsForPersonalization = 5;

export function hasCompletedStyleProfile(draft: OnboardingDraft) {
  const quiz = draft.styleQuiz;

  if (!quiz || quiz.skipped) {
    return false;
  }

  const answeredCount =
    quiz.likedStyleIds.length + quiz.rejectedStyleIds.length;

  return answeredCount >= minimumStyleInputsForPersonalization;
}

export function getMerchandisingLabel({
  fallbackIndex,
  hasStyleProfile,
  personalizedLabel
}: {
  fallbackIndex: number;
  hasStyleProfile: boolean;
  personalizedLabel: string;
}) {
  if (hasStyleProfile) {
    return personalizedLabel;
  }

  return genericCardLabels[fallbackIndex % genericCardLabels.length];
}
