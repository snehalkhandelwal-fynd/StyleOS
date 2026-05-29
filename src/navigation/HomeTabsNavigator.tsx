import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  AppState,
  Easing,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";

import { BottomTabBar } from "../features/home/components/BottomTabBar";
import type { ProductListingProduct } from "../features/home/components/ProductListingScreen";
import {
  AccountScreen,
  type AccountPage
} from "../features/home/screens/AccountScreen";
import { getStyleCardsForFashionInterest } from "../data/styleQuiz";
import {
  buildLookPieces,
  getPieceAlternatives,
  getRupeeValue,
  type LookPiece
} from "../features/home/data/lookPieces";
import { BrandPlpScreen } from "../features/home/screens/BrandPlpScreen";
import { CartScreen, type CartItem } from "../features/home/screens/CartScreen";
import {
  ClosetScreen,
  type ClosetAutoPairItem
} from "../features/home/screens/ClosetScreen";
import { ExploreScreen } from "../features/home/screens/ExploreScreen";
import { HomeScreen } from "../features/home/screens/HomeScreen";
import type {
  OutfitPieceKind,
  ProductLook
} from "../features/home/screens/HomeScreen";
import {
  ModelLookPdpScreen,
  type ShopThisLookCartItem
} from "../features/home/screens/ModelLookPdpScreen";
import { ProductPdpScreen } from "../features/home/screens/ProductPdpScreen";
import { SearchDiscoveryScreen } from "../features/home/screens/SearchDiscoveryScreen";
import { StylistScreen } from "../features/home/screens/StylistScreen";
import {
  ShopThisLookScreen,
  TRY_ON_RENDER_DELAY_MS,
  TryOnScreen,
  type TryOnExitState
} from "../features/home/screens/TryOnScreen";
import { hasCompletedStyleProfile } from "../features/home/utils/stylePersonalization";
import type {
  EditableProfile,
  OnboardingDraft
} from "../features/onboarding/viewModels/useOnboardingViewModel";
import { colors, fonts, spacing } from "../theme";
import type { HomeTabName } from "./types";

type HomeTabsNavigatorProps = {
  draft: OnboardingDraft;
  initialAccountPage?: AccountPage | null;
  initialTab: HomeTabName;
  isGuest: boolean;
  onChangeAddress: () => void;
  onSelectPhoto: (uri: string) => void;
  onStartStyleQuiz: (
    returnTab?: HomeTabName,
    returnAccountPage?: AccountPage
  ) => void;
  onStatusBarBackgroundChange?: (backgroundColor: string) => void;
  onUpdateProfile: (profile: EditableProfile) => void;
};

type TryOnEntry = {
  context?: string;
  lockOwnedPiecesInEditor?: boolean;
  look?: ProductLook;
  renderDelayMs?: number;
  returnTab: HomeTabName;
  useSessionPiecesForShop?: boolean;
};

type LookSessionSnapshot = {
  isSaved: boolean;
  pieces: LookPiece[];
};

type TryOnRenderState = {
  entry: TryOnEntry | null;
  isBrowsing: boolean;
  startedAt: number | null;
  status: "idle" | "ready" | "rendering";
};

type SelectedLookShopReturnTarget = "home" | "look-detail";

function toProductListingProductFromLookPiece(
  piece: LookPiece,
  look?: ProductLook
): ProductListingProduct {
  return {
    brand: piece.brand,
    id: `look-piece-${piece.id}`,
    image: piece.image,
    match: look?.match,
    occasion: look?.vibe,
    price: piece.price,
    priceValue: getRupeeValue(piece.price),
    sizeOptions: piece.sizes,
    styleLabel: piece.category,
    title: piece.name,
    tries: look?.tries,
    vibe: look?.vibe
  };
}

const cartColorByPieceKind: Record<LookPiece["kind"], string> = {
  accessory: "As shown",
  bag: "As shown",
  bottom: "Neutral",
  dress: "As shown",
  jacket: "As shown",
  shoe: "As shown",
  top: "Ivory"
};

function getCartItemCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

function toCartItemFromLookSelection(
  item: ShopThisLookCartItem,
  look?: ProductLook
): CartItem {
  const { piece, size } = item;

  return {
    brand: piece.brand,
    color: cartColorByPieceKind[piece.kind],
    id: `${look?.id ?? "look"}-${piece.id}-${size}`,
    image: piece.image,
    price: piece.price,
    quantity: 1,
    size,
    title: piece.name
  };
}

function toCartItemFromProduct(product: ProductListingProduct): CartItem {
  const size =
    product.sizeOptions?.[Math.min(1, product.sizeOptions.length - 1)] ??
    product.sizeOptions?.[0] ??
    "One";

  return {
    brand: product.brand ?? "Stylus",
    color: product.color ?? "As shown",
    id: `product-${product.id}-${size}`,
    image: product.image,
    originalPrice: product.originalPrice,
    price: product.price,
    quantity: 1,
    size,
    title: product.title
  };
}

function toStylistProductLook(pieces: LookPiece[]): ProductLook {
  const topPiece = pieces.find((piece) => piece.kind === "top");
  const total = pieces.reduce(
    (sum, piece) => sum + getRupeeValue(piece.price),
    0
  );

  return {
    brand: "Stylus",
    id: `stylist-look-${Date.now()}`,
    image: topPiece?.image ?? pieces[0]?.image ?? "",
    itemCount: `${pieces.length} pieces`,
    match: "Try now",
    outfitItems: pieces.map((piece) => ({
      image: piece.image,
      kind: piece.kind,
      label: piece.category
    })),
    price: total > 0 ? `From ₹${total.toLocaleString("en-IN")}` : "Try now",
    title: "Your styled look",
    tries: "Ready to try",
    vibe: "Styled by you"
  };
}

