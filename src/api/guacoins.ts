import client from './client';
import { DashboardResponse, TransactionListResponse } from '../types/models';

export const guacoinsApi = {
  getBalance: () => client.get<DashboardResponse>('/users/me/dashboard'),

  getTransactions: (limit = 20, offset = 0) =>
    client.get<TransactionListResponse>('/users/me/transactions', {
      params: { limit, offset },
    }),
};
