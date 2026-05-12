import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Store } from '../../types/models';

interface StoreCardProps {
  store: Store;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({
  store,
  onPress,
  onToggleFavorite,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      {/* ── Thumbnail ── */}
      <View style={styles.thumbWrap}>
        <Image
          source={require('../../assets/images/store-placeholder.png')}
          style={styles.thumb}
          resizeMode="cover"
        />
      </View>

      {/* ── Body ── */}
      <View style={styles.body}>

        {/* Row 1: Name + DESTACADO + Heart */}
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={2}>{store.name}</Text>
          <View style={styles.nameRight}>
            {store.isFeatured && (
              <Text style={styles.destacado}>DESTACADO</Text>
            )}
            <TouchableOpacity
              onPress={onToggleFavorite}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.heart}>{store.isFavorite ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Row 2: Category */}
        <View style={styles.catRow}>
          <Text style={styles.catIcon}>🔷</Text>
          <Text style={styles.catText}>{store.category}</Text>
        </View>

        {/* Row 3: 👍 N  👎 N  X% positivo */}
        <View style={styles.ratingRow}>
          <Text style={styles.ratingIcon}>👍</Text>
          <Text style={styles.ratingNum}>{store.positiveCount ?? store.reviewCount}</Text>
          <Text style={styles.ratingIcon}>👎</Text>
          <Text style={styles.ratingNum}>{store.negativeCount ?? 0}</Text>
          <Text style={styles.positiveLabel}>{store.positivePercentage}% positivo</Text>
        </View>

        {/* Row 4: 📍 0.3km  [N canjes]  [15%] */}
        <View style={styles.footRow}>
          <View style={styles.footLeft}>
            <Text style={styles.distance}>📍 {store.distance} km</Text>
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
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  // Thumb
  thumbWrap: {
    width: 62,
    height: 62,
    borderRadius: 12,
    backgroundColor: '#E4E4E4',
    overflow: 'hidden',
    marginRight: 12,
    alignSelf: 'flex-start',
  },
  thumb: { width: 62, height: 62 },

  // Body
  body: { flex: 1, gap: 3 },

  // Name row
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 6,
  },
  name: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    lineHeight: 19,
    flex: 1,
  },
  nameRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexShrink: 0,
  },
  destacado: {
    fontSize: 9,
    fontFamily: 'Poppins-Bold',
    color: '#E8622A',
    letterSpacing: 0.4,
  },
  heart: { fontSize: 15 },

  // Category
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  catIcon: { fontSize: 10 },
  catText: { fontSize: 11, fontFamily: 'Poppins-Regular', color: '#888' },

  // Rating
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingIcon: { fontSize: 12 },
  ratingNum: { fontSize: 12, fontFamily: 'Poppins-Medium', color: '#1A1A1A' },
  positiveLabel: {
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
    color: '#2A9D52',
    marginLeft: 2,
  },

  // Footer
  footRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  footLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  distance: { fontSize: 11, color: '#888', fontFamily: 'Poppins-Regular' },
  canjesPill: {
    backgroundColor: '#EFEFEF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  canjesText: { fontSize: 11, fontFamily: 'Poppins-Medium', color: '#555' },
  discountBadge: {
    backgroundColor: '#2A9D52',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 6,
    minWidth: 52,
    alignItems: 'center',
  },
  discountText: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
});
