import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  type TextStyle,
  View
} from "react-native";

import { PrimaryButton } from "../../../components/PrimaryButton";
import { SecondaryButton } from "../../../components/SecondaryButton";
import { colors, fonts, radii, spacing } from "../../../theme";

type LocationAccessScreenProps = {
  address: string;
  onChangeAddress: (address: string) => void;
  onContinue: () => void;
};

const webTextInputReset =
  Platform.OS === "web"
    ? ({
        outlineStyle: "none",
        outlineWidth: 0
      } as unknown as TextStyle)
    : null;

const currentLocationAddress = "MIDC, Andheri East, Mumbai 400096";
const currentLocationTitle = "Vijay Diamond";
const currentLocationMapAddress =
  "B Cross Road, Marol, Mumbai 400093";
const manualLocationTitle = "MIDC, Andheri East";
const manualLocationMapAddress = "MIDC, Andheri East, Mumbai 400096";
type MapMode = "current" | "manual";

function formatResolvedAddress(place?: Location.LocationGeocodedAddress) {
  if (!place) {
    return currentLocationAddress;
  }

  const area =
    place.district ??
    place.subregion ??
    place.street ??
    place.name ??
    place.city;
  const city = place.city ?? place.region;
  const postalCode = place.postalCode;

  const locationParts = [
    area,
    city && city !== area ? city : null,
    postalCode
  ].filter(Boolean);

  return locationParts.length > 0
    ? locationParts.join(", ").replace(/, ([0-9]{5,6})$/, " $1")
    : currentLocationAddress;
}

