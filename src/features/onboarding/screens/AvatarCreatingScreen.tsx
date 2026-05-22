import { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "../../../theme";
import { prototypeProductImages } from "../../home/data/prototypeProductImages";
import { AvatarImageFrame } from "../components/AvatarImageFrame";
import {
  OnboardingStepShell,
  type OnboardingStepPresentation
} from "../components/OnboardingStepShell";

type AvatarCreatingScreenProps = {
  onComplete: (avatarUri: string) => void;
  photoUri?: string;
  presentation?: OnboardingStepPresentation;
};

const fallbackAvatar = prototypeProductImages.maje.pinkRelaxedSet;
const twoLineSubtitleOffset = 21;

export function AvatarCreatingScreen({
  onComplete,
  photoUri,
  presentation = "screen"
}: AvatarCreatingScreenProps) {
  const isDrawer = presentation === "drawer";

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(photoUri ?? fallbackAvatar);
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete, photoUri]);

  return (
    <OnboardingStepShell
      presentation={presentation}
      subtitle="This may take up to 30 seconds."
      title="Creating your Avatar"
    >
      <View
        style={[
          styles.stage,
          isDrawer ? styles.drawerStage : null
        ]}
      >
        {isDrawer ? (
          <View style={styles.drawerPreviewFrame}>
            {photoUri ? (
              <Image
                resizeMode="cover"
                source={{ uri: photoUri }}
                style={styles.drawerPreviewImage}
              />
            ) : null}
            <View style={styles.loadingScrim}>
              <ActivityIndicator color={colors.inverseText} size="large" />
              <Text style={styles.loadingText}>Building your style avatar</Text>
            </View>
          </View>
        ) : (
          <AvatarImageFrame uri={photoUri}>
            <View style={styles.loadingScrim}>
              <ActivityIndicator color={colors.inverseText} size="large" />
              <Text style={styles.loadingText}>Building your style avatar</Text>
            </View>
          </AvatarImageFrame>
        )}
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
  },
  drawerPreviewFrame: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    flex: 1,
    overflow: "hidden",
    width: "100%"
  },
  drawerPreviewImage: {
    height: "100%",
    width: "100%"
  },
  drawerStage: {
    alignItems: "stretch",
    flex: 1,
    justifyContent: "flex-start",
    paddingBottom: 96,
    paddingTop: spacing.xl
  }
});
