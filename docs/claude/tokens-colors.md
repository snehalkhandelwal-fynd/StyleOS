# Color Tokens

> Every color used in the codebase must be a token. Hex values in code are forbidden.

Stylus uses a warm neutral palette. The app should feel editorial, quiet, and product-led. Color comes from product photography, not UI chrome.

## Import Path

```ts
import { colors } from '@styleos/ds';
```

## Token Categories

### Primary / Brand

| Token | Value | Use when |
|---|---|---|
| [tokenName] | [#hex] | [description] |

### Neutral / Grayscale

| Token | Value | Use when |
|---|---|---|
| `colors.text` | `#0A0A0A` | Primary text, selected icon strokes |
| `colors.muted` | `#595959` | Secondary text |
| `colors.soft` | `#999999` | Placeholder and tertiary text |

### Semantic: Success / Error / Warning / Info

| Token | Value | Use when |
|---|---|---|
| [tokenName] | [#hex] | [description] |

### Surface / Background

| Token | Value | Use when |
|---|---|---|
| `colors.background` | `#FFFFFF` | Overall screen canvas |
| `colors.surface` | `#F5F2EC` | Cards, search bars, filter pills, inputs |
| `colors.surfaceTertiary` | `#FAF8F3` | Subtle section alternation |
| `colors.imageSurface` | `#EFEAE0` | Backdrop behind avatar/product imagery |
| `colors.cream` | `#EFEAE0` | Legacy alias for image/card surfaces |

### Text

| Token | Value | Use when |
|---|---|---|
| `colors.inverseText` | `#FFFFFF` | Text on dark buttons or dark image overlays |

### Borders

| Token | Value | Use when |
|---|---|---|
| `colors.border` | `#E8E4DC` | Subtle card edges, dividers, input outlines |
| `colors.secondaryBorder` | `#E8E4DC` | Secondary CTA outlines |
| `colors.borderStrong` | `#1A1A1A` | Selected states and emphasis borders |
| `colors.inverse` | `#0A0A0A` | Filled primary buttons, active pills |

## Rules

- Never use raw hex values in code
- Never import colors from anywhere except `@styleos/ds`
- If a needed color doesn't exist, add a new token first and get design review before using it
- Never use bright accent colors.
- Never use drop shadows, gradients, or glassmorphism unless explicitly requested.
