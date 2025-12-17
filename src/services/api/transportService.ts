import axiosInstance from './axiosConfig';
import { mockVehiculos, mockConductores, mockRutas, mockAsignaciones } from '../../data/mockData';

// ==================== TIPOS ====================

export type TipoVehiculo = 'Auto' | 'Van' | 'Bus' | 'Minibus' | 'Camioneta' | 'Otro';
export type EstadoVehiculo = 'Disponible' | 'En_Servicio' | 'Mantenimiento' | 'Fuera_Servicio' | 'Reservado';
export type EstadoRuta = 'Activa' | 'Suspendida' | 'Cancelada';
export type EstadoAsignacion = 'Programada' | 'En_Curso' | 'Completada' | 'Cancelada';

export interface Vehiculo {
  idVehiculo: number;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  tipoVehiculo: TipoVehiculo;
  capacidadPasajeros: number;
  color?: string;
  numeroSerie?: string;
  numeroMotor?: string;
  kilometraje?: number;
  estadoVehiculo: EstadoVehiculo;
  idProveedor?: number;
  costoMantenimiento?: number;
  fechaUltimoMantenimiento?: string;
  proximoMantenimiento?: string;
  observaciones?: string;
  activo: boolean;
  // Datos relacionados
  nombreProveedor?: string;
  asignacionesActivas?: number;
}

export interface Conductor {
  idConductor: number;
  nombres: string;
  apellidos: string;
  numeroDocumento: string;
  tipoDocumento: string;
  telefono: string;
  email?: string;
  numeroLicencia: string;
  categoriaLicencia: string;
  fechaVencimientoLicencia: string;
  direccion?: string;
  ciudad?: string;
  fechaContratacion: string;
  activo: boolean;
  // Datos relacionados
  nombreCompleto?: string;
  asignacionesActivas?: number;
}

export interface Ruta {
  idRuta: number;
  nombre: string;
  origen: string;
  destino: string;
  distanciaKm: number;
  tiempoEstimadoHoras: number;
  descripcion?: string;
  puntosIntermedios?: string;
  tarifaBase: number;
  estadoRuta: EstadoRuta;
  activo: boolean;
  // Datos calculados
  tarifaPorKm?: number;
  cantidadAsignaciones?: number;
}

export interface Asignacion {
  idAsignacion: number;
  idVehiculo: number;
  idConductor: number;
  idRuta: number;
  idReserva?: number;
  fechaSalida: string;
  horaSalida: string;
  fechaRetorno?: string;
  horaRetorno?: string;
  numeroPasajeros: number;
  tarifa: number;
  estadoAsignacion: EstadoAsignacion;
  observaciones?: string;
  // Datos relacionados
  placaVehiculo?: string;
  nombreConductor?: string;
  nombreRuta?: string;
  numeroReserva?: string;
}

export interface VehiculoFormData {
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  tipoVehiculo: TipoVehiculo;
  capacidadPasajeros: number;
  color?: string;
  numeroSerie?: string;
  numeroMotor?: string;
  kilometraje?: number;
  estadoVehiculo?: EstadoVehiculo;
  idProveedor?: number;
  costoMantenimiento?: number;
  fechaUltimoMantenimiento?: string;
  proximoMantenimiento?: string;
  observaciones?: string;
  activo?: boolean;
}

export interface ConductorFormData {
  nombres: string;
  apellidos: string;
  numeroDocumento: string;
  tipoDocumento: string;
  telefono: string;
  email?: string;
  numeroLicencia: string;
  categoriaLicencia: string;
  fechaVencimientoLicencia: string;
  direccion?: string;
  ciudad?: string;
  fechaContratacion: string;
  activo?: boolean;
}

export interface RutaFormData {
  nombre: string;
  origen: string;
  destino: string;
  distanciaKm: number;
  tiempoEstimadoHoras: number;
  descripcion?: string;
  puntosIntermedios?: string;
  tarifaBase: number;
  estadoRuta?: EstadoRuta;
  activo?: boolean;
}

export interface AsignacionFormData {
  idVehiculo: number;
  idConductor: number;
  idRuta: number;
  idReserva?: number;
  fechaSalida: string;
  horaSalida: string;
  fechaRetorno?: string;
  horaRetorno?: string;
  numeroPasajeros: number;
  tarifa: number;
  estadoAsignacion?: EstadoAsignacion;
  observaciones?: string;
}

export interface TransportStatistics {
  totalVehiculos: number;
  vehiculosDisponibles: number;
  vehiculosEnServicio: number;
  vehiculosMantenimiento: number;
  totalConductores: number;
  conductoresActivos: number;
  totalRutas: number;
  rutasActivas: number;
  asignacionesHoy: number;
  asignacionesMes: number;
  ingresosMes: number;
}

