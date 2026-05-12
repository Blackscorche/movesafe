import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../utils/theme';
import { AppBar } from '../../components/common/AppBar';
import { AppButton } from '../../components/common/AppButton';

interface FAQItem { question: string; isOpen: boolean; }


const FAQ_DATA: { category: string; items: FAQItem[] }[] = [
  { category: 'General', items: [{ question: 'Que es MoveSave?', isOpen: false }, { question: 'Como gano GuaCoins?', isOpen: false }, { question: 'Los GuaCoins expiran?', isOpen: false }] },
  { category: 'Canjes', items: [{ question: 'Como canjeo mis GuaCoins?', isOpen: false }, { question: 'Puedo cancelar un canje?', isOpen: false }, { question: 'Cuantas veces puedo canjear por dia?', isOpen: false }] },
  { category: 'Privacidad', items: [{ question: 'Que datos accede MoveSave?', isOpen: false }, { question: 'Mi informacion esta segura?', isOpen: false }] },
  { category: 'Comercios', items: [{ question: 'Que comercios estan disponibles?', isOpen: false }, { question: 'Como sugiero un comercio?', isOpen: false }] },
];

export const HelpScreen = () => {
  const insets = useSafeAreaInsets();
  const [faqSections, setFaqSections] = useState(FAQ_DATA);

  const toggleFAQ = (categoryIndex: number, itemIndex: number) => {
    setFaqSections((prev) => prev.map((section, sIdx) => sIdx === categoryIndex ? { ...section, items: section.items.map((item, iIdx) => iIdx === itemIndex ? { ...item, isOpen: !item.isOpen } : item) } : section));
  };

  return (
    <View style={styles.root}>
      <AppBar />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.darkHeader, { paddingTop: insets.top + 8 }]}>
          <View style={styles.headerRow}>
            <View style={styles.headerTextBlock}>
              <Text style={styles.headerTitle}>Centro de ayuda</Text>
              <Text style={styles.headerSubtitle}>Encuentra respuestas rapidas</Text>
              <View style={styles.searchBox}>
                <TextInput style={styles.searchInput} placeholder="Buscar..." placeholderTextColor="#666" />
                <Image source={require('../../assets/images/maya-help.png')} style={styles.searchIcon} resizeMode="contain" />
              </View>
            </View>
            <Image source={require('../../assets/images/maya-help.png')} style={styles.parrot} resizeMode="contain" />
          </View>
        </View>

        {faqSections.map((section, sIdx) => (
          <View key={section.category}>
            <Text style={styles.categoryTitle}>{section.category}</Text>
            <View style={styles.faqCard}>
              {section.items.map((item, iIdx) => (
                <TouchableOpacity key={item.question} style={[styles.faqItem, iIdx < section.items.length - 1 && styles.faqItemBorder]} onPress={() => toggleFAQ(sIdx, iIdx)}>
                  <Text style={styles.faqQuestion}>{item.question}</Text>
                  <Text style={styles.faqArrow}>{item.isOpen ? '\u2191' : '\u2193'}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.supportCard}>
          <Text style={styles.supportEmoji}>{'\uD83D\uDCAC'}</Text>
          <Text style={styles.supportTitle}>No encuentras lo que buscas?</Text>
          <Text style={styles.supportBody}>Nuestro equipo de soporte esta aqui para ayudarte</Text>
          <AppButton title="Contactar soporte" onPress={() => {}} variant="primary" />
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
  headerTitle: { fontSize: 28, fontFamily: 'Poppins-Bold', color: '#FFFFFF', lineHeight: 32 },
  headerSubtitle: { fontSize: 13, fontFamily: 'Poppins-Regular', color: '#AAAAAA', marginBottom: 14 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2C2C2E', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  searchIcon: { width: 28, height: 28 },
  searchInput: { flex: 1, fontSize: 13, fontFamily: 'Poppins-Regular', color: '#FFFFFF', padding: 0 },
  parrot: { width: 150, height: 150, marginBottom: -16, flexShrink: 0 },
  categoryTitle: { color: colors.primary, fontSize: 12, fontFamily: 'Poppins-SemiBold', textTransform: 'uppercase', letterSpacing: 1, marginHorizontal: 16, marginTop: 16, marginBottom: 8 },
  faqCard: { backgroundColor: '#FFFFFF', marginHorizontal: 16, borderRadius: 16, overflow: 'hidden' },
  faqItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16 },
  faqItemBorder: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  faqQuestion: { color: '#000', fontSize: 14, fontFamily: 'Poppins-Medium', flex: 1, marginRight: 12 },
  faqArrow: { color: '#999', fontSize: 14 },
  supportCard: { backgroundColor: '#FFFFFF', margin: 16, borderRadius: 16, padding: 20, alignItems: 'center', gap: 10 },
  supportEmoji: { fontSize: 36 },
  supportTitle: { color: '#000', fontSize: 16, fontFamily: 'Poppins-SemiBold', textAlign: 'center' },
  supportBody: { color: '#666', fontSize: 13, fontFamily: 'Poppins-Regular', textAlign: 'center' },
});
