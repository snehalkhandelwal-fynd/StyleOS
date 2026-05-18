import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fonts, radii, spacing, typography } from "../../../theme";
import type { HomeProduct } from "../viewModels/useHomeViewModel";

type NewArrivalCardProps = {
  product: HomeProduct;
};

export function NewArrivalCard({ product }: NewArrivalCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.imageFrame}>
        <Image resizeMode="contain" source={{ uri: product.image }} style={styles.image} />
        <Pressable
          accessibilityLabel="Save product"
          accessibilityRole="button"
          style={styles.heart}
        >
          <Ionicons color={colors.text} name="heart-outline" size={20} />
        </Pressable>
      </View>

      <View style={styles.copy}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text numberOfLines={2} style={styles.title}>
          {product.title}
        </Text>
        <Text style={styles.price}>{product.price}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  brand: {
    color: colors.muted,
    ...typography.caption
  },
  card: {
    flex: 1,
    minWidth: 0
  },
  copy: {
    gap: spacing.xs,
    paddingTop: spacing.sm
  },
  heart: {
    alignItems: "center",
    backgroundColor: colors.surfaceTranslucent,
    borderRadius: radii.pill,
    height: 40,
    justifyContent: "center",
    position: "absolute",
    right: spacing.sm,
    top: spacing.sm,
    width: 40
  },
  image: {
    height: "100%",
    width: "100%"
  },
  imageFrame: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    height: 232,
    overflow: "hidden"
  },
  price: {
    color: colors.success,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 20
  },
  title: {
    color: colors.text,
    ...typography.body
  }
});
