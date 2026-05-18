import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fonts, radii, spacing, typography } from "../../../theme";
import { homeImages } from "../viewModels/useHomeViewModel";

export function WardrobeBanner() {
  return (
    <ImageBackground
      imageStyle={styles.image}
      resizeMode="cover"
      source={{ uri: homeImages.finalBanner }}
      style={styles.banner}
    >
      <View style={styles.overlay} />
      <View style={styles.copy}>
        <Text style={styles.title}>Build looks from what you already love</Text>
        <Text style={styles.body}>
          Add items from your wardrobe and we'll style them into looks you'll actually wear
        </Text>
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.cta,
            pressed ? styles.pressed : null
          ]}
        >
          <Text style={styles.ctaText}>Add Items</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: radii.card,
    margin: spacing.screen,
    minHeight: 240,
    overflow: "hidden"
  },
  body: {
    color: colors.inverseText,
    maxWidth: 280,
    ...typography.body
  },
  copy: {
    gap: spacing.sm,
    padding: spacing.lg
  },
  cta: {
    alignItems: "center",
    backgroundColor: colors.inverseText,
    borderRadius: radii.button,
    height: 38,
    justifyContent: "center",
    marginTop: spacing.sm,
    width: 112
  },
  ctaText: {
    color: colors.text,
    fontFamily: fonts.cta,
    fontSize: 13,
    lineHeight: 20
  },
  image: {
    borderRadius: radii.card
  },
  overlay: {
    backgroundColor: colors.scrimStrong,
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  pressed: {
    opacity: 0.72
  },
  title: {
    color: colors.inverseText,
    maxWidth: 280,
    ...typography.sectionHeading
  }
});
