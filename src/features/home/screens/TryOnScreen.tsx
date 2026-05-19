import { Feather } from "@expo/vector-icons";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View
} from "react-native";
import Svg, { Path } from "react-native-svg";

import { PhotoUploadBox } from "../../onboarding/components/PhotoUploadBox";
import type { OnboardingDraft } from "../../onboarding/viewModels/useOnboardingViewModel";
import { colors, fonts, spacing } from "../../../theme";
import {
  ProductListingScreen,
  type ProductListingProduct
} from "../components/ProductListingScreen";
import {
  buildLookPieces,
  getPieceAlternatives,
  getRupeeValue,
  getTryOnPriceSummary,
  type LookPiece
} from "../data/lookPieces";
import { prototypeProductImages } from "../data/prototypeProductImages";
import type { OutfitPieceKind, ProductLook } from "./HomeScreen";

type TryOnScreenProps = {
  cartCount?: number;
  draft: OnboardingDraft;
  initialIsSaved?: boolean;
  initialPieces?: LookPiece[];
  isCreatingLook?: boolean;
  look?: ProductLook;
  onCartUpdated?: (pieceCount: number) => void;
  onClose?: (state: TryOnExitState) => void;
  onContinueBrowsing?: (state: TryOnExitState) => void;
  onOpenProduct?: (product: ProductListingProduct) => void;
  onOpenShopLook?: (state: TryOnExitState) => void;
  onSelectPhoto: (uri: string) => void;
  onViewCart?: (state: TryOnExitState) => void;
};

export type TryOnExitState = {
  addedPieceCount: number;
  isSaved: boolean;
  pieces: LookPiece[];
};

type ShopThisLookScreenProps = {
  look?: ProductLook;
  onAddPieceToCart: (piece: LookPiece, size: string) => void;
  onBack: () => void;
  onOpenProduct?: (product: ProductListingProduct) => void;
  onViewCart?: () => void;
  pieces: LookPiece[];
};
type BuildSlotKind = Extract<
  OutfitPieceKind,
  "bag" | "bottom" | "jacket" | "shoe" | "top"
>;
type BuildSlotConfig = {
  kind: BuildSlotKind;
  label: string;
  listingTitle: string;
};
type BuildListingOption = {
  piece: LookPiece;
  product: ProductListingProduct;
};

const topSafeInset =
  Platform.OS === "ios" ? 44 : NativeStatusBar.currentHeight ?? 0;
const bottomSafeInset = Platform.OS === "ios" ? 22 : 0;
export const TRY_ON_RENDER_DELAY_MS = 6500;
const avatarCreationImage = require("../../../../Images/imagewithoutbg.png");
const tryOnModelImage = require("../../../../Images/modelwithoutbg.png");
const shopThisLookImages = {
  brownShoes: Image.resolveAssetSource(
    require("../../../../Images/brownshoes.jpg")
  ).uri,
  yellowPants: Image.resolveAssetSource(
    require("../../../../Images/yellow pants.jpg")
  ).uri,
  yellowTop: Image.resolveAssetSource(
    require("../../../../Images/yellow top.jpg")
  ).uri
};

const fallbackLook: ProductLook = {
  brand: "Trends",
  id: "try-on-default-look",
  image: prototypeProductImages.sandro.navyTailoredSet,
  itemCount: "3 pieces",
  match: "Try now",
  outfitItems: [
    {
      image: prototypeProductImages.sandro.whitePinstripeSuit,
      kind: "top",
      label: "Top"
    },
    {
      image: prototypeProductImages.maje.blueScarfTrousers,
      kind: "bottom",
      label: "Trousers"
    },
    {
      image: prototypeProductImages.sandro.brownJacket,
      kind: "shoe",
      label: "Shoes"
    }
  ],
  price: "From ₹5,598",
  title: "Linen city set",
  tries: "1.2k tries",
  vibe: "Work"
};

const buildSlots: BuildSlotConfig[] = [
  { kind: "top", label: "Top", listingTitle: "Choose top" },
  { kind: "bottom", label: "Bottom", listingTitle: "Choose bottom" },
  { kind: "shoe", label: "Footwear", listingTitle: "Choose footwear" },
  { kind: "bag", label: "Bag", listingTitle: "Choose bag" },
  { kind: "jacket", label: "Layer", listingTitle: "Choose layer" }
];

function getBuildSlotLabel(kind: BuildSlotKind) {
  return buildSlots.find((slot) => slot.kind === kind)?.label ?? "Piece";
}

function getBuildSlotPiece(pieces: LookPiece[], kind: BuildSlotKind) {
  return pieces.find((piece) => piece.kind === kind);
}

function getBuildListingOptions({
  kind,
  pieces,
  stylePrompt
}: {
  kind: BuildSlotKind;
  pieces: LookPiece[];
  stylePrompt: string;
}): BuildListingOption[] {
  const currentPiece = getBuildSlotPiece(pieces, kind);
  const alternatives = getPieceAlternatives(kind);
  const listingContext = stylePrompt.trim() || "Build your look";
  const uniquePieces = [...(currentPiece ? [currentPiece] : []), ...alternatives]
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
    product: {
      ...getPieceProduct(piece),
      id: `build-${kind}-${piece.id}-${index}`,
      match: index === 0 && currentPiece ? "Current look" : "Try now",
      occasion: listingContext,
      styleLabel: getBuildSlotLabel(kind),
      tries: index === 0 && currentPiece ? "Worn now" : "Try now",
      vibe: listingContext
    }
  }));
}

function replaceBuildSlotPiece(
  pieces: LookPiece[],
  kind: BuildSlotKind,
  selectedPiece: LookPiece
) {
  const existingPiece = getBuildSlotPiece(pieces, kind);
  const nextPiece = {
    ...selectedPiece,
    id: existingPiece?.id ?? `${kind}-${pieces.length}`,
    kind
  };

  if (existingPiece) {
    return pieces.map((piece) =>
      piece.id === existingPiece.id ? nextPiece : piece
    );
  }

  return [...pieces, nextPiece];
}

function removeBuildSlotPiece(pieces: LookPiece[], kind: BuildSlotKind) {
  return pieces.filter((piece) => piece.kind !== kind);
}

function isSameBuildPiece(firstPiece: LookPiece, secondPiece: LookPiece) {
  return (
    firstPiece.kind === secondPiece.kind &&
    firstPiece.image === secondPiece.image &&
    firstPiece.name === secondPiece.name
  );
}

function getBuildSlotCarouselPieces(kind: BuildSlotKind, piece?: LookPiece) {
  const alternatives = getPieceAlternatives(kind).filter(
    (candidate, index, allCandidates) =>
      allCandidates.findIndex((item) => isSameBuildPiece(item, candidate)) ===
      index
  );

  if (!piece) {
    return alternatives.slice(0, 3);
  }

  const currentIndex = alternatives.findIndex((candidate) =>
    isSameBuildPiece(candidate, piece)
  );

  if (currentIndex >= 0 && currentIndex < 3) {
    return alternatives.slice(0, 3);
  }

  return [
    piece,
    ...alternatives
      .filter((candidate) => !isSameBuildPiece(candidate, piece))
      .slice(0, 2)
  ];
}

