import { useState, useCallback } from 'react';
import { storesApi } from '../api/stores';
import { Merchant, MerchantDetail } from '../types/models';

export const useStores = () => {
  const [stores, setStores] = useState<Merchant[]>([]);
  const [selectedStore, setSelectedStore] = useState<MerchantDetail | null>(null);
  const [category, setCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStores = useCallback(
    async (cat?: string, query?: string) => {
      try {
        setIsLoading(true);
        const c = cat || category;
        const response = await storesApi.getAll(c === 'Todos' ? undefined : c, query);
        setStores(response.data.merchants);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Error al cargar comercios');
      } finally {
        setIsLoading(false);
      }
    },
    [category]
  );

  const fetchStoreById = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const response = await storesApi.getById(id);
      setSelectedStore(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al cargar comercio');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleFavorite = useCallback(async (merchantId: string) => {
    try {
      await storesApi.toggleFavorite(merchantId);
      fetchStores();
    } catch {
      // Silently fail
    }
  }, [fetchStores]);

  const redeemCoupon = useCallback(async (code: string) => {
    try {
      setIsLoading(true);
      const response = await storesApi.redeemCoupon(code);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al canjear cupón');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchStores = useCallback(async (query: string) => {
    try {
      setIsLoading(true);
      const response = await storesApi.search(query);
      setStores(response.data.merchants);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al buscar');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changeCategory = useCallback(
    (cat: string) => {
      setCategory(cat);
      fetchStores(cat);
    },
    [fetchStores]
  );

  return {
    stores,
    selectedStore,
    category,
    searchQuery,
    isLoading,
    error,
    fetchStores,
    fetchStoreById,
    toggleFavorite,
    redeemCoupon,
    searchStores,
    changeCategory,
    setSearchQuery,
  };
};
