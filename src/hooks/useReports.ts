import { useState, useCallback } from 'react';
import reportsService from '../services/api/reportsService';
import type {
  DashboardMetrics,
  SalesReport,
  ClientAnalytics,
  FinancialReport,
  ReservationStats,
  ProductPerformance,
  EmployeePerformance,
  KPIData,
  DateRange,
  ExportOptions,
} from '../services/api/reportsService';

/**
 * Hook personalizado para gestión de reportes
 * Integra reportsService con React state management
 * 
 * @returns Funciones y estado para gestionar reportes
 */
export function useReports() {
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);
  const [salesReports, setSalesReports] = useState<SalesReport[]>([]);
  const [clientAnalytics, setClientAnalytics] = useState<ClientAnalytics | null>(null);
  const [financialReport, setFinancialReport] = useState<FinancialReport | null>(null);
  const [reservationStats, setReservationStats] = useState<ReservationStats | null>(null);
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([]);
  const [employeePerformance, setEmployeePerformance] = useState<EmployeePerformance[]>([]);
  const [kpis, setKpis] = useState<KPIData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ==================== DASHBOARD ====================

  /**
   * Cargar métricas del dashboard
   */
  const loadDashboardMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportsService.getDashboardMetrics();
      setDashboardMetrics(data);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar métricas';
      setError(errorMessage);
      // API no disponible - silenciar error si es Network Error
      if (err.message !== 'Network Error') {
        console.error('Error loading dashboard metrics:', err);
      }
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener métricas por rango de fechas
   */
  const getMetricsByDateRange = useCallback(async (dateRange: DateRange) => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportsService.getMetricsByDateRange(dateRange);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener métricas';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== VENTAS ====================

  /**
   * Cargar reporte de ventas
   */
  const loadSalesReport = useCallback(async (dateRange?: DateRange) => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportsService.getSalesReport(dateRange);
      setSalesReports(data);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar reporte de ventas';
      setError(errorMessage);
      console.error('Error loading sales report:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener ventas diarias
   */
  const getDailySales = useCallback(async (mes: number, anio: number) => {
    try {
      setLoading(true);
      const data = await reportsService.getDailySales(mes, anio);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener ventas diarias';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener ventas mensuales
   */
  const getMonthlySales = useCallback(async (anio: number) => {
    try {
      setLoading(true);
      const data = await reportsService.getMonthlySales(anio);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener ventas mensuales';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener comparativa de ventas
   */
  const getSalesComparison = useCallback(async (anio1: number, anio2: number) => {
    try {
      setLoading(true);
      const data = await reportsService.getSalesComparison(anio1, anio2);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al comparar ventas';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== CLIENTES ====================

  /**
   * Cargar analytics de clientes
   */
  const loadClientAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportsService.getClientAnalytics();
      setClientAnalytics(data);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar analytics';
      setError(errorMessage);
      console.error('Error loading client analytics:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener top clientes
   */
  const getTopClients = useCallback(async (limit: number = 10) => {
    try {
      const data = await reportsService.getTopClients(limit);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener top clientes';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener clientes nuevos por mes
   */
  const getNewClientsByMonth = useCallback(async (anio: number) => {
    try {
      const data = await reportsService.getNewClientsByMonth(anio);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener clientes nuevos';
      return { success: false, error: errorMessage };
    }
  }, []);

  // ==================== FINANCIERO ====================

  /**
   * Cargar reporte financiero
   */
  const loadFinancialReport = useCallback(async (dateRange?: DateRange) => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportsService.getFinancialReport(dateRange);
      setFinancialReport(data);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar reporte financiero';
      setError(errorMessage);
      console.error('Error loading financial report:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener flujo de caja
   */
  const getCashFlow = useCallback(async (mes: number, anio: number) => {
    try {
      const data = await reportsService.getCashFlow(mes, anio);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener flujo de caja';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener estado de resultados
   */
  const getIncomeStatement = useCallback(async (mes: number, anio: number) => {
    try {
      const data = await reportsService.getIncomeStatement(mes, anio);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener estado de resultados';
      return { success: false, error: errorMessage };
    }
  }, []);

  // ==================== RESERVAS ====================

  /**
   * Cargar estadísticas de reservas
   */
  const loadReservationStats = useCallback(async (dateRange?: DateRange) => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportsService.getReservationStats(dateRange);
      setReservationStats(data);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar estadísticas';
      setError(errorMessage);
      console.error('Error loading reservation stats:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener tasa de ocupación
   */
  const getOccupancyRate = useCallback(async (mes: number, anio: number) => {
    try {
      const data = await reportsService.getOccupancyRate(mes, anio);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener tasa de ocupación';
      return { success: false, error: errorMessage };
    }
  }, []);

  // ==================== PRODUCTOS ====================

  /**
   * Cargar desempeño de productos
   */
  const loadProductPerformance = useCallback(async (dateRange?: DateRange) => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportsService.getProductPerformance(dateRange);
      setProductPerformance(data);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar desempeño';
      setError(errorMessage);
      console.error('Error loading product performance:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener productos más vendidos
   */
  const getTopProducts = useCallback(async (limit: number = 10) => {
    try {
      const data = await reportsService.getTopProducts(limit);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener top productos';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener productos por categoría
   */
  const getProductsByCategory = useCallback(async () => {
    try {
      const data = await reportsService.getProductsByCategory();
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener productos por categoría';
      return { success: false, error: errorMessage };
    }
  }, []);

  // ==================== EMPLEADOS ====================

  /**
   * Cargar desempeño de empleados
   */
  const loadEmployeePerformance = useCallback(async (dateRange?: DateRange) => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportsService.getEmployeePerformance(dateRange);
      setEmployeePerformance(data);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar desempeño';
      setError(errorMessage);
      console.error('Error loading employee performance:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener top empleados
   */
  const getTopEmployees = useCallback(async (limit: number = 10) => {
    try {
      const data = await reportsService.getTopEmployees(limit);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener top empleados';
      return { success: false, error: errorMessage };
    }
  }, []);

  // ==================== KPIs ====================

  /**
   * Cargar KPIs del negocio
   */
  const loadBusinessKPIs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportsService.getBusinessKPIs();
      setKpis(data);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar KPIs';
      setError(errorMessage);
      // API no disponible - silenciar error si es Network Error
      if (err.message !== 'Network Error') {
        console.error('Error loading KPIs:', err);
      }
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Actualizar objetivo de KPI
   */
  const updateKPIGoal = useCallback(async (nombre: string, objetivo: number) => {
    try {
      const data = await reportsService.updateKPIGoal(nombre, objetivo);
      setKpis(prev => prev.map(k => k.nombre === nombre ? data : k));
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar KPI';
      return { success: false, error: errorMessage };
    }
  }, []);

  // ==================== EXPORTACIÓN ====================

  /**
   * Exportar reporte
   */
  const exportReport = useCallback(async (
    tipo: 'ventas' | 'financiero' | 'clientes' | 'dashboard',
    options: ExportOptions,
    dateRange?: DateRange
  ) => {
    try {
      let blob: Blob;
      
      switch (tipo) {
        case 'ventas':
          if (!dateRange) throw new Error('Se requiere rango de fechas para ventas');
          blob = await reportsService.exportSalesReport(dateRange, options);
          break;
        case 'financiero':
          if (!dateRange) throw new Error('Se requiere rango de fechas para financiero');
          blob = await reportsService.exportFinancialReport(dateRange, options);
          break;
        case 'clientes':
          blob = await reportsService.exportClientReport(options);
          break;
        case 'dashboard':
          blob = await reportsService.exportDashboard(options);
          break;
        default:
          throw new Error('Tipo de reporte no válido');
      }

      // Crear y descargar archivo
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_${tipo}_${new Date().toISOString().split('T')[0]}.${options.formato.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al exportar reporte';
      return { success: false, error: errorMessage };
    }
  }, []);

  // ==================== ANÁLISIS AVANZADO ====================

  /**
   * Obtener análisis de tendencias
   */
  const getTrendAnalysis = useCallback(async (metrica: string, periodo: number) => {
    try {
      const data = await reportsService.getTrendAnalysis(metrica, periodo);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al analizar tendencias';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener pronóstico de ventas
   */
  const getSalesForecast = useCallback(async (meses: number) => {
    try {
      const data = await reportsService.getSalesForecast(meses);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener pronóstico';
      return { success: false, error: errorMessage };
    }
  }, []);

  return {
    // Estado
    dashboardMetrics,
    salesReports,
    clientAnalytics,
    financialReport,
    reservationStats,
    productPerformance,
    employeePerformance,
    kpis,
    loading,
    error,

    // Dashboard
    loadDashboardMetrics,
    getMetricsByDateRange,

    // Ventas
    loadSalesReport,
    getDailySales,
    getMonthlySales,
    getSalesComparison,

    // Clientes
    loadClientAnalytics,
    getTopClients,
    getNewClientsByMonth,

    // Financiero
    loadFinancialReport,
    getCashFlow,
    getIncomeStatement,

    // Reservas
    loadReservationStats,
    getOccupancyRate,

    // Productos
    loadProductPerformance,
    getTopProducts,
    getProductsByCategory,

    // Empleados
    loadEmployeePerformance,
    getTopEmployees,

    // KPIs
    loadBusinessKPIs,
    updateKPIGoal,

    // Exportación
    exportReport,

    // Análisis Avanzado
    getTrendAnalysis,
    getSalesForecast,
  };
}

// Re-exportar tipos
export type {
  DashboardMetrics,
  SalesReport,
  ClientAnalytics,
  FinancialReport,
  ReservationStats,
  ProductPerformance,
  EmployeePerformance,
  KPIData,
  DateRange,
  ExportOptions,
};