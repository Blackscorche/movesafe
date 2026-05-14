import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/auth/LoginScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import { HealthPermissionScreen } from '../screens/auth/HealthPermissionScreen';
import { WelcomeBadgeScreen } from '../screens/auth/WelcomeBadgeScreen';
import { AuthStackParamList } from '../types/navigation';
import { colors } from '../utils/theme';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
      <Stack.Screen name="HealthPermission" component={HealthPermissionScreen} />
      <Stack.Screen name="WelcomeBadge" component={WelcomeBadgeScreen} />
    </Stack.Navigator>
  );
};
