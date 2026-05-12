import client from './client';
import { ApiResponse, User, Mission } from '../types/models';

export const profileApi = {
  getProfile: () => client.get<ApiResponse<User>>('/profile'),

  updateProfile: (data: Partial<Pick<User, 'name' | 'email' | 'phone' | 'avatar'>>) =>
    client.put<ApiResponse<User>>('/profile', data),

  getMissions: () => client.get<ApiResponse<Mission[]>>('/profile/missions'),

  getXPHistory: () =>
    client.get<ApiResponse<{ xp: number; date: string }[]>>('/profile/xp-history'),

  changePassword: (currentPassword: string, newPassword: string) =>
    client.post('/profile/change-password', { currentPassword, newPassword }),
};
