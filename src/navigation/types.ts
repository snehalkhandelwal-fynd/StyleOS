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
  LocationAccess: undefined;
  HomeTabs: undefined;
};

export type HomeTabParamList = {
  Home: undefined;
  TryOn: undefined;
  Feed: undefined;
  AIStylist: undefined;
  Cart: undefined;
};

export type RootRouteName = keyof RootStackParamList;
export type HomeTabName = keyof HomeTabParamList;
