import axiosInstance from './axiosInstance';

// ==================== TIPOS ====================

export type EstadoEmpleado = 'Activo' | 'Inactivo' | 'Vacaciones' | 'Licencia' | 'Suspendido';
export type TipoContrato = 'Indefinido' | 'Fijo' | 'Por_Obra' | 'Prestacion_Servicios' | 'Aprendiz';
export type TipoComision = 'Porcentaje' | 'Monto_Fijo' | 'Mixta';

export interface Empleado {
  idEmpleado: number;
  nombres: string;
  apellidos: string;
  numeroDocumento: string;
  tipoDocumento: string;
  email: string;
  telefono: string;
  direccion?: string;
  ciudad?: string;
  fechaNacimiento?: string;
  fechaContratacion: string;
  idDepartamento?: number;
  idCargo?: number;
  salarioBase: number;
  tipoContrato: TipoContrato;
  estadoEmpleado: EstadoEmpleado;
  fotoPerfil?: string;
  observaciones?: string;
  activo: boolean;
  // Datos relacionados
  nombreCompleto?: string;
  nombreDepartamento?: string;
  nombreCargo?: string;
  comisionesActivas?: number;
  ventasDelMes?: number;
  comisionesDelMes?: number;
}

export interface Departamento {
  idDepartamento: number;
  nombre: string;
  descripcion?: string;
  idJefe?: number;
  activo: boolean;
  // Datos calculados
  nombreJefe?: string;
  cantidadEmpleados?: number;
}

export interface Cargo {
  idCargo: number;
  nombre: string;
  descripcion?: string;
  salarioMinimo: number;
  salarioMaximo: number;
  activo: boolean;
  // Datos calculados
  cantidadEmpleados?: number;
}

export interface Comision {
  idComision: number;
  idEmpleado: number;
  tipoComision: TipoComision;
  porcentaje?: number;
  montoFijo?: number;
  meta?: number;
  fechaInicio: string;
  fechaFin?: string;
  activa: boolean;
  // Datos relacionados
  nombreEmpleado?: string;
  totalGenerado?: number;
}

export interface Horario {
  idHorario: number;
  idEmpleado: number;
  diaSemana: string;
  horaEntrada: string;
  horaSalida: string;
  activo: boolean;
  // Datos relacionados
  nombreEmpleado?: string;
  horasTotales?: number;
}

export interface Asistencia {
  idAsistencia: number;
  idEmpleado: number;
  fecha: string;
  horaEntrada?: string;
  horaSalida?: string;
  horasTrabajadas?: number;
  observaciones?: string;
  // Datos relacionados
  nombreEmpleado?: string;
}

export interface EmpleadoFormData {
  nombres: string;
  apellidos: string;
  numeroDocumento: string;
  tipoDocumento: string;
  email: string;
  telefono: string;
  direccion?: string;
  ciudad?: string;
  fechaNacimiento?: string;
  fechaContratacion: string;
  idDepartamento?: number;
  idCargo?: number;
  salarioBase: number;
  tipoContrato: TipoContrato;
  estadoEmpleado?: EstadoEmpleado;
  fotoPerfil?: string;
  observaciones?: string;
  activo?: boolean;
}

export interface DepartamentoFormData {
  nombre: string;
  descripcion?: string;
  idJefe?: number;
  activo?: boolean;
}

export interface CargoFormData {
  nombre: string;
  descripcion?: string;
  salarioMinimo: number;
  salarioMaximo: number;
  activo?: boolean;
}

export interface ComisionFormData {
  idEmpleado: number;
  tipoComision: TipoComision;
  porcentaje?: number;
  montoFijo?: number;
  meta?: number;
  fechaInicio: string;
  fechaFin?: string;
  activa?: boolean;
}

export interface HorarioFormData {
  idEmpleado: number;
  diaSemana: string;
  horaEntrada: string;
  horaSalida: string;
  activo?: boolean;
}

export interface AsistenciaFormData {
  idEmpleado: number;
  fecha: string;
  horaEntrada?: string;
  horaSalida?: string;
  horasTrabajadas?: number;
  observaciones?: string;
}

export interface EmployeeStatistics {
  totalEmpleados: number;
  empleadosActivos: number;
  empleadosVacaciones: number;
  totalDepartamentos: number;
  totalCargos: number;
  totalComisiones: number;
  nominaTotal: number;
  comisionesDelMes: number;
}

/**
 * Servicio para gestión de empleados
 * 
 * @description
 * Maneja todas las operaciones de empleados, departamentos,
 * cargos, comisiones, horarios y asistencias.
 * 
 * @author G2rism Team
 * @version 1.0
 */
class EmployeesService {
  private readonly empleadosUrl = '/empleados';
  private readonly departamentosUrl = '/departamentos';
  private readonly cargosUrl = '/cargos';
  private readonly comisionesUrl = '/comisiones';
  private readonly horariosUrl = '/horarios';
  private readonly asistenciasUrl = '/asistencias';

