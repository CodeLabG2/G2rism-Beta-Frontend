/**
 * Adaptador para transformar datos entre API y UI
 * Convierte tipos del backend a tipos del frontend y viceversa
 */

import type { User as ApiUser } from '../../services/api';
import type { User as UiUser, Role as UiRole } from '../../components/admin/views/users/types';

/**
 * Mapeo de roles backend a UI
 * Basado en los roles estándar del sistema
 */
const ROLE_COLORS: Record<string, string> = {
  'Super Administrador': '#3A7AFE',
  'Administrador': '#F59E0B',
  'Empleado': '#10B981',
  'Cliente': '#6B7280',
  'Agente de Ventas': '#10B981',
  'Contador': '#8B5CF6',
  'Usuario': '#6B7280',
};

/**
 * Convertir usuario de API a formato UI
 */
export function apiUserToUiUser(apiUser: ApiUser, roles?: any[]): UiUser {
  // Obtener el rol principal (si tiene múltiples, tomar el primero)
  const roleName = getRoleName(apiUser, roles);
  const roleColor = ROLE_COLORS[roleName] || '#6B7280';

  return {
    id: apiUser.idUsuario.toString(),
    name: apiUser.username, // Usar username como nombre
    email: apiUser.email,
    phone: '-', // El backend no tiene teléfono en usuarios, solo en clientes/empleados
    role: {
      id: '1', // Placeholder, se puede obtener del backend si tiene roles
      name: roleName,
      color: roleColor,
    },
    status: apiUser.estado ? 'active' : 'inactive',
    avatar: undefined, // No hay avatar en el backend
    createdAt: formatDate(apiUser.fechaCreacion),
    lastLogin: apiUser.ultimoAcceso ? formatDateTime(apiUser.ultimoAcceso) : 'Nunca',
    department: apiUser.tipoUsuario === 'empleado' ? 'Empleado' : 'Cliente',
  };
}

/**
 * Convertir múltiples usuarios de API a UI
 */
export function apiUsersToUiUsers(apiUsers: ApiUser[], roles?: any[]): UiUser[] {
  return apiUsers.map(user => apiUserToUiUser(user, roles));
}

/**
 * Obtener nombre del rol basado en el tipo de usuario
 */
function getRoleName(apiUser: ApiUser, roles?: any[]): string {
  // Si tipoUsuario es empleado, puede ser Super Admin, Admin, Empleado, etc.
  // Si tipoUsuario es cliente, es Cliente
  
  if (apiUser.tipoUsuario === 'cliente') {
    return 'Cliente';
  }
  
  // Para empleados, intentar determinar el rol
  // Por ahora retornamos 'Empleado' por defecto
  // TODO: Obtener el rol real desde la relación usuarios-roles
  if (apiUser.username === 'admin' || apiUser.username === 'superadmin') {
    return 'Super Administrador';
  }
  
  return 'Empleado';
}

/**
 * Formatear fecha ISO a formato legible
 * 2024-01-15T00:00:00 -> 2024-01-15
 */
function formatDate(isoDate: string): string {
  if (!isoDate) return '';
  return isoDate.split('T')[0];
}

/**
 * Formatear fecha y hora ISO a formato legible
 * 2024-12-03T10:30:00 -> 2024-12-03 10:30
 */
function formatDateTime(isoDateTime: string): string {
  if (!isoDateTime) return '';
  const date = new Date(isoDateTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * Convertir datos del formulario UI a formato API para crear usuario
 * CORREGIDO: Incluye confirmPassword y respeta username tal cual
 */
export function uiFormDataToApiCreateUser(formData: any) {
  // Generar una contraseña temporal segura
  const tempPassword = generateTemporaryPassword();

  return {
    username: formData.name, // Enviar username tal cual (ya validado en el formulario)
    email: formData.email,
    password: tempPassword,
    confirmPassword: tempPassword, // REQUERIDO por el backend
    tipoUsuario: formData.department === 'Cliente' ? 'cliente' as const : 'empleado' as const,
    rolesIds: formData.roleId ? [parseInt(formData.roleId)] : undefined,
  };
}

/**
 * Generar contraseña temporal segura
 */
function generateTemporaryPassword(): string {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
  let password = '';
  
  // Asegurar al menos un carácter de cada tipo
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Mayúscula
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Minúscula
  password += '0123456789'[Math.floor(Math.random() * 10)]; // Número
  password += '!@#$%&*'[Math.floor(Math.random() * 7)]; // Especial
  
  // Completar el resto
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Mezclar la contraseña
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Convertir datos del formulario UI a formato API para actualización
 * Solo campos opcionales según UsuarioUpdateDto
 */
export function uiFormDataToApiUpdateUser(formData: any) {
  return {
    username: formData.name, // Opcional en actualización
    email: formData.email,
    tipoUsuario: formData.department === 'Cliente' ? 'cliente' as const : 'empleado' as const,
  };
}