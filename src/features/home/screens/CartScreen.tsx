import { SafeAreaView, StyleSheet, Text } from "react-native";

import { colors, layout, spacing, typography } from "../../../theme";

export function CartScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Cart</Text>
      <Text style={styles.copy}>Looks you choose will collect here.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  copy: {
    color: colors.muted,
    ...typography.bodyLarge
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1,
    gap: spacing.sm,
    padding: spacing.screen,
    paddingBottom: layout.bottomNavScrollPadding,
    paddingTop: spacing.xxl
  },
  title: {
    color: colors.text,
    ...typography.displayHeadline
  }
});
