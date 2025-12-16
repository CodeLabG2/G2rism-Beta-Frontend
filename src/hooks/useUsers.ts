import { useState, useEffect, useCallback } from 'react';
import { usersService, rolesService } from '../services/api';
import { mockUsers } from '../data/mockData';
import type { User, CreateUserDto, UpdateUserDto } from '../services/api';

/**
 * Hook personalizado para gestión de usuarios
 * Integra el usersService con React state management
 * 
 * @returns Funciones y estado para gestionar usuarios
 */
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Cargar todos los usuarios
   */
  const loadUsers = useCallback(async (includeInactive = false) => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        const data = includeInactive 
          ? await usersService.getAll({ incluirInactivos: true })
          : await usersService.getActive();
        setUsers(data);
      } catch (apiError) {
        // Si falla la API, usar datos mock
        console.log('API no disponible, usando datos mock de usuarios');
        setUsers(mockUsers as any);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al cargar usuarios');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crear nuevo usuario
   */
  const createUser = useCallback(async (data: CreateUserDto) => {
    try {
      const newUser = await usersService.create(data);
      setUsers(prev => [...prev, newUser]);
      return { success: true, data: newUser };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear usuario';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Actualizar usuario existente
   */
  const updateUser = useCallback(async (id: number, data: UpdateUserDto) => {
    try {
      const updatedUser = await usersService.update(id, data);
      setUsers(prev => prev.map(user => 
        user.idUsuario === id ? updatedUser : user
      ));
      return { success: true, data: updatedUser };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar usuario';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Eliminar usuario
   */
  const deleteUser = useCallback(async (id: number) => {
    try {
      await usersService.delete(id);
      setUsers(prev => prev.filter(user => user.idUsuario !== id));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar usuario';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Activar usuario
   */
  const activateUser = useCallback(async (id: number) => {
    try {
      const updatedUser = await usersService.activate(id);
      setUsers(prev => prev.map(user => 
        user.idUsuario === id ? updatedUser : user
      ));
      return { success: true, data: updatedUser };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al activar usuario';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Desactivar usuario
   */
  const deactivateUser = useCallback(async (id: number) => {
    try {
      const updatedUser = await usersService.deactivate(id);
      setUsers(prev => prev.map(user => 
        user.idUsuario === id ? updatedUser : user
      ));
      return { success: true, data: updatedUser };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al desactivar usuario';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Alternar estado activo/inactivo
   */
  const toggleUserStatus = useCallback(async (id: number) => {
    try {
      const updatedUser = await usersService.toggleActive(id);
      setUsers(prev => prev.map(user => 
        user.idUsuario === id ? updatedUser : user
      ));
      return { success: true, data: updatedUser };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cambiar estado';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Bloquear usuario
   */
  const blockUser = useCallback(async (id: number) => {
    try {
      const updatedUser = await usersService.block(id);
      setUsers(prev => prev.map(user => 
        user.idUsuario === id ? updatedUser : user
      ));
      return { success: true, data: updatedUser };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al bloquear usuario';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Desbloquear usuario
   */
  const unblockUser = useCallback(async (id: number) => {
    try {
      const updatedUser = await usersService.unblock(id);
      setUsers(prev => prev.map(user => 
        user.idUsuario === id ? updatedUser : user
      ));
      return { success: true, data: updatedUser };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al desbloquear usuario';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Asignar roles a un usuario
   */
  const assignRoles = useCallback(async (userId: number, roleIds: number[]) => {
    try {
      const updatedUser = await usersService.assignRoles(userId, roleIds);
      // Actualizar en el estado local si es necesario
      return { success: true, data: updatedUser };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al asignar roles';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Buscar usuarios
   */
  const searchUsers = useCallback(async (term: string) => {
    try {
      const results = await usersService.search(term);
      return { success: true, data: results };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al buscar usuarios';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener estadísticas
   */
  const getStatistics = useCallback(async () => {
    try {
      const stats = await usersService.getStatistics();
      return { success: true, data: stats };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener estadísticas';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Cargar usuarios al montar el componente
   */
  useEffect(() => {
    loadUsers(true); // Cargar todos incluyendo inactivos
  }, [loadUsers]);

  return {
    users,
    loading,
    error,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    activateUser,
    deactivateUser,
    toggleUserStatus,
    blockUser,
    unblockUser,
    assignRoles,
    searchUsers,
    getStatistics,
  };
}