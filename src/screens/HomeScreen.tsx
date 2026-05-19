import { useMemo, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import type { FashionInterest } from "./FashionInterestScreen";
import { colors, fonts, radii, spacing } from "../theme";

type HomeScreenProps = {
  deliveryAddress: string;
  fashionInterest?: FashionInterest | null;
  name?: string;
  onChangeAddress: () => void;
};

type ProductCardData = {
  id: string;
  image: string;
  title?: string;
  brand?: string;
  price?: string;
};

type IconName =
  | "camera"
  | "cart"
  | "check"
  | "chevronDown"
  | "heart"
  | "location"
  | "mic"
  | "search";

const figmaAssets = {
  brand1: "http://localhost:3845/assets/0a90595b658c137c72c67dfcce50143dd5ad1f95.png",
  brand2: "http://localhost:3845/assets/ae49a227a08d9d71b9632ea60b7c52ad7c693138.png",
  brand3: "http://localhost:3845/assets/6ba843686cc8eee47957a2cda0f2ce98ade07e78.png",
  brand4: "http://localhost:3845/assets/850ce3552a5f41f88e97ef14ad8e3a759bdd60a2.png",
  finalBanner: "http://localhost:3845/assets/82ba5b0b3b7f76af4b645ea825daddbd30bad922.png",
  hero: "http://localhost:3845/assets/6220795fb135f931d799aec8542867c978d96c34.png",
  newArrival: "http://localhost:3845/assets/0358e8ea7987d053e87a180f4f220e54155a4556.png",
  product: "http://localhost:3845/assets/c5f34ebd94959743cf6e93e172e27531d52bdd74.png",
  quizBanner: "http://localhost:3845/assets/52636e0526e7701b1dbff68ec1dc24eec172fe1e.png",
  savedGarment: "http://localhost:3845/assets/ff44d0b2fc1782d89b20d2604cc06819d2a59929.png",
  swatchDark: "http://localhost:3845/assets/5c6e980f7a99416cbd8258c018744408570de6a3.png",
  swatchLight: "http://localhost:3845/assets/212da49cd37265b33a33babc4d9848905d629ebe.png"
};

const occasionTabs = ["Work", "Casual", "Date Night", "Party", "Formal", "Wedding", "Vacation"];
const priceTabs = ["Under ₹999", "Under ₹1999", "Under ₹2999", "Under ₹3999"];

const products: ProductCardData[] = Array.from({ length: 6 }, (_, index) => ({
  id: `occasion-${index}`,
  image: figmaAssets.product
}));

const arrivalProducts: ProductCardData[] = [
  {
    brand: "Adidas",
    id: "arrival-1",
    image: figmaAssets.newArrival,
    price: "₹2,300",
    title: "Runfalcon 3.0 W Women Lace-Ups Sports Shoes"
  },
  {
    brand: "Adidas",
    id: "arrival-2",
    image: figmaAssets.product,
    price: "₹2,300",
    title: "Runfalcon 3.0 W Women Lace-Ups Sports Shoes"
  }
];

const brandRows = [
  [figmaAssets.brand1, figmaAssets.brand2, figmaAssets.brand3, figmaAssets.brand4],
  [figmaAssets.brand3, figmaAssets.brand4, figmaAssets.brand1, figmaAssets.brand2]
];

function chunkIntoRows<T>(items: T[], size = 2) {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size)
  );
}

