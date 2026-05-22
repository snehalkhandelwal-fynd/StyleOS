import { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  type TextStyle,
  View
} from "react-native";

import { colors, fonts, radii, spacing } from "../../../theme";
import { OnboardingStepShell } from "../components/OnboardingStepShell";
import { HeightPicker } from "../components/HeightPicker";
import type { OnboardingStepPresentation } from "../components/OnboardingStepShell";

type SetupHeightScreenProps = {
  height: {
    feet: number;
    inches: number;
  };
  onChangeHeight: (feet: number, inches: number) => void;
  onChangeWeightKilograms: (weightKilograms: number) => void;
  onContinue: () => void;
  presentation?: OnboardingStepPresentation;
  weightKilograms?: number;
};

const minWeightKilograms = 30;
const maxWeightKilograms = 200;
const webTextInputReset =
  Platform.OS === "web"
    ? ({
        outlineStyle: "none",
        outlineWidth: 0
      } as unknown as TextStyle)
    : null;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function SetupHeightScreen({
  height,
  onChangeHeight,
  onChangeWeightKilograms,
  onContinue,
  presentation = "screen",
  weightKilograms = 55
}: SetupHeightScreenProps) {
  const totalSteps = presentation === "drawer" ? 5 : 4;
  const [weightInput, setWeightInput] = useState(String(weightKilograms));
  const parsedWeight = Number(weightInput);
  const canContinue =
    Number.isFinite(parsedWeight) &&
    parsedWeight >= minWeightKilograms &&
    parsedWeight <= maxWeightKilograms;

  useEffect(() => {
    setWeightInput(String(weightKilograms));
  }, [weightKilograms]);

  const handleWeightChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");

    setWeightInput(digitsOnly);

    if (!digitsOnly) {
      return;
    }

    const nextWeight = Number(digitsOnly);

    if (!Number.isFinite(nextWeight)) {
      return;
    }

    if (nextWeight > maxWeightKilograms) {
      setWeightInput(String(maxWeightKilograms));
      onChangeWeightKilograms(maxWeightKilograms);
      return;
    }

    if (nextWeight >= minWeightKilograms) {
      onChangeWeightKilograms(clamp(
        nextWeight,
        minWeightKilograms,
        maxWeightKilograms
      ));
    }
  };

  return (
    <OnboardingStepShell
      currentStep={2}
      presentation={presentation}
      nextButton={{
        accessibilityLabel: "Continue to fashion interest setup",
        disabled: !canContinue,
        onPress: onContinue
      }}
      title="Tell us about yourself"
      totalSteps={totalSteps}
    >
      <View
        style={[
          styles.body,
          presentation === "drawer" ? styles.drawerBody : null
        ]}
      >
        <HeightPicker
          feet={height.feet}
          inches={height.inches}
          onChangeHeight={onChangeHeight}
          variant={presentation === "drawer" ? "compact" : "default"}
        />

        <View style={styles.weightSection}>
          <Text style={styles.fieldLabel}>Weight</Text>
          <View
            style={[
              styles.weightField,
              presentation === "drawer" ? styles.drawerWeightField : null
            ]}
          >
            <TextInput
              inputMode="numeric"
              keyboardType="number-pad"
              maxLength={3}
              onChangeText={handleWeightChange}
              placeholder="55"
              placeholderTextColor={colors.soft}
              selectionColor={colors.text}
              style={[
                styles.weightInput,
                presentation === "drawer" ? styles.drawerWeightInput : null,
                webTextInputReset
              ]}
              value={weightInput}
            />
            <Text style={styles.weightUnit}>kg</Text>
          </View>
        </View>
      </View>
    </OnboardingStepShell>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: spacing.xl,
    paddingBottom: 96
  },
  drawerBody: {
    gap: spacing.xl,
    paddingBottom: 72
  },
  drawerWeightField: {
    height: 48
  },
  drawerWeightInput: {
    fontSize: 18,
    lineHeight: 23
  },
  fieldLabel: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18
  },
  weightField: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: 1,
    flexDirection: "row",
    height: 52,
    paddingHorizontal: spacing.lg
  },
  weightInput: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.heading,
    fontSize: 22,
    lineHeight: 28,
    minWidth: 0,
    padding: 0
  },
  weightSection: {
    gap: spacing.sm
  },
  weightUnit: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 20
  }
});
