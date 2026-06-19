import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextStyle,
  type ViewStyle,
  View
} from "react-native";

import { colors, fonts, radii, spacing, typography } from "../../../theme";
import { AccountMenuRow } from "../components/AccountMenuRow";
import { AccountPreferenceRow } from "../components/AccountPreferenceRow";
import { AccountProfileCard } from "../components/AccountProfileCard";
import { appScreenTopPadding } from "../components/AppScreenHeader";
import { AccountEditProfileScreen } from "./AccountEditProfileScreen";
import type {
  EditableProfile,
  FashionInterest
} from "../../onboarding/viewModels/useOnboardingViewModel";
import { ClosetFavouritesScreen } from "./ClosetFavouritesScreen";
import { SavedScreen } from "./SavedScreen";

export type SocialPlatform = "whatsapp" | "facebook" | "instagram";

export type AccountUser = {
  name: string;
  phone?: {
    countryCode: string;
    phoneNumber: string;
  };
  phoneNumber?: string;
  email?: string;
  avatarUri?: string;
  dateOfBirth?: string;
  anniversary?: string;
  fashionInterest?: FashionInterest;
};

/**
 * Navigation/intent callbacks for the Account screen. All are optional so
 * the screen can render before the engineer wires real destinations; an
 * unwired row simply stays inert.
 */
export type AccountActions = {
  onEditProfile?: () => void;
  onOpenExplore?: () => void;
  onOpenCloset?: () => void;
  onOpenOrders?: () => void;
  onOpenSizeDetails?: () => void;
  onOpenHelp?: () => void;
  onOpenPayments?: () => void;
  onOpenSocial?: (platform: SocialPlatform) => void;
  onStartStyleQuiz?: () => void;
  onStartTryOn?: (context?: string) => void;
  onUpdateProfile?: (profile: EditableProfile) => void;
  onLogout?: () => void;
};

type AccountStyleProfile = {
  answeredCount: number;
  isRecorded: boolean;
  likedStyleLabels: string[];
  requiredCount: number;
  skipped?: boolean;
};

type AccountScreenProps = {
  user: AccountUser;
  appVersion: string;
  actions?: AccountActions;
  closetItemCount?: number;
  initialPage?: AccountPage | null;
  onInternalViewChange?: (isOpen: boolean, backgroundColor?: string) => void;
  onOverlayActiveChange?: (isActive: boolean) => void;
  styleProfile?: AccountStyleProfile;
};

type AccountDetailPageName =
  | "avatar"
  | "measurements"
  | "privacy"
  | "style";
export type AccountPage = AccountDetailPageName | "wishlist";
type AccountInternalPage =
  | AccountPage
  | "addAddress"
  | "addresses"
  | "closetFavourites"
  | "editProfile";

type AddressFormPayload = {
  addressLine: string;
  city: string;
  houseNumber: string;
  isDefault: boolean;
  locality: string;
  mobile: string;
  name: string;
  openSaturday: boolean;
  openSunday: boolean;
  pincode: string;
  state: string;
  type: AddressType;
};

type AddressType = "Home" | "Office";

type SavedAddress = {
  address: string;
  distance: string;
  icon: keyof typeof Feather.glyphMap;
  id: string;
  label: string;
  phone?: string;
};

const savedAddresses: SavedAddress[] = [];
const addressTypeOptions: AddressType[] = ["Home", "Office"];
const stateByPincodePrefix: Record<string, string> = {
  "11": "Delhi",
  "12": "Haryana",
  "13": "Haryana",
  "14": "Punjab",
  "15": "Punjab",
  "16": "Punjab",
  "17": "Himachal Pradesh",
  "18": "Jammu & Kashmir",
  "19": "Jammu & Kashmir",
  "20": "Uttar Pradesh",
  "21": "Uttar Pradesh",
  "22": "Uttar Pradesh",
  "23": "Uttar Pradesh",
  "24": "Uttar Pradesh",
  "25": "Uttar Pradesh",
  "26": "Uttar Pradesh",
  "27": "Uttar Pradesh",
  "28": "Uttar Pradesh",
  "30": "Rajasthan",
  "31": "Rajasthan",
  "32": "Rajasthan",
  "33": "Rajasthan",
  "34": "Rajasthan",
  "36": "Gujarat",
  "37": "Gujarat",
  "38": "Gujarat",
  "39": "Gujarat",
  "40": "Maharashtra",
  "41": "Maharashtra",
  "42": "Maharashtra",
  "43": "Maharashtra",
  "44": "Maharashtra",
  "45": "Madhya Pradesh",
  "46": "Madhya Pradesh",
  "47": "Madhya Pradesh",
  "48": "Madhya Pradesh",
  "49": "Chhattisgarh",
  "50": "Telangana",
  "51": "Andhra Pradesh",
  "52": "Andhra Pradesh",
  "53": "Andhra Pradesh",
  "56": "Karnataka",
  "57": "Karnataka",
  "58": "Karnataka",
  "59": "Karnataka",
  "60": "Tamil Nadu",
  "61": "Tamil Nadu",
  "62": "Tamil Nadu",
  "63": "Tamil Nadu",
  "64": "Tamil Nadu",
  "67": "Kerala",
  "68": "Kerala",
  "69": "Kerala",
  "70": "West Bengal",
  "71": "West Bengal",
  "72": "West Bengal",
  "73": "West Bengal",
  "74": "West Bengal",
  "75": "Odisha",
  "76": "Odisha",
  "77": "Odisha",
  "78": "Assam"
};
const stateByThreeDigitPincodePrefix: Record<string, string> = {
  "160": "Chandigarh",
  "246": "Uttarakhand",
  "247": "Uttarakhand",
  "248": "Uttarakhand",
  "249": "Uttarakhand",
  "262": "Uttarakhand",
  "263": "Uttarakhand",
  "403": "Goa",
  "605": "Puducherry",
  "737": "Sikkim",
  "744": "Andaman & Nicobar Islands",
  "790": "Arunachal Pradesh",
  "791": "Arunachal Pradesh",
  "792": "Arunachal Pradesh",
  "793": "Meghalaya",
  "794": "Meghalaya",
  "795": "Manipur",
  "796": "Mizoram",
  "797": "Nagaland",
  "798": "Nagaland",
  "799": "Tripura",
  "814": "Jharkhand",
  "815": "Jharkhand",
  "816": "Jharkhand",
  "817": "Jharkhand",
  "818": "Jharkhand",
  "819": "Jharkhand",
  "820": "Jharkhand",
  "821": "Jharkhand",
  "822": "Jharkhand",
  "823": "Jharkhand",
  "824": "Jharkhand",
  "825": "Jharkhand",
  "826": "Jharkhand",
  "827": "Jharkhand",
  "828": "Jharkhand",
  "829": "Jharkhand",
  "830": "Jharkhand",
  "831": "Jharkhand",
  "832": "Jharkhand",
  "833": "Jharkhand",
  "834": "Jharkhand",
  "835": "Jharkhand"
};
const webTextInputReset =
  Platform.OS === "web"
    ? ({
        outlineStyle: "none",
        outlineWidth: 0
      } as unknown as TextStyle)
    : null;

