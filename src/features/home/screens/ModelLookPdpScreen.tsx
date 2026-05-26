import { prototypeProductImages } from "../data/prototypeProductImages";
import { Feather } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  ImageBackground,
  type LayoutChangeEvent,
  Modal,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  type StyleProp,
  Text,
  useWindowDimensions,
  View,
  type ViewStyle
} from "react-native";
import Svg, { Path } from "react-native-svg";

import { colors, fonts, spacing } from "../../../theme";
import { CartCountBadge } from "../components/CartCountBadge";
import { MatchRibbonTag } from "../components/MatchRibbonTag";
import type { ProductLook } from "./HomeScreen";
import {
  appSearchHeaderHeight,
  appSearchHeaderTopPadding,
  appTopSafeInset
} from "../utils/safeArea";
import {
  buildLookPieces,
  formatRupeeAmount,
  getRupeeValue,
  type LookPiece
} from "../data/lookPieces";

export type ShopThisLookCartItem = {
  piece: LookPiece;
  size: string;
};

type ModelLookPdpScreenProps = {
  cartCount?: number;
  hasStyleProfile?: boolean;
  initialIsSaved?: boolean;
  look: ProductLook;
  onAddToCart?: (items: ShopThisLookCartItem[]) => void;
  onAskMira?: () => void;
  onBack: () => void;
  onLookSavedChange?: (isSaved: boolean) => void;
  onOpenCart?: () => void;
  onOpenPieceProduct?: (piece: LookPiece) => void;
  onOpenShopLook?: () => void;
  onOpenWishlist?: () => void;
  onShareLook?: () => void;
  onStartTryOn?: (context?: string) => void;
  pieceOverrides?: LookPiece[];
};

type Variation = {
  changed: string;
  id: string;
  image: string;
  match: string;
  previewImages: string[];
};

type SimilarItemCategory = "shoes" | "top" | "trousers";

type SimilarShopItem = {
  category: SimilarItemCategory;
  id: string;
  image: string;
  name: string;
  price: string;
};

const topSafeInset = appTopSafeInset;
const lookPdpHeaderHeight = appSearchHeaderHeight;
const ctaBottomInset = spacing.xl;
const ctaDockHeight = 48 + spacing.md + ctaBottomInset;
const lookCarouselCardWidth = 160;
const contentSheetOverlap = 28;
const wishlistActiveColor = "#D92D20";

const fullLookImage =
  prototypeProductImages.sandro.whitePinstripeSuit;
const trouserImage =
  prototypeProductImages.sandro.whitePinstripeSuit;
const muleImage =
  prototypeProductImages.sandro.brownJacket;
const blazerImage = prototypeProductImages.sandro.brownJacket;
const dressImage =
  prototypeProductImages.maje.beigeCrochetDress;
const bagImage = prototypeProductImages.maje.stripedScarfDenim;
const similarShoeImage = prototypeProductImages.sandro.brownJacket;
const similarSandalImage = prototypeProductImages.maje.stripedScarfDenim;

function SectionHeading({
  action,
  copy,
  title
}: {
  action?: string;
  copy?: string;
  title: string;
}) {
  return (
    <View style={styles.sectionHeadingRow}>
      <View style={styles.sectionHeadingCopy}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {copy ? <Text style={styles.sectionCopy}>{copy}</Text> : null}
      </View>
      {action ? <Text style={styles.sectionAction}>{action}</Text> : null}
    </View>
  );
}

function SimilarItemsIcon() {
  return (
    <Svg height={24} viewBox="0 0 24 24" width={24}>
      <Path
        d="M16.2873 7.5583L18.6142 7.94889C19.5186 8.1007 20.1286 8.95692 19.9768 9.86129L18.6611 17.6995C18.5447 18.3926 18.0148 18.9128 17.3665 19.0497C16.9629 19.135 16.5586 18.9755 16.1832 18.8043L15.9365 18.6917M7.71266 7.5583L5.38581 7.94889C4.48144 8.1007 3.87136 8.95692 4.02317 9.86129L5.33893 17.6995C5.4613 18.4285 6.04139 18.9663 6.73545 19.068C7.07562 19.1178 7.40975 18.9899 7.72254 18.8472L8.06352 18.6917M9.55977 19.0277H14.6269C15.5439 19.0277 16.2873 18.2843 16.2873 17.3673V6.5745C16.2873 5.65746 15.5439 4.91406 14.6269 4.91406H9.55977C8.64273 4.91406 7.89933 5.65746 7.89933 6.5745V17.3673C7.89933 18.2843 8.64273 19.0277 9.55977 19.0277Z"
        fill="none"
        stroke="#2B2522"
        strokeLinecap="square"
        strokeWidth={1.5}
      />
    </Svg>
  );
}

function WishlistHeartIcon({
  saved,
  size = 16
}: {
  saved: boolean;
  size?: number;
}) {
  return (
    <Svg height={size} viewBox="0 0 24 24" width={size}>
      <Path
        d="M20.84 4.61C20.3292 4.099 19.7228 3.69365 19.0554 3.41699C18.3879 3.14032 17.6725 2.99776 16.95 2.99776C16.2275 2.99776 15.5121 3.14032 14.8446 3.41699C14.1772 3.69365 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.99871 7.05 2.99871C5.59097 2.99871 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.033 10.6054C22.3097 9.93789 22.4522 9.22249 22.4522 8.5C22.4522 7.77751 22.3097 7.0621 22.033 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z"
        fill={saved ? wishlistActiveColor : "none"}
        stroke={saved ? wishlistActiveColor : colors.text}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </Svg>
  );
}

