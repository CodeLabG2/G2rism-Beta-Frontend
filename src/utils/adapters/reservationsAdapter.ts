/**
 * ADAPTADOR DE RESERVAS - VERSIÓN 2.0
 *
 * Convierte entre los tipos de la API backend y los tipos de la UI
 *
 * ⚠️ IMPORTANTE:
 * - El backend NO tiene concepto de "tipo" de reserva (Vuelo/Hotel/Paquete)
 * - Las reservas son CONTENEDORAS que pueden tener múltiples servicios asociados
 * - Muchos campos son CALCULADOS por el backend (duracionDias, estaPagada, etc.)
 * - No hay objetos anidados complejos, solo IDs y nombres
 *
 * Backend Type: Reserva (idCliente, nombreCliente, montoTotal, etc.)
 * UI Type: ReservationUI (según se implemente en el futuro)
 *
 * Fecha: 19 de Diciembre de 2024
 * @author G2rism Team
 */

import type {
  Reserva,
  CreateReservaDTO,
  UpdateReservaDTO,
  CreateReservaCompletaDTO,
  ReservaHotelCreateDTO,
  ReservaVueloCreateDTO,
  ReservaPaqueteCreateDTO,
  ReservaServicioCreateDTO
} from '../../services/api/reservationsService';

// ==================== TIPOS HELPER PARA UI ====================

/**
 * Cliente simplificado para UI
 */
export interface ClienteUI {
  id: number;
  nombre: string;
}

/**
 * Empleado simplificado para UI
 */
export interface EmpleadoUI {
  id: number;
  nombre: string;
}

/**
 * Reserva con información parseada para UI
 */
export interface ReservaUI extends Reserva {
  cliente: ClienteUI;
  empleado: EmpleadoUI;
  diasRestantes: number;
  porcentajePendiente: number;
}

// ==================== FUNCIONES DE CONVERSIÓN A UI ====================

/**
 * Convertir reserva de API a formato UI enriquecido
 */
export function apiReservaToUiReserva(apiReserva: Reserva): ReservaUI {
  return {
    ...apiReserva,
    cliente: {
      id: apiReserva.idCliente,
      nombre: apiReserva.nombreCliente,
    },
    empleado: {
      id: apiReserva.idEmpleado,
      nombre: apiReserva.nombreEmpleado,
    },
    diasRestantes: apiReserva.diasHastaViaje,
    porcentajePendiente: 100 - apiReserva.porcentajePagado,
  };
}

/**
 * Convertir múltiples reservas de API a UI
 */
export function apiReservasToUiReservas(apiReservas: Reserva[]): ReservaUI[] {
  return apiReservas.map(apiReservaToUiReserva);
}

// Alias para compatibilidad con código existente
export const apiReservationsToUiReservations = apiReservasToUiReservas;
export const apiReservationToUiReservation = apiReservaToUiReserva;

// ==================== FUNCIONES DE CONVERSIÓN A API ====================

/**
 * Convertir datos de formulario UI a CreateReservaDTO básico
 */
export function uiFormToCreateDTO(formData: any): CreateReservaDTO {
  return {
    idCliente: formData.idCliente || parseInt(formData.clientId),
    idEmpleado: formData.idEmpleado || parseInt(formData.employeeId),
    descripcion: formData.descripcion || formData.description,
    fechaInicioViaje: formData.fechaInicioViaje || formData.startDate,
    fechaFinViaje: formData.fechaFinViaje || formData.endDate,
    numeroPasajeros: formData.numeroPasajeros || formData.passengers || 1,
    estado: formData.estado || formData.status || 'pendiente',
    observaciones: formData.observaciones || formData.notes,
  };
}

/**
 * Convertir datos de formulario UI a UpdateReservaDTO
 */
