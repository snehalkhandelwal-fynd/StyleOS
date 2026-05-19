# Design System Components

> Catalog of every reusable component. Always check this catalog before writing a new component. If you need something close to an existing component, first consider whether a new prop variant is the right answer.

## Import Path

```ts
import { Button, InputField, Card, Badge, IconButton } from '@styleos/ds';
```

## Buttons

### `Button` — primary CTA

The default action. Ink fill, 8px radius, 48px tall.

```ts
<Button variant="primary" onPress={onSubmit}>Reserve</Button>
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'pill' \| 'destructive'` | `'primary'` | See variants table below |
| `size` | `'md' \| 'sm'` | `'md'` | `md` is 48px tall; `sm` is 40px |
| `disabled` | `boolean` | `false` | Reduces opacity, blocks press |
| `leadingIcon` | `IconName` | — | Icon left of label |
| `trailingIcon` | `IconName` | — | Icon right of label |
| `fullWidth` | `boolean` | `false` | Stretches to container width |
| `onPress` | `() => void` | — | |

### Variants

| Variant | Background | Text | Border | Radius | Use when |
|---|---|---|---|---|---|
| `primary` | `ink` | `onPrimary` | none | `sm` (8px) | Main CTA: Reserve, Continue, Submit |
| `secondary` | `canvas` | `ink` | `1px ink` | `sm` | Save, Cancel, inverse CTAs |
| `tertiary` | transparent | `ink` | none | none | "Show more" type links, modal close |
| `pill` | `ink` | `onPrimary` | none | `full` | Compact featured CTAs (e.g., category strip) |
| `destructive` | `canvas` | `sale` | `1px sale` | `sm` | Delete, cancel-subscription type actions |

### States

- **Default** — as defined above
- **Pressed** — `transform: scale(0.96)`. Do not shift background color.
- **Disabled** — `opacity: 0.4`, `pointerEvents: 'none'`. Cursor `not-allowed` on web.

---

## Inputs

### `InputField` — text input

```ts
<InputField label="Email" value={email} onChangeText={setEmail} />
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | — | Renders above input in `caption` style |
| `placeholder` | `string` | — | Shown when empty |
| `value` | `string` | — | Controlled |
| `onChangeText` | `(v: string) => void` | — | |
| `variant` | `'default' \| 'error'` | `'default'` | Error variant adds red helper text |
| `errorText` | `string` | — | Shown below input in `sale` color when `variant='error'` |
| `helperText` | `string` | — | Mute-colored hint below input |
| `disabled` | `boolean` | `false` | |
| `secureTextEntry` | `boolean` | `false` | For passwords |

**Styling:**
- White surface, 1px `hairline` border, 8px radius, 56px height
- On focus: border thickens to 2px, color flips to `ink`. **No glow, no ring.**

### `Checkbox`

```ts
<Checkbox checked={isAccepted} onChange={setIsAccepted} label="I agree" />
```

| Prop | Type | Default |
|---|---|---|
| `checked` | `boolean` | `false` |
| `onChange` | `(v: boolean) => void` | — |
| `label` | `string` | — |
| `disabled` | `boolean` | `false` |

---

## Cards

### `Card` — generic container

```ts
<Card>
  <Card.Header title="Host" />
  <Card.Body>{children}</Card.Body>
</Card>
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'lg'` | `lg` is 24px (the system default for cards) |
| `bordered` | `boolean` | `true` | 1px `hairline` border |
| `elevated` | `boolean` | `false` | Adds the single shadow tier |

**Styling:** white canvas, `radii.md` (14px), 1px `hairline` border.

### `ProductCard` — photo-first card

The signature retail card. Photo plate + meta block.

```ts
<ProductCard
  image={photoUri}
  title="Air Force 1 '07"
  subtitle="Men's Shoes"
  price={120}
  comparePrice={140}
  isFavorite={isSaved}
  onToggleFavorite={toggleSaved}
  badge="Guest favorite"
