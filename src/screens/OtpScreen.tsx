import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextStyle,
  View
} from "react-native";
import type {
  NativeSyntheticEvent,
  TextInput as TextInputType,
  TextInputKeyPressEventData
} from "react-native";

import { EditIcon } from "../components/EditIcon";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenHeader } from "../components/ScreenHeader";
import { colors, fonts, radii, spacing, typography } from "../theme";

const resendCountdownStart = 45;
const webTextInputReset =
  Platform.OS === "web"
    ? ({
        outlineStyle: "none",
        outlineWidth: 0
      } as unknown as TextStyle)
    : null;

type OtpScreenProps = {
  countryCode: string;
  phoneNumber: string;
  onBack: () => void;
  onEditPhone: () => void;
  onVerified: () => void;
};

export function OtpScreen({
  countryCode,
  phoneNumber,
  onBack,
  onEditPhone,
  onVerified
}: OtpScreenProps) {
  const [code, setCode] = useState(["", "", "", ""]);
  const [focusedInputIndex, setFocusedInputIndex] = useState<number | null>(0);
  const [resendSeconds, setResendSeconds] = useState(resendCountdownStart);
  const inputs = useRef<Array<TextInputType | null>>([]);
  const isComplete = code.every(Boolean);
  const sentToNumber = `${countryCode} ${phoneNumber}`;

  useEffect(() => {
    setResendSeconds(resendCountdownStart);
    const focusTimer = setTimeout(() => {
      focusInput(0);
    }, 300);

    return () => clearTimeout(focusTimer);
  }, [countryCode, phoneNumber]);

  useEffect(() => {
    if (resendSeconds <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendSeconds]);

  const formattedResendTime = `0:${String(resendSeconds).padStart(2, "0")}`;

  const focusInput = (index: number) => {
    requestAnimationFrame(() => {
      inputs.current[index]?.focus();
    });
  };

  const handleChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);

    if (digit && index < inputs.current.length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (event.nativeEvent.key !== "Backspace") {
      return;
    }

    const next = [...code];

    if (next[index]) {
      next[index] = "";
      setCode(next);
      return;
    }

    if (index === 0) {
      return;
    }

    next[index - 1] = "";
    setCode(next);
    focusInput(index - 1);
  };

  const handleVerify = () => {
    if (!isComplete) {
      Alert.alert("Enter code", "Add the 4 digit code to continue.");
      return;
    }

    onVerified();
  };

  const handleResendOtp = () => {
    setCode(["", "", "", ""]);
    setResendSeconds(resendCountdownStart);
    inputs.current[0]?.focus();
  };

  return (
    <View style={styles.screen}>
      <View>
        <ScreenHeader showBrand={false} />

        <View style={styles.content}>
          <Text style={styles.title}>Enter your verification code</Text>

          <View style={styles.sentRow}>
            <Text style={styles.sentText}>Sent to {sentToNumber}</Text>
            <Pressable
              accessibilityLabel="Edit phone number"
              accessibilityRole="button"
              hitSlop={10}
              onPress={onEditPhone}
              style={styles.editButton}
            >
              <EditIcon />
            </Pressable>
          </View>

          <View style={styles.otpRow}>
            {code.map((digit, index) => (
              <Pressable
                accessibilityRole="button"
                key={index}
                onPress={() => inputs.current[index]?.focus()}
                style={styles.otpBox}
              >
                {digit ? <Text style={styles.otpDigit}>{digit}</Text> : null}
                {!digit && focusedInputIndex === index ? (
                  <View style={styles.otpCaret} />
                ) : null}
                <TextInput
                  autoFocus={index === 0}
                  caretHidden
                  keyboardType="number-pad"
                  maxLength={1}
                  onBlur={() => setFocusedInputIndex(null)}
                  onChangeText={(value) => handleChange(value, index)}
                  onFocus={() => setFocusedInputIndex(index)}
                  onKeyPress={(event) => handleKeyPress(event, index)}
                  ref={(input) => {
                    inputs.current[index] = input;
                  }}
                  showSoftInputOnFocus
                  style={[styles.otpHiddenInput, webTextInputReset]}
                  value={digit}
                />
              </Pressable>
            ))}
          </View>

          {resendSeconds > 0 ? (
            <Text style={styles.resendText}>
              Resend OTP in {formattedResendTime} s
            </Text>
          ) : (
            <Pressable
              accessibilityRole="button"
              hitSlop={10}
              onPress={handleResendOtp}
            >
              <Text style={styles.resendAction}>Resend OTP</Text>
            </Pressable>
          )}

          <View style={styles.verifyButton}>
            <PrimaryButton
              disabled={!isComplete}
              label="Verify"
              onPress={handleVerify}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.screen,
    paddingTop: 24
  },
  editButton: {
    alignItems: "center",
    height: 24,
    justifyContent: "center",
    width: 16
  },
  otpBox: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    position: "relative",
    width: 48
  },
  otpCaret: {
    backgroundColor: colors.text,
    height: 24,
    width: 1
  },
  otpDigit: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 20,
    lineHeight: 28,
    textAlign: "center"
  },
  otpHiddenInput: {
    ...StyleSheet.absoluteFillObject,
    color: "transparent",
    fontSize: 1,
    opacity: 0,
    padding: 0
  },
  otpRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 12
  },
  resendText: {
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8
  },
  resendAction: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
    textDecorationLine: "underline"
  },
  screen: {
    flex: 1
  },
  sentRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    marginTop: 18
  },
  sentText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18
  },
  title: {
    color: colors.text,
    ...typography.h2,
    fontSize: 22,
    lineHeight: 28
  },
  verifyButton: {
    marginTop: 24
  }
});