function ShuffleIcon() {
  return (
    <Svg fill="none" height={16} viewBox="0 0 16 16" width={16}>
      <Path
        d="M5.85 0.854009C5.94108 0.759708 5.99148 0.633407 5.99034 0.502308C5.9892 0.37121 5.93661 0.245804 5.84391 0.153099C5.75121 0.0603954 5.6258 0.00781094 5.4947 0.00667173C5.3636 0.00553252 5.2373 0.0559297 5.143 0.147009L2.143 3.14701C2.04926 3.24077 1.99661 3.36793 1.99661 3.50051C1.99661 3.63309 2.04926 3.76025 2.143 3.85401L5.143 6.85401C5.2373 6.94509 5.3636 6.99548 5.4947 6.99435C5.6258 6.99321 5.75121 6.94062 5.84391 6.84792C5.93661 6.75521 5.9892 6.62981 5.99034 6.49871C5.99148 6.36761 5.94108 6.24131 5.85 6.14701L3.7 3.99701H11.49C12.153 3.99701 12.7889 4.2604 13.2578 4.72924C13.7266 5.19808 13.99 5.83397 13.99 6.49701V8.49701C13.99 8.62962 14.0427 8.75679 14.1364 8.85056C14.2302 8.94433 14.3574 8.99701 14.49 8.99701C14.6226 8.99701 14.7498 8.94433 14.8436 8.85056C14.9373 8.75679 14.99 8.62962 14.99 8.49701V6.49701C14.99 4.56701 13.42 2.99701 11.49 2.99701H3.7L5.85 0.847009V0.854009ZM2 7.50001C2 7.3674 1.94732 7.24022 1.85355 7.14646C1.75979 7.05269 1.63261 7.00001 1.5 7.00001C1.36739 7.00001 1.24021 7.05269 1.14645 7.14646C1.05268 7.24022 1 7.3674 1 7.50001V9.50001C1 11.43 2.57 13 4.5 13H12.29L10.14 15.15C10.0489 15.2443 9.99852 15.3706 9.99966 15.5017C10.0008 15.6328 10.0534 15.7582 10.1461 15.8509C10.2388 15.9436 10.3642 15.9962 10.4953 15.9973C10.6264 15.9985 10.7527 15.9481 10.847 15.857L13.847 12.857C13.9407 12.7632 13.9934 12.6361 13.9934 12.5035C13.9934 12.3709 13.9407 12.2438 13.847 12.15L10.847 9.15001C10.7527 9.05893 10.6264 9.00853 10.4953 9.00967C10.3642 9.01081 10.2388 9.0634 10.1461 9.1561C10.0534 9.2488 10.0008 9.37421 9.99966 9.50531C9.99852 9.63641 10.0489 9.76271 10.14 9.85701L12.29 12.007H4.5C3.83696 12.007 3.20107 11.7436 2.73223 11.2748C2.26339 10.8059 2 10.17 2 9.50701V7.50701V7.50001Z"
        fill={colors.text}
      />
    </Svg>
  );
}

function TryOnTopBar({
  lookName,
  onClose
}: {
  lookName: string;
  onClose?: () => void;
}) {
  return (
    <View style={styles.topBar}>
      <Pressable
        accessibilityLabel="Close try-on"
        accessibilityRole="button"
        onPress={onClose}
        style={({ pressed }) => [
          styles.topIconButton,
          pressed ? styles.pressed : null
        ]}
      >
        <Feather color={colors.text} name="x" size={21} />
      </Pressable>

      <Text numberOfLines={1} style={styles.topTitle}>
        {lookName}
      </Text>

      <Pressable
        accessibilityLabel="Share try-on"
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.topIconButton,
          pressed ? styles.pressed : null
        ]}
      >
        <Feather color={colors.text} name="share-2" size={19} />
      </Pressable>
    </View>
  );
}

function LoadingRing({ progress }: { progress: Animated.Value }) {
  const rotation = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"]
  });

  return (
    <Animated.View
      style={[styles.loadingRing, { transform: [{ rotate: rotation }] }]}
    />
  );
}

