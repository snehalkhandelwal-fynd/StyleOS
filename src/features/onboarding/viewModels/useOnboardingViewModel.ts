import { useMemo, useReducer } from "react";

import { defaultCountry, type CountryOption } from "../../../data/countries";

export type FashionInterest = "womens" | "mens";

export interface OnboardingDraft {
  phone?: {
    countryCode: string;
    phoneNumber: string;
  };
  name?: string;
  email?: string;
  dateOfBirth?: string;
  anniversary?: string;
  height?: {
    feet: number;
    inches: number;
    centimeters: number;
  };
  fashionInterest?: FashionInterest;
  styleQuiz?: {
    likedStyleIds: string[];
    rejectedStyleIds: string[];
    skipped: boolean;
  };
  fullBodyPhotoUri?: string;
  avatarUri?: string;
  address?: string;
}

export type EditableProfile = {
  anniversary?: string;
  avatarUri?: string;
  dateOfBirth?: string;
  email?: string;
  fashionInterest?: FashionInterest;
  name: string;
  phone?: {
    countryCode: string;
    phoneNumber: string;
  };
};

type OnboardingAction =
  | { type: "phoneChanged"; country: CountryOption; phoneNumber: string }
  | { type: "nameChanged"; name: string }
  | { type: "profileUpdated"; profile: EditableProfile }
  | { type: "heightChanged"; feet: number; inches: number }
  | { type: "fashionInterestChanged"; fashionInterest: FashionInterest }
  | { type: "styleLiked"; styleId: string }
  | { type: "styleRejected"; styleId: string }
  | { type: "styleQuizReset" }
  | { type: "styleQuizSkipped" }
  | { type: "fullBodyPhotoChanged"; uri: string }
  | { type: "avatarChanged"; uri: string }
  | { type: "addressChanged"; address: string };

const defaultHeight = {
  centimeters: 165,
  feet: 5,
  inches: 5
};

const initialDraft: OnboardingDraft = {
  height: defaultHeight,
  styleQuiz: {
    likedStyleIds: [],
    rejectedStyleIds: [],
    skipped: false
  }
};

function getCentimeters(feet: number, inches: number) {
  return Math.round((feet * 12 + inches) * 2.54);
}

function withoutValue(values: string[], value: string) {
  return values.filter((item) => item !== value);
}

function onboardingReducer(
  state: OnboardingDraft,
  action: OnboardingAction
): OnboardingDraft {
  if (action.type === "phoneChanged") {
    return {
      ...state,
      phone: {
        countryCode: action.country.code,
        phoneNumber: action.phoneNumber
      }
    };
  }

  if (action.type === "nameChanged") {
    return {
      ...state,
      name: action.name
    };
  }

  if (action.type === "profileUpdated") {
    const cleanOptionalValue = (value?: string) => {
      const trimmedValue = value?.trim() ?? "";

      return trimmedValue || undefined;
    };

    return {
      ...state,
      anniversary: cleanOptionalValue(action.profile.anniversary),
      avatarUri: action.profile.avatarUri ?? state.avatarUri,
      dateOfBirth: cleanOptionalValue(action.profile.dateOfBirth),
      email: cleanOptionalValue(action.profile.email),
      fashionInterest: action.profile.fashionInterest ?? state.fashionInterest,
      name: action.profile.name.trim(),
      phone: action.profile.phone ?? state.phone
    };
  }

  if (action.type === "heightChanged") {
    return {
      ...state,
      height: {
        centimeters: getCentimeters(action.feet, action.inches),
        feet: action.feet,
        inches: action.inches
      }
    };
  }

  if (action.type === "fashionInterestChanged") {
    return {
      ...state,
      fashionInterest: action.fashionInterest
    };
  }

  if (action.type === "styleLiked") {
    const currentQuiz = state.styleQuiz ?? initialDraft.styleQuiz;

    return {
      ...state,
      styleQuiz: {
        likedStyleIds: [
          ...withoutValue(currentQuiz?.likedStyleIds ?? [], action.styleId),
          action.styleId
        ],
        rejectedStyleIds: withoutValue(
          currentQuiz?.rejectedStyleIds ?? [],
          action.styleId
        ),
        skipped: false
      }
    };
  }

  if (action.type === "styleRejected") {
    const currentQuiz = state.styleQuiz ?? initialDraft.styleQuiz;

    return {
      ...state,
      styleQuiz: {
        likedStyleIds: withoutValue(
          currentQuiz?.likedStyleIds ?? [],
          action.styleId
        ),
        rejectedStyleIds: [
          ...withoutValue(currentQuiz?.rejectedStyleIds ?? [], action.styleId),
          action.styleId
        ],
        skipped: false
      }
    };
  }

  if (action.type === "styleQuizSkipped") {
    return {
      ...state,
      styleQuiz: {
        likedStyleIds: [],
        rejectedStyleIds: [],
        skipped: true
      }
    };
  }

  if (action.type === "styleQuizReset") {
    return {
      ...state,
      styleQuiz: {
        likedStyleIds: [],
        rejectedStyleIds: [],
        skipped: false
      }
    };
  }

  if (action.type === "fullBodyPhotoChanged") {
    return {
      ...state,
      fullBodyPhotoUri: action.uri
    };
  }

  if (action.type === "avatarChanged") {
    return {
      ...state,
      avatarUri: action.uri
    };
  }

  return {
    ...state,
    address: action.address
  };
}

export function useOnboardingViewModel() {
  const [draft, dispatch] = useReducer(onboardingReducer, initialDraft);

  const state = useMemo(() => {
    const trimmedName = draft.name?.trim() ?? "";
    const firstName = trimmedName ? trimmedName.split(/\s+/)[0] : "Guest";

    return {
      defaultCountry,
      draft,
      firstName,
      isGuest: !draft.phone,
      selectedAddress: draft.address?.trim() ?? ""
    };
  }, [draft]);

  const actions = useMemo(
    () => ({
      setAddress: (address: string) =>
        dispatch({ address, type: "addressChanged" }),
      setAvatarUri: (uri: string) =>
        dispatch({ type: "avatarChanged", uri }),
      setFashionInterest: (fashionInterest: FashionInterest) =>
        dispatch({ fashionInterest, type: "fashionInterestChanged" }),
      setFullBodyPhotoUri: (uri: string) =>
        dispatch({ type: "fullBodyPhotoChanged", uri }),
      setHeight: (feet: number, inches: number) =>
        dispatch({ feet, inches, type: "heightChanged" }),
      setName: (name: string) => dispatch({ name, type: "nameChanged" }),
      updateProfile: (profile: EditableProfile) =>
        dispatch({ profile, type: "profileUpdated" }),
      setPhone: (country: CountryOption, phoneNumber: string) =>
        dispatch({ country, phoneNumber, type: "phoneChanged" }),
      resetStyleQuiz: () => dispatch({ type: "styleQuizReset" }),
      skipStyleQuiz: () => dispatch({ type: "styleQuizSkipped" }),
      submitStylePreference: (
        styleId: string,
        preference: "liked" | "rejected"
      ) =>
        dispatch({
          styleId,
          type: preference === "liked" ? "styleLiked" : "styleRejected"
        })
    }),
    []
  );

  return { actions, state };
}
