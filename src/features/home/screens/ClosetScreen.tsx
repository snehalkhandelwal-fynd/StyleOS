import { prototypeProductImages } from "../data/prototypeProductImages";
import { Feather, Ionicons } from "@expo/vector-icons";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import { colors, fonts, radii, spacing, typography } from "../../../theme";

type ClosetScreenProps = {
  onAskMira?: () => void;
  onStartTryOn?: () => void;
};

type ClosetPiece = {
  category: string;
  id: string;
  image: string;
  tags: string[];
  title: string;
};

const closetPieces: ClosetPiece[] = [
  {
    category: "Bottoms",
    id: "striped-knit-set",
    image:
      prototypeProductImages.maje.greenDenimTop,
    tags: ["striped", "casual"],
    title: "Striped knit set"
  },
  {
    category: "Bottoms",
    id: "pleated-trousers",
    image:
      prototypeProductImages.sandro.whitePinstripeSuit,
    tags: ["casual", "pleated"],
    title: "Pleated trousers"
  }
];

function ClosetToolbarButton({
  icon,
  label,
  onPress,
  variant = "secondary"
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary";
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.toolbarButton,
        variant === "primary"
          ? styles.toolbarButtonPrimary
          : styles.toolbarButtonSecondary,
        pressed ? styles.pressed : null
      ]}
    >
      <Feather
        color={variant === "primary" ? colors.inverseText : colors.text}
        name={icon}
        size={18}
      />
      <Text
        style={[
          styles.toolbarButtonText,
          variant === "primary" ? styles.toolbarButtonTextPrimary : null
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function ClosetPieceCard({
  onPress,
  piece
}: {
  onPress?: () => void;
  piece: ClosetPiece;
}) {
  return (
    <Pressable
      accessibilityLabel={`${piece.title}, ${piece.category}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.pieceCard,
        pressed ? styles.pressed : null
      ]}
    >
      <View style={styles.pieceMedia}>
        <Image
          resizeMode="cover"
          source={{ uri: piece.image }}
          style={styles.pieceImage}
        />
        <Pressable
          accessibilityLabel={`Save ${piece.title}`}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.heartButton,
            pressed ? styles.pressed : null
          ]}
        >
          <Ionicons color={colors.text} name="heart-outline" size={20} />
        </Pressable>
      </View>

      <View style={styles.pieceCopy}>
        <Text numberOfLines={1} style={styles.pieceTitle}>
          {piece.title}
        </Text>
        <Text numberOfLines={1} style={styles.pieceCategory}>
          {piece.category}
        </Text>
        <View style={styles.tagRow}>
          {piece.tags.map((tag) => (
            <View key={`${piece.id}-${tag}`} style={styles.tag}>
              <Text numberOfLines={1} style={styles.tagText}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

export function ClosetScreen({ onStartTryOn }: ClosetScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.screen}
      >
        <View style={styles.header}>
          <View style={styles.headerTitleBlock}>
            <Text numberOfLines={1} style={styles.title}>
              My Closet
            </Text>
            <Text style={styles.itemCount}>{closetPieces.length} items</Text>
          </View>

          <View style={styles.toolbar}>
            <ClosetToolbarButton
              icon="upload"
              label="Batch"
              onPress={onStartTryOn}
            />
            <ClosetToolbarButton
              icon="plus"
              label="Add one"
              variant="primary"
            />
          </View>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Feather color={colors.soft} name="search" size={21} />
            <TextInput
              accessibilityLabel="Search closet"
              placeholder="Search your wardrobe..."
              placeholderTextColor={colors.soft}
              returnKeyType="search"
              style={styles.searchInput}
            />
            <Feather color={colors.soft} name="mic" size={20} />
          </View>

          <Pressable
            accessibilityLabel="Filter closet"
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.filterButton,
              pressed ? styles.pressed : null
            ]}
          >
            <Feather color={colors.text} name="sliders" size={21} />
          </Pressable>
        </View>

        <View style={styles.grid}>
          {closetPieces.map((piece) => (
            <ClosetPieceCard
              key={piece.id}
              onPress={onStartTryOn}
              piece={piece}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 116,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xl
  },
  filterButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginTop: spacing.xl
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between"
  },
  headerTitleBlock: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0
  },
  heartButton: {
    alignItems: "center",
    backgroundColor: colors.surfaceTranslucent,
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    position: "absolute",
    right: spacing.sm,
    top: spacing.sm,
    width: 36
  },
  itemCount: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 20
  },
  pieceCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    flexBasis: "47.8%",
    flexGrow: 1,
    overflow: "hidden"
  },
  pieceCategory: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 17,
    marginTop: 2
  },
  pieceCopy: {
    padding: spacing.md
  },
  pieceImage: {
    height: "100%",
    width: "100%"
  },
  pieceMedia: {
    aspectRatio: 0.84,
    backgroundColor: colors.imageSurface,
    overflow: "hidden"
  },
  pieceTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 15,
    lineHeight: 19
  },
  pressed: {
    opacity: 0.72
  },
  safeArea: {
    backgroundColor: colors.surfaceTertiary,
    flex: 1
  },
  screen: {
    backgroundColor: colors.surfaceTertiary,
    flex: 1
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
    height: 42,
    includeFontPadding: false,
    lineHeight: 20,
    minWidth: 0,
    padding: 0
  },
  searchRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xl
  },
  tag: {
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    maxWidth: "100%",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginTop: spacing.md
  },
  tagText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14
  },
  title: {
    color: colors.text,
    ...typography.displayHeadline
  },
  toolbar: {
    flexDirection: "row",
    flexShrink: 0,
    gap: spacing.sm
  },
  toolbarButton: {
    alignItems: "center",
    borderRadius: radii.button,
    flexDirection: "row",
    gap: spacing.xs,
    height: 48,
    justifyContent: "center",
    paddingHorizontal: spacing.lg
  },
  toolbarButtonPrimary: {
    backgroundColor: colors.inverse
  },
  toolbarButtonSecondary: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth
  },
  toolbarButtonText: {
    color: colors.text,
    fontFamily: fonts.cta,
    fontSize: 14,
    lineHeight: 18
  },
  toolbarButtonTextPrimary: {
    color: colors.inverseText
  }
});
