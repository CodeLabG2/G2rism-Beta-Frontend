import axiosInstance from './axiosConfig';
import type { ApiResponse } from '../types/api.types';

// ==================== TIPOS CORREGIDOS ====================

/**
 * Paquete Turístico - DEBE COINCIDIR con el backend
 * Backend: PaqueteTuristicoResponseDto
 */
export interface PaqueteTuristico {
  idPaquete: number;
  nombre: string;
  detalle?: string;
  destinoPrincipal: string;
  destinosAdicionales?: string; // JSON string array
  duracion: number; // días
  precio: number; // decimal en C# = number en TypeScript
  cuposDisponibles: number;
  incluye?: string; // JSON string array
  noIncluye?: string; // JSON string array
  fechaInicio?: string; // Formato ISO
  fechaFin?: string; // Formato ISO
  tipoPaquete?: string; // aventura, familiar, empresarial, lujo, cultural, ecologico, romantico
  nivelDificultad?: string; // bajo, medio, alto
  edadMinima?: number;
  numeroMinimoPersonas?: number;
  numeroMaximoPersonas?: number;
  requisitos?: string; // JSON string array
  recomendaciones?: string; // JSON string array
  imagenes?: string; // JSON string array
  itinerarioResumido?: string;
  politicasCancelacion?: string;
  estado: boolean;
  fechaCreacion: string;
  fechaModificacion?: string;
}

/**
 * DTO para crear paquete - DEBE COINCIDIR con PaqueteTuristicoCreateDto del backend
 */
export interface CreatePaqueteDTO {
  nombre: string;
  detalle?: string;
  destinoPrincipal: string;
  destinosAdicionales?: string;
  duracion: number;
  precio: number;
  cuposDisponibles: number;
  incluye?: string;
  noIncluye?: string;
  fechaInicio?: string;
  fechaFin?: string;
  tipoPaquete?: string;
  nivelDificultad?: string;
  edadMinima?: number;
  numeroMinimoPersonas?: number;
  numeroMaximoPersonas?: number;
  requisitos?: string;
  recomendaciones?: string;
  imagenes?: string;
  itinerarioResumido?: string;
  politicasCancelacion?: string;
  estado?: boolean;
}

/**
 * DTO para actualizar paquete - DEBE COINCIDIR con PaqueteTuristicoUpdateDto del backend
 */
export interface UpdatePaqueteDTO extends Partial<CreatePaqueteDTO> {}

/**
 * Filtros para búsqueda de paquetes
 */
export interface PaqueteFilters {
  tipo?: string;
  destino?: string;
  duracionMin?: number;
  duracionMax?: number;
  estado?: boolean;
}

/**
 * Servicio para gestión de paquetes turísticos
 *
 * Backend: PaquetesTuristicosController
 * Base URL: /api/paquetesturisticos
 *
 * @author G2rism Team
 * @version 2.0 - CORREGIDO para coincidir con backend real
 */
class PackagesService {
  private readonly baseUrl = '/api/paquetesturisticos';

  /**
   * Obtener todos los paquetes
   * GET /api/paquetesturisticos
   */
  async getAll(): Promise<PaqueteTuristico[]> {
    const response = await axiosInstance.get<ApiResponse<PaqueteTuristico[]>>(this.baseUrl);
    return response.data.data;
  }

  /**
   * Obtener paquete por ID
   * GET /api/paquetesturisticos/{id}
   */
  async getById(id: number): Promise<PaqueteTuristico> {
    const response = await axiosInstance.get<ApiResponse<PaqueteTuristico>>(
      `${this.baseUrl}/${id}`
    );
    return response.data.data;
  }

  /**
   * Buscar paquetes por destino principal
   * GET /api/paquetesturisticos/destino/{destino}
   *
   * @param destino Nombre del destino (string, no ID)
   */
  async getByDestination(destino: string): Promise<PaqueteTuristico[]> {
    const response = await axiosInstance.get<ApiResponse<PaqueteTuristico[]>>(
      `${this.baseUrl}/destino/${encodeURIComponent(destino)}`
    );
    return response.data.data;
  }

