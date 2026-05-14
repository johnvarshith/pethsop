import { useState, useEffect, useCallback } from 'react';
import { petsAPI } from '../services/api';

/**
 * Custom hook to fetch adoptable pets from the backend API.
 */
export function usePets({ page = 1, search = '', species = '' } = {}) {
  const [pets, setPets] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await petsAPI.getAll({ page, limit: 12, search, species });
      setPets(res.data.pets || res.data);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load pets');
    } finally {
      setLoading(false);
    }
  }, [page, search, species]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  return { pets, total, pages, loading, error, refetch: fetchPets };
}
