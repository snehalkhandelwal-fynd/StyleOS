import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { colors, radii, spacing, typography } from "../../../theme";

type HorizontalPillTabsProps = {
  onSelectTab: (tab: string) => void;
  selectedTab: string;
  tabs: string[];
};

export function HorizontalPillTabs({
  onSelectTab,
  selectedTab,
  tabs
}: HorizontalPillTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroller}
      contentContainerStyle={styles.content}
    >
      {tabs.map((tab) => {
        const isSelected = selectedTab === tab;

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            key={tab}
            onPress={() => onSelectTab(tab)}
            style={({ pressed }) => [
              styles.tab,
              isSelected ? styles.selectedTab : null,
              pressed ? styles.pressed : null
            ]}
          >
            <Text
              style={[
                styles.tabText,
                isSelected ? styles.selectedTabText : null
              ]}
            >
              {tab}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.sm,
    paddingHorizontal: spacing.screen
  },
  pressed: {
    opacity: 0.72
  },
  scroller: {
    marginHorizontal: -spacing.screen
  },
  selectedTab: {
    backgroundColor: colors.inverse,
    borderColor: colors.inverse
  },
  selectedTabText: {
    color: colors.inverseText
  },
  tab: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    paddingHorizontal: spacing.md
  },
  tabText: {
    color: colors.text,
    ...typography.caption
  }
});

