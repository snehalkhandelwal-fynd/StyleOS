import { prototypeProductImages } from "../data/prototypeProductImages";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
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
  color: string;
  condition: string;
  detailImage: string;
  fit: string;
  gender: string;
  id: string;
  image: string;
  lastWorn: string;
  material: string;
  size: string;
  status: string;
  tags: string[];
  title: string;
  wornCount: number;
};

const closetPieces: ClosetPiece[] = [
  {
    category: "Bottoms",
    color: "Cream floral",
    condition: "New",
    detailImage: prototypeProductImages.productOnly.bottom,
    fit: "Wide leg",
    gender: "Women",
    id: "striped-knit-set",
    image:
      prototypeProductImages.maje.greenDenimTop,
    lastWorn: "Never",
    material: "Viscose",
    size: "+ Add size",
    status: "Available",
    tags: ["striped", "casual", "wide leg", "relaxed"],
    title: "Striped knit set",
    wornCount: 0
  },
  {
    category: "Bottoms",
    color: "Ivory",
    condition: "New",
    detailImage: prototypeProductImages.productOnly.dress,
    fit: "Pleated",
    gender: "Women",
    id: "pleated-trousers",
    image:
      prototypeProductImages.sandro.whitePinstripeSuit,
    lastWorn: "Never",
    material: "Linen blend",
    size: "+ Add size",
    status: "Available",
    tags: ["casual", "pleated", "work", "neutral"],
    title: "Pleated trousers",
    wornCount: 0
  }
];

const detailFacts: {
  key: keyof Pick<
    ClosetPiece,
    "color" | "condition" | "fit" | "gender" | "material" | "size"
  >;
  label: string;
}[] = [
  { key: "color", label: "Color" },
  { key: "material", label: "Material" },
  { key: "size", label: "Size" },
  { key: "fit", label: "Fit" },
  { key: "gender", label: "Gender" },
  { key: "condition", label: "Condition" }
];

