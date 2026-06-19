# Closet Feature Spec

This file documents the full Closet feature as implemented in the Stylus mobile prototype. It is written as a portable handoff document so it can be moved into another folder or repo and used directly as a product, UI, and engineering reference.

## Product Intent

Closet is the wardrobe intelligence part of Stylus. It should help users turn items they already own into try-on-ready outfits, reduce uncertainty before buying, and make Mira feel useful without asking the user to do heavy wardrobe admin.

Core product loop:

```text
Add one closet item -> Mira detects/reviews it -> User saves it -> User styles it -> User tries on the look -> User saves/buys/reuses it
```

The feature should not feel like a generic wardrobe inventory tool. It should feel like a personal fashion decision system.

Use copy like:

- `Add one item`
- `Build looks from what you own`
- `Style something you already have`
- `Try on auto-pair`
- `Build your look`
- `Mira can build looks from what you already own`

Avoid copy like:

- `Upload your wardrobe`
- `Complete your closet`
- `Add 10 items to unlock`
- discount-first or marketplace-first language

## Current Implementation Status

The Closet feature is built as a local prototype. It has real UI, local state, image/file/photo picking hooks, simulated detection, simulated recommendations, local favourites, and try-on handoff. It does not yet persist closet data to a backend.

Primary source files:

| Area | File |
|---|---|
| Main closet screen, add flow, detail, edit, build look drawer | `src/features/home/screens/ClosetScreen.tsx` |
| Closet favourites account subpage | `src/features/home/screens/ClosetFavouritesScreen.tsx` |
| Saved looks/products account subpage | `src/features/home/screens/SavedScreen.tsx` |
| Home tab navigation and closet try-on handoff | `src/navigation/HomeTabsNavigator.tsx` |
| Bottom tab entry | `src/features/home/components/BottomTabBar.tsx` |
| Home wardrobe prompt | `src/features/home/screens/HomeScreen.tsx` |
| Standalone wardrobe banner component | `src/features/home/components/WardrobeBanner.tsx` |
| Try-on editor/render destination | `src/features/home/screens/TryOnScreen.tsx` |
| Product detail wardrobe pairing | `src/features/home/screens/ProductPdpScreen.tsx` |
| Stylist closet prompt | `src/features/home/screens/StylistScreen.tsx` |
| Notifications closet nudge | `src/features/home/screens/NotificationsScreen.tsx` |

Important dependencies:

```json
{
  "@expo/vector-icons": "^14.0.3",
  "expo-document-picker": "~12.0.2",
  "expo-image-picker": "~15.1.0",
  "expo-linear-gradient": "~13.0.2",
  "expo-media-library": "~16.0.5",
  "expo-notifications": "~0.28.19",
  "react-native-svg": "15.2.0"
}
```

## User-Facing Surfaces

### 1. Closet Tab

Bottom navigation includes a dedicated `Closet` tab with a shirt icon. This is a core app destination, not a secondary profile page.

Main screen UI:

- Header title: `My Closet`
- Header subtitle: dynamic item count, for example `2 items`
- Primary toolbar action: `Add item`
- Sticky search area with placeholder `Search your wardrobe...`
- Mic icon inside search field
- Horizontal visual category rail:
  - `All`
  - `Top`
  - `Bottom`
  - `Footwear`
  - `Layer`
- Two-column closet item grid
- Each item card has:
  - large product image
  - favourite heart toggle
  - item title
  - category
  - up to three horizontal tags

Current seeded closet data:

- `Striped knit set`
- `Pleated trousers`

Both are local `ClosetPiece` objects and are shown before any uploaded items are saved.

### 2. Add Item / Quick Add Drawer

The `Add item` button opens a bottom drawer called `Add New Items`.

Drawer copy:

- Title: `Add New Items`
- Subtitle: `Select multiple photos and Mira will detect each item automatically.`
- Upload target label:
  - `Select Photos` in the initial state
  - `Add More Photos` once the user is reviewing detected items

The add flow supports:

- Photo library selection
- Camera capture
- File picker for images
- Multiple selected assets
- Up to 10 selected assets per batch
- Duplicate asset filtering
- Native iOS action sheet
- Android alert action menu

Selection options:

- `Photo library`
- `Take photo`
- `Choose files`
- `Cancel`

Validation and system messages:

- If 10 photos are already selected: `Photo limit reached`
- If a duplicate is selected: `Already added`
- If photo permission is missing: `Photo access needed`
- If camera permission is missing: `Camera access needed`
- If document picker fails: `Files unavailable`

Implementation note: `PhotoLibraryPickerModal` exists as a custom gallery modal, but the currently reachable path uses Expo ImagePicker's native picker and DocumentPicker. If this feature is moved to another repo, either wire the custom modal through `setIsPhotoLibraryVisible(true)` or remove it.

### 3. Simulated Detection Flow

After photos/files are picked, the drawer moves into review mode and each selected asset becomes a processing entry.

Detection behavior:

- Processing entries show an image thumbnail and `Analysing`.
- A shimmer animation runs over analysing cards.
- Simulated analysis completes after about `1700ms`.
- Every source where `sourceIndex % 3 === 0` produces two detected products.
- Other sources produce one detected product.
- Every fifth selected source after the first can fail detection.
- Failed entries show `Detection failed` and can be removed.

Detected item templates:

| Template | Category | Color | Material | Fit | Tags |
|---|---|---|---|---|---|
| White Graphic Tee | Top | White | Cotton | Regular | casual, graphic print, short sleeve |
| Light Wash Jeans | Bottom | Blue | Denim | Straight leg | casual, light wash, straight leg |
| Cropped Knit Jacket | Layer | Beige | Knit | Cropped | casual, cropped, light layer |
| Everyday Leather Shoes | Shoes | Brown | Leather | Regular | casual, leather, everyday |
| Shoulder Bag | Bag | Neutral | Leather | Regular | casual, shoulder bag, daywear |

These templates are prototype-only and should be replaced by real detection output later.

### 4. Detection Review Cards

Each detected item appears in a review card.

Collapsed card shows:

- item image
- detected item name
- category and color
- tags
- edit icon
- remove icon

Expanded card supports quick edits:

- item name text input
- category chips:
  - `Top`
  - `Bottom`
  - `Layer`
  - `Shoes`
  - `Bag`
- size chips based on category:
  - tops/layers/bags: `XS`, `S`, `M`, `L`, `XL`
  - bottoms: `26`, `28`, `30`, `32`, `34`, `36`
  - shoes: `5`, `6`, `7`, `8`, `9`, `10`
- `Add More Details` action

The drawer has a bottom save CTA:

- `Add 1 Item`
- `Add 2 Items`
- `Add X Items`

The CTA is disabled when there are no completed detected items.

### 5. Full Edit Product Step

The full edit step is reused in two places:

- from a detected review item
- from a saved closet item detail page

Header:

- Title: `Edit Product`
- Back icon when editing from review
- Close icon when editing an existing closet item

Fields:

- `Item name *`
- `Category *`
- `Size`
- `Gender`
- `Color`
- `Material`
- `Fit`
- `Tags`

Category options:

- `Top`
- `Bottom`
- `Layer`
- `Shoes`
- `Bag`

Gender options:

- `Women`
- `Men`

Color options:

- `White`
- `Black`
- `Blue`
- `Beige`
- `Brown`
- `Red`
- `Green`
- `Pink`
- `Cream`
- `Ivory`

Material options:

- `Cotton`
- `Denim`
- `Viscose`
- `Linen blend`
- `Leather`
- `Knit`

Fit options:

- `Regular`
- `Relaxed`
- `Slim`
- `Straight leg`
- `Wide leg`
- `Pleated`
- `Cropped`

Rules:

- item name is required
- category is required
- tags are normalized, deduped, and capped at 3
- empty optional fields become `+ Add size`, `+ Add fit`, `+ Add material`, or `+ Add gender` once saved

CTA:

- `Save changes`

### 6. Saving Detected Items

When the user taps `Add X Items`:

- completed detected entries are converted to `ClosetPiece`
- new pieces are prepended to the closet grid
- quick add state resets
- closet scroll position jumps to top
- if the user marked an item for detail-after-save, that item opens directly in detail view

Saved `ClosetPiece` defaults:

- `condition: "New"`
- `lastWorn: "Never"`
- `status: "Available"`
- `wornCount: 0`
- `detailImage` mirrors the detected image