function getClosetAutoPairKind(item: ClosetAutoPairItem): OutfitPieceKind {
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

function getAutoPairComplementKinds(
  closetKind: OutfitPieceKind
): OutfitPieceKind[] {
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

function getAutoPairScore(piece: LookPiece, item: ClosetAutoPairItem) {
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

  if (
    itemSignals.includes("denim") &&
    (pieceSignals.includes("white") ||
      pieceSignals.includes("cream") ||
      pieceSignals.includes("brown"))
  ) {
    score += 5;
  }

  return score;
}

function getAutoPairPiece(
  kind: OutfitPieceKind,
  item: ClosetAutoPairItem,
  index: number
): LookPiece {
  const alternatives = getPieceAlternatives(kind);
  const bestPiece =
    alternatives
      .map((piece, optionIndex) => ({
        piece,
        score: getAutoPairScore(piece, item) - optionIndex
      }))
      .sort((first, second) => second.score - first.score)[0]?.piece ??
    alternatives[0];

  return {
    ...bestPiece,
    id: `auto-pair-${item.id}-${kind}-${index}`,
    isOwned: false
  };
}

function buildClosetAutoPairSession(item: ClosetAutoPairItem) {
  const closetKind = getClosetAutoPairKind(item);
  const ownedPiece: LookPiece = {
    brand: "Your closet",
    category: item.category,
    id: `closet-${item.id}`,
    image: item.image,
    isOwned: true,
    kind: closetKind,
    name: item.title,
    price: "₹0",
    sizes: ["One"]
  };
  const complementPieces = getAutoPairComplementKinds(closetKind).map(
    (kind, index) => getAutoPairPiece(kind, item, index)
  );
  const pieces = [ownedPiece, ...complementPieces];
  const buyableTotal = complementPieces.reduce(
    (sum, piece) => sum + getRupeeValue(piece.price),
    0
  );
  const look: ProductLook = {
    brand: "Mira",
    id: `closet-auto-pair-${item.id}-${Date.now()}`,
    image: item.image,
    itemCount: `${pieces.length} pieces`,
    match: "Auto-paired",
    outfitItems: pieces.map((piece) => ({
      image: piece.image,
      kind: piece.kind,
      label: piece.category
    })),
    price:
      buyableTotal > 0
        ? `From ₹${buyableTotal.toLocaleString("en-IN")}`
        : "Try now",
    title: `${item.title} auto-pair`,
    tries: "Ready to try",
    vibe: "Closet styled"
  };

  return { look, pieces };
}

function buildClosetBuildLookSession(
  item: ClosetAutoPairItem,
  pieces: LookPiece[]
) {
  const buyableTotal = pieces
    .filter((piece) => !piece.isOwned)
    .reduce((sum, piece) => sum + getRupeeValue(piece.price), 0);

  return {
    look: {
      brand: "Mira",
      id: `closet-build-look-${item.id}-${Date.now()}`,
      image: item.image,
      itemCount: `${pieces.length} pieces`,
      match: "Build look",
      outfitItems: pieces.map((piece) => ({
        image: piece.image,
        kind: piece.kind,
        label: piece.category
      })),
      price:
        buyableTotal > 0
          ? `From ₹${buyableTotal.toLocaleString("en-IN")}`
          : "Try now",
      title: `Build with ${item.title}`,
      tries: "Ready to build",
      vibe: "Closet builder"
    },
    pieces
  };
}

const renderStatusTopInset =
  Platform.OS === "ios" ? 44 : StatusBar.currentHeight ?? 0;
const closetAutoPairRenderDelayMs = 1800;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowAlert: true
  })
});

