import * as ImagePicker from "expo-image-picker";
import { Alert, Image, type ImageSourcePropType } from "react-native";

export type SamplePeoplePhoto = {
  accessibilityLabel: string;
  id: string;
  source: ImageSourcePropType;
  uri: string;
};

const localPeoplePhoto = (
  id: string,
  accessibilityLabel: string,
  source: ImageSourcePropType
): SamplePeoplePhoto => ({
  accessibilityLabel,
  id,
  source,
  uri: Image.resolveAssetSource(source).uri
});

export const samplePeoplePhotos: SamplePeoplePhoto[] = [
  localPeoplePhoto(
    "maje-white-blazer",
    "Full body photo in a white blazer",
    require("../../../../Images/Sandro_SFPPA01907-E190_F_1.jpg")
  ),
  localPeoplePhoto(
    "maje-white-top",
    "Full body photo in a white top",
    require("../../../../Images/Sandro_SFPBL01261-16_F_1.jpg")
  ),
  localPeoplePhoto(
    "maje-orange-dress",
    "Full body photo in an orange dress",
    require("../../../../Images/Maje_MFPRO04928-0140_F_1.webp")
  ),
  localPeoplePhoto(
    "sandro-brown-jacket-shorts",
    "Full body photo in a brown jacket and shorts",
    require("../../../../Images/Sandro_SFPBL01332-751_F_1.webp")
  ),
  localPeoplePhoto(
    "maje-black-pants",
    "Full body photo in black pants",
    require("../../../../Images/Maje_MFPPA00802-0101_F_1.jpg")
  ),
  localPeoplePhoto(
    "maje-white-red-print-dress",
    "Full body photo in a white dress with red print",
    require("../../../../Images/Maje_MFPRO04821-0183_F_1.jpg")
  ),
  localPeoplePhoto(
    "maje-cream-layered-outfit",
    "Full body photo in a cream layered outfit",
    require("../../../../Images/Maje_MFPCA00714-0183_F_1.webp")
  ),
  localPeoplePhoto(
    "maje-beige-layered-outfit",
    "Full body photo in a beige layered outfit",
    require("../../../../Images/Maje_MFPCA00729-0140_F_1.jpg")
  ),
  localPeoplePhoto(
    "maje-light-knit-outfit",
    "Full body photo in a light knit outfit",
    require("../../../../Images/Maje_MFPCM00760-0183_F_1.webp")
  ),
  localPeoplePhoto(
    "maje-white-dress",
    "Full body photo in a white dress",
    require("../../../../Images/Maje_MFPRO04263-10_F_1.jpg")
  ),
  localPeoplePhoto(
    "maje-black-dress",
    "Full body photo in a black dress",
    require("../../../../Images/Maje_MFPRO04615-2517_F_1.jpg")
  ),
  localPeoplePhoto(
    "maje-navy-dress",
    "Full body photo in a navy dress",
    require("../../../../Images/Maje_MFPRO04878-G005_F_1.jpg")
  ),
  localPeoplePhoto(
    "maje-blue-dress",
    "Full body photo in a blue dress",
    require("../../../../Images/Maje_MFPRO04895-L031_F_1.jpg")
  ),
  localPeoplePhoto(
    "maje-striped-top",
    "Full body photo in a striped top",
    require("../../../../Images/Maje_MFPTS01040-G005_F_1.webp")
  ),
  localPeoplePhoto(
    "sandro-white-top-alt",
    "Full body photo in a white top",
    require("../../../../Images/Sandro_SFPBL01274-13_F_1.jpg")
  ),
  localPeoplePhoto(
    "sandro-white-top-alt-two",
    "Full body photo in a white top",
    require("../../../../Images/Sandro_SFPBL01274-13_F_1 (1).jpg")
  ),
  localPeoplePhoto(
    "sandro-light-blouse",
    "Full body photo in a light blouse",
    require("../../../../Images/Sandro_SFPBL01284-G023_F_1.webp")
  ),
  localPeoplePhoto(
    "sandro-brown-jacket-shorts-alt",
    "Full body photo in a brown jacket and shorts",
    require("../../../../Images/Sandro_SFPBL01332-751_F_1 (1).webp")
  ),
  localPeoplePhoto(
    "sandro-brown-jacket-shorts-alt-two",
    "Full body photo in a brown jacket and shorts",
    require("../../../../Images/Sandro_SFPBL01332-751_F_1 (2).webp")
  ),
  localPeoplePhoto(
    "mens-black-outfit",
    "Full body photo in a black outfit",
    require("../../../../Images/man.webp")
  )
];

export async function selectCameraPhoto(onPhotoSelected: (uri: string) => void) {
  try {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9
    });

    if (!result.canceled && result.assets[0]?.uri) {
      onPhotoSelected(result.assets[0].uri);
    }
  } catch {
    Alert.alert(
      "Photo unavailable",
      "Try another photo or use one of the examples."
    );
  }
}
