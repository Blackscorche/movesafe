export const colors = {
  primary: '#E45B25',
  background: '#FFFFFF',

  surface: '#F5F5F5',
  surface1: '#F5F5F5',
  surface2: '#FFFFFF',
  surface3: '#EEEEEE',
  surfaceDark: '#1C1C1E',
  surfaceGray: '#F0F0F0',

  textPrimary: '#000000',
  textSecondary: '#666666',
  textMuted: '#999999',

  border: '#E0E0E0',
  borderSubtle: '#F0F0F0',

  green: '#00C896',
  success: '#00C896',
  pink: '#FF4D8F',
  teal: '#00D4AA',
  danger: '#FF3B30',
  purple: '#7C5CBF',

  primaryTint10: 'rgba(228, 91, 37, 0.10)',
  primaryTint20: 'rgba(228, 91, 37, 0.20)',
  successTint15: 'rgba(0, 200, 150, 0.15)',
} as const;

export type ColorKey = keyof typeof colors;
