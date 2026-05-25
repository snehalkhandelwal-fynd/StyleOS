import { createContext, useContext, type ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  type TextStyle,
  View
} from "react-native";

import { OnboardingProgress } from "../../../components/OnboardingProgress";
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
  drawerSecondaryButton?: {
    label: string;
    onPress: () => void;
    variant?: "filled" | "outline";
  };
  drawerCtaTopSpacing?: number;
  contentTop?: number;
  subtitle?: string;
  title: string;
  titleStyle?: TextStyle;
  totalSteps?: number;
};

export type OnboardingStepPresentation = NonNullable<
  OnboardingStepShellProps["presentation"]
>;

type DrawerHeaderContextValue = {
  fillDrawer?: boolean;
  onBack?: () => void;
  showBackButton?: boolean;
};

const DrawerHeaderContext = createContext<DrawerHeaderContextValue>({});

export function OnboardingDrawerHeaderProvider({
  children,
  fillDrawer,
  onBack,
  showBackButton
}: DrawerHeaderContextValue & {
  children: ReactNode;
}) {
  return (
    <DrawerHeaderContext.Provider
      value={{ fillDrawer, onBack, showBackButton }}
    >
      {children}
    </DrawerHeaderContext.Provider>
  );
}

export function OnboardingStepShell({
  children,
  contentTop,
  drawerCtaTopSpacing,
  currentStep,
  drawerSecondaryButton,
  presentation = "screen",
  nextButton,
  subtitle,
  title,
  titleStyle,
  totalSteps = 4
}: OnboardingStepShellProps) {
  const isDrawer = presentation === "drawer";
  const drawerHeader = useContext(DrawerHeaderContext);
  const shouldFillDrawer = isDrawer && drawerHeader.fillDrawer;
  const shouldShowDrawerBackCta =
    isDrawer && drawerHeader.showBackButton && drawerHeader.onBack;
  const shouldShowDrawerProgress =
    isDrawer && currentStep !== undefined && totalSteps > 1;
  const drawerFallbackSecondaryButton = shouldShowDrawerBackCta
    ? {
        label: "Back",
        onPress: drawerHeader.onBack ?? (() => undefined),
        variant: "outline" as const
      }
    : undefined;
  const activeDrawerSecondaryButton =
    drawerSecondaryButton ?? drawerFallbackSecondaryButton;
  const screenContent = (
    <KeyboardAvoidingView
      behavior={
        isDrawer ? undefined : Platform.OS === "ios" ? "padding" : undefined
      }
      style={[
        styles.screen,
        isDrawer ? styles.drawerScreen : null,
        shouldFillDrawer ? styles.drawerScreenFilled : null
      ]}
    >
      <View
        style={[
          styles.content,
          isDrawer ? styles.drawerContent : null,
          shouldFillDrawer ? styles.drawerContentFilled : null,
          contentTop === undefined ? null : { paddingTop: contentTop }
        ]}
      >
        {isDrawer ? (
          <View
            style={[
              styles.drawerHandle,
              shouldShowDrawerProgress ? null : styles.drawerHandleStandalone
            ]}
          />
        ) : null}

        {shouldShowDrawerProgress ? (
          <View style={styles.drawerProgress}>
            <OnboardingProgress
              currentStep={currentStep ?? 1}
              totalSteps={totalSteps}
            />
          </View>
        ) : null}

        <View
          style={[
            styles.headingGroup,
            isDrawer ? styles.drawerHeadingGroup : null
          ]}
        >
          <View style={styles.headingCopy}>
            <Text style={[styles.title, titleStyle]}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
        </View>

        <View style={[styles.body, isDrawer ? styles.drawerBody : null]}>
          {children}
        </View>
      </View>

      {nextButton && isDrawer ? (
        <View
          style={[
            styles.drawerCtaHost,
            drawerCtaTopSpacing === undefined
              ? null
              : { paddingTop: drawerCtaTopSpacing }
          ]}
        >
          <PrimaryButton
            disabled={nextButton.disabled}
            label={nextButton.label ?? "Continue"}
            onPress={nextButton.onPress}
          />
          {activeDrawerSecondaryButton ? (
            <PrimaryButton
              label={activeDrawerSecondaryButton.label}
              onPress={activeDrawerSecondaryButton.onPress}
              style={styles.drawerSecondaryCta}
              variant={activeDrawerSecondaryButton.variant ?? "outline"}
            />
          ) : null}
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
    flex: 1,
    minHeight: 0
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screen,
    paddingTop: onboardingHeadingTop
  },
  drawerContent: {
    flex: 0,
    paddingTop: spacing.md
  },
  drawerContentFilled: {
    flex: 1
  },
  drawerScreen: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flex: 0,
    overflow: "hidden"
  },
  drawerScreenFilled: {
    flex: 1
  },
  drawerCtaHost: {
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xl
  },
  drawerBody: {
    flex: 0,
    flexShrink: 0
  },
  drawerSecondaryCta: {
    marginTop: spacing.md
  },
  drawerProgress: {
    marginBottom: spacing.xl,
    marginTop: spacing.lg
  },
  drawerHandle: {
    alignSelf: "center",
    backgroundColor: colors.border,
    borderRadius: 999,
    height: 4,
    width: 56
  },
  drawerHandleStandalone: {
    marginBottom: spacing.xl
  },
  headingGroup: {
    flexShrink: 0,
    gap: spacing.sm,
    zIndex: 2
  },
  drawerHeadingGroup: {
    minHeight: 28
  },
  headingCopy: {
    minWidth: 0,
    width: "100%"
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
  pressed: {
    opacity: 0.72
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