function Icon({
  color = colors.text,
  name,
  size = 24,
  strokeWidth = 1.6
}: {
  color?: string;
  name: IconName;
  size?: number;
  strokeWidth?: number;
}) {
  if (name === "location") {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 21C12 21 18.25 15.72 18.25 10.25C18.25 6.8 15.45 4 12 4C8.55 4 5.75 6.8 5.75 10.25C5.75 15.72 12 21 12 21Z"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
        />
        <Circle cx={12} cy={10.25} r={2} stroke={color} strokeWidth={strokeWidth} />
      </Svg>
    );
  }

  if (name === "chevronDown") {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M7 10L12 15L17 10"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
        />
      </Svg>
    );
  }

  if (name === "heart") {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 20.25C12 20.25 4.75 16.1 4.75 10.4C4.75 8.08 6.63 6.2 8.95 6.2C10.22 6.2 11.35 6.76 12 7.65C12.65 6.76 13.78 6.2 15.05 6.2C17.37 6.2 19.25 8.08 19.25 10.4C19.25 16.1 12 20.25 12 20.25Z"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
        />
      </Svg>
    );
  }

  if (name === "search") {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx={10.75} cy={10.75} r={6.75} stroke={color} strokeWidth={strokeWidth} />
        <Path d="M15.75 15.75L20 20" stroke={color} strokeLinecap="round" strokeWidth={strokeWidth} />
      </Svg>
    );
  }

  if (name === "mic") {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 14.75C13.66 14.75 15 13.41 15 11.75V6.75C15 5.09 13.66 3.75 12 3.75C10.34 3.75 9 5.09 9 6.75V11.75C9 13.41 10.34 14.75 12 14.75Z"
          stroke={color}
          strokeWidth={strokeWidth}
        />
        <Path
          d="M6.5 11.75C6.5 14.79 8.96 17.25 12 17.25C15.04 17.25 17.5 14.79 17.5 11.75"
          stroke={color}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
        <Path d="M12 17.25V20.25" stroke={color} strokeLinecap="round" strokeWidth={strokeWidth} />
      </Svg>
    );
  }

  if (name === "camera") {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M5.75 8.25H8L9.25 6.5H14.75L16 8.25H18.25C19.35 8.25 20.25 9.15 20.25 10.25V17.25C20.25 18.35 19.35 19.25 18.25 19.25H5.75C4.65 19.25 3.75 18.35 3.75 17.25V10.25C3.75 9.15 4.65 8.25 5.75 8.25Z"
          stroke={color}
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
        />
        <Circle cx={12} cy={13.75} r={3} stroke={color} strokeWidth={strokeWidth} />
      </Svg>
    );
  }

  if (name === "check") {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx={12} cy={12} r={8.25} stroke={color} strokeWidth={strokeWidth} />
        <Path
          d="M8.75 12.15L10.9 14.3L15.5 9.7"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
        />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7.5 7.5H20.25V20.25H7.5V7.5Z"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <Path
        d="M3.75 3.75H16.5V7.5H7.5V16.5H3.75V3.75Z"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </Svg>
  );
}

function SwatchStack() {
  return (
    <View style={styles.swatchStack}>
      {[figmaAssets.swatchLight, figmaAssets.swatchDark, figmaAssets.swatchLight].map((uri, index) => (
        <Image
          key={`${uri}-${index}`}
          source={{ uri }}
          style={[styles.swatch, index > 0 && styles.swatchOverlap]}
        />
      ))}
    </View>
  );
}

function PillTab({
  isSelected,
  label,
  onPress
}: {
  isSelected: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.tabPill, isSelected && styles.tabPillSelected]}>
      <Text style={[styles.tabText, isSelected && styles.tabTextSelected]}>{label}</Text>
    </Pressable>
  );
}

function ExploreButton({ label }: { label: string }) {
  return (
    <Pressable style={styles.exploreButton}>
      <Text style={styles.exploreButtonText}>{label}</Text>
    </Pressable>
  );
}

function HeroCard() {
  return (
    <View style={styles.heroCard}>
      <Image source={{ uri: figmaAssets.hero }} style={styles.heroImage} resizeMode="cover" />
      <View style={styles.deliveryChip}>
        <Icon color={colors.inverseText} name="check" size={16} strokeWidth={1.6} />
        <Text style={styles.deliveryChipText}>Delivery in 2 days</Text>
      </View>
      <View style={styles.matchPill}>
        <Text style={styles.matchText}>91% match</Text>
      </View>
      <Pressable style={styles.heroHeart}>
        <Icon color={colors.text} name="heart" size={22} strokeWidth={1.8} />
      </Pressable>
      <View style={styles.heroCopy}>
        <Text style={styles.heroKicker}>Women's edits</Text>
        <Text style={styles.heroTitle}>Your look today</Text>
        <Text style={styles.heroDescription}>See it on your avatar before you decide.</Text>
      </View>
      <Pressable style={styles.heroCta}>
        <Text style={styles.heroCtaText}>Try this on me</Text>
      </Pressable>
    </View>
  );
}

