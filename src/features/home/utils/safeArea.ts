import { Platform, StatusBar } from "react-native";

import { spacing } from "../../../theme";

export const appTopSafeInset =
  Platform.OS === "ios" || Platform.OS === "web"
    ? 44
    : StatusBar.currentHeight ?? 0;

export const appBottomSafeInset =
  Platform.OS === "ios" || Platform.OS === "web" ? 34 : 0;

export const appTopSafeGuardHeight = appTopSafeInset + spacing.sm;
export const appSearchHeaderTopPadding = appTopSafeInset + spacing.lg;
export const appSearchHeaderHeight =
  appSearchHeaderTopPadding + 44 + spacing.md;
