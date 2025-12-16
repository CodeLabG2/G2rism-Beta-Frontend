import { useState, useEffect, useCallback } from 'react';
import employeesService from '../services/api/employeesService';
import { mockEmployees } from '../data/mockData';
import type {
  Empleado,
  CreateEmpleadoDTO,
  UpdateEmpleadoDTO,
  Departamento,
  DepartamentoFormData,
  Cargo,
  CargoFormData,
  Comision,
  ComisionFormData,
  Horario,
  HorarioFormData,
  Asistencia,
  AsistenciaFormData,
  EstadoEmpleado,
  EmployeeStatistics,
} from '../services/api/employeesService';

/**
 * Hook personalizado para gestión de empleados
 * Integra employeesService con React state management
 * 
 * @returns Funciones y estado para gestionar empleados
 */
export function useEmployees() {
  const [employees, setEmployees] = useState<Empleado[]>([]);
  const [departments, setDepartments] = useState<Departamento[]>([]);
  const [positions, setPositions] = useState<Cargo[]>([]);
  const [commissions, setCommissions] = useState<Comision[]>([]);
  const [schedules, setSchedules] = useState<Horario[]>([]);
  const [attendances, setAttendances] = useState<Asistencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ==================== EMPLEADOS ====================

  /**
   * Cargar todos los empleados
   */
  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        const data = await employeesService.getAllEmployees();
        setEmployees(data);
      } catch (apiError) {
        // Si falla la API, usar datos mock
        console.log('API no disponible, usando datos mock de empleados');
        setEmployees(mockEmployees as any);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar empleados';
      setError(errorMessage);
      console.error('Error loading employees:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crear nuevo empleado
   */
  const createEmployee = useCallback(async (data: CreateEmpleadoDTO) => {
    try {
      const newEmployee = await employeesService.createEmployee(data);
      setEmployees(prev => [newEmployee, ...prev]);
      return { success: true, data: newEmployee };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear empleado';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Actualizar empleado
   */
  const updateEmployee = useCallback(async (id: number, data: UpdateEmpleadoDTO) => {
    try {
      const updatedEmployee = await employeesService.updateEmployee(id, data);
      setEmployees(prev => prev.map(e => e.idEmpleado === id ? updatedEmployee : e));
      return { success: true, data: updatedEmployee };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar empleado';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Eliminar empleado
   */
  const deleteEmployee = useCallback(async (id: number) => {
    try {
      await employeesService.deleteEmployee(id);
      setEmployees(prev => prev.filter(e => e.idEmpleado !== id));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar empleado';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Cambiar estado de empleado
   */
  const changeEmployeeStatus = useCallback(async (id: number, estadoEmpleado: EstadoEmpleado) => {
    try {
      const updatedEmployee = await employeesService.changeEmployeeStatus(id, estadoEmpleado);
      setEmployees(prev => prev.map(e => e.idEmpleado === id ? updatedEmployee : e));
      return { success: true, data: updatedEmployee };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cambiar estado';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener empleados activos
   */
  const getActiveEmployees = useCallback(async () => {
    try {
      const data = await employeesService.getActiveEmployees();
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener empleados activos';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener empleados por departamento
   */
  const getEmployeesByDepartment = useCallback(async (idDepartamento: number) => {
    try {
      const data = await employeesService.getEmployeesByDepartment(idDepartamento);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener empleados del departamento';
      return { success: false, error: errorMessage };
    }
  }, []);

  // ==================== DEPARTAMENTOS ====================

  /**
   * Cargar todos los departamentos
   */
  const loadDepartments = useCallback(async () => {
    try {
      const data = await employeesService.getAllDepartments();
      setDepartments(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar departamentos';
      setError(errorMessage);
      console.error('Error loading departments:', err);
      return [];
    }
  }, []);

  /**
   * Crear nuevo departamento
   */
  const createDepartment = useCallback(async (data: DepartamentoFormData) => {
    try {
      const newDepartment = await employeesService.createDepartment(data);
      setDepartments(prev => [newDepartment, ...prev]);
      return { success: true, data: newDepartment };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear departamento';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Actualizar departamento
   */
  const updateDepartment = useCallback(async (id: number, data: Partial<DepartamentoFormData>) => {
    try {
      const updatedDepartment = await employeesService.updateDepartment(id, data);
      setDepartments(prev => prev.map(d => d.idDepartamento === id ? updatedDepartment : d));
      return { success: true, data: updatedDepartment };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar departamento';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Eliminar departamento
   */
  const deleteDepartment = useCallback(async (id: number) => {
    try {
      await employeesService.deleteDepartment(id);
      setDepartments(prev => prev.filter(d => d.idDepartamento !== id));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar departamento';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // ==================== CARGOS ====================

  /**
   * Cargar todos los cargos
   */
  const loadPositions = useCallback(async () => {
    try {
      const data = await employeesService.getAllPositions();
      setPositions(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar cargos';
      setError(errorMessage);
      console.error('Error loading positions:', err);
      return [];
    }
  }, []);

  /**
   * Crear nuevo cargo
   */
  const createPosition = useCallback(async (data: CargoFormData) => {
    try {
      const newPosition = await employeesService.createPosition(data);
      setPositions(prev => [newPosition, ...prev]);
      return { success: true, data: newPosition };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear cargo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Actualizar cargo
   */
  const updatePosition = useCallback(async (id: number, data: Partial<CargoFormData>) => {
    try {
      const updatedPosition = await employeesService.updatePosition(id, data);
      setPositions(prev => prev.map(p => p.idCargo === id ? updatedPosition : p));
      return { success: true, data: updatedPosition };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar cargo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Eliminar cargo
   */
  const deletePosition = useCallback(async (id: number) => {
    try {
      await employeesService.deletePosition(id);
      setPositions(prev => prev.filter(p => p.idCargo !== id));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar cargo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // ==================== COMISIONES ====================

  /**
   * Cargar todas las comisiones
   */
  const loadCommissions = useCallback(async () => {
    try {
      const data = await employeesService.getAllCommissions();
      setCommissions(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar comisiones';
      setError(errorMessage);
      console.error('Error loading commissions:', err);
      return [];
    }
  }, []);

  /**
   * Crear nueva comisión
   */
  const createCommission = useCallback(async (data: ComisionFormData) => {
    try {
      const newCommission = await employeesService.createCommission(data);
      setCommissions(prev => [newCommission, ...prev]);
      return { success: true, data: newCommission };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear comisión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Actualizar comisión
   */
  const updateCommission = useCallback(async (id: number, data: Partial<ComisionFormData>) => {
    try {
      const updatedCommission = await employeesService.updateCommission(id, data);
      setCommissions(prev => prev.map(c => c.idComision === id ? updatedCommission : c));
      return { success: true, data: updatedCommission };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar comisión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Eliminar comisión
   */
  const deleteCommission = useCallback(async (id: number) => {
    try {
      await employeesService.deleteCommission(id);
      setCommissions(prev => prev.filter(c => c.idComision !== id));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar comisión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener comisiones por empleado
   */
  const getCommissionsByEmployee = useCallback(async (idEmpleado: number) => {
    try {
      const data = await employeesService.getCommissionsByEmployee(idEmpleado);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener comisiones del empleado';
      return { success: false, error: errorMessage };
    }
  }, []);

  // ==================== HORARIOS ====================

  /**
   * Cargar todos los horarios
   */
  const loadSchedules = useCallback(async () => {
    try {
      const data = await employeesService.getAllSchedules();
      setSchedules(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar horarios';
      setError(errorMessage);
      console.error('Error loading schedules:', err);
      return [];
    }
  }, []);

  /**
   * Crear nuevo horario
   */
  const createSchedule = useCallback(async (data: HorarioFormData) => {
    try {
      const newSchedule = await employeesService.createSchedule(data);
      setSchedules(prev => [newSchedule, ...prev]);
      return { success: true, data: newSchedule };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear horario';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Actualizar horario
   */
  const updateSchedule = useCallback(async (id: number, data: Partial<HorarioFormData>) => {
    try {
      const updatedSchedule = await employeesService.updateSchedule(id, data);
      setSchedules(prev => prev.map(s => s.idHorario === id ? updatedSchedule : s));
      return { success: true, data: updatedSchedule };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar horario';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Eliminar horario
   */
  const deleteSchedule = useCallback(async (id: number) => {
    try {
      await employeesService.deleteSchedule(id);
      setSchedules(prev => prev.filter(s => s.idHorario !== id));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar horario';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // ==================== ASISTENCIAS ====================

  /**
   * Cargar todas las asistencias
   */
  const loadAttendances = useCallback(async () => {
    try {
      const data = await employeesService.getAllAttendances();
      setAttendances(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar asistencias';
      setError(errorMessage);
      console.error('Error loading attendances:', err);
      return [];
    }
  }, []);

  /**
   * Registrar asistencia
   */
  const createAttendance = useCallback(async (data: AsistenciaFormData) => {
    try {
      const newAttendance = await employeesService.createAttendance(data);
      setAttendances(prev => [newAttendance, ...prev]);
      return { success: true, data: newAttendance };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al registrar asistencia';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Actualizar asistencia
   */
  const updateAttendance = useCallback(async (id: number, data: Partial<AsistenciaFormData>) => {
    try {
      const updatedAttendance = await employeesService.updateAttendance(id, data);
      setAttendances(prev => prev.map(a => a.idAsistencia === id ? updatedAttendance : a));
      return { success: true, data: updatedAttendance };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar asistencia';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Eliminar asistencia
   */
  const deleteAttendance = useCallback(async (id: number) => {
    try {
      await employeesService.deleteAttendance(id);
      setAttendances(prev => prev.filter(a => a.idAsistencia !== id));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar asistencia';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener asistencias del día
   */
  const getTodayAttendances = useCallback(async () => {
    try {
      const data = await employeesService.getTodayAttendances();
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener asistencias del día';
      return { success: false, error: errorMessage };
    }
  }, []);

  // ==================== ESTADÍSTICAS ====================

  /**
   * Obtener estadísticas
   */
  const getStatistics = useCallback(async (): Promise<EmployeeStatistics | null> => {
    try {
      const stats = await employeesService.getStatistics();
      return stats;
    } catch (err: any) {
      console.error('Error getting statistics:', err);
      return null;
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  return {
    // Estado
    employees,
    departments,
    positions,
    commissions,
    schedules,
    attendances,
    loading,
    error,

    // Funciones de Empleados
    loadEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    changeEmployeeStatus,
    getActiveEmployees,
    getEmployeesByDepartment,

    // Funciones de Departamentos
    loadDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,

    // Funciones de Cargos
    loadPositions,
    createPosition,
    updatePosition,
    deletePosition,

    // Funciones de Comisiones
    loadCommissions,
    createCommission,
    updateCommission,
    deleteCommission,
    getCommissionsByEmployee,

    // Funciones de Horarios
    loadSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,

    // Funciones de Asistencias
    loadAttendances,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    getTodayAttendances,

    // Estadísticas
    getStatistics,
  };
}

// Re-exportar tipos
export type {
  Empleado,
  CreateEmpleadoDTO,
  UpdateEmpleadoDTO,
  Departamento,
  DepartamentoFormData,
  Cargo,
  CargoFormData,
  Comision,
  ComisionFormData,
  Horario,
  HorarioFormData,
  Asistencia,
  AsistenciaFormData,
  EstadoEmpleado,
  EmployeeStatistics,
};