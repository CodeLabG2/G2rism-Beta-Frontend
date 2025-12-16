import type {
  Venta,
  VentaFormData,
  Cotizacion,
  CotizacionFormData,
  EstadoVenta,
  EstadoCotizacion,
  TipoVenta,
  MetodoPago,
} from '../../services/api/salesService';

// ==================== MAPEOS DE TIPOS ====================

/**
 * Labels para estados de venta
 */
export const SALE_STATUS_LABELS: Record<EstadoVenta, string> = {
  'Borrador': 'Borrador',
  'Confirmada': 'Confirmada',
  'Pagada': 'Pagada',
  'Completada': 'Completada',
  'Cancelada': 'Cancelada',
  'Anulada': 'Anulada',
};

/**
 * Colors para estados de venta
 */
export const SALE_STATUS_COLORS: Record<EstadoVenta, string> = {
  'Borrador': 'gray',
  'Confirmada': 'blue',
  'Pagada': 'green',
  'Completada': 'purple',
  'Cancelada': 'red',
  'Anulada': 'red',
};

/**
 * Labels para tipos de venta
 */
export const SALE_TYPE_LABELS: Record<TipoVenta, string> = {
  'Paquete': 'Paquete',
  'Servicio_Individual': 'Servicio Individual',
  'Personalizado': 'Personalizado',
};

/**
 * Labels para métodos de pago
 */
export const PAYMENT_METHOD_LABELS: Record<MetodoPago, string> = {
  'Efectivo': 'Efectivo',
  'Tarjeta_Credito': 'Tarjeta de Crédito',
  'Tarjeta_Debito': 'Tarjeta de Débito',
  'Transferencia': 'Transferencia',
  'PSE': 'PSE',
  'Otro': 'Otro',
};

/**
 * Labels para estados de cotización
 */
export const QUOTATION_STATUS_LABELS: Record<EstadoCotizacion, string> = {
  'Pendiente': 'Pendiente',
  'Enviada': 'Enviada',
  'Aceptada': 'Aceptada',
  'Rechazada': 'Rechazada',
  'Vencida': 'Vencida',
  'Convertida': 'Convertida',
};

/**
 * Colors para estados de cotización
 */
export const QUOTATION_STATUS_COLORS: Record<EstadoCotizacion, string> = {
  'Pendiente': 'yellow',
  'Enviada': 'blue',
  'Aceptada': 'green',
  'Rechazada': 'red',
  'Vencida': 'red',
  'Convertida': 'purple',
};

// ==================== FUNCIONES DE UTILIDAD ====================

/**
 * Extrae el ID numérico de un string (útil para conversiones)
 */
export function extractSaleId(id: string | number): number {
  if (typeof id === 'number') return id;
  const numId = parseInt(id);
  if (isNaN(numId)) throw new Error(`ID inválido: ${id}`);
  return numId;
}

/**
 * Extrae el ID numérico de cotización
 */
export function extractQuotationId(id: string | number): number {
  if (typeof id === 'number') return id;
  const numId = parseInt(id);
  if (isNaN(numId)) throw new Error(`ID inválido: ${id}`);
  return numId;
}

/**
 * Formatea un monto de dinero
 */
export function formatCurrency(amount: number, currency: string = 'COP'): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formatea una fecha
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

/**
 * Calcula el subtotal de una venta
 */
export function calculateSubtotal(details: { cantidad: number; precioUnitario: number; descuento: number }[]): number {
  return details.reduce((sum, detail) => {
    const itemSubtotal = (detail.cantidad * detail.precioUnitario) - detail.descuento;
    return sum + itemSubtotal;
  }, 0);
}

/**
 * Calcula el total de una venta
 */
export function calculateTotal(subtotal: number, descuento: number, impuestos: number): number {
  return subtotal - descuento + impuestos;
}

/**
 * Calcula el porcentaje de descuento
 */
