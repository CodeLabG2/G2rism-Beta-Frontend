import { api } from './axiosConfig';
import { 
  ApiResponse, 
  PaginatedResponse, 
  TourPackage,
  PackageFilters 
} from './types';

// ============================================
// SERVICIO DE PAQUETES TURÍSTICOS
// ============================================

class PackageService {
  private readonly BASE_PATH = '/packages';

  /**
   * Obtener todos los paquetes disponibles
   */
  async getPackages(filters?: PackageFilters): Promise<PaginatedResponse<TourPackage>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<TourPackage>>>(
        this.BASE_PATH,
        { params: filters }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener paquetes:', error);
      throw error;
    }
  }

  /**
   * Obtener paquete por ID
   */
  async getPackageById(id: string): Promise<TourPackage> {
    try {
      const response = await api.get<ApiResponse<TourPackage>>(
        `${this.BASE_PATH}/${id}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener paquete:', error);
      throw error;
    }
  }

  /**
   * Obtener paquetes destacados/recomendados
   */
  async getFeaturedPackages(): Promise<TourPackage[]> {
    try {
      const response = await api.get<ApiResponse<TourPackage[]>>(
        `${this.BASE_PATH}/featured`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener paquetes destacados:', error);
      throw error;
    }
  }

  /**
   * Obtener paquetes con descuento
   */
  async getDiscountedPackages(): Promise<TourPackage[]> {
    try {
      const response = await api.get<ApiResponse<TourPackage[]>>(
        `${this.BASE_PATH}/discounts`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener paquetes con descuento:', error);
      throw error;
    }
  }

  /**
   * Buscar paquetes
   */
  async searchPackages(query: string): Promise<TourPackage[]> {
    try {
      const response = await api.get<ApiResponse<TourPackage[]>>(
        `${this.BASE_PATH}/search`,
        { params: { q: query } }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error al buscar paquetes:', error);
      throw error;
    }
  }

  /**
   * Obtener paquetes por destino
   */
  async getPackagesByDestination(destination: string): Promise<TourPackage[]> {
    try {
      const response = await api.get<ApiResponse<TourPackage[]>>(
        `${this.BASE_PATH}/destination/${destination}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener paquetes por destino:', error);
      throw error;
    }
  }

  /**
   * Verificar disponibilidad de paquete
   */
  async checkAvailability(
    packageId: string, 
    fechaInicio: string, 
    numeroViajeros: number
  ): Promise<{ available: boolean; cupoDisponible: number }> {
    try {
      const response = await api.post<ApiResponse<{ available: boolean; cupoDisponible: number }>>(
        `${this.BASE_PATH}/${packageId}/check-availability`,
        { fechaInicio, numeroViajeros }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      throw error;
    }
  }
}

// Exportar instancia única
export const packageService = new PackageService();
