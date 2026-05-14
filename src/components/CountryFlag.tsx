import { Image, StyleSheet, Text, View } from "react-native";

type CountryFlagProps = {
  country?: string;
  flag: string;
};

export function CountryFlag({ country, flag }: CountryFlagProps) {
  if (country) {
    return (
      <Image
        accessibilityIgnoresInvertColors
        source={{
          uri: `https://flagcdn.com/w40/${country.toLowerCase()}.png`
        }}
        style={styles.flagImage}
      />
    );
  }

  return (
    <View style={styles.flagBox}>
      <Text style={styles.flag}>{flag}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flag: {
    fontSize: 22,
    lineHeight: 24
  },
  flagBox: {
    alignItems: "center",
    justifyContent: "center",
    width: 20
  },
  flagImage: {
    borderRadius: 10,
    height: 20,
    resizeMode: "cover",
    width: 20
  }
});