export function calculateDiscountPercentage(subtotal: number, descuento: number): number {
  if (subtotal === 0) return 0;
  return (descuento / subtotal) * 100;
}

/**
 * Calcula el porcentaje de impuestos
 */
export function calculateTaxPercentage(subtotal: number, impuestos: number): number {
  if (subtotal === 0) return 0;
  return (impuestos / subtotal) * 100;
}

/**
 * Verifica si una venta está pagada
 */
export function isSalePaid(sale: Venta): boolean {
  return sale.estadoVenta === 'Pagada' || sale.estadoVenta === 'Completada';
}

/**
 * Verifica si una venta está completada
 */
export function isSaleCompleted(sale: Venta): boolean {
  return sale.estadoVenta === 'Completada';
}

/**
 * Verifica si una venta está cancelada
 */
export function isSaleCancelled(sale: Venta): boolean {
  return sale.estadoVenta === 'Cancelada' || sale.estadoVenta === 'Anulada';
}

/**
 * Verifica si una cotización está vencida
 */
export function isQuotationExpired(quotation: Cotizacion): boolean {
  if (!quotation.fechaValidez) return false;
  const validityDate = new Date(quotation.fechaValidez);
  const today = new Date();
  return today > validityDate;
}

/**
 * Calcula los días restantes de validez de una cotización
 */
