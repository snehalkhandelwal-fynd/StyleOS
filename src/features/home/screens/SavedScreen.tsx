import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import { colors, fonts, radii, spacing } from "../../../theme";
import { prototypeProductImages } from "../data/prototypeProductImages";

type SavedTab = "All" | "Looks" | "Products" | "Shared";
type SavedFilter = "All" | "Price dropped" | "In stock" | "Work" | "Casual";

type SavedPiece = {
  category: string;
  id: string;
  image: string;
  isOutOfStock?: boolean;
  isOwned?: boolean;
  name: string;
};

type SavedLook = {
  id: string;
  image: string;
  isCreatedByUser?: boolean;
  match: string;
  message?: string;
  oldPrice?: string;
  pieceCount: number;
  pieces: SavedPiece[];
  price: string;
  priceDrop?: string;
  savedAmount?: string;
  savedDate: string;
  sharedBy?: string;
  sharedDate?: string;
  soldOutPieceName?: string;
  title: string;
  type: "look" | "shared";
  vibe: string;
  wardrobeNote?: string;
};

type SavedProduct = {
  brand: string;
  id: string;
  image: string;
  isOutOfStock?: boolean;
  match: string;
  oldPrice?: string;
  price: string;
  priceDrop?: string;
  savedDate: string;
  title: string;
  type: "product";
  wardrobeTag?: string;
};

type SavedItem = SavedLook | SavedProduct;

type SavedScreenProps = {
  onBack?: () => void;
  onExplore?: () => void;
  onTryOn?: (context?: string) => void;
};

const tabOrder: Array<{
  count: number;
  key: SavedTab;
  label: string;
}> = [
  { count: 22, key: "All", label: "All" },
  { count: 12, key: "Looks", label: "Looks" },
  { count: 8, key: "Products", label: "Products" },
  { count: 2, key: "Shared", label: "Shared" }
];

const filterChips: SavedFilter[] = [
  "All",
  "Price dropped",
  "In stock",
  "Work",
  "Casual"
];

const pieces: SavedPiece[] = [
  {
    category: "Top",
    id: "shirt",
    image: prototypeProductImages.maje.ivoryMiniDress,
    isOwned: true,
    name: "White linen shirt"
  },
  {
    category: "Bottom",
    id: "trouser",
    image: prototypeProductImages.maje.blueScarfTrousers,
    name: "Wide-leg trousers"
  },
  {
    category: "Bag",
    id: "bag",
    image: prototypeProductImages.shopThisLook.brownBag,
    name: "Structured bag"
  },
  {
    category: "Shoe",
    id: "shoe",
    image: prototypeProductImages.shopThisLook.brownShoes,
    isOutOfStock: true,
    name: "Block heel mules"
  }
];

const savedLooks: SavedLook[] = [
  {
    id: "look-workday-neutral",
    image: prototypeProductImages.sandro.whitePinstripeSuit,
    match: "92% match",
    oldPrice: "₹7,497",
    pieceCount: 4,
    pieces,
    price: "₹6,498",
    priceDrop: "₹999 saved",
    savedAmount: "₹999 saved",
    savedDate: "Saved 3 days ago",
    soldOutPieceName: "Block heel mules",
    title: "Workday neutral",
    type: "look",
    vibe: "Work · Minimalist",
    wardrobeNote: "You own the shirt — complete for ₹6,498"
  },
  {
    id: "look-custom",
    image: prototypeProductImages.maje.pinkRelaxedSet,
    isCreatedByUser: true,
    match: "88% match",
    pieceCount: 3,
    pieces: pieces.slice(0, 3),
    price: "₹4,899",
    savedDate: "Saved yesterday",
    title: "Your custom look",
    type: "look",
    vibe: "Casual · Soft"
  }
];

