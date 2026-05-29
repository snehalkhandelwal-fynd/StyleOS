import { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import { requiredPhoneNumberDigits } from "../constants/auth";
import { defaultCountry, type CountryOption } from "../data/countries";
import { HomeTabsNavigator } from "./HomeTabsNavigator";
import type { AccountPage } from "../features/home/screens/AccountScreen";
import type { HomeTabName, RootRouteName } from "./types";
import { AvatarCreatingScreen } from "../features/onboarding/screens/AvatarCreatingScreen";
import { AvatarReadyScreen } from "../features/onboarding/screens/AvatarReadyScreen";
import {
  OnboardingSetupDrawer,
  type OnboardingSetupDrawerStep
} from "../features/onboarding/components/OnboardingSetupDrawer";
import { OtpVerificationScreen } from "../features/onboarding/screens/OtpVerificationScreen";
import { PhoneSignInScreen } from "../features/onboarding/screens/PhoneSignInScreen";
import { SetupFashionInterestScreen } from "../features/onboarding/screens/SetupFashionInterestScreen";
import { SetupHeightScreen } from "../features/onboarding/screens/SetupHeightScreen";
import { SetupNameScreen } from "../features/onboarding/screens/SetupNameScreen";
import { SetupStyleQuizScreen } from "../features/onboarding/screens/SetupStyleQuizScreen";
import { SplashScreen } from "../features/onboarding/screens/SplashScreen";
import { UploadFullBodyPhotoScreen } from "../features/onboarding/screens/UploadFullBodyPhotoScreen";
import { useOnboardingViewModel } from "../features/onboarding/viewModels/useOnboardingViewModel";
import { colors } from "../theme";

type RootNavigatorProps = {
  onStatusBarBackgroundChange?: (backgroundColor: string) => void;
};

export function RootNavigator({
  onStatusBarBackgroundChange
}: RootNavigatorProps) {
  const { actions, state } = useOnboardingViewModel();
  const [route, setRoute] = useState<RootRouteName>("Splash");
  const [homeInitialTab, setHomeInitialTab] = useState<HomeTabName>("Home");
  const [homeInitialAccountPage, setHomeInitialAccountPage] =
    useState<AccountPage | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] =
    useState<CountryOption>(defaultCountry);
  const [setupDrawerStep, setSetupDrawerStep] =
    useState<OnboardingSetupDrawerStep | null>(null);

  useEffect(() => {
    if (route !== "HomeTabs") {
      onStatusBarBackgroundChange?.(colors.background);
    }
  }, [onStatusBarBackgroundChange, route]);

  const goHome = useCallback((tab: HomeTabName = "Home", accountPage?: AccountPage) => {
    setHomeInitialTab(tab);
    setHomeInitialAccountPage(accountPage ?? null);
    setRoute("HomeTabs");
  }, []);

  const handleSubmitPhone = () => {
    if (phoneNumber.trim().length !== requiredPhoneNumberDigits) {
      Alert.alert(
        "Enter full phone number",
        `Add your ${requiredPhoneNumberDigits} digit mobile number to receive the verification code.`
      );
      return;
    }

    actions.setPhone(selectedCountry, phoneNumber);
    setRoute("OtpVerification");
  };

  const handleOtpVerified = () => {
    setSetupDrawerStep("name");
    goHome("Home");
  };

  const handleCompleteStyleQuiz = () => {
    goHome("Home");
  };

  const handleContinueHeight = () => {
    setRoute("SetupFashionInterest");
  };

  const handleContinueDrawerHeight = () => {
    setSetupDrawerStep("fashionInterest");
  };

  const handleBackFromSetupDrawer = useCallback(() => {
    setSetupDrawerStep((currentStep) => {
      switch (currentStep) {
        case "height":
          return "name";
        case "fashionInterest":
          return "height";
        case "uploadPhoto":
          return "fashionInterest";
        case "avatarCreating":
          return "uploadPhoto";
        case "avatarReady":
          return "uploadPhoto";
        default:
          return currentStep;
      }
    });
  }, []);

  const handleDrawerAvatarCreated = useCallback(
    (avatarUri: string) => {
      actions.setAvatarUri(avatarUri);
      setSetupDrawerStep("avatarReady");
    },
    [actions]
  );

  const handleStartStyleQuizFromHome = (
    returnTab: HomeTabName = "Home",
    returnAccountPage?: AccountPage
  ) => {
    void returnTab;
    void returnAccountPage;
    setRoute("SetupStyleQuiz");
  };

  const handleChangeAddressFromHome = useCallback(() => {}, []);

  const handleUseAnotherPhoto = useCallback(() => {
    setRoute("UploadFullBodyPhoto");
  }, []);

  return (
    <View style={styles.screen}>
      {route === "Splash" ? (
        <SplashScreen onGetStarted={() => setRoute("PhoneSignIn")} />
      ) : null}

      {route === "PhoneSignIn" ? (
        <PhoneSignInScreen
          onChangeCountry={setSelectedCountry}
          onChangePhone={setPhoneNumber}
          onSubmit={handleSubmitPhone}
          phoneNumber={phoneNumber}
          selectedCountry={selectedCountry}
        />
      ) : null}

      {route === "OtpVerification" ? (
        <OtpVerificationScreen
          countryCode={selectedCountry.code}
          onEditPhone={() => setRoute("PhoneSignIn")}
          onVerified={handleOtpVerified}
          phoneNumber={phoneNumber}
        />
      ) : null}

      {route === "SetupName" ? (
        <SetupNameScreen
          name={state.draft.name ?? ""}
          onChangeName={actions.setName}
          onContinue={() => setRoute("SetupHeight")}
        />
      ) : null}

      {route === "SetupHeight" ? (
        <SetupHeightScreen
          height={state.draft.height ?? { feet: 5, inches: 5 }}
          onChangeHeight={actions.setHeight}
          onContinue={handleContinueHeight}
        />
      ) : null}

      {route === "SetupFashionInterest" ? (
        <SetupFashionInterestScreen
          interest={state.draft.fashionInterest}
          onChangeInterest={actions.setFashionInterest}
          onContinue={() => setRoute("UploadFullBodyPhoto")}
        />
      ) : null}

      {route === "SetupStyleQuiz" ? (
        <SetupStyleQuizScreen
          fashionInterest={state.draft.fashionInterest}
          onComplete={handleCompleteStyleQuiz}
          onPreference={actions.submitStylePreference}
          onRetake={actions.resetStyleQuiz}
          onSkip={actions.skipStyleQuiz}
        />
      ) : null}

      {route === "UploadFullBodyPhoto" ? (
        <UploadFullBodyPhotoScreen
          onContinue={() => setRoute("AvatarCreating")}
          onSelectPhoto={actions.setFullBodyPhotoUri}
          onSkip={() => goHome("Home")}
          photoUri={state.draft.fullBodyPhotoUri}
        />
      ) : null}

      {route === "AvatarCreating" ? (
        <AvatarCreatingScreen
          onComplete={(avatarUri) => {
            actions.setAvatarUri(avatarUri);
            setRoute("AvatarReady");
          }}
          photoUri={state.draft.fullBodyPhotoUri}
        />
      ) : null}

      {route === "AvatarReady" ? (
        <AvatarReadyScreen
          avatarUri={state.draft.avatarUri}
          height={state.draft.height}
          onContinue={() => goHome("Home")}
          onUseAnotherPhoto={handleUseAnotherPhoto}
        />
      ) : null}

      {route === "HomeTabs" ? (
        <HomeTabsNavigator
          draft={state.draft}
          initialAccountPage={homeInitialAccountPage}
          initialTab={homeInitialTab}
          isGuest={state.isGuest}
          onChangeAddress={handleChangeAddressFromHome}
          onSelectPhoto={actions.setFullBodyPhotoUri}
          onStartStyleQuiz={handleStartStyleQuizFromHome}
          onStatusBarBackgroundChange={onStatusBarBackgroundChange}
          onUpdateProfile={actions.updateProfile}
        />
      ) : null}

      {route === "HomeTabs" && setupDrawerStep ? (
        <OnboardingSetupDrawer
          draft={state.draft}
          onAvatarCreated={handleDrawerAvatarCreated}
          onBack={
            setupDrawerStep && setupDrawerStep !== "name"
              ? handleBackFromSetupDrawer
              : undefined
          }
          onChangeFashionInterest={actions.setFashionInterest}
          onChangeHeight={actions.setHeight}
          onChangeName={actions.setName}
          onComplete={() => setSetupDrawerStep(null)}
          onContinueFashionInterest={() => setSetupDrawerStep("uploadPhoto")}
          onContinueHeight={handleContinueDrawerHeight}
          onContinueName={() => setSetupDrawerStep("height")}
          onContinuePhoto={() => setSetupDrawerStep("avatarCreating")}
          onSelectPhoto={actions.setFullBodyPhotoUri}
          onUseAnotherPhoto={() => setSetupDrawerStep("uploadPhoto")}
          step={setupDrawerStep}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
});
