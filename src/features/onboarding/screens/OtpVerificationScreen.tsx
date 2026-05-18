import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";

import { EditIcon } from "../../../components/EditIcon";
import { colors, fonts, radii, spacing, typography } from "../../../theme";
import { OtpInput } from "../components/OtpInput";
import { onboardingHeadingTop } from "../layout";

type OtpVerificationScreenProps = {
  countryCode: string;
  onEditPhone: () => void;
  onVerified: () => void;
  phoneNumber: string;
};

const resendCountdownStart = 45;
const otpLength = 6;

function formatSentToNumber(countryCode: string, phoneNumber: string) {
  const groupedPhone = phoneNumber
    .replace(/\D/g, "")
    .replace(/(\d{5})(?=\d)/g, "$1 ")
    .trim();

  return `${countryCode} ${groupedPhone}`.trim();
}

export function OtpVerificationScreen({
  countryCode,
  onEditPhone,
  onVerified,
  phoneNumber
}: OtpVerificationScreenProps) {
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(resendCountdownStart);
  const isComplete = code.length === otpLength;
  const shakeOffset = useRef(new Animated.Value(0)).current;
  const screenScale = useRef(new Animated.Value(1)).current;
  const sentToNumber = formatSentToNumber(countryCode, phoneNumber);

  useEffect(() => {
    setCode("");
    setErrorMessage("");
    setIsVerifying(false);
    setSecondsRemaining(resendCountdownStart);
  }, [countryCode, phoneNumber]);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining]);

  useEffect(() => {
    if (!isComplete || isVerifying) {
      return;
    }

    const submitTimer = setTimeout(() => {
      handleVerify();
    }, 300);

    return () => clearTimeout(submitTimer);
  }, [isComplete, isVerifying]);

  const formatCountdown = () =>
    `0:${String(secondsRemaining).padStart(2, "0")}`;

  const shakeBoxes = () => {
    Animated.sequence([
      Animated.timing(shakeOffset, {
        duration: 45,
        toValue: -8,
        useNativeDriver: true
      }),
      Animated.timing(shakeOffset, {
        duration: 45,
        toValue: 8,
        useNativeDriver: true
      }),
      Animated.timing(shakeOffset, {
        duration: 45,
        toValue: -6,
        useNativeDriver: true
      }),
      Animated.timing(shakeOffset, {
        duration: 45,
        toValue: 6,
        useNativeDriver: true
      }),
      Animated.timing(shakeOffset, {
        duration: 45,
        toValue: 0,
        useNativeDriver: true
      })
    ]).start();
  };

  const animateSuccess = () => {
    Animated.sequence([
      Animated.timing(screenScale, {
        duration: 100,
        toValue: 0.985,
        useNativeDriver: true
      }),
      Animated.timing(screenScale, {
        duration: 100,
        toValue: 1,
        useNativeDriver: true
      })
    ]).start(({ finished }) => {
      if (finished) {
        onVerified();
      }
    });
  };

  const handleVerify = () => {
    if (!isComplete || isVerifying) {
      return;
    }

    setErrorMessage("");
    setIsVerifying(true);

    setTimeout(() => {
      if (code === "000000") {
        setIsVerifying(false);
        setCode("");
        setErrorMessage("That code didn't work. Try again.");
        shakeBoxes();
        return;
      }

      animateSuccess();
    }, 650);
  };

  const handleResend = () => {
    setCode("");
    setErrorMessage("");
    setIsVerifying(false);
    setSecondsRemaining(resendCountdownStart);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ scale: screenScale }]
          }
        ]}
      >
        <Text numberOfLines={1} adjustsFontSizeToFit style={styles.title}>
          Enter your verification code
        </Text>

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

        <View style={styles.otpArea}>
          <Animated.View
            style={{
              transform: [{ translateX: shakeOffset }]
            }}
          >
            <OtpInput
              length={otpLength}
              onChangeCode={(nextCode) => {
                setErrorMessage("");
                setCode(nextCode.replace(/\D/g, "").slice(0, otpLength));
              }}
              value={code}
            />
          </Animated.View>

          {errorMessage ? (
            <Text accessibilityLiveRegion="polite" style={styles.errorText}>
              {errorMessage}
            </Text>
          ) : null}

          {secondsRemaining > 0 ? (
            <Text style={styles.timerText}>
              Resend code in {formatCountdown()}
            </Text>
          ) : (
            <Pressable
              accessibilityRole="button"
              hitSlop={10}
              onPress={handleResend}
            >
              <Text style={styles.resendText}>Resend code</Text>
            </Pressable>
          )}

          <View style={styles.verifyWrap}>
            <Pressable
              accessibilityRole="button"
              disabled={!isComplete || isVerifying}
              onPress={handleVerify}
              style={({ pressed }) => [
                styles.verifyButton,
                !isComplete ? styles.verifyButtonDisabled : null,
                pressed ? styles.verifyButtonPressed : null
              ]}
            >
              {isVerifying ? (
                <ActivityIndicator color={colors.inverseText} size="small" />
              ) : (
                <Text style={styles.verifyText}>Verify</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.screen,
    paddingTop: onboardingHeadingTop
  },
  editButton: {
    alignItems: "center",
    height: 24,
    justifyContent: "center",
    width: 24
  },
  otpArea: {
    alignItems: "flex-start",
    paddingTop: 32
  },
  errorText: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
    marginTop: spacing.sm
  },
  resendText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 24,
    textDecorationLine: "underline"
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1
  },
  sentRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    marginTop: spacing.sm
  },
  sentText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21
  },
  timerText: {
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 24
  },
  title: {
    color: colors.text,
    ...typography.displayHeadline,
    fontSize: 22,
    lineHeight: 27.5
  },
  verifyButton: {
    alignItems: "center",
    backgroundColor: colors.inverse,
    borderRadius: radii.button,
    height: 48,
    justifyContent: "center",
    width: "100%"
  },
  verifyButtonDisabled: {
    opacity: 0.42
  },
  verifyButtonPressed: {
    opacity: 0.72
  },
  verifyText: {
    color: colors.inverseText,
    fontFamily: fonts.cta,
    fontSize: 14,
    lineHeight: 14
  },
  verifyWrap: {
    alignSelf: "stretch",
    marginTop: 32
  }
});
