import { prototypeProductImages } from "../features/home/data/prototypeProductImages";

export const splashBanners = [
  {
    id: "try-on",
    image:
      prototypeProductImages.maje.beigeCrochetDress,
    kicker: "Try before you decide",
    title: "Your looks, on you.",
    subtitle:
      "Build confidence before buying with outfit-first styling and fast virtual try-on."
  },
  {
    id: "style-match",
    image:
      prototypeProductImages.sandro.navyTailoredSet,
    kicker: "Find what feels right",
    title: "Outfits that match you.",
    subtitle:
      "See complete looks shaped around your style, mood, and the moments you dress for."
  },
  {
    id: "wardrobe",
    image:
      prototypeProductImages.maje.oliveCapeMini,
    kicker: "Style what you own",
    title: "Make more of your wardrobe.",
    subtitle:
      "Upload pieces you already have and discover what completes the look."
  }
] as const;

export const socialOptions = [
  { id: "google", icon: "google", accessibilityLabel: "Continue with Google" },
  { id: "apple", icon: "apple", accessibilityLabel: "Continue with Apple" },
  { id: "facebook", icon: "facebook", accessibilityLabel: "Continue with Facebook" }
] as const;
