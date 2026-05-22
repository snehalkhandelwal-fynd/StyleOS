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
  {
    icon: "shirt-outline",
    iconFamily: "ionicons",
    label: "Closet",
    name: "Closet"
  },
  { icon: "grid", label: "Explore", name: "Feed" },
  { icon: "camera", label: "Stylist", name: "Stylist" },
  { icon: "user", label: "Account", name: "Profile" }
];

export function BottomTabBar({ activeTab, onChangeTab }: BottomTabBarProps) {
  return (
    <View style={styles.bar}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        const color = isActive ? colors.text : "#BBBBBB";
        const iconSize = tab.iconFamily === "ionicons" ? 25 : 23;

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
                size={iconSize}
              />
            ) : (
              <Feather
                color={color}
                name={tab.icon as ComponentProps<typeof Feather>["name"]}
                size={iconSize}
              />
            )}
            <Text
              style={[
                styles.label,
                isActive ? styles.labelActive : null,
                { color }
              ]}
            >
              {tab.label}
            </Text>
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
    borderRadius: 42,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 8,
    flexDirection: "row",
    height: 76,
    paddingHorizontal: 10,
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
    fontSize: 11,
    lineHeight: 14
  },
  labelActive: {
    fontFamily: fonts.bodyMedium
  },
  pressed: {
    opacity: 0.72
  },
  tab: {
    alignItems: "center",
    flex: 1,
    gap: 4,
    justifyContent: "center"
  }
});
