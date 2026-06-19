# Stylus App Overview

Snapshot date: 2026-06-17

This document summarizes the app that exists in this repository so far. It is a product and engineering snapshot, not a final specification.

Stylus is currently a mobile-first fashion decision app focused on virtual try-on, outfit evaluation, closet reuse, and AI-assisted styling through Mira. The intended loop is:

```text
Discover -> Try on -> Evaluate -> Style -> Save / Buy / Reuse with closet
```

The app is not structured as a generic marketplace. Most core screens are built around looks, try-on, wardrobe intelligence, and confidence before purchase.

## Current Stack

| Area | Current implementation |
|---|---|
| Runtime | Expo app, React Native 0.74, React 18 |
| Language | TypeScript |
| App entry | `App.tsx` |
| Main navigation | Custom state-driven navigation in `src/navigation/RootNavigator.tsx` and `src/navigation/HomeTabsNavigator.tsx` |
| Styling | React Native `StyleSheet`, shared app theme in `src/theme.ts` |
| Fonts | Outfit from `@expo-google-fonts/outfit`; Satoshi assets also exist under `packages/ds/assets/fonts` |
| Images | Local prototype imagery in `Images/` and app assets in `src/assets/` |
| Device APIs | Expo image picker, document picker, media library, notifications, location permissions, linear gradients |
| Design system package | `packages/ds` contains reusable tokens and components, but the active app mostly uses `src/theme.ts` plus feature-level components |
| Backend | No real backend integration yet; state is local/in-memory |

## Project Structure

| Path | Purpose |
|---|---|
| `App.tsx` | Loads fonts, manages top status-bar background, renders `RootNavigator` |
| `src/navigation/` | Custom app route and tab state |
| `src/features/onboarding/` | Splash, auth, setup, style quiz, photo upload, avatar screens and onboarding state |
| `src/features/home/` | Main app screens, home components, prototype product/look data, utility logic |
| `src/components/` | Shared app-level buttons, icons, dividers, headers |
| `src/data/` | Countries, splash/onboarding content, style quiz data |
| `src/theme.ts` | Active app colors, typography, spacing, radii |
| `packages/ds/` | Standalone StyleOS design-system package with tokens and primitive components |
| `Images/` | Prototype fashion product, model, and motion assets |
| `docs/claude/` | Engineering/design guidance and token documentation |
| `.cursor/rules/uiux-product-review.mdc` | Product/UI guidance for this fashion try-on app |
| `ios/` | Native iOS project files generated for Expo run/build |
| `src/screens/` | Older screen files still present; the active app flow imports from `src/features/*` |

## App Entry And Navigation

`App.tsx` loads Outfit fonts and renders a simple loading state called "Fynd Stylus" until fonts load or a fallback timer expires. It wraps the whole app in a status-bar guard so top background color can change for screens like Closet and Account.

`RootNavigator` owns onboarding/auth route state:

```text
Splash
PhoneSignIn
OtpVerification
SetupName
SetupHeight
SetupFashionInterest
SetupStyleQuiz
UploadFullBodyPhoto
AvatarCreating
AvatarReady
HomeTabs
```

After OTP verification, the app currently sends the user to `HomeTabs` and opens the setup steps as an onboarding bottom drawer, beginning with name. The full-screen setup screens still exist and are also wired in the root route map.

`HomeTabsNavigator` owns the main app experience. It manages:

- Active tab state
- Home look/product/brand detail state
- Search overlay
- Explore, Closet, and Account internal view state
- Try-on session state and simulated render state
- Look snapshots after try-on editing or saving
- Cart items and cart count
- Shop-this-look flows
- Status-bar background changes
- Notification scheduling when a try-on render finishes while browsing

Current tab names are:

```text
Home
Stylist
TryOn
Closet
Feed
AIStylist
Cart
Profile
```

The visible bottom tab bar usually shows the main product tabs, but it is hidden during deeper views like PDPs, cart, search, selected look detail, closet detail, and profile sub-pages.

## Core Product Flow

### 1. Onboarding And Setup

Active files:

- `src/features/onboarding/screens/SplashScreen.tsx`
- `src/features/onboarding/screens/PhoneSignInScreen.tsx`
- `src/features/onboarding/screens/OtpVerificationScreen.tsx`
- `src/features/onboarding/screens/SetupNameScreen.tsx`
- `src/features/onboarding/screens/SetupHeightScreen.tsx`
- `src/features/onboarding/screens/SetupFashionInterestScreen.tsx`
- `src/features/onboarding/screens/SetupStyleQuizScreen.tsx`
- `src/features/onboarding/screens/UploadFullBodyPhotoScreen.tsx`
- `src/features/onboarding/screens/AvatarCreatingScreen.tsx`
- `src/features/onboarding/screens/AvatarReadyScreen.tsx`
- `src/features/onboarding/components/OnboardingSetupDrawer.tsx`
- `src/features/onboarding/viewModels/useOnboardingViewModel.ts`

