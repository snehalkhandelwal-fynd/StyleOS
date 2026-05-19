import { Ionicons } from "@expo/vector-icons";
import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fonts, radii, spacing, typography } from "../../../theme";
import { homeImages } from "../viewModels/useHomeViewModel";

export function StyledForYouHero() {
  return (
    <ImageBackground
      imageStyle={styles.image}
      resizeMode="cover"
      source={{ uri: homeImages.hero }}
      style={styles.card}
    >
      <View style={styles.deliveryChip}>
        <Ionicons color={colors.inverseText} name="checkmark-circle-outline" size={16} />
        <Text style={styles.deliveryText}>Delivery in 2 days</Text>
      </View>

      <View style={styles.matchPill}>
        <Text style={styles.matchText}>Popular</Text>
      </View>

      <Pressable
        accessibilityLabel="Save styled look"
        accessibilityRole="button"
        style={styles.heart}
      >
        <Ionicons color={colors.text} name="heart-outline" size={22} />
      </Pressable>

      <View style={styles.copy}>
        <Text style={styles.kicker}>Women’s edits</Text>
        <Text style={styles.title}>Your look today</Text>
        <Text style={styles.description}>
          See it on your avatar before you decide.
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.cta,
          pressed ? styles.pressed : null
        ]}
      >
        <Text style={styles.ctaText}>Try this on me</Text>
      </Pressable>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.card,
    height: 520,
    justifyContent: "flex-end",
    overflow: "hidden"
  },
  copy: {
    gap: spacing.xs,
    paddingBottom: 76,
    paddingHorizontal: spacing.lg
  },
  cta: {
    alignItems: "center",
    backgroundColor: colors.inverse,
    borderRadius: radii.button,
    bottom: spacing.lg,
    height: 44,
    justifyContent: "center",
    left: spacing.lg,
    position: "absolute",
    right: spacing.lg
  },
  ctaText: {
    color: colors.inverseText,
    fontFamily: fonts.cta,
    fontSize: 14,
    lineHeight: 22
  },
  deliveryChip: {
    alignItems: "center",
    backgroundColor: colors.inverseTranslucent,
    borderRadius: radii.pill,
    flexDirection: "row",
    gap: spacing.xs,
    left: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    position: "absolute",
    top: spacing.md
  },
  deliveryText: {
    color: colors.inverseText,
    ...typography.smallCaption
  },
  description: {
    color: colors.inverseText,
    ...typography.body
  },
  heart: {
    alignItems: "center",
    backgroundColor: colors.surfaceTranslucent,
    borderRadius: radii.pill,
    height: 42,
    justifyContent: "center",
    position: "absolute",
    right: spacing.md,
    top: spacing.md,
    width: 42
  },
  image: {
    borderRadius: radii.card
  },
  kicker: {
    color: colors.inverseText,
    ...typography.body
  },
  matchPill: {
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    left: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    position: "absolute",
    top: 52
  },
  matchText: {
    color: colors.text,
    ...typography.smallCaption
  },
  pressed: {
    opacity: 0.72
  },
  title: {
    color: colors.inverseText,
    ...typography.displayHeadline
  }
});
