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

type Point = {
  x: number;
  y: number;
};

export function isMatchLabel(label?: string) {
  if (!label) {
    return false;
  }

  return label.toLowerCase().includes("match") || /^\d+%$/.test(label.trim());
}

export function formatMatchLabel(label: string) {
  return label.replace(/\bmatch\b/gi, "Match");
}

function formatPathNumber(value: number) {
  return Number(value.toFixed(2));
}

function getPointDistance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getPointToward(from: Point, to: Point, distance: number) {
  const length = getPointDistance(from, to);

  if (length === 0) {
    return from;
  }

  return {
    x: from.x + ((to.x - from.x) / length) * distance,
    y: from.y + ((to.y - from.y) / length) * distance
  };
}

function getRoundedRibbonPath({
  cornerRadius,
  height,
  mirrored,
  notchDepth,
  width
}: {
  cornerRadius: number;
  height: number;
  mirrored: boolean;
  notchDepth: number;
  width: number;
}) {
  const points: Point[] = mirrored
    ? [
        { x: 0, y: 0 },
        { x: notchDepth, y: height / 2 },
        { x: 0, y: height },
        { x: width, y: height },
        { x: width, y: 0 }
      ]
    : [
        { x: 0, y: 0 },
        { x: width, y: 0 },
        { x: width - notchDepth, y: height / 2 },
        { x: width, y: height },
        { x: 0, y: height }
      ];
  const firstPoint = getPointToward(points[0], points[1], cornerRadius);
  let path = `M${formatPathNumber(firstPoint.x)} ${formatPathNumber(firstPoint.y)}`;

  for (let index = 1; index <= points.length; index += 1) {
    const current = points[index % points.length];
    const previous = points[(index - 1 + points.length) % points.length];
    const next = points[(index + 1) % points.length];
    const radius = Math.max(
      0,
      Math.min(
        cornerRadius,
        getPointDistance(current, previous) / 2,
        getPointDistance(current, next) / 2
      )
    );
    const beforeCorner = getPointToward(current, previous, radius);
    const afterCorner = getPointToward(current, next, radius);

    path += ` L${formatPathNumber(beforeCorner.x)} ${formatPathNumber(beforeCorner.y)}`;
    path += ` Q${formatPathNumber(current.x)} ${formatPathNumber(current.y)} ${formatPathNumber(afterCorner.x)} ${formatPathNumber(afterCorner.y)}`;
  }

  return `${path} Z`;
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
  const cornerRadius = Math.min(3, height * 0.12);

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
          d={getRoundedRibbonPath({
            cornerRadius,
            height,
            mirrored,
            notchDepth,
            width
          })}
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
        {formatMatchLabel(label)}
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