Implemented behavior:

- Splash carousel introduces try-on, style matching, and wardrobe reuse.
- Phone sign-in supports country code selection and social buttons.
- OTP verification uses a 6-digit code UI, countdown, resend behavior, edit phone action, loading state, shake-on-error animation, and success scale animation.
- Any complete code verifies except `000000`, which intentionally shows an error.
- Setup captures name, height, fashion interest, style quiz preferences, full-body photo URI, avatar URI, and optional profile fields.
- Style quiz uses swipe cards and stores liked/rejected style IDs.
- Style profile is only considered complete after at least 5 style inputs and no skip.
- Full-body upload uses one photo as the first try-on activation step.
- Avatar creation and ready screens simulate the avatar flow.
- The same setup steps can render as full screens or inside the post-login drawer.

Current onboarding state is held in memory by `useOnboardingViewModel`.

### 2. Home

Active file:

- `src/features/home/screens/HomeScreen.tsx`

Home is the main discovery surface. It includes:

- Collapsing delivery/location header
- Collapsing search row with search, voice, and camera affordances
- Hero carousel for style quiz, virtual try-on, and weekly edits
- Occasion-first outfit section
- Wishlist toggles for look cards
- "Build looks from what you own" wardrobe intelligence card
- Shop-by-brand rails
- Saved looks carousel
- Color analysis card
- New arrivals section

Important product details:

- Home uses outfit cards and complete looks, not only SKU tiles.
- Occasion filters include Work, Casual, Date Night, Party, Formal, Travel, and Festive.
- It uses `hasCompletedStyleProfile` so personalized labels can be gated.
- Saved looks derive from wishlisted looks when available, otherwise seeded prototype looks.
- Brand taps open `BrandPlpScreen`.
- Look taps open `ModelLookPdpScreen`.

### 3. Search And Explore

Active files:

- `src/features/home/screens/SearchDiscoveryScreen.tsx`
- `src/features/home/screens/ExploreScreen.tsx`
- `src/features/home/components/ProductListingScreen.tsx`

Search is implemented as an intent discovery overlay. It includes:

- Focused search input
- Recent searches
- Trending look cards
- Style tiles
- Budget filters
- Brand logo pills
- Animated header hide/reveal behavior while scrolling

Explore/Feed includes richer browsing and editorial sections:

- Trend stories
- Occasion edits
- Community looks
- Complete look sections
- "Eyeing looks" section
- Summer day/category browsing
- Budget looks
- Occasion tiles
- Internal collection views
- Product listing views
- Product PDP and look PDP transitions inside Explore

`ProductListingScreen` is a reusable listing surface with:

- Search inside listing
- Sort options
- Filter sheets for size, color, price, occasion, and vibe
- Quick chips for sale, price drop, budget buys, and quick delivery
- Product cards with wishlist and cart header actions
- Trending looks rail after the first set of products
- Scroll progress pill

### 4. Product Detail

Active file:

- `src/features/home/screens/ProductPdpScreen.tsx`

The product PDP includes:

- Image gallery with multiple prototype images
- Header with back, search, wishlist, and cart
- Match/merchandising label handling
- Product info strip
- Size selector and size chart screen
- Inline and sticky CTAs for try-on and add-to-cart
- Delivery services and pincode/saved-address sheet
- Wardrobe pairing section
- "Style this item" looks
- Mira summary and Mira note sections
- Product details accordion
- Reviews
- Similar products

The PDP is intentionally confidence-focused: it answers "how would I wear this?", "can I try it?", "will it pair with my wardrobe?", and "can I get it delivered?"

### 5. Look Detail And Shop This Look

Active files:

- `src/features/home/screens/ModelLookPdpScreen.tsx`
- `src/features/home/screens/TryOnScreen.tsx` for `ShopThisLookScreen`

The look PDP includes:

- Full-look hero image
- Save/wishlist state
- Look info strip
- Shop-this-look piece selection
- Mira note
- Try-on and add-to-cart CTAs
- "Wear it differently" variation carousel
- Similar item category tabs
- Sticky CTA behavior

Shop-this-look flow includes:

- Look title and number of buyable pieces
- Horizontal product carousel
- Piece-level product open
- Size selection sheet
- Add-to-cart behavior
- View cart handoff
- Filtering out closet-owned pieces when needed

