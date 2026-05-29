import { prototypeProductImages } from "../data/prototypeProductImages";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Image,
  ImageBackground,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type GestureResponderEvent,
  useWindowDimensions,
  View
} from "react-native";
import Svg, { Path } from "react-native-svg";

import { colors, fonts, radii, spacing, typography } from "../../../theme";
import {
  AppScreenHeader,
  appScreenTopPadding
} from "../components/AppScreenHeader";
import {
  ProductListingScreen,
  type ProductListingProduct
} from "../components/ProductListingScreen";
import {
  appBottomSafeInset,
  appSearchHeaderHeight,
  appSearchHeaderTopPadding
} from "../utils/safeArea";
import {
  getPieceAlternatives,
  getRupeeValue,
  type LookPiece
} from "../data/lookPieces";
import { CartCountBadge } from "../components/CartCountBadge";
import { WishlistHeartIcon } from "../components/WishlistHeartIcon";

type ClosetScreenProps = {
  cartCount?: number;
  onAskMira?: () => void;
  onInternalViewChange?: (isOpen: boolean) => void;
  onOpenCart?: () => void;
  onOpenSearch?: () => void;
  onOpenWishlist?: () => void;
  onStartAutoPairTryOn?: (item: ClosetAutoPairItem) => void;
  onStartTryOn?: (item: ClosetAutoPairItem, pieces: LookPiece[]) => void;
};

export type ClosetAutoPairItem = Pick<
  ClosetPiece,
  "category" | "color" | "fit" | "id" | "image" | "material" | "tags" | "title"
>;

type ClosetPiece = {
  category: string;
  color: string;
  condition: string;
  detailImage: string;
  fit: string;
  gender: string;
  id: string;
  image: string;
  lastWorn: string;
  material: string;
  size: string;
  status: string;
  tags: string[];
  title: string;
  wornCount: number;
};

type QuickAddMode = "select" | "analyzing" | "review";
type DetectedCategory = "Top" | "Bottom" | "Layer" | "Shoes" | "Bag";
type DetectionProcessState = "analyzing" | "failed";

type DetectedClosetItem = {
  category: DetectedCategory;
  color: string;
  fit: string;
  gender: string;
  id: string;
  image: string;
  material: string;
  name: string;
  size: string;
  sourceAssetKey?: string;
  tags: string[];
};

type PickedPhotoAsset = {
  key: string;
  uri: string;
};

type DetectionReviewEntry =
  | {
      kind: "detected";
      item: DetectedClosetItem;
    }
  | {
      batchId: string;
      id: string;
      image: string;
      kind: "processing";
      sourceAssetKey: string;
      state: DetectionProcessState;
    };

type DetectedItemDraft = {
  category: DetectedCategory;
  color: string;
  fit: string;
  gender: string;
  material: string;
  name: string;
  size: string;
  tags: string[];
};

type CatalogPair = {
  id: string;
  image: string;
  price: string;
  title: string;
};

type ClosetCategoryFilter =
  | "All"
  | "Top"
  | "Bottom"
  | "Footwear"
  | "Layer";

type ClosetCategoryFilterOption = {
  categoryMatches?: string[];
  image: string;
  key: ClosetCategoryFilter;
  label: string;
};

const closetPieces: ClosetPiece[] = [
  {
    category: "Bottoms",
    color: "Cream floral",
    condition: "New",
    detailImage: prototypeProductImages.productOnly.bottom,
    fit: "Wide leg",
    gender: "Women",
    id: "striped-knit-set",
    image:
      prototypeProductImages.maje.greenDenimTop,
    lastWorn: "Never",
    material: "Viscose",
    size: "+ Add size",
    status: "Available",
    tags: ["striped", "casual", "wide leg", "relaxed"],
    title: "Striped knit set",
    wornCount: 0
  },
  {
    category: "Bottoms",
    color: "Ivory",
    condition: "New",
    detailImage: prototypeProductImages.productOnly.dress,
    fit: "Pleated",
    gender: "Women",
    id: "pleated-trousers",
    image:
      prototypeProductImages.sandro.whitePinstripeSuit,
    lastWorn: "Never",
    material: "Linen blend",
    size: "+ Add size",
    status: "Available",
    tags: ["casual", "pleated", "work", "neutral"],
    title: "Pleated trousers",
    wornCount: 0
  }
];

const detailFacts: {
  key: keyof Pick<
    ClosetPiece,
    "color" | "fit" | "gender" | "material"
  >;
  label: string;
}[] = [
  { key: "color", label: "Color" },
  { key: "material", label: "Material" },
  { key: "gender", label: "Gender" },
  { key: "fit", label: "Fit" }
];

const catalogPairRail: CatalogPair[] = [
  {
    id: "pair-ivory-top",
    image: prototypeProductImages.productOnly.top,
    price: "₹2,490",
    title: "Ivory knit top"
  },
  {
    id: "pair-cropped-jacket",
    image: prototypeProductImages.productOnly.jacket,
    price: "₹5,990",
    title: "Cropped jacket"
  },
  {
    id: "pair-leather-shoes",
    image: prototypeProductImages.productOnly.shoe,
    price: "₹3,290",
    title: "Leather flat"
  },
  {
    id: "pair-shoulder-bag",
    image: prototypeProductImages.shopThisLook.brownBag,
    price: "₹4,490",
    title: "Brown shoulder bag"
  }
];

const detectedCategories: DetectedCategory[] = [
  "Top",
  "Bottom",
  "Layer",
  "Shoes",
  "Bag"
];
const editProductColorOptions = [
  "White",
  "Black",
  "Blue",
  "Beige",
  "Brown",
  "Red",
  "Green",
  "Pink",
  "Cream",
  "Ivory"
];
const editProductGenderOptions = ["Women", "Men"];
const editProductMaterialOptions = [
  "Cotton",
  "Denim",
  "Viscose",
  "Linen blend",
  "Leather",
  "Knit",
  "Polyester",
  "Wool blend"
];
const editProductFitOptions = [
  "Regular",
  "Relaxed",
  "Straight leg",
  "Wide leg",
  "Slim",
  "Oversized",
  "Cropped",
  "Pleated"
];
const maxEditProductTags = 3;
const closetPdpHeaderHeight = appSearchHeaderHeight;
const detailCtaDockBottomPadding =
  Platform.OS === "ios" ? spacing.lg : spacing.md;
const detailCtaDockHeight = 48 + spacing.md + detailCtaDockBottomPadding;
const defaultSizeOptions = ["XS", "S", "M", "L", "XL"];
const bottomSizeOptions = ["26", "28", "30", "32", "34", "36"];
const shoeSizeOptions = ["5", "6", "7", "8", "9", "10"];
const detectedGraphicTeeImage = Image.resolveAssetSource(
  require("../../../../Images/Product Images/Tops/Maje_MFPTO01351-10_F_P.jpg")
).uri;
const detectedLightWashJeansImage = Image.resolveAssetSource(
  require("../../../../Images/Product Images/Bottoms/Sandro_SFPJE00818-4785_F_P.jpg")
).uri;
const closetCategoryFilters: ClosetCategoryFilterOption[] = [
  {
    image: prototypeProductImages.sandro.whitePinstripeSuit,
    key: "All",
    label: "All"
  },
  {
    categoryMatches: ["Tops"],
    image: prototypeProductImages.productOnly.top,
    key: "Top",
    label: "Top"
  },
  {
    categoryMatches: ["Bottoms"],
    image: prototypeProductImages.productOnly.bottom,
    key: "Bottom",
    label: "Bottom"
  },
  {
    categoryMatches: ["Shoes"],
    image: prototypeProductImages.shopThisLook.brownShoes,
    key: "Footwear",
    label: "Footwear"
  },
  {
    categoryMatches: ["Layers"],
    image: prototypeProductImages.productOnly.jacket,
    key: "Layer",
    label: "Layer"
  }
];
const detectedItemTemplates: Array<{
  category: DetectedCategory;
  color: string;
  fallbackImage: string;
  fit: string;
  gender: string;
  material: string;
  name: string;
  slug: string;
  tags: string[];
}> = [
  {
    category: "Top",
    color: "White",
    fallbackImage: detectedGraphicTeeImage,
    fit: "Regular",
    gender: "Women",
    material: "Cotton",
    name: "White Graphic Tee",
    slug: "top",
    tags: ["casual", "graphic print", "short sleeve"]
  },
  {
    category: "Bottom",
    color: "Blue",
    fallbackImage: detectedLightWashJeansImage,
    fit: "Straight leg",
    gender: "Women",
    material: "Denim",
    name: "Light Wash Jeans",
    slug: "bottom",
    tags: ["casual", "light wash", "straight leg"]
  },
  {
    category: "Layer",
    color: "Beige",
    fallbackImage: prototypeProductImages.productOnly.jacket,
    fit: "Cropped",
    gender: "Women",
    material: "Knit",
    name: "Cropped Knit Jacket",
    slug: "layer",
    tags: ["casual", "cropped", "light layer"]
  },
  {
    category: "Shoes",
    color: "Brown",
    fallbackImage: prototypeProductImages.productOnly.shoe,
    fit: "Regular",
    gender: "Women",
    material: "Leather",
    name: "Everyday Leather Shoes",
    slug: "shoe",
    tags: ["casual", "leather", "everyday"]
  },
  {
    category: "Bag",
    color: "Neutral",
    fallbackImage: prototypeProductImages.productOnly.accessory,
    fit: "Regular",
    gender: "Women",
    material: "Leather",
    name: "Shoulder Bag",
    slug: "bag",
    tags: ["casual", "shoulder bag", "daywear"]
  }
];

function getSizeOptions(category: DetectedCategory) {
  if (category === "Bottom") {
    return bottomSizeOptions;
  }

  if (category === "Shoes") {
    return shoeSizeOptions;
  }

  return defaultSizeOptions;
}

function getPickedAssetKey(
  asset: {
    assetId?: string | null;
    fileName?: string | null;
    fileSize?: number | null;
    height?: number | null;
    name?: string | null;
    size?: number | null;
    uri?: string;
    width?: number | null;
  },
  index: number
) {
  if (asset.assetId) {
    return `media:${asset.assetId}`;
  }

  if (asset.fileName ?? asset.name) {
    return `file:${asset.fileName ?? asset.name}`;
  }

  if (asset.width && asset.height && (asset.fileSize ?? asset.size)) {
    return `image:${asset.width}x${asset.height}:${asset.fileSize ?? asset.size}`;
  }

  return asset.uri ? `uri:${asset.uri}` : `picked-${index}`;
}

function getMediaLibraryAssetKey(asset: MediaLibrary.Asset) {
  return `media:${asset.id}`;
}

function mergePickedAssets(
  priorityAssets: PickedPhotoAsset[],
  nextAssets: PickedPhotoAsset[]
) {
  const mergedAssets: PickedPhotoAsset[] = [];
  const seenAssetKeys = new Set<string>();

  [...priorityAssets, ...nextAssets].forEach((asset) => {
    if (seenAssetKeys.has(asset.key)) {
      return;
    }

    seenAssetKeys.add(asset.key);
    mergedAssets.push(asset);
  });

  return mergedAssets;
}

function createDetectedItems(
  seed: number,
  selectedAssets: PickedPhotoAsset[] = [],
  startIndex = 0
): DetectedClosetItem[] {
  const sourceAssets =
    selectedAssets.length > 0
      ? selectedAssets
      : Array.from({ length: 2 }, (_, index) => ({
          key: `sample-${seed}-${index}`,
          uri: ""
        }));

  return sourceAssets.map((sourceAsset, index) => {
    const itemIndex = startIndex + index;
    const template =
      detectedItemTemplates[itemIndex % detectedItemTemplates.length];
    const cycle = Math.floor(itemIndex / detectedItemTemplates.length);

    return {
      category: template.category,
      color: template.color,
      fit: template.fit,
      gender: template.gender,
      id: `detected-${template.slug}-${seed}-${itemIndex}`,
      image: template.fallbackImage,
      material: template.material,
      name: cycle > 0 ? `${template.name} ${cycle + 1}` : template.name,
      size: "",
      sourceAssetKey: sourceAsset.key,
      tags: template.tags
    };
  });
}

function getReviewEntryId(entry: DetectionReviewEntry) {
  return entry.kind === "detected" ? entry.item.id : entry.id;
}

function getReviewEntrySourceAssetKey(entry: DetectionReviewEntry) {
  return entry.kind === "detected"
    ? entry.item.sourceAssetKey
    : entry.sourceAssetKey;
}

function getCompletedDetectedItems(entries: DetectionReviewEntry[]) {
  return entries.flatMap((entry) =>
    entry.kind === "detected" ? [entry.item] : []
  );
}

function getDetectedProductCountForSource(sourceIndex: number) {
  return sourceIndex % 3 === 0 ? 2 : 1;
}

function shouldFailDetectionForSource(sourceIndex: number) {
  return sourceIndex > 0 && (sourceIndex + 1) % 5 === 0;
}

function getClosetCategory(category: DetectedCategory) {
  switch (category) {
    case "Top":
      return "Tops";
    case "Bottom":
      return "Bottoms";
    case "Layer":
      return "Layers";
    case "Shoes":
      return "Shoes";
    case "Bag":
      return "Bags";
    default:
      return "Items";
  }
}

function getDetectedCategoryFromCloset(category: string): DetectedCategory {
  switch (category) {
    case "Tops":
      return "Top";
    case "Bottoms":
      return "Bottom";
    case "Layers":
      return "Layer";
    case "Shoes":
      return "Shoes";
    case "Bags":
      return "Bag";
    default:
      return "Top";
  }
}

function doesClosetPieceMatchCategoryFilter(
  piece: ClosetPiece,
  option: ClosetCategoryFilterOption
) {
  return Boolean(option.categoryMatches?.includes(piece.category));
}

function getEditProductColorSwatch(color: string) {
  switch (color.trim().toLowerCase()) {
    case "white":
      return "#FFFFFF";
    case "black":
      return "#111111";
    case "blue":
      return "#7EA6D8";
    case "beige":
      return "#D8C2A3";
    case "brown":
      return "#8B5A34";
    case "red":
      return "#D94135";
    case "green":
      return "#3F7D4E";
    case "pink":
      return "#F4A3B7";
    case "cream":
    case "ivory":
      return "#F7F1E3";
    case "grey":
    case "gray":
      return "#B8B8B8";
    case "neutral":
      return "#DDD6CC";
    default:
      return colors.imageSurface;
  }
}

function getDetectedSaveLabel(count: number) {
  return `Add ${count} ${count === 1 ? "Item" : "Items"}`;
}

function toClosetPiece(item: DetectedClosetItem): ClosetPiece {
  return {
    category: getClosetCategory(item.category),
    color: item.color,
    condition: "New",
    detailImage: item.image,
    fit: item.fit || "+ Add fit",
    gender: item.gender || "+ Add gender",
    id: item.id,
    image: item.image,
    lastWorn: "Never",
    material: item.material || "+ Add material",
    size: item.size || "+ Add size",
    status: "Available",
    tags: item.tags,
    title: item.name || "Untitled item",
    wornCount: 0
  };
}

function toDetectedClosetItem(piece: ClosetPiece): DetectedClosetItem {
  return {
    category: getDetectedCategoryFromCloset(piece.category),
    color: piece.color,
    fit: piece.fit.startsWith("+") ? "" : piece.fit,
    gender: piece.gender.startsWith("+") ? "" : piece.gender,
    id: piece.id,
    image: piece.image,
    material: piece.material.startsWith("+") ? "" : piece.material,
    name: piece.title,
    size: piece.size.startsWith("+") ? "" : piece.size,
    tags: piece.tags
  };
}

function toClosetAutoPairItem(piece: ClosetPiece): ClosetAutoPairItem {
  return {
    category: piece.category,
    color: piece.color,
    fit: piece.fit,
    id: piece.id,
    image: piece.image,
    material: piece.material,
    tags: piece.tags,
    title: piece.title
  };
}

