import { prototypeProductImages } from "../data/prototypeProductImages";
import { useMemo, useState } from "react";

import type { OnboardingDraft } from "../../onboarding/viewModels/useOnboardingViewModel";

export type HomeProduct = {
  brand?: string;
  id: string;
  image: string;
  price?: string;
  title?: string;
};

export type SavedLook = {
  id: string;
  image: string;
};

export type HomeContentState = {
  address: string;
  arrivalProducts: HomeProduct[];
  brandRows: string[][];
  error: string | null;
  firstName: string;
  isEmpty: boolean;
  isLoading: boolean;
  occasionProducts: HomeProduct[];
  occasionTabs: string[];
  priceProducts: HomeProduct[];
  priceTabs: string[];
  savedLooks: SavedLook[];
  selectedOccasion: string;
  selectedPrice: string;
};

const fallbackAddress = "MIDC, Andheri East, Mumbai 400096";

const figmaAssets = {
  brand1:
    "https://logo.clearbit.com/nike.com",
  brand2:
    "https://logo.clearbit.com/adidas.com",
  brand3:
    "https://logo.clearbit.com/zara.com",
  brand4:
    "https://logo.clearbit.com/hm.com",
  finalBanner:
    prototypeProductImages.maje.khakiTrenchSkirt,
  hero:
    prototypeProductImages.maje.beigeCrochetDress,
  newArrival:
    prototypeProductImages.maje.greenDenimTop,
  product:
    prototypeProductImages.maje.greenDenimTop,
  quizBanner:
    prototypeProductImages.sandro.navyTailoredSet,
  savedGarment:
    prototypeProductImages.maje.beigeCrochetDress
};

export const homeImages = figmaAssets;

const occasionTabs = [
  "Work",
  "Casual",
  "Date Night",
  "Party",
  "Formal",
  "Wedding",
  "Vacation"
];

const priceTabs = ["Under ₹999", "Under ₹1999", "Under ₹2999", "Under ₹3999"];

const occasionProducts: HomeProduct[] = Array.from(
  { length: 6 },
  (_, index) => ({
    id: `occasion-${index}`,
    image: figmaAssets.product
  })
);

const arrivalProducts: HomeProduct[] = [
  {
    brand: "Adidas",
    id: "arrival-1",
    image: figmaAssets.newArrival,
    price: "₹2,300",
    title: "Runfalcon 3.0 W Women Lace-Ups Sports Shoes"
  },
  {
    brand: "Adidas",
    id: "arrival-2",
    image: figmaAssets.product,
    price: "₹2,300",
    title: "Runfalcon 3.0 W Women Lace-Ups Sports Shoes"
  }
];

const savedLooks: SavedLook[] = [
  { id: "saved-1", image: figmaAssets.savedGarment },
  { id: "saved-2", image: figmaAssets.hero },
  { id: "saved-3", image: figmaAssets.savedGarment }
];

const brandRows = [
  [figmaAssets.brand1, figmaAssets.brand2, figmaAssets.brand3, figmaAssets.brand4],
  [figmaAssets.brand3, figmaAssets.brand4, figmaAssets.brand1, figmaAssets.brand2]
];

function getFirstName(name?: string) {
  const trimmedName = name?.trim();

  return trimmedName ? trimmedName.split(/\s+/)[0] : "Guest";
}

export function useHomeViewModel(draft: OnboardingDraft, isGuest: boolean) {
  const [selectedOccasion, setSelectedOccasion] = useState(occasionTabs[0]);
  const [selectedPrice, setSelectedPrice] = useState(priceTabs[0]);

  const state: HomeContentState = useMemo(() => {
    const address = draft.address?.trim();

    return {
      address: address || (isGuest ? fallbackAddress : ""),
      arrivalProducts,
      brandRows,
      error: null,
      firstName: getFirstName(draft.name),
      isEmpty: false,
      isLoading: false,
      occasionProducts,
      occasionTabs,
      priceProducts: occasionProducts,
      priceTabs,
      savedLooks,
      selectedOccasion,
      selectedPrice
    };
  }, [draft.address, draft.name, isGuest, selectedOccasion, selectedPrice]);

  const actions = useMemo(
    () => ({
      setSelectedOccasion,
      setSelectedPrice
    }),
    []
  );

  return { actions, state };
}
