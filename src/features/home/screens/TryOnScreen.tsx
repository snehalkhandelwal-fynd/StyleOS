import { SafeAreaView, StyleSheet, Text } from "react-native";

import { colors, spacing, typography } from "../../../theme";

export function TryOnScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Try-On</Text>
      <Text style={styles.copy}>
        Your avatar is ready for every look you choose.
      </Text>
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
    paddingBottom: 128,
    paddingTop: spacing.xxl
  },
  title: {
    color: colors.text,
    ...typography.displayHeadline
  }
});
