import { prototypeProductImages } from "../data/prototypeProductImages";
import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import { colors, fonts, radii, spacing, typography } from "../../../theme";
import {
  AppScreenHeader,
  appScreenTopPadding
} from "../components/AppScreenHeader";
import { WishlistHeartIcon } from "../components/WishlistHeartIcon";
import { appBottomSafeInset } from "../utils/safeArea";

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

type QuickAddMode = "select" | "analyzing" | "review";
type DetectedCategory = "Top" | "Bottom" | "Layer" | "Shoes" | "Bag";

type DetectedClosetItem = {
  category: DetectedCategory;
  color: string;
  id: string;
  image: string;
  name: string;
  size: string;
  sourceAssetKey?: string;
  tags: string[];
};

type PickedPhotoAsset = {
  key: string;
  uri: string;
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

const detectedCategories: DetectedCategory[] = [
  "Top",
  "Bottom",
  "Layer",
  "Shoes",
  "Bag"
];
const defaultSizeOptions = ["XS", "S", "M", "L", "XL"];
const bottomSizeOptions = ["26", "28", "30", "32", "34", "36"];
const shoeSizeOptions = ["5", "6", "7", "8", "9", "10"];
const detectedGraphicTeeImage = Image.resolveAssetSource(
  require("../../../../Images/Product Images/Tops/Maje_MFPTO01351-10_F_P.jpg")
).uri;
const detectedLightWashJeansImage = Image.resolveAssetSource(
  require("../../../../Images/Product Images/Bottoms/Sandro_SFPJE00818-4785_F_P.jpg")
).uri;
const detectedItemTemplates: Array<{
  category: DetectedCategory;
  color: string;
  fallbackImage: string;
  name: string;
  slug: string;
  tags: string[];
}> = [
  {
    category: "Top",
    color: "White",
    fallbackImage: detectedGraphicTeeImage,
    name: "White Graphic Tee",
    slug: "top",
    tags: ["casual", "graphic print", "short sleeve"]
  },
  {
    category: "Bottom",
    color: "Blue",
    fallbackImage: detectedLightWashJeansImage,
    name: "Light Wash Jeans",
    slug: "bottom",
    tags: ["casual", "light wash", "straight leg"]
  },
  {
    category: "Layer",
    color: "Beige",
    fallbackImage: prototypeProductImages.productOnly.jacket,
    name: "Cropped Knit Jacket",
    slug: "layer",
    tags: ["casual", "cropped", "light layer"]
  },
  {
    category: "Shoes",
    color: "Brown",
    fallbackImage: prototypeProductImages.productOnly.shoe,
    name: "Everyday Leather Shoes",
    slug: "shoe",
    tags: ["casual", "leather", "everyday"]
  },
  {
    category: "Bag",
    color: "Neutral",
    fallbackImage: prototypeProductImages.productOnly.accessory,
    name: "Shoulder Bag",
    slug: "bag",
    tags: ["casual", "shoulder bag", "daywear"]
  }
];

function getSizeOptions(category: DetectedCategory) {
  if (category === "Bottom") {
    return bottomSizeOptions;
  }

  if (category === "Shoes") {
    return shoeSizeOptions;
  }

  return defaultSizeOptions;
}

function getPickedAssetKey(
  asset: { assetId?: string | null; fileName?: string | null; name?: string | null; uri?: string },
  index: number
) {
  return asset.assetId ?? asset.uri ?? asset.fileName ?? asset.name ?? `picked-${index}`;
}

function createDetectedItems(
  seed: number,
  selectedAssets: PickedPhotoAsset[] = []
): DetectedClosetItem[] {
  const sourceAssets =
    selectedAssets.length > 0
      ? selectedAssets
      : Array.from({ length: 2 }, (_, index) => ({
          key: `sample-${seed}-${index}`,
          uri: ""
        }));

  return sourceAssets.map((sourceAsset, index) => {
    const template =
      detectedItemTemplates[index % detectedItemTemplates.length];
    const cycle = Math.floor(index / detectedItemTemplates.length);

    return {
      category: template.category,
      color: template.color,
      id: `detected-${template.slug}-${seed}-${index}`,
      image: template.fallbackImage,
      name: cycle > 0 ? `${template.name} ${cycle + 1}` : template.name,
      size: "",
      sourceAssetKey: sourceAsset.key,
      tags: template.tags
    };
  });
}

function getClosetCategory(category: DetectedCategory) {
  switch (category) {
    case "Top":
      return "Tops";
    case "Bottom":
      return "Bottoms";
    case "Layer":
      return "Layers";
    case "Shoes":
      return "Shoes";
    case "Bag":
      return "Bags";
    default:
      return "Items";
  }
}

function getDetectedSaveLabel(count: number) {
  return `Add ${count} ${count === 1 ? "Item" : "Items"}`;
}

function toClosetPiece(item: DetectedClosetItem): ClosetPiece {
  return {
    category: getClosetCategory(item.category),
    color: item.color,
    condition: "New",
    detailImage: item.image,
    fit: "+ Add fit",
    gender: "Women",
    id: item.id,
    image: item.image,
    lastWorn: "Never",
    material: "+ Add material",
    size: item.size || "+ Add size",
    status: "Available",
    tags: item.tags,
    title: item.name || "Untitled item",
    wornCount: 0
  };
}

function ClosetToolbarButton({
  accessibilityLabel,
  icon,
  label,
  onPress,
  variant = "secondary"
}: {
  accessibilityLabel?: string;
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary";
}) {
  const iconColor = variant === "primary" ? colors.inverseText : colors.text;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
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
          <WishlistHeartIcon saved={false} />
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
          {piece.tags.slice(0, 3).map((tag) => (
            <View key={`${piece.id}-${tag}`} style={styles.tag}>
              <Text style={styles.tagText}>
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

function ChoicePill({
  label,
  onPress,
  selected
}: {
  label: string;
  onPress: () => void;
  selected: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.detectedChoicePill,
        selected ? styles.detectedChoicePillSelected : null,
        pressed ? styles.pressed : null
      ]}
    >
      <Text
        style={[
          styles.detectedChoicePillText,
          selected ? styles.detectedChoicePillTextSelected : null
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function DetectedItemCard({
  expanded,
  item,
  onAddMoreDetails,
  onRemove,
  onToggle,
  onUpdateCategory,
  onUpdateName,
  onUpdateSize
}: {
  expanded: boolean;
  item: DetectedClosetItem;
  onAddMoreDetails: () => void;
  onRemove: () => void;
  onToggle: () => void;
  onUpdateCategory: (category: DetectedCategory) => void;
  onUpdateName: (name: string) => void;
  onUpdateSize: (size: string) => void;
}) {
  const sizeOptions = getSizeOptions(item.category);

  return (
    <View style={[styles.detectedCard, expanded ? styles.detectedCardExpanded : null]}>
      <Pressable
        accessibilityLabel={`Edit ${item.name}`}
        accessibilityRole="button"
        onPress={onToggle}
        style={({ pressed }) => [
          styles.detectedCardSummary,
          pressed ? styles.pressed : null
        ]}
      >
        <Image
          resizeMode="cover"
          source={{ uri: item.image }}
          style={styles.detectedItemImage}
        />
        <View style={styles.detectedItemCopy}>
          <Text numberOfLines={1} style={styles.detectedItemName}>
            {item.name}
          </Text>
          <Text numberOfLines={1} style={styles.detectedItemMeta}>
            {getClosetCategory(item.category)} · {item.color}
          </Text>
          <Text numberOfLines={1} style={styles.detectedItemTags}>
            {item.tags.join(", ")}
          </Text>
        </View>
        <Pressable
          accessibilityLabel={`Remove ${item.name}`}
          accessibilityRole="button"
          onPress={onRemove}
          style={({ pressed }) => [
            styles.detectedRemoveButton,
            pressed ? styles.pressed : null
          ]}
        >
          <Feather color={colors.soft} name="x" size={20} />
        </Pressable>
      </Pressable>

      {expanded ? (
        <View style={styles.detectedEditor}>
          <View style={styles.detectedNameField}>
            <TextInput
              accessibilityLabel="Item name"
              onChangeText={onUpdateName}
              placeholder="Item name"
              placeholderTextColor={colors.soft}
              style={styles.detectedNameInput}
              value={item.name}
            />
            {item.name.length > 0 ? (
              <Pressable
                accessibilityLabel="Clear item name"
                accessibilityRole="button"
                onPress={() => onUpdateName("")}
                style={({ pressed }) => [
                  styles.detectedNameClearButton,
                  pressed ? styles.pressed : null
                ]}
              >
                <Feather color={colors.soft} name="x" size={16} />
              </Pressable>
            ) : null}
          </View>

          <View style={styles.detectedPillRow}>
            {detectedCategories.map((category) => (
              <ChoicePill
                key={category}
                label={category}
                onPress={() => onUpdateCategory(category)}
                selected={item.category === category}
              />
            ))}
          </View>

          <View style={styles.detectedPillRow}>
            {sizeOptions.map((size) => (
              <ChoicePill
                key={`${item.id}-${size}`}
                label={size}
                onPress={() => onUpdateSize(size)}
                selected={item.size === size}
              />
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={onAddMoreDetails}
            style={({ pressed }) => [
              styles.detectedMoreDetailsButton,
              pressed ? styles.pressed : null
            ]}
          >
            <Text style={styles.detectedMoreDetailsText}>
              Add more details →
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function QuickAddBatchDrawer({
  detectedItems,
  expandedItemId,
  mode,
  onClose,
  onMarkDetailAfterSave,
  onRemoveDetectedItem,
  onSaveDetectedItems,
  onSelectPhotos,
  onToggleDetectedItem,
  onUpdateDetectedCategory,
  onUpdateDetectedName,
  onUpdateDetectedSize,
  visible
}: {
  detectedItems: DetectedClosetItem[];
  expandedItemId: string | null;
  mode: QuickAddMode;
  onClose: () => void;
  onMarkDetailAfterSave: (itemId: string) => void;
  onRemoveDetectedItem: (itemId: string) => void;
  onSaveDetectedItems: () => void;
  onSelectPhotos: () => void;
  onToggleDetectedItem: (itemId: string) => void;
  onUpdateDetectedCategory: (itemId: string, category: DetectedCategory) => void;
  onUpdateDetectedName: (itemId: string, name: string) => void;
  onUpdateDetectedSize: (itemId: string, size: string) => void;
  visible: boolean;
}) {
  const uploadLabel = mode === "select" ? "Select Photos" : "Add More Photos";
  const hasDetectedItems = detectedItems.length > 0;

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View style={styles.addDrawerRoot}>
        <Pressable
          accessibilityLabel="Close quick add drawer"
          accessibilityRole="button"
          onPress={onClose}
          style={styles.addDrawerScrim}
        />
        <View
          style={[
            styles.addDrawer,
            mode !== "select" ? styles.addDrawerReview : null
          ]}
        >
          <View style={styles.addDrawerHandle} />
          <View style={styles.addDrawerHeader}>
            <View style={styles.addDrawerCopy}>
              <Text style={styles.addDrawerTitle}>Add New Items</Text>
              <Text style={styles.addDrawerSubtitle}>
                Select multiple photos and Mira will detect each item
                automatically.
              </Text>
            </View>
          </View>

          <Pressable
            accessibilityLabel="Select photos for batch closet upload"
            accessibilityRole="button"
            onPress={onSelectPhotos}
            style={({ pressed }) => [
              styles.addDrawerUploadTarget,
              pressed ? styles.pressed : null
            ]}
          >
            <Feather color={colors.muted} name="upload-cloud" size={22} />
            <Text style={styles.addDrawerUploadText}>{uploadLabel}</Text>
          </Pressable>

          {mode === "analyzing" ? (
            <View style={styles.analyzingPanel}>
              <ActivityIndicator color={colors.text} size="small" />
              <View style={styles.analyzingCopy}>
                <Text style={styles.analyzingTitle}>Analyzing items...</Text>
                <Text style={styles.analyzingText}>
                  Mira is detecting each clothing piece from your photos.
                </Text>
              </View>
            </View>
          ) : null}

          {mode === "review" ? (
            <>
              <ScrollView
                contentContainerStyle={styles.detectedListContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                style={styles.detectedList}
              >
                {detectedItems.map((item) => (
                  <DetectedItemCard
                    expanded={expandedItemId === item.id}
                    item={item}
                    key={item.id}
                    onAddMoreDetails={() => onMarkDetailAfterSave(item.id)}
                    onRemove={() => onRemoveDetectedItem(item.id)}
                    onToggle={() => onToggleDetectedItem(item.id)}
                    onUpdateCategory={(category) =>
                      onUpdateDetectedCategory(item.id, category)
                    }
                    onUpdateName={(name) => onUpdateDetectedName(item.id, name)}
                    onUpdateSize={(size) => onUpdateDetectedSize(item.id, size)}
                  />
                ))}
              </ScrollView>

              <Pressable
                accessibilityRole="button"
                disabled={!hasDetectedItems}
                onPress={onSaveDetectedItems}
                style={({ pressed }) => [
                  styles.addDetectedCta,
                  !hasDetectedItems ? styles.addDetectedCtaDisabled : null,
                  pressed && hasDetectedItems ? styles.pressed : null
                ]}
              >
                <Feather color={colors.inverseText} name="plus" size={18} />
                <Text style={styles.addDetectedCtaText}>
                  {getDetectedSaveLabel(detectedItems.length)}
                </Text>
              </Pressable>
            </>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

export function ClosetScreen({ onStartTryOn }: ClosetScreenProps) {
  const analysisTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pieces, setPieces] = useState<ClosetPiece[]>(closetPieces);
  const [selectedPiece, setSelectedPiece] = useState<ClosetPiece | null>(null);
  const [isQuickAddVisible, setIsQuickAddVisible] = useState(false);
  const [quickAddMode, setQuickAddMode] = useState<QuickAddMode>("select");
  const [detectedItems, setDetectedItems] = useState<DetectedClosetItem[]>([]);
  const [selectedPhotoAssetKeys, setSelectedPhotoAssetKeys] = useState<Set<string>>(
    () => new Set()
  );
  const [expandedDetectedItemId, setExpandedDetectedItemId] =
    useState<string | null>(null);
  const [detailAfterSaveItemId, setDetailAfterSaveItemId] =
    useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (analysisTimerRef.current) {
        clearTimeout(analysisTimerRef.current);
      }
    };
  }, []);

  const resetQuickAdd = () => {
    if (analysisTimerRef.current) {
      clearTimeout(analysisTimerRef.current);
      analysisTimerRef.current = null;
    }

    setIsQuickAddVisible(false);
    setQuickAddMode("select");
    setDetectedItems([]);
    setSelectedPhotoAssetKeys(new Set());
    setExpandedDetectedItemId(null);
    setDetailAfterSaveItemId(null);
  };

  const getNewPickedAssets = (
    assets: Array<{
      assetId?: string | null;
      fileName?: string | null;
      name?: string | null;
      uri?: string;
    }>
  ) => {
    const seenAssetKeys = new Set(selectedPhotoAssetKeys);
    const pickedAssets: PickedPhotoAsset[] = [];

    assets.forEach((asset, index) => {
      if (!asset.uri) {
        return;
      }

      const assetKey = getPickedAssetKey(asset, index);

      if (seenAssetKeys.has(assetKey)) {
        return;
      }

      seenAssetKeys.add(assetKey);
      pickedAssets.push({ key: assetKey, uri: asset.uri });
    });

    return pickedAssets;
  };

  const rememberPickedAssets = (pickedAssets: PickedPhotoAsset[]) => {
    setSelectedPhotoAssetKeys((currentKeys) => {
      const nextKeys = new Set(currentKeys);

      pickedAssets.forEach((asset) => nextKeys.add(asset.key));

      return nextKeys;
    });
  };

  const beginDetectedReview = (pickedAssets: PickedPhotoAsset[] = []) => {
    if (analysisTimerRef.current) {
      clearTimeout(analysisTimerRef.current);
    }

    const shouldAppendItems = detectedItems.length > 0;

    setIsQuickAddVisible(true);
    setQuickAddMode(shouldAppendItems ? "review" : "analyzing");
    setExpandedDetectedItemId(null);

    analysisTimerRef.current = setTimeout(() => {
      const nextDetectedItems = createDetectedItems(
        Date.now(),
        pickedAssets
      );

      setDetectedItems((currentItems) =>
        shouldAppendItems ? [...currentItems, ...nextDetectedItems] : nextDetectedItems
      );
      setQuickAddMode("review");
      analysisTimerRef.current = null;
    }, 1700);
  };

  const handleOpenPhotoLibrary = async () => {
    try {
      if (selectedPhotoAssetKeys.size >= 10) {
        Alert.alert(
          "Photo limit reached",
          "Add these items first, then start another batch."
        );
        return;
      }

      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Photo access needed",
          "Allow photo access to add items from your closet."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        allowsMultipleSelection: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        orderedSelection: true,
        quality: 0.9,
        selectionLimit: Math.max(1, 10 - selectedPhotoAssetKeys.size)
      });

      if (!result.canceled && result.assets.length > 0) {
        const pickedAssets = getNewPickedAssets(result.assets);

        if (pickedAssets.length === 0) {
          Alert.alert(
            "Already added",
            "Those photos are already in this batch."
          );
          return;
        }

        rememberPickedAssets(pickedAssets);
        beginDetectedReview(pickedAssets);
      }
    } catch {
      Alert.alert(
        "Photo library unavailable",
        "Please try selecting photos again."
      );
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Camera access needed",
          "Allow camera access to take a photo of your item."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.9
      });

      if (!result.canceled && result.assets[0]?.uri) {
        const pickedAssets = getNewPickedAssets(result.assets);

        if (pickedAssets.length === 0) {
          Alert.alert("Already added", "That photo is already in this batch.");
          return;
        }

        rememberPickedAssets(pickedAssets);
        beginDetectedReview(pickedAssets);
      }
    } catch {
      Alert.alert("Camera unavailable", "Please try taking the photo again.");
    }
  };

  const handleChooseFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: true,
        type: "image/*"
      });

      if (!result.canceled && result.assets.length > 0) {
        const pickedAssets = getNewPickedAssets(result.assets);

        if (pickedAssets.length === 0) {
          Alert.alert(
            "Already added",
            "Those files are already in this batch."
          );
          return;
        }

        rememberPickedAssets(pickedAssets);
        beginDetectedReview(pickedAssets);
      }
    } catch {
      Alert.alert("Files unavailable", "Please try choosing files again.");
    }
  };

  const handleSelectPhotos = () => {
    const options = ["Photo library", "Take photo", "Choose files", "Cancel"];
    const cancelButtonIndex = options.length - 1;
    const openPhotoLibraryAfterSheetCloses = () => {
      setTimeout(() => {
        void handleOpenPhotoLibrary();
      }, 250);
    };

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          cancelButtonIndex,
          options,
          title: "Add New Items"
        },
        (selectedButtonIndex) => {
          if (selectedButtonIndex === 0) {
            openPhotoLibraryAfterSheetCloses();
          }

          if (selectedButtonIndex === 1) {
            void handleTakePhoto();
          }

          if (selectedButtonIndex === 2) {
            void handleChooseFiles();
          }
        }
      );
      return;
    }

    Alert.alert("Add New Items", "Choose how you want to add items.", [
      { onPress: () => void handleOpenPhotoLibrary(), text: "Photo library" },
      { onPress: () => void handleTakePhoto(), text: "Take photo" },
      { onPress: () => void handleChooseFiles(), text: "Choose files" },
      { style: "cancel", text: "Cancel" }
    ]);
  };

  const handleToggleDetectedItem = (itemId: string) => {
    setExpandedDetectedItemId((currentItemId) =>
      currentItemId === itemId ? null : itemId
    );
  };

  const handleRemoveDetectedItem = (itemId: string) => {
    const removedItem = detectedItems.find((item) => item.id === itemId);

    setDetectedItems((items) => items.filter((item) => item.id !== itemId));
    setSelectedPhotoAssetKeys((currentKeys) => {
      if (!removedItem?.sourceAssetKey) {
        return currentKeys;
      }

      const nextKeys = new Set(currentKeys);

      nextKeys.delete(removedItem.sourceAssetKey);

      return nextKeys;
    });
    setExpandedDetectedItemId((currentItemId) =>
      currentItemId === itemId ? null : currentItemId
    );
    setDetailAfterSaveItemId((currentItemId) =>
      currentItemId === itemId ? null : currentItemId
    );
  };

  const handleUpdateDetectedName = (itemId: string, name: string) => {
    setDetectedItems((items) =>
      items.map((item) => (item.id === itemId ? { ...item, name } : item))
    );
  };

  const handleUpdateDetectedCategory = (
    itemId: string,
    category: DetectedCategory
  ) => {
    setDetectedItems((items) =>
      items.map((item) =>
        item.id === itemId ? { ...item, category, size: "" } : item
      )
    );
  };

  const handleUpdateDetectedSize = (itemId: string, size: string) => {
    setDetectedItems((items) =>
      items.map((item) => (item.id === itemId ? { ...item, size } : item))
    );
  };

  const handleSaveDetectedItems = () => {
    if (detectedItems.length === 0) {
      return;
    }

    const newPieces = detectedItems.map(toClosetPiece);
    const detailPiece = detailAfterSaveItemId
      ? newPieces.find((piece) => piece.id === detailAfterSaveItemId) ?? null
      : null;

    setPieces((currentPieces) => [...newPieces, ...currentPieces]);
    resetQuickAdd();

    if (detailPiece) {
      setSelectedPiece(detailPiece);
    }
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
        <AppScreenHeader
          rightAccessory={
            <View style={styles.toolbar}>
              <ClosetToolbarButton
                accessibilityLabel="Add item"
                icon="plus"
                label="Add item"
                onPress={() => setIsQuickAddVisible(true)}
                variant="primary"
              />
            </View>
          }
          subtitle={`${pieces.length} items`}
          title="My Closet"
        />

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
          {pieces.map((piece) => (
            <ClosetPieceCard
              key={piece.id}
              onPress={() => setSelectedPiece(piece)}
              piece={piece}
            />
          ))}
        </View>
      </ScrollView>
      <QuickAddBatchDrawer
        detectedItems={detectedItems}
        expandedItemId={expandedDetectedItemId}
        mode={quickAddMode}
        onClose={resetQuickAdd}
        onMarkDetailAfterSave={setDetailAfterSaveItemId}
        onRemoveDetectedItem={handleRemoveDetectedItem}
        onSaveDetectedItems={handleSaveDetectedItems}
        onSelectPhotos={handleSelectPhotos}
        onToggleDetectedItem={handleToggleDetectedItem}
        onUpdateDetectedCategory={handleUpdateDetectedCategory}
        onUpdateDetectedName={handleUpdateDetectedName}
        onUpdateDetectedSize={handleUpdateDetectedSize}
        visible={isQuickAddVisible}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addDrawer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    gap: spacing.lg,
    paddingBottom: appBottomSafeInset + spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md
  },
  addDetectedCta: {
    alignItems: "center",
    backgroundColor: colors.inverse,
    borderRadius: radii.button,
    flexDirection: "row",
    gap: spacing.sm,
    height: 52,
    justifyContent: "center",
    paddingHorizontal: spacing.lg
  },
  addDetectedCtaDisabled: {
    backgroundColor: colors.soft
  },
  addDetectedCtaText: {
    color: colors.inverseText,
    fontFamily: fonts.cta,
    fontSize: 16,
    lineHeight: 20
  },
  addDrawerCopy: {
    flex: 1,
    minWidth: 0
  },
  addDrawerHandle: {
    alignSelf: "center",
    backgroundColor: colors.border,
    borderRadius: radii.pill,
    height: 5,
    marginBottom: spacing.sm,
    width: 48
  },
  addDrawerHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md
  },
  addDrawerRoot: {
    flex: 1,
    justifyContent: "flex-end"
  },
  addDrawerReview: {
    maxHeight: "82%",
    paddingBottom: spacing.xl
  },
  addDrawerScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.scrimMedium
  },
  addDrawerSubtitle: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.sm
  },
  addDrawerTitle: {
    ...typography.sectionHeading,
    color: colors.text,
  },
  addDrawerUploadTarget: {
    alignItems: "center",
    backgroundColor: colors.surfaceTertiary,
    borderColor: colors.border,
    borderRadius: 16,
    borderStyle: "dashed",
    borderWidth: 1.5,
    flexDirection: "row",
    gap: spacing.md,
    height: 60,
    justifyContent: "center",
    paddingHorizontal: spacing.lg
  },
  addDrawerUploadText: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18
  },
  analyzingCopy: {
    flex: 1,
    minWidth: 0
  },
  analyzingPanel: {
    alignItems: "center",
    backgroundColor: colors.surfaceTertiary,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 88,
    padding: spacing.lg
  },
  analyzingText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2
  },
  analyzingTitle: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 20
  },
  content: {
    paddingBottom: 116,
    paddingHorizontal: spacing.screen,
    paddingTop: appScreenTopPadding
  },
  detectedCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.sm
  },
  detectedCardExpanded: {
    maxHeight: 200
  },
  detectedCardSummary: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    minHeight: 50
  },
  detectedChoicePill: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    flexShrink: 1,
    height: 24,
    justifyContent: "center",
    paddingHorizontal: spacing.sm
  },
  detectedChoicePillSelected: {
    backgroundColor: colors.inverse,
    borderColor: colors.inverse
  },
  detectedChoicePillText: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14
  },
  detectedChoicePillTextSelected: {
    color: colors.inverseText
  },
  detectedEditor: {
    gap: 4,
    marginTop: spacing.sm
  },
  detectedItemCopy: {
    flex: 1,
    minWidth: 0
  },
  detectedItemImage: {
    backgroundColor: colors.imageSurface,
    borderRadius: radii.card,
    height: 50,
    width: 50
  },
  detectedItemMeta: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 17
  },
  detectedItemName: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 15,
    lineHeight: 19
  },
  detectedItemTags: {
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 1
  },
  detectedList: {
    maxHeight: 300
  },
  detectedListContent: {
    gap: spacing.sm,
    paddingBottom: spacing.xs
  },
  detectedMoreDetailsButton: {
    alignSelf: "flex-start",
    marginTop: spacing.xs
  },
  detectedMoreDetailsText: {
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
    textDecorationLine: "underline"
  },
  detectedNameClearButton: {
    alignItems: "center",
    height: 32,
    justifyContent: "center",
    width: 32
  },
  detectedNameField: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 0.5,
    flexDirection: "row",
    height: 40,
    paddingLeft: spacing.md,
    paddingRight: spacing.xs
  },
  detectedNameInput: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    height: 40,
    includeFontPadding: false,
    lineHeight: 18,
    minWidth: 0,
    padding: 0
  },
  detectedPillRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: spacing.xs,
    overflow: "hidden"
  },
  detectedRemoveButton: {
    alignItems: "center",
    height: 32,
    justifyContent: "center",
    width: 32
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
    paddingHorizontal: 10,
    paddingVertical: spacing.md
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
    flexShrink: 0,
    maxWidth: "100%",
    minWidth: 0,
    paddingHorizontal: 6,
    paddingVertical: 4
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: spacing.xs,
    marginTop: spacing.md,
    overflow: "hidden"
  },
  tagText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 13
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
