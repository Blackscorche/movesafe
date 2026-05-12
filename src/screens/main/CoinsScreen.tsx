import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { AppBar } from '../../components/common/AppBar';
import { guacoinsApi } from '../../api/guacoins';
import { DashboardResponse, TransactionItem as ApiTx } from '../../types/models';

// ─── Types ────────────────────────────────────────────────────────────────────
type TransactionType = 'emision' | 'canje' | 'bonus';
type FilterType = 'todas' | 'emision' | 'canje' | 'bonus';

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  subtitle: string;
  time?: string;
  storeName?: string;
  date: string;
  status: 'confirmed' | 'pending';
}

// ─── Theme (Light Mode) ───────────────────────────────────────────────────────
const colors = {
  background: '#F5F5F5',
  cardBg: '#000000',
  cardBgLight: '#FFFFFF',
  orange: '#FF5A1F',
  orangeTint: 'rgba(255,90,31,0.08)',
  orangeBorder: 'rgba(255,90,31,0.25)',
  white: '#FFFFFF',
  textPrimary: '#111111',
  textSecondary: '#6B6B6B',
  textMuted: '#AAAAAA',
  green: '#16A34A',
  greenBg: 'rgba(22,163,74,0.10)',
  divider: '#EBEBEB',
  filterBg: '#000000',
  filterActive: '#FF5A1F',
  pendingBg: 'rgba(255,90,31,0.10)',
  confirmedBg: 'rgba(22,163,74,0.10)',
  navBg: '#FFFFFF',
  tabBarBg: '#FFFFFF',
  tabBarBorder: '#EBEBEB',
  avatarBg: '#F0F0F0',
  separatorColor: '#F0F0F0',
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'emision',
    amount: 10,
    description: 'Emisión diaria',
    subtitle: '7,842 pasos - Meta alcanzada',
    time: 'Hoy, 8:30 AM',
    date: '2025-03-15',
    status: 'confirmed',
  },
  {
    id: '2',
    type: 'canje',
    amount: -50,
    description: 'Canje en Farmacia',
    subtitle: 'Descuento 15% ap...',
    time: 'Ayer, 3:45 PM',
    storeName: 'Ahorraste $4.5',
    date: '2025-03-14',
    status: 'confirmed',
  },
  {
    id: '3',
    type: 'bonus',
    amount: 15,
    description: 'Bonus racha 7 días',
    subtitle: 'Celebración de hito',
    time: 'Hace 2 días',
    date: '2025-03-14',
    status: 'confirmed',
  },
  {
    id: '4',
    type: 'emision',
    amount: 10,
    description: 'Emisión diaria',
    subtitle: '10,200 pasos - Meta alcanzada',
    time: 'Hace 3 días',
    date: '2025-03-13',
    status: 'confirmed',
  },
  {
    id: '5',
    type: 'canje',
    amount: -75,
    description: 'Canje en Supermercado',
    subtitle: 'Descuento 10% aplicado',
    time: 'Hace 3 días',
    storeName: 'Ahorraste $7.5',
    date: '2025-03-12',
    status: 'pending',
  },
];

// ─── Transaction Icon ─────────────────────────────────────────────────────────
const TransactionIcon = ({ type }: { type: TransactionType }) => {
  if (type === 'emision') {
    return (
      <View style={[styles.iconWrapper, { backgroundColor: colors.greenBg }]}>
        <Image source={require('../../assets/images/Gsuccessicon.png')} style={styles.txIconImg} resizeMode="contain" />
      </View>
    );
  }
  if (type === 'canje') {
    return (
      <View style={[styles.iconWrapper, { backgroundColor: colors.orangeTint }]}>
        <Image source={require('../../assets/images/transferico.png')} style={styles.txIconImg} resizeMode="contain" />
      </View>
    );
  }
  return (
    <View style={[styles.iconWrapper, { backgroundColor: 'rgba(139,92,246,0.10)' }]}>
      <Image source={require('../../assets/images/bonus.png')} style={styles.txIconImg} resizeMode="contain" />
    </View>
  );
};

