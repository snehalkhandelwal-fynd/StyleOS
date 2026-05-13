# Color Tokens

> Every color used in the codebase must be a token. Hex values in code are forbidden.

The palette is monochrome by default. **Ink** carries every primary action, headline, and body text. **Sale** is the only chromatic moment in the retail chrome. The accent palette is reserved exclusively for editorial moments (collection chips, soft category illustrations, brand collaboration tiles) and never used for chrome, body text, or primary CTAs.

## Import Path

```ts
import { colors } from '@styleos/ds';
```

## Token Categories

### Brand & Action

| Token | Value | Use when |
|---|---|---|
| `primary` | `#111111` | The brand's only "color". Primary CTA backgrounds, active filter chips, the headline color. When in doubt, ink. |
| `onPrimary` | `#ffffff` | Inverse text/icons on ink surfaces. Equal partner to ink. |
| `primaryActive` | `#000000` | Press state for primary CTAs. The shift is barely visible; the press is communicated by transform, not color. |
| `primaryDisabled` | `#9e9ea0` | Disabled CTA background. Pairs with `onPrimary` text at reduced opacity. |

### Surface

| Token | Value | Use when |
|---|---|---|
| `canvas` | `#ffffff` | Default page floor. Every screen, every editorial band. |
| `surfaceSoft` | `#f5f5f5` | The most-used non-white surface. Product card image stages, search pill, secondary CTA fills, utility bars. |
| `surfaceStrong` | `#ebebeb` | Slightly heavier fill. Circular icon-button surface, toolbar buttons. |

### Hairlines & Borders

| Token | Value | Use when |
|---|---|---|
| `hairline` | `#cacacb` | Default 1px border tone. Search bar dividers, footer column splitters, card borders. |
| `hairlineSoft` | `#e5e5e5` | Lighter divider. Long-scroll editorial separators, inset 1px shadow under sticky bars (the only "shadow" the system uses). |
| `borderStrong` | `#707072` | Heavier stroke. Disabled outline buttons, form input outlines after focus. |

### Text

| Token | Value | Use when |
|---|---|---|
| `ink` | `#111111` | Primary text on light surfaces. Headlines, body, product names, prices, nav. Never pure black. Same value as `primary`; both names are valid. |
| `charcoal` | `#39393b` | Slightly softer body where ink would be too heavy. Long-form review/amenity copy. |
| `ash` | `#4b4b4d` | Disabled secondary border on dark surfaces. Very low-emphasis utility text. |
| `mute` | `#707072` | Sub-titles, footer link text, secondary metadata, inactive product-tab labels. |
| `stone` | `#9e9ea0` | Lowest-emphasis text. Disabled link text, inverse secondary text on dark surfaces. |
| `onPrimary` | `#ffffff` | White text on ink CTAs. (Same token as `Brand & Action / onPrimary`.) |

### Semantic

| Token | Value | Use when |
|---|---|---|
| `sale` | `#d30005` | Discounted price color, "% off" copy. Also the form-error text color. The only red in the retail chrome. |
| `saleDeep` | `#780700` | Sale price pressed state, dark-mode sale anchor. |
| `success` | `#007d48` | Confirmation messages, in-stock indicators, eligibility ticks. |
| `successBright` | `#1eaa52` | Inverse success on dark surfaces. |
| `info` | `#1151ff` | Informational link/badge accent. Inline legal links (Privacy, Terms). |
| `infoDeep` | `#0034e3` | Pressed state for info accent. |

### Editorial Accents

> **Use only on editorial moments.** Soft category chips, collection swatches, brand collaboration tile washes, illustrated category icons. **Never** as text color, **never** as primary CTA, **never** as chrome. If you're reaching for one of these in a screen layout, you're using it wrong.

| Token | Value | Use when |
|---|---|---|
| `accentPink` | `#ed1aa0` | Women's collection moments, collaboration tiles. |
| `accentPinkSoft` | `#ffb0dd` | Soft tinting on member-experience tiles. |
| `accentPurpleSoft` | `#beaffd` | Editorial swatch dot, soft category chip. |
| `accentPurplePale` | `#d6d1ff` | Lightest soft-tile fill. |
| `accentTeal` | `#0a7281` | Outdoor / trail / earthy editorial accent in lockups. |
| `accentPinkDeep` | `#4c012d` | Deepest editorial overlay tint. Wash on heritage / premium tiles. |

### Scrim

| Token | Value | Use when |
|---|---|---|
| `scrim` | `#000000` | Modal backdrop tone. Rendered at 50% opacity by the modal layer; stored as base hex. |

## Rules

- **Never** use raw hex values in code.
- **Never** import colors from anywhere except `@styleos/ds`.
- **Never** use editorial accents (`accentPink`, `accentTeal`, etc.) for chrome, body text, or primary actions.
- If a needed color doesn't exist, add a new token first and get design review before using it.
- Yellow is not in the palette. Star ratings render in `ink` — that's a deliberate brand choice (yellow stars feel cheap).
