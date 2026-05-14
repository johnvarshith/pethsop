import { useState, useEffect, useCallback } from 'react';
import { productsAPI } from '../services/api';

/**
 * Custom hook to fetch products from the backend API.
 * Handles loading, error, pagination, search, and category filtering.
 */
export function useProducts({ page = 1, search = '', category = '' } = {}) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productsAPI.getAll({ page, limit: 12, search, category });
      setProducts(res.data.products || res.data); // handles both paginated and flat responses
      setTotal(res.data.total || res.data.length || 0);
      setPages(res.data.pages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, total, pages, loading, error, refetch: fetchProducts };
}
