import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold
} from "@expo-google-fonts/outfit";
import { useFonts } from "expo-font";
import { StatusBar, StyleSheet, View } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

import { RootNavigator } from "./src/navigation/RootNavigator";
import { colors } from "./src/theme";

export default function App() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold
  });

  if (!fontsLoaded) {
    return <View style={styles.app} />;
  }

  return (
    <View style={styles.app}>
      <ExpoStatusBar style="dark" />
      <View style={styles.safeArea}>
        <RootNavigator />
      </View>
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
  }
});
