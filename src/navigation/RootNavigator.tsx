import { useCallback, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import { requiredPhoneNumberDigits } from "../constants/auth";
import { defaultCountry, type CountryOption } from "../data/countries";
import { HomeTabsNavigator } from "./HomeTabsNavigator";
import type { HomeTabName, RootRouteName } from "./types";
import { AvatarCreatingScreen } from "../features/onboarding/screens/AvatarCreatingScreen";
import { AvatarReadyScreen } from "../features/onboarding/screens/AvatarReadyScreen";
import { LocationAccessScreen } from "../features/onboarding/screens/LocationAccessScreen";
import { OtpVerificationScreen } from "../features/onboarding/screens/OtpVerificationScreen";
import { PhoneSignInScreen } from "../features/onboarding/screens/PhoneSignInScreen";
import { SetupFashionInterestScreen } from "../features/onboarding/screens/SetupFashionInterestScreen";
import { SetupHeightScreen } from "../features/onboarding/screens/SetupHeightScreen";
import { SetupNameScreen } from "../features/onboarding/screens/SetupNameScreen";
import { SetupStyleQuizScreen } from "../features/onboarding/screens/SetupStyleQuizScreen";
import { SplashScreen } from "../features/onboarding/screens/SplashScreen";
import { UploadFullBodyPhotoScreen } from "../features/onboarding/screens/UploadFullBodyPhotoScreen";
import { openPhotoSourceDrawer } from "../features/onboarding/utils/photoPicker";
import { useOnboardingViewModel } from "../features/onboarding/viewModels/useOnboardingViewModel";

export function RootNavigator() {
  const { actions, state } = useOnboardingViewModel();
  const [route, setRoute] = useState<RootRouteName>("Splash");
  const [homeInitialTab, setHomeInitialTab] = useState<HomeTabName>("Home");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] =
    useState<CountryOption>(defaultCountry);
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

  const handleStartStyleQuizFromHome = () => {
    setStyleQuizReturnsHome(true);
    setRoute("SetupStyleQuiz");
  };

  const handleChangeAddressFromHome = () => {
    setRoute("LocationAccess");
  };

  const handleUseAnotherPhoto = useCallback(() => {
    openPhotoSourceDrawer({
      onPhotoSelected: (uri) => {
        actions.setFullBodyPhotoUri(uri);
        setRoute("UploadFullBodyPhoto");
      }
    });
  }, [actions]);

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
          onContinue={() => setRoute("SetupFashionInterest")}
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
          onComplete={handleCompleteStyleQuiz}
          onPreference={actions.submitStylePreference}
          onSkip={actions.skipStyleQuiz}
        />
      ) : null}

      {route === "UploadFullBodyPhoto" ? (
        <UploadFullBodyPhotoScreen
          onContinue={() => setRoute("AvatarCreating")}
          onSelectPhoto={actions.setFullBodyPhotoUri}
          onSkip={() => setRoute("LocationAccess")}
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
          onContinue={() => setRoute("LocationAccess")}
          onUseAnotherPhoto={handleUseAnotherPhoto}
        />
      ) : null}

      {route === "LocationAccess" ? (
        <LocationAccessScreen
          address={state.draft.address ?? ""}
          onChangeAddress={actions.setAddress}
          onContinue={() => goHome("Home")}
        />
      ) : null}

      {route === "HomeTabs" ? (
        <HomeTabsNavigator
          draft={state.draft}
          initialTab={homeInitialTab}
          isGuest={state.isGuest}
          onChangeAddress={handleChangeAddressFromHome}
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
