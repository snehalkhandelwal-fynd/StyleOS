import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fonts, spacing, typography } from "../../../theme";

/**
 * A single tappable row in the Account screen's section lists.
 * Data contract:
 * - `icon` is a Feather glyph name shown at the leading edge.
 * - `title` / `subtitle` are static UX copy.
 * - `onPress` is optional so rows can render before their destination
 *   screen exists; the row stays inert until a handler is wired.
 */
type AccountMenuRowProps = {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
  onPress?: () => void;
};

export function AccountMenuRow({
  icon,
  title,
  subtitle,
  onPress
}: AccountMenuRowProps) {
  return (
    <Pressable
      accessibilityLabel={title}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
    >
      <Feather color={colors.text} name={icon} size={20} />
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Feather color={colors.soft} name="chevron-right" size={20} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.6
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md
  },
  subtitle: {
    ...typography.caption,
    color: colors.muted
  },
  text: {
    flex: 1,
    gap: 2
  },
  title: {
    ...typography.bodyLarge,
    color: colors.text,
    fontFamily: fonts.bodyMedium
  }
});
