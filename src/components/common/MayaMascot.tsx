import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { colors } from '../../utils/theme';

interface MayaMascotProps {
  image: ImageSourcePropType;
  message?: string;
  size?: number;
  variant?: 'default' | 'happy' | 'tip' | 'help' | 'profile' | 'coupon';
}

const variantImages: Record<string, ImageSourcePropType> = {
  default: require('../../assets/images/maya-welcome.png'),
  happy: require('../../assets/images/maya-happy.png'),
  tip: require('../../assets/images/maya-tip.png'),
  help: require('../../assets/images/maya-help.png'),
  profile: require('../../assets/images/maya-profile.png'),
  coupon: require('../../assets/images/maya-coupon.png'),
};

export const MayaMascot: React.FC<MayaMascotProps> = ({
  image,
  message,
  size = 80,
  variant = 'default',
}) => {
  const source = image || variantImages[variant];

  return (
    <View style={styles.container}>
      <Image
        source={source}
        style={[styles.image, { width: size, height: size }]}
        resizeMode="contain"
      />
      {message && (
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{message}</Text>
          <View style={styles.bubbleArrow} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
  },
  bubble: {
    backgroundColor: colors.surface1,
    borderRadius: 16,
    padding: 12,
    marginTop: 8,
    maxWidth: 220,
    position: 'relative',
  },
  bubbleText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 18,
  },
  bubbleArrow: {
    position: 'absolute',
    top: -8,
    left: '50%',
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.surface1,
  },
});
