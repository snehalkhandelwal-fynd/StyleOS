import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { colors, radii } from "../../../theme";

type CircularNextButtonProps = {
  accessibilityLabel: string;
  currentStep?: number;
  disabled?: boolean;
  onPress: () => void;
  totalSteps?: number;
};

export function CircularNextButton({
  accessibilityLabel,
  currentStep,
  disabled = false,
  onPress,
  totalSteps = 5
}: CircularNextButtonProps) {
  const size = 64;
  const strokeWidth = 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress =
    currentStep && totalSteps ? Math.min(currentStep / totalSteps, 1) : 0;
  const progressOffset = circumference * (1 - progress);

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        disabled ? styles.disabled : null,
        pressed ? styles.pressed : null
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
      <Ionicons color={colors.inverseText} name="chevron-forward" size={24} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.inverse,
    borderRadius: radii.button,
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
