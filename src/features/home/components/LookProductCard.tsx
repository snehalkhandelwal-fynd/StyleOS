import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "../../../theme";
import type { HomeProduct } from "../viewModels/useHomeViewModel";

type LookProductCardProps = {
  product: HomeProduct;
};

export function LookProductCard({ product }: LookProductCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.imageFrame}>
        <Image resizeMode="cover" source={{ uri: product.image }} style={styles.image} />
        <Pressable
          accessibilityLabel="Save product"
          accessibilityRole="button"
          style={styles.heart}
        >
          <Ionicons color={colors.text} name="heart-outline" size={20} />
        </Pressable>
      </View>
      <View style={styles.footer}>
        <Text style={styles.match}>Popular</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0
  },
  footer: {
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
  match: {
    color: colors.muted,
    ...typography.caption
  }
});
