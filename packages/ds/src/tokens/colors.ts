export const colors = {
  primary: '#111111',
  onPrimary: '#ffffff',
  primaryActive: '#000000',
  primaryDisabled: '#9e9ea0',

  canvas: '#ffffff',
  surfaceSoft: '#f5f5f5',
  surfaceStrong: '#ebebeb',

  hairline: '#cacacb',
  hairlineSoft: '#e5e5e5',
  borderStrong: '#707072',

  ink: '#111111',
  charcoal: '#39393b',
  ash: '#4b4b4d',
  mute: '#707072',
  stone: '#9e9ea0',

  sale: '#d30005',
  saleDeep: '#780700',
  success: '#007d48',
  successBright: '#1eaa52',
  info: '#1151ff',
  infoDeep: '#0034e3',

  accentPink: '#ed1aa0',
  accentPinkSoft: '#ffb0dd',
  accentPurpleSoft: '#beaffd',
  accentPurplePale: '#d6d1ff',
  accentTeal: '#0a7281',
  accentPinkDeep: '#4c012d',

  scrim: '#000000',
} as const;

export type ColorToken = keyof typeof colors;
