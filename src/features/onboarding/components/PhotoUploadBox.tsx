import { Ionicons } from "@expo/vector-icons";
import { useState, type ComponentProps } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import Svg, { Circle, Defs, Pattern, Rect } from "react-native-svg";

import { colors, fonts, radii, spacing } from "../../../theme";
import { samplePeoplePhotos, selectCameraPhoto } from "../utils/photoPicker";

type PhotoUploadBoxProps = {
  onSelectPhoto: (uri: string) => void;
  uri?: string;
  variant?: "default" | "drawer";
};

type IoniconName = ComponentProps<typeof Ionicons>["name"];

const exampleModelImage = require("../../../assets/upload-example.png");

const photoGuidelines: { icon: IoniconName; text: string }[] = [
  { icon: "body-outline", text: "Full body, face & feet visible" },
  { icon: "person-remove-outline", text: "Just you no pets or friends" },
  { icon: "sunny-outline", text: "Good lighting, not blurry" }
];

export function PhotoUploadBox({
  onSelectPhoto,
  uri,
  variant = "default"
}: PhotoUploadBoxProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const isDrawer = variant === "drawer";

  const openPhotoDrawer = () => {
    setIsPickerOpen(true);
  };

  const closePhotoDrawer = () => {
    setIsPickerOpen(false);
  };

  const handleSamplePhotoSelect = (selectedUri: string) => {
    onSelectPhoto(selectedUri);
    closePhotoDrawer();
  };

  const handleTakePhoto = () => {
    closePhotoDrawer();
    selectCameraPhoto(onSelectPhoto);
  };

  return (
    <>
      <Pressable
        accessibilityLabel="Upload your full-body photo"
        accessibilityRole="button"
        onPress={openPhotoDrawer}
        style={({ pressed }) => [
          styles.box,
          isDrawer ? (uri ? styles.drawerPreviewBox : styles.drawerBox) : null,
          uri ? styles.boxWithPreview : styles.emptyBox,
          pressed ? styles.pressed : null
        ]}
      >
        {uri ? (
          <>
            <Image
              resizeMode="cover"
              source={{ uri }}
              style={styles.previewImage}
            />
            <Pressable
              accessibilityLabel="Change photo"
              accessibilityRole="button"
              onPress={(event) => {
                event.stopPropagation();
                openPhotoDrawer();
              }}
              style={({ pressed }) => [
                styles.changePhotoButton,
                pressed ? styles.changePhotoButtonPressed : null
              ]}
            >
              <Ionicons color={colors.text} name="camera-outline" size={14} />
              <Text style={styles.changePhotoText}>Change photo</Text>
            </Pressable>
          </>
        ) : (
          <View style={[styles.emptyState, isDrawer ? styles.drawerEmptyState : null]}>
            <Svg pointerEvents="none" style={StyleSheet.absoluteFill}>
              <Defs>
                <Pattern
                  height={18}
                  id="uploadDots"
                  patternUnits="userSpaceOnUse"
                  width={18}
                >
                  <Circle cx={2} cy={2} fill={colors.border} r={1.2} />
                </Pattern>
              </Defs>
              <Rect fill="url(#uploadDots)" height="100%" width="100%" />
            </Svg>

            <View style={styles.examplePill}>
              <Text style={styles.examplePillText}>EXAMPLE</Text>
            </View>

            <View
              style={[
                styles.exampleArea,
                isDrawer ? styles.drawerExampleArea : null
              ]}
            >
              <View
                style={[
                  styles.exampleFrame,
                  isDrawer ? styles.drawerExampleFrame : null
                ]}
              >
                <Image
                  resizeMode="cover"
                  source={exampleModelImage}
                  style={styles.exampleImage}
                />
              </View>
            </View>

            <View
              style={[
                styles.guidelineRow,
                isDrawer ? styles.drawerGuidelineRow : null
              ]}
            >
              {photoGuidelines.map((guideline) => (
                <View key={guideline.text} style={styles.guidelineItem}>
                  <View
                    style={[
                      styles.guidelineIcon,
                      isDrawer ? styles.drawerGuidelineIcon : null
                    ]}
                  >
                    <Ionicons
                      color={colors.text}
                      name={guideline.icon}
                      size={16}
                    />
                  </View>
                  <Text
                    style={[
                      styles.guidelineText,
                      isDrawer ? styles.drawerGuidelineText : null
                    ]}
                  >
                    {guideline.text}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.uploadCta}>
              <Ionicons
                color={colors.text}
                name="cloud-upload-outline"
                size={18}
              />
              <Text style={styles.uploadCtaText}>Add your photo</Text>
            </View>

            <Text style={styles.privacy}>
              Your photo is private and only used for try-on
            </Text>
          </View>
        )}
      </Pressable>

      <Modal
        animationType="slide"
        onRequestClose={closePhotoDrawer}
        transparent
        visible={isPickerOpen}
      >
        <View style={styles.modalBackdrop}>
          <Pressable
            accessibilityLabel="Close photo choices"
            accessibilityRole="button"
            onPress={closePhotoDrawer}
            style={styles.scrim}
          />

          <View style={styles.photoSheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <View style={styles.sheetTitleGroup}>
                <Text style={styles.sheetTitle}>Choose a photo</Text>
                <Text style={styles.sheetSubtitle}>
                  Pick a clear full-body image.
                </Text>
              </View>
              <Pressable
                accessibilityLabel="Close photo choices"
                accessibilityRole="button"
                onPress={closePhotoDrawer}
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed ? styles.closeButtonPressed : null
                ]}
              >
                <Ionicons color={colors.text} name="close" size={24} />
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={styles.sampleGrid}
              style={styles.sampleScroller}
              showsVerticalScrollIndicator={false}
            >
              {samplePeoplePhotos.map((photo) => (
                <Pressable
                  accessibilityLabel={photo.accessibilityLabel}
                  accessibilityRole="imagebutton"
                  key={photo.id}
                  onPress={() => handleSamplePhotoSelect(photo.uri)}
                  style={({ pressed }) => [
                    styles.sampleTile,
                    pressed ? styles.sampleTilePressed : null
                  ]}
                >
                  <Image
                    resizeMode="cover"
                    source={photo.source}
                    style={styles.sampleImage}
                  />
                </Pressable>
              ))}
            </ScrollView>

            <Pressable
              accessibilityLabel="Take new photo"
              accessibilityRole="button"
              onPress={handleTakePhoto}
              style={({ pressed }) => [
                styles.cameraButton,
                pressed ? styles.cameraButtonPressed : null
              ]}
            >
              <Ionicons color={colors.text} name="camera-outline" size={18} />
              <Text style={styles.cameraButtonText}>Take new photo</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: 20,
    flex: 1,
    marginTop: spacing.xl,
    overflow: "hidden",
    width: "100%"
  },
  drawerBox: {
    flex: 0,
    marginTop: spacing.lg
  },
  drawerPreviewBox: {
    flex: 0,
    height: 424,
    marginTop: spacing.lg
  },
  boxWithPreview: {
    backgroundColor: colors.surface
  },
  cameraButton: {
    alignItems: "center",
    borderColor: colors.secondaryBorder,
    borderRadius: radii.button,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    height: 48,
    justifyContent: "center",
    marginTop: spacing.md,
    width: "100%"
  },
  cameraButtonPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.99 }]
  },
  cameraButtonText: {
    color: colors.text,
    fontFamily: fonts.cta,
    fontSize: 14,
    lineHeight: 14
  },
  changePhotoButton: {
    alignItems: "center",
    backgroundColor: colors.surfaceTranslucent,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    position: "absolute",
    right: spacing.md,
    shadowColor: "#000000",
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    top: spacing.md
  },
  changePhotoButtonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }]
  },
  changePhotoText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 15
  },
  closeButton: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  closeButtonPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }]
  },
  emptyBox: {
    backgroundColor: colors.surface,
    borderColor: "#B9AFA2",
    borderStyle: "dashed",
    borderWidth: 2
  },
  emptyState: {
    flex: 1,
    padding: spacing.lg
  },
  drawerEmptyState: {
    flex: 0,
    padding: spacing.md
  },
  exampleArea: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  },
  drawerExampleArea: {
    flex: 0,
    height: 188,
    justifyContent: "center",
    marginTop: spacing.xs
  },
  exampleFrame: {
    aspectRatio: 3 / 4,
    backgroundColor: colors.imageSurface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    width: "60%"
  },
  drawerExampleFrame: {
    width: 138
  },
  exampleImage: {
    height: "100%",
    width: "100%"
  },
  examplePill: {
    alignSelf: "flex-start",
    backgroundColor: colors.text,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  examplePillText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 1,
    lineHeight: 12
  },
  guidelineIcon: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  drawerGuidelineIcon: {
    height: 32,
    width: 32
  },
  guidelineItem: {
    alignItems: "center",
    flex: 1,
    gap: 6
  },
  guidelineRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md
  },
  drawerGuidelineRow: {
    marginTop: spacing.sm
  },
  guidelineText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
    textAlign: "center"
  },
  drawerGuidelineText: {
    fontSize: 10,
    lineHeight: 13
  },
  modalBackdrop: {
    backgroundColor: colors.scrimMedium,
    flex: 1,
    justifyContent: "flex-end"
  },
  photoSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "84%",
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    zIndex: 1
  },
  pressed: {
    opacity: 0.92
  },
  previewImage: {
    height: "100%",
    width: "100%"
  },
  privacy: {
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 15,
    marginTop: spacing.sm,
    textAlign: "center"
  },
  sampleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    paddingBottom: spacing.xs
  },
  sampleImage: {
    height: "100%",
    width: "100%"
  },
  sampleScroller: {
    flexShrink: 1
  },
  sampleTile: {
    aspectRatio: 3 / 4,
    backgroundColor: colors.surface,
    borderRadius: 8,
    overflow: "hidden",
    width: "48%"
  },
  sampleTilePressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }]
  },
  scrim: {
    ...StyleSheet.absoluteFillObject
  },
  sheetHandle: {
    alignSelf: "center",
    backgroundColor: colors.border,
    borderRadius: 999,
    height: 4,
    marginBottom: spacing.md,
    width: 44
  },
  sheetHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.lg,
    justifyContent: "space-between",
    marginBottom: spacing.md
  },
  sheetSubtitle: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18.2
  },
  sheetTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 25
  },
  sheetTitleGroup: {
    flex: 1,
    gap: spacing.xs
  },
  uploadCta: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.button,
    flexDirection: "row",
    gap: 8,
    height: 48,
    justifyContent: "center",
    marginTop: spacing.md
  },
  uploadCtaText: {
    color: colors.text,
    fontFamily: fonts.cta,
    fontSize: 14,
    lineHeight: 17
  }
});
