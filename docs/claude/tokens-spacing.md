# Spacing Tokens

> Base unit is **4px** with a **2px micro-step**. Major sections sit at 64px — generous but not airy enough to feel editorial-magazine. The contrast between editorial bands (64px) and dense card grids (16px) is intentional: pages read as "open hero, dense content below."

## Import Path

```ts
import { spacing, radii } from '@styleos/ds';
```

## Spacing Scale

| Token | Value | Use when |
|---|---|---|
| `xxs` | 2 | Tightest inline gap. Micro-tracking corrections, badge inner padding. |
| `xs` | 4 | Tight inline gap between related elements. Caption-row gutters, dense divider padding. |
| `sm` | 8 | Default tight gap. Caption / date-row gutters, sub-label spacing. |
| `md` | 12 | Mid-density gap. Form field internal padding, list-row vertical padding. |
| `base` | 16 | The system's default gap. Card meta block padding, gutters between cards in a grid. |
| `lg` | 24 | Section-level padding inside cards (host cards, reservation cards). Footer column gutters. |
| `xl` | 32 | Between sections inside the same band. |
| `xxl` | 48 | Major visual breaks. Footer top/bottom padding. |
| `section` | 64 | Vertical padding for major page bands. Hero, editorial bands, marketplace sections. |

## Border Radius

| Token | Value | Use when |
|---|---|---|
| `none` | 0 | The body grid itself. Used only where straight edges are explicitly correct. |
| `xs` | 4 | Inputs, micro-chips. |
| `sm` | 8 | Buttons, text inputs, secondary CTAs. The default for interactive surfaces. |
| `md` | 14 | Cards (product cards, host cards, reservation cards). |
| `lg` | 20 | Large surfaces, dialogs. |
| `xl` | 32 | Category strip rounded corners, oversize CTAs. |
| `full` | 9999 | Pills, search bars, circular icons, avatar masks, day-picker cells. |

## Whitespace Philosophy

The system gives editorial bands `section` (64) of vertical breathing room but compresses card grids to `base` (16) gutters. The contrast is intentional: pages read as "open hero, dense content below," reinforcing the marketplace nature without overwhelming the visitor at the fold.

Do not split the difference. Editorial bands stay open; card grids stay dense. Mixing the two produces an awkward middle that feels neither editorial nor productive.

## Touch Targets

- **Primary CTAs:** minimum 48×48px (above WCAG AAA).
- **Search orb:** 48×48px circular — the most-tapped element on the page.
- **Icon buttons (heart/save, share):** 32×32px circular minimum, with at least 12px padding inside the parent container.
- **Date-picker day cells:** 40×40px circular.

## Rules

- **Never use raw numeric values for spacing.** Use the token.
- **Never invent in-between values.** If a needed spacing doesn't exist, either use the closest token or add a new one via design review. Stretching `base` to "around 18px" is forbidden.
- **The 4px grid is non-negotiable.** Every value in the scale is a multiple of 4 (except `xxs`, the deliberate 2px micro-step for badge interiors).
- **Do not mix this scale with em/rem units.** The system is pixel-anchored.
