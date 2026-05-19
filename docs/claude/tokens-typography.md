# Typography Tokens

> The whole scale runs on one family (Satoshi). Three weights only — 400 / 500 / 700. The system trusts photography and whitespace for visual weight, not typographic muscle.

## Import Path

```ts
import { typography, fontFamilies } from '@styleos/ds';
```

## Font Family

The system runs **Satoshi** for everything: display, body, navigation, captions, microcopy. One family carries the entire scale. (Airbnb Cereal is Airbnb's proprietary typeface and is not licensed for use here; Satoshi is the StyleOS replacement.)

```ts
fontFamilies.primary  // 'Satoshi', -apple-system, system-ui, Roboto, 'Helvetica Neue', sans-serif
```

The vendored font is the **static** Satoshi family ([`packages/ds/assets/fonts/`](../../packages/ds/assets/fonts/)) — weights Light/Regular/Medium/Bold/Black, i.e. 300/400/500/700/900. There is **no SemiBold (600)**: the scale below uses only 400, 500, and 700, all of which have a real font file. Do not introduce a 600 token — it has no face to bind to. If Satoshi is unavailable, **Inter** is the closest open-source substitute. Adjust display headlines down by ~2% in line-height to match Satoshi's slightly tighter cap height.

> Installing Satoshi in macOS Font Book only makes it available to desktop design tools. For the React Native app to render it, the files in `packages/ds/assets/fonts/` must also be linked into the iOS and Android builds — an engineering step, not a DS token change.

## Text Styles

| Token | Size / Weight / Line Height / Tracking | Use when |
|---|---|---|
| `ratingDisplay` | 64 / 700 / 1.1 / -1px | Listing detail rating display ("4.81"). The single typographically loud moment in the entire system. |
| `displayXl` | 28 / 700 / 1.43 / 0 | Page hero h1 ("Inspiration for your next look"). |
| `displayLg` | 22 / 500 / 1.18 / -0.44px | Detail-page h1. Quieter than `displayXl` — the photo banner does the work above it. |
| `displayMd` | 21 / 700 / 1.43 / 0 | Section heads inside detail pages ("What this place offers"). |
| `displaySm` | 20 / 700 / 1.20 / -0.18px | Sub-section titles ("Things to know"). |
| `titleMd` | 16 / 700 / 1.25 / 0 | City link block titles, product card titles. |
| `titleSm` | 16 / 500 / 1.25 / 0 | Footer column heads ("Support", "About"). |
| `bodyMd` | 16 / 400 / 1.5 / 0 | Default running-text inside long copy. |
| `bodySm` | 14 / 400 / 1.43 / 0 | Card meta lines, dates, prices, distance text. |
| `caption` | 14 / 500 / 1.29 / 0 | Search field segment labels ("Where", "When", "Who"). |
| `captionSm` | 13 / 400 / 1.23 / 0 | Footer legal line, micro-disclosure copy. |
| `badge` | 11 / 700 / 1.18 / 0 | Floating badge text ("Guest favorite"). |
| `microLabel` | 12 / 700 / 1.33 / 0 | Card amenity micro-labels. |
| `uppercaseTag` | 8 / 700 / 1.25 / 0.32px (uppercase) | "NEW" badge on nav tabs and editorial tiles. |
| `buttonMd` | 16 / 500 / 1.25 / 0 | Primary CTA button labels. |
| `buttonSm` | 14 / 500 / 1.29 / 0 | Pill button labels, secondary CTAs. |
| `link` | 14 / 400 / 1.43 / 0 | Inline body links. |
| `navLink` | 16 / 700 / 1.25 / 0 | Top product-nav labels. |

## Principles

- **Display weights stay modest.** The hero h1 at 28px / 700 is deliberately small — it tucks under the search bar so photography and content grids carry visual hierarchy.
- **One loud moment.** The rating display (64 / 700) is the only place the system trusts type alone to carry hierarchy. Rating numbers are a peak trust signal, so they get the loudest treatment. No other element competes.
- **Modest weight is intentional.** Display headlines sit at 500–700, body at 400. The system trusts photography for visual heft. Heavy typographic systems (700+ at every level) read as enterprise; this system reads as friendly.

## Rules

- **Never combine `fontWeight` with a weighted `fontFamily`** — weight is embedded in the family name. This combination crashes Android in React Native.
- **One family for everything.** Do not introduce a second display family. Satoshi handles the whole scale.
- **Exactly 3 weights in use** — 400, 500, 700. There is no 600 face in the vendored static family; adding a fourth weight costs bundle size and rarely earns its place.
- **Never add a new font family without design approval.**
- **Tracking is mostly zero.** Negative tracking exists only on `displayLg` (-0.44px), `displaySm` (-0.18px), and `ratingDisplay` (-1px) — display sizes large enough to need tightening. Body sizes have zero tracking; do not invent letter-spacing where the token doesn't define it.
