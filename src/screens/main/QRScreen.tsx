import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { colors } from '../../utils/theme';
import { AppButton } from '../../components/common/AppButton';
import QRCode from 'react-native-qrcode-svg';
import { QR_REFRESH_INTERVAL_SECONDS } from '../../utils/constants';
import { qrApi } from '../../api/qr';
import { redemptionsApi } from '../../api/redemptions';
import { setPendingRating } from '../../store/slices/guacoinsSlice';
import * as ScreenCapture from 'expo-screen-capture';
import { notifyRedemptionConfirmed } from '../../services/notifications';
import { useHealthContext } from '../../context/HealthContext';
import * as SecureStore from 'expo-secure-store';
import * as OTPAuth from 'otpauth';

// ─── Colour tokens (dark screen) ─────────────────────────────────────────────
const C = {
  bg: '#111111',   // full-screen dark background
  surface: '#1C1C1C',   // detail card + close btn bg
  surfaceAlt: '#242424',   // second info row bg
  primary: '#E85D26',   // orange accent
  timerBg: '#1C1C1C',   // pill background
  timerBorder: '#2C2C2C',   // pill border
  textPrimary: '#FFFFFF',
  textSecondary: '#888888',
  textMuted: '#555555',
  qrBg: '#FFFFFF',
  qrCircle: 'rgba(62,207,110,0.18)', // faint green ring behind QR
};

