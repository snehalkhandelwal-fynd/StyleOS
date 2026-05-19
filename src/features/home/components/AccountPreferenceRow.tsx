import { Feather } from "@expo/vector-icons";
import { StyleSheet, Switch, Text, View } from "react-native";

import { colors, fonts, spacing, typography } from "../../../theme";

/**
 * A row in the Account screen's "Manage Preferences" list: a leading icon,
 * a label, and a Switch. Toggle state is owned by the parent screen and
 * passed in via `value` / `onValueChange`.
 */
type AccountPreferenceRowProps = {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
};

export function AccountPreferenceRow({
  icon,
  title,
  value,
  onValueChange
}: AccountPreferenceRowProps) {
  return (
    <View style={styles.row}>
      <Feather color={colors.text} name={icon} size={20} />
      <Text style={styles.title}>{title}</Text>
      <Switch
        accessibilityLabel={title}
        ios_backgroundColor={colors.border}
        onValueChange={onValueChange}
        thumbColor={colors.background}
        trackColor={{ false: colors.border, true: colors.text }}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md
  },
  title: {
    ...typography.bodyLarge,
    color: colors.text,
    flex: 1,
    fontFamily: fonts.bodyMedium
  }
});
