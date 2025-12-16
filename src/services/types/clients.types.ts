// ===========================
// CLIENTS TYPES
// ===========================

/**
 * Representa un cliente del sistema
 */
export interface Client {
  idCliente: number;
  idUsuario: number;
  idCategoria?: number;
  nombre: string;
  apellido: string;
  nombreCompleto: string; // Calculado: "${nombre} ${apellido}"
  documentoIdentidad: string;
  tipoDocumento: 'CC' | 'CE' | 'PA' | 'TI';
  fechaNacimiento: string;
  edad: number; // Calculado desde fechaNacimiento
  correoElectronico: string;
  telefono: string;
  direccion?: string;
  ciudad: string;
  pais: string;
  fechaRegistro: string;
  estado: boolean;
}

/**
 * Cliente con su categoría completa
 */
export interface ClientWithCategory extends Client {
  categoria?: ClientCategory;
}

/**
 * Cliente con todas sus relaciones
 */
export interface ClientComplete extends ClientWithCategory {
  usuario?: {
    idUsuario: number;
    username: string;
    email: string;
  };
  preferencias?: ClientPreference;
}

/**
 * Categoría de cliente (VIP, Estándar, etc.)
 */
export interface ClientCategory {
  idCategoria: number;
  nombre: string;
  descripcion?: string;
  colorHex: string;
  descuentoPorcentaje: number;
  beneficios?: string;
  criteriosClasificacion?: string;
  estado: boolean;
  fechaCreacion: string;
  fechaModificacion?: string;
}

/**
 * Preferencias de viaje de un cliente
 */
export interface ClientPreference {
  idPreferencia: number;
  idCliente: number;
  destinosPreferidos?: string;
  tipoViajePreferido?: string;
  presupuestoPromedio?: number;
  aerolineaPreferida?: string;
  hotelPreferido?: string;
  serviciosAdicionales?: string;
  restriccionesAlimentarias?: string;
  necesidadesEspeciales?: string;
  fechaCreacion: string;
  fechaModificacion?: string;
}

/**
 * DTO para crear un nuevo cliente
 */
export interface CreateClientDto {
  idUsuario: number;
  idCategoria?: number;
  nombre: string;
  apellido: string;
  documentoIdentidad: string;
  tipoDocumento: 'CC' | 'CE' | 'PA' | 'TI';
  fechaNacimiento: string;
  correoElectronico: string;
  telefono: string;
  direccion?: string;
  ciudad: string;
  pais: string;
  estado?: boolean;
}

/**
 * DTO para actualizar un cliente
 */
export interface UpdateClientDto {
  nombre?: string;
  apellido?: string;
  correoElectronico?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
  idCategoria?: number;
  estado?: boolean;
}

/**
 * DTO para crear una categoría de cliente
 */
export interface CreateCategoryDto {
  nombre: string;
  descripcion?: string;
  colorHex: string;
  descuentoPorcentaje: number;
  beneficios?: string;
  criteriosClasificacion?: string;
  estado?: boolean;
}

/**
 * DTO para actualizar una categoría
 */
export interface UpdateCategoryDto {
  nombre?: string;
  descripcion?: string;
  colorHex?: string;
  descuentoPorcentaje?: number;
  beneficios?: string;
  criteriosClasificacion?: string;
  estado?: boolean;
}

/**
 * DTO para crear preferencias de cliente
 */
export interface CreatePreferenceDto {
  idCliente: number;
  destinosPreferidos?: string;
  tipoViajePreferido?: string;
  presupuestoPromedio?: number;
  aerolineaPreferida?: string;
  hotelPreferido?: string;
  serviciosAdicionales?: string;
  restriccionesAlimentarias?: string;
  necesidadesEspeciales?: string;
}

/**
 * DTO para actualizar preferencias
 */
export interface UpdatePreferenceDto {
  destinosPreferidos?: string;
  tipoViajePreferido?: string;
  presupuestoPromedio?: number;
  aerolineaPreferida?: string;
  hotelPreferido?: string;
  serviciosAdicionales?: string;
  restriccionesAlimentarias?: string;
  necesidadesEspeciales?: string;
}

/**
 * Filtros para búsqueda de clientes
 */
export interface ClientsFilters {
  estado?: boolean;
  ciudad?: string;
  pais?: string;
  categoria?: number;
  tipoDocumento?: 'CC' | 'CE' | 'PA' | 'TI';
}

/**
 * Estadísticas de clientes
 */
export interface ClientsStatistics {
  total: number;
  activos: number;
  inactivos: number;
  porCategoria: {
    [categoria: string]: number;
  };
  porCiudad: {
    [ciudad: string]: number;
  };
  porPais: {
    [pais: string]: number;
  };
  edadPromedio: number;
}
