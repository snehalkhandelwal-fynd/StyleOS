import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "../../../theme";
import { AvatarImageFrame } from "../components/AvatarImageFrame";
import { OnboardingStepShell } from "../components/OnboardingStepShell";

type AvatarCreatingScreenProps = {
  onComplete: (avatarUri: string) => void;
  photoUri?: string;
};

const fallbackAvatar =
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80";
const twoLineSubtitleOffset = 21;

export function AvatarCreatingScreen({
  onComplete,
  photoUri
}: AvatarCreatingScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(photoUri ?? fallbackAvatar);
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete, photoUri]);

  return (
    <OnboardingStepShell
      subtitle="This may take up to 30 seconds."
      title="Creating your Avatar"
    >
      <View style={styles.stage}>
        <AvatarImageFrame uri={photoUri}>
          <View style={styles.loadingScrim}>
            <ActivityIndicator color={colors.inverseText} size="large" />
            <Text style={styles.loadingText}>Building your style avatar</Text>
          </View>
        </AvatarImageFrame>
      </View>
    </OnboardingStepShell>
  );
}

const styles = StyleSheet.create({
  loadingScrim: {
    alignItems: "center",
    backgroundColor: colors.scrimMedium,
    bottom: 0,
    gap: spacing.md,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  loadingText: {
    color: colors.inverseText,
    ...typography.body
  },
  stage: {
    justifyContent: "center",
    paddingTop: spacing.xl + twoLineSubtitleOffset
  }
});
