import type {
  Vehiculo,
  Conductor,
  Ruta,
  Asignacion,
  TipoVehiculo,
  EstadoVehiculo,
  EstadoRuta,
  EstadoAsignacion,
} from '../../services/api/transportService';

// ==================== MAPEOS DE TIPOS ====================

/**
 * Labels para tipos de vehículo
 */
export const VEHICLE_TYPE_LABELS: Record<TipoVehiculo, string> = {
  'Auto': 'Auto',
  'Van': 'Van',
  'Bus': 'Bus',
  'Minibus': 'Minibus',
  'Camioneta': 'Camioneta',
  'Otro': 'Otro',
};

/**
 * Íconos para tipos de vehículo
 */
export const VEHICLE_TYPE_ICONS: Record<TipoVehiculo, string> = {
  'Auto': '🚗',
  'Van': '🚐',
  'Bus': '🚌',
  'Minibus': '🚐',
  'Camioneta': '🛻',
  'Otro': '🚙',
};

/**
 * Labels para estados de vehículo
 */
export const VEHICLE_STATUS_LABELS: Record<EstadoVehiculo, string> = {
  'Disponible': 'Disponible',
  'En_Servicio': 'En Servicio',
  'Mantenimiento': 'Mantenimiento',
  'Fuera_Servicio': 'Fuera de Servicio',
  'Reservado': 'Reservado',
};

/**
 * Colores para estados de vehículo
 */
export const VEHICLE_STATUS_COLORS: Record<EstadoVehiculo, string> = {
  'Disponible': 'green',
  'En_Servicio': 'blue',
  'Mantenimiento': 'orange',
  'Fuera_Servicio': 'red',
  'Reservado': 'purple',
};

/**
 * Labels para estados de ruta
 */
export const ROUTE_STATUS_LABELS: Record<EstadoRuta, string> = {
  'Activa': 'Activa',
  'Suspendida': 'Suspendida',
  'Cancelada': 'Cancelada',
};

/**
 * Colores para estados de ruta
 */
export const ROUTE_STATUS_COLORS: Record<EstadoRuta, string> = {
  'Activa': 'green',
  'Suspendida': 'orange',
  'Cancelada': 'red',
};

/**
 * Labels para estados de asignación
 */
export const ASSIGNMENT_STATUS_LABELS: Record<EstadoAsignacion, string> = {
  'Programada': 'Programada',
  'En_Curso': 'En Curso',
  'Completada': 'Completada',
  'Cancelada': 'Cancelada',
};

/**
 * Colores para estados de asignación
 */
export const ASSIGNMENT_STATUS_COLORS: Record<EstadoAsignacion, string> = {
  'Programada': 'blue',
  'En_Curso': 'purple',
  'Completada': 'green',
  'Cancelada': 'red',
};

// ==================== FUNCIONES DE UTILIDAD ====================

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
 * Formatea una hora
 */
export function formatTime(timeString: string): string {
  // timeString puede venir como "HH:mm:ss" o "HH:mm"
  const parts = timeString.split(':');
  return `${parts[0]}:${parts[1]}`;
}

/**
 * Formatea fecha y hora juntas
 */
export function formatDateTime(dateString: string, timeString: string): string {
  return `${formatDate(dateString)} ${formatTime(timeString)}`;
}

/**
 * Formatea un monto de dinero
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formatea distancia en kilómetros
 */
export function formatDistance(km: number): string {
  return `${km.toFixed(1)} km`;
}

/**
 * Formatea tiempo en horas
 */
export function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

/**
 * Obtiene el label de un tipo de vehículo
 */
export function getVehicleTypeLabel(type: TipoVehiculo): string {
  return VEHICLE_TYPE_LABELS[type] || type;
}

/**
 * Obtiene el ícono de un tipo de vehículo
 */
export function getVehicleTypeIcon(type: TipoVehiculo): string {
  return VEHICLE_TYPE_ICONS[type] || '🚙';
}

/**
 * Obtiene el label de un estado de vehículo
 */
export function getVehicleStatusLabel(status: EstadoVehiculo): string {
  return VEHICLE_STATUS_LABELS[status] || status;
}

/**
 * Obtiene el color de un estado de vehículo
 */
export function getVehicleStatusColor(status: EstadoVehiculo): string {
  return VEHICLE_STATUS_COLORS[status] || 'gray';
}

/**
 * Obtiene el label de un estado de ruta
 */
export function getRouteStatusLabel(status: EstadoRuta): string {
  return ROUTE_STATUS_LABELS[status] || status;
}

/**
 * Obtiene el color de un estado de ruta
 */
