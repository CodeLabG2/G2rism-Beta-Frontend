/**
 * Tipos base para respuestas de la API
 */

/**
 * Respuesta estándar de la API (wrapper)
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

/**
 * Respuesta de error de la API
 */
export interface ApiError {
  success: false;
  message: string;
  statusCode: number;
  errorCode?: string;
  errors?: Record<string, string[]> | null;
  stackTrace?: string;
  timestamp: string;
}

/**
 * Opciones de paginación
 */
export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

/**
 * Respuesta paginada
 */
export interface PaginatedResponse<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/**
 * Parámetros de búsqueda genéricos
 */
export interface SearchParams {
  searchTerm?: string;
  filters?: Record<string, any>;
  pagination?: PaginationParams;
}

/**
 * Estadísticas genéricas
 */
export interface Statistics {
  total: number;
  activos?: number;
  inactivos?: number;
  [key: string]: any;
}
