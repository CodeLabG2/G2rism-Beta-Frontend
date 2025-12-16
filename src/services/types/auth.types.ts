/**
 * Tipos para autenticación y autorización
 */

/**
 * Tipo de usuario
 */
export type TipoUsuario = 'empleado' | 'cliente';

/**
 * Request de registro
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  tipoUsuario: TipoUsuario;
  nombre: string;
  apellido: string;
}

/**
 * Response de registro
 */
export interface RegisterResponse {
  idUsuario: number;
  username: string;
  email: string;
  tipoUsuario: TipoUsuario;
  fechaRegistro: string;
  roles: string[];
  mensaje: string;
}

/**
 * Request de login
 */
export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

/**
 * Response de login
 */
export interface LoginResponse {
  idUsuario: number;
  username: string;
  email: string;
  tipoUsuario: TipoUsuario;
  token: string;
  refreshToken: string;
  expiresIn: number;
  tokenExpiration: string;
  tokenExpirationLocal: string;
  timeZone: string;
  roles: string[];
  permisos: string[];
}

/**
 * Request de refresh token
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Response de refresh token
 */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenExpiration: string;
  tokenExpirationLocal: string;
  timeZone: string;
  idUsuario: number;
  username: string;
}

/**
 * Request de recuperar contraseña
 */
export interface RecuperarPasswordRequest {
  email: string;
  frontendUrl?: string;
}

/**
 * Response de recuperar contraseña
 */
export interface RecuperarPasswordResponse {
  success: boolean;
  message: string;
  emailEnviado: boolean;
  fechaExpiracion: string;
}

/**
 * Request de reset contraseña
 */
export interface ResetPasswordRequest {
  codigo: string;
  newPassword: string;
}

/**
 * Response de reset contraseña
 */
export interface ResetPasswordResponse {
  mensaje: string;
}

/**
 * Request de cambiar contraseña (autenticado)
 */
export interface CambiarPasswordRequest {
  idUsuario: number;
  currentPassword: string;
  newPassword: string;
}

/**
 * Response de cambiar contraseña
 */
export interface CambiarPasswordResponse {
  mensaje: string;
}

/**
 * Request de logout
 */
export interface LogoutRequest {
  idUsuario: number;
}

/**
 * Response de logout
 */
export interface LogoutResponse {
  mensaje: string;
}

/**
 * Usuario autenticado (para contexto)
 */
export interface AuthUser {
  idUsuario: number;
  username: string;
  email: string;
  tipoUsuario: TipoUsuario;
  roles: string[];
  permisos: string[];
  token: string;
  refreshToken: string;
}

/**
 * Estado de autenticación
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}
