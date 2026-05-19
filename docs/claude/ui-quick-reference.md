# UI Quick Reference

> Cheat sheet for common styling patterns. Stack: **react-native**.
> Modest type, monochrome palette, soft corners, photography-led. When in doubt: ink on white, with one accent only when something needs attention (sale, error).

## Creating Styles

Every style block imports from `@styleos/ds`. Never hardcode a value.

```ts
import { StyleSheet } from 'react-native';
import { colors, spacing, typography, radii } from '@styleos/ds';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.section,
  },
  title: {
    ...typography.displayXl,
    color: colors.ink,
  },
  caption: {
    ...typography.bodySm,
    color: colors.mute,
  },
  card: {
    backgroundColor: colors.canvas,
    borderRadius: radii.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
});
```

## Common Layouts

### Page Container with Safe Area

```ts
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.base,
  },
});

<SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
  <View style={styles.content}>{children}</View>
</SafeAreaView>
```

### Vertical Stack with Gap

```ts
const styles = StyleSheet.create({
  stack: {
    gap: spacing.base, // RN 0.71+ supports gap
  },
});

// For older RN, use marginBottom on each child except the last:
const styles = StyleSheet.create({
  item: { marginBottom: spacing.base },
  itemLast: { marginBottom: 0 },
});
```

### Horizontal Row with Gap

```ts
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
```

### Centered Content (vertical + horizontal)

```ts
const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

### Card Grid (2-up)

```ts
const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.base, // 16px gutters — dense by design
  },
  cell: {
    flexBasis: '48%',
  },
});
```

### Bottom Sticky Bar (reservation / cart CTA)

```ts
const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    paddingBottom: spacing.lg, // safe-area buffer
    backgroundColor: colors.canvas,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
});
```

## Common Components

### Primary Button

```ts
backgroundColor: colors.primary,    // ink
borderRadius: radii.sm,             // 8px (NOT pill)
paddingHorizontal: spacing.lg,      // 24
paddingVertical: 14,
height: 48,
// Label:
...typography.buttonMd,
color: colors.onPrimary,            // white
```

### Pill Button (compact CTAs)

```ts
backgroundColor: colors.primary,
borderRadius: radii.full,           // 9999
paddingHorizontal: spacing.lg,
paddingVertical: 10,
// Label:
...typography.buttonSm,
color: colors.onPrimary,
```

### Secondary Button

```ts
backgroundColor: colors.canvas,
borderWidth: 1,
borderColor: colors.ink,
borderRadius: radii.sm,
paddingHorizontal: spacing.lg,
paddingVertical: 13, // 1px less to compensate for border
// Label:
...typography.buttonMd,
color: colors.ink,
```

### Text Input

```ts
backgroundColor: colors.canvas,
borderWidth: 1,
borderColor: colors.hairline,
borderRadius: radii.sm,
paddingHorizontal: spacing.md,
height: 56,
// Text:
...typography.bodyMd,
color: colors.ink,

// On focus: borderWidth → 2, borderColor → colors.ink (no glow, no ring)
```

### Pill Search Bar

```ts
backgroundColor: colors.canvas,
borderRadius: radii.full,
borderWidth: 1,
borderColor: colors.hairline,
height: 64,
// Internal: hairline dividers between segments
```

### Card

```ts
backgroundColor: colors.canvas,
borderRadius: radii.md,             // 14px
padding: spacing.lg,                // 24
// 1px hairline border:
borderWidth: 1,
borderColor: colors.hairline,
// Shadow only on hover/elevation states — the system has ONE shadow tier (see below)
```

### Floating Badge ("Guest favorite")

```ts
backgroundColor: colors.canvas,
borderRadius: radii.full,
paddingHorizontal: 10,
paddingVertical: 4,
// Label:
...typography.badge,
color: colors.ink,
```

## Elevation

The system has **one shadow tier** plus the flat baseline. Do not invent additional shadow values.

```ts
// Flat (default — 95% of surfaces)
// No shadow. Depth comes from hairlines and photo contrast.

// Card hover float (the only shadow in the system)
const cardFloat = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.04,
  shadowRadius: 6,
  elevation: 4, // Android
};
```

## Color Application Rules

- **Default surface:** `canvas` (white)
- **Default text:** `ink` (#111111) — never pure black
- **Secondary text:** `mute` (#707072) for sub-labels, dates, metadata
- **Primary CTA:** `ink` background, `onPrimary` text
- **Pressed state:** Do NOT shift color. Use a 0.96 scale transform.
- **Sale/error:** the only red. `sale` for price-cut copy and error text.
- **Editorial accents:** only on editorial moments (collection chips, illustrated tiles). Never on chrome.

## Common Mistakes

- **Inline style objects in render functions** — causes unnecessary re-renders. Move every style into a `StyleSheet.create` block.
- **Using `flex: 1` without a parent flex container** — `flex: 1` does nothing without a parent that's also flex.
- **Hardcoded colors when a token exists** — every hex value in code is a bug.
- **Combining `fontWeight` with a weighted `fontFamily`** — crashes Android. The weight lives in the family name; never specify both.
- **Reaching for a sport accent (pink, teal, purple) for a primary CTA** — sport accents are editorial only. Primary CTAs are ink.
- **Adding a second shadow tier** — the system has one. If something needs to elevate, use the existing float definition.
- **Using `radii.full` on a button** — pill buttons exist (`buttonSm` style) but the default primary button is `radii.sm` (8px). Don't pill everything.
- **Mixing the editorial 64px section padding with the 16px card gutter inside the same band** — pick one density per band. Bands are either editorial-open or grid-dense.
