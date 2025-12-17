import axiosInstance from './axiosConfig';

export type TipoProveedor = 'Hotel' | 'Aerolinea' | 'Transporte' | 'Servicios' | 'Mixto';
export type EstadoProveedor = 'Activo' | 'Inactivo' | 'Suspendido';

export interface Proveedor {
  idProveedor: number;
  nombreEmpresa: string;
  nombreContacto: string;
  telefono: string;
  telefonoAlternativo?: string;
  correoElectronico: string;
  correoAlternativo?: string;
  direccion?: string;
  ciudad: string;
  pais: string;
  nitRut: string;
  tipoProveedor: TipoProveedor;
  sitioWeb?: string;
  calificacion: number;
  estado: EstadoProveedor;
  fechaRegistro: string;
  observaciones?: string;
}

export interface CreateProveedorDTO {
  nombreEmpresa: string;
  nombreContacto: string;
  telefono: string;
  telefonoAlternativo?: string;
  correoElectronico: string;
  correoAlternativo?: string;
  direccion?: string;
  ciudad: string;
  pais: string;
  nitRut: string;
  tipoProveedor: TipoProveedor;
  sitioWeb?: string;
  calificacion?: number;
  estado?: EstadoProveedor;
  observaciones?: string;
}

export interface UpdateProveedorDTO extends Partial<CreateProveedorDTO> {}

export interface ProveedorFilters {
  tipoProveedor?: TipoProveedor;
  estado?: EstadoProveedor;
  ciudad?: string;
  pais?: string;
  calificacionMin?: number;
  searchTerm?: string;
}

class ProvidersService {
  private readonly baseUrl = '/proveedores';

  /**
   * Obtener todos los proveedores (con filtros opcionales)
   */
  async getAll(filters?: ProveedorFilters): Promise<Proveedor[]> {
    const params = new URLSearchParams();
    
    if (filters?.tipoProveedor) params.append('tipoProveedor', filters.tipoProveedor);
    if (filters?.estado) params.append('estado', filters.estado);
    if (filters?.ciudad) params.append('ciudad', filters.ciudad);
    if (filters?.pais) params.append('pais', filters.pais);
    if (filters?.calificacionMin) params.append('calificacionMin', filters.calificacionMin.toString());
    if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm);

    const response = await axiosInstance.get(`${this.baseUrl}${params.toString() ? '?' + params.toString() : ''}`);
    return response.data.data;
  }

  /**
   * Obtener proveedor por ID
   */
  async getById(id: number): Promise<Proveedor> {
    const response = await axiosInstance.get(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  /**
   * Crear nuevo proveedor
   */
  async create(data: CreateProveedorDTO): Promise<Proveedor> {
    const response = await axiosInstance.post(this.baseUrl, data);
    return response.data.data;
  }

  /**
   * Actualizar proveedor
   */
  async update(id: number, data: UpdateProveedorDTO): Promise<Proveedor> {
    const response = await axiosInstance.put(`${this.baseUrl}/${id}`, data);
    return response.data.data;
  }

  /**
   * Eliminar proveedor
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Obtener proveedores por tipo
   */
  async getByTipo(tipo: TipoProveedor): Promise<Proveedor[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/tipo/${tipo}`);
    return response.data.data;
  }

  /**
   * Obtener proveedores activos
   */
  async getActivos(): Promise<Proveedor[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/activos`);
    return response.data.data;
  }

  /**
   * Actualizar calificación de proveedor
   */
  async updateCalificacion(id: number, calificacion: number): Promise<Proveedor> {
    const response = await axiosInstance.patch(`${this.baseUrl}/${id}/calificacion`, { calificacion });
    return response.data.data;
  }

  /**
   * Cambiar estado de proveedor
   */
  async cambiarEstado(id: number, estado: EstadoProveedor): Promise<Proveedor> {
    const response = await axiosInstance.patch(`${this.baseUrl}/${id}/estado`, { estado });
    return response.data.data;
  }

  /**
   * Obtener estadísticas de proveedores
   */
  async getEstadisticas() {
    const response = await axiosInstance.get(`${this.baseUrl}/estadisticas`);
    return response.data.data;
  }

  /**
   * Buscar proveedores
   */
  async search(searchTerm: string): Promise<Proveedor[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/buscar?q=${encodeURIComponent(searchTerm)}`);
    return response.data.data;
  }
}

export default new ProvidersService();