export function getRouteStatusColor(status: EstadoRuta): string {
  return ROUTE_STATUS_COLORS[status] || 'gray';
}

/**
 * Obtiene el label de un estado de asignación
 */
export function getAssignmentStatusLabel(status: EstadoAsignacion): string {
  return ASSIGNMENT_STATUS_LABELS[status] || status;
}

/**
 * Obtiene el color de un estado de asignación
 */
export function getAssignmentStatusColor(status: EstadoAsignacion): string {
  return ASSIGNMENT_STATUS_COLORS[status] || 'gray';
}

/**
 * Genera nombre completo de conductor
 */
export function getDriverFullName(conductor: Conductor): string {
  return `${conductor.nombres} ${conductor.apellidos}`;
}

/**
 * Genera descripción de vehículo
 */
export function getVehicleDescription(vehiculo: Vehiculo): string {
  return `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio}`;
}

/**
 * Genera descripción de ruta
 */
export function getRouteDescription(ruta: Ruta): string {
  return `${ruta.origen} → ${ruta.destino}`;
}

/**
 * Verifica si un vehículo está disponible
 */
export function isVehicleAvailable(vehiculo: Vehiculo): boolean {
  return vehiculo.estadoVehiculo === 'Disponible' && vehiculo.activo;
}

/**
 * Verifica si un conductor está activo
 */
export function isDriverActive(conductor: Conductor): boolean {
  return conductor.activo;
}

/**
 * Verifica si la licencia está próxima a vencer (30 días)
 */
