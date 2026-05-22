import { Feather } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View
} from "react-native";

import { colors, spacing } from "../../../theme";
import { AvatarCreatingScreen } from "../screens/AvatarCreatingScreen";
import { AvatarReadyScreen } from "../screens/AvatarReadyScreen";
import { SetupFashionInterestScreen } from "../screens/SetupFashionInterestScreen";
import { SetupHeightScreen } from "../screens/SetupHeightScreen";
import { SetupNameScreen } from "../screens/SetupNameScreen";
import { UploadFullBodyPhotoScreen } from "../screens/UploadFullBodyPhotoScreen";
import type {
  FashionInterest,
  OnboardingDraft
} from "../viewModels/useOnboardingViewModel";

export type OnboardingSetupDrawerStep =
  | "name"
  | "height"
  | "fashionInterest"
  | "uploadPhoto"
  | "avatarCreating"
  | "avatarReady";

type OnboardingSetupDrawerProps = {
  draft: OnboardingDraft;
  onAvatarCreated: (avatarUri: string) => void;
  onChangeFashionInterest: (interest: FashionInterest) => void;
  onChangeHeight: (feet: number, inches: number) => void;
  onChangeName: (name: string) => void;
  onChangeWeightKilograms: (weightKilograms: number) => void;
  onComplete: () => void;
  onContinueFashionInterest: () => void;
  onContinueHeight: () => void;
  onContinueName: () => void;
  onContinuePhoto: () => void;
  onBack?: () => void;
  onSelectPhoto: (uri: string) => void;
  onUseAnotherPhoto: () => void;
  step: OnboardingSetupDrawerStep;
};

const drawerHeightRatioByStep: Record<OnboardingSetupDrawerStep, number> = {
  avatarCreating: 0.74,
  avatarReady: 0.78,
  fashionInterest: 0.62,
  height: 0.5,
  name: 0.5,
  uploadPhoto: 0.74
};

export function OnboardingSetupDrawer({
  draft,
  onAvatarCreated,
  onChangeFashionInterest,
  onChangeHeight,
  onChangeName,
  onChangeWeightKilograms,
  onComplete,
  onContinueFashionInterest,
  onContinueHeight,
  onContinueName,
  onContinuePhoto,
  onBack,
  onSelectPhoto,
  onUseAnotherPhoto,
  step
}: OnboardingSetupDrawerProps) {
  const { height } = useWindowDimensions();
  const drawerHeightRatio = drawerHeightRatioByStep[step];
  const drawerHeight = Math.min(
    Math.round(height * drawerHeightRatio),
    height - spacing.xl
  );
  const keyboardLift = useRef(new Animated.Value(0)).current;
  const shouldShowBackButton = Boolean(onBack) && step !== "avatarCreating";

  useEffect(() => {
    const animateLift = (toValue: number, duration = 220) => {
      Animated.timing(keyboardLift, {
        duration,
        easing: Easing.out(Easing.cubic),
        toValue,
        useNativeDriver: true
      }).start();
    };

    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const maxLift = Math.max(0, height - drawerHeight - spacing.xl);

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      const keyboardHeight = event.endCoordinates?.height ?? 0;
      const duration = event.duration ?? 220;
      const lift = Math.min(keyboardHeight, maxLift);

      animateLift(-lift, duration);
    });

    const hideSubscription = Keyboard.addListener(hideEvent, (event) => {
      animateLift(0, event.duration ?? 180);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [drawerHeight, height, keyboardLift]);

  return (
    <View style={styles.host}>
      <View style={styles.scrim} />
      <Animated.View
        style={[
          styles.sheet,
          {
            height: drawerHeight,
            transform: [{ translateY: keyboardLift }]
          }
        ]}
      >
        <View style={styles.handle} />
        {shouldShowBackButton ? (
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={8}
            onPress={onBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed ? styles.pressed : null
            ]}
          >
            <Feather color={colors.text} name="arrow-left" size={22} />
          </Pressable>
        ) : null}

        {step === "name" ? (
          <SetupNameScreen
            name={draft.name ?? ""}
            onChangeName={onChangeName}
            onContinue={onContinueName}
            presentation="drawer"
          />
        ) : null}

        {step === "height" ? (
          <SetupHeightScreen
            height={draft.height ?? { feet: 5, inches: 5 }}
            onChangeHeight={onChangeHeight}
            onChangeWeightKilograms={onChangeWeightKilograms}
            onContinue={onContinueHeight}
            presentation="drawer"
            weightKilograms={draft.weightKilograms}
          />
        ) : null}

        {step === "fashionInterest" ? (
          <SetupFashionInterestScreen
            interest={draft.fashionInterest}
            onChangeInterest={onChangeFashionInterest}
            onContinue={onContinueFashionInterest}
            presentation="drawer"
          />
        ) : null}

        {step === "uploadPhoto" ? (
          <UploadFullBodyPhotoScreen
            onContinue={onContinuePhoto}
            onSelectPhoto={onSelectPhoto}
            onSkip={onComplete}
            photoUri={draft.fullBodyPhotoUri}
            presentation="drawer"
          />
        ) : null}

        {step === "avatarCreating" ? (
          <AvatarCreatingScreen
            onComplete={onAvatarCreated}
            photoUri={draft.fullBodyPhotoUri}
            presentation="drawer"
          />
        ) : null}

        {step === "avatarReady" ? (
          <AvatarReadyScreen
            avatarUri={draft.avatarUri}
            height={draft.height}
            onContinue={onComplete}
            onUseAnotherPhoto={onUseAnotherPhoto}
            presentation="drawer"
          />
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    borderRadius: 20,
    height: 36,
    justifyContent: "center",
    left: spacing.screen,
    position: "absolute",
    top: spacing.xs,
    width: 36,
    zIndex: 3
  },
  handle: {
    alignSelf: "center",
    backgroundColor: colors.border,
    borderRadius: 999,
    height: 4,
    marginTop: spacing.md,
    width: 48,
    zIndex: 2
  },
  host: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    zIndex: 30
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.46)"
  },
  pressed: {
    opacity: 0.72
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    elevation: 18,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { height: -8, width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 24
  }
});
