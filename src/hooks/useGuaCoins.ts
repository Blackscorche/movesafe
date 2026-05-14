import { useState, useCallback } from 'react';
import { guacoinsApi } from '../api/guacoins';
import { DashboardResponse, TransactionItem } from '../types/models';

export const useGuaCoins = () => {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await guacoinsApi.getBalance();
      setDashboard(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al cargar balance');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await guacoinsApi.getTransactions();
      setTransactions(response.data.items);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al cargar transacciones');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    dashboard,
    transactions,
    isLoading,
    error,
    fetchBalance,
    fetchTransactions,
  };
};
