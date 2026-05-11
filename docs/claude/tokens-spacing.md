# Spacing Tokens

## Import Path

```ts
import { spacing, radii } from '@yourorg/ds';
```

## Spacing Scale

| Token | Value | Use when |
|---|---|---|
| [xs] | [4] | tight inline gaps |
| [s] | [8] | between related elements |
| [m] | [12] | default gap |
| [l] | [16] | section padding |
| [xl] | [24] | between sections |
| [xxl] | [32] | major visual breaks |

## Border Radius

| Token | Value | Use when |
|---|---|---|
| [radiiSmall] | [4] | inputs, chips |
| [radiiMedium] | [8] | cards, buttons |
| [radiiLarge] | [16] | modals, sheets |
| [radiiRound] | [999] | pills, avatars |

## Rules

- Never use raw numeric values for spacing
- If a needed spacing doesn't exist, either use the closest token or add a new one via design review
