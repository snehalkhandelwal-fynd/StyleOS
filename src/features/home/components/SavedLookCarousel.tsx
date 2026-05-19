import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { colors, fonts, radii, spacing, typography } from "../../../theme";
import type { SavedLook } from "../viewModels/useHomeViewModel";

type SavedLookCarouselProps = {
  savedLooks: SavedLook[];
};

const deliveryWindows = [
  "Delivery in 2 days",
  "Delivery in 4 days",
  "Delivery in 3 days",
  "Delivery in 5 days"
];

export function SavedLookCarousel({ savedLooks }: SavedLookCarouselProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Saved Looks</Text>

      <ScrollView
        contentContainerStyle={styles.carouselContent}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {savedLooks.map((look, index) => (
          <View key={look.id} style={styles.card}>
            <View style={styles.imageFrame}>
              <Image resizeMode="cover" source={{ uri: look.image }} style={styles.image} />
              <Pressable
                accessibilityLabel="Save look"
                accessibilityRole="button"
                style={styles.heart}
              >
                <Ionicons color={colors.text} name="heart-outline" size={20} />
              </Pressable>
            </View>
            <View style={styles.footer}>
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>Popular</Text>
                <Text style={styles.metaText}>
                  {deliveryWindows[index % deliveryWindows.length]}
                </Text>
              </View>
              <Pressable accessibilityRole="button" style={styles.shopButton}>
                <Ionicons color={colors.text} name="cart-outline" size={18} />
                <Text style={styles.shopText}>Shop this look</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        <View style={styles.activeDot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  activeDot: {
    backgroundColor: colors.text,
    borderRadius: radii.pill,
    height: 6,
    width: 22
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    overflow: "hidden",
    width: 270
  },
  carouselContent: {
    gap: spacing.md,
    paddingHorizontal: spacing.screen
  },
  dot: {
    backgroundColor: colors.border,
    borderRadius: radii.pill,
    height: 6,
    width: 6
  },
  footer: {
    gap: spacing.sm,
    padding: spacing.md
  },
  heart: {
    alignItems: "center",
    backgroundColor: colors.surfaceTranslucent,
    borderRadius: radii.pill,
    height: 38,
    justifyContent: "center",
    position: "absolute",
    right: spacing.sm,
    top: spacing.sm,
    width: 38
  },
  image: {
    height: "100%",
    width: "100%"
  },
  imageFrame: {
    height: 310
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  metaText: {
    color: colors.muted,
    ...typography.smallCaption
  },
  pagination: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
    justifyContent: "center"
  },
  section: {
    backgroundColor: colors.background,
    gap: spacing.lg,
    paddingVertical: spacing.xl
  },
  shopButton: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.xs,
    height: 38,
    justifyContent: "center"
  },
  shopText: {
    color: colors.text,
    fontFamily: fonts.cta,
    fontSize: 13,
    lineHeight: 20
  },
  title: {
    color: colors.text,
    textAlign: "center",
    ...typography.sectionHeading
  }
});
