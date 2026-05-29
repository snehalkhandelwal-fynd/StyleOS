import { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextInput as TextInputType,
  type TextStyle,
  View
} from "react-native";

import { PrimaryButton } from "../../../components/PrimaryButton";
import { requiredPhoneNumberDigits } from "../../../constants/auth";
import { colors, fonts, radii, spacing, typography } from "../../../theme";
import { appTopSafeInset } from "../utils/safeArea";
import { OtpInput } from "../../onboarding/components/OtpInput";
import type {
  EditableProfile,
  FashionInterest
} from "../../onboarding/viewModels/useOnboardingViewModel";

type AccountEditProfileScreenProps = {
  initialProfile: EditableProfile;
  onBack: () => void;
  onSave: (profile: EditableProfile) => void;
};

type ProfileTextFieldProps = {
  editable?: boolean;
  inputMode?: "email" | "numeric" | "text" | "tel";
  keyboardType?: "default" | "email-address" | "number-pad" | "phone-pad";
  label: string;
  maxLength?: number;
  onChangeText: (value: string) => void;
  placeholder?: string;
  rightAccessory?: ReactNode;
  value: string;
};

type DatePickerField = "anniversary" | "dateOfBirth";
type DateParts = {
  day: number;
  month: number;
  year: number;
};

const otpLength = 6;
const resendCountdownStart = 45;
const wearPreferenceOptions: Array<{
  label: string;
  value: FashionInterest;
}> = [
  { label: "Womenswear", value: "womens" },
  { label: "Menswear", value: "mens" }
];
const monthLabels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

function getDefaultDateParts(): DateParts {
  const today = new Date();

  return {
    day: today.getDate(),
    month: today.getMonth() + 1,
    year: today.getFullYear()
  };
}

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}

function padDatePart(value: number) {
  return String(value).padStart(2, "0");
}

function formatDateParts(parts: DateParts) {
  return `${padDatePart(parts.day)}/${padDatePart(parts.month)}/${parts.year}`;
}

function parseDateParts(value: string): DateParts {
  const [dayText, monthText, yearText] = value.split("/");
  const day = Number(dayText);
  const month = Number(monthText);
  const year = Number(yearText);
  const currentYear = new Date().getFullYear();

  if (
    Number.isFinite(day) &&
    Number.isFinite(month) &&
    Number.isFinite(year) &&
    month >= 1 &&
    month <= 12 &&
    year >= currentYear - 100 &&
    year <= currentYear + 10 &&
    day >= 1 &&
    day <= getDaysInMonth(month, year)
  ) {
    return { day, month, year };
  }

  return getDefaultDateParts();
}

function getYearOptions(field: DatePickerField) {
  const currentYear = new Date().getFullYear();
  const startYear = field === "dateOfBirth" ? currentYear - 100 : currentYear - 80;
  const endYear = field === "dateOfBirth" ? currentYear : currentYear + 10;

  return Array.from(
    { length: endYear - startYear + 1 },
    (_, index) => endYear - index
  );
}

const webTextInputReset =
  Platform.OS === "web"
    ? ({
        outlineStyle: "none",
        outlineWidth: 0
      } as unknown as TextStyle)
    : null;

function formatPhone(countryCode?: string, phoneNumber?: string) {
  const groupedPhone = (phoneNumber ?? "")
    .replace(/\D/g, "")
    .replace(/(\d{5})(?=\d)/g, "$1 ")
    .trim();

  return `${countryCode ?? ""} ${groupedPhone}`.trim();
}

function ProfileTextField({
  editable = true,
  inputMode = "text",
  keyboardType = "default",
  label,
  maxLength,
  onChangeText,
  placeholder,
  rightAccessory,
  value
}: ProfileTextFieldProps) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.inputShell, !editable ? styles.inputShellMuted : null]}>
        <TextInput
          autoCapitalize={keyboardType === "email-address" ? "none" : "words"}
          autoCorrect={false}
          cursorColor={colors.text}
          editable={editable}
          inputMode={inputMode}
          keyboardType={keyboardType}
          maxLength={maxLength}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.soft}
          selectionColor={colors.text}
          style={[styles.input, !editable ? styles.inputMuted : null, webTextInputReset]}
          value={value}
        />
        {rightAccessory ? (
          <View style={styles.fieldAccessory}>{rightAccessory}</View>
        ) : null}
      </View>
    </View>
  );
}

