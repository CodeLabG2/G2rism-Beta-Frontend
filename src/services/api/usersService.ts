import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from './config/endpoints';
import type {
  User,
  UserWithRoles,
  CreateUserDto,
  UpdateUserDto,
  AssignRolesDto,
  UsersFilters,
  UsersStatistics,
} from '../types/users.types';
import type { ApiResponse } from '../types/api.types';

/**
 * Servicio de Usuarios
 * Gestión completa de usuarios del sistema
 * 
 * Backend: UsuariosController
 * Endpoints: 19
 * Autorización: Super Administrador, Administrador
 * 
 * @author G2rism Team
 * @version 1.0
 */
class UsersService {
  /**
   * Obtener todos los usuarios
   * GET /api/usuarios
   * 
   * @param filters Filtros opcionales (incluirInactivos, tipoUsuario, estado)
   * @returns Lista de usuarios
   */
  async getAll(filters?: UsersFilters): Promise<User[]> {
    const params = new URLSearchParams();
    
    if (filters?.incluirInactivos !== undefined) {
      params.append('incluirInactivos', filters.incluirInactivos.toString());
    }
    
    if (filters?.tipoUsuario) {
      params.append('tipoUsuario', filters.tipoUsuario);
    }
    
    if (filters?.estado !== undefined) {
      params.append('estado', filters.estado.toString());
    }
    
    const queryString = params.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.USUARIOS.BASE}?${queryString}`
      : API_ENDPOINTS.USUARIOS.BASE;
    
    const response = await axiosInstance.get<ApiResponse<User[]>>(url);
    return response.data.data;
  }

  /**
   * Obtener usuario por ID
   * GET /api/usuarios/{id}
   * 
   * @param id ID del usuario
   * @returns Usuario encontrado
   * @throws 404 si el usuario no existe
   */
  async getById(id: number): Promise<User> {
    const response = await axiosInstance.get<ApiResponse<User>>(
      API_ENDPOINTS.USUARIOS.BY_ID(id)
    );
    return response.data.data;
  }

  /**
   * Obtener usuario con sus roles asignados
   * GET /api/usuarios/{id}/roles
   * 
   * @param id ID del usuario
   * @returns Usuario con lista de roles
   */
  async getWithRoles(id: number): Promise<UserWithRoles> {
    // El backend no tiene un endpoint específico de /roles
    // pero podemos construirlo obteniendo el usuario y roles por separado
    // Por ahora usamos el endpoint base y asumimos que incluye roles
    const response = await axiosInstance.get<ApiResponse<UserWithRoles>>(
      API_ENDPOINTS.USUARIOS.BY_ID(id)
    );
    return response.data.data;
  }

  /**
   * Obtener usuario por username
   * GET /api/usuarios/username/{username}
   * 
   * @param username Username del usuario
   * @returns Usuario encontrado
   */
  async getByUsername(username: string): Promise<User> {
    const response = await axiosInstance.get<ApiResponse<User>>(
      API_ENDPOINTS.USUARIOS.BY_USERNAME(username)
    );
    return response.data.data;
  }

  /**
   * Obtener usuario por email
   * GET /api/usuarios/email/{email}
   * 
   * @param email Email del usuario
   * @returns Usuario encontrado
   */
  async getByEmail(email: string): Promise<User> {
    const response = await axiosInstance.get<ApiResponse<User>>(
      API_ENDPOINTS.USUARIOS.BY_EMAIL(email)
    );
    return response.data.data;
  }

  /**
   * Crear nuevo usuario
   * POST /api/usuarios
   * 
   * VALIDACIONES:
   * - Solo UN Super Administrador permitido en el sistema
   * - Roles compatibles con tipo de usuario
   * - Username y email únicos
   * - Password con requisitos de seguridad
   * 
   * @param data Datos del usuario a crear
   * @returns Usuario creado
   * @throws 400 si las validaciones fallan
   */
  async create(data: CreateUserDto): Promise<User> {
    const response = await axiosInstance.post<ApiResponse<User>>(
      API_ENDPOINTS.USUARIOS.BASE,
      data
    );
    return response.data.data;
  }

  /**
   * Actualizar usuario existente
   * PUT /api/usuarios/{id}
   * 
   * @param id ID del usuario a actualizar
   * @param data Datos a actualizar
   * @returns Usuario actualizado
   */
  async update(id: number, data: UpdateUserDto): Promise<User> {
    const response = await axiosInstance.put<ApiResponse<User>>(
      API_ENDPOINTS.USUARIOS.BY_ID(id),
      data
    );
    return response.data.data;
  }

  /**
   * Eliminar usuario
   * DELETE /api/usuarios/{id}
   * 
   * IMPORTANTE: No se puede eliminar el Super Administrador
   * 
   * @param id ID del usuario a eliminar
   * @throws 400 si intenta eliminar Super Administrador
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.USUARIOS.BY_ID(id));
  }

  /**
   * Asignar roles a un usuario
   * POST /api/usuarios/asignar-rol
   * 
   * IMPORTANTE: Reemplaza TODOS los roles anteriores
   * 
   * @param userId ID del usuario
   * @param rolesIds IDs de los roles a asignar
   * @returns Usuario con roles actualizados
   */
  async assignRoles(userId: number, rolesIds: number[]): Promise<UserWithRoles> {
    const response = await axiosInstance.post<ApiResponse<UserWithRoles>>(
      API_ENDPOINTS.USUARIOS.ASIGNAR_ROL,
      { userId, rolesIds }
    );
    return response.data.data;
  }

  /**
   * Remover un rol de un usuario
   * POST /api/usuarios/remover-rol
   * 
   * @param userId ID del usuario
   * @param roleId ID del rol a remover
   * @returns Usuario actualizado
   */
  async removeRole(userId: number, roleId: number): Promise<UserWithRoles> {
    const response = await axiosInstance.post<ApiResponse<UserWithRoles>>(
      API_ENDPOINTS.USUARIOS.REMOVER_ROL,
      { userId, roleId }
    );
    return response.data.data;
  }

  /**
   * Bloquear usuario
   * POST /api/usuarios/{id}/bloquear
   * 
   * Bloquea el acceso al sistema
   * 
   * @param id ID del usuario a bloquear
   * @returns Usuario bloqueado
   */
  async block(id: number): Promise<User> {
    const response = await axiosInstance.post<ApiResponse<User>>(
      API_ENDPOINTS.USUARIOS.BLOQUEAR(id)
    );
    return response.data.data;
  }

  /**
   * Desbloquear usuario
   * POST /api/usuarios/{id}/desbloquear
   * 
   * Restablece el acceso al sistema
   * Resetea el contador de intentos fallidos
   * 
   * @param id ID del usuario a desbloquear
   * @returns Usuario desbloqueado
   */
  async unblock(id: number): Promise<User> {
    const response = await axiosInstance.post<ApiResponse<User>>(
      API_ENDPOINTS.USUARIOS.DESBLOQUEAR(id)
    );
    return response.data.data;
  }

  /**
   * Activar usuario
   * POST /api/usuarios/{id}/activar
   * 
   * @param id ID del usuario a activar
   * @returns Usuario activado
   */
  async activate(id: number): Promise<User> {
    const response = await axiosInstance.post<ApiResponse<User>>(
      API_ENDPOINTS.USUARIOS.ACTIVAR(id)
    );
    return response.data.data;
  }

  /**
   * Desactivar usuario
   * POST /api/usuarios/{id}/desactivar
   * 
   * Deshabilita el usuario pero NO elimina sus datos
   * 
   * @param id ID del usuario a desactivar
   * @returns Usuario desactivado
   */
  async deactivate(id: number): Promise<User> {
    const response = await axiosInstance.post<ApiResponse<User>>(
      API_ENDPOINTS.USUARIOS.DESACTIVAR(id)
    );
    return response.data.data;
  }

  // ===========================
  // MÉTODOS DE UTILIDAD
  // ===========================

  /**
   * Obtener solo usuarios activos
   * Método de utilidad que filtra usuarios activos
   * 
   * @returns Lista de usuarios activos
   */
  async getActive(): Promise<User[]> {
    return this.getAll({ estado: true });
  }

  /**
   * Obtener solo usuarios inactivos
   * 
   * @returns Lista de usuarios inactivos
   */
  async getInactive(): Promise<User[]> {
    return this.getAll({ estado: false, incluirInactivos: true });
  }

  /**
   * Obtener usuarios por tipo
   * 
   * @param tipo Tipo de usuario (empleado o cliente)
   * @returns Lista de usuarios del tipo especificado
   */
  async getByType(tipo: 'empleado' | 'cliente'): Promise<User[]> {
    return this.getAll({ tipoUsuario: tipo });
  }

  /**
   * Obtener solo empleados
   * 
   * @returns Lista de usuarios empleados
   */
  async getEmployees(): Promise<User[]> {
    return this.getByType('empleado');
  }

  /**
   * Obtener solo clientes
   * 
   * @returns Lista de usuarios clientes
   */
  async getClients(): Promise<User[]> {
    return this.getByType('cliente');
  }

  /**
   * Verificar si un usuario está bloqueado
   * 
   * @param id ID del usuario
   * @returns true si está bloqueado, false si no
   */
  async isBlocked(id: number): Promise<boolean> {
    const user = await this.getById(id);
    return user.bloqueado;
  }

  /**
   * Verificar si un usuario está activo
   * 
   * @param id ID del usuario
   * @returns true si está activo, false si no
   */
  async isActive(id: number): Promise<boolean> {
    const user = await this.getById(id);
    return user.estado;
  }

  /**
   * Alternar estado de bloqueo
   * 
   * @param id ID del usuario
   * @returns Usuario con estado actualizado
   */
  async toggleBlock(id: number): Promise<User> {
    const user = await this.getById(id);
    return user.bloqueado ? this.unblock(id) : this.block(id);
  }

  /**
   * Alternar estado activo/inactivo
   * 
   * @param id ID del usuario
   * @returns Usuario con estado actualizado
   */
  async toggleActive(id: number): Promise<User> {
    const user = await this.getById(id);
    return user.estado ? this.deactivate(id) : this.activate(id);
  }

  /**
   * Obtener estadísticas de usuarios
   * Método calculado localmente a partir de la lista completa
   * 
   * @returns Estadísticas agregadas
   */
  async getStatistics(): Promise<UsersStatistics> {
    const users = await this.getAll({ incluirInactivos: true });
    
    return {
      total: users.length,
      activos: users.filter(u => u.estado).length,
      inactivos: users.filter(u => !u.estado).length,
      bloqueados: users.filter(u => u.bloqueado).length,
      empleados: users.filter(u => u.tipoUsuario === 'empleado').length,
      clientes: users.filter(u => u.tipoUsuario === 'cliente').length,
    };
  }

  /**
   * Buscar usuarios por término
   * Busca en username y email
   * 
   * @param term Término de búsqueda
   * @returns Lista de usuarios que coinciden
   */
  async search(term: string): Promise<User[]> {
    const users = await this.getAll();
    const lowerTerm = term.toLowerCase();
    
    return users.filter(user => 
      user.username.toLowerCase().includes(lowerTerm) ||
      user.email.toLowerCase().includes(lowerTerm)
    );
  }

  /**
   * Validar disponibilidad de username
   * 
   * @param username Username a validar
   * @returns true si está disponible, false si ya existe
   */
  async isUsernameAvailable(username: string): Promise<boolean> {
    try {
      await this.getByUsername(username);
      return false; // Si encuentra el usuario, NO está disponible
    } catch (error: any) {
      if (error.response?.status === 404) {
        return true; // Si no encuentra, SÍ está disponible
      }
      throw error; // Otro error, re-lanzar
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
const usersService = new UsersService();
export default usersService;
