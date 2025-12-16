import { api } from './axiosConfig';
import { ApiResponse, LoginRequest, LoginResponse, AuthUser } from './types';

// ============================================
// SERVICIO DE AUTENTICACIÓN
// ============================================

class AuthService {
  private readonly TOKEN_KEY = 'g2rism_token';
  private readonly REFRESH_TOKEN_KEY = 'g2rism_refresh_token';
  private readonly USER_KEY = 'g2rism_user';

  /**
   * Iniciar sesión
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<ApiResponse<LoginResponse>>(
        '/api/auth/login',
        credentials
      );

      const loginData = response.data.data;

      // Guardar tokens y usuario en localStorage
      this.setToken(loginData.token);
      this.setRefreshToken(loginData.refreshToken);
      this.setUser(loginData.user);

      return loginData;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  /**
   * Registrar nuevo cliente
   */
  async register(data: {
    nombre: string;
    email: string;
    password: string;
    telefono: string;
    documento: string;
  }): Promise<LoginResponse> {
    try {
      const response = await api.post<ApiResponse<LoginResponse>>(
        '/api/auth/register',
        data
      );

      const loginData = response.data.data;

      // Guardar tokens y usuario
      this.setToken(loginData.token);
      this.setRefreshToken(loginData.refreshToken);
      this.setUser(loginData.user);

      return loginData;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      // Llamar al endpoint de logout (opcional)
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Limpiar localStorage siempre
      this.clearAuth();
    }
  }

  /**
   * Refrescar token
   */
  async refreshToken(): Promise<string> {
    try {
      const refreshToken = this.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No hay refresh token disponible');
      }

      const response = await api.post<ApiResponse<{ token: string }>>(
        '/api/auth/refresh',
        { refreshToken }
      );

      const newToken = response.data.data.token;
      this.setToken(newToken);

      return newToken;
    } catch (error) {
      console.error('Error al refrescar token:', error);
      this.clearAuth();
      throw error;
    }
  }

  /**
   * Obtener perfil del usuario actual
   */
  async getProfile(): Promise<AuthUser> {
    try {
      const response = await api.get<ApiResponse<AuthUser>>('/api/auth/profile');
      const user = response.data.data;
      this.setUser(user);
      return user;
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      throw error;
    }
  }

  /**
   * Actualizar perfil
   */
  async updateProfile(data: Partial<AuthUser>): Promise<AuthUser> {
    try {
      const response = await api.put<ApiResponse<AuthUser>>('/api/auth/profile', data);
      const user = response.data.data;
      this.setUser(user);
      return user;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    try {
      await api.post('/api/auth/cambiar-password', data);
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw error;
    }
  }

  /**
   * Recuperar contraseña
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post('/api/auth/recuperar-password', { email });
    } catch (error) {
      console.error('Error al recuperar contraseña:', error);
      throw error;
    }
  }

  /**
   * Resetear contraseña
   */
  async resetPassword(data: {
    token: string;
    newPassword: string;
  }): Promise<void> {
    try {
      await api.post('/api/auth/reset-password', data);
    } catch (error) {
      console.error('Error al resetear contraseña:', error);
      throw error;
    }
  }

  // ============================================
  // MÉTODOS DE STORAGE
  // ============================================

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setUser(user: AuthUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): AuthUser | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    const user = this.getUser();
    return user?.role || null;
  }
}

// Exportar instancia única (Singleton)
export const authService = new AuthService();