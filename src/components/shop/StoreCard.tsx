import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Store } from '../../types/models';

interface StoreCardProps {
  store: Store;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store, onPress, onToggleFavorite }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      <View style={styles.thumbWrap}>
        <Image source={require('../../assets/images/store-placeholder.png')} style={styles.thumb} resizeMode="cover" />
      </View>

      <View style={styles.body}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={2}>{store.name}</Text>
          <View style={styles.nameRight}>
            {store.isFeatured && <Text style={styles.destacado}>DESTACADO</Text>}
            <TouchableOpacity onPress={onToggleFavorite} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.heart}>{store.isFavorite ? '\u2665' : '\u2661'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.catRow}>
          <Text style={styles.catBullet}>{'\u25C6'}</Text>
          <Text style={styles.catText}>{store.category}</Text>
        </View>

        <View style={styles.ratingRow}>
          <Text style={styles.ratingLabel}>{'\u25B2'} {store.positiveCount ?? store.reviewCount}</Text>
          <Text style={styles.ratingLabel}>{'\u25BC'} {store.negativeCount ?? 0}</Text>
          <Text style={styles.positiveLabel}>{store.positivePercentage}% positivo</Text>
        </View>

        <View style={styles.footRow}>
          <View style={styles.footLeft}>
            <Text style={styles.distance}>{'\u2022'} {store.distance} km</Text>
            <View style={styles.canjesPill}>
              <Text style={styles.canjesText}>{store.canjes ?? 5} canjes</Text>
            </View>
          </View>
          {store.discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{store.discount}%</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    padding: 14,
    marginBottom: 10,
    minHeight: 100,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  thumbWrap: {
    width: 72, height: 72,
    borderRadius: 12,
    backgroundColor: '#E4E4E4',
    overflow: 'hidden',
    marginRight: 12,
    alignSelf: 'flex-start',
  },
  thumb: { width: 72, height: 72 },
  body: { flex: 1, gap: 3 },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 },
  name: { fontSize: 14, fontFamily: 'Poppins-SemiBold', color: '#1A1A1A', lineHeight: 19, flex: 1 },
  nameRight: { flexDirection: 'row', alignItems: 'center', gap: 5, flexShrink: 0 },
  destacado: { fontSize: 9, fontFamily: 'Poppins-Bold', color: '#E8622A', letterSpacing: 0.4 },
  heart: { fontSize: 16, color: '#E45B25' },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  catBullet: { fontSize: 8, color: '#E45B25' },
  catText: { fontSize: 11, fontFamily: 'Poppins-Regular', color: '#888' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ratingLabel: { fontSize: 12, fontFamily: 'Poppins-Medium', color: '#1A1A1A' },
  positiveLabel: { fontSize: 11, fontFamily: 'Poppins-Medium', color: '#2A9D52', marginLeft: 2 },
  footRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  footLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  distance: { fontSize: 11, color: '#888', fontFamily: 'Poppins-Regular' },
  canjesPill: { backgroundColor: '#EFEFEF', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  canjesText: { fontSize: 11, fontFamily: 'Poppins-Medium', color: '#555' },
  discountBadge: { backgroundColor: '#2A9D52', borderRadius: 22, paddingHorizontal: 14, paddingVertical: 6, minWidth: 52, alignItems: 'center' },
  discountText: { fontSize: 15, fontFamily: 'Poppins-Bold', color: '#FFFFFF' },
});
