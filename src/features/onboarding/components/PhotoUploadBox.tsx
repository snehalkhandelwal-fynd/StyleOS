import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import { colors, fonts, radii, spacing } from "../../../theme";
import { avatarImageFrameStyles } from "./AvatarImageFrame";
import { samplePeoplePhotos, selectCameraPhoto } from "../utils/photoPicker";

type PhotoUploadBoxProps = {
  onSelectPhoto: (uri: string) => void;
  uri?: string;
};

const bodyGuideImage = require("../../../assets/bodyimage.png");

export function PhotoUploadBox({ onSelectPhoto, uri }: PhotoUploadBoxProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

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
        accessibilityLabel="Add your photo"
        accessibilityRole="button"
        onPress={openPhotoDrawer}
        style={({ pressed }) => [
          styles.box,
          !uri ? styles.emptyBox : null,
          uri ? styles.boxWithPreview : null,
          pressed ? styles.pressed : null
        ]}
      >
        {uri ? (
          <>
            <Image
              resizeMode="cover"
              source={{ uri }}
              style={avatarImageFrameStyles.image}
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
          <View style={styles.emptyState}>
            <Image
              resizeMode="contain"
              source={bodyGuideImage}
              style={styles.guideImage}
            />
            <Pressable
              accessibilityLabel="Choose photo source"
              accessibilityRole="button"
              onPress={(event) => {
                event.stopPropagation();
                openPhotoDrawer();
              }}
              style={({ pressed }) => [
                styles.addButton,
                pressed ? styles.addButtonPressed : null
              ]}
            >
              <Ionicons color={colors.text} name="add" size={34} />
            </Pressable>
            <Text style={styles.label}>Add your photo</Text>
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
  addButton: {
    alignItems: "center",
    borderColor: "#D8D4CA",
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  addButtonPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }]
  },
  box: {
    alignItems: "center",
    ...avatarImageFrameStyles.frame,
    justifyContent: "center",
    marginTop: spacing.xl,
    padding: spacing.xl,
    position: "relative",
    width: "100%"
  },
  boxWithPreview: {
    padding: 0
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
  emptyState: {
    alignItems: "center",
    gap: spacing.sm,
    height: "100%",
    justifyContent: "center",
    width: "100%"
  },
  emptyBox: {
    borderColor: "#B9AFA2",
    borderStyle: "dashed",
    borderWidth: 2
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
  guideImage: {
    height: "48%",
    marginBottom: spacing.xs,
    width: "62%"
  },
  label: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 16,
    lineHeight: 20
  },
  privacy: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16.8,
    textAlign: "center"
  },
  pressed: {
    backgroundColor: colors.imageSurface,
    transform: [{ scale: 0.98 }]
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
  }
});
