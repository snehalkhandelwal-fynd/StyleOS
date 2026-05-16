import { SafeAreaView, StyleSheet, Text } from "react-native";

import { colors, layout, spacing, typography } from "../../../theme";

type ExploreScreenProps = {
  copy?: string;
  title?: string;
};

export function ExploreScreen({
  copy = "Search by occasion, style, or vibe to discover new looks.",
  title = "Feed"
}: ExploreScreenProps) {
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.copy}>{copy}</Text>
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
