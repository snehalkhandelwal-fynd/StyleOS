import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fonts, spacing } from "../../../theme";
import { avatarImageFrameStyles } from "./AvatarImageFrame";
import { openPhotoSourceDrawer } from "../utils/photoPicker";

type PhotoUploadBoxProps = {
  onSelectPhoto: (uri: string) => void;
  uri?: string;
};

const bodyGuideImage = require("../../../assets/bodyimage.png");

export function PhotoUploadBox({ onSelectPhoto, uri }: PhotoUploadBoxProps) {
  const openPhotoDrawer = () => {
    openPhotoSourceDrawer({ onPhotoSelected: onSelectPhoto });
  };

  return (
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
        <Image
          resizeMode="cover"
          source={{ uri }}
          style={avatarImageFrameStyles.image}
        />
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
    width: "100%"
  },
  boxWithPreview: {
    padding: 0
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
  preview: {}
});