function getStateFromPincode(pincode: string) {
  const cleanPincode = pincode.replace(/\D/g, "");

  if (cleanPincode.length < 2) {
    return "";
  }

  return (
    stateByThreeDigitPincodePrefix[cleanPincode.slice(0, 3)] ??
    stateByPincodePrefix[cleanPincode.slice(0, 2)] ??
    ""
  );
}

function AddressTextField({
  containerStyle,
  editable = true,
  inputMode = "text",
  keyboardType = "default",
  label,
  maxLength,
  onChangeText,
  placeholder,
  value
}: {
  containerStyle?: ViewStyle;
  editable?: boolean;
  inputMode?: "email" | "numeric" | "text" | "tel";
  keyboardType?: "default" | "email-address" | "number-pad" | "phone-pad";
  label: string;
  maxLength?: number;
  onChangeText: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <View style={[styles.addressFormField, containerStyle]}>
      <Text style={styles.addressFormLabel}>{label}</Text>
      <View style={styles.addressInputShell}>
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
          style={[styles.addressInput, webTextInputReset]}
          value={value}
        />
      </View>
    </View>
  );
}

function AddressCheckbox({
  label,
  onPress,
  selected
}: {
  label: string;
  onPress: () => void;
  selected: boolean;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.addressCheckboxRow,
        pressed ? styles.pressed : null
      ]}
    >
      <View
        style={[
          styles.addressCheckbox,
          selected ? styles.addressCheckboxSelected : null
        ]}
      >
        {selected ? (
          <Feather color={colors.inverseText} name="check" size={14} />
        ) : null}
      </View>
      <Text style={styles.addressCheckboxText}>{label}</Text>
    </Pressable>
  );
}

function DetailInfoCard({
  body,
  icon,
  title
}: {
  body: string;
  icon: keyof typeof Feather.glyphMap;
  title: string;
}) {
  return (
    <View style={styles.detailInfoCard}>
      <View style={styles.detailInfoIcon}>
        <Feather color={colors.text} name={icon} size={18} />
      </View>
      <View style={styles.detailInfoCopy}>
        <Text style={styles.detailInfoTitle}>{title}</Text>
        <Text style={styles.detailInfoBody}>{body}</Text>
      </View>
    </View>
  );
}

