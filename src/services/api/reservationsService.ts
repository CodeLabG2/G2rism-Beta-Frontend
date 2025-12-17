import axiosInstance from './axiosConfig';

// ==================== TIPOS ====================

export type TipoReserva = 'Vuelo' | 'Hotel' | 'Paquete' | 'Transporte';
export type EstadoReserva = 'Pendiente' | 'Confirmada' | 'Cancelada' | 'Completada';
export type EstadoPago = 'Pendiente' | 'Parcial' | 'Pagado' | 'Reembolsado';

export interface ClienteReserva {
  idCliente: number;
  nombres: string;
  apellidos: string;
  correoElectronico: string;
  telefono: string;
}

export interface DetalleVuelo {
  aerolinea: string;
  numeroVuelo: string;
  origen: string;
  destino: string;
  fechaSalida: string;
  fechaLlegada: string;
  clase: 'Economica' | 'Ejecutiva' | 'Primera';
}

export interface DetalleHotel {
  nombreHotel: string;
  ubicacion: string;
  fechaCheckIn: string;
  fechaCheckOut: string;
  tipoHabitacion: string;
  numeroNoches: number;
}

export interface DetallePaquete {
  idPaquete: number;
  nombrePaquete: string;
  destino: string;
  fechaInicio: string;
  fechaFin: string;
  duracion: number;
  incluyeVuelos: boolean;
  incluyeHotel: boolean;
}

export interface EventoReserva {
  idEvento: number;
  tipo: string; // 'creacion', 'confirmacion', 'pago', 'modificacion', 'cancelacion'
  descripcion: string;
  fecha: string;
  usuario: string;
}

export interface PagoReserva {
  idPago: number;
  monto: number;
  metodoPago: string;
  fecha: string;
  referencia?: string;
  usuario: string;
}

export interface Reserva {
  idReserva: number;
  codigo: string;
  tipo: TipoReserva;
  idCliente: number;
  cliente?: ClienteReserva; // Poblado por JOIN
  estado: EstadoReserva;
  estadoPago: EstadoPago;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: string;
  actualizadoPor?: string;
  
  // Montos
  montoTotal: number;
  montoPagado: number;
  saldo: number;
  
  // Detalles opcionales según tipo
  detalleVuelo?: DetalleVuelo;
  detalleHotel?: DetalleHotel;
  detallePaquete?: DetallePaquete;
  
  // Información adicional
  observaciones?: string;
  eventos?: EventoReserva[];
  pagos?: PagoReserva[];
  
  // Datos de viaje
  fechaViaje?: string;
  numeroViajeros?: number;
}

export interface CreateReservaDTO {
  tipo: TipoReserva;
  idCliente: number;
  estado?: EstadoReserva;
  estadoPago?: EstadoPago;
  montoTotal: number;
  montoPagado?: number;
  observaciones?: string;
  fechaViaje?: string;
  numeroViajeros?: number;
  
  // Detalles opcionales
  detalleVuelo?: Partial<DetalleVuelo>;
  detalleHotel?: Partial<DetalleHotel>;
  detallePaquete?: Partial<DetallePaquete>;
}

export interface UpdateReservaDTO extends Partial<CreateReservaDTO> {}

export interface ReservaFilters {
  tipo?: TipoReserva;
  estado?: EstadoReserva;
  estadoPago?: EstadoPago;
  idCliente?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  searchTerm?: string;
}

export interface ReservaStatistics {
  total: number;
  pendientes: number;
  confirmadas: number;
  canceladas: number;
  completadas: number;
  ingresoTotal: number;
  saldoPendiente: number;
}

// ==================== SERVICIO ====================

/**
 * Servicio para gestión de reservas
 * 
 * @description
 * Maneja todas las operaciones de reservas incluyendo vuelos,
 * hoteles, paquetes turísticos y transporte. Gestiona estados,
 * pagos, eventos y toda la trazabilidad de las reservas.
 * 
 * @author G2rism Team
 * @version 1.0
 */
class ReservationsService {
  private readonly baseUrl = '/api/reservas';

  /**
   * Obtener todas las reservas (con filtros opcionales)
   */
  async getAll(filters?: ReservaFilters): Promise<Reserva[]> {
    const params = new URLSearchParams();
    
    if (filters?.tipo) params.append('tipo', filters.tipo);
    if (filters?.estado) params.append('estado', filters.estado);
    if (filters?.estadoPago) params.append('estadoPago', filters.estadoPago);
    if (filters?.idCliente) params.append('idCliente', filters.idCliente.toString());
    if (filters?.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
    if (filters?.fechaHasta) params.append('fechaHasta', filters.fechaHasta);
    if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm);

    const response = await axiosInstance.get(`${this.baseUrl}${params.toString() ? '?' + params.toString() : ''}`);
    return response.data.data;
  }

