import { Pressable, StyleSheet } from "react-native";

import { BrandIcon } from "./BrandIcon";
import { colors, radii } from "../theme";

type SocialButtonProps = {
  accessibilityLabel: string;
  icon: "google" | "apple" | "facebook";
  onPress: () => void;
};

export function SocialButton({
  accessibilityLabel,
  icon,
  onPress
}: SocialButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
    >
      <BrandIcon name={icon} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    flex: 1,
    height: 44,
    justifyContent: "center",
    paddingHorizontal: 20
  },
  pressed: {
    opacity: 0.72
  }
});