// ─── Transaction Item ─────────────────────────────────────────────────────────
const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  const isPositive = transaction.amount > 0;
  const isPending = transaction.status === 'pending';

  return (
    <View style={styles.transactionItem}>
      <TransactionIcon type={transaction.type} />
      <View style={styles.transactionContent}>
        <View style={styles.transactionRow}>
          <Text style={styles.transactionTitle}>{transaction.description}</Text>
          <Text style={[styles.transactionAmount, { color: isPositive ? colors.green : colors.orange }]}>
            {isPositive ? `+${transaction.amount} GC` : `${transaction.amount} GC`}
          </Text>
        </View>
        <Text style={styles.transactionSubtitle} numberOfLines={1}>
          {transaction.subtitle}
        </Text>
        {transaction.storeName && (
          <Text style={styles.transactionSavings}>{transaction.storeName}</Text>
        )}
        <View style={styles.transactionMeta}>
          <Text style={styles.transactionTime}>{transaction.time}</Text>
          <View style={[styles.statusBadge, { backgroundColor: isPending ? colors.pendingBg : colors.confirmedBg }]}>
            <View style={[styles.statusDot, { backgroundColor: isPending ? colors.orange : colors.green }]} />
            <Text style={[styles.statusText, { color: isPending ? colors.orange : colors.green }]}>
              {isPending ? 'Pending' : 'Confirmed'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// ─── Filters ──────────────────────────────────────────────────────────────────
const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'todas', label: 'Todas' },
  { key: 'emision', label: 'Emisiones' },
  { key: 'canje', label: 'Canjes' },
  { key: 'bonus', label: 'Bonus' },
];

