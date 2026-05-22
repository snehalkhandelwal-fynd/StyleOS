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
      <View style={styles.iconShell}>
        <Feather color={colors.text} name={icon} size={19} />
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Feather color={colors.soft} name="chevron-right" size={20} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconShell: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  pressed: {
    opacity: 0.6
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 74,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
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
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 15,
    lineHeight: 19
  }
});
