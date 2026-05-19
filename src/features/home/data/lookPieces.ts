import type { OutfitPieceKind, ProductLook } from "../screens/HomeScreen";
import { prototypeProductImages } from "./prototypeProductImages";

export type LookPiece = {
  brand: string;
  category: string;
  id: string;
  image: string;
  isOwned?: boolean;
  kind: OutfitPieceKind;
  name: string;
  price: string;
  sizes: string[];
};

const defaultPieceImages = {
  bag: prototypeProductImages.shopThisLook.brownBag,
  bottom: prototypeProductImages.shopThisLook.yellowPants,
  dress: prototypeProductImages.maje.beigeCrochetDress,
  jacket: prototypeProductImages.sandro.brownJacket,
  shoe: prototypeProductImages.shopThisLook.brownShoes,
  top: prototypeProductImages.shopThisLook.yellowTop
} satisfies Record<OutfitPieceKind, string>;

const defaultPieceInfo: Record<
  OutfitPieceKind,
  Omit<LookPiece, "id" | "kind">
> = {
  bag: {
    brand: "Maje",
    category: "Bag",
    image: defaultPieceImages.bag,
    name: "Structured mini bag",
    price: "₹2,499",
    sizes: ["One"]
  },
  bottom: {
    brand: "Sandro",
    category: "Bottoms",
    image: defaultPieceImages.bottom,
    name: "Pleated wide-leg trousers",
    price: "₹3,299",
    sizes: ["26", "28", "30"]
  },
  dress: {
    brand: "Maje",
    category: "Dress",
    image: defaultPieceImages.dress,
    name: "Soft column dress",
    price: "₹4,499",
    sizes: ["XS", "S", "M"]
  },
  jacket: {
    brand: "Sandro",
    category: "Layer",
    image: defaultPieceImages.jacket,
    name: "Soft cropped blazer",
    price: "₹4,299",
    sizes: ["S", "M", "L"]
  },
  shoe: {
    brand: "Maje",
    category: "Shoes",
    image: defaultPieceImages.shoe,
    name: "Block heel mules",
    price: "₹2,299",
    sizes: ["37", "38", "39"]
  },
  top: {
    brand: "Trends",
    category: "Top",
    image: defaultPieceImages.top,
    isOwned: true,
    name: "White linen shirt",
    price: "₹2,899",
    sizes: ["XS", "S", "M"]
  }
};

function createPiece(
  kind: OutfitPieceKind,
  index: number,
  overrides: Partial<Omit<LookPiece, "id" | "kind">> = {}
): LookPiece {
  return {
    ...defaultPieceInfo[kind],
    ...overrides,
    id: `${kind}-${index}`,
    kind
  };
}

export function getPieceDefaults(kind: OutfitPieceKind, index: number) {
  return createPiece(kind, index);
}

export function buildLookPieces(look: ProductLook) {
  const pieces = look.outfitItems.map((piece, index) =>
    getPieceDefaults(piece.kind, index)
  );

  if (pieces.length > 0) {
    return pieces.slice(0, 4);
  }

  return [
    getPieceDefaults("top", 0),
    getPieceDefaults("bottom", 1),
    getPieceDefaults("shoe", 2)
  ];
}

