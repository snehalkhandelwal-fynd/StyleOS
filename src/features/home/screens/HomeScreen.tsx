import { prototypeProductImages } from "../data/prototypeProductImages";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  ImageSourcePropType,
  type GestureResponderEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  type StyleProp,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
  type ViewStyle
} from "react-native";
import Svg, { Path } from "react-native-svg";

import type { OnboardingDraft } from "../../onboarding/viewModels/useOnboardingViewModel";
import { CartCountBadge } from "../components/CartCountBadge";
import { BrandLogoMark } from "../components/BrandLogoMark";
import {
  formatMatchLabel,
  isMatchLabel,
  MatchRibbonTag
} from "../components/MatchRibbonTag";
import { WishlistHeartIcon } from "../components/WishlistHeartIcon";
import { allBrandsId, brandRows, type Brand } from "../data/brandCatalog";
import {
  getMerchandisingLabel,
  hasCompletedStyleProfile
} from "../utils/stylePersonalization";
import { colors, fonts, radii, spacing } from "../../../theme";

const AnimatedHeaderView = Animated.createAnimatedComponent(View);
const homeHeaderTopInset =
  Platform.OS === "ios" ? 44 : StatusBar.currentHeight ?? 0;
const homeHeaderTopPadding = homeHeaderTopInset + spacing.sm;
const defaultLocationHeaderHeight = 44;
const defaultSearchHeaderHeight = 60;

type HomeScreenProps = {
  cartCount?: number;
  draft: OnboardingDraft;
  isGuest: boolean;
  onChangeAddress: () => void;
  onOpenBrand: (brandId: string) => void;
  onOpenCart: () => void;
  onOpenLook: (look: ProductLook) => void;
  onOpenSearch: () => void;
  onShopLook: (look: ProductLook) => void;
  onStartStyleQuiz: () => void;
};

type OutfitPieceKind =
  | "accessory"
  | "bag"
  | "bottom"
  | "dress"
  | "jacket"
  | "shoe"
  | "top";

type OutfitPiece = {
  image?: string;
  kind: OutfitPieceKind;
  label: string;
};

type ProductLook = {
  brand: string;
  id: string;
  image: string;
  itemCount: string;
  match: string;
  outfitItems: OutfitPiece[];
  price: string;
  title: string;
  tries: string;
  vibe: string;
};

export type { OutfitPiece, OutfitPieceKind, ProductLook };

const demoAvatar = require("../../../assets/bodyimage.png");
const colourAnalysisImage = require("../../../assets/colour-analysis.png");
const heroStyleQuizImage = require("../../../assets/hero-style-quiz.jpg");
const shoeProductImage = prototypeProductImages.sandro.brownJacket;
const bagProductImage = prototypeProductImages.maje.stripedScarfDenim;

const fallbackOutfitPieceImages: Record<OutfitPieceKind, string> = {
  accessory: prototypeProductImages.productOnly.accessory,
  bag: prototypeProductImages.productOnly.accessory,
  bottom: prototypeProductImages.productOnly.bottom,
  dress: prototypeProductImages.productOnly.dress,
  jacket: prototypeProductImages.productOnly.jacket,
  shoe: prototypeProductImages.productOnly.shoe,
  top: prototypeProductImages.productOnly.top
};

const looks: ProductLook[] = [
  {
    brand: "Trends",
    id: "linen-city",
    image:
      prototypeProductImages.sandro.navyTailoredSet,
    itemCount: "3 pieces",
    match: "91% match",
    outfitItems: [
      { image: prototypeProductImages.maje.ivoryMiniDress, kind: "top", label: "Top" },
      {
        image: prototypeProductImages.maje.blueScarfTrousers,
        kind: "bottom",
        label: "Trousers"
      },
      { image: shoeProductImage, kind: "shoe", label: "Shoes" }
    ],
    price: "From ₹8,499",
    title: "Linen city set",
    tries: "1.2k tries",
    vibe: "Work"
  },
  {
    brand: "Trends",
    id: "soft-evening",
    image:
      prototypeProductImages.maje.beigeCrochetDress,
    itemCount: "2 pieces",
    match: "88% match",
    outfitItems: [
      {
        image: prototypeProductImages.maje.beigeCrochetDress,
        kind: "dress",
        label: "Dress"
      },
      { image: shoeProductImage, kind: "shoe", label: "Heels" }
    ],
    price: "From ₹5,299",
    title: "Soft evening",
    tries: "934 tries",
    vibe: "Date night"
  },
  {
    brand: "Trends",
    id: "travel-denim",
    image: prototypeProductImages.sandro.denimJacket,
    itemCount: "4 pieces",
    match: "86% match",
    outfitItems: [
      {
        image: prototypeProductImages.sandro.denimJacket,
        kind: "jacket",
        label: "Jacket"
      },
      { image: prototypeProductImages.maje.greenDenimTop, kind: "top", label: "Top" },
      {
        image: prototypeProductImages.maje.blueScarfTrousers,
        kind: "bottom",
        label: "Denim"
      },
      { image: shoeProductImage, kind: "shoe", label: "Sneakers" }
    ],
    price: "From ₹6,799",
    title: "Travel denim",
    tries: "818 tries",
    vibe: "Travel"
  },
  {
    brand: "Trends",
    id: "quiet-tailoring",
    image: prototypeProductImages.maje.tanHoodedJacket,
    itemCount: "3 pieces",
    match: "93% match",
    outfitItems: [
      {
        image: prototypeProductImages.sandro.whitePinstripeSuit,
        kind: "jacket",
        label: "Blazer"
      },
      {
        image: prototypeProductImages.maje.beigeCrochetDress,
        kind: "dress",
        label: "Dress"
      },
      { image: shoeProductImage, kind: "shoe", label: "Heels" }
    ],
    price: "From ₹7,499",
    title: "Quiet tailoring",
    tries: "1.6k tries",
    vibe: "Formal"
  },
  {
    brand: "Trends",
    id: "goa-weekend",
    image: prototypeProductImages.maje.pinkRelaxedSet,
    itemCount: "3 pieces",
    match: "84% match",
    outfitItems: [
      { image: prototypeProductImages.maje.greenDenimTop, kind: "top", label: "Top" },
      {
        image: prototypeProductImages.maje.khakiTrenchSkirt,
        kind: "bottom",
        label: "Skirt"
      },
      { image: bagProductImage, kind: "bag", label: "Bag" }
    ],
    price: "From ₹4,899",
    title: "Goa weekend",
    tries: "702 tries",
    vibe: "Casual"
  },
  {
    brand: "Trends",
    id: "festive-ease",
    image:
      prototypeProductImages.sandro.beigeTrench,
    itemCount: "4 pieces",
    match: "89% match",
    outfitItems: [
      { image: prototypeProductImages.maje.pinkRelaxedSet, kind: "dress", label: "Set" },
      {
        image: prototypeProductImages.sandro.beigeTrench,
        kind: "jacket",
        label: "Layer"
      },
      { image: shoeProductImage, kind: "shoe", label: "Footwear" },
      { image: bagProductImage, kind: "bag", label: "Bag" }
    ],
    price: "From ₹9,299",
    title: "Festive ease",
    tries: "1.1k tries",
    vibe: "Festive"
  },
  {
    brand: "Trends",
    id: "party-satin",
    image: prototypeProductImages.maje.sheerPartyDress,
    itemCount: "2 pieces",
    match: "87% match",
    outfitItems: [
      {
        image: prototypeProductImages.maje.sheerPartyDress,
        kind: "dress",
        label: "Dress"
      },
      { image: shoeProductImage, kind: "shoe", label: "Heels" }
    ],
    price: "From ₹6,199",
    title: "Party satin",
    tries: "965 tries",
    vibe: "Party"
  },
  {
    brand: "Trends",
    id: "workday-neutral",
    image: prototypeProductImages.sandro.whitePinstripeSuit,
    itemCount: "4 pieces",
    match: "92% match",
    outfitItems: [
      { image: prototypeProductImages.maje.ivoryMiniDress, kind: "top", label: "Top" },
      {
        image: prototypeProductImages.maje.blueScarfTrousers,
        kind: "bottom",
        label: "Trousers"
      },
      { image: bagProductImage, kind: "bag", label: "Bag" },
      { image: shoeProductImage, kind: "shoe", label: "Footwear" }
    ],
    price: "From ₹7,899",
    title: "Workday neutral",
    tries: "1.4k tries",
    vibe: "Work"
  }
];

