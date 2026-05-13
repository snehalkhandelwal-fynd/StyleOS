import type { ReactNode } from 'react';
import {
  Pressable,
  Text,
  View,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '../tokens/colors';
import { radii, spacing } from '../tokens/spacing';
import { typography } from '../tokens/typography';
import { Icon, type IconName } from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'pill' | 'destructive';
export type ButtonSize = 'md' | 'sm';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  fullWidth?: boolean;
  onPress?: () => void;
  children: ReactNode;
}

const HEIGHT: Record<ButtonSize, number> = { md: 48, sm: 40 };

interface VariantStyle {
  background: string;
  text: string;
  borderColor?: string;
  borderWidth?: number;
  radius: number;
}

const VARIANTS: Record<ButtonVariant, VariantStyle> = {
  primary: { background: colors.primary, text: colors.onPrimary, radius: radii.sm },
  secondary: {
    background: colors.canvas,
    text: colors.ink,
    borderColor: colors.ink,
    borderWidth: 1,
    radius: radii.sm,
  },
  tertiary: { background: 'transparent', text: colors.ink, radius: radii.none },
  pill: { background: colors.primary, text: colors.onPrimary, radius: radii.full },
  destructive: {
    background: colors.canvas,
    text: colors.sale,
    borderColor: colors.sale,
    borderWidth: 1,
    radius: radii.sm,
  },
};

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  leadingIcon,
  trailingIcon,
  fullWidth = false,
  onPress,
  children,
}: ButtonProps) {
  const v = VARIANTS[variant];
  const textStyle = size === 'md' ? typography.buttonMd : typography.buttonSm;

  const containerStyle = ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => ({
    height: HEIGHT[size],
    paddingHorizontal: spacing.lg,
    borderRadius: v.radius,
    backgroundColor: v.background,
    borderColor: v.borderColor,
    borderWidth: v.borderWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
    opacity: disabled ? 0.4 : 1,
    transform: pressed && !disabled ? [{ scale: 0.96 }] : undefined,
  });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={containerStyle}
    >
      {leadingIcon ? (
        <View style={{ marginRight: spacing.sm }}>
          <Icon name={leadingIcon} size={20} color={v.text} />
        </View>
      ) : null}
      <Text style={[textStyle, { color: v.text }]}>{children}</Text>
      {trailingIcon ? (
        <View style={{ marginLeft: spacing.sm }}>
          <Icon name={trailingIcon} size={20} color={v.text} />
        </View>
      ) : null}
    </Pressable>
  );
}
