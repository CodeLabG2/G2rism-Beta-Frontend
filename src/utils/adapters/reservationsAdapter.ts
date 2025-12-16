import type { 
  Reserva, 
  CreateReservaDTO,
  UpdateReservaDTO,
  TipoReserva,
  EstadoReserva,
  EstadoPago,
  ClienteReserva,
  DetalleVuelo,
  DetalleHotel,
  DetallePaquete,
  EventoReserva,
  PagoReserva
} from '../../services/api/reservationsService';

import type { 
  Reservation, 
  ReservationFormData,
  ReservationType,
  ReservationStatus,
  PaymentStatus,
  Client,
  Flight,
  Hotel,
  TourPackage as UITourPackage
} from '../../components/admin/views/reservations/types';

// ==================== MAPEOS DE TIPOS ====================

const TYPE_MAP: Record<ReservationType, TipoReserva> = {
  'flight': 'Vuelo',
  'hotel': 'Hotel',
  'package': 'Paquete',
  'transport': 'Transporte',
};

const TYPE_REVERSE_MAP: Record<TipoReserva, ReservationType> = {
  'Vuelo': 'flight',
  'Hotel': 'hotel',
  'Paquete': 'package',
  'Transporte': 'transport',
};

const STATUS_MAP: Record<ReservationStatus, EstadoReserva> = {
  'pending': 'Pendiente',
  'confirmed': 'Confirmada',
  'cancelled': 'Cancelada',
  'completed': 'Completada',
};

const STATUS_REVERSE_MAP: Record<EstadoReserva, ReservationStatus> = {
  'Pendiente': 'pending',
  'Confirmada': 'confirmed',
  'Cancelada': 'cancelled',
  'Completada': 'completed',
};

const PAYMENT_STATUS_MAP: Record<PaymentStatus, EstadoPago> = {
  'pending': 'Pendiente',
  'partial': 'Parcial',
  'paid': 'Pagado',
  'refunded': 'Reembolsado',
};

const PAYMENT_STATUS_REVERSE_MAP: Record<EstadoPago, PaymentStatus> = {
  'Pendiente': 'pending',
  'Parcial': 'partial',
  'Pagado': 'paid',
  'Reembolsado': 'refunded',
};

const FLIGHT_CLASS_MAP: Record<'economy' | 'business' | 'first', 'Economica' | 'Ejecutiva' | 'Primera'> = {
  'economy': 'Economica',
  'business': 'Ejecutiva',
  'first': 'Primera',
};

const FLIGHT_CLASS_REVERSE_MAP: Record<'Economica' | 'Ejecutiva' | 'Primera', 'economy' | 'business' | 'first'> = {
  'Economica': 'economy',
  'Ejecutiva': 'business',
  'Primera': 'first',
};

// ==================== FUNCIONES DE CONVERSIÓN ====================

/**
 * Convierte cliente de API a formato UI
 */
export function apiClientToUiClient(apiClient: ClienteReserva): Client {
  return {
    id: apiClient.idCliente.toString(),
    name: `${apiClient.nombres} ${apiClient.apellidos}`,
    email: apiClient.correoElectronico,
    phone: apiClient.telefono,
  };
}

/**
 * Convierte detalles de vuelo de API a UI
 */
export function apiFlightToUiFlight(apiFlight: DetalleVuelo): Flight {
  return {
    airline: apiFlight.aerolinea,
    flightNumber: apiFlight.numeroVuelo,
    origin: apiFlight.origen,
    destination: apiFlight.destino,
    departure: apiFlight.fechaSalida,
    arrival: apiFlight.fechaLlegada,
    class: FLIGHT_CLASS_REVERSE_MAP[apiFlight.clase] || 'economy',
  };
}

/**
 * Convierte detalles de hotel de API a UI
 */
export function apiHotelToUiHotel(apiHotel: DetalleHotel): Hotel {
  return {
    name: apiHotel.nombreHotel,
    location: apiHotel.ubicacion,
    checkIn: apiHotel.fechaCheckIn,
    checkOut: apiHotel.fechaCheckOut,
    roomType: apiHotel.tipoHabitacion,
    nights: apiHotel.numeroNoches,
  };
}

/**
 * Convierte detalles de paquete de API a UI
 */
