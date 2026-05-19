import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  Path,
  Stop
} from "react-native-svg";

import { colors, fonts } from "../../../theme";

type MatchRibbonTagProps = {
  height?: number;
  label: string;
  mirrored?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  width?: number;
};

export function isMatchLabel(label?: string) {
  if (!label) {
    return false;
  }

  return label.toLowerCase().includes("match") || /^\d+%$/.test(label.trim());
}

export function MatchRibbonTag({
  height = 28,
  label,
  mirrored = false,
  style,
  textStyle,
  width = 94
}: MatchRibbonTagProps) {
  const notchDepth = Math.round(height * 0.46);

  return (
    <View style={[styles.container, { height, width }, style]}>
      <Svg
        height={height}
        style={StyleSheet.absoluteFill}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
      >
        <Defs>
          <LinearGradient
            id="matchRibbonCreamGradient"
            x1="0"
            x2={String(width)}
            y1="0"
            y2="0"
          >
            <Stop offset="0" stopColor={colors.surfaceTertiary} />
            <Stop offset="0.54" stopColor={colors.cream} />
            <Stop offset="1" stopColor="#E4D4BC" />
          </LinearGradient>
        </Defs>
        <Path
          d={
            mirrored
              ? `M0 0 L${notchDepth} ${height / 2} L0 ${height} H${width} V0 Z`
              : `M0 0 H${width} L${width - notchDepth} ${height / 2} L${width} ${height} H0 Z`
          }
          fill="url(#matchRibbonCreamGradient)"
        />
      </Svg>
      <Text
        numberOfLines={1}
        style={[
          styles.text,
          textStyle,
          mirrored ? styles.mirroredText : null
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    justifyContent: "center",
    overflow: "hidden"
  },
  text: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14,
    paddingLeft: 10,
    paddingRight: 20,
    textAlign: "left",
    width: "100%"
  },
  mirroredText: {
    paddingLeft: 20,
    paddingRight: 10,
    textAlign: "right"
  }
});
