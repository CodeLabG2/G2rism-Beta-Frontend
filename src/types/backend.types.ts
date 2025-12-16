/**
 * Tipos TypeScript para las respuestas del backend G2rism
 * =========================================================
 * Estos tipos están alineados con los DTOs de .NET 9.0
 */

// ============================================
// RESPUESTAS GENÉRICAS DE LA API
// ============================================

/**
 * Respuesta exitosa estándar del backend
 * Basado en ApiResponse<T> de .NET
 */
export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}

/**
 * Respuesta de error estándar del backend
 * Basado en ApiErrorResponse de .NET
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  statusCode: number;
  errorCode?: string;
  errors?: Record<string, string[]>; // Errores de validación
  timestamp?: string;
}

// ============================================
// AUTENTICACIÓN Y USUARIOS
// ============================================

export interface LoginRequest {
  correoElectronico: string;
  contraseña: string;
}

export interface RegisterRequest {
  correoElectronico: string;
  contraseña: string;
  confirmarContraseña: string;
  nombreUsuario: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  usuario: {
    idUsuario: number;
    nombreUsuario: string;
    correoElectronico: string;
    estado: boolean;
    roles: string[];
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// ============================================
// CLIENTES (CRM)
// ============================================

export interface Cliente {
  idCliente: number;
  idUsuario: number | null;
  idCategoria: number | null;
  nombre: string;
  apellido: string;
  documentoIdentidad: string;
  tipoDocumento: string;
  fechaNacimiento: string; // ISO date string
  correoElectronico: string;
  telefono: string;
  direccion: string | null;
  ciudad: string | null;
  pais: string | null;
  estado: boolean;
  fechaRegistro: string; // ISO date string
  categoriaNombre?: string;
}

export interface ClienteCreateDto {
  idUsuario?: number;
  idCategoria?: number;
  nombre: string;
  apellido: string;
  documentoIdentidad: string;
  tipoDocumento: string;
  fechaNacimiento: string;
  correoElectronico: string;
  telefono: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
  estado: boolean;
}

export interface ClienteUpdateDto extends ClienteCreateDto {
  idCliente: number;
}

export interface CategoriaCliente {
  idCategoria: number;
  nombre: string;
  descripcion: string | null;
  descuentoAplicable: number;
  estado: boolean;
  fechaCreacion: string;
}

// ============================================
// PAQUETES TURÍSTICOS
// ============================================

export interface PaqueteTuristico {
  idPaquete: number;
  nombre: string;
  descripcion: string;
  destinoPrincipal: string;
  duracionDias: number;
  duracionNoches: number;
  precioBase: number;
  precioAdulto: number;
  precioNino: number;
  incluyeVuelo: boolean;
  incluyeHotel: boolean;
  incluyeTransporte: boolean;
  incluyeAlimentacion: boolean;
  tipoPaquete: string; // aventura, familiar, empresarial, lujo, cultural, ecologico, romantico
  capacidadMaxima: number;
  disponibilidad: boolean;
  fechaInicio: string | null;
  fechaFin: string | null;
  imagenUrl: string | null;
  estado: boolean;
  fechaCreacion: string;
}

export interface PaqueteTuristicoCreateDto {
  nombre: string;
  descripcion: string;
  destinoPrincipal: string;
  duracionDias: number;
  duracionNoches: number;
  precioBase: number;
  precioAdulto: number;
  precioNino: number;
  incluyeVuelo: boolean;
  incluyeHotel: boolean;
  incluyeTransporte: boolean;
  incluyeAlimentacion: boolean;
  tipoPaquete: string;
  capacidadMaxima: number;
  disponibilidad: boolean;
  fechaInicio?: string;
  fechaFin?: string;
  imagenUrl?: string;
  estado: boolean;
}

export interface PaqueteTuristicoUpdateDto extends PaqueteTuristicoCreateDto {
  idPaquete: number;
}

// ============================================
// PROVEEDORES
// ============================================

export interface Proveedor {
  idProveedor: number;
  nombreEmpresa: string;
  nitRut: string;
  tipoProveedor: string; // Hotel, Aerolinea, Transporte, Servicios, Mixto
  direccion: string;
  ciudad: string;
  pais: string;
  telefono: string;
  correoElectronico: string;
  personaContacto: string | null;
  telefonoContacto: string | null;
  correoContacto: string | null;
  calificacion: number;
  estado: string; // Activo, Inactivo, Suspendido
  observaciones: string | null;
  fechaRegistro: string;
}

export interface ProveedorCreateDto {
  nombreEmpresa: string;
  nitRut: string;
  tipoProveedor: string;
  direccion: string;
  ciudad: string;
  pais: string;
  telefono: string;
  correoElectronico: string;
  personaContacto?: string;
  telefonoContacto?: string;
  correoContacto?: string;
  calificacion?: number;
  estado: string;
  observaciones?: string;
}

export interface ProveedorUpdateDto extends ProveedorCreateDto {
  idProveedor: number;
}

// ============================================
// RESERVAS
// ============================================

export interface Reserva {
  idReserva: number;
  idCliente: number;
  idEmpleado: number | null;
  numeroReserva: string;
  fechaReserva: string;
  fechaViaje: string;
  fechaRetorno: string | null;
  cantidadAdultos: number;
  cantidadNinos: number;
  cantidadBebes: number;
  montoTotal: number;
  estadoReserva: string; // Pendiente, Confirmada, Pagada, Cancelada, Completada
  observaciones: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
  clienteNombre?: string;
  empleadoNombre?: string;
}

export interface ReservaCreateDto {
  idCliente: number;
  idEmpleado?: number;
  fechaViaje: string;
  fechaRetorno?: string;
  cantidadAdultos: number;
  cantidadNinos: number;
  cantidadBebes: number;
  observaciones?: string;
}

export interface ReservaUpdateDto {
  idReserva: number;
  fechaViaje: string;
  fechaRetorno?: string;
  cantidadAdultos: number;
  cantidadNinos: number;
  cantidadBebes: number;
  estadoReserva: string;
  observaciones?: string;
}

// ============================================
// EMPLEADOS
// ============================================

export interface Empleado {
  idEmpleado: number;
  idUsuario: number;
  nombre: string;
  apellido: string;
  documentoIdentidad: string;
  tipoDocumento: string;
  cargo: string;
  area: string;
  correoElectronico: string;
  telefono: string;
  fechaContratacion: string;
  salario: number;
  estado: string; // Activo, Inactivo, Suspendido, Vacaciones
  idJefeDirecto: number | null;
  fechaCreacion: string;
  usuarioNombre?: string;
  jefeNombre?: string;
}

export interface EmpleadoCreateDto {
  idUsuario: number;
  nombre: string;
  apellido: string;
  documentoIdentidad: string;
  tipoDocumento: string;
  cargo: string;
  area: string;
  correoElectronico: string;
  telefono: string;
  fechaContratacion: string;
  salario: number;
  estado: string;
  idJefeDirecto?: number;
}

export interface EmpleadoUpdateDto extends EmpleadoCreateDto {
  idEmpleado: number;
}

// ============================================
// FACTURAS
// ============================================

export interface Factura {
  idFactura: number;
  numeroFactura: string;
  idCliente: number;
  fechaEmision: string;
  fechaVencimiento: string;
  subtotal: number;
  impuestos: number;
  descuentos: number;
  total: number;
  estadoPago: string; // Pendiente, Pagada, Vencida, Anulada
  metodoPago: string | null;
  observaciones: string | null;
  fechaCreacion: string;
  clienteNombre?: string;
}

// ============================================
// ROLES Y PERMISOS
// ============================================

export interface Rol {
  idRol: number;
  nombre: string;
  descripcion: string | null;
  estado: boolean;
  fechaCreacion: string;
  permisos?: Permiso[];
}

export interface Permiso {
  idPermiso: number;
  nombre: string;
  descripcion: string | null;
  modulo: string;
  estado: boolean;
  fechaCreacion: string;
}

// ============================================
// HELPERS Y UTILIDADES
// ============================================

/**
 * Helper para verificar si una respuesta es exitosa
 */
export const isApiSuccess = <T>(
  response: ApiResponse<T> | ApiErrorResponse
): response is ApiResponse<T> => {
  return response.success === true;
};

/**
 * Helper para extraer datos de una respuesta exitosa
 */
export const extractApiData = <T>(response: ApiResponse<T>): T => {
  return response.data;
};

/**
 * Helper para formatear fechas ISO a formato local
 */
export const formatISODate = (isoDate: string): string => {
  return new Date(isoDate).toLocaleDateString('es-CO');
};

/**
 * Helper para formatear moneda colombiana
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);
};
