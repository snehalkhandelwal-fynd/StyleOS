import { Feather, Ionicons } from "@expo/vector-icons";
import { useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  LayoutChangeEvent,
  LayoutAnimation,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View
} from "react-native";

import type { ProductListingProduct } from "../components/ProductListingScreen";
import type { ProductLook } from "./HomeScreen";
import { colors, fonts, spacing } from "../../../theme";

type ProductPdpScreenProps = {
  hasStyleProfile?: boolean;
  hasWardrobePairing?: boolean;
  onAddToCart?: () => void;
  onAskMira?: () => void;
  onBack: () => void;
  onOpenCart?: () => void;
  onOpenLook?: (look: ProductLook) => void;
  onOpenSearch?: () => void;
  onStartTryOn?: (context?: string) => void;
  product: ProductListingProduct;
};

type AccordionKey = "care" | "shipping";
type SizeOption = "XS" | "S" | "M" | "L" | "XL";
type StyledLook = {
  companionPieces: string;
  id: string;
  images: [string, string, string];
  name: string;
  occasion: string;
  price: string;
};
type Review = {
  bodyMatch: boolean;
  id: string;
  rating: number;
  reviewer: string;
  text: string;
};

const topSafeInset =
  Platform.OS === "ios" ? 44 : StatusBar.currentHeight ?? 0;
const bottomSafeInset = Platform.OS === "ios" ? 34 : 0;
const ctaDockBottomPadding = Platform.OS === "ios" ? spacing.lg : spacing.md;
const ctaDockHeight = 48 + spacing.md + ctaDockBottomPadding;
const pdpHeaderHeight = topSafeInset + 64;
const galleryDotsHeight = 30;
const sizeOptionsFallback: SizeOption[] = ["XS", "S", "M", "L", "XL"];
const detailImage =
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80";
const flatLayImage =
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80";
const modelImage =
  "https://images.unsplash.com/photo-1776633734216-26b0dbcf61d1?auto=format&fit=crop&w=900&q=80";
const trouserImage =
  "https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?auto=format&fit=crop&w=800&q=80";
const muleImage =
  "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80";
const denimImage =
  "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=800&q=80";
const shortImage =
  "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=800&q=80";
const bagImage =
  "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=800&q=80";
const skirtImage =
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80";
const shoeImage =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80";
const backViewImage =
  "https://images.unsplash.com/photo-1776633734832-ca4ad72e203a?auto=format&fit=crop&w=900&q=80";
const whiteShirtDetailImage =
  "https://images.unsplash.com/photo-1666358067414-c77508c771b2?auto=format&fit=crop&w=900&q=80";
const whiteShirtOnModelImage =
  "https://images.unsplash.com/photo-1776633734208-3cdf89a7fbf0?auto=format&fit=crop&w=900&q=80";
const whiteShirtFlatLayImage =
  "https://images.unsplash.com/photo-1772412926875-75097b7a0c08?auto=format&fit=crop&w=900&q=80";

function parsePriceValue(price: string) {
  return Number(price.replace(/[^\d]/g, "")) || 0;
}

