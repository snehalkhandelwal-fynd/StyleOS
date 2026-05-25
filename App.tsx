import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold
} from "@expo-google-fonts/outfit";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

import { RootNavigator } from "./src/navigation/RootNavigator";
import { appTopSafeGuardHeight } from "./src/features/home/utils/safeArea";
import { colors } from "./src/theme";

export default function App() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold
  });
  const [shouldRenderApp, setShouldRenderApp] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      setShouldRenderApp(true);
      return undefined;
    }

    const fallbackTimer = setTimeout(() => {
      setShouldRenderApp(true);
    }, 1200);

    return () => clearTimeout(fallbackTimer);
  }, [fontsLoaded]);

  if (!shouldRenderApp) {
    return (
      <View style={styles.app}>
        <ExpoStatusBar style="dark" />
        <View style={styles.loadingScreen}>
          <Text style={styles.loadingTitle}>Fynd Stylus</Text>
        </View>
        <View pointerEvents="none" style={styles.statusBarGuard} />
      </View>
    );
  }

  return (
    <View style={styles.app}>
      <ExpoStatusBar style="dark" />
      <View style={styles.safeArea}>
        <RootNavigator />
      </View>
      <View pointerEvents="none" style={styles.statusBarGuard} />
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    backgroundColor: colors.background,
    flex: 1,
    paddingTop: StatusBar.currentHeight ?? 0
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1
  },
  statusBarGuard: {
    backgroundColor: colors.background,
    elevation: 1000,
    height: appTopSafeGuardHeight,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1000
  },
  loadingScreen: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center"
  },
  loadingTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600"
  }
});
