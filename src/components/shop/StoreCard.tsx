import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Store } from '../../types/models';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface StoreCardProps {
  store: Store;
  onPress: () => void;
  onToggleFavorite: () => void;
}

const getCatIcon = (cat: string) => {
  const lower = cat.toLowerCase();
  if (lower.includes('farmacia') || lower.includes('laboratorio') || lower.includes('salud')) {
    return { name: 'shield-plus-outline', color: '#2ECC71', bg: '#E8F8F0' };
  }
  if (lower.includes('supermercado') || lower.includes('mercado')) {
    return { name: 'cart-outline', color: '#F39C12', bg: '#FEF5E7' };
  }
  return { name: 'storefront-outline', color: '#3498DB', bg: '#EAF2F8' };
};

export const StoreCard: React.FC<StoreCardProps> = ({ store, onPress, onToggleFavorite }) => {
  const catStyle = getCatIcon(store.category);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      <View style={styles.thumbWrap}>
        <Image source={require('../../assets/images/store-placeholder.png')} style={styles.thumb} resizeMode="cover" />
      </View>

      <View style={styles.body}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={2}>{store.name}</Text>
          <TouchableOpacity onPress={onToggleFavorite} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MaterialCommunityIcons 
              name={store.isFavorite ? 'heart' : 'heart-outline'} 
              size={20} 
              color={store.isFavorite ? '#E45B25' : '#8A94A6'} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.catRow}>
            <MaterialCommunityIcons name="map-marker-outline" size={14} color="#8A94A6" />
            <Text style={styles.distance}>{store.distance} km</Text>
            
            <View style={[styles.catIconWrap, { backgroundColor: catStyle.bg }]}>
              <MaterialCommunityIcons name={catStyle.name as any} size={10} color={catStyle.color} />
            </View>
            <Text style={styles.catText}>{store.category}</Text>
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
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  thumbWrap: {
    width: 64, height: 64,
    borderRadius: 12,
    backgroundColor: '#E4E4E4',
    overflow: 'hidden',
    marginRight: 12,
  },
  thumb: { width: 64, height: 64 },
  body: { flex: 1, justifyContent: 'center', gap: 6 },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  name: { fontSize: 14, fontFamily: 'Poppins-SemiBold', color: '#1A1A1A', lineHeight: 20, flex: 1, paddingRight: 8 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  catRow: { flexDirection: 'row', alignItems: 'center' },
  distance: { fontSize: 12, color: '#8A94A6', fontFamily: 'Poppins-Regular', marginLeft: 4, marginRight: 12 },
  catIconWrap: { width: 18, height: 18, borderRadius: 4, alignItems: 'center', justifyContent: 'center', marginRight: 6 },
  catText: { fontSize: 11, fontFamily: 'Poppins-Regular', color: '#8A94A6' },
  discountBadge: { backgroundColor: '#000000', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  discountText: { fontSize: 12, fontFamily: 'Poppins-Bold', color: '#FFFFFF' },
});
