import type {
  Empleado,
  Departamento,
  Cargo,
  Comision,
  Horario,
  Asistencia,
  EstadoEmpleado,
  TipoContrato,
  TipoComision,
} from '../../services/api/employeesService';

// ==================== MAPEOS DE TIPOS ====================

/**
 * Labels para estados de empleado
 */
export const EMPLOYEE_STATUS_LABELS: Record<EstadoEmpleado, string> = {
  'Activo': 'Activo',
  'Inactivo': 'Inactivo',
  'Vacaciones': 'Vacaciones',
  'Licencia': 'Licencia',
  'Suspendido': 'Suspendido',
};

/**
 * Colores para estados de empleado
 */
export const EMPLOYEE_STATUS_COLORS: Record<EstadoEmpleado, string> = {
  'Activo': 'green',
  'Inactivo': 'gray',
  'Vacaciones': 'blue',
  'Licencia': 'orange',
  'Suspendido': 'red',
};

/**
 * Íconos para estados de empleado
 */
export const EMPLOYEE_STATUS_ICONS: Record<EstadoEmpleado, string> = {
  'Activo': '✅',
  'Inactivo': '⏸️',
  'Vacaciones': '🏖️',
  'Licencia': '📋',
  'Suspendido': '🚫',
};

/**
 * Labels para tipos de contrato
 */
export const CONTRACT_TYPE_LABELS: Record<TipoContrato, string> = {
  'Indefinido': 'Indefinido',
  'Fijo': 'Término Fijo',
  'Por_Obra': 'Por Obra',
  'Prestacion_Servicios': 'Prestación de Servicios',
  'Aprendiz': 'Aprendiz',
};

/**
 * Labels para tipos de comisión
 */
export const COMMISSION_TYPE_LABELS: Record<TipoComision, string> = {
  'Porcentaje': 'Porcentaje',
  'Monto_Fijo': 'Monto Fijo',
  'Mixta': 'Mixta',
};

/**
 * Días de la semana en español
 */
