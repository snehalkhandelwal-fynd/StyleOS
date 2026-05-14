import type { ImageSourcePropType } from "react-native";

export type Brand = {
  id: string;
  logoHeight: number;
  logoImage: ImageSourcePropType;
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
    id: "vero-moda",
    logoHeight: 51,
    logoImage: require("../../../assets/brand-vero-moda.png"),
    logoWidth: 85,
    name: "Vero Moda"
  },
  {
    id: "zara",
    logoHeight: 40,
    logoImage: require("../../../assets/brand-zara.png"),
    logoWidth: 76,
    name: "Zara"
  },
  {
    id: "trends",
    logoHeight: 13,
    logoImage: require("../../../assets/brand-trends.png"),
    logoWidth: 88,
    name: "Trends"
  },
  {
    id: "hm",
    logoHeight: 30,
    logoImage: require("../../../assets/brand-hm.png"),
    logoWidth: 45,
    name: "H&M"
  }
];

export const brandRows = [
  [brands[0], brands[1], brands[2], brands[3]],
  [brands[3], brands[0], brands[1], brands[2], brands[3]]
];

export const brandProducts: BrandProduct[] = [
  {
    brandId: "vero-moda",
    id: "vero-linen-wrap",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
    match: "91% your style",
    price: "₹3,499",
    title: "Linen wrap dress"
  },
  {
    brandId: "vero-moda",
    id: "vero-soft-blazer",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
    match: "88% your style",
    price: "₹4,299",
    title: "Soft cropped blazer"
  },
  {
    brandId: "zara",
    id: "zara-tailored-set",
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=800&q=80",
    match: "92% your style",
    price: "₹5,990",
    title: "Tailored city set"
  },
  {
    brandId: "zara",
    id: "zara-evening-slip",
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80",
    match: "89% your style",
    price: "₹3,790",
    title: "Evening slip dress"
  },
  {
    brandId: "trends",
    id: "trends-denim-jacket",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
    match: "86% your style",
    price: "₹2,499",
    title: "Travel denim jacket"
  },
  {
    brandId: "trends",
    id: "trends-weekend-set",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    match: "84% your style",
    price: "₹1,999",
    title: "Weekend co-ord set"
  },
  {
    brandId: "hm",
    id: "hm-faux-leather",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
    match: "90% your style",
    price: "₹2,999",
    title: "Faux leather jacket"
  },
  {
    brandId: "hm",
    id: "hm-party-satin",
    image:
      "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=800&q=80",
    match: "87% your style",
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
