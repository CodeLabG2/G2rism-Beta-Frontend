/**
 * Hook personalizado para llamadas API con fallback automático a datos mock
 * ===========================================================================
 * Patrón de integración por pasos: intenta API real, si falla usa mock
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../services/api/config/axios.config';
import type { ApiResponse } from '../types/backend.types';

interface UseApiOptions<T> {
  /** Endpoint de la API (ej: '/clientes', '/paquetes') */
  endpoint: string;
  
  /** Datos mock para usar como fallback si la API falla */
  mockData?: T;
  
  /** Si debe hacer la petición automáticamente al montar el componente */
  autoFetch?: boolean;
  
  /** Dependencias para refetch automático */
  dependencies?: any[];
  
  /** Mensaje personalizado cuando usa mock */
  mockMessage?: string;
}

interface UseApiResult<T> {
  /** Datos obtenidos (desde API o mock) */
  data: T | null;
  
  /** Estado de carga */
  loading: boolean;
  
  /** Mensaje de error si lo hay */
  error: string | null;
  
  /** Indica si está usando datos mock en lugar de la API real */
  useMock: boolean;
  
  /** Función para refetch manual */
  refetch: () => Promise<void>;
  
  /** Función para forzar uso de mock */
  forceMock: () => void;
  
  /** Función para limpiar datos */
  clear: () => void;
}

/**
 * Hook genérico para peticiones API con fallback automático
 * 
 * @example
 * ```tsx
 * const { data, loading, error, useMock } = useApiWithFallback<Cliente[]>({
 *   endpoint: '/clientes',
 *   mockData: MOCK_CLIENTES,
 *   autoFetch: true
 * });
 * ```
 */
export const useApiWithFallback = <T>({
  endpoint,
  mockData,
  autoFetch = true,
  dependencies = [],
  mockMessage = 'Usando datos de prueba (backend no disponible)',
}: UseApiOptions<T>): UseApiResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [useMock, setUseMock] = useState<boolean>(false);

  /**
   * Función principal para hacer la petición
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setUseMock(false);

    try {
      // Intentar obtener datos del backend real
      const response = await apiClient.get<ApiResponse<T>>(endpoint);
      
      if (response.data.success) {
        setData(response.data.data);
        
        // Log en desarrollo
        if (import.meta.env.DEV) {
          console.log(`✅ [API] Datos obtenidos desde backend:`, {
            endpoint,
            count: Array.isArray(response.data.data) ? response.data.data.length : 'N/A',
          });
        }
      } else {
        throw new Error(response.data.message || 'Error al obtener datos');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error desconocido';
      
      console.warn(`⚠️ [API Fallback] ${endpoint}:`, errorMessage);
      
      // Activar fallback a mock data si está disponible
      if (mockData) {
        setData(mockData);
        setUseMock(true);
        setError(mockMessage);
        
        if (import.meta.env.DEV) {
          console.log(`🔄 [Mock] Usando datos de prueba para:`, endpoint);
        }
      } else {
        setError(errorMessage);
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint, mockData, mockMessage]);

  /**
   * Forzar uso de datos mock
   */
  const forceMock = useCallback(() => {
    if (mockData) {
      setData(mockData);
      setUseMock(true);
      setError(mockMessage);
      setLoading(false);
      
      console.log(`🔄 [Mock Forzado] Usando datos de prueba para:`, endpoint);
    }
  }, [mockData, mockMessage, endpoint]);

  /**
   * Limpiar datos y estado
   */
  const clear = useCallback(() => {
    setData(null);
    setError(null);
    setUseMock(false);
    setLoading(false);
  }, []);

  /**
   * Auto-fetch al montar o cuando cambien las dependencias
   */
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, ...dependencies]);

  return {
    data,
    loading,
    error,
    useMock,
    refetch: fetchData,
    forceMock,
    clear,
  };
};

/**
 * Hook específico para POST con fallback
 */
export const useApiPost = <TRequest, TResponse>(endpoint: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const post = async (data: TRequest): Promise<TResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<ApiResponse<TResponse>>(endpoint, data);
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error(response.data.message);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error en la petición';
      setError(errorMessage);
      console.error(`❌ [API POST] ${endpoint}:`, errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { post, loading, error };
};

/**
 * Hook específico para PUT con fallback
 */
export const useApiPut = <TRequest, TResponse>(endpoint: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const put = async (id: number | string, data: TRequest): Promise<TResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.put<ApiResponse<TResponse>>(
        `${endpoint}/${id}`,
        data
      );
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error(response.data.message);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error en la petición';
      setError(errorMessage);
      console.error(`❌ [API PUT] ${endpoint}/${id}:`, errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { put, loading, error };
};

/**
 * Hook específico para DELETE con fallback
 */
export const useApiDelete = (endpoint: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteItem = async (id: number | string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.delete<ApiResponse<boolean>>(
        `${endpoint}/${id}`
      );
      
      if (response.data.success) {
        return true;
      }
      
      throw new Error(response.data.message);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar';
      setError(errorMessage);
      console.error(`❌ [API DELETE] ${endpoint}/${id}:`, errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteItem, loading, error };
};

export default useApiWithFallback;
