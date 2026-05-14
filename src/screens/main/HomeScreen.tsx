import React, { useEffect, useCallback, useRef } from 'react';
import { useGuaCoins } from '../../hooks/useGuaCoins';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Easing,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSteps } from '../../hooks/useSteps';
import { AppBar } from '../../components/common/AppBar';
import { notifyExpiryWarning } from '../../services/notifications';

// ─── Theme ────────────────────────────────────────────────────────────────────
const colors = {
  background: '#EBEBEB',
  surface: '#FFFFFF',
  surfaceDark: '#000000',
  surfaceGray: '#2C2C2E',
  surfaceMidGray: '#3A3A3C',
  primary: '#E8622A',
  green: '#2D9E52',
  textPrimary: '#1C1C1E',
  textSecondary: '#8E8E93',
  danger: '#FF3B30',
};

// ─── Double-ring Circular Progress ────────────────────────────────────────────
const RING_SIZE = 100;
const STROKE = 10;
const R = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgress: React.FC<{ percentage: number }> = ({ percentage }) => {
  const anim = useRef(new Animated.Value(0)).current;
  const radius = R - STROKE - 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: percentage / 100,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  const strokeDashoffset = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, circumference * (1 - percentage / 100)],
  });

  return (
    <View style={{ width: RING_SIZE, height: RING_SIZE }}>
      <Svg width={RING_SIZE} height={RING_SIZE}>
        <Circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={R} stroke="#1C1C1E" strokeWidth={STROKE} fill="none" />
        <Circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={R - STROKE - 2} stroke="#E0E0E0" strokeWidth={STROKE - 2} fill="none" />
        <AnimatedCircle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={radius}
          stroke={colors.primary}
          strokeWidth={STROKE - 2}
          fill="none"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
        />
      </Svg>
      <View style={styles.ringLabel}>
        <Text style={styles.ringPct}>{percentage}%</Text>
      </View>
    </View>
  );
};

// ─── Steps Widget ─────────────────────────────────────────────────────────────
const StepsWidget = ({ steps, goal, percentage, distance, calories, minutes }: any) => {
  const [tab, setTab] = React.useState<'HOY' | 'AYER'>('HOY');

  return (
    <View style={styles.stepsCard}>
      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tab, tab === 'HOY' && styles.tabActive]} onPress={() => setTab('HOY')}>
          <Text style={[styles.tabText, tab === 'HOY' && styles.tabTextActive]}>HOY</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'AYER' && styles.tabOrange]} onPress={() => setTab('AYER')}>
          <Text style={[styles.tabText, tab === 'AYER' && styles.tabTextWhite]}>AYER</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stepsMain}>
        <View style={styles.stepsLeft}>
          <View style={styles.stepsLabelRow}>
            <Image source={require('../../assets/images/footstep.png')} style={styles.stepsIconImg} resizeMode="contain" />
            <Text style={styles.stepsLabel}>PASOS {goal.toLocaleString()}</Text>
          </View>
          <Text style={styles.stepsCount}>{steps.toLocaleString()}</Text>
          <Text style={styles.stepsMeta}>Meta: {goal.toLocaleString()}</Text>
        </View>
        <CircularProgress percentage={percentage} />
      </View>

      <View style={styles.divider} />

      <View style={styles.statsRow}>
        <View style={styles.statItem}><Text style={styles.statLabel}>Distancia</Text><Text style={styles.statVal}>{(distance / 1000).toFixed(1)} km</Text></View>
        <View style={styles.statItem}><Text style={styles.statLabel}>Calorías</Text><Text style={styles.statVal}>{calories} kcal</Text></View>
        <View style={styles.statItem}><Text style={styles.statLabel}>Tiempo</Text><Text style={styles.statVal}>{minutes} min</Text></View>
      </View>
    </View>
  );
};

