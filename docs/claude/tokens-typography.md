# Typography Tokens

## Import Path

```ts
import { typography, fontFamilies } from '@yourorg/ds';
```

## Text Styles

| Token | Size / Weight / Line Height | Use when |
|---|---|---|
| [h1Bold] | [28 / 700 / 36] | [page titles] |
| [h2Bold] | [22 / 700 / 28] | [section titles] |
| [bodyRegular] | [14 / 400 / 20] | [body text] |
| onboardingTitle | Match phone sign-in heading token | Setup and onboarding screen headings |
| onboardingSubtitle | Match phone sign-in subtitle/body token | Setup and onboarding supporting copy |
| productCardMetaAction | 11 / token weight / token line height | Compact product-card footer labels such as `Try now` and `Popular` |

## Font Families

| Token | Font | Weights Available |
|---|---|---|
| [familyName] | [actual font] | [Regular, SemiBold, Bold] |

## Rules

- Never combine `fontWeight` with a weighted `fontFamily`: weight is embedded in the family name (this combination crashes Android in React Native)
- Max 3 weights per family across the project
- Never add a new font family without design approval
- Do not create screen-specific heading styles for onboarding steps. Use `typography.onboardingTitle` and `typography.onboardingSubtitle` through the shared onboarding shell.