const arrivals = [
  {
    id: "arrival-1",
    image:
      prototypeProductImages.maje.greenDenimTop,
    match: "90%",
    name: "Soft runner",
    price: "₹2,300"
  },
  {
    id: "arrival-2",
    image:
      prototypeProductImages.maje.beigeCrochetDress,
    match: "87%",
    name: "Slip dress",
    price: "₹1,999"
  },
  {
    id: "arrival-3",
    image: prototypeProductImages.maje.greenDenimTop,
    match: "85%",
    name: "Relaxed shirt",
    price: "₹1,499"
  },
  {
    id: "arrival-4",
    image:
      prototypeProductImages.sandro.whitePinstripeSuit,
    match: "82%",
    name: "Wide trousers",
    price: "₹2,799"
  }
];

const occasionFilters = [
  "Work",
  "Casual",
  "Date Night",
  "Party",
  "Formal",
  "Travel",
  "Festive"
];

const priceFilters = ["Under ₹999", "Under ₹1999", "Under ₹2999", "Under ₹3999"];
const savedLookDeliveryWindows = [
  "Delivery in 2 days",
  "Delivery in 4 days",
  "Delivery in 3 days",
  "Delivery in 5 days",
  "Delivery in 6 days"
];

type HeroSpotlightAction = "styleQuiz" | "explore";

type HeroSpotlight = {
  action: HeroSpotlightAction;
  body: string;
  ctaLabel: string;
  eyebrow: string;
  id: string;
  image: ImageSourcePropType;
  title: string;
};

const heroSpotlights: HeroSpotlight[] = [
  {
    action: "styleQuiz",
    body: "Swipe on looks you love so Mira learns your taste.",
    ctaLabel: "Start swiping",
    eyebrow: "Style match",
    id: "hero-style-quiz",
    image: heroStyleQuizImage,
    title: "Find your style in 30 seconds"
  },
  {
    action: "explore",
    body: "Try any look on your avatar before you decide.",
    ctaLabel: "Try a look",
    eyebrow: "Virtual try-on",
    id: "hero-try-on",
    image: {
      uri: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80"
    },
    title: "See it on you, first"
  },
  {
    action: "explore",
    body: "New arrivals styled for the week ahead.",
    ctaLabel: "Explore the edit",
    eyebrow: "This week",
    id: "hero-weekly-edit",
    image: {
      uri: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"
    },
    title: "Fresh drops, picked for you"
  }
];

const demoOutfits = [looks[0].image, looks[1].image, looks[3].image];
const headerActionIconSize = 22;
const headerActionStrokeWidth = 1.8;

function HeaderTruckIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
      <Path
        d="M15.75 10.7667L15.7492 10.7659L13.1367 7.50006H11.25V12.5757C11.6482 12.2187 12.1731 12.0001 12.75 12.0001C13.7293 12.0001 14.5605 12.6266 14.8696 13.5001H15.75V10.7667ZM5.24997 13.5001C4.8358 13.5001 4.49997 13.8359 4.49997 14.2501C4.49997 14.6642 4.8358 15 5.24997 15.0001C5.66418 15.0001 5.99997 14.6643 5.99997 14.2501C5.99997 13.8358 5.66418 13.5001 5.24997 13.5001ZM12.75 13.5001C12.3358 13.5001 12 13.8359 12 14.2501C12 14.6642 12.3358 15 12.75 15.0001C13.1642 15.0001 13.5 14.6643 13.5 14.2501C13.5 13.8358 13.1642 13.5001 12.75 13.5001ZM2.43161 1.7608C2.70179 1.44687 3.17527 1.41155 3.48923 1.6817C3.80317 1.95187 3.83848 2.42535 3.56833 2.73932L2.69235 3.75738H3.42917C3.61763 3.73347 3.80907 3.75865 3.98508 3.83063L4.07443 3.87164L4.15939 3.91998C4.32456 4.02493 4.45877 4.17225 4.54831 4.34625L4.58932 4.43487L4.62228 4.52789C4.68905 4.74589 4.68655 4.98015 4.61423 5.19806C4.54626 5.40277 4.41917 5.58097 4.25168 5.71368L2.79929 7.27594C2.51717 7.57921 2.04275 7.59613 1.73947 7.31402C1.43624 7.03195 1.41867 6.5575 1.70065 6.25421L2.6279 5.25738H1.87497C1.65433 5.25971 1.43775 5.19686 1.25241 5.07648C1.06042 4.95173 0.911028 4.77144 0.824676 4.55939C0.738331 4.34722 0.71866 4.11341 0.769012 3.88995L0.791717 3.80719C0.84455 3.63529 0.93785 3.47851 1.06418 3.35016L2.43161 1.7608ZM17.25 13.5001C17.25 13.8979 17.0918 14.2793 16.8105 14.5606C16.5292 14.8419 16.1478 15.0001 15.75 15.0001H14.8696C14.5605 15.8736 13.7293 16.5001 12.75 16.5001C11.7707 16.5 10.9402 15.8734 10.6311 15.0001H7.3696C7.0605 15.8736 6.22935 16.5001 5.24997 16.5001C4.2707 16.5 3.44021 15.8734 3.13107 15.0001H2.24997C1.85218 15 1.47071 14.8419 1.18942 14.5606C0.908146 14.2793 0.749969 13.8979 0.749969 13.5001V9.75006C0.749969 9.33588 1.0858 9.00011 1.49997 9.00006C1.91418 9.00006 2.24997 9.33585 2.24997 9.75006V13.5001H3.13107C3.44021 12.6267 4.2707 12.0001 5.24997 12.0001C6.22935 12.0001 7.0605 12.6266 7.3696 13.5001H9.74997V5.25006C9.74997 5.05115 9.67089 4.86044 9.53024 4.71979C9.38959 4.57916 9.19886 4.50006 8.99997 4.50006H6.74997C6.3358 4.50001 5.99997 4.16424 5.99997 3.75006C5.99997 3.33588 6.3358 3.00011 6.74997 3.00006H8.99997C9.59668 3.00006 10.1688 3.23731 10.5908 3.65924C11.0127 4.0812 11.25 4.65332 11.25 5.25006V6.00006H13.1433C13.3686 6.0011 13.5911 6.05299 13.7937 6.15167C13.9948 6.24966 14.1716 6.39119 14.3108 6.56622L16.9196 9.82843C17.1312 10.0922 17.2479 10.4198 17.25 10.7579V13.5001Z"
        fill={colors.text}
      />
    </Svg>
  );
}

function HeaderSearchIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M20.1753 20.69L16.4053 16.9199" stroke="#AAA8A7" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M15.4953 3.30994C15.4953 5.03309 16.8922 6.42999 18.6153 6.42999C16.8922 6.42999 15.4953 7.82688 15.4953 9.55004C15.4953 7.82688 14.0984 6.42999 12.3752 6.42999C14.0984 6.42999 15.4953 5.03309 15.4953 3.30994Z" fill="#AAA8A7" />
      <Path d="M11.5083 4.31506C12.2512 4.31508 12.9694 4.42205 13.6489 4.61877C13.1496 5.11422 12.5674 5.52582 11.9243 5.83069C11.7869 5.82156 11.648 5.81507 11.5083 5.81506C8.09356 5.81525 5.32491 8.58392 5.32471 11.9987C5.32478 15.4135 8.09348 18.1821 11.5083 18.1823C14.9232 18.1822 17.6918 15.4136 17.6919 11.9987C17.6918 10.8401 17.3724 9.75658 16.8179 8.82971C17.1348 8.42447 17.5007 8.05976 17.9067 7.74377C18.7186 8.96199 19.1918 10.425 19.1919 11.9987C19.1918 16.242 15.7516 19.6822 11.5083 19.6823C7.26505 19.6821 3.82478 16.2419 3.82471 11.9987C3.82491 7.75549 7.26513 4.31525 11.5083 4.31506Z" fill="#AAA8A7" />
    </Svg>
  );
}

function HeaderMicIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M11.9999 4C11.4213 4 10.8663 4.22987 10.4572 4.63904C10.048 5.04821 9.81812 5.60316 9.81812 6.18182V12C9.81812 12.5787 10.048 13.1336 10.4572 13.5428C10.8663 13.9519 11.4213 14.1818 11.9999 14.1818C12.5786 14.1818 13.1335 13.9519 13.5427 13.5428C13.9519 13.1336 14.1818 12.5787 14.1818 12V6.18182C14.1818 5.60316 13.9519 5.04821 13.5427 4.63904C13.1335 4.22987 12.5786 4 11.9999 4Z" stroke="#AAA8A7" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M17.091 10.5454V12C17.091 13.3501 16.5546 14.645 15.5999 15.5998C14.6452 16.5545 13.3503 17.0909 12.0001 17.0909C10.6499 17.0909 9.355 16.5545 8.40027 15.5998C7.44554 14.645 6.90918 13.3501 6.90918 12V10.5454" stroke="#AAA8A7" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 17.0909V20" stroke="#AAA8A7" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9.09082 20H14.909" stroke="#AAA8A7" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function HeaderCameraIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M20 17.091C20 17.4767 19.8468 17.8467 19.574 18.1195C19.3012 18.3923 18.9312 18.5455 18.5455 18.5455H5.45455C5.06878 18.5455 4.69881 18.3923 4.42603 18.1195C4.15325 17.8467 4 17.4767 4 17.091V9.09095C4 8.70518 4.15325 8.33521 4.42603 8.06243C4.69881 7.78965 5.06878 7.63641 5.45455 7.63641H8.36364L9.81818 5.45459H14.1818L15.6364 7.63641H18.5455C18.9312 7.63641 19.3012 7.78965 19.574 8.06243C19.8468 8.33521 20 8.70518 20 9.09095V17.091Z" stroke="#AAA8A7" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M11.9999 15.6364C13.6066 15.6364 14.909 14.334 14.909 12.7273C14.909 11.1207 13.6066 9.81824 11.9999 9.81824C10.3933 9.81824 9.09082 11.1207 9.09082 12.7273C9.09082 14.334 10.3933 15.6364 11.9999 15.6364Z" stroke="#AAA8A7" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function SectionHeader({
  action,
  subtitle,
  title
}: {
  action?: string;
  subtitle?: string;
  title: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleGroup}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {action ? <Text style={styles.sectionAction}>{action}</Text> : null}
    </View>
  );
}

function getShortDeliveryAddress(address?: string) {
  const trimmedAddress = address?.trim();

  if (!trimmedAddress) {
    return "Deliver to Andheri East";
  }

  if (/andheri\s*east|marol/i.test(trimmedAddress)) {
    return "Deliver to Andheri East";
  }

  const area = trimmedAddress
    .split(",")
    .map((part) => part.trim())
    .find((part) => /(east|west|north|south|bandra|powai|juhu|thane)/i.test(part));

  return area ? `Deliver to ${area}` : "Deliver to Andheri East";
}

function LocationNavigation({
  address,
  cartCount = 0,
  onChangeAddress,
  onOpenCart
}: {
  address: string;
  cartCount?: number;
  onChangeAddress: () => void;
  onOpenCart: () => void;
}) {
  return (
    <View style={styles.navRow}>
      <Pressable
        accessibilityLabel="Change location"
        accessibilityRole="button"
        onPress={onChangeAddress}
        style={styles.locationButton}
      >
        <HeaderTruckIcon />
        <Text numberOfLines={1} style={styles.locationText}>
          {address}
        </Text>
        <Feather color="#8F8E8C" name="chevron-down" size={22} />
      </Pressable>
      <View style={styles.headerActions}>
        <Pressable
          accessibilityLabel="Notifications"
          accessibilityRole="button"
          style={styles.headerIconButton}
        >
          <Feather
            color={colors.text}
            name="bell"
            size={headerActionIconSize}
            strokeWidth={headerActionStrokeWidth}
          />
        </Pressable>
        <Pressable
          accessibilityLabel="Cart"
          accessibilityRole="button"
          onPress={onOpenCart}
          style={styles.headerIconButton}
        >
          <Feather
            color={colors.text}
            name="shopping-cart"
            size={headerActionIconSize}
            strokeWidth={headerActionStrokeWidth}
          />
          <CartCountBadge count={cartCount} />
        </Pressable>
      </View>
    </View>
  );
}

function SearchNavigation({ onOpenSearch }: { onOpenSearch: () => void }) {
  return (
    <Pressable
      accessibilityLabel="Open search"
      accessibilityRole="button"
      onPress={onOpenSearch}
      style={styles.searchBar}
    >
      <HeaderSearchIcon />
      <Text numberOfLines={1} style={styles.searchPlaceholder}>
        Search by occasion, style, or vibe...
      </Text>
      <View style={styles.searchIcons}>
        <HeaderMicIcon />
        <HeaderCameraIcon />
      </View>
    </Pressable>
  );
}

