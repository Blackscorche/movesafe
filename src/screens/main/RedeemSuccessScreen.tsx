import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../utils/theme';
import { AppButton } from '../../components/common/AppButton';

export const RedeemSuccessScreen = ({ navigation, route }: any) => {
  const { storeName, gcSpent, discount } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.checkCircle}>
        <Text style={styles.checkmark}>✓</Text>
      </View>

      <Text style={styles.title}>¡Canje exitoso!</Text>
      <Text style={styles.savedLabel}>Ahorraste en</Text>
      <Text style={styles.storeName}>{storeName}</Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>GC canjeados</Text>
        <Text style={styles.infoValue}>-{gcSpent}</Text>
        <View style={styles.gcContainer}>
          <Text style={styles.gcText}>GC</Text>
        </View>
      </View>

      <View style={styles.bonusCard}>
        <Text style={styles.bonusEmoji}>✨</Text>
        <Text style={styles.bonusTitle}>¡Ganaste +5 XP!</Text>
        <Text style={styles.bonusSubtitle}>Sigue ahorrando para subir de nivel</Text>
      </View>

      <AppButton
        title="Calificar experiencia"
        onPress={() => {}}
        variant="primary"
        style={styles.rateButton}
      />

      <AppButton
        title="Volver al inicio"
        variant="outline"
        onPress={() => navigation.popToTop()}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 120,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  checkmark: {
    color: colors.textPrimary,
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  savedLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  storeName: {
    color: colors.textPrimary,
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 32,
  },
  infoCard: {
    backgroundColor: colors.surface1,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
  },
  infoValue: {
    color: colors.primary,
    fontSize: 42,
    fontFamily: 'Poppins-Bold',
  },
  gcContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  gcText: {
    color: colors.textPrimary,
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
  },
  bonusCard: {
    backgroundColor: colors.surface1,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.purple,
  },
  bonusEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  bonusTitle: {
    color: colors.purple,
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  bonusSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
  },
  rateButton: {
    width: '100%',
    marginBottom: 12,
  },
});