// ─── Home Screen ──────────────────────────────────────────────────────────────
export const HomeScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { stepsToday, goal, percentage, todaySteps, sync, isSyncing } = useSteps();
  const { dashboard, fetchBalance, isLoading: isDashboardLoading } = useGuaCoins();
  const { hasConflict, resolveConflict } = useHealthContext();

  useEffect(() => { 
    sync(); 
    fetchBalance();
  }, []);

  const onRefresh = useCallback(async () => { 
    const [_, balanceRes] = await Promise.all([sync(), fetchBalance()]);
    if (balanceRes && balanceRes.expiring_amount > 0 && balanceRes.expiring_days <= 7) {
      notifyExpiryWarning(balanceRes.expiring_amount, balanceRes.expiring_days);
    }
  }, [sync, fetchBalance]);

  return (
    <LinearGradient colors={['#E8E8E8', '#DADADA']} style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <AppBar />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingTop: 0 }]}
        refreshControl={<RefreshControl refreshing={isSyncing || isDashboardLoading} onRefresh={onRefresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
      >

        {hasConflict && (
          <View style={styles.conflictCard}>
            <Text style={styles.conflictTitle}>⚠️ Conflicto de pasos</Text>
            <Text style={styles.conflictDesc}>
              Encontramos una diferencia entre tus pasos locales ({hasConflict.localSteps}) 
              y los del servidor ({hasConflict.serverSteps}). ¿Cuál deseas usar?
            </Text>
            <View style={styles.conflictButtons}>
              <TouchableOpacity 
                style={[styles.conflictBtn, { backgroundColor: colors.primary }]}
                onPress={() => resolveConflict(true)}
              >
                <Text style={styles.conflictBtnText}>Usar Locales</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.conflictBtn, { backgroundColor: '#333' }]}
                onPress={() => resolveConflict(false)}
              >
                <Text style={styles.conflictBtnText}>Usar Servidor</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <StepsWidget
          steps={stepsToday}
          goal={goal}
          percentage={percentage}
          distance={todaySteps?.distance ?? 0}
          calories={todaySteps?.calories ?? 0}
          minutes={todaySteps?.minutes ?? 0}
        />

        {/* ── Grid Layout ── */}
        <View style={styles.gridContainer}>

          {/* Left Column (Stacked) */}
          <View style={styles.leftColumn}>
            {/* Balance Card */}
            <TouchableOpacity
              style={styles.balanceCard}
              onPress={() => navigation.navigate('CoinsTab')}
              activeOpacity={0.8}
            >
              <View style={styles.balanceIconRow}>
                <View style={styles.gcRoundBadge}>
                  <Image source={require('../../assets/images/GLogo.png')} style={styles.gcLogoImg} resizeMode="contain" />
                </View>
                <View>
                  <Text style={styles.balanceTopLabel}>Balance</Text>
                  <Text style={styles.balanceTopLabel}>GuaCoins</Text>
                </View>
              </View>
              <Text style={styles.balanceValue}>
                {(dashboard?.wallet_balance ?? 0).toLocaleString()} <Text style={styles.balanceGC}>GC</Text>
              </Text>
              {dashboard && dashboard.expiring_amount > 0 && (
                <View style={[styles.expiryWarning, dashboard.expiring_days <= 7 && styles.expiryCritical]}>
                  <Text style={styles.expiryText}>
                    {dashboard.expiring_days <= 7 ? '⚠️ ' : ''}
                    {dashboard.expiring_amount} GC vencen en {dashboard.expiring_days} días
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Challenge Card */}
            <View style={styles.challengeCard}>
              <Image
            source={require('../../assets/images/maya-see.png')}
                style={styles.challengeMayaImage}
                resizeMode="stretch"
              />
              <View style={styles.lockOverlay}>
                <Text style={styles.lockIcon}>{'\uD83D\uDD12'}</Text>
              </View>
              <View style={styles.challengeTextOverlay}>
                 <View style={styles.proximaBadge}><Text style={styles.proximaText}>Próximamente</Text></View>
                 <Text style={styles.challengeTitle}>Runners con Mila</Text>
               </View>
            </View>
          </View>

          {/* Right Column (THE STREAK CARD) */}
          <View style={styles.rightColumn}>
            <TouchableOpacity
              style={styles.streakCardTall}
              onPress={() => navigation.navigate('StepsDetail')}
              activeOpacity={0.9}
            >
              {/* Top Section: Icon & Header */}
              <View style={styles.streakHeaderRow}>
                <View style={styles.flameCircleContainer}>
                  <Image source={require('../../assets/images/flameicon.png')} style={styles.flameImgSmall} resizeMode="contain" />
                </View>
                <View style={styles.streakInfoWrap}>
                  <Text style={styles.streakSmallTitle}>Racha actual</Text>
                  <View style={styles.daysContainer}>
                    <Text style={styles.streakBigNum}>{dashboard?.streak_days ?? 0}</Text>
                    <Text style={styles.streakDaysUnit}>días</Text>
                  </View>
                </View>
              </View>

              {/* Middle Section: Bonus Pill */}
              <View style={styles.bonusPillExact}>
                <Text style={styles.starEmojiExact}>⭐</Text>
                <View>
                  <Text style={styles.bonusMainText}>+{dashboard?.bonus_streak_days ?? 0} bonus</Text>
                  <Text style={styles.bonusSubText}>(10k+ pasos)</Text>
                </View>
              </View>

              {/* Bottom Section: Milestone Progress */}
              <View style={styles.milestoneBoxExact}>
                <Text style={styles.milestoneBoxTitle}>Próximo hito: {((dashboard?.streak_days ?? 0) > 7 ? 30 : 7)} días</Text>

                <View style={styles.exactProgressTrack}>
                  <View style={[styles.exactProgressFill, { width: `${Math.min(((dashboard?.streak_days ?? 0) / 7) * 100, 100)}%` }]} />
                </View>

                <Text style={styles.exactRewardText}>+20 GC</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tip Card */}
        <View style={styles.tipCard}>
          <View style={styles.tipIconWrap}><Text style={styles.tipIcon}>💡</Text></View>
          <View style={styles.tipBody}>
            <Text style={styles.tipTitle}>Tip de Maya</Text>
            <Text style={styles.tipMessage}>¡Buen trabajo! Estás muy cerca de tu meta diaria. ¡Sigue así!</Text>
          </View>
          <Image
            source={require('../../assets/images/maya-tip.png')}
            style={styles.tipParrot}
            resizeMode="contain"
          />
        </View>

      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 120 },

  // Header Styles
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  avatarIcon: { fontSize: 20 },
  pioneroLabel: { fontSize: 10, color: colors.primary, fontWeight: '700' },
  userName: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bellWrap: { position: 'relative' },
  bellIcon: { fontSize: 24 },
  bellBadge: { position: 'absolute', top: -4, right: -6, backgroundColor: colors.danger, width: 17, height: 17, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  bellBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  gcCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  gcText: { color: '#fff', fontSize: 10, fontWeight: '800' },

  // Steps Widget Styles
  stepsCard: { backgroundColor: colors.surface, borderRadius: 24, padding: 20, marginBottom: 12 },
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tab: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  tabActive: { backgroundColor: '#000' },
  tabOrange: { backgroundColor: colors.primary },
  tabText: { fontSize: 11, fontWeight: '700', color: colors.textSecondary },
  tabTextActive: { color: '#fff' },
  tabTextWhite: { color: '#fff' },
  stepsMain: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stepsLeft: { flex: 1 },
  stepsLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  stepsIcon: { fontSize: 14 },
  stepsIconImg: { width: 18, height: 18 },
  stepsLabel: { fontSize: 12, fontWeight: '700', color: colors.primary },
  stepsCount: { fontSize: 48, fontWeight: '900', color: colors.textPrimary },
  stepsMeta: { fontSize: 14, color: colors.textSecondary },
  ringLabel: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  ringPct: { fontSize: 20, fontWeight: '900' },
  divider: { height: 1, backgroundColor: '#F2F2F2', marginVertical: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 2 },
  statVal: { fontSize: 16, fontWeight: '800' },

  // Grid Styles
  gridContainer: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  leftColumn: { flex: 1, gap: 10 },
  rightColumn: { flex: 1 },

  balanceCard: { backgroundColor: colors.primary, borderRadius: 24, padding: 16, height: 145, justifyContent: 'space-between' },
  balanceIconRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  gcRoundBadge: { width: 30, height: 30, borderRadius: 15, borderWidth: 1.5, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  gcRoundText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  balanceTopLabel: { fontSize: 11, color: '#fff', fontWeight: '600', lineHeight: 14 },
  balanceValue: { fontSize: 36, fontWeight: '900', color: '#fff' },
  balanceGC: { fontSize: 16, opacity: 0.8 },
  expiryWarning: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
  },
  expiryCritical: {
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  expiryText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
  },

  challengeCard: { borderRadius: 24, height: 115, overflow: 'hidden', position: 'relative', backgroundColor: '#000' },
  lockOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  lockIcon: { fontSize: 24 },
  challengeMayaImage: { width: '100%', height: '100%' },
  challengeTextOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 2 },
  challengeTitle: { fontSize: 11, fontWeight: '800', color: '#FFF' },
  proximaBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 4 },
  proximaText: { fontSize: 9, color: '#FFF', fontWeight: '800' },

  // ─── THE EXACT STREAK CARD STYLING ───
  streakCardTall: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 28,
    padding: 16,
    minHeight: 270,
    justifyContent: 'space-between',
  },
  streakHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 4,
  },
  flameCircleContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flameEmoji: { display: 'none' },
  flameImgSmall: { width: 26, height: 26 },
  streakInfoWrap: {
    flex: 1,
  },
  streakSmallTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  daysContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: -4,
  },
  streakBigNum: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '900',
    marginRight: 4,
  },
  streakDaysUnit: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  bonusPillExact: {
    backgroundColor: '#3A3A3C',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginVertical: 10,
  },
  starEmojiExact: {
    fontSize: 18,
    marginRight: 10,
  },
  bonusMainText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  bonusSubText: {
    color: '#FFFFFF',
    fontSize: 11,
    opacity: 0.8,
  },
  milestoneBoxExact: {
    backgroundColor: '#2C2C2E',
    borderRadius: 22,
    padding: 14,
    gap: 8,
  },
  milestoneBoxTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  exactProgressTrack: {
    height: 8,
    backgroundColor: '#48484A',
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  exactProgressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  exactRewardText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  // Tip Card Styles
  tipCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', position: 'relative', overflow: 'hidden', minHeight: 105, marginTop: 4 },
  tipIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  tipIcon: { fontSize: 20 },
  tipBody: { flex: 1, paddingRight: 50 },
  tipTitle: { fontSize: 14, fontWeight: '900', marginBottom: 2 },
  tipMessage: { fontSize: 12, color: '#555', lineHeight: 17 },
  tipParrot: { width: 95, height: 95, position: 'absolute', right: -5, bottom: -5 },
  
  // Conflict Styles
  conflictCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.danger,
  },
  conflictTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: colors.danger,
    marginBottom: 4,
  },
  conflictDesc: {
    fontSize: 12,
    color: '#444',
    fontFamily: 'Poppins-Regular',
    lineHeight: 18,
    marginBottom: 16,
  },
  conflictButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  conflictBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conflictBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
});

export default HomeScreen;
