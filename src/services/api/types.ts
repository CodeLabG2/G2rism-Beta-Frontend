// ============================================
// TIPOS DE RESPUESTA DE LA API .NET
// ============================================

// Respuesta genérica de la API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
  timestamp?: string;
}

// Respuesta paginada
export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// ============================================
// AUTENTICACIÓN
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: AuthUser;
  expiresIn: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Employee' | 'Client';
  category?: string;
  points?: number;
  avatar?: string;
  phone?: string;
  createdAt: string;
}

// ============================================
// CLIENTES
// ============================================

export interface Client {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  documento: string;
  tipoDocumento: 'CC' | 'CE' | 'Pasaporte';
  categoria: 'Bronce' | 'Plata' | 'Oro' | 'Platino' | 'Diamante';
  puntos: number;
  fechaNacimiento?: string;
  pais?: string;
  ciudad?: string;
  direccion?: string;
  preferencias?: ClientPreferences;
  estado: boolean;
  fechaRegistro: string;
}

export interface ClientPreferences {
  tiposDestino: string[];
  rangoPresupuesto: 'Economico' | 'Moderado' | 'Premium';
  tipoAlojamiento: string;
  ubicacionPreferida: string;
  preferenciasAlimentarias: string[];
  requerimientosEspeciales: string[];
}

export interface CreateClientRequest {
  nombre: string;
  email: string;
  telefono: string;
  documento: string;
  tipoDocumento: string;
  password: string;
}

// ============================================
// RESERVAS
// ============================================

export interface Booking {
  id: string;
  numeroReserva: string;
  clienteId: string;
  cliente?: Client;
  paqueteId?: string;
  paquete?: TourPackage;
  destino: string;
  fechaInicio: string;
  fechaFin: string;
  numeroViajeros: number;
  precioTotal: number;
  estado: 'Pendiente' | 'Confirmado' | 'Pagado' | 'Cancelado' | 'Completado';
  estadoPago: 'Pendiente' | 'Pagado' | 'Reembolsado';
  servicios: BookingService[];
  hotel?: string;
  vuelo?: string;
  observaciones?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface BookingService {
  id: string;
  nombre: string;
  tipo: 'Vuelo' | 'Hotel' | 'Tour' | 'Transporte' | 'Seguro' | 'Otro';
  precio: number;
  descripcion?: string;
}

export interface CreateBookingRequest {
  clienteId: string;
  paqueteId?: string;
  destino: string;
  fechaInicio: string;
  fechaFin: string;
  numeroViajeros: number;
  servicios: {
    nombre: string;
    tipo: string;
    precio: number;
  }[];
  observaciones?: string;
}

// ============================================
// PAQUETES TURÍSTICOS
// ============================================

export interface TourPackage {
  id: string;
  nombre: string;
  descripcion: string;
  destino: string;
  pais: string;
  duracion: number; // días
  precio: number;
  descuento: number; // porcentaje
  precioFinal: number;
  categoria: string;
  tipo: string;
  imagenes: string[];
  serviciosIncluidos: string[];
  serviciosNoIncluidos: string[];
  itinerario?: PackageItinerary[];
  disponible: boolean;
  cupoMaximo: number;
  cupoDisponible: number;
  rating: number;
  numeroReviews: number;
  fechaCreacion: string;
}

export interface PackageItinerary {
  dia: number;
  titulo: string;
  descripcion: string;
  actividades: string[];
}

// ============================================
// PROVEEDORES
// ============================================

export interface Provider {
  id: string;
  nombre: string;
  tipoServicio: 'Hotel' | 'Aerolinea' | 'Transporte' | 'Tour' | 'Otro';
  email: string;
  telefono: string;
  pais: string;
  ciudad: string;
  direccion?: string;
  contactoPrincipal: string;
  calificacion: number;
  estado: boolean;
  fechaRegistro: string;
}

// ============================================
// VENTAS Y PAGOS
// ============================================

export interface Sale {
  id: string;
  numeroVenta: string;
  reservaId: string;
  reserva?: Booking;
  clienteId: string;
  cliente?: Client;
  subtotal: number;
  descuento: number;
  impuestos: number;
  total: number;
  metodoPago: 'Efectivo' | 'Tarjeta' | 'Transferencia' | 'PSE';
  estadoPago: 'Pendiente' | 'Pagado' | 'Parcial' | 'Reembolsado';
  pagos: Payment[];
  facturaId?: string;
  fechaVenta: string;
}

export interface Payment {
  id: string;
  monto: number;
  metodoPago: string;
  referencia?: string;
  fechaPago: string;
  comprobante?: string;
}

export interface CreatePaymentRequest {
  ventaId: string;
  monto: number;
  metodoPago: string;
  referencia?: string;
}

// ============================================
// DOCUMENTOS
// ============================================

export interface Document {
  id: string;
  clienteId: string;
  nombre: string;
  tipo: 'Pasaporte' | 'Visa' | 'Seguro' | 'Certificado' | 'Licencia' | 'Otro';
  archivo: string; // URL
  tamaño: number; // bytes
  formato: string;
  estado: 'Pendiente' | 'Verificado' | 'Rechazado';
  fechaSubida: string;
  fechaExpiracion?: string;
}

// ============================================
// NOTIFICACIONES
// ============================================

export interface Notification {
  id: string;
  usuarioId: string;
  tipo: 'Info' | 'Success' | 'Warning' | 'Error';
  titulo: string;
  mensaje: string;
  leido: boolean;
  link?: string;
  fechaCreacion: string;
}

// ============================================
// ESTADÍSTICAS Y REPORTES
// ============================================

export interface DashboardStats {
  totalReservas: number;
  reservasActivas: number;
  ventasTotales: number;
  ventasMes: number;
  clientesActivos: number;
  clientesNuevos: number;
  tasaOcupacion: number;
  destinosPopulares: {
    destino: string;
    cantidad: number;
  }[];
  ventasPorMes: {
    mes: string;
    ventas: number;
  }[];
}

// ============================================
// FILTROS Y BÚSQUEDA
// ============================================

export interface BookingFilters {
  clienteId?: string;
  estado?: string;
  estadoPago?: string;
  fechaInicio?: string;
  fechaFin?: string;
  destino?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PackageFilters {
  destino?: string;
  pais?: string;
  precioMin?: number;
  precioMax?: number;
  duracionMin?: number;
  duracionMax?: number;
  categoria?: string;
  disponible?: boolean;
  page?: number;
  pageSize?: number;
}