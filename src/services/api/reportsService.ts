/**
 * ⚠️ SERVICIO - MODIFICADO PARA USAR SOLO API REAL
 *
 * Se eliminó el fallback a datos mock.
 * Ahora usa únicamente la API real del backend.
 *
 * Fecha de modificación: 2025-12-16
 * Razón: Pruebas de integración con API real G2rismBeta.API
 */

import axiosInstance from './axiosInstance';

// ==================== TIPOS ====================

export interface DashboardMetrics {
  ventasTotales: number;
  ventasMes: number;
  reservasActivas: number;
  clientesNuevos: number;
  ingresosTotales: number;
  ingresosMes: number;
  ticketPromedio: number;
  tasaConversion: number;
}

export interface SalesReport {
  fecha: string;
  totalVentas: number;
  cantidadVentas: number;
  ingresos: number;
  ticketPromedio: number;
}

export interface ClientAnalytics {
  totalClientes: number;
  clientesActivos: number;
  clientesVIP: number;
  clientesCorporativos: number;
  clientesPorMes: Array<{ mes: string; cantidad: number }>;
  topClientes: Array<{
    idCliente: number;
    nombre: string;
    totalCompras: number;
    totalGastado: number;
  }>;
}

export interface FinancialReport {
  ingresosTotales: number;
  gastosTotales: number;
  utilidadNeta: number;
  margenUtilidad: number;
  ingresosPorCategoria: Array<{ categoria: string; monto: number }>;
  gastosPorCategoria: Array<{ categoria: string; monto: number }>;
}

export interface ReservationStats {
  totalReservas: number;
  reservasConfirmadas: number;
  reservasPendientes: number;
  reservasCanceladas: number;
  reservasPorEstado: Array<{ estado: string; cantidad: number }>;
  reservasPorMes: Array<{ mes: string; cantidad: number }>;
}

export interface ProductPerformance {
  idPaquete: number;
  nombrePaquete: string;
  totalVendido: number;
  ingresos: number;
  margen: number;
}

export interface EmployeePerformance {
  idEmpleado: number;
  nombreEmpleado: string;
  ventasRealizadas: number;
  ingresos: number;
  comisionesGeneradas: number;
}

export interface KPIData {
  nombre: string;
  valor: number;
  objetivo: number;
  porcentajeCumplimiento: number;
  tendencia: 'up' | 'down' | 'stable';
}

export interface DateRange {
  fechaInicio: string;
  fechaFin: string;
}

export interface ExportOptions {
  formato: 'PDF' | 'Excel' | 'CSV';
  incluirGraficos?: boolean;
  incluirDetalles?: boolean;
}

/**
 * Servicio para gestión de reportes y analytics
 *
 * @description
 * Maneja todas las operaciones de reportes, estadísticas,
 * KPIs y exportación de datos.
 *
 * @author G2rism Team
 * @version 1.0
 */
class ReportsService {
  private readonly baseUrl = '/reportes';

  // ==================== DASHBOARD ====================

