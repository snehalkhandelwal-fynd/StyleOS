import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { BottomTabBar } from "../features/home/components/BottomTabBar";
import type { ProductListingProduct } from "../features/home/components/ProductListingScreen";
import { AccountScreen } from "../features/home/screens/AccountScreen";
import { BrandPlpScreen } from "../features/home/screens/BrandPlpScreen";
import { CartScreen } from "../features/home/screens/CartScreen";
import { ExploreScreen } from "../features/home/screens/ExploreScreen";
import { HomeScreen } from "../features/home/screens/HomeScreen";
import type { ProductLook } from "../features/home/screens/HomeScreen";
import { ModelLookPdpScreen } from "../features/home/screens/ModelLookPdpScreen";
import { ProductPdpScreen } from "../features/home/screens/ProductPdpScreen";
import { SearchDiscoveryScreen } from "../features/home/screens/SearchDiscoveryScreen";
import { TryOnScreen } from "../features/home/screens/TryOnScreen";
import { hasCompletedStyleProfile } from "../features/home/utils/stylePersonalization";
import type { OnboardingDraft } from "../features/onboarding/viewModels/useOnboardingViewModel";
import { spacing } from "../theme";
import type { HomeTabName } from "./types";

type HomeTabsNavigatorProps = {
  draft: OnboardingDraft;
  initialTab: HomeTabName;
  isGuest: boolean;
  onChangeAddress: () => void;
  onStartStyleQuiz: () => void;
};

export function HomeTabsNavigator({
  draft,
  initialTab,
  isGuest,
  onChangeAddress,
  onStartStyleQuiz
}: HomeTabsNavigatorProps) {
  const [activeTab, setActiveTab] = useState<HomeTabName>(initialTab);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [selectedLook, setSelectedLook] = useState<ProductLook | null>(null);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductListingProduct | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isExploreInternalViewOpen, setIsExploreInternalViewOpen] =
    useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
    setSelectedBrandId(null);
    setSelectedLook(null);
    setSelectedProduct(null);
    setIsSearchOpen(false);
    setIsExploreInternalViewOpen(false);
  }, [initialTab]);

  const handleChangeTab = (tab: HomeTabName) => {
    setSelectedBrandId(null);
    setSelectedLook(null);
    setSelectedProduct(null);
    setIsSearchOpen(false);
    setIsExploreInternalViewOpen(false);
    setActiveTab(tab);
  };

  const handleExploreInternalViewChange = useCallback((isOpen: boolean) => {
    setIsExploreInternalViewOpen(isOpen);
  }, []);

  if (isSearchOpen) {
    return <SearchDiscoveryScreen onClose={() => setIsSearchOpen(false)} />;
  }

  const shouldShowBottomTabs =
    !selectedLook &&
    !selectedProduct &&
    !selectedBrandId &&
    activeTab !== "Cart" &&
    !(activeTab === "Feed" && isExploreInternalViewOpen);
  const hasStyleProfile = hasCompletedStyleProfile(draft);

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        {activeTab === "Home" && selectedLook ? (
          <ModelLookPdpScreen
            look={selectedLook}
            onBack={() => setSelectedLook(null)}
          />
        ) : null}
        {activeTab === "Home" && selectedProduct && !selectedLook ? (
          <ProductPdpScreen
            hasStyleProfile={hasStyleProfile}
            onAddToCart={() => handleChangeTab("Cart")}
            onAskMira={() => handleChangeTab("AIStylist")}
            onBack={() => setSelectedProduct(null)}
            onOpenCart={() => handleChangeTab("Cart")}
            onOpenLook={setSelectedLook}
            onOpenSearch={() => setIsSearchOpen(true)}
            onStartTryOn={() => handleChangeTab("TryOn")}
            product={selectedProduct}
          />
        ) : null}
        {activeTab === "Home" && selectedBrandId && !selectedLook && !selectedProduct ? (
          <BrandPlpScreen
            brandId={selectedBrandId}
            onBack={() => setSelectedBrandId(null)}
            onOpenCart={() => handleChangeTab("Cart")}
            onOpenProduct={setSelectedProduct}
          />
        ) : null}
        {activeTab === "Home" && !selectedBrandId && !selectedLook && !selectedProduct ? (
          <HomeScreen
            draft={draft}
            isGuest={isGuest}
            onChangeAddress={onChangeAddress}
            onOpenBrand={setSelectedBrandId}
            onOpenCart={() => handleChangeTab("Cart")}
            onOpenLook={setSelectedLook}
            onOpenSearch={() => setIsSearchOpen(true)}
            onStartStyleQuiz={onStartStyleQuiz}
          />
        ) : null}
        {activeTab === "TryOn" ? <TryOnScreen /> : null}
        {activeTab === "Feed" ? (
          <ExploreScreen
            hasStyleProfile={hasStyleProfile}
            onInternalViewChange={handleExploreInternalViewChange}
            onAskMira={() => handleChangeTab("AIStylist")}
            onOpenCart={() => handleChangeTab("Cart")}
            onOpenSearch={() => setIsSearchOpen(true)}
            onStartTryOn={() => handleChangeTab("TryOn")}
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
          <AccountScreen
            appVersion="1.0.1"
            user={{
              avatarUri: draft.avatarUri,
              name: draft.name?.trim() || "Guest",
              phoneNumber: draft.phone
                ? `${draft.phone.countryCode} ${draft.phone.phoneNumber}`
                : undefined
            }}
          />
        ) : null}
      </View>
      {shouldShowBottomTabs ? (
        <View pointerEvents="box-none" style={styles.navHost}>
          <BottomTabBar activeTab={activeTab} onChangeTab={handleChangeTab} />
        </View>
      ) : null}
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
  screen: {
    flex: 1
  }
});
