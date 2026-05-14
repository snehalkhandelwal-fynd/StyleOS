import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "../../../theme";
import { HomeSearchBar } from "./HomeSearchBar";

type HomeHeaderProps = {
  address: string;
  firstName: string;
  onChangeAddress: () => void;
};

export function HomeHeader({
  address,
  firstName,
  onChangeAddress
}: HomeHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.addressRow}>
        <Pressable
          accessibilityLabel="Change delivery location"
          accessibilityRole="button"
          onPress={onChangeAddress}
          style={({ pressed }) => [
            styles.addressButton,
            pressed ? styles.pressed : null
          ]}
        >
          <Ionicons color={colors.text} name="location-outline" size={22} />
          <Text numberOfLines={1} style={styles.addressText}>
            {address}
          </Text>
          <Ionicons color={colors.text} name="chevron-down" size={18} />
        </Pressable>
        <View style={styles.profileButton}>
          <Text style={styles.profileInitial}>
            {firstName.slice(0, 1).toUpperCase()}
          </Text>
        </View>
      </View>

      <HomeSearchBar />
    </View>
  );
}

const styles = StyleSheet.create({
  addressButton: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minWidth: 0
  },
  addressRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md
  },
  addressText: {
    color: colors.text,
    flex: 1,
    minWidth: 0,
    ...typography.bodyLarge
  },
  header: {
    backgroundColor: colors.background,
    gap: spacing.md,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg
  },
  pressed: {
    opacity: 0.72
  },
  profileButton: {
    alignItems: "center",
    backgroundColor: colors.inverse,
    borderRadius: radii.pill,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  profileInitial: {
    color: colors.inverseText,
    ...typography.bodyLarge
  }
});

