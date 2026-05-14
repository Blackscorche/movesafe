import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { colors } from '../../utils/theme';
import { AppButton } from '../../components/common/AppButton';
import { useDispatch } from 'react-redux';
import { setPendingRating } from '../../store/slices/guacoinsSlice';
import { redemptionsApi } from '../../api/redemptions';

export const RedeemSuccessScreen = ({ navigation, route }: any) => {
  const { couponId, storeName, gcSpent, redemptionId } = route.params;
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [rated, setRated] = useState(false);

  useEffect(() => {
    // Save to pending on entry, so if they leave without rating, it's tracked
    if (redemptionId) {
      dispatch(setPendingRating({ redemptionId, storeName }));
    }
  }, [redemptionId, storeName, dispatch]);

  const handleRate = async (value: number) => {
    setRating(value);
  };

  const submitRating = async () => {
    if (rating === 0) {
      Alert.alert('Por favor', 'Selecciona una puntuación antes de enviar.');
      return;
    }

    setSubmitting(true);
    try {
      await redemptionsApi.rate(redemptionId, rating);
      dispatch(setPendingRating(null)); // Clear pending
      setRated(true);
      Alert.alert('¡Gracias!', 'Tu opinión nos ayuda a mejorar.');
    } catch (e) {
      Alert.alert('Error', 'No se pudo enviar la calificación.');
    } finally {
      setSubmitting(false);
    }
  };

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

      {!rated ? (
        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>¿Cómo fue tu experiencia?</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handleRate(star)}>
                <Text style={[styles.star, rating >= star && styles.starActive]}>
                  {rating >= star ? '★' : '☆'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <AppButton
            title={submitting ? "Enviando..." : "Calificar experiencia"}
            onPress={submitRating}
            variant="primary"
            disabled={submitting}
            style={styles.rateButton}
          />
        </View>
      ) : (
        <View style={styles.ratedSection}>
          <Text style={styles.ratedText}>✅ Experiencia calificada</Text>
        </View>
      )}

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
    paddingTop: 60,
    paddingBottom: 80,
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
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: colors.surface1,
    borderRadius: 16,
    padding: 16,
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
    padding: 16,
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
  ratingSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 12,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  star: {
    fontSize: 32,
    color: '#444',
  },
  starActive: {
    color: colors.primary,
  },
  rateButton: {
    width: '100%',
  },
  ratedSection: {
    marginBottom: 24,
    paddingVertical: 12,
  },
  ratedText: {
    color: colors.success,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});