function LookTileCard({ image }: ProductCardData) {
  return (
    <View style={styles.lookTile}>
      <View style={styles.lookImageFrame}>
        <Image source={{ uri: image }} style={styles.lookImage} resizeMode="cover" />
        <Pressable style={styles.cardHeart}>
          <Icon color={colors.text} name="heart" size={20} strokeWidth={1.8} />
        </Pressable>
      </View>
      <View style={styles.lookFooter}>
        <SwatchStack />
        <Text style={styles.lookMatchText}>91% match</Text>
      </View>
    </View>
  );
}

function ProductGrid({ items }: { items: ProductCardData[] }) {
  return (
    <View style={styles.productGrid}>
      {chunkIntoRows(items).map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.productRow}>
          {row.map((item) => (
            <LookTileCard key={item.id} {...item} />
          ))}
        </View>
      ))}
    </View>
  );
}

function ProductSection({
  buttonLabel,
  selectedTab,
  setSelectedTab,
  tabs,
  title
}: {
  buttonLabel: string;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  tabs: string[];
  title: string;
}) {
  return (
    <View style={styles.whiteSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScroller}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map((tab) => (
          <PillTab
            key={tab}
            isSelected={selectedTab === tab}
            label={tab}
            onPress={() => setSelectedTab(tab)}
          />
        ))}
      </ScrollView>
      <ProductGrid items={products} />
      <ExploreButton label={buttonLabel} />
    </View>
  );
}

function PriceStyleSection({
  selectedTab,
  setSelectedTab
}: {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}) {
  return (
    <View style={styles.priceStyleSection}>
      <Text style={styles.priceStyleTitle}>Great style at every price</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.priceTabsScroller}
        contentContainerStyle={styles.priceTabsContent}
      >
        {priceTabs.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={[
              styles.priceTabPill,
              selectedTab === tab ? styles.priceTabPillSelected : null
            ]}
          >
            <Text
              style={[
                styles.priceTabText,
                selectedTab === tab ? styles.priceTabTextSelected : null
              ]}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <ProductGrid items={products.slice(0, 2)} />
      <ExploreButton label="Explore products" />
    </View>
  );
}