  /**
   * Obtener métricas del dashboard
   */
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const response = await axiosInstance.get(`${this.baseUrl}/dashboard`);
    return response.data.data;
  }

  /**
   * Obtener métricas por rango de fechas
   */
  async getMetricsByDateRange(dateRange: DateRange): Promise<DashboardMetrics> {
    const response = await axiosInstance.post(`${this.baseUrl}/dashboard/rango`, dateRange);
    return response.data.data;
  }

  // ==================== VENTAS ====================

  /**
   * Obtener reporte de ventas
   */
  async getSalesReport(dateRange?: DateRange): Promise<SalesReport[]> {
    const url = dateRange
      ? `${this.baseUrl}/ventas?fechaInicio=${dateRange.fechaInicio}&fechaFin=${dateRange.fechaFin}`
      : `${this.baseUrl}/ventas`;
    const response = await axiosInstance.get(url);
    return response.data.data;
  }

  /**
   * Obtener ventas diarias
   */
  async getDailySales(mes: number, anio: number): Promise<SalesReport[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/ventas/diarias?mes=${mes}&anio=${anio}`);
    return response.data.data;
  }

  /**
   * Obtener ventas mensuales
   */
  async getMonthlySales(anio: number): Promise<SalesReport[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/ventas/mensuales?anio=${anio}`);
    return response.data.data;
  }

  /**
   * Obtener comparativa de ventas
   */
  async getSalesComparison(anio1: number, anio2: number): Promise<{
    anio1: SalesReport[];
    anio2: SalesReport[];
  }> {
    const response = await axiosInstance.get(
      `${this.baseUrl}/ventas/comparativa?anio1=${anio1}&anio2=${anio2}`
    );
    return response.data.data;
  }

  // ==================== CLIENTES ====================

  /**
   * Obtener analytics de clientes
   */
  async getClientAnalytics(): Promise<ClientAnalytics> {
    const response = await axiosInstance.get(`${this.baseUrl}/clientes/analytics`);
    return response.data.data;
  }

  /**
   * Obtener top clientes
   */
  async getTopClients(limit: number = 10): Promise<ClientAnalytics['topClientes']> {
    const response = await axiosInstance.get(`${this.baseUrl}/clientes/top?limit=${limit}`);
    return response.data.data;
  }

  /**
   * Obtener clientes nuevos por mes
   */
  async getNewClientsByMonth(anio: number): Promise<Array<{ mes: string; cantidad: number }>> {
    const response = await axiosInstance.get(`${this.baseUrl}/clientes/nuevos?anio=${anio}`);
    return response.data.data;
  }

  // ==================== FINANCIERO ====================

  /**
   * Obtener reporte financiero
   */
  async getFinancialReport(dateRange?: DateRange): Promise<FinancialReport> {
    const url = dateRange
      ? `${this.baseUrl}/financiero?fechaInicio=${dateRange.fechaInicio}&fechaFin=${dateRange.fechaFin}`
      : `${this.baseUrl}/financiero`;
    const response = await axiosInstance.get(url);
    return response.data.data;
  }

  /**
   * Obtener flujo de caja
   */
  async getCashFlow(mes: number, anio: number): Promise<{
    ingresos: Array<{ fecha: string; monto: number }>;
    gastos: Array<{ fecha: string; monto: number }>;
  }> {
    const response = await axiosInstance.get(`${this.baseUrl}/flujo-caja?mes=${mes}&anio=${anio}`);
    return response.data.data;
  }

  /**
   * Obtener estado de resultados
   */
  async getIncomeStatement(mes: number, anio: number): Promise<{
    ingresos: number;
    costos: number;
    gastosOperacionales: number;
    utilidadOperacional: number;
    utilidadNeta: number;
  }> {
    const response = await axiosInstance.get(
      `${this.baseUrl}/estado-resultados?mes=${mes}&anio=${anio}`
    );
    return response.data.data;
  }

  // ==================== RESERVAS ====================

  /**
   * Obtener estadísticas de reservas
   */
  async getReservationStats(dateRange?: DateRange): Promise<ReservationStats> {
    const url = dateRange
      ? `${this.baseUrl}/reservas?fechaInicio=${dateRange.fechaInicio}&fechaFin=${dateRange.fechaFin}`
      : `${this.baseUrl}/reservas`;
    const response = await axiosInstance.get(url);
    return response.data.data;
  }

  /**
   * Obtener tasa de ocupación
   */
  async getOccupancyRate(mes: number, anio: number): Promise<{
    tasaOcupacion: number;
    reservasConfirmadas: number;
    capacidadTotal: number;
  }> {
    const response = await axiosInstance.get(
      `${this.baseUrl}/reservas/ocupacion?mes=${mes}&anio=${anio}`
    );
    return response.data.data;
  }

  // ==================== PRODUCTOS ====================

  /**
   * Obtener desempeño de productos
   */
  async getProductPerformance(dateRange?: DateRange): Promise<ProductPerformance[]> {
    const url = dateRange
      ? `${this.baseUrl}/productos?fechaInicio=${dateRange.fechaInicio}&fechaFin=${dateRange.fechaFin}`
      : `${this.baseUrl}/productos`;
    const response = await axiosInstance.get(url);
    return response.data.data;
  }

  /**
   * Obtener productos más vendidos
   */
  async getTopProducts(limit: number = 10): Promise<ProductPerformance[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/productos/top?limit=${limit}`);
    return response.data.data;
  }

  /**
   * Obtener productos por categoría
   */
  async getProductsByCategory(): Promise<Array<{
    categoria: string;
    cantidad: number;
    ingresos: number;
  }>> {
    const response = await axiosInstance.get(`${this.baseUrl}/productos/por-categoria`);
    return response.data.data;
  }

  // ==================== EMPLEADOS ====================

  /**
   * Obtener desempeño de empleados
   */
  async getEmployeePerformance(dateRange?: DateRange): Promise<EmployeePerformance[]> {
    const url = dateRange
      ? `${this.baseUrl}/empleados?fechaInicio=${dateRange.fechaInicio}&fechaFin=${dateRange.fechaFin}`
      : `${this.baseUrl}/empleados`;
    const response = await axiosInstance.get(url);
    return response.data.data;
  }

  /**
   * Obtener top empleados
   */
  async getTopEmployees(limit: number = 10): Promise<EmployeePerformance[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/empleados/top?limit=${limit}`);
    return response.data.data;
  }

  // ==================== KPIs ====================

  /**
   * Obtener KPIs del negocio
   */
  async getBusinessKPIs(): Promise<KPIData[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/kpis`);
    return response.data.data;
  }

  /**
   * Obtener KPI específico
   */
  async getKPIByName(nombre: string): Promise<KPIData> {
    const response = await axiosInstance.get(`${this.baseUrl}/kpis/${nombre}`);
    return response.data.data;
  }

  /**
   * Actualizar objetivo de KPI
   */
  async updateKPIGoal(nombre: string, objetivo: number): Promise<KPIData> {
    const response = await axiosInstance.put(`${this.baseUrl}/kpis/${nombre}/objetivo`, { objetivo });
    return response.data.data;
  }

  // ==================== EXPORTACIÓN ====================

  /**
   * Exportar reporte de ventas
   */
  async exportSalesReport(dateRange: DateRange, options: ExportOptions): Promise<Blob> {
    const response = await axiosInstance.post(
      `${this.baseUrl}/exportar/ventas`,
      { dateRange, options },
      { responseType: 'blob' }
    );
    return response.data;
  }

  /**
   * Exportar reporte financiero
   */
  async exportFinancialReport(dateRange: DateRange, options: ExportOptions): Promise<Blob> {
    const response = await axiosInstance.post(
      `${this.baseUrl}/exportar/financiero`,
      { dateRange, options },
      { responseType: 'blob' }
    );
    return response.data;
  }

  /**
   * Exportar reporte de clientes
   */
  async exportClientReport(options: ExportOptions): Promise<Blob> {
    const response = await axiosInstance.post(
      `${this.baseUrl}/exportar/clientes`,
      { options },
      { responseType: 'blob' }
    );
    return response.data;
  }

  /**
   * Exportar dashboard completo
   */
  async exportDashboard(options: ExportOptions): Promise<Blob> {
    const response = await axiosInstance.post(
      `${this.baseUrl}/exportar/dashboard`,
      { options },
      { responseType: 'blob' }
    );
    return response.data;
  }

  // ==================== ANÁLISIS AVANZADO ====================

  /**
   * Obtener análisis de tendencias
   */
  async getTrendAnalysis(metrica: string, periodo: number): Promise<{
    tendencia: 'up' | 'down' | 'stable';
    porcentajeCambio: number;
    prediccion: number[];
  }> {
    const response = await axiosInstance.get(
      `${this.baseUrl}/analisis/tendencias?metrica=${metrica}&periodo=${periodo}`
    );
    return response.data.data;
  }

  /**
   * Obtener pronóstico de ventas
   */
  async getSalesForecast(meses: number): Promise<Array<{
    mes: string;
    ventasEstimadas: number;
    confianza: number;
  }>> {
    const response = await axiosInstance.get(`${this.baseUrl}/analisis/pronostico?meses=${meses}`);
    return response.data.data;
  }

  /**
   * Obtener análisis de correlación
   */
  async getCorrelationAnalysis(variable1: string, variable2: string): Promise<{
    correlacion: number;
    significancia: number;
  }> {
    const response = await axiosInstance.get(
      `${this.baseUrl}/analisis/correlacion?v1=${variable1}&v2=${variable2}`
    );
    return response.data.data;
  }
}

// Exportar instancia única (singleton)
const reportsService = new ReportsService();
export default reportsService;