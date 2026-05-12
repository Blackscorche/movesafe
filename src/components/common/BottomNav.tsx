import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../utils/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_ICONS: Record<string, any> = {
  HomeTab: 'home',
  ShopTab: 'store',
  QRModal: 'qrcode',
  CoinsTab: 'wallet',
  ProfileTab: 'account',
};

const TABS = [
  { key: 'HomeTab' },
  { key: 'ShopTab' },
  { key: 'QRModal' },
  { key: 'CoinsTab' },
  { key: 'ProfileTab' },
];

interface BottomNavProps {
  activeTab: string;
  onTabPress: (key: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabPress }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom + 8 }]}>
      <View style={styles.container}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const isQR = tab.key === 'QRModal';

          if (isQR) {
            return (
              <TouchableOpacity key={tab.key} style={styles.qrButton} onPress={() => onTabPress(tab.key)} activeOpacity={0.8}>
                <View style={styles.qrCircle}>
                  <MaterialCommunityIcons name={TAB_ICONS[tab.key]} size={24} color="#fff" />
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity key={tab.key} style={styles.tab} onPress={() => onTabPress(tab.key)} activeOpacity={0.7}>
              <MaterialCommunityIcons name={TAB_ICONS[tab.key]} size={24} color={isActive ? colors.primary : '#888'} />
              {isActive && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
  qrButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -18,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
