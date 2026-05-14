import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { authApi } from '../api/auth';
import client from '../api/client';
import { User, AuthTokens } from '../types/models';

const registerPushToken = async () => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: s } = await Notifications.requestPermissionsAsync();
      if (s !== 'granted') return;
    }
    const tokenData = await Notifications.getExpoPushTokenAsync();
    await client.post('/users/me/device/fcm', {
      fcm_token: tokenData.data,
      platform: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
    });
  } catch {
    // Non-critical — silently fail
  }
};

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isSigningOut: boolean;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SIGN_IN'; payload: { user: User; tokens: AuthTokens } }
  | { type: 'SIGN_OUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  tokens: null,
  isLoading: true,
  isSigningOut: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SIGN_IN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isLoading: false,
      };
    case 'SIGN_OUT':
      return { ...initialState, isLoading: false };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
}

interface AuthContextValue extends AuthState {
  signIn: (user: User, tokens: AuthTokens) => Promise<void>;
  signOut: () => Promise<void>;
  restoreSession: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  signInWithGoogle: () => Promise<{ ok: boolean; error?: string }>;
  sendOtp: (phone: string) => Promise<{ ok: boolean; data?: any; error?: string }>;
  verifyOtp: (phone: string, code: string) => Promise<{ ok: boolean; error?: string }>;
  loginWithOtp: (phone: string, code: string) => Promise<{ ok: boolean; error?: string }>;
  loginWithEmailOtp: (email: string, code: string) => Promise<{ ok: boolean; error?: string }>;
  sendEmailOtp: (email: string) => Promise<{ ok: boolean; data?: any; error?: string }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  React.useEffect(() => {
    const webClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
    console.log('Configuring Google Sign-In with Web Client ID:', webClientId);
    
    if (webClientId) {
      GoogleSignin.configure({
        webClientId,
        offlineAccess: true,
      });
    } else {
      console.warn('EXPO_PUBLIC_GOOGLE_CLIENT_ID not found in environment');
    }
  }, []);

  const signIn = useCallback(async (user: User, tokens: AuthTokens, totpSecret?: string) => {
    await SecureStore.setItemAsync('access_token', tokens.accessToken);
    await SecureStore.setItemAsync('refresh_token', tokens.refreshToken);
    if (totpSecret) {
      await SecureStore.setItemAsync('local_totp_secret', totpSecret);
    }
    dispatch({ type: 'SIGN_IN', payload: { user, tokens } });
    registerPushToken();
  }, []);

  const signOut = useCallback(async () => {
    try {
      // 1. Clear Google session to force account picker next time
      await GoogleSignin.signOut();
      try {
        await GoogleSignin.revokeAccess();
      } catch (_) { /* ignore if already revoked */ }

      // 2. Revoke backend session
      const rt = await SecureStore.getItemAsync('refresh_token');
      if (rt) await authApi.logout(rt);
    } catch (_) { }

    // 3. Clear local storage
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
    dispatch({ type: 'SIGN_OUT' });
  }, []);

  const restoreSession = useCallback(async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('access_token');
      const refreshToken = await SecureStore.getItemAsync('refresh_token');
      if (accessToken && refreshToken) {
        dispatch({
          type: 'SIGN_IN',
          payload: {
            user: { id: '', name: '', level: 1, xp: 0, xpToNextLevel: 100, joinedAt: '' },
            tokens: { accessToken, refreshToken, expiresIn: 900 },
          },
        });
        return;
      }
    } catch (_) { }
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: data });
  }, []);

  const sendOtp = useCallback(async (phone: string) => {
    try {
      const response = await authApi.sendOtp(phone);
      return { ok: true, data: response.data };
    } catch (error: any) {
      return { ok: false, error: error.response?.data?.detail || 'Error al enviar código' };
    }
  }, []);

  const verifyOtp = useCallback(async (phone: string, code: string) => {
    try {
      const response = await authApi.verifyOtp(phone, code);
      if (response.data.verified) {
        return { ok: true };
      }
      return { ok: false, error: 'Código incorrecto' };
    } catch (error: any) {
      return { ok: false, error: error.response?.data?.detail || 'Error al verificar código' };
    }
  }, []);

  const loginWithOtp = useCallback(async (phone: string, code: string) => {
    try {
      const response = await authApi.loginWithOtp(phone, code);
      const { access_token, refresh_token, expires_in } = response.data;
      const tokens = { accessToken: access_token, refreshToken: refresh_token, expiresIn: expires_in };
      
      const user: User = { 
        id: '', 
        name: response.data.display_name || 'Usuario', 
        level: 1, xp: 0, xpToNextLevel: 100, joinedAt: '' 
      };

      await signIn(user, tokens, response.data.local_totp_secret);
      return { ok: true, isNewUser: response.data.is_new_user };
    } catch (error: any) {
      return { ok: false, error: error.response?.data?.detail || 'Error al iniciar sesión' };
    }
  }, [signIn]);

  const loginWithEmailOtp = useCallback(async (email: string, code: string) => {
    try {
      const response = await authApi.loginWithEmailOtp(email, code);
      const { access_token, refresh_token, expires_in } = response.data;
      const tokens = { accessToken: access_token, refreshToken: refresh_token, expiresIn: expires_in };
      
      const user: User = { 
        id: '', 
        name: response.data.display_name || 'Usuario', 
        level: 1, xp: 0, xpToNextLevel: 100, joinedAt: '' 
      };

      await signIn(user, tokens, response.data.local_totp_secret);
      return { ok: true, isNewUser: response.data.is_new_user };
    } catch (error: any) {
      return { ok: false, error: error.response?.data?.detail || 'Error al iniciar sesión' };
    }
  }, [signIn]);

  const sendEmailOtp = useCallback(async (email: string) => {
    try {
      const response = await authApi.sendEmailOtp(email);
      return { ok: true, data: response.data };
    } catch (error: any) {
      return { ok: false, error: error.response?.data?.detail || 'Error al enviar código' };
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        return { ok: false, error: 'Token de Google no obtenido' };
      }

      const response = await authApi.googleLogin(
        idToken,
        Platform.OS.toUpperCase() as 'IOS' | 'ANDROID'
      );

      const tokens = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
      };

      const user = {
        id: userInfo.data?.user.id || '',
        name: userInfo.data?.user.name || '',
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        joinedAt: '',
      };

      await signIn(user, tokens);
      return { ok: true };
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      return { ok: false, error: error.message || 'Error en Google Sign-In' };
    }
  }, [signIn]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut,
        restoreSession,
        updateUser,
        signInWithGoogle,
        sendOtp,
        verifyOtp,
        loginWithOtp,
        loginWithEmailOtp,
        sendEmailOtp
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
