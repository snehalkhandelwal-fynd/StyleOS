export const splashBanners = [
  {
    id: "try-on",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    kicker: "Try before you decide",
    title: "Your looks, on you.",
    subtitle:
      "Build confidence before buying with outfit-first styling and fast virtual try-on."
  },
  {
    id: "style-match",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
    kicker: "Find what feels right",
    title: "Outfits that match you.",
    subtitle:
      "See complete looks shaped around your style, mood, and the moments you dress for."
  },
  {
    id: "wardrobe",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
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
