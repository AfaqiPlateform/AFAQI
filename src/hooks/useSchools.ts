import { useState, useEffect, useCallback } from 'react';
import { fetchSchools, SchoolFilters } from '../lib/api';
import type { School } from '../types/school';

interface UseSchoolsResult {
  schools: School[];
  loading: boolean;
  error: string | null;
  /** True when data came from the backend */
  isLive: boolean;
  /** Re-fetch with new filters */
  refetch: (filters?: SchoolFilters) => void;
}

/**
 * Hook that fetches schools from the backend on mount.
 * All data comes from the database — no static fallback.
 */
export function useSchools(initialFilters?: SchoolFilters): UseSchoolsResult {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);

  const load = useCallback(async (filters?: SchoolFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSchools(filters);
      setSchools(data);
      setIsLive(true);
    } catch (err: any) {
      const message =
        err?.message || 'Impossible de charger les écoles depuis le serveur';
      console.error('❌ useSchools error:', message);
      setError(message);
      setSchools([]);
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(initialFilters);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { schools, loading, error, isLive, refetch: load };
}
