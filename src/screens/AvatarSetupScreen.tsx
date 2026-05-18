import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Svg, { Path } from "react-native-svg";

import { OnboardingProgress } from "../components/OnboardingProgress";
import { PrimaryButton } from "../components/PrimaryButton";
import type { FashionInterest } from "./FashionInterestScreen";
import { colors, fonts, radii, spacing, typography } from "../theme";

type AvatarStage = "upload" | "creating" | "ready";

type AvatarSetupScreenProps = {
  fashionInterest: FashionInterest | null;
  heightInches: number;
  onComplete: () => void;
};

function UploadIcon() {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40" fill="none">
      <Path
        d="M20 10V30M10 20H30"
        stroke={colors.text}
        strokeLinecap="round"
        strokeWidth={2}
      />
    </Svg>
  );
}

export function AvatarSetupScreen({
  onComplete
}: AvatarSetupScreenProps) {
  const [stage, setStage] = useState<AvatarStage>("upload");
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  useEffect(() => {
    if (stage !== "creating") {
      return;
    }

    const timer = setTimeout(() => {
      setStage("ready");
    }, 3200);

    return () => clearTimeout(timer);
  }, [stage]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Photo access needed",
        "Allow photo access to upload a full-body picture."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const startAvatarCreation = () => {
    if (!photoUri) {
      Alert.alert("Upload photo", "Add one full-body photo to continue.");
      return;
    }

    setStage("creating");
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerSpacer} />

      <View style={styles.content}>
        <OnboardingProgress currentStep={5} totalSteps={5} />

        {stage === "upload" ? (
          <>
            <Text style={styles.title}>Try outfits on yourself</Text>
            <Text style={styles.copy}>
              One full-body photo is all it takes. We’ll build your style avatar
              so you can try on any outfit.
            </Text>

            <Pressable
              accessibilityRole="button"
              onPress={pickImage}
              style={({ pressed }) => [
                styles.uploadCard,
                photoUri ? styles.uploadCardWithPhoto : styles.uploadCardEmpty,
                pressed ? styles.pressed : null
              ]}
            >
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.uploadedPhoto} />
              ) : (
                <View style={styles.uploadEmpty}>
                  <UploadIcon />
                  <Text style={styles.uploadLabel}>Add your photo</Text>
                  <Text style={styles.uploadHelper}>
                    Full-body, standing, good lighting
                  </Text>
                </View>
              )}
            </Pressable>

            <PrimaryButton
              disabled={!photoUri}
              label="Continue"
              onPress={startAvatarCreation}
              style={styles.primaryButton}
            />
          </>
        ) : null}

        {stage === "creating" ? (
          <>
            <Text style={styles.title}>Creating your avatar</Text>
            <Text style={styles.copy}>This may take up to 30 seconds.</Text>

            <View style={styles.creatingCard}>
              <ActivityIndicator color={colors.text} size="large" />
              <Text style={styles.creatingText}>Building your try-on base</Text>
            </View>
          </>
        ) : null}

        {stage === "ready" ? (
          <>
            <Text style={styles.title}>
              You’re ready to try outfits on yourself
            </Text>

            <View style={styles.avatarCard}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.avatarImage} />
              ) : null}
            </View>

            <PrimaryButton
              label="Try your first look"
              onPress={onComplete}
              style={styles.primaryButton}
            />
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: 1,
    height: 448,
    marginTop: 24,
    overflow: "hidden",
    position: "relative"
  },
  avatarImage: {
    height: "100%",
    resizeMode: "contain",
    width: "100%"
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screen,
    paddingTop: 24
  },
  copy: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12
  },
  creatingCard: {
    alignItems: "center",
    backgroundColor: "#eeeeee",
    borderRadius: radii.card,
    height: 448,
    justifyContent: "center",
    marginTop: 24
  },
  creatingText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 16
  },
  headerSpacer: {
    height: 48
  },
  pressed: {
    opacity: 0.72
  },
  primaryButton: {
    marginTop: 28
  },
  screen: {
    flex: 1
  },
  title: {
    color: colors.text,
    marginTop: 28,
    ...typography.h2
  },
  uploadCard: {
    alignItems: "center",
    backgroundColor: colors.surfaceTertiary,
    borderColor: colors.borderStrong,
    borderRadius: radii.card,
    borderWidth: 1.5,
    height: 448,
    justifyContent: "center",
    marginTop: 24,
    overflow: "hidden"
  },
  uploadCardEmpty: {
    borderStyle: "dashed"
  },
  uploadedPhoto: {
    height: "100%",
    resizeMode: "contain",
    width: "100%"
  },
  uploadCardWithPhoto: {
    backgroundColor: colors.background,
    borderStyle: "solid"
  },
  uploadEmpty: {
    alignItems: "center",
    gap: 10,
    paddingHorizontal: spacing.xl
  },
  uploadLabel: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 22
  },
  uploadHelper: {
    color: colors.muted,
    ...typography.caption
  }
});