  /**
   * Obtener reserva por ID
   */
  async getById(id: number): Promise<Reserva> {
    const response = await axiosInstance.get(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  /**
   * Crear nueva reserva
   */
  async create(data: CreateReservaDTO): Promise<Reserva> {
    const response = await axiosInstance.post(this.baseUrl, data);
    return response.data.data;
  }

  /**
   * Actualizar reserva existente
   */
  async update(id: number, data: UpdateReservaDTO): Promise<Reserva> {
    const response = await axiosInstance.put(`${this.baseUrl}/${id}`, data);
    return response.data.data;
  }

  /**
   * Eliminar reserva
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Cambiar estado de la reserva
   */
  async changeStatus(id: number, estado: EstadoReserva): Promise<Reserva> {
    const response = await axiosInstance.patch(`${this.baseUrl}/${id}/estado`, { estado });
    return response.data.data;
  }

  /**
   * Confirmar reserva
   */
  async confirm(id: number): Promise<Reserva> {
    const response = await axiosInstance.post(`${this.baseUrl}/${id}/confirmar`);
    return response.data.data;
  }

  /**
   * Cancelar reserva
   */
  async cancel(id: number, motivo?: string): Promise<Reserva> {
    const response = await axiosInstance.post(`${this.baseUrl}/${id}/cancelar`, { motivo });
    return response.data.data;
  }

  /**
   * Completar reserva
   */
  async complete(id: number): Promise<Reserva> {
    const response = await axiosInstance.post(`${this.baseUrl}/${id}/completar`);
    return response.data.data;
  }

  /**
   * Registrar pago para una reserva
   */
  async addPayment(id: number, pago: {
    monto: number;
    metodoPago: string;
    referencia?: string;
  }): Promise<Reserva> {
    const response = await axiosInstance.post(`${this.baseUrl}/${id}/pagos`, pago);
    return response.data.data;
  }

  /**
   * Obtener historial de pagos de una reserva
   */
  async getPayments(id: number): Promise<PagoReserva[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/${id}/pagos`);
    return response.data.data;
  }

  /**
   * Obtener eventos/timeline de una reserva
   */
  async getEvents(id: number): Promise<EventoReserva[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/${id}/eventos`);
    return response.data.data;
  }

  /**
   * Agregar evento a la reserva
   */
  async addEvent(id: number, evento: {
    tipo: string;
    descripcion: string;
  }): Promise<EventoReserva> {
    const response = await axiosInstance.post(`${this.baseUrl}/${id}/eventos`, evento);
    return response.data.data;
  }

  /**
   * Obtener reservas por cliente
   */
  async getByClient(idCliente: number): Promise<Reserva[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/cliente/${idCliente}`);
    return response.data.data;
  }

  /**
   * Obtener reservas por tipo
   */
  async getByType(tipo: TipoReserva): Promise<Reserva[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/tipo/${tipo}`);
    return response.data.data;
  }

  /**
   * Obtener reservas por estado
   */
  async getByStatus(estado: EstadoReserva): Promise<Reserva[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/estado/${estado}`);
    return response.data.data;
  }

  /**
   * Obtener reservas pendientes
   */
  async getPending(): Promise<Reserva[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/pendientes`);
    return response.data.data;
  }

  /**
   * Obtener reservas confirmadas
   */
  async getConfirmed(): Promise<Reserva[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/confirmadas`);
    return response.data.data;
  }

  /**
   * Obtener estadísticas de reservas
   */
  async getStatistics(): Promise<ReservaStatistics> {
    const response = await axiosInstance.get(`${this.baseUrl}/estadisticas`);
    return response.data.data;
  }

  /**
   * Buscar reservas
   */
  async search(searchTerm: string): Promise<Reserva[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/buscar`, {
      params: { q: searchTerm }
    });
    return response.data.data;
  }

  /**
   * Generar voucher de reserva
   */
  async generateVoucher(id: number): Promise<Blob> {
    const response = await axiosInstance.get(`${this.baseUrl}/${id}/voucher`, {
      responseType: 'blob'
    });
    return response.data;
  }

  /**
   * Enviar confirmación por email
   */
  async sendConfirmationEmail(id: number, email?: string): Promise<void> {
    await axiosInstance.post(`${this.baseUrl}/${id}/enviar-confirmacion`, { email });
  }

  /**
   * Obtener reservas por rango de fechas
   */
  async getByDateRange(fechaDesde: string, fechaHasta: string): Promise<Reserva[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/rango-fechas`, {
      params: { fechaDesde, fechaHasta }
    });
    return response.data.data;
  }

  /**
   * Actualizar detalles de vuelo
   */
  async updateFlightDetails(id: number, detalleVuelo: DetalleVuelo): Promise<Reserva> {
    const response = await axiosInstance.put(`${this.baseUrl}/${id}/vuelo`, detalleVuelo);
    return response.data.data;
  }

  /**
   * Actualizar detalles de hotel
   */
  async updateHotelDetails(id: number, detalleHotel: DetalleHotel): Promise<Reserva> {
    const response = await axiosInstance.put(`${this.baseUrl}/${id}/hotel`, detalleHotel);
    return response.data.data;
  }

  /**
   * Actualizar detalles de paquete
   */
  async updatePackageDetails(id: number, detallePaquete: DetallePaquete): Promise<Reserva> {
    const response = await axiosInstance.put(`${this.baseUrl}/${id}/paquete`, detallePaquete);
    return response.data.data;
  }
}

// Exportar instancia única (singleton)
const reservationsService = new ReservationsService();
export default reservationsService;

// Re-exportar tipos para facilitar importación
export type { Reserva as Reservation };
