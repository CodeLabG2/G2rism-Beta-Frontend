import { useState, useEffect, useCallback } from 'react';
import transportService from '../services/api/transportService';
import type {
  Vehiculo,
  VehiculoFormData,
  Conductor,
  ConductorFormData,
  Ruta,
  RutaFormData,
  Asignacion,
  AsignacionFormData,
  EstadoVehiculo,
  EstadoRuta,
  EstadoAsignacion,
  TransportStatistics,
} from '../services/api/transportService';

/**
 * Hook personalizado para gestión de transporte
 * Integra transportService con React state management
 * 
 * @returns Funciones y estado para gestionar transporte
 */
export function useTransport() {
  const [vehicles, setVehicles] = useState<Vehiculo[]>([]);
  const [drivers, setDrivers] = useState<Conductor[]>([]);
  const [routes, setRoutes] = useState<Ruta[]>([]);
  const [assignments, setAssignments] = useState<Asignacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ==================== VEHÍCULOS ====================

  /**
   * Cargar todos los vehículos
   */
  const loadVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transportService.getAllVehicles();
      setVehicles(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar vehículos';
      setError(errorMessage);
      // API no disponible - silenciar error si es Network Error
      if (err.message !== 'Network Error') {
        console.error('Error loading vehicles:', err);
      }
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crear nuevo vehículo
   */
  const createVehicle = useCallback(async (data: VehiculoFormData) => {
    try {
      const newVehicle = await transportService.createVehicle(data);
      setVehicles(prev => [newVehicle, ...prev]);
      return { success: true, data: newVehicle };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear vehículo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Actualizar vehículo
   */
  const updateVehicle = useCallback(async (id: number, data: Partial<VehiculoFormData>) => {
    try {
      const updatedVehicle = await transportService.updateVehicle(id, data);
      setVehicles(prev => prev.map(v => v.idVehiculo === id ? updatedVehicle : v));
      return { success: true, data: updatedVehicle };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar vehículo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Eliminar vehículo
   */
  const deleteVehicle = useCallback(async (id: number) => {
    try {
      await transportService.deleteVehicle(id);
      setVehicles(prev => prev.filter(v => v.idVehiculo !== id));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar vehículo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Cambiar estado de vehículo
   */
  const changeVehicleStatus = useCallback(async (id: number, estadoVehiculo: EstadoVehiculo) => {
    try {
      const updatedVehicle = await transportService.changeVehicleStatus(id, estadoVehiculo);
      setVehicles(prev => prev.map(v => v.idVehiculo === id ? updatedVehicle : v));
      return { success: true, data: updatedVehicle };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cambiar estado';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener vehículos disponibles
   */
  const getAvailableVehicles = useCallback(async () => {
    try {
      const data = await transportService.getAvailableVehicles();
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener vehículos disponibles';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Registrar mantenimiento
   */
  const registerMaintenance = useCallback(async (id: number, data: { fecha: string; descripcion: string; costo: number }) => {
    try {
      const updatedVehicle = await transportService.registerMaintenance(id, data);
      setVehicles(prev => prev.map(v => v.idVehiculo === id ? updatedVehicle : v));
      return { success: true, data: updatedVehicle };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al registrar mantenimiento';
      return { success: false, error: errorMessage };
    }
  }, []);

  // ==================== CONDUCTORES ====================

  /**
   * Cargar todos los conductores
   */
  const loadDrivers = useCallback(async () => {
    try {
      const data = await transportService.getAllDrivers();
      setDrivers(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar conductores';
      setError(errorMessage);
      console.error('Error loading drivers:', err);
      return [];
    }
  }, []);

  /**
   * Crear nuevo conductor
   */
  const createDriver = useCallback(async (data: ConductorFormData) => {
    try {
      const newDriver = await transportService.createDriver(data);
      setDrivers(prev => [newDriver, ...prev]);
      return { success: true, data: newDriver };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear conductor';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Actualizar conductor
   */
  const updateDriver = useCallback(async (id: number, data: Partial<ConductorFormData>) => {
    try {
      const updatedDriver = await transportService.updateDriver(id, data);
      setDrivers(prev => prev.map(d => d.idConductor === id ? updatedDriver : d));
      return { success: true, data: updatedDriver };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar conductor';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Eliminar conductor
   */
  const deleteDriver = useCallback(async (id: number) => {
    try {
      await transportService.deleteDriver(id);
      setDrivers(prev => prev.filter(d => d.idConductor !== id));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar conductor';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener conductores disponibles
   */
  const getAvailableDrivers = useCallback(async () => {
    try {
      const data = await transportService.getAvailableDrivers();
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener conductores disponibles';
      return { success: false, error: errorMessage };
    }
  }, []);

  // ==================== RUTAS ====================

  /**
   * Cargar todas las rutas
   */
  const loadRoutes = useCallback(async () => {
    try {
      const data = await transportService.getAllRoutes();
      setRoutes(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar rutas';
      setError(errorMessage);
      console.error('Error loading routes:', err);
      return [];
    }
  }, []);

  /**
   * Crear nueva ruta
   */
  const createRoute = useCallback(async (data: RutaFormData) => {
    try {
      const newRoute = await transportService.createRoute(data);
      setRoutes(prev => [newRoute, ...prev]);
      return { success: true, data: newRoute };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear ruta';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Actualizar ruta
   */
  const updateRoute = useCallback(async (id: number, data: Partial<RutaFormData>) => {
    try {
      const updatedRoute = await transportService.updateRoute(id, data);
      setRoutes(prev => prev.map(r => r.idRuta === id ? updatedRoute : r));
      return { success: true, data: updatedRoute };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar ruta';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Eliminar ruta
   */
  const deleteRoute = useCallback(async (id: number) => {
    try {
      await transportService.deleteRoute(id);
      setRoutes(prev => prev.filter(r => r.idRuta !== id));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar ruta';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Cambiar estado de ruta
   */
  const changeRouteStatus = useCallback(async (id: number, estadoRuta: EstadoRuta) => {
    try {
      const updatedRoute = await transportService.changeRouteStatus(id, estadoRuta);
      setRoutes(prev => prev.map(r => r.idRuta === id ? updatedRoute : r));
      return { success: true, data: updatedRoute };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cambiar estado de ruta';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener rutas activas
   */
  const getActiveRoutes = useCallback(async () => {
    try {
      const data = await transportService.getActiveRoutes();
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener rutas activas';
      return { success: false, error: errorMessage };
    }
  }, []);

  // ==================== ASIGNACIONES ====================

  /**
   * Cargar todas las asignaciones
   */
  const loadAssignments = useCallback(async () => {
    try {
      const data = await transportService.getAllAssignments();
      setAssignments(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar asignaciones';
      setError(errorMessage);
      console.error('Error loading assignments:', err);
      return [];
    }
  }, []);

  /**
   * Crear nueva asignación
   */
  const createAssignment = useCallback(async (data: AsignacionFormData) => {
    try {
      const newAssignment = await transportService.createAssignment(data);
      setAssignments(prev => [newAssignment, ...prev]);
      return { success: true, data: newAssignment };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear asignación';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Actualizar asignación
   */
  const updateAssignment = useCallback(async (id: number, data: Partial<AsignacionFormData>) => {
    try {
      const updatedAssignment = await transportService.updateAssignment(id, data);
      setAssignments(prev => prev.map(a => a.idAsignacion === id ? updatedAssignment : a));
      return { success: true, data: updatedAssignment };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar asignación';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Eliminar asignación
   */
  const deleteAssignment = useCallback(async (id: number) => {
    try {
      await transportService.deleteAssignment(id);
      setAssignments(prev => prev.filter(a => a.idAsignacion !== id));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar asignación';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Cambiar estado de asignación
   */
  const changeAssignmentStatus = useCallback(async (id: number, estadoAsignacion: EstadoAsignacion) => {
    try {
      const updatedAssignment = await transportService.changeAssignmentStatus(id, estadoAsignacion);
      setAssignments(prev => prev.map(a => a.idAsignacion === id ? updatedAssignment : a));
      return { success: true, data: updatedAssignment };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cambiar estado de asignación';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener asignaciones del día
   */
  const getTodayAssignments = useCallback(async () => {
    try {
      const data = await transportService.getTodayAssignments();
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener asignaciones del día';
      return { success: false, error: errorMessage };
    }
  }, []);

  // ==================== ESTADÍSTICAS ====================

  /**
   * Obtener estadísticas
   */
  const getStatistics = useCallback(async (): Promise<TransportStatistics | null> => {
    try {
      const stats = await transportService.getStatistics();
      return stats;
    } catch (err: any) {
      console.error('Error getting statistics:', err);
      return null;
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  return {
    // Estado
    vehicles,
    drivers,
    routes,
    assignments,
    loading,
    error,

    // Funciones de Vehículos
    loadVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    changeVehicleStatus,
    getAvailableVehicles,
    registerMaintenance,

    // Funciones de Conductores
    loadDrivers,
    createDriver,
    updateDriver,
    deleteDriver,
    getAvailableDrivers,

    // Funciones de Rutas
    loadRoutes,
    createRoute,
    updateRoute,
    deleteRoute,
    changeRouteStatus,
    getActiveRoutes,

    // Funciones de Asignaciones
    loadAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    changeAssignmentStatus,
    getTodayAssignments,

    // Estadísticas
    getStatistics,
  };
}

// Re-exportar tipos
export type {
  Vehiculo,
  VehiculoFormData,
  Conductor,
  ConductorFormData,
  Ruta,
  RutaFormData,
  Asignacion,
  AsignacionFormData,
  EstadoVehiculo,
  EstadoRuta,
  EstadoAsignacion,
  TransportStatistics,
};