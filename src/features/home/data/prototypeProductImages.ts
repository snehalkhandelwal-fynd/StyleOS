import { Image } from "react-native";

const assetUri = (asset: number) => Image.resolveAssetSource(asset).uri;

export const prototypeProductImages = {
  maje: {
    beigeCrochetDress: assetUri(
      require("../../../../Images/Maje_MFPCA00729-0140_F_1.jpg")
    ),
    blueScarfTrousers: assetUri(
      require("../../../../Images/Maje_MFPTS01040-G005_F_1.webp")
    ),
    greenDenimTop: assetUri(
      require("../../../../Images/Maje_MFPRO04821-0183_F_1.jpg")
    ),
    ivoryMiniDress: assetUri(
      require("../../../../Images/Maje_MFPRO04263-10_F_1.jpg")
    ),
    khakiTrenchSkirt: assetUri(
      require("../../../../Images/Maje_MFPCM00760-0183_F_1.webp")
    ),
    navyCoatDress: assetUri(
      require("../../../../Images/Maje_MFPRO04878-G005_F_1.jpg")
    ),
    oliveCapeMini: assetUri(
      require("../../../../Images/Maje_MFPCA00714-0183_F_1.webp")
    ),
    pinkRelaxedSet: assetUri(
      require("../../../../Images/Maje_MFPRO04895-L031_F_1.jpg")
    ),
    sheerPartyDress: assetUri(
      require("../../../../Images/Maje_MFPRO04615-2517_F_1.jpg")
    ),
    stripedScarfDenim: assetUri(
      require("../../../../Images/Maje_MFPPA00802-0101_F_1.jpg")
    ),
    tanHoodedJacket: assetUri(
      require("../../../../Images/Maje_MFPRO04928-0140_F_1.webp")
    )
  },
  sandro: {
    beigeTrench: assetUri(
      require("../../../../Images/Sandro_SFPBL01332-751_F_1.webp")
    ),
    brownJacket: assetUri(
      require("../../../../Images/Sandro_SFPBL01274-13_F_1.jpg")
    ),
    denimJacket: assetUri(
      require("../../../../Images/Sandro_SFPBL01284-G023_F_1.webp")
    ),
    navyTailoredSet: assetUri(
      require("../../../../Images/Sandro_SFPBL01261-16_F_1.jpg")
    ),
    whitePinstripeSuit: assetUri(
      require("../../../../Images/Sandro_SFPPA01907-E190_F_1.jpg")
    )
  },
  men: {
    tailoredLook: assetUri(require("../../../../Images/man.webp"))
  }
} as const;

export const structuredProductImages = [
  prototypeProductImages.sandro.navyTailoredSet,
  prototypeProductImages.sandro.whitePinstripeSuit,
  prototypeProductImages.sandro.beigeTrench,
  prototypeProductImages.sandro.brownJacket,
  prototypeProductImages.sandro.denimJacket
] as const;

export const relaxedProductImages = [
  prototypeProductImages.maje.greenDenimTop,
  prototypeProductImages.maje.pinkRelaxedSet,
  prototypeProductImages.maje.beigeCrochetDress,
  prototypeProductImages.maje.ivoryMiniDress,
  prototypeProductImages.maje.khakiTrenchSkirt,
  prototypeProductImages.maje.navyCoatDress,
  prototypeProductImages.maje.tanHoodedJacket,
  prototypeProductImages.maje.sheerPartyDress,
  prototypeProductImages.maje.stripedScarfDenim,
  prototypeProductImages.maje.blueScarfTrousers,
  prototypeProductImages.maje.oliveCapeMini
] as const;

export const prototypeGalleryImages = [
  ...structuredProductImages,
  ...relaxedProductImages
] as const;