function ClosetToolbarButton({
  accessibilityLabel,
  icon,
  isExpanded,
  label,
  onPress,
  showChevron = false,
  variant = "secondary"
}: {
  accessibilityLabel?: string;
  icon: keyof typeof Feather.glyphMap;
  isExpanded?: boolean;
  label: string;
  onPress?: () => void;
  showChevron?: boolean;
  variant?: "primary" | "secondary";
}) {
  const iconColor = variant === "primary" ? colors.inverseText : colors.text;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={isExpanded === undefined ? undefined : { expanded: isExpanded }}
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
        color={iconColor}
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
      {showChevron ? (
        <Feather
          color={iconColor}
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={17}
        />
      ) : null}
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

function DetailFactCard({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  const isAddValue = value.startsWith("+");

  return (
    <View style={styles.detailFactCard}>
      <Text numberOfLines={1} style={styles.detailFactLabel}>
        {label}
      </Text>
      <Text
        numberOfLines={1}
        style={[
          styles.detailFactValue,
          isAddValue ? styles.detailFactValueAction : null
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function WearStatCard({
  label,
  tone,
  value
}: {
  label: string;
  tone?: "success";
  value: string;
}) {
  return (
    <View style={styles.wearStatCard}>
      <Text numberOfLines={1} style={styles.wearStatLabel}>
        {label}
      </Text>
      <Text
        numberOfLines={2}
        style={[
          styles.wearStatValue,
          tone === "success" ? styles.wearStatValueSuccess : null
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function ClosetDetailAction({
  icon,
  label,
  tone = "default"
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  tone?: "default" | "danger" | "disabled" | "success";
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={tone === "disabled"}
      style={({ pressed }) => [
        styles.detailActionButton,
        tone === "danger" ? styles.detailActionButtonDanger : null,
        tone === "disabled" ? styles.detailActionButtonDisabled : null,
        tone === "success" ? styles.detailActionButtonSuccess : null,
        pressed ? styles.pressed : null
      ]}
    >
      <Feather
        color={
          tone === "danger"
            ? "#D93434"
            : tone === "success"
              ? "#128A3A"
              : tone === "disabled"
                ? colors.soft
                : colors.muted
        }
        name={icon}
        size={18}
      />
      <Text
        numberOfLines={1}
        style={[
          styles.detailActionText,
          tone === "danger" ? styles.detailActionTextDanger : null,
          tone === "disabled" ? styles.detailActionTextDisabled : null,
          tone === "success" ? styles.detailActionTextSuccess : null
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function ClosetPieceDetailScreen({
  onBack,
  onStartTryOn,
  piece
}: {
  onBack: () => void;
  onStartTryOn?: () => void;
  piece: ClosetPiece;
}) {
  return (
    <SafeAreaView style={styles.detailSafeArea}>
      <ScrollView
        contentContainerStyle={styles.detailContent}
        showsVerticalScrollIndicator={false}
        style={styles.detailScreen}
      >
        <View style={styles.detailTopBar}>
          <Text numberOfLines={1} style={styles.detailScreenTitle}>
            Item Details
          </Text>
          <View style={styles.detailTopActions}>
            <Pressable
              accessibilityLabel="Edit item"
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.detailEditButton,
                pressed ? styles.pressed : null
              ]}
            >
              <Text style={styles.detailEditText}>Edit</Text>
            </Pressable>
            <Pressable
              accessibilityLabel="Close item details"
              accessibilityRole="button"
              onPress={onBack}
              style={({ pressed }) => [
                styles.detailCloseButton,
                pressed ? styles.pressed : null
              ]}
            >
              <Feather color={colors.text} name="x" size={22} />
            </Pressable>
          </View>
        </View>

        <View style={styles.detailHeroFrame}>
          <Image
            resizeMode="contain"
            source={{ uri: piece.detailImage }}
            style={styles.detailHeroImage}
          />
        </View>

        <View style={styles.detailIntro}>
          <Text style={styles.detailPieceTitle}>{piece.title}</Text>
          <Text style={styles.detailPieceCategory}>{piece.category}</Text>
        </View>

        <View style={styles.detailFactGrid}>
          {detailFacts.map((fact) => (
            <DetailFactCard
              key={fact.key}
              label={fact.label}
              value={piece[fact.key]}
            />
          ))}
        </View>

        <View style={styles.wearStatsRow}>
          <WearStatCard
            label="Worn"
            value={`${piece.wornCount}\ntimes`}
          />
          <WearStatCard label="Last worn" value={piece.lastWorn} />
          <WearStatCard label="Status" tone="success" value={piece.status} />
        </View>

        <View style={styles.detailTwoActionRow}>
          <ClosetDetailAction icon="calendar" label="Log wear" tone="success" />
          <ClosetDetailAction
            icon="archive"
            label="Send to laundry"
            tone="disabled"
          />
        </View>

        <View style={styles.detailTagsBlock}>
          <Text style={styles.detailSectionLabel}>Tags</Text>
          <View style={styles.detailTagRow}>
            {piece.tags.map((tag) => (
              <View key={`${piece.id}-detail-${tag}`} style={styles.detailTag}>
                <Text style={styles.detailTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.detailManageRow}>
          <ClosetDetailAction icon="heart" label="Favorite" />
          <ClosetDetailAction icon="box" label="Archive" />
          <Pressable
            accessibilityLabel={`Delete ${piece.title}`}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.detailDeleteButton,
              pressed ? styles.pressed : null
            ]}
          >
            <Feather color="#D93434" name="trash-2" size={21} />
          </Pressable>
        </View>

        <Pressable
          accessibilityLabel={`Try on ${piece.title} with Mira`}
          accessibilityRole="button"
          onPress={onStartTryOn}
          style={({ pressed }) => [
            styles.detailPrimaryCta,
            pressed ? styles.pressed : null
          ]}
        >
          <Feather color={colors.inverseText} name="star" size={18} />
          <Text numberOfLines={1} style={styles.detailPrimaryCtaText}>
            Try on with Mira
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

export function ClosetScreen({ onStartTryOn }: ClosetScreenProps) {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<ClosetPiece | null>(null);

  const handleSelectAddOption = () => {
    setIsAddMenuOpen(false);
    onStartTryOn?.();
  };

  if (selectedPiece) {
    return (
      <ClosetPieceDetailScreen
        onBack={() => setSelectedPiece(null)}
        onStartTryOn={onStartTryOn}
        piece={selectedPiece}
      />
    );
  }

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
              accessibilityLabel="Add item options"
              icon="plus"
              isExpanded={isAddMenuOpen}
              label="Add item"
              onPress={() => setIsAddMenuOpen((isOpen) => !isOpen)}
              showChevron
              variant="primary"
            />

            {isAddMenuOpen ? (
              <View style={styles.addMenu}>
                <Pressable
                  accessibilityRole="button"
                  onPress={handleSelectAddOption}
                  style={({ pressed }) => [
                    styles.addMenuOption,
                    pressed ? styles.pressed : null
                  ]}
                >
                  <Feather color={colors.text} name="plus-circle" size={18} />
                  <Text style={styles.addMenuOptionText}>Add one item</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={handleSelectAddOption}
                  style={({ pressed }) => [
                    styles.addMenuOption,
                    pressed ? styles.pressed : null
                  ]}
                >
                  <Feather color={colors.text} name="upload" size={18} />
                  <Text style={styles.addMenuOptionText}>Add bulk</Text>
                </Pressable>
              </View>
            ) : null}
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
              onPress={() => setSelectedPiece(piece)}
              piece={piece}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addMenu: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    paddingVertical: spacing.xs,
    position: "absolute",
    right: 0,
    shadowColor: "#000000",
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    top: 56,
    width: 196,
    zIndex: 20
  },
  addMenuOption: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 44,
    paddingHorizontal: spacing.md
  },
  addMenuOptionText: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18
  },
  content: {
    paddingBottom: 116,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xl
  },
  detailActionButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    flexDirection: "row",
    gap: spacing.sm,
    height: 52,
    justifyContent: "center",
    minWidth: 0,
    paddingHorizontal: spacing.md
  },
  detailActionButtonDanger: {
    backgroundColor: "#FFF1F1",
    borderColor: "#F2D1D1"
  },
  detailActionButtonDisabled: {
    backgroundColor: colors.surface,
    opacity: 0.68
  },
  detailActionButtonSuccess: {
    backgroundColor: "#EEF8F1",
    borderColor: "#D8EFDF"
  },
  detailActionText: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18
  },
  detailActionTextDanger: {
    color: "#D93434"
  },
  detailActionTextDisabled: {
    color: colors.soft
  },
  detailActionTextSuccess: {
    color: "#128A3A"
  },
  detailCloseButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  detailContent: {
    paddingBottom: 128,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg
  },
  detailDeleteButton: {
    alignItems: "center",
    backgroundColor: "#FFF1F1",
    borderColor: "#F2D1D1",
    borderRadius: radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    height: 52,
    justifyContent: "center",
    width: 58
  },
  detailEditButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    height: 42,
    justifyContent: "center",
    paddingHorizontal: spacing.lg
  },
  detailEditText: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18
  },
  detailFactCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    flexBasis: "47.8%",
    flexGrow: 1,
    minHeight: 78,
    padding: spacing.md
  },
  detailFactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginTop: spacing.lg
  },
  detailFactLabel: {
    color: colors.soft,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 0.6,
    lineHeight: 14,
    textTransform: "uppercase"
  },
  detailFactValue: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 17,
    lineHeight: 22,
    marginTop: spacing.sm
  },
  detailFactValueAction: {
    color: colors.text
  },
  detailHeroFrame: {
    alignItems: "center",
    aspectRatio: 0.78,
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    marginTop: spacing.lg,
    overflow: "hidden",
    padding: spacing.sm
  },
  detailHeroImage: {
    height: "100%",
    width: "100%"
  },
  detailIntro: {
    marginTop: spacing.xl
  },
  detailManageRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xl
  },
  detailPieceCategory: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 18,
    lineHeight: 23,
    marginTop: spacing.xs
  },
  detailPieceTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 28,
    lineHeight: 34
  },
  detailPrimaryCta: {
    alignItems: "center",
    backgroundColor: colors.inverse,
    borderRadius: radii.button,
    flexDirection: "row",
    gap: spacing.sm,
    height: 56,
    justifyContent: "center",
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg
  },
  detailPrimaryCtaText: {
    color: colors.inverseText,
    fontFamily: fonts.cta,
    fontSize: 16,
    lineHeight: 20
  },
  detailSafeArea: {
    backgroundColor: colors.surfaceTertiary,
    flex: 1
  },
  detailScreen: {
    backgroundColor: colors.surfaceTertiary,
    flex: 1
  },
  detailScreenTitle: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.heading,
    fontSize: 24,
    lineHeight: 30
  },
  detailSectionLabel: {
    color: colors.soft,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.6,
    lineHeight: 16,
    textTransform: "uppercase"
  },
  detailTag: {
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  detailTagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.sm
  },
  detailTagText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 17
  },
  detailTagsBlock: {
    marginTop: spacing.xl
  },
  detailTopActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  detailTopBar: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md
  },
  detailTwoActionRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg
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
    justifyContent: "space-between",
    zIndex: 4
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
    gap: spacing.sm,
    position: "relative",
    zIndex: 5
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
  },
  wearStatCard: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    justifyContent: "center",
    minHeight: 88,
    minWidth: 0,
    padding: spacing.sm
  },
  wearStatLabel: {
    color: colors.soft,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 0.6,
    lineHeight: 14,
    textAlign: "center",
    textTransform: "uppercase"
  },
  wearStatValue: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    lineHeight: 20,
    marginTop: spacing.sm,
    textAlign: "center"
  },
  wearStatValueSuccess: {
    color: "#128A3A"
  },
  wearStatsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg
  }
});
