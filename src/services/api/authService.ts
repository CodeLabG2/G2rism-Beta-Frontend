import { api } from './axiosConfig';
import { ApiResponse, LoginRequest, RegisterRequest, LoginResponse, RegisterResponseDto, AuthUser, UsuarioLoginDto } from './types';

// ============================================
// SERVICIO DE AUTENTICACIÓN
// ============================================

class AuthService {
  private readonly TOKEN_KEY = 'g2rism_token';
  private readonly REFRESH_TOKEN_KEY = 'g2rism_refresh_token';
  private readonly USER_KEY = 'g2rism_user';

  /**
   * 🔄 Convierte UsuarioLoginDto del backend a AuthUser para el frontend
   *
   * IMPORTANTE: El backend maneja:
   * - tipoUsuario: "empleado" o "cliente" (tipo general)
   * - roles[]: ["Super Administrador", "Administrador", "Empleado", "Cliente"] (roles específicos)
   *
   * Debemos mapear basándonos en roles[], NO en tipoUsuario
   */
  private adaptUsuarioToAuthUser(usuario: UsuarioLoginDto): AuthUser {
    // Determinar el rol en formato frontend basándose en roles[]
    let role: 'Admin' | 'Employee' | 'Client' = 'Client';

    // Verificar los roles del usuario (puede tener múltiples roles)
    if (usuario.roles && usuario.roles.length > 0) {
      const primeraRol = usuario.roles[0].toLowerCase();

      // Mapeo basado en roles[] del backend
      if (primeraRol.includes('super') || primeraRol === 'super administrador') {
        role = 'Admin'; // Super Administrador → Admin en frontend
      } else if (primeraRol === 'administrador' || primeraRol === 'admin') {
        role = 'Admin'; // Administrador → Admin en frontend
      } else if (primeraRol === 'empleado' || primeraRol === 'employee') {
        role = 'Employee'; // Empleado → Employee en frontend
      } else {
        role = 'Client'; // Cliente → Client en frontend
      }
    } else {
      // Fallback: si no tiene roles, usar tipoUsuario
      const tipoUsuario = usuario.tipoUsuario.toLowerCase();
      role = tipoUsuario === 'empleado' ? 'Employee' : 'Client';
    }

    return {
      id: usuario.idUsuario.toString(),
      name: usuario.username,
      email: usuario.email,
      role: role,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Iniciar sesión
   * Acepta email o username
   */
  async login(credentials: { email: string; password: string }): Promise<{ token: string; refreshToken: string; user: AuthUser }> {
    try {
      // 🔄 Adaptar datos al formato que espera el backend (LoginRequestDto)
      const loginRequest: LoginRequest = {
        usernameOrEmail: credentials.email, // Backend acepta email o username
        password: credentials.password,
        rememberMe: false,
      };

      const response = await api.post<ApiResponse<LoginResponse>>(
        '/api/auth/login',
        loginRequest
      );

      const loginData = response.data.data;

      // 🔄 Adaptar UsuarioLoginDto a AuthUser
      const authUser = this.adaptUsuarioToAuthUser(loginData.usuario);

      // Guardar tokens y usuario en localStorage
      this.setToken(loginData.token);
      this.setRefreshToken(loginData.refreshToken);
      this.setUser(authUser);

      return {
        token: loginData.token,
        refreshToken: loginData.refreshToken,
        user: authUser,
      };
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  /**
   * Registrar nuevo cliente
   * Por defecto se registra como Cliente (nivel 50)
   *
   * IMPORTANTE: El backend NO hace auto-login en register.
   * Después de registrar exitosamente, debemos hacer login manualmente.
   */
  async register(data: {
    nombre: string;
    email: string;
    password: string;
    confirmPassword: string;
    telefono?: string;
    documento?: string;
    username: string;
    acceptTerms: boolean;
  }): Promise<{ user: { id: string; email: string; username: string } }> {
    try {
      // 🔄 Adaptar datos al formato que espera el backend (RegisterRequestDto)
      const registerRequest: RegisterRequest = {
        username: data.username,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        nombre: data.nombre,
        apellido: '', // Opcional - el frontend no lo pide por ahora
        tipoUsuario: 'cliente', // Por defecto siempre es cliente
        aceptaTerminos: data.acceptTerms,
      };

      const response = await api.post<ApiResponse<RegisterResponseDto>>(
        '/api/auth/register',
        registerRequest
      );

      const registerData = response.data.data;

      console.log('✅ Usuario registrado, ahora haciendo auto-login...');

      // 🔄 Auto-login después del registro exitoso
      await this.login({
        email: data.email,
        password: data.password,
      });

      return {
        user: {
          id: registerData.idUsuario.toString(),
          email: registerData.email,
          username: registerData.username,
        },
      };
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  /**
   * Cerrar sesión
   * El backend requiere enviar el idUsuario en el body
   */
  async logout(): Promise<void> {
    try {
      // Obtener el usuario actual para enviar su ID
      const user = this.getUser();

      if (user && user.id) {
        // Llamar al endpoint de logout con el idUsuario en el body
        await api.post('/api/auth/logout', parseInt(user.id));
      }
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