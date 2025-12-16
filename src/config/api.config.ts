/**
 * Configuración centralizada de la API G2rism
 * ============================================
 * Este archivo contiene toda la configuración necesaria para la comunicación
 * con el backend .NET 9.0 + MySQL
 */

// URL base de la API (desde variables de entorno)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configuración de timeouts
export const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000; // 30 segundos

// Ambiente actual
export const IS_DEVELOPMENT = import.meta.env.DEV;
export const IS_PRODUCTION = import.meta.env.PROD;

// Habilitar logs de debug
export const DEBUG_API = import.meta.env.VITE_DEBUG_API === 'true' || IS_DEVELOPMENT;

/**
 * Configuración completa de la API
 */
export const API_CONFIG = {
  // URL base
  BASE_URL: API_BASE_URL,
  
  // Timeout para peticiones
  TIMEOUT: API_TIMEOUT,
  
  // Headers por defecto
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Configuración de tokens JWT
  TOKEN: {
    STORAGE_KEY: 'g2rism_token',
    REFRESH_KEY: 'g2rism_refresh_token',
    USER_KEY: 'g2rism_user',
    EXPIRATION_BUFFER: 5 * 60 * 1000, // 5 minutos antes de expirar
  },
  
  // Configuración de reintentos
  RETRY: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 segundo
    RETRY_STATUS_CODES: [408, 429, 500, 502, 503, 504],
  },
  
  // Configuración de rate limiting
  RATE_LIMIT: {
    MAX_REQUESTS_PER_MINUTE: 100,
    RETRY_AFTER_HEADER: 'Retry-After',
  },
} as const;

/**
 * URLs de endpoints agrupados por módulo
 * (Importar desde endpoints.ts para centralización)
 */
export { API_ENDPOINTS } from '../services/api/config/endpoints';

/**
 * Helper para construir URLs completas
 */
export const buildApiUrl = (endpoint: string): string => {
  // Si el endpoint ya incluye el dominio, devolverlo tal cual
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  
  // Si el endpoint ya incluye /api, no duplicarlo
  if (endpoint.startsWith('/api/')) {
    return `${API_BASE_URL.replace('/api', '')}${endpoint}`;
  }
  
  // Si el endpoint empieza con /, agregarlo directamente
  if (endpoint.startsWith('/')) {
    return `${API_BASE_URL}${endpoint}`;
  }
  
  // Si no, agregar / antes del endpoint
  return `${API_BASE_URL}/${endpoint}`;
};

/**
 * Helper para obtener headers con token
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem(API_CONFIG.TOKEN.STORAGE_KEY);
  
  if (token) {
    return {
      ...API_CONFIG.HEADERS,
      'Authorization': `Bearer ${token}`,
    };
  }
  
  return API_CONFIG.HEADERS;
};

/**
 * Helper para verificar si hay token almacenado
 */
export const hasToken = (): boolean => {
  return !!localStorage.getItem(API_CONFIG.TOKEN.STORAGE_KEY);
};

/**
 * Helper para limpiar tokens del storage
 */
export const clearTokens = (): void => {
  localStorage.removeItem(API_CONFIG.TOKEN.STORAGE_KEY);
  localStorage.removeItem(API_CONFIG.TOKEN.REFRESH_KEY);
  localStorage.removeItem(API_CONFIG.TOKEN.USER_KEY);
};

/**
 * Configuración para desarrollo
 */
if (DEBUG_API) {
  console.log('🔧 API Configuration:', {
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    environment: IS_DEVELOPMENT ? 'development' : 'production',
    hasToken: hasToken(),
  });
}

export default API_CONFIG;
