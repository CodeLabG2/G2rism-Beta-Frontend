import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from './config/endpoints';
import type {
  Permission,
  CreatePermissionDto,
  UpdatePermissionDto,
  PermissionsFilters,
  PermissionsStatistics,
  PermissionsByModule,
  ModuloSistema,
  AccionPermiso,
} from '../types/permissions.types';
import type { ApiResponse } from '../types/api.types';

/**
 * Servicio de Permisos
 * Gestión de permisos y control de acceso
 * 
 * Backend: PermisosController
 * Endpoints: 12
 * Autorización: Solo Super Administrador
 * 
 * ESTRUCTURA DE PERMISOS:
 * - Módulo: Área funcional del sistema
 * - Acción: Operación específica (Crear, Ver, Editar, Eliminar)
 * - Nombre: Identificador único del permiso
 * 
 * @author G2rism Team
 * @version 1.0
 */
class PermissionsService {
  /**
   * Obtener todos los permisos
   * GET /api/permisos
   * 
   * @param filters Filtros opcionales
   * @returns Lista de permisos
   */
  async getAll(filters?: PermissionsFilters): Promise<Permission[]> {
    const params = new URLSearchParams();
    
    if (filters?.modulo) {
      params.append('modulo', filters.modulo);
    }
    
    if (filters?.estado !== undefined) {
      params.append('estado', filters.estado.toString());
    }
    
    if (filters?.accion) {
      params.append('accion', filters.accion);
    }
    
    const queryString = params.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.PERMISOS.BASE}?${queryString}`
      : API_ENDPOINTS.PERMISOS.BASE;
    
    const response = await axiosInstance.get<ApiResponse<Permission[]>>(url);
    return response.data.data;
  }

  /**
   * Obtener permiso por ID
   * GET /api/permisos/{id}
   * 
   * @param id ID del permiso
   * @returns Permiso encontrado
   */
  async getById(id: number): Promise<Permission> {
    const response = await axiosInstance.get<ApiResponse<Permission>>(
      API_ENDPOINTS.PERMISOS.BY_ID(id)
    );
    return response.data.data;
  }

  /**
   * Obtener permisos por módulo
   * GET /api/permisos/modulo/{modulo}
   * 
   * @param modulo Nombre del módulo
   * @returns Lista de permisos del módulo
   */
  async getByModule(modulo: string): Promise<Permission[]> {
    const response = await axiosInstance.get<ApiResponse<Permission[]>>(
      API_ENDPOINTS.PERMISOS.BY_MODULO(modulo)
    );
    return response.data.data;
  }

  /**
   * Crear nuevo permiso
   * POST /api/permisos
   * 
   * VALIDACIONES:
   * - Combinación modulo + accion debe ser única
   * - Módulo y acción no pueden estar vacíos
   * 
   * @param data Datos del permiso a crear
   * @returns Permiso creado
   */
  async create(data: CreatePermissionDto): Promise<Permission> {
    const response = await axiosInstance.post<ApiResponse<Permission>>(
      API_ENDPOINTS.PERMISOS.BASE,
      data
    );
    return response.data.data;
  }

  /**
   * Actualizar permiso existente
   * PUT /api/permisos/{id}
   * 
   * @param id ID del permiso a actualizar
   * @param data Datos a actualizar
   * @returns Permiso actualizado
   */
  async update(id: number, data: UpdatePermissionDto): Promise<Permission> {
    const response = await axiosInstance.put<ApiResponse<Permission>>(
      API_ENDPOINTS.PERMISOS.BY_ID(id),
      data
    );
    return response.data.data;
  }

  /**
   * Eliminar permiso
   * DELETE /api/permisos/{id}
   * 
   * IMPORTANTE: No se puede eliminar si está asignado a algún rol
   * 
   * @param id ID del permiso a eliminar
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.PERMISOS.BY_ID(id));
  }

  // ===========================
  // MÉTODOS DE UTILIDAD
  // ===========================

  /**
   * Obtener solo permisos activos
   * 
   * @returns Lista de permisos activos
   */
  async getActive(): Promise<Permission[]> {
    return this.getAll({ estado: true });
  }

  /**
   * Obtener permisos por acción
   * 
   * @param accion Tipo de acción
   * @returns Lista de permisos de esa acción
   */
  async getByAction(accion: AccionPermiso): Promise<Permission[]> {
    return this.getAll({ accion });
  }

  /**
   * Obtener todos los módulos disponibles
   * Método calculado localmente
   * 
   * @returns Array de nombres de módulos
   */
  async getModules(): Promise<string[]> {
    const permissions = await this.getAll();
    const modules = permissions.map(p => p.modulo);
    return [...new Set(modules)].sort();
  }

  /**
   * Obtener todas las acciones disponibles
   * Método calculado localmente
   * 
   * @returns Array de acciones
   */
  async getActions(): Promise<string[]> {
    const permissions = await this.getAll();
    const actions = permissions.map(p => p.accion);
    return [...new Set(actions)].sort();
  }

  /**
   * Obtener permisos agrupados por módulo
   * 
   * @returns Objeto con permisos agrupados por módulo
   */
  async getGroupedByModule(): Promise<PermissionsByModule> {
    const permissions = await this.getAll();
    const grouped: PermissionsByModule = {};
    
    permissions.forEach(permission => {
      if (!grouped[permission.modulo]) {
        grouped[permission.modulo] = [];
      }
      grouped[permission.modulo].push(permission);
    });
    
    return grouped;
  }

  /**
   * Buscar permisos por término
   * 
   * @param term Término de búsqueda
   * @returns Lista de permisos que coinciden
   */
  async search(term: string): Promise<Permission[]> {
    const permissions = await this.getAll();
    const lowerTerm = term.toLowerCase();
    
    return permissions.filter(permission => 
      permission.nombre.toLowerCase().includes(lowerTerm) ||
      permission.modulo.toLowerCase().includes(lowerTerm) ||
      permission.accion.toLowerCase().includes(lowerTerm) ||
      permission.descripcion?.toLowerCase().includes(lowerTerm)
    );
  }

  /**
   * Obtener estadísticas de permisos
   * Calculadas localmente
   * 
   * @returns Estadísticas agregadas
   */
  async getStatistics(): Promise<PermissionsStatistics> {
    const permissions = await this.getAll();
    
    const porModulo: { [modulo: string]: number } = {};
    const porAccion: { [accion: string]: number } = {};
    
    permissions.forEach(permission => {
      porModulo[permission.modulo] = (porModulo[permission.modulo] || 0) + 1;
      porAccion[permission.accion] = (porAccion[permission.accion] || 0) + 1;
    });
    
    return {
      total: permissions.length,
      activos: permissions.filter(p => p.estado).length,
      inactivos: permissions.filter(p => !p.estado).length,
      porModulo,
      porAccion,
    };
  }

  /**
   * Crear permisos CRUD para un módulo
   * Utilidad para crear los 4 permisos básicos (Crear, Ver, Editar, Eliminar)
   * 
   * @param modulo Nombre del módulo
   * @returns Array de permisos creados
   */
  async createCrudPermissions(modulo: ModuloSistema): Promise<Permission[]> {
    const actions: AccionPermiso[] = ['Crear', 'Ver', 'Editar', 'Eliminar'];
    const permissions: Permission[] = [];
    
    for (const accion of actions) {
      const permission = await this.create({
        modulo,
        nombre: `${modulo}.${accion}`,
        accion,
        descripcion: `Permiso para ${accion.toLowerCase()} en el módulo de ${modulo}`,
        estado: true,
      });
      permissions.push(permission);
    }
    
    return permissions;
  }

  /**
   * Verificar si un permiso existe
   * 
   * @param modulo Módulo del permiso
   * @param accion Acción del permiso
   * @returns true si existe, false si no
   */
  async exists(modulo: string, accion: string): Promise<boolean> {
    try {
      const permissions = await this.getAll({ modulo, accion });
      return permissions.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtener permiso por módulo y acción
   * 
   * @param modulo Módulo del permiso
   * @param accion Acción del permiso
   * @returns Permiso encontrado o null
   */
  async getByModuleAndAction(modulo: string, accion: string): Promise<Permission | null> {
    const permissions = await this.getAll({ modulo, accion });
    return permissions.length > 0 ? permissions[0] : null;
  }

  /**
   * Validar nombre de permiso
   * Formato esperado: Modulo.Accion
   * 
   * @param nombre Nombre del permiso
   * @returns true si es válido, false si no
   */
  isValidPermissionName(nombre: string): boolean {
    const pattern = /^[A-Z][a-zA-Z]+\.[A-Z][a-z]+$/;
    return pattern.test(nombre);
  }
}

// Exportar instancia única (singleton)
const permissionsService = new PermissionsService();
export default permissionsService;
