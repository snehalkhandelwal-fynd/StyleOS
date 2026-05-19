import { Feather, FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import { colors, radii, spacing, typography } from "../../../theme";
import { AccountMenuRow } from "../components/AccountMenuRow";
import { AccountPreferenceRow } from "../components/AccountPreferenceRow";
import { AccountProfileCard } from "../components/AccountProfileCard";

export type SocialPlatform = "whatsapp" | "facebook" | "instagram";

export type AccountUser = {
  name: string;
  phoneNumber?: string;
  email?: string;
  avatarUri?: string;
};

/**
 * Navigation/intent callbacks for the Account screen. All are optional so
 * the screen can render before the engineer wires real destinations; an
 * unwired row simply stays inert.
 */
export type AccountActions = {
  onEditProfile?: () => void;
  onOpenOrders?: () => void;
  onOpenWishlists?: () => void;
  onOpenSizeDetails?: () => void;
  onOpenRewards?: () => void;
  onOpenHelp?: () => void;
  onOpenPayments?: () => void;
  onOpenSocial?: (platform: SocialPlatform) => void;
  onLogout?: () => void;
};

type AccountScreenProps = {
  user: AccountUser;
  appVersion: string;
  actions?: AccountActions;
};

const socialLinks: Array<{
  icon: keyof typeof FontAwesome.glyphMap;
  key: SocialPlatform;
  label: string;
}> = [
  { icon: "whatsapp", key: "whatsapp", label: "WhatsApp" },
  { icon: "facebook", key: "facebook", label: "Facebook" },
  { icon: "instagram", key: "instagram", label: "Instagram" }
];

function SectionLabel({ label }: { label: string }) {
  return (
    <View style={styles.sectionLabel}>
      <Text style={styles.sectionLabelText}>{label}</Text>
      <View style={styles.sectionLine} />
    </View>
  );
}

export function AccountScreen({
  user,
  appVersion,
  actions
}: AccountScreenProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const generalRows: Array<{
    icon: keyof typeof Feather.glyphMap;
    key: string;
    onPress?: () => void;
    subtitle: string;
    title: string;
  }> = [
    {
      icon: "shopping-bag",
      key: "orders",
      onPress: actions?.onOpenOrders,
      subtitle: "Track online, in-store & arranged purchases",
      title: "My Orders"
    },
    {
      icon: "heart",
      key: "wishlists",
      onPress: actions?.onOpenWishlists,
      subtitle: "Saved items for later",
      title: "Wishlists"
    },
    {
      icon: "sliders",
      key: "size",
      onPress: actions?.onOpenSizeDetails,
      subtitle: "Manage your sizes & preferences",
      title: "Size Details"
    },
    {
      icon: "award",
      key: "rewards",
      onPress: actions?.onOpenRewards,
      subtitle: "Points, benefits & membership status",
      title: "Rewards"
    },
    {
      icon: "help-circle",
      key: "help",
      onPress: actions?.onOpenHelp,
      subtitle: "Reach out to us for support",
      title: "Help & FAQs"
    },
    {
      icon: "credit-card",
      key: "payments",
      onPress: actions?.onOpenPayments,
      subtitle: "Saved cards & payment options",
      title: "Payment Methods"
    }
  ];

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.heading}>My Account</Text>
          <AccountProfileCard
            avatarUri={user.avatarUri}
            email={user.email}
            name={user.name}
            onEdit={actions?.onEditProfile}
            phoneNumber={user.phoneNumber}
          />
        </View>

        <View style={styles.sheet}>
          <View style={styles.section}>
            <SectionLabel label="General" />
            <View style={styles.rows}>
              {generalRows.map((row) => (
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
            <SectionLabel label="Manage Preferences" />
            <View style={styles.rows}>
              <AccountPreferenceRow
                icon="bell"
                onValueChange={setNotificationsEnabled}
                title="Notifications"
                value={notificationsEnabled}
              />
              <AccountPreferenceRow
                icon="map-pin"
                onValueChange={setLocationEnabled}
                title="Location"
                value={locationEnabled}
              />
            </View>
          </View>

          <View style={styles.socialRow}>
            {socialLinks.map((social) => (
              <Pressable
                accessibilityLabel={social.label}
                accessibilityRole="button"
                key={social.key}
                onPress={() => actions?.onOpenSocial?.(social.key)}
                style={({ pressed }) => [
                  styles.social,
                  pressed ? styles.pressed : null
                ]}
              >
                <View style={styles.socialIcon}>
                  <FontAwesome
                    color={colors.text}
                    name={social.icon}
                    size={17}
                  />
                </View>
                <Text style={styles.socialLabel}>{social.label}</Text>
              </Pressable>
            ))}
          </View>

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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 140
  },
  footer: {
    alignItems: "center",
    gap: spacing.md
  },
  header: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.sm
  },
  heading: {
    ...typography.displayHeadline,
    color: colors.text
  },
  logout: {
    alignItems: "center",
    alignSelf: "stretch",
    borderColor: colors.text,
    borderRadius: radii.card,
    borderWidth: 1,
    height: 48,
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
    gap: spacing.lg
  },
  screen: {
    backgroundColor: colors.surface,
    flex: 1
  },
  section: {
    gap: spacing.lg
  },
  sectionLabel: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  sectionLabelText: {
    ...typography.caption,
    color: colors.soft
  },
  sectionLine: {
    backgroundColor: colors.border,
    flex: 1,
    height: StyleSheet.hairlineWidth
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    gap: spacing.xl,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xl
  },
  social: {
    alignItems: "center",
    gap: spacing.xs
  },
  socialIcon: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  socialLabel: {
    ...typography.smallCaption,
    color: colors.muted
  },
  socialRow: {
    flexDirection: "row",
    gap: spacing.xxl,
    justifyContent: "center"
  },
  version: {
    ...typography.caption,
    color: colors.soft
  }
});