type ClosetBuildSlotKind = LookPiece["kind"];
type ClosetBuildSlotConfig = {
  kind: ClosetBuildSlotKind;
  label: string;
  listingTitle: string;
};
type ClosetBuildListingOption = {
  piece: LookPiece;
  product: ProductListingProduct;
};

const closetBuildSlots: ClosetBuildSlotConfig[] = [
  { kind: "top", label: "Top", listingTitle: "Choose top" },
  { kind: "bottom", label: "Bottom", listingTitle: "Choose bottom" },
  { kind: "shoe", label: "Footwear", listingTitle: "Choose shoes" },
  { kind: "bag", label: "Bag", listingTitle: "Choose bag" },
  { kind: "jacket", label: "Layer", listingTitle: "Choose layer" },
  { kind: "accessory", label: "Accessory", listingTitle: "Choose accessory" },
  { kind: "dress", label: "Dress", listingTitle: "Choose dress" }
];

function getClosetBuildSlotLabel(kind: ClosetBuildSlotKind) {
  return closetBuildSlots.find((slot) => slot.kind === kind)?.label ?? "Piece";
}

function getClosetBuildSearchPlaceholder(kind: ClosetBuildSlotKind) {
  const placeholders: Record<ClosetBuildSlotKind, string> = {
    accessory: "Search accessories",
    bag: "Search bags",
    bottom: "Search bottoms",
    dress: "Search dresses",
    jacket: "Search layers",
    shoe: "Search footwear",
    top: "Search tops"
  };

  return placeholders[kind];
}

function getClosetBuildKind(item: ClosetAutoPairItem): ClosetBuildSlotKind {
  const descriptor = `${item.category} ${item.title} ${item.tags.join(" ")}`.toLowerCase();

  if (descriptor.includes("shoe") || descriptor.includes("sneaker")) {
    return "shoe";
  }

  if (descriptor.includes("bag")) {
    return "bag";
  }

  if (descriptor.includes("belt") || descriptor.includes("accessory")) {
    return "accessory";
  }

  if (
    descriptor.includes("layer") ||
    descriptor.includes("jacket") ||
    descriptor.includes("blazer") ||
    descriptor.includes("coat")
  ) {
    return "jacket";
  }

  if (
    descriptor.includes("bottom") ||
    descriptor.includes("jean") ||
    descriptor.includes("trouser") ||
    descriptor.includes("skirt") ||
    descriptor.includes("pant")
  ) {
    return "bottom";
  }

  if (descriptor.includes("dress")) {
    return "dress";
  }

  return "top";
}

function getClosetBuildComplementKinds(
  closetKind: ClosetBuildSlotKind
): ClosetBuildSlotKind[] {
  switch (closetKind) {
    case "top":
      return ["bottom", "shoe", "bag"];
    case "bottom":
      return ["top", "shoe", "bag"];
    case "jacket":
      return ["top", "bottom", "shoe", "bag"];
    case "shoe":
      return ["top", "bottom", "bag"];
    case "bag":
    case "accessory":
      return ["top", "bottom", "shoe"];
    case "dress":
      return ["shoe", "bag", "jacket"];
    default:
      return ["top", "bottom", "shoe"];
  }
}

function getClosetBuildScore(piece: LookPiece, item: ClosetAutoPairItem) {
  const itemSignals =
    `${item.color} ${item.material} ${item.fit} ${item.tags.join(" ")}`.toLowerCase();
  const pieceSignals =
    `${piece.name} ${piece.brand} ${piece.category}`.toLowerCase();
  let score = 80;

  if (
    itemSignals.includes("brown") &&
    (pieceSignals.includes("cream") ||
      pieceSignals.includes("linen") ||
      pieceSignals.includes("white") ||
      pieceSignals.includes("khaki"))
  ) {
    score += 8;
  }

  if (
    itemSignals.includes("cream") &&
    (pieceSignals.includes("brown") ||
      pieceSignals.includes("tan") ||
      pieceSignals.includes("olive") ||
      pieceSignals.includes("neutral"))
  ) {
    score += 7;
  }

  if (
    itemSignals.includes("floral") &&
    (pieceSignals.includes("linen") ||
      pieceSignals.includes("neutral") ||
      pieceSignals.includes("brown") ||
      pieceSignals.includes("white"))
  ) {
    score += 6;
  }

  return score;
}

function getClosetBuildAutoPiece(
  kind: ClosetBuildSlotKind,
  item: ClosetAutoPairItem,
  index: number
): LookPiece {
  const alternatives = getPieceAlternatives(kind);
  const bestPiece =
    alternatives
      .map((piece, optionIndex) => ({
        piece,
        score: getClosetBuildScore(piece, item) - optionIndex
      }))
      .sort((first, second) => second.score - first.score)[0]?.piece ??
    alternatives[0];

  return {
    ...bestPiece,
    id: `closet-builder-${item.id}-${kind}-${index}`,
    isOwned: false,
    kind
  };
}

function buildClosetBuildPieces(item: ClosetAutoPairItem): LookPiece[] {
  const closetKind = getClosetBuildKind(item);
  const ownedPiece: LookPiece = {
    brand: "Your closet",
    category: item.category,
    id: `closet-builder-owned-${item.id}`,
    image: item.image,
    isOwned: true,
    kind: closetKind,
    name: item.title,
    price: "₹0",
    sizes: ["One"]
  };
  const complementPieces = getClosetBuildComplementKinds(closetKind).map(
    (kind, index) => getClosetBuildAutoPiece(kind, item, index)
  );

  return [ownedPiece, ...complementPieces];
}

function getClosetBuildSlotPiece(
  pieces: LookPiece[],
  kind: ClosetBuildSlotKind
) {
  return pieces.find((piece) => piece.kind === kind);
}

function replaceClosetBuildSlotPiece(
  pieces: LookPiece[],
  kind: ClosetBuildSlotKind,
  selectedPiece: LookPiece
) {
  const existingPiece = getClosetBuildSlotPiece(pieces, kind);

  if (existingPiece?.isOwned) {
    return pieces;
  }

  const nextPiece = {
    ...selectedPiece,
    id: existingPiece?.id ?? `closet-builder-${kind}-${pieces.length}`,
    isOwned: false,
    kind
  };

  if (existingPiece) {
    return pieces.map((piece) =>
      piece.id === existingPiece.id ? nextPiece : piece
    );
  }

  return [...pieces, nextPiece];
}

function removeClosetBuildSlotPiece(
  pieces: LookPiece[],
  kind: ClosetBuildSlotKind
) {
  return pieces.filter((piece) => piece.kind !== kind || piece.isOwned);
}

function toClosetBuildProduct(
  piece: LookPiece,
  kind: ClosetBuildSlotKind,
  index: number,
  isCurrent: boolean
): ProductListingProduct {
  return {
    brand: piece.brand,
    id: `closet-build-${kind}-${piece.id}-${index}`,
    image: piece.image,
    match: isCurrent ? "Current look" : "Try now",
    occasion: "Build your look",
    price: piece.price,
    priceValue: getRupeeValue(piece.price),
    sizeOptions: piece.sizes,
    styleLabel: getClosetBuildSlotLabel(kind),
    title: piece.name,
    tries: isCurrent ? "Selected" : "Try now",
    vibe: "Closet builder"
  };
}

function getClosetBuildListingOptions(
  pieces: LookPiece[],
  kind: ClosetBuildSlotKind
): ClosetBuildListingOption[] {
  const currentPiece = getClosetBuildSlotPiece(pieces, kind);
  const alternatives = getPieceAlternatives(kind);
  const uniquePieces = [
    ...(currentPiece && !currentPiece.isOwned ? [currentPiece] : []),
    ...alternatives
  ]
    .filter(
      (piece, index, allPieces) =>
        allPieces.findIndex(
          (candidate) =>
            candidate.kind === piece.kind &&
            candidate.image === piece.image &&
            candidate.name === piece.name
        ) === index
    )
    .slice(0, 16);

  return uniquePieces.map((piece, index) => ({
    piece,
    product: toClosetBuildProduct(piece, kind, index, piece === currentPiece)
  }));
}

function ClosetToolbarButton({
  accessibilityLabel,
  icon,
  label,
  onPress,
  variant = "secondary"
}: {
  accessibilityLabel?: string;
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary";
}) {
  const iconColor = variant === "primary" ? colors.inverseText : colors.text;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.toolbarButton,
        variant === "primary"
          ? styles.toolbarButtonPrimary
          : styles.toolbarButtonSecondary,
        pressed ? styles.pressed : null
      ]}
    >
      <Feather
        color={iconColor}
        name={icon}
        size={18}
      />
      <Text
        style={[
          styles.toolbarButtonText,
          variant === "primary" ? styles.toolbarButtonTextPrimary : null
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function ClosetPieceCard({
  isFavorite,
  onPress,
  onToggleFavorite,
  piece
}: {
  isFavorite: boolean;
  onPress?: () => void;
  onToggleFavorite?: () => void;
  piece: ClosetPiece;
}) {
  const handleToggleFavorite = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onToggleFavorite?.();
  };
  const visibleTags = piece.tags.slice(0, 3);

  return (
    <Pressable
      accessibilityLabel={`${piece.title}, ${piece.category}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.pieceCard,
        pressed ? styles.pressed : null
      ]}
    >
      <View style={styles.pieceMedia}>
        <Image
          resizeMode="cover"
          source={{ uri: piece.image }}
          style={styles.pieceImage}
        />
        <Pressable
          accessibilityLabel={
            isFavorite
              ? `Remove ${piece.title} from favourites`
              : `Add ${piece.title} to favourites`
          }
          accessibilityRole="button"
          accessibilityState={{ selected: isFavorite }}
          onPress={handleToggleFavorite}
          style={({ pressed }) => [
            styles.pieceFavoriteButton,
            pressed ? styles.pressed : null
          ]}
        >
          <WishlistHeartIcon saved={isFavorite} />
        </Pressable>
      </View>

      <View style={styles.pieceCopy}>
        <Text
          numberOfLines={1}
          style={[styles.pieceTitle, styles.pieceTextInset]}
        >
          {piece.title}
        </Text>
        <Text
          numberOfLines={1}
          style={[styles.pieceCategory, styles.pieceTextInset]}
        >
          {piece.category}
        </Text>
        <ScrollView
          contentContainerStyle={styles.tagRowContent}
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.tagRow}
        >
          {visibleTags.map((tag, index) => (
            <View
              key={`${piece.id}-${tag}`}
              style={[
                styles.tag,
                index === 0 ? styles.tagFirst : null,
                index === visibleTags.length - 1 ? styles.tagLast : null
              ]}
            >
              <Text numberOfLines={1} style={styles.tagText}>
                {tag}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </Pressable>
  );
}

function DetailFactCard({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  const isAddValue = value.startsWith("+");

  return (
    <View style={styles.detailFactCard}>
      <Text numberOfLines={1} style={styles.detailFactLabel}>
        {label}
      </Text>
      <Text
        numberOfLines={1}
        style={[
          styles.detailFactValue,
          isAddValue ? styles.detailFactValueAction : null
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function ClosetDetailHeader({
  cartCount = 0,
  onBack,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch
}: {
  cartCount?: number;
  onBack: () => void;
  onOpenCart?: () => void;
  onOpenWishlist?: () => void;
  onOpenSearch?: () => void;
}) {
  return (
    <View style={styles.detailPdpHeader}>
      <View style={styles.detailPdpHeaderRow}>
        <Pressable
          accessibilityLabel="Back to closet"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onBack}
          style={({ pressed }) => [
            styles.detailHeaderBackButton,
            pressed ? styles.pressed : null
          ]}
        >
          <Feather color={colors.text} name="chevron-left" size={30} />
        </Pressable>

        <Pressable
          accessibilityLabel="Search closet"
          accessibilityRole="button"
          onPress={onOpenSearch}
          style={({ pressed }) => [
            styles.detailHeaderSearchBar,
            pressed && onOpenSearch ? styles.pressed : null
          ]}
        >
          <Feather color={colors.soft} name="search" size={21} />
          <Text numberOfLines={1} style={styles.detailHeaderSearchText}>
            Search styles, occasions, pieces
          </Text>
        </Pressable>

        <Pressable
          accessibilityLabel="Open wishlist"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onOpenWishlist}
          style={({ pressed }) => [
            styles.detailHeaderIconButton,
            pressed ? styles.pressed : null
          ]}
        >
          <WishlistHeartIcon saved={false} size={24} />
        </Pressable>

        <Pressable
          accessibilityLabel="Open cart"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onOpenCart}
          style={({ pressed }) => [
            styles.detailHeaderIconButton,
            pressed ? styles.pressed : null
          ]}
        >
          <Feather color={colors.text} name="shopping-cart" size={24} />
          <CartCountBadge count={cartCount} />
        </Pressable>
      </View>
    </View>
  );
}

function ClosetDetailCtaDock({
  onAutoPairTryOn,
  onTryOn,
  piece
}: {
  onAutoPairTryOn?: () => void;
  onTryOn?: () => void;
  piece: ClosetPiece;
}) {
  return (
    <View style={styles.detailCtaDock}>
      <Pressable
        accessibilityLabel={`Try-on ${piece.title}`}
        accessibilityRole="button"
        onPress={onTryOn}
        style={({ pressed }) => [
          styles.detailSecondaryCta,
          pressed ? styles.pressed : null
        ]}
      >
        <Text numberOfLines={1} style={styles.detailSecondaryCtaText}>
          Try on
        </Text>
      </Pressable>
      <Pressable
        accessibilityLabel={`Try-on auto-pair ${piece.title}`}
        accessibilityRole="button"
        onPress={onAutoPairTryOn}
        style={({ pressed }) => [
          styles.detailAutoPairCta,
          pressed ? styles.pressed : null
        ]}
      >
        <Text numberOfLines={1} style={styles.detailAutoPairCtaText}>
          Try on auto-pair
        </Text>
      </Pressable>
    </View>
  );
}

function CatalogPairCard({
  isFirst,
  isLast,
  item,
  onToggleSave
}: {
  isFirst: boolean;
  isLast: boolean;
  item: CatalogPair;
  onToggleSave?: () => void;
}) {
  return (
    <View
      style={[
        styles.catalogPairCard,
        isFirst ? styles.catalogPairCardFirst : null,
        isLast ? styles.catalogPairCardLast : null
      ]}
    >
      <ImageBackground
        imageStyle={styles.catalogPairImageStyle}
        resizeMode="cover"
        source={{ uri: item.image }}
        style={styles.catalogPairImageWrap}
      >
        <View style={styles.catalogPairSaveWrap}>
          <Pressable
            accessibilityLabel={`Save ${item.title}`}
            accessibilityRole="button"
            onPress={onToggleSave}
            style={({ pressed }) => [
              styles.catalogPairSaveButton,
              pressed ? styles.pressed : null
            ]}
          >
            <WishlistHeartIcon saved={false} />
          </Pressable>
        </View>
      </ImageBackground>
      <View style={styles.catalogPairInfo}>
        <Text numberOfLines={1} style={styles.catalogPairTitle}>
          {item.title}
        </Text>
        <Text style={styles.catalogPairPrice}>{item.price}</Text>
      </View>
    </View>
  );
}

function CatalogPairsSection() {
  return (
    <View style={styles.catalogPairsSection}>
      <Text style={styles.catalogPairsTitle}>Complete the look</Text>
      <ScrollView
        contentContainerStyle={styles.catalogPairsRail}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catalogPairsScroller}
      >
        {catalogPairRail.map((item, index) => (
          <CatalogPairCard
            isFirst={index === 0}
            isLast={index === catalogPairRail.length - 1}
            item={item}
            key={item.id}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function getMiraStylingTip(piece: ClosetPiece) {
  const colorCue = piece.color.toLowerCase();

  return `Keep the ${colorCue} as the focus. Add one clean neutral and a sharper accessory, then try it on to check proportions.`;
}

function MiraAdviceSection({
  onAskMira,
  piece
}: {
  onAskMira?: () => void;
  piece: ClosetPiece;
}) {
  return (
    <View style={styles.miraAdviceSection}>
      <View style={styles.miraAdviceCard}>
        <View style={styles.miraAdviceHeader}>
          <Text style={styles.miraAdviceTitle}>Mira says</Text>
          <View style={styles.miraAdviceBadge}>
            <Text style={styles.miraAdviceBadgeText}>AI stylist</Text>
          </View>
        </View>
        <Text style={styles.miraAdviceText}>{getMiraStylingTip(piece)}</Text>
        <Pressable
          accessibilityLabel="Chat with AI Stylist"
          accessibilityRole="button"
          onPress={onAskMira}
          style={({ pressed }) => [
            styles.miraAdviceCta,
            pressed && onAskMira ? styles.pressed : null
          ]}
        >
          <Text style={styles.miraAdviceCtaText}>Chat with AI Stylist</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ClosetPieceDetailScreen({
  cartCount = 0,
  isFavorite,
  onAskMira,
  onBack,
  onEdit,
  onStartAutoPairTryOn,
  onOpenCart,
  onOpenSearch,
  onOpenWishlist,
  onStartTryOn,
  onToggleFavorite,
  piece
}: {
  cartCount?: number;
  isFavorite: boolean;
  onAskMira?: () => void;
  onBack: () => void;
  onEdit: () => void;
  onStartAutoPairTryOn?: () => void;
  onOpenCart?: () => void;
  onOpenSearch?: () => void;
  onOpenWishlist?: () => void;
  onStartTryOn?: () => void;
  onToggleFavorite: () => void;
  piece: ClosetPiece;
}) {
  const { height } = useWindowDimensions();
  const heroHeight = Math.round(height * 0.58);

  return (
    <View style={styles.detailSafeArea}>
      <ClosetDetailHeader
        cartCount={cartCount}
        onBack={onBack}
        onOpenCart={onOpenCart}
        onOpenSearch={onOpenSearch}
        onOpenWishlist={onOpenWishlist}
      />
      <ScrollView
        contentContainerStyle={[
          styles.detailContent,
          {
            paddingBottom: detailCtaDockHeight + spacing.xl,
            paddingTop: closetPdpHeaderHeight
          }
        ]}
        showsVerticalScrollIndicator={false}
        style={styles.detailScreen}
      >
        <View style={[styles.detailHeroFrame, { height: heroHeight }]}>
          <Image
            resizeMode="cover"
            source={{ uri: piece.detailImage }}
            style={styles.detailHeroImage}
          />
          <Pressable
            accessibilityLabel={
              isFavorite
                ? `Remove ${piece.title} from wishlist`
                : `Add ${piece.title} to wishlist`
            }
            accessibilityRole="button"
            accessibilityState={{ selected: isFavorite }}
            onPress={onToggleFavorite}
            style={({ pressed }) => [
              styles.detailHeroWishlistButton,
              pressed ? styles.pressed : null
            ]}
          >
            <WishlistHeartIcon saved={isFavorite} size={23} />
          </Pressable>
        </View>

        <View style={styles.detailContentSheet}>
          <View style={styles.detailIntro}>
            <View style={styles.detailTitleRow}>
              <Text numberOfLines={2} style={styles.detailPieceTitle}>
                {piece.title}
              </Text>
              <Pressable
                accessibilityLabel={`Edit ${piece.title}`}
                accessibilityRole="button"
                hitSlop={8}
                onPress={onEdit}
                style={({ pressed }) => [
                  styles.detailTitleEditButton,
                  pressed ? styles.pressed : null
                ]}
              >
                <Feather color={colors.muted} name="edit-2" size={16} />
              </Pressable>
            </View>
            <Text numberOfLines={1} style={styles.detailPieceCategory}>
              {piece.category} · {piece.color}
            </Text>
          </View>

          <MiraAdviceSection onAskMira={onAskMira} piece={piece} />

          <CatalogPairsSection />

          <View style={styles.detailProductDetailsBlock}>
            <Text style={styles.detailSectionTitle}>Product detail</Text>
            <View style={styles.detailFactGrid}>
              {detailFacts.map((fact) => (
                <DetailFactCard
                  key={fact.key}
                  label={fact.label}
                  value={piece[fact.key]}
                />
              ))}
            </View>
          </View>

          <View style={styles.detailTagsBlock}>
            <Text style={styles.detailSectionTitle}>Tags</Text>
            <View style={styles.detailTagRow}>
              {piece.tags.map((tag) => (
                <View
                  key={`${piece.id}-detail-${tag}`}
                  style={styles.detailTag}
                >
                  <Text style={styles.detailTagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <ClosetDetailCtaDock
        onAutoPairTryOn={onStartAutoPairTryOn}
        onTryOn={onStartTryOn}
        piece={piece}
      />
    </View>
  );
}

function ChoicePill({
  label,
  onPress,
  selected
}: {
  label: string;
  onPress: () => void;
  selected: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.detectedChoicePill,
        selected ? styles.detectedChoicePillSelected : null,
        pressed ? styles.pressed : null
      ]}
    >
      <Text
        style={[
          styles.detectedChoicePillText,
          selected ? styles.detectedChoicePillTextSelected : null
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function AnalyzingShimmer() {
  const shimmerProgress = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();
  const sweepWidth = Math.max(112, Math.min(180, width * 0.3));
  const translateX = shimmerProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [-sweepWidth, width]
  });

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmerProgress, {
        duration: 1250,
        easing: Easing.inOut(Easing.ease),
        toValue: 1,
        useNativeDriver: true
      })
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [shimmerProgress]);

  return (
    <View pointerEvents="none" style={styles.detectedShimmerClip}>
      <Animated.View
        style={[
          styles.detectedShimmerSweep,
          {
            transform: [{ translateX }],
            width: sweepWidth
          }
        ]}
      >
        <LinearGradient
          colors={[
            "rgba(255, 255, 255, 0)",
            "rgba(255, 255, 255, 0.76)",
            "rgba(255, 255, 255, 0)"
          ]}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
          style={styles.detectedShimmerGradient}
        />
      </Animated.View>
    </View>
  );
}

function DetectionStateCard({
  image,
  onRemove,
  state
}: {
  image: string;
  onRemove: () => void;
  state: DetectionProcessState;
}) {
  const isFailed = state === "failed";

  return (
    <View style={styles.detectedCard}>
      <View style={styles.detectedCardSummary}>
        <Image
          resizeMode="cover"
          source={{ uri: image }}
          style={styles.detectedItemImage}
        />
        <View style={styles.detectedItemCopy}>
          {isFailed ? (
            <View style={styles.detectedStateRow}>
              <Feather color="#D45252" name="alert-circle" size={16} />
              <Text
                numberOfLines={1}
                style={[
                  styles.detectedStateText,
                  styles.detectedStateTextFailed
                ]}
              >
                Detection failed
              </Text>
            </View>
          ) : (
            <Text numberOfLines={1} style={styles.detectedStateText}>
              Analysing
            </Text>
          )}
        </View>
        <Pressable
          accessibilityLabel={
            isFailed ? "Remove failed detection" : "Remove analysing photo"
          }
          accessibilityRole="button"
          onPress={onRemove}
          style={({ pressed }) => [
            styles.detectedRemoveButton,
            pressed ? styles.pressed : null
          ]}
        >
          <Feather color={colors.soft} name="x" size={20} />
        </Pressable>
      </View>
      {!isFailed ? <AnalyzingShimmer /> : null}
    </View>
  );
}

function EditProductField({
  children,
  isFloatingOpen = false,
  label
}: {
  children: ReactNode;
  isFloatingOpen?: boolean;
  label: string;
}) {
  return (
    <View
      style={[
        styles.editProductFieldGroup,
        isFloatingOpen ? styles.editProductFieldGroupFloating : null
      ]}
    >
      <Text style={styles.editProductLabel}>{label}</Text>
      {children}
    </View>
  );
}

function EditProductCategoryChip({
  category,
  onPress,
  selected
}: {
  category: DetectedCategory;
  onPress: () => void;
  selected: boolean;
}) {
  return (
    <Pressable
      accessibilityLabel={`Select ${getClosetCategory(category)}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.editProductCategoryChip,
        selected ? styles.editProductCategoryChipSelected : null,
        pressed ? styles.pressed : null
      ]}
    >
      <Text
        style={[
          styles.editProductCategoryChipText,
          selected ? styles.editProductCategoryChipTextSelected : null
        ]}
      >
        {category}
      </Text>
    </Pressable>
  );
}