export const pieceAlternatives: Record<OutfitPieceKind, LookPiece[]> = {
  bag: [
    createPiece("bag", 0, {
      brand: "Maje",
      image: prototypeProductImages.maje.stripedScarfDenim,
      name: "Structured mini bag",
      price: "₹2,499"
    }),
    createPiece("bag", 1, {
      brand: "Maje",
      image: prototypeProductImages.maje.tanHoodedJacket,
      name: "Soft tan crossbody",
      price: "₹1,999"
    }),
    createPiece("bag", 2, {
      brand: "Trends",
      image: prototypeProductImages.maje.navyCoatDress,
      name: "Navy shoulder bag",
      price: "₹1,799"
    })
  ],
  bottom: [
    createPiece("bottom", 0, {
      brand: "Sandro",
      image: prototypeProductImages.sandro.whitePinstripeSuit,
      name: "Pleated wide-leg trousers",
      price: "₹3,299"
    }),
    createPiece("bottom", 1, {
      brand: "Maje",
      image: prototypeProductImages.maje.blueScarfTrousers,
      name: "Blue scarf trousers",
      price: "₹2,899"
    }),
    createPiece("bottom", 2, {
      brand: "Trends",
      image: prototypeProductImages.sandro.navyTailoredSet,
      name: "Linen city pants",
      price: "₹2,799"
    }),
    createPiece("bottom", 3, {
      brand: "Maje",
      image: prototypeProductImages.maje.khakiTrenchSkirt,
      name: "Khaki wrap skirt",
      price: "₹2,499"
    }),
    createPiece("bottom", 4, {
      brand: "Sandro",
      image: prototypeProductImages.maje.pinkRelaxedSet,
      name: "Relaxed white pants",
      price: "₹3,099"
    }),
    createPiece("bottom", 5, {
      brand: "Trends",
      image: prototypeProductImages.maje.oliveCapeMini,
      name: "Soft neutral cargos",
      price: "₹2,299"
    })
  ],
  dress: [
    createPiece("dress", 0, {
      brand: "Maje",
      image: prototypeProductImages.maje.beigeCrochetDress,
      name: "Soft column dress",
      price: "₹4,499"
    }),
    createPiece("dress", 1, {
      brand: "Maje",
      image: prototypeProductImages.maje.ivoryMiniDress,
      name: "Ivory mini dress",
      price: "₹3,899"
    }),
    createPiece("dress", 2, {
      brand: "Maje",
      image: prototypeProductImages.maje.sheerPartyDress,
      name: "Sheer party dress",
      price: "₹5,299"
    })
  ],
  jacket: [
    createPiece("jacket", 0, {
      brand: "Sandro",
      image: prototypeProductImages.sandro.brownJacket,
      name: "Fringe suede jacket",
      price: "₹4,299"
    }),
    createPiece("jacket", 1, {
      brand: "Sandro",
      image: prototypeProductImages.sandro.beigeTrench,
      name: "Light trench layer",
      price: "₹4,699"
    }),
    createPiece("jacket", 2, {
      brand: "Sandro",
      image: prototypeProductImages.sandro.denimJacket,
      name: "Cropped denim jacket",
      price: "₹3,499"
    }),
    createPiece("jacket", 3, {
      brand: "Maje",
      image: prototypeProductImages.maje.oliveCapeMini,
      name: "Olive cape jacket",
      price: "₹3,999"
    })
  ],
  shoe: [
    createPiece("shoe", 0, {
      brand: "Maje",
      image: prototypeProductImages.sandro.brownJacket,
      name: "Block heel mules",
      price: "₹2,299"
    }),
    createPiece("shoe", 1, {
      brand: "Maje",
      image: prototypeProductImages.maje.stripedScarfDenim,
      name: "Clean slingbacks",
      price: "₹2,799"
    }),
    createPiece("shoe", 2, {
      brand: "Trends",
      image: prototypeProductImages.sandro.beigeTrench,
      name: "Cream low sneakers",
      price: "₹1,999"
    }),
    createPiece("shoe", 3, {
      brand: "Sandro",
      image: prototypeProductImages.sandro.navyTailoredSet,
      name: "Brown city loafers",
      price: "₹2,499"
    })
  ],
  top: [
    createPiece("top", 0, {
      brand: "Trends",
      image: prototypeProductImages.sandro.whitePinstripeSuit,
      isOwned: true,
      name: "White linen shirt",
      price: "₹2,899"
    }),
    createPiece("top", 1, {
      brand: "Maje",
      image: prototypeProductImages.maje.greenDenimTop,
      isOwned: false,
      name: "Ribbed fitted top",
      price: "₹1,499"
    }),
    createPiece("top", 2, {
      brand: "Sandro",
      image: prototypeProductImages.sandro.denimJacket,
      isOwned: false,
      name: "Airy cotton blouse",
      price: "₹1,899"
    }),
    createPiece("top", 3, {
      brand: "Maje",
      image: prototypeProductImages.maje.ivoryMiniDress,
      isOwned: false,
      name: "Lace-trim cami",
      price: "₹1,699"
    }),
    createPiece("top", 4, {
      brand: "Trends",
      image: prototypeProductImages.maje.beigeCrochetDress,
      isOwned: false,
      name: "Relaxed cotton tee",
      price: "₹1,299"
    })
  ]
};

export function getPieceAlternatives(kind: OutfitPieceKind) {
  return pieceAlternatives[kind] ?? [];
}

export function getRupeeValue(price: string) {
  const numericValue = Number(price.replace(/[^\d]/g, ""));

  return Number.isFinite(numericValue) ? numericValue : 0;
}

export function formatRupeeAmount(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function getBuyablePieces(pieces: LookPiece[]) {
  return pieces.filter((piece) => !piece.isOwned);
}

export function getTryOnPriceSummary(pieces: LookPiece[]) {
  const buyablePieces = getBuyablePieces(pieces);
  const ownedPieces = pieces.filter((piece) => piece.isOwned);
  const total = buyablePieces.reduce(
    (sum, piece) => sum + getRupeeValue(piece.price),
    0
  );
  const ownedLabel =
    ownedPieces.length === 1
      ? `Your ${ownedPieces[0].name.toLowerCase()}`
      : `${ownedPieces.length} closet pieces`;
  const buyableLabel =
    buyablePieces.length === 1 ? "1 new piece" : `${buyablePieces.length} new pieces`;

  return {
    buyableCount: buyablePieces.length,
    context:
      ownedPieces.length > 0
        ? `${ownedLabel} + ${buyableLabel}`
        : `${buyablePieces.length} pieces`,
    total,
    totalLabel: `${formatRupeeAmount(total)} for ${buyablePieces.length} ${
      buyablePieces.length === 1 ? "piece" : "pieces"
    }`
  };
}
