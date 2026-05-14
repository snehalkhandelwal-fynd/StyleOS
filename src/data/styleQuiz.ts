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
    image:
      "https://unsplash.com/photos/kHMclLVlICc/download?force=true&w=900",
    label: "Minimalist",
    title: "Clean lines",
    visualCriteria: ["neutral colors", "clean silhouette", "simple styling"]
  },
  {
    curationRule: "Bold cuts, oversized fit, sneakers, and sportswear references.",
    id: "streetwear",
    image:
      "https://unsplash.com/photos/kzTeNG3Og6E/download?force=true&w=900",
    label: "Streetwear",
    title: "Oversized edge",
    visualCriteria: ["oversized fit", "sneakers", "urban sportswear"]
  },
  {
    curationRule: "Flowing fabric, layered texture, jewelry, prints, or earth tones.",
    id: "bohemian",
    image:
      "https://unsplash.com/photos/InsmqbGE7Wo/download?force=true&w=900",
    label: "Bohemian",
    title: "Flowing layers",
    visualCriteria: ["flowing fabric", "earth tones", "layered detail"]
  },
  {
    curationRule: "Tailored, structured, neutral palette, and timeless silhouettes.",
    id: "classic",
    image:
      "https://unsplash.com/photos/QA5Z9_oiR-M/download?force=true&w=900",
    label: "Classic",
    title: "Tailored polish",
    visualCriteria: ["tailoring", "structure", "neutral palette"]
  },
  {
    curationRule: "Activewear styled for everyday, sneakers, joggers, or performance layers.",
    id: "athleisure",
    image:
      "https://unsplash.com/photos/3yDxlFBlu4U/download?force=true&w=900",
    label: "Athleisure",
    title: "Everyday active",
    visualCriteria: ["activewear", "sneakers", "everyday styling"]
  },
  {
    curationRule: "Soft fabric, florals, pastels, or feminine silhouettes.",
    id: "romantic",
    image:
      "https://unsplash.com/photos/I6MTS2DZOLY/download?force=true&w=900",
    label: "Romantic",
    title: "Soft detail",
    visualCriteria: ["soft fabric", "florals or pastels", "feminine silhouette"]
  }
];
