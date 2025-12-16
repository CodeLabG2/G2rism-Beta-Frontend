import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api/authService';
import { AuthUser, LoginRequest } from '../services/api/types';

// ============================================
// HOOK DE AUTENTICACIÓN
// ============================================

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Cargar usuario al montar el componente
  useEffect(() => {
    const loadUser = () => {
      const storedUser = authService.getUser();
      const token = authService.getToken();

      if (storedUser && token) {
        setUser(storedUser);
        setIsAuthenticated(true);
      }
      
      setIsLoading(false);
    };

    loadUser();
  }, []);

  /**
   * Iniciar sesión
   */
  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Registrar nuevo usuario
   */
  const register = useCallback(async (data: {
    nombre: string;
    email: string;
    password: string;
    telefono: string;
    documento: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await authService.register(data);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Cerrar sesión
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Actualizar perfil
   */
  const updateProfile = useCallback(async (data: Partial<AuthUser>) => {
    try {
      setIsLoading(true);
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Cambiar contraseña
   */
  const changePassword = useCallback(async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    try {
      setIsLoading(true);
      await authService.changePassword(data);
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refrescar datos del usuario
   */
  const refreshUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const updatedUser = await authService.getProfile();
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error al refrescar usuario:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshUser,
  };
}