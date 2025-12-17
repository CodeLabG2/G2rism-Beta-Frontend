/**
 * ⚠️ ARCHIVO HOOK - MOD IFICADO PARA USAR SOLO API REAL
 *
 * Se eliminó el fallback a datos mock.
 * Ahora usa únicamente la API real del backend.
 *
 * Fecha de modificación: 2025-12-16
 * Razón: Pruebas de integración con API real G2rismBeta.API
 */

import { useState, useEffect, useCallback } from 'react';
import providersService from '../services/api/providersService';
import type {
  Proveedor,
  CreateProveedorDTO,
  UpdateProveedorDTO,
  TipoProveedor,
  EstadoProveedor,
  ProveedorFilters
} from '../services/api/providersService';

/**
 * Hook personalizado para gestión de proveedores
 * Integra providersService con React state management
 * Usa directamente la API real del backend
 *
 * @returns Funciones y estado para gestionar proveedores
 */
export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Cargar todos los proveedores
   */
  const loadSuppliers = useCallback(async (filters?: ProveedorFilters) => {
    try {
      setLoading(true);
      setError(null);

      const data = await providersService.getAll(filters);
      setSuppliers(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar proveedores';
      setError(errorMessage);
      console.error('Error loading suppliers:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crear nuevo proveedor
   */
  const createSupplier = useCallback(async (data: CreateProveedorDTO) => {
    try {
      const newSupplier = await providersService.create(data);
      setSuppliers(prev => [...prev, newSupplier]);
      return { success: true, data: newSupplier };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear proveedor';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Actualizar proveedor existente
   */
  const updateSupplier = useCallback(async (id: number, data: UpdateProveedorDTO) => {
    try {
      const updatedSupplier = await providersService.update(id, data);
      setSuppliers(prev => prev.map(supplier =>
        supplier.idProveedor === id ? updatedSupplier : supplier
      ));
      return { success: true, data: updatedSupplier };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar proveedor';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Eliminar proveedor
   */
  const deleteSupplier = useCallback(async (id: number) => {
    try {
      await providersService.delete(id);
      setSuppliers(prev => prev.filter(supplier => supplier.idProveedor !== id));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar proveedor';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener proveedor por ID
   */
  const getSupplierById = useCallback(async (id: number) => {
    try {
      const supplier = await providersService.getById(id);
      return { success: true, data: supplier };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener proveedor';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener proveedores por tipo
   */
  const getSuppliersByType = useCallback(async (tipo: TipoProveedor) => {
    try {
      const data = await providersService.getByTipo(tipo);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener proveedores por tipo';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener solo proveedores activos
   */
  const getActiveSuppliers = useCallback(async () => {
    try {
      const data = await providersService.getActivos();
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener proveedores activos';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Actualizar calificación de proveedor
   */
  const updateSupplierRating = useCallback(async (id: number, calificacion: number) => {
    try {
      const updatedSupplier = await providersService.updateCalificacion(id, calificacion);
      setSuppliers(prev => prev.map(supplier =>
        supplier.idProveedor === id ? updatedSupplier : supplier
      ));
      return { success: true, data: updatedSupplier };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar calificación';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Cambiar estado de proveedor
   */
  const changeSupplierStatus = useCallback(async (id: number, estado: EstadoProveedor) => {
    try {
      const updatedSupplier = await providersService.cambiarEstado(id, estado);
      setSuppliers(prev => prev.map(supplier =>
        supplier.idProveedor === id ? updatedSupplier : supplier
      ));
      return { success: true, data: updatedSupplier };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cambiar estado';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener estadísticas
   */
  const getStatistics = useCallback(async () => {
    try {
      const stats = await providersService.getEstadisticas();
      return { success: true, data: stats };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener estadísticas';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Buscar proveedores
   */
  const searchSuppliers = useCallback(async (searchTerm: string) => {
    try {
      const data = await providersService.search(searchTerm);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al buscar proveedores';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Cargar proveedores al montar el componente
   */
  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  return {
    suppliers,
    loading,
    error,
    loadSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getSupplierById,
    getSuppliersByType,
    getActiveSuppliers,
    updateSupplierRating,
    changeSupplierStatus,
    getStatistics,
    searchSuppliers,
  };
}

// Re-exportar tipos para facilitar importación
export type {
  Proveedor,
  CreateProveedorDTO,
  UpdateProveedorDTO,
  TipoProveedor,
  EstadoProveedor,
  ProveedorFilters,
};