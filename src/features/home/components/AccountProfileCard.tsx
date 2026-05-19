import { Feather } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "../../../theme";

/**
 * Header card on the Account screen showing the signed-in user.
 * Data contract:
 * - `name` is always rendered.
 * - `phoneNumber` / `email` rows render only when provided.
 * - `avatarUri` falls back to a placeholder glyph when absent.
 * - `onEdit` is optional; the edit affordance is hidden when omitted.
 */
type AccountProfileCardProps = {
  name: string;
  phoneNumber?: string;
  email?: string;
  avatarUri?: string;
  onEdit?: () => void;
};

export function AccountProfileCard({
  name,
  phoneNumber,
  email,
  avatarUri,
  onEdit
}: AccountProfileCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
        ) : (
          <Feather color={colors.soft} name="user" size={26} />
        )}
      </View>
      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>
        {phoneNumber ? (
          <Text numberOfLines={1} style={styles.detail}>
            {phoneNumber}
          </Text>
        ) : null}
        {email ? (
          <Text numberOfLines={1} style={styles.detail}>
            {email}
          </Text>
        ) : null}
      </View>
      {onEdit ? (
        <Pressable
          accessibilityLabel="Edit profile"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onEdit}
          style={({ pressed }) => [styles.edit, pressed ? styles.pressed : null]}
        >
          <Feather color={colors.text} name="edit-2" size={16} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    height: 56,
    justifyContent: "center",
    overflow: "hidden",
    width: 56
  },
  avatarImage: {
    height: 56,
    width: 56
  },
  card: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 2,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
    shadowColor: "#000000",
    shadowOffset: {
      height: 4,
      width: 0
    },
    shadowOpacity: 0.06,
    shadowRadius: 12
  },
  detail: {
    ...typography.caption,
    color: colors.muted
  },
  edit: {
    padding: spacing.xs
  },
  info: {
    flex: 1,
    gap: spacing.xs
  },
  name: {
    ...typography.cardTitle,
    color: colors.text
  },
  pressed: {
    opacity: 0.6
  }
});
