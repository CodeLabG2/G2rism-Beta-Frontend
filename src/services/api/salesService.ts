import axiosInstance from './axiosConfig';
import type {
  Venta,
  DetalleVenta,
  Cotizacion,
  DetalleCotizacion,
  VentaFormData,
  CotizacionFormData,
  VentaFilters,
  CotizacionFilters,
  VentaDashboard,
  EstadoVenta,
  EstadoCotizacion,
  TipoVenta,
  MetodoPago,
} from '../../components/admin/views/sales/types';

// Re-exportar tipos para facilitar importación
export type {
  Venta,
  DetalleVenta,
  Cotizacion,
  DetalleCotizacion,
  VentaFormData,
  CotizacionFormData,
  VentaFilters,
  CotizacionFilters,
  VentaDashboard,
  EstadoVenta,
  EstadoCotizacion,
  TipoVenta,
  MetodoPago,
};

export interface VentaStatistics {
  totalVentas: number;
  ventasHoy: number;
  ventasMes: number;
  ventasAnio: number;
  ingresosMes: number;
  ingresosAnio: number;
  ticketPromedio: number;
  comisionesPendientes: number;
}

/**
 * Servicio para gestión de ventas y cotizaciones
 * 
 * @description
 * Maneja todas las operaciones de ventas, cotizaciones,
 * comisiones, descuentos, métodos de pago y reportes.
 * 
 * @author G2rism Team
 * @version 1.0
 */
class SalesService {
  private readonly baseUrl = '/ventas';
  private readonly quotationsUrl = '/cotizaciones';

  // ==================== VENTAS ====================

  /**
   * Obtener todas las ventas (con filtros opcionales)
   */
  async getAll(filters?: VentaFilters): Promise<Venta[]> {
    const params = new URLSearchParams();
    
    if (filters?.idCliente) params.append('idCliente', filters.idCliente.toString());
    if (filters?.idEmpleado) params.append('idEmpleado', filters.idEmpleado.toString());
    if (filters?.estadoVenta) params.append('estadoVenta', filters.estadoVenta);
    if (filters?.tipoVenta) params.append('tipoVenta', filters.tipoVenta);
    if (filters?.fechaInicio) params.append('fechaInicio', filters.fechaInicio);
    if (filters?.fechaFin) params.append('fechaFin', filters.fechaFin);
    if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm);

