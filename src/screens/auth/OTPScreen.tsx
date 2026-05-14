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
  ActivityIndicator,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from "../../utils/theme";
import { OTPInput } from "../../components/common/OTPInput";
import { useAuthContext } from "../../context/AuthContext";

export const OTPScreen = ({ navigation, route }: any) => {
  const { identifier, type } = route.params;
  const { loginWithOtp, loginWithEmailOtp, sendOtp: sendPhoneOtp, sendEmailOtp } = useAuthContext();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(58);
  const [otpValue, setOtpValue] = useState<string | undefined>(undefined);

  const requestNewCode = useCallback(async () => {
    try {
      if (type === 'phone') {
        await sendPhoneOtp(identifier);
      } else {
        await sendEmailOtp(identifier);
      }
      setCountdown(58);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.detail ?? 'No se pudo enviar el código');
    }
  }, [identifier, type, sendPhoneOtp, sendEmailOtp]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleCodeFilled = async (code: string) => {
    setLoading(true);
    setOtpValue(code);
    let res;
    if (type === 'phone') {
      res = await loginWithOtp(identifier, code);
    } else {
      res = await loginWithEmailOtp(identifier, code);
    }

    setLoading(false);
    if (res.ok) {
      setIsNewUser(!!res.isNewUser);
      setIsConfirmed(true);
    } else {
      setOtpValue(""); // Reset input
      setTimeout(() => setOtpValue(undefined), 50); 
      Alert.alert('Inténtalo de nuevo', res.error || 'Código incorrecto');
    }
  };

  const goToNext = () => {
    if (isNewUser) {
      navigation.replace('HealthPermission');
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Main" }],
        }),
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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

      <View style={styles.bottomCard}>
        <View style={styles.accentTopLine} />
        <View style={styles.accentArc} />
        
        {isConfirmed ? (
          <View style={styles.successContainer}>
            <View style={styles.successIconCircle}>
              <MaterialCommunityIcons 
                name={type === 'email' ? "email-check" : "shield-check"} 
                size={48} 
                color="#fff" 
              />
            </View>
            <Text style={styles.successText}>
              {type === 'email' ? '¡Correo verificado!' : '¡Teléfono verificado!'}
            </Text>
            <TouchableOpacity style={styles.continueBtn} onPress={goToNext}>
              <Text style={styles.continueBtnText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ width: '100%', alignItems: 'center' }}>
            <View style={styles.iconCircle}>
              {type === 'email' ? (
                <MaterialCommunityIcons name="email-fast-outline" size={60} color="#fff" />
              ) : (
                <Image 
                  source={require('../../assets/images/verify-phone.png')} 
                  style={styles.iconPhone} 
                  resizeMode="contain" 
                />
              )}
              <View style={styles.iconBadge}>
                <Text style={styles.iconBadgeText}>✓</Text>
              </View>
            </View>
            
            {loading ? (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginBottom: 20 }} />
            ) : (
              <OTPInput value={otpValue} onCodeFilled={handleCodeFilled} dark />
            )}
            
            <TouchableOpacity disabled={countdown > 0} onPress={requestNewCode}>
              <Text style={styles.resend}>
                Reenviar código {countdown > 0 ? `en ${countdown}s` : ""}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.changeNumber}>
          ¿No recibiste el código?{" "}
          <Text style={styles.changeLink} onPress={() => navigation.goBack()}>
            Cambiar {type === 'email' ? 'correo' : 'número'}
          </Text>
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
  bottomCard: {
    flex: 1,
    backgroundColor: "#000000",
    borderTopRightRadius: 100,
    alignItems: "center",
    paddingHorizontal: 32,
    paddingBottom: 40,
    position: "relative",
    overflow: "hidden",
    justifyContent: 'center',
  },
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
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -40,
    marginBottom: 52,
    position: 'relative',
    zIndex: 10,
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
  successContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingBottom: 60 
  },
  successIconCircle: { 
    width: 96, 
    height: 96, 
    borderRadius: 48, 
    backgroundColor: colors.primary, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 24 
  },
  successText: { 
    color: '#FFFFFF', 
    fontSize: 22, 
    fontFamily: 'Poppins-Bold', 
    marginBottom: 24 
  },
  continueBtn: { 
    backgroundColor: colors.primary, 
    paddingHorizontal: 48, 
    paddingVertical: 14, 
    borderRadius: 100, 
    marginTop: 8 
  },
  continueBtnText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontFamily: 'Poppins-SemiBold' 
  },
});
