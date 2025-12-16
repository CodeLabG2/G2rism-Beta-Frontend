import axiosInstance from './axiosInstance';
import API_ENDPOINTS from './config/endpoints';
import { mockFacturas, mockNotasCredito, mockNotasDebito } from '../../data/mockData';

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
    try {
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
    } catch (error: any) {
      // Si la API no está disponible, usar datos mock
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        console.info('API no disponible, usando datos mock para facturas');
        
        // Aplicar filtros a los datos mock
        let facturasFiltradas = [...mockFacturas];
        
        if (filters?.idCliente) {
          facturasFiltradas = facturasFiltradas.filter(f => f.idCliente === filters.idCliente);
        }
        if (filters?.estadoFactura) {
          facturasFiltradas = facturasFiltradas.filter(f => f.estadoFactura === filters.estadoFactura);
        }
        if (filters?.fechaInicio) {
          facturasFiltradas = facturasFiltradas.filter(f => f.fechaEmision >= filters.fechaInicio!);
        }
        if (filters?.fechaFin) {
          facturasFiltradas = facturasFiltradas.filter(f => f.fechaEmision <= filters.fechaFin!);
        }
        if (filters?.searchTerm) {
          const term = filters.searchTerm.toLowerCase();
          facturasFiltradas = facturasFiltradas.filter(f =>
            f.numeroFactura.toLowerCase().includes(term) ||
            f.nombreCliente?.toLowerCase().includes(term) ||
            f.numeroVenta?.toLowerCase().includes(term)
          );
        }
        
        return facturasFiltradas;
      }
      throw error;
    }
  }

  /**
   * Obtener factura por ID
   */
  async getById(id: number): Promise<Factura> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.FACTURAS.BY_ID(id));
      return response.data.data;
    } catch (error: any) {
      // Si la API no está disponible, usar datos mock
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        console.info('API no disponible, usando datos mock para factura por ID');
        const factura = mockFacturas.find(f => f.idFactura === id);
        if (!factura) {
          throw new Error(`Factura con ID ${id} no encontrada`);
        }
        return factura;
      }
      throw error;
    }
  }

  /**
   * Obtener factura por número
   */
  async getByNumero(numero: string): Promise<Factura> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.FACTURAS.BY_NUMERO(numero));
      return response.data.data;
    } catch (error: any) {
      // Si la API no está disponible, usar datos mock
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        console.info('API no disponible, usando datos mock para factura por número');
        const factura = mockFacturas.find(f => f.numeroFactura === numero || `${f.prefijo}${f.numeroFactura}` === numero);
        if (!factura) {
          throw new Error(`Factura con número ${numero} no encontrada`);
        }
        return factura;
      }
      throw error;
    }
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
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.FACTURAS.BY_VENTA(idVenta));
      return response.data.data;
    } catch (error: any) {
      // Si la API no está disponible, usar datos mock
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        console.info('API no disponible, usando datos mock para facturas por venta');
        return mockFacturas.filter(f => f.idVenta === idVenta);
      }
      throw error;
    }
  }

  /**
   * Obtener facturas por cliente
   */
  async getByCliente(idCliente: number): Promise<Factura[]> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.FACTURAS.BY_CLIENTE(idCliente));
      return response.data.data;
    } catch (error: any) {
      // Si la API no está disponible, usar datos mock
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        console.info('API no disponible, usando datos mock para facturas por cliente');
        return mockFacturas.filter(f => f.idCliente === idCliente);
      }
      throw error;
    }
  }

  /**
   * Obtener facturas por estado
   */
  async getByEstado(estado: EstadoFactura): Promise<Factura[]> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.FACTURAS.POR_ESTADO(estado));
      return response.data.data;
    } catch (error: any) {
      // Si la API no está disponible, usar datos mock
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        console.info('API no disponible, usando datos mock para facturas por estado');
        return mockFacturas.filter(f => f.estadoFactura === estado);
      }
      throw error;
    }
  }

  /**
   * Obtener facturas pendientes de envío a DIAN
   */
  async getPendientesEnvio(): Promise<Factura[]> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.FACTURAS.PENDIENTES_ENVIO);
      return response.data.data;
    } catch (error: any) {
      // Si la API no está disponible, usar datos mock
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        console.info('API no disponible, usando datos mock para facturas pendientes de envío');
        return mockFacturas.filter(f => f.estadoFactura === 'Borrador');
      }
      throw error;
    }
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
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.FACTURAS.ESTADISTICAS);
      return response.data.data;
    } catch (error: any) {
      // Si la API no está disponible, usar datos mock
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        console.info('API no disponible, usando datos mock para dashboard de facturas');
        
        // Calcular estadísticas desde los datos mock
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        const facturasMes = mockFacturas.filter(f => {
          const fechaFactura = new Date(f.fechaEmision);
          return fechaFactura.getMonth() === currentMonth && fechaFactura.getFullYear() === currentYear;
        });
        
        const facturasAprobadas = mockFacturas.filter(f => f.estadoFactura === 'Aprobada_DIAN');
        const facturasPendientes = mockFacturas.filter(f => f.estadoFactura === 'Borrador' || f.estadoFactura === 'Enviada_DIAN');
        
        const totalFacturadoMes = facturasMes.reduce((sum, f) => sum + f.total, 0);
        const totalFacturado = mockFacturas.reduce((sum, f) => sum + f.total, 0);
        
        // Facturas por estado
        const estadosUnicos = Array.from(new Set(mockFacturas.map(f => f.estadoFactura)));
        const facturasPorEstado = estadosUnicos.map(estado => ({
          estado,
          cantidad: mockFacturas.filter(f => f.estadoFactura === estado).length
        }));
        
        return {
          totalFacturas: mockFacturas.length,
          facturasMes: facturasMes.length,
          facturasAprobadas: facturasAprobadas.length,
          facturasPendientes: facturasPendientes.length,
          totalFacturado,
          totalFacturadoMes,
          facturasRecientes: mockFacturas.slice(0, 5),
          facturasPorEstado
        };
      }
      throw error;
    }
  }

  /**
   * Buscar facturas
   */
  async search(searchTerm: string): Promise<Factura[]> {
    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.FACTURAS.BUSCAR}?q=${encodeURIComponent(searchTerm)}`
      );
      return response.data.data;
    } catch (error: any) {
      // Si la API no está disponible, usar datos mock
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        console.info('API no disponible, usando datos mock para búsqueda de facturas');
        const term = searchTerm.toLowerCase();
        return mockFacturas.filter(f =>
          f.numeroFactura.toLowerCase().includes(term) ||
          f.nombreCliente?.toLowerCase().includes(term) ||
          f.numeroVenta?.toLowerCase().includes(term) ||
          f.documentoCliente?.toLowerCase().includes(term)
        );
      }
      throw error;
    }
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
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.NOTAS_CREDITO.BY_FACTURA(idFactura));
      return response.data.data;
    } catch (error: any) {
      // Si la API no está disponible, usar datos mock
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        console.info('API no disponible, usando datos mock para notas de crédito');
        return mockNotasCredito.filter(nc => nc.idFactura === idFactura);
      }
      throw error;
    }
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
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.NOTAS_DEBITO.BY_FACTURA(idFactura));
      return response.data.data;
    } catch (error: any) {
      // Si la API no está disponible, usar datos mock
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        console.info('API no disponible, usando datos mock para notas de débito');
        return mockNotasDebito.filter(nd => nd.idFactura === idFactura);
      }
      throw error;
    }
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