import { Feather } from "@expo/vector-icons";
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
import { prototypeProductImages } from "../data/prototypeProductImages";
import { appBottomSafeInset, appTopSafeInset } from "../utils/safeArea";

type NotificationAction = "askMira" | "closet" | "search" | "tryOn";

type NotificationItem = {
  action: NotificationAction;
  actionLabel: string;
  body: string;
  id: string;
  image: string;
  label: string;
  time: string;
  title: string;
};

type NotificationsScreenProps = {
  onAskMira: () => void;
  onBack: () => void;
  onOpenCloset: () => void;
  onOpenSearch: () => void;
  onStartTryOn: (context?: string) => void;
};

const notifications: NotificationItem[] = [
  {
    action: "tryOn",
    actionLabel: "Try on",
    body: "Your outfit preview is ready. Open it and compare the look before you decide.",
    id: "try-on-ready",
    image: prototypeProductImages.sandro.navyTailoredSet,
    label: "Try-on ready",
    time: "Now",
    title: "Your try-on is ready"
  },
  {
    action: "closet",
    actionLabel: "Add one item",
    body: "Add one piece you already own so Mira can build looks around it.",
    id: "closet-nudge",
    image: prototypeProductImages.productOnly.top,
    label: "Closet idea",
    time: "12m",
    title: "Style something from your closet"
  },
  {
    action: "askMira",
    actionLabel: "Ask Mira",
    body: "Mira can help choose between office-ready outfits and softer weekend looks.",
    id: "mira-decision",
    image: prototypeProductImages.maje.ivoryMiniDress,
    label: "Mira tip",
    time: "1h",
    title: "Need help deciding what to wear?"
  },
  {
    action: "search",
    actionLabel: "View looks",
    body: "A saved style has new similar looks available to try before you buy.",
    id: "saved-look-update",
    image: prototypeProductImages.maje.beigeCrochetDress,
    label: "Saved look",
    time: "Today",
    title: "Fresh options for a look you saved"
  }
];

export function NotificationsScreen({
  onAskMira,
  onBack,
  onOpenCloset,
  onOpenSearch,
  onStartTryOn
}: NotificationsScreenProps) {
  const handleAction = (action: NotificationAction) => {
    if (action === "askMira") {
      onAskMira();
      return;
    }

    if (action === "closet") {
      onOpenCloset();
      return;
    }

    if (action === "search") {
      onOpenSearch();
      return;
    }

    onStartTryOn("Notification try-on");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Back to home"
            accessibilityRole="button"
            hitSlop={10}
            onPress={onBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed ? styles.pressed : null
            ]}
          >
            <Feather color={colors.text} name="chevron-left" size={28} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>Notifications</Text>
            <Text style={styles.subtitle}>Updates that help you decide faster</Text>
          </View>
        </View>

        <View style={styles.list}>
          {notifications.map((notification) => (
            <Pressable
              accessibilityRole="button"
              key={notification.id}
              onPress={() => handleAction(notification.action)}
              style={({ pressed }) => [
                styles.card,
                pressed ? styles.pressed : null
              ]}
            >
              <Image
                resizeMode="cover"
                source={{ uri: notification.image }}
                style={styles.cardImage}
              />
              <View style={styles.cardCopy}>
                <View style={styles.metaRow}>
                  <Text style={styles.label}>{notification.label}</Text>
                  <Text style={styles.time}>{notification.time}</Text>
                </View>
                <Text style={styles.cardTitle}>{notification.title}</Text>
                <Text style={styles.cardBody}>{notification.body}</Text>
                <View style={styles.actionRow}>
                  <Text style={styles.actionText}>{notification.actionLabel}</Text>
                  <Feather color={colors.text} name="arrow-right" size={15} />
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
    marginTop: spacing.sm
  },
  actionText: {
    color: colors.text,
    fontFamily: fonts.cta,
    fontSize: 13,
    lineHeight: 16
  },
  backButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    marginLeft: -spacing.sm,
    width: 44
  },
  card: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: spacing.md,
    overflow: "hidden",
    padding: spacing.sm
  },
  cardBody: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    marginTop: spacing.xs
  },
  cardCopy: {
    flex: 1,
    minWidth: 0,
    paddingVertical: spacing.xs
  },
  cardImage: {
    backgroundColor: colors.imageSurface,
    borderRadius: 8,
    height: 104,
    width: 82
  },
  cardTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 16,
    lineHeight: 20,
    marginTop: spacing.xs
  },
  content: {
    paddingBottom: appBottomSafeInset + 112,
    paddingHorizontal: spacing.screen,
    paddingTop: appTopSafeInset + spacing.md
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm
  },
  headerCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
    paddingTop: 6
  },
  label: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14
  },
  list: {
    gap: spacing.md,
    marginTop: spacing.xl
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  pressed: {
    opacity: 0.72
  },
  safeArea: {
    backgroundColor: colors.surfaceTertiary,
    flex: 1
  },
  subtitle: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 19
  },
  time: {
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14
  },
  title: {
    ...typography.screenTitle,
    color: colors.text
  }
});
