import { prototypeProductImages } from "../features/home/data/prototypeProductImages";

export type StyleCard = {
  curationRule: string;
  id: string;
  image: string;
  label: string;
  title: string;
  visualCriteria: string[];
};

export const styleQuizCurationRules = [
  "Every quiz image must visibly match its style label before it enters the pool.",
  "Avoid images where accessories, color, pose, or background communicate a different style more strongly than the assigned tag.",
  "Prefer full-outfit images with clear silhouettes so users can make a fast taste decision.",
  "Reject images with busy styling for minimalist, overly casual styling for classic, or non-athletic clothing for athleisure."
] as const;

export const styleCards: StyleCard[] = [
  {
    curationRule: "Neutral palette, clean lines, simple cuts, no graphics, no busy pattern.",
    id: "minimalist",
    image: prototypeProductImages.sandro.whitePinstripeSuit,
    label: "Minimalist",
    title: "Clean lines",
    visualCriteria: ["neutral colors", "clean silhouette", "simple styling"]
  },
  {
    curationRule: "Bold cuts, oversized fit, sneakers, and sportswear references.",
    id: "streetwear",
    image: prototypeProductImages.maje.tanHoodedJacket,
    label: "Streetwear",
    title: "Oversized edge",
    visualCriteria: ["oversized fit", "sneakers", "urban sportswear"]
  },
  {
    curationRule: "Flowing fabric, layered texture, jewelry, prints, or earth tones.",
    id: "bohemian",
    image: prototypeProductImages.maje.beigeCrochetDress,
    label: "Bohemian",
    title: "Flowing layers",
    visualCriteria: ["flowing fabric", "earth tones", "layered detail"]
  },
  {
    curationRule: "Tailored, structured, neutral palette, and timeless silhouettes.",
    id: "classic",
    image: prototypeProductImages.sandro.whitePinstripeSuit,
    label: "Classic",
    title: "Tailored polish",
    visualCriteria: ["tailoring", "structure", "neutral palette"]
  },
  {
    curationRule: "Activewear styled for everyday, sneakers, joggers, or performance layers.",
    id: "athleisure",
    image: prototypeProductImages.maje.tanHoodedJacket,
    label: "Athleisure",
    title: "Everyday active",
    visualCriteria: ["activewear", "sneakers", "everyday styling"]
  },
  {
    curationRule: "Soft fabric, florals, pastels, or feminine silhouettes.",
    id: "romantic",
    image: prototypeProductImages.maje.pinkRelaxedSet,
    label: "Romantic",
    title: "Soft detail",
    visualCriteria: ["soft fabric", "florals or pastels", "feminine silhouette"]
  }
];

const womensStyleImages: Record<string, string> = {
  athleisure: prototypeProductImages.maje.stripedScarfDenim,
  bohemian: prototypeProductImages.maje.tanHoodedJacket,
  classic: prototypeProductImages.sandro.beigeTrench,
  minimalist: prototypeProductImages.sandro.whitePinstripeSuit,
  romantic: prototypeProductImages.maje.greenDenimTop,
  streetwear: prototypeProductImages.sandro.navyTailoredSet
};

export const womensStyleCards: StyleCard[] = styleCards.map((card) => ({
  ...card,
  image: womensStyleImages[card.id] ?? card.image
}));

export function getStyleCardsForFashionInterest(
  fashionInterest?: "mens" | "womens"
) {
  return fashionInterest === "womens" ? womensStyleCards : styleCards;
}
