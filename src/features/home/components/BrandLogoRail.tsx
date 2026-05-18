import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { colors, fonts, radii, spacing, typography } from "../../../theme";

type BrandLogoRailProps = {
  brandRows: string[][];
};

export function BrandLogoRail({ brandRows }: BrandLogoRailProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Shop by Brands</Text>
      <Text style={styles.subtitle}>
        Shop by your favorite brands for every audio journey
      </Text>

      <View style={styles.rows}>
        {brandRows.map((row, rowIndex) => (
          <ScrollView
            contentContainerStyle={styles.rowContent}
            horizontal
            key={`brand-row-${rowIndex}`}
            showsHorizontalScrollIndicator={false}
          >
            {row.map((brandUri, index) => (
              <View key={`${brandUri}-${index}`} style={styles.brandPill}>
                <Image resizeMode="contain" source={{ uri: brandUri }} style={styles.logo} />
              </View>
            ))}
          </ScrollView>
        ))}
      </View>

      <Pressable accessibilityRole="button" style={styles.cta}>
        <Text style={styles.ctaText}>View All</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  brandPill: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    height: 42,
    justifyContent: "center",
    width: 108
  },
  cta: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.inverse,
    borderRadius: radii.button,
    height: 40,
    justifyContent: "center",
    paddingHorizontal: spacing.xl
  },
  ctaText: {
    color: colors.inverseText,
    fontFamily: fonts.cta,
    fontSize: 13,
    lineHeight: 20
  },
  logo: {
    height: 30,
    width: 86
  },
  rowContent: {
    gap: spacing.sm,
    paddingHorizontal: spacing.screen
  },
  rows: {
    gap: spacing.sm
  },
  section: {
    backgroundColor: colors.brandBand,
    gap: spacing.lg,
    paddingVertical: spacing.xl
  },
  subtitle: {
    alignSelf: "center",
    color: colors.muted,
    maxWidth: 270,
    textAlign: "center",
    ...typography.caption
  },
  title: {
    color: colors.text,
    textAlign: "center",
    ...typography.sectionHeading
  }
});