  // ==================== EMPLEADOS ====================

  /**
   * Obtener todos los empleados
   */
  async getAllEmployees(): Promise<Empleado[]> {
    const response = await axiosInstance.get(this.empleadosUrl);
    return response.data.data;
  }

  /**
   * Obtener empleado por ID
   */
  async getEmployeeById(id: number): Promise<Empleado> {
    const response = await axiosInstance.get(`${this.empleadosUrl}/${id}`);
    return response.data.data;
  }

  /**
   * Crear nuevo empleado
   */
  async createEmployee(data: EmpleadoFormData): Promise<Empleado> {
    const response = await axiosInstance.post(this.empleadosUrl, data);
    return response.data.data;
  }

  /**
   * Actualizar empleado
   */
  async updateEmployee(id: number, data: Partial<EmpleadoFormData>): Promise<Empleado> {
    const response = await axiosInstance.put(`${this.empleadosUrl}/${id}`, data);
    return response.data.data;
  }

  /**
   * Eliminar empleado
   */
  async deleteEmployee(id: number): Promise<void> {
    await axiosInstance.delete(`${this.empleadosUrl}/${id}`);
  }

  /**
   * Cambiar estado del empleado
   */
  async changeEmployeeStatus(id: number, estadoEmpleado: EstadoEmpleado): Promise<Empleado> {
    const response = await axiosInstance.patch(`${this.empleadosUrl}/${id}/estado`, { estadoEmpleado });
    return response.data.data;
  }

  /**
   * Obtener empleados activos
   */
  async getActiveEmployees(): Promise<Empleado[]> {
    const response = await axiosInstance.get(`${this.empleadosUrl}/activos`);
    return response.data.data;
  }

  /**
   * Obtener empleados por departamento
   */
  async getEmployeesByDepartment(idDepartamento: number): Promise<Empleado[]> {
    const response = await axiosInstance.get(`${this.empleadosUrl}/departamento/${idDepartamento}`);
    return response.data.data;
  }

  /**
   * Obtener empleados por cargo
   */
  async getEmployeesByPosition(idCargo: number): Promise<Empleado[]> {
    const response = await axiosInstance.get(`${this.empleadosUrl}/cargo/${idCargo}`);
    return response.data.data;
  }

  // ==================== DEPARTAMENTOS ====================

  /**
   * Obtener todos los departamentos
   */
  async getAllDepartments(): Promise<Departamento[]> {
    const response = await axiosInstance.get(this.departamentosUrl);
    return response.data.data;
  }

  /**
   * Obtener departamento por ID
   */
  async getDepartmentById(id: number): Promise<Departamento> {
    const response = await axiosInstance.get(`${this.departamentosUrl}/${id}`);
    return response.data.data;
  }

  /**
   * Crear nuevo departamento
   */
  async createDepartment(data: DepartamentoFormData): Promise<Departamento> {
    const response = await axiosInstance.post(this.departamentosUrl, data);
    return response.data.data;
  }

  /**
   * Actualizar departamento
   */
  async updateDepartment(id: number, data: Partial<DepartamentoFormData>): Promise<Departamento> {
    const response = await axiosInstance.put(`${this.departamentosUrl}/${id}`, data);
    return response.data.data;
  }

  /**
   * Eliminar departamento
   */
  async deleteDepartment(id: number): Promise<void> {
    await axiosInstance.delete(`${this.departamentosUrl}/${id}`);
  }

  // ==================== CARGOS ====================

  /**
   * Obtener todos los cargos
   */
  async getAllPositions(): Promise<Cargo[]> {
    const response = await axiosInstance.get(this.cargosUrl);
    return response.data.data;
  }

  /**
   * Obtener cargo por ID
   */
  async getPositionById(id: number): Promise<Cargo> {
    const response = await axiosInstance.get(`${this.cargosUrl}/${id}`);
    return response.data.data;
  }

  /**
   * Crear nuevo cargo
   */
  async createPosition(data: CargoFormData): Promise<Cargo> {
    const response = await axiosInstance.post(this.cargosUrl, data);
    return response.data.data;
  }

  /**
   * Actualizar cargo
   */
  async updatePosition(id: number, data: Partial<CargoFormData>): Promise<Cargo> {
    const response = await axiosInstance.put(`${this.cargosUrl}/${id}`, data);
    return response.data.data;
  }

  /**
   * Eliminar cargo
   */
  async deletePosition(id: number): Promise<void> {
    await axiosInstance.delete(`${this.cargosUrl}/${id}`);
  }

  // ==================== COMISIONES ====================

  /**
   * Obtener todas las comisiones
   */
  async getAllCommissions(): Promise<Comision[]> {
    const response = await axiosInstance.get(this.comisionesUrl);
    return response.data.data;
  }

