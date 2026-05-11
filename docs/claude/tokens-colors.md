# Color Tokens

> Every color used in the codebase must be a token. Hex values in code are forbidden.

## Import Path

```ts
import { colors } from '@yourorg/ds';
```

## Token Categories

### Primary / Brand

| Token | Value | Use when |
|---|---|---|
| [tokenName] | [#hex] | [description] |

### Neutral / Grayscale

| Token | Value | Use when |
|---|---|---|
| [tokenName] | [#hex] | [description] |

### Semantic: Success / Error / Warning / Info

| Token | Value | Use when |
|---|---|---|
| [tokenName] | [#hex] | [description] |

### Surface / Background

| Token | Value | Use when |
|---|---|---|
| [tokenName] | [#hex] | [description] |

### Text

| Token | Value | Use when |
|---|---|---|
| [tokenName] | [#hex] | [description] |

## Rules

- Never use raw hex values in code
- Never import colors from anywhere except `@yourorg/ds`
- If a needed color doesn't exist, add a new token first and get design review before using it
