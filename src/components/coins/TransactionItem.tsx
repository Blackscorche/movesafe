import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../utils/theme';
import { Transaction, TransactionType } from '../../types/models';
import { formatGC, formatTimeAgo } from '../../utils/formatters';
import { Badge } from '../common/Badge';

interface TransactionItemProps {
  transaction: Transaction;
}

const typeConfig: Record<TransactionType, { icon: string; color: string; prefix: string; bgColor: string }> = {
  emision: {
    icon: 'G',
    color: colors.success,
    prefix: '+',
    bgColor: colors.successTint15,
  },
  canje: {
    icon: '↑',
    color: colors.primary,
    prefix: '-',
    bgColor: colors.primaryTint10,
  },
  bonus: {
    icon: '★',
    color: colors.teal,
    prefix: '+',
    bgColor: colors.successTint15,
  },
};

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const config = typeConfig[transaction.type];
  const amountColor =
    transaction.type === 'canje' ? colors.primary : transaction.type === 'bonus' ? colors.teal : colors.success;

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: config.bgColor }]}>
        <Text style={[styles.iconText, { color: config.color }]}>{config.icon}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>
            {transaction.description}
          </Text>
          <Text style={[styles.amount, { color: amountColor }]}>
            {config.prefix}{Math.abs(transaction.amount)} GC
          </Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.subtitle} numberOfLines={1}>
            {transaction.subtitle}
          </Text>
          <Text style={styles.time}>{formatTimeAgo(transaction.date)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    flex: 1,
    marginRight: 8,
  },
  amount: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    flex: 1,
    marginRight: 8,
  },
  time: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
  },
});
