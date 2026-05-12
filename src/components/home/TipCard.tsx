import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../../utils/theme';

interface TipCardProps {
  message: string;
}

export const TipCard: React.FC<TipCardProps> = ({ message }) => {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.bulb}>💡</Text>
          <Text style={styles.label}>Tip de Maya</Text>
        </View>
        <Text style={styles.message} numberOfLines={3}>
          {message}
        </Text>
      </View>
      <Image
        source={require('../../assets/images/maya-tip.png')}
        style={styles.maya}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primaryTint10,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.primaryTint20,
  },
  content: {
    flex: 1,
    paddingRight: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  bulb: {
    fontSize: 16,
  },
  label: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  message: {
    color: colors.textPrimary,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    lineHeight: 19,
  },
  maya: {
    width: 60,
    height: 60,
  },
});
