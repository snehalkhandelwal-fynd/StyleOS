import type { TextStyle } from 'react-native';

export const fontFamilies = {
  primary:
    "Airbnb Cereal VF, Circular, -apple-system, system-ui, Roboto, 'Helvetica Neue', sans-serif",
} as const;

type TypographyStyle = Pick<
  TextStyle,
  'fontSize' | 'fontWeight' | 'lineHeight' | 'letterSpacing' | 'textTransform'
>;

export const typography = {
  ratingDisplay: {
    fontSize: 64,
    fontWeight: '700',
    lineHeight: 70,
    letterSpacing: -1,
  },
  displayXl: { fontSize: 28, fontWeight: '700', lineHeight: 40, letterSpacing: 0 },
  displayLg: { fontSize: 22, fontWeight: '500', lineHeight: 26, letterSpacing: -0.44 },
  displayMd: { fontSize: 21, fontWeight: '700', lineHeight: 30, letterSpacing: 0 },
  displaySm: { fontSize: 20, fontWeight: '600', lineHeight: 24, letterSpacing: -0.18 },
  titleMd: { fontSize: 16, fontWeight: '600', lineHeight: 20, letterSpacing: 0 },
  titleSm: { fontSize: 16, fontWeight: '500', lineHeight: 20, letterSpacing: 0 },
  bodyMd: { fontSize: 16, fontWeight: '400', lineHeight: 24, letterSpacing: 0 },
  bodySm: { fontSize: 14, fontWeight: '400', lineHeight: 20, letterSpacing: 0 },
  caption: { fontSize: 14, fontWeight: '500', lineHeight: 18, letterSpacing: 0 },
  captionSm: { fontSize: 13, fontWeight: '400', lineHeight: 16, letterSpacing: 0 },
  badge: { fontSize: 11, fontWeight: '600', lineHeight: 13, letterSpacing: 0 },
  microLabel: { fontSize: 12, fontWeight: '700', lineHeight: 16, letterSpacing: 0 },
  uppercaseTag: {
    fontSize: 8,
    fontWeight: '700',
    lineHeight: 10,
    letterSpacing: 0.32,
    textTransform: 'uppercase',
  },
  buttonMd: { fontSize: 16, fontWeight: '500', lineHeight: 20, letterSpacing: 0 },
  buttonSm: { fontSize: 14, fontWeight: '500', lineHeight: 18, letterSpacing: 0 },
  link: { fontSize: 14, fontWeight: '400', lineHeight: 20, letterSpacing: 0 },
  navLink: { fontSize: 16, fontWeight: '600', lineHeight: 20, letterSpacing: 0 },
} as const satisfies Record<string, TypographyStyle>;

export type TypographyToken = keyof typeof typography;
