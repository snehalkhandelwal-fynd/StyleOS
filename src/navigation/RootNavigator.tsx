import { useCallback, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import { requiredPhoneNumberDigits } from "../constants/auth";
import { defaultCountry, type CountryOption } from "../data/countries";
import { HomeTabsNavigator } from "./HomeTabsNavigator";
import type { HomeTabName, RootRouteName } from "./types";
import { AvatarCreatingScreen } from "../features/onboarding/screens/AvatarCreatingScreen";
import { AvatarReadyScreen } from "../features/onboarding/screens/AvatarReadyScreen";
import { OtpVerificationScreen } from "../features/onboarding/screens/OtpVerificationScreen";
import { PhoneSignInScreen } from "../features/onboarding/screens/PhoneSignInScreen";
import { SetupFashionInterestScreen } from "../features/onboarding/screens/SetupFashionInterestScreen";
import { SetupHeightScreen } from "../features/onboarding/screens/SetupHeightScreen";
import { SetupNameScreen } from "../features/onboarding/screens/SetupNameScreen";
import { SetupStyleQuizScreen } from "../features/onboarding/screens/SetupStyleQuizScreen";
import { SplashScreen } from "../features/onboarding/screens/SplashScreen";
import { UploadFullBodyPhotoScreen } from "../features/onboarding/screens/UploadFullBodyPhotoScreen";
import { useOnboardingViewModel } from "../features/onboarding/viewModels/useOnboardingViewModel";

export function RootNavigator() {
  const { actions, state } = useOnboardingViewModel();
  const [route, setRoute] = useState<RootRouteName>("Splash");
  const [homeInitialTab, setHomeInitialTab] = useState<HomeTabName>("Home");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] =
    useState<CountryOption>(defaultCountry);
  const [heightReturnsAvatarReady, setHeightReturnsAvatarReady] =
    useState(false);
  const [styleQuizReturnsHome, setStyleQuizReturnsHome] = useState(false);

  const goHome = useCallback((tab: HomeTabName = "Home") => {
    setHomeInitialTab(tab);
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

  const handleCompleteStyleQuiz = () => {
    if (styleQuizReturnsHome) {
      setStyleQuizReturnsHome(false);
      goHome("Home");
      return;
    }

    setRoute("UploadFullBodyPhoto");
  };

  const handleContinueHeight = () => {
    if (heightReturnsAvatarReady) {
      setHeightReturnsAvatarReady(false);
      setRoute("AvatarReady");
      return;
    }

    setRoute("SetupFashionInterest");
  };

  const handleChangeMeasurementFromAvatar = useCallback(() => {
    setHeightReturnsAvatarReady(true);
    setRoute("SetupHeight");
  }, []);

  const handleStartStyleQuizFromHome = () => {
    setStyleQuizReturnsHome(true);
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
          onSkip={() => goHome("Home")}
          onSubmit={handleSubmitPhone}
          phoneNumber={phoneNumber}
          selectedCountry={selectedCountry}
        />
      ) : null}

      {route === "OtpVerification" ? (
        <OtpVerificationScreen
          countryCode={selectedCountry.code}
          onEditPhone={() => setRoute("PhoneSignIn")}
          onVerified={() => setRoute("SetupName")}
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
          onContinue={() => setRoute("SetupStyleQuiz")}
        />
      ) : null}

      {route === "SetupStyleQuiz" ? (
        <SetupStyleQuizScreen
          fashionInterest={state.draft.fashionInterest}
          onComplete={handleCompleteStyleQuiz}
          onPreference={actions.submitStylePreference}
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
          onChangeMeasurement={handleChangeMeasurementFromAvatar}
          onContinue={() => goHome("Home")}
          onUseAnotherPhoto={handleUseAnotherPhoto}
        />
      ) : null}

      {route === "HomeTabs" ? (
        <HomeTabsNavigator
          draft={state.draft}
          initialTab={homeInitialTab}
          isGuest={state.isGuest}
          onChangeAddress={handleChangeAddressFromHome}
          onSelectPhoto={actions.setFullBodyPhotoUri}
          onStartStyleQuiz={handleStartStyleQuizFromHome}
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