/**
 * Servicio para gestión de transporte
 * 
 * @description
 * Maneja todas las operaciones de vehículos, conductores,
 * rutas y asignaciones de transporte.
 * 
 * @author G2rism Team
 * @version 1.0
 */
class TransportService {
  private readonly vehiculosUrl = '/vehiculos';
  private readonly conductoresUrl = '/conductores';
  private readonly rutasUrl = '/rutas';
  private readonly asignacionesUrl = '/asignaciones-transporte';

  // ==================== VEHÍCULOS ====================

  /**
   * Obtener todos los vehículos
   */
  async getAllVehicles(): Promise<Vehiculo[]> {
    try {
      const response = await axiosInstance.get(this.vehiculosUrl);
      return response.data.data;
    } catch (error: any) {
      // Si la API no está disponible, usar datos mock
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        console.info('API no disponible, usando datos mock para vehículos');
        return mockVehiculos;
      }
      throw error;
    }
  }

  /**
   * Obtener vehículo por ID
   */
  async getVehicleById(id: number): Promise<Vehiculo> {
    const response = await axiosInstance.get(`${this.vehiculosUrl}/${id}`);
    return response.data.data;
  }

  /**
   * Crear nuevo vehículo
   */
  async createVehicle(data: VehiculoFormData): Promise<Vehiculo> {
    const response = await axiosInstance.post(this.vehiculosUrl, data);
    return response.data.data;
  }

  /**
   * Actualizar vehículo
   */
  async updateVehicle(id: number, data: Partial<VehiculoFormData>): Promise<Vehiculo> {
    const response = await axiosInstance.put(`${this.vehiculosUrl}/${id}`, data);
    return response.data.data;
  }

  /**
   * Eliminar vehículo
   */
  async deleteVehicle(id: number): Promise<void> {
    await axiosInstance.delete(`${this.vehiculosUrl}/${id}`);
  }

  /**
   * Cambiar estado del vehículo
   */
  async changeVehicleStatus(id: number, estadoVehiculo: EstadoVehiculo): Promise<Vehiculo> {
    const response = await axiosInstance.patch(`${this.vehiculosUrl}/${id}/estado`, { estadoVehiculo });
    return response.data.data;
  }

  /**
   * Obtener vehículos disponibles
   */
  async getAvailableVehicles(): Promise<Vehiculo[]> {
    const response = await axiosInstance.get(`${this.vehiculosUrl}/disponibles`);
    return response.data.data;
  }

  /**
   * Registrar mantenimiento
   */
  async registerMaintenance(id: number, data: { fecha: string; descripcion: string; costo: number }): Promise<Vehiculo> {
    const response = await axiosInstance.post(`${this.vehiculosUrl}/${id}/mantenimiento`, data);
    return response.data.data;
  }

  // ==================== CONDUCTORES ====================

  /**
   * Obtener todos los conductores
   */
  async getAllDrivers(): Promise<Conductor[]> {
    try {
      const response = await axiosInstance.get(this.conductoresUrl);
      return response.data.data;
    } catch (error: any) {
      // Si la API no está disponible, usar datos mock
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        console.info('API no disponible, usando datos mock para conductores');
        return mockConductores;
      }
      throw error;
    }
  }

  /**
   * Obtener conductor por ID
   */
  async getDriverById(id: number): Promise<Conductor> {
    const response = await axiosInstance.get(`${this.conductoresUrl}/${id}`);
    return response.data.data;
  }

  /**
   * Crear nuevo conductor
   */
  async createDriver(data: ConductorFormData): Promise<Conductor> {
    const response = await axiosInstance.post(this.conductoresUrl, data);
    return response.data.data;
  }

  /**
   * Actualizar conductor
   */
  async updateDriver(id: number, data: Partial<ConductorFormData>): Promise<Conductor> {
    const response = await axiosInstance.put(`${this.conductoresUrl}/${id}`, data);
    return response.data.data;
  }

  /**
   * Eliminar conductor
   */
  async deleteDriver(id: number): Promise<void> {
    await axiosInstance.delete(`${this.conductoresUrl}/${id}`);
  }

  /**
   * Obtener conductores disponibles
   */
  async getAvailableDrivers(): Promise<Conductor[]> {
    const response = await axiosInstance.get(`${this.conductoresUrl}/disponibles`);
    return response.data.data;
  }

  // ==================== RUTAS ====================

  /**
   * Obtener todas las rutas
   */
  async getAllRoutes(): Promise<Ruta[]> {
    try {
      const response = await axiosInstance.get(this.rutasUrl);
      return response.data.data;
    } catch (error: any) {
      // Si la API no está disponible, usar datos mock
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        console.info('API no disponible, usando datos mock para rutas');
        return mockRutas;
      }
      throw error;
    }
  }

  /**
   * Obtener ruta por ID
   */
  async getRouteById(id: number): Promise<Ruta> {
    const response = await axiosInstance.get(`${this.rutasUrl}/${id}`);
    return response.data.data;
  }

  /**
   * Crear nueva ruta
   */
  async createRoute(data: RutaFormData): Promise<Ruta> {
    const response = await axiosInstance.post(this.rutasUrl, data);
    return response.data.data;
  }

  /**
   * Actualizar ruta
   */
  async updateRoute(id: number, data: Partial<RutaFormData>): Promise<Ruta> {
    const response = await axiosInstance.put(`${this.rutasUrl}/${id}`, data);
    return response.data.data;
  }

  /**
   * Eliminar ruta
   */
  async deleteRoute(id: number): Promise<void> {
    await axiosInstance.delete(`${this.rutasUrl}/${id}`);
  }

  /**
   * Cambiar estado de la ruta
   */
  async changeRouteStatus(id: number, estadoRuta: EstadoRuta): Promise<Ruta> {
    const response = await axiosInstance.patch(`${this.rutasUrl}/${id}/estado`, { estadoRuta });
    return response.data.data;
  }

  /**
   * Obtener rutas activas
   */
  async getActiveRoutes(): Promise<Ruta[]> {
    const response = await axiosInstance.get(`${this.rutasUrl}/activas`);
    return response.data.data;
  }

  // ==================== ASIGNACIONES ====================

  /**
   * Obtener todas las asignaciones
   */
  async getAllAssignments(): Promise<Asignacion[]> {
    try {
      const response = await axiosInstance.get(this.asignacionesUrl);
      return response.data.data;
    } catch (error: any) {
      // Si la API no está disponible, usar datos mock
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        console.info('API no disponible, usando datos mock para asignaciones');
        return mockAsignaciones;
      }
      throw error;
    }
  }

  /**
   * Obtener asignación por ID
   */
  async getAssignmentById(id: number): Promise<Asignacion> {
    const response = await axiosInstance.get(`${this.asignacionesUrl}/${id}`);
    return response.data.data;
  }

  /**
   * Crear nueva asignación
   */
  async createAssignment(data: AsignacionFormData): Promise<Asignacion> {
    const response = await axiosInstance.post(this.asignacionesUrl, data);
    return response.data.data;
  }

  /**
   * Actualizar asignación
   */
  async updateAssignment(id: number, data: Partial<AsignacionFormData>): Promise<Asignacion> {
    const response = await axiosInstance.put(`${this.asignacionesUrl}/${id}`, data);
    return response.data.data;
  }

  /**
   * Eliminar asignación
   */
  async deleteAssignment(id: number): Promise<void> {
    await axiosInstance.delete(`${this.asignacionesUrl}/${id}`);
  }

  /**
   * Cambiar estado de asignación
   */
  async changeAssignmentStatus(id: number, estadoAsignacion: EstadoAsignacion): Promise<Asignacion> {
    const response = await axiosInstance.patch(`${this.asignacionesUrl}/${id}/estado`, { estadoAsignacion });
    return response.data.data;
  }

  /**
   * Obtener asignaciones del día
   */
  async getTodayAssignments(): Promise<Asignacion[]> {
    const response = await axiosInstance.get(`${this.asignacionesUrl}/hoy`);
    return response.data.data;
  }

  /**
   * Obtener asignaciones por vehículo
   */
  async getAssignmentsByVehicle(idVehiculo: number): Promise<Asignacion[]> {
    const response = await axiosInstance.get(`${this.asignacionesUrl}/vehiculo/${idVehiculo}`);
    return response.data.data;
  }

  /**
   * Obtener asignaciones por conductor
   */
  async getAssignmentsByDriver(idConductor: number): Promise<Asignacion[]> {
    const response = await axiosInstance.get(`${this.asignacionesUrl}/conductor/${idConductor}`);
    return response.data.data;
  }

  // ==================== ESTADÍSTICAS ====================

  /**
   * Obtener estadísticas de transporte
   */
  async getStatistics(): Promise<TransportStatistics> {
    const response = await axiosInstance.get(`${this.vehiculosUrl}/estadisticas`);
    return response.data.data;
  }
}

// Exportar instancia única (singleton)
const transportService = new TransportService();
export default transportService;
