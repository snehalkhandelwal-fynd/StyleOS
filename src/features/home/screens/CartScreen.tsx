import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import { colors, fonts, spacing, typography } from "../../../theme";

type CartItem = {
  brand: string;
  color: string;
  id: string;
  image: string;
  originalPrice?: string;
  price: string;
  quantity: number;
  size: string;
  title: string;
};

type Coupon = {
  code: string;
  description: string;
  discountLabel: string;
  isApplicable: boolean;
  savings?: string;
  terms: string;
};

const cartItems: CartItem[] = [
  {
    brand: "Trends",
    color: "Ivory",
    id: "cart-blazer-dress",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80",
    originalPrice: "₹4,599",
    price: "₹2,300",
    quantity: 1,
    size: "M",
    title: "Cream blazer and slip dress look"
  },
  {
    brand: "H&M",
    color: "Oxblood",
    id: "cart-cropped-jacket",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    price: "₹2,300",
    quantity: 1,
    size: "S",
    title: "Cropped jacket with city skirt"
  }
];

const defaultOffer = "Flat ₹299 | Code: STYLE299";
const bestCoupon = {
  code: "STYLE299",
  offer: defaultOffer,
  savings: "Save ₹299 on this purchase!"
};
const offerChips = [
  "Flat 10% off | Code: STYLE10",
  "Flat ₹100 off | Code: MIRA100",
  "Try-on deal | Code: TRYLOOK"
];
const coupons: Coupon[] = [
  {
    code: "STYLE299",
    description: "Flat ₹299 off on this order.",
    discountLabel: "BEST",
    isApplicable: true,
    savings: "Save ₹299 on this purchase!",
    terms: "Valid on selected looks in your cart"
  },
  {
    code: "TIRARIL20",
    description: "Enjoy up to 20% off on ₹1299. Max discount ₹3000",
    discountLabel: "20% OFF",
    isApplicable: false,
    terms: "Valid for RIL employees only, and on select products"
  },
  {
    code: "TIRA20",
    description:
      "Enjoy up to 20% discount on minimum order value of ₹1000. Max coupon discount ₹1000.",
    discountLabel: "20% OFF",
    isApplicable: false,
    terms: "Valid on select products"
  },
  {
    code: "MAY26",
    description: "Enjoy up to 25% off on ₹1999. Max discount ₹1500",
    discountLabel: "25% OFF",
    isApplicable: false,
    terms: "Valid on select products"
  }
];

function QuantityStepper({ value }: { value: number }) {
  return (
    <View style={styles.stepper}>
      <Pressable accessibilityRole="button" style={styles.stepperButton}>
        <Feather color={colors.muted} name="minus" size={15} />
      </Pressable>
      <Text style={styles.stepperValue}>{value}</Text>
      <Pressable accessibilityRole="button" style={styles.stepperButton}>
        <Feather color={colors.muted} name="plus" size={15} />
      </Pressable>
    </View>
  );
}

function Header({
  onBack,
  title = "Cart"
}: {
  onBack?: () => void;
  title?: string;
}) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityLabel="Go back"
        accessibilityRole="button"
        onPress={onBack}
        style={styles.iconButton}
      >
        <Feather color={colors.text} name="arrow-left" size={24} />
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
}

function SectionHeader({
  action,
  icon,
  onActionPress,
  title
}: {
  action?: string;
  icon?: keyof typeof Feather.glyphMap;
  onActionPress?: () => void;
  title: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {icon ? (
        <Pressable
          accessibilityLabel={action ?? title}
          accessibilityRole="button"
          onPress={onActionPress}
          style={styles.iconButton}
        >
          <Feather color={colors.text} name={icon} size={22} />
        </Pressable>
      ) : null}
    </View>
  );
}

function CartItemCard({ item }: { item: CartItem }) {
  return (
    <View style={styles.cartCard}>
      <View style={styles.cartItemTop}>
        <Image resizeMode="cover" source={{ uri: item.image }} style={styles.cartImage} />
        <View style={styles.cartCopy}>
          <Text style={styles.itemBrand}>{item.brand}</Text>
          <Text numberOfLines={1} style={styles.itemTitle}>
            {item.title}
          </Text>
          <Text style={styles.itemMeta}>
            Color: {item.color}  |  Size: {item.size}
          </Text>
        </View>
      </View>
      <View style={styles.cartItemBottom}>
        <View style={styles.priceRow}>
          <Text style={styles.itemPrice}>{item.price}</Text>
          {item.originalPrice ? (
            <Text style={styles.originalPrice}>({item.originalPrice})</Text>
          ) : null}
        </View>
        <QuantityStepper value={item.quantity} />
      </View>
    </View>
  );
}

