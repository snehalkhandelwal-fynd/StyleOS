import { View } from 'react-native';
import { colors } from '../tokens/colors';

export type IconName =
  | 'back' | 'forward' | 'close' | 'close-large' | 'menu' | 'search' | 'filter'
  | 'more-horizontal' | 'more-vertical' | 'chevron-down' | 'chevron-up'
  | 'chevron-left' | 'chevron-right' | 'external-link'
  | 'cart' | 'bag' | 'wishlist' | 'heart' | 'heart-filled' | 'tag' | 'discount'
  | 'gift' | 'receipt' | 'truck' | 'return' | 'shipping'
  | 'user' | 'user-circle' | 'account' | 'settings' | 'lock' | 'key' | 'logout'
  | 'notification' | 'notification-active' | 'mail' | 'phone'
  | 'check' | 'check-circle' | 'error' | 'error-circle' | 'warning' | 'info'
  | 'info-circle' | 'question' | 'loader'
  | 'image' | 'gallery' | 'camera' | 'video' | 'play' | 'pause' | 'volume'
  | 'volume-mute' | 'share' | 'download' | 'upload' | 'link' | 'copy'
  | 'edit' | 'delete' | 'trash' | 'archive' | 'plus' | 'plus-circle' | 'minus'
  | 'minus-circle' | 'add-image' | 'crop' | 'rotate'
  | 'sort' | 'sort-asc' | 'sort-desc' | 'grid' | 'list' | 'expand' | 'collapse'
  | 'zoom-in' | 'zoom-out'
  | 'facebook' | 'instagram' | 'twitter' | 'x' | 'pinterest' | 'youtube'
  | 'tiktok' | 'linkedin'
  | 'shirt' | 'pants' | 'shoe' | 'hat' | 'dress' | 'jacket' | 'bag-handbag'
  | 'hanger' | 'closet' | 'outfit' | 'wardrobe' | 'style-quiz' | 'palette'
  | 'color-swatch';

export type IconSize = 16 | 20 | 24 | 32 | 48;

export interface IconProps {
  name: IconName;
  size?: IconSize | number;
  color?: string;
  strokeWidth?: number;
}

// Renders a square placeholder until SVG paths are wired in via react-native-svg.
// The component contract (props, sizes, names) is the public API; the visual
// implementation is the only stub.
export function Icon({
  name: _name,
  size = 24,
  color = colors.ink,
  strokeWidth: _strokeWidth = 1.5,
}: IconProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderWidth: 1,
        borderColor: color,
        borderRadius: 2,
      }}
    />
  );
}
