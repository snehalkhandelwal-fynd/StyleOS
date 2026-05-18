import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { BottomTabBar } from "../features/home/components/BottomTabBar";
import { BrandPlpScreen } from "../features/home/screens/BrandPlpScreen";
import { CartScreen } from "../features/home/screens/CartScreen";
import { ExploreScreen } from "../features/home/screens/ExploreScreen";
import { HomeScreen } from "../features/home/screens/HomeScreen";
import type { ProductLook } from "../features/home/screens/HomeScreen";
import { ModelLookPdpScreen } from "../features/home/screens/ModelLookPdpScreen";
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isExploreInternalViewOpen, setIsExploreInternalViewOpen] =
    useState(false);
  const hasStyleProfile = hasCompletedStyleProfile(draft);

  useEffect(() => {
    setActiveTab(initialTab);
    setSelectedBrandId(null);
    setSelectedLook(null);
    setIsSearchOpen(false);
    setIsExploreInternalViewOpen(false);
  }, [initialTab]);

  const handleChangeTab = (tab: HomeTabName) => {
    setSelectedBrandId(null);
    setSelectedLook(null);
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
    !selectedBrandId &&
    activeTab !== "Cart" &&
    !(activeTab === "Feed" && isExploreInternalViewOpen);

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        {activeTab === "Home" && selectedLook ? (
          <ModelLookPdpScreen
            look={selectedLook}
            onBack={() => setSelectedLook(null)}
          />
        ) : null}
        {activeTab === "Home" && selectedBrandId && !selectedLook ? (
          <BrandPlpScreen
            brandId={selectedBrandId}
            hasStyleProfile={hasStyleProfile}
            onBack={() => setSelectedBrandId(null)}
          />
        ) : null}
        {activeTab === "Home" && !selectedBrandId && !selectedLook ? (
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