function CartItemsSection() {
  return (
    <View style={styles.section}>
      <SectionHeader icon="trash-2" title={`Cart items (${cartItems.length})`} />
      <View style={styles.cartList}>
        {cartItems.map((item) => (
          <CartItemCard item={item} key={item.id} />
        ))}
      </View>
    </View>
  );
}

function OffersSection({
  appliedOffer,
  onApplyOffer,
  onOpenCoupons,
  onRemoveOffer
}: {
  appliedOffer: string | null;
  onApplyOffer: (offer: string) => void;
  onOpenCoupons: () => void;
  onRemoveOffer: () => void;
}) {
  return (
    <View style={styles.section}>
      <Pressable
        accessibilityLabel="Open coupons and bank offers"
        accessibilityRole="button"
        onPress={onOpenCoupons}
      >
        <SectionHeader title="Offers and promotions" />
      </Pressable>
      {appliedOffer ? (
        <View style={styles.couponCard}>
          <View style={styles.couponIcon}>
            <Feather color={colors.inverseText} name="tag" size={18} />
          </View>
          <View style={styles.couponCopy}>
            <Text style={styles.couponTitle}>Coupon applied</Text>
            <Text style={styles.couponMeta}>{appliedOffer}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={onRemoveOffer}
            style={({ pressed }) => [
              styles.smallPillAction,
              pressed ? styles.pressed : null
            ]}
          >
            <Text style={styles.smallPillActionText}>Remove</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.emptyCouponCard}>
          <View style={styles.emptyCouponInfo}>
            <Feather color={colors.muted} name="tag" size={18} />
            <View style={styles.emptyCouponCopy}>
              <Text style={styles.emptyCouponText}>No coupon applied</Text>
              <Text style={styles.bestCouponText}>{bestCoupon.offer}</Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => onApplyOffer(bestCoupon.offer)}
            style={({ pressed }) => [
              styles.smallPillAction,
              pressed ? styles.pressed : null
            ]}
          >
            <Text style={styles.smallPillActionText}>Apply</Text>
          </Pressable>
        </View>
      )}
      <ScrollView
        contentContainerStyle={styles.offerChipTrack}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {offerChips.map((chip) => (
          <Pressable
            accessibilityRole="button"
            key={chip}
            onPress={() => onApplyOffer(chip)}
            style={[
              styles.offerChip,
              appliedOffer === chip ? styles.offerChipSelected : null
            ]}
          >
            <Text style={styles.offerChipText}>{chip}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function GiftCardSection({
  appliedGiftCard,
  onAddPress,
  onRemoveGiftCard
}: {
  appliedGiftCard: string | null;
  onAddPress: () => void;
  onRemoveGiftCard: () => void;
}) {
  const hasGiftCard = Boolean(appliedGiftCard);

  return (
    <View style={styles.section}>
      <SectionHeader
        action="Open gift cards"
        icon="chevron-right"
        onActionPress={onAddPress}
        title="Gift cards"
      />
      <View style={styles.giftCard}>
        <View style={styles.giftIcon}>
          <Feather color={colors.inverseText} name="gift" size={18} />
        </View>
        <View style={styles.giftCopy}>
          <Text style={styles.giftTitle}>
            {hasGiftCard ? "Gift card added" : "Have a gift card?"}
          </Text>
          <Text style={styles.giftSubcopy}>
            {hasGiftCard
              ? `Ending in ${appliedGiftCard?.slice(-4)}`
              : "Unlock additional discounts"}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={hasGiftCard ? onRemoveGiftCard : onAddPress}
          style={({ pressed }) => [
            styles.smallPillAction,
            pressed ? styles.pressed : null
          ]}
        >
          <Text style={styles.smallPillActionText}>
            {hasGiftCard ? "Remove" : "Add"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function GiftCardEntryPage({
  onApply,
  onBack
}: {
  onApply: (giftCardNumber: string) => void;
  onBack: () => void;
}) {
  const [giftCardNumber, setGiftCardNumber] = useState("");
  const trimmedGiftCardNumber = giftCardNumber.trim();
  const canApply = trimmedGiftCardNumber.length > 0;

  const handleApply = () => {
    if (!canApply) {
      return;
    }

    onApply(trimmedGiftCardNumber);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <Header onBack={onBack} title="Gift card" />
        <ScrollView
          contentContainerStyle={styles.giftPageContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.giftPageCard}>
            <View style={styles.giftPageIcon}>
              <Feather color={colors.inverseText} name="gift" size={22} />
            </View>
            <Text style={styles.giftPageTitle}>Add gift card</Text>
            <Text style={styles.giftPageCopy}>
              Enter your gift card number to apply it to this order.
            </Text>
            <TextInput
              autoCapitalize="characters"
              autoCorrect={false}
              onChangeText={setGiftCardNumber}
              placeholder="Gift card number"
              placeholderTextColor={colors.soft}
              style={styles.giftInput}
              value={giftCardNumber}
            />
            <Pressable
              accessibilityRole="button"
              disabled={!canApply}
              onPress={handleApply}
              style={({ pressed }) => [
                styles.primaryRoundedCta,
                !canApply ? styles.primaryRoundedCtaDisabled : null,
                pressed && canApply ? styles.pressed : null
              ]}
            >
              <Text style={styles.primaryRoundedCtaText}>Add gift card</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function CouponTicketCard({
  coupon,
  onApply
}: {
  coupon: Coupon;
  onApply: (coupon: Coupon) => void;
}) {
  return (
    <View style={styles.couponTicket}>
      <View style={styles.couponTicketMain}>
        <View style={styles.couponTicketBand}>
          <Text style={styles.couponTicketBandText}>{coupon.discountLabel}</Text>
        </View>
        <View style={styles.couponTicketContent}>
          <View style={styles.couponTicketTop}>
            <View style={styles.couponTicketCopy}>
              <Text style={styles.couponTicketCode}>{coupon.code}</Text>
              {coupon.isApplicable && coupon.savings ? (
                <Text style={styles.couponTicketSavings}>{coupon.savings}</Text>
              ) : (
                <Text style={styles.couponTicketWarning}>
                  Not applicable on current selection
                </Text>
              )}
              <Text numberOfLines={2} style={styles.couponTicketDescription}>
                {coupon.description}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              disabled={!coupon.isApplicable}
              onPress={() => onApply(coupon)}
              style={({ pressed }) => [
                styles.couponApplyButton,
                !coupon.isApplicable ? styles.couponApplyButtonDisabled : null,
                pressed && coupon.isApplicable ? styles.pressed : null
              ]}
            >
              <Text
                style={[
                  styles.couponApplyText,
                  !coupon.isApplicable ? styles.couponApplyTextDisabled : null
                ]}
              >
                Apply
              </Text>
            </Pressable>
          </View>
          <View style={styles.couponDashedDivider} />
          <View style={styles.couponTicketBottom}>
            <Text numberOfLines={2} style={styles.couponTicketTerms}>
              {coupon.terms}
            </Text>
            <View style={styles.moreInfoRow}>
              <Text style={styles.moreInfoText}>More Info</Text>
              <Feather color={colors.text} name="chevron-down" size={18} />
            </View>
          </View>
        </View>
      </View>
      <Pressable accessibilityRole="button" style={styles.applicableProductsRow}>
        <Text style={styles.applicableProductsText}>View Applicable Products</Text>
        <Feather color={colors.text} name="chevron-right" size={22} />
      </Pressable>
    </View>
  );
}

function CouponsPage({
  onApplyCoupon,
  onBack
}: {
  onApplyCoupon: (offer: string) => void;
  onBack: () => void;
}) {
  const [couponCode, setCouponCode] = useState("");
  const trimmedCouponCode = couponCode.trim().toUpperCase();
  const canApplyCode = trimmedCouponCode.length > 0;

  const handleApplyCoupon = (coupon: Coupon) => {
    if (!coupon.isApplicable) {
      return;
    }

    onApplyCoupon(
      coupon.code === bestCoupon.code
        ? bestCoupon.offer
        : `${coupon.savings ?? "Coupon applied"} | Code: ${coupon.code}`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <Header onBack={onBack} title="Coupons & Bank Offers" />
        <ScrollView
          contentContainerStyle={styles.couponsPageContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.couponInputRow}>
            <TextInput
              autoCapitalize="characters"
              autoCorrect={false}
              onChangeText={setCouponCode}
              placeholder="Enter Coupon Code"
              placeholderTextColor={colors.soft}
              style={styles.couponInput}
              value={couponCode}
            />
            <Pressable
              accessibilityRole="button"
              disabled={!canApplyCode}
              onPress={() => onApplyCoupon(`Code: ${trimmedCouponCode}`)}
              style={({ pressed }) => [
                styles.couponInputApply,
                pressed && canApplyCode ? styles.pressed : null
              ]}
            >
              <Text
                style={[
                  styles.couponInputApplyText,
                  !canApplyCode ? styles.couponInputApplyTextDisabled : null
                ]}
              >
                Apply
              </Text>
            </Pressable>
          </View>

          <Text style={styles.couponPageTitle}>Tira Coupons</Text>
          <View style={styles.couponTicketList}>
            {coupons.map((coupon) => (
              <CouponTicketCard
                coupon={coupon}
                key={coupon.code}
                onApply={handleApplyCoupon}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function LoyaltySection() {
  return (
    <View style={styles.loyaltyRow}>
      <View style={styles.checkbox} />
      <View style={styles.loyaltyCopy}>
        <Text style={styles.loyaltyTitle}>Redeem Style Points</Text>
        <Text style={styles.loyaltySubcopy}>150 points available | 1 point = ₹20</Text>
      </View>
      <View style={styles.coin}>
        <Feather color="#8B5B12" name="star" size={20} />
      </View>
    </View>
  );
}

function PriceSummary() {
  const rows = [
    ["Bag total", "₹9,633"],
    ["Discount", "-₹2,299", "success"],
    ["Sub total", "₹7,334"],
    ["GST (18%)", "₹174"]
  ];

  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>Price summary</Text>
      <View style={styles.summaryRows}>
        {rows.map(([label, value, tone]) => (
          <View key={label} style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{label}</Text>
            <Text style={[styles.summaryValue, tone === "success" ? styles.successText : null]}>
              {value}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>₹7,308</Text>
      </View>
    </View>
  );
}

function CheckoutDock() {
  return (
    <View pointerEvents="box-none" style={styles.checkoutDock}>
      <View style={styles.savingsStrip}>
        <Text style={styles.savingsText}>You saved ₹2,125 on this purchase</Text>
      </View>
      <View style={styles.checkoutSurface}>
        <Pressable accessibilityRole="button" style={styles.payButton}>
          <Text style={styles.payButtonText}>Continue to Pay ₹7,308</Text>
        </Pressable>
      </View>
    </View>
  );
}

type CartScreenProps = {
  onBack?: () => void;
};

export function CartScreen({ onBack }: CartScreenProps) {
  const [appliedOffer, setAppliedOffer] = useState<string | null>(defaultOffer);
  const [appliedGiftCard, setAppliedGiftCard] = useState<string | null>(null);
  const [isCouponPageOpen, setIsCouponPageOpen] = useState(false);
  const [isGiftCardPageOpen, setIsGiftCardPageOpen] = useState(false);

  if (isCouponPageOpen) {
    return (
      <CouponsPage
        onApplyCoupon={(offer) => {
          setAppliedOffer(offer);
          setIsCouponPageOpen(false);
        }}
        onBack={() => setIsCouponPageOpen(false)}
      />
    );
  }

  if (isGiftCardPageOpen) {
    return (
      <GiftCardEntryPage
        onApply={(giftCardNumber) => {
          setAppliedGiftCard(giftCardNumber);
          setIsGiftCardPageOpen(false);
        }}
        onBack={() => setIsGiftCardPageOpen(false)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <Header onBack={onBack} />
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <CartItemsSection />
          <OffersSection
            appliedOffer={appliedOffer}
            onApplyOffer={setAppliedOffer}
            onOpenCoupons={() => setIsCouponPageOpen(true)}
            onRemoveOffer={() => setAppliedOffer(null)}
          />
          <GiftCardSection
            appliedGiftCard={appliedGiftCard}
            onAddPress={() => setIsGiftCardPageOpen(true)}
            onRemoveGiftCard={() => setAppliedGiftCard(null)}
          />
          <LoyaltySection />
          <PriceSummary />
        </ScrollView>
        <CheckoutDock />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cartCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.md,
    padding: spacing.md,
    shadowColor: "#000000",
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 16
  },
  cartCopy: {
    flex: 1,
    gap: 3,
    minWidth: 0
  },
  cartImage: {
    backgroundColor: colors.imageSurface,
    borderRadius: 10,
    height: 64,
    width: 64
  },
  cartItemBottom: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  cartItemTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md
  },
  cartList: {
    gap: spacing.md
  },
  checkbox: {
    borderColor: colors.borderStrong,
    borderRadius: 5,
    borderWidth: 1.5,
    height: 20,
    width: 20
  },
  checkoutDock: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0
  },
  checkoutSurface: {
    backgroundColor: colors.background,
    paddingBottom: Platform.OS === "ios" ? spacing.sm : spacing.md,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md
  },
  coin: {
    alignItems: "center",
    backgroundColor: "#F5CA72",
    borderColor: "#E4A73D",
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  content: {
    gap: spacing.xl,
    paddingBottom: 148,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg
  },
  couponCard: {
    alignItems: "center",
    backgroundColor: "#F1FBF5",
    borderColor: "#9BE7B7",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md
  },
  couponCopy: {
    flex: 1,
    minWidth: 0
  },
  couponIcon: {
    alignItems: "center",
    backgroundColor: "#16A15C",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  couponMeta: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17
  },
  couponTitle: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 20
  },
  applicableProductsRow: {
    alignItems: "center",
    backgroundColor: colors.surfaceTertiary,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md
  },
  applicableProductsText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 19
  },
  bestCouponText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2
  },
  couponApplyButton: {
    alignItems: "center",
    backgroundColor: colors.inverse,
    borderRadius: 999,
    height: 34,
    justifyContent: "center",
    paddingHorizontal: spacing.md
  },
  couponApplyButtonDisabled: {
    backgroundColor: colors.surfaceTertiary
  },
  couponApplyText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 17
  },
  couponApplyTextDisabled: {
    color: colors.soft
  },
  couponDashedDivider: {
    borderColor: colors.border,
    borderStyle: "dashed",
    borderTopWidth: 1,
    marginVertical: spacing.md
  },
  couponInput: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 20,
    paddingHorizontal: spacing.md
  },
  couponInputApply: {
    alignItems: "center",
    height: 48,
    justifyContent: "center",
    paddingHorizontal: spacing.md
  },
  couponInputApplyText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 20
  },
  couponInputApplyTextDisabled: {
    color: colors.soft
  },
  couponInputRow: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    height: 56
  },
  couponPageTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 24,
    lineHeight: 30,
    marginTop: spacing.xl
  },
  couponsPageContent: {
    paddingBottom: 120,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg
  },
  couponTicket: {
    borderRadius: 16,
    overflow: "hidden"
  },
  couponTicketBand: {
    alignItems: "center",
    backgroundColor: "#E8D4B2",
    justifyContent: "center",
    width: 46
  },
  couponTicketBandText: {
    color: "#8E7757",
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    letterSpacing: 1,
    lineHeight: 17,
    transform: [{ rotate: "-90deg" }],
    width: 86
  },
  couponTicketBottom: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between"
  },
  couponTicketCode: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 17,
    lineHeight: 22
  },
  couponTicketContent: {
    flex: 1,
    padding: spacing.md
  },
  couponTicketCopy: {
    flex: 1,
    minWidth: 0
  },
  couponTicketDescription: {
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4
  },
  couponTicketList: {
    gap: spacing.xl,
    marginTop: spacing.xl
  },
  couponTicketMain: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    overflow: "hidden"
  },
  couponTicketSavings: {
    color: "#16A15C",
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 19,
    marginTop: 4
  },
  couponTicketTerms: {
    color: colors.soft,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18
  },
  couponTicketTop: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md
  },
  couponTicketWarning: {
    color: "#A3262B",
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 19,
    marginTop: 4
  },
  emptyCouponCopy: {
    flex: 1,
    minWidth: 0
  },
  emptyCouponCard: {
    alignItems: "center",
    backgroundColor: colors.surfaceTertiary,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between",
    padding: spacing.md
  },
  emptyCouponInfo: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minWidth: 0
  },
  emptyCouponText: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18
  },
  giftCard: {
    alignItems: "center",
    backgroundColor: colors.surfaceTertiary,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md
  },
  giftCopy: {
    flex: 1,
    minWidth: 0
  },
  giftIcon: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  giftSubcopy: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17
  },
  giftTitle: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 20
  },
  giftInput: {
    backgroundColor: colors.background,
    borderColor: colors.secondaryBorder,
    borderRadius: 22,
    borderWidth: 1,
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 15,
    height: 48,
    lineHeight: 20,
    paddingHorizontal: spacing.lg
  },
  giftPageCard: {
    backgroundColor: colors.surfaceTertiary,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.md,
    padding: spacing.lg
  },
  giftPageContent: {
    paddingBottom: 120,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xl
  },
  giftPageCopy: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20
  },
  giftPageIcon: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  giftPageTitle: {
    color: colors.text,
    ...typography.sectionHeading
  },
  header: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 58,
    paddingHorizontal: spacing.screen
  },
  headerTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 26
  },
  iconButton: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    width: 40
  },
  itemBrand: {
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16
  },
  itemMeta: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17
  },
  itemPrice: {
    color: "#16A15C",
    fontFamily: fonts.heading,
    fontSize: 17,
    lineHeight: 22
  },
  itemTitle: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18
  },
  loyaltyCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0
  },
  loyaltyRow: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    borderStyle: "dashed",
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    paddingVertical: spacing.lg
  },
  loyaltySubcopy: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17
  },
  loyaltyTitle: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 19
  },
  moreInfoRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 2
  },
  moreInfoText: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18
  },
  offerChip: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingHorizontal: spacing.md,
    paddingVertical: 6
  },
  offerChipSelected: {
    backgroundColor: colors.imageSurface,
    borderColor: colors.secondaryBorder,
    borderWidth: StyleSheet.hairlineWidth
  },
  offerChipText: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16
  },
  offerChipTrack: {
    gap: spacing.sm,
    paddingRight: spacing.screen
  },
  originalPrice: {
    color: colors.soft,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 19,
    textDecorationLine: "line-through"
  },
  payButton: {
    alignItems: "center",
    backgroundColor: colors.inverse,
    borderRadius: 999,
    height: 52,
    justifyContent: "center"
  },
  payButtonText: {
    color: colors.inverseText,
    fontFamily: fonts.cta,
    fontSize: 16,
    lineHeight: 22
  },
  priceRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6
  },
  pressed: {
    opacity: 0.68
  },
  primaryRoundedCta: {
    alignItems: "center",
    backgroundColor: colors.inverse,
    borderRadius: 999,
    height: 52,
    justifyContent: "center",
    marginTop: spacing.sm
  },
  primaryRoundedCtaDisabled: {
    backgroundColor: colors.soft
  },
  primaryRoundedCtaText: {
    color: colors.inverseText,
    fontFamily: fonts.cta,
    fontSize: 16,
    lineHeight: 22
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1
  },
  savingsStrip: {
    alignItems: "center",
    backgroundColor: "#16A15C",
    justifyContent: "center",
    minHeight: 34,
    paddingHorizontal: spacing.screen
  },
  savingsText: {
    color: colors.inverseText,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center"
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1
  },
  section: {
    gap: spacing.md
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  sectionTitle: {
    color: colors.text,
    ...typography.sectionHeading
  },
  smallPillAction: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.secondaryBorder,
    borderRadius: 999,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    paddingHorizontal: spacing.md
  },
  smallPillActionText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 17
  },
  stepper: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    height: 40,
    overflow: "hidden"
  },
  stepperButton: {
    alignItems: "center",
    height: 38,
    justifyContent: "center",
    width: 34
  },
  stepperValue: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 20,
    minWidth: 22,
    textAlign: "center"
  },
  successText: {
    color: "#16A15C"
  },
  summaryCard: {
    backgroundColor: colors.surfaceTertiary,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.md,
    padding: spacing.lg,
    shadowColor: "#000000",
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 16
  },
  summaryLabel: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20
  },
  summaryRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  summaryRows: {
    gap: spacing.sm
  },
  summaryTitle: {
    color: colors.text,
    ...typography.sectionHeading
  },
  summaryValue: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 20
  },
  totalLabel: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 24
  },
  totalRow: {
    alignItems: "center",
    borderColor: colors.border,
    borderStyle: "dashed",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: spacing.md
  },
  totalValue: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 24
  }
});
