import axiosInstance from './axiosInstance';

// ==================== TIPOS ====================

export type EstadoPaquete = 'Activo' | 'Inactivo' | 'Borrador' | 'Archivado';
export type CategoriaPaquete = 'Aventura' | 'Relax' | 'Cultural' | 'Familiar' | 'Romantico' | 'Negocios';
export type Temporada = 'Alta' | 'Media' | 'Baja';

export interface Destino {
  idDestino: number;
  nombre: string;
  pais: string;
  descripcion?: string;
}

export interface ItinerarioDia {
  dia: number;
  titulo: string;
  descripcion: string;
  actividades: string[];
  comidas: string[]; // 'desayuno', 'almuerzo', 'cena'
}

export interface PrecioPorTemporada {
  temporada: Temporada;
  precioPorPersona: number;
  descuento?: number;
}

export interface PaqueteTuristico {
  idPaquete: number;
  codigo: string;
  nombre: string;
  idDestino: number;
  destino?: Destino; // Poblado por JOIN
  descripcion: string;
  duracion: number; // días
  noches: number;
  categoria: CategoriaPaquete;
  estado: EstadoPaquete;
  imagenes: string[]; // URLs de imágenes
  imagenPrincipal: string;
  
  // Precios
  precioBase: number;
  precios: PrecioPorTemporada[];
  
  // Inclusiones/Exclusiones
  inclusiones: string[];
  exclusiones: string[];
  
  // Itinerario
  itinerario: ItinerarioDia[];
  
  // Detalles
  maxPersonas: number;
  minPersonas: number;
  cuposDisponibles: number;
  
  // Fechas
  fechasDisponibles: string[];
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: string;
  
  // Estadísticas
  totalVendidos: number;
  calificacion: number;
  numeroResenas: number;
}

export interface CreatePaqueteDTO {
  nombre: string;
  idDestino: number;
  descripcion: string;
  duracion: number;
  categoria: CategoriaPaquete;
  estado?: EstadoPaquete;
  imagenes?: string[];
  imagenPrincipal?: string;
  precioBase: number;
  precios?: PrecioPorTemporada[];
  inclusiones?: string[];
  exclusiones?: string[];
  itinerario?: ItinerarioDia[];
  maxPersonas: number;
  minPersonas: number;
  cuposDisponibles: number;
  fechasDisponibles?: string[];
}

export interface UpdatePaqueteDTO extends Partial<CreatePaqueteDTO> {}

export interface PaqueteFilters {
  idDestino?: number;
  categoria?: CategoriaPaquete;
  estado?: EstadoPaquete;
  duracionMin?: number;
  duracionMax?: number;
  precioMin?: number;
  precioMax?: number;
  searchTerm?: string;
}

export interface PaqueteStatistics {
  total: number;
  activos: number;
  borradores: number;
  totalVentas: number;
  valorPromedio: number;
  categoriaPopular: string;
}

// ==================== SERVICIO ====================

/**
 * Servicio para gestión de paquetes turísticos
 * 
 * @description
 * Maneja todas las operaciones CRUD de paquetes turísticos,
 * incluyendo gestión de itinerarios, precios por temporada,
 * disponibilidad y estadísticas.
 * 
 * @author G2rism Team
 * @version 1.0
 */
class PackagesService {
  private readonly baseUrl = '/paquetes';

  /**
   * Obtener todos los paquetes (con filtros opcionales)
   */
  async getAll(filters?: PaqueteFilters): Promise<PaqueteTuristico[]> {
    const params = new URLSearchParams();
    
    if (filters?.idDestino) params.append('idDestino', filters.idDestino.toString());
    if (filters?.categoria) params.append('categoria', filters.categoria);
    if (filters?.estado) params.append('estado', filters.estado);
    if (filters?.duracionMin) params.append('duracionMin', filters.duracionMin.toString());
    if (filters?.duracionMax) params.append('duracionMax', filters.duracionMax.toString());
    if (filters?.precioMin) params.append('precioMin', filters.precioMin.toString());
    if (filters?.precioMax) params.append('precioMax', filters.precioMax.toString());
    if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm);

