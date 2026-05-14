import { StyleSheet, Text, View } from "react-native";

import { colors, fonts } from "../theme";

export function Divider() {
  return (
    <View style={styles.divider}>
      <View style={styles.line} />
      <Text style={styles.label}>OR</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    width: "100%"
  },
  label: {
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 16
  },
  line: {
    backgroundColor: colors.border,
    flex: 1,
    height: StyleSheet.hairlineWidth
  }
});
