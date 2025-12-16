export type EstadoFactura = 'Borrador' | 'Enviada_DIAN' | 'Aprobada_DIAN' | 'Rechazada_DIAN' | 'Anulada';

export interface Factura {
  idFactura: number;
  numeroFactura: string;
  prefijo: string;
  idVenta: number;
  idCliente: number;
  fechaEmision: string;
  fechaVencimiento: string;
  subtotal: number;
  descuento: number;
  impuestos: number;
  total: number;
  moneda: string;
  estadoFactura: EstadoFactura;
  cufeDIAN?: string;
  fechaEnvioDIAN?: string;
  fechaAprobacionDIAN?: string;
  mensajeRespuestaDIAN?: string;
  archivoXML?: string;
  archivoPDF?: string;
  emailEnviado: boolean;
  observaciones?: string;
  // Datos relacionados
  numeroVenta?: string;
  nombreCliente?: string;
  documentoCliente?: string;
}

export interface NotaCredito {
  idNotaCredito: number;
  numeroNotaCredito: string;
  prefijo: string;
  idFactura: number;
  idCliente: number;
  fechaEmision: string;
  motivo: string;
  subtotal: number;
  descuento: number;
  impuestos: number;
  total: number;
  moneda: string;
  estadoNota: EstadoFactura;
  cufeDIAN?: string;
  fechaEnvioDIAN?: string;
  observaciones?: string;
  numeroFactura?: string;
  nombreCliente?: string;
}

export interface NotaDebito {
  idNotaDebito: number;
  numeroNotaDebito: string;
  prefijo: string;
  idFactura: number;
  idCliente: number;
  fechaEmision: string;
  motivo: string;
  subtotal: number;
  descuento: number;
  impuestos: number;
  total: number;
  moneda: string;
  estadoNota: EstadoFactura;
  cufeDIAN?: string;
  fechaEnvioDIAN?: string;
  observaciones?: string;
  numeroFactura?: string;
  nombreCliente?: string;
}

export interface FacturaFilters {
  idCliente?: number;
  estadoFactura?: EstadoFactura;
  fechaInicio?: string;
  fechaFin?: string;
  searchTerm?: string;
}