export function apiPackageToUiPackage(apiPackage: DetallePaquete): UITourPackage {
  return {
    name: apiPackage.nombrePaquete,
    destination: apiPackage.destino,
    startDate: apiPackage.fechaInicio,
    endDate: apiPackage.fechaFin,
    duration: apiPackage.duracion,
    includesFlights: apiPackage.incluyeVuelos,
    includesHotel: apiPackage.incluyeHotel,
  };
}

/**
 * Convierte una reserva de la API al formato de UI
 */
export function apiReservationToUiReservation(apiReservation: Reserva): Reservation {
  const reservation: Reservation = {
    id: apiReservation.idReserva.toString(),
    code: apiReservation.codigo,
    type: TYPE_REVERSE_MAP[apiReservation.tipo] || 'package',
    client: apiReservation.cliente ? apiClientToUiClient(apiReservation.cliente) : {
      id: apiReservation.idCliente.toString(),
      name: 'Cliente desconocido',
      email: '',
      phone: '',
    },
    status: STATUS_REVERSE_MAP[apiReservation.estado] || 'pending',
    paymentStatus: PAYMENT_STATUS_REVERSE_MAP[apiReservation.estadoPago] || 'pending',
    createdAt: apiReservation.fechaCreacion,
    createdBy: apiReservation.creadoPor,
    totalAmount: apiReservation.montoTotal,
    paidAmount: apiReservation.montoPagado,
    balance: apiReservation.saldo,
    notes: apiReservation.observaciones,
  };

  // Agregar detalles específicos según el tipo
  if (apiReservation.detalleVuelo) {
    reservation.flight = apiFlightToUiFlight(apiReservation.detalleVuelo);
  }

  if (apiReservation.detalleHotel) {
    reservation.hotel = apiHotelToUiHotel(apiReservation.detalleHotel);
  }

  if (apiReservation.detallePaquete) {
    reservation.package = apiPackageToUiPackage(apiReservation.detallePaquete);
  }

  return reservation;
}

/**
 * Convierte múltiples reservas de la API al formato de UI
 */
export function apiReservationsToUiReservations(apiReservations: Reserva[]): Reservation[] {
  return apiReservations.map(apiReservationToUiReservation);
}

/**
 * Convierte detalles de vuelo de UI a formato API
 */
export function uiFlightToApiFlight(uiFlight: Partial<ReservationFormData>): Partial<DetalleVuelo> {
  if (!uiFlight.flightAirline) return {};
  
  return {
    aerolinea: uiFlight.flightAirline,
    numeroVuelo: uiFlight.flightNumber || '',
    origen: uiFlight.flightOrigin || '',
    destino: uiFlight.flightDestination || '',
    fechaSalida: uiFlight.flightDeparture || '',
    fechaLlegada: uiFlight.flightArrival || '',
    clase: uiFlight.flightClass ? FLIGHT_CLASS_MAP[uiFlight.flightClass] : 'Economica',
  };
}

/**
 * Convierte detalles de hotel de UI a formato API
 */
export function uiHotelToApiHotel(uiHotel: Partial<ReservationFormData>): Partial<DetalleHotel> {
  if (!uiHotel.hotelName) return {};
  
  const checkIn = new Date(uiHotel.hotelCheckIn || '');
  const checkOut = new Date(uiHotel.hotelCheckOut || '');
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    nombreHotel: uiHotel.hotelName,
    ubicacion: uiHotel.hotelLocation || '',
    fechaCheckIn: uiHotel.hotelCheckIn || '',
    fechaCheckOut: uiHotel.hotelCheckOut || '',
    tipoHabitacion: uiHotel.hotelRoomType || '',
    numeroNoches: nights > 0 ? nights : 1,
  };
}

/**
 * Convierte detalles de paquete de UI a formato API
 */
export function uiPackageToApiPackage(uiPackage: Partial<ReservationFormData>): Partial<DetallePaquete> {
  if (!uiPackage.packageName) return {};
  
  const startDate = new Date(uiPackage.packageStartDate || '');
  const endDate = new Date(uiPackage.packageEndDate || '');
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  return {
    nombrePaquete: uiPackage.packageName,
    destino: uiPackage.packageDestination || '',
    fechaInicio: uiPackage.packageStartDate || '',
    fechaFin: uiPackage.packageEndDate || '',
    duracion: duration > 0 ? duration : 1,
    incluyeVuelos: uiPackage.packageIncludesFlights || false,
    incluyeHotel: uiPackage.packageIncludesHotel || false,
    // idPaquete se debe asignar si se selecciona un paquete existente
    idPaquete: 0,
  };
}

