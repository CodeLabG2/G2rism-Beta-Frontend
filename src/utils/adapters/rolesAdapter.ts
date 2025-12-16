import type { Role, RoleWithPermissions, CreateRoleDto, UpdateRoleDto } from '../../services/types/roles.types';
import type { Permission } from '../../services/types/permissions.types';

/**
 * ADAPTADOR DE ROLES Y PERMISOS
 * 
 * Convierte entre los tipos de la API backend y los tipos de la UI de configuración
 * 
 * Backend Type: Role, Permission (idRol, nombre, modulo, accion)
 * UI Type: Role con permissions matrix (id, name, permissions[{module, actions}])
 */

// Tipo de la UI del componente RolesPermissions
export interface UIRole {
  id: string;
  name: string;
  description: string;
  userCount: number;
  color: string;
  permissions: UIPermission[];
}

export interface UIPermission {
  id: string;
  module: string;
  actions: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
}

// Mapeo de acciones API → UI
const actionMapping: Record<string, keyof UIPermission['actions']> = {
  'Ver': 'view',
  'Crear': 'create',
  'Editar': 'edit',
  'Eliminar': 'delete',
};

// Mapeo inverso UI → API
const actionMappingReverse: Record<keyof UIPermission['actions'], string> = {
  'view': 'Ver',
  'create': 'Crear',
  'edit': 'Editar',
  'delete': 'Eliminar',
};

// Colores por nivel de acceso
const colorsByAccessLevel: Record<number, string> = {
  100: '#3A7AFE', // Super Admin - Azul
  80: '#F59E0B',  // Admin - Amarillo
  50: '#10B981',  // Empleado - Verde
  20: '#8B5CF6',  // Cliente - Morado
  10: '#6B7280',  // Invitado - Gris
};

/**
 * Convertir Rol de API (con permisos) a Rol de UI
 */
export function apiRoleToUiRole(apiRole: RoleWithPermissions, modules: string[]): UIRole {
  // Agrupar permisos por módulo
  const permissionsByModule: Record<string, UIPermission['actions']> = {};
  
  // Inicializar todos los módulos con acciones en false
  modules.forEach(module => {
    permissionsByModule[module] = {
      view: false,
      create: false,
      edit: false,
      delete: false,
    };
  });
  
  // Llenar con los permisos reales del rol
  apiRole.permisos?.forEach(perm => {
    if (!permissionsByModule[perm.modulo]) {
      permissionsByModule[perm.modulo] = {
        view: false,
        create: false,
        edit: false,
        delete: false,
      };
    }
    
    const uiAction = actionMapping[perm.accion];
    if (uiAction) {
      permissionsByModule[perm.modulo][uiAction] = true;
    }
  });
  
  // Convertir a array de UIPermission
  const uiPermissions: UIPermission[] = Object.entries(permissionsByModule).map(
    ([module, actions]) => ({
      id: `${module}-${apiRole.idRol}`,
      module,
      actions,
    })
  );
  
  return {
    id: apiRole.idRol.toString(),
    name: apiRole.nombre,
    description: apiRole.descripcion || '',
    userCount: 0, // No disponible en el modelo actual, se puede cargar por separado
    color: colorsByAccessLevel[apiRole.nivelAcceso] || '#6B7280',
    permissions: uiPermissions,
  };
}

/**
 * Convertir múltiples roles de API a UI
 */
export function apiRolesToUiRoles(apiRoles: RoleWithPermissions[], modules: string[]): UIRole[] {
  return apiRoles.map(role => apiRoleToUiRole(role, modules));
}

/**
 * Convertir Rol simple de API a Rol de UI (sin permisos detallados)
 */
export function apiSimpleRoleToUiRole(apiRole: Role, modules: string[]): UIRole {
  // Crear permisos vacíos para todos los módulos
  const uiPermissions: UIPermission[] = modules.map(module => ({
    id: `${module}-${apiRole.idRol}`,
    module,
    actions: {
      view: false,
      create: false,
      edit: false,
      delete: false,
    },
  }));
  
  return {
    id: apiRole.idRol.toString(),
    name: apiRole.nombre,
    description: apiRole.descripcion || '',
    userCount: 0,
    color: colorsByAccessLevel[apiRole.nivelAcceso] || '#6B7280',
    permissions: uiPermissions,
  };
}

/**
 * Convertir datos de formulario UI a CreateRoleDto para API
 */
export function uiRoleFormToApiCreateRole(formData: {
  name: string;
  description: string;
  color: string;
}): CreateRoleDto {
  // Mapear color a nivel de acceso
  const accessLevelByColor: Record<string, number> = {
    '#3A7AFE': 100, // Azul - Super Admin
    '#F59E0B': 80,  // Amarillo - Admin
    '#10B981': 50,  // Verde - Empleado
    '#8B5CF6': 20,  // Morado - Cliente
    '#EF4444': 40,  // Rojo - Especial
    '#6B7280': 10,  // Gris - Invitado
  };
  
  return {
    nombre: formData.name,
    descripcion: formData.description,
    nivelAcceso: accessLevelByColor[formData.color] || 50,
    estado: true,
  };
}

/**
 * Convertir datos de formulario UI a UpdateRoleDto para API
 */
export function uiRoleFormToApiUpdateRole(formData: {
  name: string;
  description: string;
  color: string;
}): UpdateRoleDto {
  // Mapear color a nivel de acceso
  const accessLevelByColor: Record<string, number> = {
    '#3A7AFE': 100,
    '#F59E0B': 80,
    '#10B981': 50,
    '#8B5CF6': 20,
    '#EF4444': 40,
    '#6B7280': 10,
  };
  
  return {
    nombre: formData.name,
    descripcion: formData.description,
    nivelAcceso: accessLevelByColor[formData.color] || 50,
  };
}

/**
 * Extraer IDs de permisos desde matriz de permisos UI
 */
export function extractPermissionIdsFromUiPermissions(
  uiPermissions: UIPermission[],
  allPermissions: Permission[]
): number[] {
  const permissionIds: number[] = [];
  
  uiPermissions.forEach(uiPerm => {
    Object.entries(uiPerm.actions).forEach(([action, isEnabled]) => {
      if (isEnabled) {
        const apiAction = actionMappingReverse[action as keyof UIPermission['actions']];
        
        // Buscar el permiso correspondiente en la lista de todos los permisos
        const matchingPermission = allPermissions.find(
          p => p.modulo === uiPerm.module && p.accion === apiAction
        );
        
        if (matchingPermission) {
          permissionIds.push(matchingPermission.idPermiso);
        }
      }
    });
  });
  
  return permissionIds;
}

/**
 * Extraer ID numérico del ID de rol
 */
export function extractRoleIdFromString(roleId: string): number {
  return parseInt(roleId);
}

/**
 * Obtener nivel de acceso desde color
 */
export function getAccessLevelFromColor(color: string): number {
  const accessLevelByColor: Record<string, number> = {
    '#3A7AFE': 100,
    '#F59E0B': 80,
    '#10B981': 50,
    '#8B5CF6': 20,
    '#EF4444': 40,
    '#6B7280': 10,
  };
  
  return accessLevelByColor[color] || 50;
}

/**
 * Obtener color desde nivel de acceso
 */
export function getColorFromAccessLevel(level: number): string {
  return colorsByAccessLevel[level] || '#6B7280';
}