export const DAYS_OF_WEEK: Record<string, string> = {
  'Lunes': 'Lunes',
  'Martes': 'Martes',
  'Miércoles': 'Miércoles',
  'Jueves': 'Jueves',
  'Viernes': 'Viernes',
  'Sábado': 'Sábado',
  'Domingo': 'Domingo',
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
 * Formatea porcentaje
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

/**
 * Obtiene el label de un estado de empleado
 */
export function getEmployeeStatusLabel(status: EstadoEmpleado): string {
  return EMPLOYEE_STATUS_LABELS[status] || status;
}

/**
 * Obtiene el color de un estado de empleado
 */
export function getEmployeeStatusColor(status: EstadoEmpleado): string {
  return EMPLOYEE_STATUS_COLORS[status] || 'gray';
}

/**
 * Obtiene el ícono de un estado de empleado
 */
export function getEmployeeStatusIcon(status: EstadoEmpleado): string {
  return EMPLOYEE_STATUS_ICONS[status] || '👤';
}

/**
 * Obtiene el label de un tipo de contrato
 */
export function getContractTypeLabel(type: TipoContrato): string {
  return CONTRACT_TYPE_LABELS[type] || type;
}

/**
 * Obtiene el label de un tipo de comisión
 */
export function getCommissionTypeLabel(type: TipoComision): string {
  return COMMISSION_TYPE_LABELS[type] || type;
}

/**
 * Genera nombre completo de empleado
 */
export function getEmployeeFullName(empleado: Empleado): string {
  return `${empleado.nombres} ${empleado.apellidos}`;
}

/**
 * Genera iniciales de empleado
 */
export function getEmployeeInitials(empleado: Empleado): string {
  const firstInitial = empleado.nombres.charAt(0).toUpperCase();
  const lastInitial = empleado.apellidos.charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}`;
}

/**
 * Verifica si un empleado está activo
 */
export function isEmployeeActive(empleado: Empleado): boolean {
  return empleado.estadoEmpleado === 'Activo' && empleado.activo;
}

/**
 * Verifica si un empleado está disponible (no en vacaciones o licencia)
 */
export function isEmployeeAvailable(empleado: Empleado): boolean {
  return empleado.estadoEmpleado === 'Activo' && empleado.activo;
}

/**
 * Calcula la edad del empleado
 */
export function calculateAge(fechaNacimiento: string): number {
  const today = new Date();
  const birthDate = new Date(fechaNacimiento);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Calcula la antigüedad del empleado en años
 */
export function calculateSeniority(fechaContratacion: string): number {
  const today = new Date();
  const hireDate = new Date(fechaContratacion);
  let years = today.getFullYear() - hireDate.getFullYear();
  const monthDiff = today.getMonth() - hireDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < hireDate.getDate())) {
    years--;
  }
  
  return years;
}

/**
 * Formatea antigüedad en formato legible
 */
export function formatSeniority(fechaContratacion: string): string {
  const years = calculateSeniority(fechaContratacion);
  if (years === 0) return 'Menos de 1 año';
  if (years === 1) return '1 año';
  return `${years} años`;
}

/**
 * Calcula comisión basada en el tipo
 */
export function calculateCommission(comision: Comision, montoVenta: number): number {
  switch (comision.tipoComision) {
    case 'Porcentaje':
      return montoVenta * ((comision.porcentaje || 0) / 100);
    case 'Monto_Fijo':
      return comision.montoFijo || 0;
    case 'Mixta':
      const porcentajeAmount = montoVenta * ((comision.porcentaje || 0) / 100);
      const montoFijo = comision.montoFijo || 0;
      return porcentajeAmount + montoFijo;
    default:
      return 0;
  }
}

/**
 * Verifica si la comisión está activa
 */
export function isCommissionActive(comision: Comision): boolean {
  if (!comision.activa) return false;
  
  const today = new Date();
  const startDate = new Date(comision.fechaInicio);
  
  if (today < startDate) return false;
  
  if (comision.fechaFin) {
    const endDate = new Date(comision.fechaFin);
    if (today > endDate) return false;
  }
  
  return true;
}

/**
 * Calcula horas totales de un horario
 */
export function calculateScheduleHours(horaEntrada: string, horaSalida: string): number {
  const [entradaHoras, entradaMinutos] = horaEntrada.split(':').map(Number);
  const [salidaHoras, salidaMinutos] = horaSalida.split(':').map(Number);
  
  const entradaTotalMinutos = entradaHoras * 60 + entradaMinutos;
  const salidaTotalMinutos = salidaHoras * 60 + salidaMinutos;
  
  const diferenciaMinutos = salidaTotalMinutos - entradaTotalMinutos;
  return diferenciaMinutos / 60;
}

/**
 * Formatea horas trabajadas
 */
export function formatHours(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

/**
 * Calcula total de horas semanales
 */
export function calculateWeeklyHours(horarios: Horario[]): number {
  return horarios.reduce((total, horario) => {
    if (!horario.activo) return total;
    const hours = calculateScheduleHours(horario.horaEntrada, horario.horaSalida);
    return total + hours;
  }, 0);
}

/**
 * Verifica si un horario está en conflicto con otro
 */
export function hasScheduleConflict(horario1: Horario, horario2: Horario): boolean {
  if (horario1.diaSemana !== horario2.diaSemana) return false;
  if (!horario1.activo || !horario2.activo) return false;
  
  const h1Start = horario1.horaEntrada;
  const h1End = horario1.horaSalida;
  const h2Start = horario2.horaEntrada;
  const h2End = horario2.horaSalida;
  
  return !(h1End <= h2Start || h2End <= h1Start);
}

/**
 * Filtra empleados por estado
 */
export function filterEmployeesByStatus(employees: Empleado[], status: EstadoEmpleado): Empleado[] {
  return employees.filter(e => e.estadoEmpleado === status);
}

/**
 * Filtra empleados activos
 */
export function filterActiveEmployees(employees: Empleado[]): Empleado[] {
  return employees.filter(isEmployeeActive);
}

/**
 * Filtra empleados por departamento
 */
export function filterEmployeesByDepartment(employees: Empleado[], idDepartamento: number): Empleado[] {
  return employees.filter(e => e.idDepartamento === idDepartamento);
}

/**
 * Filtra empleados por cargo
 */
export function filterEmployeesByPosition(employees: Empleado[], idCargo: number): Empleado[] {
  return employees.filter(e => e.idCargo === idCargo);
}

/**
 * Filtra comisiones activas
 */
export function filterActiveCommissions(commissions: Comision[]): Comision[] {
  return commissions.filter(isCommissionActive);
}

/**
 * Ordena empleados por nombre
 */
export function sortEmployeesByName(employees: Empleado[]): Empleado[] {
  return [...employees].sort((a, b) => {
    const nameA = getEmployeeFullName(a);
    const nameB = getEmployeeFullName(b);
    return nameA.localeCompare(nameB);
  });
}

/**
 * Ordena empleados por antigüedad
 */
export function sortEmployeesBySeniority(employees: Empleado[], ascending: boolean = false): Empleado[] {
  return [...employees].sort((a, b) => {
    const dateA = new Date(a.fechaContratacion).getTime();
    const dateB = new Date(b.fechaContratacion).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
}

/**
 * Ordena empleados por salario
 */
export function sortEmployeesBySalary(employees: Empleado[], ascending: boolean = false): Empleado[] {
  return [...employees].sort((a, b) => {
    return ascending ? a.salarioBase - b.salarioBase : b.salarioBase - a.salarioBase;
  });
}

/**
 * Agrupa empleados por departamento
 */
export function groupEmployeesByDepartment(employees: Empleado[]): Record<string, Empleado[]> {
  const grouped: Record<string, Empleado[]> = {};
  
  employees.forEach(employee => {
    const deptName = employee.nombreDepartamento || 'Sin departamento';
    if (!grouped[deptName]) {
      grouped[deptName] = [];
    }
    grouped[deptName].push(employee);
  });
  
  return grouped;
}

/**
 * Agrupa empleados por cargo
 */
export function groupEmployeesByPosition(employees: Empleado[]): Record<string, Empleado[]> {
  const grouped: Record<string, Empleado[]> = {};
  
  employees.forEach(employee => {
    const positionName = employee.nombreCargo || 'Sin cargo';
    if (!grouped[positionName]) {
      grouped[positionName] = [];
    }
    grouped[positionName].push(employee);
  });
  
  return grouped;
}

/**
 * Agrupa empleados por estado
 */
export function groupEmployeesByStatus(employees: Empleado[]): Record<EstadoEmpleado, Empleado[]> {
  const grouped: Partial<Record<EstadoEmpleado, Empleado[]>> = {};
  
  employees.forEach(employee => {
    if (!grouped[employee.estadoEmpleado]) {
      grouped[employee.estadoEmpleado] = [];
    }
    grouped[employee.estadoEmpleado]!.push(employee);
  });
  
  return grouped as Record<EstadoEmpleado, Empleado[]>;
}

/**
 * Calcula estadísticas de empleados
 */
export function calculateEmployeeStats(employees: Empleado[]): {
  total: number;
  activos: number;
  inactivos: number;
  vacaciones: number;
  promedioSalario: number;
  nominaTotal: number;
  porEstado: Record<EstadoEmpleado, number>;
} {
  const stats = {
    total: employees.length,
    activos: employees.filter(e => e.estadoEmpleado === 'Activo').length,
    inactivos: employees.filter(e => e.estadoEmpleado === 'Inactivo').length,
    vacaciones: employees.filter(e => e.estadoEmpleado === 'Vacaciones').length,
    promedioSalario: 0,
    nominaTotal: 0,
    porEstado: {} as Record<EstadoEmpleado, number>,
  };

  // Calcular nómina total y promedio
  const totalSalarios = employees.reduce((sum, e) => sum + e.salarioBase, 0);
  stats.nominaTotal = totalSalarios;
  stats.promedioSalario = employees.length > 0 ? totalSalarios / employees.length : 0;

  // Contar por estado
  employees.forEach(employee => {
    stats.porEstado[employee.estadoEmpleado] = (stats.porEstado[employee.estadoEmpleado] || 0) + 1;
  });

  return stats;
}

/**
 * Valida si el salario está dentro del rango del cargo
 */
export function isSalaryInRange(salario: number, cargo: Cargo): boolean {
  return salario >= cargo.salarioMinimo && salario <= cargo.salarioMaximo;
}

/**
 * Sugiere salario basado en el cargo
 */
export function suggestSalary(cargo: Cargo): number {
  // Sugiere el punto medio del rango
  return Math.round((cargo.salarioMinimo + cargo.salarioMaximo) / 2);
}

/**
 * Valida email
 */
export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida número de documento
 */
export function validateDocument(documento: string): boolean {
  // Mínimo 6 caracteres
  return documento.length >= 6;
}

/**
 * Genera color de avatar basado en el nombre
 */
export function generateAvatarColor(name: string): string {
  const colors = [
    '#3A7AFE', // Azul primario
    '#10B981', // Verde
    '#F59E0B', // Naranja
    '#8B5CF6', // Púrpura
    '#EC4899', // Rosa
    '#06B6D4', // Cyan
  ];
  
  const charCode = name.charCodeAt(0);
  const index = charCode % colors.length;
  return colors[index];
}

/**
 * Formatea descripción de horario
 */
export function formatScheduleDescription(horario: Horario): string {
  return `${horario.diaSemana}: ${formatTime(horario.horaEntrada)} - ${formatTime(horario.horaSalida)}`;
}

/**
 * Calcula total de días trabajados en asistencias
 */
export function calculateWorkDays(asistencias: Asistencia[]): number {
  return asistencias.length;
}

/**
 * Calcula total de horas trabajadas en asistencias
 */
export function calculateTotalHours(asistencias: Asistencia[]): number {
  return asistencias.reduce((total, a) => total + (a.horasTrabajadas || 0), 0);
}

/**
 * Verifica si el empleado cumple años pronto (30 días)
 */
export function hasBirthdaySoon(empleado: Empleado): boolean {
  if (!empleado.fechaNacimiento) return false;
  
  const today = new Date();
  const birthDate = new Date(empleado.fechaNacimiento);
  
  // Establecer el cumpleaños de este año
  const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  
  // Si ya pasó, calcular para el próximo año
  if (thisYearBirthday < today) {
    thisYearBirthday.setFullYear(today.getFullYear() + 1);
  }
  
  const daysUntilBirthday = Math.floor((thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  return daysUntilBirthday >= 0 && daysUntilBirthday <= 30;
}
