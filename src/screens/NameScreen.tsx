import { useEffect, useRef, useState } from "react";
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
import type { TextInput as TextInputType } from "react-native";

import { NextCircleButton } from "../components/NextCircleButton";
import { colors, fonts, spacing, typography } from "../theme";

const webTextInputReset =
  Platform.OS === "web"
    ? ({
        outlineStyle: "none",
        outlineWidth: 0
      } as unknown as TextStyle)
    : null;

type NameScreenProps = {
  name: string;
  onBack: () => void;
  onChangeName: (name: string) => void;
  onContinue: () => void;
};

export function NameScreen({
  name,
  onChangeName,
  onContinue
}: NameScreenProps) {
  const canContinue = name.trim().length > 0;
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const inputRef = useRef<TextInputType | null>(null);

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

  useEffect(() => {
    const focusTimer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);

    return () => clearTimeout(focusTimer);
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.headerSpacer} />

      <View style={styles.content}>
        <Text style={styles.title}>What’s your name?</Text>

        <Pressable
          accessibilityLabel="Enter your name"
          onPress={() => inputRef.current?.focus()}
          style={styles.nameRow}
        >
          <Text numberOfLines={1} style={styles.prefix}>
            Hi, I am
          </Text>
          <TextInput
            autoCapitalize="words"
            autoCorrect={false}
            autoFocus
            onChangeText={onChangeName}
            placeholder="Name"
            placeholderTextColor={colors.soft}
            ref={inputRef}
            showSoftInputOnFocus
            style={[styles.nameInput, webTextInputReset]}
            value={name}
          />
        </Pressable>
      </View>

      <View
        style={[
          styles.footer,
          isKeyboardVisible ? styles.footerWithKeyboard : null
        ]}
      >
        <NextCircleButton
          currentStep={1}
          disabled={!canContinue}
          onPress={onContinue}
          totalSteps={5}
        />
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
  footer: {
    alignItems: "flex-end",
    bottom: 56,
    position: "absolute",
    right: spacing.screen
  },
  footerWithKeyboard: {
    bottom: 16
  },
  headerSpacer: {
    height: 48
  },
  nameInput: {
    borderBottomColor: colors.muted,
    borderBottomWidth: 1,
    color: colors.text,
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 22,
    height: 40,
    lineHeight: 28,
    minWidth: 0,
    paddingHorizontal: 0,
    paddingBottom: spacing.xs,
    paddingTop: 0
  },
  nameRow: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: spacing.xs,
    marginTop: spacing.xl
  },
  prefix: {
    color: colors.soft,
    fontFamily: fonts.body,
    flexShrink: 0,
    fontSize: 22,
    lineHeight: 28,
    paddingBottom: spacing.xs
  },
  screen: {
    flex: 1
  },
  title: {
    color: colors.text,
    marginTop: 28,
    ...typography.h2,
    fontSize: 28,
    lineHeight: 33.6
  }
});
