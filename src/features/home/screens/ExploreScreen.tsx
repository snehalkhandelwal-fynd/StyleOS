import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  ImageBackground,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  Text,
  useWindowDimensions,
  View
} from "react-native";

import { colors, fonts, spacing, typography } from "../../../theme";

type ExploreScreenProps = {
  copy?: string;
  hasStyleProfile?: boolean;
  onInternalViewChange?: (isOpen: boolean) => void;
  onOpenSearch?: () => void;
  onStartTryOn?: (lookName?: string) => void;
  title?: string;
};

type VibeName =
  | "Minimalist"
  | "Street"
  | "Boho"
  | "Classic"
  | "Romantic"
  | "Athleisure"
  | "Festive"
  | "Vintage";

type TrendStory = {
  description: string;
  id: string;
  image: string;
  looks: number;
  name: string;
  vibes: VibeName[];
};

type OccasionEditorial = {
  count: number;
  fallbackColor?: string;
  id: string;
  image: string;
  name: string;
  pattern?: "festive";
};

type CommunityLook = {
  accent: string;
  base: string;
  handle: string;
  height: number;
  id: string;
  image: string;
  pieces: string[];
  tries: string;
  vibe: VibeName;
  wardrobe?: boolean;
};

type CompleteLook = {
  id: string;
  image: string;
  pieces: string;
  price: string;
  tag: string;
  tone: string;
  vibes: VibeName[];
};

type EyeingLook = {
  backgroundColor: string;
  id: string;
  image: string;
  label: string;
  note: string;
};

type SummerProduct = {
  brand?: string;
  color?: string;
  fitNote?: string;
  id: string;
  image: string;
  match?: string;
  matchScore?: number;
  occasion?: string;
  price: string;
  priceValue?: number;
  sizeOptions?: string[];
  styleLabel: string;
  tags?: string[];
  title: string;
  tries?: string;
  tryCount?: number;
  vibe?: string;
};

type SummerCategory = {
  heroImage: string;
  id: string;
  image: string;
  products: SummerProduct[];
  styleLabel: string;
  title: string;
};

type BudgetLook = {
  brand: string;
  id: string;
  image: string;
  pieces: string;
  price: string;
  priceValue: number;
  tone: string;
  vibe: VibeName;
};

type OccasionTile = {
  count: number;
  id: string;
  image: string;
  name: string;
};

type CollectionLook = {
  id: string;
  image: string;
  meta: string;
  price?: string;
  tone: string;
  title: string;
  vibe: VibeName;
};

type ActiveCollection = {
  subtitle: string;
  title: string;
  type: "trend" | "occasion" | "browse";
  vibe?: VibeName;
};

type PlpViewMode = "grid" | "list";
type PlpSortValue =
  | "relevance"
  | "price-low"
  | "price-high"
  | "most-tried"
  | "best-match";
type PlpFilterKey = "size" | "color" | "price" | "occasion" | "vibe";
type PlpFilterOption = {
  label: string;
  value: string;
};
type PlpFilterConfig = {
  key: PlpFilterKey;
  label: string;
  options: PlpFilterOption[];
};
type PlpSheetState =
  | { type: "filter"; key: PlpFilterKey }
  | { type: "sort" }
  | null;
type PlpSelectedFilters = Partial<Record<PlpFilterKey, PlpFilterOption>>;

const topInset = Platform.OS === "ios" ? 44 : StatusBar.currentHeight ?? 0;
const pagePadding = 16;
const bottomNavSpace = 68 + 16 + 32;

const priceFilters = [
  { label: "Under ₹999", value: 999 },
  { label: "Under ₹1999", value: 1999 },
  { label: "Under ₹2999", value: 2999 },
  { label: "Under ₹3999", value: 3999 }
];

const plpSortOptions: { label: string; value: PlpSortValue }[] = [
  { label: "Relevance", value: "relevance" },
  { label: "Price low to high", value: "price-low" },
  { label: "Price high to low", value: "price-high" },
  { label: "Most tried", value: "most-tried" },
  { label: "Best match", value: "best-match" }
];

