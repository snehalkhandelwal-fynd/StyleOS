import { useEffect, useRef, useState } from "react";
import {
  InteractionManager,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextStyle,
  View
} from "react-native";
import type { TextInput as TextInputType } from "react-native";

import { colors, fonts, radii } from "../../../theme";

type OtpInputProps = {
  length?: number;
  onChangeCode: (code: string) => void;
  value: string;
};

const defaultInputCount = 6;
const webTextInputReset =
  Platform.OS === "web"
    ? ({
        outlineStyle: "none",
        outlineWidth: 0
      } as unknown as TextStyle)
    : null;

export function OtpInput({
  length = defaultInputCount,
  onChangeCode,
  value
}: OtpInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInputType | null>(null);
  const digits = Array.from({ length }, (_, index) => value[index] ?? "");
  const activeIndex = Math.min(value.length, length - 1);

  const focusInput = () => {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  useEffect(() => {
    const focusTimers: ReturnType<typeof setTimeout>[] = [];
    const focusInteraction = InteractionManager.runAfterInteractions(() => {
      focusInput();
      focusTimers.push(setTimeout(focusInput, 250));
      focusTimers.push(setTimeout(focusInput, 700));
    });

    return () => {
      focusInteraction.cancel();
      focusTimers.forEach(clearTimeout);
    };
  }, []);

  const handleChange = (text: string) => {
    const numericText = text.replace(/\D/g, "").slice(0, length);
    onChangeCode(numericText);
  };

  return (
    <Pressable
      accessibilityLabel="Verification code"
      accessibilityRole="button"
      onPress={focusInput}
      style={styles.wrap}
    >
      <TextInput
        autoComplete="sms-otp"
        autoFocus
        caretHidden
        cursorColor={colors.text}
        importantForAutofill="yes"
        inputMode="numeric"
        keyboardType="number-pad"
        maxLength={length}
        onBlur={() => setIsFocused(false)}
        onChangeText={handleChange}
        onFocus={() => setIsFocused(true)}
        ref={inputRef}
        selectionColor={colors.text}
        showSoftInputOnFocus
        style={[styles.hiddenInput, webTextInputReset]}
        textContentType="oneTimeCode"
        value={value}
      />

      <View pointerEvents="none" style={styles.row}>
        {digits.map((digit, index) => {
          const shouldShowCaret =
            isFocused && !digit && index === activeIndex && value.length < length;

          return (
            <View key={index} style={styles.box}>
              {digit ? <Text style={styles.digit}>{digit}</Text> : null}
              {shouldShowCaret ? <View style={styles.caret} /> : null}
            </View>
          );
        })}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: 1,
    height: 56,
    justifyContent: "center",
    position: "relative",
    width: 48
  },
  caret: {
    backgroundColor: colors.text,
    height: 24,
    width: 1
  },
  digit: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 22,
    lineHeight: 28,
    textAlign: "center"
  },
  hiddenInput: {
    height: 1,
    opacity: 0,
    position: "absolute",
    width: 1
  },
  row: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-start"
  },
  wrap: {
    alignSelf: "flex-start",
    position: "relative"
  }
});