function formatRupeePrice(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function getTryCopy(product: ProductListingProduct) {
  if (!product.tries) {
    return "847 tried this";
  }

  return product.tries.replace("tries", "tried this");
}

function getHeroImages(product: ProductListingProduct) {
  return [
    product.image,
    backViewImage,
    whiteShirtDetailImage,
    whiteShirtOnModelImage,
    whiteShirtFlatLayImage,
    detailImage,
    flatLayImage
  ];
}

function getHeroRating() {
  return {
    count: 29,
    value: "4.6"
  };
}

function getOccasionTags(product: ProductListingProduct) {
  return Array.from(
    new Set([product.occasion ?? "Work", "Casual", "Smart casual"])
  ).slice(0, 3);
}

function getDescription(product: ProductListingProduct) {
  const title = product.title.toLowerCase();

  if (title.includes("linen") || title.includes("shirt")) {
    return "Relaxed-fit linen shirt in crisp white. Breathable fabric, ideal for layering or wearing solo.";
  }

  if (title.includes("dress")) {
    return "Easy dress silhouette with a polished drape, made for warm days, dinners, and quick outfit decisions.";
  }

  return "A versatile piece with a clean shape, easy texture, and enough polish to style across your week.";
}

function getMiraNote(product: ProductListingProduct) {
  const title = product.title.toLowerCase();

  if (title.includes("linen") || title.includes("shirt")) {
    return "White linen is the hardest-working piece in a warm-weather wardrobe. Tuck it into wide-leg trousers for the office, layer it open over a tank on weekends, or roll the sleeves and pair with shorts for a beach lunch. The relaxed fit means it breathes, so you will reach for this on hot days.";
  }

  if (title.includes("dress")) {
    return "This dress works because the shape already carries the outfit. Keep the styling clean for daytime with flats and a soft tote, then switch to slingbacks and a compact bag for dinner. The key is letting the silhouette stay easy while the accessories set the mood.";
  }

  return `${product.title} is a strong anchor piece because it can shift between polished and relaxed styling. Pair it with one structured item when you want shape, or keep the rest soft and tonal when you want it to feel effortless.`;
}

function getMiraSummary(product: ProductListingProduct) {
  const title = product.title.toLowerCase();

  if (title.includes("linen") || title.includes("shirt")) {
    return "Mira would keep this airy and practical: wear it tucked with wide trousers for work, or open over a tank with shorts when you want an easier weekend look.";
  }

  if (title.includes("dress")) {
    return "Mira would let the silhouette lead and use accessories to shift it between daytime and dinner.";
  }

  return "Mira would style this as an anchor piece, then add one structured item when you want the outfit to feel more polished.";
}

function getStyledLooks(product: ProductListingProduct): StyledLook[] {
  return [
    {
      companionPieces: "Wide trousers · Block mules",
      id: "monday-sorted",
      images: [product.image, trouserImage, muleImage],
      name: "Monday sorted",
      occasion: "Work",
      price: "₹8,497 for 3 pieces"
    },
    {
      companionPieces: "Denim shorts · Soft tote",
      id: "weekend-air",
      images: [product.image, shortImage, bagImage],
      name: "Weekend air",
      occasion: "Casual",
      price: "₹5,897 for 3 pieces"
    },
    {
      companionPieces: "Slip skirt · Slingbacks",
      id: "dinner-ease",
      images: [product.image, skirtImage, shoeImage],
      name: "Dinner ease",
      occasion: "Date night",
      price: "₹7,296 for 3 pieces"
    },
    {
      companionPieces: "Straight denim · Mini bag",
      id: "city-layer",
      images: [product.image, denimImage, bagImage],
      name: "City layer",
      occasion: "Smart casual",
      price: "₹6,688 for 3 pieces"
    }
  ];
}

function getSimilarProducts(product: ProductListingProduct) {
  const basePrice = parsePriceValue(product.price) || 1299;

  return [
    {
      brand: product.brand ?? "Trends",
      context: product.occasion ?? "Work-ready",
      id: "similar-soft-shirt",
      image: modelImage,
      match: "89% your style",
      price: formatRupeePrice(basePrice + 300),
      title: "Relaxed collar shirt",
      tries: "840 tries"
    },
    {
      brand: "H&M",
      context: "Easy layer",
      id: "similar-linen-layer",
      image: detailImage,
      match: "87% your style",
      price: formatRupeePrice(basePrice + 150),
      title: "Textured linen shirt",
      tries: "430 tries"
    },
    {
      brand: "Zara",
      context: "Smart casual",
      id: "similar-crisp-shirt",
      image: flatLayImage,
      match: "92% your style",
      price: formatRupeePrice(basePrice + 600),
      title: "Crisp relaxed shirt",
      tries: "1.1k tries"
    },
    {
      brand: product.brand ?? "Trends",
      context: "Vacation",
      id: "similar-sheer-shirt",
      image: product.image,
      match: "90% your style",
      price: formatRupeePrice(basePrice + 420),
      title: "Airy resort shirt",
      tries: "680 tries"
    },
    {
      brand: "Vero Moda",
      context: "Soft tailoring",
      id: "similar-soft-top",
      image: skirtImage,
      match: "85% your style",
      price: formatRupeePrice(basePrice + 750),
      title: "Soft drape shirt",
      tries: "520 tries"
    },
    {
      brand: "H&M",
      context: "New this week",
      id: "similar-weekend-shirt",
      image: denimImage,
      match: "88% your style",
      price: formatRupeePrice(basePrice + 250),
      title: "Weekend cotton shirt",
      tries: "760 tries"
    }
  ];
}

function toProductLook(product: ProductListingProduct, look: StyledLook): ProductLook {
  return {
    brand: product.brand ?? "Trends",
    id: look.id,
    image: look.images[0],
    itemCount: "3 pieces",
    match: "91% your style",
    outfitItems: [
      { kind: "top", label: "Shirt" },
      { kind: "bottom", label: "Bottom" },
      { kind: "shoe", label: "Shoes" }
    ],
    price: look.price,
    title: look.name,
    tries: product.tries ?? "847 tries",
    vibe: look.occasion
  };
}

function ProductPdpHeader({
  isSaved,
  onBack,
  onOpenCart,
  onOpenSearch,
  onSave
}: {
  isSaved: boolean;
  onBack: () => void;
  onOpenCart?: () => void;
  onOpenSearch?: () => void;
  onSave: () => void;
}) {
  return (
    <View style={styles.pdpHeader}>
      <View style={styles.pdpHeaderRow}>
        <Pressable
          accessibilityLabel="Back"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onBack}
          style={({ pressed }) => [
            styles.headerBackButton,
            pressed ? styles.pressed : null
          ]}
        >
          <Feather color={colors.text} name="chevron-left" size={30} />
        </Pressable>

        <Pressable
          accessibilityLabel="Search StyleOS"
          accessibilityRole="button"
          onPress={onOpenSearch}
          style={({ pressed }) => [
            styles.headerSearchBar,
            pressed ? styles.pressed : null
          ]}
        >
          <Feather color={colors.soft} name="search" size={21} />
          <Text numberOfLines={1} style={styles.headerSearchText}>
            Search styles, occasions, pieces
          </Text>
        </Pressable>

        <Pressable
          accessibilityLabel={
            isSaved ? "Remove from wishlist" : "Add to wishlist"
          }
          accessibilityRole="button"
          hitSlop={8}
          onPress={onSave}
          style={({ pressed }) => [
            styles.headerIconButton,
            pressed ? styles.pressed : null
          ]}
        >
          <Ionicons
            color={colors.text}
            name={isSaved ? "heart" : "heart-outline"}
            size={25}
          />
        </Pressable>

        <Pressable
          accessibilityLabel="Open cart"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onOpenCart}
          style={({ pressed }) => [
            styles.headerIconButton,
            pressed ? styles.pressed : null
          ]}
        >
          <Feather color={colors.text} name="shopping-bag" size={24} />
        </Pressable>
      </View>
    </View>
  );
}

