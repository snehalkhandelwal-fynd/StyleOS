import { useState } from 'react';
import { TextInput, View, Text } from 'react-native';
import { colors } from '../tokens/colors';
import { radii, spacing } from '../tokens/spacing';
import { typography } from '../tokens/typography';

export type InputVariant = 'default' | 'error';

export interface InputFieldProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (v: string) => void;
  variant?: InputVariant;
  errorText?: string;
  helperText?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
}

export function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  variant = 'default',
  errorText,
  helperText,
  disabled = false,
  secureTextEntry = false,
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);

  const isError = variant === 'error';
  const borderColor = isError ? colors.sale : focused ? colors.ink : colors.hairline;
  const borderWidth = focused || isError ? 2 : 1;

  return (
    <View style={{ alignSelf: 'stretch' }}>
      {label ? (
        <Text style={[typography.caption, { color: colors.mute, marginBottom: spacing.xs }]}>
          {label}
        </Text>
      ) : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mute}
        editable={!disabled}
        secureTextEntry={secureTextEntry}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          typography.bodyMd,
          {
            height: 56,
            borderRadius: radii.sm,
            borderColor,
            borderWidth,
            paddingHorizontal: spacing.base,
            backgroundColor: colors.canvas,
            color: colors.ink,
            opacity: disabled ? 0.4 : 1,
          },
        ]}
      />
      {isError && errorText ? (
        <Text style={[typography.bodySm, { color: colors.sale, marginTop: spacing.xs }]}>
          {errorText}
        </Text>
      ) : helperText ? (
        <Text style={[typography.bodySm, { color: colors.mute, marginTop: spacing.xs }]}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}
