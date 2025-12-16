import { api } from './axiosConfig';
import { 
  ApiResponse, 
  PaginatedResponse, 
  Booking, 
  CreateBookingRequest,
  BookingFilters 
} from './types';

// ============================================
// SERVICIO DE RESERVAS
// ============================================

class BookingService {
  private readonly BASE_PATH = '/bookings';

  /**
   * Obtener todas las reservas del cliente actual
   */
  async getMyBookings(filters?: BookingFilters): Promise<Booking[]> {
    try {
      const response = await api.get<ApiResponse<Booking[]>>(
        `${this.BASE_PATH}/my-bookings`,
        { params: filters }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener reservas:', error);
      throw error;
    }
  }

  /**
   * Obtener todas las reservas (Admin)
   */
  async getAllBookings(filters?: BookingFilters): Promise<PaginatedResponse<Booking>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Booking>>>(
        this.BASE_PATH,
        { params: filters }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener todas las reservas:', error);
      throw error;
    }
  }

  /**
   * Obtener reserva por ID
   */
  async getBookingById(id: string): Promise<Booking> {
    try {
      const response = await api.get<ApiResponse<Booking>>(
        `${this.BASE_PATH}/${id}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener reserva:', error);
      throw error;
    }
  }

  /**
   * Crear nueva reserva
   */
  async createBooking(data: CreateBookingRequest): Promise<Booking> {
    try {
      const response = await api.post<ApiResponse<Booking>>(
        this.BASE_PATH,
        data
      );
      return response.data.data;
    } catch (error) {
      console.error('Error al crear reserva:', error);
      throw error;
    }
  }

  /**
   * Actualizar reserva
   */
  async updateBooking(id: string, data: Partial<CreateBookingRequest>): Promise<Booking> {
    try {
      const response = await api.put<ApiResponse<Booking>>(
        `${this.BASE_PATH}/${id}`,
        data
      );
      return response.data.data;
    } catch (error) {
      console.error('Error al actualizar reserva:', error);
      throw error;
    }
  }

  /**
   * Cancelar reserva
   */
  async cancelBooking(id: string, reason?: string): Promise<Booking> {
    try {
      const response = await api.post<ApiResponse<Booking>>(
        `${this.BASE_PATH}/${id}/cancel`,
        { reason }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      throw error;
    }
  }

  /**
   * Confirmar reserva
   */
  async confirmBooking(id: string): Promise<Booking> {
    try {
      const response = await api.post<ApiResponse<Booking>>(
        `${this.BASE_PATH}/${id}/confirm`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error al confirmar reserva:', error);
      throw error;
    }
  }

  /**
   * Descargar comprobante de reserva (PDF)
   */
  async downloadBookingVoucher(id: string): Promise<Blob> {
    try {
      const response = await api.get(
        `${this.BASE_PATH}/${id}/voucher`,
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      console.error('Error al descargar comprobante:', error);
      throw error;
    }
  }

  /**
   * Obtener reservas próximas
   */
  async getUpcomingBookings(): Promise<Booking[]> {
    try {
      const response = await api.get<ApiResponse<Booking[]>>(
        `${this.BASE_PATH}/upcoming`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener reservas próximas:', error);
      throw error;
    }
  }

  /**
   * Obtener historial de reservas
   */
  async getPastBookings(): Promise<Booking[]> {
    try {
      const response = await api.get<ApiResponse<Booking[]>>(
        `${this.BASE_PATH}/past`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener historial:', error);
      throw error;
    }
  }
}

// Exportar instancia única
export const bookingService = new BookingService();
