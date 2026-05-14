import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import * as AppleAuthentication from 'expo-apple-authentication';

// Internal Project Imports
import { colors } from "../../utils/theme";
import { AppButton } from "../../components/common/AppButton";
import { AppInput } from "../../components/common/AppInput";
import { authApi } from "../../api/auth";
import { useAuthContext } from "../../context/AuthContext";

WebBrowser.maybeCompleteAuthSession();

const PLATFORM = Platform.OS === 'ios' ? 'IOS' : 'ANDROID';
const DEVICE_ID = Constants.sessionId ?? 'unknown-device';

export const LoginScreen = ({ navigation }: any) => {
  const {
    signIn,
    signInWithGoogle,
    sendOtp,
    sendEmailOtp
  } = useAuthContext();

  const [tab, setTab] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode] = useState("+58");
  const [cooldownRemaining, setCooldownRemaining] = useState<number | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const handleContinue = async () => {
    if (cooldownRemaining) {
      Alert.alert('Espera un poco', `Debes esperar ${Math.ceil(cooldownRemaining / 3600)} horas.`);
      return;
    }

    if (tab === 'phone') {
      if (phone.length < 10) {
        Alert.alert('Error', 'Por favor ingresa un número de teléfono válido');
        return;
      }
      setLoading('otp');
      const fullPhone = `${countryCode}${phone.replace(/\s/g, '')}`;
      const res = await sendOtp(fullPhone);
      setLoading(null);
      if (res.ok) {
        navigation.navigate('OTP', { type: 'phone', identifier: fullPhone });
      } else {
        Alert.alert('Inténtalo de nuevo', res.error || 'No se pudo enviar el código');
      }
    } else {
      if (!email.includes('@')) {
        Alert.alert('Error', 'Por favor ingresa un correo válido');
        return;
      }
      setLoading('otp');
      const res = await sendEmailOtp(email);
      setLoading(null);
      if (res.ok) {
        navigation.navigate('OTP', { type: 'email', identifier: email });
      } else {
        Alert.alert('Inténtalo de nuevo', res.error || 'No se pudo enviar el código');
      }
    }
  };

  const handleAppleLogin = async () => {
    setLoading('apple');
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (credential.identityToken) {
        // Social login logic would go here as per your original file
        Alert.alert("Success", "Apple ID Linked");
      }
    } catch (e: any) {
      if (e.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('Error', e.message ?? 'Apple sign-in failed');
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>

        {/* ── TOP SECTION ── */}
        <View style={styles.topSection}>
          <Image
            source={require("../../assets/images/maya-welcome.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* ── ACCENT WRAPPER (The border line) ── */}
        <View style={styles.accentWrapper}>
          <View style={styles.bottomCard}>
            <Text style={styles.welcome}>¡Bienvenido!</Text>
            <Text style={styles.subtitle}>Ingresa para comenzar a ganar</Text>

            {/* TABS */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, tab === "phone" && styles.tabActive]}
                onPress={() => setTab("phone")}
              >
                <Text style={[styles.tabText, tab === "phone" && styles.tabTextActive]}>
                  📞 Teléfono
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, tab === "email" && styles.tabActive]}
                onPress={() => setTab("email")}
              >
                <Text style={[styles.tabText, tab === "email" && styles.tabTextActive]}>
                  ✉️ Email
                </Text>
              </TouchableOpacity>
            </View>

            {/* INPUT FIELD */}
            <Text style={styles.inputLabel}>
              {tab === "phone" ? "Número de teléfono" : "Correo electrónico"}
            </Text>

            {tab === 'phone' ? (
              <View style={styles.phoneRow}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>{countryCode}</Text>
                </View>
                <View style={styles.phoneInput}>
                  <AppInput
                    placeholder="412 345 6789"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    placeholderTextColor="#666"
                    wrapperStyle={styles.darkInputBg}
                    inputStyle={styles.darkInputText}
                  />
                </View>
              </View>
            ) : (
              <AppInput
                placeholder="movesave@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#666"
                wrapperStyle={styles.darkInputBg}
                inputStyle={styles.darkInputText}
              />
            )}

            {/* CONTINUE BUTTON */}
            <AppButton
              title="Continuar"
              onPress={handleContinue}
              loading={loading === 'otp'}
            />

            {/* DIVIDER */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o continúa con</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* SSO BUTTONS */}
            <View style={styles.ssoRow}>
              <TouchableOpacity
                style={styles.ssoBtn}
                onPress={async () => {
                  setLoading('google');
                  const res = await signInWithGoogle();
                  setLoading(null);
                  if (res.ok) navigation.navigate('Main');
                }}
                activeOpacity={0.8}
                disabled={!!loading}
              >
                {loading === 'google' ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <MaterialCommunityIcons name="google" size={20} color="#000" />
                )}
                <Text style={styles.ssoText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.ssoBtn}
                onPress={handleAppleLogin}
                activeOpacity={0.8}
                disabled={!!loading}
              >
                {loading === 'apple' ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <MaterialCommunityIcons name="apple" size={22} color="#000" />
                )}
                <Text style={styles.ssoText}>Apple</Text>
              </TouchableOpacity>
            </View>

            {/* TERMS */}
            <Text style={styles.terms}>
              Al continuar, aceptas nuestros{" "}
              <Text style={styles.termsLink}>Términos de Servicio</Text> y{" "}
              <Text style={styles.termsLink}>Política de Privacidad</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
  },

  /* ── TOP SECTION ── */
  topSection: {
    height: 300,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  logo: {
    width: 220,
    height: 140,
  },

  /* ── ACCENT LOGIC ── */
  accentWrapper: {
    flex: 1,
    backgroundColor: colors.primary, // The primary accent color (e.g., Orange)
    borderTopLeftRadius: 154,        // Larger radius for the outer shell
    paddingTop: 6,                   // Vertical thickness of the line
    paddingLeft: 6,                  // Horizontal thickness of the line
  },
  bottomCard: {
    flex: 1,
    backgroundColor: "#111111",      // Main background color of the card
    borderTopLeftRadius: 148,        // Inner radius
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },

  welcome: {
    color: "#FFFFFF",
    fontSize: 32,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    color: "#888888",
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginBottom: 28,
  },

  /* ── TABS ── */
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#2C2C2C",
    borderRadius: 100,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 100,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    color: "#777777",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  tabTextActive: {
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
  },

  /* ── INPUTS ── */
  inputLabel: {
    color: "#AAAAAA",
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    marginBottom: 8,
    marginLeft: 2,
  },
  phoneRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },
  countryCode: {
    backgroundColor: "#2C2C2C",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  countryCodeText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  phoneInput: {
    flex: 1,
  },
  darkInputBg: {
    backgroundColor: '#2C2C2C',
    borderColor: '#3A3A3A',
    height: 52,
  },
  darkInputText: {
    color: '#FFFFFF',
  },

  /* ── DIVIDER ── */
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#333333",
  },
  dividerText: {
    color: "#666666",
    fontSize: 13,
    fontFamily: "Poppins-Regular",
  },

  /* ── SSO ── */
  ssoRow: {
    flexDirection: "row",
    gap: 12,
  },
  ssoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
  },
  ssoText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#000',
  },

  /* ── TERMS ── */
  terms: {
    color: "#555555",
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginTop: 20,
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary,
    fontFamily: "Poppins-Medium",
  },
});