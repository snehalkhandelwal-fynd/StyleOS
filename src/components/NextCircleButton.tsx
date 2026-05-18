import { Pressable, StyleSheet, ViewStyle } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import { colors } from "../theme";

type NextCircleButtonProps = {
  currentStep?: number;
  disabled?: boolean;
  onPress: () => void;
  style?: ViewStyle;
  totalSteps?: number;
};

function NextArrowIcon({ disabled }: { disabled: boolean }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 6L15 12L9 18"
        stroke={disabled ? colors.inverseText : colors.inverseText}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </Svg>
  );
}

export function NextCircleButton({
  currentStep,
  disabled = false,
  onPress,
  style,
  totalSteps = 5
}: NextCircleButtonProps) {
  const size = 64;
  const strokeWidth = 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress =
    currentStep && totalSteps ? Math.min(currentStep / totalSteps, 1) : 0;
  const progressOffset = circumference * (1 - progress);

  return (
    <Pressable
      accessibilityLabel="Continue"
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        disabled ? styles.disabled : null,
        pressed ? styles.pressed : null,
        style
      ]}
    >
      {currentStep ? (
        <Svg
          height={size}
          style={styles.progressRing}
          viewBox={`0 0 ${size} ${size}`}
          width={size}
        >
          <Circle
            cx={size / 2}
            cy={size / 2}
            fill="none"
            r={radius}
            stroke={colors.border}
            strokeWidth={strokeWidth}
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            fill="none"
            r={radius}
            stroke={colors.text}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            strokeWidth={strokeWidth}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
      ) : null}
      <NextArrowIcon disabled={disabled} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.inverse,
    borderRadius: 999,
    height: 48,
    justifyContent: "center",
    overflow: "visible",
    width: 48
  },
  disabled: {
    backgroundColor: colors.soft
  },
  pressed: {
    opacity: 0.72
  },
  progressRing: {
    left: -8,
    position: "absolute",
    top: -8
  }
});
