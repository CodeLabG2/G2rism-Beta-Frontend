// ===========================
// PERMISSIONS TYPES
// ===========================

/**
 * Representa un permiso del sistema
 */
export interface Permission {
  idPermiso: number;
  modulo: string;
  nombre: string;
  accion: string;
  descripcion?: string;
  estado: boolean;
  fechaCreacion: string;
  fechaModificacion?: string;
}

/**
 * DTO para crear un nuevo permiso
 */
export interface CreatePermissionDto {
  modulo: string;
  nombre: string;
  accion: string;
  descripcion?: string;
  estado?: boolean;
}

/**
 * DTO para actualizar un permiso
 */
export interface UpdatePermissionDto {
  nombre?: string;
  accion?: string;
  descripcion?: string;
  estado?: boolean;
}

/**
 * Filtros para búsqueda de permisos
 */
export interface PermissionsFilters {
  modulo?: string;
  estado?: boolean;
  accion?: string;
}

/**
 * Módulos del sistema
 */
export type ModuloSistema = 
  | 'Usuarios'
  | 'Clientes'
  | 'Empleados'
  | 'Proveedores'
  | 'Ventas'
  | 'Cotizaciones'
  | 'Facturación'
  | 'Transporte'
  | 'Reportes'
  | 'Auditoría'
  | 'Configuración';

/**
 * Acciones de permisos
 */
export type AccionPermiso = 
  | 'Crear'
  | 'Ver'
  | 'Editar'
  | 'Eliminar'
  | 'Exportar'
  | 'Importar'
  | 'Aprobar'
  | 'Rechazar';

/**
 * Estadísticas de permisos
 */
export interface PermissionsStatistics {
  total: number;
  activos: number;
  inactivos: number;
  porModulo: {
    [modulo: string]: number;
  };
  porAccion: {
    [accion: string]: number;
  };
}

/**
 * Agrupación de permisos por módulo
 */
export interface PermissionsByModule {
  [modulo: string]: Permission[];
}
