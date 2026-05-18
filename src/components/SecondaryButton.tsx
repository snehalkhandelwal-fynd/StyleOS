import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

import { colors, fonts, radii } from "../theme";

type SecondaryButtonProps = {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
};

export function SecondaryButton({ label, onPress, style }: SecondaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed ? styles.pressed : null,
        style
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: colors.secondaryBorder,
    borderRadius: radii.button,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    paddingHorizontal: 24,
    width: "100%"
  },
  label: {
    color: colors.textStrong,
    fontFamily: fonts.cta,
    fontSize: 14,
    lineHeight: 14
  },
  pressed: {
    opacity: 0.72
  }
});
