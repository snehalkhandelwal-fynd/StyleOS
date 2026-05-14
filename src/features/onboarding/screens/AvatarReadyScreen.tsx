import { Pressable, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "../../../components/PrimaryButton";
import { colors, fonts, spacing } from "../../../theme";
import { AvatarImageFrame } from "../components/AvatarImageFrame";
import { OnboardingStepShell } from "../components/OnboardingStepShell";

type AvatarReadyScreenProps = {
  avatarUri?: string;
  onContinue: () => void;
  onUseAnotherPhoto: () => void;
};

const fallbackAvatar =
  "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80";

export function AvatarReadyScreen({
  avatarUri,
  onContinue,
  onUseAnotherPhoto
}: AvatarReadyScreenProps) {
  return (
    <OnboardingStepShell
      title="You’re ready to try outfits on yourself"
    >
      <View style={styles.content}>
        <AvatarImageFrame uri={avatarUri ?? fallbackAvatar} />

        <PrimaryButton label="Try your first look" onPress={onContinue} />

        <Pressable
          accessibilityLabel="Use another photo"
          accessibilityRole="button"
          onPress={onUseAnotherPhoto}
          style={({ pressed }) => [
            styles.reuploadAction,
            pressed ? styles.pressed : null
          ]}
        >
          <Text style={styles.reuploadMuted}>Unhappy?</Text>
          <Text style={styles.reuploadLink}>Use another photo</Text>
        </Pressable>
      </View>
    </OnboardingStepShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingTop: spacing.xl
  },
  pressed: {
    opacity: 0.72
  },
  reuploadAction: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    justifyContent: "center"
  },
  reuploadLink: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18,
    textDecorationLine: "underline"
  },
  reuploadMuted: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 18
  }
});