function HeroSpotlightCarousel({
  hasStyleProfile,
  onExplore,
  onStartStyleQuiz,
  width
}: {
  hasStyleProfile: boolean;
  onExplore: () => void;
  onStartStyleQuiz: () => void;
  width: number;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const visibleSpotlights = useMemo(
    () =>
      hasStyleProfile
        ? heroSpotlights.filter((item) => item.action !== "styleQuiz")
        : heroSpotlights,
    [hasStyleProfile]
  );
  const peek = 30;
  const cardGap = spacing.md;
  const cardWidth = width - spacing.screen * 2 - peek;
  const cardHeight = Math.round(cardWidth * 1.364);
  const snapInterval = cardWidth + cardGap;
  const lastIndex = visibleSpotlights.length - 1;

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, lastIndex));
  }, [lastIndex]);

  const handleScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / snapInterval
    );
    setActiveIndex(Math.min(lastIndex, Math.max(0, index)));
  };

  return (
    <View style={styles.heroCarousel}>
      <ScrollView
        contentContainerStyle={[
          styles.heroTrack,
          { paddingRight: spacing.screen + peek }
        ]}
        decelerationRate="fast"
        horizontal
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        snapToInterval={snapInterval}
      >
        {visibleSpotlights.map((item, index) => (
          <Pressable
            accessibilityRole="button"
            key={item.id}
            onPress={
              item.action === "styleQuiz" ? onStartStyleQuiz : onExplore
            }
            style={({ pressed }) => [
              styles.heroSlide,
              {
                height: cardHeight,
                marginRight: index === lastIndex ? 0 : cardGap,
                width: cardWidth
              },
              pressed ? styles.pressed : null
            ]}
          >
            <ImageBackground
              imageStyle={styles.heroImageRadius}
              resizeMode="cover"
              source={item.image}
              style={styles.heroImage}
            >
              <LinearGradient
                colors={[
                  "rgba(10, 10, 10, 0)",
                  "rgba(10, 10, 10, 0.18)",
                  "rgba(10, 10, 10, 0.86)"
                ]}
                style={styles.heroScrim}
              />
              <View style={styles.heroEyebrowPill}>
                <Text style={styles.heroEyebrowText}>{item.eyebrow}</Text>
              </View>
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>{item.title}</Text>
                <Text style={styles.heroBody}>{item.body}</Text>
                <View style={styles.heroCta}>
                  <Text style={styles.heroCtaText}>{item.ctaLabel}</Text>
                  <Feather
                    color={colors.text}
                    name="arrow-right"
                    size={15}
                  />
                </View>
              </View>
            </ImageBackground>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.heroDots}>
        {visibleSpotlights.map((item, index) => (
          <View
            key={`hero-dot-${item.id}`}
            style={[
              styles.heroDot,
              index === activeIndex ? styles.heroDotActive : null
            ]}
          />
        ))}
      </View>
    </View>
  );
}

function OccasionFilters({
  selected,
  onSelect
}: {
  onSelect: (filter: string) => void;
  selected: string;
}) {
  return (
    <ScrollView
      contentContainerStyle={styles.filterTrack}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterScroller}
    >
      {occasionFilters.map((filter) => {
        const isSelected = selected === filter;

        return (
          <Pressable
            accessibilityRole="button"
            key={filter}
            onPress={() => onSelect(filter)}
            style={[styles.filterPill, isSelected ? styles.filterPillSelected : null]}
          >
            <Text
              style={[
                styles.filterText,
                isSelected ? styles.filterTextSelected : null
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

function getOutfitPieceImage(piece: OutfitPiece) {
  return fallbackOutfitPieceImages[piece.kind];
}

function OutfitPieceChips({ pieces }: { pieces: OutfitPiece[] }) {
  return (
    <View style={styles.outfitPieceChips}>
      {pieces.map((piece, index) => (
        <View
          accessibilityLabel={piece.label}
          key={`${piece.kind}-${piece.label}-${index}`}
          style={[
            styles.outfitPieceChip,
            {
              marginLeft: index === 0 ? 0 : -8,
              zIndex: pieces.length - index
            }
          ]}
        >
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="cover"
            source={{ uri: getOutfitPieceImage(piece) }}
            style={styles.outfitPieceImage}
          />
        </View>
      ))}
    </View>
  );
}

function OccasionSection({
  cardWidth,
  hasStyleProfile,
  onOpenLook,
  onSelect,
  onToggleWishlist,
  products,
  selected,
  wishlistProductIds
}: {
  cardWidth: number;
  hasStyleProfile: boolean;
  onOpenLook: (look: ProductLook) => void;
  onSelect: (filter: string) => void;
  onToggleWishlist: (productId: string) => void;
  products: ProductLook[];
  selected: string;
  wishlistProductIds: Set<string>;
}) {
  return (
    <View style={styles.occasionSection}>
      <Text style={styles.occasionTitle}>What’s the occasion?</Text>
      <OccasionFilters onSelect={onSelect} selected={selected} />
      <View style={styles.occasionGrid}>
        {products.slice(0, 6).map((product, index) => (
          <ProductCard
            displayLabel={getMerchandisingLabel({
              fallbackIndex: index,
              hasStyleProfile,
              personalizedLabel: product.match
            })}
            isWishlisted={wishlistProductIds.has(product.id)}
            key={product.id}
            onOpen={() => onOpenLook(product)}
            onPrimaryAction={() => onOpenLook(product)}
            onToggleWishlist={() => onToggleWishlist(product.id)}
            product={product}
            width={cardWidth}
          />
        ))}
      </View>
    </View>
  );
}

function TryOnDemoHero() {
  const [demoIndex, setDemoIndex] = useState(0);
  const outfitLabels = ["Work layers", "Evening set", "Travel casual"];
  const currentImage = demoOutfits[demoIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setDemoIndex((index) => (index + 1) % outfitLabels.length);
    }, 2200);

    return () => clearInterval(timer);
  }, [outfitLabels.length]);

  return (
    <Pressable accessibilityRole="button" style={styles.demoCard}>
      <View style={styles.demoVisual}>
        <View style={styles.demoBadge}>
          <Text style={styles.demoBadgeText}>3 looks · tap to try on</Text>
        </View>
        <View style={styles.demoOutfitPill}>
          <Text style={styles.demoOutfitText}>{outfitLabels[demoIndex]}</Text>
        </View>
        <ImageBackground
          imageStyle={styles.demoFashionImageStyle}
          resizeMode="cover"
          source={{ uri: currentImage }}
          style={styles.demoFashionImage}
        />
      </View>
      <View style={styles.demoFooter}>
        <Text style={styles.demoHeadline}>See yourself in any outfit</Text>
        <Text style={styles.demoCopy}>Tap to try these on yourself</Text>
        <View style={styles.demoCta}>
          <Text style={styles.demoCtaText}>Try this on me</Text>
        </View>
      </View>
    </Pressable>
  );
}

function WardrobeIntelligenceCard() {
  return (
    <View style={[styles.creamCard, styles.closetCard]}>
      <Text style={styles.wardrobeTitle}>Build looks from what you own</Text>
      <Text style={styles.wardrobeCopy}>
        Add items you already wear. We’ll suggest outfits and new pieces that go with it.
      </Text>
      <View style={styles.ghostRow}>
        {[0, 1, 2].map((item) => (
          <View key={item} style={styles.ghostWrap}>
            <View style={styles.ghostCard}>
              <Image
                blurRadius={4}
                resizeMode="contain"
                source={demoAvatar}
                style={styles.ghostImage}
              />
              <View style={styles.ghostOverlay} />
            </View>
            <Text style={styles.ghostLabel}>Your item + Trends</Text>
          </View>
        ))}
      </View>
      <Pressable accessibilityRole="button" style={styles.wardrobeButton}>
        <Text style={styles.wardrobeButtonText}>Add my first piece</Text>
      </Pressable>
    </View>
  );
}

function SaveButton({
  onPress,
  saved: controlledSaved
}: {
  onPress?: () => void;
  saved?: boolean;
}) {
  const [localSaved, setLocalSaved] = useState(false);
  const saved = controlledSaved ?? localSaved;

  const handlePress = (event: GestureResponderEvent) => {
    event.stopPropagation();

    if (onPress) {
      onPress();
      return;
    }

    setLocalSaved((value) => !value);
  };

  return (
    <Pressable
      accessibilityLabel={saved ? "Remove from wishlist" : "Add to wishlist"}
      accessibilityRole="button"
      accessibilityState={{ selected: saved }}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.saveButton,
        pressed ? styles.pressed : null
      ]}
    >
      <WishlistHeartIcon saved={saved} />
    </Pressable>
  );
}

function ProductCard({
  displayLabel,
  isWishlisted = false,
  onOpen,
  onPrimaryAction,
  onToggleWishlist,
  product,
  width
}: {
  displayLabel: string;
  isWishlisted?: boolean;
  onOpen?: () => void;
  onPrimaryAction?: () => void;
  onToggleWishlist?: () => void;
  product: ProductLook;
  width: number;
}) {
  return (
    <Pressable
      accessibilityLabel={`Open ${product.title} look`}
      accessibilityRole="button"
      disabled={!onOpen}
      onPress={onOpen}
      style={({ pressed }) => [
        styles.productCard,
        { width },
        pressed && onOpen ? styles.pressed : null
      ]}
    >
      <ImageBackground
        imageStyle={styles.productImageStyle}
        resizeMode="cover"
        source={{ uri: product.image }}
        style={styles.productImage}
      >
        <View style={styles.productSaveWrap}>
          <SaveButton onPress={onToggleWishlist} saved={isWishlisted} />
        </View>
        <View style={styles.matchPill}>
          <Text style={styles.matchText}>{formatMatchLabel(displayLabel)}</Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

function TrendingSection({
  cardWidth,
  hasStyleProfile,
  onToggleWishlist,
  products,
  wishlistProductIds
}: {
  cardWidth: number;
  hasStyleProfile: boolean;
  onToggleWishlist: (productId: string) => void;
  products: ProductLook[];
  wishlistProductIds: Set<string>;
}) {
  const [visibleCount, setVisibleCount] = useState(4);
  const visibleProducts = products.slice(0, visibleCount);

  return (
    <View style={styles.section}>
      <SectionHeader
        action="See all →"
        subtitle={hasStyleProfile ? "Loved by people with your taste" : "Popular styles in Mumbai"}
        title="Trending in Mumbai"
      />
      <View style={styles.productGrid}>
        {visibleProducts.map((product, index) => (
          <ProductCard
            displayLabel={getMerchandisingLabel({
              fallbackIndex: index,
              hasStyleProfile,
              personalizedLabel: product.match
            })}
            isWishlisted={wishlistProductIds.has(product.id)}
            key={product.id}
            onToggleWishlist={() => onToggleWishlist(product.id)}
            product={product}
            width={cardWidth}
          />
        ))}
      </View>
      {visibleCount < products.length ? (
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            setVisibleCount((count) => Math.min(products.length, count + 4))
          }
          style={styles.seeMoreButton}
        >
          <Text style={styles.seeMoreText}>See more looks</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function ColourAnalysisCard() {
  const swatches = ["#D7C0A5", "#856955", "#CBA46B", "#6A7B5B", "#362E2A"];
  const { width } = useWindowDimensions();
  const colourImageWidth = width - spacing.screen * 2;
  const colourImageHeight = Math.round(colourImageWidth * (434 / 1006));

  return (
    <View style={styles.creamCard}>
      <Image
        accessibilityLabel="Skin tone analysis with recommended colour palette"
        resizeMode="cover"
        source={colourAnalysisImage}
        style={[
          styles.colourImage,
          { height: colourImageHeight, width: colourImageWidth }
        ]}
      />
      <View style={styles.swatchRow}>
        {swatches.map((swatch) => (
          <View key={swatch} style={[styles.paletteSwatch, { backgroundColor: swatch }]} />
        ))}
      </View>
      <Text style={styles.colourTitle}>Find colours that suit you</Text>
      <Text style={styles.colourCopy}>
        Discover shades that flatter you then see looks that match.
      </Text>
      <Pressable accessibilityRole="button" style={styles.unlockButton}>
        <Text style={styles.unlockButtonText}>Find my colours</Text>
      </Pressable>
    </View>
  );
}

const brandPillWidth = 105;
const brandPillGap = 6;

function BrandLogoPill({
  brand,
  onBrandPress,
  suffix
}: {
  brand: Brand;
  onBrandPress: (brandId: string) => void;
  suffix: string;
}) {
  return (
    <Pressable
      accessibilityLabel={`Shop ${brand.name}`}
      accessibilityRole="button"
      key={`${brand.id}-${suffix}`}
      onPress={() => onBrandPress(brand.id)}
      style={({ pressed }) => [
        styles.brandLogoPill,
        pressed ? styles.pressed : null
      ]}
    >
      <BrandLogoMark
        height={brand.logoHeight}
        variant={brand.logoVariant}
        width={brand.logoWidth}
      />
    </Pressable>
  );
}

function AutoMovingBrandRow({
  direction,
  duration,
  onBrandPress,
  row
}: {
  direction: "left" | "right";
  duration: number;
  onBrandPress: (brandId: string) => void;
  row: Brand[];
}) {
  const loopDistance = row.length * (brandPillWidth + brandPillGap);
  const startX = direction === "left" ? 0 : -loopDistance;
  const endX = direction === "left" ? -loopDistance : 0;
  const translateX = useRef(new Animated.Value(startX)).current;
  const movingBrands = [...row, ...row];

  useEffect(() => {
    translateX.setValue(startX);

    const animation = Animated.loop(
      Animated.timing(translateX, {
        duration,
        easing: Easing.linear,
        toValue: endX,
        useNativeDriver: true
      }),
      { resetBeforeIteration: true }
    );

    animation.start();

    return () => animation.stop();
  }, [duration, endX, startX, translateX]);

  return (
    <View style={styles.brandRowViewport}>
      <Animated.View
        style={[
          styles.brandMarqueeTrack,
          { transform: [{ translateX }] }
        ]}
      >
        {movingBrands.map((brand, index) => (
          <BrandLogoPill
            brand={brand}
            key={`${brand.id}-${index}`}
            onBrandPress={onBrandPress}
            suffix={`${index}`}
          />
        ))}
      </Animated.View>
    </View>
  );
}

function ShopByBrandsSection({
  onBrandPress
}: {
  onBrandPress: (brandId: string) => void;
}) {
  return (
    <View style={styles.brandSection}>
      <View style={styles.brandHeader}>
        <Text style={styles.brandSectionTitle}>Shop by Brands</Text>
        <Text style={styles.brandSectionSubtitle}>
          Shop by your favorite brands for every audio journey
        </Text>
      </View>

      <View style={styles.brandRows}>
        {brandRows.map((row, rowIndex) => (
          <AutoMovingBrandRow
            direction={rowIndex === 0 ? "left" : "right"}
            duration={rowIndex === 0 ? 24000 : 28000}
            key={`brand-row-${rowIndex}`}
            onBrandPress={onBrandPress}
            row={row}
          />
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => onBrandPress(allBrandsId)}
        style={({ pressed }) => [
          styles.brandViewAllButton,
          pressed ? styles.pressed : null
        ]}
      >
        <Text style={styles.brandViewAllText}>View All</Text>
      </Pressable>
    </View>
  );
}

function SavedLookCard({
  cardHeight,
  deliveryText,
  imageHeight,
  onOpenLook,
  onShopLook,
  onToggleWishlist,
  product,
  width
}: {
  cardHeight: number;
  deliveryText: string;
  imageHeight: number;
  onOpenLook: () => void;
  onShopLook: () => void;
  onToggleWishlist: () => void;
  product: ProductLook;
  width: number;
}) {
  return (
    <Pressable
      accessibilityLabel={`Open ${product.title} look`}
      accessibilityRole="button"
      onPress={onOpenLook}
      style={({ pressed }) => [
        styles.savedLookCard,
        { height: cardHeight, width },
        pressed ? styles.pressed : null
      ]}
    >
      <ImageBackground
        imageStyle={styles.savedLookImageStyle}
        resizeMode="cover"
        source={{ uri: product.image }}
        style={[styles.savedLookImage, { height: imageHeight }]}
      >
        <View style={styles.savedLookSaveWrap}>
          <SaveButton onPress={onToggleWishlist} saved />
        </View>
        <View style={styles.deliveryBadge}>
          <Feather color="#16A15C" name="check-circle" size={14} />
          <Text style={styles.deliveryBadgeText}>{deliveryText}</Text>
        </View>
      </ImageBackground>

      <View style={styles.savedLookFooter}>
        <Pressable
          accessibilityLabel={`Shop ${product.title}`}
          accessibilityRole="button"
          onPress={(event) => {
            event.stopPropagation();
            onShopLook();
          }}
          style={({ pressed }) => [
            styles.shopLookButton,
            pressed ? styles.pressed : null
          ]}
        >
          <Feather color={colors.text} name="shopping-cart" size={18} />
          <Text style={styles.shopLookText}>Shop this look</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

function SavedLooksSection({
  cardWidth,
  onOpenLook,
  onShopLook,
  onToggleWishlist,
  products,
  screenWidth
}: {
  cardWidth: number;
  onOpenLook: (product: ProductLook) => void;
  onShopLook: (product: ProductLook) => void;
  onToggleWishlist: (productId: string) => void;
  products: ProductLook[];
  screenWidth: number;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const railRef = useRef<ScrollView | null>(null);
  const activeRenderedIndexRef = useRef(0);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const cardGap = 12;
  const cardHeight = Math.round(cardWidth * 1.45);
  const imageHeight = cardHeight - 64;
  const snapInterval = cardWidth + cardGap;
  const canLoop = products.length > 1;
  const renderedProducts = canLoop
    ? [...products, ...products, ...products]
    : products;
  const loopOffset = canLoop ? products.length : 0;
  const initialOffset = loopOffset * snapInterval;
  const sideInset = Math.max((screenWidth - cardWidth) / 2, spacing.screen);

  useEffect(() => {
    activeRenderedIndexRef.current = loopOffset;
    scrollX.setValue(initialOffset);
    setActiveIndex(0);
    railRef.current?.scrollTo({ animated: false, x: initialOffset, y: 0 });
  }, [initialOffset, loopOffset, scrollX]);

  useEffect(() => {
    if (!canLoop) {
      return undefined;
    }

    const timer = setInterval(() => {
      const nextRenderedIndex = activeRenderedIndexRef.current + 1;
      const nextOffset = nextRenderedIndex * snapInterval;
      const nextRealIndex =
        (nextRenderedIndex - loopOffset + products.length) % products.length;

      activeRenderedIndexRef.current = nextRenderedIndex;
      railRef.current?.scrollTo({
        animated: true,
        x: nextOffset,
        y: 0
      });
      setActiveIndex(nextRealIndex);

      if (nextRenderedIndex >= loopOffset + products.length) {
        if (resetTimerRef.current) {
          clearTimeout(resetTimerRef.current);
        }

        resetTimerRef.current = setTimeout(() => {
          activeRenderedIndexRef.current = loopOffset;
          scrollX.setValue(initialOffset);
          railRef.current?.scrollTo({
            animated: false,
            x: initialOffset,
            y: 0
          });
        }, 700);
      }
    }, 5000);

    return () => {
      clearInterval(timer);

      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, [
    canLoop,
    initialOffset,
    loopOffset,
    products.length,
    scrollX,
    snapInterval
  ]);

  const handleScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const renderedIndex = Math.round(
      event.nativeEvent.contentOffset.x / snapInterval
    );

    if (canLoop && renderedIndex < loopOffset) {
      const wrappedIndex = renderedIndex + products.length;
      const wrappedOffset = wrappedIndex * snapInterval;
      const wrappedRealIndex =
        (wrappedIndex - loopOffset + products.length) % products.length;

      activeRenderedIndexRef.current = wrappedIndex;
      setActiveIndex(wrappedRealIndex);
      scrollX.setValue(wrappedOffset);
      railRef.current?.scrollTo({ animated: false, x: wrappedOffset, y: 0 });
      return;
    }

    if (canLoop && renderedIndex >= loopOffset + products.length) {
      const wrappedIndex = renderedIndex - products.length;
      const wrappedOffset = wrappedIndex * snapInterval;
      const wrappedRealIndex =
        (wrappedIndex - loopOffset + products.length) % products.length;

      activeRenderedIndexRef.current = wrappedIndex;
      setActiveIndex(wrappedRealIndex);
      scrollX.setValue(wrappedOffset);
      railRef.current?.scrollTo({ animated: false, x: wrappedOffset, y: 0 });
      return;
    }

    activeRenderedIndexRef.current = renderedIndex;
    setActiveIndex(
      Math.min(
        products.length - 1,
        Math.max(0, renderedIndex - loopOffset)
      )
    );
  };

  return (
    <View style={styles.savedLooksSection}>
      <Text style={styles.savedLooksTitle}>Continue where you left off</Text>
      <Animated.ScrollView
        contentContainerStyle={[
          styles.savedLooksTrack,
          { paddingHorizontal: sideInset }
        ]}
        decelerationRate="fast"
        horizontal
        ref={railRef}
        contentOffset={{ x: initialOffset, y: 0 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        snapToInterval={snapInterval}
      >
        {renderedProducts.map((product, index) => {
          const inputRange = [
            (index - 1) * snapInterval,
            index * snapInterval,
            (index + 1) * snapInterval
          ];
          const scale = scrollX.interpolate({
            extrapolate: "clamp",
            inputRange,
            outputRange: [0.82, 1, 0.82]
          });
          const opacity = scrollX.interpolate({
            extrapolate: "clamp",
            inputRange,
            outputRange: [0.82, 1, 0.82]
          });
          const isLastRenderedCard = index === renderedProducts.length - 1;

          return (
            <Animated.View
              key={`saved-${product.id}-${index}`}
              style={[
                styles.savedLookSlide,
                {
                  marginRight: isLastRenderedCard ? 0 : cardGap,
                  opacity,
                  transform: [{ scale }],
                  width: cardWidth
                }
              ]}
            >
              <SavedLookCard
                cardHeight={cardHeight}
                deliveryText={
                  savedLookDeliveryWindows[index % savedLookDeliveryWindows.length]
                }
                imageHeight={imageHeight}
                onOpenLook={() => onOpenLook(product)}
                onShopLook={() => onShopLook(product)}
                onToggleWishlist={() => onToggleWishlist(product.id)}
                product={product}
                width={cardWidth}
              />
            </Animated.View>
          );
        })}
      </Animated.ScrollView>

      <View style={styles.savedPagination}>
        {products.map((product, index) => (
          <View
            key={`saved-dot-${product.id}-${index}`}
            style={[
              styles.savedDot,
              index === activeIndex ? styles.savedDotActive : null
            ]}
          />
        ))}
      </View>
    </View>
  );
}

function PriceStyleLookCard({
  displayLabel,
  isWishlisted,
  onToggleWishlist,
  product,
  style,
  width
}: {
  displayLabel: string;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  product: ProductLook;
  style?: StyleProp<ViewStyle>;
  width: number;
}) {
  const imageHeight = Math.round(width * 1.24);

  return (
    <View style={[styles.priceLookCard, { width }, style]}>
      <ImageBackground
        imageStyle={styles.priceLookImageStyle}
        resizeMode="cover"
        source={{ uri: product.image }}
        style={[styles.priceLookImage, { height: imageHeight }]}
      >
        <View style={styles.priceLookSaveWrap}>
          <SaveButton onPress={onToggleWishlist} saved={isWishlisted} />
        </View>
      </ImageBackground>
      <View style={styles.priceLookFooter}>
        <OutfitPieceChips pieces={product.outfitItems.slice(0, 3)} />
        {isMatchLabel(displayLabel) ? (
          <MatchRibbonTag
            height={24}
            label={displayLabel}
            mirrored
            style={styles.priceLookMatchRibbon}
            textStyle={styles.smallMatchRibbonText}
            width={84}
          />
        ) : (
          <Text numberOfLines={1} style={styles.priceLookLabel}>
            {displayLabel}
          </Text>
        )}
      </View>
    </View>
  );
}

function PriceStyleSection({
  cardWidth,
  hasStyleProfile,
  onToggleWishlist,
  selectedPrice,
  setSelectedPrice,
  wishlistProductIds
}: {
  cardWidth: number;
  hasStyleProfile: boolean;
  onToggleWishlist: (productId: string) => void;
  selectedPrice: string;
  setSelectedPrice: (filter: string) => void;
  wishlistProductIds: Set<string>;
}) {
  const products = looks;

  return (
    <View style={styles.priceStyleSection}>
      <Text style={styles.priceStyleTitle}>Great style at every price</Text>
      <ScrollView
        contentContainerStyle={styles.priceFilterTrack}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {priceFilters.map((filter) => {
          const isSelected = selectedPrice === filter;

          return (
            <Pressable
              accessibilityRole="button"
              key={filter}
              onPress={() => setSelectedPrice(filter)}
              style={[
                styles.priceFilterPill,
                isSelected ? styles.priceFilterPillSelected : null
              ]}
            >
              <Text
                style={[
                  styles.priceFilterText,
                  isSelected ? styles.priceFilterTextSelected : null
                ]}
              >
                {filter}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <ScrollView
        contentContainerStyle={styles.priceLookTrack}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.priceLookScroller}
      >
        {products.map((product, index) => (
          <PriceStyleLookCard
            displayLabel={getMerchandisingLabel({
              fallbackIndex: index,
              hasStyleProfile,
              personalizedLabel: product.match
            })}
            isWishlisted={wishlistProductIds.has(product.id)}
            key={`price-${product.id}`}
            onToggleWishlist={() => onToggleWishlist(product.id)}
            product={product}
            style={[
              index === 0 ? styles.firstPriceLookCard : null,
              index === products.length - 1 ? styles.lastPriceLookCard : null
            ]}
            width={cardWidth}
          />
        ))}
      </ScrollView>
      <Pressable accessibilityRole="button" style={styles.priceExploreButton}>
        <Text style={styles.priceExploreButtonText}>Explore products</Text>
      </Pressable>
    </View>
  );
}

function NewArrivalCard({
  item
}: {
  item: (typeof arrivals)[number];
}) {
  return (
    <View style={styles.arrivalCard}>
      <ImageBackground
        imageStyle={styles.smallCardImageStyle}
        resizeMode="cover"
        source={{ uri: item.image }}
        style={styles.arrivalImage}
      >
        <View style={styles.arrivalSaveWrap}>
          <SaveButton />
        </View>
      </ImageBackground>
      <View style={styles.arrivalInfo}>
        <Text numberOfLines={1} style={styles.arrivalName}>
          {item.name}
        </Text>
        <Text style={styles.arrivalPrice}>{item.price}</Text>
      </View>
    </View>
  );
}

function NewArrivalsSection() {
  return (
    <View style={styles.newArrivalsSection}>
      <View style={styles.newArrivalsHeader}>
        <SectionHeader action="See all →" title="New arrivals to try on" />
      </View>
      <ScrollView
        contentContainerStyle={styles.newArrivalsTrack}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {arrivals.map((item) => (
          <NewArrivalCard item={item} key={item.id} />
        ))}
      </ScrollView>
    </View>
  );
}

export function HomeScreen({
  cartCount = 0,
  draft,
  onChangeAddress,
  onOpenBrand,
  onOpenCart,
  onOpenLook,
  onOpenSearch,
  onShopLook,
  onStartStyleQuiz
}: HomeScreenProps) {
  const { width } = useWindowDimensions();
  const headerCollapseProgress = useRef(new Animated.Value(0)).current;
  const isLocationHeaderVisible = useRef(true);
  const lastScrollY = useRef(0);
  const [locationHeaderHeight, setLocationHeaderHeight] = useState(0);
  const [searchHeaderHeight, setSearchHeaderHeight] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState("Work");
  const [wishlistProductIds, setWishlistProductIds] = useState<Set<string>>(
    () => new Set()
  );
  const address = getShortDeliveryAddress(draft.address);
  const hasStyleProfile = hasCompletedStyleProfile(draft);
  const cardWidth = (width - spacing.screen * 2 - spacing.sm) / 2;
  const savedLookCardWidth = Math.min(width * 0.68, 268);
  const visibleLocationHeaderHeight =
    locationHeaderHeight || defaultLocationHeaderHeight;
  const visibleSearchHeaderHeight =
    searchHeaderHeight || defaultSearchHeaderHeight;
  const headerHeight =
    homeHeaderTopPadding +
    visibleLocationHeaderHeight +
    visibleSearchHeaderHeight;
  const searchHeaderTop = homeHeaderTopPadding + visibleLocationHeaderHeight;
  const locationTranslateY = headerCollapseProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -(homeHeaderTopPadding + visibleLocationHeaderHeight)]
  });
  const searchTranslateY = headerCollapseProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -visibleLocationHeaderHeight]
  });

  const filteredLooks = useMemo(() => {
    return looks.filter(
      (look) => look.vibe.toLowerCase() === selectedOccasion.toLowerCase()
    ).concat(looks.filter(
      (look) => look.vibe.toLowerCase() !== selectedOccasion.toLowerCase()
    ));
  }, [selectedOccasion]);
  const savedLooks = useMemo(() => {
    const wishlistedLooks = looks.filter((look) =>
      wishlistProductIds.has(look.id)
    );

    return (wishlistedLooks.length > 0 ? wishlistedLooks : looks).slice(0, 5);
  }, [wishlistProductIds]);

  const handleToggleWishlist = (productId: string) => {
    setWishlistProductIds((current) => {
      const next = new Set(current);

      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }

      return next;
    });
  };

  const revealLocationHeader = () => {
    if (isLocationHeaderVisible.current) {
      return;
    }

    isLocationHeaderVisible.current = true;
    Animated.timing(headerCollapseProgress, {
      duration: 180,
      toValue: 0,
      useNativeDriver: true
    }).start();
  };

  const hideLocationHeader = () => {
    if (!isLocationHeaderVisible.current) {
      return;
    }

    isLocationHeaderVisible.current = false;
    Animated.timing(headerCollapseProgress, {
      duration: 180,
      toValue: 1,
      useNativeDriver: true
    }).start();
  };

  const handleHomeScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const currentY = Math.max(event.nativeEvent.contentOffset.y, 0);
    const deltaY = currentY - lastScrollY.current;
    const isPastThreshold = currentY > 60;
    const hideThreshold = Math.max(80, (headerHeight || 160) - spacing.md);

    setHasScrolled((current) =>
      current === isPastThreshold ? current : isPastThreshold
    );

    if (currentY <= 12) {
      revealLocationHeader();
    } else if (deltaY > 8 && currentY > hideThreshold) {
      hideLocationHeader();
    } else if (deltaY < -4) {
      revealLocationHeader();
    }

    lastScrollY.current = currentY;
  };

  return (
    <View style={styles.screen}>
      <View pointerEvents="box-none" style={styles.headerOverlay}>
        <View pointerEvents="none" style={styles.headerSafeArea} />
        <AnimatedHeaderView
          onLayout={(event) => {
            const measuredHeight = event.nativeEvent.layout.height;
            setLocationHeaderHeight((current) =>
              current === measuredHeight ? current : measuredHeight
            );
          }}
          style={[
            styles.locationHeader,
            {
              top: homeHeaderTopPadding,
              transform: [{ translateY: locationTranslateY }]
            }
          ]}
        >
          <LocationNavigation
            address={address}
            cartCount={cartCount}
            onChangeAddress={onChangeAddress}
            onOpenCart={onOpenCart}
          />
        </AnimatedHeaderView>
        <AnimatedHeaderView
          onLayout={(event) => {
            const measuredHeight = event.nativeEvent.layout.height;
            setSearchHeaderHeight((current) =>
              current === measuredHeight ? current : measuredHeight
            );
          }}
          style={[
            styles.searchHeader,
            hasScrolled ? styles.topNavScrolled : null,
            {
              top: searchHeaderTop,
              transform: [{ translateY: searchTranslateY }]
            }
          ]}
        >
          <SearchNavigation onOpenSearch={onOpenSearch} />
        </AnimatedHeaderView>
      </View>

      <Animated.ScrollView
        contentContainerStyle={[
          styles.feed,
          { paddingTop: headerHeight }
        ]}
        onScroll={handleHomeScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topCluster}>
          <HeroSpotlightCarousel
            hasStyleProfile={hasStyleProfile}
            onExplore={onOpenSearch}
            onStartStyleQuiz={onStartStyleQuiz}
            width={width}
          />
        </View>
        <OccasionSection
          cardWidth={cardWidth}
          hasStyleProfile={hasStyleProfile}
          onOpenLook={onOpenLook}
          onToggleWishlist={handleToggleWishlist}
          onSelect={setSelectedOccasion}
          products={filteredLooks}
          selected={selectedOccasion}
          wishlistProductIds={wishlistProductIds}
        />
        <WardrobeIntelligenceCard />
        <ShopByBrandsSection onBrandPress={onOpenBrand} />
        <SavedLooksSection
          cardWidth={savedLookCardWidth}
          onOpenLook={onOpenLook}
          onShopLook={onShopLook}
          onToggleWishlist={handleToggleWishlist}
          products={savedLooks}
          screenWidth={width}
        />
        <ColourAnalysisCard />
        <NewArrivalsSection />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  arrivalCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    width: 154
  },
  arrivalImage: {
    aspectRatio: 3 / 4,
    backgroundColor: colors.surface,
    alignItems: "flex-end",
    padding: 8
  },
  arrivalInfo: {
    backgroundColor: colors.background,
    padding: 12
  },
  arrivalName: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 14,
    lineHeight: 18
  },
  arrivalPrice: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 18,
    marginTop: 4
  },
  arrivalSaveWrap: {
    alignItems: "flex-end"
  },
  brandLogoPill: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 100,
    height: 40,
    justifyContent: "center",
    overflow: "hidden",
    width: 105
  },
  brandMarqueeTrack: {
    alignItems: "center",
    flexDirection: "row",
    gap: brandPillGap
  },
  brandHeader: {
    alignItems: "center",
    gap: 4,
    paddingHorizontal: spacing.screen
  },
  brandRowViewport: {
    height: 40,
    overflow: "hidden",
    width: "100%"
  },
  brandRows: {
    gap: 12,
    marginTop: 45
  },
  brandSection: {
    backgroundColor: colors.brandBand,
    borderRadius: 12,
    height: 311,
    overflow: "hidden",
    paddingTop: 24
  },
  brandSectionSubtitle: {
    alignSelf: "center",
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center"
  },
  brandSectionTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 25,
    textAlign: "center"
  },
  brandViewAllButton: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.text,
    borderRadius: 32,
    height: 48,
    justifyContent: "center",
    marginTop: 24,
    paddingHorizontal: 24
  },
  brandViewAllText: {
    color: colors.inverseText,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 24
  },
  colourCopy: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19.5,
    marginTop: 4
  },
  colourImage: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginBottom: spacing.md,
    marginHorizontal: -spacing.md,
    marginTop: -spacing.md
  },
  colourTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 22.5,
    marginTop: 10
  },
  creamCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    marginHorizontal: spacing.screen,
    padding: spacing.md
  },
  closetCard: {
    alignSelf: "stretch"
  },
  darkMiniPill: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  darkMiniPillText: {
    color: colors.inverseText,
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 13
  },
  demoBadge: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    left: spacing.lg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    position: "absolute",
    top: spacing.lg,
    zIndex: 2
  },
  demoBadgeText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14
  },
  demoCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    marginHorizontal: spacing.screen,
    overflow: "hidden"
  },
  demoCopy: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19.5,
    marginTop: 6
  },
  demoCta: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: 12,
    height: 46,
    justifyContent: "center",
    marginTop: 10
  },
  demoCtaText: {
    color: colors.inverseText,
    fontFamily: fonts.cta,
    fontSize: 14,
    lineHeight: 14
  },
  demoFooter: {
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: spacing.lg
  },
  demoFashionImage: {
    height: "100%",
    width: "100%"
  },
  demoFashionImageStyle: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  },
  demoHeadline: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 17,
    lineHeight: 21.25
  },
  demoOutfitPill: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    left: spacing.lg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    position: "absolute",
    top: 48,
    zIndex: 2
  },
  demoOutfitText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14
  },
  demoVisual: {
    alignItems: "center",
    height: 220,
    justifyContent: "center"
  },
  discountPill: {
    alignSelf: "flex-start",
    backgroundColor: colors.text,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  discountText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    lineHeight: 13
  },
  feed: {
    gap: spacing.xl,
    paddingBottom: 96
  },
  filterPill: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    height: 36,
    justifyContent: "center",
    paddingHorizontal: 18
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
  filterScroller: {
    marginHorizontal: -spacing.screen
  },
  filterTrack: {
    gap: spacing.sm,
    paddingHorizontal: spacing.screen
  },
  ghostCard: {
    alignItems: "center",
    backgroundColor: colors.imageSurface,
    borderRadius: 10,
    height: 80,
    justifyContent: "center",
    overflow: "hidden",
    width: 60
  },
  ghostImage: {
    height: 70,
    opacity: 0.5,
    width: 42
  },
  ghostLabel: {
    color: "#BBBBBB",
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 13,
    marginTop: 6,
    textAlign: "center",
    width: 72
  },
  ghostRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg
  },
  ghostOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(245, 242, 236, 0.42)"
  },
  ghostWrap: {
    alignItems: "center"
  },
  heroBody: {
    color: colors.inverseText,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.xs,
    opacity: 0.9
  },
  heroCarousel: {
    gap: spacing.md
  },
  heroContent: {
    padding: spacing.lg
  },
  heroCta: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.background,
    borderRadius: radii.pill,
    flexDirection: "row",
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 9
  },
  heroCtaText: {
    color: colors.text,
    fontFamily: fonts.cta,
    fontSize: 13,
    lineHeight: 16
  },
  heroDot: {
    backgroundColor: colors.border,
    borderRadius: 3,
    height: 6,
    width: 6
  },
  heroDotActive: {
    backgroundColor: colors.text,
    width: 18
  },
  heroDots: {
    flexDirection: "row",
    gap: 6,
    justifyContent: "center"
  },
  heroEyebrowPill: {
    alignSelf: "flex-start",
    backgroundColor: colors.surfaceTranslucent,
    borderRadius: radii.pill,
    margin: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 5
  },
  heroEyebrowText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 0.2,
    lineHeight: 14
  },
  heroImage: {
    flex: 1,
    justifyContent: "space-between"
  },
  heroImageRadius: {
    borderRadius: 20
  },
  heroScrim: {
    borderRadius: 20,
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  heroSlide: {
    backgroundColor: colors.imageSurface,
    borderRadius: 20,
    overflow: "hidden"
  },
  heroTitle: {
    color: colors.inverseText,
    fontFamily: fonts.heading,
    fontSize: 22,
    lineHeight: 27
  },
  heroTrack: {
    paddingLeft: spacing.screen
  },
  horizontalCards: {
    gap: spacing.sm,
    paddingHorizontal: spacing.screen
  },
  locationButton: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 36,
    minWidth: 0
  },
  locationText: {
    color: colors.text,
    flexShrink: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18
  },
  matchPill: {
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 999,
    bottom: 7,
    left: 7,
    paddingHorizontal: 6,
    paddingVertical: 4,
    position: "absolute"
  },
  matchText: {
    color: "#141414",
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 16
  },
  matchRibbonText: {
    fontSize: 11,
    lineHeight: 14
  },
  navRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between"
  },
  headerActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md
  },
  headerIconButton: {
    alignItems: "center",
    height: 32,
    justifyContent: "center",
    position: "relative",
    width: 32
  },
  occasionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  occasionSection: {
    gap: spacing.md,
    paddingHorizontal: spacing.screen
  },
  occasionTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 25
  },
  outfitPieceChip: {
    alignItems: "center",
    backgroundColor: colors.imageSurface,
    borderColor: "#F1EEE7",
    borderRadius: 12,
    borderWidth: 0.25,
    height: 24,
    justifyContent: "center",
    overflow: "hidden",
    width: 24
  },
  outfitPieceChips: {
    alignItems: "center",
    flexDirection: "row",
    minWidth: 54
  },
  outfitPieceImage: {
    height: "100%",
    width: "100%"
  },
  newArrivalsHeader: {
    paddingHorizontal: spacing.screen
  },
  newArrivalsSection: {
    gap: spacing.lg
  },
  newArrivalsTrack: {
    gap: spacing.sm,
    paddingHorizontal: spacing.screen
  },
  originalPrice: {
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 18,
    textDecorationLine: "line-through"
  },
  paletteSwatch: {
    borderRadius: 7,
    flex: 1,
    height: 22
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }]
  },
  priceRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    marginTop: 4
  },
  productBottomRow: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  productCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    overflow: "hidden"
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  productImage: {
    backgroundColor: "#FAFAFA",
    height: 216,
    position: "relative"
  },
  productImageStyle: {
    borderRadius: 16
  },
  productSaveWrap: {
    position: "absolute",
    right: 9,
    top: 8,
    zIndex: 2
  },
  productMatchRibbon: {
    marginLeft: -spacing.sm
  },
  productInfo: {
    backgroundColor: colors.background,
    padding: 10
  },
  productMeta: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14
  },
  productPrice: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 3
  },
  productTopRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  profileAvatar: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    height: 44,
    justifyContent: "center",
    overflow: "hidden",
    width: 44
  },
  priceExploreButton: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.inverse,
    borderRadius: 32,
    height: 48,
    justifyContent: "center",
    paddingHorizontal: 56
  },
  priceExploreButtonText: {
    color: colors.inverseText,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 24
  },
  priceFilterPill: {
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 999,
    height: 30,
    justifyContent: "center",
    paddingHorizontal: 17
  },
  priceFilterPillSelected: {
    backgroundColor: colors.inverse
  },
  priceFilterText: {
    color: "rgba(0, 0, 0, 0.8)",
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 20
  },
  priceFilterTextSelected: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium
  },
  priceFilterTrack: {
    gap: spacing.sm,
    paddingRight: spacing.screen
  },
  firstPriceLookCard: {
    marginLeft: spacing.screen
  },
  lastPriceLookCard: {
    marginRight: spacing.screen
  },
  priceLookCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    overflow: "hidden"
  },
  priceLookFooter: {
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    flexDirection: "row",
    height: 28,
    justifyContent: "space-between",
    paddingHorizontal: 8
  },
  priceLookImage: {
    backgroundColor: colors.imageSurface,
    overflow: "hidden",
    padding: 8
  },
  priceLookImageStyle: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  priceLookLabel: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    lineHeight: 13,
    marginLeft: spacing.xs,
    maxWidth: 76
  },
  priceLookMatchRibbon: {
    marginLeft: spacing.xs,
    marginRight: -8
  },
  smallMatchRibbonText: {
    fontSize: 10,
    lineHeight: 13
  },
  priceLookScroller: {
    marginHorizontal: -spacing.screen
  },
  priceLookTrack: {
    gap: spacing.md
  },
  priceLookSaveWrap: {
    alignItems: "flex-end"
  },
  priceStyleSection: {
    gap: spacing.xl,
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.xl
  },
  priceStyleTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 25
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    height: 32,
    justifyContent: "center",
    width: 32
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1
  },
  savedCountPill: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    paddingHorizontal: 14
  },
  savedCountText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18
  },
  savedDot: {
    backgroundColor: colors.border,
    borderRadius: 8,
    height: 8,
    width: 8
  },
  savedDotActive: {
    backgroundColor: colors.text
  },
  savedLookCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 14
  },
  savedLookFooter: {
    backgroundColor: colors.background,
    height: 64,
    justifyContent: "center",
    paddingHorizontal: 10
  },
  savedLookImage: {
    alignItems: "center",
    backgroundColor: colors.imageSurface,
    justifyContent: "flex-end",
    overflow: "hidden",
    padding: 14
  },
  savedLookImageStyle: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    resizeMode: "cover"
  },
  savedLookSaveWrap: {
    position: "absolute",
    right: 8,
    top: 8,
    zIndex: 2
  },
  savedLooksSection: {
    gap: spacing.md,
    paddingVertical: spacing.xl
  },
  savedLooksTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 25,
    paddingHorizontal: spacing.screen
  },
  savedLooksTrack: {
    alignItems: "flex-start",
    paddingVertical: spacing.sm
  },
  savedLookSlide: {
    alignItems: "center"
  },
  savedPagination: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center"
  },
  headerOverlay: {
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 20
  },
  headerSafeArea: {
    backgroundColor: colors.background,
    height: homeHeaderTopPadding,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  searchBar: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    height: 44,
    paddingHorizontal: 16
  },
  searchHeader: {
    backgroundColor: colors.background,
    elevation: 10,
    left: 0,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.screen,
    position: "absolute",
    right: 0,
    zIndex: 3
  },
  searchIcons: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md
  },
  searchPlaceholder: {
    color: "#BBBBBB",
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 19,
    marginLeft: spacing.sm
  },
  section: {
    gap: spacing.lg,
    paddingHorizontal: spacing.screen
  },
  sectionAction: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 17,
    textDecorationLine: "underline"
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  sectionSubtitle: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19.5,
    marginTop: 4
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 25
  },
  sectionTitleGroup: {
    flex: 1
  },
  seeMoreButton: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    height: 44,
    justifyContent: "center"
  },
  seeMoreText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 17
  },
  smallCardImageStyle: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  deliveryBadge: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#E8FFF0",
    borderColor: "#BDEFD1",
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    bottom: 14,
    flexDirection: "row",
    gap: spacing.xs,
    left: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    position: "absolute"
  },
  deliveryBadgeText: {
    color: "#16A15C",
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16
  },
  shopLookButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.secondaryBorder,
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    height: 44,
    justifyContent: "center"
  },
  shopLookText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18
  },
  swatchRow: {
    flexDirection: "row",
    gap: 6
  },
  locationHeader: {
    backgroundColor: colors.background,
    elevation: 10,
    left: 0,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.screen,
    position: "absolute",
    right: 0,
    zIndex: 2
  },
  topNavScrolled: {
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  topCluster: {
    gap: spacing.md
  },
  tryButtonSmall: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: 8,
    height: 36,
    justifyContent: "center",
    marginTop: 6
  },
  tryButtonSmallText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 15
  },
  unlockButton: {
    alignItems: "center",
    borderColor: colors.secondaryBorder,
    borderRadius: radii.button,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    paddingHorizontal: 24,
    marginTop: spacing.sm
  },
  unlockButtonText: {
    color: colors.text,
    fontFamily: fonts.cta,
    fontSize: 14,
    lineHeight: 14
  },
  vibeTag: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  vibeText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    lineHeight: 13
  },
  wardrobeButton: {
    alignItems: "center",
    borderColor: colors.secondaryBorder,
    borderRadius: 999,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    marginTop: spacing.lg
  },
  wardrobeButtonText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18
  },
  wardrobeCopy: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19.5,
    marginTop: 6
  },
  wardrobeTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 16,
    lineHeight: 20
  }
});