    const response = await axiosInstance.get(`${this.baseUrl}${params.toString() ? '?' + params.toString() : ''}`);
    return response.data.data;
  }

  /**
   * Obtener venta por ID
   */
  async getById(id: number): Promise<Venta> {
    const response = await axiosInstance.get(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  /**
   * Crear nueva venta
   */
  async create(data: VentaFormData): Promise<Venta> {
    const response = await axiosInstance.post(this.baseUrl, data);
    return response.data.data;
  }

  /**
   * Actualizar venta existente
   */
  async update(id: number, data: Partial<VentaFormData>): Promise<Venta> {
    const response = await axiosInstance.put(`${this.baseUrl}/${id}`, data);
    return response.data.data;
  }

  /**
   * Eliminar venta
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Cambiar estado de la venta
   */
  async changeStatus(id: number, estadoVenta: EstadoVenta): Promise<Venta> {
    const response = await axiosInstance.patch(`${this.baseUrl}/${id}/estado`, { estadoVenta });
    return response.data.data;
  }

  /**
   * Confirmar venta
   */
  async confirm(id: number): Promise<Venta> {
    const response = await axiosInstance.post(`${this.baseUrl}/${id}/confirmar`);
    return response.data.data;
  }

  /**
   * Marcar como pagada
   */
  async markAsPaid(id: number, metodoPago: MetodoPago, fechaPago?: string): Promise<Venta> {
    const response = await axiosInstance.post(`${this.baseUrl}/${id}/pagar`, {
      metodoPago,
      fechaPago: fechaPago || new Date().toISOString(),
    });
    return response.data.data;
  }

  /**
   * Cancelar venta
   */
  async cancel(id: number, motivo?: string): Promise<Venta> {
    const response = await axiosInstance.post(`${this.baseUrl}/${id}/cancelar`, { motivo });
    return response.data.data;
  }

  /**
   * Anular venta
   */
  async annul(id: number, motivo: string): Promise<Venta> {
    const response = await axiosInstance.post(`${this.baseUrl}/${id}/anular`, { motivo });
    return response.data.data;
  }

  /**
   * Obtener ventas por cliente
   */
  async getByClient(idCliente: number): Promise<Venta[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/cliente/${idCliente}`);
    return response.data.data;
  }

  /**
   * Obtener ventas por empleado
   */
  async getByEmployee(idEmpleado: number): Promise<Venta[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/empleado/${idEmpleado}`);
    return response.data.data;
  }

  /**
   * Obtener ventas por estado
   */
  async getByStatus(estadoVenta: EstadoVenta): Promise<Venta[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/estado/${estadoVenta}`);
    return response.data.data;
  }

  /**
   * Obtener ventas por tipo
   */
  async getByType(tipoVenta: TipoVenta): Promise<Venta[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/tipo/${tipoVenta}`);
    return response.data.data;
  }

  /**
   * Obtener ventas del día
   */
  async getToday(): Promise<Venta[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/hoy`);
    return response.data.data;
  }

  /**
   * Obtener ventas del mes
   */
  async getThisMonth(): Promise<Venta[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/mes-actual`);
    return response.data.data;
  }

  /**
   * Obtener estadísticas de ventas
   */
  async getStatistics(): Promise<VentaStatistics> {
    const response = await axiosInstance.get(`${this.baseUrl}/estadisticas`);
    return response.data.data;
  }

  /**
   * Obtener dashboard de ventas
   */
  async getDashboard(): Promise<VentaDashboard> {
    const response = await axiosInstance.get(`${this.baseUrl}/dashboard`);
    return response.data.data;
  }

  /**
   * Buscar ventas
   */
  async search(searchTerm: string): Promise<Venta[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/buscar`, {
      params: { q: searchTerm }
    });
    return response.data.data;
  }

  /**
   * Obtener detalles de una venta
   */
  async getDetails(id: number): Promise<DetalleVenta[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/${id}/detalles`);
    return response.data.data;
  }

  /**
   * Agregar detalle a una venta
   */
  async addDetail(id: number, detalle: Omit<DetalleVenta, 'idDetalle' | 'idVenta'>): Promise<DetalleVenta> {
    const response = await axiosInstance.post(`${this.baseUrl}/${id}/detalles`, detalle);
    return response.data.data;
  }

  /**
   * Actualizar detalle de venta
   */
  async updateDetail(idVenta: number, idDetalle: number, detalle: Partial<DetalleVenta>): Promise<DetalleVenta> {
    const response = await axiosInstance.put(`${this.baseUrl}/${idVenta}/detalles/${idDetalle}`, detalle);
    return response.data.data;
  }

  /**
   * Eliminar detalle de venta
   */
  async deleteDetail(idVenta: number, idDetalle: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${idVenta}/detalles/${idDetalle}`);
  }

  /**
   * Generar factura de venta
   */
  async generateInvoice(id: number): Promise<Blob> {
    const response = await axiosInstance.get(`${this.baseUrl}/${id}/factura`, {
      responseType: 'blob'
    });
    return response.data;
  }

  /**
   * Enviar factura por email
   */
  async sendInvoiceEmail(id: number, email?: string): Promise<void> {
    await axiosInstance.post(`${this.baseUrl}/${id}/enviar-factura`, { email });
  }

  // ==================== COTIZACIONES ====================

  /**
   * Obtener todas las cotizaciones
   */
  async getAllQuotations(filters?: CotizacionFilters): Promise<Cotizacion[]> {
    const params = new URLSearchParams();
    
    if (filters?.idCliente) params.append('idCliente', filters.idCliente.toString());
    if (filters?.idEmpleado) params.append('idEmpleado', filters.idEmpleado.toString());
    if (filters?.estadoCotizacion) params.append('estadoCotizacion', filters.estadoCotizacion);
    if (filters?.fechaInicio) params.append('fechaInicio', filters.fechaInicio);
    if (filters?.fechaFin) params.append('fechaFin', filters.fechaFin);
    if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm);

    const response = await axiosInstance.get(`${this.quotationsUrl}${params.toString() ? '?' + params.toString() : ''}`);
    return response.data.data;
  }

  /**
   * Obtener cotización por ID
   */
  async getQuotationById(id: number): Promise<Cotizacion> {
    const response = await axiosInstance.get(`${this.quotationsUrl}/${id}`);
    return response.data.data;
  }

  /**
   * Crear nueva cotización
   */
  async createQuotation(data: CotizacionFormData): Promise<Cotizacion> {
    const response = await axiosInstance.post(this.quotationsUrl, data);
    return response.data.data;
  }

  /**
   * Actualizar cotización
   */
  async updateQuotation(id: number, data: Partial<CotizacionFormData>): Promise<Cotizacion> {
    const response = await axiosInstance.put(`${this.quotationsUrl}/${id}`, data);
    return response.data.data;
  }

  /**
   * Eliminar cotización
   */
  async deleteQuotation(id: number): Promise<void> {
    await axiosInstance.delete(`${this.quotationsUrl}/${id}`);
  }

  /**
   * Cambiar estado de cotización
   */
  async changeQuotationStatus(id: number, estadoCotizacion: EstadoCotizacion): Promise<Cotizacion> {
    const response = await axiosInstance.patch(`${this.quotationsUrl}/${id}/estado`, { estadoCotizacion });
    return response.data.data;
  }

  /**
   * Enviar cotización por email
   */
  async sendQuotationEmail(id: number, email?: string): Promise<void> {
    await axiosInstance.post(`${this.quotationsUrl}/${id}/enviar`, { email });
  }

  /**
   * Aceptar cotización
   */
  async acceptQuotation(id: number): Promise<Cotizacion> {
    const response = await axiosInstance.post(`${this.quotationsUrl}/${id}/aceptar`);
    return response.data.data;
  }

  /**
   * Rechazar cotización
   */
  async rejectQuotation(id: number, motivo?: string): Promise<Cotizacion> {
    const response = await axiosInstance.post(`${this.quotationsUrl}/${id}/rechazar`, { motivo });
    return response.data.data;
  }

  /**
   * Convertir cotización a venta
   */
  async convertToSale(id: number): Promise<Venta> {
    const response = await axiosInstance.post(`${this.quotationsUrl}/${id}/convertir`);
    return response.data.data;
  }

  /**
   * Generar PDF de cotización
   */
  async generateQuotationPDF(id: number): Promise<Blob> {
    const response = await axiosInstance.get(`${this.quotationsUrl}/${id}/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  }

  /**
   * Obtener cotizaciones vencidas
   */
  async getExpiredQuotations(): Promise<Cotizacion[]> {
    const response = await axiosInstance.get(`${this.quotationsUrl}/vencidas`);
    return response.data.data;
  }

  /**
   * Obtener cotizaciones pendientes
   */
  async getPendingQuotations(): Promise<Cotizacion[]> {
    const response = await axiosInstance.get(`${this.quotationsUrl}/pendientes`);
    return response.data.data;
  }
}

// Exportar instancia única (singleton)
const salesService = new SalesService();
export default salesService;
