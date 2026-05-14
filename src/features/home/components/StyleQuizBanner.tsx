import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fonts, radii, spacing, typography } from "../../../theme";
import { homeImages } from "../viewModels/useHomeViewModel";

type StyleQuizBannerProps = {
  onPress: () => void;
};

export function StyleQuizBanner({ onPress }: StyleQuizBannerProps) {
  return (
    <View style={styles.section}>
      <ImageBackground
        imageStyle={styles.image}
        resizeMode="cover"
        source={{ uri: homeImages.quizBanner }}
        style={styles.banner}
      >
        <View style={styles.copy}>
          <Text style={styles.title}>Find your style in 30 seconds</Text>
          <Text style={styles.body}>
            Swipe on looks you like and we’ll learn your style
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={onPress}
            style={({ pressed }) => [
              styles.cta,
              pressed ? styles.pressed : null
            ]}
          >
            <Text style={styles.ctaText}>Start swiping</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: radii.card,
    minHeight: 176,
    overflow: "hidden"
  },
  body: {
    color: colors.inverseText,
    maxWidth: 210,
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
    height: 36,
    justifyContent: "center",
    marginTop: spacing.sm,
    width: 128
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
  pressed: {
    opacity: 0.72
  },
  section: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.xl
  },
  title: {
    color: colors.inverseText,
    maxWidth: 220,
    ...typography.sectionHeading
  }
});

