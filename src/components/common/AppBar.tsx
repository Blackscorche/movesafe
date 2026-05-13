import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../utils/theme';

interface AppBarProps {
  showBack?: boolean;
}

import { useAuthContext } from '../../context/AuthContext';

export const AppBar: React.FC<AppBarProps> = ({ showBack }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
        )}
        <View style={styles.avatar}>
          <MaterialCommunityIcons name="account" size={24} color="#fff" />
        </View>
        <View>
          <Text style={styles.badge}>PIONERO</Text>
          <Text style={styles.name}>{user?.name || 'Usuario'}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <TouchableOpacity style={styles.bell}>
          <MaterialCommunityIcons name="bell" size={22} color="#000" />
          <View style={styles.bellBadge}>
            <Text style={styles.bellBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    marginBottom: 10,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    marginRight: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
    letterSpacing: 1,
  },
  name: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bell: {
    position: 'relative',
  },
  bellBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontFamily: 'Poppins-Bold',
  },
});
