import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextStyle,
  View
} from "react-native";

import { CountryFlag } from "../../../components/CountryFlag";
import { DropdownChevron } from "../../../components/DropdownChevron";
import { countryOptions, type CountryOption } from "../../../data/countries";
import { colors, fonts, radii, spacing } from "../../../theme";

type CountryCodePickerProps = {
  isOpen?: boolean;
  onChangeCountry: (country: CountryOption) => void;
  onOpenChange?: (isOpen: boolean) => void;
  selectedCountry: CountryOption;
};

const webTextInputReset =
  Platform.OS === "web"
    ? ({
        outlineStyle: "none",
        outlineWidth: 0
      } as unknown as TextStyle)
    : null;

export function CountryCodePicker({
  isOpen: controlledIsOpen,
  onChangeCountry,
  onOpenChange,
  selectedCountry
}: CountryCodePickerProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [listHeight, setListHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const isOpen = controlledIsOpen ?? uncontrolledIsOpen;

  const setPickerOpen = (nextIsOpen: boolean) => {
    if (controlledIsOpen === undefined) {
      setUncontrolledIsOpen(nextIsOpen);
    }

    onOpenChange?.(nextIsOpen);
  };

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setScrollY(0);
    }
  }, [isOpen]);

  const visibleCountries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const sortedCountries = [
      selectedCountry,
      ...countryOptions.filter(
        (country) => country.country !== selectedCountry.country
      )
    ];

    if (!normalizedQuery) {
      return sortedCountries;
    }

    return sortedCountries.filter((country) => {
      const searchableText = `${country.name} ${country.country} ${country.code}`
        .replace(/\s+/g, " ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [query, selectedCountry]);

  const handleSelectCountry = (country: CountryOption) => {
    onChangeCountry(country);
    setPickerOpen(false);
  };

  const hasScrollableContent = contentHeight > listHeight + 1;
  const thumbHeight = hasScrollableContent
    ? Math.max(32, (listHeight * listHeight) / contentHeight)
    : 0;
  const maxScrollY = Math.max(1, contentHeight - listHeight);
  const maxThumbTop = Math.max(0, listHeight - thumbHeight - 12);
  const thumbTop = hasScrollableContent
    ? Math.min(maxThumbTop, (scrollY / maxScrollY) * maxThumbTop)
    : 0;

  return (
    <View
      onTouchStart={(event) => event.stopPropagation()}
      style={styles.wrap}
    >
      <Pressable
        accessibilityLabel="Select country code"
        accessibilityRole="button"
        onPress={() => setPickerOpen(!isOpen)}
        style={({ pressed }) => [
          styles.selector,
          pressed ? styles.pressed : null
        ]}
      >
        <CountryFlag country={selectedCountry.country} flag={selectedCountry.flag} />
        <Text style={styles.countryCode}>{selectedCountry.code}</Text>
        <View style={styles.chevronWrap}>
          <DropdownChevron />
        </View>
      </Pressable>

      {isOpen ? (
        <View style={styles.menu}>
          <View style={styles.searchRow}>
            <Ionicons color={colors.soft} name="search" size={18} />
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              cursorColor={colors.text}
              onChangeText={setQuery}
              placeholder="Search country"
              placeholderTextColor={colors.soft}
              selectionColor={colors.text}
              style={[styles.searchInput, webTextInputReset]}
              value={query}
            />
          </View>

          <View style={styles.countryListWrap}>
            <ScrollView
              contentContainerStyle={styles.countryListContent}
              indicatorStyle="black"
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
              onContentSizeChange={(_, height) => setContentHeight(height)}
              onLayout={(event) => setListHeight(event.nativeEvent.layout.height)}
              onScroll={(event) =>
                setScrollY(event.nativeEvent.contentOffset.y)
              }
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              style={styles.countryList}
            >
              {visibleCountries.map((country) => (
                <Pressable
                  accessibilityRole="button"
                  key={country.country}
                  onPress={() => handleSelectCountry(country)}
                  style={({ pressed }) => [
                    styles.countryOption,
                    pressed ? styles.pressed : null
                  ]}
                >
                  <CountryFlag country={country.country} flag={country.flag} />
                  <Text numberOfLines={1} style={styles.optionCode}>
                    {country.code}
                  </Text>
                  <Text numberOfLines={1} style={styles.optionName}>
                    {country.name}
                  </Text>
                </Pressable>
              ))}
              {visibleCountries.length === 0 ? (
                <Text style={styles.emptyText}>No countries found</Text>
              ) : null}
            </ScrollView>
            {hasScrollableContent ? (
              <View pointerEvents="none" style={styles.scrollbarTrack}>
                <View
                  style={[
                    styles.scrollbarThumb,
                    {
                      height: thumbHeight,
                      transform: [{ translateY: thumbTop }]
                    }
                  ]}
                />
              </View>
            ) : null}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  chevronWrap: {
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
  countryList: {
    maxHeight: 220
  },
  countryListContent: {
    paddingBottom: spacing.xs
  },
  countryListWrap: {
    maxHeight: 220,
    position: "relative"
  },
  countryOption: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 42,
    paddingHorizontal: spacing.md
  },
  emptyText: {
    color: colors.muted,
    fontFamily: fonts.body,
    padding: spacing.md
  },
  menu: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: 1,
    left: 0,
    overflow: "hidden",
    position: "absolute",
    top: 60,
    width: 300,
    zIndex: 20
  },
  optionCode: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    minWidth: 54
  },
  optionName: {
    color: colors.muted,
    flex: 1,
    fontFamily: fonts.body
  },
  pressed: {
    opacity: 0.72
  },
  searchInput: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.body,
    height: 42
  },
  searchRow: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.md
  },
  selector: {
    alignItems: "center",
    backgroundColor: "transparent",
    flexDirection: "row",
    height: 56,
    justifyContent: "center",
    minWidth: 104,
    paddingHorizontal: 10
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
  wrap: {
    position: "relative",
    zIndex: 30
  }
});