function QuizBanner() {
  return (
    <View style={styles.quizSection}>
      <ImageBackground
        source={{ uri: figmaAssets.quizBanner }}
        style={styles.quizCard}
        imageStyle={styles.quizBackgroundImage}
      >
        <View style={styles.quizCopy}>
          <Text style={styles.quizTitle}>Find your style in 30 seconds</Text>
          <Text style={styles.quizBody}>Swipe on looks you like and we’ll learn your style</Text>
          <Pressable style={styles.quizCta}>
            <Text style={styles.quizCtaText}>Start swiping</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}

function BrandSection() {
  return (
    <View style={styles.brandSection}>
      <Text style={styles.centerSectionTitle}>Shop by Brands</Text>
      <Text style={styles.brandSubtitle}>Shop by your favorite brands for every audio journey</Text>
      <View style={styles.brandRows}>
        {brandRows.map((row, rowIndex) => (
          <ScrollView
            key={`brand-row-${rowIndex}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.brandRowContent}
          >
            {row.map((uri, logoIndex) => (
              <View key={`${uri}-${logoIndex}`} style={styles.brandPill}>
                <Image source={{ uri }} style={styles.brandLogo} resizeMode="contain" />
              </View>
            ))}
          </ScrollView>
        ))}
      </View>
      <ExploreButton label="View All" />
    </View>
  );
}

function SavedLookCard({ image, index }: { image: string; index: number }) {
  return (
    <View style={[styles.savedCard, index === 1 && styles.savedCardTall]}>
      <View style={styles.savedImageFrame}>
        <Image source={{ uri: image }} style={styles.savedImage} resizeMode={index === 1 ? "cover" : "contain"} />
        <Pressable style={styles.savedHeart}>
          <Icon color={colors.text} name="heart" size={20} strokeWidth={1.8} />
        </Pressable>
      </View>
      <View style={styles.savedFooter}>
        <View style={styles.savedMatchRow}>
          <Text style={styles.savedMatch}>91% match</Text>
          <Text style={styles.savedDelivery}>Delivery in 4 days</Text>
        </View>
        <Pressable style={styles.savedShopButton}>
          <Icon color={colors.text} name="cart" size={18} strokeWidth={1.5} />
          <Text style={styles.savedShopText}>Shop this look</Text>
        </Pressable>
      </View>
    </View>
  );
}

function SavedLooksSection() {
  const saved = [figmaAssets.savedGarment, figmaAssets.hero, figmaAssets.savedGarment];

  return (
    <View style={styles.savedSection}>
      <Text style={styles.savedSectionTitle}>Saved Looks</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.savedCarouselContent}
      >
        {saved.map((image, index) => (
          <SavedLookCard key={`${image}-${index}`} image={image} index={index} />
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        <View style={styles.paginationActive} />
        <View style={styles.paginationDot} />
        <View style={styles.paginationDot} />
      </View>
    </View>
  );
}

function ArrivalCard({ brand, image, price, title }: ProductCardData) {
  return (
    <View style={styles.arrivalCard}>
      <View style={styles.arrivalImageFrame}>
        <Image source={{ uri: image }} style={styles.arrivalImage} resizeMode="contain" />
        <Pressable style={styles.cardHeart}>
          <Icon color={colors.text} name="heart" size={20} strokeWidth={1.8} />
        </Pressable>
      </View>
      <View style={styles.arrivalCopy}>
        <Text style={styles.arrivalBrand}>{brand}</Text>
        <Text style={styles.arrivalTitle}>{title}</Text>
        <Text style={styles.arrivalPrice}>{price}</Text>
      </View>
    </View>
  );
}

function NewArrivalsSection() {
  return (
    <View style={styles.whiteSection}>
      <Text style={styles.sectionTitle}>New Arrivals this week</Text>
      <View style={styles.arrivalRow}>
        {arrivalProducts.map((item) => (
          <ArrivalCard key={item.id} {...item} />
        ))}
      </View>
      <ExploreButton label="Explore products" />
    </View>
  );
}

function WardrobeBanner() {
  return (
    <ImageBackground source={{ uri: figmaAssets.finalBanner }} style={styles.wardrobeBanner} imageStyle={styles.wardrobeImage}>
      <View style={styles.wardrobeOverlay} />
      <View style={styles.wardrobeCopy}>
        <Text style={styles.wardrobeTitle}>Build looks from what you already love</Text>
        <Text style={styles.wardrobeBody}>Add items from your wardrobe and we'll style them into looks you'll actually wear</Text>
        <Pressable style={styles.wardrobeCta}>
          <Text style={styles.wardrobeCtaText}>Add Items</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

export function HomeScreen({ deliveryAddress, name, onChangeAddress }: HomeScreenProps) {
  const [selectedOccasion, setSelectedOccasion] = useState(occasionTabs[0]);
  const [selectedPrice, setSelectedPrice] = useState(priceTabs[0]);

  const firstName = useMemo(() => {
    const trimmedName = name?.trim();
    return trimmedName ? trimmedName.split(/\s+/)[0] : "Snehal";
  }, [name]);

  const address = deliveryAddress.trim() || "MIDC, Andheri East, Mumbai 400096";

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.addressRow}>
            <Pressable onPress={onChangeAddress} style={styles.addressButton}>
              <Icon color={colors.text} name="location" size={22} strokeWidth={1.8} />
              <Text numberOfLines={1} style={styles.addressText}>
                {address}
              </Text>
              <Icon color={colors.text} name="chevronDown" size={20} strokeWidth={1.8} />
            </Pressable>
            <View style={styles.profileButton}>
              <Text style={styles.profileInitial}>{firstName.slice(0, 1).toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.searchBar}>
            <Icon color={colors.soft} name="search" size={22} />
            <Text style={styles.searchText}>Search by occasion, style, or vibe…</Text>
            <View style={styles.searchActions}>
              <Icon color={colors.soft} name="mic" size={20} />
              <Icon color={colors.soft} name="camera" size={20} />
            </View>
          </View>
        </View>

        <View style={styles.styledIntro}>
          <Text style={styles.greeting}>Good Morning, {firstName}</Text>
          <Text style={styles.pageTitle}>Styled for you</Text>
          <HeroCard />
        </View>

        <ProductSection
          buttonLabel="Explore products"
          selectedTab={selectedOccasion}
          setSelectedTab={setSelectedOccasion}
          tabs={occasionTabs}
          title="What’s the occasion?"
        />

        <QuizBanner />

        <PriceStyleSection
          selectedTab={selectedPrice}
          setSelectedTab={setSelectedPrice}
        />
        <SavedLooksSection />

        <BrandSection />
        <NewArrivalsSection />
        <WardrobeBanner />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  addressButton: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 8,
    minWidth: 0
  },
  addressRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: spacing.screen
  },
  addressText: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20
  },
  arrivalBrand: {
    color: "#7a7a7a",
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17
  },
  arrivalCard: {
    flex: 1,
    minWidth: 0
  },
  arrivalCopy: {
    gap: 2,
    paddingTop: 8
  },
  arrivalImage: {
    height: "100%",
    width: "100%"
  },
  arrivalImageFrame: {
    backgroundColor: "#fafafa",
    borderRadius: radii.card,
    height: 240,
    overflow: "hidden"
  },
  arrivalPrice: {
    color: colors.success,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 19
  },
  arrivalRow: {
    flexDirection: "row",
    gap: 13
  },
  arrivalTitle: {
    color: "#575858",
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 19
  },
  brandLogo: {
    height: 30,
    width: 86
  },
  brandPill: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    height: 40,
    justifyContent: "center",
    width: 105
  },
  brandRowContent: {
    gap: 6,
    paddingHorizontal: spacing.screen
  },
  brandRows: {
    gap: 10
  },
  brandSection: {
    backgroundColor: "#faf8f8",
    gap: 20,
    paddingHorizontal: 0,
    paddingVertical: 24
  },
  brandSubtitle: {
    alignSelf: "center",
    color: "#636363",
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    maxWidth: 270,
    textAlign: "center"
  },
  cardHeart: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: radii.pill,
    height: 42,
    justifyContent: "center",
    position: "absolute",
    right: 10,
    top: 10,
    width: 42
  },
  centerSectionTitle: {
    color: colors.text,
    fontFamily: fonts.serifRegular,
    fontSize: 22,
    lineHeight: 29,
    textAlign: "center"
  },
  content: {
    paddingBottom: 108
  },
  deliveryChip: {
    alignItems: "center",
    backgroundColor: "rgba(20, 20, 20, 0.92)",
    borderRadius: radii.pill,
    flexDirection: "row",
    gap: 5,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: "absolute",
    top: 12
  },
  deliveryChipText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 16
  },
  discountPill: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.inverse,
    borderRadius: radii.pill,
    height: 28,
    justifyContent: "center",
    paddingHorizontal: 12
  },
  discountText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18
  },
  exploreButton: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: colors.inverse,
    borderRadius: radii.button,
    height: 48,
    justifyContent: "center",
    marginHorizontal: spacing.screen
  },
  exploreButtonText: {
    color: colors.inverseText,
    fontFamily: fonts.cta,
    fontSize: 16,
    lineHeight: 22
  },
  greeting: {
    color: "#606060",
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22
  },
  header: {
    backgroundColor: "#faf8f8",
    paddingBottom: 14,
    paddingTop: 8
  },
  heroCard: {
    backgroundColor: colors.cream,
    borderRadius: radii.card,
    height: 470,
    overflow: "hidden",
    position: "relative"
  },
  heroCopy: {
    bottom: 84,
    gap: 4,
    left: 24,
    position: "absolute",
    right: 24
  },
  heroCta: {
    alignItems: "center",
    backgroundColor: colors.inverse,
    borderRadius: radii.button,
    bottom: 8,
    height: 48,
    justifyContent: "center",
    left: 12,
    position: "absolute",
    right: 12
  },
  heroCtaText: {
    color: colors.inverseText,
    fontFamily: fonts.cta,
    fontSize: 16,
    lineHeight: 22
  },
  heroDescription: {
    color: colors.inverseText,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22
  },
  heroHeart: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderRadius: radii.pill,
    height: 32,
    justifyContent: "center",
    position: "absolute",
    right: 12,
    top: 12,
    width: 32
  },
  heroImage: {
    height: "109.4%",
    left: "-17.26%",
    position: "absolute",
    top: "-2.18%",
    width: "142.74%"
  },
  heroKicker: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    lineHeight: 22
  },
  heroTitle: {
    color: colors.inverseText,
    fontFamily: fonts.serifRegular,
    fontSize: 28,
    lineHeight: 36
  },
  lookFooter: {
    alignItems: "center",
    backgroundColor: "rgba(245, 245, 245, 0.92)",
    borderBottomLeftRadius: radii.card,
    borderBottomRightRadius: radii.card,
    flexDirection: "row",
    height: 24,
    justifyContent: "space-between",
    paddingHorizontal: 8
  },
  lookImage: {
    height: "100%",
    width: "100%"
  },
  lookImageFrame: {
    backgroundColor: "#fafafa",
    borderTopLeftRadius: radii.card,
    borderTopRightRadius: radii.card,
    height: 216,
    overflow: "hidden"
  },
  lookMatchText: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 16
  },
  lookTile: {
    flex: 1,
    minWidth: 0
  },
  matchPill: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: radii.pill,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    position: "absolute",
    top: 42
  },
  matchText: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 16
  },
  pageTitle: {
    color: colors.text,
    fontFamily: fonts.serifRegular,
    fontSize: 22,
    lineHeight: 29
  },
  pagination: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center"
  },
  paginationActive: {
    backgroundColor: colors.text,
    borderRadius: radii.pill,
    height: 8,
    width: 28
  },
  paginationDot: {
    backgroundColor: "#d9ebff",
    borderRadius: radii.pill,
    height: 8,
    width: 8
  },
  productGrid: {
    gap: 14
  },
  productRow: {
    flexDirection: "row",
    gap: 13
  },
  profileButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  profileInitial: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    lineHeight: 22
  },
  quizBackgroundImage: {
    borderRadius: 20,
    opacity: 0.2
  },
  quizBody: {
    color: "#575858",
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    maxWidth: 220
  },
  quizCard: {
    backgroundColor: "rgba(243, 249, 255, 0.3)",
    borderColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    height: 220,
    justifyContent: "center",
    overflow: "hidden",
    paddingHorizontal: 24
  },
  quizCopy: {
    gap: 8
  },
  quizCta: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.82)",
    borderRadius: radii.pill,
    height: 32,
    justifyContent: "center",
    marginTop: 8,
    paddingHorizontal: 18
  },
  quizCtaText: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18
  },
  quizSection: {
    backgroundColor: "#faf8f8",
    paddingHorizontal: spacing.screen,
    paddingVertical: 24
  },
  quizTitle: {
    color: colors.text,
    fontFamily: fonts.serif,
    fontSize: 16,
    lineHeight: 22,
    maxWidth: 230
  },
  savedCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    height: 369,
    overflow: "hidden",
    width: 255
  },
  savedCardTall: {
    height: 405,
    width: 279
  },
  savedCarouselContent: {
    alignItems: "flex-start",
    gap: 12,
    paddingHorizontal: spacing.screen
  },
  savedDelivery: {
    color: "#7a7a7a",
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 16
  },
  savedFooter: {
    gap: 8,
    padding: 10
  },
  savedHeart: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    height: 42,
    justifyContent: "center",
    position: "absolute",
    right: 10,
    top: 10,
    width: 42
  },
  savedImage: {
    height: "100%",
    width: "100%"
  },
  savedImageFrame: {
    backgroundColor: colors.cream,
    flex: 1,
    overflow: "hidden"
  },
  savedMatch: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 16
  },
  savedMatchRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  savedSection: {
    backgroundColor: "#faf8f8",
    gap: 18,
    paddingVertical: 24
  },
  savedSectionTitle: {
    color: colors.text,
    fontFamily: fonts.serifRegular,
    fontSize: 30,
    lineHeight: 38,
    paddingHorizontal: spacing.screen
  },
  savedShopButton: {
    alignItems: "center",
    borderColor: colors.secondaryBorder,
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    height: 40,
    justifyContent: "center"
  },
  savedShopText: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18
  },
  priceStyleSection: {
    backgroundColor: colors.background,
    gap: 24,
    paddingHorizontal: spacing.screen,
    paddingVertical: 24
  },
  priceStyleTitle: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 22,
    lineHeight: 29
  },
  priceTabPill: {
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: radii.pill,
    height: 30,
    justifyContent: "center",
    paddingHorizontal: 17
  },
  priceTabPillSelected: {
    backgroundColor: colors.inverse
  },
  priceTabsContent: {
    gap: 8,
    paddingHorizontal: spacing.screen
  },
  priceTabsScroller: {
    marginHorizontal: -spacing.screen
  },
  priceTabText: {
    color: "rgba(0, 0, 0, 0.8)",
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 20
  },
  priceTabTextSelected: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium
  },
  screen: {
    backgroundColor: "#faf8f8",
    flex: 1
  },
  searchActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12
  },
  searchBar: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    height: 42,
    marginHorizontal: spacing.screen,
    marginTop: 14,
    paddingHorizontal: 14
  },
  searchText: {
    color: colors.soft,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.serifRegular,
    fontSize: 22,
    lineHeight: 29
  },
  styledIntro: {
    gap: 10,
    paddingBottom: 24,
    paddingHorizontal: spacing.screen,
    paddingTop: 20
  },
  swatch: {
    borderColor: colors.surface,
    borderRadius: radii.pill,
    borderWidth: 1,
    height: 16,
    width: 16
  },
  swatchOverlap: {
    marginLeft: -7
  },
  swatchStack: {
    alignItems: "center",
    flexDirection: "row"
  },
  tabPill: {
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 24
  },
  tabPillSelected: {
    backgroundColor: colors.inverse,
    borderColor: colors.inverse
  },
  tabText: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22
  },
  tabTextSelected: {
    color: colors.inverseText
  },
  tabsContent: {
    gap: 12,
    paddingRight: spacing.screen
  },
  tabsScroller: {
    marginHorizontal: -spacing.screen
  },
  wardrobeBanner: {
    height: 410,
    justifyContent: "flex-end",
    marginHorizontal: spacing.screen,
    marginTop: 24,
    overflow: "hidden"
  },
  wardrobeBody: {
    color: colors.inverseText,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 280
  },
  wardrobeCopy: {
    gap: 10,
    padding: 24
  },
  wardrobeCta: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    borderColor: "rgba(255, 255, 255, 0.35)",
    borderRadius: radii.pill,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    marginTop: 6,
    paddingHorizontal: 22
  },
  wardrobeCtaText: {
    color: colors.inverseText,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18
  },
  wardrobeImage: {
    borderRadius: 32
  },
  wardrobeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.22)",
    borderRadius: 32
  },
  wardrobeTitle: {
    color: colors.inverseText,
    fontFamily: fonts.serif,
    fontSize: 24,
    lineHeight: 31,
    maxWidth: 300
  },
  whiteSection: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    gap: 18,
    marginHorizontal: 0,
    paddingHorizontal: spacing.screen,
    paddingVertical: 24
  }
});
