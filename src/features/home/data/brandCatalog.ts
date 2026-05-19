import { prototypeProductImages } from "./prototypeProductImages";

export type BrandLogoVariant =
  | "hm"
  | "maje"
  | "sandro"
  | "trends"
  | "vero-moda"
  | "zara";

export type Brand = {
  id: string;
  logoHeight: number;
  logoVariant: BrandLogoVariant;
  logoWidth: number;
  name: string;
};

export type BrandProduct = {
  brandId: string;
  id: string;
  image: string;
  match: string;
  price: string;
  title: string;
};

export const allBrandsId = "all-brands";

export const brands: Brand[] = [
  {
    id: "maje",
    logoHeight: 20,
    logoVariant: "maje",
    logoWidth: 80,
    name: "Maje"
  },
  {
    id: "sandro",
    logoHeight: 20,
    logoVariant: "sandro",
    logoWidth: 80,
    name: "Sandro"
  },
  {
    id: "zara",
    logoHeight: 22,
    logoVariant: "zara",
    logoWidth: 72,
    name: "Zara"
  },
  {
    id: "vero-moda",
    logoHeight: 20,
    logoVariant: "vero-moda",
    logoWidth: 86,
    name: "Vero Moda"
  },
  {
    id: "trends",
    logoHeight: 15,
    logoVariant: "trends",
    logoWidth: 88,
    name: "Trends"
  },
  {
    id: "hm",
    logoHeight: 24,
    logoVariant: "hm",
    logoWidth: 44,
    name: "H&M"
  }
];

export const brandRows = [
  [brands[0], brands[1], brands[2], brands[3], brands[4], brands[5]],
  [brands[3], brands[5], brands[1], brands[4], brands[0], brands[2]]
];

export const brandProducts: BrandProduct[] = [
  {
    brandId: "maje",
    id: "maje-crochet-midi",
    image:
      prototypeProductImages.maje.beigeCrochetDress,
    match: "91% match",
    price: "₹3,499",
    title: "Crochet midi dress"
  },
  {
    brandId: "maje",
    id: "maje-denim-crop",
    image: prototypeProductImages.maje.greenDenimTop,
    match: "88% match",
    price: "₹4,299",
    title: "Denim crop jacket"
  },
  {
    brandId: "vero-moda",
    id: "vero-linen-wrap",
    image:
      prototypeProductImages.maje.beigeCrochetDress,
    match: "91% match",
    price: "₹3,499",
    title: "Linen wrap dress"
  },
  {
    brandId: "vero-moda",
    id: "vero-soft-blazer",
    image: prototypeProductImages.sandro.brownJacket,
    match: "88% match",
    price: "₹4,299",
    title: "Soft cropped blazer"
  },
  {
    brandId: "sandro",
    id: "sandro-tailored-set",
    image:
      prototypeProductImages.sandro.navyTailoredSet,
    match: "92% match",
    price: "₹5,990",
    title: "Tailored city set"
  },
  {
    brandId: "sandro",
    id: "sandro-evening-slip",
    image:
      prototypeProductImages.maje.beigeCrochetDress,
    match: "89% match",
    price: "₹3,790",
    title: "Evening slip dress"
  },
  {
    brandId: "zara",
    id: "zara-tailored-set",
    image:
      prototypeProductImages.sandro.whitePinstripeSuit,
    match: "92% match",
    price: "₹5,990",
    title: "Tailored city set"
  },
  {
    brandId: "zara",
    id: "zara-evening-slip",
    image:
      prototypeProductImages.maje.sheerPartyDress,
    match: "89% match",
    price: "₹3,790",
    title: "Evening slip dress"
  },
  {
    brandId: "trends",
    id: "trends-denim-jacket",
    image:
      prototypeProductImages.maje.greenDenimTop,
    match: "86% match",
    price: "₹2,499",
    title: "Travel denim jacket"
  },
  {
    brandId: "trends",
    id: "trends-weekend-set",
    image:
      prototypeProductImages.maje.greenDenimTop,
    match: "84% match",
    price: "₹1,999",
    title: "Weekend co-ord set"
  },
  {
    brandId: "hm",
    id: "hm-faux-leather",
    image:
      prototypeProductImages.sandro.beigeTrench,
    match: "90% match",
    price: "₹2,999",
    title: "Faux leather jacket"
  },
  {
    brandId: "hm",
    id: "hm-party-satin",
    image:
      prototypeProductImages.maje.khakiTrenchSkirt,
    match: "87% match",
    price: "₹2,299",
    title: "Party satin dress"
  }
];

export function getBrandName(brandId: string) {
  if (brandId === allBrandsId) {
    return "All Brands";
  }

  return brands.find((brand) => brand.id === brandId)?.name ?? "Brand";
}

export function getBrandProducts(brandId: string) {
  if (brandId === allBrandsId) {
    return brandProducts;
  }

  return brandProducts.filter((product) => product.brandId === brandId);
}
