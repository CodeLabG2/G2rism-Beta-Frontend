import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse, ApiError } from '../../types/api.types';
import { API_CONFIG, DEBUG_API } from '../../../src/config/api.config';

// URL base de la API desde configuración centralizada
const API_BASE_URL = API_CONFIG.BASE_URL;

/**
 * Instancia principal de Axios configurada para G2rism API
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

/**
 * Request Interceptor - Agrega token JWT automáticamente
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Obtener token del localStorage
    const token = localStorage.getItem(API_CONFIG.TOKEN.STORAGE_KEY);
    
    // Agregar Authorization header si existe token
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log de request en desarrollo
    if (DEBUG_API) {
      console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ [Request Error]', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor - Maneja respuestas y errores
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log de response en desarrollo
    if (DEBUG_API) {
      console.log(`✅ [API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    // Retornar solo el data de la respuesta
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Log de error
    console.error('❌ [API Error]', {
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      errorCode: error.response?.data?.errorCode,
    });

    // Manejo especial para 401 Unauthorized - Intentar refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Intentar renovar el token
        const refreshToken = localStorage.getItem(API_CONFIG.TOKEN.REFRESH_KEY);
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_BASE_URL.replace('/api', '')}/api/auth/refresh`, {
          refreshToken,
        });

        const { token, refreshToken: newRefreshToken } = response.data.data;

        // Guardar nuevos tokens
        localStorage.setItem(API_CONFIG.TOKEN.STORAGE_KEY, token);
        localStorage.setItem(API_CONFIG.TOKEN.REFRESH_KEY, newRefreshToken);

        // Reintentar request original con nuevo token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Si falla el refresh, limpiar tokens y redirigir a login
        localStorage.removeItem(API_CONFIG.TOKEN.STORAGE_KEY);
        localStorage.removeItem(API_CONFIG.TOKEN.REFRESH_KEY);
        localStorage.removeItem(API_CONFIG.TOKEN.USER_KEY);
        
        // Emitir evento para que la app redirija a login
        window.dispatchEvent(new CustomEvent('auth:logout'));
        
        return Promise.reject(refreshError);
      }
    }

    // Manejo especial para 429 Too Many Requests
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      console.warn(`⏳ Rate limit exceeded. Retry after ${retryAfter} seconds`);
    }

    // Manejo especial para errores de red
    if (!error.response) {
      const networkError: ApiError = {
        success: false,
        message: 'Error de conexión. Verifica tu conexión a internet.',
        statusCode: 0,
        errorCode: 'NETWORK_ERROR',
        timestamp: new Date().toISOString(),
      };
      return Promise.reject(networkError);
    }

    // Retornar error estructurado
    return Promise.reject(error.response?.data || error);
  }
);

/**
 * Helper para extraer data de ApiResponse
 */
export const unwrapApiResponse = <T>(response: ApiResponse<T>): T => {
  if (!response.success) {
    throw new Error(response.message || 'Error desconocido');
  }
  return response.data;
};

/**
 * Helper para manejar errores de la API
 */
export const handleApiError = (error: any): string => {
  if (error?.message) {
    return error.message;
  }
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  return 'Ha ocurrido un error inesperado';
};

export default apiClient;