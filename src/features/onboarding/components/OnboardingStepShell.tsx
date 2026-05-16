import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  type TextStyle,
  View
} from "react-native";

import { colors, spacing, typography } from "../../../theme";
import { onboardingHeadingTop } from "../layout";
import { CircularNextButton } from "./CircularNextButton";

const nextButtonSideInset = Platform.OS === "ios" ? 50 : spacing.screen;

type OnboardingStepShellProps = {
  children: ReactNode;
  currentStep?: 1 | 2 | 3 | 4 | 5;
  nextButton?: {
    accessibilityLabel: string;
    disabled: boolean;
    onPress: () => void;
  };
  contentTop?: number;
  subtitle?: string;
  title: string;
  titleStyle?: TextStyle;
};

export function OnboardingStepShell({
  children,
  contentTop,
  currentStep,
  nextButton,
  subtitle,
  title,
  titleStyle
}: OnboardingStepShellProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.screen}
      >
        <View
          style={[
            styles.content,
            contentTop === undefined ? null : { paddingTop: contentTop }
          ]}
        >
          <View style={styles.headingGroup}>
            <Text style={[styles.title, titleStyle]}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>

          <View style={styles.body}>{children}</View>
        </View>

        {nextButton ? (
          <View style={styles.nextButton}>
            <CircularNextButton
              {...nextButton}
              currentStep={currentStep}
              totalSteps={5}
            />
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screen,
    paddingTop: onboardingHeadingTop
  },
  headingGroup: {
    gap: spacing.sm
  },
  nextButton: {
    alignItems: "flex-end",
    bottom: spacing.screen,
    position: "absolute",
    right: nextButtonSideInset
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1
  },
  subtitle: {
    color: colors.muted,
    ...typography.bodyLarge
  },
  title: {
    color: colors.text,
    ...typography.displayHeadline,
    fontSize: 22,
    lineHeight: 27.5
  }
});
