import { useEffect, useState } from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextStyle,
  View
} from "react-native";
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";

import { PrimaryButton } from "../components/PrimaryButton";
import { colors, fonts, radii, spacing, typography } from "../theme";

const webTextInputReset =
  Platform.OS === "web"
    ? ({
        outlineStyle: "none",
        outlineWidth: 0
      } as unknown as TextStyle)
    : null;

const defaultAddress = "MIDC, Andheri East, Mumbai 400096";

const locationSuggestions = [
  defaultAddress,
  "Bandra West, Mumbai 400050",
  "Koramangala, Bengaluru 560034"
];

type LocationScreenProps = {
  address: string;
  onChangeAddress: (address: string) => void;
  onContinue: () => void;
};

function LocationPinIcon({ color = colors.text, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21C12 21 18.25 15.72 18.25 10.25C18.25 6.8 15.45 4 12 4C8.55 4 5.75 6.8 5.75 10.25C5.75 15.72 12 21 12 21Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
      />
      <Circle cx={12} cy={10.25} r={2} stroke={color} strokeWidth={1.6} />
    </Svg>
  );
}

function LocationVisual() {
  return (
    <View style={styles.visualCard}>
      <Svg width="100%" height="100%" viewBox="0 0 320 250" fill="none">
        <Rect
          x={0.5}
          y={0.5}
          width={319}
          height={249}
          rx={18}
          fill="#F3F1F0"
          stroke={colors.border}
        />
        <Path
          d="M34 64C76 36 113 41 145 78C179 118 222 118 286 82"
          stroke="#D8D5D3"
          strokeLinecap="round"
          strokeWidth={1.3}
        />
        <Path
          d="M26 178C75 154 112 161 145 192C181 227 225 213 292 175"
          stroke="#D8D5D3"
          strokeLinecap="round"
          strokeWidth={1.3}
        />
        <Line x1={103} x2={103} y1={28} y2={222} stroke="#E3E1E0" />
        <Line x1={214} x2={214} y1={28} y2={222} stroke="#E3E1E0" />
        <Line x1={34} x2={286} y1={126} y2={126} stroke="#E3E1E0" />
        <Circle cx={160} cy={118} r={42} fill="#FFFFFF" />
        <Path
          d="M160 169C160 169 188 144.82 188 119.8C188 104.44 175.46 92 160 92C144.54 92 132 104.44 132 119.8C132 144.82 160 169 160 169Z"
          fill={colors.text}
        />
        <Circle cx={160} cy={120} r={10} fill={colors.inverseText} />
      </Svg>
    </View>
  );
}

export function LocationScreen({
  address,
  onChangeAddress,
  onContinue
}: LocationScreenProps) {
  const [isManualEntry, setIsManualEntry] = useState(address.trim().length > 0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const canContinue = address.trim().length > 0;

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const showSubscription = Keyboard.addListener(showEvent, () => {
      setIsKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleAllowLocation = () => {
    onChangeAddress(defaultAddress);
    onContinue();
  };

  const handleManualContinue = () => {
    if (canContinue) {
      onContinue();
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerSpacer} />

      <View style={styles.content}>
        {!isManualEntry ? (
          <>
            <Text style={styles.title}>Enable location access</Text>
            <Text style={styles.copy}>
              We use your location to show nearby brands, delivery options, and
              looks available around you.
            </Text>

            <LocationVisual />
          </>
        ) : (
          <>
            <Text style={styles.title}>Set your location</Text>
            <Text style={styles.copy}>
              Add an area, city, or pincode so we can personalize delivery and
              nearby recommendations.
            </Text>

            <View style={styles.inputWrap}>
              <LocationPinIcon color={colors.muted} size={22} />
              <TextInput
                autoCapitalize="words"
                onChangeText={onChangeAddress}
                placeholder="Enter area, city or pincode"
                placeholderTextColor={colors.soft}
                style={[styles.input, webTextInputReset]}
                value={address}
              />
            </View>

            <View style={styles.suggestions}>
              {locationSuggestions.map((suggestion) => {
                const isSelected = suggestion === address;

                return (
                  <Pressable
                    accessibilityRole="button"
                    key={suggestion}
                    onPress={() => onChangeAddress(suggestion)}
                    style={({ pressed }) => [
                      styles.suggestionCard,
                      isSelected ? styles.suggestionCardSelected : null,
                      pressed ? styles.pressed : null
                    ]}
                  >
                    <LocationPinIcon
                      color={isSelected ? colors.text : colors.muted}
                      size={18}
                    />
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.suggestionText,
                        isSelected ? styles.suggestionTextSelected : null
                      ]}
                    >
                      {suggestion}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}
      </View>

      <View
        style={[
          styles.footer,
          isKeyboardVisible ? styles.footerWithKeyboard : null
        ]}
      >
        {!isManualEntry ? (
          <>
            <PrimaryButton
              label="Allow location access"
              onPress={handleAllowLocation}
            />
            <PrimaryButton
              label="Enter location manually"
              onPress={() => setIsManualEntry(true)}
              style={styles.secondaryButton}
              variant="outline"
            />
          </>
        ) : (
          <>
            <PrimaryButton
              disabled={!canContinue}
              label="Continue"
              onPress={handleManualContinue}
            />
            <Pressable
              accessibilityRole="button"
              onPress={handleAllowLocation}
              style={({ pressed }) => [
                styles.textButton,
                pressed ? styles.pressed : null
              ]}
            >
              <Text style={styles.textButtonLabel}>Use current location</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing.screen,
    paddingTop: 24
  },
  copy: {
    color: colors.muted,
    marginTop: 14,
    maxWidth: 334,
    ...typography.bodyLarge
  },
  footer: {
    bottom: 34,
    gap: 12,
    left: spacing.screen,
    position: "absolute",
    right: spacing.screen
  },
  footerWithKeyboard: {
    bottom: 16
  },
  headerSpacer: {
    height: 48
  },
  input: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 16,
    height: "100%",
    lineHeight: 24,
    minWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0
  },
  inputWrap: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    height: 56,
    marginTop: 34,
    paddingHorizontal: 14
  },
  pressed: {
    opacity: 0.72
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1
  },
  secondaryButton: {
    height: 48
  },
  suggestionCard: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    height: 48,
    paddingHorizontal: 14
  },
  suggestionCardSelected: {
    borderColor: colors.text
  },
  suggestions: {
    gap: 10,
    marginTop: 24
  },
  suggestionText: {
    color: colors.muted,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20
  },
  suggestionTextSelected: {
    color: colors.text
  },
  textButton: {
    alignItems: "center",
    height: 36,
    justifyContent: "center"
  },
  textButtonLabel: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
    textDecorationLine: "underline"
  },
  title: {
    color: colors.text,
    ...typography.h2
  },
  visualCard: {
    borderRadius: 18,
    height: 250,
    marginTop: 44,
    overflow: "hidden",
    width: "100%"
  }
});
