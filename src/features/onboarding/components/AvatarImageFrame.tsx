import type { ReactNode } from "react";
import { Image, StyleSheet, View } from "react-native";

import { colors } from "../../../theme";

type AvatarImageFrameProps = {
  children?: ReactNode;
  uri?: string;
};

export function AvatarImageFrame({ children, uri }: AvatarImageFrameProps) {
  return (
    <View style={styles.frame}>
      {uri ? (
        <Image resizeMode="cover" source={{ uri }} style={styles.image} />
      ) : null}
      {children}
    </View>
  );
}

export const avatarImageFrameStyles = StyleSheet.create({
  frame: {
    aspectRatio: 3 / 4,
    backgroundColor: colors.surface,
    borderRadius: 20,
    overflow: "hidden",
    width: "100%"
  },
  image: {
    height: "100%",
    width: "100%"
  },
  spacing: {
    marginTop: 24
  }
});

const styles = avatarImageFrameStyles;
