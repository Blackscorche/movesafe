import client from './client';

export interface RedemptionResponse {
  id: string;
  status: 'reserved' | 'confirmed' | 'cancelled' | 'expired';
  coupon_id: string;
  store_id: string;
  gc_spent: number;
  created_at: string;
  expires_at: string;
}

export const redemptionsApi = {
  reserve: (couponId: string) =>
    client.post<RedemptionResponse>('/redemptions/reserve', { coupon_id: couponId }),

  confirm: (redemptionId: string) =>
    client.post<RedemptionResponse>(`/redemptions/${redemptionId}/confirm`),

  cancel: (redemptionId: string) =>
    client.post<RedemptionResponse>(`/redemptions/${redemptionId}/cancel`),

  getStatus: (redemptionId: string) =>
    client.get<RedemptionResponse>(`/redemptions/${redemptionId}`),

  rate: (redemptionId: string, rating: number, comment?: string) =>
    client.post(`/redemptions/${redemptionId}/rate`, { rating, comment }),
};