function AccountAddressesScreen({
  addresses,
  onAddAddress,
  onBack
}: {
  addresses: SavedAddress[];
  onAddAddress: () => void;
  onBack: () => void;
}) {
  const [query, setQuery] = useState("");
  const hasSavedAddresses = addresses.length > 0;
  const normalizedQuery = query.trim().toLowerCase();
  const visibleAddresses = normalizedQuery
    ? addresses.filter((address) => {
        const searchableText = [
          address.label,
          address.address,
          address.phone ?? ""
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedQuery);
      })
    : addresses;

  return (
    <SafeAreaView style={styles.addressScreen}>
      <ScrollView
        contentContainerStyle={styles.addressContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.addressHeader}>
          <Pressable
            accessibilityLabel="Back to account"
            accessibilityRole="button"
            hitSlop={10}
            onPress={onBack}
            style={({ pressed }) => [
              styles.addressBackButton,
              pressed ? styles.pressed : null
            ]}
          >
            <Feather color={colors.text} name="chevron-left" size={24} />
          </Pressable>
          <Text style={styles.addressTitle}>Saved addresses</Text>
        </View>

        {hasSavedAddresses ? (
          <View style={styles.addressSearch}>
            <Feather color={colors.soft} name="search" size={20} />
            <TextInput
              accessibilityLabel="Search saved addresses"
              autoCorrect={false}
              onChangeText={setQuery}
              placeholder="Search saved addresses"
              placeholderTextColor={colors.soft}
              returnKeyType="search"
              selectionColor={colors.text}
              style={styles.addressSearchInput}
              value={query}
            />
          </View>
        ) : null}

        {hasSavedAddresses ? (
          <Pressable
            accessibilityLabel="Add new address"
            accessibilityRole="button"
            onPress={onAddAddress}
            style={({ pressed }) => [
              styles.addAddressCta,
              pressed ? styles.pressed : null
            ]}
          >
            <Feather color={colors.inverseText} name="plus" size={19} />
            <Text style={styles.addAddressCtaText}>Add new address</Text>
          </Pressable>
        ) : null}

        {hasSavedAddresses ? (
          <View style={styles.addressList}>
            {visibleAddresses.length > 0 ? (
              visibleAddresses.map((address) => (
                <View key={address.id} style={styles.addressCard}>
                  <View style={styles.addressDistance}>
                    <View style={styles.addressIconShell}>
                      <Feather
                        color={colors.text}
                        name={address.icon}
                        size={22}
                      />
                    </View>
                    {address.distance ? (
                      <Text style={styles.addressDistanceText}>
                        {address.distance}
                      </Text>
                    ) : null}
                  </View>

                  <View style={styles.addressCopy}>
                    <Text style={styles.addressLabel}>{address.label}</Text>
                    <Text style={styles.addressBody}>{address.address}</Text>
                    {address.phone ? (
                      <Text style={styles.addressPhone}>
                        Phone number: {address.phone}
                      </Text>
                    ) : null}
                    <View style={styles.addressActions}>
                      <Pressable
                        accessibilityLabel={`More options for ${address.label}`}
                        accessibilityRole="button"
                        style={({ pressed }) => [
                          styles.addressIconButton,
                          pressed ? styles.pressed : null
                        ]}
                      >
                        <Feather
                          color={colors.text}
                          name="more-horizontal"
                          size={18}
                        />
                      </Pressable>
                      <Pressable
                        accessibilityLabel={`Share ${address.label}`}
                        accessibilityRole="button"
                        style={({ pressed }) => [
                          styles.addressIconButton,
                          pressed ? styles.pressed : null
                        ]}
                      >
                        <Feather color={colors.text} name="share-2" size={17} />
                      </Pressable>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.addressEmpty}>
                <Text style={styles.addressLabel}>No addresses found</Text>
                <Text style={styles.addressBody}>
                  Try searching by name, area or phone number.
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.addressEmpty}>
            <View style={styles.addressIconShell}>
              <Feather color={colors.text} name="map-pin" size={22} />
            </View>
            <View style={styles.addressEmptyCopy}>
              <Text style={styles.addressEmptyTitle}>
                No saved addresses yet
              </Text>
              <Text style={styles.addressEmptyBody}>
                Add a delivery address once, then reuse it whenever a look is
                ready to buy.
              </Text>
            </View>
            <Pressable
              accessibilityLabel="Add new address"
              accessibilityRole="button"
              onPress={onAddAddress}
              style={({ pressed }) => [
                styles.addAddressCta,
                styles.addressEmptyCta,
                pressed ? styles.pressed : null
              ]}
            >
              <Feather color={colors.inverseText} name="plus" size={19} />
              <Text style={styles.addAddressCtaText}>Add new address</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function AccountAddAddressScreen({
  onBack,
  onSave
}: {
  onBack: () => void;
  onSave: (address: AddressFormPayload) => void;
}) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [pincode, setPincode] = useState("");
  const [stateName, setStateName] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [locality, setLocality] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState<AddressType>("Home");
  const [openSaturday, setOpenSaturday] = useState(false);
  const [openSunday, setOpenSunday] = useState(false);
  const [isDefault, setIsDefault] = useState(false);

  const cleanMobile = mobile.replace(/\D/g, "");
  const cleanPincode = pincode.replace(/\D/g, "");
  const canSaveAddress =
    name.trim().length > 0 &&
    cleanMobile.length === 10 &&
    cleanPincode.length === 6 &&
    stateName.trim().length > 0 &&
    houseNumber.trim().length > 0 &&
    addressLine.trim().length > 0 &&
    locality.trim().length > 0 &&
    city.trim().length > 0;

  const handlePincodeChange = (value: string) => {
    const nextPincode = value.replace(/\D/g, "");

    setPincode(nextPincode);
    setStateName(getStateFromPincode(nextPincode));
  };

  const handleAddressTypeChange = (nextType: AddressType) => {
    setType(nextType);

    if (nextType === "Home") {
      setOpenSaturday(false);
      setOpenSunday(false);
    }
  };

  const handleSave = () => {
    if (!canSaveAddress) {
      return;
    }

    onSave({
      addressLine: addressLine.trim(),
      city: city.trim(),
      houseNumber: houseNumber.trim(),
      isDefault,
      locality: locality.trim(),
      mobile: cleanMobile,
      name: name.trim(),
      openSaturday,
      openSunday,
      pincode: cleanPincode,
      state: stateName.trim(),
      type
    });
  };

  return (
    <View style={styles.addressScreen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.addressKeyboard}
      >
        <ScrollView
          contentContainerStyle={styles.addAddressContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.addressHeader}>
            <Pressable
              accessibilityLabel="Back to saved addresses"
              accessibilityRole="button"
              hitSlop={10}
              onPress={onBack}
              style={({ pressed }) => [
                styles.addressBackButton,
                pressed ? styles.pressed : null
              ]}
            >
              <Feather color={colors.text} name="chevron-left" size={24} />
            </Pressable>
            <Text style={styles.addressTitle}>Add new address</Text>
          </View>

          <View style={styles.addressFormFields}>
            <AddressTextField
              label="Name *"
              onChangeText={setName}
              placeholder="Enter name"
              value={name}
            />
            <AddressTextField
              inputMode="tel"
              keyboardType="phone-pad"
              label="Mobile *"
              maxLength={10}
              onChangeText={(value) => setMobile(value.replace(/\D/g, ""))}
              placeholder="Mobile number"
              value={mobile}
            />

            <View style={styles.addressFieldRow}>
              <AddressTextField
                containerStyle={styles.addressFieldHalf}
                inputMode="numeric"
                keyboardType="number-pad"
                label="Pincode *"
                maxLength={6}
                onChangeText={handlePincodeChange}
                placeholder="Pincode"
                value={pincode}
              />
              <AddressTextField
                containerStyle={styles.addressFieldHalf}
                editable={false}
                label="State *"
                onChangeText={() => {}}
                placeholder="State"
                value={stateName}
              />
            </View>

            <AddressTextField
              label="House Number/Tower/Block *"
              onChangeText={setHouseNumber}
              placeholder="House, tower or block"
              value={houseNumber}
            />
            <AddressTextField
              label="Address (Building, Street, Area) *"
              onChangeText={setAddressLine}
              placeholder="Building, street, area"
              value={addressLine}
            />
            <AddressTextField
              label="Locality/Town *"
              onChangeText={setLocality}
              placeholder="Locality or town"
              value={locality}
            />
            <AddressTextField
              label="City/District *"
              onChangeText={setCity}
              placeholder="City or district"
              value={city}
            />

            <View style={styles.addressFormField}>
              <Text style={styles.addressFormLabel}>Type of address *</Text>
              <View style={styles.addressTypeRow}>
                {addressTypeOptions.map((option) => {
                  const isSelected = type === option;

                  return (
                    <Pressable
                      accessibilityLabel={`Set address type to ${option}`}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: isSelected }}
                      key={option}
                      onPress={() => handleAddressTypeChange(option)}
                      style={({ pressed }) => [
                        styles.addressTypeChip,
                        isSelected ? styles.addressTypeChipSelected : null,
                        pressed ? styles.pressed : null
                      ]}
                    >
                      <View
                        style={[
                          styles.addressRadio,
                          isSelected ? styles.addressRadioSelected : null
                        ]}
                      >
                        {isSelected ? <View style={styles.addressRadioDot} /> : null}
                      </View>
                      <Text
                        style={[
                          styles.addressTypeText,
                          isSelected ? styles.addressTypeTextSelected : null
                        ]}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {type === "Office" ? (
              <View style={styles.addressFormField}>
                <Text style={styles.addressFormLabel}>
                  Is your office open on weekends?
                </Text>
                <View style={styles.addressCheckboxGroup}>
                  <AddressCheckbox
                    label="Open on Saturday"
                    onPress={() => setOpenSaturday((current) => !current)}
                    selected={openSaturday}
                  />
                  <AddressCheckbox
                    label="Open on Sunday"
                    onPress={() => setOpenSunday((current) => !current)}
                    selected={openSunday}
                  />
                </View>
              </View>
            ) : null}

            <View style={styles.addressDivider} />

            <AddressCheckbox
              label="Make this as my default address"
              onPress={() => setIsDefault((current) => !current)}
              selected={isDefault}
            />
          </View>
        </ScrollView>

        <View style={styles.addAddressFooter}>
          <Pressable
            accessibilityLabel="Save address"
            accessibilityRole="button"
            disabled={!canSaveAddress}
            onPress={handleSave}
            style={({ pressed }) => [
              styles.addAddressSaveButton,
              !canSaveAddress ? styles.addAddressSaveButtonDisabled : null,
              pressed ? styles.pressed : null
            ]}
          >
            <Text style={styles.addAddressSaveText}>Save address</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function AccountDetailPage({
  onBack,
  onEditProfile,
  onStartStyleQuiz,
  page,
  styleProfile,
  user
}: {
  onBack: () => void;
  onEditProfile?: () => void;
  onStartStyleQuiz?: () => void;
  page: AccountDetailPageName;
  styleProfile?: AccountStyleProfile;
  user: AccountUser;
}) {
  const detailCopy: Record<
    AccountDetailPageName,
    {
      cta?: string;
      intro: string;
      title: string;
      items: Array<{
        body: string;
        icon: keyof typeof Feather.glyphMap;
        title: string;
      }>;
    }
  > = {
    avatar: {
      cta: "Update avatar",
      intro: "Your avatar powers try-on previews, saved looks and outfit comparisons.",
      items: [
        {
          body: "Use one clear full-body photo for better outfit previews",
          icon: "camera",
          title: "Try-on photo"
        },
        {
          body: "Mira can use your avatar to explain what works visually",
          icon: "zap",
          title: "Mira styling"
        }
      ],
      title: "Avatar"
    },
    measurements: {
      cta: "Update measurements",
      intro: "These details help try-on previews and fit guidance feel closer to your actual body.",
      items: [
        {
          body: "Height, body proportions and fit reference used for try-on",
          icon: "activity",
          title: "Body basics"
        },
        {
          body: "Preferred fit, rise, sleeve length and comfort notes",
          icon: "sliders",
          title: "Fit notes"
        },
        {
          body: "Used only to improve sizing, try-on and outfit decisions",
          icon: "lock",
          title: "Data use"
        }
      ],
      title: "Your measurements"
    },
    privacy: {
      intro: "Control data, permissions and product policies from one place.",
      items: [
        {
          body: "Review how photos, try-on history and closet items are used",
          icon: "shield",
          title: "Privacy policy"
        },
        {
          body: "See purchasing, returns and account terms",
          icon: "file-text",
          title: "Terms of use"
        },
        {
          body: "Manage photo, try-on history and styling-memory permissions",
          icon: "lock",
          title: "Data controls"
        }
      ],
      title: "Privacy & policy"
    },
    style: {
      cta: "Edit style basics",
      intro: "Keep fit, size and outfit preferences in one place so recommendations stay useful.",
      items: [
        {
          body: "Sizes, fit notes and length preferences",
          icon: "sliders",
          title: "Fit basics"
        },
        {
          body: "Work, casual, occasion and budget signals",
          icon: "tag",
          title: "Outfit needs"
        },
        {
          body: "Notes Mira can reuse when styling new looks",
          icon: "message-circle",
          title: "Mira memory"
        }
      ],
      title: "Your style"
    }
  };

  const pageCopy = detailCopy[page];
  const isAvatarPage = page === "avatar";
  const isStylePage = page === "style";
  const likedStyleLabels = styleProfile?.likedStyleLabels ?? [];
  const hasLikedStyles = likedStyleLabels.length > 0;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.detailContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.detailHeader}>
          <Pressable
            accessibilityLabel="Back to account"
            accessibilityRole="button"
            onPress={onBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed ? styles.pressed : null
            ]}
          >
            <Feather color={colors.text} name="chevron-left" size={24} />
          </Pressable>
          <Text style={styles.detailTitle}>{pageCopy.title}</Text>
        </View>

        <View style={styles.detailHero}>
          {isAvatarPage ? (
            <View style={styles.avatarHero}>
              {user.avatarUri ? (
                <Image
                  resizeMode="cover"
                  source={{ uri: user.avatarUri }}
                  style={styles.avatarHeroImage}
                />
              ) : (
                <Feather color={colors.soft} name="user" size={34} />
              )}
            </View>
          ) : null}
          {isStylePage ? (
            <View style={styles.styleStatusHeader}>
              <View style={styles.styleStatusIcon}>
                <Feather
                  color={colors.text}
                  name={styleProfile?.isRecorded ? "check" : "sliders"}
                  size={18}
                />
              </View>
              <View style={styles.styleStatusCopy}>
                <Text style={styles.styleStatusTitle}>
                  {styleProfile?.isRecorded
                    ? "This is recorded as your style"
                    : "Set your style reference"}
                </Text>
                <Text style={styles.styleStatusBody}>
                  {styleProfile?.isRecorded
                    ? "Mira will use these swipe signals to shape outfit ideas, try-on suggestions and closet recommendations."
                    : "Swipe 5 looks so Mira can understand what feels like you."}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.detailIntro}>{pageCopy.intro}</Text>
          )}

          {isStylePage ? (
            <View style={styles.styleProgressCard}>
              <Text style={styles.styleProgressLabel}>Style signals</Text>
              <Text style={styles.styleProgressValue}>
                {Math.min(
                  styleProfile?.answeredCount ?? 0,
                  styleProfile?.requiredCount ?? 5
                )}
                /{styleProfile?.requiredCount ?? 5} looks swiped
              </Text>
            </View>
          ) : null}

          {isStylePage && styleProfile?.isRecorded ? (
            <View style={styles.styleChipBlock}>
              <Text style={styles.styleChipLabel}>Recorded references</Text>
              <View style={styles.styleChipRow}>
                {(hasLikedStyles
                  ? likedStyleLabels
                  : ["Balanced", "Outfit-first", "Mira-ready"]
                ).map((label) => (
                  <View key={label} style={styles.styleChip}>
                    <Text style={styles.styleChipText}>{label}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {pageCopy.cta ? (
            <Pressable
              accessibilityRole="button"
              onPress={isStylePage ? onStartStyleQuiz : onEditProfile}
              style={({ pressed }) => [
                styles.primaryCta,
                pressed ? styles.pressed : null
              ]}
            >
              <Text style={styles.primaryCtaText}>
                {isStylePage
                  ? styleProfile?.isRecorded
                    ? "Redo style reference"
                    : "Start style swipe"
                  : pageCopy.cta}
              </Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.detailCards}>
          {(isStylePage && styleProfile?.isRecorded
            ? [
                {
                  body: hasLikedStyles
                    ? likedStyleLabels.join(", ")
                    : "Your swipe pattern is saved even without a single dominant style label.",
                  icon: "heart" as keyof typeof Feather.glyphMap,
                  title: "Looks you leaned toward"
                },
                {
                  body: "These signals help Mira rank outfits by taste before showing them to you.",
                  icon: "zap" as keyof typeof Feather.glyphMap,
                  title: "How Mira uses it"
                },
                {
                  body: "Redo the swipe flow anytime when your mood, season or style direction changes.",
                  icon: "refresh-cw" as keyof typeof Feather.glyphMap,
                  title: "Change reference"
                }
              ]
            : pageCopy.items
          ).map((item) => (
              <DetailInfoCard
                body={item.body}
                icon={item.icon}
                key={item.title}
                title={item.title}
              />
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function AccountScreen({
  user,
  appVersion,
  actions,
  closetItemCount,
  initialPage,
  onInternalViewChange,
  onOverlayActiveChange,
  styleProfile
}: AccountScreenProps) {
  const [activePage, setActivePage] = useState<AccountInternalPage | null>(
    initialPage ?? null
  );
  const [addresses, setAddresses] = useState<SavedAddress[]>(savedAddresses);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    if (initialPage) {
      setActivePage(initialPage);
    }
  }, [initialPage]);

  useEffect(() => {
    const internalBackgroundColor =
      activePage === "addresses" || activePage === "addAddress"
        ? colors.background
        : colors.surfaceTertiary;

    onInternalViewChange?.(Boolean(activePage), internalBackgroundColor);

    return () => onInternalViewChange?.(false, colors.background);
  }, [activePage, onInternalViewChange]);

  const handleOpenStyle = () => {
    if (styleProfile?.isRecorded || !actions?.onStartStyleQuiz) {
      setActivePage("style");
      return;
    }

    actions.onStartStyleQuiz();
  };

  const minimumClosetItemsForMira = 3;
  const hasCompletedStyleProfile = Boolean(styleProfile?.isRecorded);
  const hasEnoughClosetItems =
    closetItemCount === undefined ||
    closetItemCount >= minimumClosetItemsForMira;
  const shouldShowProfilePrompt =
    !hasCompletedStyleProfile || !hasEnoughClosetItems;
  const promptTargetsStyleProfile = !hasCompletedStyleProfile;
  const remainingClosetItems = Math.max(
    minimumClosetItemsForMira - (closetItemCount ?? 0),
    0
  );
  const closetPromptCopy =
    remainingClosetItems <= 1
      ? "Add one more piece you love so Mira can build looks from what you already own."
      : `Add ${remainingClosetItems} pieces you love so Mira can build looks from what you already own.`;

  const handleProfilePromptPress = () => {
    if (promptTargetsStyleProfile) {
      handleOpenStyle();
      return;
    }

    actions?.onOpenCloset?.();
  };

  const handleOpenEditProfile = () => {
    setActivePage("editProfile");
  };

  const handleSaveProfile = (profile: EditableProfile) => {
    actions?.onUpdateProfile?.(profile);
    setActivePage(null);
  };

  const handleSaveAddress = (address: AddressFormPayload) => {
    const fullAddress = [
      address.houseNumber,
      address.addressLine,
      address.locality,
      address.city,
      address.state,
      address.pincode
    ]
      .filter(Boolean)
      .join(", ");

    setAddresses((currentAddresses) => [
      {
        address: fullAddress || "Address details added",
        distance: "",
        icon: address.type === "Home" ? "home" : "map-pin",
        id: `address-${Date.now()}`,
        label: address.type,
        phone: address.mobile ? `+91 ${address.mobile}` : undefined
      },
      ...currentAddresses
    ]);
    setActivePage("addresses");
  };

  const youRows: Array<{
    icon: keyof typeof Feather.glyphMap;
    key: string;
    onPress?: () => void;
    subtitle: string;
    title: string;
  }> = [
    {
      icon: "sliders",
      key: "style-profile",
      onPress: handleOpenStyle,
      subtitle: "Vibes, fit preferences and occasions",
      title: "Your style"
    },
    {
      icon: "activity",
      key: "measurements",
      onPress:
        actions?.onOpenSizeDetails ?? (() => setActivePage("measurements")),
      subtitle: "Height, weight and body data used for try-on",
      title: "Your measurements"
    },
    {
      icon: "user",
      key: "avatar",
      onPress: () => setActivePage("avatar"),
      subtitle: "Photo used for virtual try-on",
      title: "Your avatar"
    }
  ];

  const activityRows: Array<{
    icon: keyof typeof Feather.glyphMap;
    key: string;
    onPress?: () => void;
    subtitle: string;
    title: string;
  }> = [
    {
      icon: "heart",
      key: "wishlist",
      onPress: () => setActivePage("wishlist"),
      subtitle: "Saved looks, products and shared outfits",
      title: "Saved"
    },
    {
      icon: "star",
      key: "closet-favourites",
      onPress: () => setActivePage("closetFavourites"),
      subtitle: "Closet pieces to style and repeat",
      title: "Closet Favourites"
    },
    {
      icon: "shopping-bag",
      key: "orders",
      onPress: actions?.onOpenOrders,
      subtitle: "Purchase history and delivery updates",
      title: "Orders"
    }
  ];

  const supportRows: Array<{
    icon: keyof typeof Feather.glyphMap;
    key: string;
    onPress?: () => void;
    subtitle: string;
    title: string;
  }> = [
    {
      icon: "map-pin",
      key: "addresses",
      onPress: () => setActivePage("addresses"),
      subtitle: "Home, work and delivery details",
      title: "Saved addresses"
    },
    {
      icon: "credit-card",
      key: "payments",
      onPress: actions?.onOpenPayments,
      subtitle: "Saved cards and payment options",
      title: "Payments"
    },
    {
      icon: "help-circle",
      key: "help",
      onPress: actions?.onOpenHelp,
      subtitle: "Support for orders, fit and try-on",
      title: "Help & support"
    },
    {
      icon: "shield",
      key: "privacy",
      onPress: () => setActivePage("privacy"),
      subtitle: "Data, permissions, terms and policies",
      title: "Privacy & policy"
    }
  ];

  if (activePage === "wishlist") {
    return (
      <SavedScreen
        onBack={() => setActivePage(null)}
        onExplore={actions?.onOpenExplore}
        onTryOn={actions?.onStartTryOn}
      />
    );
  }

  if (activePage === "closetFavourites") {
    return (
      <ClosetFavouritesScreen
        onBack={() => setActivePage(null)}
        onOpenCloset={actions?.onOpenCloset}
        onStartTryOn={actions?.onStartTryOn}
      />
    );
  }

  if (activePage === "editProfile") {
    return (
      <AccountEditProfileScreen
        initialProfile={{
          anniversary: user.anniversary,
          avatarUri: user.avatarUri,
          dateOfBirth: user.dateOfBirth,
          email: user.email ?? "",
          fashionInterest: user.fashionInterest,
          name: user.name,
          phone: user.phone
        }}
        onBack={() => setActivePage(null)}
        onOverlayActiveChange={onOverlayActiveChange}
        onSave={handleSaveProfile}
      />
    );
  }

  if (activePage === "addresses") {
    return (
      <AccountAddressesScreen
        addresses={addresses}
        onAddAddress={() => setActivePage("addAddress")}
        onBack={() => setActivePage(null)}
      />
    );
  }

  if (activePage === "addAddress") {
    return (
      <AccountAddAddressScreen
        onBack={() => setActivePage("addresses")}
        onSave={handleSaveAddress}
      />
    );
  }

  if (activePage) {
    return (
      <AccountDetailPage
        onBack={() => setActivePage(null)}
        onEditProfile={handleOpenEditProfile}
        onStartStyleQuiz={actions?.onStartStyleQuiz}
        page={activePage}
        styleProfile={styleProfile}
        user={user}
      />
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <AccountProfileCard
            avatarUri={user.avatarUri}
            email={user.email}
            name={user.name}
            onEdit={handleOpenEditProfile}
            phoneNumber={user.phoneNumber}
          />

          {shouldShowProfilePrompt ? (
            <View style={styles.promptCard}>
              <View style={styles.promptIcon}>
                <Feather
                  color={colors.text}
                  name={promptTargetsStyleProfile ? "zap" : "package"}
                  size={19}
                />
              </View>
              <View style={styles.promptCopy}>
                <Text style={styles.promptTitle}>
                  Help Mira style you better
                </Text>
                <Text style={styles.promptBody}>
                  {promptTargetsStyleProfile
                    ? "Add fit notes and style cues so outfits feel closer to what you actually wear."
                    : closetPromptCopy}
                </Text>
              </View>
              <Pressable
                accessibilityLabel={
                  promptTargetsStyleProfile
                    ? "Complete style profile"
                    : "Add closet pieces"
                }
                accessibilityRole="button"
                onPress={handleProfilePromptPress}
                style={({ pressed }) => [
                  styles.primaryCta,
                  pressed ? styles.pressed : null
                ]}
              >
                <Text style={styles.primaryCtaText}>
                  {promptTargetsStyleProfile
                    ? "Complete style profile"
                    : "Add 3 pieces you love"}
                </Text>
              </Pressable>
            </View>
          ) : null}
        </View>

        <View style={styles.body}>
          <View style={styles.section}>
            <View style={styles.rows}>
              {youRows.map((row) => (
                <AccountMenuRow
                  icon={row.icon}
                  key={row.key}
                  onPress={row.onPress}
                  subtitle={row.subtitle}
                  title={row.title}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.rows}>
              {activityRows.map((row) => (
                <AccountMenuRow
                  icon={row.icon}
                  key={row.key}
                  onPress={row.onPress}
                  subtitle={row.subtitle}
                  title={row.title}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.rows}>
              <AccountPreferenceRow
                icon="bell"
                onValueChange={setNotificationsEnabled}
                subtitle="Style alerts, price drops and new looks"
                title="Notifications"
                value={notificationsEnabled}
              />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.rows}>
              {supportRows.map((row) => (
                <AccountMenuRow
                  icon={row.icon}
                  key={row.key}
                  onPress={row.onPress}
                  subtitle={row.subtitle}
                  title={row.title}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.footer}>
              <Pressable
                accessibilityLabel="Logout"
                accessibilityRole="button"
                onPress={actions?.onLogout}
                style={({ pressed }) => [
                  styles.logout,
                  pressed ? styles.pressed : null
                ]}
              >
                <Text style={styles.logoutText}>Logout</Text>
              </Pressable>
              <Text style={styles.version}>Version {appVersion}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addAddressCta: {
    alignItems: "center",
    backgroundColor: colors.inverse,
    borderRadius: radii.button,
    flexDirection: "row",
    gap: spacing.sm,
    height: 52,
    justifyContent: "center"
  },
  addAddressCtaText: {
    ...typography.button,
    color: colors.inverseText
  },
  addAddressContent: {
    backgroundColor: colors.background,
    flexGrow: 1,
    gap: spacing.xl,
    paddingBottom: 132,
    paddingHorizontal: spacing.screen,
    paddingTop: appScreenTopPadding
  },
  addAddressFooter: {
    backgroundColor: colors.background,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md
  },
  addAddressSaveButton: {
    alignItems: "center",
    backgroundColor: colors.inverse,
    borderRadius: radii.button,
    height: 52,
    justifyContent: "center"
  },
  addAddressSaveButtonDisabled: {
    opacity: 0.42
  },
  addAddressSaveText: {
    ...typography.button,
    color: colors.inverseText
  },
  addressActions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md
  },
  addressBackButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: spacing.sm,
    paddingVertical: spacing.xs
  },
  addressBody: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20
  },
  addressCard: {
    alignItems: "flex-start",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg
  },
  addressContent: {
    backgroundColor: colors.background,
    flexGrow: 1,
    gap: spacing.lg,
    paddingBottom: 108,
    paddingHorizontal: spacing.screen,
    paddingTop: appScreenTopPadding
  },
  addressCopy: {
    flex: 1,
    minWidth: 0
  },
  addressDistance: {
    alignItems: "center",
    gap: spacing.xs,
    width: 48
  },
  addressDistanceText: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center"
  },
  addressEmpty: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    gap: spacing.md,
    justifyContent: "center",
    paddingHorizontal: 0,
    paddingVertical: spacing.xxl
  },
  addressEmptyBody: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center"
  },
  addressEmptyCopy: {
    alignItems: "center",
    gap: spacing.xs,
    maxWidth: 328
  },
  addressEmptyCta: {
    alignSelf: "stretch",
    marginTop: spacing.sm
  },
  addressEmptyTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 17,
    lineHeight: 22,
    textAlign: "center"
  },
  addressHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  addressCheckbox: {
    alignItems: "center",
    borderColor: colors.borderStrong,
    borderRadius: 6,
    borderWidth: 1,
    height: 22,
    justifyContent: "center",
    width: 22
  },
  addressCheckboxGroup: {
    gap: spacing.md
  },
  addressCheckboxRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 32
  },
  addressCheckboxSelected: {
    backgroundColor: colors.inverse,
    borderColor: colors.inverse
  },
  addressCheckboxText: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 20
  },
  addressDivider: {
    backgroundColor: colors.border,
    height: StyleSheet.hairlineWidth,
    marginVertical: spacing.xs
  },
  addressFieldHalf: {
    flex: 1,
    minWidth: 0
  },
  addressFieldRow: {
    flexDirection: "row",
    gap: spacing.md
  },
  addressFormField: {
    gap: spacing.sm
  },
  addressFormFields: {
    gap: spacing.lg
  },
  addressFormLabel: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 17
  },
  addressIconButton: {
    alignItems: "center",
    backgroundColor: colors.surfaceTertiary,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  addressIconShell: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  addressInput: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 20,
    minWidth: 0,
    padding: 0
  },
  addressInputShell: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 56,
    paddingHorizontal: spacing.md
  },
  addressKeyboard: {
    flex: 1
  },
  addressLabel: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 17,
    lineHeight: 22,
    marginBottom: spacing.xs
  },
  addressList: {
    gap: spacing.md
  },
  addressPhone: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    marginTop: spacing.sm
  },
  addressSearch: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 52,
    paddingHorizontal: spacing.lg
  },
  addressSearchInput: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 20,
    padding: 0
  },
  addressTitle: {
    ...typography.screenTitle,
    color: colors.text,
    flex: 1
  },
  addressScreen: {
    backgroundColor: colors.background,
    flex: 1
  },
  addressRadio: {
    alignItems: "center",
    borderColor: colors.borderStrong,
    borderRadius: radii.pill,
    borderWidth: 1,
    height: 20,
    justifyContent: "center",
    width: 20
  },
  addressRadioDot: {
    backgroundColor: colors.text,
    borderRadius: radii.pill,
    height: 8,
    width: 8
  },
  addressRadioSelected: {
    backgroundColor: "transparent",
    borderColor: colors.text
  },
  addressTypeChip: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 32,
    paddingRight: spacing.xl,
    paddingVertical: spacing.xs
  },
  addressTypeChipSelected: {
    backgroundColor: "transparent"
  },
  addressTypeRow: {
    flexDirection: "row",
    gap: spacing.lg
  },
  addressTypeText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 20
  },
  addressTypeTextSelected: {
    color: colors.text
  },
  avatarHero: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.imageSurface,
    borderRadius: 56,
    height: 112,
    justifyContent: "center",
    overflow: "hidden",
    width: 112
  },
  avatarHeroImage: {
    height: "100%",
    width: "100%"
  },
  backButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  body: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    flexGrow: 1,
    gap: spacing.lg,
    paddingBottom: 108,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg
  },
  content: {
    flexGrow: 1,
    gap: spacing.lg,
    paddingBottom: 0,
    paddingTop: appScreenTopPadding
  },
  detailCards: {
    gap: spacing.md
  },
  detailContent: {
    backgroundColor: colors.background,
    flexGrow: 1,
    gap: spacing.xl,
    paddingBottom: 108,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.sm
  },
  detailHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md
  },
  detailHero: {
    backgroundColor: colors.surfaceTertiary,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.md,
    padding: spacing.lg
  },
  detailInfoBody: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18
  },
  detailInfoCard: {
    alignItems: "center",
    backgroundColor: colors.surfaceTertiary,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md
  },
  detailInfoCopy: {
    flex: 1,
    gap: spacing.xs
  },
  detailInfoIcon: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  detailInfoTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 15,
    lineHeight: 19
  },
  detailIntro: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21
  },
  detailTitle: {
    ...typography.displayHeadline,
    color: colors.text,
    flex: 1
  },
  footer: {
    alignItems: "center",
    gap: spacing.md
  },
  header: {
    gap: spacing.lg,
    paddingHorizontal: spacing.screen
  },
  logout: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.button,
    borderWidth: 1,
    height: 50,
    justifyContent: "center"
  },
  logoutText: {
    ...typography.button,
    color: colors.text
  },
  pressed: {
    opacity: 0.6
  },
  rows: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden"
  },
  screen: {
    backgroundColor: colors.surfaceTertiary,
    flex: 1
  },
  section: {
    gap: spacing.md
  },
  primaryCta: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: colors.inverse,
    borderRadius: radii.button,
    height: 48,
    justifyContent: "center"
  },
  primaryCtaText: {
    ...typography.button,
    color: colors.inverseText
  },
  promptBody: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18
  },
  promptCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.md,
    padding: spacing.md
  },
  promptCopy: {
    gap: spacing.xs
  },
  promptIcon: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  promptTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 17,
    lineHeight: 22
  },
  styleChip: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  styleChipBlock: {
    gap: spacing.sm
  },
  styleChipLabel: {
    color: colors.soft,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 0.5,
    lineHeight: 14,
    textTransform: "uppercase"
  },
  styleChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  styleChipText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 17
  },
  styleProgressCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.md
  },
  styleProgressLabel: {
    color: colors.soft,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 0.5,
    lineHeight: 14,
    textTransform: "uppercase"
  },
  styleProgressValue: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 23,
    marginTop: spacing.xs
  },
  styleStatusBody: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18
  },
  styleStatusCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0
  },
  styleStatusHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md
  },
  styleStatusIcon: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radii.pill,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  styleStatusTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 23
  },
  version: {
    ...typography.caption,
    color: colors.soft
  }
});