/>
```

| Prop | Type | Notes |
|---|---|---|
| `image` | `ImageSourcePropType` | 1:1 aspect, `radii.md` clipped, `surfaceSoft` stage |
| `title` | `string` | `titleMd` ink |
| `subtitle` | `string?` | `bodySm` mute |
| `price` | `number` | `titleMd` ink |
| `comparePrice` | `number?` | If lower than `price`, render `sale` color, struck-through |
| `isFavorite` | `boolean` | Heart top-right (`IconButton variant="circle"`) |
| `onToggleFavorite` | `() => void` | |
| `badge` | `string?` | Floating badge top-left, `Badge` component |

### `RatingDisplay` — the loud moment

The single typographically loud moment in the system. 64px / 700 rating number flanked by laurel ornaments.

```ts
<RatingDisplay rating={4.81} caption="Guest favorite" />
```

**Use sparingly.** Only on listing-detail-style pages where the rating is the peak trust signal.

---

## Badges & Pills

### `Badge` — small floating label

```ts
<Badge>Guest favorite</Badge>
<Badge variant="new">NEW</Badge>
<Badge variant="sale">% Off</Badge>
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'default' \| 'new' \| 'sale'` | `'default'` | |
| `children` | `ReactNode` | — | |

### Variants

| Variant | Background | Text | Typography | Use when |
|---|---|---|---|---|
| `default` | `canvas` | `ink` | `badge` (11/600) | Guest favorite, generic chips |
| `new` | `canvas` | `ink` | `uppercaseTag` (8/700 uppercase) | "NEW" recency tags |
| `sale` | `canvas` | `sale` | `captionSm` | "% Off" price callouts |

### `FilterChip` — pill-shaped filter

```ts
<FilterChip active={isActive} onPress={toggle}>Trail</FilterChip>
```

| Prop | Type | Default |
|---|---|---|
| `active` | `boolean` | `false` |
| `onPress` | `() => void` | — |
| `disabled` | `boolean` | `false` |

**Active state:** ink background, onPrimary text.
**Inactive state:** canvas background, ink text, 1px hairline border.

---

## Icon Buttons

### `IconButton`

```ts
<IconButton icon="heart" variant="circle" onPress={save} />
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `icon` | `IconName` | — | See `icons.md` |
| `variant` | `'circle' \| 'outline' \| 'plain'` | `'circle'` | |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 32/40/48px |
| `onPress` | `() => void` | — | |
| `disabled` | `boolean` | `false` |

### Variants

| Variant | Background | Border | Use when |
|---|---|---|---|
| `circle` | `surfaceStrong` | none | Toolbar buttons, breadcrumb back |
| `outline` | `canvas` | `1px ink` | Heart save on photo overlays |
| `plain` | transparent | none | Inline icon tap targets |

---

## Navigation

### `TopNav`

White surface, 80px height, 1px bottom hairline. Logo left, tabs centered, account utilities right.

```ts
<TopNav
  logo={<Logo />}
  tabs={[
    { label: 'Style', icon: 'shirt', isActive: true },
    { label: 'Outfits', icon: 'hanger' },
    { label: 'Wardrobe', icon: 'closet', badge: 'NEW' },
  ]}
  utilities={<AccountMenu />}
/>
```

### `BottomBar` — mobile sticky action

Used on detail pages on mobile. White surface, 1px top hairline, contains the primary CTA + price summary.

---

## Modals & Overlays

### `Modal` — full-screen dialog

```ts
<Modal visible={open} onDismiss={() => setOpen(false)}>
  {children}
</Modal>
```

**Backdrop:** `scrim` at 50% opacity. **Container:** white, `radii.lg` (20px), `padding: spacing.xxl` (48px).

### `BottomSheet` — slide-up sheet

```ts
<BottomSheet visible={open} onDismiss={close} snapPoints={['50%', '90%']}>
  {children}
</BottomSheet>
```

**Container:** white, `radii.lg` rounded top corners only, drag handle at top.

---

## Date / Time

### `DatePickerDay`

40×40px circular cell.

| State | Background | Text |
|---|---|---|
| Default | transparent | `ink` |
| Selected | `ink` | `onPrimary` |
| In-range | `surfaceSoft` | `ink` |
| Disabled | transparent | `stone` |

---

## Rules

- **Always check this catalog before writing a new component.** Most needs map to an existing component or a new variant of one.
- **If you need something close to an existing component but different, first ask: is this a new prop variant?** Variants are cheap; components are expensive.
- **New components require design review** before being added to the DS.
- **Variants live in the type system.** Add a literal type to the variant prop union; do not branch on string-typed flags.
- **Components take props, not context.** A `ProductCard` must accept `price` as a prop, not read from a cart context. (See `designer-guardrails.md` Rule 2.)
- **No design system component imports from `app/`, `features/`, or anywhere outside the DS package.** The DS depends on nothing but tokens.
