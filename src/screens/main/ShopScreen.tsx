import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StoreCard } from '../../components/shop/StoreCard';
import { AppBar } from '../../components/common/AppBar';
import { colors } from '../../utils/theme';
import { Merchant, Store } from '../../types/models';
import { storesApi } from '../../api/stores';

const merchantToStore = (m: Merchant): Store => ({
  id: m.id,
  name: m.business_name,
  category: m.business_type,
  description: '',
  image: '',
  rating: m.approval_pct ? m.approval_pct / 20 : 0,
  reviewCount: m.total_votes,
  positiveCount: m.total_votes,
  negativeCount: 0,
  positivePercentage: m.approval_pct ?? 0,
  distance: m.distance_km ?? 0,
  address: '',
  phone: '',
  hours: '',
  isOpen: m.is_active,
  isFeatured: m.tier !== 'FREE',
  isFavorite: false,
  couponsCount: 0,
  discount: 0,
  canjes: 0,
});

const SIDEBAR_CATEGORIES = [
  { label: 'Todos', icon: '\u2630' },
  { label: 'Servicios', icon: '\u2699' },
  { label: 'Salud', icon: '\u2665' },
  { label: 'Fitness', icon: '\u2694' },
  { label: 'Gastronomia', icon: '\u2615' },
  { label: 'Cuidado', icon: '\u2606' },
  { label: 'Movilidad', icon: '\u2708' },
  { label: 'Entretenimiento', icon: '\u266C' },
  { label: 'Viajes', icon: '\u2601' },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.7;

export const ShopScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Todos');
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  const fetchMerchants = useCallback(async (category?: string, query?: string) => {
    setLoading(true);
    try {
      const cat = category === 'Todos' ? undefined : category;
      const res = await storesApi.getAll(cat, query || undefined);
      setStores(res.data.merchants.map(merchantToStore));
    } catch {
      setStores([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMerchants(); }, []);

  const filtered = stores;

  const toggleSidebar = () => {
    if (sidebarOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: -DRAWER_WIDTH, duration: 250, useNativeDriver: true }),
        Animated.timing(overlayAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start(() => setSidebarOpen(false));
    } else {
      setSidebarOpen(true);
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(overlayAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  };

  return (
    <View style={styles.root}>
      <AppBar />

      <View style={[styles.darkHeader, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerTitleRow}>
          <View style={styles.headerTextBlock}>
            <Text style={styles.headerTitle}>Guaca Shop</Text>
            <Text style={styles.headerSubtitle}>Encuentra las mejores ofertas!</Text>
            <View style={styles.searchBox}>
              <TextInput style={styles.searchInput} placeholder="Buscar comercios..." placeholderTextColor="#666" value={search} onChangeText={setSearch} returnKeyType="search" />
              <Image source={require('../../assets/images/maya-search.png')} style={styles.searchIcon} resizeMode="contain" />
            </View>
          </View>
          <Image source={require('../../assets/images/maya-search.png')} style={styles.parrot} resizeMode="contain" />
        </View>
      </View>

      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.filterPill} onPress={toggleSidebar}>
          <Text style={styles.hamburgerIcon}>{'\u2630'}</Text>
          <Text style={styles.filterText}>Todos</Text>
        </TouchableOpacity>
      </View>

      {loading
        ? <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} size="large" />
        : <FlatList
          data={filtered}
          keyExtractor={(s) => s.id}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 90 }]}
          showsVerticalScrollIndicator={false}
          onRefresh={() => fetchMerchants(activeTab, search)}
          refreshing={loading}
          renderItem={({ item }) => (
            <StoreCard store={item} onPress={() => navigation.navigate('StoreDetail', { storeId: item.id })} onToggleFavorite={() => storesApi.toggleFavorite(item.id)} />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>{'\u2315'}</Text>
              <Text style={styles.emptyText}>No se encontraron comercios</Text>
            </View>
          }
        />
      }

      {sidebarOpen && (
        <Animated.View style={[styles.overlay, { opacity: overlayAnim }]}>
          <TouchableOpacity style={StyleSheet.absoluteFillObject} activeOpacity={1} onPress={toggleSidebar} />
        </Animated.View>
      )}

      <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
        <View style={[styles.drawerContent, { paddingTop: insets.top + 20 }]}>
          <TouchableOpacity style={styles.drawerClose} onPress={toggleSidebar}>
            <Text style={styles.drawerCloseText}>{'\u2715'}</Text>
          </TouchableOpacity>
          <Text style={styles.drawerTitle}>Categorias</Text>
          {SIDEBAR_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.label}
              style={[styles.drawerItem, activeTab === cat.label && styles.drawerItemActive]}
              onPress={() => { setActiveTab(cat.label); toggleSidebar(); fetchMerchants(cat.label, search); }}
            >
              <Text style={styles.drawerItemIcon}>{cat.icon}</Text>
              <Text style={[styles.drawerItemText, activeTab === cat.label && styles.drawerItemTextActive]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#EBEBEB' },
  darkHeader: { backgroundColor: '#000000', paddingHorizontal: 16, paddingBottom: 20 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  headerTextBlock: { flex: 1, paddingRight: 8 },
  headerTitle: { fontSize: 28, fontFamily: 'Poppins-Bold', color: '#FFFFFF', lineHeight: 32 },
  headerSubtitle: { fontSize: 13, fontFamily: 'Poppins-Regular', color: '#AAAAAA', marginBottom: 14 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2C2C2E', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  searchIcon: { width: 28, height: 28 },
  searchInput: { flex: 1, fontSize: 13, fontFamily: 'Poppins-Regular', color: '#FFFFFF', padding: 0 },
  parrot: { width: 110, height: 130, marginBottom: -20, flexShrink: 0 },
  filterBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EBEBEB', paddingVertical: 10, paddingHorizontal: 14 },
  filterPill: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#E45B25', paddingHorizontal: 16, paddingVertical: 9, borderRadius: 100 },
  hamburgerIcon: { fontSize: 16, color: '#FFF' },
  filterText: { fontSize: 13, fontFamily: 'Poppins-Medium', color: '#FFF' },
  listContent: { paddingHorizontal: 14, paddingTop: 10 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyIcon: { fontSize: 40, color: '#888' },
  emptyText: { fontSize: 14, color: '#888', fontFamily: 'Poppins-Regular' },

  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 90 },
  drawer: { position: 'absolute', top: 0, left: 0, width: DRAWER_WIDTH, height: '100%', backgroundColor: '#000000', zIndex: 100, elevation: 20, shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 20, shadowOffset: { width: 4, height: 0 } },
  drawerContent: { flex: 1, paddingHorizontal: 20 },
  drawerClose: { alignSelf: 'flex-end', padding: 8, marginBottom: 12 },
  drawerCloseText: { color: '#FFF', fontSize: 20 },
  drawerTitle: { color: colors.primary, fontSize: 20, fontFamily: 'Poppins-Bold', marginBottom: 20 },
  drawerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 14, backgroundColor: '#1A1A1A', marginBottom: 8, gap: 12 },
  drawerItemActive: { backgroundColor: '#E45B25' },
  drawerItemIcon: { fontSize: 18, color: '#FFF' },
  drawerItemText: { color: '#FFF', fontSize: 15, fontFamily: 'Poppins-Medium' },
  drawerItemTextActive: { color: '#FFF', fontFamily: 'Poppins-Bold' },
});
