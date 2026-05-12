import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../../utils/theme';

interface GuaCoinBalanceProps {
  balance: number;
  reserved?: number;
  size?: 'small' | 'large';
}

export const GuaCoinBalance: React.FC<GuaCoinBalanceProps> = ({
  balance,
  reserved,
  size = 'small',
}) => {
  const isLarge = size === 'large';

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.iconContainer, isLarge && styles.iconLarge]}>
          <Text style={styles.iconText}>GC</Text>
        </View>
        <Text style={[styles.balance, isLarge && styles.balanceLarge]}>
          {(balance ?? 0).toLocaleString('es-VE')}
        </Text>
      </View>
      {reserved !== undefined && reserved > 0 && (
        <Text style={styles.reserved}>
          Reservado: {reserved} GC
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLarge: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  iconText: {
    color: colors.textPrimary,
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
  },
  balance: {
    color: colors.textPrimary,
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  balanceLarge: {
    fontSize: 36,
  },
  reserved: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
  },
});
