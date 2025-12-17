/**
 * ⚠️ SERVICIO - MODIFICADO PARA USAR SOLO API REAL
 *
 * Se eliminó el fallback a datos mock.
 * Ahora usa únicamente la API real del backend.
 *
 * Fecha de modificación: 2025-12-16
 * Razón: Pruebas de integración con API real G2rismBeta.API
 */

import axiosInstance from './axiosConfig';
import API_ENDPOINTS from './config/endpoints';

export type EstadoFactura = 'Borrador' | 'Enviada_DIAN' | 'Aprobada_DIAN' | 'Rechazada_DIAN' | 'Anulada';
export type TipoDocumento = 'Factura' | 'Nota_Credito' | 'Nota_Debito';

export interface Factura {
  idFactura: number;
  numeroFactura: string;
  prefijo: string;
  idVenta: number;
  idCliente: number;
  fechaEmision: string;
  fechaVencimiento: string;
  subtotal: number;
  descuento: number;
  impuestos: number;
  total: number;
  moneda: string;
  estadoFactura: EstadoFactura;
  cufeDIAN?: string;
  cufe?: string;
  fechaEnvioDIAN?: string;
  fechaAprobacionDIAN?: string;
  mensajeRespuestaDIAN?: string;
  archivoXML?: string;
  archivoPDF?: string;
  emailEnviado: boolean;
  observaciones?: string;
  // Datos relacionados
  numeroVenta?: string;
  nombreCliente?: string;
  documentoCliente?: string;
  detalles?: DetalleFactura[];
}

export interface DetalleFactura {
  idDetalle: number;
  idFactura: number;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  impuesto: number;
  subtotal: number;
}

export interface NotaCredito {
  idNotaCredito: number;
  numeroNotaCredito: string;
  prefijo: string;
  idFactura: number;
  idCliente: number;
  fechaEmision: string;
  motivo: string;
  subtotal: number;
  descuento: number;
  impuestos: number;
  total: number;
  moneda: string;
  estadoNota: EstadoFactura;
  cufeDIAN?: string;
  fechaEnvioDIAN?: string;
  archivoXML?: string;
  archivoPDF?: string;
  observaciones?: string;
  // Datos relacionados
  numeroFactura?: string;
  nombreCliente?: string;
}

export interface NotaDebito {
  idNotaDebito: number;
  numeroNotaDebito: string;
  prefijo: string;
  idFactura: number;
  idCliente: number;
  fechaEmision: string;
  motivo: string;
  subtotal: number;
  descuento: number;
  impuestos: number;
  total: number;
  moneda: string;
  estadoNota: EstadoFactura;
  cufeDIAN?: string;
  fechaEnvioDIAN?: string;
  archivoXML?: string;
  archivoPDF?: string;
  observaciones?: string;
  // Datos relacionados
  numeroFactura?: string;
  nombreCliente?: string;
}

export interface CreateFacturaDTO {
  idVenta: number;
  prefijo?: string;
  fechaEmision: string;
  fechaVencimiento: string;
  subtotal: number;
  descuento: number;
  impuestos: number;
  total: number;
  moneda: string;
  estadoFactura?: EstadoFactura;
  observaciones?: string;
}

export interface UpdateFacturaDTO extends Partial<CreateFacturaDTO> {}

export interface FacturaFilters {
  idCliente?: number;
  estadoFactura?: EstadoFactura;
  fechaInicio?: string;
  fechaFin?: string;
  searchTerm?: string;
}

export interface FacturaDashboard {
  totalFacturas: number;
  facturasMes: number;
  facturasAprobadas: number;
  facturasPendientes: number;
  totalFacturado: number;
  totalFacturadoMes: number;
  facturasRecientes: Factura[];
  facturasPorEstado: { estado: string; cantidad: number }[];
}

