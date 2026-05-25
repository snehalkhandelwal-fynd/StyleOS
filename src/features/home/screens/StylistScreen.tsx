import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import Svg, { Path } from "react-native-svg";

import { colors, fonts, spacing } from "../../../theme";
import {
  getPieceAlternatives,
  getPieceDefaults,
  type LookPiece
} from "../data/lookPieces";

type StylistSlotKind = "accessory" | "bag" | "bottom" | "jacket" | "shoe" | "top";

type StylistScreenProps = {
  onTryOn: (pieces: LookPiece[]) => void;
  onUploadItems: () => void;
};

type StylistControlId = "board" | "rows" | "selection";

const topSafeInset =
  Platform.OS === "ios" ? 44 : NativeStatusBar.currentHeight ?? 0;
const bottomSafeInset = Platform.OS === "ios" ? 22 : 0;
const appNavHeight = 76;
const appNavGap = spacing.md * 2;

const slotOrder: Array<{
  kind: StylistSlotKind;
  label: string;
}> = [
  { kind: "top", label: "Top" },
  { kind: "bottom", label: "Bottom" },
  { kind: "jacket", label: "Layer" },
  { kind: "shoe", label: "Shoes" },
  { kind: "bag", label: "Bag" },
  { kind: "accessory", label: "Accessory" }
];

const topControls: Array<{
  id: StylistControlId;
  label: string;
}> = [
  { id: "board", label: "Outfit board" },
  { id: "rows", label: "Product rows" },
  { id: "selection", label: "Selected pieces" }
];

const controlIconPaths: Record<StylistControlId, string> = {
  board:
    "M21 12L21 19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21L5 21C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19L3 12M21 12L21 5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3L5 3C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21072 3.96086 3 4.46957 3 5L3 12M21 12L3 12",
  rows:
    "M21 9L21 19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21L5 21C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19L3 9M21 9L21 5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3L5 3C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21072 3.96086 3 4.46957 3 5L3 9M21 9L3 9M21 14.5L3 14.5",
  selection:
    "M21 12L21 19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21L5 21C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19L3 12M21 12L21 5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3L5 3C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21072 3.96086 3 4.46957 3 5L3 12M21 12L3 12M21 16.25L3 16.25M21 7.75L3 7.75"
};

function StylistControlIcon({ id }: { id: StylistControlId }) {
  return (
    <Svg fill="none" height={24} viewBox="0 0 24 24" width={24}>
      <Path
        d={controlIconPaths[id]}
        stroke={colors.text}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </Svg>
  );
}

function getSlotOptions(kind: StylistSlotKind) {
  const alternatives = getPieceAlternatives(kind);

  return alternatives.length > 0 ? alternatives : [getPieceDefaults(kind, 0)];
}

function getInitialPieces() {
  return slotOrder.reduce<Record<StylistSlotKind, LookPiece>>(
    (selectedPieces, slot, index) => {
      const options = getSlotOptions(slot.kind);

      selectedPieces[slot.kind] = options[index % options.length];
      return selectedPieces;
    },
    {} as Record<StylistSlotKind, LookPiece>
  );
}

function getSelectedPieces(selectedPieces: Record<StylistSlotKind, LookPiece>) {
  return slotOrder.map((slot) => ({
    ...selectedPieces[slot.kind],
    id: `stylist-${slot.kind}`,
    kind: slot.kind
  }));
}

function getNextShuffledPiece(kind: StylistSlotKind, currentPiece: LookPiece) {
  const options = getSlotOptions(kind);
  const nextOptions =
    options.length > 1
      ? options.filter(
          (option) =>
            option.image !== currentPiece.image || option.name !== currentPiece.name
        )
      : options;

  return nextOptions[Math.floor(Math.random() * nextOptions.length)] ?? options[0];
}