  /**
   * Obtener comisión por ID
   */
  async getCommissionById(id: number): Promise<Comision> {
    const response = await axiosInstance.get(`${this.comisionesUrl}/${id}`);
    return response.data.data;
  }

  /**
   * Crear nueva comisión
   */
  async createCommission(data: ComisionFormData): Promise<Comision> {
    const response = await axiosInstance.post(this.comisionesUrl, data);
    return response.data.data;
  }

  /**
   * Actualizar comisión
   */
  async updateCommission(id: number, data: Partial<ComisionFormData>): Promise<Comision> {
    const response = await axiosInstance.put(`${this.comisionesUrl}/${id}`, data);
    return response.data.data;
  }

  /**
   * Eliminar comisión
   */
  async deleteCommission(id: number): Promise<void> {
    await axiosInstance.delete(`${this.comisionesUrl}/${id}`);
  }

  /**
   * Obtener comisiones por empleado
   */
  async getCommissionsByEmployee(idEmpleado: number): Promise<Comision[]> {
    const response = await axiosInstance.get(`${this.comisionesUrl}/empleado/${idEmpleado}`);
    return response.data.data;
  }

  /**
   * Obtener comisiones activas
   */
  async getActiveCommissions(): Promise<Comision[]> {
    const response = await axiosInstance.get(`${this.comisionesUrl}/activas`);
    return response.data.data;
  }

  // ==================== HORARIOS ====================

  /**
   * Obtener todos los horarios
   */
  async getAllSchedules(): Promise<Horario[]> {
    const response = await axiosInstance.get(this.horariosUrl);
    return response.data.data;
  }

  /**
   * Obtener horario por ID
   */
  async getScheduleById(id: number): Promise<Horario> {
    const response = await axiosInstance.get(`${this.horariosUrl}/${id}`);
    return response.data.data;
  }

  /**
   * Crear nuevo horario
   */
  async createSchedule(data: HorarioFormData): Promise<Horario> {
    const response = await axiosInstance.post(this.horariosUrl, data);
    return response.data.data;
  }

  /**
   * Actualizar horario
   */
  async updateSchedule(id: number, data: Partial<HorarioFormData>): Promise<Horario> {
    const response = await axiosInstance.put(`${this.horariosUrl}/${id}`, data);
    return response.data.data;
  }

  /**
   * Eliminar horario
   */
  async deleteSchedule(id: number): Promise<void> {
    await axiosInstance.delete(`${this.horariosUrl}/${id}`);
  }

  /**
   * Obtener horarios por empleado
   */
  async getSchedulesByEmployee(idEmpleado: number): Promise<Horario[]> {
    const response = await axiosInstance.get(`${this.horariosUrl}/empleado/${idEmpleado}`);
    return response.data.data;
  }

  // ==================== ASISTENCIAS ====================

  /**
   * Obtener todas las asistencias
   */
  async getAllAttendances(): Promise<Asistencia[]> {
    const response = await axiosInstance.get(this.asistenciasUrl);
    return response.data.data;
  }

  /**
   * Obtener asistencia por ID
   */
  async getAttendanceById(id: number): Promise<Asistencia> {
    const response = await axiosInstance.get(`${this.asistenciasUrl}/${id}`);
    return response.data.data;
  }

  /**
   * Registrar asistencia
   */
  async createAttendance(data: AsistenciaFormData): Promise<Asistencia> {
    const response = await axiosInstance.post(this.asistenciasUrl, data);
    return response.data.data;
  }

  /**
   * Actualizar asistencia
   */
  async updateAttendance(id: number, data: Partial<AsistenciaFormData>): Promise<Asistencia> {
    const response = await axiosInstance.put(`${this.asistenciasUrl}/${id}`, data);
    return response.data.data;
  }

  /**
   * Eliminar asistencia
   */
  async deleteAttendance(id: number): Promise<void> {
    await axiosInstance.delete(`${this.asistenciasUrl}/${id}`);
  }

  /**
   * Obtener asistencias por empleado
   */
  async getAttendancesByEmployee(idEmpleado: number): Promise<Asistencia[]> {
    const response = await axiosInstance.get(`${this.asistenciasUrl}/empleado/${idEmpleado}`);
    return response.data.data;
  }

  /**
   * Obtener asistencias del día
   */
  async getTodayAttendances(): Promise<Asistencia[]> {
    const response = await axiosInstance.get(`${this.asistenciasUrl}/hoy`);
    return response.data.data;
  }

  // ==================== ESTADÍSTICAS ====================

  /**
   * Obtener estadísticas de empleados
   */
  async getStatistics(): Promise<EmployeeStatistics> {
    const response = await axiosInstance.get(`${this.empleadosUrl}/estadisticas`);
    return response.data.data;
  }
}

// Exportar instancia única (singleton)
const employeesService = new EmployeesService();
export default employeesService;