### 6. Try-On

Active file:

- `src/features/home/screens/TryOnScreen.tsx`

Try-on is the core activation moment. It currently includes:

- Avatar/photo requirement based on `draft.avatarUri` or `draft.fullBodyPhotoUri`
- Simulated render delay, defaulting to 3000 ms
- Try-on loading/creation screen
- Full try-on view using local model/avatar imagery
- Look pieces generated from the selected `ProductLook`
- Piece cards and piece panel
- Alternative selection for individual pieces
- Build-look drawer with slots for top, bottom, footwear, bag, layer, and accessory
- Prompt text field for style intent inside build-look flow
- Save state passed back to the navigator snapshot
- Add selected pieces to cart
- Continue browsing while render runs
- Notification scheduling if the app leaves active state during render
- "Your look is ready" status toast/bar when browsing
- Shop-this-look handoff after try-on

The try-on system is still prototype-local. It does not call a real virtual try-on model yet.

### 7. Stylist And Mira

Active files:

- `src/features/home/screens/StylistScreen.tsx`
- `src/features/home/screens/ExploreScreen.tsx` as the current `AIStylist` placeholder view

`StylistScreen` is an outfit builder. It includes:

- Top controls for outfit board, product rows, and selected pieces
- Shuffle action
- Slots for top, bottom, layer, shoes, bag, and accessory
- Piece options sourced from `lookPieces.ts`
- Closet prompt with "Add one item"
- Try-on selected outfit CTA

The `AIStylist` tab currently renders `ExploreScreen` with the title "AI Stylist" and copy "Ask Mira about style, outfits, and what to buy." Deeper Mira behavior appears across PDP, look PDP, closet detail, account prompts, and product copy, but a true conversational Mira interface is not implemented yet.

### 8. Closet

Active file:

- `src/features/home/screens/ClosetScreen.tsx`

Closet is one of the most developed prototype areas. It includes:

- "My Closet" screen with item count
- Sticky search and category filter rail
- Category filters for All, Top, Bottom, Footwear, and Layer
- Closet item cards
- Favorite toggles
- Add item action
- Quick-add batch drawer
- Photo library selection
- Camera capture
- File picker for image files
- Up to 10 selected assets per batch
- Simulated item detection and review
- Processing and failed detection states
- Detected item expansion
- Edit detected product details before save
- Save detected items into the closet grid
- Closet item detail page
- Edit closet item drawer
- Detail facts for color, material, gender, and fit
- Catalog pair recommendations
- Mira advice for the closet item
- Try-on and auto-pair try-on CTAs
- Build-look drawer anchored around a closet item

Closet auto-pairing is local heuristic logic. It scores complement pieces from `lookPieces.ts` based on simple color/material/tag signals and creates a look session for try-on.

### 9. Saved, Closet Favourites, And Account

Active files:

- `src/features/home/screens/AccountScreen.tsx`
- `src/features/home/screens/AccountEditProfileScreen.tsx`
- `src/features/home/screens/SavedScreen.tsx`
- `src/features/home/screens/ClosetFavouritesScreen.tsx`

Account includes:

- Profile card with edit action
- Prompt to complete style profile or add closet pieces
- "Your style", measurements, and avatar rows
- Saved, Closet Favourites, and Orders rows
- Saved addresses, payments, help, and privacy rows
- Notification preference row
- Social sharing rows
- App version display
- Edit profile screen
- Saved addresses screen
- Add address form with pincode-derived Indian state helper
- Detail pages for avatar, measurements, style, and privacy

Saved includes:

- Tabs for All, Looks, Products, and Shared
- Filters for price dropped, in stock, Work, and Casual
- Price drop section
- Saved look cards
- Shared look cards
- Saved product cards
- Empty state with explore CTA
- Try-on callbacks for saved items

Closet Favourites includes:

- Hero favorite card
- Favorite closet pieces
- Favorite looks
- Style this and Add one item actions

### 10. Cart

Active file:

- `src/features/home/screens/CartScreen.tsx`

Cart includes:

- Cart item cards with quantity controls
- Clear cart confirmation
- Empty cart state
- Offer chips and applied offer state
- Coupon page
- Gift card entry page
- Loyalty section
- Price summary
- Checkout dock

Cart state is managed by `HomeTabsNavigator` and passed into `CartScreen`. There is no real checkout integration yet.

## Data And Prototype Content

