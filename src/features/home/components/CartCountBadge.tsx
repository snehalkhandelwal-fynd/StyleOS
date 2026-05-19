import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle
} from "react-native";

import { colors, fonts } from "../../../theme";

type CartCountBadgeProps = {
  count?: number;
  style?: StyleProp<ViewStyle>;
};

export function CartCountBadge({ count = 0, style }: CartCountBadgeProps) {
  if (count <= 0) {
    return null;
  }

  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.text}>{count > 9 ? "9+" : count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderColor: colors.background,
    borderRadius: 9,
    borderWidth: 1,
    height: 18,
    justifyContent: "center",
    minWidth: 18,
    paddingHorizontal: 4,
    position: "absolute",
    right: -4,
    top: 0
  },
  text: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 9,
    lineHeight: 11
  }
});
