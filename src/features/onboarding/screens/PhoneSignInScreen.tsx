import {
  InteractionManager,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  type TextStyle,
  View
} from "react-native";
import { useEffect, useRef } from "react";
import type { TextInput as TextInputType } from "react-native";

import { Divider } from "../../../components/Divider";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { SocialButton } from "../../../components/SocialButton";
import { requiredPhoneNumberDigits } from "../../../constants/auth";
import type { CountryOption } from "../../../data/countries";
import { socialOptions } from "../../../data/onboarding";
import { colors, radii, spacing, typography } from "../../../theme";
import { CountryCodePicker } from "../components/CountryCodePicker";
import { onboardingHeadingTop } from "../layout";

type PhoneSignInScreenProps = {
  onChangeCountry: (country: CountryOption) => void;
  onChangePhone: (value: string) => void;
  onSkip: () => void;
  onSubmit: () => void;
  phoneNumber: string;
  selectedCountry: CountryOption;
};

const webTextInputReset =
  Platform.OS === "web"
    ? ({
        outlineStyle: "none",
        outlineWidth: 0
      } as unknown as TextStyle)
    : null;

export function PhoneSignInScreen({
  onChangeCountry,
  onChangePhone,
  onSkip,
  onSubmit,
  phoneNumber,
  selectedCountry
}: PhoneSignInScreenProps) {
  const isComplete = phoneNumber.trim().length === requiredPhoneNumberDigits;
  const phoneInputRef = useRef<TextInputType | null>(null);

  const focusPhoneInput = () => {
    requestAnimationFrame(() => {
      phoneInputRef.current?.focus();
    });
  };

  useEffect(() => {
    const focusTimers: ReturnType<typeof setTimeout>[] = [];
    const focusInteraction = InteractionManager.runAfterInteractions(() => {
      focusPhoneInput();
      focusTimers.push(setTimeout(focusPhoneInput, 250));
      focusTimers.push(setTimeout(focusPhoneInput, 700));
    });

    return () => {
      focusInteraction.cancel();
      focusTimers.forEach(clearTimeout);
    };
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <Pressable
          accessibilityLabel="Skip sign in"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onSkip}
          style={({ pressed }) => [
            styles.skip,
            pressed ? styles.skipPressed : null
          ]}
        >
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>

        <Text style={styles.title}>What's your phone number?</Text>

        <View style={styles.form}>
          <View style={styles.phoneRow}>
            <CountryCodePicker
              onChangeCountry={onChangeCountry}
              selectedCountry={selectedCountry}
            />
            <Pressable
              accessibilityLabel="Enter phone number"
              accessibilityRole="button"
              onPress={focusPhoneInput}
              style={styles.inputWrap}
            >
              <TextInput
                autoFocus
                cursorColor={colors.text}
                inputMode="tel"
                keyboardType="phone-pad"
                maxLength={requiredPhoneNumberDigits}
                onChangeText={(value) => onChangePhone(value.replace(/\D/g, ""))}
                placeholder="Phone number"
                placeholderTextColor={colors.soft}
                ref={phoneInputRef}
                selectionColor={colors.text}
                showSoftInputOnFocus
                style={[styles.input, webTextInputReset]}
                textContentType="telephoneNumber"
                value={phoneNumber}
              />
            </Pressable>
          </View>

          <PrimaryButton
            disabled={!isComplete}
            label="Sign in"
            onPress={onSubmit}
          />

          <Divider />

          <View style={styles.socialRow}>
            {socialOptions.map((option) => (
              <SocialButton
                accessibilityLabel={option.accessibilityLabel}
                icon={option.icon}
                key={option.id}
                onPress={() => undefined}
              />
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
    paddingHorizontal: spacing.screen,
    paddingTop: onboardingHeadingTop
  },
  form: {
    gap: spacing.lg
  },
  input: {
    color: colors.text,
    ...typography.bodyLarge,
    fontSize: 16,
    height: 24,
    includeFontPadding: false,
    lineHeight: 20,
    paddingBottom: 0,
    paddingTop: 0,
    textAlignVertical: "center",
    width: "100%"
  },
  inputWrap: {
    backgroundColor: "transparent",
    borderBottomRightRadius: radii.card,
    borderLeftColor: colors.border,
    borderLeftWidth: 1,
    borderTopRightRadius: radii.card,
    flex: 1,
    justifyContent: "center",
    minWidth: 0,
    paddingHorizontal: spacing.lg
  },
  phoneRow: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: 1,
    flexDirection: "row",
    height: 56,
    overflow: "visible",
    zIndex: 10
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1
  },
  skip: {
    paddingVertical: spacing.xs,
    position: "absolute",
    right: spacing.screen,
    top: spacing.xs,
    zIndex: 20
  },
  skipPressed: {
    opacity: 0.6
  },
  skipText: {
    color: colors.muted,
    ...typography.bodyLarge
  },
  title: {
    color: colors.text,
    ...typography.displayHeadline,
    fontSize: 22,
    lineHeight: 27.5
  },
  socialRow: {
    flexDirection: "row",
    gap: spacing.md
  }
});
