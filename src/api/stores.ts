import client from './client';
import { MerchantListResponse, MerchantDetail } from '../types/models';

export const storesApi = {
  getAll: (category?: string, search?: string, limit = 20, offset = 0) =>
    client.get<MerchantListResponse>('/merchants', {
      params: { category, search, limit, offset },
    }),

  getById: (id: string) => client.get<MerchantDetail>('/merchants/' + id),

  toggleFavorite: (merchantId: string) =>
    client.post<{ status: string }>('/merchants/' + merchantId + '/favorite'),

  redeemCoupon: (code: string) =>
    client.post<{
      redemption_id: string;
      status: string;
      gc_amount: number;
      discount_usd: string;
      coupon_code: string;
      merchant_id: string;
    }>('/redemptions/coupon', { code }),

  search: (query: string, limit = 20, offset = 0) =>
    client.get<MerchantListResponse>('/merchants', { params: { search: query, limit, offset } }),
};