function LookPdpHeader({
  cartCount = 0,
  onBack,
  onOpenCart,
  onOpenWishlist
}: {
  cartCount?: number;
  onBack: () => void;
  onOpenCart?: () => void;
  onOpenWishlist?: () => void;
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

        <View style={styles.headerSearchBar}>
          <Feather color={colors.soft} name="search" size={21} />
          <Text numberOfLines={1} style={styles.headerSearchText}>
            Search looks, occasions, pieces
          </Text>
        </View>

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
          <WishlistHeartIcon saved={false} size={24} />
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
          <Feather color={colors.text} name="shopping-cart" size={24} />
          <CartCountBadge count={cartCount} />
        </Pressable>
      </View>
    </View>
  );
}

function HeroLookImage({
  hasStyleProfile,
  heroHeight,
  isSaved,
  look,
  onOpenSimilar,
  onSave
}: {
  hasStyleProfile: boolean;
  heroHeight: number;
  isSaved: boolean;
  look: ProductLook;
  onOpenSimilar: () => void;
  onSave: () => void;
}) {
  return (
    <View style={[styles.hero, { height: heroHeight }]}>
      <Image
        resizeMode="cover"
        source={{ uri: look.image || fullLookImage }}
        style={styles.heroImage}
      />

      <Pressable
        accessibilityLabel="Find similar items"
        accessibilityRole="button"
        onPress={onOpenSimilar}
        style={({ pressed }) => [
          styles.heroSimilarButton,
          pressed ? styles.pressed : null
        ]}
      >
        <SimilarItemsIcon />
      </Pressable>

      <Pressable
        accessibilityLabel={
          isSaved ? "Remove look from wishlist" : "Add look to wishlist"
        }
        accessibilityRole="button"
        accessibilityState={{ selected: isSaved }}
        onPress={onSave}
        style={({ pressed }) => [
          styles.heroWishlistButton,
          pressed ? styles.pressed : null
        ]}
      >
        <WishlistHeartIcon saved={isSaved} size={23} />
      </Pressable>

      {hasStyleProfile ? (
        <MatchRibbonTag
          height={30}
          label={look.match}
          style={styles.heroMatchTag}
          width={98}
        />
      ) : null}
    </View>
  );
}

function LookInfoStrip({
  look,
  onShareLook
}: {
  look: ProductLook;
  onShareLook?: () => void;
}) {
  return (
    <View style={styles.infoStrip}>
      <View style={styles.lookNameRow}>
        <Text numberOfLines={1} style={styles.lookName}>
          {look.title || "Monday sorted"}
        </Text>
        <Pressable
          accessibilityLabel="Share look"
          accessibilityRole="button"
          onPress={onShareLook}
          style={({ pressed }) => [
            styles.lookShareButton,
            pressed ? styles.pressed : null
          ]}
        >
          <Feather color={colors.text} name="share-2" size={21} />
        </Pressable>
      </View>
    </View>
  );
}

function getShopLookPieceLabel(piece: LookPiece) {
  if (piece.kind === "top") {
    return "Top";
  }

  if (piece.kind === "bottom") {
    return "Bottom";
  }

  if (piece.kind === "shoe") {
    return "Footwear";
  }

  if (piece.kind === "jacket") {
    return "Layer";
  }

  if (piece.kind === "bag") {
    return "Bag";
  }

  return "Dress";
}

const shopThisLookPieceOrder: Array<LookPiece["kind"]> = [
  "top",
  "bottom",
  "bag",
  "shoe"
];
const shopThisLookImageByKind: Partial<Record<LookPiece["kind"], string>> = {
  bag: prototypeProductImages.shopThisLook.brownBag,
  bottom: prototypeProductImages.shopThisLook.yellowPants,
  shoe: prototypeProductImages.shopThisLook.brownShoes,
  top: prototypeProductImages.shopThisLook.yellowTop
};

function getShopThisLookPieces(pieces: LookPiece[]) {
  const piecesByKind = new Map<LookPiece["kind"], LookPiece>();

  pieces.forEach((piece) => {
    if (
      shopThisLookPieceOrder.includes(piece.kind) &&
      !piecesByKind.has(piece.kind)
    ) {
      piecesByKind.set(piece.kind, piece);
    }
  });

  return shopThisLookPieceOrder
    .map((kind) => piecesByKind.get(kind))
    .filter((piece): piece is LookPiece => Boolean(piece))
    .map((piece) => ({
      ...piece,
      image: shopThisLookImageByKind[piece.kind] ?? piece.image
    }));
}

function getDefaultSelectedSize(piece: LookPiece) {
  const preferredSize = piece.sizes[Math.min(1, piece.sizes.length - 1)];

  return preferredSize ?? "One";
}

function getDefaultCartSelection(pieces: LookPiece[]) {
  return pieces.map((piece) => ({
    piece,
    size: getDefaultSelectedSize(piece)
  }));
}