function TryOnRenderStatusBar({
  onPress,
  status
}: {
  onPress: () => void;
  status: "ready" | "rendering";
}) {
  const { width } = useWindowDimensions();
  const progress = useRef(new Animated.Value(0)).current;
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (status !== "rendering") {
      return undefined;
    }

    progress.setValue(0);
    const loop = Animated.loop(
      Animated.timing(progress, {
        duration: 1400,
        easing: Easing.inOut(Easing.ease),
        toValue: 1,
        useNativeDriver: true
      })
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [progress, status]);

  useEffect(() => {
    if (status !== "ready") {
      return undefined;
    }

    bounce.setValue(0);
    Animated.sequence([
      Animated.timing(bounce, {
        duration: 160,
        easing: Easing.out(Easing.quad),
        toValue: 1,
        useNativeDriver: true
      }),
      Animated.timing(bounce, {
        duration: 180,
        easing: Easing.in(Easing.quad),
        toValue: 0,
        useNativeDriver: true
      })
    ]).start();

    return undefined;
  }, [bounce, status]);

  const progressTranslateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-72, width]
  });
  const readyTranslateY = bounce.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -3]
  });
  const isReady = status === "ready";

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.renderStatusHost,
        isReady ? { transform: [{ translateY: readyTranslateY }] } : null
      ]}
    >
      <Pressable
        accessibilityLabel={
          isReady
            ? "Your look is ready. Tap to see it."
            : "Your look is being styled."
        }
        accessibilityRole={isReady ? "button" : "text"}
        disabled={!isReady}
        onPress={onPress}
        style={styles.renderStatusBar}
      >
        <Text
          numberOfLines={1}
          style={isReady ? styles.renderReadyText : styles.renderProgressText}
        >
          {isReady
            ? "Your look is ready! Tap to see it →"
            : "Your look is being styled..."}
        </Text>
        {!isReady ? (
          <View pointerEvents="none" style={styles.renderProgressTrack}>
            <Animated.View
              style={[
                styles.renderProgressLine,
                { transform: [{ translateX: progressTranslateX }] }
              ]}
            />
          </View>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

export function HomeTabsNavigator({
  draft,
  initialAccountPage,
  initialTab,
  isGuest,
  onChangeAddress,
  onSelectPhoto,
  onStartStyleQuiz,
  onStatusBarBackgroundChange,
  onUpdateProfile
}: HomeTabsNavigatorProps) {
  const renderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const readyToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const readyNotificationIdRef = useRef<string | null>(null);
  const appStateRef = useRef(AppState.currentState);
  const [activeTab, setActiveTab] = useState<HomeTabName>(initialTab);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [selectedLook, setSelectedLook] = useState<ProductLook | null>(null);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductListingProduct | null>(null);
  const [selectedProductReturnTab, setSelectedProductReturnTab] =
    useState<HomeTabName | null>(null);
  const [accountPageOverride, setAccountPageOverride] =
    useState<AccountPage | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isExploreInternalViewOpen, setIsExploreInternalViewOpen] =
    useState(false);
  const [isClosetInternalViewOpen, setIsClosetInternalViewOpen] =
    useState(false);
  const [isAccountInternalViewOpen, setIsAccountInternalViewOpen] =
    useState(false);
  const [tryOnEntry, setTryOnEntry] = useState<TryOnEntry | null>(null);
  const [tryOnRender, setTryOnRender] = useState<TryOnRenderState>({
    entry: null,
    isBrowsing: false,
    startedAt: null,
    status: "idle"
  });
  const [isTryOnShopLookOpen, setIsTryOnShopLookOpen] = useState(false);
  const [isSelectedLookShopOpen, setIsSelectedLookShopOpen] = useState(false);
  const [selectedLookShopReturnTarget, setSelectedLookShopReturnTarget] =
    useState<SelectedLookShopReturnTarget>("look-detail");
  const [shopLookPieces, setShopLookPieces] = useState<LookPiece[] | null>(
    null
  );
  const [isReadyToastVisible, setIsReadyToastVisible] = useState(false);
  const [lookSnapshots, setLookSnapshots] = useState<
    Record<string, LookSessionSnapshot>
  >({});
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

  const clearRenderTimer = useCallback(() => {
    if (!renderTimeoutRef.current) {
      return;
    }

    clearTimeout(renderTimeoutRef.current);
    renderTimeoutRef.current = null;
  }, []);

  const clearReadyToastTimer = useCallback(() => {
    if (!readyToastTimeoutRef.current) {
      return;
    }

    clearTimeout(readyToastTimeoutRef.current);
    readyToastTimeoutRef.current = null;
  }, []);

  const cancelReadyNotification = useCallback(async () => {
    if (!readyNotificationIdRef.current) {
      return;
    }

    await Notifications.cancelScheduledNotificationAsync(
      readyNotificationIdRef.current
    );
    readyNotificationIdRef.current = null;
  }, []);

  const scheduleReadyNotification = useCallback(
    async (remainingMs: number) => {
      const permission = await Notifications.getPermissionsAsync();

      if (permission.status !== "granted") {
        return;
      }

      await cancelReadyNotification();
      readyNotificationIdRef.current =
        await Notifications.scheduleNotificationAsync({
          content: {
            body: "Come see yourself in it.",
            sound: false,
            title: "Your styled look is ready"
          },
          trigger: {
            seconds: Math.max(1, Math.ceil(remainingMs / 1000))
          }
        });
    },
    [cancelReadyNotification]
  );

  const resetTryOnRender = useCallback(() => {
    clearRenderTimer();
    clearReadyToastTimer();
    void cancelReadyNotification();
    setIsReadyToastVisible(false);
    setTryOnRender({
      entry: null,
      isBrowsing: false,
      startedAt: null,
      status: "idle"
    });
  }, [cancelReadyNotification, clearReadyToastTimer, clearRenderTimer]);

  const persistTryOnSnapshot = useCallback(
    (state: TryOnExitState, sessionLook?: ProductLook) => {
      if (!sessionLook) {
        return;
      }

      setLookSnapshots((current) => ({
        ...current,
        [sessionLook.id]: {
          isSaved: state.isSaved,
          pieces: state.pieces
        }
      }));
    },
    []
  );

  const ensureNotificationPermission = useCallback(async () => {
    const existingPermission = await Notifications.getPermissionsAsync();

    if (existingPermission.status === "granted") {
      return true;
    }

    const nextPermission = await Notifications.requestPermissionsAsync();

    return nextPermission.status === "granted";
  }, []);

  const beginTryOnRender = useCallback(
    (entry: TryOnEntry) => {
      const hasAvatar = Boolean(draft.avatarUri ?? draft.fullBodyPhotoUri);
      const renderDelayMs = entry.renderDelayMs ?? TRY_ON_RENDER_DELAY_MS;

      clearRenderTimer();
      clearReadyToastTimer();
      setIsReadyToastVisible(false);

      if (!hasAvatar) {
        setTryOnRender({
          entry: null,
          isBrowsing: false,
          startedAt: null,
          status: "idle"
        });
        return;
      }

      setTryOnRender({
        entry,
        isBrowsing: false,
        startedAt: Date.now(),
        status: "rendering"
      });

      renderTimeoutRef.current = setTimeout(() => {
        renderTimeoutRef.current = null;
        if (appStateRef.current === "active") {
          void cancelReadyNotification();
        }
        setTryOnRender((current) =>
          current.entry === entry
            ? {
                ...current,
                status: "ready"
              }
            : current
        );
      }, renderDelayMs);
    },
    [
      cancelReadyNotification,
      clearReadyToastTimer,
      clearRenderTimer,
      draft.avatarUri,
      draft.fullBodyPhotoUri
    ]
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      appStateRef.current = nextState;

      if (nextState === "active") {
        void cancelReadyNotification();
        return;
      }

      if (tryOnRender.status !== "rendering" || !tryOnRender.startedAt) {
        return;
      }

      const elapsedMs = Date.now() - tryOnRender.startedAt;
      const renderDelayMs =
        tryOnRender.entry?.renderDelayMs ?? TRY_ON_RENDER_DELAY_MS;
      const remainingMs = renderDelayMs - elapsedMs;

      void scheduleReadyNotification(remainingMs);
    });

    return () => {
      subscription.remove();
    };
  }, [
    cancelReadyNotification,
    scheduleReadyNotification,
    tryOnRender.entry,
    tryOnRender.startedAt,
    tryOnRender.status
  ]);

  useEffect(
    () => () => {
      clearRenderTimer();
      clearReadyToastTimer();
    },
    [clearReadyToastTimer, clearRenderTimer]
  );

  useEffect(() => {
    if (tryOnRender.status !== "ready" || !tryOnRender.isBrowsing) {
      clearReadyToastTimer();
      setIsReadyToastVisible(false);
      return undefined;
    }

    setIsReadyToastVisible(true);
    clearReadyToastTimer();
    readyToastTimeoutRef.current = setTimeout(() => {
      readyToastTimeoutRef.current = null;
      setIsReadyToastVisible(false);
    }, 3000);

    return clearReadyToastTimer;
  }, [
    clearReadyToastTimer,
    tryOnRender.entry,
    tryOnRender.isBrowsing,
    tryOnRender.status
  ]);

  useEffect(() => {
    setActiveTab(initialTab);
    setSelectedBrandId(null);
    setSelectedLook(null);
    setSelectedProduct(null);
    setSelectedProductReturnTab(null);
    setAccountPageOverride(null);
    setIsSearchOpen(false);
    setIsExploreInternalViewOpen(false);
    setIsClosetInternalViewOpen(false);
    setIsAccountInternalViewOpen(false);
    setTryOnEntry(null);
    setIsTryOnShopLookOpen(false);
    setIsSelectedLookShopOpen(false);
    setSelectedLookShopReturnTarget("look-detail");
    setShopLookPieces(null);
    resetTryOnRender();
  }, [initialTab, resetTryOnRender]);

  useEffect(() => {
    const statusBarBackground =
      (activeTab === "Closet" && !isClosetInternalViewOpen) ||
      activeTab === "Profile"
        ? colors.surfaceTertiary
        : colors.background;

    onStatusBarBackgroundChange?.(
      statusBarBackground
    );

    return () => onStatusBarBackgroundChange?.(colors.background);
  }, [activeTab, isClosetInternalViewOpen, onStatusBarBackgroundChange]);

  const handleChangeTab = (tab: HomeTabName) => {
    const shouldKeepTryOnEntry = tryOnRender.status !== "idle";

    setSelectedBrandId(null);
    setSelectedLook(null);
    setSelectedProduct(null);
    setSelectedProductReturnTab(null);
    setAccountPageOverride(null);
    setIsSearchOpen(false);
    setIsExploreInternalViewOpen(false);
    setIsClosetInternalViewOpen(false);
    setIsTryOnShopLookOpen(false);
    setIsSelectedLookShopOpen(false);
    setSelectedLookShopReturnTarget("look-detail");
    setShopLookPieces(null);
    if (!shouldKeepTryOnEntry) {
      setTryOnEntry(null);
    }
    setActiveTab(tab);
  };

  const handleOpenWishlist = () => {
    handleChangeTab("Profile");
    setAccountPageOverride("wishlist");
  };

  const addCartItems = useCallback((items: CartItem[]) => {
    if (items.length === 0) {
      return;
    }

    setCartItems((current) => [
      ...current,
      ...items.map((item, index) => ({
        ...item,
        id: `${item.id}-cart-${current.length + index + 1}`
      }))
    ]);
    setCartCount((current) => current + getCartItemCount(items));
  }, []);

  const handleClearCart = useCallback(() => {
    setCartItems([]);
    setCartCount(0);
  }, []);

  const handleUpdateCartItemQuantity = useCallback(
    (itemId: string, nextQuantity: number) => {
      setCartItems((currentItems) => {
        const nextItems =
          nextQuantity <= 0
            ? currentItems.filter((item) => item.id !== itemId)
            : currentItems.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      quantity: nextQuantity
                    }
                  : item
              );

        setCartCount(getCartItemCount(nextItems));
        return nextItems;
      });
    },
    []
  );

  const handleAddSelectedLookToCart = useCallback(
    (items: ShopThisLookCartItem[]) => {
      const nextCartItems = items.map((item) =>
        toCartItemFromLookSelection(item, selectedLook ?? undefined)
      );

      addCartItems(nextCartItems);
    },
    [addCartItems, selectedLook]
  );

  const handleAddSelectedLookPieceToCart = useCallback(
    (piece: LookPiece, size: string) => {
      addCartItems([
        toCartItemFromLookSelection(
          { piece, size },
          selectedLook ?? undefined
        )
      ]);
    },
    [addCartItems, selectedLook]
  );

  const handleAddProductToCart = useCallback(
    (product: ProductListingProduct) => {
      addCartItems([toCartItemFromProduct(product)]);
    },
    [addCartItems]
  );

  const handleExploreInternalViewChange = useCallback((isOpen: boolean) => {
    setIsExploreInternalViewOpen(isOpen);
  }, []);

  const handleClosetInternalViewChange = useCallback((isOpen: boolean) => {
    setIsClosetInternalViewOpen(isOpen);
  }, []);

  const openTryOnSession = useCallback(
    (
      look?: ProductLook,
      context?: string,
      renderDelayMs?: number,
      useSessionPiecesForShop?: boolean,
      lockOwnedPiecesInEditor?: boolean
    ) => {
      const nextEntry = {
        context,
        lockOwnedPiecesInEditor,
        look,
        renderDelayMs,
        returnTab: activeTab,
        useSessionPiecesForShop
      };

      setTryOnEntry(nextEntry);
      beginTryOnRender(nextEntry);
      setIsTryOnShopLookOpen(false);
      setIsSelectedLookShopOpen(false);
      setSelectedLookShopReturnTarget("look-detail");
      setShopLookPieces(null);
      setIsSearchOpen(false);
      setIsExploreInternalViewOpen(false);
      setIsClosetInternalViewOpen(false);
      setActiveTab("TryOn");
    },
    [activeTab, beginTryOnRender]
  );

  const handleStartStylistTryOn = useCallback(
    (pieces: LookPiece[]) => {
      const stylistLook = toStylistProductLook(pieces);

      setLookSnapshots((current) => ({
        ...current,
        [stylistLook.id]: {
          isSaved: false,
          pieces
        }
      }));
      openTryOnSession(stylistLook, "Stylist");
    },
    [openTryOnSession]
  );

  const handleStartClosetAutoPairTryOn = useCallback(
    (item: ClosetAutoPairItem) => {
      const { look, pieces } = buildClosetAutoPairSession(item);

      setLookSnapshots((current) => ({
        ...current,
        [look.id]: {
          isSaved: false,
          pieces
        }
      }));
      openTryOnSession(
        look,
        "Closet auto-pair",
        closetAutoPairRenderDelayMs,
        true,
        true
      );
    },
    [openTryOnSession]
  );

  const handleStartClosetBuildLook = useCallback(
    (item: ClosetAutoPairItem, pieces: LookPiece[]) => {
      const { look } = buildClosetBuildLookSession(item, pieces);

      setLookSnapshots((current) => ({
        ...current,
        [look.id]: {
          isSaved: false,
          pieces
        }
      }));
      openTryOnSession(
        look,
        "Closet build look",
        closetAutoPairRenderDelayMs,
        true,
        true
      );
    },
    [openTryOnSession]
  );

  const handleTryOnClose = useCallback(
    (state: TryOnExitState) => {
      const sessionLook = tryOnEntry?.look;

      persistTryOnSnapshot(state, sessionLook);
      resetTryOnRender();

      setActiveTab(tryOnEntry?.returnTab ?? "Home");
      setTryOnEntry(null);
      setIsTryOnShopLookOpen(false);
      setIsSelectedLookShopOpen(false);
      setSelectedLookShopReturnTarget("look-detail");
      setShopLookPieces(null);
    },
    [persistTryOnSnapshot, resetTryOnRender, tryOnEntry]
  );

  const handleContinueBrowsingFromTryOn = useCallback(
    (state: TryOnExitState) => {
      const sessionLook = tryOnEntry?.look;

      persistTryOnSnapshot(state, sessionLook);
      setTryOnRender((current) =>
        current.status === "rendering"
          ? {
              ...current,
              isBrowsing: true
            }
          : current
      );
      void ensureNotificationPermission();
      setSelectedBrandId(null);
      setSelectedLook(null);
      setSelectedProduct(null);
      setSelectedProductReturnTab(null);
      setIsTryOnShopLookOpen(false);
      setIsSelectedLookShopOpen(false);
      setSelectedLookShopReturnTarget("look-detail");
      setShopLookPieces(null);
      setIsSearchOpen(false);
      setIsExploreInternalViewOpen(false);
      setActiveTab("Home");
    },
    [ensureNotificationPermission, persistTryOnSnapshot, tryOnEntry]
  );

  const handleViewCartFromTryOn = useCallback(
    (state: TryOnExitState) => {
      const sessionLook = tryOnEntry?.look;

      persistTryOnSnapshot(state, sessionLook);
      resetTryOnRender();

      setTryOnEntry(null);
      setSelectedBrandId(null);
      setSelectedLook(null);
      setSelectedProduct(null);
      setSelectedProductReturnTab(null);
      setIsTryOnShopLookOpen(false);
      setIsSelectedLookShopOpen(false);
      setSelectedLookShopReturnTarget("look-detail");
      setShopLookPieces(null);
      setActiveTab("Cart");
    },
    [persistTryOnSnapshot, resetTryOnRender, tryOnEntry]
  );

  const handleOpenShopLookFromTryOn = useCallback(
    (state: TryOnExitState) => {
      const sessionLook = tryOnEntry?.look;

      persistTryOnSnapshot(state, sessionLook);
      setShopLookPieces(state.pieces);
      setIsTryOnShopLookOpen(true);
      setIsSelectedLookShopOpen(false);
      setSelectedLookShopReturnTarget("look-detail");
      setSelectedBrandId(null);
      setSelectedLook(null);
      setSelectedProduct(null);
      setSelectedProductReturnTab(null);
      setIsSearchOpen(false);
      setIsExploreInternalViewOpen(false);
      setActiveTab("TryOn");
    },
    [persistTryOnSnapshot, tryOnEntry]
  );

  const handleBackFromShopLook = useCallback(() => {
    setIsTryOnShopLookOpen(false);
  }, []);

  const handleOpenShopLookFromSelectedLook = useCallback(
    (look?: ProductLook) => {
      const nextLook = look ?? selectedLook;

      if (!nextLook) {
        return;
      }

      setSelectedLook(nextLook);
      setSelectedProduct(null);
      setSelectedProductReturnTab(null);
      setSelectedBrandId(null);
      setTryOnEntry(null);
      setIsTryOnShopLookOpen(false);
      setIsSelectedLookShopOpen(true);
      setSelectedLookShopReturnTarget(look ? "home" : "look-detail");
      setShopLookPieces(
        lookSnapshots[nextLook.id]?.pieces ?? buildLookPieces(nextLook)
      );
      setIsSearchOpen(false);
      setIsExploreInternalViewOpen(false);
      setActiveTab("Home");
    },
    [lookSnapshots, selectedLook]
  );

  const handleBackFromSelectedLookShop = useCallback(() => {
    setIsSelectedLookShopOpen(false);
    setShopLookPieces(null);
    if (selectedLookShopReturnTarget === "home") {
      setSelectedLook(null);
    }
    setSelectedLookShopReturnTarget("look-detail");
  }, [selectedLookShopReturnTarget]);

  const handleViewCartFromSelectedLookShop = useCallback(() => {
    setIsSelectedLookShopOpen(false);
    setShopLookPieces(null);
    setSelectedLook(null);
    setSelectedProduct(null);
    setSelectedProductReturnTab(null);
    setSelectedLookShopReturnTarget("look-detail");
    setActiveTab("Cart");
  }, []);

  const handleAddShopPieceToCart = useCallback(
    (piece: LookPiece, size: string) => {
      addCartItems([
        toCartItemFromLookSelection(
          { piece, size },
          tryOnEntry?.look ?? undefined
        )
      ]);
    },
    [addCartItems, tryOnEntry?.look]
  );

  const handleViewCartFromShopLook = useCallback(() => {
    setIsTryOnShopLookOpen(false);
    setShopLookPieces(null);
    setSelectedProduct(null);
    setSelectedProductReturnTab(null);
    setActiveTab("Cart");
  }, []);

  const handleOpenReadyLook = useCallback(() => {
    const readyEntry = tryOnRender.entry;

    if (!readyEntry) {
      return;
    }

    setTryOnEntry(readyEntry);
    setIsReadyToastVisible(false);
    setTryOnRender((current) => ({
      ...current,
      isBrowsing: false
    }));
    setIsTryOnShopLookOpen(false);
    setIsSelectedLookShopOpen(false);
    setSelectedLookShopReturnTarget("look-detail");
    setShopLookPieces(null);
    setIsSearchOpen(false);
    setIsExploreInternalViewOpen(false);
    setActiveTab("TryOn");
  }, [tryOnRender.entry]);

  const handleOpenProductFromBrand = useCallback(
    (product: ProductListingProduct) => {
      setSelectedProductReturnTab(null);
      setSelectedProduct(product);
    },
    []
  );

  const handleOpenProductFromLookPiece = useCallback(
    (piece: LookPiece) => {
      setSelectedProductReturnTab(null);
      setSelectedProduct(
        toProductListingProductFromLookPiece(piece, selectedLook ?? undefined)
      );
      setSelectedBrandId(null);
      setIsSelectedLookShopOpen(false);
      setIsSearchOpen(false);
      setIsExploreInternalViewOpen(false);
      setActiveTab("Home");
    },
    [selectedLook]
  );

  const handleOpenLookFromProductPdp = useCallback((look: ProductLook) => {
    setSelectedProduct(null);
    setSelectedProductReturnTab(null);
    setSelectedLook(look);
    setSelectedBrandId(null);
    setIsSelectedLookShopOpen(false);
    setIsSearchOpen(false);
    setIsExploreInternalViewOpen(false);
    setActiveTab("Home");
  }, []);

  const handleOpenProductFromTryOn = useCallback(
    (product: ProductListingProduct) => {
      setSelectedBrandId(null);
      setSelectedLook(null);
      setSelectedProductReturnTab("TryOn");
      setSelectedProduct(product);
      setIsSearchOpen(false);
      setIsExploreInternalViewOpen(false);
      setActiveTab("TryOn");
    },
    []
  );

  const handleProductPdpBack = useCallback(() => {
    const returnTab = selectedProductReturnTab;

    setSelectedProduct(null);
    setSelectedProductReturnTab(null);

    if (returnTab) {
      setActiveTab(returnTab);
    }
  }, [selectedProductReturnTab]);

  const shouldShowRenderStatus =
    tryOnRender.isBrowsing &&
    tryOnRender.status === "ready" &&
    isReadyToastVisible;
  const shouldShowStylistFallback =
    activeTab === "TryOn" &&
    !tryOnEntry &&
    !selectedProduct &&
    !isTryOnShopLookOpen &&
    tryOnRender.status === "idle";
  const renderStatusBar = shouldShowRenderStatus ? (
    <TryOnRenderStatusBar
      onPress={handleOpenReadyLook}
      status="ready"
    />
  ) : null;

  if (isSearchOpen) {
    return (
      <View style={styles.screen}>
        <SearchDiscoveryScreen onClose={() => setIsSearchOpen(false)} />
        {renderStatusBar}
      </View>
    );
  }

  const shouldShowBottomTabs =
    !selectedLook &&
    !selectedProduct &&
    !selectedBrandId &&
    activeTab !== "Cart" &&
    (activeTab !== "TryOn" || shouldShowStylistFallback) &&
    !(activeTab === "Feed" && isExploreInternalViewOpen) &&
    !(activeTab === "Closet" && isClosetInternalViewOpen) &&
    !(activeTab === "Profile" && isAccountInternalViewOpen);
  const hasStyleProfile = hasCompletedStyleProfile(draft);
  const styleQuiz = draft.styleQuiz;
  const styleCardsForInterest = getStyleCardsForFashionInterest(
    draft.fashionInterest
  );
  const styleLabelById = Object.fromEntries(
    styleCardsForInterest.map((card) => [card.id, card.label])
  );
  const likedStyleLabels =
    styleQuiz?.likedStyleIds
      .map((styleId) => styleLabelById[styleId])
      .filter((label): label is string => Boolean(label)) ?? [];
  const styleProfile = {
    answeredCount:
      (styleQuiz?.likedStyleIds.length ?? 0) +
      (styleQuiz?.rejectedStyleIds.length ?? 0),
    isRecorded: hasStyleProfile,
    likedStyleLabels,
    requiredCount: 5,
    skipped: styleQuiz?.skipped
  };
  const selectedLookSnapshot = selectedLook
    ? lookSnapshots[selectedLook.id]
    : undefined;
  const tryOnLookSnapshot = tryOnEntry?.look
    ? lookSnapshots[tryOnEntry.look.id]
    : undefined;

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        {activeTab === "Home" && selectedProduct ? (
          <ProductPdpScreen
            cartCount={cartCount}
            hasStyleProfile={hasStyleProfile}
            onAddToCart={() => handleAddProductToCart(selectedProduct)}
            onAskMira={() => handleChangeTab("AIStylist")}
            onBack={handleProductPdpBack}
            onOpenCart={() => handleChangeTab("Cart")}
            onOpenLook={handleOpenLookFromProductPdp}
            onOpenSearch={() => setIsSearchOpen(true)}
            onStartTryOn={(context) => openTryOnSession(undefined, context)}
            product={selectedProduct}
          />
        ) : null}
        {activeTab === "Home" &&
        selectedLook &&
        isSelectedLookShopOpen &&
        !selectedProduct ? (
          <ShopThisLookScreen
            cartCount={cartCount}
            look={selectedLook}
            onAddPieceToCart={handleAddSelectedLookPieceToCart}
            onBack={handleBackFromSelectedLookShop}
            onOpenProduct={handleOpenProductFromBrand}
            onViewCart={handleViewCartFromSelectedLookShop}
            pieces={
              shopLookPieces ??
              selectedLookSnapshot?.pieces ??
              buildLookPieces(selectedLook)
            }
          />
        ) : null}
        {activeTab === "Home" &&
        selectedLook &&
        !isSelectedLookShopOpen &&
        !selectedProduct ? (
          <ModelLookPdpScreen
            cartCount={cartCount}
            hasStyleProfile={hasStyleProfile}
            initialIsSaved={selectedLookSnapshot?.isSaved}
            look={selectedLook}
            onAddToCart={handleAddSelectedLookToCart}
            onAskMira={() => handleChangeTab("AIStylist")}
            onBack={() => {
              setIsSelectedLookShopOpen(false);
              setSelectedLook(null);
            }}
            onLookSavedChange={(isSaved) => {
              setLookSnapshots((current) => ({
                ...current,
                [selectedLook.id]: {
                  isSaved,
                  pieces:
                    current[selectedLook.id]?.pieces ??
                    selectedLookSnapshot?.pieces ??
                    []
                }
              }));
            }}
            onOpenCart={() => handleChangeTab("Cart")}
            onOpenPieceProduct={handleOpenProductFromLookPiece}
            onOpenShopLook={() => handleOpenShopLookFromSelectedLook()}
            onStartTryOn={(context) => openTryOnSession(selectedLook, context)}
            pieceOverrides={selectedLookSnapshot?.pieces}
          />
        ) : null}
        {activeTab === "Home" && selectedBrandId && !selectedLook && !selectedProduct ? (
          <BrandPlpScreen
            brandId={selectedBrandId}
            cartCount={cartCount}
            hasStyleProfile={hasStyleProfile}
            onBack={() => setSelectedBrandId(null)}
            onOpenCart={() => handleChangeTab("Cart")}
            onOpenProduct={handleOpenProductFromBrand}
          />
        ) : null}
        {activeTab === "Home" && !selectedBrandId && !selectedLook && !selectedProduct ? (
          <HomeScreen
            cartCount={cartCount}
            draft={draft}
            isGuest={isGuest}
            onChangeAddress={onChangeAddress}
            onOpenBrand={setSelectedBrandId}
            onOpenCart={() => handleChangeTab("Cart")}
            onOpenLook={(look) => {
              setIsSelectedLookShopOpen(false);
              setShopLookPieces(null);
              setSelectedLook(look);
            }}
            onOpenSearch={() => setIsSearchOpen(true)}
            onShopLook={handleOpenShopLookFromSelectedLook}
            onStartStyleQuiz={onStartStyleQuiz}
          />
        ) : null}
        {activeTab === "TryOn" && selectedProduct ? (
          <ProductPdpScreen
            cartCount={cartCount}
            hasStyleProfile={hasStyleProfile}
            onAddToCart={() => handleAddProductToCart(selectedProduct)}
            onAskMira={() => handleChangeTab("AIStylist")}
            onBack={handleProductPdpBack}
            onOpenCart={handleViewCartFromShopLook}
            onOpenLook={setSelectedLook}
            onOpenSearch={() => setIsSearchOpen(true)}
            onStartTryOn={(context) => openTryOnSession(undefined, context)}
            product={selectedProduct}
          />
        ) : null}
        {activeTab === "TryOn" && !selectedProduct && isTryOnShopLookOpen ? (
          <ShopThisLookScreen
            cartCount={cartCount}
            look={tryOnEntry?.look}
            onAddPieceToCart={handleAddShopPieceToCart}
            onBack={handleBackFromShopLook}
            onOpenProduct={handleOpenProductFromTryOn}
            onViewCart={handleViewCartFromShopLook}
            pieces={shopLookPieces ?? tryOnLookSnapshot?.pieces ?? []}
            useProvidedPieces={tryOnEntry?.useSessionPiecesForShop}
          />
        ) : null}
        {activeTab === "TryOn" &&
        !selectedProduct &&
        !isTryOnShopLookOpen &&
        !shouldShowStylistFallback ? (
          <TryOnScreen
            cartCount={cartCount}
            draft={draft}
            hideHeaderTitle={tryOnEntry?.context === "Closet build look"}
            initialIsSaved={tryOnLookSnapshot?.isSaved}
            initialPieces={tryOnLookSnapshot?.pieces}
            isCreatingLook={tryOnRender.status === "rendering"}
            lockOwnedPiecesInEditor={tryOnEntry?.lockOwnedPiecesInEditor}
            look={tryOnEntry?.look}
            onCartUpdated={(pieceCount) =>
              setCartCount((current) => current + pieceCount)
            }
            onClose={handleTryOnClose}
            onContinueBrowsing={handleContinueBrowsingFromTryOn}
            onOpenProduct={handleOpenProductFromTryOn}
            onOpenShopLook={handleOpenShopLookFromTryOn}
            onSelectPhoto={onSelectPhoto}
            onViewCart={handleViewCartFromTryOn}
            useSessionPiecesForShop={tryOnEntry?.useSessionPiecesForShop}
          />
        ) : null}
        {activeTab === "Stylist" || shouldShowStylistFallback ? (
          <StylistScreen
            onTryOn={handleStartStylistTryOn}
            onUploadItems={() => handleChangeTab("Closet")}
          />
        ) : null}
        {activeTab === "Closet" ? (
          <ClosetScreen
            cartCount={cartCount}
            onAskMira={() => handleChangeTab("AIStylist")}
            onInternalViewChange={handleClosetInternalViewChange}
            onOpenCart={() => handleChangeTab("Cart")}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenWishlist={handleOpenWishlist}
            onStartAutoPairTryOn={handleStartClosetAutoPairTryOn}
            onStartTryOn={handleStartClosetBuildLook}
          />
        ) : null}
        {activeTab === "Feed" ? (
          <ExploreScreen
            cartCount={cartCount}
            hasStyleProfile={hasStyleProfile}
            onInternalViewChange={handleExploreInternalViewChange}
            onAskMira={() => handleChangeTab("AIStylist")}
            onOpenCart={() => handleChangeTab("Cart")}
            onOpenSearch={() => setIsSearchOpen(true)}
            onStartTryOn={(context) => openTryOnSession(undefined, context)}
          />
        ) : null}
        {activeTab === "AIStylist" ? (
          <ExploreScreen
            copy="Ask Mira about style, outfits, and what to buy."
            title="AI Stylist"
          />
        ) : null}
        {activeTab === "Cart" ? (
          <CartScreen
            items={cartItems}
            onBack={() => handleChangeTab("Home")}
            onClearCart={handleClearCart}
            onUpdateItemQuantity={handleUpdateCartItemQuantity}
          />
        ) : null}
        {activeTab === "Profile" ? (
          <AccountScreen
            actions={{
              onOpenCloset: () => handleChangeTab("Closet"),
              onOpenExplore: () => handleChangeTab("Feed"),
              onStartStyleQuiz: () => onStartStyleQuiz("Profile", "style"),
              onStartTryOn: (context) => openTryOnSession(undefined, context),
              onUpdateProfile
            }}
            appVersion="1.0.1"
            initialPage={accountPageOverride ?? initialAccountPage}
            onInternalViewChange={setIsAccountInternalViewOpen}
            styleProfile={styleProfile}
            user={{
              anniversary: draft.anniversary,
              avatarUri: draft.avatarUri,
              dateOfBirth: draft.dateOfBirth,
              email: draft.email,
              fashionInterest: draft.fashionInterest,
              name: draft.name?.trim() || "Guest",
              phone: draft.phone,
              phoneNumber: draft.phone
                ? `${draft.phone.countryCode} ${draft.phone.phoneNumber}`
                : undefined
            }}
          />
        ) : null}
      </View>
      {shouldShowBottomTabs ? (
        <View pointerEvents="box-none" style={styles.navHost}>
          <BottomTabBar
            activeTab={shouldShowStylistFallback ? "Stylist" : activeTab}
            onChangeTab={handleChangeTab}
          />
        </View>
      ) : null}
      {renderStatusBar}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1
  },
  navHost: {
    bottom: spacing.md,
    left: 0,
    paddingHorizontal: spacing.screen,
    position: "absolute",
    right: 0,
    zIndex: 9
  },
  renderProgressLine: {
    backgroundColor: colors.text,
    borderRadius: 999,
    height: 2,
    width: 72
  },
  renderProgressText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 15,
    textAlign: "center"
  },
  renderProgressTrack: {
    bottom: 0,
    height: 2,
    left: 0,
    overflow: "hidden",
    position: "absolute",
    right: 0
  },
  renderReadyText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 16,
    textAlign: "center"
  },
  renderStatusBar: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 0.5,
    elevation: 18,
    justifyContent: "center",
    minHeight: 40,
    minWidth: 260,
    overflow: "hidden",
    paddingHorizontal: spacing.lg,
    shadowColor: "#000000",
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 12
  },
  renderStatusHost: {
    alignItems: "center",
    left: spacing.screen,
    position: "absolute",
    right: spacing.screen,
    top: renderStatusTopInset + spacing.sm,
    zIndex: 40
  },
  screen: {
    flex: 1
  }
});
