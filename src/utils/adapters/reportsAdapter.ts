import type {
  DashboardMetrics,
  SalesReport,
  KPIData,
} from '../../services/api/reportsService';

// ==================== FORMATEADORES ====================

/**
 * Formatea un número como moneda COP
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
 * Formatea un número como porcentaje
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formatea un número grande con separadores
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-CO').format(value);
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
 * Formatea una fecha larga
 */
export function formatDateLong(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formatea un mes
 */
export function formatMonth(mes: number, anio: number): string {
  const date = new Date(anio, mes - 1, 1);
  return date.toLocaleDateString('es-CO', {
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Formatea número con sufijo (K, M, B)
 */
export function formatCompactNumber(value: number): string {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

// ==================== CÁLCULOS ====================

/**
 * Calcula el cambio porcentual entre dos valores
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Calcula el promedio de un array de números
 */
export function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

/**
 * Calcula la mediana de un array de números
 */
export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  return sorted[middle];
}

/**
 * Calcula la desviación estándar
 */
export function calculateStandardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  const avg = calculateAverage(values);
  const squaredDiffs = values.map(value => Math.pow(value - avg, 2));
  const avgSquaredDiff = calculateAverage(squaredDiffs);
  return Math.sqrt(avgSquaredDiff);
}

/**
 * Calcula el total de un array de valores
 */
export function calculateTotal(values: number[]): number {
  return values.reduce((sum, val) => sum + val, 0);
}

/**
 * Calcula el crecimiento compuesto anual (CAGR)
 */
export function calculateCAGR(beginValue: number, endValue: number, years: number): number {
  if (beginValue === 0 || years === 0) return 0;
  return (Math.pow(endValue / beginValue, 1 / years) - 1) * 100;
}

/**
 * Calcula el ticket promedio
 */
export function calculateAverageTicket(totalIngresos: number, totalVentas: number): number {
  if (totalVentas === 0) return 0;
  return totalIngresos / totalVentas;
}

/**
 * Calcula la tasa de conversión
 */
export function calculateConversionRate(conversiones: number, total: number): number {
  if (total === 0) return 0;
  return (conversiones / total) * 100;
}

/**
 * Calcula el margen de utilidad
 */
export function calculateProfitMargin(utilidad: number, ingresos: number): number {
  if (ingresos === 0) return 0;
  return (utilidad / ingresos) * 100;
}

/**
 * Calcula el ROI (Return on Investment)
 */
export function calculateROI(ganancia: number, inversion: number): number {
  if (inversion === 0) return 0;
  return ((ganancia - inversion) / inversion) * 100;
}

// ==================== TENDENCIAS ====================

/**
 * Determina la tendencia de una serie de valores
 */
export function detectTrend(values: number[]): 'up' | 'down' | 'stable' {
  if (values.length < 2) return 'stable';
  
  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));
  
  const avgFirst = calculateAverage(firstHalf);
  const avgSecond = calculateAverage(secondHalf);
  
  const change = calculatePercentageChange(avgSecond, avgFirst);
  
  if (change > 5) return 'up';
  if (change < -5) return 'down';
  return 'stable';
}

/**
 * Calcula la tendencia lineal (regresión lineal simple)
 */
export function calculateLinearTrend(values: number[]): {
  slope: number;
  intercept: number;
  trend: 'up' | 'down' | 'stable';
} {
  const n = values.length;
  if (n < 2) return { slope: 0, intercept: 0, trend: 'stable' };
  
  const x = Array.from({ length: n }, (_, i) => i);
  const sumX = calculateTotal(x);
  const sumY = calculateTotal(values);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (slope > 0.05) trend = 'up';
  else if (slope < -0.05) trend = 'down';
  
  return { slope, intercept, trend };
}

/**
 * Predice valores futuros usando regresión lineal
 */
export function predictFutureValues(values: number[], periods: number): number[] {
  const { slope, intercept } = calculateLinearTrend(values);
  const n = values.length;
  
  return Array.from({ length: periods }, (_, i) => {
    return slope * (n + i) + intercept;
  });
}

// ==================== KPI HELPERS ====================

/**
 * Obtiene el color de un KPI según su cumplimiento
 */
export function getKPIColor(porcentajeCumplimiento: number): string {
  if (porcentajeCumplimiento >= 100) return '#10B981'; // Verde
  if (porcentajeCumplimiento >= 80) return '#F59E0B'; // Amarillo
  if (porcentajeCumplimiento >= 60) return '#EF4444'; // Rojo
  return '#6B7280'; // Gris
}

/**
 * Obtiene el estado de un KPI
 */
export function getKPIStatus(porcentajeCumplimiento: number): 'excellent' | 'good' | 'warning' | 'critical' {
  if (porcentajeCumplimiento >= 100) return 'excellent';
  if (porcentajeCumplimiento >= 80) return 'good';
  if (porcentajeCumplimiento >= 60) return 'warning';
  return 'critical';
}

/**
 * Obtiene el ícono de tendencia
 */
export function getTrendIcon(tendencia: 'up' | 'down' | 'stable'): string {
  const icons = {
    up: '📈',
    down: '📉',
    stable: '➡️',
  };
  return icons[tendencia];
}

/**
 * Obtiene el color de tendencia
 */
export function getTrendColor(tendencia: 'up' | 'down' | 'stable', isPositive: boolean = true): string {
  if (tendencia === 'stable') return '#6B7280';
  if (isPositive) {
    return tendencia === 'up' ? '#10B981' : '#EF4444';
  } else {
    return tendencia === 'down' ? '#10B981' : '#EF4444';
  }
}

// ==================== TRANSFORMADORES DE DATOS ====================

/**
 * Transforma datos para gráficos de línea
 */
export function transformToLineChartData(
  data: SalesReport[],
  xKey: keyof SalesReport,
  yKey: keyof SalesReport
): Array<{ name: string; value: number }> {
  return data.map(item => ({
    name: String(item[xKey]),
    value: Number(item[yKey]),
  }));
}

/**
 * Transforma datos para gráficos de barras
 */
export function transformToBarChartData(
  data: any[],
  labelKey: string,
  valueKey: string
): Array<{ name: string; value: number }> {
  return data.map(item => ({
    name: String(item[labelKey]),
    value: Number(item[valueKey]),
  }));
}

/**
 * Transforma datos para gráficos circulares
 */
export function transformToPieChartData(
  data: any[],
  labelKey: string,
  valueKey: string
): Array<{ name: string; value: number; percentage: number }> {
  const total = data.reduce((sum, item) => sum + Number(item[valueKey]), 0);
  
  return data.map(item => {
    const value = Number(item[valueKey]);
    return {
      name: String(item[labelKey]),
      value,
      percentage: total > 0 ? (value / total) * 100 : 0,
    };
  });
}

/**
 * Agrupa datos por período
 */
export function groupByPeriod(
  data: any[],
  dateKey: string,
  period: 'day' | 'week' | 'month' | 'year'
): Record<string, any[]> {
  const grouped: Record<string, any[]> = {};
  
  data.forEach(item => {
    const date = new Date(item[dateKey]);
    let key: string;
    
    switch (period) {
      case 'day':
        key = date.toISOString().split('T')[0];
        break;
      case 'week':
        const weekNum = Math.ceil((date.getDate() + date.getDay()) / 7);
        key = `${date.getFullYear()}-W${weekNum}`;
        break;
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'year':
        key = String(date.getFullYear());
        break;
    }
    
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  });
  
  return grouped;
}

// ==================== FILTROS ====================

/**
 * Filtra datos por rango de fechas
 */
export function filterByDateRange(
  data: any[],
  dateKey: string,
  startDate: string,
  endDate: string
): any[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return data.filter(item => {
    const date = new Date(item[dateKey]);
    return date >= start && date <= end;
  });
}

/**
 * Filtra top N elementos
 */
export function filterTopN<T>(data: T[], n: number, valueKey: keyof T): T[] {
  return [...data]
    .sort((a, b) => Number(b[valueKey]) - Number(a[valueKey]))
    .slice(0, n);
}

/**
 * Filtra elementos por umbral
 */
export function filterByThreshold<T>(
  data: T[],
  valueKey: keyof T,
  threshold: number,
  operator: '>' | '>=' | '<' | '<=' | '=' = '>='
): T[] {
  return data.filter(item => {
    const value = Number(item[valueKey]);
    switch (operator) {
      case '>': return value > threshold;
      case '>=': return value >= threshold;
      case '<': return value < threshold;
      case '<=': return value <= threshold;
      case '=': return value === threshold;
      default: return false;
    }
  });
}

// ==================== EXPORTACIÓN ====================

/**
 * Convierte datos a CSV
 */
export function convertToCSV(data: any[], headers?: string[]): string {
  if (data.length === 0) return '';
  
  const keys = headers || Object.keys(data[0]);
  const headerRow = keys.join(',');
  
  const rows = data.map(item => 
    keys.map(key => {
      const value = item[key];
      // Escapar comillas y comas
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );
  
  return [headerRow, ...rows].join('\n');
}

/**
 * Descarga un archivo
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Exporta datos a CSV
 */
export function exportToCSV(data: any[], filename: string, headers?: string[]) {
  const csv = convertToCSV(data, headers);
  downloadFile(csv, filename, 'text/csv');
}

// ==================== COMPARACIONES ====================

/**
 * Compara dos períodos
 */
export function comparePeriods(
  current: number[],
  previous: number[]
): {
  currentTotal: number;
  previousTotal: number;
  change: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
} {
  const currentTotal = calculateTotal(current);
  const previousTotal = calculateTotal(previous);
  const change = currentTotal - previousTotal;
  const changePercentage = calculatePercentageChange(currentTotal, previousTotal);
  
  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (changePercentage > 5) trend = 'up';
  else if (changePercentage < -5) trend = 'down';
  
  return {
    currentTotal,
    previousTotal,
    change,
    changePercentage,
    trend,
  };
}

/**
 * Obtiene el nombre del mes
 */
export function getMonthName(month: number): string {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[month - 1] || '';
}

/**
 * Obtiene el rango de fechas del mes actual
 */
export function getCurrentMonthRange(): { fechaInicio: string; fechaFin: string } {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return {
    fechaInicio: firstDay.toISOString().split('T')[0],
    fechaFin: lastDay.toISOString().split('T')[0],
  };
}

/**
 * Obtiene el rango de fechas del año actual
 */
export function getCurrentYearRange(): { fechaInicio: string; fechaFin: string } {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), 0, 1);
  const lastDay = new Date(now.getFullYear(), 11, 31);
  
  return {
    fechaInicio: firstDay.toISOString().split('T')[0],
    fechaFin: lastDay.toISOString().split('T')[0],
  };
}

/**
 * Obtiene el rango de los últimos N días
 */
export function getLastNDaysRange(days: number): { fechaInicio: string; fechaFin: string } {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - days);
  
  return {
    fechaInicio: startDate.toISOString().split('T')[0],
    fechaFin: now.toISOString().split('T')[0],
  };
}

/**
 * Genera colores para gráficos
 */
export function generateChartColors(count: number): string[] {
  const baseColors = [
    '#3A7AFE', // Azul primario
    '#10B981', // Verde
    '#F59E0B', // Naranja
    '#8B5CF6', // Púrpura
    '#EC4899', // Rosa
    '#06B6D4', // Cyan
    '#EF4444', // Rojo
    '#6366F1', // Indigo
  ];
  
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }
  
  // Generar colores adicionales si se necesitan
  const colors = [...baseColors];
  while (colors.length < count) {
    const hue = (colors.length * 137.5) % 360;
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }
  
  return colors;
}
