import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.g2rism.com/api';

// Crear instancia de axios
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor de REQUEST - Agregar token JWT automáticamente
axiosInstance.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage
    const token = localStorage.getItem('g2rism_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log de peticiones en desarrollo
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de RESPONSE - Manejo de errores global
axiosInstance.interceptors.response.use(
  (response) => {
    // Log de respuestas en desarrollo
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }
    
    return response;
  },
  (error: AxiosError) => {
    // Manejo de errores específicos
    if (error.response) {
      const status = error.response.status;
      
      switch (status) {
        case 401:
          // Token inválido o expirado
          console.error('❌ No autorizado - Redirigiendo al login');
          localStorage.removeItem('g2rism_token');
          localStorage.removeItem('g2rism_user');
          window.location.href = '/login';
          break;
          
        case 403:
          console.error('❌ Acceso prohibido');
          break;
          
        case 404:
          console.error('❌ Recurso no encontrado');
          break;
          
        case 500:
          console.error('❌ Error interno del servidor');
          break;
          
        default:
          console.error('❌ Error de API:', error.response.data);
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error('❌ Sin respuesta del servidor');
    } else {
      // Error al configurar la petición
      console.error('❌ Error de configuración:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Funciones helper para peticiones
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => 
    axiosInstance.get<T>(url, config),
    
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    axiosInstance.post<T>(url, data, config),
    
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    axiosInstance.put<T>(url, data, config),
    
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    axiosInstance.patch<T>(url, data, config),
    
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => 
    axiosInstance.delete<T>(url, config),
};

export default axiosInstance;
