import { Feather } from "@expo/vector-icons";
import {
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import { colors, fonts, radii, spacing } from "../../../theme";
import { prototypeProductImages } from "../data/prototypeProductImages";

type ClosetFavourite = {
  category: string;
  id: string;
  image: string;
  lastStyled: string;
  note: string;
  occasions: string[];
  title: string;
  wearSignal: string;
};

type FavouriteLook = {
  anchor: string;
  id: string;
  image: string;
  title: string;
  vibe: string;
};

type ClosetFavouritesScreenProps = {
  onBack?: () => void;
  onOpenCloset?: () => void;
  onStartTryOn?: (context?: string) => void;
};

const heroFavourite: ClosetFavourite = {
  category: "Top",
  id: "white-linen-shirt",
  image: prototypeProductImages.maje.ivoryMiniDress,
  lastStyled: "Styled 4 times",
  note: "Clean base for work, brunch and travel looks.",
  occasions: ["Work", "Casual"],
  title: "White linen shirt",
  wearSignal: "Most reused"
};

const closetFavourites: ClosetFavourite[] = [
  heroFavourite,
  {
    category: "Bottom",
    id: "wide-leg-trousers",
    image: prototypeProductImages.maje.blueScarfTrousers,
    lastStyled: "Styled 3 times",
    note: "Easy match for fitted tops and soft layers.",
    occasions: ["Work", "Dinner"],
    title: "Wide-leg trousers",
    wearSignal: "Reliable base"
  },
  {
    category: "Layer",
    id: "beige-trench",
    image: prototypeProductImages.sandro.beigeTrench,
    lastStyled: "Styled 2 times",
    note: "Adds polish without making the look feel heavy.",
    occasions: ["Travel", "Work"],
    title: "Beige trench",
    wearSignal: "Mira pick"
  },
  {
    category: "Bag",
    id: "structured-bag",
    image: prototypeProductImages.shopThisLook.brownBag,
    lastStyled: "Styled 5 times",
    note: "Works with warm neutrals and tailored outfits.",
    occasions: ["Work", "Events"],
    title: "Structured brown bag",
    wearSignal: "Finishing piece"
  }
];

const favouriteLooks: FavouriteLook[] = [
  {
    anchor: "Uses your linen shirt",
    id: "work-favourite-look",
    image: prototypeProductImages.sandro.whitePinstripeSuit,
    title: "Work-ready neutral",
    vibe: "Polished layers"
  },
  {
    anchor: "Uses your trench",
    id: "travel-favourite-look",
    image: prototypeProductImages.maje.pinkRelaxedSet,
    title: "Soft travel day",
    vibe: "Easy movement"
  }
];

function Header({
  onBack,
  onOpenCloset
}: {
  onBack?: () => void;
  onOpenCloset?: () => void;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTopRow}>
        <Pressable
          accessibilityLabel="Back"
          accessibilityRole="button"
          onPress={onBack}
          style={({ pressed }) => [
            styles.headerIconButton,
            pressed ? styles.pressed : null
          ]}
        >
          <Feather color={colors.text} name="chevron-left" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Closet Favourites</Text>
        <Pressable
          accessibilityLabel="Add closet item"
          accessibilityRole="button"
          onPress={onOpenCloset}
          style={({ pressed }) => [
            styles.headerIconButton,
            pressed ? styles.pressed : null
          ]}
        >
          <Feather color={colors.text} name="plus" size={21} />
        </Pressable>
      </View>
      <Text style={styles.countStrip}>
        {closetFavourites.length} pieces Mira can reuse in looks
      </Text>
    </View>
  );
}

