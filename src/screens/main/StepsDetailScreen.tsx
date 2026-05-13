import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Image,
} from 'react-native';
import { useSteps } from '../../hooks/useSteps';
import { formatNumber } from '../../utils/formatters';
import { useNavigation } from '@react-navigation/native';
import { AppBar } from '../../components/common/AppBar';

// ─── Data ─────────────────────────────────────────────────────────────────────
const DETAIL_ROWS = [
  { day: 'Lun', steps: 8234,  goal: 10000, gc: 10, met: false },
  { day: 'Mar', steps: 6543,  goal: 10000, gc: 6,  met: false },
  { day: 'Mié', steps: 10234, goal: 10000, gc: 10, met: true  },
  { day: 'Jue', steps: 7842,  goal: 10000, gc: 8,  met: false },
  { day: 'Vie', steps: 9123,  goal: 10000, gc: 9,  met: false },
  { day: 'Sáb', steps: 11456, goal: 10000, gc: 15, met: true  },
  { day: 'Hoy', steps: 7842,  goal: 10000, gc: 8,  met: false, isToday: true },
];

// ─── Colour tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#EFEFEF',
  surface: '#FFFFFF',
  headerBg: '#000000',
  primary: '#E85D26',      // Orange
  success: '#2CCB70',      // Green
  barDark: '#000000',      // Incomplete
  barTrack: '#E8E8E8',     // Grey bar background
  textPrimary: '#000000',
  textSecondary: '#666666',
  textMuted: '#999999',
};