| File | Contents |
|---|---|
| `src/features/home/data/prototypeProductImages.ts` | Central mapping from local image assets to named prototype product images |
| `src/features/home/data/lookPieces.ts` | Look-piece model, default pieces, alternatives, prices, sizes, price helpers, shop-this-look helpers |
| `src/features/home/data/brandCatalog.ts` | Brand metadata, brand products, brand rows |
| `src/data/styleQuiz.ts` | Style quiz cards, curation rules, womens-specific card images |
| `src/data/onboarding.ts` | Splash carousel content and social sign-in options |
| `src/data/countries.ts` | Country options and default country |

The app currently uses real local image assets for Maje, Sandro, Zara, H&M, Vero Moda, Trends, model imagery, closet examples, and shop-this-look pieces. Some hero imagery uses external Unsplash URLs.

## Personalization Guardrails In Code

The personalization utility is:

- `src/features/home/utils/stylePersonalization.ts`

Current behavior:

- A completed style profile requires at least 5 quiz answers.
- Skipped style quiz means no completed profile.
- `getMerchandisingLabel` returns generic labels like Popular, Trending, Work-ready, New, and Try now until a style profile exists.

Important watchout:

- Some seeded prototype objects still include strings such as `91% match`.
- Screens that use `hasCompletedStyleProfile` or `getMerchandisingLabel` can gate/replace those labels, but seeded data should continue to be reviewed as the app becomes more realistic.

## Design Language

Active app-level theme:

- `src/theme.ts`

Current theme characteristics:

- White app background
- Warm neutral surfaces
- Black primary text and CTAs
- Outfit font family
- Compact spacing tokens
- Rounded cards/sheets/buttons
- Image-forward cards
- Floating bottom navigation

Design-system package:

- `packages/ds/src/tokens/*`
- `packages/ds/src/components/*`

`packages/ds` currently provides reusable tokens and primitives:

- `Button`
- `IconButton`
- `Card`
- `InputField`
- `Badge`
- `Icon`

The active app screens do not yet consistently import from `@styleos/ds`; they mostly use the app theme and local feature components.

## Product Rules Reflected So Far

Implemented or partially implemented:

- Try-on appears as a major action on home, PDPs, look PDPs, closet detail, saved, stylist, and explore.
- Closet upload is framed as "Add one item", "Build looks from what you own", and "Add 3 pieces you love" rather than heavy wardrobe-completion language.
- Mira appears across advice, style profile, closet, PDP, and account flows.
- Home and detail screens emphasize outfits, styling, and wardrobe confidence before pure shopping.
- Product/detail flows connect advice back to actions: try on, shop, save, add closet items, view cart.
- Style profile gating exists before stronger personalization claims.

Areas to keep watching:

- Replace or gate all hardcoded match-score labels for new users.
- Evolve `AIStylist` from an Explore placeholder into a dedicated Mira chat/decision flow.
- Connect try-on, closet detection, auth, cart, wishlist, and checkout to real services.
- Add persistence for onboarding, closet, cart, saved looks, and profile data.
- Consolidate active app components with the `packages/ds` design-system package where useful.

## Current Prototype Boundaries

This app is highly interactive, but many systems are simulated:

- Auth is local and does not call a server.
- OTP verification is mocked.
- Onboarding, profile, cart, saved state, and closet state are in-memory only.
- Virtual try-on rendering is simulated with timers and local images.
- Avatar generation is simulated.
- Closet product detection is simulated after selected images/files.
- Product catalog, prices, reviews, brands, delivery, coupons, and recommendations are seed data.
- Checkout is not integrated.
- Notifications are used for the try-on-ready flow, but only after permission is granted.

## How To Run

Available scripts from `package.json`:

```bash
npm run start
npm run ios
npm run android
npm run web
```

Expo app metadata:

- App name: `Stylus`
- Slug: `stylus-onboarding-prototype`
- Version: `0.1.0`
- Orientation: portrait
- iOS bundle identifier: `com.styleos.app`

## High-Level Build Status

| Area | Status |
|---|---|
| Onboarding/auth prototype | Built |
| Style quiz and profile signals | Built locally |
| Home/discovery surface | Built |
| Search discovery | Built |
| Explore/feed | Built |
| Brand PLP | Built |
| Product listing | Built |
| Product PDP | Built |
| Look PDP | Built |
| Shop this look | Built |
| Try-on prototype | Built locally with simulated render |
| Stylist outfit builder | Built |
| Mira dedicated chat | Not built yet |
| Closet grid and detail | Built |
| Closet upload/detection review | Built locally with simulated detection |
| Closet auto-pair/build-look | Built locally |
| Saved and closet favourites | Built |
| Account/profile/address flows | Built locally |
| Cart/coupons/gift cards | Built locally |
| Persistence/backend | Not built yet |
| Real VTO/AI services | Not built yet |
| Real checkout | Not built yet |
