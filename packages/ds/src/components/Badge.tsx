import type { ReactNode } from 'react';
import { View, Text } from 'react-native';
import { colors } from '../tokens/colors';
import { radii, spacing } from '../tokens/spacing';
import { typography } from '../tokens/typography';

export type BadgeVariant = 'default' | 'new' | 'sale';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
}

interface VariantStyle {
  background: string;
  text: string;
  textStyle: typeof typography.badge | typeof typography.uppercaseTag | typeof typography.captionSm;
}

const VARIANTS: Record<BadgeVariant, VariantStyle> = {
  default: { background: colors.canvas, text: colors.ink, textStyle: typography.badge },
  new: { background: colors.canvas, text: colors.ink, textStyle: typography.uppercaseTag },
  sale: { background: colors.canvas, text: colors.sale, textStyle: typography.captionSm },
};

export function Badge({ variant = 'default', children }: BadgeProps) {
  const v = VARIANTS[variant];
  return (
    <View
      style={{
        backgroundColor: v.background,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xxs,
        borderRadius: radii.full,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={[v.textStyle, { color: v.text }]}>{children}</Text>
    </View>
  );
}
