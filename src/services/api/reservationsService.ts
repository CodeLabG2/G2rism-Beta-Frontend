import axiosInstance from './axiosConfig';
import type { ApiResponse } from '../types/api.types';

// ==================== TIPOS CORREGIDOS ====================

/**
 * Reserva - DEBE COINCIDIR con ReservaResponseDto del backend
 */
export interface Reserva {
  idReserva: number;
  idCliente: number;
  nombreCliente: string;
  idEmpleado: number;
  nombreEmpleado: string;
  descripcion?: string;
  fechaInicioViaje: string; // DateTime del backend
  fechaFinViaje: string; // DateTime del backend
  duracionDias: number; // Calculado por el backend
  numeroPasajeros: number;
  montoTotal: number;
  montoPagado: number;
  saldoPendiente: number;
  porcentajePagado: number;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  estaPagada: boolean; // Calculado
  tieneSaldoPendiente: boolean; // Calculado
  viajeIniciado: boolean; // Calculado
  viajeCompleto: boolean; // Calculado
  diasHastaViaje: number; // Calculado
  observaciones?: string;
  fechaHora: string; // Fecha de creación
  fechaModificacion?: string;
}

/**
 * DTO para crear reserva básica - ReservaCreateDto del backend
 */
export interface CreateReservaDTO {
  idCliente: number;
  idEmpleado: number;
  descripcion?: string;
  fechaInicioViaje: string; // formato: YYYY-MM-DD
  fechaFinViaje: string; // formato: YYYY-MM-DD
  numeroPasajeros: number;
  estado?: 'pendiente' | 'confirmada';
  observaciones?: string;
}

/**
 * DTO para actualizar reserva - ReservaUpdateDto del backend
 */
export interface UpdateReservaDTO {
  descripcion?: string;
  fechaInicioViaje?: string;
  fechaFinViaje?: string;
  numeroPasajeros?: number;
  estado?: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  observaciones?: string;
}

/**
 * DTO para reserva completa con servicios - ReservaCompletaCreateDto del backend
 */
export interface CreateReservaCompletaDTO {
  // Datos básicos
  idCliente: number;
  idEmpleado: number;
  descripcion?: string;
  fechaInicioViaje: string;
  fechaFinViaje: string;
  numeroPasajeros: number;
  estado?: 'pendiente' | 'confirmada';
  observaciones?: string;
  // Servicios
  hoteles?: ReservaHotelCreateDTO[];
  vuelos?: ReservaVueloCreateDTO[];
  paquetes?: ReservaPaqueteCreateDTO[];
  servicios?: ReservaServicioCreateDTO[];
}

// Sub-tipos para servicios de reserva
export interface ReservaHotelCreateDTO {
  idHotel: number;
  fechaCheckIn: string;
  fechaCheckOut: string;
  numeroHabitaciones: number;
  tipoHabitacion?: string;
  precioNoche: number;
  incluyeDesayuno: boolean;
  regimen?: string;
  observaciones?: string;
}

export interface ReservaVueloCreateDTO {
  idVuelo: number;
  numeroPasajeros: number;
  clase: string;
  precioTotal: number;
  equipajeIncluido: boolean;
  equipajeAdicional?: number;
  asientosSeleccionados?: string;
  observaciones?: string;
}

export interface ReservaPaqueteCreateDTO {
  idPaquete: number;
  numeroPasajeros: number;
  precioFinal: number;
  descuentoAplicado?: number;
  observaciones?: string;
}

export interface ReservaServicioCreateDTO {
  idServicio: number;
  cantidad: number;
  precioUnitario: number;
  descripcion?: string;
}

/**
 * Filtros para búsqueda de reservas
 */
export interface ReservaFilters {
  estado?: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  idCliente?: number;
  fechaDesde?: string;
  fechaHasta?: string;
}

/**
 * Servicio para gestión de reservas
 *
 * Backend: ReservasController
 * Base URL: /api/reservas
 *
 * IMPORTANTE: El backend NO tiene concepto de "tipo" de reserva (Vuelo, Hotel, Paquete).
 * Las reservas son contenedoras que pueden tener múltiples servicios asociados.
 *
 * @author G2rism Team
 * @version 2.0 - CORREGIDO para coincidir con backend real
 */
class ReservationsService {
  private readonly baseUrl = '/api/reservas';