export function uiFormToUpdateDTO(formData: Partial<any>): UpdateReservaDTO {
  const dto: UpdateReservaDTO = {};

  if (formData.descripcion !== undefined || formData.description !== undefined) {
    dto.descripcion = formData.descripcion || formData.description;
  }
  if (formData.fechaInicioViaje !== undefined || formData.startDate !== undefined) {
    dto.fechaInicioViaje = formData.fechaInicioViaje || formData.startDate;
  }
  if (formData.fechaFinViaje !== undefined || formData.endDate !== undefined) {
    dto.fechaFinViaje = formData.fechaFinViaje || formData.endDate;
  }
  if (formData.numeroPasajeros !== undefined || formData.passengers !== undefined) {
    dto.numeroPasajeros = formData.numeroPasajeros || formData.passengers;
  }
  if (formData.estado !== undefined || formData.status !== undefined) {
    dto.estado = formData.estado || formData.status;
  }
  if (formData.observaciones !== undefined || formData.notes !== undefined) {
    dto.observaciones = formData.observaciones || formData.notes;
  }

  return dto;
}

/**
 * Convertir datos de formulario UI a CreateReservaCompletaDTO
 * (Para crear reserva con servicios asociados de una vez)
 */
export function uiFormToCreateCompletaDTO(formData: any): CreateReservaCompletaDTO {
  const dto: CreateReservaCompletaDTO = {
    idCliente: formData.idCliente || parseInt(formData.clientId),
    idEmpleado: formData.idEmpleado || parseInt(formData.employeeId),
    descripcion: formData.descripcion || formData.description,
    fechaInicioViaje: formData.fechaInicioViaje || formData.startDate,
    fechaFinViaje: formData.fechaFinViaje || formData.endDate,
    numeroPasajeros: formData.numeroPasajeros || formData.passengers || 1,
    estado: formData.estado || formData.status || 'pendiente',
    observaciones: formData.observaciones || formData.notes,
  };

  // Agregar servicios si existen
  if (formData.hoteles && Array.isArray(formData.hoteles)) {
    dto.hoteles = formData.hoteles;
  }
  if (formData.vuelos && Array.isArray(formData.vuelos)) {
    dto.vuelos = formData.vuelos;
  }
  if (formData.paquetes && Array.isArray(formData.paquetes)) {
    dto.paquetes = formData.paquetes;
  }
  if (formData.servicios && Array.isArray(formData.servicios)) {
    dto.servicios = formData.servicios;
  }

  return dto;
}

// ==================== FUNCIONES PARA CREAR SERVICIOS ====================

/**
 * Crear DTO para agregar hotel a reserva
 */
export function createHotelDTO(data: any): ReservaHotelCreateDTO {
  // Calcular precio total si no está proporcionado
  const checkIn = new Date(data.fechaCheckIn || data.checkInDate);
  const checkOut = new Date(data.fechaCheckOut || data.checkOutDate);
  const noches = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const precioNoche = data.precioNoche || data.pricePerNight || 0;

  return {
    idHotel: data.idHotel || parseInt(data.hotelId),
    fechaCheckIn: data.fechaCheckIn || data.checkInDate,
    fechaCheckOut: data.fechaCheckOut || data.checkOutDate,
    numeroHabitaciones: data.numeroHabitaciones || data.rooms || 1,
    tipoHabitacion: data.tipoHabitacion || data.roomType,
    precioNoche: precioNoche,
    incluyeDesayuno: data.incluyeDesayuno !== undefined ? data.incluyeDesayuno : data.includesBreakfast || false,
    regimen: data.regimen || data.mealPlan,
    observaciones: data.observaciones || data.notes,
  };
}

/**
 * Crear DTO para agregar vuelo a reserva
 */
export function createVueloDTO(data: any): ReservaVueloCreateDTO {
  return {
    idVuelo: data.idVuelo || parseInt(data.flightId),
    numeroPasajeros: data.numeroPasajeros || data.passengers || 1,
    clase: data.clase || data.flightClass || 'Económica',
    precioTotal: data.precioTotal || data.totalPrice || 0,
    equipajeIncluido: data.equipajeIncluido !== undefined ? data.equipajeIncluido : data.includesBaggage || false,
    equipajeAdicional: data.equipajeAdicional || data.extraBaggage,
    asientosSeleccionados: data.asientosSeleccionados || data.selectedSeats,
    observaciones: data.observaciones || data.notes,
  };
}

/**
 * Crear DTO para agregar paquete a reserva
 */
