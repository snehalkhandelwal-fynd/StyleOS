import { Feather } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  ImageBackground,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextStyle,
  View
} from "react-native";
import type { TextInput as TextInputType } from "react-native";

import { colors, fonts, radii, spacing, typography } from "../../../theme";
import { brandRows, type Brand } from "../data/brandCatalog";

type SearchDiscoveryScreenProps = {
  onClose: () => void;
};

type TrendingLook = {
  action: string;
  image: string;
  meta: string;
  title: string;
};

type StyleTile = {
  image: string;
  label: string;
  subcopy: string;
};

type BudgetFilter = {
  image: string;
  label: string;
  subcopy: string;
};

const recentSearches = [
  "Vacation Dresses",
  "T-shirts",
  "Dinner date outfit",
  "Office blazer"
];

const trendingLooks: TrendingLook[] = [
  {
    action: "Try now",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=80",
    meta: "Dinner-ready",
    title: "Soft evening set"
  },
  {
    action: "Try now",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80",
    meta: "Vacation",
    title: "Travel denim"
  },
  {
    action: "Try now",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=80",
    meta: "Work-ready",
    title: "Linen city look"
  },
  {
    action: "Try now",
    image:
      "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=700&q=80",
    meta: "Party",
    title: "Satin night out"
  }
];

const styleTiles: StyleTile[] = [
  {
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=80",
    label: "Minimal",
    subcopy: "Clean layers"
  },
  {
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80",
    label: "Streetwear",
    subcopy: "Easy edge"
  },
  {
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=700&q=80",
    label: "Chic",
    subcopy: "Polished fits"
  },
  {
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=700&q=80",
    label: "Corporate",
    subcopy: "Work polish"
  }
];

const budgetFilters: BudgetFilter[] = [
  {
    image:
      "https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?auto=format&fit=crop&w=700&q=80",
    label: "Under ₹999",
    subcopy: "Try casual looks"
  },
  {
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=700&q=80",
    label: "Under ₹1999",
    subcopy: "Styled outfits"
  },
  {
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=700&q=80",
    label: "Under ₹2999",
    subcopy: "Smart sets"
  },
  {
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
    label: "Under ₹3999",
    subcopy: "Complete looks"
  }
];

const webTextInputReset =
  Platform.OS === "web"
    ? ({
        outlineStyle: "none",
        outlineWidth: 0
      } as unknown as TextStyle)
    : null;

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function RecentChip({ label }: { label: string }) {
  return (
    <Pressable accessibilityRole="button" style={styles.recentChip}>
      <Text numberOfLines={1} style={styles.recentChipText}>
        {label}
      </Text>
    </Pressable>
  );
}

function TrendingLookCard({ look }: { look: TrendingLook }) {
  return (
    <Pressable accessibilityRole="button" style={styles.lookCard}>
      <ImageBackground
        imageStyle={styles.lookImage}
        resizeMode="cover"
        source={{ uri: look.image }}
        style={styles.lookImageFrame}
      />
    </Pressable>
  );
}

