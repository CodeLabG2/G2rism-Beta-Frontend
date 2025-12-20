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
 * DEBE coincidir EXACTAMENTE con UsuarioCreateDto del backend
 */
export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  confirmPassword: string; // REQUERIDO por el backend
  tipoUsuario: 'empleado' | 'cliente'; // Backend SOLO acepta estos dos valores
  rolesIds?: number[];
}

/**
 * DTO para actualizar un usuario existente
 * DEBE coincidir con UsuarioUpdateDto del backend - TODOS LOS CAMPOS OPCIONALES
 */
export interface UpdateUserDto {
  username?: string;
  email?: string;
  tipoUsuario?: 'empleado' | 'cliente'; // Backend SOLO acepta estos dos valores
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
