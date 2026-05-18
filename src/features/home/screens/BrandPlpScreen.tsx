import { getBrandName, getBrandProducts } from "../data/brandCatalog";
import type { BrandProduct } from "../data/brandCatalog";
import {
  ProductListingScreen,
  type ProductListingProduct
} from "../components/ProductListingScreen";

type BrandPlpScreenProps = {
  brandId: string;
  onBack: () => void;
  onOpenProduct?: (product: ProductListingProduct) => void;
};

const styleLabels = [
  "Relaxed",
  "Tailored",
  "Soft",
  "Everyday",
  "Textured",
  "Weekend"
];
const colorsForProducts = ["White", "Blue", "Sand", "Ivory", "Black", "Green"];
const occasions = ["Work", "Weekend", "Vacation", "Brunch", "Date night"];
const vibes = ["Classic", "Minimal", "Coastal", "Soft", "Street"];
const sizeSets = [
  ["XS", "S", "M"],
  ["S", "M", "L"],
  ["M", "L", "XL"],
  ["XS", "M", "L"],
  ["S", "L", "XL"]
];
const tryCounts = [
  1200, 840, 430, 2100, 310, 1500, 680, 2400, 980, 1760, 520, 1110, 2600,
  830, 1900, 420, 1350, 760, 1080, 620, 1430, 910, 1870, 560
];
const discountPercents = [40, 35, 0, 25, 50, 0, 30, 45];
const deliveryWindows = [
  "3 day delivery",
  "4 day delivery",
  "2 day delivery",
  "5 day delivery"
];

function parsePriceValue(price: string) {
  return Number(price.replace(/[^\d]/g, "")) || 0;
}

function formatRupeePrice(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function formatTryCount(count: number) {
  if (count >= 1000) {
    const rounded = count / 1000;
    return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)}k tries`;
  }

  return `${count} tries`;
}

function buildBrandListingProducts(
  sourceProducts: BrandProduct[]
): ProductListingProduct[] {
  if (sourceProducts.length === 0) {
    return [];
  }

  return Array.from({ length: 24 }, (_, index) => {
    const source = sourceProducts[index % sourceProducts.length];
    const styleLabel = styleLabels[index % styleLabels.length];
    const isOriginalProduct = index < sourceProducts.length;
    const title = isOriginalProduct
      ? source.title
      : `${styleLabel} ${source.title.toLowerCase()}`;
    const tryCount = tryCounts[index % tryCounts.length];
    const priceValue = parsePriceValue(source.price);
    const discountPercent = discountPercents[index % discountPercents.length];

    return {
      brand: getBrandName(source.brandId),
      color: colorsForProducts[index % colorsForProducts.length],
      deliveryText: deliveryWindows[index % deliveryWindows.length],
      discountPercent: discountPercent || undefined,
      id: `${source.id}-${index}`,
      image: source.image,
      occasion: occasions[index % occasions.length],
      originalPrice:
        discountPercent > 0
          ? formatRupeePrice(priceValue / (1 - discountPercent / 100))
          : undefined,
      price: source.price,
      priceValue,
      sizeOptions: sizeSets[index % sizeSets.length],
      styleLabel,
      title,
      tries: formatTryCount(tryCount),
      tryCount,
      vibe: vibes[index % vibes.length]
    };
  });
}

export function BrandPlpScreen({
  brandId,
  onBack,
  onOpenProduct
}: BrandPlpScreenProps) {
  const title = getBrandName(brandId);
  const products = buildBrandListingProducts(getBrandProducts(brandId));

  return (
    <ProductListingScreen
      onBack={onBack}
      onOpenProduct={onOpenProduct}
      products={products}
      subtitle={`${products.length} products`}
      title={title}
    />
  );
}