/**
 * Convierte datos de formulario UI a DTO para crear reserva
 */
export function uiFormToCreateDTO(formData: ReservationFormData): CreateReservaDTO {
  const dto: CreateReservaDTO = {
    tipo: TYPE_MAP[formData.type] || 'Paquete',
    idCliente: parseInt(formData.clientId),
    estado: STATUS_MAP[formData.status] || 'Pendiente',
    estadoPago: PAYMENT_STATUS_MAP[formData.paymentStatus] || 'Pendiente',
    montoTotal: formData.totalAmount,
    montoPagado: formData.paidAmount,
    observaciones: formData.notes,
  };

  // Agregar detalles según el tipo de reserva
  if (formData.type === 'flight') {
    dto.detalleVuelo = uiFlightToApiFlight(formData);
  } else if (formData.type === 'hotel') {
    dto.detalleHotel = uiHotelToApiHotel(formData);
  } else if (formData.type === 'package') {
    dto.detallePaquete = uiPackageToApiPackage(formData);
  }

  return dto;
}

/**
 * Convierte datos de formulario UI a DTO para actualizar reserva
 */
export function uiFormToUpdateDTO(formData: Partial<ReservationFormData>): UpdateReservaDTO {
  const dto: UpdateReservaDTO = {};
  
  if (formData.type !== undefined) dto.tipo = TYPE_MAP[formData.type];
  if (formData.clientId !== undefined) dto.idCliente = parseInt(formData.clientId);
  if (formData.status !== undefined) dto.estado = STATUS_MAP[formData.status];
  if (formData.paymentStatus !== undefined) dto.estadoPago = PAYMENT_STATUS_MAP[formData.paymentStatus];
  if (formData.totalAmount !== undefined) dto.montoTotal = formData.totalAmount;
  if (formData.paidAmount !== undefined) dto.montoPagado = formData.paidAmount;
  if (formData.notes !== undefined) dto.observaciones = formData.notes;

  // Agregar detalles según el tipo
  if (formData.type === 'flight') {
    dto.detalleVuelo = uiFlightToApiFlight(formData);
  } else if (formData.type === 'hotel') {
    dto.detalleHotel = uiHotelToApiHotel(formData);
  } else if (formData.type === 'package') {
    dto.detallePaquete = uiPackageToApiPackage(formData);
  }
  
  return dto;
}

/**
 * Extrae el ID numérico de un string (útil para conversiones)
 */
export function extractReservationId(id: string | number): number {
  if (typeof id === 'number') return id;
  const numId = parseInt(id);
  if (isNaN(numId)) throw new Error(`ID inválido: ${id}`);
  return numId;
}

/**
 * Convierte tipo de reserva de UI a API
 */
export function uiTypeToApiType(uiType: ReservationType): TipoReserva {
  return TYPE_MAP[uiType] || 'Paquete';
}

/**
 * Convierte estado de UI a API
 */
export function uiStatusToApiStatus(uiStatus: ReservationStatus): EstadoReserva {
  return STATUS_MAP[uiStatus] || 'Pendiente';
}

/**
 * Convierte estado de pago de UI a API
 */
export function uiPaymentStatusToApiPaymentStatus(uiStatus: PaymentStatus): EstadoPago {
  return PAYMENT_STATUS_MAP[uiStatus] || 'Pendiente';
}

/**
 * Convierte tipo de reserva de API a UI
 */
export function apiTypeToUiType(apiType: TipoReserva): ReservationType {
  return TYPE_REVERSE_MAP[apiType] || 'package';
}

/**
 * Convierte estado de API a UI
 */
export function apiStatusToUiStatus(apiStatus: EstadoReserva): ReservationStatus {
  return STATUS_REVERSE_MAP[apiStatus] || 'pending';
}

/**
 * Convierte estado de pago de API a UI
 */
export function apiPaymentStatusToUiPaymentStatus(apiStatus: EstadoPago): PaymentStatus {
  return PAYMENT_STATUS_REVERSE_MAP[apiStatus] || 'pending';
}

/**
 * Calcula el saldo de una reserva
 */
export function calculateBalance(totalAmount: number, paidAmount: number): number {
  return totalAmount - paidAmount;
}

/**
 * Determina el estado de pago basado en el monto pagado
 */
export function determinePaymentStatus(totalAmount: number, paidAmount: number): PaymentStatus {
  if (paidAmount === 0) return 'pending';
  if (paidAmount >= totalAmount) return 'paid';
  return 'partial';
}