function StyleTileCard({ tile }: { tile: StyleTile }) {
  return (
    <Pressable accessibilityRole="button" style={styles.styleTile}>
      <ImageBackground
        imageStyle={styles.styleTileImage}
        resizeMode="cover"
        source={{ uri: tile.image }}
        style={styles.styleTileImageFrame}
      >
        <View style={styles.imageScrim} />
        <View style={styles.styleTileContent}>
          <Text style={styles.styleTileText}>{tile.label}</Text>
          <Text style={styles.styleTileSubcopy}>{tile.subcopy}</Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

function BudgetCard({ filter }: { filter: BudgetFilter }) {
  return (
    <Pressable accessibilityRole="button" style={styles.budgetCard}>
      <ImageBackground
        imageStyle={styles.budgetImage}
        resizeMode="cover"
        source={{ uri: filter.image }}
        style={styles.budgetImageFrame}
      >
        <View style={styles.budgetScrim} />
        <Text style={styles.budgetText}>{filter.label}</Text>
        <Text style={styles.budgetSubcopy}>{filter.subcopy}</Text>
      </ImageBackground>
    </Pressable>
  );
}

function SearchBrandLogoPill({ brand }: { brand: Brand }) {
  return (
    <Pressable
      accessibilityLabel={`Search ${brand.name}`}
      accessibilityRole="button"
      style={styles.brandLogoPill}
    >
      <Image
        resizeMode="contain"
        source={brand.logoImage}
        style={{
          height: brand.logoHeight,
          width: brand.logoWidth
        }}
      />
    </Pressable>
  );
}

export function SearchDiscoveryScreen({ onClose }: SearchDiscoveryScreenProps) {
  const inputRef = useRef<TextInputType | null>(null);
  const [query, setQuery] = useState("");
  const [showRecent, setShowRecent] = useState(true);

  useEffect(() => {
    const focusTimer = setTimeout(() => {
      inputRef.current?.focus();
    }, 250);

    return () => clearTimeout(focusTimer);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Back"
            accessibilityRole="button"
            hitSlop={8}
            onPress={onClose}
            style={styles.backButton}
          >
            <Feather color={colors.text} name="arrow-left" size={24} />
          </Pressable>

          <View style={styles.searchBar}>
            <Feather color={colors.soft} name="search" size={22} />
            <TextInput
              cursorColor={colors.text}
              onChangeText={setQuery}
              placeholder="Search by occasion, style, or vibe..."
              placeholderTextColor={colors.soft}
              ref={inputRef}
              returnKeyType="search"
              selectionColor={colors.text}
              style={[styles.searchInput, webTextInputReset]}
              value={query}
            />
            <View style={styles.searchActions}>
              <Feather color={colors.soft} name="mic" size={20} />
              <Feather color={colors.soft} name="camera" size={20} />
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {showRecent ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <SectionTitle title="Recent Search" />
                <Pressable
                  accessibilityLabel="Clear recent searches"
                  accessibilityRole="button"
                  hitSlop={8}
                  onPress={() => setShowRecent(false)}
                  style={styles.clearButton}
                >
                  <Feather color={colors.muted} name="trash-2" size={21} />
                </Pressable>
              </View>
              <ScrollView
                contentContainerStyle={styles.horizontalTrack}
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {recentSearches.map((search) => (
                  <RecentChip key={search} label={search} />
                ))}
              </ScrollView>
            </View>
          ) : null}

          <View style={styles.section}>
            <SectionTitle title="Trending looks for you" />
            <ScrollView
              contentContainerStyle={styles.horizontalTrack}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {trendingLooks.map((look) => (
                <TrendingLookCard key={look.title} look={look} />
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <SectionTitle title="Explore by style" />
            <ScrollView
              contentContainerStyle={styles.horizontalTrack}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {styleTiles.map((style) => (
                <StyleTileCard key={style.label} tile={style} />
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <SectionTitle title="Looks under ₹1999" />
            <ScrollView
              contentContainerStyle={styles.horizontalTrack}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {budgetFilters.map((filter) => (
                <BudgetCard key={filter.label} filter={filter} />
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <SectionTitle title="Brands Everyone’s Searching" />
            <View style={styles.brandPanel}>
              {brandRows.map((row, rowIndex) => (
                <ScrollView
                  contentContainerStyle={styles.brandLogoTrack}
                  horizontal
                  key={`brand-row-${rowIndex}`}
                  showsHorizontalScrollIndicator={false}
                >
                  {row.map((brand) => (
                    <SearchBrandLogoPill
                      brand={brand}
                      key={`${brand.id}-${rowIndex}`}
                    />
                  ))}
                </ScrollView>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    width: 40
  },
  brandLogoPill: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radii.pill,
    height: 40,
    justifyContent: "center",
    overflow: "hidden",
    width: 105
  },
  brandLogoTrack: {
    gap: 6,
    paddingRight: spacing.screen
  },
  brandPanel: {
    backgroundColor: colors.brandBand,
    borderRadius: radii.card,
    gap: spacing.md,
    marginRight: spacing.screen,
    overflow: "hidden",
    paddingVertical: spacing.lg
  },
  budgetCard: {
    borderRadius: 62,
    height: 124,
    overflow: "hidden",
    width: 124
  },
  budgetImage: {
    borderRadius: 62
  },
  budgetImageFrame: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.md
  },
  budgetScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 10, 10, 0.24)"
  },
  budgetSubcopy: {
    color: colors.inverseText,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
    marginTop: 4,
    opacity: 0.88,
    textAlign: "center"
  },
  budgetText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 18,
    lineHeight: 22,
    textAlign: "center"
  },
  clearButton: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    width: 40
  },
  content: {
    gap: spacing.xxl,
    paddingBottom: 96,
    paddingTop: spacing.xl
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg
  },
  horizontalTrack: {
    gap: spacing.md,
    paddingRight: spacing.screen
  },
  imageScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 10, 10, 0.16)"
  },
  lookAction: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14.3
  },
  lookCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    height: 196,
    overflow: "hidden",
    width: 156
  },
  lookCopy: {
    flex: 1,
    minWidth: 0
  },
  lookFooter: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.sm
  },
  lookImage: {
    borderRadius: radii.card
  },
  lookImageFrame: {
    flex: 1,
    width: "100%"
  },
  lookMetaPill: {
    alignSelf: "flex-start",
    backgroundColor: colors.surfaceTranslucent,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  lookMetaText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14
  },
  lookReason: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
    marginTop: 2
  },
  lookTitle: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 17
  },
  recentChip: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 16
  },
  recentChipText: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 18
  },
  safeArea: {
    backgroundColor: colors.surfaceTertiary,
    flex: 1
  },
  screen: {
    backgroundColor: colors.surfaceTertiary,
    flex: 1
  },
  searchActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  searchBar: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    flexDirection: "row",
    gap: spacing.sm,
    height: 48,
    paddingHorizontal: spacing.md
  },
  searchInput: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    height: 40,
    includeFontPadding: false,
    lineHeight: 20,
    minWidth: 0,
    padding: 0
  },
  section: {
    gap: spacing.md,
    paddingLeft: spacing.screen
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: spacing.screen
  },
  sectionTitle: {
    color: colors.text,
    ...typography.sectionHeading
  },
  styleTile: {
    borderRadius: radii.card,
    height: 132,
    overflow: "hidden",
    width: 132
  },
  styleTileContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: spacing.md
  },
  styleTileImage: {
    borderRadius: radii.card
  },
  styleTileImageFrame: {
    flex: 1
  },
  styleTileSubcopy: {
    color: colors.inverseText,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16.8,
    marginTop: 3,
    opacity: 0.86
  },
  styleTileText: {
    color: colors.inverseText,
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 25
  }
});
