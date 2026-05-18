# Stylus Design Language

> Read this before creating or changing any Stylus UI screen, card, input, button, navigation, or visual state.

## Product Intent

Stylus is a mobile virtual try-on platform for fashion. Most screens begin as wireframes or references, not finished designs. Translate the structure faithfully, then apply this design language.

Do not invent visual patterns that are not grounded in user-provided references or the rules below. If a pattern is missing, ask before creating a new one.

## Typography

- Single font family: Outfit.
- Use Outfit for every text element in the app.
- Do not introduce a second font under any circumstances.
- Load with `@expo-google-fonts/outfit`.

Allowed weights:

- `Outfit_400Regular`: body, captions, labels.
- `Outfit_500Medium`: buttons, section labels, emphasis, chips.
- `Outfit_600SemiBold`: screen titles, hero headlines, card names.
- `Outfit_700Bold`: do not use unless explicitly requested.

Type scale:

| Style | Font | Size / Line height | Use |
|---|---|---|---|
| Display | Outfit 600 | 26 / 31.2 | Main screen title, once per screen |
| Heading | Outfit 600 | 20 / 25 | Section headings |
| Card title | Outfit 600 | 15 / 19.5 | Hero card names, product names |
| Body | Outfit 400 | 14 / 21 | Default UI text |
| Button | Outfit 500 | 14 / 14 | All button text |
| Caption | Outfit 400 | 12 / 16.8 | Supporting copy, descriptions |
| Micro | Outfit 500 | 11 / 14.3 | Pill text, chip labels, badges |

Rules:

- Never use platform default fonts.
- Never go below 11px.
- Never use all caps except legal disclosure text.
- Never combine `fontWeight` with weighted font families.

## Surfaces And Color

The palette is warm neutral, not stark gray.

| Token | Value | Use |
|---|---|---|
| Page background | `#FFFFFF` | Overall screen canvas |
| Surface secondary | `#F5F2EC` | Cards, search bar, filter pills, inputs |
| Surface tertiary | `#FAF8F3` | Subtle alternating sections |
| Image card surface | `#EFEAE0` | Backdrop behind avatar/product imagery |
| Primary text | `#0A0A0A` | Main text |
| Secondary text | `#595959` | Supporting text |
| Tertiary text | `#999999` | Placeholder text |
| Inverted text | `#FFFFFF` | Text on dark buttons |
| Border subtle | `#E8E4DC` | Card edges, dividers, input outlines |
| Border emphasis | `#1A1A1A` | Selected states, filled buttons |

Patterns:

- White: search bar area, filter section, nav bar, dense card sections.
- Cream: individual cards, image backgrounds, soft surfaces.
- No bright accent colors.
- No drop shadows.
- No gradients.
- No glassmorphism.

## Components

### Buttons

- Primary CTA: 48px height, full pill radius.
- Primary CTA fill: black `#0A0A0A`.
- Primary CTA text: white, Outfit 500, 14px.
- Over imagery, use a white CTA pill with no border when the design calls for it.
- Secondary button: transparent, 1px `#E8E4DC` cream border, primary text.
- Filter pill selected: black fill, white text, full pill radius, padding 8px 18px.
- Filter pill unselected: `#F5F2EC` fill, primary text, no border, padding 8px 18px.

### Cards

- Hero card radius: 16px.
- Grid card radius: 12px.
- No drop shadows.
- Use 0.5px tokenized borders when separation is needed.
- Hero card image backdrop uses `#EFEAE0`.
- Hero CTA overlays the bottom of the image.
- Product grid cards use full-bleed imagery with a small bottom label strip.

### Match Score Chip

- Fill: `#F5F2EC`.
- Text: primary, Outfit 500, 11px.
- Radius: full pill.
- Padding: 4px 10px.
- Position: bottom-left on product cards or top-left on hero cards.

### Save Heart

- 32px white circle.
- 0.5px subtle border.
- Heart outline in primary text color.
- Always top-right on saveable cards.

### Search Bar

- Height: 44px.
- Full pill radius.
- Fill: `#F5F2EC`.
- No border.
- Padding: 12px 16px.
- Search icon left.
- Microphone and camera icons right.
- Placeholder: Outfit 400, 14px, tertiary text.

### Delivery Badge

- Black pill.
- White text.
- Outfit 500, 11px.
- Padding: 4px 10px.
- Use for `Delivered by tomorrow`.
- Position top-left of hero card.

## Missing Designs

When a wireframe or reference is provided:

- Use the reference for layout and content hierarchy.
- Use this system for visual treatment.
- If the reference conflicts with this design language, ask whether the system is changing or whether the reference is layout-only.