  /**
   * Buscar paquetes por tipo
   * GET /api/paquetesturisticos/tipo/{tipo}
   *
   * @param tipo aventura, familiar, empresarial, lujo, cultural, ecologico, romantico
   */
  async getByType(tipo: string): Promise<PaqueteTuristico[]> {
    const response = await axiosInstance.get<ApiResponse<PaqueteTuristico[]>>(
      `${this.baseUrl}/tipo/${encodeURIComponent(tipo)}`
    );
    return response.data.data;
  }

  /**
   * Obtener paquetes disponibles (activos y con cupos)
   * GET /api/paquetesturisticos/disponibles
   */
  async getDisponibles(): Promise<PaqueteTuristico[]> {
    const response = await axiosInstance.get<ApiResponse<PaqueteTuristico[]>>(
      `${this.baseUrl}/disponibles`
    );
    return response.data.data;
  }

  /**
   * Buscar paquetes por rango de duración
   * GET /api/paquetesturisticos/duracion?min={min}&max={max}
   *
   * @param min Duración mínima en días
   * @param max Duración máxima en días
   */
  async getByDuration(min: number, max: number): Promise<PaqueteTuristico[]> {
    const response = await axiosInstance.get<ApiResponse<PaqueteTuristico[]>>(
      `${this.baseUrl}/duracion`,
      { params: { min, max } }
    );
    return response.data.data;
  }

  /**
   * Crear nuevo paquete turístico
   * POST /api/paquetesturisticos
   *
   * Requiere permiso: paquetes.crear
   */
  async create(data: CreatePaqueteDTO): Promise<PaqueteTuristico> {
    const response = await axiosInstance.post<ApiResponse<PaqueteTuristico>>(
      this.baseUrl,
      data
    );
    return response.data.data;
  }

  /**
   * Actualizar paquete existente
   * PUT /api/paquetesturisticos/{id}
   *
   * Requiere permiso: paquetes.actualizar
   */
  async update(id: number, data: UpdatePaqueteDTO): Promise<PaqueteTuristico> {
    const response = await axiosInstance.put<ApiResponse<PaqueteTuristico>>(
      `${this.baseUrl}/${id}`,
      data
    );
    return response.data.data;
  }

  /**
   * Eliminar paquete (soft delete)
   * DELETE /api/paquetesturisticos/{id}
   *
   * Requiere permiso: paquetes.eliminar
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`);
  }

  // ===========================
  // MÉTODOS DE UTILIDAD
  // ===========================

  /**
   * Obtener solo paquetes activos
   */
  async getActive(): Promise<PaqueteTuristico[]> {
    const all = await this.getAll();
    return all.filter(p => p.estado === true);
  }

  /**
   * Buscar paquetes (búsqueda simple local)
   */
  async search(searchTerm: string): Promise<PaqueteTuristico[]> {
    const all = await this.getAll();
    const term = searchTerm.toLowerCase();
    return all.filter(p =>
      p.nombre.toLowerCase().includes(term) ||
      p.destinoPrincipal.toLowerCase().includes(term) ||
      p.detalle?.toLowerCase().includes(term)
    );
  }

  /**
   * Parsear campos JSON de strings a arrays
   */
  parseJsonFields(paquete: PaqueteTuristico): PaqueteTuristico & {
    incluyeArray?: string[];
    noIncluyeArray?: string[];
    destinosAdicionalesArray?: string[];
    requisitosArray?: string[];
    recomendacionesArray?: string[];
    imagenesArray?: string[];
  } {
    try {
      return {
        ...paquete,
        incluyeArray: paquete.incluye ? JSON.parse(paquete.incluye) : [],
        noIncluyeArray: paquete.noIncluye ? JSON.parse(paquete.noIncluye) : [],
        destinosAdicionalesArray: paquete.destinosAdicionales ? JSON.parse(paquete.destinosAdicionales) : [],
        requisitosArray: paquete.requisitos ? JSON.parse(paquete.requisitos) : [],
        recomendacionesArray: paquete.recomendaciones ? JSON.parse(paquete.recomendaciones) : [],
        imagenesArray: paquete.imagenes ? JSON.parse(paquete.imagenes) : [],
      };
    } catch (error) {
      console.error('Error parseando campos JSON del paquete:', error);
      return paquete;
    }
  }
}

// Exportar instancia única (singleton)
const packagesService = new PackagesService();
export default packagesService;

// Re-exportar tipo
export type { PaqueteTuristico as Package };
