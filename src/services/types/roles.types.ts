// ===========================
// ROLES TYPES
// ===========================

/**
 * Representa un rol del sistema
 */
export interface Role {
  idRol: number;
  nombre: string;
  descripcion?: string;
  nivelAcceso: number;
  estado: boolean;
  fechaCreacion: string;
  fechaModificacion?: string;
}

/**
 * Rol con sus permisos asignados
 */
export interface RoleWithPermissions extends Role {
  permisos: PermissionSummary[];
}

/**
 * Resumen de un permiso (usado en RoleWithPermissions)
 */
export interface PermissionSummary {
  idPermiso: number;
  nombre: string;
  modulo: string;
  accion: string;
  descripcion?: string;
}

/**
 * DTO para crear un nuevo rol
 */
export interface CreateRoleDto {
  nombre: string;
  descripcion?: string;
  nivelAcceso: number;
  permisosIds?: number[];
  estado?: boolean;
}

/**
 * DTO para actualizar un rol
 */
export interface UpdateRoleDto {
  nombre?: string;
  descripcion?: string;
  nivelAcceso?: number;
  estado?: boolean;
}

/**
 * DTO para asignar permisos a un rol
 */
export interface AssignPermissionsDto {
  permisosIds: number[];
}

/**
 * Filtros para búsqueda de roles
 */
export interface RolesFilters {
  estado?: boolean;
  nivelAccesoMinimo?: number;
  nivelAccesoMaximo?: number;
}

/**
 * Estadísticas de roles
 */
export interface RolesStatistics {
  total: number;
  activos: number;
  inactivos: number;
  porNivelAcceso: {
    [nivel: number]: number;
  };
}
