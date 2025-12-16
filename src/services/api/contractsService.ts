import axiosInstance from './axiosInstance';

export type EstadoContrato = 'Vigente' | 'Vencido' | 'Cancelado' | 'En_Negociacion';

export interface ContratoProveedor {
  idContrato: number;
  idProveedor: number;
  numeroContrato: string;
  tipoContrato: string;
  fechaInicio: string;
  fechaFin: string;
  valorContrato: number;
  moneda: string;
  terminosCondiciones?: string;
  estadoContrato: EstadoContrato;
  renovacionAutomatica: boolean;
  // Propiedades calculadas
  estaVigente?: boolean;
  diasRestantes?: number;
  proximoAVencer?: boolean;
  duracionDias?: number;
}

export interface CreateContratoDTO {
  idProveedor: number;
  numeroContrato: string;
  tipoContrato: string;
  fechaInicio: string;
  fechaFin: string;
  valorContrato: number;
  moneda: string;
  terminosCondiciones?: string;
  estadoContrato?: EstadoContrato;
  renovacionAutomatica?: boolean;
}

export interface UpdateContratoDTO extends Partial<CreateContratoDTO> {}

export interface ContratoFilters {
  idProveedor?: number;
  estadoContrato?: EstadoContrato;
  moneda?: string;
  proximoAVencer?: boolean;
  searchTerm?: string;
}

class ContractsService {
  private readonly baseUrl = '/contratos-proveedor';

  /**
   * Obtener todos los contratos (con filtros opcionales)
   */
  async getAll(filters?: ContratoFilters): Promise<ContratoProveedor[]> {
    const params = new URLSearchParams();
    
    if (filters?.idProveedor) params.append('idProveedor', filters.idProveedor.toString());
    if (filters?.estadoContrato) params.append('estadoContrato', filters.estadoContrato);
    if (filters?.moneda) params.append('moneda', filters.moneda);
    if (filters?.proximoAVencer !== undefined) params.append('proximoAVencer', filters.proximoAVencer.toString());
    if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm);

    const response = await axiosInstance.get(`${this.baseUrl}${params.toString() ? '?' + params.toString() : ''}`);
    return response.data.data;
  }

  /**
   * Obtener contrato por ID
   */
  async getById(id: number): Promise<ContratoProveedor> {
    const response = await axiosInstance.get(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  /**
   * Crear nuevo contrato
   */
  async create(data: CreateContratoDTO): Promise<ContratoProveedor> {
    const response = await axiosInstance.post(this.baseUrl, data);
    return response.data.data;
  }

  /**
   * Actualizar contrato
   */
  async update(id: number, data: UpdateContratoDTO): Promise<ContratoProveedor> {
    const response = await axiosInstance.put(`${this.baseUrl}/${id}`, data);
    return response.data.data;
  }

  /**
   * Eliminar contrato
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Obtener contratos de un proveedor específico
   */
  async getByProveedor(idProveedor: number): Promise<ContratoProveedor[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/proveedor/${idProveedor}`);
    return response.data.data;
  }

  /**
   * Obtener contratos vigentes
   */
  async getVigentes(): Promise<ContratoProveedor[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/vigentes`);
    return response.data.data;
  }

  /**
   * Obtener contratos próximos a vencer (< 30 días)
   */
  async getProximosAVencer(): Promise<ContratoProveedor[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/proximos-vencer`);
    return response.data.data;
  }

  /**
   * Obtener contratos vencidos
   */
  async getVencidos(): Promise<ContratoProveedor[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/vencidos`);
    return response.data.data;
  }

  /**
   * Cambiar estado de contrato
   */
  async cambiarEstado(id: number, estado: EstadoContrato): Promise<ContratoProveedor> {
    const response = await axiosInstance.patch(`${this.baseUrl}/${id}/estado`, { estado });
    return response.data.data;
  }

  /**
   * Renovar contrato (crear uno nuevo basado en uno existente)
   */
  async renovar(id: number, nuevaFechaFin: string): Promise<ContratoProveedor> {
    const response = await axiosInstance.post(`${this.baseUrl}/${id}/renovar`, { nuevaFechaFin });
    return response.data.data;
  }

  /**
   * Obtener estadísticas de contratos
   */
  async getEstadisticas() {
    const response = await axiosInstance.get(`${this.baseUrl}/estadisticas`);
    return response.data.data;
  }

  /**
   * Buscar contratos
   */
  async search(searchTerm: string): Promise<ContratoProveedor[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/buscar?q=${encodeURIComponent(searchTerm)}`);
    return response.data.data;
  }
}

export default new ContractsService();