export function createPaqueteDTO(data: any): ReservaPaqueteCreateDTO {
  return {
    idPaquete: data.idPaquete || parseInt(data.packageId),
    numeroPasajeros: data.numeroPasajeros || data.passengers || 1,
    precioFinal: data.precioFinal || data.finalPrice || 0,
    descuentoAplicado: data.descuentoAplicado || data.discount,
    observaciones: data.observaciones || data.notes,
  };
}

/**
 * Crear DTO para agregar servicio genérico a reserva
 */
export function createServicioDTO(data: any): ReservaServicioCreateDTO {
  return {
    idServicio: data.idServicio || parseInt(data.serviceId),
    cantidad: data.cantidad || data.quantity || 1,
    precioUnitario: data.precioUnitario || data.unitPrice || 0,
    descripcion: data.descripcion || data.description,
  };
}

// ==================== HELPERS ====================

/**
 * Extraer ID numérico de string
 */
export function extractReservaId(id: string | number): number {
  if (typeof id === 'number') return id;
  const numId = parseInt(id);
  if (isNaN(numId)) throw new Error(`ID de reserva inválido: ${id}`);
  return numId;
}

// Alias para compatibilidad con código existente
export const extractReservationId = extractReservaId;

/**
 * Calcular duración en días entre dos fechas
 */
export function calculateDuration(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Calcular días hasta el viaje
 */
export function calculateDaysUntilTrip(startDate: string): number {
  const start = new Date(startDate);
  const today = new Date();
  const days = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
}

/**
 * Formatear precio con símbolo de moneda
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Obtener etiqueta de estado con emoji
 */
export function getStatusLabel(estado: Reserva['estado']): string {
  const labels: Record<Reserva['estado'], string> = {
    'pendiente': '🟡 Pendiente',
    'confirmada': '🟢 Confirmada',
    'cancelada': '🔴 Cancelada',
    'completada': '✅ Completada',
  };
  return labels[estado] || '⚪ Desconocido';
}

/**
 * Obtener color de badge según estado
 */
export function getStatusColor(estado: Reserva['estado']): string {
  const colors: Record<Reserva['estado'], string> = {
    'pendiente': 'yellow',
    'confirmada': 'green',
    'cancelada': 'red',
    'completada': 'blue',
  };
  return colors[estado] || 'gray';
}

/**
 * Obtener etiqueta de progreso de pago
 */
export function getPaymentProgressLabel(porcentajePagado: number): string {
  if (porcentajePagado === 0) return '💳 Sin pago';
  if (porcentajePagado === 100) return '✅ Pagado completo';
  return `⏳ ${porcentajePagado.toFixed(0)}% pagado`;
}

/**
 * Obtener color para progreso de pago
 */
export function getPaymentProgressColor(porcentajePagado: number): string {
  if (porcentajePagado === 0) return 'red';
  if (porcentajePagado === 100) return 'green';
  if (porcentajePagado >= 50) return 'yellow';
  return 'orange';
}

/**
 * Determinar si la reserva está próxima (menos de 7 días)
 */
export function isUpcomingSoon(diasHastaViaje: number): boolean {
  return diasHastaViaje > 0 && diasHastaViaje <= 7;
}

/**
 * Determinar si la reserva está retrasada en pago
 */
export function isPaymentDelayed(diasHastaViaje: number, porcentajePagado: number): boolean {
  // Si falta menos de 30 días y no está pagado al menos 50%
  if (diasHastaViaje <= 30 && porcentajePagado < 50) return true;
  // Si falta menos de 7 días y no está pagado completamente
  if (diasHastaViaje <= 7 && porcentajePagado < 100) return true;
  return false;
}

/**
 * Formatear rango de fechas
 * "2024-12-20" a "2024-12-25" -> "20-25 Dic 2024"
 */
export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startDay = start.getDate();
  const endDay = end.getDate();
  const month = start.toLocaleDateString('es-ES', { month: 'short' });
  const year = start.getFullYear();

  if (start.getMonth() === end.getMonth()) {
    return `${startDay}-${endDay} ${month} ${year}`;
  } else {
    const endMonth = end.toLocaleDateString('es-ES', { month: 'short' });
    return `${startDay} ${month} - ${endDay} ${endMonth} ${year}`;
  }
}
