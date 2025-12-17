/**
 * ⚠️ ARCHIVO HOOK CON LÓGICA MOCK - COMENTADO PARA USAR API REAL
 *
 * Este hook contenía lógica mock embebida.
 * Ha sido comentado para forzar el uso de la API real del backend.
 *
 * Fecha de comentado: 2025-12-16
 * Razón: Pruebas de integración con API real G2rismBeta.API
 */

import { useState, useEffect, useCallback } from 'react';
import { rolesService } from '../services/api';
import type { Role, CreateRoleDto, UpdateRoleDto } from '../services/api';

/* LÓGICA MOCK COMENTADA - Usar API real
// ====================================
// DATOS MOCK TEMPORALES
// ====================================
const mockRoles: Role[] = [
  {
    idRol: 1,
    nombre: 'Super Administrador',
    descripcion: 'Acceso completo al sistema',
    nivelAcceso: 100,
    estado: true,
    fechaCreacion: '2024-01-01T00:00:00',
    fechaActualizacion: '2024-01-01T00:00:00',
  },
  {
    idRol: 2,
    nombre: 'Administrador',
    descripcion: 'Gestión administrativa general',
    nivelAcceso: 80,
    estado: true,
    fechaCreacion: '2024-01-01T00:00:00',
    fechaActualizacion: '2024-01-01T00:00:00',
  },
  {
    idRol: 3,
    nombre: 'Empleado',
    descripcion: 'Personal operativo',
    nivelAcceso: 50,
    estado: true,
    fechaCreacion: '2024-01-01T00:00:00',
    fechaActualizacion: '2024-01-01T00:00:00',
  },
  {
    idRol: 4,
    nombre: 'Cliente',
    descripcion: 'Usuario cliente externo',
    nivelAcceso: 10,
    estado: true,
    fechaCreacion: '2024-01-01T00:00:00',
    fechaActualizacion: '2024-01-01T00:00:00',
  },
];

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRoles = useCallback(async (activeOnly = false) => {
    try {
      setLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = activeOnly ? mockRoles.filter(r => r.estado) : mockRoles;
      setRoles(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al cargar roles');
      console.error('Error loading roles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createRole = useCallback(async (data: CreateRoleDto) => {
    try {
      const newRole: Role = {
        idRol: Math.max(...mockRoles.map(r => r.idRol)) + 1,
        nombre: data.nombre,
        descripcion: data.descripcion || '',
        nivelAcceso: data.nivelAcceso,
        estado: true,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
      };
      mockRoles.push(newRole);
      setRoles(prev => [...prev, newRole]);
      return { success: true, data: newRole };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear rol';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const updateRole = useCallback(async (id: number, data: UpdateRoleDto) => {
    try {
      const roleIndex = mockRoles.findIndex(r => r.idRol === id);
      if (roleIndex !== -1) {
        const updatedRole = { ...mockRoles[roleIndex], ...data, fechaActualizacion: new Date().toISOString() };
        mockRoles[roleIndex] = updatedRole;
        setRoles(prev => prev.map(role => role.idRol === id ? updatedRole : role));
        return { success: true, data: updatedRole };
      }
      throw new Error('Rol no encontrado');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar rol';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const deleteRole = useCallback(async (id: number) => {
    try {
      const roleIndex = mockRoles.findIndex(r => r.idRol === id);
      if (roleIndex !== -1) {
        mockRoles.splice(roleIndex, 1);
        setRoles(prev => prev.filter(role => role.idRol !== id));
        return { success: true };
      }
      throw new Error('Rol no encontrado');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar rol';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const getRoleWithPermissions = useCallback(async (id: number) => {
    try {
      const role = mockRoles.find(r => r.idRol === id);
      if (!role) throw new Error('Rol no encontrado');
      return { success: true, data: { ...role, permisos: [] } };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener rol';
      return { success: false, error: errorMessage };
    }
  }, []);

  const assignPermissions = useCallback(async (roleId: number, permissionIds: number[]) => {
    try {
      const role = mockRoles.find(r => r.idRol === roleId);
      if (!role) throw new Error('Rol no encontrado');
      return { success: true, data: { ...role, permisos: [] } };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al asignar permisos';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const removePermission = useCallback(async (roleId: number, permissionId: number) => {
    try {
      const role = mockRoles.find(r => r.idRol === roleId);
      if (!role) throw new Error('Rol no encontrado');
      return { success: true, data: { ...role, permisos: [] } };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al remover permiso';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const getSystemRoles = useCallback(async () => {
    try {
      const superAdmin = mockRoles.find(r => r.nivelAcceso === 100);
      const admin = mockRoles.find(r => r.nivelAcceso === 80);
      const employee = mockRoles.find(r => r.nivelAcceso === 50);
      const client = mockRoles.find(r => r.nivelAcceso === 10);
      if (!superAdmin || !admin || !employee || !client) {
        throw new Error('Roles del sistema no encontrados');
      }
      return { success: true, data: { superAdmin, admin, employee, client } };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener roles del sistema';
      return { success: false, error: errorMessage };
    }
  }, []);

  const getStatistics = useCallback(async () => {
    try {
      const porNivelAcceso: { [nivel: number]: number } = {};
      mockRoles.forEach(role => {
        porNivelAcceso[role.nivelAcceso] = (porNivelAcceso[role.nivelAcceso] || 0) + 1;
      });
      const stats = {
        total: mockRoles.length,
        activos: mockRoles.filter(r => r.estado).length,
        inactivos: mockRoles.filter(r => !r.estado).length,
        porNivelAcceso,
      };
      return { success: true, data: stats };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener estadísticas';
      return { success: false, error: errorMessage };
    }
  }, []);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  return {
    roles,
    loading,
    error,
    loadRoles,
    createRole,
    updateRole,
    deleteRole,
    getRoleWithPermissions,
    assignPermissions,
    removePermission,
    getSystemRoles,
    getStatistics,
  };
}
// FIN LÓGICA MOCK COMENTADA */

