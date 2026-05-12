import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../utils/theme';
import { AppBar } from '../../components/common/AppBar';

export const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');

  return (
    <View style={styles.root}>
      <AppBar />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.darkHeader, { paddingTop: insets.top + 8 }]}>
          <View style={styles.headerRow}>
            <View style={styles.headerTextBlock}>
              <Text style={styles.headerTitle}>Configuracion</Text>
              <Text style={styles.headerSubtitle}>Configuracion del entorno</Text>
              <View style={styles.tabs}>
                <TouchableOpacity style={[styles.tab, activeTab === 'daily' && styles.tabActive]} onPress={() => setActiveTab('daily')}>
                  <Text style={[styles.tabText, activeTab === 'daily' && styles.tabTextActive]}>Diario</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tab, activeTab === 'weekly' && styles.tabActive]} onPress={() => setActiveTab('weekly')}>
                  <Text style={[styles.tabText, activeTab === 'weekly' && styles.tabTextActive]}>Semanal</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Image source={require('../../assets/images/maya-config.png')} style={styles.parrot} resizeMode="contain" />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Cuenta</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowLabel}>Informacion personal</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>Juan Diaz</Text>
              <Text style={styles.rowArrow}>{'\u2192'}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowLabel}>Email</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>juan.diaz@email.com</Text>
              <Text style={styles.rowArrow}>{'\u2192'}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.row, styles.rowLast]}>
            <Text style={styles.rowLabel}>Telefono</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>+58 412 345 6789</Text>
              <Text style={styles.rowArrow}>{'\u2192'}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Notificaciones</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Notificaciones push</Text>
            <Switch value={pushEnabled} onValueChange={setPushEnabled} trackColor={{ false: '#E0E0E0', true: colors.primary }} thumbColor="#fff" />
          </View>
          <View style={[styles.row, styles.rowLast]}>
            <Text style={styles.rowLabel}>Notificaciones por email</Text>
            <Switch value={emailEnabled} onValueChange={setEmailEnabled} trackColor={{ false: '#E0E0E0', true: colors.primary }} thumbColor="#fff" />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Aplicacion</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowLabel}>Permisos de salud</Text>
            <View style={styles.rowRight}>
              <Text style={[styles.rowValue, { color: '#2ECC71' }]}>Conectado</Text>
              <Text style={styles.rowArrow}>{'\u2192'}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.row, styles.rowLast]}>
            <Text style={styles.rowLabel}>Idioma</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>Espanol</Text>
              <Text style={styles.rowArrow}>{'\u2192'}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Seguridad</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowLabel}>Cambiar contrasena</Text>
            <Text style={styles.rowArrow}>{'\u2192'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.row, styles.rowLast]}>
            <Text style={styles.rowLabel}>Privacidad</Text>
            <Text style={styles.rowArrow}>{'\u2192'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Image source={require('../../assets/images/maya-welcome.png')} style={styles.footerLogo} resizeMode="contain" />
          <Text style={styles.footerVersion}>Version 1.0 (Build 100)</Text>
          <Text style={styles.footerLinks}>
            <Text style={styles.footerLink}>Terminos de servicio</Text>
            {' \u00B7 '}
            <Text style={styles.footerLink}>Politica de privacidad</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#EBEBEB' },
  content: { paddingBottom: 120 },
  darkHeader: { backgroundColor: '#000000', paddingHorizontal: 16, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  headerTextBlock: { flex: 1, paddingRight: 8 },
  headerTitle: { fontSize: 28, fontFamily: 'Poppins-Bold', fontWeight: '800', color: '#FFFFFF', lineHeight: 32, marginBottom: 4 },
  headerSubtitle: { fontSize: 13, fontFamily: 'Poppins-Regular', color: '#AAAAAA', marginBottom: 14 },
  tabs: { flexDirection: 'row', backgroundColor: '#2C2C2C', borderRadius: 100, padding: 4, alignSelf: 'flex-start' },
  tab: { paddingVertical: 9, paddingHorizontal: 22, borderRadius: 100, alignItems: 'center' },
  tabActive: { backgroundColor: colors.primary },
  tabText: { color: '#777', fontSize: 13, fontFamily: 'Poppins-Medium' },
  tabTextActive: { color: '#FFF', fontFamily: 'Poppins-SemiBold' },
  parrot: { width: 150, height: 150, marginBottom: -12, flexShrink: 0 },
  sectionTitle: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 10,
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  card: { backgroundColor: '#000000', marginHorizontal: 16, borderRadius: 16, overflow: 'hidden' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  rowLast: { borderBottomWidth: 0 },
  rowLabel: { color: '#FFFFFF', fontSize: 14, fontFamily: 'Poppins-Medium' },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowValue: { color: '#999', fontSize: 13, fontFamily: 'Poppins-Regular' },
  rowArrow: { color: '#666', fontSize: 16 },
  footer: { alignItems: 'center', marginTop: 32, gap: 8 },
  footerLogo: { width: 120, height: 50, marginBottom: 4 },

  footerVersion: { color: '#999', fontSize: 12, fontFamily: 'Poppins-Regular' },
  footerLinks: { color: '#999', fontSize: 11, fontFamily: 'Poppins-Regular' },
  footerLink: { color: colors.primary },
});
