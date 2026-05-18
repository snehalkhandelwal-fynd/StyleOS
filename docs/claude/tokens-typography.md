# Typography Tokens

Stylus uses one font family only: **Outfit**. Do not introduce a second font for headings, body, buttons, captions, labels, navigation, or any other text element.

## Import Path

```ts
import { typography, fontFamilies } from '@styleos/ds';
```

## Text Styles

| Token | Size / Weight / Line Height | Use when |
|---|---|---|
| `display` | 26 / 600 / 31.2 | Main screen title, once per screen |
| `heading` | 20 / 600 / 25 | Section headings |
| `cardTitle` | 15 / 600 / 19.5 | Hero card names, product names |
| `body` | 14 / 400 / 21 | Default UI text |
| `button` | 14 / 500 / 14 | All button text |
| `caption` | 12 / 400 / 16.8 | Supporting copy, descriptions |
| `micro` | 11 / 500 / 14.3 | Pill text, chip labels, badges |

## Font Families

| Token | Font | Weights Available |
|---|---|---|
| `Outfit_400Regular` | Outfit | Regular |
| `Outfit_500Medium` | Outfit | Medium |
| `Outfit_600SemiBold` | Outfit | SemiBold |

## Rules

- Use Outfit for every text element.
- Install/load only `@expo-google-fonts/outfit`.
- Use `Outfit_400Regular` for body, captions, labels.
- Use `Outfit_500Medium` for buttons, section labels, emphasis, chips.
- Use `Outfit_600SemiBold` for screen titles, hero headlines, card names.
- Do not use `Outfit_700Bold` unless explicitly requested.
- Never use the platform default font.
- Never go below 11px.
- Never use all caps except legal disclosure text.
- Never combine `fontWeight` with a weighted `fontFamily`: weight is embedded in the family name (this combination crashes Android in React Native)
- Never add a new font family without design approval.