const mapApiTx = (t: ApiTx): Transaction => ({
  id: t.id,
  type: t.type === 'STEP_REWARD' ? 'emision' : t.type === 'REDEMPTION' ? 'canje' : 'bonus',
  amount: t.direction === 'DEBIT' ? -Math.abs(t.amount) : Math.abs(t.amount),
  description: t.type === 'STEP_REWARD' ? 'Emisión diaria' : t.type === 'REDEMPTION' ? 'Canje en comercio' : 'Bonus',
  subtitle: t.type,
  time: new Date(t.created_at).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
  date: t.created_at.split('T')[0],
  status: t.status === 'CONFIRMED' ? 'confirmed' : 'pending',
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export const CoinsScreen = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('todas');
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [txList, setTxList] = useState<Transaction[]>([]);
  const [loadingBalance, setLoadingBalance] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoadingBalance(true);
      try {
        const [balRes, txRes] = await Promise.allSettled([
          guacoinsApi.getBalance(),
          guacoinsApi.getTransactions(),
        ]);
        if (balRes.status === 'fulfilled') setDashboard(balRes.value.data);
        if (txRes.status === 'fulfilled') setTxList(txRes.value.data.items.map(mapApiTx));
      } finally {
        setLoadingBalance(false);
      }
    };
    load();
  }, []);

  const filteredTransactions =
    activeFilter === 'todas'
      ? txList
      : txList.filter((t) => t.type === activeFilter);

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.navBg} />

      <View style={styles.container}>
        <AppBar />

        {/* ── Balance Card (dark pill on light background) ── */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceLeft}>
            <Text style={styles.balanceLabel}>Balance total</Text>
            <View style={styles.balanceRow}>
              {loadingBalance
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.balanceAmount}>{dashboard?.wallet_available?.toLocaleString() ?? '—'}</Text>}
            </View>
            <View style={styles.reservedContainer}>
              <Text style={styles.reservedText}>Reservado: {dashboard?.wallet_reserved ?? 0} GC</Text>
            </View>
          </View>

          <View style={styles.mascotWrapper}>

            <Image
              source={require('../../assets/images/maya-money.png')}
              style={styles.parrotImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* ── Warning Banner ── */}
        <View style={styles.warningBanner}>
          <View style={styles.warningLeft}>
            <Text style={styles.warningEmoji}>⚠️</Text>
            <Text style={styles.warningText}>
              ¡Actívate!{' '}
              <Text style={{ fontWeight: '700' }}>Alcanza 10,000 pasos</Text>{' '}
              para ganar 10 GC
            </Text>
          </View>
          <TouchableOpacity style={styles.usarBtn}>
            <Text style={styles.usarBtnText}>Usar ahora</Text>
          </TouchableOpacity>
        </View>

        {/* ── Filter Tabs ── */}
        <View style={styles.filterRow}>
          {FILTERS.map((f) => {
            const isActive = activeFilter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => setActiveFilter(f.key)}
                style={[styles.filterTab, isActive && styles.filterTabActive]}
              >
                <Text style={[styles.filterLabel, isActive && styles.filterLabelActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Transaction List ── */}
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionItem transaction={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          style={styles.listContainer}
        />

      </View>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Top Nav
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: colors.navBg,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.orange,
  },
  avatarText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  navLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    letterSpacing: 1,
  },
  navName: {
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
  },
  bellButton: {
    position: 'relative',
    padding: 4,
  },
  bellBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.orange,
    borderWidth: 1.5,
    borderColor: colors.navBg,
  },

  // Balance Card
  balanceCard: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 12,
    backgroundColor: colors.cardBg,
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceLeft: {
    alignItems: 'center',
  },
  balanceLabel: {
    color: '#9A9A9A',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  balanceAmount: {
    color: colors.white,
    fontSize: 42,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
  },
  balanceLeft: {
    flex: 1,
  },
  balanceLabel: {
    color: '#9A9A9A',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  balanceAmount: {
    color: colors.white,
    fontSize: 42,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    letterSpacing: -1,
    lineHeight: 50,
  },
  moua: {
    backgroundColor: colors.orange,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 4,
  },
  mouaText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  reservedContainer: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  reservedText: {
    color: '#9A9A9A',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  reservedLabel: {
    color: '#9A9A9A',
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
  },
  reservedAmount: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },

  // Mascot
  mascotWrapper: {
    width: 160,
    height: 160,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  coinBubble: {
    position: 'absolute',
    top: 0,
    right: 10,
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    padding: 6,
    zIndex: 2,
  },
  parrotImage: {
    width: 160,
    height: 160,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },

  // Warning Banner
  warningBanner: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: '#E45B25',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,90,31,0.3)',
  },
  warningLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  warningEmoji: {
    fontSize: 16,
  },
  warningText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    flex: 1,
  },
  usarBtn: {
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 10,
  },
  usarBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },

  // Filter Tabs
  filterRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: colors.filterBg,
    borderRadius: 12,
    padding: 4,
    gap: 2,
    minHeight: 44,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  filterTabActive: {
    backgroundColor: colors.filterActive,
  },
  filterLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
  },
  filterLabelActive: {
    color: colors.white,
    fontWeight: '700',
  },

  // Transaction List
  listContainer: {
    marginHorizontal: 16,
    backgroundColor: colors.cardBgLight,
    borderRadius: 16,
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 100,
  },
  separator: {
    height: 1,
    backgroundColor: colors.separatorColor,
  },

  // Transaction Item
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    gap: 12,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txIconImg: {
    width: 24,
    height: 24,
  },
  transactionContent: {
    flex: 1,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  transactionTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    flex: 1,
    marginRight: 8,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    flexShrink: 0,
  },
  transactionSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginBottom: 2,
  },
  transactionSavings: {
    color: colors.orange,
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  transactionTime: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },

  // Bottom Tab Bar
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.tabBarBg,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: colors.tabBarBorder,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    position: 'relative',
  },
  tabActiveDot: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.orange,
  },
});

export default CoinsScreen;
