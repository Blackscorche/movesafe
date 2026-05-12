import client from './client';
import { TokenResponse } from '../types/models';

export const authApi = {
  /**
   * Sign in OR register via Google / Apple.
   * /auth/social handles both new and returning users (is_new_user flag in response).
   */
  socialLogin: (
    provider: 'google' | 'apple',
    token: string,
    deviceId?: string,
    platform?: 'IOS' | 'ANDROID',
  ) =>
    client.post<TokenResponse>('/auth/social', {
      provider,
      token,
      device_id: deviceId,
      platform,
    }),

  googleLogin: (idToken: string, platform?: 'IOS' | 'ANDROID') =>
    client.post<TokenResponse>('/auth/google', {
      id_token: idToken,
      platform,
    }),

  /**
   * Send OTP to phone (requires access token — used after social login).
   */
  sendOtp: (phone: string) =>
    client.post<{ sent: boolean; phone: string; expires_in_minutes: number; dev_code?: string }>(
      '/auth/send-otp',
      { phone },
    ),

  /**
   * Verify OTP code (requires access token).
   */
  verifyOtp: (phone: string, otpCode: string) =>
    client.post<{ verified: boolean; phone: string }>(
      '/auth/verify-otp',
      { phone, otp_code: otpCode },
    ),

  /**
   * Exchange refresh token for new access + refresh token pair.
   */
  refresh: (refreshToken: string) =>
    client.post<TokenResponse>('/auth/refresh', { refresh_token: refreshToken }),

  /**
   * Revoke refresh token (logout).
   */
  logout: (refreshToken: string) =>
    client.post('/auth/logout', { refresh_token: refreshToken }),
};
