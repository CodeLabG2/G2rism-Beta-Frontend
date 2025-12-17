import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from './config/endpoints';
import type {
  Client,
  ClientWithCategory,
  ClientComplete,
  CreateClientDto,
  UpdateClientDto,
  ClientsFilters,
  ClientsStatistics,
} from '../types/clients.types';
import type { ApiResponse } from '../types/api.types';

/**
 * Servicio de Clientes (CRM)
 * Gestión completa de clientes y CRM
 * 
 * Backend: ClientesController
 * Endpoints: 20
 * Autorización: Super Administrador, Administrador, Empleado
 * 
 * @author G2rism Team
 * @version 1.0
 */
class ClientsService {
  /**
   * Obtener todos los clientes
   * GET /api/clientes
   * 
   * @param filters Filtros opcionales
   * @returns Lista de clientes
   */
  async getAll(filters?: ClientsFilters): Promise<Client[]> {
    const params = new URLSearchParams();
    
    if (filters?.estado !== undefined) {
      params.append('estado', filters.estado.toString());
    }
    
    if (filters?.ciudad) {
      params.append('ciudad', filters.ciudad);
    }
    
    if (filters?.pais) {
      params.append('pais', filters.pais);
    }
    
    if (filters?.categoria) {
      params.append('categoria', filters.categoria.toString());
    }
    
    const queryString = params.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.CLIENTES.BASE}?${queryString}`
      : API_ENDPOINTS.CLIENTES.BASE;
    
    const response = await axiosInstance.get<ApiResponse<Client[]>>(url);
    return response.data.data;
  }

  /**
   * Obtener cliente por ID
   * GET /api/clientes/{id}
   * 
   * @param id ID del cliente
   * @returns Cliente encontrado
   */
  async getById(id: number): Promise<Client> {
    const response = await axiosInstance.get<ApiResponse<Client>>(
      API_ENDPOINTS.CLIENTES.BY_ID(id)
    );
    return response.data.data;
  }

  /**
   * Obtener cliente con su categoría
   * GET /api/clientes/{id}/con-categoria
   * 
   * @param id ID del cliente
   * @returns Cliente con categoría incluida
   */
  async getWithCategory(id: number): Promise<ClientWithCategory> {
    const response = await axiosInstance.get<ApiResponse<ClientWithCategory>>(
      API_ENDPOINTS.CLIENTES.CON_CATEGORIA(id)
    );
    return response.data.data;
  }

  /**
   * Obtener cliente con todas sus relaciones
   * GET /api/clientes/{id}/con-usuario y /con-categoria y /con-preferencias
   * 
   * @param id ID del cliente
   * @returns Cliente completo con usuario, categoría y preferencias
   */
  async getComplete(id: number): Promise<ClientComplete> {
    // Obtener cliente con categoría
    const clientWithCategory = await this.getWithCategory(id);
    
    // Obtener preferencias (si existen)
    try {
      const preferencesResponse = await axiosInstance.get<ApiResponse<any>>(
        API_ENDPOINTS.CLIENTES.CON_PREFERENCIAS(id)
      );
      
      return {
        ...clientWithCategory,
        preferencias: preferencesResponse.data.data,
      };
    } catch (error) {
      // Si no tiene preferencias, retornar solo con categoría
      return clientWithCategory;
    }
  }

  /**
   * Obtener cliente por documento de identidad
   * GET /api/clientes/documento/{documento}
   * 
   * @param documento Documento de identidad
   * @returns Cliente encontrado
   */
  async getByDocument(documento: string): Promise<Client> {
    const response = await axiosInstance.get<ApiResponse<Client>>(
      API_ENDPOINTS.CLIENTES.BY_DOCUMENTO(documento)
    );
    return response.data.data;
  }

  /**
   * Obtener cliente por email
   * GET /api/clientes/email/{email}
   * 
   * @param email Email del cliente
   * @returns Cliente encontrado
   */
  async getByEmail(email: string): Promise<Client> {
    const response = await axiosInstance.get<ApiResponse<Client>>(
      API_ENDPOINTS.CLIENTES.BY_EMAIL(email)
    );
    return response.data.data;
  }

  /**
   * Buscar clientes por término
   * GET /api/clientes/buscar?q={termino}
   * 
   * Busca en: nombre, apellido, documento, email
   * 
   * @param term Término de búsqueda
   * @returns Lista de clientes que coinciden
   */
  async search(term: string): Promise<Client[]> {
    const response = await axiosInstance.get<ApiResponse<Client[]>>(
      `${API_ENDPOINTS.CLIENTES.BUSCAR}?q=${encodeURIComponent(term)}`
    );
    return response.data.data;
  }

  /**
   * Obtener clientes por categoría
   * GET /api/clientes/por-categoria/{idCategoria}
   * 
   * @param categoryId ID de la categoría
   * @returns Lista de clientes de esa categoría
   */
  async getByCategory(categoryId: number): Promise<Client[]> {
    const response = await axiosInstance.get<ApiResponse<Client[]>>(
      API_ENDPOINTS.CLIENTES.POR_CATEGORIA(categoryId)
    );
    return response.data.data;
  }

  /**
   * Crear nuevo cliente
   * POST /api/clientes
   * 
   * VALIDACIONES:
   * - idUsuario debe ser tipo 'cliente'
   * - documentoIdentidad único
   * - Email válido
   * - Fecha de nacimiento no puede ser futura
   * 
   * @param data Datos del cliente a crear
   * @returns Cliente creado
   */
  async create(data: CreateClientDto): Promise<Client> {
    const response = await axiosInstance.post<ApiResponse<Client>>(
      API_ENDPOINTS.CLIENTES.BASE,
      data
    );
    return response.data.data;
  }

  /**
   * Actualizar cliente existente
   * PUT /api/clientes/{id}
   * 
   * @param id ID del cliente a actualizar
   * @param data Datos a actualizar
   * @returns Cliente actualizado
   */
  async update(id: number, data: UpdateClientDto): Promise<Client> {
    const response = await axiosInstance.put<ApiResponse<Client>>(
      API_ENDPOINTS.CLIENTES.BY_ID(id),
      data
    );
    return response.data.data;
  }

  /**
   * Eliminar cliente
   * DELETE /api/clientes/{id}
   * 
   * @param id ID del cliente a eliminar
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.CLIENTES.BY_ID(id));
  }

  /**
   * Activar cliente
   * POST /api/clientes/{id}/activar
   * 
   * @param id ID del cliente a activar
   * @returns Cliente activado
   */
  async activate(id: number): Promise<Client> {
    const response = await axiosInstance.post<ApiResponse<Client>>(
      API_ENDPOINTS.CLIENTES.ACTIVAR(id)
    );
    return response.data.data;
  }

  /**
   * Desactivar cliente
   * POST /api/clientes/{id}/desactivar
   * 
   * @param id ID del cliente a desactivar
   * @returns Cliente desactivado
   */
  async deactivate(id: number): Promise<Client> {
    const response = await axiosInstance.post<ApiResponse<Client>>(
      API_ENDPOINTS.CLIENTES.DESACTIVAR(id)
    );
    return response.data.data;
  }

  // ===========================
  // MÉTODOS DE UTILIDAD
  // ===========================

  /**
   * Obtener solo clientes activos
   * 
   * @returns Lista de clientes activos
   */
  async getActive(): Promise<Client[]> {
    return this.getAll({ estado: true });
  }

  /**
   * Obtener solo clientes inactivos
   * 
   * @returns Lista de clientes inactivos
   */
  async getInactive(): Promise<Client[]> {
    return this.getAll({ estado: false });
  }

  /**
   * Obtener clientes por ciudad
   * 
   * @param ciudad Nombre de la ciudad
   * @returns Lista de clientes de esa ciudad
   */
  async getByCity(ciudad: string): Promise<Client[]> {
    return this.getAll({ ciudad });
  }

  /**
   * Obtener clientes por país
   * 
   * @param pais Nombre del país
   * @returns Lista de clientes de ese país
   */
  async getByCountry(pais: string): Promise<Client[]> {
    return this.getAll({ pais });
  }

  /**
   * Obtener lista de ciudades únicas
   * Método calculado localmente
   * 
   * @returns Array de ciudades
   */
  async getCities(): Promise<string[]> {
    const clients = await this.getAll();
    const cities = clients.map(c => c.ciudad);
    return [...new Set(cities)].sort();
  }

  /**
   * Obtener lista de países únicos
   * Método calculado localmente
   * 
   * @returns Array de países
   */
  async getCountries(): Promise<string[]> {
    const clients = await this.getAll();
    const countries = clients.map(c => c.pais);
    return [...new Set(countries)].sort();
  }

  /**
   * Alternar estado activo/inactivo
   * 
   * @param id ID del cliente
   * @returns Cliente con estado actualizado
   */
  async toggleActive(id: number): Promise<Client> {
    const client = await this.getById(id);
    return client.estado ? this.deactivate(id) : this.activate(id);
  }

  /**
   * Obtener estadísticas de clientes
   * GET /api/clientes/estadisticas
   * 
   * @returns Estadísticas agregadas
   */
  async getStatistics(): Promise<ClientsStatistics> {
    const response = await axiosInstance.get<ApiResponse<ClientsStatistics>>(
      API_ENDPOINTS.CLIENTES.ESTADISTICAS
    );
    return response.data.data;
  }

  /**
   * Calcular estadísticas localmente (alternativa)
   * Útil si el endpoint no está disponible
   * 
   * @returns Estadísticas calculadas
   */
  async calculateStatistics(): Promise<ClientsStatistics> {
    const clients = await this.getAll();
    
    const porCategoria: { [key: string]: number } = {};
    const porCiudad: { [key: string]: number } = {};
    const porPais: { [key: string]: number } = {};
    
    let totalEdad = 0;
    
    clients.forEach(client => {
      // Por categoría
      const catKey = client.idCategoria?.toString() || 'Sin categoría';
      porCategoria[catKey] = (porCategoria[catKey] || 0) + 1;
      
      // Por ciudad
      porCiudad[client.ciudad] = (porCiudad[client.ciudad] || 0) + 1;
      
      // Por país
      porPais[client.pais] = (porPais[client.pais] || 0) + 1;
      
      // Edad
      totalEdad += client.edad;
    });
    
    return {
      total: clients.length,
      activos: clients.filter(c => c.estado).length,
      inactivos: clients.filter(c => !c.estado).length,
      porCategoria,
      porCiudad,
      porPais,
      edadPromedio: clients.length > 0 ? totalEdad / clients.length : 0,
    };
  }

  /**
   * Validar disponibilidad de documento
   * 
   * @param documento Documento a validar
   * @returns true si está disponible, false si ya existe
   */
  async isDocumentAvailable(documento: string): Promise<boolean> {
    try {
      await this.getByDocument(documento);
      return false; // Si encuentra el documento, NO está disponible
    } catch (error: any) {
      if (error.response?.status === 404) {
        return true; // Si no encuentra, SÍ está disponible
      }
      throw error;
    }
  }

  /**
   * Validar disponibilidad de email
   * 
   * @param email Email a validar
   * @returns true si está disponible, false si ya existe
   */
  async isEmailAvailable(email: string): Promise<boolean> {
    try {
      await this.getByEmail(email);
      return false;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return true;
      }
      throw error;
    }
  }
}

// Exportar instancia única (singleton)
const clientsService = new ClientsService();
export default clientsService;
