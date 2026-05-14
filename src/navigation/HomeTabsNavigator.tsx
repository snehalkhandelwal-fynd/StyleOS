import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

import { BottomTabBar } from "../features/home/components/BottomTabBar";
import { BrandPlpScreen } from "../features/home/screens/BrandPlpScreen";
import { CartScreen } from "../features/home/screens/CartScreen";
import { ExploreScreen } from "../features/home/screens/ExploreScreen";
import { HomeScreen } from "../features/home/screens/HomeScreen";
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const hasStyleProfile = hasCompletedStyleProfile(draft);

  useEffect(() => {
    setActiveTab(initialTab);
    setSelectedBrandId(null);
    setIsSearchOpen(false);
  }, [initialTab]);

  const handleChangeTab = (tab: HomeTabName) => {
    setSelectedBrandId(null);
    setActiveTab(tab);
  };

  if (isSearchOpen) {
    return <SearchDiscoveryScreen onClose={() => setIsSearchOpen(false)} />;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        {activeTab === "Home" && selectedBrandId ? (
          <BrandPlpScreen
            brandId={selectedBrandId}
            hasStyleProfile={hasStyleProfile}
            onBack={() => setSelectedBrandId(null)}
          />
        ) : null}
        {activeTab === "Home" && !selectedBrandId ? (
          <HomeScreen
            draft={draft}
            isGuest={isGuest}
            onChangeAddress={onChangeAddress}
            onOpenBrand={setSelectedBrandId}
            onOpenSearch={() => setIsSearchOpen(true)}
            onStartStyleQuiz={onStartStyleQuiz}
          />
        ) : null}
        {activeTab === "TryOn" ? <TryOnScreen /> : null}
        {activeTab === "Feed" ? <ExploreScreen /> : null}
        {activeTab === "AIStylist" ? (
          <ExploreScreen
            copy="Ask Mira about style, outfits, and what to buy."
            title="AI Stylist"
          />
        ) : null}
        {activeTab === "Cart" ? <CartScreen /> : null}
      </View>
      <SafeAreaView pointerEvents="box-none" style={styles.navHost}>
        <BottomTabBar activeTab={activeTab} onChangeTab={handleChangeTab} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1
  },
  navHost: {
    bottom: spacing.lg,
    left: 0,
    position: "absolute",
    right: 0
  },
  screen: {
    flex: 1
  }
});