export function isLicenseExpiringSoon(conductor: Conductor): boolean {
  const expirationDate = new Date(conductor.fechaVencimientoLicencia);
  const today = new Date();
  const daysUntilExpiration = Math.floor((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return daysUntilExpiration > 0 && daysUntilExpiration <= 30;
}

/**
 * Verifica si la licencia está vencida
 */
export function isLicenseExpired(conductor: Conductor): boolean {
  const expirationDate = new Date(conductor.fechaVencimientoLicencia);
  const today = new Date();
  return today > expirationDate;
}

/**
 * Verifica si el vehículo necesita mantenimiento pronto (15 días)
 */
export function needsMaintenanceSoon(vehiculo: Vehiculo): boolean {
  if (!vehiculo.proximoMantenimiento) return false;
  const maintenanceDate = new Date(vehiculo.proximoMantenimiento);
  const today = new Date();
  const daysUntilMaintenance = Math.floor((maintenanceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return daysUntilMaintenance > 0 && daysUntilMaintenance <= 15;
}

/**
 * Verifica si el vehículo tiene mantenimiento atrasado
 */
export function hasOverdueMaintenance(vehiculo: Vehiculo): boolean {
  if (!vehiculo.proximoMantenimiento) return false;
  const maintenanceDate = new Date(vehiculo.proximoMantenimiento);
  const today = new Date();
  return today > maintenanceDate;
}

/**
 * Calcula tarifa por kilómetro de una ruta
 */
export function calculatePricePerKm(ruta: Ruta): number {
  if (ruta.distanciaKm === 0) return 0;
  return ruta.tarifaBase / ruta.distanciaKm;
}

/**
 * Calcula tarifa estimada para una asignación
 */
export function calculateEstimatedFare(ruta: Ruta, numeroPasajeros: number): number {
  // Tarifa base + incremento por pasajero adicional (después del primer pasajero)
  const extraPassengers = Math.max(0, numeroPasajeros - 1);
  const extraCharge = extraPassengers * (ruta.tarifaBase * 0.1); // 10% por pasajero adicional
  return ruta.tarifaBase + extraCharge;
}

/**
 * Filtra vehículos por tipo
 */
export function filterVehiclesByType(vehicles: Vehiculo[], type: TipoVehiculo): Vehiculo[] {
  return vehicles.filter(v => v.tipoVehiculo === type);
}

/**
 * Filtra vehículos por estado
 */
export function filterVehiclesByStatus(vehicles: Vehiculo[], status: EstadoVehiculo): Vehiculo[] {
  return vehicles.filter(v => v.estadoVehiculo === status);
}

/**
 * Filtra vehículos disponibles
 */
export function filterAvailableVehicles(vehicles: Vehiculo[]): Vehiculo[] {
  return vehicles.filter(isVehicleAvailable);
}

/**
 * Filtra conductores activos
 */
export function filterActiveDrivers(drivers: Conductor[]): Conductor[] {
  return drivers.filter(isDriverActive);
}

/**
 * Filtra conductores con licencia próxima a vencer
 */
export function filterDriversWithExpiringSoon(drivers: Conductor[]): Conductor[] {
  return drivers.filter(isLicenseExpiringSoon);
}

/**
 * Filtra rutas activas
 */
export function filterActiveRoutes(routes: Ruta[]): Ruta[] {
  return routes.filter(r => r.estadoRuta === 'Activa' && r.activo);
}

/**
 * Ordena vehículos por placa
 */
export function sortVehiclesByPlate(vehicles: Vehiculo[]): Vehiculo[] {
  return [...vehicles].sort((a, b) => a.placa.localeCompare(b.placa));
}

/**
 * Ordena conductores por nombre
 */
export function sortDriversByName(drivers: Conductor[]): Conductor[] {
  return [...drivers].sort((a, b) => {
    const nameA = getDriverFullName(a);
    const nameB = getDriverFullName(b);
    return nameA.localeCompare(nameB);
  });
}

/**
 * Ordena rutas por distancia
 */
export function sortRoutesByDistance(routes: Ruta[], ascending: boolean = true): Ruta[] {
  return [...routes].sort((a, b) => {
    return ascending ? a.distanciaKm - b.distanciaKm : b.distanciaKm - a.distanciaKm;
  });
}

/**
 * Ordena asignaciones por fecha
 */
export function sortAssignmentsByDate(assignments: Asignacion[], ascending: boolean = false): Asignacion[] {
  return [...assignments].sort((a, b) => {
    const dateA = new Date(`${a.fechaSalida} ${a.horaSalida}`).getTime();
    const dateB = new Date(`${b.fechaSalida} ${b.horaSalida}`).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
}

/**
 * Agrupa vehículos por tipo
 */
export function groupVehiclesByType(vehicles: Vehiculo[]): Record<TipoVehiculo, Vehiculo[]> {
  const grouped: Partial<Record<TipoVehiculo, Vehiculo[]>> = {};
  
  vehicles.forEach(vehicle => {
    if (!grouped[vehicle.tipoVehiculo]) {
      grouped[vehicle.tipoVehiculo] = [];
    }
    grouped[vehicle.tipoVehiculo]!.push(vehicle);
  });
  
  return grouped as Record<TipoVehiculo, Vehiculo[]>;
}

/**
 * Agrupa vehículos por estado
 */
export function groupVehiclesByStatus(vehicles: Vehiculo[]): Record<EstadoVehiculo, Vehiculo[]> {
  const grouped: Partial<Record<EstadoVehiculo, Vehiculo[]>> = {};
  
  vehicles.forEach(vehicle => {
    if (!grouped[vehicle.estadoVehiculo]) {
      grouped[vehicle.estadoVehiculo] = [];
    }
    grouped[vehicle.estadoVehiculo]!.push(vehicle);
  });
  
  return grouped as Record<EstadoVehiculo, Vehiculo[]>;
}

/**
 * Calcula estadísticas de vehículos
 */
export function calculateVehicleStats(vehicles: Vehiculo[]): {
  total: number;
  disponibles: number;
  enServicio: number;
  mantenimiento: number;
  porTipo: Record<TipoVehiculo, number>;
} {
  const stats = {
    total: vehicles.length,
    disponibles: vehicles.filter(v => v.estadoVehiculo === 'Disponible').length,
    enServicio: vehicles.filter(v => v.estadoVehiculo === 'En_Servicio').length,
    mantenimiento: vehicles.filter(v => v.estadoVehiculo === 'Mantenimiento').length,
    porTipo: {} as Record<TipoVehiculo, number>,
  };

  vehicles.forEach(vehicle => {
    stats.porTipo[vehicle.tipoVehiculo] = (stats.porTipo[vehicle.tipoVehiculo] || 0) + 1;
  });

  return stats;
}

/**
 * Genera placa sugerida (formato colombiano)
 */
export function generatePlacaSuggestion(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const letter1 = letters[Math.floor(Math.random() * letters.length)];
  const letter2 = letters[Math.floor(Math.random() * letters.length)];
  const letter3 = letters[Math.floor(Math.random() * letters.length)];
  const number = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${letter1}${letter2}${letter3}-${number}`;
}

/**
 * Valida formato de placa colombiana
 */
export function validatePlaca(placa: string): boolean {
  // Formato: ABC-123 o ABC123
  const regex = /^[A-Z]{3}-?\d{3}$/;
  return regex.test(placa.toUpperCase());
}

/**
 * Valida número de licencia
 */
export function validateLicenseNumber(licencia: string): boolean {
  // Formato: mínimo 8 caracteres alfanuméricos
  return licencia.length >= 8;
}
