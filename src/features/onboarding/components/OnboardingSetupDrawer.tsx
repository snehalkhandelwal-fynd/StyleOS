import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Keyboard,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View
} from "react-native";

import { colors, spacing } from "../../../theme";
import { OnboardingDrawerHeaderProvider } from "./OnboardingStepShell";
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

export function OnboardingSetupDrawer({
  draft,
  onAvatarCreated,
  onChangeFashionInterest,
  onChangeHeight,
  onChangeName,
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
  const maxDrawerHeight = Math.max(320, height - spacing.xl);
  const fallbackDrawerHeight = Math.min(320, maxDrawerHeight);
  const [measuredDrawerHeight, setMeasuredDrawerHeight] = useState(0);
  const keyboardLift = useRef(new Animated.Value(0)).current;
  const shouldShowBackButton = Boolean(onBack);

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
    const activeDrawerHeight = measuredDrawerHeight || fallbackDrawerHeight;
    const maxLift = Math.max(0, height - activeDrawerHeight - spacing.xl);

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
  }, [height, keyboardLift, measuredDrawerHeight, fallbackDrawerHeight]);

  return (
    <View style={styles.host}>
      <View style={styles.scrim} />
      <Animated.View
        onLayout={(event) => {
          const nextHeight = Math.round(event.nativeEvent.layout.height);

          setMeasuredDrawerHeight((currentHeight) =>
            Math.abs(currentHeight - nextHeight) > 1 ? nextHeight : currentHeight
          );
        }}
        style={[
          styles.sheet,
          {
            maxHeight: maxDrawerHeight,
            transform: [{ translateY: keyboardLift }]
          }
        ]}
      >
        <OnboardingDrawerHeaderProvider
          onBack={onBack}
          showBackButton={shouldShowBackButton}
        >
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
              onContinue={onContinueHeight}
              presentation="drawer"
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
        </OnboardingDrawerHeaderProvider>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    zIndex: 30
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.46)"
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 18,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { height: -8, width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 24
  }
});
