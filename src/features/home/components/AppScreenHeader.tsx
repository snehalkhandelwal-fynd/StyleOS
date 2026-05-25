import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, fonts, spacing, typography } from "../../../theme";

export const appScreenTopPadding = spacing.sm;

type AppScreenHeaderProps = {
  rightAccessory?: ReactNode;
  subtitle?: string;
  title: string;
};

export function AppScreenHeader({
  rightAccessory,
  subtitle,
  title
}: AppScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.titleBlock}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {rightAccessory ? (
        <View style={styles.rightAccessory}>{rightAccessory}</View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    zIndex: 4
  },
  rightAccessory: {
    flexShrink: 0,
    zIndex: 5
  },
  subtitle: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 20
  },
  title: {
    ...typography.screenTitle,
    color: colors.text
  },
  titleBlock: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0
  }
});
