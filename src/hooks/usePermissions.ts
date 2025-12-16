import { useMemo } from 'react';
import type { UserWithRoles } from '../services/types/users.types';
import type { PermissionSummary } from '../services/types/roles.types';
import type { AccionPermiso, ModuloSistema } from '../services/types/permissions.types';

/**
 * Hook para gestionar permisos de usuario
 * @param user Usuario con roles y permisos
 */
export function usePermissions(user: UserWithRoles) {
  // Obtener todos los permisos del usuario desde sus roles
  const allPermissions = useMemo(() => {
    const permisos: PermissionSummary[] = [];
    
    user.roles.forEach(role => {
      if (role.permisos) {
        permisos.push(...role.permisos);
      }
    });
    
    // Eliminar duplicados
    const uniquePermisos = Array.from(
      new Map(permisos.map(p => [p.idPermiso, p])).values()
    );
    
    return uniquePermisos;
  }, [user.roles]);

  /**
   * Verifica si el usuario tiene un permiso específico
   * @param modulo Módulo del sistema
   * @param accion Acción a verificar
   */
  const hasPermission = (modulo: string, accion: string): boolean => {
    return allPermissions.some(
      p => p.modulo === modulo && p.accion === accion
    );
  };

  /**
   * Verifica si el usuario tiene al menos uno de los permisos
   * @param modulo Módulo del sistema
   * @param acciones Array de acciones a verificar
   */
  const hasAnyPermission = (modulo: string, acciones: string[]): boolean => {
    return acciones.some(accion => hasPermission(modulo, accion));
  };

  /**
   * Verifica si el usuario tiene todos los permisos
   * @param modulo Módulo del sistema
   * @param acciones Array de acciones a verificar
   */
  const hasAllPermissions = (modulo: string, acciones: string[]): boolean => {
    return acciones.every(accion => hasPermission(modulo, accion));
  };

  /**
   * Obtiene todos los permisos de un módulo específico
   * @param modulo Módulo del sistema
   */
  const getModulePermissions = (modulo: string): PermissionSummary[] => {
    return allPermissions.filter(p => p.modulo === modulo);
  };

  /**
   * Obtiene todas las acciones permitidas para un módulo
   * @param modulo Módulo del sistema
   */
  const getModuleActions = (modulo: string): string[] => {
    return getModulePermissions(modulo).map(p => p.accion);
  };

  /**
   * Verifica si el usuario tiene acceso a un módulo (al menos un permiso)
   * @param modulo Módulo del sistema
   */
  const hasModuleAccess = (modulo: string): boolean => {
    return allPermissions.some(p => p.modulo === modulo);
  };

  /**
   * Obtiene todos los módulos a los que el usuario tiene acceso
   */
  const getAccessibleModules = (): string[] => {
    const modules = new Set(allPermissions.map(p => p.modulo));
    return Array.from(modules);
  };

  /**
   * Verifica si el usuario es super admin (nivel de acceso 100)
   */
  const isSuperAdmin = (): boolean => {
    return user.roles.some(role => role.nivelAcceso === 100);
  };

  /**
   * Verifica si el usuario es admin (nivel de acceso >= 80)
   */
  const isAdmin = (): boolean => {
    return user.roles.some(role => role.nivelAcceso >= 80);
  };

  /**
   * Obtiene el nivel de acceso máximo del usuario
   */
  const getMaxAccessLevel = (): number => {
    return Math.max(...user.roles.map(role => role.nivelAcceso), 0);
  };

  /**
   * Permisos agrupados por módulo
   */
  const permissionsByModule = useMemo(() => {
    const grouped: Record<string, PermissionSummary[]> = {};
    
    allPermissions.forEach(permission => {
      if (!grouped[permission.modulo]) {
        grouped[permission.modulo] = [];
      }
      grouped[permission.modulo].push(permission);
    });
    
    return grouped;
  }, [allPermissions]);

  /**
   * Verifica permisos CRUD completos
   */
  const hasCRUDPermissions = (modulo: string): {
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
  } => {
    return {
      canCreate: hasPermission(modulo, 'Crear'),
      canRead: hasPermission(modulo, 'Ver'),
      canUpdate: hasPermission(modulo, 'Editar'),
      canDelete: hasPermission(modulo, 'Eliminar'),
    };
  };

  return {
    // Permisos raw
    allPermissions,
    permissionsByModule,
    
    // Verificación de permisos
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    
    // Permisos por módulo
    getModulePermissions,
    getModuleActions,
    hasModuleAccess,
    getAccessibleModules,
    
    // Roles y niveles
    isSuperAdmin,
    isAdmin,
    getMaxAccessLevel,
    
    // Helpers
    hasCRUDPermissions,
    
    // Info del usuario
    user,
  };
}

/**
 * Hook para verificar un permiso específico
 * @param user Usuario
 * @param modulo Módulo
 * @param accion Acción
 */
export function useHasPermission(
  user: UserWithRoles,
  modulo: string,
  accion: string
): boolean {
  const { hasPermission } = usePermissions(user);
  return hasPermission(modulo, accion);
}

/**
 * Hook para verificar acceso a un módulo
 * @param user Usuario
 * @param modulo Módulo
 */
export function useHasModuleAccess(
  user: UserWithRoles,
  modulo: string
): boolean {
  const { hasModuleAccess } = usePermissions(user);
  return hasModuleAccess(modulo);
}
