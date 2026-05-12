import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../utils/theme';

interface AppCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'surface1' | 'surface2' | 'surface3';
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  style,
  variant = 'surface1',
}) => {
  const bgColor =
    variant === 'surface1'
      ? colors.surface1
      : variant === 'surface2'
        ? colors.surface2
        : colors.surface3;

  return (
    <View style={[styles.card, { backgroundColor: bgColor }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
  },
});
