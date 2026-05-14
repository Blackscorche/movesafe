import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { colors } from '../../utils/theme';
import { CouponCard } from '../../components/stores/CouponCard';
import { Coupon, MerchantDetail } from '../../types/models';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { storesApi } from '../../api/stores';

const MOCK_COUPONS: Coupon[] = [
  {
    id: '1',
    storeId: '1',
    storeName: 'Farmacia Salud Plus',
    title: 'Descuento 15% en medicamentos',
    description: 'Válido para toda la tienda',
    discount: 15,
    cost: 50,
    available: 12,
    validUntil: '2025-03-31',
  },
  {
    id: '2',
    storeId: '1',
    storeName: 'Farmacia Salud Plus',
    title: 'Descuento 20% en vitaminas',
    description: 'Solo productos seleccionados',
    discount: 20,
    cost: 75,
    available: 5,
    validUntil: '2025-03-15',
  },
  {
    id: '3',
    storeId: '1',
    storeName: 'Farmacia Salud Plus',
    title: 'Descuento 10% general',
    description: 'Compra mínima $5',
    discount: 15,
    cost: 30,
    available: 25,
    validUntil: '2025-04-30',
  },
];

export const StoreDetailScreen = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const { storeId } = route.params || {};
  
  const [store, setStore] = useState<MerchantDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storeId) {
      console.warn('StoreDetailScreen: storeId is missing');
      return;
    }
    setLoading(true);
    storesApi.getById(storeId)
      .then(res => {
        console.log('StoreDetailScreen: Fetched store:', res.data);
        setStore(res.data);
      })
      .catch(err => {
        console.error('StoreDetailScreen: Error fetching store:', err);
      })
      .finally(() => setLoading(false));
  }, [storeId]);

  if (loading) {
    return (
      <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#E45B25" />
      </View>
    );
  }

  if (!store) {
    return (
      <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#000', fontFamily: 'Poppins-Medium' }}>Comercio no encontrado</Text>
        <TouchableOpacity style={{ marginTop: 16 }} onPress={() => navigation.goBack()}>
          <Text style={{ color: '#E45B25', fontFamily: 'Poppins-Bold' }}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const approvalPct = store.approval_pct ?? 0;
  const totalVotes = store.total_votes ?? 0;
  const positiveVotes = Math.round((approvalPct / 100) * totalVotes);
  const negativeVotes = totalVotes - positiveVotes;

  const lat = typeof store.latitude === 'number' ? store.latitude : -14.2350;
  const lng = typeof store.longitude === 'number' ? store.longitude : -51.9253;

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{store.business_name}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO IMAGE */}
        <View style={styles.heroImage}>
          {store.photo_url ? (
             <Image source={{ uri: store.photo_url }} style={StyleSheet.absoluteFillObject} />
          ) : (
             <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' }]}>
               <MaterialCommunityIcons name="storefront-outline" size={60} color="#666" />
             </View>
          )}
          <View style={styles.heroOverlay} />
          <View style={styles.heroBottom}>
            <Text style={styles.heroStoreName}>{store.business_name}</Text>
            <View style={styles.heroStats}>
              <View style={styles.heroStatChipDark}>
                <Text style={styles.heroStatGreen}>👍 {positiveVotes}</Text>
                <Text style={{color: '#fff', marginHorizontal: 4}}>|</Text>
                <Text style={styles.heroStatRed}>👎 {negativeVotes}</Text>
              </View>
              <View style={styles.heroStatChipWhite}>
                <Text style={styles.heroStatDark}>{approvalPct}% positivo</Text>
              </View>
            </View>
          </View>
        </View>

        {/* INFO CARD */}
        <View style={{ padding: 16 }}>
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Detalles del Comercio</Text>
            
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="map-marker-outline" size={20} color="#E45B25" />
              <Text style={styles.infoText}>{store.address || 'Caracas, Venezuela'}</Text>
            </View>

            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="phone-outline" size={20} color="#2ECC71" />
              <Text style={styles.phoneText}>{store.phone || 'No disponible'}</Text>
            </View>
          </View>
        </View>

        {/* MOCK MAP PLACEHOLDER (Safe) */}
        <View style={[styles.mapSection, { backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' }]}>
           <MaterialCommunityIcons name="map-outline" size={40} color="#999" />
           <Text style={{ color: '#888', marginTop: 8 }}>Mapa (Temporalmente deshabilitado)</Text>
        </View>

        {/* COUPONS SECTION */}
        <View style={styles.couponsSection}>
          <Text style={styles.couponsTitle}>Cupones</Text>
          {MOCK_COUPONS.map((coupon) => (
            <CouponCard
              key={coupon.id}
              coupon={{...coupon, storeId: store.id, storeName: store.business_name}}
              onRedeem={() => navigation.navigate('QRScreen', { couponId: coupon.id })}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

        {/* ── COUPONS SECTION ── */}
        <View style={styles.couponsSection}>
          <View style={styles.couponsHeader}>
            <Text style={styles.couponsTitle}>Cupones disponibles</Text>
            <View style={styles.couponsBadge}>
              <Text style={styles.couponsBadgeText}>{MOCK_COUPONS.length} ofertas</Text>
            </View>
          </View>

          {MOCK_COUPONS.map((coupon) => (
            <CouponCard
              key={coupon.id}
              coupon={{...coupon, storeId: store.id, storeName: store.business_name}}
              onRedeem={() =>
                navigation.navigate('QRScreen', { couponId: coupon.id })
              }
            />
          ))}
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#EBEBEB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSubtitle: {
    fontSize: 9,
    color: '#888',
    fontFamily: 'Poppins-Medium',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Poppins-Bold',
    lineHeight: 18,
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#E45B25',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontFamily: 'Poppins-Bold',
  },
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 120,
    flexGrow: 1,
  },

  // ── HERO ──
  heroImage: {
    height: 220,
    backgroundColor: '#000000',
    position: 'relative',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  heroBackButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  heroActionsRight: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
    zIndex: 10,
  },
  heroActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBottom: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  heroStoreName: {
    color: '#ffffff',
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  heroStats: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  heroStatChipDark: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  heroStatChipWhite: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  heroStatGreen: { color: '#2ECC71', fontSize: 11, fontFamily: 'Poppins-SemiBold' },
  heroStatRed: { color: '#E74C3C', fontSize: 11, fontFamily: 'Poppins-SemiBold' },
  heroStatDark: { color: '#000', fontSize: 11, fontFamily: 'Poppins-SemiBold' },
  heroStatMuted: { color: '#E4E4E4', fontSize: 11, fontFamily: 'Poppins-Medium' },

  // ── MAP ──
  mapSection: {
    height: 180,
    backgroundColor: '#EBEBEB',
    position: 'relative',
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  mapPinContainer: {
    position: 'absolute',
    top: '40%',
    left: '25%',
  },

  // ── INFO CARD ──
  infoWrapper: {
    paddingHorizontal: 16,
    marginTop: -20,
    zIndex: 20,
  },
  infoCard: {
    backgroundColor: '#050505',
    borderRadius: 16,
    padding: 16,
  },
  infoCardTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoText: {
    color: '#A0A0A0',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    lineHeight: 18,
    flex: 1,
  },
  phoneText: {
    color: '#2ECC71',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    flex: 1,
  },
  openText: {
    color: '#2ECC71',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    marginTop: 2,
  },

  // ── COUPONS ──
  couponsSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  couponsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  couponsTitle: {
    color: '#1A1A1A',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  couponsBadge: {
    backgroundColor: '#E45B25',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
  },
  couponsBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
  },
});
