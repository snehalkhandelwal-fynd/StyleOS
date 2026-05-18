import { Feather, Ionicons } from "@expo/vector-icons";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Image,
  ImageBackground,
  Modal,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";

import { colors, fonts, spacing, typography } from "../../../theme";

export type ProductListingProduct = {
  brand?: string;
  color?: string;
  deliveryText?: string;
  discountPercent?: number;
  id: string;
  image: string;
  match?: string;
  matchScore?: number;
  occasion?: string;
  originalPrice?: string;
  price: string;
  priceValue?: number;
  sizeOptions?: string[];
  styleLabel: string;
  title: string;
  tries?: string;
  tryCount?: number;
  vibe?: string;
};

type SortValue = "relevance" | "price-low" | "price-high" | "most-tried";
type FilterKey = "size" | "color" | "price" | "occasion" | "vibe";
type FilterOption = {
  label: string;
  value: string;
};
type FilterConfig = {
  key: FilterKey;
  label: string;
  options: FilterOption[];
};
type SheetState =
  | { type: "filter"; key: FilterKey }
  | { type: "filter-menu" }
  | { type: "sort" }
  | null;
type ListingChipKey = "sale" | "price-drop" | "budget" | "quick-delivery";
type SelectedFilters = Partial<Record<FilterKey, FilterOption>>;
type TrendingLook = {
  count: string;
  id: string;
  images: [string, string];
  title: string;
};

type ProductListingScreenProps = {
  emptyCopy?: string;
  emptyTitle?: string;
  onBack: () => void;
  onOpenCart?: () => void;
  onOpenProduct?: (product: ProductListingProduct) => void;
  onOpenWishlist?: () => void;
  products: ProductListingProduct[];
  subtitle: string;
  title: string;
};

const topSafeInset = Platform.OS === "ios" ? 44 : 0;
const bottomSafeInset = Platform.OS === "ios" ? 34 : 0;
const bottomControlBottomPadding =
  Platform.OS === "ios" ? spacing.lg : spacing.md;
const bottomControlDockHeight = 52 + bottomControlBottomPadding;
const LISTING_CHIP_HEIGHT = 40;
const PRODUCTS_BEFORE_LOOKS_RAIL = 12;
const SCROLL_PROGRESS_THRESHOLD = 80;

const sortOptions: { label: string; value: SortValue }[] = [
  { label: "Popularity", value: "relevance" },
  { label: "Price low to high", value: "price-low" },
  { label: "Price high to low", value: "price-high" },
  { label: "Most tried", value: "most-tried" }
];

const filterConfigs: FilterConfig[] = [
  {
    key: "size",
    label: "Size",
    options: ["XS", "S", "M", "L", "XL"].map((size) => ({
      label: size,
      value: size
    }))
  },
  {
    key: "color",
    label: "Color",
    options: ["White", "Blue", "Sand", "Ivory", "Black", "Green"].map(
      (color) => ({ label: color, value: color })
    )
  },
  {
    key: "price",
    label: "Price range",
    options: [
      { label: "Under ₹1,000", value: "under-1000" },
      { label: "Under ₹2,000", value: "under-2000" },
      { label: "Under ₹3,000", value: "under-3000" },
      { label: "Under ₹4,000", value: "under-4000" }
    ]
  },
  {
    key: "occasion",
    label: "Occasion",
    options: ["Work", "Weekend", "Vacation", "Brunch", "Date night"].map(
      (occasion) => ({ label: occasion, value: occasion })
    )
  },
  {
    key: "vibe",
    label: "Vibe",
    options: ["Classic", "Minimal", "Coastal", "Soft", "Street"].map(
      (vibe) => ({ label: vibe, value: vibe })
    )
  }
];

const listingChips: {
  icon: keyof typeof Feather.glyphMap;
  key: ListingChipKey;
  label: string;
}[] = [
  { icon: "tag", key: "sale", label: "Sale Deals" },
  { icon: "trending-down", key: "price-drop", label: "Price Drop" },
  { icon: "shopping-bag", key: "budget", label: "Budget Buys" },
  { icon: "clock", key: "quick-delivery", label: "Quick delivery" }
];

function parsePriceValue(price: string) {
  return Number(price.replace(/[^\d]/g, "")) || 0;
}

function getPriceLimit(value: string) {
  return Number(value.replace(/[^\d]/g, "")) || Number.POSITIVE_INFINITY;
}

