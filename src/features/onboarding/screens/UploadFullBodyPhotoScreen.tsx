import { StyleSheet, View } from "react-native";

import { PhotoUploadBox } from "../components/PhotoUploadBox";
import { OnboardingStepShell } from "../components/OnboardingStepShell";

type UploadFullBodyPhotoScreenProps = {
  onContinue: () => void;
  onSelectPhoto: (uri: string) => void;
  onSkip: () => void;
  photoUri?: string;
};

export function UploadFullBodyPhotoScreen({
  onContinue,
  onSelectPhoto,
  photoUri
}: UploadFullBodyPhotoScreenProps) {
  return (
    <OnboardingStepShell
      currentStep={5}
      nextButton={{
        accessibilityLabel: "Continue to avatar creation",
        disabled: !photoUri,
        onPress: onContinue
      }}
      subtitle="1 photo is all it takes. We build your style avatar so you can try on anything."
      title="See yourself in every look"
    >
      <View style={styles.body}>
        <PhotoUploadBox onSelectPhoto={onSelectPhoto} uri={photoUri} />
      </View>
    </OnboardingStepShell>
  );
}

const styles = StyleSheet.create({
  body: {
    zIndex: 2
  },
});