function HeroGallery({
  currentIndex,
  hasStyleProfile,
  heroHeight,
  images,
  onSlideChange,
  onSwipeEnd,
  onSwipeStart,
  onTryOn,
  product,
  width
}: {
  currentIndex: number;
  hasStyleProfile: boolean;
  heroHeight: number;
  images: string[];
  onSlideChange: (index: number) => void;
  onSwipeEnd?: () => void;
  onSwipeStart?: () => void;
  onTryOn?: (context?: string) => void;
  product: ProductListingProduct;
  width: number;
}) {
  const imageHeight = heroHeight - galleryDotsHeight;
  const rating = getHeroRating();
  const handleMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.min(
      images.length - 1,
      Math.max(0, Math.round(event.nativeEvent.contentOffset.x / width))
    );
    onSlideChange(nextIndex);
  };

  return (
    <View style={[styles.hero, { height: heroHeight }]}>
      <View style={[styles.heroImageStage, { height: imageHeight }]}>
        <ScrollView
          bounces={false}
          directionalLockEnabled
          horizontal
          nestedScrollEnabled
          onMomentumScrollBegin={onSwipeStart}
          onMomentumScrollEnd={(event) => {
            handleMomentumEnd(event);
            onSwipeEnd?.();
          }}
          onScrollBeginDrag={onSwipeStart}
          onScrollEndDrag={onSwipeEnd}
          pagingEnabled
          scrollEnabled
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          snapToInterval={width}
          decelerationRate="fast"
          style={styles.heroCarousel}
        >
          {images.map((image, index) => (
            <Image
              key={`${image}-${index}`}
              resizeMode="cover"
              source={{ uri: image }}
              style={[styles.heroImage, { height: imageHeight, width }]}
            />
          ))}
        </ScrollView>

        {hasStyleProfile ? (
          <View style={styles.heroMatchPill}>
            <Text style={styles.heroMatchText}>
              {product.match ?? "91% your style"}
            </Text>
          </View>
        ) : null}

        <View style={styles.heroTriesPill}>
          <Text style={styles.heroTriesText}>{getTryCopy(product)}</Text>
        </View>

        <Pressable
          accessibilityLabel={`See ${product.title} on your avatar`}
          accessibilityRole="button"
          onPress={() => onTryOn?.(product.title)}
          style={({ pressed }) => [
            styles.avatarPreviewButton,
            pressed ? styles.pressed : null
          ]}
        >
          <Image
            resizeMode="cover"
            source={{ uri: images[Math.min(3, images.length - 1)] }}
            style={styles.avatarPreviewImage}
          />
        </Pressable>

        <View style={styles.heroRatingPill}>
          <Text style={styles.heroRatingText}>{rating.value}</Text>
          <Ionicons color="#16A34A" name="star" size={13} />
          <View style={styles.heroRatingDivider} />
          <Text style={styles.heroRatingText}>{rating.count}</Text>
        </View>
      </View>

      <View style={styles.heroDots}>
        {images.map((image, index) => (
          <View
            key={`${image}-dot-${index}`}
            style={[
              styles.heroDot,
              index === currentIndex ? styles.heroDotActive : null
            ]}
          />
        ))}
      </View>
    </View>
  );
}