const plpFilterConfigs: PlpFilterConfig[] = [
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

const shirtProductImage =
  "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=700&q=80";

const collectionImages = [
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=80"
];

const trendStories: TrendStory[] = [
  {
    description:
      "Effortless draping and breathable textures from desk to dinner",
    id: "quiet-linen",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
    looks: 15,
    name: "Quiet linen",
    vibes: ["Minimalist", "Classic"]
  },
  {
    description: "Graphic patterns that make the outfit",
    id: "bold-prints",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
    looks: 12,
    name: "Bold prints",
    vibes: ["Street", "Festive"]
  },
  {
    description: "Grounded palettes for considered dressing",
    id: "earthy-tones",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    looks: 18,
    name: "Earthy tones",
    vibes: ["Boho", "Vintage", "Minimalist"]
  },
  {
    description: "Subtle transparency in gossamer fabrics",
    id: "sheer-layers",
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80",
    looks: 10,
    name: "Sheer layers",
    vibes: ["Romantic", "Festive"]
  },
  {
    description: "Sharp cuts and structured silhouettes",
    id: "power-tailoring",
    image:
      "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=900&q=80",
    looks: 14,
    name: "Power tailoring",
    vibes: ["Classic", "Street"]
  },
  {
    description: "Romantic textures, flowing cuts, and pastel warmth",
    id: "soft-femme",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
    looks: 11,
    name: "Soft femme",
    vibes: ["Romantic", "Boho"]
  }
];

const occasionEditorials: OccasionEditorial[] = [
  {
    count: 48,
    id: "wedding-guest",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80",
    name: "Wedding guest"
  },
  {
    count: 36,
    fallbackColor: "#EFE3CC",
    id: "festive-diwali",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80",
    name: "Festive / Diwali",
    pattern: "festive"
  },
  {
    count: 28,
    id: "office-dinner",
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=700&q=80",
    name: "Office to dinner"
  },
  {
    count: 22,
    id: "beach-vacation",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80",
    name: "Beach vacation"
  },
  {
    count: 18,
    id: "first-date",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80",
    name: "First date"
  },
  {
    count: 15,
    id: "brunch",
    image:
      "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=700&q=80",
    name: "Brunch"
  }
];

const communityLooks: CommunityLook[] = [
  {
    accent: "#1F1B18",
    base: "#D8D0C3",
    handle: "@priya.m",
    height: 174,
    id: "community-1",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=80",
    pieces: ["Boxy shirt", "Linen trousers", "Leather flats"],
    tries: "3.4k tries",
    vibe: "Minimalist",
    wardrobe: true
  },
  {
    accent: "#243B55",
    base: "#D7DFE7",
    handle: "@snehal.k",
    height: 194,
    id: "community-2",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80",
    pieces: ["Cropped jacket", "Cargo skirt", "Runner sneakers"],
    tries: "2.1k tries",
    vibe: "Street"
  },
  {
    accent: "#7A5136",
    base: "#E6D6C1",
    handle: "@ria.d",
    height: 188,
    id: "community-3",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=80",
    pieces: ["Printed vest", "Maxi skirt", "Stacked bangles"],
    tries: "1.8k tries",
    vibe: "Boho"
  },
  {
    accent: "#8A2222",
    base: "#EFE0DA",
    handle: "@ananya.r",
    height: 168,
    id: "community-4",
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=700&q=80",
    pieces: ["Button cardigan", "Pleated skirt", "Mary janes"],
    tries: "947 tries",
    vibe: "Classic",
    wardrobe: true
  },
  {
    accent: "#BA6A8E",
    base: "#F0DEE6",
    handle: "@mina.v",
    height: 190,
    id: "community-5",
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=700&q=80",
    pieces: ["Satin blouse", "Flowing midi", "Soft sling"],
    tries: "1.3k tries",
    vibe: "Romantic"
  },
  {
    accent: "#1D4F46",
    base: "#DCE8E1",
    handle: "@tara.fit",
    height: 172,
    id: "community-6",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
    pieces: ["Track jacket", "Ribbed tank", "Wide joggers"],
    tries: "2.7k tries",
    vibe: "Athleisure"
  },
  {
    accent: "#A04B14",
    base: "#EFE3CC",
    handle: "@isha.w",
    height: 184,
    id: "community-7",
    image:
      "https://images.unsplash.com/photo-1603217040830-34473db521a9?auto=format&fit=crop&w=700&q=80",
    pieces: ["Silk kurta", "Palazzo", "Gold mule"],
    tries: "3.1k tries",
    vibe: "Festive",
    wardrobe: true
  },
  {
    accent: "#394030",
    base: "#E5DDCE",
    handle: "@noor.a",
    height: 176,
    id: "community-8",
    image:
      "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=700&q=80",
    pieces: ["Waistcoat", "Straight denim", "Loafer"],
    tries: "1.6k tries",
    vibe: "Vintage"
  }
];

const completeLooks: CompleteLook[] = [
  {
    id: "complete-work",
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=700&q=80",
    pieces: "Shirt + tailored trousers",
    price: "₹10.4k",
    tag: "Work",
    tone: "#D9D4C9",
    vibes: ["Classic", "Minimalist"]
  },
  {
    id: "complete-date",
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=700&q=80",
    pieces: "Shirt + slip skirt",
    price: "₹8.1k",
    tag: "Date",
    tone: "#E7D5DC",
    vibes: ["Romantic", "Boho"]
  },
  {
    id: "complete-weekend",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80",
    pieces: "Shirt + denim + sneakers",
    price: "₹9.8k",
    tag: "Weekend",
    tone: "#D8E2E4",
    vibes: ["Street", "Athleisure", "Vintage"]
  },
  {
    id: "complete-festive",
    image:
      "https://images.unsplash.com/photo-1603217040830-34473db521a9?auto=format&fit=crop&w=700&q=80",
    pieces: "Shirt + palazzo + heels",
    price: "₹11.3k",
    tag: "Festive",
    tone: "#E8D7B9",
    vibes: ["Festive"]
  }
];

const eyeingLooks: EyeingLook[] = [
  {
    backgroundColor: "#F5E3B8",
    id: "eyeing-retro",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    label: "80's retro",
    note: "Vivid colour, polished minis, and oversized accessories."
  },
  {
    backgroundColor: "#DCE8E6",
    id: "eyeing-sporty",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    label: "Sporty femme",
    note: "Easy layers, soft tailoring, and sneaker-led looks."
  },
  {
    backgroundColor: "#E6D9EC",
    id: "eyeing-maximalism",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
    label: "Maximalism overload",
    note: "Prints, shine, and more-is-more outfit energy."
  },
  {
    backgroundColor: "#EAD9C4",
    id: "eyeing-minimal",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    label: "Quiet polish",
    note: "Clean neutrals, relaxed cuts, and day-to-night ease."
  }
];

const summerCategories: SummerCategory[] = [
  {
    heroImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
    id: "linen-shirts",
    image:
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=700&q=80",
    products: [
      {
        id: "linen-shirt-1",
        image:
          "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=700&q=80",
        price: "₹1,299",
        styleLabel: "Crisp everyday",
        title: "White linen shirt"
      },
      {
        id: "linen-shirt-2",
        image:
          "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=700&q=80",
        price: "₹1,799",
        styleLabel: "Office to coast",
        title: "Relaxed collar shirt"
      },
      {
        id: "linen-shirt-3",
        image:
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=80",
        price: "₹1,499",
        styleLabel: "Soft neutral",
        title: "Sand linen overshirt"
      },
      {
        id: "linen-shirt-4",
        image:
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=80",
        price: "₹1,699",
        styleLabel: "Weekend layer",
        title: "Easy stripe shirt"
      }
    ],
    styleLabel: "Breezy layers",
    title: "Linen shirts"
  },
  {
    heroImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80",
    id: "linen-pants",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=80",
    products: [
      {
        id: "linen-pants-1",
        image:
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=80",
        price: "₹1,899",
        styleLabel: "Wide-leg ease",
        title: "Ivory linen pants"
      },
      {
        id: "linen-pants-2",
        image:
          "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=700&q=80",
        price: "₹2,299",
        styleLabel: "Tailored summer",
        title: "Pleated linen trousers"
      },
      {
        id: "linen-pants-3",
        image:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80",
        price: "₹1,599",
        styleLabel: "Travel ready",
        title: "Drawstring linen pants"
      },
      {
        id: "linen-pants-4",
        image:
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=700&q=80",
        price: "₹2,099",
        styleLabel: "Desk to dinner",
        title: "Straight linen pants"
      }
    ],
    styleLabel: "Relaxed polish",
    title: "Linen pants"
  },
  {
    heroImage:
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1000&q=80",
    id: "linen-shorts",
    image:
      "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=700&q=80",
    products: [
      {
        id: "linen-shorts-1",
        image:
          "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=700&q=80",
        price: "₹999",
        styleLabel: "Easy weekends",
        title: "Natural linen shorts"
      },
      {
        id: "linen-shorts-2",
        image:
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=80",
        price: "₹1,199",
        styleLabel: "Clean casual",
        title: "Belted linen shorts"
      },
      {
        id: "linen-shorts-3",
        image:
          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=700&q=80",
        price: "₹1,299",
        styleLabel: "Beach to brunch",
        title: "High-rise linen shorts"
      },
      {
        id: "linen-shorts-4",
        image:
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=80",
        price: "₹1,099",
        styleLabel: "Soft utility",
        title: "Pocket linen shorts"
      }
    ],
    styleLabel: "Warm-day staples",
    title: "Linen shorts"
  },
  {
    heroImage:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80",
    id: "summer-crop-tops",
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=700&q=80",
    products: [
      {
        id: "crop-top-1",
        image:
          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=700&q=80",
        price: "₹899",
        styleLabel: "Soft statement",
        title: "Ruched crop top"
      },
      {
        id: "crop-top-2",
        image:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80",
        price: "₹799",
        styleLabel: "Retro bright",
        title: "Sleeveless crop top"
      },
      {
        id: "crop-top-3",
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
        price: "₹999",
        styleLabel: "Sporty layer",
        title: "Ribbed crop tee"
      },
      {
        id: "crop-top-4",
        image:
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=700&q=80",
        price: "₹1,199",
        styleLabel: "Colour pop",
        title: "Tie-front crop top"
      }
    ],
    styleLabel: "Light statement",
    title: "Summer crop tops"
  },
  {
    heroImage:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80",
    id: "striped-shirts",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=80",
    products: [
      {
        id: "striped-shirt-1",
        image:
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=80",
        price: "₹1,399",
        styleLabel: "Coastal classic",
        title: "Blue stripe shirt"
      },
      {
        id: "striped-shirt-2",
        image:
          "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=700&q=80",
        price: "₹1,599",
        styleLabel: "Work relaxed",
        title: "Oversized stripe shirt"
      },
      {
        id: "striped-shirt-3",
        image:
          "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=700&q=80",
        price: "₹1,199",
        styleLabel: "Clean layering",
        title: "Fine stripe shirt"
      },
      {
        id: "striped-shirt-4",
        image:
          "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=700&q=80",
        price: "₹1,799",
        styleLabel: "Polished casual",
        title: "Tailored stripe shirt"
      }
    ],
    styleLabel: "Coastal polish",
    title: "Striped shirts"
  }
];

const budgetLooks: BudgetLook[] = [
  {
    brand: "Trends",
    id: "budget-1",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=80",
    pieces: "3 pieces",
    price: "₹899",
    priceValue: 899,
    tone: "#E2DED4",
    vibe: "Minimalist"
  },
  {
    brand: "Trends",
    id: "budget-2",
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=700&q=80",
    pieces: "2 pieces",
    price: "₹949",
    priceValue: 949,
    tone: "#D7E3E1",
    vibe: "Classic"
  },
  {
    brand: "H&M",
    id: "budget-3",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=80",
    pieces: "3 pieces",
    price: "₹799",
    priceValue: 799,
    tone: "#E8D2C1",
    vibe: "Boho"
  },
  {
    brand: "Zara",
    id: "budget-4",
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=700&q=80",
    pieces: "3 pieces",
    price: "₹999",
    priceValue: 999,
    tone: "#D9D8E8",
    vibe: "Romantic"
  },
  {
    brand: "Trends",
    id: "budget-5",
    image:
      "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=700&q=80",
    pieces: "4 pieces",
    price: "₹1,799",
    priceValue: 1799,
    tone: "#E4DFD0",
    vibe: "Vintage"
  },
  {
    brand: "Myntra",
    id: "budget-6",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
    pieces: "3 pieces",
    price: "₹1,499",
    priceValue: 1499,
    tone: "#D5E1DD",
    vibe: "Athleisure"
  },
  {
    brand: "Trends",
    id: "budget-7",
    image:
      "https://images.unsplash.com/photo-1603217040830-34473db521a9?auto=format&fit=crop&w=700&q=80",
    pieces: "3 pieces",
    price: "₹2,899",
    priceValue: 2899,
    tone: "#EAD7BE",
    vibe: "Festive"
  },
  {
    brand: "H&M",
    id: "budget-8",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80",
    pieces: "3 pieces",
    price: "₹2,699",
    priceValue: 2699,
    tone: "#D7DAE7",
    vibe: "Street"
  },
  {
    brand: "Trends",
    id: "budget-9",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=700&q=80",
    pieces: "2 pieces",
    price: "₹2,299",
    priceValue: 2299,
    tone: "#DDE6DA",
    vibe: "Athleisure"
  },
  {
    brand: "Vero Moda",
    id: "budget-10",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=80",
    pieces: "3 pieces",
    price: "₹2,599",
    priceValue: 2599,
    tone: "#E7DED1",
    vibe: "Vintage"
  }
];

const occasionTiles: OccasionTile[] = [
  {
    count: 86,
    id: "work",
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=700&q=80",
    name: "Work looks"
  },
  {
    count: 124,
    id: "casual",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=80",
    name: "Casual"
  },
  {
    count: 58,
    id: "date-night",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80",
    name: "Date night"
  },
  {
    count: 72,
    id: "festive",
    image:
      "https://images.unsplash.com/photo-1603217040830-34473db521a9?auto=format&fit=crop&w=700&q=80",
    name: "Festive"
  },
  {
    count: 41,
    id: "travel",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80",
    name: "Travel"
  },
  {
    count: 34,
    id: "formal",
    image:
      "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=700&q=80",
    name: "Formal"
  }
];

function SectionHeader({
  action,
  onPressAction,
  subtitle,
  title
}: {
  action?: string;
  onPressAction?: () => void;
  subtitle?: string;
  title: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionCopy}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? (
          <Text style={styles.sectionSubtitle}>{subtitle}</Text>
        ) : null}
      </View>
      {action ? (
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={onPressAction}
        >
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function SearchBar({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable
      accessibilityLabel="Search trends, looks, or vibes"
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.searchBar,
        pressed ? styles.pressed : null
      ]}
    >
      <Feather color={colors.text} name="search" size={17} />
      <Text numberOfLines={1} style={styles.searchPlaceholder}>
        Search trends, looks, or vibes...
      </Text>
      <View style={styles.searchIconRow}>
        <Feather color={colors.muted} name="mic" size={16} />
        <Feather color={colors.muted} name="camera" size={16} />
      </View>
    </Pressable>
  );
}

function TrendStoryCard({
  index,
  onExplore,
  onTryOn,
  story
}: {
  index: number;
  onExplore: () => void;
  onTryOn: () => void;
  story: TrendStory;
}) {
  return (
    <View style={styles.trendCard}>
      <View style={styles.trendLeft}>
        <Text style={styles.trendNumber}>{index + 1}</Text>
        <Text numberOfLines={2} style={styles.trendName}>
          {story.name}
        </Text>
        <Text numberOfLines={2} style={styles.trendDescription}>
          {story.description}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={onExplore}
          style={({ pressed }) => [
            styles.trendCta,
            pressed ? styles.pressed : null
          ]}
        >
          <Text style={styles.trendCtaText}>
            Explore {story.looks}+ looks →
          </Text>
        </Pressable>
      </View>
      <Pressable
        accessibilityLabel={`Try on ${story.name}`}
        accessibilityRole="button"
        onPress={onTryOn}
        style={styles.trendImagePress}
      >
        <ImageBackground
          imageStyle={styles.trendImageStyle}
          resizeMode="cover"
          source={{ uri: story.image }}
          style={styles.trendImage}
        />
      </Pressable>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function OccasionEditorialCard({
  item,
  onPress
}: {
  item: OccasionEditorial;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.occasionCard,
        pressed ? styles.pressed : null
      ]}
    >
      <ImageBackground
        imageStyle={styles.occasionImageStyle}
        resizeMode="cover"
        source={{ uri: item.image }}
        style={[
          styles.occasionImage,
          { backgroundColor: item.fallbackColor ?? colors.surface }
        ]}
      >
        {item.pattern === "festive" ? (
          <View pointerEvents="none" style={styles.festivePattern}>
            <View style={styles.festiveDotLarge} />
            <View style={styles.festiveDotSmall} />
            <View style={styles.festiveLine} />
          </View>
        ) : null}
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.5)"]}
          style={styles.occasionGradient}
        />
        <View style={styles.occasionCopy}>
          <Text numberOfLines={2} style={styles.occasionName}>
            {item.name}
          </Text>
          <Text style={styles.occasionCount}>{item.count} looks</Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

function CommunityCard({
  item,
  onOpen,
  onTryOn,
  width
}: {
  item: CommunityLook;
  onOpen: () => void;
  onTryOn: () => void;
  width: number;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onOpen}
      style={({ pressed }) => [
        styles.communityCard,
        { width },
        pressed ? styles.pressed : null
      ]}
    >
      <View
        style={[
          styles.communityImage,
          { backgroundColor: item.base, height: item.height }
        ]}
      >
        <ImageBackground
          imageStyle={styles.communityImageStyle}
          resizeMode="cover"
          source={{ uri: item.image }}
          style={styles.cardImageFill}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.38)"]}
            style={styles.cardImageGradient}
          />
          <Text style={styles.smallTag}>{item.vibe}</Text>
          <Text style={styles.cardMetric}>{item.tries}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={onTryOn}
            style={styles.miniTryButton}
          >
            <Text style={styles.miniTryText}>Try on</Text>
          </Pressable>
        </ImageBackground>
      </View>
      <View style={styles.communityInfo}>
        <Text style={styles.communityHandle}>{item.handle}</Text>
        {item.wardrobe ? (
          <Text style={styles.wardrobeTag}>Styled from wardrobe</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

function CompleteLookSection({
  looks,
  onTryOn
}: {
  looks: CompleteLook[];
  onTryOn: (lookName?: string) => void;
}) {
  const displayedLooks = looks.length > 0 ? looks : completeLooks;

  return (
    <View style={styles.completeCard}>
      <View style={styles.anchorRow}>
        <ImageBackground
          imageStyle={styles.anchorImageStyle}
          resizeMode="cover"
          source={{ uri: shirtProductImage }}
          style={styles.anchorImage}
        />
        <View style={styles.anchorInfo}>
          <Text style={styles.anchorName}>White linen shirt</Text>
          <Text style={styles.anchorMeta}>Trends · ₹1,299</Text>
          <Text style={styles.anchorPrompt}>
            See it paired with trousers, skirts, and shoes ↓
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.completeLooksTrack}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {displayedLooks.map((look) => (
          <Pressable
            accessibilityRole="button"
            key={look.id}
            onPress={() => onTryOn(`${look.tag} white shirt look`)}
            style={({ pressed }) => [
              styles.completeLookCard,
              pressed ? styles.pressed : null
            ]}
          >
            <ImageBackground
              imageStyle={styles.completeLookImageStyle}
              resizeMode="cover"
              source={{ uri: look.image }}
              style={styles.completeLookImage}
            >
              <LinearGradient
                colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.4)"]}
                style={styles.cardImageGradient}
              />
              <Text style={styles.tinyTag}>{look.tag}</Text>
              <Text numberOfLines={1} style={styles.completePiecesText}>
                {look.pieces}
              </Text>
              <Text style={styles.tinyPrice}>{look.price}</Text>
              <View style={styles.tinyTryButton}>
                <Text style={styles.tinyTryText}>Try on</Text>
              </View>
            </ImageBackground>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function EyeingLooksSection({
  onTryOn
}: {
  onTryOn: (lookName?: string) => void;
}) {
  return (
    <View style={styles.eyeingSection}>
      <SectionHeader title="Looks we are eyeing right now" />
      <ScrollView
        contentContainerStyle={styles.eyeingTrack}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {eyeingLooks.map((look) => (
          <Pressable
            accessibilityRole="button"
            key={look.id}
            onPress={() => onTryOn(look.label)}
            style={({ pressed }) => [
              styles.eyeingCard,
              { backgroundColor: look.backgroundColor },
              pressed ? styles.pressed : null
            ]}
          >
            <View style={styles.eyeingCopy}>
              <Text numberOfLines={4} style={styles.eyeingNote}>
                {look.note}
              </Text>
            </View>
            <ImageBackground
              imageStyle={styles.eyeingImageStyle}
              resizeMode="cover"
              source={{ uri: look.image }}
              style={styles.eyeingImage}
            />
            <View style={styles.eyeingLabelWrap}>
              <Text style={styles.eyeingLabel}>{look.label}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function SummerDaysSection({
  onOpenCategory
}: {
  onOpenCategory: (category: SummerCategory) => void;
}) {
  const heroCategory = summerCategories[0];

  return (
    <View style={styles.summerSection}>
      <SectionHeader title="Days of summer" />
      <Pressable
        accessibilityRole="button"
        onPress={() => onOpenCategory(heroCategory)}
        style={({ pressed }) => [
          styles.summerHeroCard,
          pressed ? styles.pressed : null
        ]}
      >
        <ImageBackground
          imageStyle={styles.summerHeroImageStyle}
          resizeMode="cover"
          source={{ uri: heroCategory.heroImage }}
          style={styles.summerHeroImage}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.08)", "rgba(0,0,0,0.46)"]}
            style={styles.summerHeroGradient}
          />
          <View style={styles.summerHeroCopy}>
            <View style={styles.summerHeroPill}>
              <Text style={styles.summerHeroPillText}>
                Style up for sunny days →
              </Text>
            </View>
          </View>
        </ImageBackground>
      </Pressable>

      <ScrollView
        contentContainerStyle={styles.summerCategoryTrack}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {summerCategories.map((category) => (
          <Pressable
            accessibilityRole="button"
            key={category.id}
            onPress={() => onOpenCategory(category)}
            style={({ pressed }) => [
              styles.summerCategoryCard,
              pressed ? styles.pressed : null
            ]}
          >
            <ImageBackground
              imageStyle={styles.summerCategoryImageStyle}
              resizeMode="cover"
              source={{ uri: category.image }}
              style={styles.summerCategoryImage}
            >
              <LinearGradient
                colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.46)"]}
                style={styles.summerCategoryGradient}
              />
              <View style={styles.summerCategoryCopy}>
                <Text numberOfLines={2} style={styles.summerCategoryTitle}>
                  {category.title}
                </Text>
                <Text style={styles.summerCategoryLabel}>
                  {category.styleLabel}
                </Text>
              </View>
            </ImageBackground>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function getPlpFilterConfig(key: PlpFilterKey) {
  return plpFilterConfigs.find((filter) => filter.key === key) ?? plpFilterConfigs[0];
}

function PlpFilterBar({
  onOpenFilter,
  onOpenSort,
  selectedFilters,
  selectedSort
}: {
  onOpenFilter: (key: PlpFilterKey) => void;
  onOpenSort: () => void;
  selectedFilters: PlpSelectedFilters;
  selectedSort: PlpSortValue;
}) {
  const selectedSortOption = plpSortOptions.find(
    (option) => option.value === selectedSort
  );
  const sortLabel =
    selectedSort === "relevance" ? "Sort" : selectedSortOption?.label ?? "Sort";

  return (
    <View style={styles.plpFilterBar}>
      <ScrollView
        contentContainerStyle={styles.plpFilterTrack}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <Pressable
          accessibilityRole="button"
          onPress={onOpenSort}
          style={[
            styles.plpFilterPill,
            selectedSort !== "relevance" ? styles.plpFilterPillSelected : null
          ]}
        >
          <Ionicons
            color={selectedSort !== "relevance" ? colors.inverseText : colors.text}
            name="swap-vertical-outline"
            size={14}
          />
          <Text
            style={[
              styles.plpFilterText,
              selectedSort !== "relevance" ? styles.plpFilterTextSelected : null
            ]}
          >
            {sortLabel}
          </Text>
        </Pressable>
        {plpFilterConfigs.map((filter) => {
          const selectedFilter = selectedFilters[filter.key];

          return (
            <Pressable
              accessibilityRole="button"
              key={filter.key}
              onPress={() => onOpenFilter(filter.key)}
              style={[
                styles.plpFilterPill,
                selectedFilter ? styles.plpFilterPillSelected : null
              ]}
            >
              <Text
                style={[
                  styles.plpFilterText,
                  selectedFilter ? styles.plpFilterTextSelected : null
                ]}
              >
                {selectedFilter?.label ?? filter.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function PlpOptionsSheet({
  onClose,
  onSelectFilter,
  onSelectSort,
  selectedFilters,
  selectedSort,
  sheet
}: {
  onClose: () => void;
  onSelectFilter: (key: PlpFilterKey, option: PlpFilterOption) => void;
  onSelectSort: (value: PlpSortValue) => void;
  selectedFilters: PlpSelectedFilters;
  selectedSort: PlpSortValue;
  sheet: PlpSheetState;
}) {
  const filterConfig =
    sheet?.type === "filter" ? getPlpFilterConfig(sheet.key) : null;
  const title = sheet?.type === "sort" ? "Sort" : filterConfig?.label ?? "";
  const options =
    sheet?.type === "sort" ? plpSortOptions : filterConfig?.options ?? [];

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={Boolean(sheet)}
    >
      <View style={styles.plpSheetRoot}>
        <Pressable
          accessibilityLabel="Close product options"
          accessibilityRole="button"
          onPress={onClose}
          style={styles.plpSheetScrim}
        />
        <View style={styles.plpSheet}>
          <View style={styles.plpSheetHandle} />
          <Text style={styles.plpSheetTitle}>{title}</Text>
          {options.map((option) => {
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
                    onSelectSort(option.value as PlpSortValue);
                  } else if (sheet?.type === "filter") {
                    onSelectFilter(sheet.key, option);
                  }

                  onClose();
                }}
                style={styles.plpSheetOption}
              >
                <Text
                  style={[
                    styles.plpSheetOptionText,
                    isSelected ? styles.plpSheetOptionTextSelected : null
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

function SummerProductCard({
  product,
  showMatchScore,
  width
}: {
  product: SummerProduct;
  showMatchScore: boolean;
  width: number;
}) {
  const hasMatchScore = showMatchScore && Boolean(product.match);
  const hasTryCount =
    typeof product.tryCount === "number" &&
    product.tryCount >= 100 &&
    Boolean(product.tries);

  return (
    <View style={[styles.summerProductCard, { width }]}>
      <ImageBackground
        imageStyle={styles.summerProductImageStyle}
        resizeMode="cover"
        source={{ uri: product.image }}
        style={styles.summerProductImage}
      >
        <View style={styles.plpSaveWrap}>
          <Pressable accessibilityRole="button" style={styles.plpSaveButton}>
            <Feather color={colors.text} name="heart" size={14} />
          </Pressable>
        </View>
        <View style={styles.plpImageMetaStack}>
          {hasMatchScore ? (
            <View style={styles.plpMatchPill}>
              <Text style={styles.plpMatchText}>{product.match}</Text>
            </View>
          ) : null}
          {hasTryCount ? (
            <View style={styles.plpTryPill}>
              <Text style={styles.plpTryCount}>{product.tries}</Text>
            </View>
          ) : null}
        </View>
      </ImageBackground>
      <View style={styles.summerProductInfo}>
        <Text numberOfLines={1} style={styles.summerProductTitle}>
          {product.title}
        </Text>
        <Text style={styles.summerProductPrice}>{product.price}</Text>
        <Text numberOfLines={1} style={styles.summerProductBrand}>
          {product.brand ?? "Trends"}
        </Text>
        <Text numberOfLines={1} style={styles.summerProductLabel}>
          {product.styleLabel}
        </Text>
      </View>
    </View>
  );
}

function BudgetLookCard({
  item,
  onTryOn,
  width
}: {
  item: BudgetLook;
  onTryOn: () => void;
  width: number;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onTryOn}
      style={({ pressed }) => [
        styles.explorePriceCard,
        { width },
        pressed ? styles.pressed : null
      ]}
    >
      <ImageBackground
        imageStyle={styles.explorePriceImageStyle}
        resizeMode="cover"
        source={{ uri: item.image }}
        style={styles.explorePriceImage}
      >
        <View style={styles.exploreSaveWrap}>
          <View style={styles.exploreSaveButton}>
            <Feather color={colors.text} name="heart" size={16} />
          </View>
        </View>
      </ImageBackground>
      <View style={styles.explorePriceFooter}>
        <View style={styles.explorePriceMeta}>
          <Text numberOfLines={1} style={styles.explorePiecesText}>
            {item.pieces} · {item.brand}
          </Text>
          <Text style={styles.explorePriceText}>{item.price}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={onTryOn}
          style={styles.exploreTryButton}
        >
          <Text style={styles.exploreTryButtonText}>Try on</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

function OccasionTileCard({
  item,
  onPress
}: {
  item: OccasionTile;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.occasionTile,
        pressed ? styles.pressed : null
      ]}
    >
      <ImageBackground
        imageStyle={styles.occasionTileImage}
        resizeMode="cover"
        source={{ uri: item.image }}
        style={styles.occasionTileImageFrame}
      />
      <View style={styles.occasionTileCopy}>
        <Text style={styles.occasionTileName}>{item.name}</Text>
        <Text style={styles.occasionTileCount}>{item.count} looks</Text>
      </View>
    </Pressable>
  );
}

function MoreButton({
  label,
  onPress
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.moreButton,
        pressed ? styles.pressed : null
      ]}
    >
      <Text style={styles.moreButtonText}>{label}</Text>
    </Pressable>
  );
}

function buildSummerListingProducts(category: SummerCategory): SummerProduct[] {
  const fallbackImages = [
    ...collectionImages,
    shirtProductImage,
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1603217040830-34473db521a9?auto=format&fit=crop&w=700&q=80"
  ];
  const styleFamilies = [
    "Work-ready",
    "Weekend",
    "Travel light",
    "Easy fit",
    "Brunch-ready",
    "Office to coast"
  ];
  const colorsForProducts = ["White", "Blue", "Sand", "Ivory", "Black", "Green"];
  const occasions = ["Work", "Weekend", "Vacation", "Brunch", "Date night"];
  const vibes = ["Classic", "Minimal", "Coastal", "Soft", "Street"];
  const sizeSets = [
    ["XS", "S", "M"],
    ["S", "M", "L"],
    ["M", "L", "XL"],
    ["XS", "M", "L"],
    ["S", "L", "XL"]
  ];
  const matchScores = [
    91, 88, 93, 86, 90, 84, 92, 87, 89, 94, 85, 90, 88, 91, 83, 87, 95, 86,
    92, 89, 84, 90, 93, 88
  ];
  const tryCounts = [
    1200, 840, 430, 96, 2100, 310, 1500, 680, 122, 2400, 74, 980, 1760, 520,
    300, 1110, 2600, 141, 830, 1900, 420, 118, 1350, 101
  ];
  const alternatePrices = [
    "₹899",
    "₹1,099",
    "₹1,249",
    "₹1,399",
    "₹1,599",
    "₹1,899",
    "₹2,099",
    "₹2,399",
    "₹2,799",
    "₹3,299"
  ];
  const singularTitle = category.title.toLowerCase().replace(/s$/, "");

  return Array.from({ length: 24 }, (_, index) => {
    const source = category.products[index % category.products.length];
    const matchScore = matchScores[index % matchScores.length];
    const tryCount = tryCounts[index % tryCounts.length];
    const styleLabel =
      index < category.products.length
        ? source.styleLabel
        : styleFamilies[index % styleFamilies.length];
    const title =
      index < category.products.length
        ? source.title
        : `${styleLabel} ${singularTitle}`;
    const price =
      index < category.products.length
        ? source.price
        : alternatePrices[index % alternatePrices.length];

    return {
      ...source,
      brand: "Trends",
      color: colorsForProducts[index % colorsForProducts.length],
      fitNote: source.fitNote ?? "Try-on ready",
      id: index < category.products.length ? source.id : `${source.id}-${index}`,
      image:
        index < category.products.length
          ? source.image
          : fallbackImages[index % fallbackImages.length],
      match: `${matchScore}% your style`,
      matchScore,
      occasion: occasions[index % occasions.length],
      price,
      priceValue: parsePriceValue(price),
      sizeOptions: sizeSets[index % sizeSets.length],
      styleLabel,
      tags: source.tags ?? [
      category.styleLabel,
        styleLabel,
        index % 2 === 0 ? "Soft neutrals" : "Statement colour"
      ],
      title,
      tries: formatTryCount(tryCount),
      tryCount,
      vibe: vibes[index % vibes.length]
    };
  });
}

function parsePriceValue(price: string) {
  return Number(price.replace(/[^\d]/g, "")) || 0;
}

function formatTryCount(count: number) {
  if (count >= 1000) {
    const rounded = count / 1000;
    return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)}k tries`;
  }

  return `${count} tries`;
}

function getPriceLimit(value: string) {
  return Number(value.replace(/[^\d]/g, "")) || Number.POSITIVE_INFINITY;
}

function getFilteredSummerProducts(
  products: SummerProduct[],
  selectedFilters: PlpSelectedFilters
) {
  return products.filter((product) => {
    const selectedSize = selectedFilters.size;
    const selectedColor = selectedFilters.color;
    const selectedPrice = selectedFilters.price;
    const selectedOccasion = selectedFilters.occasion;
    const selectedVibe = selectedFilters.vibe;

    if (
      selectedSize &&
      !product.sizeOptions?.includes(selectedSize.value)
    ) {
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

function getSortedSummerProducts(
  products: SummerProduct[],
  selectedSort: PlpSortValue
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

  if (selectedSort === "best-match") {
    return sortedProducts.sort(
      (a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0)
    );
  }

  return sortedProducts;
}

function buildCollectionLooks(collection: ActiveCollection): CollectionLook[] {
  const vibe = collection.vibe ?? "Classic";
  const tones = ["#E2DED4", "#D8E2E4", "#E8D7B9", "#E7D5DC", "#DCE8E1", "#E5DDCE"];

  return Array.from({ length: 8 }, (_, index) => ({
    id: `${collection.title}-${index}`,
    image: collectionImages[index % collectionImages.length],
    meta: index % 2 === 0 ? "3 pieces · Try on ready" : "4 pieces · Complete look",
    price: index % 2 === 0 ? "₹4,899" : "₹6,299",
    title: `${collection.title} look ${index + 1}`,
    tone: tones[index % tones.length],
    vibe
  }));
}

function CollectionGridView({
  collection,
  onBack,
  onStartTryOn
}: {
  collection: ActiveCollection;
  onBack: () => void;
  onStartTryOn: (lookName?: string) => void;
}) {
  const { width } = useWindowDimensions();
  const cardWidth = (width - pagePadding * 2 - spacing.sm) / 2;
  const looks = useMemo(() => buildCollectionLooks(collection), [collection]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.collectionHeader}>
        <Pressable
          accessibilityLabel="Back to Explore"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onBack}
          style={styles.backButton}
        >
          <Feather color={colors.text} name="arrow-left" size={23} />
        </Pressable>
        <View style={styles.collectionHeaderCopy}>
          <Text numberOfLines={1} style={styles.collectionTitle}>
            {collection.title}
          </Text>
          <Text style={styles.collectionSubtitle}>{collection.subtitle}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.collectionGrid}
        showsVerticalScrollIndicator={false}
      >
        {looks.map((look) => (
          <View
            key={look.id}
            style={[styles.collectionLookCard, { width: cardWidth }]}
          >
            <ImageBackground
              imageStyle={styles.collectionLookImageStyle}
              resizeMode="cover"
              source={{ uri: look.image }}
              style={[
                styles.collectionLookImage,
                { backgroundColor: look.tone }
              ]}
            >
              <Text style={styles.smallTag}>{look.vibe}</Text>
            </ImageBackground>
            <View style={styles.collectionLookInfo}>
              <Text numberOfLines={1} style={styles.collectionLookTitle}>
                {look.title}
              </Text>
              <Text style={styles.collectionLookMeta}>{look.meta}</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => onStartTryOn(look.title)}
                style={styles.collectionTryButton}
              >
                <Text style={styles.collectionTryText}>Try on</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function SummerCategoryListingView({
  category,
  hasStyleProfile,
  onBack
}: {
  category: SummerCategory;
  hasStyleProfile: boolean;
  onBack: () => void;
}) {
  const { width } = useWindowDimensions();
  const [selectedSort, setSelectedSort] =
    useState<PlpSortValue>("relevance");
  const [selectedFilters, setSelectedFilters] =
    useState<PlpSelectedFilters>({});
  const [activeSheet, setActiveSheet] = useState<PlpSheetState>(null);
  const [viewMode, setViewMode] = useState<PlpViewMode>("grid");
  const cardWidth =
    viewMode === "grid"
      ? (width - pagePadding * 2 - spacing.sm) / 2
      : width - pagePadding * 2;
  const products = useMemo(
    () => buildSummerListingProducts(category),
    [category]
  );
  const displayedProducts = useMemo(() => {
    const filteredProducts = getFilteredSummerProducts(
      products,
      selectedFilters
    );

    return getSortedSummerProducts(filteredProducts, selectedSort);
  }, [products, selectedFilters, selectedSort]);

  return (
    <View style={styles.screen}>
      <View style={styles.plpHeader}>
        <Pressable
          accessibilityLabel="Back to Explore"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onBack}
          style={styles.backButton}
        >
          <Feather color={colors.text} name="chevron-left" size={24} />
        </Pressable>
        <View style={styles.plpHeaderCopy}>
          <Text numberOfLines={1} style={styles.plpTitle}>
            {category.title}
          </Text>
          <Text style={styles.plpSubtitle}>
            {products.length} products from Trends
          </Text>
        </View>
        <Pressable
          accessibilityLabel={
            viewMode === "grid" ? "Switch to list view" : "Switch to grid view"
          }
          accessibilityRole="button"
          onPress={() =>
            setViewMode((current) => (current === "grid" ? "list" : "grid"))
          }
          style={styles.plpViewToggle}
        >
          <Feather
            color={colors.text}
            name={viewMode === "grid" ? "grid" : "list"}
            size={20}
          />
        </Pressable>
      </View>
      <PlpFilterBar
        onOpenFilter={(key) => setActiveSheet({ key, type: "filter" })}
        onOpenSort={() => setActiveSheet({ type: "sort" })}
        selectedFilters={selectedFilters}
        selectedSort={selectedSort}
      />

      <ScrollView
        contentContainerStyle={styles.plpContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.plpGrid}>
          {displayedProducts.map((product) => (
            <SummerProductCard
              key={product.id}
              product={product}
              showMatchScore={hasStyleProfile}
              width={cardWidth}
            />
          ))}
        </View>
        {displayedProducts.length === 0 ? (
          <View style={styles.plpEmptyState}>
            <Text style={styles.plpEmptyTitle}>No pieces in this mix</Text>
            <Text style={styles.plpEmptyText}>
              Try another size, color, or vibe to keep styling.
            </Text>
          </View>
        ) : null}
      </ScrollView>
      <PlpOptionsSheet
        onClose={() => setActiveSheet(null)}
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

function CommunityDetailView({
  look,
  onBack,
  onRemix,
  onTryOn
}: {
  look: CommunityLook;
  onBack: () => void;
  onRemix: () => void;
  onTryOn: () => void;
}) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.collectionHeader}>
        <Pressable
          accessibilityLabel="Back to Explore"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onBack}
          style={styles.backButton}
        >
          <Feather color={colors.text} name="arrow-left" size={23} />
        </Pressable>
        <View style={styles.collectionHeaderCopy}>
          <Text style={styles.collectionTitle}>{look.handle}</Text>
          <Text style={styles.collectionSubtitle}>Community look detail</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.detailContent}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          imageStyle={styles.detailHeroImage}
          resizeMode="cover"
          source={{ uri: look.image }}
          style={[styles.detailHero, { backgroundColor: look.base }]}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.35)"]}
            style={styles.cardImageGradient}
          />
          <Text style={styles.smallTag}>{look.vibe}</Text>
        </ImageBackground>
        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>Look pieces</Text>
          {look.pieces.map((piece) => (
            <View key={piece} style={styles.pieceRow}>
              <Text style={styles.pieceText}>{piece}</Text>
            </View>
          ))}
          {look.wardrobe ? (
            <Text style={styles.detailWardrobe}>Styled from wardrobe</Text>
          ) : null}
        </View>
        <View style={styles.detailActions}>
          <Pressable
            accessibilityRole="button"
            onPress={onRemix}
            style={styles.secondaryAction}
          >
            <Text style={styles.secondaryActionText}>Remix this look</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={onTryOn}
            style={styles.primaryAction}
          >
            <Text style={styles.primaryActionText}>Try on</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function PlaceholderScreen({
  copy,
  title
}: {
  copy: string;
  title: string;
}) {
  return (
    <SafeAreaView style={styles.placeholderScreen}>
      <Text style={styles.placeholderTitle}>{title}</Text>
      <Text style={styles.placeholderCopy}>{copy}</Text>
    </SafeAreaView>
  );
}

export function ExploreScreen({
  copy,
  hasStyleProfile = false,
  onInternalViewChange,
  onOpenSearch,
  onStartTryOn = () => undefined,
  title
}: ExploreScreenProps) {
  const isPlaceholder = Boolean(title || copy);
  const [selectedPrice, setSelectedPrice] = useState(priceFilters[0]);
  const [communityCount, setCommunityCount] = useState(4);
  const [budgetCount, setBudgetCount] = useState(4);
  const [activeCollection, setActiveCollection] =
    useState<ActiveCollection | null>(null);
  const [activeCommunityLook, setActiveCommunityLook] =
    useState<CommunityLook | null>(null);
  const [activeSummerCategory, setActiveSummerCategory] =
    useState<SummerCategory | null>(null);
  const { width } = useWindowDimensions();
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const isHeaderVisible = useRef(true);
  const lastScrollY = useRef(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const gridCardWidth = (width - pagePadding * 2 - spacing.sm) / 2;

  useEffect(() => {
    setCommunityCount(4);
    setBudgetCount(4);
  }, [selectedPrice]);

  useEffect(() => {
    onInternalViewChange?.(
      Boolean(activeCommunityLook || activeCollection || activeSummerCategory)
    );
  }, [
    activeCollection,
    activeCommunityLook,
    activeSummerCategory,
    onInternalViewChange
  ]);

  if (isPlaceholder) {
    return (
      <PlaceholderScreen
        copy={copy ?? "Explore styles and saved looks."}
        title={title ?? "Explore"}
      />
    );
  }

  const filteredTrendStories = trendStories;
  const filteredCommunityLooks = communityLooks;
  const filteredBudgetLooks = budgetLooks.filter(
    (look) => look.priceValue <= selectedPrice.value
  );
  const visibleCommunityLooks = filteredCommunityLooks.slice(0, communityCount);
  const visibleBudgetLooks = filteredBudgetLooks.slice(0, budgetCount);

  const openCollection = (collection: ActiveCollection) => {
    setActiveCollection(collection);
  };

  const openOccasionCollection = (name: string, count: number) => {
    openCollection({
      subtitle: `${count} complete looks with Try on CTAs`,
      title: name,
      type: "occasion"
    });
  };

  const revealHeader = () => {
    if (isHeaderVisible.current) {
      return;
    }

    isHeaderVisible.current = true;
    Animated.timing(headerTranslateY, {
      duration: 180,
      toValue: 0,
      useNativeDriver: true
    }).start();
  };

  const hideHeader = () => {
    if (!isHeaderVisible.current) {
      return;
    }

    isHeaderVisible.current = false;
    Animated.timing(headerTranslateY, {
      duration: 180,
      toValue: -(headerHeight || 92),
      useNativeDriver: true
    }).start();
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = Math.max(event.nativeEvent.contentOffset.y, 0);
    const deltaY = currentY - lastScrollY.current;

    if (currentY <= 12) {
      revealHeader();
    } else if (deltaY > 8 && currentY > 60) {
      hideHeader();
    } else if (deltaY < -4) {
      revealHeader();
    }

    lastScrollY.current = currentY;
  };

  if (activeCommunityLook) {
    return (
      <CommunityDetailView
        look={activeCommunityLook}
        onBack={() => setActiveCommunityLook(null)}
        onRemix={() => onStartTryOn(`Remix ${activeCommunityLook.handle}`)}
        onTryOn={() => onStartTryOn(activeCommunityLook.handle)}
      />
    );
  }

  if (activeCollection) {
    return (
      <CollectionGridView
        collection={activeCollection}
        onBack={() => setActiveCollection(null)}
        onStartTryOn={onStartTryOn}
      />
    );
  }

  if (activeSummerCategory) {
    return (
      <SummerCategoryListingView
        category={activeSummerCategory}
        hasStyleProfile={hasStyleProfile}
        onBack={() => setActiveSummerCategory(null)}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <Animated.View
        onLayout={(event) => {
          const measuredHeight = event.nativeEvent.layout.height;
          setHeaderHeight((current) =>
            current === measuredHeight ? current : measuredHeight
          );
        }}
        style={[
          styles.searchHeader,
          { transform: [{ translateY: headerTranslateY }] }
        ]}
      >
        <SearchBar onPress={onOpenSearch} />
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: headerHeight || topInset + 72 }
        ]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <SectionHeader title="Trends of the season" />
          <View style={styles.trendStack}>
            {filteredTrendStories.map((story, index) => (
              <TrendStoryCard
                index={index}
                key={story.id}
                onExplore={() =>
                  openCollection({
                    subtitle: `${story.looks}+ complete looks ready to try on`,
                    title: story.name,
                    type: "trend",
                    vibe: story.vibes[0]
                  })
                }
                onTryOn={() => onStartTryOn(story.name)}
                story={story}
              />
            ))}
          </View>

          <Divider />

          <SectionHeader
            action="See all →"
            onPressAction={() =>
              openCollection({
                subtitle: "Complete looks for every event",
                title: "Shop by occasion",
                type: "occasion"
              })
            }
            subtitle="Complete looks for every event"
            title="Shop by occasion"
          />
          <ScrollView
            contentContainerStyle={styles.occasionTrack}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {occasionEditorials.map((item) => (
              <OccasionEditorialCard
                item={item}
                key={item.id}
                onPress={() => openOccasionCollection(item.name, item.count)}
              />
            ))}
          </ScrollView>

          <SectionHeader
            action="See all →"
            onPressAction={() =>
              openCollection({
                subtitle: "Styled by the StyleOS community",
                title: "Community looks",
                type: "browse"
              })
            }
            subtitle="Styled by people with your taste"
            title="Community looks"
          />
          <View style={styles.twoColumnGrid}>
            {visibleCommunityLooks.map((look) => (
              <CommunityCard
                item={look}
                key={look.id}
                onOpen={() => setActiveCommunityLook(look)}
                onTryOn={() => onStartTryOn(look.handle)}
                width={gridCardWidth}
              />
            ))}
          </View>
          {communityCount < filteredCommunityLooks.length ? (
            <MoreButton
              label="See more community looks"
              onPress={() => setCommunityCount((current) => current + 4)}
            />
          ) : null}

          <Divider />

          <EyeingLooksSection onTryOn={onStartTryOn} />

          <Divider />

          <SummerDaysSection onOpenCategory={setActiveSummerCategory} />

          <Divider />

          <SectionHeader
            subtitle="One piece, styled 4 ways"
            title="Complete the look"
          />
          <CompleteLookSection
            looks={completeLooks}
            onTryOn={onStartTryOn}
          />

          <Divider />

          <SectionHeader
            subtitle="Complete looks you can try on"
            title="Great style at every price"
          />
          <ScrollView
            contentContainerStyle={styles.priceTrack}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {priceFilters.map((filter) => {
              const isSelected = selectedPrice.value === filter.value;

              return (
                <Pressable
                  accessibilityRole="button"
                  key={filter.label}
                  onPress={() => setSelectedPrice(filter)}
                  style={[
                    styles.vibePill,
                    isSelected ? styles.vibePillSelected : null
                  ]}
                >
                  <Text
                    style={[
                      styles.vibeText,
                      isSelected ? styles.vibeTextSelected : null
                    ]}
                  >
                    {filter.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <View style={styles.twoColumnGrid}>
            {visibleBudgetLooks.map((look) => (
              <BudgetLookCard
                item={look}
                key={look.id}
                onTryOn={() => onStartTryOn(`${look.price} ${look.vibe} look`)}
                width={gridCardWidth}
              />
            ))}
          </View>
          {budgetCount < filteredBudgetLooks.length ? (
            <MoreButton
              label={`See more looks ${selectedPrice.label.toLowerCase()}`}
              onPress={() => setBudgetCount((current) => current + 4)}
            />
          ) : null}

          <Divider />

          <SectionHeader
            subtitle="Curated look collections"
            title="Browse by occasion"
          />
          <View style={styles.occasionGrid}>
            {occasionTiles.map((tile) => (
              <OccasionTileCard
                item={tile}
                key={tile.id}
                onPress={() => openOccasionCollection(tile.name, tile.count)}
              />
            ))}
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  anchorImage: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    height: 100,
    overflow: "hidden",
    width: 80
  },
  anchorImageStyle: {
    borderRadius: 10
  },
  anchorInfo: {
    flex: 1,
    justifyContent: "center",
    minWidth: 0
  },
  anchorMeta: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 4
  },
  anchorName: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 13,
    lineHeight: 17
  },
  anchorPrompt: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 8
  },
  anchorRow: {
    flexDirection: "row",
    gap: spacing.md
  },
  backButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 36
  },
  cardMetric: {
    bottom: 8,
    color: "rgba(255,255,255,0.84)",
    fontFamily: fonts.body,
    fontSize: 9,
    left: 8,
    lineHeight: 12,
    position: "absolute"
  },
  cardImageFill: {
    flex: 1
  },
  cardImageGradient: {
    bottom: 0,
    height: "48%",
    left: 0,
    position: "absolute",
    right: 0
  },
  collectionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    paddingBottom: bottomNavSpace,
    paddingHorizontal: pagePadding,
    paddingTop: spacing.lg
  },
  collectionHeader: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: spacing.sm,
    paddingBottom: spacing.md,
    paddingHorizontal: pagePadding,
    paddingTop: spacing.md
  },
  collectionHeaderCopy: {
    flex: 1,
    minWidth: 0
  },
  collectionLookCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden"
  },
  collectionLookImage: {
    alignItems: "center",
    height: 178,
    justifyContent: "center"
  },
  collectionLookImageStyle: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  collectionLookInfo: {
    backgroundColor: colors.background,
    padding: 10
  },
  collectionLookMeta: {
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 14,
    marginTop: 2
  },
  collectionLookTitle: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16
  },
  collectionSubtitle: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2
  },
  collectionTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 25
  },
  collectionTryButton: {
    alignItems: "center",
    backgroundColor: colors.inverse,
    borderRadius: 999,
    height: 34,
    justifyContent: "center",
    marginTop: 10
  },
  collectionTryText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16
  },
  communityCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden"
  },
  communityHandle: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 14
  },
  communityImage: {
    alignItems: "center",
    minHeight: 150,
    justifyContent: "center",
    position: "relative"
  },
  communityImageStyle: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  communityInfo: {
    backgroundColor: colors.background,
    minHeight: 46,
    padding: 9
  },
  completeCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 10,
    marginHorizontal: pagePadding,
    padding: 14
  },
  completeLookCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    height: 145,
    overflow: "hidden",
    width: 110
  },
  completeLookImage: {
    flex: 1,
    position: "relative"
  },
  completeLookImageStyle: {
    borderRadius: 10
  },
  completeLooksTrack: {
    gap: spacing.sm,
    paddingRight: spacing.lg
  },
  completePiecesText: {
    bottom: 22,
    color: "rgba(255,255,255,0.86)",
    fontFamily: fonts.body,
    fontSize: 8,
    left: 6,
    lineHeight: 10,
    position: "absolute",
    right: 6
  },
  content: {
    paddingBottom: bottomNavSpace
  },
  detailActions: {
    flexDirection: "row",
    gap: spacing.sm
  },
  detailCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.lg
  },
  detailContent: {
    gap: spacing.lg,
    padding: pagePadding,
    paddingBottom: bottomNavSpace
  },
  detailHero: {
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    height: 360,
    overflow: "hidden"
  },
  detailHeroImage: {
    borderRadius: 16
  },
  detailTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 23,
    marginBottom: spacing.sm
  },
  detailWardrobe: {
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 15,
    marginTop: spacing.md
  },
  divider: {
    backgroundColor: colors.border,
    height: StyleSheet.hairlineWidth,
    marginHorizontal: pagePadding,
    marginVertical: spacing.sm
  },
  festiveDotLarge: {
    backgroundColor: "rgba(255,255,255,0.38)",
    borderRadius: 28,
    height: 56,
    position: "absolute",
    right: 18,
    top: 26,
    width: 56
  },
  festiveDotSmall: {
    backgroundColor: "rgba(255,255,255,0.28)",
    borderRadius: 14,
    bottom: 54,
    height: 28,
    left: 22,
    position: "absolute",
    width: 28
  },
  festiveLine: {
    backgroundColor: "rgba(255,255,255,0.3)",
    height: 140,
    position: "absolute",
    right: 52,
    top: -24,
    transform: [{ rotate: "24deg" }],
    width: 1
  },
  festivePattern: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(160,75,20,0.12)"
  },
  explorePiecesText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14
  },
  explorePriceCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden"
  },
  explorePriceFooter: {
    alignItems: "center",
    backgroundColor: colors.background,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between",
    minHeight: 58,
    padding: 10
  },
  explorePriceImage: {
    backgroundColor: colors.imageSurface,
    height: 190,
    padding: 8
  },
  explorePriceImageStyle: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  explorePriceMeta: {
    flex: 1,
    minWidth: 0
  },
  explorePriceText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 3
  },
  exploreSaveButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    height: 32,
    justifyContent: "center",
    width: 32
  },
  exploreSaveWrap: {
    alignItems: "flex-end"
  },
  exploreTryButton: {
    alignItems: "center",
    backgroundColor: colors.inverse,
    borderRadius: 999,
    height: 32,
    justifyContent: "center",
    paddingHorizontal: 12
  },
  exploreTryButtonText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14
  },
  eyeingCard: {
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    height: 280,
    overflow: "hidden",
    position: "relative",
    width: 220
  },
  eyeingCopy: {
    backgroundColor: colors.background,
    borderColor: colors.text,
    borderWidth: StyleSheet.hairlineWidth,
    left: 14,
    padding: spacing.md,
    position: "absolute",
    right: 14,
    top: 14,
    zIndex: 2
  },
  eyeingImage: {
    bottom: 0,
    height: 210,
    left: 0,
    position: "absolute",
    right: 0
  },
  eyeingImageStyle: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16
  },
  eyeingLabel: {
    color: colors.inverseText,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 22,
    textTransform: "uppercase"
  },
  eyeingLabelWrap: {
    backgroundColor: colors.inverse,
    bottom: 18,
    left: 18,
    paddingHorizontal: 10,
    paddingVertical: 4,
    position: "absolute",
    transform: [{ rotate: "-4deg" }]
  },
  eyeingNote: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 17
  },
  eyeingSection: {
    gap: spacing.sm
  },
  eyeingTrack: {
    gap: spacing.md,
    paddingLeft: pagePadding,
    paddingRight: pagePadding
  },
  miniTryButton: {
    backgroundColor: colors.inverse,
    borderRadius: 999,
    bottom: 7,
    paddingHorizontal: 7,
    paddingVertical: 3,
    position: "absolute",
    right: 7
  },
  miniTryText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 9,
    lineHeight: 12
  },
  moreButton: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    height: 44,
    justifyContent: "center",
    marginHorizontal: pagePadding,
    marginTop: spacing.xs
  },
  moreButtonText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 17
  },
  occasionCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    height: 220,
    overflow: "hidden",
    width: 160
  },
  occasionCopy: {
    bottom: 12,
    left: 12,
    position: "absolute",
    right: 12
  },
  occasionCount: {
    color: "rgba(255,255,255,0.7)",
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
    marginTop: 2
  },
  occasionGradient: {
    bottom: 0,
    height: "40%",
    left: 0,
    position: "absolute",
    right: 0
  },
  occasionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    paddingHorizontal: pagePadding
  },
  occasionImage: {
    flex: 1
  },
  occasionImageStyle: {
    borderRadius: 14
  },
  occasionName: {
    color: colors.inverseText,
    fontFamily: fonts.heading,
    fontSize: 14,
    lineHeight: 18
  },
  occasionTile: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    flexBasis: "48.8%",
    height: 100,
    overflow: "hidden"
  },
  occasionTileCopy: {
    bottom: 10,
    left: 10,
    position: "absolute",
    right: 10
  },
  occasionTileCount: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 13,
    marginTop: 1
  },
  occasionTileImage: {
    opacity: 0.15
  },
  occasionTileImageFrame: {
    flex: 1
  },
  occasionTileName: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 13,
    lineHeight: 17
  },
  occasionTrack: {
    gap: spacing.sm,
    paddingLeft: pagePadding
  },
  pieceRow: {
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: spacing.sm
  },
  pieceText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18
  },
  placeholderCopy: {
    color: colors.muted,
    ...typography.bodyLarge
  },
  placeholderScreen: {
    backgroundColor: colors.background,
    flex: 1,
    gap: spacing.sm,
    padding: spacing.screen,
    paddingBottom: 128,
    paddingTop: spacing.xxl
  },
  placeholderTitle: {
    color: colors.text,
    ...typography.displayHeadline
  },
  plpContent: {
    gap: spacing.md,
    paddingBottom: 0,
    paddingHorizontal: pagePadding,
    paddingTop: spacing.md
  },
  plpCount: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16
  },
  plpEmptyState: {
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl
  },
  plpEmptyText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    marginTop: spacing.xs,
    textAlign: "center"
  },
  plpEmptyTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 16,
    lineHeight: 20
  },
  plpFilterBar: {
    backgroundColor: colors.background,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 44,
    justifyContent: "center"
  },
  plpFilterPill: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 5,
    height: 32,
    justifyContent: "center",
    paddingHorizontal: 12
  },
  plpFilterPillSelected: {
    backgroundColor: colors.inverse,
    borderWidth: 0
  },
  plpFilterText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16
  },
  plpFilterTextSelected: {
    color: colors.inverseText
  },
  plpFilterTrack: {
    gap: spacing.xs,
    paddingLeft: pagePadding,
    paddingHorizontal: pagePadding
  },
  plpGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  plpHeader: {
    alignItems: "center",
    backgroundColor: colors.background,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 64,
    paddingBottom: 10,
    paddingHorizontal: pagePadding,
    paddingTop: spacing.md
  },
  plpHeaderActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs
  },
  plpHeaderCopy: {
    flex: 1,
    minWidth: 0
  },
  plpImageMetaStack: {
    alignItems: "flex-start",
    bottom: 8,
    gap: 2,
    left: 8,
    position: "absolute"
  },
  plpIconButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 17,
    borderWidth: StyleSheet.hairlineWidth,
    height: 34,
    justifyContent: "center",
    width: 34
  },
  plpImageTag: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    bottom: 8,
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    left: 8,
    lineHeight: 13,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: "absolute"
  },
  plpMatchPill: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  plpMatchText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    lineHeight: 13
  },
  plpIntroCard: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md
  },
  plpIntroCopy: {
    flex: 1,
    minWidth: 0
  },
  plpIntroCta: {
    alignSelf: "flex-start",
    backgroundColor: colors.inverse,
    borderRadius: 999,
    marginTop: spacing.sm,
    paddingHorizontal: 13,
    paddingVertical: 7
  },
  plpIntroCtaText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14
  },
  plpIntroEyebrow: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 0,
    lineHeight: 13,
    textTransform: "uppercase"
  },
  plpIntroImage: {
    backgroundColor: colors.imageSurface,
    borderRadius: 12,
    height: 112,
    overflow: "hidden",
    width: 92
  },
  plpIntroImageStyle: {
    borderRadius: 12
  },
  plpIntroText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 5
  },
  plpIntroTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 17,
    lineHeight: 21,
    marginTop: 3
  },
  plpSaveWrap: {
    position: "absolute",
    right: 8,
    top: 8,
    zIndex: 2
  },
  plpSaveButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
    height: 30,
    justifyContent: "center",
    width: 30
  },
  plpSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: spacing.xxl,
    paddingHorizontal: pagePadding,
    paddingTop: spacing.sm
  },
  plpSheetHandle: {
    alignSelf: "center",
    backgroundColor: colors.border,
    borderRadius: 999,
    height: 4,
    marginBottom: spacing.lg,
    width: 40
  },
  plpSheetOption: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 50,
    paddingVertical: spacing.sm
  },
  plpSheetOptionText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 20
  },
  plpSheetOptionTextSelected: {
    color: colors.text,
    fontFamily: fonts.heading
  },
  plpSheetRoot: {
    flex: 1,
    justifyContent: "flex-end"
  },
  plpSheetScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 10, 10, 0.34)"
  },
  plpSheetTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 23,
    marginBottom: spacing.sm
  },
  plpSortButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: 2,
    height: 30,
    justifyContent: "center",
    paddingLeft: 10
  },
  plpSortText: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16
  },
  plpStyleBanner: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    padding: spacing.lg
  },
  plpStyleBannerCopy: {
    flex: 1,
    minWidth: 0
  },
  plpStyleBannerCta: {
    alignItems: "center",
    backgroundColor: colors.inverse,
    borderRadius: 999,
    height: 36,
    justifyContent: "center",
    paddingHorizontal: 14
  },
  plpStyleBannerCtaText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16
  },
  plpStyleBannerText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 3
  },
  plpStyleBannerTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 16,
    lineHeight: 20
  },
  plpSubtitle: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 17,
    marginTop: 2
  },
  plpTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 25
  },
  plpToolbar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  plpTryCount: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 13
  },
  plpTryPill: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  plpViewToggle: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 44
  },
  pressed: {
    opacity: 0.72
  },
  priceTrack: {
    gap: 6,
    paddingHorizontal: pagePadding,
    paddingBottom: spacing.sm
  },
  primaryAction: {
    alignItems: "center",
    backgroundColor: colors.inverse,
    borderRadius: 24,
    flex: 1,
    height: 48,
    justifyContent: "center"
  },
  primaryActionText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1
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
    left: 0,
    paddingBottom: spacing.md,
    paddingHorizontal: pagePadding,
    paddingTop: topInset + spacing.sm,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 20
  },
  searchPlaceholder: {
    color: "#BBBBBB",
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 19,
    marginLeft: spacing.sm
  },
  searchIconRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  secondaryAction: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    height: 48,
    justifyContent: "center"
  },
  secondaryActionText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18
  },
  sectionAction: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 17,
    textDecorationLine: "underline"
  },
  sectionCopy: {
    flex: 1,
    minWidth: 0
  },
  sectionHeader: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    paddingBottom: 10,
    paddingHorizontal: pagePadding,
    paddingTop: spacing.lg
  },
  sectionSubtitle: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 17,
    marginTop: 4
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 25
  },
  smallTag: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 9,
    left: 8,
    lineHeight: 12,
    paddingHorizontal: 7,
    paddingVertical: 3,
    position: "absolute",
    top: 8
  },
  summerCategoryCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    height: 190,
    overflow: "hidden",
    width: 148
  },
  summerCategoryCopy: {
    bottom: 12,
    left: 12,
    position: "absolute",
    right: 12
  },
  summerCategoryGradient: {
    bottom: 0,
    height: "50%",
    left: 0,
    position: "absolute",
    right: 0
  },
  summerCategoryImage: {
    flex: 1
  },
  summerCategoryImageStyle: {
    borderRadius: 14
  },
  summerCategoryLabel: {
    color: "rgba(255,255,255,0.74)",
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
    marginTop: 2
  },
  summerCategoryTitle: {
    color: colors.inverseText,
    fontFamily: fonts.heading,
    fontSize: 14,
    lineHeight: 18
  },
  summerCategoryTrack: {
    gap: spacing.sm,
    paddingLeft: pagePadding,
    paddingRight: pagePadding
  },
  summerHeroCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    height: 176,
    marginHorizontal: pagePadding,
    overflow: "hidden"
  },
  summerHeroCopy: {
    alignItems: "center",
    bottom: 18,
    left: 16,
    position: "absolute",
    right: 16
  },
  summerHeroGradient: {
    ...StyleSheet.absoluteFillObject
  },
  summerHeroImage: {
    flex: 1
  },
  summerHeroImageStyle: {
    borderRadius: 16
  },
  summerHeroPill: {
    alignItems: "center",
    backgroundColor: "rgba(10,10,10,0.68)",
    borderRadius: 999,
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 10
  },
  summerHeroPillText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18
  },
  summerListingContent: {
    gap: spacing.lg,
    padding: pagePadding,
    paddingBottom: bottomNavSpace
  },
  summerListingHero: {
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    height: 210,
    overflow: "hidden"
  },
  summerListingHeroCopy: {
    bottom: 16,
    left: 16,
    position: "absolute",
    right: 16
  },
  summerListingHeroImage: {
    borderRadius: 16
  },
  summerListingHeroMeta: {
    color: "rgba(255,255,255,0.78)",
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4
  },
  summerListingHeroTitle: {
    color: colors.inverseText,
    fontFamily: fonts.heading,
    fontSize: 22,
    lineHeight: 27
  },
  summerProductCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden"
  },
  summerProductFooter: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  },
  summerProductImage: {
    aspectRatio: 3 / 4,
    backgroundColor: colors.surface,
    position: "relative"
  },
  summerProductImageStyle: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  summerProductInfo: {
    backgroundColor: colors.background,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    minHeight: 88,
    padding: 10
  },
  summerProductBrand: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
    marginTop: 4
  },
  summerProductLabel: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 13,
    marginTop: 2
  },
  summerProductPrice: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 17,
    marginTop: 4
  },
  summerProductTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 13,
    lineHeight: 17
  },
  summerSection: {
    gap: spacing.sm
  },
  tinyPrice: {
    bottom: 6,
    color: "rgba(255,255,255,0.86)",
    fontFamily: fonts.body,
    fontSize: 8,
    left: 6,
    lineHeight: 10,
    position: "absolute"
  },
  tinyTag: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 8,
    left: 6,
    lineHeight: 10,
    paddingHorizontal: 6,
    paddingVertical: 3,
    position: "absolute",
    top: 6
  },
  tinyTryButton: {
    backgroundColor: colors.inverse,
    borderRadius: 999,
    bottom: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    position: "absolute",
    right: 5
  },
  tinyTryText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 8,
    lineHeight: 10
  },
  trendCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    height: 180,
    marginHorizontal: pagePadding,
    overflow: "hidden"
  },
  trendCta: {
    alignSelf: "flex-start",
    backgroundColor: colors.inverse,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6
  },
  trendCtaText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14
  },
  trendDescription: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 16.5,
    marginBottom: 10
  },
  trendImage: {
    flex: 1
  },
  trendImagePress: {
    flex: 1
  },
  trendImageStyle: {
    borderBottomRightRadius: 16,
    borderTopRightRadius: 16
  },
  trendLeft: {
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 20,
    width: "45%"
  },
  trendName: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 24,
    marginBottom: 6
  },
  trendNumber: {
    color: colors.border,
    fontFamily: fonts.bodyMedium,
    fontSize: 72,
    lineHeight: 62,
    marginBottom: 4
  },
  trendStack: {
    gap: spacing.md
  },
  twoColumnGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    paddingHorizontal: pagePadding
  },
  twoColumnGridNoPadding: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  vibePill: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    height: 36,
    justifyContent: "center",
    paddingHorizontal: 18
  },
  vibePillSelected: {
    backgroundColor: colors.inverse,
    borderWidth: 0
  },
  vibeText: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 17
  },
  vibeTextSelected: {
    color: colors.inverseText
  },
  vibeTrack: {
    gap: 7,
    paddingBottom: 12,
    paddingLeft: pagePadding,
    paddingRight: 0
  },
  wardrobeTag: {
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 9,
    lineHeight: 12,
    marginTop: 2
  }
});
