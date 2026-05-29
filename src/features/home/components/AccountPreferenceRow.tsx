import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fonts, spacing, typography } from "../../../theme";

/**
 * A row in the Account screen's "Manage Preferences" list: a leading icon,
 * a label, and a Switch. Toggle state is owned by the parent screen and
 * passed in via `value` / `onValueChange`.
 */
type AccountPreferenceRowProps = {
  icon: keyof typeof Feather.glyphMap;
  subtitle?: string;
  title: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
};

export function AccountPreferenceRow({
  icon,
  subtitle,
  title,
  value,
  onValueChange
}: AccountPreferenceRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.iconShell}>
        <Feather color={colors.text} name={icon} size={19} />
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <Pressable
        accessibilityLabel={title}
        accessibilityRole="switch"
        accessibilityState={{ checked: value }}
        hitSlop={8}
        onPress={() => onValueChange(!value)}
        style={({ pressed }) => [
          styles.toggleTrack,
          value ? styles.toggleTrackOn : styles.toggleTrackOff,
          pressed ? styles.pressed : null
        ]}
      >
        <View
          style={[
            styles.toggleThumb,
            value ? styles.toggleThumbOn : styles.toggleThumbOff
          ]}
        />
      </Pressable>
    </View>
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
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 74,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  pressed: {
    opacity: 0.72
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
  },
  toggleThumb: {
    backgroundColor: colors.background,
    borderRadius: 12,
    height: 24,
    position: "absolute",
    top: 2,
    width: 24
  },
  toggleThumbOff: {
    left: 2
  },
  toggleThumbOn: {
    right: 2
  },
  toggleTrack: {
    borderRadius: 14,
    height: 28,
    position: "relative",
    width: 48
  },
  toggleTrackOff: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1
  },
  toggleTrackOn: {
    backgroundColor: colors.inverse
  }
});
