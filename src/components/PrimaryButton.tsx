import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

import { colors, fonts, radii } from "../theme";

type PrimaryButtonProps = {
  disabled?: boolean;
  label: string;
  onPress: () => void;
  variant?: "filled" | "outline";
  style?: ViewStyle;
};

export function PrimaryButton({
  disabled = false,
  label,
  onPress,
  variant = "filled",
  style
}: PrimaryButtonProps) {
  const isFilled = variant === "filled";

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isFilled ? styles.filled : styles.outline,
        disabled ? styles.disabled : null,
        pressed ? styles.pressed : null,
        style
      ]}
    >
      <Text style={[styles.label, isFilled ? styles.filledLabel : styles.outlineLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: radii.button,
    height: 48,
    justifyContent: "center",
    paddingHorizontal: 24,
    width: "100%"
  },
  filled: {
    backgroundColor: colors.inverse
  },
  filledLabel: {
    color: colors.inverseText
  },
  disabled: {
    opacity: 0.42
  },
  label: {
    fontFamily: fonts.cta,
    fontSize: 14,
    lineHeight: 14
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: colors.secondaryBorder,
    borderWidth: 1
  },
  outlineLabel: {
    color: colors.text
  },
  pressed: {
    opacity: 0.72
  }
});
