import { Feather } from "@expo/vector-icons";
import {
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";

import {
  brandProducts,
  getBrandName,
  getBrandProducts
} from "../data/brandCatalog";
import type { BrandProduct } from "../data/brandCatalog";
import { getMerchandisingLabel } from "../utils/stylePersonalization";
import { colors, fonts, spacing, typography } from "../../../theme";

type BrandPlpScreenProps = {
  brandId: string;
  hasStyleProfile: boolean;
  onBack: () => void;
};

const filters = ["All", "Dresses", "Workwear", "Party", "Under ₹1999"];

function ProductTile({
  displayLabel,
  product,
  width
}: {
  displayLabel: string;
  product: BrandProduct;
  width: number;
}) {
  return (
    <Pressable accessibilityRole="button" style={[styles.productCard, { width }]}>
      <ImageBackground
        imageStyle={styles.productImageStyle}
        resizeMode="cover"
        source={{ uri: product.image }}
        style={styles.productImage}
      >
        <View style={styles.matchPill}>
          <Text style={styles.matchText}>{displayLabel}</Text>
        </View>
      </ImageBackground>
      <View style={styles.productInfo}>
        <Text numberOfLines={1} style={styles.productTitle}>
          {product.title}
        </Text>
        <Text style={styles.productPrice}>{product.price}</Text>
      </View>
    </Pressable>
  );
}

export function BrandPlpScreen({
  brandId,
  hasStyleProfile,
  onBack
}: BrandPlpScreenProps) {
  const { width } = useWindowDimensions();
  const title = getBrandName(brandId);
  const products = getBrandProducts(brandId);
  const cardWidth = (width - spacing.screen * 2 - spacing.sm) / 2;
  const productCount =
    brandId === "all-brands" ? brandProducts.length : products.length;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Back to home"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onBack}
          style={styles.backButton}
        >
          <Feather color={colors.text} name="arrow-left" size={24} />
        </Pressable>
        <View style={styles.headerCopy}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
          <Text style={styles.subtitle}>{productCount} looks ready to try on</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          contentContainerStyle={styles.filterTrack}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {filters.map((filter, index) => (
            <Pressable
              accessibilityRole="button"
              key={filter}
              style={[
                styles.filterPill,
                index === 0 ? styles.filterPillSelected : null
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  index === 0 ? styles.filterTextSelected : null
                ]}
              >
                {filter}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.grid}>
          {products.map((product, index) => (
            <ProductTile
              displayLabel={getMerchandisingLabel({
                fallbackIndex: index,
                hasStyleProfile,
                personalizedLabel: product.match
              })}
              key={product.id}
              product={product}
              width={cardWidth}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 36
  },
  content: {
    gap: spacing.lg,
    paddingBottom: 128,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md
  },
  filterPill: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    height: 36,
    justifyContent: "center",
    paddingHorizontal: 16
  },
  filterPillSelected: {
    backgroundColor: colors.text,
    borderWidth: 0
  },
  filterText: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 17
  },
  filterTextSelected: {
    color: colors.inverseText
  },
  filterTrack: {
    gap: spacing.sm
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  header: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: spacing.sm,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg
  },
  headerCopy: {
    flex: 1,
    minWidth: 0
  },
  matchPill: {
    alignSelf: "flex-start",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  matchText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    lineHeight: 13
  },
  productCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden"
  },
  productImage: {
    aspectRatio: 3 / 4,
    backgroundColor: colors.imageSurface,
    padding: spacing.sm
  },
  productImageStyle: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  productInfo: {
    gap: 3,
    padding: 10
  },
  productPrice: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16
  },
  productTitle: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1
  },
  subtitle: {
    color: colors.muted,
    ...typography.caption
  },
  title: {
    color: colors.text,
    ...typography.sectionHeading
  }
});