function ProductInfoStrip({ product }: { product: ProductListingProduct }) {
  const tags = getOccasionTags(product);

  return (
    <View style={styles.productInfoStrip}>
      <Text style={styles.productBrand}>{product.brand ?? "Trends"}</Text>
      <Text style={styles.productName}>{product.title}</Text>
      <Text numberOfLines={2} style={styles.description}>
        {getDescription(product)}
      </Text>
      <View style={styles.productPriceRow}>
        <Text
          style={[
            styles.currentPrice,
            product.discountPercent ? styles.currentPriceDiscounted : null
          ]}
        >
          {product.price}
        </Text>
        {product.originalPrice ? (
          <Text style={styles.originalPrice}>{product.originalPrice}</Text>
        ) : null}
        {product.discountPercent ? (
          <Text style={styles.discountText}>{product.discountPercent}% off</Text>
        ) : null}
      </View>
      <View style={styles.occasionRow}>
        {tags.map((tag) => (
          <View key={tag} style={styles.occasionPill}>
            <Text style={styles.occasionPillText}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function SizeSelectorSection({
  onOpenSizeChart,
  onSelectSize,
  selectedSize,
  sizes
}: {
  onOpenSizeChart: () => void;
  onSelectSize: (size: string) => void;
  selectedSize: string;
  sizes: string[];
}) {
  return (
    <View style={styles.sizeSelectorSection}>
      <View style={styles.inlineSectionHeader}>
        <Text style={styles.inlineSectionTitle}>Select size</Text>
        <Pressable
          accessibilityRole="button"
          onPress={onOpenSizeChart}
          hitSlop={8}
        >
          <Text style={styles.sizeChartLink}>Size chart</Text>
        </Pressable>
      </View>
      <View style={styles.sizeChoiceRow}>
        {sizes.map((size) => {
          const isSelected = size === selectedSize;

          return (
            <Pressable
              accessibilityLabel={`Select size ${size}`}
              accessibilityRole="button"
              key={size}
              onPress={() => onSelectSize(size)}
              style={({ pressed }) => [
                styles.sizeChoice,
                isSelected ? styles.sizeChoiceSelected : null,
                pressed ? styles.pressed : null
              ]}
            >
              <Text
                style={[
                  styles.sizeChoiceText,
                  isSelected ? styles.sizeChoiceTextSelected : null
                ]}
              >
                {size}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function DeliveryServicesSection({
  deliveryEstimate,
  onChangePincode,
  onCheckDelivery,
  pincode
}: {
  deliveryEstimate: string;
  onChangePincode: (value: string) => void;
  onCheckDelivery: () => void;
  pincode: string;
}) {
  return (
    <View style={styles.deliverySection}>
      <Text style={styles.inlineSectionTitle}>Delivery and services</Text>
      <View style={styles.pincodeRow}>
        <TextInput
          keyboardType="number-pad"
          maxLength={6}
          onChangeText={onChangePincode}
          placeholder="Enter pincode"
          placeholderTextColor={colors.soft}
          style={styles.pincodeInput}
          value={pincode}
        />
        <Pressable
          accessibilityRole="button"
          onPress={onCheckDelivery}
          style={({ pressed }) => [
            styles.checkDeliveryButton,
            pressed ? styles.pressed : null
          ]}
        >
          <Text style={styles.checkDeliveryText}>Check</Text>
        </Pressable>
      </View>
      <Text style={styles.deliveryEstimateText}>
        {deliveryEstimate || "Check delivery time, COD, and return service."}
      </Text>
    </View>
  );
}

function SizeChartScreen({
  onBack,
  product
}: {
  onBack: () => void;
  product: ProductListingProduct;
}) {
  const rows = [
    ["XS", "32", "26", "34"],
    ["S", "34", "28", "36"],
    ["M", "36", "30", "38"],
    ["L", "38", "32", "40"],
    ["XL", "40", "34", "42"]
  ];

  return (
    <View style={styles.sizeChartScreen}>
      <View style={styles.sizeChartHeader}>
        <Pressable
          accessibilityLabel="Back to product"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onBack}
          style={styles.headerBackButton}
        >
          <Feather color={colors.text} name="chevron-left" size={30} />
        </Pressable>
        <View style={styles.sizeChartHeaderCopy}>
          <Text style={styles.sizeChartTitle}>Size chart</Text>
          <Text numberOfLines={1} style={styles.sizeChartSubtitle}>
            {product.title}
          </Text>
        </View>
      </View>
      <View style={styles.sizeChartBody}>
        <View style={styles.sizeChartTable}>
          <View style={styles.sizeChartRowHeader}>
            {["Size", "Bust", "Waist", "Hip"].map((label) => (
              <Text key={label} style={styles.sizeChartHeaderCell}>
                {label}
              </Text>
            ))}
          </View>
          {rows.map((row) => (
            <View key={row[0]} style={styles.sizeChartRow}>
              {row.map((value) => (
                <Text key={`${row[0]}-${value}`} style={styles.sizeChartCell}>
                  {value}
                </Text>
              ))}
            </View>
          ))}
        </View>
        <Text style={styles.sizeChartNote}>
          Measurements are in inches. Pick your usual size for a relaxed fit.
        </Text>
      </View>
    </View>
  );
}

function SectionHeader({
  subtitle,
  title
}: {
  subtitle?: string;
  title: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

function StyledLookCard({
  look,
  onOpenLook,
  onTryOn,
  product
}: {
  look: StyledLook;
  onOpenLook?: (look: ProductLook) => void;
  onTryOn?: (context?: string) => void;
  product: ProductListingProduct;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onOpenLook?.(toProductLook(product, look))}
      style={({ pressed }) => [
        styles.styledLookCard,
        pressed ? styles.pressed : null
      ]}
    >
      <View style={styles.styledLookImageArea}>
        <View style={styles.styledLookTag}>
          <Text style={styles.styledLookTagText}>{look.occasion}</Text>
        </View>
        <View style={styles.outfitImageRow}>
          {look.images.map((image, index) => (
            <View
              key={`${look.id}-${image}-${index}`}
              style={[
                styles.outfitImageFrame,
                index === 0 ? styles.currentProductFrame : null
              ]}
            >
              <Image
                resizeMode="cover"
                source={{ uri: image }}
                style={styles.outfitImage}
              />
            </View>
          ))}
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => onTryOn?.(`${look.name} with ${product.title}`)}
          style={styles.tryOnLookPill}
        >
          <Text style={styles.tryOnLookText}>Try on look</Text>
        </Pressable>
      </View>
      <View style={styles.styledLookInfo}>
        <Text numberOfLines={1} style={styles.lookName}>
          {look.name}
        </Text>
        <Text numberOfLines={1} style={styles.companionPieces}>
          {look.companionPieces}
        </Text>
        <Text style={styles.lookPrice}>{look.price}</Text>
        <Text style={styles.seePiecesLink}>See all pieces →</Text>
      </View>
    </Pressable>
  );
}

function StyleThisItemSection({
  onAskMira,
  onOpenLook,
  onTryOn,
  product
}: {
  onAskMira?: () => void;
  onOpenLook?: (look: ProductLook) => void;
  onTryOn?: (context?: string) => void;
  product: ProductListingProduct;
}) {
  const looks = useMemo(() => getStyledLooks(product), [product]);

  return (
    <View style={styles.sectionBlock}>
      <SectionHeader
        subtitle={`${looks.length} complete looks featuring this ${product.title
          .split(" ")
          .slice(-1)[0]
          ?.toLowerCase() ?? "item"}`}
        title="Style this item"
      />
      <View style={styles.miraInlineCard}>
        <View style={styles.miraHeader}>
          <View style={styles.miraIcon}>
            <Text style={styles.miraIconText}>M</Text>
          </View>
          <Text style={styles.miraTitle}>Mira says</Text>
        </View>
        <Text style={styles.miraInlineCopy}>{getMiraSummary(product)}</Text>
        <Pressable accessibilityRole="button" onPress={onAskMira}>
          <Text style={styles.miraLink}>Ask Mira for more styling ideas →</Text>
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={styles.styledLookTrack}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {looks.map((look) => (
          <StyledLookCard
            key={look.id}
            look={look}
            onOpenLook={onOpenLook}
            onTryOn={onTryOn}
            product={product}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function WardrobePairingSection({
  product,
  visible,
  onTryOn
}: {
  onTryOn?: (context?: string) => void;
  product: ProductListingProduct;
  visible: boolean;
}) {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.sectionCard}>
      <Text style={styles.cardEyebrow}>From your wardrobe</Text>
      <View style={styles.wardrobeImageRow}>
        <View>
          <Image
            resizeMode="cover"
            source={{ uri: product.image }}
            style={styles.wardrobeImage}
          />
          <View style={styles.itemTag}>
            <Text style={styles.itemTagText}>New</Text>
          </View>
        </View>
        <View>
          <Image
            resizeMode="cover"
            source={{ uri: trouserImage }}
            style={styles.wardrobeImage}
          />
          <View style={styles.itemTag}>
            <Text style={styles.itemTagText}>Yours</Text>
          </View>
        </View>
      </View>
      <Text style={styles.wardrobeTitle}>
        This pairs with your black trousers
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => onTryOn?.(`${product.title} with black trousers`)}
        style={styles.cardPrimaryButton}
      >
        <Text style={styles.cardPrimaryButtonText}>Try on together</Text>
      </Pressable>
    </View>
  );
}

function MiraNoteSection({
  onAskMira,
  product
}: {
  onAskMira?: () => void;
  product: ProductListingProduct;
}) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.miraHeader}>
        <View style={styles.miraIcon}>
          <Text style={styles.miraIconText}>M</Text>
        </View>
        <Text style={styles.miraTitle}>Mira says</Text>
      </View>
      <Text style={styles.miraCopy}>
        {getMiraNote(product)}
      </Text>
      <Pressable accessibilityRole="button" onPress={onAskMira}>
        <Text style={styles.miraLink}>
          Ask Mira for more styling ideas →
        </Text>
      </Pressable>
    </View>
  );
}

function AccordionRow({
  children,
  isOpen,
  onPress,
  title
}: {
  children: React.ReactNode;
  isOpen: boolean;
  onPress: () => void;
  title: string;
}) {
  return (
    <View style={styles.accordionItem}>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={styles.accordionHeader}
      >
        <Text style={styles.accordionTitle}>{title}</Text>
        <Feather
          color={colors.text}
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={18}
        />
      </Pressable>
      {isOpen ? <View style={styles.accordionContent}>{children}</View> : null}
    </View>
  );
}

function ProductDetailsSection() {
  const [openSection, setOpenSection] = useState<AccordionKey>("care");
  const open = (key: AccordionKey) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenSection((current) => (current === key ? key : key));
  };

  return (
    <View style={styles.detailsBlock}>
      <AccordionRow
        isOpen={openSection === "care"}
        onPress={() => open("care")}
        title="Material and care"
      >
        <Text style={styles.accordionText}>
          100% linen. Machine wash cold. Hang dry.
        </Text>
      </AccordionRow>
      <AccordionRow
        isOpen={openSection === "shipping"}
        onPress={() => open("shipping")}
        title="Shipping and returns"
      >
        <Text style={styles.accordionText}>
          Free shipping over ₹1,999. 15-day easy returns. COD available.
        </Text>
      </AccordionRow>
    </View>
  );
}

const reviews: Review[] = [
  {
    bodyMatch: true,
    id: "review-priya",
    rating: 5,
    reviewer: "Priya M. · Bought M",
    text: "The fabric feels light but not flimsy. I wore it tucked into trousers and it looked polished all day."
  },
  {
    bodyMatch: false,
    id: "review-anika",
    rating: 4,
    reviewer: "Anika S. · Bought S",
    text: "Runs relaxed in the shoulder, which I liked. The white is clean and layers well over tanks."
  },
  {
    bodyMatch: true,
    id: "review-neha",
    rating: 5,
    reviewer: "Neha R. · Bought L",
    text: "Great for humid days. The fit gave enough room without looking oversized."
  }
];

function RatingStars({ rating }: { rating: number }) {
  return (
    <View style={styles.starRow}>
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < rating;

        return (
          <Ionicons
            color={filled ? colors.text : colors.border}
            key={index}
            name={filled ? "star" : "star-outline"}
            size={14}
          />
        );
      })}
    </View>
  );
}

function ReviewsSection({ product }: { product: ProductListingProduct }) {
  return (
    <View style={styles.sectionBlock}>
      <SectionHeader
        subtitle={`Based on ${product.tryCount ?? 847} tries and 124 reviews`}
        title="What people are saying"
      />
      <ScrollView
        contentContainerStyle={styles.reviewTrack}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <RatingStars rating={review.rating} />
            <Text numberOfLines={2} style={styles.reviewText}>
              {review.text}
            </Text>
            <Text style={styles.reviewerText}>
              {review.reviewer}
              {review.bodyMatch ? " · Similar body type" : ""}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function SimilarProductCard({
  product
}: {
  product: ReturnType<typeof getSimilarProducts>[number];
}) {
  return (
    <Pressable accessibilityRole="button" style={styles.similarProductCard}>
      <View style={styles.similarImageWrap}>
        <Image
          resizeMode="cover"
          source={{ uri: product.image }}
          style={styles.similarProductImage}
        />
        <View style={styles.similarMatchPill}>
          <Text style={styles.similarMatchText}>{product.match}</Text>
        </View>
        <View style={styles.similarTryPill}>
          <Text style={styles.similarTryText}>{product.tries}</Text>
        </View>
        <View style={styles.similarTryOnPill}>
          <Text style={styles.similarTryOnText}>Try on</Text>
        </View>
      </View>
      <View style={styles.similarProductInfo}>
        <Text numberOfLines={1} style={styles.similarBrand}>
          {product.brand}
        </Text>
        <Text numberOfLines={1} style={styles.similarTitle}>
          {product.title}
        </Text>
        <Text style={styles.similarPrice}>{product.price}</Text>
        <Text numberOfLines={1} style={styles.similarContext}>
          {product.context}
        </Text>
      </View>
    </Pressable>
  );
}

function SimilarProductsSection({
  product
}: {
  product: ProductListingProduct;
}) {
  const products = useMemo(() => getSimilarProducts(product), [product]);

  return (
    <View style={styles.sectionBlock}>
      <SectionHeader title="Similar products" />
      <ScrollView
        contentContainerStyle={styles.similarTrack}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {products.map((item) => (
          <SimilarProductCard key={item.id} product={item} />
        ))}
      </ScrollView>
    </View>
  );
}

function ProductCtaButtons({
  onAddToCart,
  onTryOn,
  product
}: {
  onAddToCart?: () => void;
  onTryOn?: (context?: string) => void;
  product: ProductListingProduct;
}) {
  return (
    <View style={styles.ctaButtonRow}>
      <Pressable
        accessibilityRole="button"
        onPress={() => onTryOn?.(product.title)}
        style={({ pressed }) => [
          styles.tryOnButton,
          pressed ? styles.pressed : null
        ]}
      >
        <Text style={styles.tryOnButtonText}>Try this on me</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={onAddToCart}
        style={({ pressed }) => [
          styles.addToCartButton,
          pressed ? styles.pressed : null
        ]}
      >
        <Text style={styles.addToCartText}>Add to cart</Text>
      </Pressable>
    </View>
  );
}

function StickyCtaBar({
  onAddToCart,
  onTryOn,
  product
}: {
  onAddToCart?: () => void;
  onTryOn?: (context?: string) => void;
  product: ProductListingProduct;
}) {
  return (
    <View style={styles.ctaDock}>
      <ProductCtaButtons
        onAddToCart={onAddToCart}
        onTryOn={onTryOn}
        product={product}
      />
    </View>
  );
}

function InlineCtaSection({
  onLayout,
  onAddToCart,
  onTryOn,
  product
}: {
  onLayout?: (event: LayoutChangeEvent) => void;
  onAddToCart?: () => void;
  onTryOn?: (context?: string) => void;
  product: ProductListingProduct;
}) {
  return (
    <View onLayout={onLayout} style={styles.inlineCtaSection}>
      <ProductCtaButtons
        onAddToCart={onAddToCart}
        onTryOn={onTryOn}
        product={product}
      />
    </View>
  );
}

export function ProductPdpScreen({
  hasStyleProfile = false,
  hasWardrobePairing = true,
  onAddToCart,
  onAskMira,
  onBack,
  onOpenCart,
  onOpenLook,
  onOpenSearch,
  onStartTryOn,
  product
}: ProductPdpScreenProps) {
  const { height, width } = useWindowDimensions();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [deliveryEstimate, setDeliveryEstimate] = useState("");
  const [isGallerySwiping, setIsGallerySwiping] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [inlineCtaY, setInlineCtaY] = useState<number | null>(null);
  const [pincode, setPincode] = useState("");
  const [selectedSize, setSelectedSize] = useState(
    product.sizeOptions?.[0] ?? "M"
  );
  const [showStickyCta, setShowStickyCta] = useState(true);
  const heroHeight = Math.min(width * 4 / 3, height * 0.58);
  const heroImages = useMemo(() => getHeroImages(product), [product]);
  const availableSizes = product.sizeOptions ?? sizeOptionsFallback;
  const handleDeliveryCheck = () => {
    const nextEstimate =
      pincode.trim().length === 6
        ? "Estimated delivery in 3-4 days. 15-day easy returns available."
        : "Enter a 6-digit pincode to check delivery.";

    setDeliveryEstimate(nextEstimate);
  };
  const handlePdpScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = Math.max(0, event.nativeEvent.contentOffset.y);
    const scrollBottomBeforeDock = offsetY + height - ctaDockHeight;
    const shouldShowStickyCta =
      inlineCtaY === null || scrollBottomBeforeDock < inlineCtaY;

    setShowStickyCta((current) =>
      current === shouldShowStickyCta ? current : shouldShowStickyCta
    );
  };

  if (isSizeChartOpen) {
    return (
      <SizeChartScreen
        onBack={() => setIsSizeChartOpen(false)}
        product={product}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <ProductPdpHeader
        isSaved={isSaved}
        onBack={onBack}
        onOpenCart={onOpenCart ?? onAddToCart}
        onOpenSearch={onOpenSearch}
        onSave={() => setIsSaved((current) => !current)}
      />
      <Animated.ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: ctaDockHeight + spacing.lg,
            paddingTop: pdpHeaderHeight
          }
        ]}
        directionalLockEnabled
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { listener: handlePdpScroll, useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        scrollEnabled={!isGallerySwiping}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ height: heroHeight }}>
          <HeroGallery
            currentIndex={currentImageIndex}
            hasStyleProfile={hasStyleProfile}
            heroHeight={heroHeight}
            images={heroImages}
            onSlideChange={setCurrentImageIndex}
            onSwipeEnd={() => setIsGallerySwiping(false)}
            onSwipeStart={() => setIsGallerySwiping(true)}
            onTryOn={onStartTryOn}
            product={product}
            width={width}
          />
        </View>
        <View style={styles.contentSheet}>
          <ProductInfoStrip product={product} />
          <SizeSelectorSection
            onOpenSizeChart={() => setIsSizeChartOpen(true)}
            onSelectSize={setSelectedSize}
            selectedSize={selectedSize}
            sizes={availableSizes}
          />
          <InlineCtaSection
            onLayout={(event) => {
              const nextY = event.nativeEvent.layout.y;
              setInlineCtaY((current) => (current === nextY ? current : nextY));
            }}
            onAddToCart={onAddToCart}
            onTryOn={onStartTryOn}
            product={product}
          />
          <DeliveryServicesSection
            deliveryEstimate={deliveryEstimate}
            onChangePincode={setPincode}
            onCheckDelivery={handleDeliveryCheck}
            pincode={pincode}
          />
          <WardrobePairingSection
            onTryOn={onStartTryOn}
            product={product}
            visible={hasWardrobePairing}
          />
          <StyleThisItemSection
            onAskMira={onAskMira}
            onOpenLook={onOpenLook}
            onTryOn={onStartTryOn}
            product={product}
          />
          <ProductDetailsSection />
          <ReviewsSection product={product} />
          <SimilarProductsSection product={product} />
          <View style={styles.bottomSpacer} />
        </View>
      </Animated.ScrollView>

      {showStickyCta ? (
        <StickyCtaBar
          onAddToCart={onAddToCart}
          onTryOn={onStartTryOn}
          product={product}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  accordionContent: {
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.screen
  },
  accordionHeader: {
    alignItems: "center",
    flexDirection: "row",
    height: 56,
    justifyContent: "space-between",
    paddingHorizontal: spacing.screen
  },
  accordionItem: {
    borderBottomColor: colors.border,
    borderBottomWidth: 0.5
  },
  accordionText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 21
  },
  accordionTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 15,
    lineHeight: 20
  },
  addToCartButton: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: 999,
    flex: 1,
    height: 48,
    justifyContent: "center"
  },
  addToCartText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18
  },
  bottomSpacer: {
    height: spacing.lg
  },
  cardEyebrow: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14
  },
  cardPrimaryButton: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: 10,
    height: 40,
    justifyContent: "center",
    marginTop: spacing.md
  },
  cardPrimaryButtonText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 17
  },
  checkDeliveryButton: {
    alignItems: "center",
    backgroundColor: colors.text,
    height: 44,
    justifyContent: "center",
    paddingHorizontal: spacing.lg
  },
  checkDeliveryText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 17
  },
  companionPieces: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 14,
    marginTop: 3
  },
  content: {},
  contentSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -spacing.xl,
    overflow: "hidden"
  },
  ctaButtonRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%"
  },
  ctaDock: {
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: 0.5,
    bottom: 0,
    elevation: 14,
    left: 0,
    paddingBottom: ctaDockBottomPadding,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    position: "absolute",
    right: 0,
    shadowColor: "#000000",
    shadowOffset: { height: -4, width: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 12
  },
  currentPrice: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 23
  },
  currentPriceDiscounted: {
    color: "#119C46"
  },
  currentProductFrame: {
    borderColor: colors.text,
    borderWidth: 1.5
  },
  description: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
    marginTop: spacing.sm
  },
  detailsBlock: {
    backgroundColor: colors.background,
    marginTop: spacing.lg
  },
  discountText: {
    color: "#119C46",
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18
  },
  deliveryEstimateText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    marginTop: spacing.sm
  },
  deliverySection: {
    borderTopColor: colors.border,
    borderTopWidth: 0.5,
    marginHorizontal: spacing.screen,
    paddingBottom: spacing.lg,
    paddingTop: spacing.lg
  },
  findSizeButton: {
    alignSelf: "flex-start",
    borderColor: colors.text,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: spacing.md,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  findSizeText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 15
  },
  headerBackButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    marginLeft: -6,
    width: 38
  },
  headerIconButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 36
  },
  headerSearchBar: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: spacing.sm,
    height: 44,
    minWidth: 0,
    paddingHorizontal: spacing.md
  },
  headerSearchText: {
    color: colors.soft,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 18
  },
  hero: {
    backgroundColor: colors.background,
    overflow: "hidden"
  },
  heroCarousel: {
    flex: 1
  },
  heroDot: {
    backgroundColor: colors.border,
    borderRadius: 4,
    height: 7,
    width: 7
  },
  heroDotActive: {
    backgroundColor: colors.text,
    width: 18
  },
  heroDots: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    height: galleryDotsHeight,
    justifyContent: "center"
  },
  heroImage: {
    backgroundColor: colors.surface
  },
  heroImageStage: {
    backgroundColor: colors.surface,
    overflow: "hidden"
  },
  heroMatchPill: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 0.5,
    left: spacing.screen,
    paddingHorizontal: 12,
    paddingVertical: 5,
    position: "absolute",
    top: spacing.lg
  },
  heroMatchText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14
  },
  heroTriesPill: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 20,
    bottom: spacing.lg,
    left: spacing.screen,
    paddingHorizontal: 10,
    paddingVertical: 4,
    position: "absolute"
  },
  heroTriesText: {
    color: colors.inverseText,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14
  },
  heroRatingDivider: {
    backgroundColor: colors.border,
    height: 18,
    width: 1
  },
  heroRatingPill: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 0.5,
    bottom: spacing.lg,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    position: "absolute",
    right: spacing.screen
  },
  heroRatingText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 16
  },
  avatarPreviewButton: {
    backgroundColor: colors.imageSurface,
    borderColor: colors.background,
    borderRadius: 35,
    borderWidth: 3,
    bottom: 58,
    elevation: 6,
    height: 70,
    overflow: "hidden",
    position: "absolute",
    right: spacing.screen + 2,
    shadowColor: "#000000",
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    width: 70
  },
  avatarPreviewImage: {
    height: "100%",
    width: "100%"
  },
  inlineCtaSection: {
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.screen
  },
  inlineSectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  inlineSectionTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 16,
    lineHeight: 21
  },
  itemTag: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 0.5,
    left: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    position: "absolute",
    top: 5
  },
  itemTagText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 9,
    lineHeight: 12
  },
  lookName: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 13,
    lineHeight: 17
  },
  lookPrice: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 15,
    marginTop: spacing.sm
  },
  miraCopy: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 21,
    marginTop: spacing.sm
  },
  miraInlineCard: {
    backgroundColor: colors.surfaceTertiary,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 0.5,
    marginBottom: spacing.md,
    marginHorizontal: spacing.screen,
    padding: 12
  },
  miraInlineCopy: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    marginTop: spacing.sm
  },
  miraHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  miraIcon: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: 12,
    height: 24,
    justifyContent: "center",
    width: 24
  },
  miraIconText: {
    color: colors.inverseText,
    fontFamily: fonts.heading,
    fontSize: 12,
    lineHeight: 15
  },
  miraLink: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    marginTop: spacing.md,
    textDecorationLine: "underline"
  },
  miraTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 14,
    lineHeight: 18
  },
  occasionPill: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  occasionPillText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14
  },
  occasionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 6
  },
  originalPrice: {
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 18,
    textDecorationLine: "line-through"
  },
  pincodeInput: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    height: 44,
    lineHeight: 18,
    paddingHorizontal: spacing.md
  },
  pincodeRow: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    marginTop: spacing.md,
    overflow: "hidden"
  },
  outfitImage: {
    height: "100%",
    width: "100%"
  },
  outfitImageFrame: {
    backgroundColor: colors.imageSurface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 0.5,
    flex: 1,
    height: 112,
    overflow: "hidden"
  },
  outfitImageRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    marginTop: 35,
    paddingHorizontal: 10
  },
  pdpHeader: {
    backgroundColor: colors.background,
    borderBottomColor: colors.border,
    borderBottomWidth: 0.5,
    elevation: 8,
    height: pdpHeaderHeight,
    justifyContent: "flex-end",
    left: 0,
    paddingHorizontal: spacing.screen,
    paddingTop: topSafeInset,
    position: "absolute",
    right: 0,
    shadowColor: "#000000",
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    top: 0,
    zIndex: 20
  },
  pdpHeaderRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    height: 64
  },
  pressed: {
    opacity: 0.72
  },
  productBrand: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18
  },
  productInfoStrip: {
    backgroundColor: colors.background,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.screen,
    paddingTop: 20
  },
  productName: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 22,
    lineHeight: 28,
    marginTop: 3
  },
  productPriceRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md
  },
  reviewCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 0.5,
    padding: 12,
    width: 205
  },
  reviewerText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 15,
    marginTop: spacing.sm
  },
  reviewText: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 6
  },
  reviewTrack: {
    gap: 10,
    paddingHorizontal: spacing.screen
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1
  },
  sectionBlock: {
    marginTop: spacing.xl
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 0.5,
    marginHorizontal: spacing.screen,
    marginTop: spacing.xl,
    padding: 14
  },
  sectionHeader: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.screen
  },
  sectionSubtitle: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 23
  },
  seePiecesLink: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 14,
    marginTop: 6,
    textDecorationLine: "underline"
  },
  similarBrand: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 15
  },
  similarContext: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 13,
    marginTop: 2
  },
  similarImageWrap: {
    backgroundColor: colors.imageSurface,
    height: 128,
    position: "relative"
  },
  similarMatchPill: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 0.5,
    left: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    position: "absolute",
    top: 8
  },
  similarMatchText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 9,
    lineHeight: 12
  },
  similarPrice: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 15,
    marginTop: 3
  },
  similarProductCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 0.5,
    overflow: "hidden",
    width: 150
  },
  similarProductImage: {
    height: "100%",
    width: "100%"
  },
  similarProductInfo: {
    padding: 8
  },
  similarTitle: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
    marginTop: 3
  },
  similarTrack: {
    gap: 10,
    paddingHorizontal: spacing.screen
  },
  similarTryOnPill: {
    backgroundColor: colors.text,
    borderRadius: 8,
    bottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: "absolute",
    right: 8
  },
  similarTryOnText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 9,
    lineHeight: 12
  },
  similarTryPill: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 0.5,
    bottom: 8,
    left: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    position: "absolute"
  },
  similarTryText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 9,
    lineHeight: 12
  },
  sizeChartBody: {
    padding: spacing.screen
  },
  sizeChartCell: {
    color: colors.muted,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center"
  },
  sizeChartHeader: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: 0.5,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: topSafeInset + 70,
    paddingBottom: 10,
    paddingHorizontal: spacing.screen,
    paddingTop: topSafeInset + spacing.sm
  },
  sizeChartHeaderCell: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center"
  },
  sizeChartHeaderCopy: {
    flex: 1,
    minWidth: 0
  },
  sizeChartNote: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    marginTop: spacing.md
  },
  sizeChartRow: {
    borderTopColor: colors.border,
    borderTopWidth: 0.5,
    flexDirection: "row",
    paddingVertical: 12
  },
  sizeChartRowHeader: {
    flexDirection: "row",
    paddingBottom: 12
  },
  sizeChartScreen: {
    backgroundColor: colors.background,
    flex: 1
  },
  sizeChartSubtitle: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 17
  },
  sizeChartTable: {
    backgroundColor: colors.surfaceTertiary,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 0.5,
    padding: spacing.md
  },
  sizeChartTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 25
  },
  sizeChartLink: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    textDecorationLine: "underline"
  },
  sizeCell: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 0.5,
    flex: 1,
    height: 34,
    justifyContent: "center"
  },
  sizeCellText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 15
  },
  sizeTable: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md
  },
  sizeChoice: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    minWidth: 52,
    paddingHorizontal: 14
  },
  sizeChoiceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md
  },
  sizeChoiceSelected: {
    backgroundColor: colors.text,
    borderColor: colors.text
  },
  sizeChoiceText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 17
  },
  sizeChoiceTextSelected: {
    color: colors.inverseText
  },
  sizeSelectorSection: {
    borderTopColor: colors.border,
    borderTopWidth: 0.5,
    marginHorizontal: spacing.screen,
    paddingBottom: spacing.lg,
    paddingTop: spacing.lg
  },
  starRow: {
    flexDirection: "row",
    gap: 2
  },
  styledLookCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 0.5,
    height: 270,
    overflow: "hidden",
    width: 200
  },
  styledLookImageArea: {
    backgroundColor: colors.surface,
    height: 170,
    position: "relative"
  },
  styledLookInfo: {
    backgroundColor: colors.background,
    height: 100,
    padding: 10
  },
  styledLookTag: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 0.5,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: "absolute",
    top: 10,
    zIndex: 2
  },
  styledLookTagText: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 9,
    lineHeight: 12
  },
  styledLookTrack: {
    gap: 10,
    paddingHorizontal: spacing.screen
  },
  tryOnButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.text,
    borderRadius: 999,
    borderWidth: 1,
    flex: 1,
    height: 48,
    justifyContent: "center"
  },
  tryOnButtonText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18
  },
  tryOnLookPill: {
    backgroundColor: colors.text,
    borderRadius: 6,
    bottom: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    position: "absolute",
    right: 10
  },
  tryOnLookText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 9,
    lineHeight: 12
  },
  wardrobeImage: {
    backgroundColor: colors.imageSurface,
    borderRadius: 10,
    height: 80,
    width: 60
  },
  wardrobeImageRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm
  },
  wardrobeTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 14,
    lineHeight: 18,
    marginTop: spacing.sm
  }
});
