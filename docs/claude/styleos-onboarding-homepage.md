# StyleOS Onboarding and Homepage Spec

> Use this before implementing or changing StyleOS onboarding, avatar setup, location, homepage, or bottom navigation in the React Native app.

## Source of Truth

- Stack: React Native.
- UI source: the current StyleOS React Native prototype plus the latest Figma homepage frame.
- Homepage Figma frame: `StyleOS-Designs`, node `99:3295`.
- Location screen Figma wireframe: `StyleOS-Designs`, node `72:10885`.
- This app is a fashion decision engine, not a traditional ecommerce grid.

## Non-Negotiables

- Keep the experience mobile-first for iOS and Android.
- Use design-system tokens from `@styleos/ds` for every color, radius, spacing, and typography value.
- If a needed value is missing, add a token first. Do not hardcode visual values in screen code.
- Use Noto Serif for editorial headings and Inter for functional text through typography tokens.
- Do not combine `fontWeight` with a weighted `fontFamily` in React Native.
- Screens stay thin. State, validation, timers, and derived data belong in a ViewModel or reducer.
- All dynamic data comes from typed props or ViewModels. Do not hide mock data inside production screens.
- Every data-driven screen must support loading, error, and empty states.
- Do not add ecommerce-style product grids, banners, or noisy labels that are not in the design.

## Navigation Map

Use a stack for onboarding/auth/setup and a tab navigator for the logged-in app.

```ts
type RootStackParamList = {
  Splash: undefined;
  PhoneSignIn: undefined;
  OtpVerification: { phoneNumber: string; countryCode: string };
  SetupName: undefined;
  SetupHeight: undefined;
  SetupFashionInterest: undefined;
  SetupStyleQuiz: undefined;
  UploadFullBodyPhoto: undefined;
  AvatarCreating: undefined;
  AvatarReady: undefined;
  LocationAccess: undefined;
  HomeTabs: undefined;
};

type HomeTabParamList = {
  Home: undefined;
  Explore: undefined;
  TryOn: undefined;
  Cart: undefined;
};
```

Primary flow:

```txt
Splash
  → PhoneSignIn
  → OtpVerification
  → SetupName
  → SetupHeight
  → SetupFashionInterest
  → SetupStyleQuiz
  → UploadFullBodyPhoto
  → AvatarCreating
  → AvatarReady
  → LocationAccess
  → HomeTabs/Home
```

Guest flow:

```txt
Splash
  → Explore without signing in
  → HomeTabs/Home with guest state
```

## Shared Onboarding Shell

Use one shell for setup screens after OTP.

- Progress has 5 steps only:
  1. Name
  2. Height
  3. Fashion interest
  4. Style quiz
  5. Upload full-body photo
- Avatar creating, avatar ready, and location access are not progress steps.
- Heading placement must match the phone number screen across all onboarding screens.
- Use the same left and right screen margins on every onboarding screen.
- Back arrows are not shown on OTP, name, and the setup screens unless explicitly requested.
- The setup next action is a 48 x 48 circular icon button near the lower-right area above the keyboard when the keyboard is open.
- Disable next actions until the current step is valid.

Suggested shell contract:

```ts
interface OnboardingStepShellProps {
  currentStep?: 1 | 2 | 3 | 4 | 5;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  nextButton?: {
    disabled: boolean;
    onPress: () => void;
    accessibilityLabel: string;
  };
}
```

## Auth Screens

### Splash

- Show `StyleOS` as the top brand title.
- Use a 3-card image carousel.
- Carousel must support auto-scroll and manual swipe.
- Carousel must loop seamlessly from card 3 to card 1 by continuing in the same forward direction. It must never visually rewind backward.
- The dot indicator must update on both auto-scroll and manual swipe.
- Primary CTA: `Get Started`.
- Secondary CTA: `Explore without signing in`.
- CTA text uses Inter regular through the CTA typography token.
- Secondary CTA is full-width within screen margins.

React Native carousel rules:

- Prefer `FlatList` or `ScrollView` with `horizontal`, `pagingEnabled`, `snapToInterval`, and `decelerationRate="fast"`.
- Update active index from `onMomentumScrollEnd`.
- For infinite looping, use cloned boundary items or reset scroll position without animation after the momentum ends.
- The entire card moves during swipe, not only the image inside the card.

