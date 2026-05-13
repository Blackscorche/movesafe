import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { colors } from '../../utils/theme';
import { useHealthContext } from '../../context/HealthContext';

export const HealthPermissionScreen = ({ navigation }: any) => {
  const { requestPermission } = useHealthContext();

  const allowPermission = async () => {
    try {
      await requestPermission();
    } catch (e) {
      console.log("Permission error:", e);
    }
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'WelcomeBadge' }] })
    );
  };

  const skip = () => {
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'WelcomeBadge' }] })
    );
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── TOP SECTION ── */}
        <View style={styles.topSection}>
          <View style={[styles.decoCircle, { width: 200, height: 200, top: -80, right: -60 }]} />
          <View style={[styles.decoCircle, { width: 140, height: 140, bottom: 20, left: -40 }]} />
          <Text style={styles.title}>Conecta tu salud</Text>
          <Text style={styles.subtitle}>
            Necesitamos acceso a tus datos de actividad para recompensarte por tus pasos diarios
          </Text>
        </View>

        {/* ── BOTTOM CARD ──
            borderTopWidth IS the accent — it curves with borderRadius automatically.
            No child accent bar needed at all. */}
        <View style={styles.bottomCard}>

          {/* Icon centered using alignSelf */}
          <View style={styles.overlapCircle}>
            <MaterialCommunityIcons name="heart-pulse" size={36} color="#fff" />
          </View>

          <View style={{ height: 50 }} />

          <View style={styles.card}>
            <View style={[styles.cardIcon, { backgroundColor: 'rgba(46,204,113,0.15)' }]}>
              <MaterialCommunityIcons name="chart-line" size={22} color="#2ECC71" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Gana automaticamente</Text>
              <Text style={styles.cardDesc}>Recibe GuaCoins cada dia por cumplir tu meta de pasos.</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={[styles.cardIcon, { backgroundColor: colors.primaryTint10 }]}>
              <MaterialCommunityIcons name="cellphone" size={22} color={colors.primary} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Compatible con tu app</Text>
              <Text style={styles.cardDesc}>Funciona con Apple Health, Google Fit y Samsung Health.</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={[styles.cardIcon, { backgroundColor: 'rgba(123,94,167,0.15)' }]}>
              <MaterialCommunityIcons name="shield-check" size={22} color="#7B5EA7" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Privacidad protegida</Text>
              <Text style={styles.cardDesc}>Solo leemos tu contador de pasos. Nada mas.</Text>
            </View>
          </View>

          <View style={styles.noteBox}>
            <Text style={styles.noteText}>
              <Text style={styles.noteBold}>Nota: </Text>
              Si no otorgas permisos ahora, podras usar la app pero no ganaras GuaCoins automaticamente.
            </Text>
          </View>

          <TouchableOpacity style={styles.allowBtn} onPress={allowPermission}>
            <Text style={styles.allowBtnText}>Permitir acceso a salud</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={skip}>
            <Text style={styles.skipText}>Omitir por ahora</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F0EFEA',   // light bg makes black curve corners visible
  },
  scrollContent: {
    flexGrow: 1,
  },

  topSection: {
    backgroundColor: '#F0EFEA',
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 70,
    position: 'relative',
    overflow: 'hidden',
  },
  decoCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.07)',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    color: '#666666',
    textAlign: 'right',
    lineHeight: 22,
  },

  bottomCard: {
    flex: 1,
    backgroundColor: '#000000',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    // THE TRICK: borderTopWidth + borderTopColor = curved accent automatically!
    // No child view needed — the border curves with borderRadius natively.
    borderTopWidth: 5,
    borderTopColor: '#E45B25',
    marginTop: -36,
    paddingHorizontal: 20,
    paddingBottom: 48,
    overflow: 'visible',          // so icon pokes above
  },

  // Icon: use alignSelf center — no left/marginLeft tricks
  overlapCircle: {
    alignSelf: 'center',          // properly centered
    marginTop: -43,               // (76/2) + 5px border = pokes above curve
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#F07030',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#000000',
    zIndex: 99,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141414',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 14,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    marginBottom: 3,
  },
  cardDesc: {
    color: '#9A9A9A',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    lineHeight: 18,
  },

  noteBox: {
    borderWidth: 1,
    borderColor: 'rgba(46,204,113,0.3)',
    backgroundColor: 'rgba(46,204,113,0.07)',
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
    marginBottom: 24,
  },
  noteText: {
    color: '#9A9A9A',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    lineHeight: 19,
  },
  noteBold: {
    color: '#2ECC71',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '700',
  },

  allowBtn: {
    backgroundColor: '#F07030',
    borderRadius: 30,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  allowBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
  },
  skipText: {
    color: '#9A9A9A',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});
