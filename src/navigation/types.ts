export type RootStackParamList = {
  Splash: undefined;
  PhoneSignIn: undefined;
  OtpVerification: { phoneNumber: string; countryCode: string };
  SetupName: undefined;
  SetupHeight: undefined;
  SetupFashionInterest: undefined;
  SetupStyleQuiz: undefined;
  UploadFullBodyPhoto: undefined;
  AvatarCreating: undefined;
  AvatarReady: undefined;
  HomeTabs: undefined;
};

export type HomeTabParamList = {
  Home: undefined;
  TryOn: undefined;
  Closet: undefined;
  Feed: undefined;
  AIStylist: undefined;
  Cart: undefined;
  Profile: undefined;
};

export type RootRouteName = keyof RootStackParamList;
export type HomeTabName = keyof HomeTabParamList;