function HeroFavouriteCard({
  item,
  onOpenCloset,
  onStartTryOn
}: {
  item: ClosetFavourite;
  onOpenCloset?: () => void;
  onStartTryOn?: (context?: string) => void;
}) {
  return (
    <View style={styles.heroCard}>
      <ImageBackground
        imageStyle={styles.heroImageStyle}
        resizeMode="cover"
        source={{ uri: item.image }}
        style={styles.heroImage}
      >
        <View style={styles.heroBadge}>
          <Feather color={colors.text} name="star" size={13} />
          <Text style={styles.heroBadgeText}>{item.wearSignal}</Text>
        </View>
      </ImageBackground>
      <View style={styles.heroCopy}>
        <Text style={styles.heroKicker}>Start with a favourite</Text>
        <Text style={styles.heroTitle}>{item.title}</Text>
        <Text style={styles.heroBody}>{item.note}</Text>
        <View style={styles.heroActions}>
          <Pressable
            accessibilityLabel={`Style ${item.title}`}
            accessibilityRole="button"
            onPress={() => onStartTryOn?.(`Style ${item.title}`)}
            style={({ pressed }) => [
              styles.primaryAction,
              pressed ? styles.pressed : null
            ]}
          >
            <Text style={styles.primaryActionText}>Style this</Text>
          </Pressable>
          <Pressable
            accessibilityLabel="Add one closet item"
            accessibilityRole="button"
            onPress={onOpenCloset}
            style={({ pressed }) => [
              styles.secondaryAction,
              pressed ? styles.pressed : null
            ]}
          >
            <Text style={styles.secondaryActionText}>Add one item</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function FavouritePieceCard({
  item,
  onStartTryOn
}: {
  item: ClosetFavourite;
  onStartTryOn?: (context?: string) => void;
}) {
  return (
    <View style={styles.pieceCard}>
      <Image
        resizeMode="cover"
        source={{ uri: item.image }}
        style={styles.pieceImage}
      />
      <View style={styles.pieceCopy}>
        <View style={styles.pieceMetaRow}>
          <Text style={styles.pieceCategory}>{item.category}</Text>
          <Text style={styles.pieceDot}>/</Text>
          <Text style={styles.pieceMeta}>{item.lastStyled}</Text>
        </View>
        <Text numberOfLines={1} style={styles.pieceTitle}>
          {item.title}
        </Text>
        <Text numberOfLines={2} style={styles.pieceNote}>
          {item.note}
        </Text>
        <View style={styles.chipRow}>
          {item.occasions.map((occasion) => (
            <View key={occasion} style={styles.chip}>
              <Text style={styles.chipText}>{occasion}</Text>
            </View>
          ))}
        </View>
        <Pressable
          accessibilityLabel={`Style ${item.title}`}
          accessibilityRole="button"
          onPress={() => onStartTryOn?.(`Style ${item.title}`)}
          style={({ pressed }) => [
            styles.cardAction,
            pressed ? styles.pressed : null
          ]}
        >
          <Text style={styles.cardActionText}>Style this</Text>
        </Pressable>
      </View>
    </View>
  );
}

function FavouriteLookCard({
  look,
  onStartTryOn
}: {
  look: FavouriteLook;
  onStartTryOn?: (context?: string) => void;
}) {
  return (
    <ImageBackground
      imageStyle={styles.lookImageStyle}
      resizeMode="cover"
      source={{ uri: look.image }}
      style={styles.lookCard}
    >
      <View style={styles.lookShade} />
      <View style={styles.lookCopy}>
        <Text style={styles.lookAnchor}>{look.anchor}</Text>
        <Text style={styles.lookTitle}>{look.title}</Text>
        <Text style={styles.lookVibe}>{look.vibe}</Text>
      </View>
      <Pressable
        accessibilityLabel={`Try ${look.title}`}
        accessibilityRole="button"
        onPress={() => onStartTryOn?.(look.title)}
        style={({ pressed }) => [
          styles.lookAction,
          pressed ? styles.pressed : null
        ]}
      >
        <Text style={styles.lookActionText}>Try look</Text>
      </Pressable>
    </ImageBackground>
  );
}

export function ClosetFavouritesScreen({
  onBack,
  onOpenCloset,
  onStartTryOn
}: ClosetFavouritesScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Header onBack={onBack} onOpenCloset={onOpenCloset} />

        <HeroFavouriteCard
          item={heroFavourite}
          onOpenCloset={onOpenCloset}
          onStartTryOn={onStartTryOn}
        />

        <View style={styles.sectionHeader}>
          <View style={styles.sectionCopy}>
            <Text style={styles.sectionTitle}>Favourite pieces</Text>
            <Text style={styles.sectionBody}>
              Pieces you marked as easy to repeat.
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Manage closet favourites"
            accessibilityRole="button"
            onPress={onOpenCloset}
            style={({ pressed }) => [
              styles.manageButton,
              pressed ? styles.pressed : null
            ]}
          >
            <Text style={styles.manageButtonText}>Manage</Text>
          </Pressable>
        </View>

        <View style={styles.pieceList}>
          {closetFavourites.map((item) => (
            <FavouritePieceCard
              item={item}
              key={item.id}
              onStartTryOn={onStartTryOn}
            />
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionCopy}>
            <Text style={styles.sectionTitle}>Ready looks</Text>
            <Text style={styles.sectionBody}>
              Outfit ideas built around closet favourites.
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.lookTrack}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {favouriteLooks.map((look) => (
            <FavouriteLookCard
              key={look.id}
              look={look}
              onStartTryOn={onStartTryOn}
            />
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardAction: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.text,
    borderRadius: radii.pill,
    height: 34,
    justifyContent: "center",
    marginTop: spacing.xs,
    paddingHorizontal: spacing.lg
  },
  cardActionText: {
    color: colors.inverseText,
    fontFamily: fonts.cta,
    fontSize: 12,
    lineHeight: 15
  },
  chip: {
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs
  },
  chipText: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    lineHeight: 13
  },
  content: {
    gap: spacing.lg,
    paddingBottom: 140,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.sm
  },
  countStrip: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 17,
    textAlign: "center"
  },
  header: {
    gap: spacing.xs
  },
  headerIconButton: {
    alignItems: "center",
    height: 42,
    justifyContent: "center",
    width: 42
  },
  headerTitle: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 25,
    textAlign: "center"
  },
  headerTopRow: {
    alignItems: "center",
    flexDirection: "row"
  },
  heroActions: {
    flexDirection: "row",
    gap: spacing.sm
  },
  heroBadge: {
    alignItems: "center",
    backgroundColor: colors.surfaceTranslucent,
    borderRadius: radii.pill,
    flexDirection: "row",
    gap: spacing.xs,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    position: "absolute",
    top: spacing.sm
  },
  heroBadgeText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14
  },
  heroBody: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18
  },
  heroCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden"
  },
  heroCopy: {
    gap: spacing.sm,
    padding: spacing.md
  },
  heroImage: {
    backgroundColor: colors.imageSurface,
    height: 178,
    overflow: "hidden"
  },
  heroImageStyle: {
    borderTopLeftRadius: radii.card,
    borderTopRightRadius: radii.card
  },
  heroKicker: {
    color: colors.soft,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 0,
    lineHeight: 14,
    textTransform: "uppercase"
  },
  heroTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 23
  },
  lookAction: {
    alignItems: "center",
    backgroundColor: colors.surfaceTranslucent,
    borderRadius: radii.pill,
    bottom: spacing.md,
    height: 34,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    position: "absolute",
    right: spacing.md
  },
  lookActionText: {
    color: colors.text,
    fontFamily: fonts.cta,
    fontSize: 12,
    lineHeight: 15
  },
  lookAnchor: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14,
    opacity: 0.86
  },
  lookCard: {
    borderRadius: radii.card,
    height: 210,
    justifyContent: "flex-end",
    overflow: "hidden",
    padding: spacing.md,
    width: 260
  },
  lookCopy: {
    gap: 2,
    maxWidth: 154
  },
  lookImageStyle: {
    borderRadius: radii.card
  },
  lookShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.scrimMedium
  },
  lookTitle: {
    color: colors.inverseText,
    fontFamily: fonts.heading,
    fontSize: 17,
    lineHeight: 22
  },
  lookTrack: {
    gap: spacing.md,
    paddingRight: spacing.screen
  },
  lookVibe: {
    color: colors.inverseText,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.9
  },
  manageButton: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    height: 34,
    justifyContent: "center",
    paddingHorizontal: spacing.md
  },
  manageButtonText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 15
  },
  pieceCard: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.sm
  },
  pieceCategory: {
    color: colors.soft,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14,
    textTransform: "uppercase"
  },
  pieceCopy: {
    flex: 1,
    gap: spacing.xs
  },
  pieceDot: {
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14
  },
  pieceImage: {
    backgroundColor: colors.imageSurface,
    borderRadius: 10,
    height: 118,
    width: 92
  },
  pieceList: {
    gap: spacing.md
  },
  pieceMeta: {
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14
  },
  pieceMetaRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs
  },
  pieceNote: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16
  },
  pieceTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 15,
    lineHeight: 19
  },
  pressed: {
    opacity: 0.6
  },
  primaryAction: {
    alignItems: "center",
    backgroundColor: colors.inverse,
    borderRadius: radii.pill,
    flex: 1,
    height: 42,
    justifyContent: "center"
  },
  primaryActionText: {
    color: colors.inverseText,
    fontFamily: fonts.cta,
    fontSize: 14,
    lineHeight: 18
  },
  safeArea: {
    backgroundColor: colors.surfaceTertiary,
    flex: 1
  },
  secondaryAction: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    flex: 1,
    height: 42,
    justifyContent: "center"
  },
  secondaryActionText: {
    color: colors.text,
    fontFamily: fonts.cta,
    fontSize: 14,
    lineHeight: 18
  },
  sectionBody: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 17
  },
  sectionCopy: {
    flex: 1,
    gap: 2
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 17,
    lineHeight: 22
  }
});
