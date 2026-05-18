import { Pressable, StyleSheet, Text, View } from "react-native";

import { BackIcon } from "./BackIcon";
import { colors, spacing, typography } from "../theme";

type ScreenHeaderProps = {
  onBack?: () => void;
  showBrand?: boolean;
};

export function ScreenHeader({ onBack, showBrand = true }: ScreenHeaderProps) {
  return (
    <View style={[styles.header, !showBrand ? styles.headerWithoutBrand : null]}>
      {onBack ? (
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={12}
          onPress={onBack}
          style={styles.backButton}
        >
          <BackIcon />
        </Pressable>
      ) : (
        <View style={styles.backButton} />
      )}
      {showBrand ? <Text style={styles.brand}>Stylus</Text> : null}
      {showBrand ? <View style={styles.backButton} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "flex-start",
    height: 40,
    justifyContent: "center",
    width: 28
  },
  brand: {
    color: colors.text,
    ...typography.sectionHeading
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.sm
  },
  headerWithoutBrand: {
    justifyContent: "flex-start"
  }
});
