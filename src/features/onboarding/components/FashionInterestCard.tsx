import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "../../../theme";

type FashionInterestCardProps = {
  image: string;
  isSelected: boolean;
  label: string;
  onPress: () => void;
};

export function FashionInterestCard({
  image,
  isSelected,
  label,
  onPress
}: FashionInterestCardProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        isSelected ? styles.selected : null,
        isSelected ? styles.selectedScale : null,
        pressed ? styles.pressed : null
      ]}
    >
      <Image
        resizeMode="cover"
        source={{ uri: image }}
        style={styles.image}
      />
      <View style={styles.overlay} />
      <LinearGradient
        colors={[
          "rgba(255, 255, 255, 0)",
          "rgba(255, 255, 255, 0.18)",
          "rgba(255, 255, 255, 0.42)"
        ]}
        pointerEvents="none"
        style={styles.copyGradient}
      />
      {isSelected ? (
        <View style={styles.checkWrap}>
          <Ionicons color={colors.inverseText} name="checkmark" size={18} />
        </View>
      ) : null}
      <View style={styles.content}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={styles.label}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    minHeight: 244,
    overflow: "hidden",
    position: "relative"
  },
  checkWrap: {
    alignItems: "center",
    backgroundColor: colors.inverse,
    borderRadius: radii.pill,
    height: 28,
    justifyContent: "center",
    position: "absolute",
    right: spacing.md,
    top: spacing.md,
    width: 28
  },
  content: {
    bottom: spacing.lg,
    left: spacing.md,
    position: "absolute",
    right: spacing.md,
    zIndex: 2
  },
  copyGradient: {
    bottom: 0,
    height: "42%",
    left: 0,
    position: "absolute",
    right: 0
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    width: "100%"
  },
  label: {
    color: colors.text,
    fontFamily: typography.sectionHeading.fontFamily,
    fontSize: 18,
    lineHeight: 23
  },
  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  pressed: {
    opacity: 0.82
  },
  selected: {
    borderColor: colors.text,
    borderWidth: 2
  },
  selectedScale: {
    transform: [{ scale: 1.02 }]
  }
});
