import { useState, useEffect, useCallback } from 'react';
import { packageService } from '../services/api/packageService';
import { TourPackage, PackageFilters } from '../services/api/types';
import { mockPackages } from '../data/mockData';
import packagesService, { CreatePaqueteDTO, UpdatePaqueteDTO } from '../services/api/packagesService';

// ============================================
// HOOK DE PAQUETES TURÍSTICOS
// ============================================

export function usePackages(filters?: PackageFilters) {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Cargar paquetes
   */
  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        const data = await packagesService.getAll(filters as any);
        setPackages(data as any);
        setTotalPages(1);
        setCurrentPage(1);
      } catch (apiError) {
        // Si falla la API, usar datos mock
        console.log('API no disponible, usando datos mock de paquetes');
        setPackages(mockPackages as any);
        setTotalPages(1);
        setCurrentPage(1);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar paquetes');
      console.error('Error al cargar paquetes:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Cargar al montar o cuando cambien los filtros
  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  /**
   * Buscar paquetes
   */
  const searchPackages = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await packagesService.search(query);
      setPackages(data as any);
    } catch (err: any) {
      setError(err.message || 'Error al buscar paquetes');
      console.error('Error al buscar paquetes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crear nuevo paquete
   */
  const createPackage = useCallback(async (data: CreatePaqueteDTO) => {
    try {
      const newPackage = await packagesService.create(data);
      setPackages(prev => [...prev, newPackage as any]);
      return { success: true, data: newPackage };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear paquete';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Actualizar paquete existente
   */
  const updatePackage = useCallback(async (id: number, data: UpdatePaqueteDTO) => {
    try {
      const updatedPackage = await packagesService.update(id, data);
      setPackages(prev => prev.map(pkg => 
        (pkg as any).idPaquete === id ? updatedPackage as any : pkg
      ));
      return { success: true, data: updatedPackage };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar paquete';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Eliminar paquete
   */
  const deletePackage = useCallback(async (id: number) => {
    try {
      await packagesService.delete(id);
      setPackages(prev => prev.filter(pkg => (pkg as any).idPaquete !== id));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar paquete';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener estadísticas
   */
  const getStatistics = useCallback(async () => {
    try {
      const stats = await packagesService.getStatistics();
      return { success: true, data: stats };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener estadísticas';
      return { success: false, error: errorMessage };
    }
  }, []);

  return {
    packages,
    totalPages,
    currentPage,
    loading,
    error,
    fetchPackages,
    searchPackages,
    createPackage,
    updatePackage,
    deletePackage,
    getStatistics,
  };
}

// ============================================
// HOOK PARA PAQUETES DESTACADOS
// ============================================

export function useFeaturedPackages() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await packageService.getFeaturedPackages();
        setPackages(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar paquetes destacados');
        console.error('Error al cargar paquetes destacados:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return { packages, isLoading, error };
}

// ============================================
// HOOK PARA UN PAQUETE INDIVIDUAL
// ============================================

export function usePackage(id: string) {
  const [packageData, setPackageData] = useState<TourPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await packageService.getPackageById(id);
        setPackageData(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar paquete');
        console.error('Error al cargar paquete:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPackage();
    }
  }, [id]);

  /**
   * Verificar disponibilidad
   */
  const checkAvailability = useCallback(async (
    fechaInicio: string,
    numeroViajeros: number
  ) => {
    if (!id) return null;
    
    try {
      setIsLoading(true);
      const result = await packageService.checkAvailability(id, fechaInicio, numeroViajeros);
      return result;
    } catch (err: any) {
      setError(err.message || 'Error al verificar disponibilidad');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  return { 
    package: packageData, 
    isLoading, 
    error,
    checkAvailability 
  };
}