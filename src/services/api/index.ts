/**
 * G2RISM - API Services Index
 * 
 * Exportación centralizada de todos los servicios API
 * 
 * USO:
 * import { usersService, clientsService } from './services/api';
 * 
 * @author G2rism Team
 * @version 1.0
 */

// ===========================
// SERVICIOS PRINCIPALES
// ===========================

export { default as usersService } from './usersService';
export { default as clientsService } from './clientsService';
export { default as clientCategoriesService } from './clientCategoriesService';
export { default as clientPreferencesService } from './clientPreferencesService';
export { default as rolesService } from './rolesService';
export { default as permissionsService } from './permissionsService';

// ===========================
// SERVICIOS EXISTENTES
// ===========================

export { authService } from './authService';
export { bookingService } from './bookingService';
export { packageService } from './packageService';

// ===========================
// CONFIGURACIÓN
// ===========================

export { default as axiosInstance } from './axiosConfig';
export { api } from './axiosConfig';
export { API_ENDPOINTS } from './config/endpoints';

// ===========================
// RE-EXPORTAR TIPOS
// ===========================

// Users
export type {
  User,
  UserWithRoles,
  CreateUserDto,
  UpdateUserDto,
  AssignRolesDto,
  UsersFilters,
  UsersStatistics,
} from '../types/users.types';

// Clients
export type {
  Client,
  ClientWithCategory,
  ClientComplete,
  ClientCategory,
  ClientPreference,
  CreateClientDto,
  UpdateClientDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  CreatePreferenceDto,
  UpdatePreferenceDto,
  ClientsFilters,
  ClientsStatistics,
} from '../types/clients.types';

// Client Categories
export type {
  ClientCategory as Category,
  CreateClientCategoryDto,
  UpdateClientCategoryDto,
  ClientCategoriesFilters,
} from '../types/clientCategories.types';

// Client Preferences
export type {
  ClientPreference as Preference,
  CreateClientPreferenceDto,
  UpdateClientPreferenceDto,
} from '../types/clientPreferences.types';

// Roles
export type {
  Role,
  RoleWithPermissions,
  PermissionSummary,
  CreateRoleDto,
  UpdateRoleDto,
  AssignPermissionsDto,
  RolesFilters,
  RolesStatistics,
} from '../types/roles.types';

// Permissions
export type {
  Permission,
  CreatePermissionDto,
  UpdatePermissionDto,
  PermissionsFilters,
  ModuloSistema,
  AccionPermiso,
  PermissionsStatistics,
  PermissionsByModule,
} from '../types/permissions.types';

// API
export type { ApiResponse, ApiError } from '../types/api.types';

// ===========================
// TIPOS DE API REST (Nuevos)
// ===========================

export type {
  // Respuestas
  PaginatedResponse,
  
  // Auth
  AuthUser,
  LoginRequest,
  LoginResponse,
  
  // Bookings
  Booking,
  BookingService as BookingServiceType,
  CreateBookingRequest,
  BookingFilters,
  
  // Packages
  TourPackage,
  PackageItinerary,
  PackageFilters,
  
  // Providers
  Provider,
  
  // Sales
  Sale,
  Payment,
  CreatePaymentRequest,
  
  // Documents
  Document,
  
  // Notifications
  Notification,
  
  // Stats
  DashboardStats,
} from './types';