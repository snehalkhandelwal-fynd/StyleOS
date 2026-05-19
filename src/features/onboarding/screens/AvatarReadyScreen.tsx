import { Pressable, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "../../../components/PrimaryButton";
import { colors, fonts, radii, spacing } from "../../../theme";
import { prototypeProductImages } from "../../home/data/prototypeProductImages";
import { AvatarImageFrame } from "../components/AvatarImageFrame";
import { OnboardingStepShell } from "../components/OnboardingStepShell";

type AvatarReadyScreenProps = {
  avatarUri?: string;
  height?: {
    feet: number;
    inches: number;
  };
  onChangeMeasurement: () => void;
  onContinue: () => void;
  onUseAnotherPhoto: () => void;
};

const fallbackAvatar = prototypeProductImages.maje.pinkRelaxedSet;

function formatHeight(height?: { feet: number; inches: number }) {
  if (!height) {
    return "Height measured";
  }

  return `Height ${height.feet}'${height.inches}"`;
}

function getHeightInInches(height?: { feet: number; inches: number }) {
  if (!height) {
    return 65;
  }

  return height.feet * 12 + height.inches;
}

function getMeasurementChips(height?: { feet: number; inches: number }) {
  const totalInches = getHeightInInches(height);

  return [
    {
      label: formatHeight(height),
      style: styles.measurementChipTopRight
    },
    {
      label: `Shoulder ${Math.round(totalInches * 0.24)} in`,
      style: styles.measurementChipLeftUpper
    },
    {
      label: `Waist ${Math.round(totalInches * 0.43)} in`,
      style: styles.measurementChipRightMiddle
    },
    {
      label: `Hip ${Math.round(totalInches * 0.56)} in`,
      style: styles.measurementChipLeftLower
    },
    {
      label: `Inseam ${Math.round(totalInches * 0.46)} in`,
      style: styles.measurementChipRightLower
    }
  ];
}

export function AvatarReadyScreen({
  avatarUri,
  height,
  onChangeMeasurement,
  onContinue,
  onUseAnotherPhoto
}: AvatarReadyScreenProps) {
  const measurementChips = getMeasurementChips(height);

  return (
    <OnboardingStepShell
      title="You’re ready to try outfits on yourself"
    >
      <View style={styles.content}>
        <AvatarImageFrame uri={avatarUri ?? fallbackAvatar}>
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            {measurementChips.map((chip) => (
              <View
                key={chip.label}
                style={[styles.measurementChip, chip.style]}
              >
                <Text style={styles.measurementChipText}>{chip.label}</Text>
              </View>
            ))}
          </View>

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
        </AvatarImageFrame>

        <View style={styles.buttonStack}>
          <PrimaryButton
            label="Try your first look"
            onPress={onContinue}
            variant="outline"
          />
          <PrimaryButton
            label="Change measurement"
            onPress={onChangeMeasurement}
          />
        </View>
      </View>
    </OnboardingStepShell>
  );
}

const styles = StyleSheet.create({
  buttonStack: {
    gap: spacing.sm
  },
  content: {
    gap: spacing.lg,
    paddingTop: spacing.xl
  },
  measurementChip: {
    alignItems: "center",
    backgroundColor: colors.surfaceTranslucent,
    borderColor: "rgba(10, 10, 10, 0.1)",
    borderRadius: radii.pill,
    borderWidth: 1,
    elevation: 3,
    justifyContent: "center",
    maxWidth: 168,
    minHeight: 34,
    paddingHorizontal: 14,
    position: "absolute",
    shadowColor: colors.text,
    shadowOffset: {
      height: 2,
      width: 0
    },
    shadowOpacity: 0.14,
    shadowRadius: 8
  },
  measurementChipLeftLower: {
    left: 10,
    top: "62%"
  },
  measurementChipLeftUpper: {
    left: 10,
    top: "28%"
  },
  measurementChipRightLower: {
    right: 10,
    top: "72%"
  },
  measurementChipRightMiddle: {
    right: 10,
    top: "45%"
  },
  measurementChipText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14,
    textAlign: "center"
  },
  measurementChipTopRight: {
    right: 12,
    top: 22
  },
  pressed: {
    opacity: 0.72
  },
  reuploadAction: {
    alignItems: "center",
    bottom: spacing.md,
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
    position: "absolute",
    right: spacing.lg
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