export function getQuotationDaysRemaining(quotation: Cotizacion): number {
  if (!quotation.fechaValidez) return 0;
  const validityDate = new Date(quotation.fechaValidez);
  const today = new Date();
  const diffTime = validityDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

/**
 * Obtiene el label de un estado de venta
 */
export function getSaleStatusLabel(status: EstadoVenta): string {
  return SALE_STATUS_LABELS[status] || status;
}

/**
 * Obtiene el color de un estado de venta
 */
export function getSaleStatusColor(status: EstadoVenta): string {
  return SALE_STATUS_COLORS[status] || 'gray';
}

/**
 * Obtiene el label de un tipo de venta
 */
export function getSaleTypeLabel(type: TipoVenta): string {
  return SALE_TYPE_LABELS[type] || type;
}

/**
 * Obtiene el label de un método de pago
 */
export function getPaymentMethodLabel(method: MetodoPago): string {
  return PAYMENT_METHOD_LABELS[method] || method;
}

/**
 * Obtiene el label de un estado de cotización
 */
export function getQuotationStatusLabel(status: EstadoCotizacion): string {
  return QUOTATION_STATUS_LABELS[status] || status;
}

/**
 * Obtiene el color de un estado de cotización
 */
export function getQuotationStatusColor(status: EstadoCotizacion): string {
  return QUOTATION_STATUS_COLORS[status] || 'gray';
}

/**
 * Valida los datos de una venta
 */
export function validateSaleData(data: Partial<VentaFormData>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.idCliente) errors.push('Cliente es requerido');
  if (!data.idEmpleado) errors.push('Empleado es requerido');
  if (!data.tipoVenta) errors.push('Tipo de venta es requerido');
  if (!data.fechaVenta) errors.push('Fecha de venta es requerida');
  if (!data.fechaViaje) errors.push('Fecha de viaje es requerida');
  if (data.total === undefined || data.total <= 0) errors.push('El total debe ser mayor a 0');
  if (data.subtotal === undefined || data.subtotal < 0) errors.push('El subtotal no puede ser negativo');
  if (data.descuento !== undefined && data.descuento < 0) errors.push('El descuento no puede ser negativo');
  if (data.impuestos !== undefined && data.impuestos < 0) errors.push('Los impuestos no pueden ser negativos');

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Valida los datos de una cotización
 */
export function validateQuotationData(data: Partial<CotizacionFormData>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.idCliente) errors.push('Cliente es requerido');
  if (!data.idEmpleado) errors.push('Empleado es requerido');
  if (!data.fechaCotizacion) errors.push('Fecha de cotización es requerida');
  if (!data.fechaValidez) errors.push('Fecha de validez es requerida');
  if (data.total === undefined || data.total <= 0) errors.push('El total debe ser mayor a 0');
  if (data.subtotal === undefined || data.subtotal < 0) errors.push('El subtotal no puede ser negativo');
  
  // Validar que la fecha de validez sea posterior a la fecha de cotización
  if (data.fechaCotizacion && data.fechaValidez) {
    const fechaCotizacion = new Date(data.fechaCotizacion);
    const fechaValidez = new Date(data.fechaValidez);
    if (fechaValidez <= fechaCotizacion) {
      errors.push('La fecha de validez debe ser posterior a la fecha de cotización');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Prepara datos de venta para envío al backend
 */
export function prepareSaleData(data: VentaFormData): VentaFormData {
  return {
    ...data,
    descuento: data.descuento || 0,
    impuestos: data.impuestos || 0,
    moneda: data.moneda || 'COP',
  };
}

/**
 * Prepara datos de cotización para envío al backend
 */
export function prepareQuotationData(data: CotizacionFormData): CotizacionFormData {
  return {
    ...data,
    descuento: data.descuento || 0,
    impuestos: data.impuestos || 0,
    moneda: data.moneda || 'COP',
  };
}

/**
 * Genera número de venta sugerido
 */
export function generateSaleNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `V-${year}-${random}`;
}

/**
 * Genera número de cotización sugerido
 */
export function generateQuotationNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `C-${year}-${random}`;
}

/**
 * Agrupa ventas por estado
 */
export function groupSalesByStatus(sales: Venta[]): Record<EstadoVenta, Venta[]> {
  const grouped: Partial<Record<EstadoVenta, Venta[]>> = {};
  
  sales.forEach(sale => {
    if (!grouped[sale.estadoVenta]) {
      grouped[sale.estadoVenta] = [];
    }
    grouped[sale.estadoVenta]!.push(sale);
  });
  
  return grouped as Record<EstadoVenta, Venta[]>;
}

/**
 * Agrupa ventas por tipo
 */
export function groupSalesByType(sales: Venta[]): Record<TipoVenta, Venta[]> {
  const grouped: Partial<Record<TipoVenta, Venta[]>> = {};
  
  sales.forEach(sale => {
    if (!grouped[sale.tipoVenta]) {
      grouped[sale.tipoVenta] = [];
    }
    grouped[sale.tipoVenta]!.push(sale);
  });
  
  return grouped as Record<TipoVenta, Venta[]>;
}

/**
 * Calcula totales de un array de ventas
 */
export function calculateSalesTotals(sales: Venta[]): {
  cantidad: number;
  subtotal: number;
  descuento: number;
  impuestos: number;
  total: number;
} {
  return {
    cantidad: sales.length,
    subtotal: sales.reduce((sum, sale) => sum + sale.subtotal, 0),
    descuento: sales.reduce((sum, sale) => sum + sale.descuento, 0),
    impuestos: sales.reduce((sum, sale) => sum + sale.impuestos, 0),
    total: sales.reduce((sum, sale) => sum + sale.total, 0),
  };
}

/**
 * Filtra ventas por rango de fechas
 */
export function filterSalesByDateRange(sales: Venta[], startDate: string, endDate: string): Venta[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return sales.filter(sale => {
    const saleDate = new Date(sale.fechaVenta);
    return saleDate >= start && saleDate <= end;
  });
}

/**
 * Ordena ventas por fecha (más reciente primero)
 */
export function sortSalesByDate(sales: Venta[], ascending: boolean = false): Venta[] {
  return [...sales].sort((a, b) => {
    const dateA = new Date(a.fechaVenta).getTime();
    const dateB = new Date(b.fechaVenta).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
}

/**
 * Ordena ventas por total (mayor a menor)
 */
export function sortSalesByTotal(sales: Venta[], ascending: boolean = false): Venta[] {
  return [...sales].sort((a, b) => {
    return ascending ? a.total - b.total : b.total - a.total;
  });
}
