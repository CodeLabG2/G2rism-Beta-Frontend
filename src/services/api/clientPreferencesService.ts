import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from './config/endpoints';
import type {
  ClientPreference,
  CreateClientPreferenceDto,
  UpdateClientPreferenceDto,
} from '../types/clientPreferences.types';
import type { ApiResponse } from '../types/api.types';

/**
 * Servicio de Preferencias de Cliente
 * Gestión de preferencias de viaje y necesidades especiales
 * 
 * Backend: PreferenciasClienteController
 * Endpoints: 7
 * Autorización: Super Administrador, Administrador, Empleado
 * 
 * @author G2rism Team
 * @version 1.0
 */
class ClientPreferencesService {
  /**
   * Obtener todas las preferencias de clientes
   * GET /api/preferencias-cliente
   * 
   * @returns Lista de preferencias
   */
  async getAll(): Promise<ClientPreference[]> {
    const response = await axiosInstance.get<ApiResponse<ClientPreference[]>>(
      API_ENDPOINTS.PREFERENCIAS_CLIENTE.BASE
    );
    return response.data.data;
  }

  /**
   * Obtener preferencia por ID
   * GET /api/preferencias-cliente/{id}
   * 
   * @param id ID de la preferencia
   * @returns Preferencia encontrada
   */
  async getById(id: number): Promise<ClientPreference> {
    const response = await axiosInstance.get<ApiResponse<ClientPreference>>(
      API_ENDPOINTS.PREFERENCIAS_CLIENTE.BY_ID(id)
    );
    return response.data.data;
  }

  /**
   * Obtener preferencias de un cliente específico
   * GET /api/preferencias-cliente/cliente/{clienteId}
   * 
   * @param clientId ID del cliente
   * @returns Preferencias del cliente (puede ser null si no tiene)
   */
  async getByClient(clientId: number): Promise<ClientPreference | null> {
    try {
      const response = await axiosInstance.get<ApiResponse<ClientPreference>>(
        API_ENDPOINTS.PREFERENCIAS_CLIENTE.BY_CLIENTE(clientId)
      );
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // Cliente no tiene preferencias configuradas
      }
      throw error;
    }
  }

  /**
   * Crear preferencias para un cliente
   * POST /api/preferencias-cliente
   * 
   * VALIDACIONES:
   * - Cliente debe existir
   * - Cliente no debe tener preferencias ya creadas
   * - presupuestoPromedio debe ser >= 0
   * 
   * @param data Datos de las preferencias a crear
   * @returns Preferencias creadas
   */
  async create(data: CreateClientPreferenceDto): Promise<ClientPreference> {
    const response = await axiosInstance.post<ApiResponse<ClientPreference>>(
      API_ENDPOINTS.PREFERENCIAS_CLIENTE.BASE,
      data
    );
    return response.data.data;
  }

  /**
   * Actualizar preferencias existentes
   * PUT /api/preferencias-cliente/{id}
   * 
   * @param id ID de la preferencia a actualizar
   * @param data Datos a actualizar
   * @returns Preferencias actualizadas
   */
  async update(id: number, data: UpdateClientPreferenceDto): Promise<ClientPreference> {
    const response = await axiosInstance.put<ApiResponse<ClientPreference>>(
      API_ENDPOINTS.PREFERENCIAS_CLIENTE.BY_ID(id),
      data
    );
    return response.data.data;
  }

  /**
   * Eliminar preferencias
   * DELETE /api/preferencias-cliente/{id}
   * 
   * @param id ID de la preferencia a eliminar
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.PREFERENCIAS_CLIENTE.BY_ID(id));
  }

  // ===========================
  // MÉTODOS DE UTILIDAD
  // ===========================

  /**
   * Actualizar preferencias de un cliente (por clientId)
   * Método de conveniencia
   * 
   * @param clientId ID del cliente
   * @param data Datos a actualizar
   * @returns Preferencias actualizadas
   */
  async updateByClient(clientId: number, data: UpdateClientPreferenceDto): Promise<ClientPreference> {
    const preferences = await this.getByClient(clientId);
    
    if (!preferences) {
      throw new Error('El cliente no tiene preferencias configuradas');
    }
    
    return this.update(preferences.idPreferencia, data);
  }

  /**
   * Crear o actualizar preferencias
   * Si el cliente ya tiene preferencias, las actualiza. Si no, las crea.
   * 
   * @param clientId ID del cliente
   * @param data Datos de las preferencias
   * @returns Preferencias creadas o actualizadas
   */
  async createOrUpdate(clientId: number, data: UpdateClientPreferenceDto): Promise<ClientPreference> {
    const existing = await this.getByClient(clientId);
    
    if (existing) {
      // Ya tiene preferencias, actualizar
      return this.update(existing.idPreferencia, data);
    } else {
      // No tiene preferencias, crear
      return this.create({
        idCliente: clientId,
        ...data,
      });
    }
  }

  /**
   * Eliminar preferencias de un cliente (por clientId)
   * 
   * @param clientId ID del cliente
   */
  async deleteByClient(clientId: number): Promise<void> {
    const preferences = await this.getByClient(clientId);
    
    if (preferences) {
      await this.delete(preferences.idPreferencia);
    }
  }

  /**
   * Verificar si un cliente tiene preferencias
   * 
   * @param clientId ID del cliente
   * @returns true si tiene preferencias, false si no
   */
  async hasPreferences(clientId: number): Promise<boolean> {
    const preferences = await this.getByClient(clientId);
    return preferences !== null;
  }
}

// Exportar instancia única (singleton)
const clientPreferencesService = new ClientPreferencesService();
export default clientPreferencesService;