// ⚠️ NUEVA IMPLEMENTACIÓN USANDO API REAL
/**
 * Hook personalizado para gestión de roles
 * Usa directamente la API real del backend
 */
export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRoles = useCallback(async (activeOnly = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = activeOnly
        ? await rolesService.getActive()
        : await rolesService.getAll();
      setRoles(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al cargar roles');
      console.error('Error loading roles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createRole = useCallback(async (data: CreateRoleDto) => {
    try {
      const newRole = await rolesService.create(data);
      setRoles(prev => [...prev, newRole]);
      return { success: true, data: newRole };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear rol';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const updateRole = useCallback(async (id: number, data: UpdateRoleDto) => {
    try {
      const updatedRole = await rolesService.update(id, data);
      setRoles(prev => prev.map(role => role.idRol === id ? updatedRole : role));
      return { success: true, data: updatedRole };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar rol';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const deleteRole = useCallback(async (id: number) => {
    try {
      await rolesService.delete(id);
      setRoles(prev => prev.filter(role => role.idRol !== id));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar rol';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const getRoleWithPermissions = useCallback(async (id: number) => {
    try {
      const role = await rolesService.getWithPermissions(id);
      return { success: true, data: role };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener rol';
      return { success: false, error: errorMessage };
    }
  }, []);

  const assignPermissions = useCallback(async (roleId: number, permissionIds: number[]) => {
    try {
      const updatedRole = await rolesService.assignPermissions(roleId, permissionIds);
      return { success: true, data: updatedRole };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al asignar permisos';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const removePermission = useCallback(async (roleId: number, permissionId: number) => {
    try {
      const updatedRole = await rolesService.removePermission(roleId, permissionId);
      return { success: true, data: updatedRole };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al remover permiso';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const getSystemRoles = useCallback(async () => {
    try {
      const [superAdmin, admin, employee, client] = await Promise.all([
        rolesService.getSuperAdmin(),
        rolesService.getAdmin(),
        rolesService.getEmployee(),
        rolesService.getClient(),
      ]);
      return { success: true, data: { superAdmin, admin, employee, client } };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener roles del sistema';
      return { success: false, error: errorMessage };
    }
  }, []);

  const getStatistics = useCallback(async () => {
    try {
      const stats = await rolesService.getStatistics();
      return { success: true, data: stats };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener estadísticas';
      return { success: false, error: errorMessage };
    }
  }, []);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  return {
    roles,
    loading,
    error,
    loadRoles,
    createRole,
    updateRole,
    deleteRole,
    getRoleWithPermissions,
    assignPermissions,
    removePermission,
    getSystemRoles,
    getStatistics,
  };
}