function StylistOptionCard({
  label,
  onPress,
  piece
}: {
  label: string;
  onPress: () => void;
  piece: LookPiece;
}) {
  return (
    <Pressable
      accessibilityLabel={`${label}: ${piece.name}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.optionCard,
        pressed ? styles.pressed : null
      ]}
    >
      <View style={styles.optionImageWrap}>
        <Image
          resizeMode="contain"
          source={{ uri: piece.image }}
          style={styles.optionImage}
        />
      </View>
    </Pressable>
  );
}

export function StylistScreen({ onTryOn, onUploadItems }: StylistScreenProps) {
  const [activeControl, setActiveControl] = useState<StylistControlId>("selection");
  const [selectedPieces, setSelectedPieces] = useState(getInitialPieces);
  const selectedPiecesList = useMemo(
    () => getSelectedPieces(selectedPieces),
    [selectedPieces]
  );

  const handleSelectPiece = (kind: StylistSlotKind, piece: LookPiece) => {
    setSelectedPieces((current) => ({
      ...current,
      [kind]: piece
    }));
  };

  const handleShuffle = () => {
    setSelectedPieces((current) => {
      return slotOrder.reduce<Record<StylistSlotKind, LookPiece>>(
        (nextPieces, slot) => {
          nextPieces[slot.kind] = getNextShuffledPiece(
            slot.kind,
            current[slot.kind]
          );
          return nextPieces;
        },
        {} as Record<StylistSlotKind, LookPiece>
      );
    });
  };

  return (
    <View style={styles.screen}>
      <ExpoStatusBar style="dark" />
      <View accessibilityRole="tablist" style={styles.topControlRow}>
        {topControls.map((control) => {
          const isActive = activeControl === control.id;

          return (
            <Pressable
              accessibilityLabel={control.label}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              key={control.id}
              onPress={() => setActiveControl(control.id)}
              style={({ pressed }) => [
                styles.topControlButton,
                pressed ? styles.pressed : null
              ]}
            >
              <StylistControlIcon id={control.id} />
            </Pressable>
          );
        })}
        <Pressable
          accessibilityLabel="Shuffle outfit"
          accessibilityRole="button"
          onPress={handleShuffle}
          style={({ pressed }) => [
            styles.topControlButton,
            pressed ? styles.pressed : null
          ]}
        >
          <MaterialCommunityIcons
            color={colors.text}
            name="dice-multiple-outline"
            size={26}
          />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {slotOrder.map((slot) => {
          const options = getSlotOptions(slot.kind);

          return (
            <View key={slot.kind} style={styles.slotSection}>
              <ScrollView
                horizontal
                contentContainerStyle={styles.optionTrack}
                showsHorizontalScrollIndicator={false}
              >
                {options.map((piece) => (
                  <StylistOptionCard
                    key={`${slot.kind}-${piece.id}`}
                    label={slot.label}
                    onPress={() => handleSelectPiece(slot.kind, piece)}
                    piece={piece}
                  />
                ))}
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.closetPrompt}>
          <View style={styles.closetCopy}>
            <Text numberOfLines={1} style={styles.closetTitle}>
              Style something you already have
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Add one closet item"
            accessibilityRole="button"
            onPress={onUploadItems}
            style={({ pressed }) => [
              styles.uploadButton,
              pressed ? styles.pressed : null
            ]}
          >
            <Text style={styles.uploadText}>Add one item</Text>
          </Pressable>
        </View>
        <Pressable
          accessibilityLabel="Try on selected outfit"
          accessibilityRole="button"
          onPress={() => onTryOn(selectedPiecesList)}
          style={({ pressed }) => [
            styles.tryOnButton,
            pressed ? styles.pressed : null
          ]}
        >
          <Text style={styles.tryOnText}>Try On</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  closetCopy: {
    flex: 1,
    minWidth: 0
  },
  closetPrompt: {
    alignItems: "center",
    backgroundColor: colors.surfaceTertiary,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 60,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    paddingVertical: spacing.sm
  },
  closetTitle: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 17
  },
  content: {
    paddingBottom: 244,
    paddingTop: spacing.md
  },
  footer: {
    bottom: bottomSafeInset + appNavHeight + appNavGap,
    gap: spacing.sm,
    left: 0,
    paddingHorizontal: spacing.screen,
    position: "absolute",
    right: 0
  },
  optionCard: {
    backgroundColor: colors.surfaceTertiary,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    height: 130,
    overflow: "hidden",
    width: 110
  },
  optionImage: {
    height: "100%",
    width: "100%"
  },
  optionImageWrap: {
    backgroundColor: colors.imageSurface,
    height: "100%",
    overflow: "hidden",
    width: "100%"
  },
  optionTrack: {
    gap: spacing.md,
    paddingHorizontal: spacing.screen
  },
  pressed: {
    opacity: 0.72
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1
  },
  slotSection: {
    marginBottom: spacing.md
  },
  topControlButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 44
  },
  topControlRow: {
    alignItems: "center",
    backgroundColor: colors.background,
    flexDirection: "row",
    gap: spacing.lg,
    justifyContent: "center",
    paddingBottom: spacing.xl,
    paddingTop: topSafeInset + spacing.lg
  },
  tryOnButton: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: 999,
    height: 48,
    justifyContent: "center"
  },
  tryOnText: {
    color: colors.inverseText,
    fontFamily: fonts.cta,
    fontSize: 16,
    lineHeight: 20
  },
  uploadButton: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: 999,
    height: 44,
    justifyContent: "center",
    paddingHorizontal: spacing.lg
  },
  uploadText: {
    color: colors.inverseText,
    fontFamily: fonts.cta,
    fontSize: 13,
    lineHeight: 17
  }
});
