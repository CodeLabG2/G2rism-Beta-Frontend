import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './config/endpoints';
import type {
  ClientCategory,
  CreateClientCategoryDto,
  UpdateClientCategoryDto,
  ClientCategoriesFilters,
} from '../types/clientCategories.types';
import type { ApiResponse } from '../types/api.types';

/**
 * Servicio de Categorías de Cliente
 * Gestión de categorías VIP, Estándar, Premium, etc.
 * 
 * Backend: CategoriasClienteController
 * Endpoints: 8
 * Autorización: Super Administrador, Administrador
 * 
 * @author G2rism Team
 * @version 1.0
 */
class ClientCategoriesService {
  /**
   * Obtener todas las categorías de cliente
   * GET /api/categorias-cliente
   * 
   * @param filters Filtros opcionales
   * @returns Lista de categorías
   */
  async getAll(filters?: ClientCategoriesFilters): Promise<ClientCategory[]> {
    const params = new URLSearchParams();
    
    if (filters?.estado !== undefined) {
      params.append('estado', filters.estado.toString());
    }
    
    if (filters?.descuentoMinimo !== undefined) {
      params.append('descuentoMinimo', filters.descuentoMinimo.toString());
    }
    
    if (filters?.descuentoMaximo !== undefined) {
      params.append('descuentoMaximo', filters.descuentoMaximo.toString());
    }
    
    const queryString = params.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.CATEGORIAS_CLIENTE.BASE}?${queryString}`
      : API_ENDPOINTS.CATEGORIAS_CLIENTE.BASE;
    
    const response = await axiosInstance.get<ApiResponse<ClientCategory[]>>(url);
    return response.data.data;
  }

  /**
   * Obtener categoría por ID
   * GET /api/categorias-cliente/{id}
   * 
   * @param id ID de la categoría
   * @returns Categoría encontrada
   */
  async getById(id: number): Promise<ClientCategory> {
    const response = await axiosInstance.get<ApiResponse<ClientCategory>>(
      API_ENDPOINTS.CATEGORIAS_CLIENTE.BY_ID(id)
    );
    return response.data.data;
  }

  /**
   * Crear nueva categoría de cliente
   * POST /api/categorias-cliente
   * 
   * VALIDACIONES:
   * - Nombre único
   * - Color hex válido (#RRGGBB)
   * - Descuento entre 0 y 100
   * 
   * @param data Datos de la categoría a crear
   * @returns Categoría creada
   */
  async create(data: CreateClientCategoryDto): Promise<ClientCategory> {
    const response = await axiosInstance.post<ApiResponse<ClientCategory>>(
      API_ENDPOINTS.CATEGORIAS_CLIENTE.BASE,
      data
    );
    return response.data.data;
  }

  /**
   * Actualizar categoría existente
   * PUT /api/categorias-cliente/{id}
   * 
   * @param id ID de la categoría a actualizar
   * @param data Datos a actualizar
   * @returns Categoría actualizada
   */
  async update(id: number, data: UpdateClientCategoryDto): Promise<ClientCategory> {
    const response = await axiosInstance.put<ApiResponse<ClientCategory>>(
      API_ENDPOINTS.CATEGORIAS_CLIENTE.BY_ID(id),
      data
    );
    return response.data.data;
  }

  /**
   * Eliminar categoría
   * DELETE /api/categorias-cliente/{id}
   * 
   * IMPORTANTE: No se puede eliminar si tiene clientes asociados
   * 
   * @param id ID de la categoría a eliminar
   * @throws 400 si tiene clientes asociados
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.CATEGORIAS_CLIENTE.BY_ID(id));
  }

  /**
   * Activar categoría
   * POST /api/categorias-cliente/{id}/activar
   * 
   * @param id ID de la categoría a activar
   * @returns Categoría activada
   */
  async activate(id: number): Promise<ClientCategory> {
    const response = await axiosInstance.post<ApiResponse<ClientCategory>>(
      API_ENDPOINTS.CATEGORIAS_CLIENTE.ACTIVAR(id)
    );
    return response.data.data;
  }

  /**
   * Desactivar categoría
   * POST /api/categorias-cliente/{id}/desactivar
   * 
   * @param id ID de la categoría a desactivar
   * @returns Categoría desactivada
   */
  async deactivate(id: number): Promise<ClientCategory> {
    const response = await axiosInstance.post<ApiResponse<ClientCategory>>(
      API_ENDPOINTS.CATEGORIAS_CLIENTE.DESACTIVAR(id)
    );
    return response.data.data;
  }

  // ===========================
  // MÉTODOS DE UTILIDAD
  // ===========================

  /**
   * Obtener solo categorías activas
   * 
   * @returns Lista de categorías activas
   */
  async getActive(): Promise<ClientCategory[]> {
    return this.getAll({ estado: true });
  }

  /**
   * Obtener categorías por rango de descuento
   * 
   * @param min Descuento mínimo
   * @param max Descuento máximo
   * @returns Lista de categorías en ese rango
   */
  async getByDiscountRange(min: number, max: number): Promise<ClientCategory[]> {
    return this.getAll({ descuentoMinimo: min, descuentoMaximo: max });
  }

  /**
   * Alternar estado activo/inactivo
   * 
   * @param id ID de la categoría
   * @returns Categoría con estado actualizado
   */
  async toggleActive(id: number): Promise<ClientCategory> {
    const category = await this.getById(id);
    return category.estado ? this.deactivate(id) : this.activate(id);
  }

  /**
   * Buscar categorías por nombre
   * 
   * @param term Término de búsqueda
   * @returns Lista de categorías que coinciden
   */
  async search(term: string): Promise<ClientCategory[]> {
    const categories = await this.getAll();
    const lowerTerm = term.toLowerCase();
    
    return categories.filter(cat => 
      cat.nombre.toLowerCase().includes(lowerTerm) ||
      cat.descripcion?.toLowerCase().includes(lowerTerm)
    );
  }
}

// Exportar instancia única (singleton)
const clientCategoriesService = new ClientCategoriesService();
export default clientCategoriesService;