  /**
   * Obtener todas las reservas
   * GET /api/reservas
   */
  async getAll(filters?: ReservaFilters): Promise<Reserva[]> {
    const params = new URLSearchParams();

    if (filters?.estado) params.append('estado', filters.estado);
    if (filters?.idCliente) params.append('idCliente', filters.idCliente.toString());
    if (filters?.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
    if (filters?.fechaHasta) params.append('fechaHasta', filters.fechaHasta);

    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;

    const response = await axiosInstance.get<ApiResponse<Reserva[]>>(url);
    return response.data.data;
  }

  /**
   * Obtener reserva por ID
   * GET /api/reservas/{id}
   */
  async getById(id: number): Promise<Reserva> {
    const response = await axiosInstance.get<ApiResponse<Reserva>>(
      `${this.baseUrl}/${id}`
    );
    return response.data.data;
  }

  /**
   * Obtener reservas por cliente
   * GET /api/reservas/cliente/{idCliente}
   */
  async getByClient(idCliente: number): Promise<Reserva[]> {
    const response = await axiosInstance.get<ApiResponse<Reserva[]>>(
      `${this.baseUrl}/cliente/${idCliente}`
    );
    return response.data.data;
  }

  /**
   * Obtener reservas por estado
   * GET /api/reservas/estado/{estado}
   *
   * @param estado pendiente, confirmada, cancelada, completada
   */
  async getByStatus(estado: string): Promise<Reserva[]> {
    const response = await axiosInstance.get<ApiResponse<Reserva[]>>(
      `${this.baseUrl}/estado/${estado}`
    );
    return response.data.data;
  }

  /**
   * Crear nueva reserva básica
   * POST /api/reservas
   *
   * Para reservas simples sin servicios asociados
   */
  async create(data: CreateReservaDTO): Promise<Reserva> {
    const response = await axiosInstance.post<ApiResponse<Reserva>>(
      this.baseUrl,
      data
    );
    return response.data.data;
  }

  /**
   * Crear reserva completa con servicios
   * POST /api/reservas/completa
   *
   * Permite crear una reserva y asignarle hoteles, vuelos, paquetes y servicios en una sola transacción
   */
  async createComplete(data: CreateReservaCompletaDTO): Promise<Reserva> {
    const response = await axiosInstance.post<ApiResponse<Reserva>>(
      `${this.baseUrl}/completa`,
      data
    );
    return response.data.data;
  }

  /**
   * Actualizar reserva existente
   * PUT /api/reservas/{id}
   */
  async update(id: number, data: UpdateReservaDTO): Promise<Reserva> {
    const response = await axiosInstance.put<ApiResponse<Reserva>>(
      `${this.baseUrl}/${id}`,
      data
    );
    return response.data.data;
  }

  /**
   * Eliminar reserva
   * DELETE /api/reservas/{id}
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Confirmar reserva
   * POST /api/reservas/{id}/confirmar
   */
  async confirm(id: number): Promise<Reserva> {
    const response = await axiosInstance.post<ApiResponse<Reserva>>(
      `${this.baseUrl}/${id}/confirmar`
    );
    return response.data.data;
  }

  /**
   * Cancelar reserva
   * POST /api/reservas/{id}/cancelar
   *
   * @param id ID de la reserva
   * @param motivoCancelacion Motivo de la cancelación (opcional)
   */
  async cancel(id: number, motivoCancelacion?: string): Promise<Reserva> {
    const response = await axiosInstance.post<ApiResponse<Reserva>>(
      `${this.baseUrl}/${id}/cancelar`,
      { motivoCancelacion }
    );
    return response.data.data;
  }

  // ===========================
  // GESTIÓN DE HOTELES
  // ===========================

  /**
   * Agregar hotel a una reserva
   * POST /api/reservas/{id}/hoteles
   */
  async addHotel(id: number, hotel: ReservaHotelCreateDTO): Promise<Reserva> {
    const response = await axiosInstance.post<ApiResponse<Reserva>>(
      `${this.baseUrl}/${id}/hoteles`,
      hotel
    );
    return response.data.data;
  }

  /**
   * Eliminar hotel de una reserva
   * DELETE /api/reservas/{id}/hoteles/{idHotel}
   */
  async removeHotel(id: number, idHotel: number): Promise<Reserva> {
    const response = await axiosInstance.delete<ApiResponse<Reserva>>(
      `${this.baseUrl}/${id}/hoteles/${idHotel}`
    );
    return response.data.data;
  }

  // ===========================
  // GESTIÓN DE VUELOS
  // ===========================

  /**
   * Agregar vuelo a una reserva
   * POST /api/reservas/{id}/vuelos
   */
  async addFlight(id: number, vuelo: ReservaVueloCreateDTO): Promise<Reserva> {
    const response = await axiosInstance.post<ApiResponse<Reserva>>(
      `${this.baseUrl}/${id}/vuelos`,
      vuelo
    );
    return response.data.data;
  }

  /**
   * Eliminar vuelo de una reserva
   * DELETE /api/reservas/{id}/vuelos/{idVuelo}
   */
  async removeFlight(id: number, idVuelo: number): Promise<Reserva> {
    const response = await axiosInstance.delete<ApiResponse<Reserva>>(
      `${this.baseUrl}/${id}/vuelos/${idVuelo}`
    );
    return response.data.data;
  }

  // ===========================
  // GESTIÓN DE PAQUETES
  // ===========================

  /**
   * Agregar paquete turístico a una reserva
   * POST /api/reservas/{id}/paquetes
   */
  async addPackage(id: number, paquete: ReservaPaqueteCreateDTO): Promise<Reserva> {
    const response = await axiosInstance.post<ApiResponse<Reserva>>(
      `${this.baseUrl}/${id}/paquetes`,
      paquete
    );
    return response.data.data;
  }

  /**
   * Eliminar paquete de una reserva
   * DELETE /api/reservas/{id}/paquetes/{idPaquete}
   */
  async removePackage(id: number, idPaquete: number): Promise<Reserva> {
    const response = await axiosInstance.delete<ApiResponse<Reserva>>(
      `${this.baseUrl}/${id}/paquetes/${idPaquete}`
    );
    return response.data.data;
  }

  // ===========================
  // GESTIÓN DE SERVICIOS ADICIONALES
  // ===========================

  /**
   * Agregar servicio adicional a una reserva
   * POST /api/reservas/{id}/servicios
   */
  async addService(id: number, servicio: ReservaServicioCreateDTO): Promise<Reserva> {
    const response = await axiosInstance.post<ApiResponse<Reserva>>(
      `${this.baseUrl}/${id}/servicios`,
      servicio
    );
    return response.data.data;
  }

  /**
   * Eliminar servicio de una reserva
   * DELETE /api/reservas/{id}/servicios/{idServicio}
   */
  async removeService(id: number, idServicio: number): Promise<Reserva> {
    const response = await axiosInstance.delete<ApiResponse<Reserva>>(
      `${this.baseUrl}/${id}/servicios/${idServicio}`
    );
    return response.data.data;
  }

  // ===========================
  // MÉTODOS DE UTILIDAD
  // ===========================

  /**
   * Obtener reservas pendientes
   */
  async getPending(): Promise<Reserva[]> {
    return this.getByStatus('pendiente');
  }

  /**
   * Obtener reservas confirmadas
   */
  async getConfirmed(): Promise<Reserva[]> {
    return this.getByStatus('confirmada');
  }

  /**
   * Obtener reservas canceladas
   */
  async getCanceled(): Promise<Reserva[]> {
    return this.getByStatus('cancelada');
  }

  /**
   * Obtener reservas completadas
   */
  async getCompleted(): Promise<Reserva[]> {
    return this.getByStatus('completada');
  }

  /**
   * Buscar reservas por término (búsqueda local)
   */
  async search(searchTerm: string): Promise<Reserva[]> {
    const all = await this.getAll();
    const term = searchTerm.toLowerCase();
    return all.filter(r =>
      r.nombreCliente.toLowerCase().includes(term) ||
      r.nombreEmpleado.toLowerCase().includes(term) ||
      r.descripcion?.toLowerCase().includes(term)
    );
  }

  /**
   * Calcular estadísticas localmente
   */
  async getStatistics() {
    const all = await this.getAll();

    return {
      total: all.length,
      pendientes: all.filter(r => r.estado === 'pendiente').length,
      confirmadas: all.filter(r => r.estado === 'confirmada').length,
      canceladas: all.filter(r => r.estado === 'cancelada').length,
      completadas: all.filter(r => r.estado === 'completada').length,
      ingresoTotal: all.reduce((sum, r) => sum + r.montoPagado, 0),
      saldoPendiente: all.reduce((sum, r) => sum + r.saldoPendiente, 0),
    };
  }
}

// Exportar instancia única (singleton)
const reservationsService = new ReservationsService();
export default reservationsService;

// Re-exportar tipo
export type { Reserva as Reservation };
