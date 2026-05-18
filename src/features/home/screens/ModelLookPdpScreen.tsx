import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import {
  ImageBackground,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";

import { colors, fonts, spacing } from "../../../theme";
import type { OutfitPieceKind, ProductLook } from "./HomeScreen";

type ModelLookPdpScreenProps = {
  look: ProductLook;
  onBack: () => void;
};

type SimilarItem = {
  id: string;
  image: string;
  kind: OutfitPieceKind;
  price: string;
  title: string;
};

const ctaBottomInset = Platform.OS === "ios" ? 6 : spacing.xs;
const drawerOverlap = 36;

const similarItemsByKind: Record<OutfitPieceKind, SimilarItem[]> = {
  bag: [
    {
      id: "bag-structured",
      image:
        "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=600&q=80",
      kind: "bag",
      price: "₹2,490",
      title: "Structured mini bag"
    },
    {
      id: "bag-soft",
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
      kind: "bag",
      price: "₹1,990",
      title: "Soft shoulder bag"
    }
  ],
  bottom: [
    {
      id: "bottom-wide-leg",
      image:
        "https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?auto=format&fit=crop&w=700&q=80",
      kind: "bottom",
      price: "₹2,799",
      title: "Wide-leg trousers"
    },
    {
      id: "bottom-tailored",
      image:
        "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=700&q=80",
      kind: "bottom",
      price: "₹3,290",
      title: "Tailored city pants"
    }
  ],
  dress: [
    {
      id: "dress-slip",
      image:
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=700&q=80",
      kind: "dress",
      price: "₹2,999",
      title: "Satin slip dress"
    },
    {
      id: "dress-wrap",
      image:
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=80",
      kind: "dress",
      price: "₹3,499",
      title: "Linen wrap dress"
    }
  ],
  jacket: [
    {
      id: "jacket-cropped",
      image:
        "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=700&q=80",
      kind: "jacket",
      price: "₹4,299",
      title: "Soft cropped blazer"
    },
    {
      id: "jacket-city",
      image:
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=700&q=80",
      kind: "jacket",
      price: "₹5,990",
      title: "Tailored city jacket"
    }
  ],
  shoe: [
    {
      id: "shoe-runner",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
      kind: "shoe",
      price: "₹2,300",
      title: "Soft runner"
    },
    {
      id: "shoe-slingback",
      image:
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=80",
      kind: "shoe",
      price: "₹2,790",
      title: "Clean slingback"
    }
  ],
  top: [
    {
      id: "top-rib",
      image:
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=80",
      kind: "top",
      price: "₹1,499",
      title: "Ribbed fitted top"
    },
    {
      id: "top-shirt",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",
      kind: "top",
      price: "₹1,299",
      title: "Relaxed cotton tee"
    }
  ]
};

function getPieceLabel(kind: OutfitPieceKind) {
  const labels: Record<OutfitPieceKind, string> = {
    bag: "Bag",
    bottom: "Bottom",
    dress: "Dress",
    jacket: "Layer",
    shoe: "Shoes",
    top: "Top"
  };

  return labels[kind];
}

function getSimilarItems(look: ProductLook, selectedKind: OutfitPieceKind) {
  const selectedItems = look.outfitItems.some((piece) => piece.kind === selectedKind)
    ? similarItemsByKind[selectedKind]
    : [];
  const items =
    selectedItems.length > 0
      ? selectedItems
      : look.outfitItems.flatMap((piece) => similarItemsByKind[piece.kind]);
  const uniqueItems = new Map(items.map((item) => [item.id, item]));

  return Array.from(uniqueItems.values()).slice(0, 4);
}

function SimilarItemCard({ item, width }: { item: SimilarItem; width: number }) {
  return (
    <Pressable accessibilityRole="button" style={[styles.similarCard, { width }]}>
      <ImageBackground
        imageStyle={styles.similarImageStyle}
        resizeMode="cover"
        source={{ uri: item.image }}
        style={styles.similarImage}
      >
        <View style={styles.similarKindPill}>
          <Text style={styles.similarKindText}>{getPieceLabel(item.kind)}</Text>
        </View>
        <View style={styles.similarSaveButton}>
          <Feather color={colors.text} name="heart" size={16} strokeWidth={2} />
        </View>
      </ImageBackground>
      <View style={styles.similarInfo}>
        <Text numberOfLines={1} style={styles.similarTitle}>
          {item.title}
        </Text>
        <Text style={styles.similarPrice}>{item.price}</Text>
      </View>
    </Pressable>
  );
}

export function ModelLookPdpScreen({ look, onBack }: ModelLookPdpScreenProps) {
  const { height, width } = useWindowDimensions();
  const [selectedKind, setSelectedKind] = useState<OutfitPieceKind>(
    look.outfitItems[0]?.kind ?? "top"
  );
  const similarItems = getSimilarItems(look, selectedKind);
  const heroHeight = Math.min(height * 0.68, 560);
  const similarCardWidth = (width - spacing.screen * 2 - spacing.sm) / 2;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={[styles.heroWrap, { height: heroHeight }]}>
          <ImageBackground
            imageStyle={styles.heroImageStyle}
            resizeMode="cover"
            source={{ uri: look.image }}
            style={styles.heroImage}
          >
            <View style={styles.heroMatchPill}>
              <Text style={styles.heroMatchText}>{look.match}</Text>
            </View>
          </ImageBackground>
        </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: 124,
            paddingTop: heroHeight - drawerOverlap
          }
        ]}
        showsVerticalScrollIndicator={false}
        style={styles.drawerScroll}
      >
        <View style={styles.sheet}>
          <View style={styles.drawerHandle} />
          <View style={styles.lookSummary}>
            <View style={styles.lookCopy}>
              <Text style={styles.lookTitle}>Shop the complete look</Text>
              <Text style={styles.lookSubtitle}>
                Similar pieces to recreate this outfit on yourself.
              </Text>
            </View>
            <View style={styles.pricePill}>
              <Text style={styles.pricePillText}>{look.price}</Text>
            </View>
          </View>

          <View style={styles.similarBlock}>
            <View style={styles.similarHeader}>
              <View style={styles.similarHeaderIcon}>
                <Feather color={colors.text} name="shopping-bag" size={18} />
              </View>
              <Text style={styles.similarHeading}>Shop similar items</Text>
            </View>

            <View style={styles.pieceRail}>
              {look.outfitItems.map((piece) => {
                const isSelected = selectedKind === piece.kind;

                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    key={`${piece.kind}-${piece.label}`}
                    onPress={() => setSelectedKind(piece.kind)}
                    style={[
                      styles.pieceChip,
                      isSelected ? styles.pieceChipSelected : null
                    ]}
                  >
                    <Text
                      style={[
                        styles.pieceChipText,
                        isSelected ? styles.pieceChipTextSelected : null
                      ]}
                    >
                      {piece.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.similarGrid}>
            {similarItems.map((item) => (
              <SimilarItemCard item={item} key={item.id} width={similarCardWidth} />
            ))}
          </View>
        </View>
      </ScrollView>

      <View pointerEvents="box-none" style={styles.topBar}>
        <Pressable
          accessibilityLabel="Back to home"
          accessibilityRole="button"
          onPress={onBack}
          style={styles.topButton}
        >
          <Feather color={colors.text} name="arrow-left" size={22} />
        </Pressable>
        <Pressable
          accessibilityLabel="Save look"
          accessibilityRole="button"
          style={styles.topButton}
        >
          <Feather color={colors.text} name="heart" size={22} />
        </Pressable>
      </View>

      <View style={styles.ctaDock}>
        <Pressable accessibilityRole="button" style={styles.secondaryCta}>
          <Text style={styles.secondaryCtaText}>Buy this look</Text>
        </Pressable>
        <Pressable accessibilityRole="button" style={styles.primaryCta}>
          <Text style={styles.primaryCtaText}>Try this look</Text>
        </Pressable>
      </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {},
  ctaDock: {
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    bottom: 0,
    flexDirection: "row",
    gap: spacing.md,
    left: 0,
    paddingBottom: ctaBottomInset,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.sm,
    position: "absolute",
    right: 0
  },
  drawerHandle: {
    alignSelf: "center",
    backgroundColor: colors.border,
    borderRadius: 2,
    height: 4,
    marginBottom: spacing.sm,
    width: 44
  },
  drawerScroll: {
    flex: 1
  },
  heroImage: {
    flex: 1,
    padding: spacing.md
  },
  heroImageStyle: {
    borderRadius: 24
  },
  heroMatchPill: {
    alignSelf: "flex-start",
    backgroundColor: colors.surfaceTranslucent,
    borderRadius: 18,
    marginBottom: spacing.xl + spacing.md,
    marginTop: "auto",
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  heroMatchText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14
  },
  heroWrap: {
    left: 0,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    position: "absolute",
    right: 0,
    top: 0
  },
  lookCopy: {
    flex: 1,
    minWidth: 0
  },
  lookSubtitle: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4
  },
  lookSummary: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between"
  },
  lookTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 25
  },
  pieceChip: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  pieceChipSelected: {
    backgroundColor: colors.text
  },
  pieceChipText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 15
  },
  pieceChipTextSelected: {
    color: colors.inverseText
  },
  pieceRail: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  pricePill: {
    alignSelf: "flex-start",
    backgroundColor: colors.text,
    borderRadius: 20,
    marginTop: 1,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  pricePillText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 15
  },
  primaryCta: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: 28,
    flex: 1,
    height: 54,
    justifyContent: "center"
  },
  primaryCtaText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 19
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1
  },
  secondaryCta: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 28,
    borderWidth: 1,
    flex: 1,
    height: 54,
    justifyContent: "center"
  },
  secondaryCtaText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 19
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    gap: spacing.xl,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.sm
  },
  similarBlock: {
    gap: spacing.md
  },
  similarCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden"
  },
  similarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  similarHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  similarHeaderIcon: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    width: 32
  },
  similarHeading: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 25
  },
  similarImage: {
    backgroundColor: colors.imageSurface,
    height: 190,
    padding: spacing.sm
  },
  similarImageStyle: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14
  },
  similarInfo: {
    gap: 3,
    padding: 10
  },
  similarKindPill: {
    alignSelf: "flex-start",
    backgroundColor: colors.surfaceTranslucent,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  similarKindText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    lineHeight: 13
  },
  similarPrice: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 13,
    lineHeight: 17
  },
  similarSaveButton: {
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    height: 34,
    justifyContent: "center",
    marginTop: "auto",
    width: 34
  },
  similarTitle: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    left: 0,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    position: "absolute",
    right: 0,
    top: 0
  },
  topButton: {
    alignItems: "center",
    backgroundColor: colors.surfaceTranslucent,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    height: 44,
    justifyContent: "center",
    width: 44
  }
});