export const StepsDetailScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');
  const { weeklyHistory, refreshWeekly } = useSteps();

  useEffect(() => {
    refreshWeekly?.();
  }, []);

  const BAR_MAX_H = 110;

  // Map real history to our row format
  const realRows = weeklyHistory.map((item: any) => {
    const dateObj = new Date(item.date);
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const isToday = new Date().toDateString() === dateObj.toDateString();
    
    return {
      day: isToday ? 'Hoy' : dayNames[dateObj.getDay()],
      steps: item.steps,
      goal: item.goal,
      gc: item.gcEarned || 0,
      met: item.goalMet,
      isToday
    };
  }).reverse(); // Most recent at the end for the chart

  const displayRows = realRows.length > 0 ? realRows : [
    { day: 'Lun', steps: 0, goal: 10000, gc: 0, met: false },
    { day: 'Mar', steps: 0, goal: 10000, gc: 0, met: false },
    { day: 'Mié', steps: 0, goal: 10000, gc: 0, met: false },
    { day: 'Jue', steps: 0, goal: 10000, gc: 0, met: false },
    { day: 'Vie', steps: 0, goal: 10000, gc: 0, met: false },
    { day: 'Sáb', steps: 0, goal: 10000, gc: 0, met: false },
    { day: 'Hoy', steps: 0, goal: 10000, gc: 0, met: false, isToday: true },
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* App Bar */}
      <AppBar showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Scrollable Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerRow}>
            <View style={styles.headerTextGroup}>
              <Text style={styles.headerTitle}>Detalle de pasos</Text>
              <Text style={styles.headerSub}>Historial y estadísticas</Text>

              <View style={styles.tabs}>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'daily' && styles.tabActive]}
                  onPress={() => setActiveTab('daily')}
                >
                  <Text style={[styles.tabText, activeTab === 'daily' && styles.tabTextActive]}>Diario</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'weekly' && styles.tabActive]}
                  onPress={() => setActiveTab('weekly')}
                >
                  <Text style={[styles.tabText, activeTab === 'weekly' && styles.tabTextActive]}>Semanal</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Image
              source={require('../../assets/images/store-placeholder.png')}
              style={styles.parrotImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Content Area */}
        <View style={styles.mainContainer}>

          {/* Bar Chart Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Esta semana</Text>
              <TouchableOpacity style={styles.periodPicker}>
                <Text style={styles.calendarIcon}>📅</Text>
                <Text style={styles.periodText}>Cambiar período</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.chartArea}>
              {displayRows.map((row, idx) => {
                const barH = (row.steps / 12000) * BAR_MAX_H;
                const barColor = row.isToday ? C.primary : (row.met ? C.success : C.barDark);

                return (
                  <View key={idx} style={styles.barColumn}>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { height: barH, backgroundColor: barColor }]} />
                    </View>
                    <Text style={[styles.barLabel, row.isToday && styles.barLabelToday]}>
                      {row.day}
                    </Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: C.success }]} />
                <Text style={styles.legendText}>Meta cumplida</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: C.barDark }]} />
                <Text style={styles.legendText}>Incompleto</Text>
              </View>
            </View>
          </View>

          <Text style={styles.listSectionTitle}>Detalle diario</Text>

          {/* Daily List Card */}
          <View style={styles.listCard}>
            {[...displayRows].reverse().map((row, idx) => {
              const pct = Math.round((row.steps / row.goal) * 100);
              const isLast = idx === displayRows.length - 1;

              return (
                <View key={idx} style={[styles.listRow, isLast && { borderBottomWidth: 0 }]}>
                  <View style={[styles.iconCircle, { backgroundColor: row.met ? '#E8FBF0' : '#FFF3EE' }]}>
                    <Text style={{fontSize: 18}}>👣</Text>
                  </View>

                  <View style={styles.rowCenter}>
                    <View style={styles.rowLabels}>
                      <Text style={styles.dayName}>{row.day}</Text>
                      <Text style={styles.stepMetrics}>{formatNumber(row.steps)} / {formatNumber(row.goal)}</Text>
                    </View>
                    <View style={styles.rowProgressBarBg}>
                      <View
                        style={[styles.rowProgressBarFill, { width: `${Math.min(pct, 100)}%`, backgroundColor: row.met ? C.success : C.primary }]}
                      />
                    </View>
                  </View>

                  <View style={styles.rowEnd}>
                    <Text style={[styles.gcBonus, { color: C.success }]}>+{row.gc} GC</Text>
                    <Text style={styles.pctLabel}>{pct}%</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // Static Back Nav
  appBar: { backgroundColor: '#FFFFFF', paddingHorizontal: 16 },
  appBarRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, paddingBottom: 8 },
  backArrow: { fontSize: 24, color: '#000' },
  appBarRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bellWrap: { position: 'relative' },
  bellBadge: { position: 'absolute', top: -4, right: -6, width: 16, height: 16, borderRadius: 8, backgroundColor: '#FF3B30', alignItems: 'center', justifyContent: 'center' },
  bellBadgeText: { color: '#FFF', fontSize: 9, fontFamily: 'Poppins-Bold' },

  // Scroll Behavior
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  // Header (Inside ScrollView)
  headerSection: { backgroundColor: C.headerBg, paddingHorizontal: 20, paddingBottom: 35 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTextGroup: { flex: 1 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#FFF' },
  headerSub: { fontSize: 14, color: '#888', marginTop: 4 },

  tabs: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    borderRadius: 25,
    padding: 4,
    marginTop: 18,
    width: 190
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 20 },
  tabActive: { backgroundColor: C.primary },
  tabText: { color: '#888', fontWeight: '600', fontSize: 12 },
  tabTextActive: { color: '#FFF' },

  parrotImage: { width: 150, height: 150 },

  // Cards layout
  mainContainer: { paddingHorizontal: 16, marginTop: -15 },
  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginBottom: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  periodPicker: { flexDirection: 'row', alignItems: 'center' },
  calendarIcon: { fontSize: 14 },
  periodText: { color: C.primary, fontSize: 12, fontWeight: '600', marginLeft: 4 },

  // Chart
  chartArea: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 130, marginBottom: 15 },
  barColumn: { alignItems: 'center', width: '12%' },
  barTrack: { width: 14, height: 110, backgroundColor: C.barTrack, borderRadius: 10, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', borderRadius: 10 },
  barLabel: { marginTop: 8, fontSize: 10, color: '#999' },
  barLabelToday: { color: C.primary, fontWeight: '700' },

  legendRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F5F5F5', paddingTop: 15 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendText: { fontSize: 12, color: '#666' },

  listSectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12, paddingLeft: 4 },

  // List
  listCard: { backgroundColor: '#FFF', borderRadius: 24, overflow: 'hidden' },
  listRow: { flexDirection: 'row', padding: 16, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F8F8F8' },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  rowCenter: { flex: 1, marginHorizontal: 12 },
  rowLabels: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  dayName: { fontWeight: '700', fontSize: 14, width: 35 },
  stepMetrics: { color: '#666', fontSize: 11 },
  rowProgressBarBg: { height: 5, backgroundColor: '#F0F0F0', borderRadius: 3 },
  rowProgressBarFill: { height: '100%', borderRadius: 3 },
  rowEnd: { alignItems: 'flex-end', minWidth: 50 },
  gcBonus: { fontWeight: 'bold', fontSize: 14 },
  pctLabel: { color: '#999', fontSize: 11, marginTop: 2 }
});
