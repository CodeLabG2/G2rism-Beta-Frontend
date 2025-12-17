import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from './config/endpoints';
import type {
  Role,
  RoleWithPermissions,
  CreateRoleDto,
  UpdateRoleDto,
  AssignPermissionsDto,
  RolesFilters,
  RolesStatistics,
} from '../types/roles.types';
import type { ApiResponse } from '../types/api.types';

/**
 * Servicio de Roles
 * Gestión de roles y niveles de acceso
 * 
 * Backend: RolesController
 * Endpoints: 11
 * Autorización: Solo Super Administrador
 * 
 * ROLES ESTÁNDAR:
 * - Super Administrador (nivel 100)
 * - Administrador (nivel 80)
 * - Empleado (nivel 50)
 * - Cliente (nivel 10)
 * 
 * @author G2rism Team
 * @version 1.0
 */
class RolesService {
  /**
   * Obtener todos los roles
   * GET /api/roles
   * 
   * @param filters Filtros opcionales
   * @returns Lista de roles
   */
  async getAll(filters?: RolesFilters): Promise<Role[]> {
    const params = new URLSearchParams();
    
    if (filters?.estado !== undefined) {
      params.append('estado', filters.estado.toString());
    }
    
    if (filters?.nivelAccesoMinimo !== undefined) {
      params.append('nivelAccesoMinimo', filters.nivelAccesoMinimo.toString());
    }
    
    if (filters?.nivelAccesoMaximo !== undefined) {
      params.append('nivelAccesoMaximo', filters.nivelAccesoMaximo.toString());
    }
    
    const queryString = params.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.ROLES.BASE}?${queryString}`
      : API_ENDPOINTS.ROLES.BASE;
    
    const response = await axiosInstance.get<ApiResponse<Role[]>>(url);
    return response.data.data;
  }

  /**
   * Obtener rol por ID
   * GET /api/roles/{id}
   * 
   * @param id ID del rol
   * @returns Rol encontrado
   */
  async getById(id: number): Promise<Role> {
    const response = await axiosInstance.get<ApiResponse<Role>>(
      API_ENDPOINTS.ROLES.BY_ID(id)
    );
    return response.data.data;
  }

  /**
   * Obtener rol con sus permisos asignados
   * GET /api/roles/{id}/con-permisos
   * 
   * @param id ID del rol
   * @returns Rol con lista de permisos
   */
  async getWithPermissions(id: number): Promise<RoleWithPermissions> {
    const response = await axiosInstance.get<ApiResponse<RoleWithPermissions>>(
      API_ENDPOINTS.ROLES.CON_PERMISOS(id)
    );
    return response.data.data;
  }

  /**
   * Crear nuevo rol
   * POST /api/roles
   * 
   * VALIDACIONES:
   * - Nombre único
   * - Nivel de acceso entre 1 y 100
   * - Solo Super Administrador puede crear roles
   * 
   * @param data Datos del rol a crear
   * @returns Rol creado
   */
  async create(data: CreateRoleDto): Promise<Role> {
    const response = await axiosInstance.post<ApiResponse<Role>>(
      API_ENDPOINTS.ROLES.BASE,
      data
    );
    return response.data.data;
  }

  /**
   * Actualizar rol existente
   * PUT /api/roles/{id}
   * 
   * IMPORTANTE: No se pueden modificar roles del sistema
   * (Super Administrador, Administrador, Empleado, Cliente)
   * 
   * @param id ID del rol a actualizar
   * @param data Datos a actualizar
   * @returns Rol actualizado
   */
  async update(id: number, data: UpdateRoleDto): Promise<Role> {
    const response = await axiosInstance.put<ApiResponse<Role>>(
      API_ENDPOINTS.ROLES.BY_ID(id),
      data
    );
    return response.data.data;
  }

  /**
   * Eliminar rol
   * DELETE /api/roles/{id}
   * 
   * IMPORTANTE: 
   * - No se pueden eliminar roles del sistema
   * - No se puede eliminar si hay usuarios con este rol
   * 
   * @param id ID del rol a eliminar
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.ROLES.BY_ID(id));
  }

  /**
   * Asignar permisos a un rol
   * POST /api/roles/asignar-permiso
   * 
   * IMPORTANTE: Reemplaza TODOS los permisos anteriores
   * 
   * @param roleId ID del rol
   * @param permissionsIds IDs de los permisos a asignar
   * @returns Rol con permisos actualizados
   */
  async assignPermissions(roleId: number, permissionsIds: number[]): Promise<RoleWithPermissions> {
    const response = await axiosInstance.post<ApiResponse<RoleWithPermissions>>(
      API_ENDPOINTS.ROLES.ASIGNAR_PERMISO,
      { roleId, permissionsIds }
    );
    return response.data.data;
  }

  /**
   * Remover un permiso de un rol
   * POST /api/roles/remover-permiso
   * 
   * @param roleId ID del rol
   * @param permissionId ID del permiso a remover
   * @returns Rol actualizado
   */
  async removePermission(roleId: number, permissionId: number): Promise<RoleWithPermissions> {
    const response = await axiosInstance.post<ApiResponse<RoleWithPermissions>>(
      API_ENDPOINTS.ROLES.REMOVER_PERMISO,
      { roleId, permissionId }
    );
    return response.data.data;
  }

  // ===========================
  // MÉTODOS DE UTILIDAD
  // ===========================

  /**
   * Obtener solo roles activos
   * 
   * @returns Lista de roles activos
   */
  async getActive(): Promise<Role[]> {
    return this.getAll({ estado: true });
  }

  /**
   * Obtener roles por nivel de acceso
   * 
   * @param min Nivel mínimo
   * @param max Nivel máximo
   * @returns Lista de roles en ese rango
   */
  async getByAccessLevel(min: number, max: number): Promise<Role[]> {
    return this.getAll({ nivelAccesoMinimo: min, nivelAccesoMaximo: max });
  }

  /**
   * Obtener rol Super Administrador
   * 
   * @returns Rol de Super Administrador
   */
  async getSuperAdmin(): Promise<Role> {
    const roles = await this.getAll();
    const superAdmin = roles.find(r => r.nombre === 'Super Administrador' || r.nivelAcceso === 100);
    
    if (!superAdmin) {
      throw new Error('Rol Super Administrador no encontrado');
    }
    
    return superAdmin;
  }

  /**
   * Obtener rol Administrador
   * 
   * @returns Rol de Administrador
   */
  async getAdmin(): Promise<Role> {
    const roles = await this.getAll();
    const admin = roles.find(r => r.nombre === 'Administrador' || r.nivelAcceso === 80);
    
    if (!admin) {
      throw new Error('Rol Administrador no encontrado');
    }
    
    return admin;
  }

  /**
   * Obtener rol Empleado
   * 
   * @returns Rol de Empleado
   */
  async getEmployee(): Promise<Role> {
    const roles = await this.getAll();
    const employee = roles.find(r => r.nombre === 'Empleado' || r.nivelAcceso === 50);
    
    if (!employee) {
      throw new Error('Rol Empleado no encontrado');
    }
    
    return employee;
  }

  /**
   * Obtener rol Cliente
   * 
   * @returns Rol de Cliente
   */
  async getClient(): Promise<Role> {
    const roles = await this.getAll();
    const client = roles.find(r => r.nombre === 'Cliente' || r.nivelAcceso === 10);
    
    if (!client) {
      throw new Error('Rol Cliente no encontrado');
    }
    
    return client;
  }

  /**
   * Buscar roles por nombre
   * 
   * @param term Término de búsqueda
   * @returns Lista de roles que coinciden
   */
  async search(term: string): Promise<Role[]> {
    const roles = await this.getAll();
    const lowerTerm = term.toLowerCase();
    
    return roles.filter(role => 
      role.nombre.toLowerCase().includes(lowerTerm) ||
      role.descripcion?.toLowerCase().includes(lowerTerm)
    );
  }

  /**
   * Obtener estadísticas de roles
   * Calculadas localmente
   * 
   * @returns Estadísticas agregadas
   */
  async getStatistics(): Promise<RolesStatistics> {
    const roles = await this.getAll();
    
    const porNivelAcceso: { [nivel: number]: number } = {};
    
    roles.forEach(role => {
      porNivelAcceso[role.nivelAcceso] = (porNivelAcceso[role.nivelAcceso] || 0) + 1;
    });
    
    return {
      total: roles.length,
      activos: roles.filter(r => r.estado).length,
      inactivos: roles.filter(r => !r.estado).length,
      porNivelAcceso,
    };
  }

  /**
   * Verificar si un rol es del sistema (no modificable)
   * 
   * @param roleId ID del rol
   * @returns true si es rol del sistema, false si no
   */
  async isSystemRole(roleId: number): Promise<boolean> {
    const role = await this.getById(roleId);
    const systemRoles = ['Super Administrador', 'Administrador', 'Empleado', 'Cliente'];
    return systemRoles.includes(role.nombre);
  }

  /**
   * Validar nivel de acceso
   * 
   * @param level Nivel a validar
   * @returns true si es válido (1-100), false si no
   */
  isValidAccessLevel(level: number): boolean {
    return level >= 1 && level <= 100;
  }
}

// Exportar instancia única (singleton)
const rolesService = new RolesService();
export default rolesService;
