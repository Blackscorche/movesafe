import client from './client';

export const qrApi = {
  generate: () =>
    client.post<{ code: string; expires_in: number }>('/qr/generate'),
};
