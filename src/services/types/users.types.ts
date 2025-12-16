// ===========================
// USERS TYPES
// ===========================

import type { PermissionSummary } from './roles.types';

/**
 * Representa un usuario del sistema
 */
export interface User {
  idUsuario: number;
  username: string;
  email: string;
  tipoUsuario: 'superadmin' | 'admin' | 'empleado' | 'cliente';
  estado: boolean;
  bloqueado: boolean;
  intentosFallidos: number;
  ultimoAcceso?: string;
  fechaCreacion: string;
  fechaModificacion?: string;
}

/**
 * Usuario con sus roles asignados
 */
export interface UserWithRoles extends User {
  roles: RoleSummary[];
}

/**
 * Resumen de un rol (usado en UserWithRoles)
 */
export interface RoleSummary {
  idRol: number;
  nombre: string;
  descripcion?: string;
  nivelAcceso: number;
  fechaAsignacion: string;
  permisos?: PermissionSummary[];
}

/**
 * DTO para crear un nuevo usuario
 */
export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  tipoUsuario: 'superadmin' | 'admin' | 'empleado' | 'cliente';
  rolesIds?: number[];
}

/**
 * DTO para actualizar un usuario existente
 */
export interface UpdateUserDto {
  email?: string;
  tipoUsuario?: 'superadmin' | 'admin' | 'empleado' | 'cliente';
}

/**
 * DTO para asignar roles a un usuario
 */
export interface AssignRolesDto {
  rolesIds: number[];
}

/**
 * Filtros para búsqueda de usuarios
 */
export interface UsersFilters {
  incluirInactivos?: boolean;
  tipoUsuario?: 'superadmin' | 'admin' | 'empleado' | 'cliente';
  estado?: boolean;
}

/**
 * Estadísticas de usuarios
 */
export interface UsersStatistics {
  total: number;
  activos: number;
  inactivos: number;
  bloqueados: number;
  empleados: number;
  clientes: number;
}
