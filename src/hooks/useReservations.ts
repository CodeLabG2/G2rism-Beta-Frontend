import { useState, useEffect, useCallback } from 'react';
import reservationsService from '../services/api/reservationsService';
import { mockReservations } from '../data/mockData';
import type { 
  Reserva, 
  CreateReservaDTO, 
  UpdateReservaDTO,
  TipoReserva,
  EstadoReserva,
  EstadoPago,
  ReservaFilters,
  ReservaStatistics,
  EventoReserva,
  PagoReserva,
  DetalleVuelo,
  DetalleHotel,
  DetallePaquete
} from '../services/api/reservationsService';

/**
 * Hook personalizado para gestión de reservas
 * Integra reservationsService con React state management
 * 
 * @returns Funciones y estado para gestionar reservas
 */
export function useReservations() {
  const [reservations, setReservations] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Cargar todas las reservas
   */
  const loadReservations = useCallback(async (filters?: ReservaFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        const data = await reservationsService.getAll(filters);
        setReservations(data);
        return data;
      } catch (apiError) {
        // Si falla la API, usar datos mock
        console.log('API no disponible, usando datos mock de reservaciones');
        setReservations(mockReservations as any);
        return mockReservations as any;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar reservas';
      setError(errorMessage);
      console.error('Error loading reservations:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crear nueva reserva
   */
  const createReservation = useCallback(async (data: CreateReservaDTO) => {
    try {
      const newReservation = await reservationsService.create(data);
      setReservations(prev => [newReservation, ...prev]);
      return { success: true, data: newReservation };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear reserva';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Actualizar reserva existente
   */
  const updateReservation = useCallback(async (id: number, data: UpdateReservaDTO) => {
    try {
      const updatedReservation = await reservationsService.update(id, data);
      setReservations(prev => prev.map(res => res.idReserva === id ? updatedReservation : res));
      return { success: true, data: updatedReservation };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar reserva';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Eliminar reserva
   */
  const deleteReservation = useCallback(async (id: number) => {
    try {
      await reservationsService.delete(id);
      setReservations(prev => prev.filter(res => res.idReserva !== id));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar reserva';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener reserva por ID
   */
  const getReservationById = useCallback(async (id: number) => {
    try {
      const reservation = await reservationsService.getById(id);
      return { success: true, data: reservation };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener reserva';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Cambiar estado de la reserva
   */
  const changeReservationStatus = useCallback(async (id: number, estado: EstadoReserva) => {
    try {
      const updatedReservation = await reservationsService.changeStatus(id, estado);
      setReservations(prev => prev.map(res => res.idReserva === id ? updatedReservation : res));
      return { success: true, data: updatedReservation };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cambiar estado';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Confirmar reserva
   */
  const confirmReservation = useCallback(async (id: number) => {
    try {
      const updatedReservation = await reservationsService.confirm(id);
      setReservations(prev => prev.map(res => res.idReserva === id ? updatedReservation : res));
      return { success: true, data: updatedReservation };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al confirmar reserva';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Cancelar reserva
   */
  const cancelReservation = useCallback(async (id: number, motivo?: string) => {
    try {
      const updatedReservation = await reservationsService.cancel(id, motivo);
      setReservations(prev => prev.map(res => res.idReserva === id ? updatedReservation : res));
      return { success: true, data: updatedReservation };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cancelar reserva';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Completar reserva
   */
  const completeReservation = useCallback(async (id: number) => {
    try {
      const updatedReservation = await reservationsService.complete(id);
      setReservations(prev => prev.map(res => res.idReserva === id ? updatedReservation : res));
      return { success: true, data: updatedReservation };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al completar reserva';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Registrar pago
   */
  const addPayment = useCallback(async (id: number, pago: {
    monto: number;
    metodoPago: string;
    referencia?: string;
  }) => {
    try {
      const updatedReservation = await reservationsService.addPayment(id, pago);
      setReservations(prev => prev.map(res => res.idReserva === id ? updatedReservation : res));
      return { success: true, data: updatedReservation };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al registrar pago';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener historial de pagos
   */
  const getPayments = useCallback(async (id: number): Promise<PagoReserva[]> => {
    try {
      const payments = await reservationsService.getPayments(id);
      return payments;
    } catch (err: any) {
      console.error('Error getting payments:', err);
      return [];
    }
  }, []);

  /**
   * Obtener eventos/timeline
   */
  const getEvents = useCallback(async (id: number): Promise<EventoReserva[]> => {
    try {
      const events = await reservationsService.getEvents(id);
      return events;
    } catch (err: any) {
      console.error('Error getting events:', err);
      return [];
    }
  }, []);

  /**
   * Agregar evento
   */
  const addEvent = useCallback(async (id: number, evento: {
    tipo: string;
    descripcion: string;
  }) => {
    try {
      const newEvent = await reservationsService.addEvent(id, evento);
      return { success: true, data: newEvent };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al agregar evento';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener reservas por cliente
   */
  const getReservationsByClient = useCallback(async (idCliente: number) => {
    try {
      const data = await reservationsService.getByClient(idCliente);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener reservas del cliente';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener reservas por tipo
   */
  const getReservationsByType = useCallback(async (tipo: TipoReserva) => {
    try {
      const data = await reservationsService.getByType(tipo);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener reservas por tipo';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener reservas por estado
   */
  const getReservationsByStatus = useCallback(async (estado: EstadoReserva) => {
    try {
      const data = await reservationsService.getByStatus(estado);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener reservas por estado';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener reservas pendientes
   */
  const getPendingReservations = useCallback(async () => {
    try {
      const data = await reservationsService.getPending();
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener reservas pendientes';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener reservas confirmadas
   */
  const getConfirmedReservations = useCallback(async () => {
    try {
      const data = await reservationsService.getConfirmed();
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener reservas confirmadas';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener estadísticas
   */
  const getStatistics = useCallback(async (): Promise<ReservaStatistics | null> => {
    try {
      const stats = await reservationsService.getStatistics();
      return stats;
    } catch (err: any) {
      console.error('Error getting statistics:', err);
      return null;
    }
  }, []);

  /**
   * Buscar reservas
   */
  const searchReservations = useCallback(async (searchTerm: string) => {
    try {
      const data = await reservationsService.search(searchTerm);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al buscar reservas';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Generar voucher
   */
  const generateVoucher = useCallback(async (id: number) => {
    try {
      const blob = await reservationsService.generateVoucher(id);
      // Crear URL para descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `voucher-${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al generar voucher';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Enviar confirmación por email
   */
  const sendConfirmationEmail = useCallback(async (id: number, email?: string) => {
    try {
      await reservationsService.sendConfirmationEmail(id, email);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al enviar confirmación';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener reservas por rango de fechas
   */
  const getReservationsByDateRange = useCallback(async (fechaDesde: string, fechaHasta: string) => {
    try {
      const data = await reservationsService.getByDateRange(fechaDesde, fechaHasta);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener reservas por fecha';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Actualizar detalles de vuelo
   */
  const updateFlightDetails = useCallback(async (id: number, detalleVuelo: DetalleVuelo) => {
    try {
      const updatedReservation = await reservationsService.updateFlightDetails(id, detalleVuelo);
      setReservations(prev => prev.map(res => res.idReserva === id ? updatedReservation : res));
      return { success: true, data: updatedReservation };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar detalles de vuelo';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Actualizar detalles de hotel
   */
  const updateHotelDetails = useCallback(async (id: number, detalleHotel: DetalleHotel) => {
    try {
      const updatedReservation = await reservationsService.updateHotelDetails(id, detalleHotel);
      setReservations(prev => prev.map(res => res.idReserva === id ? updatedReservation : res));
      return { success: true, data: updatedReservation };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar detalles de hotel';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Actualizar detalles de paquete
   */
  const updatePackageDetails = useCallback(async (id: number, detallePaquete: DetallePaquete) => {
    try {
      const updatedReservation = await reservationsService.updatePackageDetails(id, detallePaquete);
      setReservations(prev => prev.map(res => res.idReserva === id ? updatedReservation : res));
      return { success: true, data: updatedReservation };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar detalles de paquete';
      return { success: false, error: errorMessage };
    }
  }, []);

  // Cargar reservas al montar el componente
  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  return {
    // Estado
    reservations,
    loading,
    error,
    
    // Funciones CRUD
    loadReservations,
    createReservation,
    updateReservation,
    deleteReservation,
    getReservationById,
    
    // Funciones de estado
    changeReservationStatus,
    confirmReservation,
    cancelReservation,
    completeReservation,
    
    // Funciones de pagos
    addPayment,
    getPayments,
    
    // Funciones de eventos/timeline
    getEvents,
    addEvent,
    
    // Funciones de consulta
    getReservationsByClient,
    getReservationsByType,
    getReservationsByStatus,
    getPendingReservations,
    getConfirmedReservations,
    getReservationsByDateRange,
    
    // Funciones de detalles específicos
    updateFlightDetails,
    updateHotelDetails,
    updatePackageDetails,
    
    // Utilidades
    getStatistics,
    searchReservations,
    generateVoucher,
    sendConfirmationEmail,
  };
}

// Re-exportar tipos para facilitar uso
export type { 
  Reserva,
  CreateReservaDTO,
  UpdateReservaDTO,
  TipoReserva,
  EstadoReserva,
  EstadoPago,
  ReservaFilters,
  EventoReserva,
  PagoReserva,
  DetalleVuelo,
  DetalleHotel,
  DetallePaquete
};