### Phone Sign-In

- Heading: `What is your phone number?`
- Phone input is empty by default.
- Phone number field must be focusable and typeable.
- Sign-in CTA is disabled until a valid full phone number exists for the selected country.
- Do not allow navigation to OTP with a partial phone number.
- Country selector is compact and contains flag, country code, and down arrow.
- Spacing between country code and down arrow is 4px token-equivalent.
- The dropdown opens below the country code box, not at the bottom of the screen.
- Country dropdown must include:
  - search field with search icon on the left
  - placeholder `Search country`
  - flags
  - single-line country codes
  - country names
  - visible scrollbar
- The phone number entered here is passed to OTP.

### OTP Verification

- Heading: `Enter your verification code`
- Heading must stay on one line where the viewport allows it.
- Show `Sent to +<countryCode><phoneNumber>` and the 12 x 12 edit icon, not the text `Edit`.
- Edit icon returns user to `PhoneSignIn`.
- 4 OTP fields only.
- Inputs are center-aligned horizontally and vertically.
- No black, orange, or accent focus border on the OTP boxes.
- Verify button is directly below OTP/timer content, not fixed to the bottom of the page.
- Verify button is disabled until all 4 digits are entered.
- Timer starts at 45 seconds for now.
- Resend becomes a tertiary CTA after the timer expires.
- User should be able to type immediately when the screen opens.
- Backspace behavior:
  - if the current box has a value, delete it
  - if the current box is empty, move left and delete the previous value
  - user must not need to tap each previous field manually

## Setup Screens

### Step 1: Name

- Heading: `What’s your name?`
- Copy/input row reads `Hi, I am` plus a name input.
- User can enter first name or full name.
- `Hi, I am` stays on one line on all supported mobile widths.
- Spacing between `Hi, I am` and the name input is 4px token-equivalent.
- `Hi, I am` and the entered name are bottom-aligned.
- Name input uses Noto Serif at 24px token-equivalent.
- Preserve right margin for the underline/input field.
- Next button is disabled until the field has non-whitespace text.

### Step 2: Height

- Heading: `How tall are you?`
- Default unit is feet and inches, with centimeters shown in parentheses.
- Use an Apple-style vertical picker interaction.
- Only one height is selected at a time.
- The selected height is centered between two light divider lines.
- Non-selected heights must not sit between the divider lines.
- Scrolling snaps from one height to the next.
- Selected height uses the same font treatment as the name input: Noto Serif, 24px token-equivalent.
- Non-selected heights use muted functional text styling.
- Divider lines are light and tokenized.

### Step 3: Fashion Interest

- Heading: `What are you interested in?`
- User can select only one:
  - `Women’s clothing`
  - `Men’s clothing`
- Cards should use realistic fashion imagery, not empty illustration-style cards.
- Women’s card must use a women’s fashion image.
- Men’s card must use a men’s fashion image.
- Remove subtext under both options.
- Avoid large unused white space inside cards.
- Selected state must be clearly visible using neutral editorial styling.
- Next button is disabled until one option is selected.

### Step 4: Style Quiz

- Heading: `What’s your style?`
- Use up to 6 image cards initially.
- Cards support both:
  - swipe left/right gestures
  - `Not my style` and `Loved it` buttons
- Swipe and button interactions must produce the same state update.
- Each card shows style label, card count, image, and short title.
- After the last card, continue to upload photo.
- Tertiary skip CTA copy:
  - `Skip quiz` is the only underlined/interactive part
  - ` - I’ll set my style later` is normal text
- If the user skips, continue to `UploadFullBodyPhoto`.

### Step 5: Upload Full-Body Photo

- Heading: `See yourself in every look`
- Supporting copy: `1 photo is all it takes. We build your style avatar so you can try on anything.`
- Upload box uses dotted border in the same neutral border color as the design.
- Upload box label: `Full-body photo`
- Use the real device photo picker.
- After a photo is selected, show the selected image preview in the box.
- Continue is disabled until an image is selected.
- Continue navigates to `AvatarCreating`.

## Avatar Screens

### Creating Avatar

