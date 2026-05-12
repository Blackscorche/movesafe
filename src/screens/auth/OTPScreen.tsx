import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from "../../utils/theme";
import { OTPInput } from "../../components/common/OTPInput";
import { authApi } from "../../api/auth";

export const OTPScreen = ({ navigation, route }: any) => {
  const { identifier, type } = route.params;
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(58);

  const sendOtp = useCallback(async () => {
    try {
      await authApi.sendOtp(identifier);
      setCountdown(58);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.detail ?? 'No se pudo enviar el código');
    }
  }, [identifier]);

  useEffect(() => {
    sendOtp();
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleCodeFilled = async (code: string) => {
    setLoading(true);
    try {
      await authApi.verifyOtp(identifier, code);
      setIsConfirmed(true);
    } catch (e: any) {
      Alert.alert('Código incorrecto', e?.response?.data?.detail ?? 'Inténtalo de nuevo');
    } finally {
      setLoading(false);
    }
  };

  const goToWelcome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "HealthPermission" }],
      }),
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* ── TOP LIGHT SECTION ── */}
      <View style={styles.topSection}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Verificación</Text>
        <Text style={styles.subtitle}>
          Ingresa el código enviado a{" "}
          <Text style={styles.identifier}>{identifier}</Text>
        </Text>
      </View>

      {/* ── DARK CARD ── */}
      <View style={styles.bottomCard}>
        <View style={styles.accentTopLine} />
        <View style={styles.accentArc} />
        {isConfirmed ? (
          <View style={styles.successContainer}>
            <View style={styles.successIconCircle}>
              <MaterialCommunityIcons name="email-check" size={48} color="#fff" />
            </View>
            <Text style={styles.successText}>Correo verificado!</Text>
            <TouchableOpacity style={styles.continueBtn} onPress={goToWelcome}>
              <Text style={styles.continueBtnText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.iconCircle}>
              <Image source={require('../../assets/images/verify-phone.png')} style={styles.iconPhone} resizeMode="contain" />
              <View style={styles.iconBadge}>
                <Text style={styles.iconBadgeText}>{isConfirmed ? "✓" : "✓"}</Text>
              </View>
            </View>
            <OTPInput onCodeFilled={handleCodeFilled} dark />
            <Text style={styles.resend}>
              Reenviar código en <Text style={styles.resendTimer}>{countdown}s</Text>
            </Text>
            <Text style={styles.changeNumber}>
              ¿No recibiste el código? <Text style={styles.changeLink}>Cambiar número</Text>
            </Text>
          </>
        )}

        {/* CHANGE */}
        <Text style={styles.changeNumber}>
          ¿No recibiste el código?{" "}
          <Text style={styles.changeLink}>Cambiar número</Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8E8E8",
  },

  /* ── TOP ── */
  topSection: {
    backgroundColor: "#E8E8E8",
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
  },
  backIcon: {
    color: "#1A1A1A",
    fontSize: 20,
  },
  backText: {
    color: "#1A1A1A",
    fontSize: 15,
    fontFamily: "Poppins-Medium",
  },
  title: {
    color: "#1A1A1A",
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    marginBottom: 6,
  },
  subtitle: {
    color: "#666666",
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    lineHeight: 22,
  },
  identifier: {
    color: colors.primary,
    fontFamily: "Poppins-SemiBold",
  },

  /* ── DARK CARD ── */
  bottomCard: {
    flex: 1,
    backgroundColor: "#000000",
    borderTopLeftRadius: 0, // flat left
    borderTopRightRadius: 100, // big curve RIGHT only — matches design
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 32,
    paddingBottom: 40,
    position: "relative",
    overflow: "hidden",
  },

  /* Orange arc stroke — top-right corner of card */
  accentArc: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 100,
    height: 100,
    borderTopRightRadius: 100,
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderColor: colors.primary,
  },
  accentTopLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: colors.primary,
  },
  accentRightLine: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 5,
    backgroundColor: colors.primary,
  },

  // Change these two values:

  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -40,        // was -130, now just slightly above center
    marginBottom: 52,
    position: 'relative',
    zIndex: 10,
  },

  // And the card:
  bottomCard: {
    flex: 1,
    backgroundColor: '#000000',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 100,
    alignItems: 'center',
    paddingTop: 0,         // remove paddingTop, let marginTop on icon control spacing
    paddingHorizontal: 32,
    paddingBottom: 40,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',   // centers everything vertically in the card
  },
  iconPhone: {
    width: 76,
    height: 76,
    tintColor: '#FFFFFF',
  },
  iconBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    borderWidth: 2.5,
    borderColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBadgeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Poppins-Bold",
  },

  resend: {
    color: "#666666",
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    marginTop: 32,
  },
  resendTimer: {
    color: colors.primary,
    fontFamily: "Poppins-SemiBold",
  },
  changeNumber: {
    color: "#666666",
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    marginTop: 10,
  },
  changeLink: {
    color: colors.primary,
    fontFamily: "Poppins-SemiBold",
  },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 },
  successIconCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  successText: { color: '#FFFFFF', fontSize: 22, fontFamily: 'Poppins-Bold', marginBottom: 24 },
  continueBtn: { backgroundColor: colors.primary, paddingHorizontal: 48, paddingVertical: 14, borderRadius: 100, marginTop: 8 },
  continueBtnText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Poppins-SemiBold' },
});
