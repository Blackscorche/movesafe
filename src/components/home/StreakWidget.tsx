import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../utils/theme';

interface StreakWidgetProps {
  currentStreak: number;
  nextMilestone: number;
  bonusGC: number;
  hasBonus: boolean;
}

export const StreakWidget: React.FC<StreakWidgetProps> = ({
  currentStreak,
  nextMilestone,
  bonusGC,
  hasBonus,
}) => {
  const progress = Math.min((currentStreak / nextMilestone) * 100, 100);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>🔥 Racha actual</Text>
        {hasBonus && (
          <View style={styles.bonusBadge}>
            <Text style={styles.bonusText}>⭐ +{bonusGC} bonus (10k+ pasos)</Text>
          </View>
        )}
      </View>
      <Text style={styles.streakValue}>{currentStreak} días</Text>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.milestoneText}>
          Próximo hito: {nextMilestone} días
        </Text>
        <Text style={styles.rewardText}>+{bonusGC} GC</Text>
      </View>
    </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  bonusBadge: {
    backgroundColor: colors.primaryTint10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  bonusText: {
    color: colors.primary,
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
  },
  streakValue: {
    color: colors.textPrimary,
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.surface3,
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  milestoneText: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  rewardText: {
    color: colors.primary,
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
});