function ShopThisLookSection({
  onCartSelectionChange,
  onOpenPieceProduct,
  onOpenShopLook,
  pieces
}: {
  onCartSelectionChange?: (items: ShopThisLookCartItem[]) => void;
  onOpenPieceProduct?: (piece: LookPiece) => void;
  onOpenShopLook?: () => void;
  pieces: LookPiece[];
}) {
  const shopPieces = pieces;
  const { width: screenWidth } = useWindowDimensions();
  const sizePickerRefs = useRef<Record<string, View | null>>({});
  const [removedPieceIds, setRemovedPieceIds] = useState<Set<string>>(
    () => new Set()
  );
  const [openSizePieceId, setOpenSizePieceId] = useState<string | null>(null);
  const [sizeMenuAnchor, setSizeMenuAnchor] = useState<{
    height: number;
    width: number;
    x: number;
    y: number;
  } | null>(null);
  const [selectedPieceSizes, setSelectedPieceSizes] = useState<
    Record<string, string>
  >({});
  const pieceIdsKey = useMemo(
    () => shopPieces.map((piece) => piece.id).join("|"),
    [shopPieces]
  );
  const activeTotal = useMemo(
    () =>
      shopPieces.reduce(
        (sum, piece) =>
          removedPieceIds.has(piece.id) ? sum : sum + getRupeeValue(piece.price),
        0
      ),
    [shopPieces, removedPieceIds]
  );

  useEffect(() => {
    setRemovedPieceIds(new Set());
    setOpenSizePieceId(null);
    setSizeMenuAnchor(null);
    setSelectedPieceSizes(
      Object.fromEntries(
        shopPieces.map((piece) => [piece.id, getDefaultSelectedSize(piece)])
      )
    );
  }, [pieceIdsKey]);

  const cartSelection = useMemo(
    () =>
      shopPieces
        .filter((piece) => !removedPieceIds.has(piece.id))
        .map((piece) => ({
          piece,
          size: selectedPieceSizes[piece.id] ?? getDefaultSelectedSize(piece)
        })),
    [removedPieceIds, selectedPieceSizes, shopPieces]
  );

  useEffect(() => {
    onCartSelectionChange?.(cartSelection);
  }, [cartSelection, onCartSelectionChange]);

  const closeSizeMenu = () => {
    setOpenSizePieceId(null);
    setSizeMenuAnchor(null);
  };

  const toggleSizeMenu = (pieceId: string) => {
    if (openSizePieceId === pieceId) {
      closeSizeMenu();
      return;
    }

    const pickerRef = sizePickerRefs.current[pieceId];

    if (!pickerRef) {
      return;
    }

    pickerRef.measureInWindow((x, y, width, height) => {
      setOpenSizePieceId(pieceId);
      setSizeMenuAnchor({ height, width, x, y });
    });
  };

  const togglePiece = (pieceId: string) => {
    closeSizeMenu();
    setRemovedPieceIds((current) => {
      const next = new Set(current);

      if (next.has(pieceId)) {
        next.delete(pieceId);
      } else {
        next.add(pieceId);
      }

      return next;
    });
  };
  const openSizePiece =
    shopPieces.find((piece) => piece.id === openSizePieceId) ?? null;
  const openSizePieceSelectedSize = openSizePiece
    ? selectedPieceSizes[openSizePiece.id] ?? getDefaultSelectedSize(openSizePiece)
    : "";
  const sizeMenuWidth = Math.max(sizeMenuAnchor?.width ?? 0, 88);
  const sizeMenuLeft = sizeMenuAnchor
    ? Math.min(sizeMenuAnchor.x, screenWidth - sizeMenuWidth - spacing.screen)
    : 0;
  const sizeMenuTop = sizeMenuAnchor
    ? sizeMenuAnchor.y + sizeMenuAnchor.height + 6
    : 0;

  return (
    <View style={styles.shopThisLookSection}>
      <Pressable
        accessibilityLabel="Open shop this look"
        accessibilityRole="button"
        disabled={!onOpenShopLook}
        onPress={onOpenShopLook}
        style={({ pressed }) => [
          styles.shopThisLookHeader,
          onOpenShopLook && pressed ? styles.pressed : null
        ]}
      >
        <View style={styles.shopThisLookTitleRow}>
          <Text style={styles.shopThisLookTitle}>Shop this look</Text>
          {onOpenShopLook ? (
            <Feather color={colors.text} name="chevron-right" size={20} />
          ) : null}
        </View>
        <Text style={styles.shopThisLookTotal}>
          {formatRupeeAmount(activeTotal)}
        </Text>
      </Pressable>
      <View style={styles.shopThisLookList}>
        {shopPieces.map((piece) => {
          const isAdded = !removedPieceIds.has(piece.id);
          const pieceLabel = getShopLookPieceLabel(piece);
          const selectedSize =
            selectedPieceSizes[piece.id] ?? getDefaultSelectedSize(piece);
          const isSizeMenuOpen = openSizePieceId === piece.id;

          return (
            <View
              key={piece.id}
              style={[
                styles.shopThisLookRow,
                isSizeMenuOpen ? styles.shopThisLookRowActive : null
              ]}
            >
              <Pressable
                accessibilityLabel={`Open ${piece.name} details`}
                accessibilityRole="button"
                disabled={!isAdded || !onOpenPieceProduct}
                onPress={() => onOpenPieceProduct?.(piece)}
                style={[
                  styles.shopThisLookThumb,
                  isAdded ? null : styles.shopThisLookPieceInactive
                ]}
              >
                <Image
                  resizeMode="cover"
                  source={{ uri: piece.image }}
                  style={styles.shopThisLookImage}
                />
              </Pressable>
              <View
                style={[
                  styles.shopThisLookCopy,
                  isAdded ? null : styles.shopThisLookPieceInactive
                ]}
              >
                <Text numberOfLines={1} style={styles.shopThisLookName}>
                  {pieceLabel}
                </Text>
                <Text numberOfLines={1} style={styles.shopThisLookProductName}>
                  {piece.name}
                </Text>
                <View style={styles.shopThisLookSizeWrap}>
                  <View
                    collapsable={false}
                    ref={(node) => {
                      sizePickerRefs.current[piece.id] = node;
                    }}
                  >
                    <Pressable
                      accessibilityLabel={`Select size for ${pieceLabel}`}
                      accessibilityRole="button"
                      accessibilityState={{
                        disabled: !isAdded,
                        expanded: isSizeMenuOpen
                      }}
                      disabled={!isAdded}
                      onPress={() => toggleSizeMenu(piece.id)}
                      style={({ pressed }) => [
                        styles.shopThisLookSizePicker,
                        pressed ? styles.pressed : null
                      ]}
                    >
                      <Text style={styles.shopThisLookSizeValue}>
                        {selectedSize}
                      </Text>
                      <Feather
                        color={colors.muted}
                        name="chevron-down"
                        size={14}
                      />
                    </Pressable>
                  </View>
                </View>
                <Text style={styles.shopThisLookPrice}>{piece.price}</Text>
              </View>
              <Pressable
                accessibilityLabel={`${isAdded ? "Remove" : "Add"} ${pieceLabel}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isAdded }}
                onPress={() => togglePiece(piece.id)}
                style={({ pressed }) => [
                  styles.shopThisLookSwap,
                  isAdded ? null : styles.shopThisLookSwapInactive,
                  pressed ? styles.pressed : null
                ]}
              >
                <Feather
                  color={colors.text}
                  name={isAdded ? "trash-2" : "plus"}
                  size={18}
                />
              </Pressable>
            </View>
          );
        })}
      </View>
      <Modal
        animationType="none"
        onRequestClose={closeSizeMenu}
        transparent
        visible={Boolean(openSizePiece)}
      >
        <View style={styles.shopThisLookSizeModal}>
          <Pressable
            accessibilityLabel="Close size options"
            accessibilityRole="button"
            onPress={closeSizeMenu}
            style={StyleSheet.absoluteFill}
          />
          {openSizePiece && sizeMenuAnchor ? (
            <View
              style={[
                styles.shopThisLookSizeMenu,
                {
                  left: sizeMenuLeft,
                  minWidth: sizeMenuWidth,
                  top: sizeMenuTop
                }
              ]}
            >
              {openSizePiece.sizes.map((size) => {
                const isSelected = openSizePieceSelectedSize === size;

                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    key={`${openSizePiece.id}-${size}`}
                    onPress={() => {
                      setSelectedPieceSizes((current) => ({
                        ...current,
                        [openSizePiece.id]: size
                      }));
                      closeSizeMenu();
                    }}
                    style={[
                      styles.shopThisLookSizeOption,
                      isSelected ? styles.shopThisLookSizeOptionSelected : null
                    ]}
                  >
                    <Text style={styles.shopThisLookSizeOptionText}>{size}</Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}
        </View>
      </Modal>
    </View>
  );
}

function MiraNote({ onAskMira }: { onAskMira?: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const collapsedNote =
    "Linen softens the structure while wide-leg trousers keep it polished.";
  const expandedNote =
    "Linen softens the structure while wide-leg trousers keep it polished. The block mules finish the look without competing, so it works for meetings first and drinks after.";

  return (
    <View style={styles.miraCard}>
      <View style={styles.miraHeader}>
        <View style={styles.miraIcon}>
          <Text style={styles.miraIconText}>M</Text>
        </View>
        <Text style={styles.miraTitle}>Mira says</Text>
      </View>
      <Text style={styles.miraBody}>
        {isExpanded ? expandedNote : collapsedNote}{" "}
        <Text
          accessibilityRole="button"
          onPress={() => setIsExpanded((current) => !current)}
          style={styles.miraInlineLink}
        >
          {isExpanded ? "See less" : "Read more"}
        </Text>
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={onAskMira}
        style={({ pressed }) => [
          styles.miraSecondaryCta,
          pressed ? styles.pressed : null
        ]}
      >
        <Text style={styles.miraSecondaryCtaText}>Ask Mira for alternatives →</Text>
      </Pressable>
    </View>
  );
}

function getVariationDisplayLabel(changed: string) {
  return changed
    .replace(/^Different\s+/i, "Swap ")
    .replace(/^Add a\s+/i, "");
}

function VariationCard({
  hasStyleProfile,
  image,
  style,
  variation
}: {
  hasStyleProfile: boolean;
  image: string;
  style?: StyleProp<ViewStyle>;
  variation: Variation;
}) {
  return (
    <View style={[styles.variationCard, style]}>
      <ImageBackground
        imageStyle={styles.variationImageStyle}
        resizeMode="cover"
        source={{ uri: image }}
        style={styles.variationImageWrap}
      >
        <View style={styles.variationSaveWrap}>
          <Pressable
            accessibilityLabel={`Save ${variation.changed}`}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.variationSaveButton,
              pressed ? styles.pressed : null
            ]}
          >
            <WishlistHeartIcon saved={false} />
          </Pressable>
        </View>
      </ImageBackground>
      <View style={styles.variationFooter}>
        <View style={styles.variationThumbRow}>
          {variation.previewImages.slice(0, 3).map((previewImage, index) => (
            <View
              accessibilityLabel={`${variation.changed} piece ${index + 1}`}
              key={`${variation.id}-preview-${index}`}
              style={[
                styles.variationThumb,
                index > 0 ? styles.variationThumbOverlap : null
              ]}
            >
              <Image
                resizeMode="cover"
                source={{ uri: previewImage }}
                style={styles.variationThumbImage}
              />
            </View>
          ))}
        </View>
        {hasStyleProfile ? (
          <MatchRibbonTag
            height={24}
            label={variation.match}
            mirrored
            style={styles.variationMatchTag}
            textStyle={styles.variationMatchTagText}
            width={82}
          />
        ) : (
          <View style={styles.variationContextPill}>
            <Text numberOfLines={1} style={styles.variationContextText}>
              {getVariationDisplayLabel(variation.changed)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

function SimilarItemCard({
  item,
  style
}: {
  item: SimilarShopItem;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.similarItemCard, style]}>
      <ImageBackground
        imageStyle={styles.similarItemImageStyle}
        resizeMode="cover"
        source={{ uri: item.image }}
        style={styles.similarItemImageWrap}
      >
        <View style={styles.similarItemSaveWrap}>
          <Pressable
            accessibilityLabel={`Save ${item.name}`}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.similarItemSave,
              pressed ? styles.pressed : null
            ]}
          >
            <WishlistHeartIcon saved={false} />
          </Pressable>
        </View>
      </ImageBackground>
      <View style={styles.similarItemInfo}>
        <Text numberOfLines={1} style={styles.similarItemName}>
          {item.name}
        </Text>
        <Text style={styles.similarItemPrice}>{item.price}</Text>
      </View>
    </View>
  );
}

function LookCtaButtons({
  hasAddedToCart,
  onAddToCart,
  onOpenCart,
  onTryOn
}: {
  hasAddedToCart?: boolean;
  onAddToCart?: () => void;
  onOpenCart?: () => void;
  onTryOn?: (context?: string) => void;
}) {
  const cartCtaLabel = hasAddedToCart ? "View cart" : "Add to cart";

  return (
    <View style={styles.ctaButtonRow}>
      <Pressable
        accessibilityLabel="Try on complete look"
        accessibilityRole="button"
        onPress={() => onTryOn?.("Complete look")}
        style={({ pressed }) => [
          styles.secondaryCta,
          pressed ? styles.pressed : null
        ]}
      >
        <Text style={styles.secondaryCtaText}>Try on</Text>
      </Pressable>
      <Pressable
        accessibilityLabel={
          hasAddedToCart
            ? "View cart"
            : "Add selected look pieces to cart"
        }
        accessibilityRole="button"
        onPress={hasAddedToCart ? onOpenCart : onAddToCart}
        style={({ pressed }) => [
          styles.primaryCta,
          pressed ? styles.pressed : null
        ]}
      >
        <Text style={styles.primaryCtaText}>{cartCtaLabel}</Text>
      </Pressable>
    </View>
  );
}

function StickyCtaBar({
  hasAddedToCart,
  onAddToCart,
  onOpenCart,
  onTryOn
}: {
  hasAddedToCart?: boolean;
  onAddToCart?: () => void;
  onOpenCart?: () => void;
  onTryOn?: (context?: string) => void;
}) {
  return (
    <View style={styles.ctaDock}>
      <LookCtaButtons
        hasAddedToCart={hasAddedToCart}
        onAddToCart={onAddToCart}
        onOpenCart={onOpenCart}
        onTryOn={onTryOn}
      />
    </View>
  );
}

function InlineCtaSection({
  hasAddedToCart,
  onAddToCart,
  onLayout,
  onOpenCart,
  onTryOn
}: {
  hasAddedToCart?: boolean;
  onAddToCart?: () => void;
  onLayout?: (event: LayoutChangeEvent) => void;
  onOpenCart?: () => void;
  onTryOn?: (context?: string) => void;
}) {
  return (
    <View onLayout={onLayout} style={styles.inlineCtaSection}>
      <LookCtaButtons
        hasAddedToCart={hasAddedToCart}
        onAddToCart={onAddToCart}
        onOpenCart={onOpenCart}
        onTryOn={onTryOn}
      />
    </View>
  );
}

const variations: Variation[] = [
  {
    changed: "Different trousers",
    id: "trouser-remix",
    image: prototypeProductImages.sandro.whitePinstripeSuit,
    match: "91% match",
    previewImages: [
      prototypeProductImages.maje.ivoryMiniDress,
      trouserImage,
      prototypeProductImages.maje.blueScarfTrousers
    ]
  },
  {
    changed: "Different layer",
    id: "layer-remix",
    image: prototypeProductImages.sandro.beigeTrench,
    match: "92% match",
    previewImages: [
      blazerImage,
      prototypeProductImages.maje.ivoryMiniDress,
      trouserImage
    ]
  },
  {
    changed: "Different shoes",
    id: "shoe-remix",
    image: prototypeProductImages.maje.blueScarfTrousers,
    match: "89% match",
    previewImages: [
      prototypeProductImages.maje.ivoryMiniDress,
      trouserImage,
      muleImage
    ]
  },
  {
    changed: "Add a bag",
    id: "bag-remix",
    image: prototypeProductImages.maje.stripedScarfDenim,
    match: "90% match",
    previewImages: [
      prototypeProductImages.maje.ivoryMiniDress,
      trouserImage,
      bagImage
    ]
  }
];

const similarItemLabels: Record<SimilarItemCategory, string> = {
  shoes: "Shoes",
  top: "Top",
  trousers: "Trousers"
};

const similarItemTabs: SimilarItemCategory[] = ["top", "trousers", "shoes"];

const similarShopItems: SimilarShopItem[] = [
  {
    category: "top",
    id: "ribbed-fitted-top",
    image: prototypeProductImages.maje.greenDenimTop,
    name: "Ribbed fitted top",
    price: "₹1,499"
  },
  {
    category: "top",
    id: "relaxed-cotton-tee",
    image: prototypeProductImages.maje.ivoryMiniDress,
    name: "Relaxed cotton tee",
    price: "₹1,299"
  },
  {
    category: "top",
    id: "airy-white-shirt",
    image: prototypeProductImages.sandro.whitePinstripeSuit,
    name: "Airy white shirt",
    price: "₹1,899"
  },
  {
    category: "trousers",
    id: "pleated-wide-trousers",
    image: prototypeProductImages.maje.blueScarfTrousers,
    name: "Pleated trousers",
    price: "₹2,899"
  },
  {
    category: "trousers",
    id: "linen-city-pants",
    image: prototypeProductImages.sandro.navyTailoredSet,
    name: "Linen city pants",
    price: "₹3,299"
  },
  {
    category: "trousers",
    id: "soft-neutral-trousers",
    image: prototypeProductImages.maje.khakiTrenchSkirt,
    name: "Soft neutral trousers",
    price: "₹2,499"
  },
  {
    category: "shoes",
    id: "block-heel-mules",
    image: similarShoeImage,
    name: "Block heel mules",
    price: "₹2,299"
  },
  {
    category: "shoes",
    id: "clean-slingbacks",
    image: similarSandalImage,
    name: "Clean slingbacks",
    price: "₹2,799"
  },
  {
    category: "shoes",
    id: "cream-low-sneakers",
    image: prototypeProductImages.sandro.beigeTrench,
    name: "Cream low sneakers",
    price: "₹1,999"
  }
];

export function ModelLookPdpScreen({
  cartCount = 0,
  hasStyleProfile = false,
  initialIsSaved,
  look,
  onAddToCart,
  onAskMira,
  onBack,
  onLookSavedChange,
  onOpenCart,
  onOpenPieceProduct,
  onOpenShopLook,
  onOpenWishlist,
  onShareLook,
  onStartTryOn,
  pieceOverrides
}: ModelLookPdpScreenProps) {
  const { height } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const contentSheetY = useRef<number | null>(null);
  const inlineCtaHeight = useRef(0);
  const inlineCtaY = useRef<number | null>(null);
  const similarSectionY = useRef(0);
  const [localIsSaved, setLocalIsSaved] = useState(false);
  const [hasAddedToCart, setHasAddedToCart] = useState(false);
  const [selectedSimilarCategory, setSelectedSimilarCategory] =
    useState<SimilarItemCategory>("top");
  const [showStickyCta, setShowStickyCta] = useState(true);
  const heroHeight = Math.round(height * 0.6);
  const defaultPieces = useMemo(() => buildLookPieces(look), [look]);
  const pieces =
    pieceOverrides && pieceOverrides.length > 0
      ? pieceOverrides
      : defaultPieces;
  const shopPieces = useMemo(() => getShopThisLookPieces(pieces), [pieces]);
  const shopPieceIdsKey = useMemo(
    () => shopPieces.map((piece) => piece.id).join("|"),
    [shopPieces]
  );
  const [shopCartSelection, setShopCartSelection] = useState<
    ShopThisLookCartItem[]
  >(() => getDefaultCartSelection(shopPieces));
  const isSaved = initialIsSaved ?? localIsSaved;
  const filteredSimilarItems = useMemo(
    () =>
      similarShopItems.filter((item) => item.category === selectedSimilarCategory),
    [selectedSimilarCategory]
  );

  useEffect(() => {
    setShopCartSelection(getDefaultCartSelection(shopPieces));
  }, [shopPieceIdsKey, shopPieces]);

  const handleAddToCart = useCallback(() => {
    if (shopCartSelection.length === 0) {
      return;
    }

    onAddToCart?.(shopCartSelection);
    setHasAddedToCart(true);
  }, [onAddToCart, shopCartSelection]);

  const handleToggleSave = () => {
    const nextSavedValue = !isSaved;

    if (onLookSavedChange) {
      onLookSavedChange(nextSavedValue);
      return;
    }

    setLocalIsSaved(nextSavedValue);
  };
  const handleOpenSimilar = () => {
    scrollViewRef.current?.scrollTo({
      animated: true,
      y: Math.max(
        0,
        heroHeight - contentSheetOverlap + similarSectionY.current - spacing.md
      )
    });
  };
  const handleLookScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetY = Math.max(0, event.nativeEvent.contentOffset.y);
    const viewportHeight = event.nativeEvent.layoutMeasurement.height || height;
    const viewportTop = offsetY + lookPdpHeaderHeight;
    const viewportBottom = offsetY + viewportHeight;
    const inlineTop =
      contentSheetY.current !== null && inlineCtaY.current !== null
        ? contentSheetY.current + inlineCtaY.current
        : null;
    const inlineBottom =
      inlineTop !== null ? inlineTop + inlineCtaHeight.current : null;
    const isInlineCtaVisible =
      inlineTop !== null &&
      inlineBottom !== null &&
      inlineTop < viewportBottom &&
      inlineBottom > viewportTop;
    const isBeforeInlineCta = inlineTop === null || viewportTop < inlineTop;
    const shouldShowStickyCta = isBeforeInlineCta && !isInlineCtaVisible;

    setShowStickyCta((current) =>
      current === shouldShowStickyCta ? current : shouldShowStickyCta
    );
  };

  return (
    <View style={styles.screen}>
      <LookPdpHeader
        cartCount={cartCount}
        onBack={onBack}
        onOpenCart={onOpenCart}
        onOpenWishlist={onOpenWishlist}
      />
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: ctaDockHeight + spacing.xl,
            paddingTop: lookPdpHeaderHeight
          }
        ]}
        onScroll={handleLookScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <HeroLookImage
          hasStyleProfile={hasStyleProfile}
          heroHeight={heroHeight}
          isSaved={isSaved}
          look={look}
          onOpenSimilar={handleOpenSimilar}
          onSave={handleToggleSave}
        />

        <View
          onLayout={(event) => {
            contentSheetY.current = event.nativeEvent.layout.y;
          }}
          style={styles.contentSheet}
        >
          <LookInfoStrip
            look={look}
            onShareLook={onShareLook}
          />

          <ShopThisLookSection
            onCartSelectionChange={setShopCartSelection}
            onOpenPieceProduct={onOpenPieceProduct}
            onOpenShopLook={onOpenShopLook}
            pieces={shopPieces}
          />

          <MiraNote onAskMira={onAskMira} />

          <InlineCtaSection
            hasAddedToCart={hasAddedToCart}
            onAddToCart={handleAddToCart}
            onLayout={(event) => {
              inlineCtaY.current = event.nativeEvent.layout.y;
              inlineCtaHeight.current = event.nativeEvent.layout.height;
            }}
            onOpenCart={onOpenCart}
            onTryOn={onStartTryOn}
          />

          <View style={styles.section}>
            <SectionHeading title="Wear it differently" />
            <ScrollView
              horizontal
              contentContainerStyle={styles.similarItemsTrack}
              style={styles.lookCarouselRail}
              showsHorizontalScrollIndicator={false}
            >
              {variations.map((variation, index) => (
                <VariationCard
                  hasStyleProfile={hasStyleProfile}
                  image={variation.image}
                  key={variation.id}
                  style={[
                    index === 0 ? styles.firstLookCarouselCard : null,
                    index === variations.length - 1
                      ? styles.lastLookCarouselCard
                      : null
                  ]}
                  variation={variation}
                />
              ))}
            </ScrollView>
          </View>

          <View
            onLayout={(event) => {
              similarSectionY.current = event.nativeEvent.layout.y;
            }}
            style={styles.shopSimilarSection}
          >
            <Text style={styles.sectionTitle}>Shop similar items</Text>
            <View style={styles.shopSimilarTabs}>
              {similarItemTabs.map((tab) => {
                const isSelected = selectedSimilarCategory === tab;

                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    key={tab}
                    onPress={() => setSelectedSimilarCategory(tab)}
                    style={[
                      styles.shopSimilarTab,
                      isSelected ? styles.shopSimilarTabSelected : null
                    ]}
                  >
                    <Text
                      style={[
                        styles.shopSimilarTabText,
                        isSelected ? styles.shopSimilarTabTextSelected : null
                      ]}
                    >
                      {similarItemLabels[tab]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <ScrollView
              horizontal
              contentContainerStyle={styles.lookCarouselTrack}
              style={styles.lookCarouselRail}
              showsHorizontalScrollIndicator={false}
            >
              {filteredSimilarItems.map((item, index) => (
                <SimilarItemCard
                  item={item}
                  key={item.id}
                  style={[
                    index === 0 ? styles.firstLookCarouselCard : null,
                    index === filteredSimilarItems.length - 1
                      ? styles.lastLookCarouselCard
                      : null
                  ]}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {showStickyCta ? (
        <StickyCtaBar
          hasAddedToCart={hasAddedToCart}
          onAddToCart={handleAddToCart}
          onOpenCart={onOpenCart}
          onTryOn={onStartTryOn}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.background
  },
  contentSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    gap: spacing.xl,
    marginTop: -contentSheetOverlap,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xl
  },
  ctaButtonRow: {
    flexDirection: "row",
    gap: spacing.sm,
    width: "100%"
  },
  ctaDock: {
    backgroundColor: colors.background,
    bottom: 0,
    elevation: 14,
    left: 0,
    paddingBottom: ctaBottomInset,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    position: "absolute",
    right: 0,
    shadowColor: "#000000",
    shadowOffset: { height: -4, width: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 12
  },
  firstLookCarouselCard: {
    marginLeft: spacing.screen
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
    position: "relative",
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
    backgroundColor: colors.imageSurface,
    overflow: "hidden"
  },
  heroImage: {
    backgroundColor: colors.imageSurface,
    height: "100%",
    width: "100%"
  },
  heroSimilarButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 0.5,
    bottom: spacing.xl + spacing.md,
    height: 48,
    justifyContent: "center",
    left: spacing.screen,
    position: "absolute",
    width: 48
  },
  heroWishlistButton: {
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
  heroMatchTag: {
    left: 0,
    position: "absolute",
    top: spacing.lg
  },
  infoStrip: {
    gap: 0
  },
  inlineCtaSection: {
    marginHorizontal: 0
  },
  lookCarouselRail: {
    marginHorizontal: -spacing.screen
  },
  lookCarouselTrack: {
    gap: spacing.md
  },
  lookMeta: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 17,
    marginTop: spacing.sm
  },
  lookName: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.heading,
    fontSize: 22,
    lineHeight: 28,
    minWidth: 0
  },
  lookNameRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md
  },
  lookShareButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 0.5,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  lastLookCarouselCard: {
    marginRight: spacing.screen
  },
  miraBody: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    marginTop: spacing.sm
  },
  miraCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14
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
  miraInlineLink: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    textDecorationLine: "underline"
  },
  miraSecondaryCta: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    marginTop: spacing.sm,
    width: "100%"
  },
  miraSecondaryCtaText: {
    color: colors.text,
    fontFamily: fonts.cta,
    fontSize: 12,
    lineHeight: 15
  },
  miraTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 14,
    lineHeight: 18
  },
  pdpHeader: {
    backgroundColor: colors.background,
    borderBottomColor: colors.border,
    borderBottomWidth: 0.5,
    elevation: 8,
    height: lookPdpHeaderHeight,
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
  pdpHeaderRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    height: 44
  },
  pressed: {
    opacity: 0.72
  },
  primaryCta: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: 24,
    flex: 1,
    height: 48,
    justifyContent: "center"
  },
  primaryCtaText: {
    color: colors.inverseText,
    fontFamily: fonts.cta,
    fontSize: 14,
    lineHeight: 18
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1
  },
  secondaryCta: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    flex: 1,
    height: 48,
    justifyContent: "center"
  },
  secondaryCtaText: {
    color: colors.text,
    fontFamily: fonts.cta,
    fontSize: 14,
    lineHeight: 18
  },
  section: {
    gap: spacing.md
  },
  sectionAction: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 17
  },
  sectionCopy: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 17,
    marginTop: 2
  },
  sectionHeadingCopy: {
    flex: 1,
    minWidth: 0
  },
  sectionHeadingRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between"
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 23
  },
  shopSimilarSection: {
    gap: spacing.md
  },
  shopSimilarTab: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 999,
    height: 38,
    justifyContent: "center",
    paddingHorizontal: 20
  },
  shopSimilarTabSelected: {
    backgroundColor: colors.text
  },
  shopSimilarTabText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 17
  },
  shopSimilarTabTextSelected: {
    color: colors.inverseText
  },
  shopSimilarTabs: {
    flexDirection: "row",
    gap: spacing.sm
  },
  shopThisLookCopy: {
    flex: 1,
    justifyContent: "center",
    minWidth: 0,
    paddingVertical: 1
  },
  shopThisLookImage: {
    height: "100%",
    width: "100%"
  },
  shopThisLookHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between"
  },
  shopThisLookList: {
    gap: spacing.md,
    overflow: "visible",
    position: "relative"
  },
  shopThisLookName: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 20
  },
  shopThisLookPieceInactive: {
    opacity: 0.42
  },
  shopThisLookPrice: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 15,
    lineHeight: 19,
    marginTop: 7
  },
  shopThisLookProductName: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 17,
    marginTop: 1,
    minWidth: 0
  },
  shopThisLookRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    zIndex: 1
  },
  shopThisLookRowActive: {
    elevation: 8,
    zIndex: 10
  },
  shopThisLookSection: {
    gap: spacing.md
  },
  shopThisLookSizeMenu: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    elevation: 8,
    left: 0,
    minWidth: 88,
    overflow: "hidden",
    position: "absolute",
    shadowColor: "#000000",
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    top: 36,
    zIndex: 20
  },
  shopThisLookSizeModal: {
    flex: 1
  },
  shopThisLookSizeOption: {
    alignItems: "center",
    minHeight: 34,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  shopThisLookSizeOptionSelected: {
    backgroundColor: colors.surface
  },
  shopThisLookSizeOptionText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14
  },
  shopThisLookSizePicker: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 9,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    minHeight: 32,
    minWidth: 72,
    paddingHorizontal: 12
  },
  shopThisLookSizeValue: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 17
  },
  shopThisLookSizeWrap: {
    alignItems: "flex-start",
    height: 32,
    marginTop: 6,
    position: "relative",
    zIndex: 20
  },
  shopThisLookSwap: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 21,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  shopThisLookSwapInactive: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1
  },
  shopThisLookThumb: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    height: 104,
    overflow: "hidden",
    width: 88
  },
  shopThisLookTitle: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    lineHeight: 21
  },
  shopThisLookTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
    minWidth: 0
  },
  shopThisLookTotal: {
    color: colors.text,
    flexShrink: 0,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 23
  },
  similarItemCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    width: 154
  },
  similarItemImageWrap: {
    alignItems: "flex-end",
    aspectRatio: 3 / 4,
    backgroundColor: colors.surface,
    padding: 8
  },
  similarItemImageStyle: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  similarItemInfo: {
    backgroundColor: colors.background,
    padding: 12
  },
  similarItemName: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 14,
    lineHeight: 18
  },
  similarItemPrice: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 18,
    marginTop: 4
  },
  similarItemSave: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    height: 32,
    justifyContent: "center",
    width: 32
  },
  similarItemSaveWrap: {
    alignItems: "flex-end"
  },
  similarItemsTrack: {
    gap: spacing.sm
  },
  variationCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    width: lookCarouselCardWidth
  },
  variationFooter: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    flexDirection: "row",
    height: 34,
    justifyContent: "space-between",
    paddingHorizontal: spacing.sm
  },
  variationImageWrap: {
    alignItems: "flex-end",
    aspectRatio: 3 / 4,
    backgroundColor: colors.imageSurface,
    padding: spacing.sm
  },
  variationImageStyle: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  variationContextPill: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 0.5,
    maxWidth: 90,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  variationContextText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    lineHeight: 13
  },
  variationMatchTag: {
    marginLeft: spacing.xs,
    marginRight: -spacing.sm
  },
  variationMatchTagText: {
    fontSize: 10,
    lineHeight: 13
  },
  variationSaveButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    height: 32,
    justifyContent: "center",
    width: 32
  },
  variationSaveWrap: {
    alignItems: "flex-end"
  },
  variationThumb: {
    backgroundColor: colors.imageSurface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    height: 24,
    overflow: "hidden",
    width: 24
  },
  variationThumbImage: {
    height: "100%",
    width: "100%"
  },
  variationThumbOverlap: {
    marginLeft: -8
  },
  variationThumbRow: {
    alignItems: "center",
    flexDirection: "row",
    minWidth: 54
  },
});
