import { StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "../../../components/PrimaryButton";
import { colors, fonts, radii, spacing } from "../../../theme";
import { prototypeProductImages } from "../../home/data/prototypeProductImages";
import { AvatarImageFrame } from "../components/AvatarImageFrame";
import {
  OnboardingStepShell,
  type OnboardingStepPresentation
} from "../components/OnboardingStepShell";

type AvatarReadyScreenProps = {
  avatarUri?: string;
  height?: {
    feet: number;
    inches: number;
  };
  onContinue: () => void;
  onUseAnotherPhoto: () => void;
  presentation?: OnboardingStepPresentation;
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
      key: "height",
      label: formatHeight(height),
      style: styles.measurementChipTopRight
    },
    {
      key: "shoulder",
      label: `Shoulder ${Math.round(totalInches * 0.24)} in`,
      style: styles.measurementChipLeftUpper
    },
    {
      key: "waist",
      label: `Waist ${Math.round(totalInches * 0.43)} in`,
      style: styles.measurementChipRightMiddle
    },
    {
      key: "hip",
      label: `Hip ${Math.round(totalInches * 0.56)} in`,
      style: styles.measurementChipLeftLower
    },
    {
      key: "inseam",
      label: `Inseam ${Math.round(totalInches * 0.46)} in`,
      style: styles.measurementChipRightLower
    }
  ];
}

export function AvatarReadyScreen({
  avatarUri,
  height,
  onContinue,
  onUseAnotherPhoto,
  presentation = "screen"
}: AvatarReadyScreenProps) {
  const isDrawer = presentation === "drawer";
  const measurementChips = getMeasurementChips(height);
  const drawerNextButton = isDrawer
    ? {
        accessibilityLabel: "Try your first look",
        disabled: false,
        label: "Try your first look",
        onPress: onContinue
      }
    : undefined;
  const drawerSecondaryButton = isDrawer
    ? {
        label: "Change photo",
        onPress: onUseAnotherPhoto,
        variant: "outline" as const
      }
    : undefined;

  return (
    <OnboardingStepShell
      currentStep={4}
      drawerSecondaryButton={drawerSecondaryButton}
      nextButton={drawerNextButton}
      presentation={presentation}
      title="You’re ready to try outfits on yourself"
      totalSteps={4}
    >
      <View style={[styles.content, isDrawer ? styles.drawerContent : null]}>
        <AvatarImageFrame
          style={isDrawer ? styles.drawerFrame : null}
          uri={avatarUri ?? fallbackAvatar}
        >
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            {measurementChips.map((chip) => (
              <View
                key={chip.key}
                style={[styles.measurementChip, chip.style]}
              >
                <Text style={styles.measurementChipText}>{chip.label}</Text>
              </View>
            ))}
          </View>
        </AvatarImageFrame>

        {!isDrawer ? (
          <View style={styles.buttonStack}>
            <PrimaryButton
              label="Try your first look"
              onPress={onContinue}
            />
            <PrimaryButton
              label="Change photo"
              onPress={onUseAnotherPhoto}
              variant="outline"
            />
          </View>
        ) : null}
      </View>
    </OnboardingStepShell>
  );
}

const styles = StyleSheet.create({
  buttonStack: {
    gap: spacing.sm,
    width: "100%"
  },
  content: {
    gap: spacing.lg,
    paddingTop: spacing.xl
  },
  drawerContent: {
    alignItems: "center",
    gap: spacing.md,
    paddingBottom: spacing.xl,
    paddingTop: spacing.lg
  },
  drawerFrame: {
    width: "78%"
  },
  measurementChip: {
    alignItems: "center",
    backgroundColor: "rgba(226, 221, 211, 0.68)",
    borderColor: "rgba(214, 209, 199, 0.62)",
    borderRadius: radii.pill,
    borderWidth: 1,
    elevation: 1,
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
    shadowOpacity: 0.06,
    shadowRadius: 6
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
    right: 26,
    top: "71%"
  },
  measurementChipRightMiddle: {
    right: 16,
    top: "44%"
  },
  measurementChipText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14,
    textAlign: "center"
  },
  measurementChipTopRight: {
    right: 32,
    top: 58
  }
});
