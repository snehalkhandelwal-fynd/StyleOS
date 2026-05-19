import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { NextCircleButton } from "../components/NextCircleButton";
import { prototypeProductImages } from "../features/home/data/prototypeProductImages";
import { colors, spacing, typography } from "../theme";

export type FashionInterest = "women" | "men";

type FashionInterestScreenProps = {
  interest: FashionInterest | null;
  onBack: () => void;
  onChangeInterest: (interest: FashionInterest) => void;
  onContinue: () => void;
};

const options: Array<{
  id: FashionInterest;
  image: string;
  label: string;
}> = [
  {
    id: "women",
    image: prototypeProductImages.maje.pinkRelaxedSet,
    label: "Women’s clothing"
  },
  {
    id: "men",
    image: prototypeProductImages.men.tailoredLook,
    label: "Men’s clothing"
  }
];

function SelectionCheck() {
  return (
    <View style={styles.selectionCheck}>
      <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
        <Path
          d="M3.2 7.1L5.8 9.7L10.9 4.3"
          stroke={colors.inverseText}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.6}
        />
      </Svg>
    </View>
  );
}

export function FashionInterestScreen({
  interest,
  onChangeInterest,
  onContinue
}: FashionInterestScreenProps) {
  return (
    <View style={styles.screen}>
      <View style={styles.headerSpacer} />

      <View style={styles.content}>
        <Text style={styles.title}>What do you want to explore?</Text>
        <Text style={styles.reassurance}>You can change this later</Text>

        <View style={styles.options}>
          {options.map((option) => {
            const isSelected = option.id === interest;

            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                key={option.id}
                onPress={() => onChangeInterest(option.id)}
                style={({ pressed }) => [
                  styles.option,
                  isSelected ? styles.optionSelected : null,
                  pressed ? styles.pressed : null
                ]}
              >
                <Image
                  source={{ uri: option.image }}
                  style={styles.optionImage}
                />
                <View style={styles.optionShade} />
                <View style={styles.optionCopy}>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.optionText}
                  >
                    {option.label}
                  </Text>
                </View>
                {isSelected ? <SelectionCheck /> : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <NextCircleButton
          currentStep={3}
          disabled={!interest}
          onPress={onContinue}
          totalSteps={5}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing.screen,
    paddingTop: 24
  },
  footer: {
    alignItems: "flex-end",
    paddingBottom: 56,
    paddingHorizontal: spacing.screen
  },
  headerSpacer: {
    height: 48
  },
  option: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    height: 244,
    overflow: "hidden",
    position: "relative"
  },
  optionCopy: {
    bottom: spacing.lg,
    left: spacing.lg,
    position: "absolute",
    right: spacing.sm,
    zIndex: 2
  },
  optionImage: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    resizeMode: "cover",
    width: "100%"
  },
  optionSelected: {
    borderColor: colors.text,
    borderWidth: 2,
    transform: [{ scale: 1.02 }]
  },
  optionShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.scrimMedium,
    zIndex: 1
  },
  optionText: {
    color: colors.inverseText,
    fontFamily: typography.sectionHeading.fontFamily,
    fontSize: 18,
    lineHeight: 23
  },
  options: {
    flexDirection: "row",
    gap: spacing.lg,
    marginTop: 24
  },
  pressed: {
    opacity: 0.72
  },
  screen: {
    flex: 1
  },
  selectionCheck: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: 999,
    height: 24,
    justifyContent: "center",
    position: "absolute",
    right: 12,
    top: 12,
    width: 24,
    zIndex: 3
  },
  reassurance: {
    color: colors.soft,
    marginTop: spacing.sm,
    textAlign: "left",
    ...typography.caption
  },
  title: {
    color: colors.text,
    marginTop: 28,
    ...typography.h2
  }
});
