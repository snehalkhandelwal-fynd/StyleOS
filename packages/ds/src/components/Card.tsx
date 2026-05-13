import type { ReactNode } from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { colors } from '../tokens/colors';
import { radii, spacing } from '../tokens/spacing';
import { typography } from '../tokens/typography';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

const PADDING: Record<CardPadding, number> = {
  none: 0,
  sm: spacing.sm,
  md: spacing.base,
  lg: spacing.lg,
};

export interface CardProps extends ViewProps {
  padding?: CardPadding;
  bordered?: boolean;
  elevated?: boolean;
  children?: ReactNode;
}

function CardRoot({
  padding = 'lg',
  bordered = true,
  elevated = false,
  children,
  style,
  ...rest
}: CardProps) {
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: colors.canvas,
          borderRadius: radii.md,
          padding: PADDING[padding],
          borderWidth: bordered ? 1 : 0,
          borderColor: colors.hairline,
        },
        elevated
          ? {
              shadowColor: colors.scrim,
              shadowOpacity: 0.06,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            }
          : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

function CardHeader({ title }: { title: string }) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text style={[typography.titleMd, { color: colors.ink }]}>{title}</Text>
    </View>
  );
}

function CardBody({ children }: { children: ReactNode }) {
  return <View>{children}</View>;
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
});