function getFilterConfig(key: FilterKey) {
  return filterConfigs.find((filter) => filter.key === key) ?? filterConfigs[0];
}

function getFilteredProducts(
  products: ProductListingProduct[],
  selectedFilters: SelectedFilters
) {
  return products.filter((product) => {
    const selectedSize = selectedFilters.size;
    const selectedColor = selectedFilters.color;
    const selectedPrice = selectedFilters.price;
    const selectedOccasion = selectedFilters.occasion;
    const selectedVibe = selectedFilters.vibe;

    if (selectedSize && !product.sizeOptions?.includes(selectedSize.value)) {
      return false;
    }

    if (selectedColor && product.color !== selectedColor.value) {
      return false;
    }

    if (
      selectedPrice &&
      (product.priceValue ?? parsePriceValue(product.price)) >
        getPriceLimit(selectedPrice.value)
    ) {
      return false;
    }

    if (selectedOccasion && product.occasion !== selectedOccasion.value) {
      return false;
    }

    if (selectedVibe && product.vibe !== selectedVibe.value) {
      return false;
    }

    return true;
  });
}

function getChipFilteredProducts(
  products: ProductListingProduct[],
  activeChip: ListingChipKey | null
) {
  if (!activeChip) {
    return products;
  }

  return products.filter((product) => {
    if (activeChip === "sale") {
      return Boolean(product.discountPercent);
    }

    if (activeChip === "price-drop") {
      return (product.discountPercent ?? 0) >= 35;
    }

    if (activeChip === "budget") {
      return (product.priceValue ?? parsePriceValue(product.price)) <= 1500;
    }

    return (
      product.deliveryText?.startsWith("2 day") ||
      product.deliveryText?.startsWith("3 day")
    );
  });
}

function getSortedProducts(
  products: ProductListingProduct[],
  selectedSort: SortValue
) {
  const sortedProducts = [...products];

  if (selectedSort === "price-low") {
    return sortedProducts.sort(
      (a, b) =>
        (a.priceValue ?? parsePriceValue(a.price)) -
        (b.priceValue ?? parsePriceValue(b.price))
    );
  }

  if (selectedSort === "price-high") {
    return sortedProducts.sort(
      (a, b) =>
        (b.priceValue ?? parsePriceValue(b.price)) -
        (a.priceValue ?? parsePriceValue(a.price))
    );
  }

  if (selectedSort === "most-tried") {
    return sortedProducts.sort((a, b) => (b.tryCount ?? 0) - (a.tryCount ?? 0));
  }

  return sortedProducts;
}

function buildTrendingLooks(products: ProductListingProduct[]): TrendingLook[] {
  if (products.length < 2) {
    return [];
  }

  const lookTypes = [
    "Work looks",
    "Weekend looks",
    "Date-night looks",
    "Vacation looks"
  ];
  const lookCounts = ["142 looks", "304 looks", "218 looks", "96 looks"];

  return lookTypes.map((title, index) => {
    const firstProduct = products[(index * 2) % products.length]!;
    const secondProduct = products[(index * 2 + 1) % products.length]!;

    return {
      count: lookCounts[index] ?? "120 looks",
      id: `${title}-${index}`,
      images: [firstProduct.image, secondProduct.image],
      title
    };
  });
}

function FloatingListingControls({
  onOpenFilters,
  onOpenSort
}: {
  onOpenFilters: () => void;
  onOpenSort: () => void;
}) {
  return (
    <View style={styles.bottomControlsHost}>
      <Pressable
        accessibilityRole="button"
        onPress={onOpenSort}
        style={({ pressed }) => [
          styles.bottomControlButton,
          pressed ? styles.pressed : null
        ]}
      >
        <Ionicons color={colors.text} name="swap-vertical-outline" size={22} />
        <Text numberOfLines={1} style={styles.bottomControlLabel}>
          SORT
        </Text>
      </Pressable>
      <View style={styles.bottomControlDivider} />
      <Pressable
        accessibilityRole="button"
        onPress={onOpenFilters}
        style={({ pressed }) => [
          styles.bottomControlButton,
          pressed ? styles.pressed : null
        ]}
      >
        <Feather color={colors.text} name="sliders" size={22} />
        <Text numberOfLines={1} style={styles.bottomControlLabel}>
          FILTER
        </Text>
      </Pressable>
    </View>
  );
}

