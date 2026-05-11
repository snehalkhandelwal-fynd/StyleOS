# UI Quick Reference

> Cheat sheet for common styling patterns. Stack: **react-native**.

## Creating Styles

```ts
import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@yourorg/ds';

const styles = StyleSheet.create({
  container: {
    padding: spacing.l,
    backgroundColor: colors.surface,
  },
  title: {
    ...typography.h2Bold,
    color: colors.textPrimary,
  },
});
```

## Common Layouts

### Vertical Stack with Safe Area
<!-- TODO: your project's pattern -->

### Horizontal Row with Gap
<!-- TODO: your project's pattern -->

### Centered Content
<!-- TODO: your project's pattern -->

## Responsive Patterns

<!-- TODO: if your project supports multiple screen sizes -->

## Common Mistakes

<!-- Add to this as you find them. -->

- Inline style objects in render functions: causes unnecessary re-renders
- Using `flex: 1` without a parent flex container
- Hardcoded colors when a token exists
