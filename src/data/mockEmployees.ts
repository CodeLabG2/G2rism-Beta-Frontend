/**
 * ⚠️ ARCHIVO DE DATOS MOCK - COMENTADO PARA USAR API REAL
 *
 * Este archivo contiene datos de prueba de empleados, usuarios y permisos.
 * Ha sido comentado para forzar el uso de la API real del backend.
 *
 * Fecha de comentado: 2025-12-16
 * Razón: Pruebas de integración con API real G2rismBeta.API
 */

import type { UserWithRoles } from '../services/types/users.types';
import type { PermissionSummary } from '../services/types/roles.types';

/* MOCK DATA COMENTADO - Usar API real
// Definir permisos del sistema
const allPermissions: PermissionSummary[] = [
  // Reservas
  { idPermiso: 1, modulo: 'Reservas', nombre: 'Ver Reservas', accion: 'Ver' },
  { idPermiso: 2, modulo: 'Reservas', nombre: 'Crear Reservas', accion: 'Crear' },
  { idPermiso: 3, modulo: 'Reservas', nombre: 'Editar Reservas', accion: 'Editar' },
  { idPermiso: 4, modulo: 'Reservas', nombre: 'Eliminar Reservas', accion: 'Eliminar' },
  
  // Paquetes
  { idPermiso: 5, modulo: 'Paquetes', nombre: 'Ver Paquetes', accion: 'Ver' },
  { idPermiso: 6, modulo: 'Paquetes', nombre: 'Crear Paquetes', accion: 'Crear' },
  { idPermiso: 7, modulo: 'Paquetes', nombre: 'Editar Paquetes', accion: 'Editar' },
  { idPermiso: 8, modulo: 'Paquetes', nombre: 'Eliminar Paquetes', accion: 'Eliminar' },
  
  // Clientes
  { idPermiso: 9, modulo: 'Clientes', nombre: 'Ver Clientes', accion: 'Ver' },
  { idPermiso: 10, modulo: 'Clientes', nombre: 'Crear Clientes', accion: 'Crear' },
  { idPermiso: 11, modulo: 'Clientes', nombre: 'Editar Clientes', accion: 'Editar' },
  { idPermiso: 12, modulo: 'Clientes', nombre: 'Eliminar Clientes', accion: 'Eliminar' },
  
  // Ventas
  { idPermiso: 13, modulo: 'Ventas', nombre: 'Ver Ventas', accion: 'Ver' },
  { idPermiso: 14, modulo: 'Ventas', nombre: 'Crear Ventas', accion: 'Crear' },
  { idPermiso: 15, modulo: 'Ventas', nombre: 'Editar Ventas', accion: 'Editar' },
  { idPermiso: 16, modulo: 'Ventas', nombre: 'Eliminar Ventas', accion: 'Eliminar' },
  { idPermiso: 17, modulo: 'Ventas', nombre: 'Aprobar Ventas', accion: 'Aprobar' },
  
  // Facturación
  { idPermiso: 18, modulo: 'Facturación', nombre: 'Ver Facturas', accion: 'Ver' },
  { idPermiso: 19, modulo: 'Facturación', nombre: 'Crear Facturas', accion: 'Crear' },
  { idPermiso: 20, modulo: 'Facturación', nombre: 'Editar Facturas', accion: 'Editar' },
  { idPermiso: 21, modulo: 'Facturación', nombre: 'Anular Facturas', accion: 'Eliminar' },
  
  // Transporte
  { idPermiso: 22, modulo: 'Transporte', nombre: 'Ver Transporte', accion: 'Ver' },
  { idPermiso: 23, modulo: 'Transporte', nombre: 'Crear Transporte', accion: 'Crear' },
  { idPermiso: 24, modulo: 'Transporte', nombre: 'Editar Transporte', accion: 'Editar' },
  { idPermiso: 25, modulo: 'Transporte', nombre: 'Eliminar Transporte', accion: 'Eliminar' },
  
  // Reportes
  { idPermiso: 26, modulo: 'Reportes', nombre: 'Ver Reportes', accion: 'Ver' },
  { idPermiso: 27, modulo: 'Reportes', nombre: 'Exportar Reportes', accion: 'Exportar' },
  
  // Usuarios
  { idPermiso: 28, modulo: 'Usuarios', nombre: 'Ver Usuarios', accion: 'Ver' },
  { idPermiso: 29, modulo: 'Usuarios', nombre: 'Crear Usuarios', accion: 'Crear' },
  { idPermiso: 30, modulo: 'Usuarios', nombre: 'Editar Usuarios', accion: 'Editar' },
  { idPermiso: 31, modulo: 'Usuarios', nombre: 'Eliminar Usuarios', accion: 'Eliminar' },
  
  // Proveedores
  { idPermiso: 32, modulo: 'Proveedores', nombre: 'Ver Proveedores', accion: 'Ver' },
  { idPermiso: 33, modulo: 'Proveedores', nombre: 'Crear Proveedores', accion: 'Crear' },
  { idPermiso: 34, modulo: 'Proveedores', nombre: 'Editar Proveedores', accion: 'Editar' },
  { idPermiso: 35, modulo: 'Proveedores', nombre: 'Eliminar Proveedores', accion: 'Eliminar' },
  
  // Configuración
  { idPermiso: 36, modulo: 'Configuración', nombre: 'Ver Configuración', accion: 'Ver' },
  { idPermiso: 37, modulo: 'Configuración', nombre: 'Editar Configuración', accion: 'Editar' },
  
  // Empleados
  { idPermiso: 38, modulo: 'Empleados', nombre: 'Ver Empleados', accion: 'Ver' },
  { idPermiso: 39, modulo: 'Empleados', nombre: 'Crear Empleados', accion: 'Crear' },
  { idPermiso: 40, modulo: 'Empleados', nombre: 'Editar Empleados', accion: 'Editar' },
  { idPermiso: 41, modulo: 'Empleados', nombre: 'Eliminar Empleados', accion: 'Eliminar' },
];

// Usuarios Mock con roles y permisos
export const mockEmployees: UserWithRoles[] = [
  // Super Admin - Acceso total (PUEDE ELIMINAR)
  {
    idUsuario: 1,
    username: 'Juan Pérez',
    email: 'juan.perez@g2rism.com',
    tipoUsuario: 'superadmin', // ✅ Cambiado
    estado: true,
    bloqueado: false,
    intentosFallidos: 0,
    ultimoAcceso: '2024-12-11T09:30:00',
    fechaCreacion: '2024-01-15T10:00:00',
    roles: [
      {
        idRol: 1,
        nombre: 'Super Administrador',
        descripcion: 'Acceso total al sistema',
        nivelAcceso: 100,
        fechaAsignacion: '2024-01-15T10:00:00',
        permisos: allPermissions, // Todos los permisos
      },
    ],
  },

  // Administrador - CRUD completo pero NO puede eliminar
  {
    idUsuario: 2,
    username: 'María González',
    email: 'maria.gonzalez@g2rism.com',
    tipoUsuario: 'admin', // ✅ Cambiado
    estado: true,
    bloqueado: false,
    intentosFallidos: 0,
    ultimoAcceso: '2024-12-11T08:15:00',
    fechaCreacion: '2024-02-01T10:00:00',
    roles: [
      {
        idRol: 2,
        nombre: 'Administrador',
        descripcion: 'Gestión completa sin eliminar',
        nivelAcceso: 90, // ✅ Cambiado de 80 a 90
        fechaAsignacion: '2024-02-01T10:00:00',
        permisos: allPermissions.filter(p => p.accion !== 'Eliminar'), // ✅ Sin permisos de eliminar
      },
    ],
  },

  // Agente de Reservas - Solo reservas y paquetes
  {
    idUsuario: 3,
    username: 'Carlos Ramírez',
    email: 'carlos.ramirez@g2rism.com',
    tipoUsuario: 'empleado',
    estado: true,
    bloqueado: false,
    intentosFallidos: 0,
    ultimoAcceso: '2024-12-11T07:45:00',
    fechaCreacion: '2024-03-10T10:00:00',
    roles: [
      {
        idRol: 3,
        nombre: 'Agente de Reservas',
        descripcion: 'Gestión de reservas y paquetes turísticos',
        nivelAcceso: 50,
        fechaAsignacion: '2024-03-10T10:00:00',
        permisos: [
          // Reservas - Ver, Crear, Editar
          allPermissions.find(p => p.idPermiso === 1)!,
          allPermissions.find(p => p.idPermiso === 2)!,
          allPermissions.find(p => p.idPermiso === 3)!,
          // Paquetes - Ver
          allPermissions.find(p => p.idPermiso === 5)!,
          // Clientes - Ver, Crear
          allPermissions.find(p => p.idPermiso === 9)!,
          allPermissions.find(p => p.idPermiso === 10)!,
        ],
      },
    ],
  },

  // Contador - Solo facturación y reportes
  {
    idUsuario: 4,
    username: 'Ana Martínez',
    email: 'ana.martinez@g2rism.com',
    tipoUsuario: 'empleado',
    estado: true,
    bloqueado: false,
    intentosFallidos: 0,
    ultimoAcceso: '2024-12-10T16:30:00',
    fechaCreacion: '2024-02-20T10:00:00',
    roles: [
      {
        idRol: 4,
        nombre: 'Contador',
        descripcion: 'Gestión de facturación y contabilidad',
        nivelAcceso: 60,
        fechaAsignacion: '2024-02-20T10:00:00',
        permisos: [
          // Facturación - Todos
          ...allPermissions.filter(p => p.modulo === 'Facturación'),
          // Ventas - Solo Ver
          allPermissions.find(p => p.idPermiso === 13)!,
          // Reportes - Ver y Exportar
          allPermissions.find(p => p.idPermiso === 26)!,
          allPermissions.find(p => p.idPermiso === 27)!,
        ],
      },
    ],
  },

  // Coordinador de Transporte - Solo transporte
  {
    idUsuario: 5,
    username: 'Luis Torres',
    email: 'luis.torres@g2rism.com',
    tipoUsuario: 'empleado',
    estado: true,
    bloqueado: false,
    intentosFallidos: 0,
    ultimoAcceso: '2024-12-11T06:00:00',
    fechaCreacion: '2024-04-05T10:00:00',
    roles: [
      {
        idRol: 5,
        nombre: 'Coordinador de Transporte',
        descripcion: 'Gestión de vehículos y conductores',
        nivelAcceso: 55,
        fechaAsignacion: '2024-04-05T10:00:00',
        permisos: [
          // Transporte - Todos
          ...allPermissions.filter(p => p.modulo === 'Transporte'),
          // Reservas - Solo Ver
          allPermissions.find(p => p.idPermiso === 1)!,
          // Proveedores - Ver
          allPermissions.find(p => p.idPermiso === 32)!,
        ],
      },
    ],
  },

  // Asistente - Acceso limitado solo lectura
  {
    idUsuario: 6,
    username: 'Laura Sánchez',
    email: 'laura.sanchez@g2rism.com',
    tipoUsuario: 'empleado',
    estado: true,
    bloqueado: false,
    intentosFallidos: 0,
    ultimoAcceso: '2024-12-11T08:00:00',
    fechaCreacion: '2024-05-15T10:00:00',
    roles: [
      {
        idRol: 6,
        nombre: 'Asistente',
        descripcion: 'Acceso de solo lectura',
        nivelAcceso: 30,
        fechaAsignacion: '2024-05-15T10:00:00',
        permisos: [
          // Solo Ver
          allPermissions.find(p => p.idPermiso === 1)!, // Ver Reservas
          allPermissions.find(p => p.idPermiso === 5)!, // Ver Paquetes
          allPermissions.find(p => p.idPermiso === 9)!, // Ver Clientes
          allPermissions.find(p => p.idPermiso === 13)!, // Ver Ventas
        ],
      },
    ],
  },

  // Empleado con múltiples roles
  {
    idUsuario: 7,
    username: 'Pedro Díaz',
    email: 'pedro.diaz@g2rism.com',
    tipoUsuario: 'empleado',
    estado: true,
    bloqueado: false,
    intentosFallidos: 0,
    ultimoAcceso: '2024-12-11T09:00:00',
    fechaCreacion: '2024-06-01T10:00:00',
    roles: [
      {
        idRol: 3,
        nombre: 'Agente de Reservas',
        descripcion: 'Gestión de reservas y paquetes turísticos',
        nivelAcceso: 50,
        fechaAsignacion: '2024-06-01T10:00:00',
        permisos: [
          allPermissions.find(p => p.idPermiso === 1)!,
          allPermissions.find(p => p.idPermiso === 2)!,
          allPermissions.find(p => p.idPermiso === 3)!,
          allPermissions.find(p => p.idPermiso === 5)!,
        ],
      },
      {
        idRol: 7,
        nombre: 'Soporte al Cliente',
        descripcion: 'Atención y soporte a clientes',
        nivelAcceso: 40,
        fechaAsignacion: '2024-06-01T10:00:00',
        permisos: [
          allPermissions.find(p => p.idPermiso === 9)!, // Ver Clientes
          allPermissions.find(p => p.idPermiso === 10)!, // Crear Clientes
          allPermissions.find(p => p.idPermiso === 11)!, // Editar Clientes
        ],
      },
    ],
  },

  // Empleado desactivado
  {
    idUsuario: 8,
    username: 'Roberto Méndez',
    email: 'roberto.mendez@g2rism.com',
    tipoUsuario: 'empleado',
    estado: false, // Inactivo
    bloqueado: false,
    intentosFallidos: 0,
    ultimoAcceso: '2024-11-30T17:00:00',
    fechaCreacion: '2024-01-20T10:00:00',
    roles: [
      {
        idRol: 6,
        nombre: 'Asistente',
        descripcion: 'Acceso de solo lectura',
        nivelAcceso: 30,
        fechaAsignacion: '2024-01-20T10:00:00',
        permisos: [
          allPermissions.find(p => p.idPermiso === 1)!,
          allPermissions.find(p => p.idPermiso === 5)!,
        ],
      },
    ],
  },
];

// Función helper para obtener empleado por email
export function getEmployeeByEmail(email: string): UserWithRoles | undefined {
  return mockEmployees.find(emp => emp.email === email);
}

// Función helper para obtener empleado por ID
export function getEmployeeById(id: number): UserWithRoles | undefined {
  return mockEmployees.find(emp => emp.idUsuario === id);
}

// Función helper para obtener empleados activos
export function getActiveEmployees(): UserWithRoles[] {
  return mockEmployees.filter(emp => emp.estado);
}
*/ // FIN MOCK DATA COMENTADO

// ⚠️ Exportaciones vacías para evitar errores de importación
export const mockEmployees: UserWithRoles[] = [];

export function getEmployeeByEmail(email: string): UserWithRoles | undefined {
  return undefined;
}

export function getEmployeeById(id: number): UserWithRoles | undefined {
  return undefined;
}

export function getActiveEmployees(): UserWithRoles[] {
  return [];
}