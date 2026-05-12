import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../utils/theme';
import { CircularProgress } from '../common/CircularProgress';
import { StatCard } from '../common/StatCard';
import { useNavigation } from '@react-navigation/native';
import { formatDistance, formatCalories, formatMinutes, formatNumber } from '../../utils/formatters';

interface StepsWidgetProps {
  steps: number;
  goal: number;
  percentage: number;
  distance: number;
  calories: number;
  minutes: number;
  isToday?: boolean;
}

export const StepsWidget: React.FC<StepsWidgetProps> = ({
  steps,
  goal,
  percentage,
  distance,
  calories,
  minutes,
  isToday = true,
}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('StepsDetail' as never)}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.tabs}>
          <View style={[styles.tab, styles.tabActive]}>
            <Text style={styles.tabTextActive}>HOY</Text>
          </View>
          <View style={styles.tab}>
            <Text style={styles.tabText}>AYER</Text>
          </View>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.stepsSection}>
          <Text style={styles.stepsLabel}>PASOS {formatNumber(steps)}</Text>
          <Text style={styles.stepsValue}>{formatNumber(steps)}</Text>
          <Text style={styles.goalLabel}>Meta: {formatNumber(goal)}</Text>
        </View>
        <CircularProgress percentage={percentage} size={100} strokeWidth={10} />
      </View>

      <View style={styles.statsRow}>
        <StatCard icon="📏" value={formatDistance(distance)} />
        <StatCard icon="🔥" value={formatCalories(calories)} />
        <StatCard icon="⏱" value={formatMinutes(minutes)} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface2,
    borderRadius: 100,
    padding: 4,
    gap: 4,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 100,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  tabTextActive: {
    color: colors.textPrimary,
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepsSection: {
    flex: 1,
  },
  stepsLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
    letterSpacing: 2,
    marginBottom: 4,
  },
  stepsValue: {
    color: colors.textPrimary,
    fontSize: 48,
    fontFamily: 'Poppins-Bold',
    lineHeight: 52,
  },
  goalLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    paddingTop: 12,
  },
});