function OptionsSheet({
  onClose,
  onOpenFilter,
  onSelectFilter,
  onSelectSort,
  selectedFilters,
  selectedSort,
  sheet
}: {
  onClose: () => void;
  onOpenFilter: (key: FilterKey) => void;
  onSelectFilter: (key: FilterKey, option: FilterOption) => void;
  onSelectSort: (value: SortValue) => void;
  selectedFilters: SelectedFilters;
  selectedSort: SortValue;
  sheet: SheetState;
}) {
  const isFilterMenu = sheet?.type === "filter-menu";
  const filterConfig =
    sheet?.type === "filter" ? getFilterConfig(sheet.key) : null;
  const title = sheet?.type === "sort" ? "Sort By" : filterConfig?.label ?? "Filter";
  const options =
    sheet?.type === "sort" ? sortOptions : filterConfig?.options ?? [];

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={Boolean(sheet)}
    >
      <View style={styles.sheetRoot}>
        <Pressable
          accessibilityLabel="Close listing options"
          accessibilityRole="button"
          onPress={onClose}
          style={styles.sheetScrim}
        />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>{title}</Text>
          {isFilterMenu
            ? filterConfigs.map((filter) => {
                const selectedFilter = selectedFilters[filter.key];

                return (
                  <Pressable
                    accessibilityRole="button"
                    key={filter.key}
                    onPress={() => onOpenFilter(filter.key)}
                    style={styles.sheetOption}
                  >
                    <View style={styles.sheetOptionCopy}>
                      <Text
                        style={[
                          styles.sheetOptionText,
                          selectedFilter ? styles.sheetOptionTextSelected : null
                        ]}
                      >
                        {filter.label}
                      </Text>
                      <Text numberOfLines={1} style={styles.sheetOptionDetail}>
                        {selectedFilter?.label ?? "Any"}
                      </Text>
                    </View>
                    <Feather color={colors.muted} name="chevron-right" size={18} />
                  </Pressable>
                );
              })
            : options.map((option) => {
                const isSelected =
                  sheet?.type === "sort"
                    ? option.value === selectedSort
                    : option.value === selectedFilters[sheet?.key ?? "size"]?.value;

                return (
                  <Pressable
                    accessibilityRole="button"
                    key={option.value}
                    onPress={() => {
                      if (sheet?.type === "sort") {
                        onSelectSort(option.value as SortValue);
                      } else if (sheet?.type === "filter") {
                        onSelectFilter(sheet.key, option);
                      }

                      onClose();
                    }}
                    style={styles.sheetOption}
                  >
                    <Text
                      style={[
                        styles.sheetOptionText,
                        isSelected ? styles.sheetOptionTextSelected : null
                      ]}
                    >
                      {option.label}
                    </Text>
                    {isSelected ? (
                      <Feather color={colors.text} name="check" size={18} />
                    ) : null}
                  </Pressable>
                );
              })}
        </View>
      </View>
    </Modal>
  );
}