- Heading: `Creating your Avatar`
- Supporting copy: `This may take up to 30 seconds.`
- Prototype should simulate this faster than 30 seconds.
- Show an image/preview stage and clear loading state.
- Automatically navigate to `AvatarReady` when the simulated generation completes.

### Avatar Ready

- Heading: `Your Avatar is ready`
- Supporting copy: `Try on any look from any brand — it renders on your avatar instantly.`
- Show generated avatar preview.
- Use neutral metadata chips for inferred/selected style details.
- Continue navigates to `LocationAccess`.

## Location Access

- This screen comes after avatar ready and before homepage.
- Heading: `Enable location access`
- Heading and subheading placement must match the other onboarding/setup screens.
- Remove the line `You can change this anytime.`
- User can grant current location or enter/select an address.
- Save selected address to app state.
- Homepage address row must display this captured address.
- If no address exists, use the fallback only as a guest/prototype state.

## Homepage

Implement the homepage from Figma node `99:3295`.

### Page Structure

Order must be:

1. Address header
2. Search bar
3. `Good Morning, <name>`
4. `Styled for you` hero card
5. `What’s the occasion?`
6. `Find your style in 30 seconds` banner
7. `Great style at every price`
8. `Shop by Brands`
9. `Saved Looks`
10. `New Arrivals this week`
11. `Build looks from what you already love` banner

### Header

- Background is warm off-white from the Figma frame.
- Address row contains:
  - location icon
  - captured address
  - down chevron
  - circular profile/action button on the right
- Address row is changeable and opens location editing.
- Search bar placeholder: `Search by occasion, style, or vibe…`
- Search bar includes search, mic, and camera icons.

### Styled For You

- Show greeting: `Good Morning, <firstName>`.
- Heading: `Styled for you`.
- Use one full-width hero card as in Figma.
- Hero card content:
  - fashion image background
  - top-left chip: `Delivered by Tomorrow`
  - match pill: `91% your style`
  - top-right wishlist heart
  - bottom copy:
    - `Women’s edits`
    - `Your look today`
    - `See it on your avatar before you decide.`
  - primary CTA: `Try this on me`

### Occasion Section

- Heading: `What’s the occasion?`
- Tabs are clickable and horizontally scrollable.
- Remove `All`.
- Tabs:
  - Work
  - Casual
  - Date Night
  - Party
  - Formal
  - Wedding
  - Vacation
- Active tab is black pill.
- Inactive tabs use neutral outlined/soft styling.
- Do not leave a right margin gap at the end of the tab row.
- While scrolling tabs, do not add a left margin gap before the first visible tab.
- Product cards are 2 per row.
- Wishlist heart inside cards must stay circular and never be squeezed.
- CTA: `Explore products`.

### Find Your Style Banner

- Banner title: `Find your style in 30 seconds`.
- Body: `Swipe on looks you like and we’ll learn your style`.
- CTA: `Start swiping`.
- Use rounded background and image treatment from Figma.

### Price Section

- Heading: `Great style at every price`
- Tabs:
  - Under ₹999
  - Under ₹1999
  - Under ₹2999
  - Under ₹3999
- Product cards are 2 per row.
- CTA: `Explore products`.

### Shop by Brands

- Heading: `Shop by Brands`
- Subcopy: `Shop by your favorite brands for every audio journey`
- Use rounded brand logo pills in horizontal rows.
- CTA: `View All`.

### Saved Looks

- Heading: `Saved Looks`
- Use horizontal saved-look carousel.
- Each card includes:
  - look image
  - wishlist
  - match/delivery metadata
  - `Shop this look` CTA with cart icon
- Include pagination indicator.

### New Arrivals

- Heading: `New Arrivals this week`
- Show 2 product cards per row.
- Product card content:
  - image
  - wishlist
  - brand
  - product name
  - price
- CTA: `Explore products`.

### Wardrobe Banner

- Heading: `Build looks from what you already love`
- Body: `Add items from your wardrobe and we'll style them into looks you'll actually wear`
- CTA: `Add Items`.
- Use the dark rounded image banner from Figma.

## Bottom Navigation

Tabs:

- Home
- Explore
- Try-On
- Cart

Rules:

- Bottom nav appears only inside `HomeTabs`.
- It should not appear during auth, onboarding, avatar creation, or location access.
- Use DS icons from `docs/claude/icons.md`.
- Active tab uses neutral black styling.
- Inactive tabs use muted neutral styling.
- Do not add Profile or Saved tabs unless the product direction changes.

## State Shape

Keep onboarding state grouped.

```ts
interface OnboardingDraft {
  phone?: {
    countryCode: string;
    phoneNumber: string;
  };
  name?: string;
  height?: {
    feet: number;
    inches: number;
    centimeters: number;
  };
  fashionInterest?: "womens" | "mens";
  styleQuiz?: {
    likedStyleIds: string[];
    rejectedStyleIds: string[];
    skipped: boolean;
  };
  fullBodyPhotoUri?: string;
  avatarUri?: string;
  address?: string;
}
```

## Suggested Feature Structure

```txt
src/features/onboarding/screens/
  SplashScreen.tsx
  PhoneSignInScreen.tsx
  OtpVerificationScreen.tsx
  SetupNameScreen.tsx
  SetupHeightScreen.tsx
  SetupFashionInterestScreen.tsx
  SetupStyleQuizScreen.tsx
  UploadFullBodyPhotoScreen.tsx
  AvatarCreatingScreen.tsx
  AvatarReadyScreen.tsx
  LocationAccessScreen.tsx

src/features/onboarding/components/
  OnboardingStepShell.tsx
  OnboardingProgress.tsx
  CircularNextButton.tsx
  CountryCodePicker.tsx
  OtpInput.tsx
  HeightPicker.tsx
  FashionInterestCard.tsx
  StyleSwipeCard.tsx
  PhotoUploadBox.tsx

src/features/home/screens/
  HomeScreen.tsx
  ExploreScreen.tsx
  TryOnScreen.tsx
  CartScreen.tsx

src/features/home/components/
  HomeHeader.tsx
  HomeSearchBar.tsx
  StyledForYouHero.tsx
  HorizontalPillTabs.tsx
  LookProductCard.tsx
  StyleQuizBanner.tsx
  BrandLogoRail.tsx
  SavedLookCarousel.tsx
  NewArrivalCard.tsx
  WardrobeBanner.tsx
  BottomTabBar.tsx

src/features/onboarding/viewModels/
  useOnboardingViewModel.ts

src/features/home/viewModels/
  useHomeViewModel.ts
```

## React Native Implementation Guidelines

- Use `SafeAreaView` or the project safe-area wrapper for all screens.
- Use `KeyboardAvoidingView` for name, phone, and OTP screens.
- Use `FlatList` for large or repeatable card grids.
- Use `ScrollView` only for short static sections or horizontal rails.
- Use stable keys for every list item.
- Keep all styles in `StyleSheet.create`.
- No inline style objects inside render.
- Use `Pressable` for tappable UI.
- Set `accessibilityRole`, `accessibilityLabel`, and disabled states for buttons.
- Use `Image` or `ImageBackground` only with real assets or data-provided URIs.
- Use `resizeMode` deliberately:
  - `cover` for editorial card backgrounds
  - `contain` for product/logo assets
- Gesture-based style cards should use built-in gesture primitives already available in the repo. Do not add a gesture dependency without approval.

## Validation Checklist

- [ ] Onboarding progress has exactly 5 steps.
- [ ] OTP cannot be reached without a valid phone number.
- [ ] Verify cannot be tapped before all 4 OTP digits are entered.
- [ ] OTP backspace deletes naturally across fields.
- [ ] Height picker snaps one value at a time.
- [ ] Fashion interest allows only one selected option.
- [ ] Style cards work through both swipe gestures and buttons.
- [ ] Upload uses real device photo picker.
- [ ] Avatar creation simulates faster than 30 seconds for prototype.
- [ ] Location comes after avatar ready and before homepage.
- [ ] Homepage address reflects selected location.
- [ ] Homepage matches Figma node `99:3295` section order.
- [ ] Homepage tabs are clickable and horizontally scrollable.
- [ ] Product cards are 2 per row.
- [ ] Bottom nav contains only Home, Explore, Try-On, Cart.
- [ ] All colors, spacing, radii, and typography come from DS tokens.
- [ ] Loading, error, and empty states exist for every data-driven view.
