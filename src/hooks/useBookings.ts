import { useState, useEffect, useCallback } from 'react';
import { bookingService } from '../services/api/bookingService';
import { Booking, CreateBookingRequest, BookingFilters } from '../services/api/types';

// ============================================
// HOOK DE RESERVAS
// ============================================

export function useBookings(filters?: BookingFilters) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Cargar reservas del cliente
   */
  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await bookingService.getMyBookings(filters);
      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar reservas');
      console.error('Error al cargar reservas:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Cargar al montar
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  /**
   * Crear nueva reserva
   */
  const createBooking = useCallback(async (data: CreateBookingRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const newBooking = await bookingService.createBooking(data);
      setBookings((prev) => [newBooking, ...prev]);
      return newBooking;
    } catch (err: any) {
      setError(err.message || 'Error al crear reserva');
      console.error('Error al crear reserva:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Cancelar reserva
   */
  const cancelBooking = useCallback(async (id: string, reason?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedBooking = await bookingService.cancelBooking(id, reason);
      setBookings((prev) =>
        prev.map((booking) => (booking.id === id ? updatedBooking : booking))
      );
      return updatedBooking;
    } catch (err: any) {
      setError(err.message || 'Error al cancelar reserva');
      console.error('Error al cancelar reserva:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Descargar comprobante
   */
  const downloadVoucher = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const blob = await bookingService.downloadBookingVoucher(id);
      
      // Crear URL del blob y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reserva-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'Error al descargar comprobante');
      console.error('Error al descargar comprobante:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Obtener reserva por ID
   */
  const getBookingById = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const booking = await bookingService.getBookingById(id);
      return booking;
    } catch (err: any) {
      setError(err.message || 'Error al obtener reserva');
      console.error('Error al obtener reserva:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filtros de reservas
  const upcomingBookings = bookings.filter(
    (b) => b.estado !== 'Completado' && b.estado !== 'Cancelado'
  );
  
  const pastBookings = bookings.filter(
    (b) => b.estado === 'Completado'
  );

  return {
    bookings,
    upcomingBookings,
    pastBookings,
    isLoading,
    error,
    fetchBookings,
    createBooking,
    cancelBooking,
    downloadVoucher,
    getBookingById,
  };
}

// ============================================
// HOOK PARA UNA RESERVA INDIVIDUAL
// ============================================

export function useBooking(id: string) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await bookingService.getBookingById(id);
        setBooking(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar reserva');
        console.error('Error al cargar reserva:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBooking();
    }
  }, [id]);

  return { booking, isLoading, error };
}
