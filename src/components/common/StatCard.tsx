import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../utils/theme';

interface StatCardProps {
  icon: string;
  value: string;
  label?: string;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  color = colors.textPrimary,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  icon: {
    fontSize: 16,
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  label: {
    color: colors.textMuted,
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
  },
});
