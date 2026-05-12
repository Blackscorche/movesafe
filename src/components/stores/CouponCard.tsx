import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Coupon } from '../../types/models';
import { formatDate } from '../../utils/formatters';

interface CouponCardProps {
  coupon: Coupon;
  onRedeem: () => void;
}

export const CouponCard: React.FC<CouponCardProps> = ({ coupon, onRedeem }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onRedeem} activeOpacity={0.8}>
      <View style={styles.discountSection}>
        <Text style={styles.discountValue}>{coupon.discount}%</Text>
        <Text style={styles.discountLabel}>OFF</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{coupon.title}</Text>
        <Text style={styles.description} numberOfLines={1}>{coupon.description}</Text>

        <View style={styles.infoRow}>
          <View style={styles.costContainer}>
            <Text style={styles.costValue}>{coupon.cost} GC</Text>
          </View>
          {coupon.available > 0 && (
            <Text style={styles.available}>{coupon.available} disponibles</Text>
          )}
        </View>
      </View>

      <View style={styles.validitySection}>
        <View style={styles.validityPill}>
          <Text style={styles.validityPillText}>Valido hasta {formatDate(coupon.validUntil)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#000000',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  discountSection: {
    backgroundColor: '#000000',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  discountValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    fontWeight: '800',
  },
  discountLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    marginTop: -2,
  },
  content: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  description: {
    color: '#9A9A9A',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  costContainer: {
    backgroundColor: 'rgba(228,91,37,0.10)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  costValue: {
    color: '#2ECC71',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  available: {
    color: '#666',
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
  },
  validitySection: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  validityPill: {
    backgroundColor: '#E45B25',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    paddingVertical: 5,
    paddingLeft: 8,
    paddingRight: 12,
  },
  validityPillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontFamily: 'Poppins-Medium',
  },
});
