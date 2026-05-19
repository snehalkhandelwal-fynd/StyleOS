import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, Pattern, Rect } from "react-native-svg";

import { colors, fonts, radii, spacing } from "../../../theme";
import { openPhotoSourceDrawer } from "../utils/photoPicker";

type PhotoUploadBoxProps = {
  onSelectPhoto: (uri: string) => void;
  uri?: string;
};

type IoniconName = ComponentProps<typeof Ionicons>["name"];

const exampleModelImage = require("../../../assets/upload-example.png");

const photoGuidelines: { icon: IoniconName; text: string }[] = [
  { icon: "body-outline", text: "Full body, face & feet visible" },
  { icon: "person-remove-outline", text: "Just you — no pets or friends" },
  { icon: "sunny-outline", text: "Good lighting, not blurry" }
];

export function PhotoUploadBox({ onSelectPhoto, uri }: PhotoUploadBoxProps) {
  const openPhotoDrawer = () => {
    openPhotoSourceDrawer({ onPhotoSelected: onSelectPhoto });
  };

  return (
    <Pressable
      accessibilityLabel="Upload your full-body photo"
      accessibilityRole="button"
      onPress={openPhotoDrawer}
      style={({ pressed }) => [
        styles.box,
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
        <View style={styles.emptyState}>
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

          <View style={styles.exampleArea}>
            <View style={styles.exampleFrame}>
              <Image
                resizeMode="cover"
                source={exampleModelImage}
                style={styles.exampleImage}
              />
            </View>
          </View>

          <View style={styles.guidelineRow}>
            {photoGuidelines.map((guideline) => (
              <View key={guideline.text} style={styles.guidelineItem}>
                <View style={styles.guidelineIcon}>
                  <Ionicons
                    color={colors.text}
                    name={guideline.icon}
                    size={16}
                  />
                </View>
                <Text style={styles.guidelineText}>{guideline.text}</Text>
              </View>
            ))}
          </View>

          <View style={styles.uploadCta}>
            <Ionicons
              color={colors.inverseText}
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
  boxWithPreview: {
    backgroundColor: colors.surface
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
  exampleArea: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
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
  guidelineText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
    textAlign: "center"
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
  uploadCta: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: colors.inverse,
    borderRadius: radii.button,
    flexDirection: "row",
    gap: 8,
    height: 48,
    justifyContent: "center",
    marginTop: spacing.md
  },
  uploadCtaText: {
    color: colors.inverseText,
    fontFamily: fonts.cta,
    fontSize: 14,
    lineHeight: 17
  }
});
