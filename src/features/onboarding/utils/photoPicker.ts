import * as ImagePicker from "expo-image-picker";
import { ActionSheetIOS, Alert, Platform } from "react-native";

type PhotoSource = "camera" | "gallery";

type OpenPhotoSourceDrawerOptions = {
  onPhotoSelected: (uri: string) => void;
};

async function selectPhoto(
  source: PhotoSource,
  onPhotoSelected: (uri: string) => void
) {
  try {
    const permission =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: false,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.9
          })
        : await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.9
          });

    if (!result.canceled && result.assets[0]?.uri) {
      onPhotoSelected(result.assets[0].uri);
    }
  } catch {
    Alert.alert("Photo unavailable", "Choose a photo from your gallery instead.");
  }
}

export function openPhotoSourceDrawer({
  onPhotoSelected
}: OpenPhotoSourceDrawerOptions) {
  if (Platform.OS === "ios") {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        cancelButtonIndex: 2,
        options: ["Upload photo", "Take new photo", "Cancel"],
        userInterfaceStyle: "dark"
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          selectPhoto("gallery", onPhotoSelected);
        }

        if (buttonIndex === 1) {
          selectPhoto("camera", onPhotoSelected);
        }
      }
    );
    return;
  }

  Alert.alert("Add your photo", undefined, [
    { text: "Upload photo", onPress: () => selectPhoto("gallery", onPhotoSelected) },
    { text: "Take new photo", onPress: () => selectPhoto("camera", onPhotoSelected) },
    { style: "cancel", text: "Cancel" }
  ]);
}