function DateSelectField({
  label,
  onOpen,
  placeholder,
  value
}: {
  label: string;
  onOpen: () => void;
  placeholder: string;
  value: string;
}) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable
        accessibilityLabel={`Open ${label} calendar`}
        accessibilityRole="button"
        onPress={onOpen}
        style={({ pressed }) => [
          styles.inputShell,
          pressed ? styles.pressed : null
        ]}
      >
        <Text
          numberOfLines={1}
          style={[styles.dateSelectText, !value ? styles.datePlaceholder : null]}
        >
          {value || placeholder}
        </Text>
        <View style={styles.fieldAccessory}>
          <Feather color={colors.soft} name="calendar" size={18} />
        </View>
      </Pressable>
    </View>
  );
}

function BackButton({
  icon = "chevron-left",
  label,
  onPress
}: {
  icon?: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.backButton,
        pressed ? styles.pressed : null
      ]}
    >
      <Feather color={colors.text} name={icon} size={24} />
    </Pressable>
  );
}

function VerifyExistingAccount({
  destination,
  onBack,
  onVerified
}: {
  destination: string;
  onBack: () => void;
  onVerified: () => void;
}) {
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [secondsRemaining, setSecondsRemaining] = useState(resendCountdownStart);
  const shakeOffset = useRef(new Animated.Value(0)).current;
  const isComplete = code.length === otpLength;

  useEffect(() => {
    if (secondsRemaining <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining]);

  useEffect(() => {
    if (!isComplete) {
      return;
    }

    const submitTimer = setTimeout(() => {
      if (code === "000000") {
        setCode("");
        setErrorMessage("That code did not work. Try again.");
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
            toValue: 0,
            useNativeDriver: true
          })
        ]).start();
        return;
      }

      onVerified();
    }, 320);

    return () => clearTimeout(submitTimer);
  }, [code, isComplete, onVerified, shakeOffset]);

  const handleResend = () => {
    setCode("");
    setErrorMessage("");
    setSecondsRemaining(resendCountdownStart);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.verifyHeader}>
        <BackButton icon="chevron-down" label="Back to profile edit" onPress={onBack} />
        <Text style={styles.verifyTitle}>Verify existing account</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.verifyContent}>
        <Text style={styles.verifyIntro}>
          For your security, verify your existing account information before
          changing your mobile number.
        </Text>
        <Text style={styles.otpDestination}>OTP sent to</Text>
        <Text numberOfLines={2} style={styles.otpDestinationValue}>
          {destination}
        </Text>

        <Animated.View
          style={[
            styles.otpWrap,
            {
              transform: [{ translateX: shakeOffset }]
            }
          ]}
        >
          <View style={styles.otpInputCenter}>
            <OtpInput
              length={otpLength}
              onChangeCode={(nextCode) => {
                setErrorMessage("");
                setCode(nextCode);
              }}
              value={code}
            />
          </View>
        </Animated.View>

        {errorMessage ? (
          <Text accessibilityLiveRegion="polite" style={styles.errorText}>
            {errorMessage}
          </Text>
        ) : null}

        <Text style={styles.timerText}>
          0:{String(secondsRemaining).padStart(2, "0")}
        </Text>
        {secondsRemaining > 0 ? (
          <Text style={styles.resendMuted}>
            Did not receive the code? Resend now
          </Text>
        ) : (
          <Pressable accessibilityRole="button" hitSlop={10} onPress={handleResend}>
            <Text style={styles.resendActive}>Resend code</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

function DatePickerSheet({
  field,
  onChangeParts,
  onClose,
  onConfirm,
  parts
}: {
  field: DatePickerField;
  onChangeParts: (parts: DateParts) => void;
  onClose: () => void;
  onConfirm: () => void;
  parts: DateParts;
}) {
  const title = field === "dateOfBirth" ? "Date of birth" : "Anniversary";
  const dayOptions = Array.from(
    { length: getDaysInMonth(parts.month, parts.year) },
    (_, index) => index + 1
  );
  const yearOptions = getYearOptions(field);

  const updateParts = (nextParts: DateParts) => {
    const clampedDay = Math.min(
      nextParts.day,
      getDaysInMonth(nextParts.month, nextParts.year)
    );

    onChangeParts({
      ...nextParts,
      day: clampedDay
    });
  };

  return (
    <View style={styles.datePickerOverlay}>
      <Pressable
        accessibilityLabel="Close calendar"
        onPress={onClose}
        style={styles.datePickerScrim}
      />

      <View style={styles.datePickerSheet}>
        <View style={styles.datePickerHandle} />
        <View style={styles.datePickerHeader}>
          <Text style={styles.datePickerTitle}>{title}</Text>
          <Pressable
            accessibilityLabel="Close calendar"
            accessibilityRole="button"
            hitSlop={10}
            onPress={onClose}
            style={({ pressed }) => [
              styles.datePickerClose,
              pressed ? styles.pressed : null
            ]}
          >
            <Feather color={colors.text} name="x" size={19} />
          </Pressable>
        </View>

        <View style={styles.datePickerColumns}>
          <ScrollView
            contentContainerStyle={styles.datePickerColumnContent}
            showsVerticalScrollIndicator={false}
            style={styles.datePickerColumn}
          >
            {dayOptions.map((day) => {
              const isSelected = parts.day === day;

              return (
                <Pressable
                  accessibilityLabel={`Select day ${day}`}
                  accessibilityRole="button"
                  key={day}
                  onPress={() => updateParts({ ...parts, day })}
                  style={({ pressed }) => [
                    styles.datePickerOption,
                    isSelected ? styles.datePickerOptionSelected : null,
                    pressed ? styles.pressed : null
                  ]}
                >
                  <Text
                    style={[
                      styles.datePickerOptionText,
                      isSelected ? styles.datePickerOptionTextSelected : null
                    ]}
                  >
                    {day}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <ScrollView
            contentContainerStyle={styles.datePickerColumnContent}
            showsVerticalScrollIndicator={false}
            style={[styles.datePickerColumn, styles.datePickerMonthColumn]}
          >
            {monthLabels.map((month, index) => {
              const monthValue = index + 1;
              const isSelected = parts.month === monthValue;

              return (
                <Pressable
                  accessibilityLabel={`Select ${month}`}
                  accessibilityRole="button"
                  key={month}
                  onPress={() => updateParts({ ...parts, month: monthValue })}
                  style={({ pressed }) => [
                    styles.datePickerOption,
                    isSelected ? styles.datePickerOptionSelected : null,
                    pressed ? styles.pressed : null
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.datePickerOptionText,
                      isSelected ? styles.datePickerOptionTextSelected : null
                    ]}
                  >
                    {month}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <ScrollView
            contentContainerStyle={styles.datePickerColumnContent}
            showsVerticalScrollIndicator={false}
            style={styles.datePickerColumn}
          >
            {yearOptions.map((year) => {
              const isSelected = parts.year === year;

              return (
                <Pressable
                  accessibilityLabel={`Select year ${year}`}
                  accessibilityRole="button"
                  key={year}
                  onPress={() => updateParts({ ...parts, year })}
                  style={({ pressed }) => [
                    styles.datePickerOption,
                    isSelected ? styles.datePickerOptionSelected : null,
                    pressed ? styles.pressed : null
                  ]}
                >
                  <Text
                    style={[
                      styles.datePickerOptionText,
                      isSelected ? styles.datePickerOptionTextSelected : null
                    ]}
                  >
                    {year}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <PrimaryButton label="Confirm" onPress={onConfirm} />
      </View>
    </View>
  );
}

export function AccountEditProfileScreen({
  initialProfile,
  onBack,
  onSave
}: AccountEditProfileScreenProps) {
  const currentPhone = initialProfile.phone;
  const currentPhoneNumber = currentPhone?.phoneNumber ?? "";
  const [name, setName] = useState(initialProfile.name);
  const [email, setEmail] = useState(initialProfile.email ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(initialProfile.dateOfBirth ?? "");
  const [anniversary, setAnniversary] = useState(initialProfile.anniversary ?? "");
  const [wearPreference, setWearPreference] = useState<
    FashionInterest | undefined
  >(initialProfile.fashionInterest);
  const [phoneNumber, setPhoneNumber] = useState(currentPhoneNumber);
  const [isPhoneVerified, setIsPhoneVerified] = useState(!currentPhoneNumber);
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [activeDatePicker, setActiveDatePicker] =
    useState<DatePickerField | null>(null);
  const [draftDateParts, setDraftDateParts] = useState<DateParts>(
    getDefaultDateParts
  );
  const phoneInputRef = useRef<TextInputType | null>(null);

  const cleanPhoneNumber = phoneNumber.replace(/\D/g, "");
  const canSave =
    name.trim().length > 0 &&
    (!isPhoneVerified ||
      cleanPhoneNumber.length === 0 ||
      cleanPhoneNumber.length === requiredPhoneNumberDigits);
  const otpDestination =
    (initialProfile.email ?? "").trim() ||
    formatPhone(currentPhone?.countryCode, currentPhoneNumber);
  const mobileActionLabel = currentPhoneNumber ? "Change" : "Add";

  const handleSave = () => {
    if (!canSave) {
      return;
    }

    onSave({
      anniversary,
      avatarUri: initialProfile.avatarUri,
      dateOfBirth,
      email,
      fashionInterest: wearPreference,
      name,
      phone: cleanPhoneNumber
        ? {
            countryCode: currentPhone?.countryCode ?? "+91",
            phoneNumber: cleanPhoneNumber
          }
        : currentPhone
    });
  };

  const handleStartPhoneChange = () => {
    if (!currentPhoneNumber) {
      setIsPhoneVerified(true);
      requestAnimationFrame(() => phoneInputRef.current?.focus());
      return;
    }

    setIsVerifyingPhone(true);
  };

  const handleOpenDatePicker = (field: DatePickerField) => {
    const dateValue = field === "dateOfBirth" ? dateOfBirth : anniversary;

    setDraftDateParts(parseDateParts(dateValue));
    setActiveDatePicker(field);
  };

  const handleConfirmDate = () => {
    const nextValue = formatDateParts(draftDateParts);

    if (activeDatePicker === "dateOfBirth") {
      setDateOfBirth(nextValue);
    }

    if (activeDatePicker === "anniversary") {
      setAnniversary(nextValue);
    }

    setActiveDatePicker(null);
  };

  if (isVerifyingPhone) {
    return (
      <VerifyExistingAccount
        destination={otpDestination}
        onBack={() => setIsVerifyingPhone(false)}
        onVerified={() => {
          setIsVerifyingPhone(false);
          setIsPhoneVerified(true);
          setPhoneNumber("");
          requestAnimationFrame(() => phoneInputRef.current?.focus());
        }}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <BackButton label="Back to account" onPress={onBack} />
          <Text style={styles.title}>Your profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileCard}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                {initialProfile.avatarUri ? (
                  <Image
                    source={{ uri: initialProfile.avatarUri }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Feather color={colors.soft} name="user" size={32} />
                )}
              </View>
              <View style={styles.avatarEditBadge}>
                <Feather color={colors.text} name="edit-2" size={15} />
              </View>
            </View>

            <View style={styles.fields}>
              <ProfileTextField
                label="Name"
                onChangeText={setName}
                placeholder="Add your name"
                value={name}
              />

              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>
                  {isPhoneVerified ? "New mobile number" : "Mobile"}
                </Text>
                <View style={[styles.inputShell, !isPhoneVerified ? styles.inputShellMuted : null]}>
                  <Text style={styles.countryCode}>
                    {currentPhone?.countryCode ?? "+91"}
                  </Text>
                  <TextInput
                    cursorColor={colors.text}
                    editable={isPhoneVerified}
                    inputMode="tel"
                    keyboardType="phone-pad"
                    maxLength={requiredPhoneNumberDigits}
                    onChangeText={(value) =>
                      setPhoneNumber(value.replace(/\D/g, ""))
                    }
                    placeholder="Mobile number"
                    placeholderTextColor={colors.soft}
                    ref={phoneInputRef}
                    selectionColor={colors.text}
                    style={[
                      styles.input,
                      styles.phoneInput,
                      !isPhoneVerified ? styles.inputMuted : null,
                      webTextInputReset
                    ]}
                    value={phoneNumber}
                  />
                  {!isPhoneVerified ? (
                    <View style={styles.fieldAccessory}>
                      <Pressable
                        accessibilityLabel={`${mobileActionLabel} mobile number`}
                        accessibilityRole="button"
                        hitSlop={10}
                        onPress={handleStartPhoneChange}
                      >
                        <Text style={styles.changeText}>{mobileActionLabel}</Text>
                      </Pressable>
                    </View>
                  ) : null}
                </View>
                {isPhoneVerified ? (
                  <Text style={styles.helperText}>
                    Existing account verified. Enter the mobile number you want
                    to use.
                  </Text>
                ) : null}
              </View>

              <ProfileTextField
                inputMode="email"
                keyboardType="email-address"
                label="Email"
                onChangeText={setEmail}
                placeholder="Add email ID"
                value={email}
              />

              <DateSelectField
                label="Date of birth"
                onOpen={() => handleOpenDatePicker("dateOfBirth")}
                placeholder="DD/MM/YYYY"
                value={dateOfBirth}
              />

              <DateSelectField
                label="Anniversary"
                onOpen={() => handleOpenDatePicker("anniversary")}
                placeholder="Optional"
                value={anniversary}
              />

              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>What do you wear?</Text>
                <View style={styles.wearOptions}>
                  {wearPreferenceOptions.map((option) => {
                    const isSelected = wearPreference === option.value;

                    return (
                      <Pressable
                        accessibilityLabel={`Set clothing preference to ${option.label}`}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isSelected }}
                        key={option.value}
                        onPress={() => setWearPreference(option.value)}
                        style={({ pressed }) => [
                          styles.wearOption,
                          isSelected ? styles.wearOptionSelected : null,
                          pressed ? styles.pressed : null
                        ]}
                      >
                        <Text
                          style={[
                            styles.wearOptionText,
                            isSelected ? styles.wearOptionTextSelected : null
                          ]}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.stickyFooter}>
          <PrimaryButton
            disabled={!canSave}
            label="Update profile"
            onPress={handleSave}
          />
        </View>

        {activeDatePicker ? (
          <DatePickerSheet
            field={activeDatePicker}
            onChangeParts={setDraftDateParts}
            onClose={() => setActiveDatePicker(null)}
            onConfirm={handleConfirmDate}
            parts={draftDateParts}
          />
        ) : null}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    backgroundColor: colors.imageSurface,
    borderRadius: radii.pill,
    height: 104,
    justifyContent: "center",
    overflow: "hidden",
    width: 104
  },
  avatarEditBadge: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    bottom: 2,
    height: 34,
    justifyContent: "center",
    position: "absolute",
    right: 0,
    width: 34
  },
  avatarImage: {
    height: "100%",
    width: "100%"
  },
  avatarWrap: {
    alignSelf: "center",
    marginBottom: spacing.lg,
    position: "relative"
  },
  backButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  changeText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16
  },
  content: {
    gap: spacing.lg,
    paddingBottom: 144,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg
  },
  countryCode: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 20,
    paddingRight: spacing.sm
  },
  datePickerClose: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  datePickerColumn: {
    flex: 1,
    maxHeight: 216
  },
  datePickerColumnContent: {
    gap: spacing.xs,
    paddingVertical: spacing.sm
  },
  datePickerColumns: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.xl
  },
  datePickerHandle: {
    alignSelf: "center",
    backgroundColor: colors.border,
    borderRadius: radii.pill,
    height: 4,
    marginBottom: spacing.lg,
    width: 44
  },
  datePickerHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    marginBottom: spacing.lg
  },
  datePickerMonthColumn: {
    flex: 1.28
  },
  datePickerOption: {
    alignItems: "center",
    borderRadius: radii.pill,
    minHeight: 40,
    justifyContent: "center",
    paddingHorizontal: spacing.sm
  },
  datePickerOptionSelected: {
    backgroundColor: colors.surface
  },
  datePickerOptionText: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 20,
    textAlign: "center"
  },
  datePickerOptionTextSelected: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 23
  },
  datePickerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    zIndex: 30
  },
  datePickerScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 10, 10, 0.36)"
  },
  datePickerSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    paddingBottom: 24,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md
  },
  datePickerTitle: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.heading,
    fontSize: 22,
    lineHeight: 28
  },
  datePlaceholder: {
    color: colors.soft
  },
  dateSelectText: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    lineHeight: 21,
    minWidth: 0
  },
  errorText: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    marginTop: spacing.md,
    textAlign: "center"
  },
  fieldAccessory: {
    alignItems: "center",
    borderLeftColor: colors.border,
    borderLeftWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    marginLeft: spacing.sm,
    paddingLeft: spacing.md
  },
  fieldBlock: {
    gap: spacing.xs
  },
  fieldLabel: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16
  },
  fields: {
    gap: spacing.md
  },
  wearOption: {
    alignItems: "center",
    backgroundColor: colors.surfaceTertiary,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    minHeight: 56,
    paddingHorizontal: spacing.md
  },
  wearOptionSelected: {
    backgroundColor: colors.inverse,
    borderColor: colors.inverse
  },
  wearOptionText: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 15,
    lineHeight: 20,
    textAlign: "center"
  },
  wearOptionTextSelected: {
    color: colors.inverseText
  },
  wearOptions: {
    flexDirection: "row",
    gap: spacing.sm
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.screen,
    paddingTop: appTopSafeInset + spacing.sm
  },
  headerSpacer: {
    height: 42,
    width: 42
  },
  helperText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17
  },
  input: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    lineHeight: 21,
    minWidth: 0,
    padding: 0
  },
  inputMuted: {
    color: colors.muted
  },
  inputShell: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 56,
    paddingHorizontal: spacing.md
  },
  inputShellMuted: {
    backgroundColor: colors.surfaceTertiary
  },
  keyboardView: {
    flex: 1
  },
  otpDestination: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    marginTop: spacing.xl,
    textAlign: "center"
  },
  otpDestinationValue: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 23,
    marginTop: spacing.xs,
    textAlign: "center"
  },
  otpInputCenter: {
    alignSelf: "center"
  },
  otpWrap: {
    alignItems: "center",
    marginTop: spacing.xxl
  },
  phoneInput: {
    fontFamily: fonts.bodyMedium
  },
  pressed: {
    opacity: 0.64
  },
  profileCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.lg
  },
  resendActive: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.md,
    textAlign: "center",
    textDecorationLine: "underline"
  },
  resendMuted: {
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.md,
    textAlign: "center"
  },
  screen: {
    backgroundColor: colors.surfaceTertiary,
    flex: 1
  },
  stickyFooter: {
    backgroundColor: colors.surfaceTertiary,
    bottom: 0,
    left: 0,
    paddingBottom: 24,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    position: "absolute",
    right: 0,
    zIndex: 12
  },
  timerText: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 26,
    lineHeight: 32,
    marginTop: 88,
    textAlign: "center"
  },
  title: {
    ...typography.screenTitle,
    color: colors.text,
    flex: 1,
    textAlign: "center"
  },
  verifyContent: {
    flex: 1,
    paddingHorizontal: spacing.screen,
    paddingTop: 76
  },
  verifyHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.sm
  },
  verifyIntro: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 18,
    lineHeight: 25,
    textAlign: "center"
  },
  verifyTitle: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.heading,
    fontSize: 22,
    lineHeight: 28,
    textAlign: "center"
  }
});