function AvatarCreationLoadingScreen({
  imageHeight,
  onClose,
  onContinueBrowsing
}: {
  imageHeight: number;
  onClose?: () => void;
  onContinueBrowsing?: () => void;
}) {
  return (
    <View style={styles.creationScreen}>
      <ExpoStatusBar style="dark" />
      <View style={styles.creationTopBar}>
        <Pressable
          accessibilityLabel="Close avatar creation"
          accessibilityRole="button"
          hitSlop={10}
          onPress={onClose}
          style={({ pressed }) => [
            styles.creationCloseButton,
            pressed ? styles.pressed : null
          ]}
        >
          <Feather color={colors.text} name="x" size={22} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.creationContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.creationImageFrame, { height: imageHeight }]}>
          <Image
            resizeMode="contain"
            source={avatarCreationImage}
            style={styles.creationImage}
          />
        </View>

        <View style={styles.creationCopyBlock}>
          <Text style={styles.creationTitle}>Creating your look</Text>
          <Text style={styles.creationCopy}>
            We're rendering this outfit on your avatar. Usually takes under a
            minute.
          </Text>
          <Text style={styles.creationBrowseCopy}>
            You can keep browsing — we'll notify you when it's ready.
          </Text>
          <Pressable
            accessibilityLabel="Continue browsing while your look is created"
            accessibilityRole="button"
            onPress={onContinueBrowsing}
            style={({ pressed }) => [
              styles.creationBrowseButton,
              pressed ? styles.pressed : null
            ]}
          >
            <Text style={styles.creationBrowseButtonText}>
              Continue browsing
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function PieceCard({
  onPress,
  piece
}: {
  onPress: () => void;
  piece: LookPiece;
}) {
  return (
    <Pressable
      accessibilityLabel={`${piece.name}${piece.isOwned ? ", yours" : ""}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.pieceCard,
        pressed ? styles.pressed : null
      ]}
    >
      <View style={styles.pieceImageWrap}>
        <Image
          resizeMode="cover"
          source={{ uri: piece.image }}
          style={styles.pieceImage}
        />
        {piece.isOwned ? (
          <View style={styles.yoursTag}>
            <Text style={styles.yoursTagText}>Yours</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

function getPieceProduct(piece: LookPiece): ProductListingProduct {
  return {
    brand: piece.brand,
    id: `try-on-piece-${piece.id}`,
    image: piece.image,
    price: piece.price,
    priceValue: getRupeeValue(piece.price),
    sizeOptions: piece.sizes,
    styleLabel: piece.category,
    title: piece.name,
    vibe: piece.category
  };
}

function getShopThisLookPieces(pieces: LookPiece[]): LookPiece[] {
  const templates: Array<
    Pick<
      LookPiece,
      "brand" | "category" | "image" | "kind" | "name" | "price" | "sizes"
    >
  > = [
    {
      brand: "Sandro",
      category: "Top",
      image: shopThisLookImages.yellowTop,
      kind: "top",
      name: "Scallop knit crop top",
      price: "₹1,499",
      sizes: ["XS", "S", "M", "L"]
    },
    {
      brand: "Sandro",
      category: "Bottoms",
      image: shopThisLookImages.yellowPants,
      kind: "bottom",
      name: "Printed wide-leg trousers",
      price: "₹3,299",
      sizes: ["26", "28", "30", "32"]
    },
    {
      brand: "Sandro",
      category: "Shoes",
      image: shopThisLookImages.brownShoes,
      kind: "shoe",
      name: "Brown city loafers",
      price: "₹2,299",
      sizes: ["37", "38", "39", "40"]
    }
  ];

  return templates.map((template, index) => {
    const existingPiece = pieces.find((piece) => piece.kind === template.kind);

    return {
      ...template,
      id: existingPiece?.id ? `shop-${existingPiece.id}` : `shop-${index}`,
      isOwned: false
    };
  });
}

function AlternativeSheet({
  onClose,
  onTryAlternative,
  piece
}: {
  onClose: () => void;
  onTryAlternative: (piece: LookPiece) => void;
  piece: LookPiece;
}) {
  const alternatives = getPieceAlternatives(piece.kind);

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible>
      <View style={styles.modalRoot}>
        <Pressable
          accessibilityLabel="Close swap options"
          accessibilityRole="button"
          onPress={onClose}
          style={styles.modalScrim}
        />
        <View style={styles.swapSheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>Swap {piece.category.toLowerCase()}</Text>
              <Text style={styles.sheetSubtitle}>
                Keep the rest of the look in place.
              </Text>
            </View>
            <Pressable
              accessibilityLabel="Close swap options"
              accessibilityRole="button"
              onPress={onClose}
              style={({ pressed }) => [
                styles.sheetCloseButton,
                pressed ? styles.pressed : null
              ]}
            >
              <Feather color={colors.text} name="x" size={20} />
            </Pressable>
          </View>

          <ScrollView
            horizontal
            contentContainerStyle={styles.alternativeTrack}
            showsHorizontalScrollIndicator={false}
          >
            {alternatives.map((alternative) => (
              <Pressable
                accessibilityLabel={`Try ${alternative.name}`}
                accessibilityRole="button"
                key={alternative.id}
                onPress={() => onTryAlternative(alternative)}
                style={({ pressed }) => [
                  styles.alternativeCard,
                  pressed ? styles.pressed : null
                ]}
              >
                <Image
                  resizeMode="cover"
                  source={{ uri: alternative.image }}
                  style={styles.alternativeImage}
                />
                <View style={styles.alternativeInfo}>
                  <Text numberOfLines={1} style={styles.alternativeName}>
                    {alternative.name}
                  </Text>
                  <Text style={styles.alternativePrice}>
                    {alternative.isOwned ? "From your wardrobe" : alternative.price}
                  </Text>
                  <View style={styles.tryThisPill}>
                    <Text style={styles.tryThisText}>Try this</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function SizePickerSheet({
  onClose,
  onSelectSize,
  piece
}: {
  onClose: () => void;
  onSelectSize: (size: string) => void;
  piece: LookPiece;
}) {
  const sizes = piece.sizes.length > 0 ? piece.sizes : ["XS", "S", "M", "L"];
  const recommendedSize = sizes[0];

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible>
      <View style={styles.modalRoot}>
        <Pressable
          accessibilityLabel="Close size options"
          accessibilityRole="button"
          onPress={onClose}
          style={styles.modalScrim}
        />
        <View style={styles.sizeSheet}>
          <View style={styles.sheetHandle} />
          <Text numberOfLines={1} style={styles.sizeProductName}>
            {piece.name}
          </Text>

          <View style={styles.sizeMetaRow}>
            <Text style={styles.sizeRecommendedLabel}>
              Recommended size: {recommendedSize}
            </Text>
            <Pressable
              accessibilityLabel="Open size guide"
              accessibilityRole="button"
              onPress={() => undefined}
              style={({ pressed }) => [
                styles.sizeGuideButton,
                pressed ? styles.pressed : null
              ]}
            >
              <Text style={styles.sizeGuideText}>Size guide</Text>
            </Pressable>
          </View>

          <View style={styles.sizeInlineRow}>
            {sizes.map((size) => (
              <Pressable
                accessibilityLabel={
                  size === recommendedSize
                    ? `${size}, recommended`
                    : `Select size ${size}`
                }
                accessibilityRole="button"
                key={size}
                onPress={() => onSelectSize(size)}
                style={({ pressed }) => [
                  styles.sizeTapTarget,
                  pressed ? styles.pressed : null
                ]}
              >
                <Text style={styles.sizeOptionText}>{size}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

function BuildSlotCard({
  kind,
  label,
  onClear,
  onPress,
  onSelectPiece,
  piece
}: {
  kind: BuildSlotKind;
  label: string;
  onClear: (kind: BuildSlotKind) => void;
  onPress: (kind: BuildSlotKind) => void;
  onSelectPiece: (kind: BuildSlotKind, piece: LookPiece) => void;
  piece?: LookPiece;
}) {
  const imageScrollRef = useRef<ScrollView | null>(null);
  const carouselPieces = useMemo(
    () => getBuildSlotCarouselPieces(kind, piece),
    [kind, piece]
  );
  const selectedIndex = Math.max(
    0,
    carouselPieces.findIndex(
      (carouselPiece) => piece && isSameBuildPiece(carouselPiece, piece)
    )
  );
  const [frameWidth, setFrameWidth] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(selectedIndex);

  useEffect(() => {
    setActiveImageIndex(selectedIndex);

    if (frameWidth > 0) {
      imageScrollRef.current?.scrollTo({
        animated: false,
        x: selectedIndex * frameWidth,
        y: 0
      });
    }
  }, [frameWidth, selectedIndex]);

  const handleCarouselScrollEnd = (event: {
    nativeEvent: { contentOffset: { x: number } };
  }) => {
    if (frameWidth <= 0) {
      return;
    }

    const nextIndex = Math.max(
      0,
      Math.min(
        Math.round(event.nativeEvent.contentOffset.x / frameWidth),
        carouselPieces.length - 1
      )
    );
    const nextPiece = carouselPieces[nextIndex];

    setActiveImageIndex(nextIndex);

    if (nextPiece && (!piece || !isSameBuildPiece(nextPiece, piece))) {
      onSelectPiece(kind, nextPiece);
    }
  };

  return (
    <Pressable
      accessibilityLabel={piece ? `Change ${label}` : `Add ${label}`}
      accessibilityRole="button"
      onPress={() => onPress(kind)}
      style={({ pressed }) => [
        styles.buildSlot,
        pressed ? styles.pressed : null
      ]}
    >
      <View
        onLayout={(event) => {
          setFrameWidth(event.nativeEvent.layout.width);
        }}
        style={[
          styles.buildSlotFrame,
          !piece ? styles.buildSlotFrameEmpty : null
        ]}
      >
        {piece ? (
          <>
            <ScrollView
              bounces={false}
              decelerationRate="fast"
              horizontal
              nestedScrollEnabled
              onMomentumScrollEnd={handleCarouselScrollEnd}
              pagingEnabled
              ref={imageScrollRef}
              scrollEventThrottle={16}
              showsHorizontalScrollIndicator={false}
              style={styles.buildSlotCarousel}
            >
              {carouselPieces.map((carouselPiece) => (
                <Image
                  key={`${kind}-${carouselPiece.id}-${carouselPiece.image}`}
                  resizeMode="cover"
                  source={{ uri: carouselPiece.image }}
                  style={[
                    styles.buildSlotImage,
                    { width: Math.max(frameWidth, 1) }
                  ]}
                />
              ))}
            </ScrollView>
            <Pressable
              accessibilityLabel={`Remove ${label}`}
              accessibilityRole="button"
              hitSlop={8}
              onPress={(event) => {
                event.stopPropagation();
                onClear(kind);
              }}
              style={({ pressed }) => [
                styles.buildSlotRemove,
                pressed ? styles.pressed : null
              ]}
            >
              <Feather color={colors.soft} name="x" size={21} />
            </Pressable>
            <View style={styles.buildSlotDots}>
              {carouselPieces.map((carouselPiece, index) => (
                <View
                  key={`${kind}-${carouselPiece.id}-dot`}
                  style={[
                    styles.buildSlotDot,
                    index === activeImageIndex
                      ? styles.buildSlotDotActive
                      : null
                  ]}
                />
              ))}
            </View>
          </>
        ) : (
          <View style={styles.buildSlotEmptyContent}>
            <View style={styles.buildSlotPlus}>
              <Feather color={colors.soft} name="plus" size={24} />
            </View>
            <Text style={styles.buildSlotEmptyText}>
              Add {label.toLowerCase()}
            </Text>
          </View>
        )}
      </View>

      <Text numberOfLines={1} style={styles.buildSlotLabel}>
        {label}
      </Text>
    </Pressable>
  );
}

function BuildLookScreen({
  onClearSlot,
  onGenerate,
  onGoBack,
  onOpenCategory,
  onSelectPiece,
  onShuffle,
  onStylePromptChange,
  pieces,
  stylePrompt
}: {
  onClearSlot: (kind: BuildSlotKind) => void;
  onGenerate: () => void;
  onGoBack: () => void;
  onOpenCategory: (kind: BuildSlotKind) => void;
  onSelectPiece: (kind: BuildSlotKind, piece: LookPiece) => void;
  onShuffle: () => void;
  onStylePromptChange: (prompt: string) => void;
  pieces: LookPiece[];
  stylePrompt: string;
}) {
  return (
    <View style={styles.buildScreen}>
      <ExpoStatusBar style="dark" />
      <View style={styles.buildTopBar}>
        <Pressable
          accessibilityLabel="Back to try-on"
          accessibilityRole="button"
          onPress={onGoBack}
          style={({ pressed }) => [
            styles.buildTopIconButton,
            pressed ? styles.pressed : null
          ]}
        >
          <Feather color={colors.text} name="chevron-left" size={24} />
        </Pressable>

        <Text numberOfLines={1} style={styles.buildTitle}>
          Build your look
        </Text>

        <Pressable
          accessibilityLabel="Shuffle look"
          accessibilityRole="button"
          onPress={onShuffle}
          style={({ pressed }) => [
            styles.buildTopIconButton,
            pressed ? styles.pressed : null
          ]}
        >
          <ShuffleIcon />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.buildContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.buildGrid}>
          {buildSlots.map((slot) => (
            <BuildSlotCard
              key={slot.kind}
              kind={slot.kind}
              label={slot.label}
              onClear={onClearSlot}
              onPress={onOpenCategory}
              onSelectPiece={onSelectPiece}
              piece={getBuildSlotPiece(pieces, slot.kind)}
            />
          ))}
        </View>

        <View style={styles.buildPromptBlock}>
          <Text style={styles.buildPromptLabel}>
            Notes on how you want the avatar to be
          </Text>
          <TextInput
            accessibilityLabel="Describe how to generate this look"
            multiline
            onChangeText={onStylePromptChange}
            placeholder="Shirt should tucked in"
            placeholderTextColor={colors.soft}
            returnKeyType="done"
            style={styles.buildPromptInput}
            value={stylePrompt}
          />
        </View>
      </ScrollView>

      <View style={styles.buildGenerateShell}>
        <Pressable
          accessibilityLabel="Generate look"
          accessibilityRole="button"
          onPress={onGenerate}
          style={({ pressed }) => [
            styles.buildGenerateButton,
            pressed ? styles.pressed : null
          ]}
        >
          <Text style={styles.buildGenerateText}>Generate Look</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function ShopThisLookScreen({
  look,
  onAddPieceToCart,
  onBack,
  onOpenProduct,
  onViewCart,
  pieces
}: ShopThisLookScreenProps) {
  const { width } = useWindowDimensions();
  const activeLook = look ?? fallbackLook;
  const buyablePieces = useMemo(() => getShopThisLookPieces(pieces), [pieces]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sizePiece, setSizePiece] = useState<LookPiece | null>(null);
  const [addedMessage, setAddedMessage] = useState("");
  const cardWidth = Math.min(width - spacing.screen * 4, 306);
  const cardGap = spacing.lg;
  const sideInset = Math.max(spacing.screen, (width - cardWidth) / 2);
  const activePiece = buyablePieces[activeIndex] ?? buyablePieces[0];

  const handleScrollEnd = (event: {
    nativeEvent: { contentOffset: { x: number } };
  }) => {
    const nextIndex = Math.round(
      event.nativeEvent.contentOffset.x / (cardWidth + cardGap)
    );

    setActiveIndex(
      Math.max(0, Math.min(nextIndex, Math.max(buyablePieces.length - 1, 0)))
    );
  };

  const handleSelectSize = (size: string) => {
    if (!sizePiece) {
      return;
    }

    onAddPieceToCart(sizePiece, size);
    setAddedMessage(`${sizePiece.name} · ${size} added to cart`);
    setSizePiece(null);
  };

  return (
    <View style={styles.shopScreen}>
      <ExpoStatusBar style="dark" />
      <View style={styles.shopTopBar}>
        <Pressable
          accessibilityLabel="Back to try-on"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onBack}
          style={({ pressed }) => [
            styles.shopHeaderBackButton,
            pressed ? styles.pressed : null
          ]}
        >
          <Feather color={colors.text} name="chevron-left" size={30} />
        </Pressable>

        <Text numberOfLines={1} style={styles.shopTopTitle}>
          Shop this look
        </Text>

        <Pressable
          accessibilityLabel="View cart"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onViewCart}
          style={({ pressed }) => [
            styles.shopHeaderIconButton,
            pressed ? styles.pressed : null
          ]}
        >
          <Feather color={colors.text} name="shopping-cart" size={24} />
        </Pressable>
      </View>

      <View style={styles.shopIntro}>
        <Text style={styles.shopTitle}>{activeLook.title}</Text>
        <Text style={styles.shopEyebrow}>
          {buyablePieces.length} new{" "}
          {buyablePieces.length === 1 ? "piece" : "pieces"}
        </Text>
      </View>

      {buyablePieces.length > 0 ? (
        <View style={styles.shopCarouselBlock}>
          <ScrollView
            contentContainerStyle={[
              styles.shopCarousel,
              { gap: cardGap, paddingHorizontal: sideInset }
            ]}
            decelerationRate="fast"
            horizontal
            onMomentumScrollEnd={handleScrollEnd}
            showsHorizontalScrollIndicator={false}
            snapToAlignment="start"
            snapToInterval={cardWidth + cardGap}
          >
            {buyablePieces.map((piece) => (
              <Pressable
                accessibilityLabel={`Open ${piece.name}`}
                accessibilityRole="button"
                key={piece.id}
                onPress={() => onOpenProduct?.(getPieceProduct(piece))}
                style={({ pressed }) => [
                  styles.shopProductCard,
                  { width: cardWidth },
                  pressed ? styles.pressed : null
                ]}
              >
                <View style={styles.shopProductImageWrap}>
                  <Image
                    resizeMode="cover"
                    source={{ uri: piece.image }}
                    style={styles.shopProductImage}
                  />
                </View>
                <View style={styles.shopPagination}>
                  {buyablePieces.map((dotPiece, index) => (
                    <View
                      key={`${piece.id}-${dotPiece.id}-dot`}
                      style={[
                        styles.shopCardDot,
                        index === activeIndex ? styles.shopCardDotActive : null
                      ]}
                    />
                  ))}
                </View>
                <View style={styles.shopProductCopy}>
                  <Text numberOfLines={1} style={styles.shopProductBrand}>
                    {piece.brand}
                  </Text>
                  <Text numberOfLines={2} style={styles.shopProductName}>
                    {piece.name}
                  </Text>
                  <Text style={styles.shopProductPrice}>{piece.price}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.shopEmptyState}>
          <Text style={styles.shopEmptyTitle}>No new pieces to add</Text>
          <Text style={styles.shopEmptyCopy}>
            This look is already built from your wardrobe.
          </Text>
        </View>
      )}

      <View style={styles.shopActionShell}>
        <View style={styles.shopActionBar}>
          <Pressable
            accessibilityLabel={
              activePiece ? `Add ${activePiece.name}` : "Add product"
            }
            accessibilityRole="button"
            disabled={!activePiece}
            onPress={() => activePiece && setSizePiece(activePiece)}
            style={({ pressed }) => [
              styles.sessionActionButton,
              styles.addCartButton,
              !activePiece ? styles.actionButtonDisabled : null,
              pressed ? styles.pressed : null
            ]}
          >
            <Text style={styles.addCartText}>Add</Text>
          </Pressable>
        </View>
      </View>

      {addedMessage ? (
        <View style={styles.shopToast}>
          <Text numberOfLines={2} style={styles.shopToastText}>
            {addedMessage}
          </Text>
          <Pressable
            accessibilityLabel="View cart"
            accessibilityRole="button"
            onPress={onViewCart}
            style={({ pressed }) => [
              styles.shopToastAction,
              pressed ? styles.pressed : null
            ]}
          >
            <Text style={styles.shopToastActionText}>View</Text>
          </Pressable>
          <Pressable
            accessibilityLabel="Dismiss cart confirmation"
            accessibilityRole="button"
            onPress={() => setAddedMessage("")}
            style={({ pressed }) => [
              styles.shopToastClose,
              pressed ? styles.pressed : null
            ]}
          >
            <Feather color={colors.text} name="x" size={18} />
          </Pressable>
        </View>
      ) : null}

      {sizePiece ? (
        <SizePickerSheet
          onClose={() => setSizePiece(null)}
          onSelectSize={handleSelectSize}
          piece={sizePiece}
        />
      ) : null}
    </View>
  );
}

export function TryOnScreen({
  draft,
  initialIsSaved = false,
  initialPieces,
  isCreatingLook = false,
  look,
  onCartUpdated,
  onClose,
  onContinueBrowsing,
  onOpenProduct,
  onOpenShopLook,
  onSelectPhoto,
  onViewCart
}: TryOnScreenProps) {
  const activeLook = look ?? fallbackLook;
  const avatarUri = draft.avatarUri ?? draft.fullBodyPhotoUri;
  const hasAvatar = Boolean(avatarUri);
  const [pieces, setPieces] = useState<LookPiece[]>(() =>
    initialPieces && initialPieces.length > 0
      ? initialPieces
      : buildLookPieces(activeLook)
  );
  const [selectedPieceId, setSelectedPieceId] = useState(
    pieces[0]?.id ?? ""
  );
  const [swapPiece, setSwapPiece] = useState<LookPiece | null>(null);
  const [isSaved] = useState(initialIsSaved);
  const [isPiecePanelOpen, setIsPiecePanelOpen] = useState(false);
  const [isPiecePanelVisible, setIsPiecePanelVisible] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isCartToastVisible, setIsCartToastVisible] = useState(false);
  const [addedPieceCount, setAddedPieceCount] = useState(0);
  const [isBuildLookOpen, setIsBuildLookOpen] = useState(false);
  const [activeBuildCategory, setActiveBuildCategory] =
    useState<BuildSlotKind | null>(null);
  const [buildStylePrompt, setBuildStylePrompt] = useState("");
  const spinnerProgress = useRef(new Animated.Value(0)).current;
  const breatheProgress = useRef(new Animated.Value(0)).current;
  const piecePanelProgress = useRef(new Animated.Value(0)).current;
  const { height } = useWindowDimensions();
  const creationImageHeight = Math.max(
    320,
    Math.min(Math.round(height * 0.54), 500)
  );
  const priceSummary = useMemo(() => getTryOnPriceSummary(pieces), [pieces]);
  const mediaSlides = useMemo(
    () => [
      {
        accessibilityLabel: `${activeLook.title} try-on image`,
        id: "image",
        isVideo: false
      },
      {
        accessibilityLabel: `${activeLook.title} try-on video preview`,
        id: "video",
        isVideo: true
      }
    ],
    [activeLook.title]
  );
  const activeMediaSlide = mediaSlides[activeMediaIndex] ?? mediaSlides[0];

  useEffect(() => {
    const nextPieces =
      initialPieces && initialPieces.length > 0
        ? initialPieces
        : buildLookPieces(activeLook);

    setPieces(nextPieces);
    setSelectedPieceId(nextPieces[0]?.id ?? "");
    setActiveMediaIndex(0);
    setIsPiecePanelOpen(false);
    setIsPiecePanelVisible(false);
    setIsBuildLookOpen(false);
    setActiveBuildCategory(null);
    setBuildStylePrompt("");
    piecePanelProgress.setValue(0);
  }, [activeLook, initialPieces, piecePanelProgress]);

  useEffect(() => {
    if (isPiecePanelOpen) {
      setIsPiecePanelVisible(true);
    }

    const panelAnimation = Animated.timing(piecePanelProgress, {
      duration: 340,
      easing: Easing.out(Easing.cubic),
      toValue: isPiecePanelOpen ? 1 : 0,
      useNativeDriver: true
    });

    panelAnimation.start(({ finished }) => {
      if (finished && !isPiecePanelOpen) {
        setIsPiecePanelVisible(false);
      }
    });

    return () => {
      panelAnimation.stop();
    };
  }, [isPiecePanelOpen, piecePanelProgress]);

  useEffect(() => {
    if (!isRendering) {
      return undefined;
    }

    spinnerProgress.setValue(0);
    const spinnerLoop = Animated.loop(
      Animated.timing(spinnerProgress, {
        duration: 900,
        easing: Easing.linear,
        toValue: 1,
        useNativeDriver: true
      })
    );

    spinnerLoop.start();

    return () => {
      spinnerLoop.stop();
    };
  }, [isRendering, spinnerProgress]);

  useEffect(() => {
    if (isCreatingLook || isRendering || !hasAvatar) {
      return undefined;
    }

    const breatheLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheProgress, {
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          toValue: 1,
          useNativeDriver: true
        }),
        Animated.timing(breatheProgress, {
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          toValue: 0,
          useNativeDriver: true
        })
      ])
    );

    breatheLoop.start();

    return () => {
      breatheLoop.stop();
    };
  }, [breatheProgress, hasAvatar, isCreatingLook, isRendering]);

  const closeSession = () => {
    onClose?.({
      addedPieceCount,
      isSaved,
      pieces
    });
  };

  const continueBrowsing = () => {
    onContinueBrowsing?.({
      addedPieceCount,
      isSaved,
      pieces
    });
  };

  const viewCart = () => {
    onViewCart?.({
      addedPieceCount,
      isSaved,
      pieces
    });
  };

  const handleTryAlternative = (alternative: LookPiece) => {
    if (!swapPiece) {
      return;
    }

    setPieces((currentPieces) =>
      currentPieces.map((piece) =>
        piece.id === swapPiece.id
          ? {
              ...alternative,
              id: piece.id,
              kind: piece.kind
            }
          : piece
      )
    );
    setSelectedPieceId(swapPiece.id);
    setSwapPiece(null);
    setIsCartToastVisible(false);
    setIsRendering(true);

    setTimeout(() => {
      setIsRendering(false);
    }, 560);
  };

  const handleAddToCart = () => {
    if (priceSummary.buyableCount < 1) {
      return;
    }

    setIsCartToastVisible(false);
    onOpenShopLook?.({
      addedPieceCount,
      isSaved,
      pieces
    });
  };

  const handleEditLook = () => {
    setIsCartToastVisible(false);
    setIsPiecePanelOpen(false);
    setIsPiecePanelVisible(false);
    setIsBuildLookOpen(true);
  };

  const handleClearBuildSlot = (kind: BuildSlotKind) => {
    setPieces((currentPieces) => removeBuildSlotPiece(currentPieces, kind));
    setSelectedPieceId((currentId) => {
      const currentPiece = pieces.find((piece) => piece.id === currentId);

      return currentPiece?.kind === kind ? "" : currentId;
    });
  };

  const handleShuffleBuildLook = () => {
    setPieces((currentPieces) => {
      const nextPieces = buildSlots.reduce<LookPiece[]>((draftPieces, slot) => {
        const alternatives = getPieceAlternatives(slot.kind);

        if (alternatives.length === 0) {
          return draftPieces;
        }

        const currentPiece = getBuildSlotPiece(draftPieces, slot.kind);
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

        return replaceBuildSlotPiece(draftPieces, slot.kind, shuffledPiece);
      }, currentPieces);

      setSelectedPieceId(nextPieces[0]?.id ?? "");
      return nextPieces;
    });
  };

  const handleSelectBuildProduct = (
    kind: BuildSlotKind,
    selectedPiece: LookPiece
  ) => {
    setPieces((currentPieces) => {
      const nextPieces = replaceBuildSlotPiece(
        currentPieces,
        kind,
        selectedPiece
      );
      const nextPiece = getBuildSlotPiece(nextPieces, kind);

      if (nextPiece) {
        setSelectedPieceId(nextPiece.id);
      }

      return nextPieces;
    });
    setActiveBuildCategory(null);
  };

  const handleSelectBuildSlotPiece = (
    kind: BuildSlotKind,
    selectedPiece: LookPiece
  ) => {
    setPieces((currentPieces) => {
      const nextPieces = replaceBuildSlotPiece(
        currentPieces,
        kind,
        selectedPiece
      );
      const nextPiece = getBuildSlotPiece(nextPieces, kind);

      if (nextPiece) {
        setSelectedPieceId(nextPiece.id);
      }

      return nextPieces;
    });
  };

  const handleGenerateBuildLook = () => {
    setIsBuildLookOpen(false);
    setActiveBuildCategory(null);
    setIsCartToastVisible(false);
    setIsRendering(true);

    setTimeout(() => {
      setIsRendering(false);
    }, 760);
  };

  const showPiecePanel = () => {
    setIsCartToastVisible(false);
    setIsPiecePanelVisible(true);
    setIsPiecePanelOpen(true);
  };

  const hidePiecePanel = () => {
    setIsPiecePanelOpen(false);
  };

  const handleOpenPieceProduct = (piece: LookPiece) => {
    setIsCartToastVisible(false);
    onOpenProduct?.(getPieceProduct(piece));
  };

  if (!hasAvatar) {
    return (
      <View style={styles.screen}>
        <ExpoStatusBar style="dark" />
        <TryOnTopBar lookName={activeLook.title} onClose={closeSession} />
        <ScrollView
          contentContainerStyle={styles.uploadContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.uploadCopy}>
            <Text style={styles.uploadTitle}>
              Add your photo to try this look
            </Text>
            <Text style={styles.uploadSubtitle}>
              1 photo is all it takes. Mira will use it to build your try-on
              avatar for the complete outfit.
            </Text>
          </View>
          <PhotoUploadBox onSelectPhoto={onSelectPhoto} uri={avatarUri} />
        </ScrollView>
      </View>
    );
  }

  if (isCreatingLook) {
    return (
      <AvatarCreationLoadingScreen
        imageHeight={creationImageHeight}
        onClose={closeSession}
        onContinueBrowsing={continueBrowsing}
      />
    );
  }

  if (activeBuildCategory) {
    const activeSlot =
      buildSlots.find((slot) => slot.kind === activeBuildCategory) ??
      buildSlots[0];
    const listingOptions = getBuildListingOptions({
      kind: activeBuildCategory,
      pieces,
      stylePrompt: buildStylePrompt
    });
    const listingSubtitle = buildStylePrompt.trim()
      ? `${buildStylePrompt.trim()} · current piece first`
      : "Current piece first";

    return (
      <ProductListingScreen
        emptyCopy="Try another style direction or come back to this slot later."
        emptyTitle={`No ${activeSlot.label.toLowerCase()} options yet`}
        onBack={() => setActiveBuildCategory(null)}
        onOpenCart={viewCart}
        onOpenProduct={(product) => {
          const selectedOption = listingOptions.find(
            (option) => option.product.id === product.id
          );

          if (selectedOption) {
            handleSelectBuildProduct(
              activeBuildCategory,
              selectedOption.piece
            );
          }
        }}
        products={listingOptions.map((option) => option.product)}
        subtitle={listingSubtitle}
        title={activeSlot.listingTitle}
      />
    );
  }

  if (isBuildLookOpen) {
    return (
      <BuildLookScreen
        onClearSlot={handleClearBuildSlot}
        onGenerate={handleGenerateBuildLook}
        onGoBack={() => {
          setActiveBuildCategory(null);
          setIsBuildLookOpen(false);
        }}
        onOpenCategory={setActiveBuildCategory}
        onSelectPiece={handleSelectBuildSlotPiece}
        onShuffle={handleShuffleBuildLook}
        onStylePromptChange={setBuildStylePrompt}
        pieces={pieces}
        stylePrompt={buildStylePrompt}
      />
    );
  }

  const breatheScale = breatheProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 0.912]
  });
  const piecePanelShrink = piecePanelProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.72]
  });
  const avatarScale = Animated.multiply(breatheScale, piecePanelShrink);
  const avatarTranslateY = piecePanelProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, -92]
  });
  const cardTranslateY = piecePanelProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [26, 0]
  });
  const avatarTransform = [
    { translateY: avatarTranslateY },
    { scale: avatarScale }
  ];

  return (
    <View style={styles.screen}>
      <ExpoStatusBar style="dark" />
      <TryOnTopBar lookName={activeLook.title} onClose={closeSession} />

      <View style={styles.tryOnBody}>
        <View style={[styles.avatarRegion, styles.avatarRegionExpanded]}>
          {isRendering ? (
            <View style={styles.loadingScene}>
              <Image
                resizeMode="cover"
                source={{ uri: activeLook.image }}
                style={styles.loadingLookImage}
              />
              <View style={styles.loadingOverlay}>
                <LoadingRing progress={spinnerProgress} />
                <Text style={styles.loadingText}>Styling your look...</Text>
              </View>
            </View>
          ) : (
            <>
              <View
                accessibilityLabel={activeMediaSlide.accessibilityLabel}
                accessibilityRole="image"
                style={styles.mediaFrame}
              >
                <Animated.View
                  style={[
                    styles.avatarMediaFrame,
                    { transform: avatarTransform }
                  ]}
                >
                  <Image
                    resizeMode="contain"
                    source={tryOnModelImage}
                    style={styles.avatarImage}
                  />
                </Animated.View>

                {activeMediaSlide.isVideo ? (
                  <View
                    pointerEvents="none"
                    style={styles.videoPreviewOverlay}
                  >
                    <View style={styles.videoPlayButton}>
                      <Feather
                        color={colors.inverseText}
                        name="play"
                        size={22}
                      />
                    </View>
                  </View>
                ) : null}
              </View>

              {!isPiecePanelVisible ? (
                <View pointerEvents="box-none" style={styles.mediaControlDock}>
                  <View style={styles.mediaSegmentedControl}>
                    {mediaSlides.map((slide, index) => (
                      <Pressable
                        accessibilityLabel={`Show ${slide.id}`}
                        accessibilityRole="button"
                        accessibilityState={{
                          selected: activeMediaIndex === index
                        }}
                        key={slide.id}
                        onPress={() => setActiveMediaIndex(index)}
                        style={[
                          styles.mediaSegment,
                          index === activeMediaIndex
                            ? styles.mediaSegmentActive
                            : null
                        ]}
                      >
                        <Text
                          style={[
                            styles.mediaSegmentText,
                            index === activeMediaIndex
                              ? styles.mediaSegmentTextActive
                              : null
                          ]}
                        >
                          {slide.id === "image" ? "Image" : "Video"}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ) : null}
            </>
          )}
        </View>

        {isPiecePanelVisible ? (
          <Animated.View
            style={[
              styles.outfitInfoCard,
              {
                opacity: piecePanelProgress,
                transform: [{ translateY: cardTranslateY }]
              }
            ]}
          >
            <View style={styles.outfitInfoHeader}>
              <View>
                <Text style={styles.outfitInfoTitle}>Pieces in this look</Text>
                <Text style={styles.outfitInfoKicker}>
                  {priceSummary.buyableCount} new pieces
                </Text>
              </View>
              <Pressable
                accessibilityLabel="Hide pieces in this look"
                accessibilityRole="button"
                onPress={hidePiecePanel}
                style={({ pressed }) => [
                  styles.outfitInfoCollapse,
                  pressed ? styles.pressed : null
                ]}
              >
                <Text style={styles.outfitInfoCollapseText}>Show less</Text>
                <Feather color={colors.muted} name="chevron-down" size={17} />
              </Pressable>
            </View>

            <ScrollView
              horizontal
              contentContainerStyle={styles.outfitPieceTrack}
              showsHorizontalScrollIndicator={false}
            >
              {pieces.map((piece) => (
                <PieceCard
                  key={piece.id}
                  onPress={() => handleOpenPieceProduct(piece)}
                  piece={piece}
                />
              ))}
            </ScrollView>
          </Animated.View>
        ) : null}

        {!isPiecePanelVisible && !isRendering ? (
          <Pressable
            accessibilityLabel="Show pieces in this look"
            accessibilityRole="button"
            onPress={showPiecePanel}
            style={({ pressed }) => [
              styles.outfitInfoButton,
              pressed ? styles.pressed : null
            ]}
          >
            <Feather color={colors.muted} name="info" size={23} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.sessionActionShell}>
        <View style={styles.sessionActionBar}>
          <Pressable
            accessibilityLabel="Edit look"
            accessibilityRole="button"
            onPress={handleEditLook}
            style={({ pressed }) => [
              styles.sessionActionButton,
              styles.editLookButton,
              pressed ? styles.pressed : null
            ]}
          >
            <Text style={styles.editLookText}>Edit look</Text>
          </Pressable>

          <Pressable
            accessibilityLabel={`Add look to cart, ${priceSummary.totalLabel}`}
            accessibilityRole="button"
            onPress={handleAddToCart}
            style={({ pressed }) => [
              styles.sessionActionButton,
              styles.addCartButton,
              pressed ? styles.pressed : null
            ]}
          >
            <Text style={styles.addCartText}>Add to cart</Text>
          </Pressable>
        </View>
      </View>

      {isCartToastVisible ? (
        <View style={styles.cartToast}>
          <Text style={styles.toastText}>
            {priceSummary.buyableCount} pieces added to cart -{" "}
            {priceSummary.totalLabel.split(" ")[0]}
          </Text>
          <View style={styles.toastActions}>
            <Pressable
              accessibilityRole="button"
              onPress={viewCart}
              style={({ pressed }) => [
                styles.toastPrimaryAction,
                pressed ? styles.pressed : null
              ]}
            >
              <Text style={styles.toastPrimaryText}>View cart</Text>
              <Feather color={colors.inverseText} name="arrow-right" size={14} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => setIsCartToastVisible(false)}
              style={({ pressed }) => [
                styles.toastSecondaryAction,
                pressed ? styles.pressed : null
              ]}
            >
              <Text style={styles.toastSecondaryText}>Keep exploring</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      {swapPiece ? (
        <AlternativeSheet
          onClose={() => setSwapPiece(null)}
          onTryAlternative={handleTryAlternative}
          piece={swapPiece}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  addCartButton: {
    backgroundColor: colors.text
  },
  addCartText: {
    color: colors.inverseText,
    fontFamily: fonts.cta,
    fontSize: 14,
    lineHeight: 18
  },
  alternativeCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 0.5,
    overflow: "hidden",
    width: 124
  },
  alternativeImage: {
    backgroundColor: colors.imageSurface,
    height: 136,
    width: "100%"
  },
  alternativeInfo: {
    gap: 5,
    padding: 9
  },
  alternativeName: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 15
  },
  alternativePrice: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14
  },
  alternativeTrack: {
    gap: spacing.md,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md
  },
  actionButtonDisabled: {
    opacity: 0.46
  },
  avatarMediaFrame: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
    width: "100%"
  },
  avatarImage: {
    height: "100%",
    width: "100%"
  },
  avatarRegion: {
    backgroundColor: colors.background,
    overflow: "hidden"
  },
  avatarRegionExpanded: {
    flex: 1
  },
  buildContent: {
    paddingBottom: bottomSafeInset + 104,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg
  },
  buildGenerateButton: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: 999,
    height: 58,
    justifyContent: "center"
  },
  buildGenerateShell: {
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: 0.5,
    bottom: 0,
    left: 0,
    paddingBottom: bottomSafeInset + spacing.sm,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    position: "absolute",
    right: 0
  },
  buildGenerateText: {
    color: colors.inverseText,
    fontFamily: fonts.cta,
    fontSize: 16,
    lineHeight: 20
  },
  buildGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md
  },
  buildPromptBlock: {
    gap: spacing.sm,
    marginTop: spacing.xl
  },
  buildPromptLabel: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 21
  },
  buildPromptInput: {
    backgroundColor: colors.background,
    borderColor: "#D8D8D8",
    borderRadius: 12,
    borderWidth: 1,
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 14,
    height: 96,
    lineHeight: 20,
    minWidth: 0,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    textAlignVertical: "top"
  },
  buildScreen: {
    backgroundColor: colors.background,
    flex: 1
  },
  buildSlot: {
    flexBasis: "48.1%",
    flexGrow: 0,
    minWidth: 0
  },
  buildSlotCarousel: {
    height: "100%",
    width: "100%"
  },
  buildSlotDot: {
    backgroundColor: colors.border,
    borderRadius: 999,
    height: 6,
    width: 6
  },
  buildSlotDotActive: {
    backgroundColor: colors.text
  },
  buildSlotDots: {
    alignItems: "center",
    backgroundColor: colors.surfaceTranslucent,
    borderRadius: 999,
    bottom: spacing.sm,
    flexDirection: "row",
    gap: 6,
    height: 18,
    justifyContent: "center",
    left: "50%",
    paddingHorizontal: spacing.sm,
    position: "absolute",
    transform: [{ translateX: -25 }],
    width: 50
  },
  buildSlotEmptyContent: {
    alignItems: "center",
    gap: spacing.md,
    justifyContent: "center"
  },
  buildSlotEmptyText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 17,
    textAlign: "center"
  },
  buildSlotFrame: {
    alignItems: "center",
    aspectRatio: 1,
    backgroundColor: colors.surfaceTertiary,
    borderRadius: 14,
    justifyContent: "center",
    overflow: "hidden"
  },
  buildSlotFrameEmpty: {
    backgroundColor: colors.surfaceTertiary,
    borderWidth: 0
  },
  buildSlotImage: {
    height: "100%",
    width: "100%"
  },
  buildSlotLabel: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 19,
    marginTop: spacing.sm,
    textAlign: "center"
  },
  buildSlotPlus: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 28,
    borderWidth: 0.5,
    height: 56,
    justifyContent: "center",
    width: 56
  },
  buildSlotRemove: {
    alignItems: "center",
    backgroundColor: colors.surfaceTranslucent,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 0.5,
    height: 36,
    justifyContent: "center",
    position: "absolute",
    right: spacing.sm,
    top: spacing.sm,
    width: 36
  },
  buildTitle: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 23,
    textAlign: "center"
  },
  buildTopBar: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderBottomColor: colors.border,
    borderBottomWidth: 0.5,
    flexDirection: "row",
    gap: spacing.md,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.screen,
    paddingTop: topSafeInset + spacing.sm
  },
  buildTopIconButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 0.5,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  cartToast: {
    backgroundColor: colors.text,
    borderRadius: 20,
    bottom: bottomSafeInset + 86,
    gap: spacing.md,
    left: spacing.screen,
    padding: 14,
    position: "absolute",
    right: spacing.screen,
    shadowColor: "#000000",
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 18
  },
  creationCloseButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 0.5,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  creationContent: {
    gap: spacing.xl,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.screen
  },
  creationBrowseButton: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "transparent",
    borderColor: colors.secondaryBorder,
    borderRadius: 999,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    marginHorizontal: spacing.sm,
    marginTop: spacing.lg
  },
  creationBrowseButtonText: {
    color: colors.text,
    fontFamily: fonts.cta,
    fontSize: 14,
    lineHeight: 18,
    textAlign: "center"
  },
  creationBrowseCopy: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.lg,
    maxWidth: 280,
    textAlign: "center"
  },
  creationCopy: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 21,
    textAlign: "center"
  },
  creationCopyBlock: {
    alignItems: "center"
  },
  creationImage: {
    height: "100%",
    width: "100%"
  },
  creationImageFrame: {
    alignSelf: "center",
    backgroundColor: colors.imageSurface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 0.5,
    justifyContent: "center",
    overflow: "hidden",
    width: "100%"
  },
  creationScreen: {
    backgroundColor: colors.background,
    flex: 1
  },
  creationTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 24,
    letterSpacing: 0,
    lineHeight: 30,
    marginBottom: spacing.sm,
    textAlign: "center"
  },
  creationTopBar: {
    height: topSafeInset + 58,
    justifyContent: "flex-end",
    paddingHorizontal: spacing.screen,
    paddingTop: topSafeInset,
    paddingBottom: spacing.md
  },
  editLookButton: {
    backgroundColor: colors.background,
    borderColor: colors.secondaryBorder,
    borderWidth: 1
  },
  editLookText: {
    color: colors.text,
    fontFamily: fonts.cta,
    fontSize: 14,
    lineHeight: 18,
    textAlign: "center"
  },
  loadingLookImage: {
    height: "100%",
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
    width: "100%"
  },
  loadingOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.56)",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  loadingRing: {
    borderColor: "rgba(10, 10, 10, 0.18)",
    borderLeftColor: colors.text,
    borderRadius: 18,
    borderWidth: 2,
    height: 36,
    width: 36
  },
  loadingScene: {
    height: "100%",
    width: "100%"
  },
  loadingText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18,
    marginTop: spacing.md
  },
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end"
  },
  modalScrim: {
    backgroundColor: colors.scrimMedium,
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  pieceCard: {
    borderRadius: 10,
    height: 72,
    overflow: "hidden",
    width: 72
  },
  pieceImage: {
    height: "100%",
    width: "100%"
  },
  pieceImageWrap: {
    borderRadius: 8,
    flex: 1,
    overflow: "hidden"
  },
  piecePanel: {
    backgroundColor: colors.background,
    flex: 1,
    gap: spacing.sm,
    paddingBottom: 0,
    paddingTop: spacing.md
  },
  pieceTrack: {
    gap: spacing.sm,
    paddingHorizontal: spacing.screen
  },
  outfitInfoButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 28,
    borderWidth: 0.5,
    bottom: spacing.xl,
    height: 56,
    justifyContent: "center",
    position: "absolute",
    right: spacing.screen,
    shadowColor: "#000000",
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    width: 56,
    zIndex: 2
  },
  outfitInfoCard: {
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderColor: colors.border,
    borderRadius: 28,
    borderWidth: 0.5,
    bottom: spacing.lg,
    gap: spacing.md,
    left: spacing.screen,
    padding: spacing.lg,
    position: "absolute",
    right: spacing.screen,
    shadowColor: "#000000",
    shadowOffset: { height: 12, width: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 30,
    zIndex: 3
  },
  outfitInfoCollapse: {
    alignItems: "center",
    flexDirection: "row",
    gap: 3,
    height: 32,
    justifyContent: "center",
    paddingLeft: spacing.sm
  },
  outfitInfoCollapseText: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 15
  },
  outfitInfoHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  outfitInfoKicker: {
    color: colors.soft,
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 1.4,
    lineHeight: 13,
    marginTop: 3,
    textTransform: "uppercase"
  },
  outfitInfoTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 16,
    lineHeight: 20
  },
  outfitPieceTrack: {
    gap: spacing.sm
  },
  pressed: {
    opacity: 0.72
  },
  mediaFrame: {
    alignItems: "center",
    backgroundColor: colors.background,
    height: "100%",
    justifyContent: "center",
    width: "100%"
  },
  mediaControlDock: {
    alignItems: "center",
    bottom: spacing.xl,
    height: 56,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    zIndex: 2
  },
  mediaSegment: {
    alignItems: "center",
    borderRadius: 999,
    height: 38,
    justifyContent: "center",
    minWidth: 76,
    paddingHorizontal: spacing.md
  },
  mediaSegmentActive: {
    backgroundColor: colors.text
  },
  mediaSegmentedControl: {
    backgroundColor: "rgba(255, 255, 255, 0.88)",
    borderColor: "rgba(10, 10, 10, 0.18)",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    padding: 3,
    shadowColor: "#000000",
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 12
  },
  mediaSegmentText: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 18
  },
  mediaSegmentTextActive: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1
  },
  sessionActionShell: {
    backgroundColor: colors.background
  },
  sessionActionBar: {
    alignItems: "center",
    backgroundColor: colors.background,
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: "auto",
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md
  },
  tryOnBody: {
    backgroundColor: colors.background,
    flex: 1
  },
  sessionActionButton: {
    alignItems: "center",
    borderRadius: 999,
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 1,
    height: 52,
    justifyContent: "center",
    minWidth: 0,
    paddingHorizontal: spacing.md
  },
  sheetCloseButton: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 0.5,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  sheetHandle: {
    alignSelf: "center",
    backgroundColor: colors.border,
    borderRadius: 999,
    height: 4,
    marginBottom: spacing.md,
    width: 44
  },
  sheetHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screen
  },
  sheetSubtitle: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2
  },
  sheetTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 23
  },
  shopActionBar: {
    alignItems: "center",
    backgroundColor: colors.background,
    flexDirection: "row",
    gap: spacing.sm,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md
  },
  shopActionShell: {
    backgroundColor: colors.background,
    paddingBottom: 0
  },
  shopCardDot: {
    backgroundColor: colors.border,
    borderRadius: 999,
    height: 5,
    width: 5
  },
  shopCardDotActive: {
    backgroundColor: colors.text,
    width: 20
  },
  shopCarousel: {
    alignItems: "center",
    paddingTop: spacing.lg
  },
  shopCarouselBlock: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: spacing.xl
  },
  shopEmptyCopy: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.sm,
    textAlign: "center"
  },
  shopEmptyState: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl
  },
  shopEmptyTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 25,
    textAlign: "center"
  },
  shopEyebrow: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    letterSpacing: 0,
    lineHeight: 17
  },
  shopIntro: {
    gap: 6,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg
  },
  shopHeaderBackButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    marginLeft: -6,
    width: 38
  },
  shopHeaderIconButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 36
  },
  shopPagination: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    paddingTop: spacing.md
  },
  shopProductBrand: {
    color: colors.soft,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 1,
    lineHeight: 14,
    textTransform: "uppercase"
  },
  shopProductCard: {
    justifyContent: "center"
  },
  shopProductCopy: {
    alignItems: "center",
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.lg
  },
  shopProductImage: {
    height: "100%",
    width: "100%"
  },
  shopProductImageWrap: {
    aspectRatio: 0.8,
    backgroundColor: colors.background,
    borderRadius: 18,
    overflow: "hidden"
  },
  shopProductName: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 22,
    textAlign: "center"
  },
  shopProductPrice: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 19
  },
  shopScreen: {
    backgroundColor: colors.background,
    flex: 1
  },
  shopToast: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 0.5,
    bottom: bottomSafeInset + 86,
    flexDirection: "row",
    gap: spacing.sm,
    left: spacing.screen,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    position: "absolute",
    right: spacing.screen,
    shadowColor: "#000000",
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 18
  },
  shopToastAction: {
    alignItems: "center",
    height: 36,
    justifyContent: "center",
    paddingHorizontal: spacing.sm
  },
  shopToastActionText: {
    color: colors.text,
    fontFamily: fonts.cta,
    fontSize: 12,
    letterSpacing: 1,
    lineHeight: 15,
    textTransform: "uppercase"
  },
  shopToastClose: {
    alignItems: "center",
    height: 36,
    justifyContent: "center",
    width: 28
  },
  shopToastText: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 17
  },
  shopTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 25
  },
  shopTopBar: {
    alignItems: "center",
    backgroundColor: colors.background,
    flexDirection: "row",
    gap: spacing.md,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.screen,
    paddingTop: topSafeInset + spacing.sm
  },
  shopTopTitle: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18,
    textAlign: "center"
  },
  sizeGuideButton: {
    alignItems: "center",
    height: 34,
    justifyContent: "center",
    paddingHorizontal: spacing.sm
  },
  sizeGuideText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 17,
    textDecorationLine: "underline"
  },
  sizeInlineRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screen
  },
  sizeMetaRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screen
  },
  sizeOptionText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 18,
    lineHeight: 23
  },
  sizeProductName: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 23,
    paddingHorizontal: spacing.xl,
    textAlign: "center"
  },
  sizeRecommendedLabel: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 17
  },
  sizeSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    gap: spacing.lg,
    paddingBottom: bottomSafeInset + spacing.xl,
    paddingTop: spacing.md
  },
  sizeTapTarget: {
    alignItems: "center",
    flex: 1,
    height: 52,
    justifyContent: "center"
  },
  swapSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: 330,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md
  },
  toastActions: {
    flexDirection: "row",
    gap: spacing.sm
  },
  toastPrimaryAction: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    borderColor: "rgba(255, 255, 255, 0.22)",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    height: 38,
    justifyContent: "center",
    paddingHorizontal: 14
  },
  toastPrimaryText: {
    color: colors.inverseText,
    fontFamily: fonts.cta,
    fontSize: 12,
    lineHeight: 15
  },
  toastSecondaryAction: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 999,
    flex: 1,
    height: 38,
    justifyContent: "center",
    paddingHorizontal: 14
  },
  toastSecondaryText: {
    color: colors.text,
    fontFamily: fonts.cta,
    fontSize: 12,
    lineHeight: 15
  },
  toastText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 17
  },
  topBar: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderBottomColor: colors.border,
    borderBottomWidth: 0.5,
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.md,
    paddingTop: topSafeInset + spacing.sm
  },
  topIconButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 0.5,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  topTitle: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18,
    textAlign: "center"
  },
  tryThisPill: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.text,
    borderRadius: 999,
    height: 26,
    justifyContent: "center",
    paddingHorizontal: 10
  },
  tryThisText: {
    color: colors.inverseText,
    fontFamily: fonts.cta,
    fontSize: 10,
    lineHeight: 13
  },
  uploadContent: {
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xl
  },
  uploadCopy: {
    gap: spacing.sm
  },
  uploadSubtitle: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21
  },
  uploadTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 26,
    lineHeight: 31
  },
  videoPlayButton: {
    alignItems: "center",
    backgroundColor: colors.inverseTranslucent,
    borderColor: "rgba(255, 255, 255, 0.32)",
    borderRadius: 26,
    borderWidth: 1,
    height: 52,
    justifyContent: "center",
    width: 52
  },
  videoPreviewOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(10, 10, 10, 0.08)",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  yoursTag: {
    backgroundColor: colors.text,
    borderRadius: 999,
    bottom: 5,
    left: 5,
    paddingHorizontal: 7,
    paddingVertical: 3,
    position: "absolute"
  },
  yoursTagText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 9,
    lineHeight: 11
  },
});
