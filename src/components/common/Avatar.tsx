import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../utils/theme';

interface AvatarProps {
  name: string;
  size?: number;
  uri?: string;
  badge?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 40,
  uri,
  badge,
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const bgColor = colors.primary;

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: bgColor,
          },
        ]}
      >
        <Text
          style={[
            styles.initials,
            { fontSize: size * 0.4 },
          ]}
        >
          {initials}
        </Text>
      </View>
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.textPrimary,
    fontFamily: 'Poppins-SemiBold',
  },
  badge: {
    position: 'absolute',
    bottom: -4,
    left: -4,
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    color: colors.textPrimary,
    fontSize: 8,
    fontFamily: 'Poppins-SemiBold',
  },
});
