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
import type { LookPiece } from "../features/home/data/lookPieces";
import { BrandPlpScreen } from "../features/home/screens/BrandPlpScreen";
import { CartScreen } from "../features/home/screens/CartScreen";
import { ClosetScreen } from "../features/home/screens/ClosetScreen";
import { ExploreScreen } from "../features/home/screens/ExploreScreen";
import { HomeScreen } from "../features/home/screens/HomeScreen";
import type { ProductLook } from "../features/home/screens/HomeScreen";
import { ModelLookPdpScreen } from "../features/home/screens/ModelLookPdpScreen";
import { ProductPdpScreen } from "../features/home/screens/ProductPdpScreen";
import { SearchDiscoveryScreen } from "../features/home/screens/SearchDiscoveryScreen";
import {
  ShopThisLookScreen,
  TRY_ON_RENDER_DELAY_MS,
  TryOnScreen,
  type TryOnExitState
} from "../features/home/screens/TryOnScreen";
import { hasCompletedStyleProfile } from "../features/home/utils/stylePersonalization";
import type { OnboardingDraft } from "../features/onboarding/viewModels/useOnboardingViewModel";
import { colors, fonts, spacing } from "../theme";
import type { HomeTabName } from "./types";

type HomeTabsNavigatorProps = {
  draft: OnboardingDraft;
  initialTab: HomeTabName;
  isGuest: boolean;
  onChangeAddress: () => void;
  onSelectPhoto: (uri: string) => void;
  onStartStyleQuiz: () => void;
};

