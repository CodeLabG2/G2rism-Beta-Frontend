export type EstadoVenta = 'Borrador' | 'Confirmada' | 'Pagada' | 'Completada' | 'Cancelada' | 'Anulada';
export type TipoVenta = 'Paquete' | 'Servicio_Individual' | 'Personalizado';
export type MetodoPago = 'Efectivo' | 'Tarjeta_Credito' | 'Tarjeta_Debito' | 'Transferencia' | 'PSE' | 'Otro';
export type EstadoCotizacion = 'Pendiente' | 'Enviada' | 'Aceptada' | 'Rechazada' | 'Vencida' | 'Convertida';

export interface Venta {
  idVenta: number;
  numeroVenta: string;
  idCliente: number;
  idEmpleado: number;
  tipoVenta: TipoVenta;
  fechaVenta: string;
  fechaViaje: string;
  fechaPago?: string;
  subtotal: number;
  descuento: number;
  impuestos: number;
  total: number;
  moneda: string;
  metodoPago?: MetodoPago;
  estadoVenta: EstadoVenta;
  observaciones?: string;
  // Datos relacionados
  nombreCliente?: string;
  nombreEmpleado?: string;
  detalles?: DetalleVenta[];
}

export interface DetalleVenta {
  idDetalle: number;
  idVenta: number;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  subtotal: number;
}

export interface Cotizacion {
  idCotizacion: number;
  numeroCotizacion: string;
  idCliente: number;
  idEmpleado: number;
  fechaCotizacion: string;
  fechaValidez: string;
  subtotal: number;
  descuento: number;
  impuestos: number;
  total: number;
  moneda: string;
  estadoCotizacion: EstadoCotizacion;
  observaciones?: string;
  // Datos relacionados
  nombreCliente?: string;
  nombreEmpleado?: string;
  detalles?: DetalleCotizacion[];
  diasValidez?: number;
  estaVencida?: boolean;
}

export interface DetalleCotizacion {
  idDetalle: number;
  idCotizacion: number;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  subtotal: number;
}

export interface VentaFormData {
  idCliente: number;
  idEmpleado: number;
  tipoVenta: TipoVenta;
  fechaVenta: string;
  fechaViaje: string;
  subtotal: number;
  descuento: number;
  impuestos: number;
  total: number;
  moneda: string;
  metodoPago?: MetodoPago;
  estadoVenta?: EstadoVenta;
  observaciones?: string;
  detalles?: Omit<DetalleVenta, 'idDetalle' | 'idVenta'>[];
}

export interface CotizacionFormData {
  idCliente: number;
  idEmpleado: number;
  fechaCotizacion: string;
  fechaValidez: string;
  subtotal: number;
  descuento: number;
  impuestos: number;
  total: number;
  moneda: string;
  estadoCotizacion?: EstadoCotizacion;
  observaciones?: string;
  detalles?: Omit<DetalleCotizacion, 'idDetalle' | 'idCotizacion'>[];
}

export interface VentaFilters {
  idCliente?: number;
  idEmpleado?: number;
  estadoVenta?: EstadoVenta;
  tipoVenta?: TipoVenta;
  fechaInicio?: string;
  fechaFin?: string;
  searchTerm?: string;
}

export interface CotizacionFilters {
  idCliente?: number;
  idEmpleado?: number;
  estadoCotizacion?: EstadoCotizacion;
  fechaInicio?: string;
  fechaFin?: string;
  searchTerm?: string;
}

export interface VentaDashboard {
  totalVentas: number;
  ventasHoy: number;
  ventasMes: number;
  ventasAnio: number;
  ingresosMes: number;
  ingresosAnio: number;
  ticketPromedio: number;
  tasaConversion: number;
  ventasPorEstado: { estado: string; cantidad: number; total: number }[];
  ventasPorTipo: { tipo: string; cantidad: number; total: number }[];
  ventasRecientes: Venta[];
  topClientes: { idCliente: number; nombreCliente: string; totalCompras: number; totalGastado: number }[];
}
