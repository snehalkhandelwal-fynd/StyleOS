import { Pressable, StyleSheet, Text } from "react-native";

import { colors, fonts } from "../theme";

type TertiaryButtonProps = {
  label: string;
  onPress: () => void;
};

export function TertiaryButton({ label, onPress }: TertiaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={10}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center"
  },
  label: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
    textDecorationLine: "underline"
  },
  pressed: {
    opacity: 0.72
  }
});