type TryOnEntry = {
  context?: string;
  look?: ProductLook;
  returnTab: HomeTabName;
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

const renderStatusTopInset =
  Platform.OS === "ios" ? 44 : StatusBar.currentHeight ?? 0;

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
  initialTab,
  isGuest,
  onChangeAddress,
  onSelectPhoto,
  onStartStyleQuiz
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isExploreInternalViewOpen, setIsExploreInternalViewOpen] =
    useState(false);
  const [tryOnEntry, setTryOnEntry] = useState<TryOnEntry | null>(null);
  const [tryOnRender, setTryOnRender] = useState<TryOnRenderState>({
    entry: null,
    isBrowsing: false,
    startedAt: null,
    status: "idle"
  });
  const [isTryOnShopLookOpen, setIsTryOnShopLookOpen] = useState(false);
  const [shopLookPieces, setShopLookPieces] = useState<LookPiece[] | null>(
    null
  );
  const [isReadyToastVisible, setIsReadyToastVisible] = useState(false);
  const [lookSnapshots, setLookSnapshots] = useState<
    Record<string, LookSessionSnapshot>
  >({});
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
      }, TRY_ON_RENDER_DELAY_MS);
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
      const remainingMs = TRY_ON_RENDER_DELAY_MS - elapsedMs;

      void scheduleReadyNotification(remainingMs);
    });

    return () => {
      subscription.remove();
    };
  }, [
    cancelReadyNotification,
    scheduleReadyNotification,
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
    setIsSearchOpen(false);
    setIsExploreInternalViewOpen(false);
    setTryOnEntry(null);
    setIsTryOnShopLookOpen(false);
    setShopLookPieces(null);
    resetTryOnRender();
  }, [initialTab, resetTryOnRender]);

  const handleChangeTab = (tab: HomeTabName) => {
    const shouldKeepTryOnEntry = tryOnRender.status !== "idle";

    setSelectedBrandId(null);
    setSelectedLook(null);
    setSelectedProduct(null);
    setSelectedProductReturnTab(null);
    setIsSearchOpen(false);
    setIsExploreInternalViewOpen(false);
    setIsTryOnShopLookOpen(false);
    setShopLookPieces(null);
    if (!shouldKeepTryOnEntry) {
      setTryOnEntry(null);
    }
    setActiveTab(tab);
  };

  const handleExploreInternalViewChange = useCallback((isOpen: boolean) => {
    setIsExploreInternalViewOpen(isOpen);
  }, []);

  const openTryOnSession = useCallback(
    (look?: ProductLook, context?: string) => {
      const nextEntry = {
        context,
        look,
        returnTab: activeTab
      };

      setTryOnEntry(nextEntry);
      beginTryOnRender(nextEntry);
      setIsTryOnShopLookOpen(false);
      setShopLookPieces(null);
      setIsSearchOpen(false);
      setIsExploreInternalViewOpen(false);
      setActiveTab("TryOn");
    },
    [activeTab, beginTryOnRender]
  );

  const handleTryOnClose = useCallback(
    (state: TryOnExitState) => {
      const sessionLook = tryOnEntry?.look;

      persistTryOnSnapshot(state, sessionLook);
      resetTryOnRender();

      setActiveTab(tryOnEntry?.returnTab ?? "Home");
      setTryOnEntry(null);
      setIsTryOnShopLookOpen(false);
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

  const handleAddShopPieceToCart = useCallback(
    (_piece: LookPiece, _size: string) => {
      setCartCount((current) => current + 1);
    },
    []
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
    activeTab !== "TryOn" &&
    !(activeTab === "Feed" && isExploreInternalViewOpen);
  const hasStyleProfile = hasCompletedStyleProfile(draft);
  const selectedLookSnapshot = selectedLook
    ? lookSnapshots[selectedLook.id]
    : undefined;
  const tryOnLookSnapshot = tryOnEntry?.look
    ? lookSnapshots[tryOnEntry.look.id]
    : undefined;

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        {activeTab === "Home" && selectedLook ? (
          <ModelLookPdpScreen
            cartCount={cartCount}
            initialIsSaved={selectedLookSnapshot?.isSaved}
            look={selectedLook}
            onAddToCart={() => handleChangeTab("Cart")}
            onAskMira={() => handleChangeTab("AIStylist")}
            onBack={() => setSelectedLook(null)}
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
            onStartTryOn={(context) => openTryOnSession(selectedLook, context)}
            pieceOverrides={selectedLookSnapshot?.pieces}
          />
        ) : null}
        {activeTab === "Home" && selectedProduct && !selectedLook ? (
          <ProductPdpScreen
            hasStyleProfile={hasStyleProfile}
            onAddToCart={() => handleChangeTab("Cart")}
            onAskMira={() => handleChangeTab("AIStylist")}
            onBack={handleProductPdpBack}
            onOpenCart={() => handleChangeTab("Cart")}
            onOpenLook={setSelectedLook}
            onOpenSearch={() => setIsSearchOpen(true)}
            onStartTryOn={(context) => openTryOnSession(undefined, context)}
            product={selectedProduct}
          />
        ) : null}
        {activeTab === "Home" && selectedBrandId && !selectedLook && !selectedProduct ? (
          <BrandPlpScreen
            brandId={selectedBrandId}
            onBack={() => setSelectedBrandId(null)}
            onOpenCart={() => handleChangeTab("Cart")}
            onOpenProduct={handleOpenProductFromBrand}
          />
        ) : null}
        {activeTab === "Home" && !selectedBrandId && !selectedLook && !selectedProduct ? (
          <HomeScreen
            draft={draft}
            isGuest={isGuest}
            onChangeAddress={onChangeAddress}
            onOpenBrand={setSelectedBrandId}
            onOpenCart={() => handleChangeTab("Cart")}
            onOpenCloset={() => handleChangeTab("Closet")}
            onOpenLook={setSelectedLook}
            onOpenSearch={() => setIsSearchOpen(true)}
            onStartStyleQuiz={onStartStyleQuiz}
          />
        ) : null}
        {activeTab === "TryOn" && selectedProduct ? (
          <ProductPdpScreen
            hasStyleProfile={hasStyleProfile}
            onAddToCart={() =>
              setCartCount((current) => current + 1)
            }
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
            look={tryOnEntry?.look}
            onAddPieceToCart={handleAddShopPieceToCart}
            onBack={handleBackFromShopLook}
            onOpenProduct={handleOpenProductFromTryOn}
            onViewCart={handleViewCartFromShopLook}
            pieces={shopLookPieces ?? tryOnLookSnapshot?.pieces ?? []}
          />
        ) : null}
        {activeTab === "TryOn" && !selectedProduct && !isTryOnShopLookOpen ? (
          <TryOnScreen
            draft={draft}
            initialIsSaved={tryOnLookSnapshot?.isSaved}
            initialPieces={tryOnLookSnapshot?.pieces}
            isCreatingLook={tryOnRender.status === "rendering"}
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
          />
        ) : null}
        {activeTab === "Closet" ? (
          <ClosetScreen
            onAskMira={() => handleChangeTab("AIStylist")}
            onStartTryOn={() => openTryOnSession(undefined, "Closet item")}
          />
        ) : null}
        {activeTab === "Feed" ? (
          <ExploreScreen
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
          <CartScreen onBack={() => handleChangeTab("Home")} />
        ) : null}
        {activeTab === "Profile" ? (
          <ExploreScreen
            copy="Manage your measurements, style profile, saved looks, and account details."
            title="Profile"
          />
        ) : null}
      </View>
      {shouldShowBottomTabs ? (
        <View pointerEvents="box-none" style={styles.navHost}>
          <BottomTabBar activeTab={activeTab} onChangeTab={handleChangeTab} />
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
    position: "absolute",
    right: 0
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