Current data is local React state only.

### 7. Closet Item Detail Page

Tapping a closet item opens a PDP-style closet detail screen and hides the bottom tab bar.

Header:

- back button
- search bar with placeholder `Search styles, occasions, pieces`
- wishlist button
- cart button with cart count badge

Hero:

- full-width item image
- height is about 58 percent of the viewport
- floating favourite heart

Intro:

- item title
- edit icon
- category and color line, for example `Bottoms - Ivory`

Mira advice section:

- title: `Mira says`
- badge: `AI stylist`
- generated copy: `Keep the [color] as the focus. Add one clean neutral and a sharper accessory, then try it on to check proportions.`
- CTA: `Chat with AI Stylist`

Complete-the-look rail:

- section title: `Complete the look`
- horizontal catalog cards
- card image
- save heart
- title
- price

Current catalog pair examples:

- `Ivory knit top` - `Rs. 2,490`
- `Cropped jacket` - `Rs. 5,990`
- `Leather flat` - `Rs. 3,290`
- `Brown shoulder bag` - `Rs. 4,490`

Product detail block:

- `Color`
- `Material`
- `Gender`
- `Fit`

Tags block:

- all saved tags rendered as chips

Sticky bottom CTA dock:

- secondary CTA: `Try on`
- primary CTA: `Try on auto-pair`

Important behavior:

- `Try on` opens the build-look drawer anchored around the closet item.
- `Try on auto-pair` immediately builds a recommended outfit and routes to TryOn.

### 8. Edit Existing Closet Item

The detail edit icon opens the same `Edit Product` drawer used in detection review.

On save:

- selected `ClosetPiece` is updated in local state
- selected detail item is replaced with the updated object
- edit drawer closes

This allows users to fix AI detection output after saving.

### 9. Build Your Look Drawer

The `Try on` CTA in closet detail opens a bottom drawer titled `Build your look`.

Drawer UI:

- top drag handle
- centered title: `Build your look`
- shuffle icon button
- grid of outfit slots
- bottom CTA: `Generate Look`

Slots:

- `Top`
- `Bottom`
- `Footwear`
- `Bag`
- `Layer`
- `Accessory`
- `Dress`

Owned item behavior:

- the selected closet item is inserted into the correct slot
- it is labeled `Yours`
- it is locked and cannot be removed

Other slot behavior:

- empty slots show a plus icon and `Add [slot]`
- selected non-owned slots can be removed
- tapping a slot opens a product listing drawer for that category
- product listing has search enabled
- current selected option has `Current look`
- other options show `Try now`

Shuffle behavior:

- keeps the owned item locked
- replaces non-owned slot pieces with alternative products from `lookPieces.ts`
- avoids reselecting the same image/name when possible

Generate behavior:

- builds a `ProductLook` branded as `Mira`
- title format: `Build with [item title]`
- match: `Build look`
- vibe: `Closet builder`
- owned pieces are excluded from buyable total
- routes to TryOn with:
  - `context: "Closet build look"`
  - render delay of about `1800ms`
  - session pieces preserved for shop-this-look
  - owned pieces locked in editor

### 10. Auto-Pair Try-On

The `Try on auto-pair` CTA creates a complete look automatically.

Kind inference:

- shoe/sneaker -> `shoe`
- bag -> `bag`
- belt/accessory -> `accessory`
- layer/jacket/blazer/coat -> `jacket`
- bottom/jean/trouser/skirt/pant -> `bottom`
- dress -> `dress`
- fallback -> `top`

Complement logic:

| Closet item kind | Suggested complement kinds |
|---|---|
| top | bottom, shoe, bag |
| bottom | top, shoe, bag |
| jacket | top, bottom, shoe, bag |
| shoe | top, bottom, bag |
| bag/accessory | top, bottom, shoe |
| dress | shoe, bag, jacket |

Scoring signals:

- brown closet items score higher with cream, linen, white, and khaki products
- cream closet items score higher with brown, tan, olive, and neutral products
- floral closet items score higher with linen, neutral, brown, and white products
- denim closet items score higher with white, cream, and brown products

Generated look:

