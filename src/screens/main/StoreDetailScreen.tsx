import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../utils/theme';
import { CouponCard } from '../../components/stores/CouponCard';
import { Coupon } from '../../types/models';

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
  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >

        {/* ── HERO — full bleed, no top padding ── */}
        <View style={styles.heroImage}>
          {/* dark gradient overlay at bottom only */}
          <View style={styles.heroOverlay} />

          {/* back button — top left */}
          <TouchableOpacity
            style={styles.heroBackButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>

          {/* heart + share — top right */}
          <View style={styles.heroActionsRight}>
            <TouchableOpacity style={styles.heroActionButton}>
              <MaterialCommunityIcons name="heart-outline" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroActionButton}>
              <MaterialCommunityIcons name="export-variant" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* store name + chips — bottom of hero */}
          <View style={styles.heroBottom}>
            <Text style={styles.heroStoreName}>Farmacia Salud Plus</Text>
            <View style={styles.heroStats}>
              <View style={styles.heroStatChip}>
                <MaterialCommunityIcons name="thumb-up" size={11} color="#4CAF50" />
                <Text style={styles.heroStatGreen}> 189</Text>
              </View>
              <View style={styles.heroStatChip}>
                <MaterialCommunityIcons name="thumb-down" size={11} color="#F44336" />
                <Text style={styles.heroStatRed}> 23</Text>
              </View>
              <View style={styles.heroStatChip}>
                <Text style={styles.heroStatWhite}>89% positivo</Text>
              </View>
              <View style={styles.heroStatChip}>
                <MaterialCommunityIcons name="map-marker" size={11} color="#ccc" />
                <Text style={styles.heroStatMuted}> 0.3km</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── LIGHT BG SECTION — info card sits on this ── */}
        <View style={styles.lightSection}>

          {/* ── INFO CARD ── */}
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Información</Text>

            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="map-marker-outline" size={15} color="#888" />
              <Text style={styles.infoText}>Av. Principal, Centro Comercial Plaza, Local 12-A</Text>
            </View>

            <TouchableOpacity style={styles.howToGetRow}>
              <MaterialCommunityIcons name="navigation-outline" size={13} color="#2ECC71" />
              <Text style={styles.howToGet}> Cómo llegar</Text>
            </TouchableOpacity>

            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="phone-outline" size={15} color="#888" />
              <Text style={styles.phoneText}>+58 212 555 0123</Text>
            </View>

            <View style={[styles.infoRow, { marginBottom: 0 }]}>
              <MaterialCommunityIcons name="clock-outline" size={15} color="#888" />
              <Text style={styles.infoText}>Lun-Sáb 8:00 - 10:00 PM</Text>
              <View style={styles.openBadge}>
                <Text style={styles.openText}>Abierto ahora</Text>
              </View>
            </View>
          </View>

          {/* ── COUPONS HEADER ── */}
          <View style={styles.couponsHeader}>
            <Text style={styles.couponsTitle}>Cupones disponibles</Text>
            <View style={styles.couponsBadge}>
              <Text style={styles.couponsBadgeText}>3 ofertas</Text>
            </View>
          </View>

          {/* ── COUPON CARDS ── */}
          {MOCK_COUPONS.map((coupon) => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
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
    backgroundColor: '#F2F2F2',
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
    height: 240,
    backgroundColor: '#000000',
    position: 'relative',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 130,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  heroBackButton: {
    position: 'absolute',
    top: 52,
    left: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  heroActionsRight: {
    position: 'absolute',
    top: 52,
    right: 14,
    flexDirection: 'row',
    gap: 8,
    zIndex: 10,
  },
  heroActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBottom: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    right: 14,
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
  heroStatChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  heroStatGreen: {
    color: '#4CAF50',
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
  },
  heroStatRed: {
    color: '#F44336',
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
  },
  heroStatWhite: {
    color: '#ffffff',
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
  },
  heroStatMuted: {
    color: '#cccccc',
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
  },

  // ── LIGHT SECTION ──
  lightSection: {
    backgroundColor: '#F2F2F2',   // matches root — light gray like design
    paddingHorizontal: 14,
    paddingTop: 16,
  },

  // ── INFO CARD ── dark card on light bg
  infoCard: {
    backgroundColor: '#000000',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  infoCardTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  infoText: {
    color: '#9A9A9A',
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    flex: 1,
  },
  phoneText: {
    color: '#2ECC71',
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    flex: 1,
  },
  howToGetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 25,
    marginBottom: 12,
    marginTop: -6,
  },
  howToGet: {
    color: '#2ECC71',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  openBadge: {
    backgroundColor: 'rgba(46,204,113,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  openText: {
    color: '#2ECC71',
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
  },

  // ── COUPONS ──
  couponsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  couponsTitle: {
    color: '#1A1A1A',             // dark text on light bg
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  couponsBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
  },
  couponsBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
});
