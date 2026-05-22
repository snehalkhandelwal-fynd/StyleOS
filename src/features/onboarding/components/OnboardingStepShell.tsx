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

import { PrimaryButton } from "../../../components/PrimaryButton";
import { colors, spacing, typography } from "../../../theme";
import { onboardingHeadingTop } from "../layout";
import { CircularNextButton } from "./CircularNextButton";

type OnboardingStepShellProps = {
  children: ReactNode;
  currentStep?: 1 | 2 | 3 | 4 | 5;
  presentation?: "screen" | "drawer";
  nextButton?: {
    accessibilityLabel: string;
    disabled: boolean;
    label?: string;
    onPress: () => void;
  };
  contentTop?: number;
  subtitle?: string;
  title: string;
  titleStyle?: TextStyle;
  totalSteps?: number;
};

export type OnboardingStepPresentation = NonNullable<
  OnboardingStepShellProps["presentation"]
>;

export function OnboardingStepShell({
  children,
  contentTop,
  currentStep,
  presentation = "screen",
  nextButton,
  subtitle,
  title,
  titleStyle,
  totalSteps = 4
}: OnboardingStepShellProps) {
  const isDrawer = presentation === "drawer";
  const screenContent = (
    <KeyboardAvoidingView
      behavior={
        isDrawer ? undefined : Platform.OS === "ios" ? "padding" : undefined
      }
      style={[styles.screen, isDrawer ? styles.drawerScreen : null]}
    >
      <View
        style={[
          styles.content,
          isDrawer ? styles.drawerContent : null,
          contentTop === undefined ? null : { paddingTop: contentTop }
        ]}
      >
        <View style={styles.headingGroup}>
          <Text style={[styles.title, titleStyle]}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>

        <View style={styles.body}>{children}</View>
      </View>

      {nextButton && isDrawer ? (
        <View style={styles.drawerCtaHost}>
          <PrimaryButton
            disabled={nextButton.disabled}
            label={nextButton.label ?? "Continue"}
            onPress={nextButton.onPress}
          />
        </View>
      ) : null}

      {nextButton && !isDrawer ? (
        <View style={styles.nextButton}>
          <CircularNextButton
            accessibilityLabel={nextButton.accessibilityLabel}
            disabled={nextButton.disabled}
            onPress={nextButton.onPress}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );

  if (isDrawer) {
    return screenContent;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {screenContent}
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
  drawerContent: {
    paddingTop: spacing.lg
  },
  drawerScreen: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden"
  },
  drawerCtaHost: {
    bottom: spacing.lg,
    left: spacing.screen,
    position: "absolute",
    right: spacing.screen
  },
  headingGroup: {
    gap: spacing.sm
  },
  nextButton: {
    alignItems: "center",
    bottom: spacing.screen,
    height: 64,
    justifyContent: "center",
    position: "absolute",
    right: spacing.screen,
    width: 64
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
