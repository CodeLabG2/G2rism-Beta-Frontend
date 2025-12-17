/**
 * Hook personalizado para gestión de clientes (CRM)
 * Usa directamente la API real del backend G2rismBeta.API
 *
 * Fecha de migración a API real: 2025-12-16
 */

import { useState, useCallback } from 'react';
import { clientsService } from '../services/api';
import type { Client, CreateClientDto, UpdateClientDto, ClientsFilters } from '../services/api';

/**
 * Hook personalizado para gestión de clientes (CRM)
 * Usa directamente la API real del backend
 */
export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadClients = useCallback(async (filters?: ClientsFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await clientsService.getAll(filters);
      setClients(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al cargar clientes');
      console.error('Error loading clients:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createClient = useCallback(async (data: CreateClientDto) => {
    try {
      const newClient = await clientsService.create(data);
      setClients(prev => [...prev, newClient]);
      return { success: true, data: newClient };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear cliente';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const updateClient = useCallback(async (id: number, data: UpdateClientDto) => {
    try {
      const updatedClient = await clientsService.update(id, data);
      setClients(prev => prev.map(client => client.idCliente === id ? updatedClient : client));
      return { success: true, data: updatedClient };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar cliente';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const deleteClient = useCallback(async (id: number) => {
    try {
      await clientsService.delete(id);
      setClients(prev => prev.filter(client => client.idCliente !== id));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar cliente';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const activateClient = useCallback(async (id: number) => {
    try {
      const updatedClient = await clientsService.activate(id);
      setClients(prev => prev.map(client => client.idCliente === id ? updatedClient : client));
      return { success: true, data: updatedClient };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al activar cliente';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const deactivateClient = useCallback(async (id: number) => {
    try {
      const updatedClient = await clientsService.deactivate(id);
      setClients(prev => prev.map(client => client.idCliente === id ? updatedClient : client));
      return { success: true, data: updatedClient };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al desactivar cliente';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const toggleClientStatus = useCallback(async (id: number) => {
    try {
      const updatedClient = await clientsService.toggleActive(id);
      setClients(prev => prev.map(client => client.idCliente === id ? updatedClient : client));
      return { success: true, data: updatedClient };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cambiar estado';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const searchClients = useCallback(async (term: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await clientsService.search(term);
      setClients(data);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al buscar clientes';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getClientWithCategory = useCallback(async (id: number) => {
    try {
      const client = await clientsService.getWithCategory(id);
      return { success: true, data: client };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener cliente';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const getClientComplete = useCallback(async (id: number) => {
    try {
      const client = await clientsService.getComplete(id);
      return { success: true, data: client };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener cliente completo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const getStatistics = useCallback(async () => {
    try {
      const stats = await clientsService.getStatistics();
      return { success: true, data: stats };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener estadísticas';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const getCities = useCallback(async () => {
    try {
      const cities = await clientsService.getCities();
      return { success: true, data: cities };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener ciudades';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const getCountries = useCallback(async () => {
    try {
      const countries = await clientsService.getCountries();
      return { success: true, data: countries };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener países';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  return {
    clients,
    loading,
    error,
    loadClients,
    createClient,
    updateClient,
    deleteClient,
    activateClient,
    deactivateClient,
    toggleClientStatus,
    searchClients,
    getClientWithCategory,
    getClientComplete,
    getStatistics,
    getCities,
    getCountries,
  };
}