function EditProductSizeChip({
  onPress,
  selected,
  size
}: {
  onPress: () => void;
  selected: boolean;
  size: string;
}) {
  return (
    <Pressable
      accessibilityLabel={`Select size ${size}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.editProductSizeChip,
        selected ? styles.editProductCategoryChipSelected : null,
        pressed ? styles.pressed : null
      ]}
    >
      <Text
        style={[
          styles.editProductCategoryChipText,
          selected ? styles.editProductCategoryChipTextSelected : null
        ]}
      >
        {size}
      </Text>
    </Pressable>
  );
}

function EditProductGenderChip({
  gender,
  onPress,
  selected
}: {
  gender: string;
  onPress: () => void;
  selected: boolean;
}) {
  return (
    <Pressable
      accessibilityLabel={`Select ${gender}`}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.editProductCategoryChip,
        selected ? styles.editProductCategoryChipSelected : null,
        pressed ? styles.pressed : null
      ]}
    >
      <Text
        style={[
          styles.editProductCategoryChipText,
          selected ? styles.editProductCategoryChipTextSelected : null
        ]}
      >
        {gender}
      </Text>
    </Pressable>
  );
}

function EditProductColorSwatch({ color }: { color: string }) {
  const swatchColor = getEditProductColorSwatch(color);
  const needsBorder = swatchColor === "#FFFFFF" || swatchColor === "#F7F1E3";

  return (
    <View
      style={[
        styles.editProductColorSwatch,
        { backgroundColor: swatchColor },
        needsBorder ? styles.editProductColorSwatchBordered : null
      ]}
    />
  );
}

function getEditProductDropdownOptions(value: string, options: string[]) {
  const selectedValue = value.trim();
  const normalizedSelectedValue = selectedValue.toLowerCase();

  if (
    !selectedValue ||
    options.some((option) => option.toLowerCase() === normalizedSelectedValue)
  ) {
    return options;
  }

  return [selectedValue, ...options];
}

function EditProductDropdown({
  accessibilityLabel,
  isOpen,
  onSelect,
  onToggle,
  options,
  placeholder,
  value
}: {
  accessibilityLabel: string;
  isOpen: boolean;
  onSelect: (value: string) => void;
  onToggle: () => void;
  options: string[];
  placeholder: string;
  value: string;
}) {
  const selectedValue = value.trim();
  const dropdownOptions = getEditProductDropdownOptions(selectedValue, options);

  return (
    <View style={styles.editProductDropdownRoot}>
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        onPress={(event) => {
          event.stopPropagation();
          onToggle();
        }}
        style={({ pressed }) => [
          styles.editProductDropdownField,
          pressed ? styles.pressed : null
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.editProductDropdownText,
            !selectedValue ? styles.editProductDropdownPlaceholder : null
          ]}
        >
          {selectedValue || placeholder}
        </Text>
        <Feather
          color={colors.muted}
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
        />
      </Pressable>
      {isOpen ? (
        <View style={styles.editProductDropdownOptions}>
          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator
            style={styles.editProductDropdownOptionsScroll}
          >
            {dropdownOptions.map((option) => {
              const isSelected =
                selectedValue.toLowerCase() === option.toLowerCase();

              return (
                <Pressable
                  accessibilityLabel={`Choose ${option}`}
                  accessibilityRole="button"
                  key={`${accessibilityLabel}-${option}`}
                  onPress={(event) => {
                    event.stopPropagation();
                    onSelect(option);
                  }}
                  style={({ pressed }) => [
                    styles.editProductDropdownOption,
                    isSelected ? styles.editProductColorOptionSelected : null,
                    pressed ? styles.pressed : null
                  ]}
                >
                  <Text style={styles.editProductDropdownOptionText}>
                    {option}
                  </Text>
                  {isSelected ? (
                    <Feather color={colors.text} name="check" size={18} />
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

function normalizeEditProductTags(tags: string[]) {
  const seenTags = new Set<string>();

  return tags
    .map((tag) => tag.trim())
    .filter((tag) => {
      const normalizedTag = tag.toLowerCase();

      if (!normalizedTag || seenTags.has(normalizedTag)) {
        return false;
      }

      seenTags.add(normalizedTag);
      return true;
    })
    .slice(0, maxEditProductTags);
}

function EditDetectedProductStep({
  headerAction = "back",
  item,
  onBack,
  onSave
}: {
  headerAction?: "back" | "close";
  item: DetectedClosetItem;
  onBack: () => void;
  onSave: (draft: DetectedItemDraft) => void;
}) {
  const [draftName, setDraftName] = useState(item.name);
  const [draftCategory, setDraftCategory] =
    useState<DetectedCategory>(item.category);
  const [draftColor, setDraftColor] = useState(item.color);
  const [draftFit, setDraftFit] = useState(item.fit);
  const [draftGender, setDraftGender] = useState(item.gender);
  const [draftMaterial, setDraftMaterial] = useState(item.material);
  const [draftSize, setDraftSize] = useState(item.size);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isFitPickerOpen, setIsFitPickerOpen] = useState(false);
  const [isMaterialPickerOpen, setIsMaterialPickerOpen] = useState(false);
  const [draftTags, setDraftTags] = useState(
    normalizeEditProductTags(item.tags)
  );
  const [draftTagInput, setDraftTagInput] = useState("");
  const sizeOptions = getSizeOptions(draftCategory);
  const canAddMoreTags = draftTags.length < maxEditProductTags;
  const canSave =
    draftName.trim().length > 0 && detectedCategories.includes(draftCategory);
  const selectedColor = draftColor.trim() || "White";
  const normalizedSelectedColor = selectedColor.toLowerCase();
  const dropdownColorOptions = editProductColorOptions.some(
    (color) => color.toLowerCase() === normalizedSelectedColor
  )
    ? editProductColorOptions
    : [selectedColor, ...editProductColorOptions];
  const hasOpenPicker =
    isColorPickerOpen || isFitPickerOpen || isMaterialPickerOpen;

  const closeEditProductPickers = () => {
    setIsColorPickerOpen(false);
    setIsFitPickerOpen(false);
    setIsMaterialPickerOpen(false);
  };

  useEffect(() => {
    setDraftName(item.name);
    setDraftCategory(item.category);
    setDraftColor(item.color);
    setDraftFit(item.fit);
    setDraftGender(item.gender);
    setDraftMaterial(item.material);
    setDraftSize(item.size);
    setIsColorPickerOpen(false);
    setIsFitPickerOpen(false);
    setIsMaterialPickerOpen(false);
    setDraftTags(normalizeEditProductTags(item.tags));
    setDraftTagInput("");
  }, [item]);

  const handleSelectCategory = (category: DetectedCategory) => {
    setDraftCategory(category);
    setDraftSize((currentSize) =>
      getSizeOptions(category).includes(currentSize) ? currentSize : ""
    );
  };

  const handleSelectGender = (gender: string) => {
    setDraftGender((currentGender) => currentGender === gender ? "" : gender);
  };

  const handleAddTag = () => {
    const nextTag = draftTagInput.trim();

    if (!nextTag || !canAddMoreTags) {
      return;
    }

    setDraftTags((currentTags) =>
      normalizeEditProductTags([...currentTags, nextTag])
    );
    setDraftTagInput("");
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setDraftTags((currentTags) =>
      currentTags.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSave = () => {
    if (!canSave) {
      return;
    }

    onSave({
      category: draftCategory,
      color: draftColor.trim() || item.color,
      fit: draftFit.trim(),
      gender: draftGender.trim(),
      material: draftMaterial.trim(),
      name: draftName.trim(),
      size: draftSize.trim(),
      tags: normalizeEditProductTags([...draftTags, draftTagInput])
    });
  };

  return (
    <>
      <Pressable
        accessible={false}
        disabled={!hasOpenPicker}
        onPress={closeEditProductPickers}
        style={styles.editProductHeader}
      >
        {headerAction === "back" ? (
          <Pressable
            accessibilityLabel="Back to detected items"
            accessibilityRole="button"
            hitSlop={8}
            onPress={onBack}
            style={({ pressed }) => [
              styles.editProductBackButton,
              pressed ? styles.pressed : null
            ]}
          >
            <Feather color={colors.text} name="chevron-left" size={28} />
          </Pressable>
        ) : null}
        <Text style={styles.editProductTitle}>Edit Product</Text>
        {headerAction === "close" ? (
          <Pressable
            accessibilityLabel="Close edit product"
            accessibilityRole="button"
            hitSlop={8}
            onPress={onBack}
            style={({ pressed }) => [
              styles.editProductCloseButton,
              pressed ? styles.pressed : null
            ]}
          >
            <Feather color={colors.text} name="x" size={24} />
          </Pressable>
        ) : null}
      </Pressable>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={closeEditProductPickers}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          accessible={false}
          disabled={!hasOpenPicker}
          onPress={closeEditProductPickers}
          style={styles.editProductForm}
        >
          <View style={styles.editProductImageFrame}>
            <Image
              resizeMode="contain"
              source={{ uri: item.image }}
              style={styles.editProductImage}
            />
          </View>

          <EditProductField label="Item name *">
            <TextInput
              accessibilityLabel="Item name"
              onChangeText={setDraftName}
              placeholder="e.g., Blue Denim Jacket"
              placeholderTextColor={colors.soft}
              style={styles.editProductInput}
              value={draftName}
            />
          </EditProductField>

          <EditProductField label="Category *">
            <View style={styles.editProductChoiceRow}>
              {detectedCategories.map((category) => (
                <EditProductCategoryChip
                  category={category}
                  key={`edit-${category}`}
                  onPress={() => handleSelectCategory(category)}
                  selected={draftCategory === category}
                />
              ))}
            </View>
          </EditProductField>

          <EditProductField label="Size">
            <View style={styles.editProductChoiceRow}>
              {sizeOptions.map((size) => (
                <EditProductSizeChip
                  key={`edit-size-${size}`}
                  onPress={() => setDraftSize(size)}
                  selected={draftSize === size}
                  size={size}
                />
              ))}
            </View>
          </EditProductField>

          <EditProductField label="Gender">
            <View style={styles.editProductChoiceRow}>
              {editProductGenderOptions.map((gender) => (
                <EditProductGenderChip
                  gender={gender}
                  key={`edit-gender-${gender}`}
                  onPress={() => handleSelectGender(gender)}
                  selected={draftGender === gender}
                />
              ))}
            </View>
          </EditProductField>

          <EditProductField isFloatingOpen={isColorPickerOpen} label="Color">
            <View style={styles.editProductDropdownRoot}>
              <Pressable
                accessibilityLabel="Color"
                accessibilityRole="button"
                onPress={(event) => {
                  event.stopPropagation();
                  setIsColorPickerOpen((isOpen) => !isOpen);
                  setIsFitPickerOpen(false);
                  setIsMaterialPickerOpen(false);
                }}
                style={({ pressed }) => [
                  styles.editProductColorField,
                  pressed ? styles.pressed : null
                ]}
              >
                <EditProductColorSwatch color={selectedColor} />
                <Text numberOfLines={1} style={styles.editProductColorText}>
                  {selectedColor}
                </Text>
                <Feather
                  color={colors.muted}
                  name={isColorPickerOpen ? "chevron-up" : "chevron-down"}
                  size={20}
                />
              </Pressable>
              {isColorPickerOpen ? (
                <View style={styles.editProductColorOptions}>
                  <ScrollView
                    nestedScrollEnabled
                    showsVerticalScrollIndicator
                    style={styles.editProductColorOptionsScroll}
                  >
                    {dropdownColorOptions.map((color) => {
                      const isSelected =
                        color.toLowerCase() === selectedColor.toLowerCase();

                      return (
                        <Pressable
                          accessibilityLabel={`Choose ${color}`}
                          accessibilityRole="button"
                          key={`edit-color-${color}`}
                          onPress={(event) => {
                            event.stopPropagation();
                            setDraftColor(color);
                            setIsColorPickerOpen(false);
                          }}
                          style={({ pressed }) => [
                            styles.editProductColorOption,
                            isSelected
                              ? styles.editProductColorOptionSelected
                              : null,
                            pressed ? styles.pressed : null
                          ]}
                        >
                          <EditProductColorSwatch color={color} />
                          <Text style={styles.editProductColorOptionText}>
                            {color}
                          </Text>
                          {isSelected ? (
                            <Feather
                              color={colors.text}
                              name="check"
                              size={18}
                            />
                          ) : null}
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>
              ) : null}
            </View>
          </EditProductField>

          <EditProductField
            isFloatingOpen={isMaterialPickerOpen}
            label="Material"
          >
            <EditProductDropdown
              accessibilityLabel="Material"
              isOpen={isMaterialPickerOpen}
              onSelect={(material) => {
                setDraftMaterial(material);
                setIsMaterialPickerOpen(false);
              }}
              onToggle={() => {
                setIsMaterialPickerOpen((isOpen) => !isOpen);
                setIsColorPickerOpen(false);
                setIsFitPickerOpen(false);
              }}
              options={editProductMaterialOptions}
              placeholder="Select material"
              value={draftMaterial}
            />
          </EditProductField>

          <EditProductField isFloatingOpen={isFitPickerOpen} label="Fit">
            <EditProductDropdown
              accessibilityLabel="Fit"
              isOpen={isFitPickerOpen}
              onSelect={(fit) => {
                setDraftFit(fit);
                setIsFitPickerOpen(false);
              }}
              onToggle={() => {
                setIsFitPickerOpen((isOpen) => !isOpen);
                setIsColorPickerOpen(false);
                setIsMaterialPickerOpen(false);
              }}
              options={editProductFitOptions}
              placeholder="Select fit"
              value={draftFit}
            />
          </EditProductField>

          <EditProductField label="Tags">
            <View style={styles.editProductTagEditor}>
              {draftTags.map((tag, index) => (
                <View key={`${tag}-${index}`} style={styles.editProductTagPill}>
                  <Text numberOfLines={1} style={styles.editProductTagText}>
                    {tag}
                  </Text>
                  <Pressable
                    accessibilityLabel={`Remove ${tag} tag`}
                    accessibilityRole="button"
                    hitSlop={8}
                    onPress={() => handleRemoveTag(index)}
                    style={({ pressed }) => [
                      styles.editProductTagRemoveButton,
                      pressed ? styles.pressed : null
                    ]}
                  >
                    <Feather color={colors.muted} name="x" size={14} />
                  </Pressable>
                </View>
              ))}
              {canAddMoreTags ? (
                <TextInput
                  accessibilityLabel="Add tag"
                  blurOnSubmit={false}
                  onChangeText={setDraftTagInput}
                  onSubmitEditing={handleAddTag}
                  placeholder="+ Add tag"
                  placeholderTextColor={colors.muted}
                  returnKeyType="done"
                  style={styles.editProductTagInput}
                  value={draftTagInput}
                />
              ) : null}
            </View>
            <Text style={styles.editProductTagHint}>
              Add up to three tags
            </Text>
          </EditProductField>
        </Pressable>
      </ScrollView>

      <Pressable
        accessibilityLabel="Save changes"
        accessibilityRole="button"
        disabled={!canSave}
        onPress={() => {
          closeEditProductPickers();
          handleSave();
        }}
        style={({ pressed }) => [
          styles.editProductSaveButton,
          !canSave ? styles.editProductSaveButtonDisabled : null,
          pressed && canSave ? styles.pressed : null
        ]}
      >
        <Text style={styles.editProductSaveText}>Save changes</Text>
      </Pressable>
    </>
  );
}

function DetectedItemCard({
  expanded,
  item,
  onAddMoreDetails,
  onEdit,
  onRemove,
  onToggle,
  onUpdateCategory,
  onUpdateName,
  onUpdateSize
}: {
  expanded: boolean;
  item: DetectedClosetItem;
  onAddMoreDetails: () => void;
  onEdit: () => void;
  onRemove: () => void;
  onToggle: () => void;
  onUpdateCategory: (category: DetectedCategory) => void;
  onUpdateName: (name: string) => void;
  onUpdateSize: (size: string) => void;
}) {
  const sizeOptions = getSizeOptions(item.category);
  const handleEdit = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onEdit();
  };
  const handleRemove = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onRemove();
  };

  return (
    <View style={[styles.detectedCard, expanded ? styles.detectedCardExpanded : null]}>
      <Pressable
        accessibilityLabel={`Edit ${item.name}`}
        accessibilityRole="button"
        onPress={onToggle}
        style={({ pressed }) => [
          styles.detectedCardSummary,
          pressed ? styles.pressed : null
        ]}
      >
        <Image
          resizeMode="cover"
          source={{ uri: item.image }}
          style={styles.detectedItemImage}
        />
        <View style={styles.detectedItemCopy}>
          <Text numberOfLines={1} style={styles.detectedItemName}>
            {item.name}
          </Text>
          <Text numberOfLines={1} style={styles.detectedItemMeta}>
            {getClosetCategory(item.category)} · {item.color}
          </Text>
          <Text numberOfLines={1} style={styles.detectedItemTags}>
            {item.tags.join(", ")}
          </Text>
        </View>
        <View style={styles.detectedCardActions}>
          <Pressable
            accessibilityLabel={`Edit ${item.name}`}
            accessibilityRole="button"
            onPress={handleEdit}
            style={({ pressed }) => [
              styles.detectedEditButton,
              pressed ? styles.pressed : null
            ]}
          >
            <Feather color={colors.soft} name="edit-2" size={18} />
          </Pressable>
          <Pressable
            accessibilityLabel={`Remove ${item.name}`}
            accessibilityRole="button"
            onPress={handleRemove}
            style={({ pressed }) => [
              styles.detectedRemoveButton,
              pressed ? styles.pressed : null
            ]}
          >
            <Feather color={colors.soft} name="x" size={20} />
          </Pressable>
        </View>
      </Pressable>

      {expanded ? (
        <View style={styles.detectedEditor}>
          <View style={styles.detectedNameField}>
            <TextInput
              accessibilityLabel="Item name"
              onChangeText={onUpdateName}
              placeholder="Item name"
              placeholderTextColor={colors.soft}
              style={styles.detectedNameInput}
              value={item.name}
            />
            {item.name.length > 0 ? (
              <Pressable
                accessibilityLabel="Clear item name"
                accessibilityRole="button"
                onPress={() => onUpdateName("")}
                style={({ pressed }) => [
                  styles.detectedNameClearButton,
                  pressed ? styles.pressed : null
                ]}
              >
                <Feather color={colors.soft} name="x" size={16} />
              </Pressable>
            ) : null}
          </View>

          <View style={styles.detectedPillRow}>
            {detectedCategories.map((category) => (
              <ChoicePill
                key={category}
                label={category}
                onPress={() => onUpdateCategory(category)}
                selected={item.category === category}
              />
            ))}
          </View>

          <View style={styles.detectedPillRow}>
            {sizeOptions.map((size) => (
              <ChoicePill
                key={`${item.id}-${size}`}
                label={size}
                onPress={() => onUpdateSize(size)}
                selected={item.size === size}
              />
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={onAddMoreDetails}
            style={({ pressed }) => [
              styles.detectedMoreDetailsButton,
              pressed ? styles.pressed : null
            ]}
          >
            <Text style={styles.detectedMoreDetailsText}>
              Add more details →
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function PhotoLibraryPickerModal({
  onCancel,
  onConfirm,
  selectedAssets,
  visible
}: {
  onCancel: () => void;
  onConfirm: (assets: PickedPhotoAsset[]) => void;
  selectedAssets: PickedPhotoAsset[];
  visible: boolean;
}) {
  const [galleryAssets, setGalleryAssets] = useState<PickedPhotoAsset[]>([]);
  const [galleryMessage, setGalleryMessage] = useState("");
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [pendingAssetKeys, setPendingAssetKeys] = useState<Set<string>>(
    () => new Set()
  );
  const selectedAssetKeys = new Set(selectedAssets.map((asset) => asset.key));
  const maxNewPhotos = Math.max(0, 10 - selectedAssets.length);
  const pendingCount = pendingAssetKeys.size;

  useEffect(() => {
    if (!visible) {
      return;
    }

    let isMounted = true;

    const loadGalleryAssets = async () => {
      setGalleryMessage("");
      setIsLoadingGallery(true);
      setPendingAssetKeys(new Set());

      try {
        const isAvailable = await MediaLibrary.isAvailableAsync();

        if (!isAvailable) {
          throw new Error("Media library is unavailable.");
        }

        const permission = await MediaLibrary.requestPermissionsAsync(false, [
          "photo"
        ]);

        if (!permission.granted) {
          if (isMounted) {
            setGalleryAssets(selectedAssets);
            setGalleryMessage("Allow photo access to choose more items.");
          }

          return;
        }

        const assetPage = await MediaLibrary.getAssetsAsync({
          first: 60,
          mediaType: MediaLibrary.MediaType.photo,
          sortBy: [[MediaLibrary.SortBy.creationTime, false]]
        });
        const libraryAssets = assetPage.assets.map((asset) => ({
          key: getMediaLibraryAssetKey(asset),
          uri: asset.uri
        }));

        if (isMounted) {
          setGalleryAssets(mergePickedAssets(selectedAssets, libraryAssets));
        }
      } catch {
        if (isMounted) {
          setGalleryAssets(selectedAssets);
          setGalleryMessage("Photo library unavailable. Try again in a moment.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingGallery(false);
        }
      }
    };

    void loadGalleryAssets();

    return () => {
      isMounted = false;
    };
  }, [selectedAssets, visible]);

  const handleToggleAsset = (asset: PickedPhotoAsset) => {
    if (selectedAssetKeys.has(asset.key)) {
      return;
    }

    setPendingAssetKeys((currentKeys) => {
      const nextKeys = new Set(currentKeys);

      if (nextKeys.has(asset.key)) {
        nextKeys.delete(asset.key);
        return nextKeys;
      }

      if (nextKeys.size >= maxNewPhotos) {
        Alert.alert(
          "Photo limit reached",
          "Add these items first, then start another batch."
        );
        return currentKeys;
      }

      nextKeys.add(asset.key);
      return nextKeys;
    });
  };

  const handleConfirm = () => {
    const pickedAssets = galleryAssets.filter((asset) =>
      pendingAssetKeys.has(asset.key)
    );

    onConfirm(pickedAssets);
  };

  return (
    <Modal
      animationType="slide"
      onRequestClose={onCancel}
      visible={visible}
    >
      <SafeAreaView style={styles.photoLibrarySafeArea}>
        <View style={styles.photoLibraryTopBar}>
          <Pressable
            accessibilityLabel="Close photo library"
            accessibilityRole="button"
            onPress={onCancel}
            style={({ pressed }) => [
              styles.photoLibraryIconButton,
              pressed ? styles.pressed : null
            ]}
          >
            <Feather color={colors.text} name="x" size={25} />
          </Pressable>

          <View style={styles.photoLibraryTitleBlock}>
            <Text style={styles.photoLibraryTitle}>Photos</Text>
            <Text style={styles.photoLibrarySubtitle}>
              Select up to {maxNewPhotos} more photos
            </Text>
          </View>

          <Pressable
            accessibilityLabel="Add selected photos"
            accessibilityRole="button"
            disabled={pendingCount === 0}
            onPress={handleConfirm}
            style={({ pressed }) => [
              styles.photoLibraryDoneButton,
              pendingCount === 0 ? styles.photoLibraryDoneButtonDisabled : null,
              pressed && pendingCount > 0 ? styles.pressed : null
            ]}
          >
            <Feather color={colors.inverseText} name="check" size={23} />
          </Pressable>
        </View>

        {isLoadingGallery ? (
          <View style={styles.photoLibraryState}>
            <ActivityIndicator color={colors.text} size="small" />
            <Text style={styles.photoLibraryStateText}>Loading photos...</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.photoLibraryGrid}
            showsVerticalScrollIndicator={false}
          >
            {galleryMessage ? (
              <Text style={styles.photoLibraryMessage}>{galleryMessage}</Text>
            ) : null}

            {galleryAssets.map((asset) => {
              const isAlreadySelected = selectedAssetKeys.has(asset.key);
              const isPending = pendingAssetKeys.has(asset.key);
              const isSelected = isAlreadySelected || isPending;

              return (
                <Pressable
                  accessibilityLabel={
                    isAlreadySelected ? "Already added photo" : "Select photo"
                  }
                  accessibilityRole="button"
                  key={asset.key}
                  onPress={() => handleToggleAsset(asset)}
                  style={({ pressed }) => [
                    styles.photoLibraryTile,
                    pressed && !isAlreadySelected ? styles.pressed : null
                  ]}
                >
                  <Image
                    resizeMode="cover"
                    source={{ uri: asset.uri }}
                    style={styles.photoLibraryImage}
                  />
                  {isSelected ? (
                    <View style={styles.photoLibrarySelectedBadge}>
                      <Feather
                        color={colors.inverseText}
                        name="check"
                        size={15}
                      />
                    </View>
                  ) : null}
                  {isAlreadySelected ? (
                    <View style={styles.photoLibraryAddedPill}>
                      <Text style={styles.photoLibraryAddedText}>Added</Text>
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        <View style={styles.photoLibraryBottomBar}>
          <Pressable
            accessibilityRole="button"
            disabled={pendingCount === 0}
            onPress={handleConfirm}
            style={({ pressed }) => [
              styles.photoLibraryPrimaryCta,
              pendingCount === 0 ? styles.photoLibraryPrimaryCtaDisabled : null,
              pressed && pendingCount > 0 ? styles.pressed : null
            ]}
          >
            <Text style={styles.photoLibraryPrimaryCtaText}>
              {pendingCount > 0
                ? `Add ${pendingCount} ${pendingCount === 1 ? "Photo" : "Photos"}`
                : "Select Photos"}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function ClosetBuildSlotCard({
  kind,
  label,
  onClear,
  onPress,
  piece
}: {
  kind: ClosetBuildSlotKind;
  label: string;
  onClear: (kind: ClosetBuildSlotKind) => void;
  onPress: (kind: ClosetBuildSlotKind) => void;
  piece?: LookPiece;
}) {
  const isOwnedPiece = Boolean(piece?.isOwned);

  return (
    <View style={styles.closetBuildSlot}>
      {piece ? (
        <Pressable
          accessibilityLabel={
            isOwnedPiece
              ? `${label}: ${piece.name}, yours`
              : `Browse ${label}, currently ${piece.name}`
          }
          accessibilityRole="button"
          accessibilityState={{ disabled: isOwnedPiece }}
          disabled={isOwnedPiece}
          onPress={() => onPress(kind)}
          style={({ pressed }) => [
            styles.closetBuildSlotFrame,
            pressed && !isOwnedPiece ? styles.pressed : null
          ]}
        >
          <Image
            resizeMode="contain"
            source={{ uri: piece.image }}
            style={styles.closetBuildSlotImage}
          />
          {isOwnedPiece ? (
            <View style={styles.closetBuildOwnedTag}>
              <Text style={styles.closetBuildOwnedTagText}>Yours</Text>
            </View>
          ) : (
            <Pressable
              accessibilityLabel={`Remove ${label}`}
              accessibilityRole="button"
              hitSlop={8}
              onPress={(event) => {
                event.stopPropagation();
                onClear(kind);
              }}
              style={({ pressed }) => [
                styles.closetBuildRemoveButton,
                pressed ? styles.pressed : null
              ]}
            >
              <Feather color={colors.soft} name="x" size={21} />
            </Pressable>
          )}
        </Pressable>
      ) : (
        <Pressable
          accessibilityLabel={`Browse ${label}`}
          accessibilityRole="button"
          onPress={() => onPress(kind)}
          style={({ pressed }) => [
            styles.closetBuildSlotFrame,
            styles.closetBuildSlotFrameEmpty,
            pressed ? styles.pressed : null
          ]}
        >
          <View style={styles.closetBuildEmptyContent}>
            <View style={styles.closetBuildAddIcon}>
              <Feather color={colors.soft} name="plus" size={24} />
            </View>
            <Text style={styles.closetBuildEmptyText}>
              Add {label.toLowerCase()}
            </Text>
          </View>
        </Pressable>
      )}

      <Text numberOfLines={1} style={styles.closetBuildSlotLabel}>
        {label}
      </Text>
    </View>
  );
}

function ClosetShuffleIcon() {
  return (
    <Svg fill="none" height={16} viewBox="0 0 16 16" width={16}>
      <Path
        d="M5.85 0.854192C5.94108 0.759891 5.99148 0.63359 5.99034 0.502491C5.9892 0.371393 5.93661 0.245987 5.84391 0.153283C5.75121 0.0605785 5.6258 0.00799405 5.4947 0.00685484C5.3636 0.00571563 5.2373 0.0561128 5.143 0.147192L2.143 3.14719C2.04926 3.24096 1.99661 3.36811 1.99661 3.50069C1.99661 3.63327 2.04926 3.76043 2.143 3.85419L5.143 6.85419C5.2373 6.94527 5.3636 6.99567 5.4947 6.99453C5.6258 6.99339 5.75121 6.94081 5.84391 6.8481C5.93661 6.7554 5.9892 6.62999 5.99034 6.49889C5.99148 6.36779 5.94108 6.24149 5.85 6.14719L3.7 3.99719H11.49C12.153 3.99719 12.7889 4.26058 13.2578 4.72942C13.7266 5.19827 13.99 5.83415 13.99 6.49719V8.49719C13.99 8.6298 14.0427 8.75698 14.1364 8.85075C14.2302 8.94451 14.3574 8.99719 14.49 8.99719C14.6226 8.99719 14.7498 8.94451 14.8436 8.85075C14.9373 8.75698 14.99 8.6298 14.99 8.49719V6.49719C14.99 4.56719 13.42 2.99719 11.49 2.99719H3.7L5.85 0.847192V0.854192ZM2 7.50019C2 7.36758 1.94732 7.24041 1.85355 7.14664C1.75979 7.05287 1.63261 7.00019 1.5 7.00019C1.36739 7.00019 1.24021 7.05287 1.14645 7.14664C1.05268 7.24041 1 7.36758 1 7.50019V9.50019C1 11.4302 2.57 13.0002 4.5 13.0002H12.29L10.14 15.1502C10.0489 15.2445 9.99852 15.3708 9.99966 15.5019C10.0008 15.633 10.0534 15.7584 10.1461 15.8511C10.2388 15.9438 10.3642 15.9964 10.4953 15.9975C10.6264 15.9987 10.7527 15.9483 10.847 15.8572L13.847 12.8572C13.9407 12.7634 13.9934 12.6363 13.9934 12.5037C13.9934 12.3711 13.9407 12.244 13.847 12.1502L10.847 9.15019C10.7527 9.05911 10.6264 9.00871 10.4953 9.00985C10.3642 9.01099 10.2388 9.06358 10.1461 9.15628C10.0534 9.24899 10.0008 9.37439 9.99966 9.50549C9.99852 9.63659 10.0489 9.76289 10.14 9.85719L12.29 12.0072H4.5C3.83696 12.0072 3.20107 11.7438 2.73223 11.275C2.26339 10.8061 2 10.1702 2 9.50719V7.50719V7.50019Z"
        fill={colors.text}
      />
    </Svg>
  );
}

function ClosetBuildLookDrawer({
  item,
  onClose,
  onGenerate,
  visible
}: {
  item: ClosetAutoPairItem;
  onClose: () => void;
  onGenerate: (item: ClosetAutoPairItem, pieces: LookPiece[]) => void;
  visible: boolean;
}) {
  const [pieces, setPieces] = useState<LookPiece[]>(() =>
    buildClosetBuildPieces(item)
  );
  const [activeCategory, setActiveCategory] =
    useState<ClosetBuildSlotKind | null>(null);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setPieces(buildClosetBuildPieces(item));
    setActiveCategory(null);
  }, [item, visible]);

  const handleClearSlot = (kind: ClosetBuildSlotKind) => {
    setPieces((currentPieces) => removeClosetBuildSlotPiece(currentPieces, kind));
  };

  const handleOpenCategory = (kind: ClosetBuildSlotKind) => {
    const currentPiece = getClosetBuildSlotPiece(pieces, kind);

    if (currentPiece?.isOwned) {
      return;
    }

    setActiveCategory(kind);
  };

  const handleSelectProduct = (
    kind: ClosetBuildSlotKind,
    selectedPiece: LookPiece
  ) => {
    setPieces((currentPieces) =>
      replaceClosetBuildSlotPiece(currentPieces, kind, selectedPiece)
    );
    setActiveCategory(null);
  };

  const handleShuffle = () => {
    setPieces((currentPieces) =>
      closetBuildSlots.reduce<LookPiece[]>((draftPieces, slot) => {
        const currentPiece = getClosetBuildSlotPiece(draftPieces, slot.kind);

        if (currentPiece?.isOwned) {
          return draftPieces;
        }

        const alternatives = getPieceAlternatives(slot.kind);

        if (alternatives.length === 0) {
          return draftPieces;
        }

        const availableAlternatives =
          alternatives.length > 1 && currentPiece
            ? alternatives.filter(
                (piece) =>
                  piece.image !== currentPiece.image ||
                  piece.name !== currentPiece.name
              )
            : alternatives;
        const shuffledPiece =
          availableAlternatives[
            Math.floor(Math.random() * availableAlternatives.length)
          ] ?? alternatives[0];

        return replaceClosetBuildSlotPiece(
          draftPieces,
          slot.kind,
          shuffledPiece
        );
      }, currentPieces)
    );
  };

  if (!visible) {
    return null;
  }

  const activeSlot =
    closetBuildSlots.find((slot) => slot.kind === activeCategory) ??
    closetBuildSlots[0];
  const listingOptions = activeCategory
    ? getClosetBuildListingOptions(pieces, activeCategory)
    : [];

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible>
      <View style={styles.addDrawerRoot}>
        <Pressable
          accessibilityLabel="Close build your look drawer"
          accessibilityRole="button"
          onPress={onClose}
          style={styles.addDrawerScrim}
        />
        <View style={styles.closetBuildDrawer}>
          {activeCategory ? (
            <ProductListingScreen
              emptyCopy="Try another category or come back to this slot later."
              emptyTitle={`No ${activeSlot.label.toLowerCase()} options yet`}
              hideCardWishlist
              hideHeaderActions
              hideProductImageTags
              keepProductsVisibleOnEmptyChip
              onBack={() => setActiveCategory(null)}
              onOpenProduct={(product) => {
                const selectedOption = listingOptions.find(
                  (option) => option.product.id === product.id
                );

                if (selectedOption) {
                  handleSelectProduct(activeCategory, selectedOption.piece);
                }
              }}
              products={listingOptions.map((option) => option.product)}
              searchPlaceholder={getClosetBuildSearchPlaceholder(activeCategory)}
              showDrawerHandle
              showSearchBar
              title={activeSlot.listingTitle}
            />
          ) : (
            <>
              <View style={styles.closetBuildHandle} />
              <View style={styles.closetBuildHeader}>
                <View style={styles.closetBuildHeaderSpacer} />
                <Text numberOfLines={1} style={styles.closetBuildTitle}>
                  Build your look
                </Text>
                <Pressable
                  accessibilityLabel="Shuffle suggested products"
                  accessibilityRole="button"
                  onPress={handleShuffle}
                  style={({ pressed }) => [
                    styles.closetBuildIconButton,
                    pressed ? styles.pressed : null
                  ]}
                >
                  <ClosetShuffleIcon />
                </Pressable>
              </View>
              <ScrollView
                contentContainerStyle={styles.closetBuildContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.closetBuildGrid}>
                  {closetBuildSlots.map((slot) => (
                    <ClosetBuildSlotCard
                      key={slot.kind}
                      kind={slot.kind}
                      label={slot.label}
                      onClear={handleClearSlot}
                      onPress={handleOpenCategory}
                      piece={getClosetBuildSlotPiece(pieces, slot.kind)}
                    />
                  ))}
                </View>
              </ScrollView>
              <View style={styles.closetBuildGenerateShell}>
                <Pressable
                  accessibilityLabel="Generate look"
                  accessibilityRole="button"
                  onPress={() => onGenerate(item, pieces)}
                  style={({ pressed }) => [
                    styles.closetBuildGenerateButton,
                    pressed ? styles.pressed : null
                  ]}
                >
                  <Text style={styles.closetBuildGenerateText}>
                    Generate Look
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

function QuickAddBatchDrawer({
  expandedItemId,
  mode,
  onClose,
  onMarkDetailAfterSave,
  onRemoveReviewEntry,
  onSaveEditedItem,
  onSaveDetectedItems,
  onSelectPhotos,
  onToggleDetectedItem,
  onUpdateDetectedCategory,
  onUpdateDetectedName,
  onUpdateDetectedSize,
  reviewEntries,
  visible
}: {
  expandedItemId: string | null;
  mode: QuickAddMode;
  onClose: () => void;
  onMarkDetailAfterSave: (itemId: string) => void;
  onRemoveReviewEntry: (entryId: string) => void;
  onSaveEditedItem: (itemId: string, draft: DetectedItemDraft) => void;
  onSaveDetectedItems: () => void;
  onSelectPhotos: () => void;
  onToggleDetectedItem: (itemId: string) => void;
  onUpdateDetectedCategory: (itemId: string, category: DetectedCategory) => void;
  onUpdateDetectedName: (itemId: string, name: string) => void;
  onUpdateDetectedSize: (itemId: string, size: string) => void;
  reviewEntries: DetectionReviewEntry[];
  visible: boolean;
}) {
  const [detectedListContentHeight, setDetectedListContentHeight] =
    useState(1);
  const [detectedListHeight, setDetectedListHeight] = useState(1);
  const [detectedListScrollY, setDetectedListScrollY] = useState(0);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const uploadLabel = mode === "select" ? "Select Photos" : "Add More Photos";
  const detectedItems = getCompletedDetectedItems(reviewEntries);
  const editingItem =
    detectedItems.find((item) => item.id === editingItemId) ?? null;
  const hasDetectedItems = detectedItems.length > 0;
  const shouldShowDetectedScrollbar =
    detectedListContentHeight > detectedListHeight + 1;
  const scrollbarTrackHeight = Math.max(1, detectedListHeight - 8);
  const scrollbarThumbHeight = shouldShowDetectedScrollbar
    ? Math.max(
        32,
        (detectedListHeight / detectedListContentHeight) * scrollbarTrackHeight
      )
    : 0;
  const maxDetectedScrollY = Math.max(
    1,
    detectedListContentHeight - detectedListHeight
  );
  const maxDetectedThumbY = Math.max(
    0,
    scrollbarTrackHeight - scrollbarThumbHeight
  );
  const detectedScrollbarThumbY = Math.max(
    0,
    Math.min(
      maxDetectedThumbY,
      (detectedListScrollY / maxDetectedScrollY) * maxDetectedThumbY
    )
  );

  useEffect(() => {
    if (editingItemId && !editingItem) {
      setEditingItemId(null);
    }
  }, [editingItem, editingItemId]);

  const handleSaveEditedItem = (draft: DetectedItemDraft) => {
    if (!editingItem) {
      return;
    }

    onSaveEditedItem(editingItem.id, draft);
    setEditingItemId(null);
  };

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View style={styles.addDrawerRoot}>
        <Pressable
          accessibilityLabel="Close quick add drawer"
          accessibilityRole="button"
          onPress={onClose}
          style={styles.addDrawerScrim}
        />
        <View
          style={[
            styles.addDrawer,
            mode !== "select" ? styles.addDrawerReview : null
          ]}
        >
          <View style={styles.addDrawerHandle} />
          {editingItem ? (
            <EditDetectedProductStep
              item={editingItem}
              onBack={() => setEditingItemId(null)}
              onSave={handleSaveEditedItem}
            />
          ) : (
            <>
              <View style={styles.addDrawerHeader}>
                <View style={styles.addDrawerCopy}>
                  <Text style={styles.addDrawerTitle}>Add New Items</Text>
                  <Text style={styles.addDrawerSubtitle}>
                    Select multiple photos and Mira will detect each item
                    automatically.
                  </Text>
                </View>
              </View>

              <Pressable
                accessibilityLabel="Select photos for batch closet upload"
                accessibilityRole="button"
                onPress={onSelectPhotos}
                style={({ pressed }) => [
                  styles.addDrawerUploadTarget,
                  pressed ? styles.pressed : null
                ]}
              >
                <Feather color={colors.muted} name="upload-cloud" size={22} />
                <Text style={styles.addDrawerUploadText}>{uploadLabel}</Text>
              </Pressable>

              {mode === "analyzing" ? (
                <View style={styles.analyzingPanel}>
                  <ActivityIndicator color={colors.text} size="small" />
                  <View style={styles.analyzingCopy}>
                    <Text style={styles.analyzingTitle}>Analysing</Text>
                  </View>
                </View>
              ) : null}

              {mode === "review" ? (
                <>
                  <View style={styles.detectedListFrame}>
                    <ScrollView
                      contentContainerStyle={styles.detectedListContent}
                      keyboardShouldPersistTaps="handled"
                      onContentSizeChange={(_, height) =>
                        setDetectedListContentHeight(height)
                      }
                      onLayout={(event) =>
                        setDetectedListHeight(event.nativeEvent.layout.height)
                      }
                      onScroll={(event) =>
                        setDetectedListScrollY(event.nativeEvent.contentOffset.y)
                      }
                      scrollEventThrottle={16}
                      showsVerticalScrollIndicator={false}
                      style={styles.detectedList}
                    >
                      {reviewEntries.map((entry) =>
                        entry.kind === "detected" ? (
                          <DetectedItemCard
                            expanded={expandedItemId === entry.item.id}
                            item={entry.item}
                            key={entry.item.id}
                            onAddMoreDetails={() =>
                              onMarkDetailAfterSave(entry.item.id)
                            }
                            onEdit={() => setEditingItemId(entry.item.id)}
                            onRemove={() => onRemoveReviewEntry(entry.item.id)}
                            onToggle={() => onToggleDetectedItem(entry.item.id)}
                            onUpdateCategory={(category) =>
                              onUpdateDetectedCategory(entry.item.id, category)
                            }
                            onUpdateName={(name) =>
                              onUpdateDetectedName(entry.item.id, name)
                            }
                            onUpdateSize={(size) =>
                              onUpdateDetectedSize(entry.item.id, size)
                            }
                          />
                        ) : (
                          <DetectionStateCard
                            image={entry.image}
                            key={entry.id}
                            onRemove={() => onRemoveReviewEntry(entry.id)}
                            state={entry.state}
                          />
                        )
                      )}
                    </ScrollView>

                    {shouldShowDetectedScrollbar ? (
                      <View
                        pointerEvents="none"
                        style={styles.detectedScrollbarTrack}
                      >
                        <View
                          style={[
                            styles.detectedScrollbarThumb,
                            {
                              height: scrollbarThumbHeight,
                              transform: [
                                { translateY: detectedScrollbarThumbY }
                              ]
                            }
                          ]}
                        />
                      </View>
                    ) : null}
                  </View>

                  <Pressable
                    accessibilityRole="button"
                    disabled={!hasDetectedItems}
                    onPress={onSaveDetectedItems}
                    style={({ pressed }) => [
                      styles.addDetectedCta,
                      !hasDetectedItems ? styles.addDetectedCtaDisabled : null,
                      pressed && hasDetectedItems ? styles.pressed : null
                    ]}
                  >
                    <Feather color={colors.inverseText} name="plus" size={18} />
                    <Text style={styles.addDetectedCtaText}>
                      {getDetectedSaveLabel(detectedItems.length)}
                    </Text>
                  </Pressable>
                </>
              ) : null}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

function ClosetPieceEditDrawer({
  onClose,
  onSave,
  piece,
  visible
}: {
  onClose: () => void;
  onSave: (draft: DetectedItemDraft) => void;
  piece: ClosetPiece;
  visible: boolean;
}) {
  if (!visible) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View style={styles.addDrawerRoot}>
        <Pressable
          accessibilityLabel="Close edit product drawer"
          accessibilityRole="button"
          onPress={onClose}
          style={styles.addDrawerScrim}
        />
        <View style={[styles.addDrawer, styles.addDrawerReview]}>
          <View style={styles.addDrawerHandle} />
          <EditDetectedProductStep
            headerAction="close"
            item={toDetectedClosetItem(piece)}
            onBack={onClose}
            onSave={onSave}
          />
        </View>
      </View>
    </Modal>
  );
}

export function ClosetScreen({
  cartCount = 0,
  onAskMira,
  onInternalViewChange,
  onOpenCart,
  onOpenSearch,
  onOpenWishlist,
  onStartAutoPairTryOn,
  onStartTryOn
}: ClosetScreenProps) {
  const analysisTimerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const closetScrollRef = useRef<ScrollView | null>(null);
  const [pieces, setPieces] = useState<ClosetPiece[]>(closetPieces);
  const [selectedPiece, setSelectedPiece] = useState<ClosetPiece | null>(null);
  const [isDetailEditVisible, setIsDetailEditVisible] = useState(false);
  const [isBuildLookDrawerVisible, setIsBuildLookDrawerVisible] =
    useState(false);
  const [favoritePieceIds, setFavoritePieceIds] = useState<Set<string>>(
    () => new Set()
  );
  const [isQuickAddVisible, setIsQuickAddVisible] = useState(false);
  const [isPhotoLibraryVisible, setIsPhotoLibraryVisible] = useState(false);
  const [quickAddMode, setQuickAddMode] = useState<QuickAddMode>("select");
  const [reviewEntries, setReviewEntries] = useState<DetectionReviewEntry[]>(
    []
  );
  const [selectedPhotoAssets, setSelectedPhotoAssets] = useState<
    PickedPhotoAsset[]
  >([]);
  const selectedPhotoAssetKeys = new Set(
    selectedPhotoAssets.map((asset) => asset.key)
  );
  const [expandedDetectedItemId, setExpandedDetectedItemId] =
    useState<string | null>(null);
  const [detailAfterSaveItemId, setDetailAfterSaveItemId] =
    useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] =
    useState<ClosetCategoryFilter>("All");
  const selectedCategoryOption = closetCategoryFilters.find(
    (option) => option.key === selectedCategoryFilter
  );
  const filteredPieces =
    selectedCategoryFilter === "All" || !selectedCategoryOption
      ? pieces
      : pieces.filter((piece) =>
          doesClosetPieceMatchCategoryFilter(piece, selectedCategoryOption)
        );

  useEffect(() => {
    return () => {
      analysisTimerRefs.current.forEach((timer) => clearTimeout(timer));
      analysisTimerRefs.current = [];
    };
  }, []);

  useEffect(() => {
    onInternalViewChange?.(selectedPiece !== null);
  }, [onInternalViewChange, selectedPiece]);

  useEffect(
    () => () => {
      onInternalViewChange?.(false);
    },
    [onInternalViewChange]
  );

  const resetQuickAdd = () => {
    analysisTimerRefs.current.forEach((timer) => clearTimeout(timer));
    analysisTimerRefs.current = [];

    setIsQuickAddVisible(false);
    setIsPhotoLibraryVisible(false);
    setQuickAddMode("select");
    setReviewEntries([]);
    setSelectedPhotoAssets([]);
    setExpandedDetectedItemId(null);
    setDetailAfterSaveItemId(null);
  };

  const getNewPickedAssets = (
    assets: Array<{
      assetId?: string | null;
      fileName?: string | null;
      fileSize?: number | null;
      height?: number | null;
      name?: string | null;
      size?: number | null;
      uri?: string;
      width?: number | null;
    }>
  ) => {
    const seenAssetKeys = new Set(selectedPhotoAssetKeys);
    const pickedAssets: PickedPhotoAsset[] = [];

    assets.forEach((asset, index) => {
      if (!asset.uri) {
        return;
      }

      const assetKey = getPickedAssetKey(asset, index);

      if (seenAssetKeys.has(assetKey)) {
        return;
      }

      seenAssetKeys.add(assetKey);
      pickedAssets.push({ key: assetKey, uri: asset.uri });
    });

    return pickedAssets;
  };

  const rememberPickedAssets = (pickedAssets: PickedPhotoAsset[]) => {
    setSelectedPhotoAssets((currentAssets) => {
      const currentKeys = new Set(currentAssets.map((asset) => asset.key));
      const newAssets = pickedAssets.filter(
        (asset) => !currentKeys.has(asset.key)
      );

      return [...currentAssets, ...newAssets];
    });
  };

  const beginDetectedReview = (pickedAssets: PickedPhotoAsset[] = []) => {
    const batchId = `batch-${Date.now()}`;
    const sourceStartIndex = selectedPhotoAssets.length;
    const processingEntries: DetectionReviewEntry[] = pickedAssets.map(
      (asset, index) => ({
        batchId,
        id: `processing-${batchId}-${index}`,
        image: asset.uri,
        kind: "processing",
        sourceAssetKey: asset.key,
        state: "analyzing"
      })
    );

    setIsQuickAddVisible(true);
    setQuickAddMode("review");
    setExpandedDetectedItemId(null);
    setReviewEntries((currentEntries) => [
      ...currentEntries,
      ...processingEntries
    ]);

    const analysisTimer = setTimeout(() => {
      setReviewEntries((currentEntries) => {
        const completedCount = getCompletedDetectedItems(currentEntries).length;
        let nextDetectedItemIndex = completedCount;
        const resultEntriesById = new Map<string, DetectionReviewEntry[]>();

        processingEntries.forEach((entry, index) => {
          if (entry.kind !== "processing") {
            return;
          }

          const sourceIndex = sourceStartIndex + index;

          if (shouldFailDetectionForSource(sourceIndex)) {
            resultEntriesById.set(entry.id, [
              {
                ...entry,
                state: "failed"
              }
            ]);
            return;
          }

          const productCount = getDetectedProductCountForSource(sourceIndex);
          const sourceAssets = Array.from(
            { length: productCount },
            () => ({
              key: entry.sourceAssetKey,
              uri: entry.image
            })
          );
          const nextDetectedItems = createDetectedItems(
            Date.now() + index,
            sourceAssets,
            nextDetectedItemIndex
          );

          nextDetectedItemIndex += nextDetectedItems.length;
          resultEntriesById.set(
            entry.id,
            nextDetectedItems.map((item) => ({
              kind: "detected",
              item
            }))
          );
        });

        return currentEntries.flatMap((entry) =>
          entry.kind === "processing" && entry.batchId === batchId
            ? resultEntriesById.get(entry.id) ?? [entry]
            : [entry]
        );
      });
      setQuickAddMode("review");
      analysisTimerRefs.current = analysisTimerRefs.current.filter(
        (timer) => timer !== analysisTimer
      );
    }, 1700);

    analysisTimerRefs.current.push(analysisTimer);
  };

  const handleOpenPhotoLibrary = async () => {
    if (selectedPhotoAssets.length >= 10) {
      Alert.alert(
        "Photo limit reached",
        "Add these items first, then start another batch."
      );
      return;
    }

    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Photo access needed",
          "Allow photo access to add items from your closet."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        allowsMultipleSelection: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        orderedSelection: true,
        quality: 0.9,
        selectionLimit: Math.max(1, 10 - selectedPhotoAssets.length)
      });

      if (!result.canceled && result.assets.length > 0) {
        const pickedAssets = getNewPickedAssets(result.assets);

        if (pickedAssets.length === 0) {
          Alert.alert(
            "Already added",
            "Those photos are already in this batch."
          );
          return;
        }

        rememberPickedAssets(pickedAssets);
        beginDetectedReview(pickedAssets);
      }
    } catch {
      Alert.alert(
        "Photo library unavailable",
        "Please try selecting photos again."
      );
    }
  };

  const handleConfirmPhotoLibrarySelection = (
    pickedAssets: PickedPhotoAsset[]
  ) => {
    if (pickedAssets.length === 0) {
      setIsPhotoLibraryVisible(false);
      return;
    }

    rememberPickedAssets(pickedAssets);
    setIsPhotoLibraryVisible(false);
    beginDetectedReview(pickedAssets);
  };

  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Camera access needed",
          "Allow camera access to take a photo of your item."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.9
      });

      if (!result.canceled && result.assets[0]?.uri) {
        const pickedAssets = getNewPickedAssets(result.assets);

        if (pickedAssets.length === 0) {
          Alert.alert("Already added", "That photo is already in this batch.");
          return;
        }

        rememberPickedAssets(pickedAssets);
        beginDetectedReview(pickedAssets);
      }
    } catch {
      Alert.alert("Camera unavailable", "Please try taking the photo again.");
    }
  };

  const handleChooseFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: true,
        type: "image/*"
      });

      if (!result.canceled && result.assets.length > 0) {
        const pickedAssets = getNewPickedAssets(result.assets);

        if (pickedAssets.length === 0) {
          Alert.alert(
            "Already added",
            "Those files are already in this batch."
          );
          return;
        }

        rememberPickedAssets(pickedAssets);
        beginDetectedReview(pickedAssets);
      }
    } catch {
      Alert.alert("Files unavailable", "Please try choosing files again.");
    }
  };

  const handleSelectPhotos = () => {
    const options = ["Photo library", "Take photo", "Choose files", "Cancel"];
    const cancelButtonIndex = options.length - 1;
    const openPhotoLibraryAfterSheetCloses = () => {
      setTimeout(() => {
        void handleOpenPhotoLibrary();
      }, 250);
    };

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          cancelButtonIndex,
          options,
          title: "Add New Items"
        },
        (selectedButtonIndex) => {
          if (selectedButtonIndex === 0) {
            openPhotoLibraryAfterSheetCloses();
          }

          if (selectedButtonIndex === 1) {
            void handleTakePhoto();
          }

          if (selectedButtonIndex === 2) {
            void handleChooseFiles();
          }
        }
      );
      return;
    }

    Alert.alert("Add New Items", "Choose how you want to add items.", [
      { onPress: () => void handleOpenPhotoLibrary(), text: "Photo library" },
      { onPress: () => void handleTakePhoto(), text: "Take photo" },
      { onPress: () => void handleChooseFiles(), text: "Choose files" },
      { style: "cancel", text: "Cancel" }
    ]);
  };

  const handleToggleDetectedItem = (itemId: string) => {
    setExpandedDetectedItemId((currentItemId) =>
      currentItemId === itemId ? null : itemId
    );
  };

  const handleRemoveReviewEntry = (entryId: string) => {
    const removedEntry = reviewEntries.find(
      (entry) => getReviewEntryId(entry) === entryId
    );

    setReviewEntries((entries) =>
      entries.filter((entry) => getReviewEntryId(entry) !== entryId)
    );

    const removedSourceAssetKey = removedEntry
      ? getReviewEntrySourceAssetKey(removedEntry)
      : undefined;

    if (removedSourceAssetKey) {
      const hasRemainingSourceEntry = reviewEntries.some(
        (entry) =>
          getReviewEntryId(entry) !== entryId &&
          getReviewEntrySourceAssetKey(entry) === removedSourceAssetKey
      );

      if (!hasRemainingSourceEntry) {
        setSelectedPhotoAssets((currentAssets) =>
          currentAssets.filter((asset) => asset.key !== removedSourceAssetKey)
        );
      }
    }

    setExpandedDetectedItemId((currentItemId) =>
      currentItemId === entryId ? null : currentItemId
    );
    setDetailAfterSaveItemId((currentItemId) =>
      currentItemId === entryId ? null : currentItemId
    );
  };

  const handleUpdateDetectedName = (itemId: string, name: string) => {
    setReviewEntries((entries) =>
      entries.map((entry) =>
        entry.kind === "detected" && entry.item.id === itemId
          ? { ...entry, item: { ...entry.item, name } }
          : entry
      )
    );
  };

  const handleUpdateDetectedCategory = (
    itemId: string,
    category: DetectedCategory
  ) => {
    setReviewEntries((entries) =>
      entries.map((entry) =>
        entry.kind === "detected" && entry.item.id === itemId
          ? { ...entry, item: { ...entry.item, category, size: "" } }
          : entry
      )
    );
  };

  const handleUpdateDetectedSize = (itemId: string, size: string) => {
    setReviewEntries((entries) =>
      entries.map((entry) =>
        entry.kind === "detected" && entry.item.id === itemId
          ? { ...entry, item: { ...entry.item, size } }
          : entry
      )
    );
  };

  const handleSaveEditedItem = (
    itemId: string,
    draft: DetectedItemDraft
  ) => {
    setReviewEntries((entries) =>
      entries.map((entry) =>
        entry.kind === "detected" && entry.item.id === itemId
          ? {
              ...entry,
              item: {
                ...entry.item,
                category: draft.category,
                color: draft.color,
                fit: draft.fit,
                gender: draft.gender,
                material: draft.material,
                name: draft.name,
                size: draft.size,
                tags: draft.tags
              }
            }
          : entry
      )
    );
  };

  const handleSaveDetectedItems = () => {
    const detectedItems = getCompletedDetectedItems(reviewEntries);

    if (detectedItems.length === 0) {
      return;
    }

    const newPieces = detectedItems.map(toClosetPiece);
    const detailPiece = detailAfterSaveItemId
      ? newPieces.find((piece) => piece.id === detailAfterSaveItemId) ?? null
      : null;

    setPieces((currentPieces) => [...newPieces, ...currentPieces]);
    resetQuickAdd();
    requestAnimationFrame(() => {
      closetScrollRef.current?.scrollTo({ animated: false, y: 0 });
    });

    if (detailPiece) {
      setSelectedPiece(detailPiece);
    }
  };

  const handleSaveDetailPiece = (draft: DetectedItemDraft) => {
    if (!selectedPiece) {
      return;
    }

    const updatedPiece: ClosetPiece = {
      ...selectedPiece,
      category: getClosetCategory(draft.category),
      color: draft.color,
      fit: draft.fit || "+ Add fit",
      gender: draft.gender || "+ Add gender",
      material: draft.material || "+ Add material",
      size: draft.size || "+ Add size",
      tags: normalizeEditProductTags(draft.tags),
      title: draft.name
    };

    setPieces((currentPieces) =>
      currentPieces.map((piece) =>
        piece.id === selectedPiece.id ? updatedPiece : piece
      )
    );
    setSelectedPiece(updatedPiece);
    setIsDetailEditVisible(false);
  };

  const handleToggleFavoritePiece = (pieceId: string) => {
    setFavoritePieceIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(pieceId)) {
        nextIds.delete(pieceId);
        return nextIds;
      }

      nextIds.add(pieceId);
      return nextIds;
    });
  };

  const closeSelectedPiece = () => {
    setIsDetailEditVisible(false);
    setIsBuildLookDrawerVisible(false);
    setSelectedPiece(null);
  };

  const handleGenerateClosetBuildLook = (
    item: ClosetAutoPairItem,
    buildPieces: LookPiece[]
  ) => {
    setIsBuildLookDrawerVisible(false);
    onStartTryOn?.(item, buildPieces);
  };

  if (selectedPiece) {
    const selectedAutoPairItem = toClosetAutoPairItem(selectedPiece);

    return (
      <>
        <ClosetPieceDetailScreen
          cartCount={cartCount}
          isFavorite={favoritePieceIds.has(selectedPiece.id)}
          onAskMira={onAskMira}
          onBack={closeSelectedPiece}
          onEdit={() => setIsDetailEditVisible(true)}
          onOpenCart={onOpenCart}
          onOpenSearch={onOpenSearch}
          onOpenWishlist={onOpenWishlist}
          onStartAutoPairTryOn={() =>
            onStartAutoPairTryOn?.(selectedAutoPairItem)
          }
          onStartTryOn={() => setIsBuildLookDrawerVisible(true)}
          onToggleFavorite={() => handleToggleFavoritePiece(selectedPiece.id)}
          piece={selectedPiece}
        />
        <ClosetPieceEditDrawer
          onClose={() => setIsDetailEditVisible(false)}
          onSave={handleSaveDetailPiece}
          piece={selectedPiece}
          visible={isDetailEditVisible}
        />
        <ClosetBuildLookDrawer
          item={selectedAutoPairItem}
          onClose={() => setIsBuildLookDrawerVisible(false)}
          onGenerate={handleGenerateClosetBuildLook}
          visible={isBuildLookDrawerVisible}
        />
      </>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        ref={closetScrollRef}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        style={styles.screen}
      >
        <AppScreenHeader
          rightAccessory={
            <View style={styles.toolbar}>
              <ClosetToolbarButton
                accessibilityLabel="Add item"
                icon="plus"
                label="Add item"
                onPress={() => setIsQuickAddVisible(true)}
                variant="primary"
              />
            </View>
          }
          subtitle={`${pieces.length} items`}
          title="My Closet"
        />

        <View style={styles.stickySearchHost}>
          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Feather color={colors.soft} name="search" size={21} />
              <TextInput
                accessibilityLabel="Search closet"
                placeholder="Search your wardrobe..."
                placeholderTextColor={colors.soft}
                returnKeyType="search"
                style={styles.searchInput}
              />
              <Feather color={colors.soft} name="mic" size={20} />
            </View>
          </View>

          <ScrollView
            contentContainerStyle={styles.filterChipRail}
            horizontal
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.filterChipScroller}
          >
            {closetCategoryFilters.map((filter) => {
              const isSelected = selectedCategoryFilter === filter.key;

              return (
                <Pressable
                  accessibilityLabel={`Filter closet by ${filter.label}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  key={`closet-filter-${filter.key}`}
                  onPress={() => setSelectedCategoryFilter(filter.key)}
                  style={({ pressed }) => [
                    styles.filterCategoryTab,
                    isSelected ? styles.filterChipSelected : null,
                    pressed ? styles.pressed : null
                  ]}
                >
                  <View
                    style={[
                      styles.filterImageShell,
                      isSelected ? styles.filterImageShellSelected : null
                    ]}
                  >
                    <Image
                      resizeMode="cover"
                      source={{ uri: filter.image }}
                      style={styles.filterImage}
                    />
                  </View>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.filterChipText,
                      isSelected ? styles.filterChipTextSelected : null
                    ]}
                  >
                    {filter.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.grid}>
          {filteredPieces.map((piece) => (
            <ClosetPieceCard
              isFavorite={favoritePieceIds.has(piece.id)}
              key={piece.id}
              onPress={() => setSelectedPiece(piece)}
              onToggleFavorite={() => handleToggleFavoritePiece(piece.id)}
              piece={piece}
            />
          ))}
        </View>
      </ScrollView>
      <QuickAddBatchDrawer
        expandedItemId={expandedDetectedItemId}
        mode={quickAddMode}
        onClose={resetQuickAdd}
        onMarkDetailAfterSave={setDetailAfterSaveItemId}
        onRemoveReviewEntry={handleRemoveReviewEntry}
        onSaveEditedItem={handleSaveEditedItem}
        onSaveDetectedItems={handleSaveDetectedItems}
        onSelectPhotos={handleSelectPhotos}
        onToggleDetectedItem={handleToggleDetectedItem}
        onUpdateDetectedCategory={handleUpdateDetectedCategory}
        onUpdateDetectedName={handleUpdateDetectedName}
        onUpdateDetectedSize={handleUpdateDetectedSize}
        reviewEntries={reviewEntries}
        visible={isQuickAddVisible}
      />
      <PhotoLibraryPickerModal
        onCancel={() => setIsPhotoLibraryVisible(false)}
        onConfirm={handleConfirmPhotoLibrarySelection}
        selectedAssets={selectedPhotoAssets}
        visible={isPhotoLibraryVisible}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addDrawer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    gap: spacing.lg,
    paddingBottom: appBottomSafeInset + spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md
  },
  addDetectedCta: {
    alignItems: "center",
    backgroundColor: colors.inverse,
    borderRadius: radii.button,
    flexDirection: "row",
    gap: spacing.sm,
    height: 52,
    justifyContent: "center",
    paddingHorizontal: spacing.lg
  },
  addDetectedCtaDisabled: {
    backgroundColor: colors.soft
  },
  addDetectedCtaText: {
    color: colors.inverseText,
    fontFamily: fonts.cta,
    fontSize: 16,
    lineHeight: 20
  },
  addDrawerCopy: {
    flex: 1,
    minWidth: 0
  },
  addDrawerHandle: {
    alignSelf: "center",
    backgroundColor: colors.border,
    borderRadius: radii.pill,
    height: 5,
    marginBottom: spacing.sm,
    width: 48
  },
  addDrawerHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md
  },
  addDrawerRoot: {
    flex: 1,
    justifyContent: "flex-end"
  },
  addDrawerReview: {
    maxHeight: "82%",
    paddingBottom: spacing.xl
  },
  addDrawerScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.scrimMedium
  },
  addDrawerSubtitle: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.sm
  },
  addDrawerTitle: {
    ...typography.sectionHeading,
    color: colors.text,
  },
  addDrawerUploadTarget: {
    alignItems: "center",
    backgroundColor: colors.surfaceTertiary,
    borderColor: colors.border,
    borderRadius: 16,
    borderStyle: "dashed",
    borderWidth: 1.5,
    flexDirection: "row",
    gap: spacing.md,
    height: 60,
    justifyContent: "center",
    paddingHorizontal: spacing.lg
  },
  addDrawerUploadText: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18
  },
  closetBuildAddIcon: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 28,
    borderWidth: StyleSheet.hairlineWidth,
    height: 56,
    justifyContent: "center",
    width: 56
  },
  closetBuildContent: {
    paddingBottom: 96,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg
  },
  closetBuildDrawer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    height: "76%",
    overflow: "hidden"
  },
  closetBuildEmptyContent: {
    alignItems: "center",
    gap: spacing.md,
    justifyContent: "center"
  },
  closetBuildEmptyText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 17,
    textAlign: "center"
  },
  closetBuildGenerateButton: {
    alignItems: "center",
    backgroundColor: colors.inverse,
    borderRadius: radii.button,
    height: 52,
    justifyContent: "center"
  },
  closetBuildGenerateShell: {
    backgroundColor: colors.background,
    bottom: 0,
    left: 0,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    position: "absolute",
    right: 0
  },
  closetBuildGenerateText: {
    color: colors.inverseText,
    fontFamily: fonts.cta,
    fontSize: 16,
    lineHeight: 20
  },
  closetBuildGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md
  },
  closetBuildHandle: {
    alignSelf: "center",
    backgroundColor: colors.soft,
    borderRadius: radii.pill,
    height: 5,
    marginTop: spacing.sm,
    width: 48
  },
  closetBuildHeader: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    height: 64,
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl
  },
  closetBuildHeaderSpacer: {
    height: 48,
    width: 48
  },
  closetBuildIconButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  closetBuildOwnedTag: {
    backgroundColor: colors.inverse,
    borderRadius: radii.pill,
    bottom: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: "absolute"
  },
  closetBuildOwnedTagText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 13
  },
  closetBuildRemoveButton: {
    alignItems: "center",
    backgroundColor: colors.surfaceTranslucent,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    height: 44,
    justifyContent: "center",
    position: "absolute",
    right: spacing.sm,
    top: spacing.sm,
    width: 44
  },
  closetBuildSlot: {
    flexBasis: "47.8%",
    flexGrow: 0,
    minWidth: 0
  },
  closetBuildSlotFrame: {
    alignItems: "center",
    aspectRatio: 1,
    backgroundColor: colors.surfaceTertiary,
    borderRadius: 14,
    justifyContent: "center",
    overflow: "hidden"
  },
  closetBuildSlotFrameEmpty: {
    backgroundColor: colors.surfaceTertiary
  },
  closetBuildSlotImage: {
    height: "100%",
    width: "100%"
  },
  closetBuildSlotLabel: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 19,
    marginTop: spacing.sm,
    textAlign: "center"
  },
  closetBuildTitle: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 25,
    textAlign: "center"
  },
  analyzingCopy: {
    flex: 1,
    minWidth: 0
  },
  analyzingPanel: {
    alignItems: "center",
    backgroundColor: colors.surfaceTertiary,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 88,
    padding: spacing.lg
  },
  analyzingTitle: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 20
  },
  catalogPairCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    width: 154
  },
  catalogPairCardFirst: {
    marginLeft: spacing.screen
  },
  catalogPairCardLast: {
    marginRight: spacing.screen
  },
  catalogPairImageWrap: {
    alignItems: "flex-end",
    aspectRatio: 3 / 4,
    backgroundColor: colors.surface,
    padding: 8
  },
  catalogPairImageStyle: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  catalogPairInfo: {
    backgroundColor: colors.background,
    padding: 12
  },
  catalogPairPrice: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 18,
    marginTop: 4
  },
  catalogPairSaveButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    height: 32,
    justifyContent: "center",
    width: 32
  },
  catalogPairSaveWrap: {
    alignItems: "flex-end"
  },
  catalogPairTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 14,
    lineHeight: 18
  },
  catalogPairsRail: {
    gap: spacing.sm
  },
  catalogPairsScroller: {
    marginHorizontal: -spacing.screen
  },
  catalogPairsSection: {
    marginTop: spacing.xl
  },
  catalogPairsTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 23,
    marginBottom: spacing.md
  },
  miraAdviceBadge: {
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5
  },
  miraAdviceBadgeText: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14
  },
  miraAdviceCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.md
  },
  miraAdviceCta: {
    alignSelf: "flex-start",
    minHeight: 28,
    justifyContent: "center",
    marginTop: spacing.sm
  },
  miraAdviceCtaText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    textDecorationLine: "underline"
  },
  miraAdviceHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between",
    marginBottom: spacing.sm
  },
  miraAdviceSection: {
    marginTop: spacing.xl
  },
  miraAdviceText: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20
  },
  miraAdviceTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 23
  },
  content: {
    paddingBottom: 116,
    paddingHorizontal: spacing.screen,
    paddingTop: appScreenTopPadding
  },
  detectedCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    padding: spacing.sm,
    position: "relative"
  },
  detectedCardExpanded: {
    maxHeight: 200
  },
  detectedCardActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.lg
  },
  detectedCardSummary: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    minHeight: 50
  },
  detectedChoicePill: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    flexShrink: 1,
    height: 24,
    justifyContent: "center",
    paddingHorizontal: spacing.sm
  },
  detectedChoicePillSelected: {
    backgroundColor: colors.inverse,
    borderColor: colors.inverse
  },
  detectedChoicePillText: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14
  },
  detectedChoicePillTextSelected: {
    color: colors.inverseText
  },
  detectedEditor: {
    gap: 4,
    marginTop: spacing.sm
  },
  detectedEditButton: {
    alignItems: "center",
    height: 32,
    justifyContent: "center",
    width: 24
  },
  detectedItemCopy: {
    flex: 1,
    minWidth: 0
  },
  detectedItemImage: {
    backgroundColor: colors.imageSurface,
    borderRadius: radii.card,
    height: 50,
    width: 50
  },
  detectedItemMeta: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 17
  },
  detectedItemName: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 15,
    lineHeight: 19
  },
  detectedItemTags: {
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 1
  },
  detectedList: {
    maxHeight: 300
  },
  detectedListContent: {
    gap: spacing.sm,
    paddingBottom: spacing.xs,
    paddingRight: spacing.xs
  },
  detectedListFrame: {
    maxHeight: 300,
    position: "relative"
  },
  detectedMoreDetailsButton: {
    alignSelf: "flex-start",
    marginTop: spacing.xs
  },
  detectedMoreDetailsText: {
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
    textDecorationLine: "underline"
  },
  detectedNameClearButton: {
    alignItems: "center",
    height: 32,
    justifyContent: "center",
    width: 32
  },
  detectedNameField: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 0.5,
    flexDirection: "row",
    height: 40,
    paddingLeft: spacing.md,
    paddingRight: spacing.xs
  },
  detectedNameInput: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    height: 40,
    includeFontPadding: false,
    lineHeight: 18,
    minWidth: 0,
    padding: 0
  },
  detectedPillRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: spacing.xs,
    overflow: "hidden"
  },
  detectedRemoveButton: {
    alignItems: "center",
    height: 32,
    justifyContent: "center",
    width: 32
  },
  detectedScrollbarThumb: {
    backgroundColor: colors.soft,
    borderRadius: radii.pill,
    width: 3
  },
  detectedScrollbarTrack: {
    backgroundColor: colors.border,
    borderRadius: radii.pill,
    bottom: 4,
    position: "absolute",
    right: -8,
    top: 4,
    width: 3
  },
  detectedShimmerClip: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
    overflow: "hidden",
    zIndex: 2
  },
  detectedShimmerGradient: {
    flex: 1
  },
  detectedShimmerSweep: {
    bottom: 0,
    opacity: 0.72,
    position: "absolute",
    top: 0
  },
  detectedStateRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs
  },
  detectedStateText: {
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 19
  },
  detectedStateTextFailed: {
    color: "#D45252",
    fontFamily: fonts.bodyMedium
  },
  editProductBackButton: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    marginLeft: -8,
    width: 40
  },
  editProductCategoryChip: {
    alignItems: "center",
    backgroundColor: colors.surfaceTertiary,
    borderRadius: radii.pill,
    height: 40,
    justifyContent: "center",
    paddingHorizontal: spacing.lg
  },
  editProductCategoryChipSelected: {
    backgroundColor: colors.inverse
  },
  editProductCategoryChipText: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18
  },
  editProductCategoryChipTextSelected: {
    color: colors.inverseText
  },
  editProductChoiceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  editProductCloseButton: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    marginRight: -8,
    width: 40
  },
  editProductColorField: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    height: 54,
    paddingHorizontal: spacing.lg
  },
  editProductColorOption: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 46,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  editProductColorOptionSelected: {
    backgroundColor: colors.surfaceTertiary
  },
  editProductColorOptions: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 8,
    left: 0,
    maxHeight: 216,
    overflow: "hidden",
    position: "absolute",
    right: 0,
    shadowColor: "#000000",
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    top: 58,
    zIndex: 20
  },
  editProductColorOptionsScroll: {
    maxHeight: 216
  },
  editProductColorOptionText: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 19
  },
  editProductColorSwatch: {
    borderRadius: 999,
    height: 16,
    width: 16
  },
  editProductColorSwatchBordered: {
    borderColor: colors.border,
    borderWidth: 1
  },
  editProductColorText: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 19
  },
  editProductDropdownField: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    height: 54,
    paddingHorizontal: spacing.lg
  },
  editProductDropdownRoot: {
    position: "relative",
    zIndex: 1
  },
  editProductDropdownOption: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 46,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  editProductDropdownOptionText: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 19
  },
  editProductDropdownOptions: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 8,
    left: 0,
    maxHeight: 184,
    overflow: "hidden",
    position: "absolute",
    right: 0,
    shadowColor: "#000000",
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    top: 58,
    zIndex: 20
  },
  editProductDropdownOptionsScroll: {
    maxHeight: 184
  },
  editProductDropdownPlaceholder: {
    color: colors.soft
  },
  editProductDropdownText: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 19
  },
  editProductFieldGroup: {
    gap: spacing.sm,
    position: "relative",
    zIndex: 1
  },
  editProductFieldGroupFloating: {
    zIndex: 30
  },
  editProductForm: {
    gap: spacing.lg,
    paddingBottom: spacing.md
  },
  editProductHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  editProductImage: {
    height: "100%",
    width: "100%"
  },
  editProductImageFrame: {
    alignSelf: "center",
    backgroundColor: colors.imageSurface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    height: 132,
    overflow: "hidden",
    padding: spacing.sm,
    width: 132
  },
  editProductInput: {
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 15,
    height: 54,
    lineHeight: 19,
    paddingHorizontal: spacing.lg
  },
  editProductLabel: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 18
  },
  editProductSaveButton: {
    alignItems: "center",
    backgroundColor: colors.inverse,
    borderRadius: radii.button,
    height: 52,
    justifyContent: "center"
  },
  editProductSaveButtonDisabled: {
    backgroundColor: colors.soft
  },
  editProductSaveText: {
    color: colors.inverseText,
    fontFamily: fonts.cta,
    fontSize: 16,
    lineHeight: 20
  },
  editProductSizeChip: {
    alignItems: "center",
    backgroundColor: colors.surfaceTertiary,
    borderRadius: radii.pill,
    height: 40,
    justifyContent: "center",
    minWidth: 52,
    paddingHorizontal: spacing.lg
  },
  editProductTagEditor: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    minHeight: 82,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md
  },
  editProductTagInput: {
    color: colors.text,
    flexGrow: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    height: 34,
    lineHeight: 18,
    minWidth: 98,
    padding: 0
  },
  editProductTagHint: {
    alignSelf: "flex-start",
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
    marginTop: -spacing.xs
  },
  editProductTagPill: {
    alignItems: "center",
    backgroundColor: colors.surfaceTertiary,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: spacing.xs,
    minHeight: 34,
    maxWidth: "100%",
    paddingLeft: spacing.md,
    paddingRight: spacing.xs
  },
  editProductTagRemoveButton: {
    alignItems: "center",
    height: 24,
    justifyContent: "center",
    width: 24
  },
  editProductTagText: {
    color: colors.text,
    flexShrink: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 18
  },
  editProductTitle: {
    ...typography.sectionHeading,
    color: colors.text,
    flex: 1
  },
  detailAutoPairCta: {
    alignItems: "center",
    backgroundColor: colors.inverse,
    borderRadius: radii.button,
    flex: 1,
    height: 48,
    justifyContent: "center",
    paddingHorizontal: spacing.lg
  },
  detailAutoPairCtaText: {
    color: colors.inverseText,
    fontFamily: fonts.cta,
    fontSize: 14,
    lineHeight: 18
  },
  detailCommentBox: {
    alignItems: "flex-start",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 92,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md
  },
  detailCommentInput: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 56,
    padding: 0,
    textAlignVertical: "top"
  },
  detailCommentPill: {
    backgroundColor: colors.surfaceTranslucent,
    borderRadius: radii.pill,
    bottom: spacing.md,
    left: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    position: "absolute",
    right: spacing.md
  },
  detailCommentText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 17
  },
  detailCommentSection: {
    gap: spacing.md,
    marginTop: spacing.xl
  },
  detailContent: {
    backgroundColor: colors.background
  },
  detailContentSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    gap: 0,
    marginTop: -28,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xl
  },
  detailCtaDock: {
    backgroundColor: colors.background,
    bottom: 0,
    flexDirection: "row",
    gap: spacing.sm,
    left: 0,
    paddingBottom: detailCtaDockBottomPadding,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    position: "absolute",
    right: 0,
    zIndex: 12
  },
  detailFactCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    flexBasis: "47.8%",
    flexGrow: 1,
    minHeight: 78,
    padding: spacing.md
  },
  detailFactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginTop: spacing.md
  },
  detailFactLabel: {
    color: colors.soft,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 0,
    lineHeight: 14
  },
  detailFactValue: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 17,
    lineHeight: 22,
    marginTop: spacing.sm
  },
  detailFactValueAction: {
    color: colors.text
  },
  detailHeaderBackButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    marginLeft: -6,
    width: 38
  },
  detailHeaderIconButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    position: "relative",
    width: 36
  },
  detailHeaderSearchBar: {
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
  detailHeaderSearchText: {
    color: colors.soft,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 18
  },
  detailHeroFrame: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: colors.imageSurface,
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    width: "100%"
  },
  detailHeroImage: {
    height: "100%",
    width: "100%"
  },
  detailHeroWishlistButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 0.5,
    bottom: spacing.xl + spacing.md,
    height: 48,
    justifyContent: "center",
    position: "absolute",
    right: spacing.screen,
    width: 48
  },
  detailIntro: {
    marginTop: 0
  },
  detailPieceCategory: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.xs
  },
  detailPieceTitle: {
    color: colors.text,
    flexShrink: 1,
    fontFamily: fonts.heading,
    fontSize: 22,
    lineHeight: 28
  },
  detailProductDetailsBlock: {
    marginTop: spacing.xl
  },
  detailPdpHeader: {
    backgroundColor: colors.background,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    elevation: 8,
    height: closetPdpHeaderHeight,
    justifyContent: "flex-end",
    left: 0,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.screen,
    paddingTop: appSearchHeaderTopPadding,
    position: "absolute",
    right: 0,
    shadowColor: "#000000",
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    top: 0,
    zIndex: 20
  },
  detailPdpHeaderRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    height: 44
  },
  detailPdpHeaderTitle: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18
  },
  detailSafeArea: {
    backgroundColor: colors.background,
    flex: 1
  },
  detailScreen: {
    backgroundColor: colors.background,
    flex: 1
  },
  detailSecondaryCta: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.button,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    height: 48,
    justifyContent: "center",
    paddingHorizontal: spacing.lg
  },
  detailSecondaryCtaText: {
    color: colors.text,
    fontFamily: fonts.cta,
    fontSize: 14,
    lineHeight: 18
  },
  detailSectionTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 23
  },
  detailTag: {
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  detailTagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.sm
  },
  detailTagText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 17
  },
  detailTagsBlock: {
    marginTop: spacing.xl
  },
  detailTitleEditButton: {
    alignItems: "center",
    height: 28,
    justifyContent: "center",
    width: 28
  },
  detailTitleRow: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
    maxWidth: "100%"
  },
  detailTopActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  detailTopBar: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md
  },
  filterCategoryTab: {
    alignItems: "center",
    gap: spacing.xs,
    justifyContent: "center",
    minWidth: 74,
    paddingBottom: spacing.xs
  },
  filterChipScroller: {
    marginHorizontal: -spacing.screen,
    marginTop: spacing.lg
  },
  filterChipRail: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.lg,
    paddingHorizontal: spacing.screen
  },
  filterChipText: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 17,
    maxWidth: 82,
    textAlign: "center"
  },
  filterChipTextSelected: {
    color: colors.text,
    fontFamily: fonts.heading
  },
  filterImage: {
    height: "100%",
    width: "100%"
  },
  filterImageShell: {
    alignItems: "center",
    backgroundColor: colors.imageSurface,
    borderColor: colors.border,
    borderRadius: 34,
    borderWidth: StyleSheet.hairlineWidth,
    height: 68,
    justifyContent: "center",
    overflow: "hidden",
    width: 68
  },
  filterImageShellSelected: {
    borderColor: colors.text,
    borderWidth: 2
  },
  filterChipSelected: {
    opacity: 1
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginTop: spacing.xl
  },
  pieceCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    flexBasis: "47.8%",
    flexGrow: 0,
    flexShrink: 0,
    overflow: "hidden"
  },
  pieceCategory: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 17,
    marginTop: 2
  },
  pieceCopy: {
    paddingVertical: spacing.md
  },
  pieceFavoriteButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    height: 32,
    justifyContent: "center",
    position: "absolute",
    right: spacing.sm,
    top: spacing.sm,
    width: 32,
    zIndex: 2
  },
  pieceImage: {
    height: "100%",
    width: "100%"
  },
  pieceMedia: {
    aspectRatio: 0.84,
    backgroundColor: colors.imageSurface,
    overflow: "hidden",
    position: "relative"
  },
  pieceTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 15,
    lineHeight: 19
  },
  pieceTextInset: {
    marginHorizontal: spacing.sm
  },
  photoLibraryAddedPill: {
    backgroundColor: colors.inverse,
    borderRadius: radii.pill,
    bottom: spacing.xs,
    left: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    position: "absolute"
  },
  photoLibraryAddedText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    lineHeight: 12
  },
  photoLibraryBottomBar: {
    backgroundColor: colors.background,
    paddingBottom: appBottomSafeInset + spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md
  },
  photoLibraryDoneButton: {
    alignItems: "center",
    backgroundColor: colors.inverse,
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  photoLibraryDoneButtonDisabled: {
    backgroundColor: colors.soft
  },
  photoLibraryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingBottom: spacing.lg
  },
  photoLibraryIconButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  photoLibraryImage: {
    backgroundColor: colors.imageSurface,
    height: "100%",
    width: "100%"
  },
  photoLibraryMessage: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    padding: spacing.xl,
    textAlign: "center",
    width: "100%"
  },
  photoLibraryPrimaryCta: {
    alignItems: "center",
    backgroundColor: colors.inverse,
    borderRadius: radii.button,
    height: 52,
    justifyContent: "center"
  },
  photoLibraryPrimaryCtaDisabled: {
    backgroundColor: colors.soft
  },
  photoLibraryPrimaryCtaText: {
    color: colors.inverseText,
    fontFamily: fonts.cta,
    fontSize: 16,
    lineHeight: 20
  },
  photoLibrarySafeArea: {
    backgroundColor: colors.background,
    flex: 1
  },
  photoLibrarySelectedBadge: {
    alignItems: "center",
    backgroundColor: colors.inverse,
    borderColor: colors.background,
    borderRadius: 13,
    borderWidth: 2,
    height: 26,
    justifyContent: "center",
    position: "absolute",
    right: spacing.xs,
    top: spacing.xs,
    width: 26
  },
  photoLibraryState: {
    alignItems: "center",
    flex: 1,
    gap: spacing.sm,
    justifyContent: "center",
    paddingHorizontal: spacing.xl
  },
  photoLibraryStateText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20
  },
  photoLibrarySubtitle: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
    textAlign: "center"
  },
  photoLibraryTile: {
    aspectRatio: 1,
    padding: 1,
    position: "relative",
    width: "33.3333%"
  },
  photoLibraryTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 23,
    textAlign: "center"
  },
  photoLibraryTitleBlock: {
    alignItems: "center",
    flex: 1,
    minWidth: 0
  },
  photoLibraryTopBar: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm
  },
  pressed: {
    opacity: 0.72
  },
  safeArea: {
    backgroundColor: colors.surfaceTertiary,
    flex: 1
  },
  screen: {
    backgroundColor: colors.surfaceTertiary,
    flex: 1
  },
  searchBar: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    flexDirection: "row",
    gap: spacing.sm,
    height: 48,
    paddingHorizontal: spacing.md
  },
  searchInput: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    height: 42,
    includeFontPadding: false,
    lineHeight: 20,
    minWidth: 0,
    padding: 0
  },
  searchRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  stickySearchHost: {
    backgroundColor: colors.surfaceTertiary,
    borderBottomWidth: 0,
    elevation: 0,
    marginBottom: -1,
    marginHorizontal: -spacing.screen,
    marginTop: spacing.xl,
    paddingBottom: 1,
    paddingHorizontal: spacing.screen,
    shadowOpacity: 0,
    zIndex: 4
  },
  tag: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    flexShrink: 0,
    justifyContent: "center",
    minHeight: 26,
    paddingHorizontal: 5
  },
  tagFirst: {
    marginLeft: spacing.sm
  },
  tagLast: {
    marginRight: spacing.sm
  },
  tagRow: {
    marginTop: spacing.md,
    width: "100%"
  },
  tagRowContent: {
    alignItems: "center",
    gap: 3
  },
  tagText: {
    color: colors.muted,
    fontFamily: fonts.body,
    includeFontPadding: false,
    fontSize: 11,
    lineHeight: 13,
    textAlign: "center"
  },
  toolbar: {
    flexDirection: "row",
    flexShrink: 0,
    gap: spacing.sm,
    position: "relative",
    zIndex: 5
  },
  toolbarButton: {
    alignItems: "center",
    borderRadius: radii.button,
    flexDirection: "row",
    gap: spacing.xs,
    height: 48,
    justifyContent: "center",
    paddingHorizontal: spacing.lg
  },
  toolbarButtonPrimary: {
    backgroundColor: colors.inverse
  },
  toolbarButtonSecondary: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth
  },
  toolbarButtonText: {
    color: colors.text,
    fontFamily: fonts.cta,
    fontSize: 14,
    lineHeight: 18
  },
  toolbarButtonTextPrimary: {
    color: colors.inverseText
  }
});
