import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import { colors, fonts, radii, spacing, typography } from "../../../theme";
import { AccountMenuRow } from "../components/AccountMenuRow";
import { AccountPreferenceRow } from "../components/AccountPreferenceRow";
import { AccountProfileCard } from "../components/AccountProfileCard";
import {
  AppScreenHeader,
  appScreenTopPadding
} from "../components/AppScreenHeader";
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
  onInternalViewChange?: (isOpen: boolean) => void;
  styleProfile?: AccountStyleProfile;
};

type AccountDetailPageName =
  | "addresses"
  | "avatar"
  | "measurements"
  | "privacy"
  | "style";
export type AccountPage = AccountDetailPageName | "wishlist";
type AccountInternalPage = AccountPage | "closetFavourites" | "editProfile";

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
    addresses: {
      cta: "Add address",
      intro: "Save places you ship to often so checkout stays quick when a look feels right.",
      items: [
        {
          body: "No saved home address yet",
          icon: "home",
          title: "Home"
        },
        {
          body: "Add work, studio or campus delivery details",
          icon: "map-pin",
          title: "Other address"
        }
      ],
      title: "Saved addresses"
    },
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
  styleProfile
}: AccountScreenProps) {
  const [activePage, setActivePage] = useState<AccountInternalPage | null>(
    initialPage ?? null
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    if (initialPage) {
      setActivePage(initialPage);
    }
  }, [initialPage]);

  useEffect(() => {
    onInternalViewChange?.(Boolean(activePage));

    return () => onInternalViewChange?.(false);
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
    },
    {
      icon: "package",
      key: "closet",
      onPress: actions?.onOpenCloset,
      subtitle: "Wardrobe items Mira can reuse in looks",
      title: "Closet"
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
        onSave={handleSaveProfile}
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
          <AppScreenHeader title="My Account" />
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
