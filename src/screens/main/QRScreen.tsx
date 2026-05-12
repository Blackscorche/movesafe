import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../utils/theme';
import { AppButton } from '../../components/common/AppButton';
import QRCode from 'react-native-qrcode-svg';
import { QR_REFRESH_INTERVAL_SECONDS } from '../../utils/constants';
import { qrApi } from '../../api/qr';

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
  const [timer, setTimer] = useState(QR_REFRESH_INTERVAL_SECONDS);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loadingQr, setLoadingQr] = useState(false);

  const generateCode = useCallback(async () => {
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

  useEffect(() => {
    generateCode();
  }, []);

  useEffect(() => {
    if (timer <= 0) { generateCode(); return; }
    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const qrValue = qrCode ? `movesave://redeem/${qrCode}` : 'loading';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <SafeAreaView style={styles.safe}>

        {/* ── Top bar: close (left) + timer (right) ── */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
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
        <Text style={styles.title}>Muestra al comercio</Text>
        <Text style={styles.subtitle}>
          Escanea el código QR para completar tu canje
        </Text>

        {/* ── QR card ── */}
        <View style={styles.qrOuter}>
          <View style={styles.qrCard}>
            {loadingQr || !qrCode
              ? <ActivityIndicator size="large" color={C.primary} style={{ width: 160, height: 160 }} />
              : <QRCode value={qrValue} size={160} color="#000000" backgroundColor="#FFFFFF" />
            }
          </View>
        </View>

        {/* ── Coupon detail card ── */}
        <View style={styles.detailCard}>
          {/* Row 1 – discount + cost */}
          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Text style={styles.detailLabel}>Cupón seleccionado</Text>
              <Text style={styles.detailDiscount}>Descuento 15%</Text>
            </View>
            <View style={styles.detailRight}>
              <Text style={styles.detailLabel}>Costo</Text>
              <Text style={styles.detailCost}>50 GC</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Row 2 – store */}
          <View style={styles.storeRow}>
            <Text style={styles.detailLabel}>Comercio</Text>
            <Text style={styles.detailStore}>Farmacia Salud Plus</Text>
          </View>
        </View>

        {/* ── CTA button ── */}
        <AppButton
          title="Simular escaneo (Demo)"
          onPress={() =>
            navigation.navigate('RedeemSuccess', {
              couponId: '1',
              storeName: 'Farmacia Salud Plus',
              gcSpent: 50,
              discount: 15,
            })
          }
          variant="primary"
          style={styles.simulateButton}
        />

        {/* ── Security note ── */}
        <Text style={styles.securityNote}>
          El código se regenera automáticamente cada 30 segundos por seguridad
        </Text>

      </SafeAreaView>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

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

  // ── Top bar ────────────────────────────────────────────────────────────────
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

  // ── Heading ────────────────────────────────────────────────────────────────
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

  // ── QR ─────────────────────────────────────────────────────────────────────
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
  },

  // ── Detail card ────────────────────────────────────────────────────────────
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
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  detailStore: {
    color: C.textPrimary,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 2,
  },

  // ── Button ─────────────────────────────────────────────────────────────────
  simulateButton: {
    width: '100%',
    marginBottom: 10,
  },

  // ── Security note ──────────────────────────────────────────────────────────
  securityNote: {
    color: C.textMuted,
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 15,
    paddingHorizontal: 8,
  },
});
