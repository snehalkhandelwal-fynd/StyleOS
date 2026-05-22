import { StyleSheet, View } from "react-native";

import { PhotoUploadBox } from "../components/PhotoUploadBox";
import {
  OnboardingStepShell,
  type OnboardingStepPresentation
} from "../components/OnboardingStepShell";

type UploadFullBodyPhotoScreenProps = {
  onContinue: () => void;
  onSelectPhoto: (uri: string) => void;
  onSkip: () => void;
  photoUri?: string;
  presentation?: OnboardingStepPresentation;
};

export function UploadFullBodyPhotoScreen({
  onContinue,
  onSelectPhoto,
  photoUri,
  presentation = "screen"
}: UploadFullBodyPhotoScreenProps) {
  const totalSteps = presentation === "drawer" ? 5 : 4;
  const isDrawer = presentation === "drawer";

  return (
    <OnboardingStepShell
      currentStep={4}
      presentation={presentation}
      nextButton={{
        accessibilityLabel: "Continue to avatar creation",
        disabled: !photoUri,
        onPress: onContinue
      }}
      subtitle="1 photo is all it takes. We build your style avatar so you can try on anything."
      title="See yourself in every look"
      totalSteps={totalSteps}
    >
      <View style={styles.body}>
        <PhotoUploadBox
          onSelectPhoto={onSelectPhoto}
          uri={photoUri}
          variant={isDrawer ? "drawer" : "default"}
        />
      </View>
    </OnboardingStepShell>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingBottom: 96,
    zIndex: 2
  }
});
