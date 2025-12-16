// Re-exportar tipos desde el servicio para evitar duplicación
export type {
  TipoProveedor,
  EstadoProveedor,
  Proveedor,
  CreateProveedorDTO,
  UpdateProveedorDTO,
  ProveedorFilters,
} from '../../../../services/api/providersService';

export type EstadoContrato = 'Vigente' | 'Vencido' | 'Cancelado' | 'En_Negociacion';

export interface ContratoProveedor {
  idContrato: number;
  idProveedor: number;
  numeroContrato: string;
  tipoContrato: string;
  fechaInicio: string;
  fechaFin: string;
  valorContrato: number;
  moneda: string;
  terminosCondiciones?: string;
  estadoContrato: EstadoContrato;
  renovacionAutomatica: boolean;
  estaVigente?: boolean;
  diasRestantes?: number;
  proximoAVencer?: boolean;
  duracionDias?: number;
}

export interface ContratoFilters {
  idProveedor?: number;
  estadoContrato?: EstadoContrato;
  moneda?: string;
  proximoAVencer?: boolean;
  searchTerm?: string;
}

// Alias para mantener compatibilidad con código existente
export type ProveedorFormData = CreateProveedorDTO;

export interface ContratoFormData {
  idProveedor: number;
  numeroContrato: string;
  tipoContrato: string;
  fechaInicio: string;
  fechaFin: string;
  valorContrato: number;
  moneda: string;
  terminosCondiciones?: string;
  estadoContrato?: EstadoContrato;
  renovacionAutomatica?: boolean;
}