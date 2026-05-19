# Satoshi — StyleOS typography family

The `@styleos/ds` typography scale (`fontFamilies.primary`) renders in **Satoshi**.
Airbnb Cereal — the original reference — is Airbnb's proprietary typeface and is not
licensed for use here; Satoshi is the StyleOS replacement.

## Files

Static family, 10 OTFs:

| Weight | Upright | Italic |
|---|---|---|
| Light (300) | `Satoshi-Light.otf` | `Satoshi-LightItalic.otf` |
| Regular (400) | `Satoshi-Regular.otf` | `Satoshi-Italic.otf` |
| Medium (500) | `Satoshi-Medium.otf` | `Satoshi-MediumItalic.otf` |
| Bold (700) | `Satoshi-Bold.otf` | `Satoshi-BoldItalic.otf` |
| Black (900) | `Satoshi-Black.otf` | `Satoshi-BlackItalic.otf` |

There is **no SemiBold (600)** in the static family. The typography tokens use only
400 / 500 / 700, all of which have a real face. Do not add a 600 token.

## Source & license

Satoshi is published by Indian Type Foundry on **Fontshare** (https://www.fontshare.com/fonts/satoshi),
free for personal and commercial use under the Fontshare license. Add the official
license file to this folder when convenient — Font Book installs the font but not its
license text.

## Bundling into the app (engineering step — not done here)

These files are vendored but **not yet wired into any build** — there is no app shell
in this repo yet. When `apps/*` lands, the React Native app must:

1. Reference this folder from `react-native.config.js` (`assets: [...]`) and run
   `npx react-native-asset`, **or** copy the OTFs into the app and register them
   (iOS: add to the target + `UIAppFonts` in `Info.plist`; Android: drop into
   `app/src/main/assets/fonts/`).
2. Confirm the registered family name matches the `"Satoshi"` string in
   `fontFamilies.primary` — a mismatch makes the app silently fall back to the
   system font.
