# Icons

> A single icon component renders every icon in the system. Icons are stroke-based (1.5px line weight), sized via the spacing scale, and colored via tokens. Never inline SVGs in components.

## How to Use Icons

```ts
import { Icon } from '@styleos/ds';
import { colors } from '@styleos/ds';

<Icon name="cart" size={24} color={colors.ink} />
<Icon name="heart" size={20} color={colors.sale} />
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `name` | `IconName` | — | Must be from the catalog below |
| `size` | `number` | `24` | Use spacing-scale values: 16, 20, 24, 32, 48 |
| `color` | `string` | `colors.ink` | Token reference, never a raw hex |
| `strokeWidth` | `number` | `1.5` | Only override for editorial moments |

## Sizing Convention

| Size | Use when |
|---|---|
| `16` | Inline with body text, micro-controls |
| `20` | Default for icon buttons, list-row leading icons |
| `24` | Default for nav tabs, primary action icons |
| `32` | Top-nav product tabs (hand-illustrated glyph style) |
| `48` | Hero / illustration moments only |

## Available Icons

### Navigation
`back`, `forward`, `close`, `close-large`, `menu`, `search`, `filter`, `more-horizontal`, `more-vertical`, `chevron-down`, `chevron-up`, `chevron-left`, `chevron-right`, `external-link`

### Commerce
`cart`, `bag`, `wishlist`, `heart`, `heart-filled`, `tag`, `discount`, `gift`, `receipt`, `truck`, `return`, `shipping`

### User & Account
`user`, `user-circle`, `account`, `settings`, `lock`, `key`, `logout`, `notification`, `notification-active`, `mail`, `phone`

### Feedback & Status
`check`, `check-circle`, `error`, `error-circle`, `warning`, `info`, `info-circle`, `question`, `loader`

### Media & Content
`image`, `gallery`, `camera`, `video`, `play`, `pause`, `volume`, `volume-mute`, `share`, `download`, `upload`, `link`, `copy`

### Editing
`edit`, `delete`, `trash`, `archive`, `plus`, `plus-circle`, `minus`, `minus-circle`, `add-image`, `crop`, `rotate`

### Sort & View
`sort`, `sort-asc`, `sort-desc`, `grid`, `list`, `expand`, `collapse`, `zoom-in`, `zoom-out`

### Social
`facebook`, `instagram`, `twitter`, `x`, `pinterest`, `youtube`, `tiktok`, `linkedin`

### Style / Wardrobe (project-specific)

> Add domain-specific icons here as they're needed. Examples for a styling/wardrobe app:

`shirt`, `pants`, `shoe`, `hat`, `dress`, `jacket`, `bag-handbag`, `hanger`, `closet`, `outfit`, `wardrobe`, `style-quiz`, `palette`, `color-swatch`

## Rules

- **Always use icons from this catalog.** Never inline SVGs in components.
- **Adding a new icon requires design review** and SVG optimization (target: <2KB per icon, single path where possible).
- **Icon size comes from the spacing scale.** Sizes outside `16 / 20 / 24 / 32 / 48` need design approval.
- **Icon color is always a token.** `colors.ink` by default; `colors.mute` for inactive states; `colors.sale` for warnings or sale signals; editorial accents only in illustrated/editorial moments.
- **Filled vs. outline:** the system is stroke-based by default. The only filled state in regular use is `heart-filled` (when a user has saved an item). Do not introduce filled variants of other icons without design approval.
- **Stroke width is 1.5px.** Heavier strokes read as utilitarian; lighter strokes lose legibility at small sizes.
- **No emoji as icons.** Ever. Emojis render inconsistently across platforms and break the system's visual coherence.

## Adding a New Icon

1. Design produces a 24×24px SVG with 1.5px stroke, single path where possible
2. SVG is optimized (SVGO, target <2KB)
3. Added to the icon component's name union type
4. Added to this catalog under the correct category
5. PR opened with a screenshot showing the icon at 16/24/32px sizes
