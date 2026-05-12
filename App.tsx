import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { HealthProvider } from './src/context/HealthContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { colors } from './src/utils/theme';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AuthProvider>
          <HealthProvider>
            <NavigationContainer
              theme={{
                dark: true,
                colors: {
                  primary: colors.primary,
                  background: colors.background,
                  card: colors.surface1,
                  text: colors.textPrimary,
                  border: colors.border,
                  notification: colors.danger,
                },
              }}
            >
              <StatusBar style="light" backgroundColor={colors.background} />
              <AppNavigator />
            </NavigationContainer>
          </HealthProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
