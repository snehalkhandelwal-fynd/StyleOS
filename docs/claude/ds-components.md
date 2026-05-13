# Design System Components

> **Note:** Your DS is just getting started. Begin by listing the few components that exist; grow this catalog as you add more.

## Import Path

```ts
import { Button, InputField, Card } from '@yourorg/ds';
```

## Core Components

| Component | Key Props | Use when |
|---|---|---|
| Button | `variant`, `size`, `disabled` | [when] |
| InputField | `label`, `variant`, `errorText` | [when] |
| Checkbox | `checked`, `disabled` | [when] |

## Feature Components

| Component | Purpose |
|---|---|
| [ProductCard] | [used on listings and cart] |
| [NavHeader] | [top bar with back / search / cart] |
| AskMiraCard | Homepage AI stylist entry point with suggested prompts and freeform question input |

## Variants Reference

### Button Variants
- `primary`: main CTA
- `secondary`: secondary action
- `outline`: tertiary
- `ghost`: inline links
- `destructive`: delete / cancel-subscription type actions

## Rules

- Always check this catalog before writing a new component
- If you need something close to an existing component, first consider if a new prop variant is the right answer
- New components require design review before being added to the DS
