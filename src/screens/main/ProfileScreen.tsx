import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { profileApi } from '../../api/profile';
import { guacoinsApi } from '../../api/guacoins';
import { Mission as ApiMission } from '../../types/models';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  pageBg: '#F0F0F0',
  headerBg: '#111111',
  darkCard: '#1A1A1A',
  darkCardAlt: '#202020',
  white: '#FFFFFF',
  orange: '#FF5A1F',
  orangeTint: 'rgba(255,90,31,0.20)',
  green: '#22C55E',
  greenTint: 'rgba(34,197,94,0.18)',
  purple: '#8B5CF6',
  purpleTint: 'rgba(139,92,246,0.20)',
  teal: '#14B8A6',
  tealTint: 'rgba(20,184,166,0.20)',
  yellow: '#EAB308',
  yellowTint: 'rgba(234,179,8,0.20)',
  textWhite: '#FFFFFF',
  textWhiteDim: '#888888',
  textBlack: '#111111',
  textGray: '#666666',
  textMuted: '#AAAAAA',
  dividerDark: '#2A2A2A',
  dividerLight: '#E8E8E8',
  trackDark: '#303030',
  pendingOrange: '#FF5A1F',
  pendingOrangeBg: 'rgba(255,90,31,0.18)',
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface Mission {
  id: string;
  title: string;
  progress: number;
  total: number;
  completed: boolean;
  icon: string;
  iconBg: string;
  barColor: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const MISSIONS: Mission[] = [
  { id: '1', title: 'Camina 1,000 pasos', progress: 1000, total: 1000, completed: true, icon: '👟', iconBg: C.orangeTint, barColor: C.orange },
  { id: '2', title: 'Alcanza 5,000 pasos en un día', progress: 5000, total: 5000, completed: true, icon: '🎯', iconBg: C.tealTint, barColor: C.teal },
  { id: '3', title: 'Completa 10,000 pasos diarios', progress: 10000, total: 10000, completed: true, icon: '🏆', iconBg: C.orangeTint, barColor: C.orange },
  { id: '4', title: 'Camina 20,000 pasos en 3 días consecutivos', progress: 11000, total: 20000, completed: false, icon: '🔥', iconBg: C.orangeTint, barColor: C.orange },
  { id: '5', title: 'Alcanza racha de 7 días consecutivos', progress: 5, total: 7, completed: false, icon: '⚡', iconBg: C.yellowTint, barColor: C.yellow },
  { id: '6', title: 'Realiza 10 canjes en comercios', progress: 5, total: 10, completed: false, icon: '🛒', iconBg: C.tealTint, barColor: C.teal },
  { id: '7', title: 'Visita 5 comercios diferentes', progress: 3, total: 5, completed: false, icon: '🏪', iconBg: C.purpleTint, barColor: C.purple },
  { id: '8', title: 'Acumula 50,000 pasos totales', progress: 39000, total: 50000, completed: false, icon: '📊', iconBg: C.orangeTint, barColor: C.orange },
];

const STORES = [
  { name: 'Farmacia Salud Plus', likes: 245, dislikes: 12, positive: 95 },
  { name: 'Bodega El Pana', likes: 245, dislikes: 12, positive: 95 },
  { name: 'Supermercado Central', likes: 245, dislikes: 12, positive: 95 },
];

// ─── Mission Row ──────────────────────────────────────────────────────────────
const MissionRow = ({ m, isLast }: { m: Mission; isLast: boolean }) => {
  const pct = Math.min(100, Math.round((m.progress / m.total) * 100));

  return (
    <View style={[styles.missionRow, !isLast && styles.missionBorder]}>
      {/* Colored icon circle */}
      <View style={[styles.missionIcon, { backgroundColor: m.iconBg }]}>
        <Text style={styles.missionEmoji}>{m.icon}</Text>
      </View>

      {/* Title + badge */}
      <View style={styles.missionBody}>
        <View style={styles.missionTitleRow}>
          <Text
            style={[styles.missionTitle, m.completed && styles.missionTitleDone]}
            numberOfLines={2}
          >
            {m.title}
          </Text>
          {m.completed ? (
            <View style={styles.greenCheck}>
              <Text style={styles.greenCheckText}>✓</Text>
            </View>
          ) : (
            <View style={styles.pendingPill}>
              <Text style={styles.pendingPillText}>Pendiente</Text>
            </View>
          )}
        </View>

        {/* Progress bar */}
        {!m.completed && (
          <>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: m.barColor }]} />
            </View>
            <Text style={styles.progressNote}>
              {m.total >= 1000
                ? `${(m.progress / 1000).toFixed(0)}K / ${(m.total / 1000).toFixed(0)}K`
                : `${m.progress} / ${m.total}`}
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

// ─── Screen ───────────────────────────────────────────────────────────────────
export const ProfileScreen = ({ navigation }: any) => {
  const { signOut, user: authUser } = useAuthContext();
  const [dashboard, setDashboard] = useState<any>(null);
  const [missions, setMissions] = useState<ApiMission[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [dashRes, missionRes] = await Promise.all([
          guacoinsApi.getBalance(),
          profileApi.getMissions()
        ]);
        setDashboard(dashRes.data);
        setMissions(missionRes.data || MISSIONS);
      } catch (e) {
        console.error('Error loading profile data:', e);
        setMissions(MISSIONS); // Fallback to mock data on 404
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const level = dashboard?.level ?? 1;
  const xp = dashboard?.xp ?? 0;
  const xpNext = (dashboard?.xp ?? 0) + (dashboard?.xp_to_next_level ?? 1000);
  const streak = dashboard?.streak_days ?? 0;
  const redemptions = dashboard?.total_redemptions ?? 0;
  const xpPct = Math.min(100, Math.round((xp / xpNext) * 100));
  const displayName = dashboard?.display_name || authUser?.name || 'Usuario';
  const balance = dashboard?.wallet_balance ?? 0;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.headerBg} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ══════ DARK HEADER ══════ */}
        <View style={styles.header}>
          {/* Back arrow */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          {/* Name centered, avatar right */}
          <View style={styles.headerProfileRow}>
            <View style={styles.headerCenter}>
              <Text style={styles.headerName}>{displayName}</Text>
            </View>
            <View style={styles.headerAvatar}>
              <Text style={styles.headerAvatarEmoji}>👤</Text>
            </View>
          </View>

          {/* ══════ GLASSY PROGRESS SECTION ══════ */}
          <View style={styles.glassContainer}>
            <View style={styles.levelRow}>
              <View style={styles.levelLeft}>
                <View style={styles.trophyCircle}>
                  <Text style={styles.levelTrophy}>🏆</Text>
                </View>
                <View>
                  <Text style={styles.levelLabel}>Nivel {level}</Text>
                  <Text style={styles.xpSubText}>{xpNext - xp} XP para el siguiente nivel</Text>
                </View>
              </View>
              <Text style={styles.xpLabel}>{xp} / {xpNext} XP</Text>
            </View>

            <View style={styles.xpTrack}>
              <View style={[styles.xpFill, { width: `${xpPct}%` }]} />
            </View>
          </View>
        </View>

        {/* ══════ STAT CARDS ══════ */}
        <View style={styles.statsRow}>
          {/* Fire */}
          <View style={styles.statCard}>
            <View style={[styles.statRing, { borderColor: C.orange }]}>
              <Text style={styles.statEmoji}>🔥</Text>
            </View>
            <Text style={styles.statVal}>{streak}</Text>
            <Text style={styles.statLbl}>Días racha</Text>
          </View>

          {/* Target — purple ring */}
          <View style={styles.statCard}>
            <View style={[styles.statRing, { borderColor: C.purple }]}>
              <Text style={styles.statEmoji}>🎯</Text>
            </View>
            <Text style={styles.statVal}>{redemptions}</Text>
            <Text style={styles.statLbl}>Canjes</Text>
          </View>

          {/* Star — green ring, green value */}
          <View style={styles.statCard}>
            <View style={[styles.statRing, { borderColor: C.green }]}>
              <Text style={styles.statEmoji}>⭐</Text>
            </View>
            <Text style={[styles.statVal, { color: C.green }]}>{balance}GC</Text>
            <Text style={styles.statLbl}>Balance</Text>
          </View>
        </View>

        {/* ══════ BADGES / MEDALS ══════ */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Logros y Medallas</Text>
        </View>

        <View style={styles.badgesRow}>
          <View style={[styles.badgeCard, xp >= 1000 && styles.badgeActive]}>
            <Text style={styles.badgeEmoji}>{xp >= 1000 ? '🛡️' : '🔒'}</Text>
            <Text style={styles.badgeName}>Caminante de Hierro</Text>
            <Text style={styles.badgeDesc}>1,000 XP alcanzados</Text>
          </View>

          <View style={[styles.badgeCard, level >= 10 && styles.badgeActive]}>
            <Text style={styles.badgeEmoji}>{level >= 10 ? '👑' : '🔒'}</Text>
            <Text style={styles.badgeName}>Leyenda</Text>
            <Text style={styles.badgeDesc}>Nivel 10 alcanzado</Text>
          </View>
        </View>

        {/* ══════ MISSIONS ══════ */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Misiones</Text>
          <Text style={styles.sectionSub}>{missions.filter(m => m.completed).length} de {missions.length} completadas</Text>
        </View>

        <View style={styles.missionCard}>
          {missions.length > 0 ? missions.map((m, i) => (
            <View key={m.id} style={[styles.missionRow, i < missions.length - 1 && styles.missionBorder]}>
              <View style={[styles.missionIcon, { backgroundColor: m.completed ? C.greenTint : C.orangeTint }]}>
                <Text style={styles.missionEmoji}>{m.icon || '🎯'}</Text>
              </View>
              <View style={styles.missionBody}>
                <View style={styles.missionTitleRow}>
                  <Text style={[styles.missionTitle, m.completed && styles.missionTitleDone]}>{m.title}</Text>
                  {m.completed ? (
                    <View style={styles.greenCheck}><Text style={styles.greenCheckText}>✓</Text></View>
                  ) : (
                    <View style={styles.pendingPill}><Text style={styles.pendingPillText}>Pendiente</Text></View>
                  )}
                </View>
                {!m.completed && (
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${Math.round((m.progress / m.total) * 100)}%`, backgroundColor: C.orange }]} />
                  </View>
                )}
              </View>
            </View>
          )) : (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: '#888' }}>No hay misiones disponibles</Text>
            </View>
          )}
        </View>

        {/* ══════ FAVORITE STORES ══════ */}
        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>Comercios Favoritos</Text>
          <TouchableOpacity style={styles.verTodasBtn}>
            <Text style={styles.verTodasBtnText}>📋 Ver todas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.storeCard}>
          {STORES.map((s, i) => (
            <View key={s.name}>
              <TouchableOpacity style={styles.storeRow}>
                {/* Red heart */}
                <Text style={styles.storeHeart}>❤️</Text>
                <View style={styles.storeInfo}>
                  <Text style={styles.storeName}>{s.name}</Text>
                  <View style={styles.storeStats}>
                    <Text style={styles.storeStat}>👍 {s.likes}</Text>
                    <Text style={styles.storeStat}>👎 {s.dislikes}</Text>
                    <View style={styles.positiveChip}>
                      <Text style={styles.positiveChipText}>{s.positive}% positivo</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.storeArrow}>›</Text>
              </TouchableOpacity>
              {i < STORES.length - 1 && <View style={styles.storeDivider} />}
            </View>
          ))}
        </View>

        {/* ══════ MENU ══════ */}
        <View style={styles.menuCard}>
          {/* Misiones y Logros */}
          <TouchableOpacity style={styles.menuRow}>
            <View style={[styles.menuIconCircle, { backgroundColor: C.orangeTint }]}>
              <Text style={styles.menuEmoji}>🏆</Text>
            </View>
            <Text style={styles.menuRowLabel}>Misiones y Logros</Text>
            <Text style={styles.menuRowArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Comprar zapatos — disabled/locked */}
          <View style={[styles.menuRow, { opacity: 0.35 }]}>
            <View style={[styles.menuIconCircle, { backgroundColor: C.purpleTint }]}>
              <Text style={styles.menuEmoji}>🛍️</Text>
            </View>
            <Text style={styles.menuRowLabel}>Comprar zapatos</Text>
            <Text style={styles.menuRowArrow}>🔒</Text>
          </View>

          <View style={styles.menuDivider} />

          {/* Comercios Favoritos */}
          <TouchableOpacity style={styles.menuRow}>
            <View style={[styles.menuIconCircle, { backgroundColor: 'rgba(239,68,68,0.15)' }]}>
              <Text style={styles.menuEmoji}>❤️</Text>
            </View>
            <Text style={styles.menuRowLabel}>Comercios Favoritos</Text>
            <Text style={styles.menuRowArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* FAQ / Ayuda */}
          <TouchableOpacity style={styles.menuRow} onPress={() => navigation?.navigate('Help')}>
            <View style={[styles.menuIconCircle, { backgroundColor: C.tealTint }]}>
              <Text style={styles.menuEmoji}>❓</Text>
            </View>
            <Text style={styles.menuRowLabel}>FAQ / Ayuda</Text>
            <Text style={styles.menuRowArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Configuración */}
          <TouchableOpacity style={styles.menuRow} onPress={() => navigation?.navigate('Settings')}>
            <View style={[styles.menuIconCircle, { backgroundColor: 'rgba(100,100,100,0.15)' }]}>
              <Text style={styles.menuEmoji}>⚙️</Text>
            </View>
            <Text style={styles.menuRowLabel}>Configuración</Text>
            <Text style={styles.menuRowArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Reset Onboarding (Dev only) */}
          <TouchableOpacity style={styles.menuRow} onPress={async () => {
            const { storage } = await import('../../services/storage');
            await storage.setHasOnboarded(false);
            navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
          }}>
            <View style={[styles.menuIconCircle, { backgroundColor: 'rgba(59,130,246,0.15)' }]}>
              <Text style={styles.menuEmoji}>🔄</Text>
            </View>
            <Text style={styles.menuRowLabel}>Ver Onboarding (Test)</Text>
            <Text style={styles.menuRowArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Cerrar Sesión */}
          <TouchableOpacity style={[styles.menuRow, { borderBottomWidth: 0 }]} onPress={handleLogout}>
            <View style={[styles.menuIconCircle, { backgroundColor: 'rgba(239,68,68,0.15)' }]}>
              <Text style={styles.menuEmoji}>🚪</Text>
            </View>
            <Text style={[styles.menuRowLabel, { color: '#EF4444' }]}>Cerrar Sesión</Text>
            <Text style={styles.menuRowArrow}>›</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.headerBg,
  },
  scroll: {
    flex: 1,
    backgroundColor: C.pageBg,
  },
  scrollContent: {
    paddingBottom: 120,
  },

  // ── Header ──
  header: {
    backgroundColor: C.headerBg,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backBtn: {
    marginBottom: 10,
  },
  backArrow: {
    color: C.textWhite,
    fontSize: 22,
  },
  headerProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerName: {
    color: C.textWhite,
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
  },
  headerEmail: {
    color: C.textWhiteDim,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 1,
  },
  headerPhone: {
    color: C.textWhiteDim,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 1,
  },
  headerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerAvatarEmoji: {
    fontSize: 26,
  },
  // ── Glassy Container ──
  glassContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  trophyCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  xpSubText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelTrophy: { fontSize: 16 },
  levelLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
  },
  xpLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    opacity: 0.9,
  },
  xpTrack: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: C.orange,
    borderRadius: 5,
  },

  // ── Stats ──
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: C.darkCard,
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    gap: 4,
  },
  statRing: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statEmoji: { fontSize: 22 },
  statVal: {
    color: C.textWhite,
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
  },
  statLbl: {
    color: C.textWhiteDim,
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },

  // ── Badges ──
  badgesRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    gap: 12,
    marginBottom: 20,
  },
  badgeCard: {
    flex: 1,
    backgroundColor: C.darkCard,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    opacity: 0.5,
  },
  badgeActive: {
    opacity: 1,
    borderWidth: 1,
    borderColor: C.yellow,
  },
  badgeEmoji: { fontSize: 32, marginBottom: 8 },
  badgeName: {
    color: C.textWhite,
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  badgeDesc: {
    color: C.textWhiteDim,
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: 4,
  },

  // ── Section header ──
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    color: C.textBlack,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
  },
  sectionSub: {
    color: C.textGray,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },

  // ── Mission Card ──
  missionCard: {
    marginHorizontal: 14,
    backgroundColor: C.darkCard,
    borderRadius: 16,
    overflow: 'hidden',
  },
  missionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 13,
    paddingHorizontal: 14,
    gap: 12,
  },
  missionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#272727',
  },
  missionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  missionEmoji: { fontSize: 18 },
  missionBody: { flex: 1 },
  missionTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 5,
  },
  missionTitle: {
    color: C.textWhite,
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    flex: 1,
    lineHeight: 18,
  },
  missionTitleDone: {
    color: '#666666',
  },
  greenCheck: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.green,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  greenCheckText: {
    color: C.white,
    fontSize: 14,
    fontWeight: '700',
  },
  pendingPill: {
    backgroundColor: C.pendingOrangeBg,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 7,
    flexShrink: 0,
  },
  pendingPillText: {
    color: C.pendingOrange,
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
  },
  progressTrack: {
    height: 4,
    backgroundColor: C.trackDark,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressNote: {
    color: C.textWhiteDim,
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
  },

  // ── Stores ──
  verTodasBtn: {
    backgroundColor: C.orange,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  verTodasBtnText: {
    color: C.white,
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
  },
  storeCard: {
    marginHorizontal: 14,
    backgroundColor: C.darkCard,
    borderRadius: 16,
    overflow: 'hidden',
    paddingHorizontal: 14,
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    gap: 10,
  },
  storeHeart: { fontSize: 18, flexShrink: 0 },
  storeInfo: { flex: 1 },
  storeName: {
    color: C.textWhite,
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    marginBottom: 3,
  },
  storeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  storeStat: {
    color: C.textWhiteDim,
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
  },
  positiveChip: {
    backgroundColor: C.greenTint,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  positiveChipText: {
    color: C.green,
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
  },
  storeArrow: {
    color: C.textWhiteDim,
    fontSize: 20,
    flexShrink: 0,
  },
  storeDivider: {
    height: 1,
    backgroundColor: '#272727',
  },

  // ── Menu ──
  menuCard: {
    marginHorizontal: 14,
    marginTop: 16,
    backgroundColor: C.darkCard,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 14,
    gap: 12,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#272727',
    marginLeft: 60,
  },
  menuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  menuEmoji: { fontSize: 18 },
  menuRowLabel: {
    color: C.textWhite,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    flex: 1,
  },
  menuRowArrow: {
    color: C.textWhiteDim,
    fontSize: 20,
  },
});

export default ProfileScreen;
