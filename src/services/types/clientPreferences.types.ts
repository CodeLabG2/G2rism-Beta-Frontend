// ===========================
// CLIENT PREFERENCES TYPES
// ===========================

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
 * DTO para crear preferencias de cliente
 */
export interface CreateClientPreferenceDto {
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
export interface UpdateClientPreferenceDto {
  destinosPreferidos?: string;
  tipoViajePreferido?: string;
  presupuestoPromedio?: number;
  aerolineaPreferida?: string;
  hotelPreferido?: string;
  serviciosAdicionales?: string;
  restriccionesAlimentarias?: string;
  necesidadesEspeciales?: string;
}