function ProductCard({
  onOpen,
  product,
  width
}: {
  onOpen?: (product: ProductListingProduct) => void;
  product: ProductListingProduct;
  width: number;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onOpen?.(product)}
      style={[styles.productCard, { width }]}
    >
      <ImageBackground
        imageStyle={styles.productImageStyle}
        resizeMode="cover"
        source={{ uri: product.image }}
        style={styles.productImage}
      >
        <View style={styles.saveWrap}>
          <Pressable
            accessibilityLabel={`Save ${product.title}`}
            accessibilityRole="button"
            style={styles.saveButton}
          >
            <Feather color={colors.text} name="heart" size={14} />
          </Pressable>
        </View>
        <View style={styles.matchPill}>
          <Text style={styles.matchText}>91% your style</Text>
        </View>
        {product.tries ? (
          <View style={styles.tryPill}>
            <Text style={styles.tryText}>{product.tries}</Text>
          </View>
        ) : null}
      </ImageBackground>
      <View style={styles.productInfo}>
        <Text numberOfLines={1} style={styles.productBrand}>
          {product.brand ?? "Trends"}
        </Text>
        <Text numberOfLines={2} style={styles.productTitle}>
          {product.title}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>{product.price}</Text>
          {product.originalPrice ? (
            <Text style={styles.originalPrice}>{product.originalPrice}</Text>
          ) : null}
          {product.discountPercent ? (
            <Text style={styles.discountText}>
              {product.discountPercent}% off
            </Text>
          ) : null}
        </View>
        {product.deliveryText ? (
          <Text numberOfLines={1} style={styles.deliveryText}>
            {product.deliveryText}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

function TrendingLooksRail({ looks }: { looks: TrendingLook[] }) {
  if (looks.length === 0) {
    return null;
  }

  return (
    <View style={styles.looksRail}>
      <View style={styles.looksRailHeader}>
        <Text style={styles.looksRailTitle}>Trending right now</Text>
        <Text style={styles.looksRailAction}>VIEW ALL</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.looksTrack}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {looks.map((look) => (
          <View key={look.id} style={styles.lookCard}>
            <View style={styles.lookImageRow}>
              {look.images.map((image, index) => (
                <Image
                  key={`${look.id}-${image}-${index}`}
                  resizeMode="cover"
                  source={{ uri: image }}
                  style={[
                    styles.lookImage,
                    index === 0 ? styles.lookImageLeft : styles.lookImageRight
                  ]}
                />
              ))}
            </View>
            <View style={styles.lookFooter}>
              <Text numberOfLines={1} style={styles.lookTitle}>
                {look.title}
              </Text>
              <Text numberOfLines={1} style={styles.lookCount}>
                {look.count}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function ScrollProgressPill({
  current,
  onPress,
  total
}: {
  current: number;
  onPress: () => void;
  total: number;
}) {
  if (current === 0 || total === 0) {
    return null;
  }

  return (
    <Pressable
      accessibilityLabel="Scroll to top"
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.scrollProgressPill,
        pressed ? styles.pressed : null
      ]}
    >
      <Text style={styles.scrollProgressText}>
        {current}/{total}
      </Text>
      <View style={styles.scrollProgressIcon}>
        <Feather color={colors.muted} name="arrow-up" size={12} />
      </View>
    </Pressable>
  );
}

export function ProductListingScreen({
  emptyCopy = "Try another size, color, or vibe to keep styling.",
  emptyTitle = "No pieces in this mix",
  onBack,
  onOpenCart,
  onOpenProduct,
  onOpenWishlist,
  products,
  subtitle,
  title
}: ProductListingScreenProps) {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [selectedSort, setSelectedSort] = useState<SortValue>("relevance");
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const [activeChip, setActiveChip] = useState<ListingChipKey | null>(null);
  const [activeSheet, setActiveSheet] = useState<SheetState>(null);
  const [scrollProgressProduct, setScrollProgressProduct] = useState(0);
  const cardWidth = (width - spacing.screen * 2 - spacing.md) / 2;
  const displayedProducts = useMemo(() => {
    const filteredProducts = getFilteredProducts(products, selectedFilters);
    const chipFilteredProducts = getChipFilteredProducts(
      filteredProducts,
      activeChip
    );

    return getSortedProducts(chipFilteredProducts, selectedSort);
  }, [activeChip, products, selectedFilters, selectedSort]);
  const productsBeforeLooksRail = displayedProducts.slice(
    0,
    PRODUCTS_BEFORE_LOOKS_RAIL
  );
  const productsAfterLooksRail = displayedProducts.slice(
    PRODUCTS_BEFORE_LOOKS_RAIL
  );
  const trendingLooks = useMemo(
    () => buildTrendingLooks(displayedProducts),
    [displayedProducts]
  );
  const visibleProgressProduct = Math.min(
    scrollProgressProduct,
    displayedProducts.length
  );
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } =
        event.nativeEvent;
      const offsetY = Math.max(0, contentOffset.y);

      if (
        offsetY < SCROLL_PROGRESS_THRESHOLD ||
        displayedProducts.length === 0
      ) {
        setScrollProgressProduct(0);
        return;
      }

      const scrollableHeight = Math.max(
        1,
        contentSize.height - layoutMeasurement.height
      );
      const progress = Math.min(1, offsetY / scrollableHeight);
      const currentProduct = Math.min(
        displayedProducts.length,
        Math.max(1, Math.ceil(progress * displayedProducts.length))
      );

      setScrollProgressProduct((current) =>
        current === currentProduct ? current : currentProduct
      );
    },
    [displayedProducts.length]
  );
  const handleScrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ animated: true, y: 0 });
    setScrollProgressProduct(0);
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Back"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onBack}
          style={styles.backButton}
        >
          <Feather color={colors.text} name="chevron-left" size={30} />
        </Pressable>
        <View style={styles.headerCopy}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            accessibilityLabel="Open wishlist"
            accessibilityRole="button"
            hitSlop={8}
            onPress={onOpenWishlist}
            style={({ pressed }) => [
              styles.headerIconButton,
              pressed ? styles.pressed : null
            ]}
          >
            <Feather color={colors.text} name="heart" size={23} />
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
            <Feather color={colors.text} name="shopping-bag" size={23} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        onScroll={handleScroll}
        ref={scrollRef}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          contentContainerStyle={styles.chipTrack}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {listingChips.map((chip) => (
            <Pressable
              accessibilityLabel={`Filter by ${chip.label}`}
              accessibilityRole="button"
              key={chip.key}
              onPress={() =>
                setActiveChip((current) =>
                  current === chip.key ? null : chip.key
                )
              }
              style={({ pressed }) => [
                styles.listingChip,
                activeChip === chip.key ? styles.listingChipSelected : null,
                pressed ? styles.pressed : null
              ]}
            >
              <View
                style={[
                  styles.chipIcon,
                  activeChip === chip.key ? styles.chipIconSelected : null
                ]}
              >
                <Feather
                  color={
                    activeChip === chip.key ? colors.inverseText : colors.text
                  }
                  name={chip.icon}
                  size={15}
                />
              </View>
              <Text
                numberOfLines={1}
                style={[
                  styles.chipText,
                  activeChip === chip.key ? styles.chipTextSelected : null
                ]}
              >
                {chip.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.grid}>
          {productsBeforeLooksRail.map((product) => (
            <ProductCard
              key={product.id}
              onOpen={onOpenProduct}
              product={product}
              width={cardWidth}
            />
          ))}
        </View>
        {productsAfterLooksRail.length > 0 ? (
          <TrendingLooksRail looks={trendingLooks} />
        ) : null}
        {productsAfterLooksRail.length > 0 ? (
          <View style={styles.grid}>
            {productsAfterLooksRail.map((product) => (
              <ProductCard
                key={product.id}
                onOpen={onOpenProduct}
                product={product}
                width={cardWidth}
              />
            ))}
          </View>
        ) : null}
        {displayedProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>{emptyTitle}</Text>
            <Text style={styles.emptyText}>{emptyCopy}</Text>
          </View>
        ) : null}
      </ScrollView>

      <ScrollProgressPill
        current={visibleProgressProduct}
        onPress={handleScrollToTop}
        total={displayedProducts.length}
      />

      <FloatingListingControls
        onOpenFilters={() => setActiveSheet({ type: "filter-menu" })}
        onOpenSort={() => setActiveSheet({ type: "sort" })}
      />

      <OptionsSheet
        onClose={() => setActiveSheet(null)}
        onOpenFilter={(key) => setActiveSheet({ key, type: "filter" })}
        onSelectFilter={(key, option) =>
          setSelectedFilters((current) => ({ ...current, [key]: option }))
        }
        onSelectSort={setSelectedSort}
        selectedFilters={selectedFilters}
        selectedSort={selectedSort}
        sheet={activeSheet}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 36
  },
  bottomControlButton: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 2,
    justifyContent: "center",
    minWidth: 0,
    paddingHorizontal: spacing.screen
  },
  bottomControlDivider: {
    alignSelf: "stretch",
    backgroundColor: colors.border,
    width: StyleSheet.hairlineWidth
  },
  bottomControlLabel: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    lineHeight: 20
  },
  bottomControlsHost: {
    alignItems: "stretch",
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    bottom: 0,
    elevation: 14,
    flexDirection: "row",
    height: bottomControlDockHeight,
    left: 0,
    paddingBottom: bottomControlBottomPadding,
    position: "absolute",
    right: 0,
    shadowColor: "#000000",
    shadowOffset: { height: -8, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    zIndex: 30
  },
  content: {
    paddingBottom: bottomControlDockHeight + spacing.xl,
    paddingTop: spacing.md
  },
  chipIcon: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 13,
    height: 26,
    justifyContent: "center",
    width: 26
  },
  chipText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 17
  },
  chipTrack: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.screen
  },
  deliveryText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 4
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl
  },
  emptyText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    marginTop: spacing.xs,
    textAlign: "center"
  },
  emptyTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 16,
    lineHeight: 20
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    paddingHorizontal: spacing.screen
  },
  header: {
    alignItems: "center",
    backgroundColor: colors.background,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: topSafeInset + 70,
    paddingBottom: 10,
    paddingHorizontal: spacing.screen,
    paddingTop: topSafeInset + spacing.sm
  },
  headerCopy: {
    flex: 1,
    minWidth: 0
  },
  headerActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  headerIconButton: {
    alignItems: "center",
    height: 42,
    justifyContent: "center",
    width: 34
  },
  listingChip: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: spacing.sm,
    height: LISTING_CHIP_HEIGHT,
    paddingLeft: 7,
    paddingRight: 15
  },
  listingChipSelected: {
    backgroundColor: colors.inverse,
    borderWidth: 0
  },
  chipIconSelected: {
    backgroundColor: colors.inverseSoft
  },
  chipTextSelected: {
    color: colors.inverseText
  },
  originalPrice: {
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    textDecorationLine: "line-through"
  },
  lookCard: {
    backgroundColor: colors.background,
    borderRadius: 14,
    overflow: "hidden",
    width: 192
  },
  lookCount: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 17
  },
  lookFooter: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between",
    minHeight: 46,
    paddingHorizontal: spacing.md
  },
  lookImage: {
    backgroundColor: colors.imageSurface,
    flex: 1,
    height: 118
  },
  lookImageLeft: {
    borderTopLeftRadius: 14
  },
  lookImageRight: {
    borderTopRightRadius: 14
  },
  lookImageRow: {
    flexDirection: "row",
    gap: 1
  },
  looksRail: {
    backgroundColor: colors.surfaceTertiary,
    marginBottom: spacing.xl,
    marginTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md
  },
  looksRailAction: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 16
  },
  looksRailHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
    paddingHorizontal: spacing.screen
  },
  looksRailTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 23
  },
  looksTrack: {
    gap: spacing.md,
    paddingHorizontal: spacing.screen
  },
  lookTitle: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 17
  },
  matchPill: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 0.5,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    position: "absolute",
    top: 10
  },
  matchText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    lineHeight: 13
  },
  priceRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 4
  },
  pressed: {
    opacity: 0.72
  },
  scrollProgressIcon: {
    alignItems: "center",
    borderColor: colors.soft,
    borderRadius: 8,
    borderWidth: 1,
    height: 16,
    justifyContent: "center",
    width: 16
  },
  scrollProgressPill: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    bottom: bottomControlDockHeight + spacing.sm,
    flexDirection: "row",
    gap: 6,
    minHeight: 30,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    position: "absolute",
    shadowColor: "#000000",
    shadowOffset: { height: 5, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    zIndex: 25
  },
  scrollProgressText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14
  },
  productBrand: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 17
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
    position: "relative"
  },
  productImageStyle: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  productInfo: {
    backgroundColor: colors.background,
    paddingBottom: 8,
    paddingHorizontal: 10,
    paddingTop: 9
  },
  productPrice: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18
  },
  productTitle: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 15,
    borderWidth: 0.5,
    height: 30,
    justifyContent: "center",
    width: 30
  },
  saveWrap: {
    position: "absolute",
    right: 8,
    top: 8,
    zIndex: 2
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: bottomSafeInset + spacing.xxl,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.sm
  },
  discountText: {
    color: "#128A3A",
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16
  },
  sheetHandle: {
    alignSelf: "center",
    backgroundColor: colors.border,
    borderRadius: 999,
    height: 4,
    marginBottom: spacing.lg,
    width: 40
  },
  sheetOption: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 56,
    paddingVertical: spacing.sm
  },
  sheetOptionCopy: {
    flex: 1,
    minWidth: 0
  },
  sheetOptionDetail: {
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2
  },
  sheetOptionText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 20
  },
  sheetOptionTextSelected: {
    color: colors.text,
    fontFamily: fonts.heading
  },
  sheetRoot: {
    flex: 1,
    justifyContent: "flex-end"
  },
  sheetScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 10, 10, 0.34)"
  },
  sheetTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 23,
    marginBottom: spacing.sm
  },
  subtitle: {
    color: colors.muted,
    ...typography.body
  },
  title: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 25
  },
  tryPill: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    bottom: 10,
    left: 10,
    paddingHorizontal: 9,
    paddingVertical: 5,
    position: "absolute"
  },
  tryText: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 15
  }
});
