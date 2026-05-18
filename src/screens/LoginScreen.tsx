import { useEffect, useMemo, useRef, useState } from "react";
import {
  InteractionManager,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextStyle,
  View
} from "react-native";

import { CountryFlag } from "../components/CountryFlag";
import { Divider } from "../components/Divider";
import { DropdownChevron } from "../components/DropdownChevron";
import { PrimaryButton } from "../components/PrimaryButton";
import { SearchIcon } from "../components/SearchIcon";
import { ScreenHeader } from "../components/ScreenHeader";
import { SocialButton } from "../components/SocialButton";
import { requiredPhoneNumberDigits } from "../constants/auth";
import { CountryOption, countryOptions } from "../data/countries";
import { socialOptions } from "../data/onboarding";
import { colors, fonts, radii, spacing, typography } from "../theme";

const webTextInputReset =
  Platform.OS === "web"
    ? ({
        outlineStyle: "none",
        outlineWidth: 0
      } as unknown as TextStyle)
    : null;

type LoginScreenProps = {
  phoneNumber: string;
  onBack: () => void;
  onChangeCountry: (country: CountryOption) => void;
  onChangePhone: (value: string) => void;
  selectedCountry: CountryOption;
  onSubmit: () => void;
};

export function LoginScreen({
  phoneNumber,
  onBack,
  onChangeCountry,
  onChangePhone,
  selectedCountry,
  onSubmit
}: LoginScreenProps) {
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState("");
  const [countryListHeight, setCountryListHeight] = useState(0);
  const [countryContentHeight, setCountryContentHeight] = useState(0);
  const [countryScrollY, setCountryScrollY] = useState(0);
  const phoneInputRef = useRef<TextInput>(null);
  const isPhoneNumberComplete =
    phoneNumber.trim().length === requiredPhoneNumberDigits;
  const countrySelectorWidth =
    selectedCountry.code.length >= 6
      ? 126
      : selectedCountry.code.length >= 5
        ? 118
        : 94;

  const sortedCountryOptions = useMemo(
    () => [
      selectedCountry,
      ...countryOptions.filter(
        (country) => country.country !== selectedCountry.country
      )
    ],
    [selectedCountry]
  );

  const visibleCountryOptions = useMemo(() => {
    const query = countrySearchQuery.trim().toLowerCase();

    if (!query) {
      return sortedCountryOptions;
    }

    return sortedCountryOptions.filter((country) => {
      const searchableText = `${country.name} ${country.country} ${country.code}`
        .replace(/\s+/g, " ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [countrySearchQuery, sortedCountryOptions]);

  const handleSelectCountry = (country: CountryOption) => {
    onChangeCountry(country);
    setIsCountryPickerOpen(false);
    setCountrySearchQuery("");
  };

  const hasScrollableCountries = countryContentHeight > countryListHeight + 1;
  const scrollbarThumbHeight = hasScrollableCountries
    ? Math.max(32, (countryListHeight * countryListHeight) / countryContentHeight)
    : 0;
  const maxCountryScrollY = Math.max(1, countryContentHeight - countryListHeight);
  const maxScrollbarTop = Math.max(
    0,
    countryListHeight - scrollbarThumbHeight - 12
  );
  const scrollbarTop = hasScrollableCountries
    ? Math.min(
        maxScrollbarTop,
        (countryScrollY / maxCountryScrollY) * maxScrollbarTop
      )
    : 0;

  const openCountryPicker = () => {
    setIsCountryPickerOpen((isOpen) => !isOpen);
  };

  const focusPhoneInput = () => {
    setIsCountryPickerOpen(false);
    setCountrySearchQuery("");
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
    <View style={styles.screen}>
      <ScreenHeader onBack={onBack} showBrand={false} />

      <View style={styles.content}>
        <Text style={styles.title}>What is your phone number?</Text>

        <View style={styles.form}>
          <View style={styles.phoneFieldWrap}>
            <View style={styles.phoneField}>
              <Pressable
                accessibilityLabel="Select country code"
                accessibilityRole="button"
                onPress={openCountryPicker}
                style={({ pressed }) => [
                  styles.countrySelector,
                  { width: countrySelectorWidth },
                  pressed ? styles.pressed : null
                ]}
              >
                <CountryFlag country={selectedCountry.country} flag={selectedCountry.flag} />
                <Text style={styles.countryCode}>{selectedCountry.code}</Text>
                <View style={styles.chevron}>
                  <DropdownChevron />
                </View>
              </Pressable>

              <Pressable
                accessibilityLabel="Enter phone number"
                onPress={focusPhoneInput}
                style={styles.inputPressTarget}
              >
                <TextInput
                  autoFocus
                  inputMode="tel"
                  keyboardType="phone-pad"
                  maxLength={requiredPhoneNumberDigits}
                  onChangeText={(value) => onChangePhone(value.replace(/\D/g, ""))}
                  onFocus={() => setIsCountryPickerOpen(false)}
                  placeholder="Phone number"
                  placeholderTextColor={colors.soft}
                  ref={phoneInputRef}
                  showSoftInputOnFocus
                  style={[styles.input, webTextInputReset]}
                  textContentType="telephoneNumber"
                  value={phoneNumber}
                />
              </Pressable>
            </View>

            {isCountryPickerOpen ? (
              <View style={styles.countryMenu}>
                <View style={styles.countrySearch}>
                  <SearchIcon />
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={setCountrySearchQuery}
                    placeholder="Search country"
                    placeholderTextColor={colors.soft}
                    style={[styles.countrySearchInput, webTextInputReset]}
                    value={countrySearchQuery}
                  />
                </View>
                <View style={styles.countryListWrap}>
                  <ScrollView
                    contentContainerStyle={styles.countryListContent}
                    indicatorStyle="black"
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled
                    onContentSizeChange={(_, height) =>
                      setCountryContentHeight(height)
                    }
                    onLayout={(event) =>
                      setCountryListHeight(event.nativeEvent.layout.height)
                    }
                    onScroll={(event) =>
                      setCountryScrollY(event.nativeEvent.contentOffset.y)
                    }
                    persistentScrollbar
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator
                    style={styles.countryList}
                  >
                    {visibleCountryOptions.map((option) => (
                      <Pressable
                        accessibilityRole="button"
                        key={option.country}
                        onPress={() => handleSelectCountry(option)}
                        style={({ pressed }) => [
                          styles.countryOption,
                          pressed ? styles.pressed : null
                        ]}
                      >
                        <CountryFlag country={option.country} flag={option.flag} />
                        <Text numberOfLines={1} style={styles.countryOptionCode}>
                          {option.code}
                        </Text>
                        <Text numberOfLines={1} style={styles.countryOptionName}>
                          {option.name}
                        </Text>
                      </Pressable>
                    ))}
                    {visibleCountryOptions.length === 0 ? (
                      <Text style={styles.emptyCountries}>No countries found</Text>
                    ) : null}
                  </ScrollView>
                  {hasScrollableCountries ? (
                    <View pointerEvents="none" style={styles.scrollbarTrack}>
                      <View
                        style={[
                          styles.scrollbarThumb,
                          {
                            height: scrollbarThumbHeight,
                            transform: [{ translateY: scrollbarTop }]
                          }
                        ]}
                      />
                    </View>
                  ) : null}
                </View>
              </View>
            ) : null}
          </View>

          <PrimaryButton
            disabled={!isPhoneNumberComplete}
            label="Sign in"
            onPress={onSubmit}
          />
        </View>

        <Divider />

        <View style={styles.socialRow}>
          {socialOptions.map((option) => (
            <SocialButton
              key={option.id}
              accessibilityLabel={option.accessibilityLabel}
              icon={option.icon}
              onPress={onSubmit}
            />
          ))}
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 24,
    paddingHorizontal: spacing.screen,
    paddingTop: 24
  },
  chevron: {
    alignItems: "center",
    height: 18,
    justifyContent: "center",
    width: 16
  },
  countryCode: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18,
    marginLeft: 4,
    marginRight: 4
  },
  countryMenu: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: 1,
    left: 0,
    maxHeight: 328,
    overflow: "hidden",
    position: "absolute",
    top: 54,
    width: 292,
    zIndex: 30
  },
  countryOption: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    minHeight: 46,
    paddingHorizontal: 14
  },
  countryOptionCode: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 21,
    width: 64
  },
  countryOptionName: {
    color: colors.muted,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20
  },
  countrySearch: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 8,
    height: 52,
    paddingHorizontal: 14
  },
  countrySearchInput: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    height: "100%",
    paddingVertical: 0
  },
  countryList: {
    maxHeight: 276
  },
  countryListContent: {
    paddingBottom: 4
  },
  countryListWrap: {
    maxHeight: 276,
    position: "relative"
  },
  countrySelector: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "transparent",
    borderRightColor: colors.border,
    borderRightWidth: 1,
    flexDirection: "row",
    height: "100%",
    justifyContent: "center",
    paddingLeft: 6,
    paddingRight: 6
  },
  form: {
    gap: 12,
    zIndex: 20
  },
  input: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    height: "100%",
    paddingBottom: 0,
    paddingHorizontal: 24,
    paddingTop: 0,
    textAlignVertical: "center"
  },
  inputPressTarget: {
    flex: 1,
    height: "100%"
  },
  emptyCountries: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
    paddingHorizontal: 14,
    paddingVertical: 16
  },
  phoneField: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: 1,
    flexDirection: "row",
    height: 56,
    overflow: "hidden"
  },
  phoneFieldWrap: {
    overflow: "visible",
    position: "relative",
    zIndex: 30
  },
  screen: {
    flex: 1
  },
  socialRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  scrollbarThumb: {
    backgroundColor: "#CFCAC1",
    borderRadius: radii.pill,
    width: 3
  },
  scrollbarTrack: {
    backgroundColor: "#F1EEE8",
    borderRadius: radii.pill,
    bottom: 6,
    position: "absolute",
    right: 4,
    top: 6,
    width: 3
  },
  pressed: {
    opacity: 0.72
  },
  title: {
    color: colors.text,
    ...typography.h2,
    fontSize: 28,
    lineHeight: 34
  }
});