    const response = await axiosInstance.get(`${this.baseUrl}${params.toString() ? '?' + params.toString() : ''}`);
    return response.data.data;
  }

  /**
   * Obtener paquete por ID
   */
  async getById(id: number): Promise<PaqueteTuristico> {
    const response = await axiosInstance.get(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  /**
   * Crear nuevo paquete turístico
   */
  async create(data: CreatePaqueteDTO): Promise<PaqueteTuristico> {
    const response = await axiosInstance.post(this.baseUrl, data);
    return response.data.data;
  }

  /**
   * Actualizar paquete existente
   */
  async update(id: number, data: UpdatePaqueteDTO): Promise<PaqueteTuristico> {
    const response = await axiosInstance.put(`${this.baseUrl}/${id}`, data);
    return response.data.data;
  }

  /**
   * Eliminar paquete
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Obtener paquetes por destino
   */
  async getByDestination(idDestino: number): Promise<PaqueteTuristico[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/destino/${idDestino}`);
    return response.data.data;
  }

  /**
   * Obtener paquetes por categoría
   */
  async getByCategory(categoria: CategoriaPaquete): Promise<PaqueteTuristico[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/categoria/${categoria}`);
    return response.data.data;
  }

  /**
   * Obtener solo paquetes activos
   */
  async getActive(): Promise<PaqueteTuristico[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/activos`);
    return response.data.data;
  }

  /**
   * Cambiar estado del paquete
   */
  async changeStatus(id: number, estado: EstadoPaquete): Promise<PaqueteTuristico> {
    const response = await axiosInstance.patch(`${this.baseUrl}/${id}/estado`, { estado });
    return response.data.data;
  }

  /**
   * Actualizar disponibilidad (cupos)
   */
  async updateAvailability(id: number, cuposDisponibles: number): Promise<PaqueteTuristico> {
    const response = await axiosInstance.patch(`${this.baseUrl}/${id}/disponibilidad`, { cuposDisponibles });
    return response.data.data;
  }

  /**
   * Agregar fecha disponible
   */
  async addStartDate(id: number, fecha: string): Promise<PaqueteTuristico> {
    const response = await axiosInstance.post(`${this.baseUrl}/${id}/fechas`, { fecha });
    return response.data.data;
  }

  /**
   * Eliminar fecha disponible
   */
  async removeStartDate(id: number, fecha: string): Promise<PaqueteTuristico> {
    const response = await axiosInstance.delete(`${this.baseUrl}/${id}/fechas/${fecha}`);
    return response.data.data;
  }

  /**
   * Actualizar itinerario completo
   */
  async updateItinerary(id: number, itinerario: ItinerarioDia[]): Promise<PaqueteTuristico> {
    const response = await axiosInstance.put(`${this.baseUrl}/${id}/itinerario`, { itinerario });
    return response.data.data;
  }

  /**
   * Actualizar precios por temporada
   */
  async updatePrices(id: number, precios: PrecioPorTemporada[]): Promise<PaqueteTuristico> {
    const response = await axiosInstance.put(`${this.baseUrl}/${id}/precios`, { precios });
    return response.data.data;
  }

  /**
   * Obtener estadísticas de paquetes
   */
  async getStatistics(): Promise<PaqueteStatistics> {
    const response = await axiosInstance.get(`${this.baseUrl}/estadisticas`);
    return response.data.data;
  }

  /**
   * Buscar paquetes (búsqueda avanzada)
   */
  async search(searchTerm: string): Promise<PaqueteTuristico[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/buscar`, {
      params: { q: searchTerm }
    });
    return response.data.data;
  }

  /**
   * Duplicar paquete (copiar)
   */
  async duplicate(id: number): Promise<PaqueteTuristico> {
    const response = await axiosInstance.post(`${this.baseUrl}/${id}/duplicar`);
    return response.data.data;
  }
}

// Exportar instancia única (singleton)
const packagesService = new PackagesService();
export default packagesService;

// Re-exportar tipos para facilitar importación
export type { PaqueteTuristico as Package };