const sharedLooks: SavedLook[] = [
  {
    id: "shared-priya-wedding",
    image: prototypeProductImages.sandro.beigeTrench,
    match: "89% match",
    message: "This would look amazing on you for the wedding",
    pieceCount: 4,
    pieces: [
      pieces[0],
      {
        category: "Dress",
        id: "dress",
        image: prototypeProductImages.maje.beigeCrochetDress,
        name: "Soft column dress"
      },
      pieces[2],
      pieces[3]
    ],
    price: "₹9,299",
    savedDate: "Shared 2 days ago",
    sharedBy: "Priya",
    sharedDate: "2 days ago",
    title: "Festive ease",
    type: "shared",
    vibe: "Festive · Polished"
  }
];

const savedProducts: SavedProduct[] = [
  {
    brand: "Trends",
    id: "product-linen-shirt",
    image: prototypeProductImages.maje.greenDenimTop,
    match: "91% match",
    oldPrice: "₹2,165",
    price: "₹1,299",
    priceDrop: "₹400 off",
    savedDate: "Saved today",
    title: "White linen shirt",
    type: "product",
    wardrobeTag: "Goes with your wardrobe"
  },
  {
    brand: "Sandro",
    id: "product-pinstripe",
    image: prototypeProductImages.sandro.whitePinstripeSuit,
    match: "Try now",
    price: "₹3,299",
    savedDate: "Saved 4 days ago",
    title: "Pleated wide-leg trousers",
    type: "product",
    wardrobeTag: "Goes with your wardrobe"
  },
  {
    brand: "Maje",
    id: "product-party",
    image: prototypeProductImages.maje.sheerPartyDress,
    isOutOfStock: true,
    match: "88% match",
    price: "₹6,199",
    savedDate: "Saved 1 week ago",
    title: "Party satin dress",
    type: "product"
  }
];

const allItems: SavedItem[] = [
  savedLooks[0],
  savedProducts[0],
  sharedLooks[0],
  savedProducts[1],
  savedLooks[1],
  savedProducts[2]
];

function getItemsForTab(tab: SavedTab, filter: SavedFilter) {
  const baseItems: SavedItem[] =
    tab === "Looks"
      ? savedLooks
      : tab === "Products"
        ? savedProducts
        : tab === "Shared"
          ? sharedLooks
          : allItems;

  if (filter === "Price dropped") {
    return baseItems.filter((item) => Boolean(item.priceDrop));
  }

  if (filter === "In stock") {
    return baseItems.filter((item) => {
      if (item.type === "product") {
        return !item.isOutOfStock;
      }

      return !item.pieces.some((piece) => piece.isOutOfStock);
    });
  }

  if (filter === "Work") {
    return baseItems.filter((item) =>
      item.type === "product" ? item.wardrobeTag : item.vibe.includes("Work")
    );
  }

  if (filter === "Casual") {
    return baseItems.filter((item) =>
      item.type === "product" ? item.title.includes("trousers") : item.vibe.includes("Casual")
    );
  }

  return baseItems;
}

function SavedHeader({
  onBack,
  onOpenFilters
}: {
  onBack?: () => void;
  onOpenFilters?: () => void;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTopRow}>
        <Pressable
          accessibilityLabel="Back"
          accessibilityRole="button"
          onPress={onBack}
          style={({ pressed }) => [
            styles.headerIconButton,
            pressed ? styles.pressed : null
          ]}
        >
          <Feather color={colors.text} name="chevron-left" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Saved</Text>
        <Pressable
          accessibilityLabel="Sort and filter saved items"
          accessibilityRole="button"
          onPress={onOpenFilters}
          style={({ pressed }) => [
            styles.headerIconButton,
            pressed ? styles.pressed : null
          ]}
        >
          <Feather color={colors.text} name="sliders" size={21} />
        </Pressable>
      </View>
      <Text style={styles.countStrip}>12 looks · 8 products · 2 shared</Text>
    </View>
  );
}

