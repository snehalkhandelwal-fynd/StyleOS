import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "../../../theme";

export function HomeSearchBar() {
  return (
    <View style={styles.searchBar}>
      <Ionicons color={colors.soft} name="search" size={22} />
      <Text numberOfLines={1} style={styles.placeholder}>
        Search by occasion, style, or vibe…
      </Text>
      <View style={styles.actions}>
        <Ionicons color={colors.soft} name="mic-outline" size={20} />
        <Ionicons color={colors.soft} name="camera-outline" size={20} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: spacing.sm
  },
  placeholder: {
    color: colors.soft,
    flex: 1,
    minWidth: 0,
    ...typography.body
  },
  searchBar: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 48,
    paddingHorizontal: spacing.md
  }
});

