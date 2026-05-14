import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextStyle,
  View
} from "react-native";
import { useEffect, useRef } from "react";
import type { TextInput as TextInputType } from "react-native";

import { colors, fonts, spacing, typography } from "../../../theme";
import { OnboardingStepShell } from "../components/OnboardingStepShell";

type SetupNameScreenProps = {
  name: string;
  onChangeName: (name: string) => void;
  onContinue: () => void;
};

const webTextInputReset =
  Platform.OS === "web"
    ? ({
        outlineStyle: "none",
        outlineWidth: 0
      } as unknown as TextStyle)
    : null;

export function SetupNameScreen({
  name,
  onChangeName,
  onContinue
}: SetupNameScreenProps) {
  const canContinue = name.trim().length > 0;
  const inputRef = useRef<TextInputType | null>(null);

  useEffect(() => {
    const focusTimer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);

    return () => clearTimeout(focusTimer);
  }, []);

  return (
    <OnboardingStepShell
      currentStep={1}
      nextButton={{
        accessibilityLabel: "Continue to height setup",
        disabled: !canContinue,
        onPress: onContinue
      }}
      title="What’s your name?"
      titleStyle={styles.title}
    >
      <Pressable
        accessibilityLabel="Enter your name"
        onPress={() => inputRef.current?.focus()}
        style={styles.row}
      >
        <Text style={styles.prefix}>Hi, I am</Text>
        <TextInput
          autoCapitalize="words"
          autoCorrect={false}
          autoFocus
          cursorColor={colors.text}
          onChangeText={onChangeName}
          placeholder="Name"
          placeholderTextColor={colors.soft}
          ref={inputRef}
          selectionColor={colors.text}
          showSoftInputOnFocus
          style={[styles.input, webTextInputReset]}
          value={name}
        />
      </Pressable>
    </OnboardingStepShell>
  );
}

const styles = StyleSheet.create({
  input: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    color: colors.text,
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 22,
    lineHeight: 28,
    minWidth: 0,
    paddingBottom: spacing.xs
  },
  prefix: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 22,
    lineHeight: 28,
    paddingBottom: spacing.xs
  },
  row: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 6,
    paddingTop: spacing.xl
  },
  title: {
    ...typography.displayHeadline,
    fontSize: 22,
    lineHeight: 27.5
  }
});