- brand: `Mira`
- title format: `[item title] auto-pair`
- match: `Auto-paired`
- vibe: `Closet styled`
- tries: `Ready to try`
- owned item price: `Rs. 0`
- total price includes only complement pieces

Try-on routing:

- opens TryOn tab
- uses session pieces for shop-this-look
- locks owned pieces in editor
- stores a local look snapshot so TryOn and Shop This Look share the same pieces

### 11. Try-On Integration

Closet looks use the existing TryOn surface.

Closet-specific behavior:

- owned pieces are marked with `isOwned: true`
- owned piece price is `Rs. 0`
- owned alternatives display `From your wardrobe`
- editor can lock owned pieces when launched from closet build/auto-pair
- shop-this-look can use the session pieces rather than rebuilding a default look
- if the render is still processing and the user continues browsing, the app can show a ready toast and schedule a local notification if permission is granted

### 12. Closet Favourites

`Closet Favourites` is an Account subpage.

Entry:

- Account -> Activity -> `Closet Favourites`

Header:

- back button
- title: `Closet Favourites`
- plus button to open Closet
- count strip: `[count] pieces Mira can reuse in looks`

Hero favourite card:

- large image
- badge such as `Most reused`
- kicker: `Start with a favourite`
- item title
- item note
- primary CTA: `Style this`
- secondary CTA: `Add one item`

Favourite pieces section:

- title: `Favourite pieces`
- body: `Pieces you marked as easy to repeat.`
- `Manage` button opens Closet
- list cards show:
  - image
  - category
  - last styled count
  - title
  - note
  - occasion chips
  - `Style this` CTA

Ready looks section:

- title: `Ready looks`
- body: `Outfit ideas built around closet favourites.`
- horizontal look cards

Current seeded favourites:

- `White linen shirt`
- `Wide-leg trousers`
- `Beige trench`
- `Structured brown bag`

Current ready looks:

- `Work-ready neutral`
- `Soft travel day`

### 13. Saved Screen Closet Connections

`Saved` is an Account subpage that includes wardrobe-aware saved looks and products.

Tabs:

- `All`
- `Looks`
- `Products`
- `Shared`

Filters:

- `All`
- `Price dropped`
- `In stock`
- `Work`
- `Casual`

Closet-aware UI:

- saved look piece cluster marks owned items
- saved looks can show `You own the shirt`
- products can show `Goes with your wardrobe`
- price CTA can say `Buy X available pieces`
- out-of-stock pieces are visually marked
- saved cards include `Try on` CTAs

This screen is not the main closet, but it supports the closet reuse loop by showing what the user already owns inside saved looks.

### 14. Other Closet Entry Points

Home screen:

- `WardrobeIntelligenceCard`
- title: `Build looks from what you own`
- copy: `Add items you already own. We'll suggest outfits and pieces that go with them.`
- CTA visual text: `Start swiping`
- currently routes to style quiz in this prototype, but product-wise it should route to a closet/style-building flow when fully connected

Standalone wardrobe banner:

- component: `WardrobeBanner`
- title: `Build looks from what you already love`
- copy: `Add items from your wardrobe and we'll style them into looks you'll actually wear`
- CTA: `Add Items`

Notifications:

- closet notification title: `Style something from your closet`
- body: `Add one piece you already own so Mira can build looks around it.`
- action: `Add one item`
- opens Closet

Stylist screen:

- footer prompt: `Style something you already have`
- CTA: `Add one item`
- opens Closet

Product PDP:

- wardrobe pairing section labeled `From your wardrobe`
- shows one new product and one owned item
- copy: `This pairs with your black trousers`
- CTA: `Try on together`

Account screen:

- profile prompt may ask user to add closet pieces if style profile exists but closet count is low
- Activity rows include:
  - `Saved`
  - `Closet Favourites`

## Data Models

Core closet item:

```ts
type ClosetPiece = {
  category: string;
  color: string;
  condition: string;
  detailImage: string;
  fit: string;
  gender: string;
  id: string;
  image: string;
  lastWorn: string;
  material: string;
  size: string;
  status: string;
  tags: string[];
  title: string;
  wornCount: number;
};
```

Detected item:

```ts
type DetectedClosetItem = {
  category: "Top" | "Bottom" | "Layer" | "Shoes" | "Bag";
  color: string;
  fit: string;
  gender: string;
  id: string;
  image: string;
  material: string;
  name: string;
  size: string;
  sourceAssetKey?: string;
  tags: string[];
};
```

Detection review entry:

```ts
type DetectionReviewEntry =
  | {
      kind: "detected";
      item: DetectedClosetItem;
    }
  | {
      batchId: string;
      id: string;
      image: string;
      kind: "processing";
      sourceAssetKey: string;
      state: "analyzing" | "failed";
    };
```

Try-on handoff item:

```ts
type ClosetAutoPairItem = Pick<
  ClosetPiece,
  "category" | "color" | "fit" | "id" | "image" | "material" | "tags" | "title"
>;
```

Build look slot:

```ts
type ClosetBuildSlotConfig = {
  kind: LookPiece["kind"];
  label: string;
  listingTitle: string;
};
```

## State Machine

Main Closet state:

- `pieces`: saved closet items
- `selectedPiece`: current detail page item
- `favoritePieceIds`: local favourite item ids
- `selectedCategoryFilter`: active grid filter
- `isQuickAddVisible`: quick add drawer visibility
- `quickAddMode`: `select`, `analyzing`, or `review`
- `reviewEntries`: detection processing, failed, and detected rows
- `selectedPhotoAssets`: assets already included in the current batch
- `expandedDetectedItemId`: review card expansion
- `detailAfterSaveItemId`: opens a saved item detail after batch save
- `isDetailEditVisible`: edit existing closet item drawer
- `isBuildLookDrawerVisible`: build look drawer

Flow:

```text
Closet tab
  -> Add item
  -> Select photo / take photo / choose files
  -> Processing review entries
  -> Simulated detection completes
  -> User reviews, edits, removes, or expands entries
  -> Add X Items
  -> New pieces appear at top of grid
  -> User opens item detail
  -> User edits item, builds look, or auto-pairs
  -> TryOn launches with owned pieces preserved
```

## Navigation Contracts

`ClosetScreen` accepts:

```ts
type ClosetScreenProps = {
  cartCount?: number;
  onAskMira?: () => void;
  onInternalViewChange?: (isOpen: boolean) => void;
  onOpenCart?: () => void;
  onOpenSearch?: () => void;
  onOpenWishlist?: () => void;
  onStartAutoPairTryOn?: (item: ClosetAutoPairItem) => void;
  onStartTryOn?: (item: ClosetAutoPairItem, pieces: LookPiece[]) => void;
};
```

Navigator behavior:

- `onInternalViewChange(true)` hides bottom tabs when closet detail is open
- `onOpenWishlist` routes to Account Saved
- `onAskMira` routes to AI Stylist
- `onOpenCart` routes to Cart
- `onOpenSearch` opens search overlay
- `onStartAutoPairTryOn` creates an auto-pair look and opens TryOn
- `onStartTryOn` creates a build-look session and opens TryOn

## Visual Design Notes

Closet should feel:

- image-led
- calm
- useful
- try-on-first
- outfit-oriented
- light enough that adding one item feels easy

Do:

- use large item imagery
- keep CTAs thumb-friendly
- show Mira advice next to real actions
- frame upload as one helpful item, not a chore
- keep owned pieces visible in try-on/shop flows

Do not:

- make the closet feel like a spreadsheet
- push product grids before styling value
- overuse fake personalization
- use heavy upload requirements
- hide try-on behind secondary actions

## Accessibility Notes

Implemented accessibility labels include:

- `Add item`
- `Search closet`
- `Filter closet by [category]`
- `Add [item] to favourites`
- `Remove [item] from favourites`
- `Back to closet`
- `Open wishlist`
- `Open cart`
- `Try-on [item title]`
- `Try-on auto-pair [item title]`
- `Select photos for batch closet upload`
- `Save changes`
- `Generate look`

Interactive elements use `accessibilityRole="button"` where appropriate, and selected toggles use `accessibilityState`.

## Prototype Limitations

These are known gaps if this is moved into production:

- closet data is in local React state only
- favourites are local only
- saved looks/products are seeded local data
- detection is simulated with templates and timers
- auto-pair scoring is heuristic and local
- search input in the Closet tab is visual only and does not currently filter by query
- photo/file assets are not uploaded to a server
- no real Mira API is called from the closet flow
- no real recommendation service powers `Complete the look`
- no real virtual try-on model is called from closet itself; it routes into the existing simulated TryOn flow
- custom `PhotoLibraryPickerModal` exists but is not currently the active picker path

## Production Upgrade Plan

Recommended next steps:

1. Add persistent closet storage.
2. Upload selected photos/files to a backend.
3. Replace simulated detection with a real garment detection/classification API.
4. Persist detected item edits.
5. Connect favourite status to user profile storage.
6. Implement real closet search by title, category, color, material, tag, and occasion.
7. Replace local auto-pair heuristics with recommendation ranking.
8. Connect Mira advice to a real stylist response service.
9. Save generated closet looks to Saved.
10. Track analytics for add item, detection success, save, build look, auto-pair, try-on start, and saved look.

## Suggested Analytics Events

```text
closet_tab_opened
closet_add_item_tapped
closet_photo_source_selected
closet_detection_started
closet_detection_completed
closet_detection_failed
closet_detected_item_edited
closet_detected_item_removed
closet_items_saved
closet_item_opened
closet_item_favourited
closet_item_edited
closet_mira_tapped
closet_complete_look_item_saved
closet_build_look_opened
closet_build_slot_opened
closet_build_slot_changed
closet_build_shuffled
closet_build_generated
closet_auto_pair_started
closet_try_on_started
closet_owned_piece_locked
```

## QA Checklist

- Closet tab opens from bottom navigation.
- Header shows the correct item count.
- Add item drawer opens.
- Photo library path handles permission denial.
- Camera path handles permission denial.
- File picker handles multiple image assets.
- Duplicate assets are not added twice.
- Batch limit stops at 10 assets.
- Analysing state appears with shimmer.
- Failed detection entry can be removed.
- Detected item can expand and collapse.
- Detected item name can be edited inline.
- Category change resets invalid size.
- Full edit drawer saves name, category, size, gender, color, material, fit, and tags.
- Tags dedupe and cap at 3.
- `Add X Items` prepends items to the grid.
- Category filters show matching pieces.
- Favourite heart toggles on card and detail hero.
- Detail page hides bottom nav.
- Detail edit drawer updates the selected item.
- Mira CTA routes to AI Stylist callback.
- `Try on` opens Build Your Look drawer.
- Owned piece is locked and labeled `Yours`.
- Slot product listing can replace non-owned pieces.
- Shuffle keeps owned piece and changes recommendations.
- Generate Look opens TryOn.
- `Try on auto-pair` opens TryOn directly.
- Owned pieces remain marked as wardrobe pieces in TryOn.
- Account Saved opens and Try on CTAs work.
- Account Closet Favourites opens and `Add one item` routes to Closet.
- Notifications closet nudge routes to Closet.
- Stylist footer `Add one item` routes to Closet.

## Files To Copy Or Recreate In Another Repo

Minimum for the closet feature:

- `src/features/home/screens/ClosetScreen.tsx`
- `src/features/home/data/lookPieces.ts`
- `src/features/home/data/prototypeProductImages.ts`
- `src/features/home/components/ProductListingScreen.tsx`
- `src/features/home/components/AppScreenHeader.tsx`
- `src/features/home/components/CartCountBadge.tsx`
- `src/features/home/components/WishlistHeartIcon.tsx`
- `src/features/home/utils/safeArea.ts`
- `src/theme.ts`

For full connected experience:

- `src/navigation/HomeTabsNavigator.tsx`
- `src/features/home/screens/TryOnScreen.tsx`
- `src/features/home/screens/ClosetFavouritesScreen.tsx`
- `src/features/home/screens/SavedScreen.tsx`
- `src/features/home/screens/AccountScreen.tsx`
- `src/features/home/screens/StylistScreen.tsx`
- `src/features/home/screens/ProductPdpScreen.tsx`
- `src/features/home/screens/NotificationsScreen.tsx`
- `src/features/home/screens/HomeScreen.tsx`
- `src/features/home/components/BottomTabBar.tsx`
- `src/features/home/components/WardrobeBanner.tsx`

Also copy the referenced image assets or replace `prototypeProductImages` with your own image registry.