export const QRScreen = ({ navigation, route }: any) => {
  ScreenCapture.usePreventScreenCapture();
  const { coupon } = route.params;
  const dispatch = useDispatch();
  const { pendingRating } = useSelector((state: any) => state.guacoins);
  const { isOffline } = useHealthContext();

  const [timer, setTimer] = useState(QR_REFRESH_INTERVAL_SECONDS);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState<string | null>(null);
  const [loadingQr, setLoadingQr] = useState(false);
  const [redemptionId, setRedemptionId] = useState<string | null>(null);
  const [overallTimeout, setOverallTimeout] = useState(120);

  // Rating state for deferred mandatory block
  const [localRating, setLocalRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);

  const generateOfflineCode = useCallback(async () => {
    const secret = await SecureStore.getItemAsync('local_totp_secret');
    if (secret) {
      const totp = new OTPAuth.TOTP({ secret: OTPAuth.Secret.fromBase32(secret) });
      setTotpCode(totp.generate());
      setTimer(30);
    }
  }, []);

  const generateCode = useCallback(async () => {
    if (isOffline) {
      generateOfflineCode();
      return;
    }
    setLoadingQr(true);
    try {
      const res = await qrApi.generate();
      setQrCode(res.data.code);
      setTimer(res.data.expires_in ?? QR_REFRESH_INTERVAL_SECONDS);
    } catch {
      setQrCode(null);
    } finally {
      setLoadingQr(false);
    }
  }, []);

  const initializeRedemption = useCallback(async () => {
    if (pendingRating) return;
    try {
      const res = await redemptionsApi.reserve(coupon.id);
      setRedemptionId(res.data.id);
      generateCode();
    } catch (e) {
      Alert.alert('Error', 'No se pudo iniciar el canje. Inténtalo de nuevo.');
      navigation.goBack();
    }
  }, [coupon.id, pendingRating, generateCode, navigation]);

  useEffect(() => {
    initializeRedemption();
  }, [initializeRedemption]);

  // Poll for status
  useEffect(() => {
    if (!redemptionId) return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await redemptionsApi.getStatus(redemptionId);
        if (res.data.status === 'confirmed') {
          clearInterval(pollInterval);
          notifyRedemptionConfirmed(coupon.storeName, coupon.cost);
          navigation.navigate('RedeemSuccess', {
            couponId: coupon.id,
            storeName: coupon.storeName,
            gcSpent: coupon.cost,
            discount: coupon.discount,
            redemptionId: redemptionId,
          });
        } else if (res.data.status === 'cancelled' || res.data.status === 'expired') {
          clearInterval(pollInterval);
          Alert.alert('Canje cancelado', 'El canje ha expirado o fue cancelado.');
          navigation.goBack();
        }
      } catch (e) {
        // Silent poll error
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [redemptionId, coupon, navigation]);

  useEffect(() => {
    if (timer <= 0) { generateCode(); return; }
    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, generateCode]);

  useEffect(() => {
    if (overallTimeout <= 0) {
      if (redemptionId) redemptionsApi.cancel(redemptionId).catch(() => {});
      navigation.goBack();
      return;
    }
    const interval = setInterval(() => {
      setOverallTimeout(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [overallTimeout, redemptionId, navigation]);

  const handleCancel = async () => {
    if (redemptionId) {
      try { await redemptionsApi.cancel(redemptionId); } catch {}
    }
    navigation.goBack();
  };

  const submitDeferredRating = async () => {
    if (localRating === 0) {
      Alert.alert('Por favor', 'Selecciona una puntuación.');
      return;
    }
    setSubmittingRating(true);
    try {
      await redemptionsApi.rate(pendingRating.redemptionId, localRating);
      dispatch(setPendingRating(null));
    } catch (e) {
      Alert.alert('Error', 'No se pudo enviar la calificación.');
    } finally {
      setSubmittingRating(false);
    }
  };

  if (pendingRating) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={C.bg} />
        <SafeAreaView style={styles.safe}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.mandatoryCard}>
            <Text style={styles.mandatoryEmoji}>⭐</Text>
            <Text style={styles.mandatoryTitle}>Calificación pendiente</Text>
            <Text style={styles.mandatorySubtitle}>
              Para continuar, califica tu última experiencia en:
              {'\n'}<Text style={{ color: C.primary, fontFamily: 'Poppins-Bold' }}>{pendingRating.storeName}</Text>
            </Text>

            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setLocalRating(star)}>
                  <Text style={[styles.star, localRating >= star && styles.starActive]}>
                    {localRating >= star ? '★' : '☆'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <AppButton
              title={submittingRating ? "Enviando..." : "Enviar y continuar"}
              onPress={submitDeferredRating}
              variant="primary"
              disabled={submittingRating}
              style={{ width: '100%' }}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const qrValue = qrCode ? `movesave://redeem/${qrCode}?r=${redemptionId}` : 'loading';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <SafeAreaView style={styles.safe}>

        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCancel}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.timerPill}>
            <Text style={styles.timerIcon}>⏱</Text>
            <Text style={styles.timerText}>{timer}s</Text>
          </View>
        </View>

        {/* ── Heading ── */}
        <Text style={styles.title}>{isOffline ? 'Canje fuera de línea' : 'Muestra al comercio'}</Text>
        <Text style={styles.subtitle}>
          {isOffline 
            ? 'Dicta este código al comercio para completar tu canje'
            : 'Escanea el código QR para completar tu canje'}
        </Text>

        {/* ── QR/TOTP card ── */}
        <View style={styles.qrOuter}>
          <View style={styles.qrCard}>
            {isOffline ? (
              <View style={styles.totpContainer}>
                <Text style={styles.totpLabel}>CÓDIGO DE SEGURIDAD</Text>
                <Text style={styles.totpValue}>{totpCode || '------'}</Text>
              </View>
            ) : (
              loadingQr || !qrCode
                ? <ActivityIndicator size="large" color={C.primary} style={{ width: 160, height: 160 }} />
                : <QRCode value={qrValue} size={160} color="#000000" backgroundColor="#FFFFFF" />
            )}
          </View>
          {isOffline && (
            <View style={styles.offlineBadge}>
              <Text style={styles.offlineBadgeText}>MODO OFFLINE</Text>
            </View>
          )}
        </View>

        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Text style={styles.detailLabel}>Cupón seleccionado</Text>
              <Text style={styles.detailDiscount}>Descuento {coupon.discount}%</Text>
            </View>
            <View style={styles.detailRight}>
              <Text style={styles.detailLabel}>Costo</Text>
              <Text style={styles.detailCost}>{coupon.cost} GC</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.storeRow}>
            <Text style={styles.detailLabel}>Comercio</Text>
            <Text style={styles.detailStore}>{coupon.storeName}</Text>
          </View>
        </View>

        <View style={styles.waitingContainer}>
          <ActivityIndicator color={C.primary} size="small" />
          <Text style={styles.waitingText}>Esperando confirmación del comercio...</Text>
        </View>

        <Text style={styles.securityNote}>
          El código se regenera automáticamente cada 30 segundos. El canje expira en {overallTimeout}s si no se completa.
        </Text>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  safe: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 4,
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 4,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: C.textPrimary,
    fontSize: 15,
    lineHeight: 18,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: C.timerBg,
    borderWidth: 1,
    borderColor: C.timerBorder,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  timerIcon: {
    fontSize: 13,
    color: C.textSecondary,
  },
  timerText: {
    color: C.textPrimary,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  title: {
    color: C.textPrimary,
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    color: C.textSecondary,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  qrOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  qrCard: {
    backgroundColor: C.qrBg,
    borderRadius: 16,
    padding: 16,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
    minWidth: 192,
    minHeight: 192,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totpContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  totpLabel: {
    color: '#000',
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  totpValue: {
    color: colors.primary,
    fontSize: 48,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 4,
  },
  offlineBadge: {
    backgroundColor: colors.danger,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: -10,
    zIndex: 10,
  },
  offlineBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
  },
  detailCard: {
    width: '100%',
    backgroundColor: C.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  detailLeft: {
    flex: 1,
  },
  detailRight: {
    alignItems: 'flex-end',
  },
  detailLabel: {
    color: C.textSecondary,
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    marginBottom: 2,
  },
  detailDiscount: {
    color: C.textPrimary,
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  detailCost: {
    color: C.primary,
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2A2A',
    marginBottom: 8,
  },
  storeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailStore: {
    color: C.textPrimary,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 2,
  },
  waitingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: C.surfaceAlt,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    width: '100%',
    marginBottom: 16,
  },
  waitingText: {
    color: C.textSecondary,
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  securityNote: {
    color: C.textMuted,
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 15,
    paddingHorizontal: 8,
  },
  mandatoryCard: {
    backgroundColor: C.surface,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    marginTop: 40,
  },
  mandatoryEmoji: { fontSize: 40, marginBottom: 16 },
  mandatoryTitle: {
    color: C.textPrimary,
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  mandatorySubtitle: {
    color: C.textSecondary,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 32,
  },
  star: { fontSize: 36, color: '#333' },
  starActive: { color: C.primary },
});
