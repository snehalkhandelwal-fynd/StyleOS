import { Pressable, type PressableStateCallbackType, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '../tokens/colors';
import { radii } from '../tokens/spacing';
import { Icon, type IconName } from './Icon';

export type IconButtonVariant = 'circle' | 'outline' | 'plain';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps {
  icon: IconName;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}

const DIMENSION: Record<IconButtonSize, number> = { sm: 32, md: 40, lg: 48 };
const ICON_SIZE: Record<IconButtonSize, 16 | 20 | 24> = { sm: 16, md: 20, lg: 24 };

interface VariantStyle {
  background: string;
  borderColor?: string;
  borderWidth?: number;
}

const VARIANTS: Record<IconButtonVariant, VariantStyle> = {
  circle: { background: colors.surfaceStrong },
  outline: { background: colors.canvas, borderColor: colors.ink, borderWidth: 1 },
  plain: { background: 'transparent' },
};

export function IconButton({
  icon,
  variant = 'circle',
  size = 'md',
  onPress,
  disabled = false,
  accessibilityLabel,
}: IconButtonProps) {
  const v = VARIANTS[variant];
  const dim = DIMENSION[size];

  const containerStyle = ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => ({
    width: dim,
    height: dim,
    borderRadius: radii.full,
    backgroundColor: v.background,
    borderColor: v.borderColor,
    borderWidth: v.borderWidth,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.4 : 1,
    transform: pressed && !disabled ? [{ scale: 0.96 }] : undefined,
  });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? icon}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={containerStyle}
    >
      <Icon name={icon} size={ICON_SIZE[size]} color={colors.ink} />
    </Pressable>
  );
}