function SavedTabs({
  activeTab,
  onChangeTab
}: {
  activeTab: SavedTab;
  onChangeTab: (tab: SavedTab) => void;
}) {
  return (
    <ScrollView
      contentContainerStyle={styles.tabRow}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {tabOrder.map((tab) => {
        const isSelected = tab.key === activeTab;
        const label = `${tab.label} (${tab.count})`;

        return (
          <Pressable
            accessibilityLabel={`Show ${label}`}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            key={tab.key}
            onPress={() => onChangeTab(tab.key)}
            style={({ pressed }) => [
              styles.tabPill,
              isSelected ? styles.tabPillSelected : null,
              pressed ? styles.pressed : null
            ]}
          >
            <Text
              style={[
                styles.tabText,
                isSelected ? styles.tabTextSelected : null
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function SavedFilterChips({
  activeFilter,
  onChangeFilter
}: {
  activeFilter: SavedFilter;
  onChangeFilter: (filter: SavedFilter) => void;
}) {
  return (
    <ScrollView
      contentContainerStyle={styles.filterRow}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {filterChips.map((filter) => {
        const isSelected = filter === activeFilter;

        return (
          <Pressable
            accessibilityLabel={`Filter wishlist by ${filter}`}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            key={filter}
            onPress={() => onChangeFilter(filter)}
            style={({ pressed }) => [
              styles.filterChip,
              isSelected ? styles.filterChipSelected : null,
              pressed ? styles.pressed : null
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                isSelected ? styles.filterChipTextSelected : null
              ]}
            >
              {filter}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function PriceDropSection({ onTryOn }: { onTryOn?: (context?: string) => void }) {
  const droppedItems = allItems.filter((item) => Boolean(item.priceDrop));

  if (droppedItems.length === 0) {
    return null;
  }

  return (
    <View style={styles.priceDropSection}>
      <View style={styles.priceDropHeader}>
        <View style={styles.priceDropTitleRow}>
          <Feather color={colors.text} name="trending-down" size={16} />
          <Text style={styles.priceDropTitle}>Price dropped</Text>
        </View>
        <Text style={styles.priceDropCopy}>
          {droppedItems.length} items since you saved
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.priceDropTrack}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {droppedItems.map((item) =>
          item.type === "product" ? (
            <SavedProductCard
              compact
              key={item.id}
              onTryOn={onTryOn}
              product={item}
              width={280}
            />
          ) : (
            <View key={item.id} style={styles.priceDropLookWrap}>
              <SavedLookCard look={item} onTryOn={onTryOn} showPriceDropBadge />
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
}

function getAvailablePieceCount(look: SavedLook) {
  return look.pieces.filter((piece) => !piece.isOutOfStock && !piece.isOwned)
    .length;
}

function getLookPriceLine(look: SavedLook) {
  if (look.soldOutPieceName) {
    return {
      current: "₹4,499",
      old: look.priceDrop ? "₹5,498" : undefined,
      pieceCount: 2
    };
  }

  return {
    current: look.price,
    old: look.oldPrice,
    pieceCount: look.pieceCount
  };
}

function getLookContext(look: SavedLook) {
  const contextParts: string[] = [];

  if (look.pieces.some((piece) => piece.isOwned)) {
    contextParts.push("You own the shirt");
  }

  const soldOutCount = look.pieces.filter((piece) => piece.isOutOfStock).length;

  if (soldOutCount > 0) {
    contextParts.push(`${soldOutCount} piece sold out`);
  }

  if (look.isCreatedByUser) {
    contextParts.push("Created by you");
  }

  return contextParts.join(" · ") || look.savedDate;
}

function PieceThumbCluster({ pieces }: { pieces: SavedPiece[] }) {
  return (
    <View style={styles.compactPieceCluster}>
      {pieces.slice(0, 4).map((piece) => (
        <View key={piece.id} style={styles.compactPieceThumb}>
          <Image
            resizeMode="cover"
            source={{ uri: piece.image }}
            style={[
              styles.compactPieceImage,
              piece.isOutOfStock ? styles.outOfStockImage : null
            ]}
          />
          {piece.isOutOfStock ? (
            <View style={styles.compactPieceStatus}>
              <Text style={styles.compactPieceStatusText}>×</Text>
            </View>
          ) : null}
          {piece.isOwned ? (
            <View style={styles.compactPieceOwned}>
              <Text style={styles.compactPieceOwnedText}>✓</Text>
            </View>
          ) : null}
        </View>
      ))}
    </View>
  );
}

function SavedLookCard({
  look,
  onTryOn,
  showPriceDropBadge,
  sharedAction
}: {
  look: SavedLook;
  onTryOn?: (context?: string) => void;
  showPriceDropBadge?: boolean;
  sharedAction?: boolean;
}) {
  const priceLine = getLookPriceLine(look);
  const availablePieceCount = getAvailablePieceCount(look);
  const primaryCtaLabel =
    availablePieceCount > 0
      ? `Buy ${availablePieceCount} available pieces · ${priceLine.current}`
      : "Try on this look";

  return (
    <View style={styles.lookCard}>
      <ImageBackground
        imageStyle={styles.lookImageStyle}
        resizeMode="cover"
        source={{ uri: look.image }}
        style={styles.lookImage}
      >
        {showPriceDropBadge && look.priceDrop ? (
          <View style={styles.priceDropBadge}>
            <Text style={styles.priceDropBadgeText}>↓ {look.priceDrop}</Text>
          </View>
        ) : (
          <View style={styles.vibePill}>
            <Text style={styles.vibeText}>{look.vibe}</Text>
          </View>
        )}
        <Pressable
          accessibilityLabel="Saved look options"
          accessibilityRole="button"
          style={styles.moreButton}
        >
          <Feather color={colors.text} name="more-horizontal" size={20} />
        </Pressable>
        <View style={styles.lookMatchPill}>
          <Text style={styles.lookMatchText}>{look.match}</Text>
        </View>
        <Pressable
          accessibilityLabel={`Try on ${look.title}`}
          accessibilityRole="button"
          onPress={() => onTryOn?.(look.title)}
          style={({ pressed }) => [
            styles.tryOnPill,
            pressed ? styles.pressed : null
          ]}
        >
          <Text style={styles.tryOnText}>Try on</Text>
        </Pressable>
      </ImageBackground>

      <View style={styles.lookInfo}>
        <View style={styles.lookTitleRow}>
          <Text style={styles.lookName}>{look.title}</Text>
          <PieceThumbCluster pieces={look.pieces} />
        </View>
        <View style={styles.lookPriceRow}>
          {priceLine.old ? (
            <Text style={styles.oldLookPrice}>{priceLine.old}</Text>
          ) : null}
          <Text style={styles.lookPrice}>
            {priceLine.current} for {priceLine.pieceCount} pieces
          </Text>
        </View>
        <Text numberOfLines={1} style={styles.wardrobeNote}>
          {getLookContext(look)}
        </Text>
        {sharedAction ? (
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.secondarySharedCta,
              pressed ? styles.pressed : null
            ]}
          >
            <Text style={styles.secondarySharedCtaText}>
              Send my version back
            </Text>
          </Pressable>
        ) : null}
        {!sharedAction ? (
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.availablePiecesCta,
              pressed ? styles.pressed : null
            ]}
          >
            <Text style={styles.availablePiecesCtaText}>{primaryCtaLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function SharedLookCard({
  look,
  onTryOn
}: {
  look: SavedLook;
  onTryOn?: (context?: string) => void;
}) {
  return (
    <View style={styles.sharedWrap}>
      <View style={styles.sharedHeader}>
        <View style={styles.sharedAvatar}>
          <Text style={styles.sharedAvatarText}>
            {look.sharedBy?.slice(0, 1) ?? "S"}
          </Text>
        </View>
        <Text style={styles.sharedMeta}>
          Shared by {look.sharedBy ?? "Mira"} · {look.sharedDate ?? "2 days ago"}
        </Text>
      </View>
      {look.message ? (
        <View style={styles.sharedMessage}>
          <Text style={styles.sharedMessageText}>She said: “{look.message}”</Text>
        </View>
      ) : null}
      <SavedLookCard look={look} onTryOn={onTryOn} sharedAction />
    </View>
  );
}

function SavedProductCard({
  compact,
  onTryOn,
  product,
  width
}: {
  compact?: boolean;
  onTryOn?: (context?: string) => void;
  product: SavedProduct;
  width?: number;
}) {
  return (
    <View
      style={[
        styles.productCard,
        compact ? styles.compactProductCard : null,
        width ? { width } : null
      ]}
    >
      <ImageBackground
        imageStyle={styles.productImageStyle}
        resizeMode="cover"
        source={{ uri: product.image }}
        style={compact ? styles.compactProductImage : styles.productImage}
      >
        {product.priceDrop ? (
          <View style={styles.priceDropBadge}>
            <Text style={styles.priceDropBadgeText}>↓ {product.priceDrop}</Text>
          </View>
        ) : null}
        <Pressable
          accessibilityLabel={`Remove ${product.title} from saved`}
          accessibilityRole="button"
          style={styles.savedHeart}
        >
          <Feather
            color={colors.text}
            fill={colors.text}
            name="heart"
            size={14}
          />
        </Pressable>
        <View style={styles.productMatch}>
          <Text style={styles.matchText}>{product.match}</Text>
        </View>
        <Pressable
          accessibilityLabel={`Try on ${product.title}`}
          accessibilityRole="button"
          onPress={() => onTryOn?.(product.title)}
          style={({ pressed }) => [
            styles.productTryOn,
            pressed ? styles.pressed : null
          ]}
        >
          <Text style={styles.tryOnText}>Try on</Text>
        </Pressable>
        {product.isOutOfStock ? (
          <View style={styles.soldOutOverlay}>
            <Text style={styles.soldOutOverlayText}>Sold out — notify me</Text>
          </View>
        ) : null}
      </ImageBackground>
      <View style={[styles.productInfo, compact ? styles.compactProductInfo : null]}>
        <Text numberOfLines={1} style={styles.productBrand}>
          {product.brand}
        </Text>
        <Text numberOfLines={compact ? 1 : 2} style={styles.productName}>
          {product.title}
        </Text>
        <View style={styles.productPriceRow}>
          <Text style={styles.productPrice}>{product.price}</Text>
          {product.oldPrice ? (
            <Text style={styles.oldProductPrice}>{product.oldPrice}</Text>
          ) : null}
          {product.priceDrop ? (
            <View style={styles.productDropMiniBadge}>
              <Text style={styles.productDropMiniText}>↓ {product.priceDrop}</Text>
            </View>
          ) : null}
        </View>
        {product.wardrobeTag ? (
          <Text numberOfLines={1} style={styles.wardrobeProductTag}>
            {product.wardrobeTag}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function SavedGrid({
  items,
  onTryOn,
  tab
}: {
  items: SavedItem[];
  onTryOn?: (context?: string) => void;
  tab: SavedTab;
}) {
  if (items.length === 0) {
    return null;
  }

  if (tab === "Products") {
    return (
      <View style={styles.productGrid}>
        {items.map((item) =>
          item.type === "product" ? (
            <View key={item.id} style={styles.productGridItem}>
              <SavedProductCard onTryOn={onTryOn} product={item} />
            </View>
          ) : null
        )}
      </View>
    );
  }

  if (tab === "All") {
    const lookItems = items.filter(
      (item): item is SavedLook => item.type !== "product"
    );
    const productItems = items.filter(
      (item): item is SavedProduct => item.type === "product"
    );

    return (
      <View style={styles.savedList}>
        {lookItems.map((item) =>
          item.type === "shared" ? (
            <SharedLookCard key={item.id} look={item} onTryOn={onTryOn} />
          ) : (
            <SavedLookCard key={item.id} look={item} onTryOn={onTryOn} />
          )
        )}
        {productItems.length > 0 ? (
          <View style={styles.productGrid}>
            {productItems.map((item) =>
              item.type === "product" ? (
                <View key={item.id} style={styles.productGridItem}>
                  <SavedProductCard onTryOn={onTryOn} product={item} />
                </View>
              ) : null
            )}
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.savedList}>
      {items.map((item) => {
        if (item.type === "product") {
          return null;
        }

        if (item.type === "shared") {
          return <SharedLookCard key={item.id} look={item} onTryOn={onTryOn} />;
        }

        return <SavedLookCard key={item.id} look={item} onTryOn={onTryOn} />;
      })}
    </View>
  );
}

function EmptyState({ onExplore }: { onExplore?: () => void }) {
  return (
    <View style={styles.emptyState}>
      <Feather color={colors.border} name="heart" size={48} />
      <Text style={styles.emptyTitle}>Nothing saved yet</Text>
      <Text style={styles.emptyCopy}>
        Tap the heart on any look or product to save it here
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={onExplore}
        style={({ pressed }) => [
          styles.emptyCta,
          pressed ? styles.pressed : null
        ]}
      >
        <Text style={styles.emptyCtaText}>Explore looks</Text>
      </Pressable>
    </View>
  );
}

export function SavedScreen({ onBack, onExplore, onTryOn }: SavedScreenProps) {
  const [activeTab, setActiveTab] = useState<SavedTab>("All");
  const [activeFilter, setActiveFilter] = useState<SavedFilter>("All");
  const hasPriceDrops = allItems.some((item) => Boolean(item.priceDrop));
  const visibleItems = useMemo(
    () => getItemsForTab(activeTab, activeFilter),
    [activeFilter, activeTab]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SavedHeader
          onBack={onBack}
          onOpenFilters={() => setActiveFilter("Price dropped")}
        />
        <SavedTabs activeTab={activeTab} onChangeTab={setActiveTab} />
        <SavedFilterChips
          activeFilter={activeFilter}
          onChangeFilter={setActiveFilter}
        />
        {hasPriceDrops ? <PriceDropSection onTryOn={onTryOn} /> : null}
        {visibleItems.length > 0 ? (
          <SavedGrid items={visibleItems} onTryOn={onTryOn} tab={activeTab} />
        ) : !hasPriceDrops ? (
          <EmptyState onExplore={onExplore} />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  alternativeText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
    marginTop: spacing.xs
  },
  availablePiecesCta: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: 8,
    height: 36,
    justifyContent: "center",
    marginTop: spacing.xs,
    width: "100%"
  },
  availablePiecesCtaText: {
    color: colors.inverseText,
    fontFamily: fonts.cta,
    fontSize: 12,
    lineHeight: 15
  },
  compactPieceCluster: {
    flexDirection: "row",
    gap: 2
  },
  compactPieceImage: {
    height: "100%",
    width: "100%"
  },
  compactPieceOwned: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: 6,
    bottom: -2,
    height: 12,
    justifyContent: "center",
    position: "absolute",
    right: -2,
    width: 12
  },
  compactPieceOwnedText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 7,
    lineHeight: 9
  },
  compactPieceStatus: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: 6,
    height: 12,
    justifyContent: "center",
    position: "absolute",
    right: -2,
    top: -2,
    width: 12
  },
  compactPieceStatusText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 8,
    lineHeight: 10
  },
  compactPieceThumb: {
    backgroundColor: colors.imageSurface,
    borderRadius: 12,
    height: 24,
    overflow: "visible",
    width: 24
  },
  compactProductCard: {
    height: 280
  },
  compactProductImage: {
    backgroundColor: colors.imageSurface,
    height: 160,
    overflow: "hidden",
    width: "100%"
  },
  compactProductInfo: {
    minHeight: 120
  },
  compactProductPriceLine: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    marginTop: spacing.xs
  },
  content: {
    gap: spacing.lg,
    paddingBottom: 140,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.sm
  },
  countStrip: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 17,
    textAlign: "center"
  },
  createdByYouTag: {
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4
  },
  createdByYouText: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    lineHeight: 13
  },
  emptyCopy: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 260,
    textAlign: "center"
  },
  emptyCta: {
    alignItems: "center",
    backgroundColor: colors.inverse,
    borderRadius: radii.card,
    height: 44,
    justifyContent: "center",
    paddingHorizontal: spacing.xl
  },
  emptyCtaText: {
    color: colors.inverseText,
    fontFamily: fonts.cta,
    fontSize: 14,
    lineHeight: 18
  },
  emptyState: {
    alignItems: "center",
    gap: spacing.md,
    justifyContent: "center",
    minHeight: 420
  },
  emptyTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 23
  },
  filterChip: {
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  filterChipSelected: {
    backgroundColor: colors.inverse,
    borderColor: colors.inverse
  },
  filterChipText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 15
  },
  filterChipTextSelected: {
    color: colors.inverseText
  },
  filterRow: {
    gap: spacing.sm,
    marginTop: -spacing.sm,
    paddingRight: spacing.screen
  },
  filterSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    bottom: 0,
    gap: spacing.md,
    left: 0,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    position: "absolute",
    right: 0
  },
  header: {
    gap: spacing.xs
  },
  headerCopy: {
    gap: spacing.xs
  },
  headerIconButton: {
    alignItems: "center",
    height: 42,
    justifyContent: "center",
    width: 42
  },
  headerTitle: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 25,
    textAlign: "center"
  },
  headerTopRow: {
    alignItems: "center",
    flexDirection: "row"
  },
  lookCard: {
    backgroundColor: colors.cream,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    width: "100%"
  },
  lookImage: {
    height: 160,
    overflow: "hidden"
  },
  lookImageStyle: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  },
  lookInfo: {
    backgroundColor: colors.background,
    gap: spacing.xs,
    minHeight: 120,
    padding: spacing.md
  },
  lookName: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.heading,
    fontSize: 14,
    lineHeight: 18
  },
  lookPrice: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 17
  },
  lookPriceRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 17
  },
  lookTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  lookMatchPill: {
    backgroundColor: colors.surfaceTranslucent,
    borderRadius: radii.pill,
    bottom: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    position: "absolute"
  },
  lookMatchText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14
  },
  matchPill: {
    backgroundColor: colors.inverseTranslucent,
    borderRadius: radii.pill,
    bottom: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    position: "absolute"
  },
  matchText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14
  },
  mixedProductWrap: {
    alignSelf: "flex-start",
    width: "47.8%"
  },
  moreButton: {
    alignItems: "center",
    backgroundColor: colors.surfaceTranslucent,
    borderRadius: 14,
    height: 28,
    justifyContent: "center",
    position: "absolute",
    right: spacing.sm,
    top: spacing.sm,
    width: 28
  },
  occasionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  oldLookPrice: {
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    textDecorationLine: "line-through"
  },
  oldProductPrice: {
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    textDecorationLine: "line-through"
  },
  outOfStockBadge: {
    alignItems: "center",
    backgroundColor: colors.inverse,
    borderRadius: 8,
    height: 16,
    justifyContent: "center",
    position: "absolute",
    right: -4,
    top: -4,
    width: 16
  },
  outOfStockBadgeText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 13
  },
  outOfStockImage: {
    opacity: 0.48
  },
  ownedText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 9,
    lineHeight: 12,
    marginTop: 2,
    textAlign: "center"
  },
  pieceStrip: {
    flexDirection: "row",
    gap: spacing.xs
  },
  pieceStripSection: {
    backgroundColor: colors.background,
    padding: 10
  },
  pieceThumb: {
    backgroundColor: colors.imageSurface,
    borderRadius: 6,
    height: 50,
    overflow: "visible",
    width: 40
  },
  pieceThumbImage: {
    borderRadius: 6,
    height: "100%",
    width: "100%"
  },
  pieceThumbWrap: {
    width: 42
  },
  priceDropBadge: {
    backgroundColor: colors.cream,
    borderRadius: radii.pill,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    position: "absolute",
    top: spacing.sm
  },
  priceDropBadgeText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14
  },
  priceDropCopy: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16
  },
  priceDropHeader: {
    gap: spacing.xs
  },
  priceDropLookWrap: {
    width: 280
  },
  priceDropSection: {
    gap: spacing.md
  },
  priceDropTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 16,
    lineHeight: 21
  },
  priceDropTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs
  },
  priceDropTrack: {
    gap: spacing.md,
    paddingRight: spacing.screen
  },
  priceRangeFill: {
    backgroundColor: colors.text,
    borderRadius: 2,
    height: 4,
    width: "62%"
  },
  priceRangeShell: {
    gap: spacing.sm
  },
  priceRangeText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 17
  },
  priceRangeTrack: {
    backgroundColor: colors.border,
    borderRadius: 2,
    height: 4
  },
  productBrand: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16
  },
  productCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    width: "100%"
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md
  },
  productGridItem: {
    width: "47.8%"
  },
  productDropMiniBadge: {
    backgroundColor: colors.cream,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2
  },
  productDropMiniText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    lineHeight: 12
  },
  productImage: {
    aspectRatio: 3 / 4,
    backgroundColor: colors.imageSurface,
    overflow: "hidden"
  },
  productImageStyle: {
    borderTopLeftRadius: radii.card,
    borderTopRightRadius: radii.card
  },
  productInfo: {
    padding: spacing.sm
  },
  productMatch: {
    backgroundColor: colors.inverseTranslucent,
    borderRadius: radii.pill,
    bottom: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    position: "absolute"
  },
  productName: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 3
  },
  productPrice: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 17
  },
  productPriceRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginTop: spacing.xs
  },
  productTryOn: {
    backgroundColor: colors.text,
    borderRadius: radii.pill,
    bottom: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    position: "absolute",
    right: spacing.sm
  },
  pressed: {
    opacity: 0.72
  },
  safeArea: {
    backgroundColor: colors.surfaceTertiary,
    flex: 1
  },
  savedAmount: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16
  },
  savedDate: {
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 14,
    marginTop: spacing.xs
  },
  savedHeart: {
    alignItems: "center",
    backgroundColor: colors.surfaceTranslucent,
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    position: "absolute",
    right: spacing.sm,
    top: spacing.sm,
    width: 32
  },
  savedList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md
  },
  secondarySharedCta: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.text,
    borderRadius: radii.pill,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  secondarySharedCtaText: {
    color: colors.inverseText,
    fontFamily: fonts.cta,
    fontSize: 12,
    lineHeight: 15
  },
  sharedAvatar: {
    alignItems: "center",
    backgroundColor: colors.cream,
    borderRadius: 10,
    height: 20,
    justifyContent: "center",
    width: 20
  },
  sharedAvatarText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    lineHeight: 12
  },
  sharedHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  sharedMessage: {
    backgroundColor: colors.cream,
    borderRadius: radii.card,
    padding: spacing.md
  },
  sharedMessageText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    fontStyle: "italic",
    lineHeight: 17
  },
  sharedMeta: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16
  },
  sharedWrap: {
    gap: spacing.sm,
    width: "100%"
  },
  sheetHandle: {
    alignSelf: "center",
    backgroundColor: colors.border,
    borderRadius: 2,
    height: 4,
    width: 42
  },
  sheetOption: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 36
  },
  sheetOptionText: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 19
  },
  sheetScrim: {
    backgroundColor: colors.scrimMedium,
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  sheetSectionTitle: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    marginTop: spacing.sm
  },
  sheetTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 23
  },
  sheetToggle: {
    backgroundColor: colors.border,
    borderRadius: 12,
    height: 24,
    width: 42
  },
  soldOutActions: {
    gap: spacing.xs,
    marginTop: spacing.xs
  },
  soldOutBanner: {
    backgroundColor: colors.cream,
    borderRadius: radii.card,
    marginTop: spacing.sm,
    padding: spacing.sm
  },
  soldOutLink: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14
  },
  soldOutOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(10, 10, 10, 0.56)",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  soldOutOverlayText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16
  },
  soldOutTitle: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16
  },
  tabPill: {
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  tabPillSelected: {
    backgroundColor: colors.inverse,
    borderColor: colors.inverse
  },
  tabRow: {
    gap: spacing.sm,
    paddingRight: spacing.screen
  },
  tabText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16
  },
  tabTextSelected: {
    color: colors.inverseText
  },
  tryOnPill: {
    backgroundColor: colors.text,
    borderRadius: radii.pill,
    bottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    position: "absolute",
    right: spacing.sm
  },
  tryOnText: {
    color: colors.inverseText,
    fontFamily: fonts.cta,
    fontSize: 11,
    lineHeight: 14
  },
  vibePill: {
    backgroundColor: colors.surfaceTranslucent,
    borderRadius: radii.pill,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    position: "absolute",
    top: spacing.sm
  },
  vibeText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14
  },
  wardrobeNote: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
    marginTop: spacing.xs
  },
  wardrobeProductTag: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
    marginTop: spacing.xs
  }
});