export function LocationAccessScreen({
  address,
  onChangeAddress,
  onContinue
}: LocationAccessScreenProps) {
  const [mapMode, setMapMode] = useState<MapMode | null>(null);
  const [isResolvingLocation, setIsResolvingLocation] = useState(false);
  const [mapAddressTitle, setMapAddressTitle] = useState(manualLocationTitle);
  const [mapAddress, setMapAddress] = useState(manualLocationMapAddress);
  const [deliveryDetails, setDeliveryDetails] = useState("");

  const handleUseCurrentLocation = async () => {
    if (isResolvingLocation) {
      return;
    }

    setIsResolvingLocation(true);

    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        Alert.alert(
          "Location permission needed",
          "Allow location access to see outfits available near you."
        );
        return;
      }

      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });

      let resolvedAddress = currentLocationAddress;

      try {
        const [place] = await Location.reverseGeocodeAsync({
          latitude: currentPosition.coords.latitude,
          longitude: currentPosition.coords.longitude
        });
        resolvedAddress = formatResolvedAddress(place);
      } catch {
        resolvedAddress = currentLocationAddress;
      }

      onChangeAddress(resolvedAddress);
      onContinue();
    } catch {
      Alert.alert(
        "Couldn’t get your location",
        "Please try again or enter your pincode instead."
      );
    } finally {
      setIsResolvingLocation(false);
    }
  };

  const handleAddManualAddress = () => {
    setMapAddressTitle(manualLocationTitle);
    setMapAddress(manualLocationMapAddress);
    setMapMode("manual");
  };

  const handleUseMapCurrentLocation = async () => {
    if (isResolvingLocation) {
      return;
    }

    setIsResolvingLocation(true);

    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        Alert.alert(
          "Location permission needed",
          "Allow location access to use your current delivery location."
        );
        return;
      }

      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });

      let resolvedAddress = currentLocationAddress;

      try {
        const [place] = await Location.reverseGeocodeAsync({
          latitude: currentPosition.coords.latitude,
          longitude: currentPosition.coords.longitude
        });
        resolvedAddress = formatResolvedAddress(place);
      } catch {
        resolvedAddress = currentLocationAddress;
      }

      setMapAddressTitle("Current location");
      setMapAddress(resolvedAddress);
    } catch {
      Alert.alert(
        "Couldn’t get your location",
        "Please search for your address or try again."
      );
    } finally {
      setIsResolvingLocation(false);
    }
  };

  const handleConfirmCurrentLocation = () => {
    const details = deliveryDetails.trim();
    onChangeAddress(
      details
        ? `${mapAddressTitle}, ${details}, ${mapAddress}`
        : `${mapAddressTitle}, ${mapAddress}`
    );
    onContinue();
  };

  if (mapMode) {
    return (
      <SafeAreaView style={styles.mapScreen}>
        <View style={styles.mapCanvas}>
          <View style={[styles.mapBlock, styles.mapBlockOne]} />
          <View style={[styles.mapBlock, styles.mapBlockTwo]} />
          <View style={[styles.mapBlock, styles.mapBlockThree]} />
          <View style={[styles.mapRoad, styles.mapRoadHorizontal]} />
          <View style={[styles.mapRoad, styles.mapRoadDiagonal]} />
          <View style={[styles.mapRoad, styles.mapRoadVertical]} />

          <View style={styles.mapTopBar}>
            <Pressable
              accessibilityLabel="Back to location options"
              accessibilityRole="button"
              onPress={() => setMapMode(null)}
              style={({ pressed }) => [
                styles.mapBackButton,
                pressed ? styles.pressed : null
              ]}
            >
              <Ionicons color={colors.text} name="arrow-back" size={18} />
            </Pressable>
            <View style={styles.mapSearch}>
              <TextInput
                autoCapitalize="words"
                cursorColor={colors.text}
                onChangeText={onChangeAddress}
                placeholder="Search an area or address"
                placeholderTextColor="#BBBBBB"
                selectionColor={colors.text}
                style={[styles.mapSearchInput, webTextInputReset]}
                value={mapMode === "manual" ? address : ""}
              />
              <Ionicons color={colors.soft} name="search" size={16} />
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            disabled={isResolvingLocation}
            onPress={handleUseMapCurrentLocation}
            style={({ pressed }) => [
              styles.useLocationButton,
              pressed ? styles.pressed : null
            ]}
          >
            <Ionicons color={colors.text} name="navigate" size={14} />
            <Text style={styles.useLocationButtonText}>
              {isResolvingLocation ? "Finding..." : "Use my location"}
            </Text>
          </Pressable>

          <View style={styles.mapPinCluster}>
            <View style={styles.mapPinHalo} />
            <Ionicons
              color={colors.text}
              name="location-sharp"
              size={40}
              style={styles.mapPin}
            />
          </View>

          <View style={styles.pinInstruction}>
            <Text style={styles.pinInstructionText}>
              Drag the map to move the pin
            </Text>
          </View>

          <View style={styles.mapSheet}>
            <Text style={styles.mapSheetLabel}>
              Place the pin at exact delivery location
            </Text>
            <View style={styles.mapAddressRow}>
              <Ionicons color={colors.text} name="location" size={24} />
              <View style={styles.mapAddressCopy}>
                <Text style={styles.mapAddressTitle}>{mapAddressTitle}</Text>
                <Text style={styles.mapAddressText}>{mapAddress}</Text>
              </View>
            </View>
            <View style={styles.deliveryDetails}>
              <Text style={styles.deliveryDetailsLabel}>
                Add delivery details
              </Text>
              <TextInput
                cursorColor={colors.text}
                onChangeText={setDeliveryDetails}
                placeholder="Flat no., building name, landmark"
                placeholderTextColor="#BBBBBB"
                selectionColor={colors.text}
                style={[styles.deliveryDetailsInput, webTextInputReset]}
                value={deliveryDetails}
              />
              {deliveryDetails.trim().length === 0 ? (
                <Text style={styles.deliveryDetailsHint}>
                  Adding details helps delivery riders find you faster
                </Text>
              ) : null}
            </View>
            <PrimaryButton
              label="Confirm location"
              onPress={handleConfirmCurrentLocation}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.accessScreen}>
      <View style={styles.accessContent}>
        <View style={styles.locationVisual}>
          <View style={[styles.locationBlock, styles.locationBlockOne]} />
          <View style={[styles.locationBlock, styles.locationBlockTwo]} />
          <View style={[styles.locationRoad, styles.locationRoadOne]} />
          <View style={[styles.locationRoad, styles.locationRoadTwo]} />
          <View style={styles.locationPinHalo}>
            <View style={styles.locationPin}>
              <Ionicons color={colors.inverseText} name="location" size={42} />
            </View>
          </View>
        </View>

        <View style={styles.accessCopy}>
          <Text style={styles.accessTitle}>Set your location</Text>
          <Text style={styles.accessSubtitle}>
            See outfits available near you, delivery options, and
            weather-friendly recommendations.
          </Text>
        </View>

        <View style={styles.accessActions}>
          <PrimaryButton
            disabled={isResolvingLocation}
            label={isResolvingLocation ? "Getting location..." : "Enable location"}
            onPress={handleUseCurrentLocation}
          />
          <SecondaryButton
            label="Enter pincode instead"
            onPress={handleAddManualAddress}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  accessActions: {
    gap: spacing.md,
    width: "100%"
  },
  accessContent: {
    alignItems: "center",
    flex: 1,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xl
  },
  accessCopy: {
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.xl,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md
  },
  accessScreen: {
    backgroundColor: colors.background,
    flex: 1
  },
  accessSubtitle: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    maxWidth: 320,
    textAlign: "center"
  },
  accessTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 22,
    lineHeight: 27.5,
    textAlign: "center"
  },
  content: {
    gap: 14,
    paddingTop: spacing.xxl
  },
  deliveryDetails: {
    gap: 8,
    marginBottom: 16,
    marginTop: 16
  },
  deliveryDetailsHint: {
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17
  },
  deliveryDetailsInput: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 0.5,
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 13,
    height: 44,
    paddingHorizontal: 14,
    paddingVertical: 0
  },
  deliveryDetailsLabel: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16
  },
  pinInstruction: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.background,
    borderRadius: radii.pill,
    bottom: 374,
    minHeight: 32,
    justifyContent: "center",
    paddingHorizontal: 14,
    position: "absolute",
    zIndex: 3,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: 0.06,
        shadowRadius: 8
      },
      android: {
        elevation: 2
      },
      default: {}
    })
  },
  pinInstructionText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16
  },
  useLocationButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 0.5,
    flexDirection: "row",
    gap: 6,
    height: 36,
    paddingHorizontal: 14,
    position: "absolute",
    right: spacing.screen,
    top: 120,
    zIndex: 3,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 8
      },
      android: {
        elevation: 2
      },
      default: {}
    })
  },
  useLocationButtonText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16
  },
  locationBlock: {
    backgroundColor: colors.surfaceTertiary,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    position: "absolute"
  },
  locationBlockOne: {
    height: 126,
    left: 26,
    top: 52,
    transform: [{ rotate: "-8deg" }],
    width: 120
  },
  locationBlockTwo: {
    height: 148,
    right: 22,
    top: 190,
    transform: [{ rotate: "10deg" }],
    width: 140
  },
  locationPin: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: radii.pill,
    height: 96,
    justifyContent: "center",
    width: 96
  },
  locationPinHalo: {
    alignItems: "center",
    backgroundColor: "rgba(10, 10, 10, 0.06)",
    borderRadius: radii.pill,
    height: 154,
    justifyContent: "center",
    left: "50%",
    marginLeft: -77,
    marginTop: -77,
    position: "absolute",
    top: "50%",
    width: 154
  },
  locationRoad: {
    backgroundColor: "rgba(232, 228, 220, 0.72)",
    borderRadius: radii.pill,
    position: "absolute"
  },
  locationRoadOne: {
    height: 52,
    left: -32,
    top: 230,
    transform: [{ rotate: "-17deg" }],
    width: "120%"
  },
  locationRoadTwo: {
    height: "120%",
    left: "46%",
    top: -30,
    transform: [{ rotate: "8deg" }],
    width: 44
  },
  locationVisual: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    height: "62%",
    maxHeight: 560,
    minHeight: 430,
    overflow: "hidden",
    width: "100%"
  },
  mapAddressCopy: {
    flex: 1,
    gap: spacing.xs
  },
  mapAddressRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: 12
  },
  mapAddressText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19
  },
  mapAddressTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 23
  },
  mapBackButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 0.5,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  mapBlock: {
    backgroundColor: "rgba(216, 212, 202, 0.44)",
    borderRadius: 4,
    position: "absolute"
  },
  mapBlockOne: {
    height: 96,
    left: 36,
    top: 170,
    transform: [{ rotate: "8deg" }],
    width: 124
  },
  mapBlockThree: {
    height: 108,
    right: 16,
    top: 360,
    transform: [{ rotate: "-18deg" }],
    width: 92
  },
  mapBlockTwo: {
    height: 116,
    right: 74,
    top: 238,
    transform: [{ rotate: "-10deg" }],
    width: 142
  },
  mapCanvas: {
    backgroundColor: colors.surfaceTertiary,
    flex: 1,
    overflow: "hidden"
  },
  mapPin: {
    position: "absolute",
    top: 0
  },
  mapPinCluster: {
    alignItems: "center",
    justifyContent: "center",
    left: "50%",
    marginLeft: -40,
    marginTop: -40,
    height: 80,
    position: "absolute",
    top: "43%",
    width: 80
  },
  mapPinHalo: {
    backgroundColor: "rgba(10,10,10,0.08)",
    borderRadius: radii.pill,
    height: 80,
    position: "absolute",
    width: 80
  },
  mapRoad: {
    backgroundColor: "rgba(232, 228, 220, 0.76)",
    position: "absolute"
  },
  mapRoadDiagonal: {
    height: 72,
    left: -60,
    top: 350,
    transform: [{ rotate: "-16deg" }],
    width: "130%"
  },
  mapRoadHorizontal: {
    height: 76,
    left: -20,
    top: 480,
    width: "120%"
  },
  mapRoadVertical: {
    height: "110%",
    left: 166,
    top: -40,
    transform: [{ rotate: "6deg" }],
    width: 58
  },
  mapScreen: {
    backgroundColor: colors.background,
    flex: 1
  },
  mapSearch: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 0.5,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 44,
    paddingHorizontal: 14
  },
  mapSearchInput: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 18,
    padding: 0
  },
  mapSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    bottom: 0,
    left: 0,
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 20,
    position: "absolute",
    right: 0,
    zIndex: 4
  },
  mapSheetLabel: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18
  },
  mapTopBar: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    left: spacing.screen,
    position: "absolute",
    right: spacing.screen,
    top: 60,
    zIndex: 2
  },
  pressed: {
    opacity: 0.72
  },
  primaryRow: {
    minHeight: 80
  },
  primaryRowText: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 23
  },
  row: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.lg,
    minHeight: 72,
    paddingHorizontal: spacing.xl
  },
  selectedRow: {
    borderColor: colors.borderStrong
  },
  selectedSuggestionText: {
    color: colors.text
  },
  suggestionText: {
    color: colors.muted,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 18,
    lineHeight: 23
  },
  suggestions: {
    gap: 14
  },
  continueButton: {
    marginTop: spacing.sm
  }
});
