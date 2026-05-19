import { Feather, Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { HomeTabName } from "../../../navigation/types";
import { colors, fonts, spacing } from "../../../theme";

type BottomTabBarProps = {
  activeTab: HomeTabName;
  onChangeTab: (tab: HomeTabName) => void;
};

const tabs: Array<{
  icon:
    | ComponentProps<typeof Feather>["name"]
    | ComponentProps<typeof Ionicons>["name"];
  iconFamily?: "feather" | "ionicons";
  label: string;
  name: HomeTabName;
}> = [
  { icon: "home", label: "Home", name: "Home" },
  { icon: "grid", label: "Explore", name: "Feed" },
  {
    icon: "shirt-outline",
    iconFamily: "ionicons",
    label: "Closet",
    name: "Closet"
  },
  { icon: "camera", label: "Stylist", name: "TryOn" },
  { icon: "user", label: "Account", name: "Profile" }
];

export function BottomTabBar({ activeTab, onChangeTab }: BottomTabBarProps) {
  return (
    <View style={styles.bar}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        const color = isActive ? colors.text : "#BBBBBB";

        return (
          <Pressable
            accessibilityLabel={tab.label}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            key={tab.name}
            onPress={() => onChangeTab(tab.name)}
            style={({ pressed }) => [
              styles.tab,
              pressed ? styles.pressed : null
            ]}
          >
            {tab.iconFamily === "ionicons" ? (
              <Ionicons
                color={color}
                name={tab.icon as ComponentProps<typeof Ionicons>["name"]}
                size={21}
              />
            ) : (
              <Feather
                color={color}
                name={tab.icon as ComponentProps<typeof Feather>["name"]}
                size={19}
              />
            )}
            <Text style={[styles.label, { color }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 36,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 8,
    flexDirection: "row",
    height: 68,
    marginHorizontal: spacing.screen,
    paddingHorizontal: 6,
    shadowColor: "#000000",
    shadowOffset: {
      height: 4,
      width: 0
    },
    shadowOpacity: 0.08,
    shadowRadius: 20
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 9,
    lineHeight: 11
  },
  pressed: {
    opacity: 0.72
  },
  tab: {
    alignItems: "center",
    flex: 1,
    gap: 2,
    justifyContent: "center"
  }
});