class InvoicesService {
  /**
   * Obtener todas las facturas (con filtros opcionales)
   */
  async getAll(filters?: FacturaFilters): Promise<Factura[]> {
    const params = new URLSearchParams();

    if (filters?.idCliente) params.append('idCliente', filters.idCliente.toString());
    if (filters?.estadoFactura) params.append('estadoFactura', filters.estadoFactura);
    if (filters?.fechaInicio) params.append('fechaInicio', filters.fechaInicio);
    if (filters?.fechaFin) params.append('fechaFin', filters.fechaFin);
    if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm);

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.FACTURAS.BASE}${params.toString() ? '?' + params.toString() : ''}`
    );
    return response.data.data;
  }

  /**
   * Obtener factura por ID
   */
  async getById(id: number): Promise<Factura> {
    const response = await axiosInstance.get(API_ENDPOINTS.FACTURAS.BY_ID(id));
    return response.data.data;
  }

  /**
   * Obtener factura por número
   */
  async getByNumero(numero: string): Promise<Factura> {
    const response = await axiosInstance.get(API_ENDPOINTS.FACTURAS.BY_NUMERO(numero));
    return response.data.data;
  }

  /**
   * Crear nueva factura desde una venta
   */
  async create(data: CreateFacturaDTO): Promise<Factura> {
    const response = await axiosInstance.post(API_ENDPOINTS.FACTURAS.BASE, data);
    return response.data.data;
  }

  /**
   * Actualizar factura
   */
  async update(id: number, data: UpdateFacturaDTO): Promise<Factura> {
    const response = await axiosInstance.put(API_ENDPOINTS.FACTURAS.BY_ID(id), data);
    return response.data.data;
  }

  /**
   * Eliminar factura (solo si está en borrador)
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.FACTURAS.BY_ID(id));
  }

  /**
   * Obtener facturas por venta
   */
  async getByVenta(idVenta: number): Promise<Factura[]> {
    const response = await axiosInstance.get(API_ENDPOINTS.FACTURAS.BY_VENTA(idVenta));
    return response.data.data;
  }

  /**
   * Obtener facturas por cliente
   */
  async getByCliente(idCliente: number): Promise<Factura[]> {
    const response = await axiosInstance.get(API_ENDPOINTS.FACTURAS.BY_CLIENTE(idCliente));
    return response.data.data;
  }

  /**
   * Obtener facturas por estado
   */
  async getByEstado(estado: EstadoFactura): Promise<Factura[]> {
    const response = await axiosInstance.get(API_ENDPOINTS.FACTURAS.POR_ESTADO(estado));
    return response.data.data;
  }

  /**
   * Obtener facturas pendientes de envío a DIAN
   */
  async getPendientesEnvio(): Promise<Factura[]> {
    const response = await axiosInstance.get(API_ENDPOINTS.FACTURAS.PENDIENTES_ENVIO);
    return response.data.data;
  }

  /**
   * Enviar factura a la DIAN
   */
  async enviarDIAN(id: number): Promise<Factura> {
    const response = await axiosInstance.post(API_ENDPOINTS.FACTURAS.ENVIAR_DIAN(id));
    return response.data.data;
  }

  /**
   * Anular factura
   */
  async anular(id: number, motivo: string): Promise<Factura> {
    const response = await axiosInstance.patch(API_ENDPOINTS.FACTURAS.ANULAR(id), { motivo });
    return response.data.data;
  }

  /**
   * Generar PDF de factura
   */
  async generarPDF(id: number): Promise<Blob> {
    const response = await axiosInstance.get(API_ENDPOINTS.FACTURAS.GENERAR_PDF(id), {
      responseType: 'blob',
    });
    return response.data;
  }

  /**
   * Generar XML de factura (DIAN)
   */
  async generarXML(id: number): Promise<Blob> {
    const response = await axiosInstance.get(API_ENDPOINTS.FACTURAS.GENERAR_XML(id), {
      responseType: 'blob',
    });
    return response.data;
  }

  /**
   * Verificar estado en DIAN
   */
  async verificarDIAN(id: number): Promise<Factura> {
    const response = await axiosInstance.get(API_ENDPOINTS.FACTURAS.VERIFICAR_DIAN(id));
    return response.data.data;
  }

  /**
   * Reenviar factura por email
   */
  async reenviarEmail(id: number, email?: string): Promise<void> {
    await axiosInstance.post(API_ENDPOINTS.FACTURAS.REENVIAR_EMAIL(id), { email });
  }

  /**
   * Obtener dashboard de facturas
   */
  async getDashboard(): Promise<FacturaDashboard> {
    const response = await axiosInstance.get(API_ENDPOINTS.FACTURAS.ESTADISTICAS);
    return response.data.data;
  }

  /**
   * Buscar facturas
   */
  async search(searchTerm: string): Promise<Factura[]> {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.FACTURAS.BUSCAR}?q=${encodeURIComponent(searchTerm)}`
    );
    return response.data.data;
  }

  // ========== NOTAS CRÉDITO ==========

  /**
   * Crear nota crédito
   */
  async createNotaCredito(data: any): Promise<NotaCredito> {
    const response = await axiosInstance.post(API_ENDPOINTS.NOTAS_CREDITO.BASE, data);
    return response.data.data;
  }

  /**
   * Obtener notas crédito por factura
   */
  async getNotasCreditoByFactura(idFactura: number): Promise<NotaCredito[]> {
    const response = await axiosInstance.get(API_ENDPOINTS.NOTAS_CREDITO.BY_FACTURA(idFactura));
    return response.data.data;
  }

  /**
   * Enviar nota crédito a DIAN
   */
  async enviarNotaCreditoDIAN(id: number): Promise<NotaCredito> {
    const response = await axiosInstance.post(API_ENDPOINTS.NOTAS_CREDITO.ENVIAR_DIAN(id));
    return response.data.data;
  }

  /**
   * Generar PDF de nota crédito
   */
  async generarNotaCreditoPDF(id: number): Promise<Blob> {
    const response = await axiosInstance.get(API_ENDPOINTS.NOTAS_CREDITO.GENERAR_PDF(id), {
      responseType: 'blob',
    });
    return response.data;
  }

  // ========== NOTAS DÉBITO ==========

  /**
   * Crear nota débito
   */
  async createNotaDebito(data: any): Promise<NotaDebito> {
    const response = await axiosInstance.post(API_ENDPOINTS.NOTAS_DEBITO.BASE, data);
    return response.data.data;
  }

  /**
   * Obtener notas débito por factura
   */
  async getNotasDebitoByFactura(idFactura: number): Promise<NotaDebito[]> {
    const response = await axiosInstance.get(API_ENDPOINTS.NOTAS_DEBITO.BY_FACTURA(idFactura));
    return response.data.data;
  }

  /**
   * Enviar nota débito a DIAN
   */
  async enviarNotaDebitoDIAN(id: number): Promise<NotaDebito> {
    const response = await axiosInstance.post(API_ENDPOINTS.NOTAS_DEBITO.ENVIAR_DIAN(id));
    return response.data.data;
  }

  /**
   * Generar PDF de nota débito
   */
  async generarNotaDebitoPDF(id: number): Promise<Blob> {
    const response = await axiosInstance.get(API_ENDPOINTS.NOTAS_DEBITO.GENERAR_PDF(id), {
      responseType: 'blob',
    });
    return response.data;
  }
}

export default new InvoicesService();
