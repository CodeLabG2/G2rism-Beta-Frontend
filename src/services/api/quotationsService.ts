import axiosInstance from './axiosInstance';
import API_ENDPOINTS from './config/endpoints';

export type EstadoCotizacion = 'Pendiente' | 'Enviada' | 'Aceptada' | 'Rechazada' | 'Vencida' | 'Convertida';

export interface Cotizacion {
  idCotizacion: number;
  numeroCotizacion: string;
  idCliente: number;
  idEmpleado: number;
  fechaCotizacion: string;
  fechaValidez: string;
  subtotal: number;
  descuento: number;
  impuestos: number;
  total: number;
  moneda: string;
  estadoCotizacion: EstadoCotizacion;
  observaciones?: string;
  // Datos relacionados
  nombreCliente?: string;
  nombreEmpleado?: string;
  detalles?: DetalleCotizacion[];
  diasValidez?: number;
  estaVencida?: boolean;
}

export interface DetalleCotizacion {
  idDetalle: number;
  idCotizacion: number;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  subtotal: number;
}

export interface CreateCotizacionDTO {
  idCliente: number;
  idEmpleado: number;
  fechaCotizacion: string;
  fechaValidez: string;
  subtotal: number;
  descuento: number;
  impuestos: number;
  total: number;
  moneda: string;
  estadoCotizacion?: EstadoCotizacion;
  observaciones?: string;
  detalles?: Omit<DetalleCotizacion, 'idDetalle' | 'idCotizacion'>[];
}

export interface UpdateCotizacionDTO extends Partial<CreateCotizacionDTO> {}

export interface CotizacionFilters {
  idCliente?: number;
  idEmpleado?: number;
  estadoCotizacion?: EstadoCotizacion;
  fechaInicio?: string;
  fechaFin?: string;
  searchTerm?: string;
}

class QuotationsService {
  /**
   * Obtener todas las cotizaciones (con filtros opcionales)
   */
  async getAll(filters?: CotizacionFilters): Promise<Cotizacion[]> {
    const params = new URLSearchParams();
    
    if (filters?.idCliente) params.append('idCliente', filters.idCliente.toString());
    if (filters?.idEmpleado) params.append('idEmpleado', filters.idEmpleado.toString());
    if (filters?.estadoCotizacion) params.append('estadoCotizacion', filters.estadoCotizacion);
    if (filters?.fechaInicio) params.append('fechaInicio', filters.fechaInicio);
    if (filters?.fechaFin) params.append('fechaFin', filters.fechaFin);
    if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm);

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.COTIZACIONES.BASE}${params.toString() ? '?' + params.toString() : ''}`
    );
    return response.data.data;
  }

  /**
   * Obtener cotización por ID
   */
  async getById(id: number): Promise<Cotizacion> {
    const response = await axiosInstance.get(API_ENDPOINTS.COTIZACIONES.BY_ID(id));
    return response.data.data;
  }

  /**
   * Obtener cotización por número
   */
  async getByNumero(numero: string): Promise<Cotizacion> {
    const response = await axiosInstance.get(API_ENDPOINTS.COTIZACIONES.BY_NUMERO(numero));
    return response.data.data;
  }

  /**
   * Crear nueva cotización
   */
  async create(data: CreateCotizacionDTO): Promise<Cotizacion> {
    const response = await axiosInstance.post(API_ENDPOINTS.COTIZACIONES.BASE, data);
    return response.data.data;
  }

  /**
   * Actualizar cotización
   */
  async update(id: number, data: UpdateCotizacionDTO): Promise<Cotizacion> {
    const response = await axiosInstance.put(API_ENDPOINTS.COTIZACIONES.BY_ID(id), data);
    return response.data.data;
  }

  /**
   * Eliminar cotización
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.COTIZACIONES.BY_ID(id));
  }

  /**
   * Obtener cotizaciones por cliente
   */
  async getByCliente(idCliente: number): Promise<Cotizacion[]> {
    const response = await axiosInstance.get(API_ENDPOINTS.COTIZACIONES.BY_CLIENTE(idCliente));
    return response.data.data;
  }

  /**
   * Obtener cotizaciones pendientes
   */
  async getPendientes(): Promise<Cotizacion[]> {
    const response = await axiosInstance.get(API_ENDPOINTS.COTIZACIONES.PENDIENTES);
    return response.data.data;
  }

  /**
   * Obtener cotizaciones aceptadas
   */
  async getAceptadas(): Promise<Cotizacion[]> {
    const response = await axiosInstance.get(API_ENDPOINTS.COTIZACIONES.ACEPTADAS);
    return response.data.data;
  }

  /**
   * Obtener cotizaciones rechazadas
   */
  async getRechazadas(): Promise<Cotizacion[]> {
    const response = await axiosInstance.get(API_ENDPOINTS.COTIZACIONES.RECHAZADAS);
    return response.data.data;
  }

  /**
   * Obtener cotizaciones vencidas
   */
  async getVencidas(): Promise<Cotizacion[]> {
    const response = await axiosInstance.get(API_ENDPOINTS.COTIZACIONES.VENCIDAS);
    return response.data.data;
  }

  /**
   * Aceptar cotización
   */
  async aceptar(id: number): Promise<Cotizacion> {
    const response = await axiosInstance.patch(API_ENDPOINTS.COTIZACIONES.ACEPTAR(id));
    return response.data.data;
  }

  /**
   * Rechazar cotización
   */
  async rechazar(id: number, motivo: string): Promise<Cotizacion> {
    const response = await axiosInstance.patch(API_ENDPOINTS.COTIZACIONES.RECHAZAR(id), { motivo });
    return response.data.data;
  }

  /**
   * Convertir cotización a venta
   */
  async convertirAVenta(id: number): Promise<any> {
    const response = await axiosInstance.post(API_ENDPOINTS.COTIZACIONES.CONVERTIR_A_VENTA(id));
    return response.data.data;
  }

  /**
   * Obtener estadísticas de cotizaciones
   */
  async getEstadisticas() {
    const response = await axiosInstance.get(API_ENDPOINTS.COTIZACIONES.ESTADISTICAS);
    return response.data.data;
  }

  /**
   * Buscar cotizaciones
   */
  async search(searchTerm: string): Promise<Cotizacion[]> {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.COTIZACIONES.BUSCAR}?q=${encodeURIComponent(searchTerm)}`
    );
    return response.data.data;
  }
}

export default new QuotationsService();
