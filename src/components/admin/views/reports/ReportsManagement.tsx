import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';
import { Badge } from '../../../ui/Badge';
import { toast } from '../../../ui/Toast';
import { SimpleTable } from '../../../ui/SimpleTable';
import { EmptyState } from '../../../ui/EmptyState';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Calendar,
  Download,
  FileText,
  PieChart,
  Activity,
  Target,
  Package,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useReports } from '../../../../hooks/useReports';
import {
  formatCurrency,
  formatPercentage,
  formatNumber,
  formatCompactNumber,
  calculatePercentageChange,
  getKPIColor,
  getKPIStatus,
  getTrendIcon,
  getCurrentMonthRange,
  getCurrentYearRange,
  getLastNDaysRange,
} from '../../../../utils/adapters/reportsAdapter';
import type { KPIData, DateRange } from '../../../../hooks/useReports';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type ViewMode = 'dashboard' | 'sales' | 'clients' | 'financial' | 'kpis';
type PeriodFilter = 'today' | 'week' | 'month' | 'year' | 'custom';

const COLORS = ['#3A7AFE', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export function ReportsManagement() {
  const {
    dashboardMetrics,
    salesReports,
    clientAnalytics,
    financialReport,
    kpis,
    loading,
    loadDashboardMetrics,
    loadSalesReport,
    loadClientAnalytics,
    loadFinancialReport,
    loadBusinessKPIs,
    getMonthlySales,
    exportReport,
  } = useReports();

  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('month');
  const [customDateRange, setCustomDateRange] = useState<DateRange | null>(null);
  const [monthlySalesData, setMonthlySalesData] = useState<any[]>([]);

  // Cargar datos iniciales
  useEffect(() => {
    loadDashboardMetrics();
    loadBusinessKPIs();
    
    // Cargar ventas mensuales del año actual
    const currentYear = new Date().getFullYear();
    getMonthlySales(currentYear).then(result => {
      if (result.success && result.data) {
        setMonthlySalesData(result.data);
      }
    });
  }, []);

  // Cargar datos según la vista activa
  useEffect(() => {
    const dateRange = getDateRangeForFilter();
    
    switch (viewMode) {
      case 'sales':
        loadSalesReport(dateRange);
        break;
      case 'clients':
        loadClientAnalytics();
        break;
      case 'financial':
        loadFinancialReport(dateRange);
        break;
      case 'kpis':
        loadBusinessKPIs();
        break;
    }
  }, [viewMode, periodFilter]);

  const getDateRangeForFilter = (): DateRange | undefined => {
    const now = new Date();
    switch (periodFilter) {
      case 'today':
        return getLastNDaysRange(1);
      case 'week':
        return getLastNDaysRange(7);
      case 'month':
        return getCurrentMonthRange();
      case 'year':
        return getCurrentYearRange();
      case 'custom':
        return customDateRange || undefined;
      default:
        return undefined;
    }
  };

  const handleExport = async (format: 'PDF' | 'Excel' | 'CSV') => {
    const result = await exportReport(viewMode, format);
    if (result.success) {
      toast.success(`Reporte exportado como ${format}`);
    } else {
      toast.error('Error al exportar el reporte');
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs de Navegación */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => setViewMode('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                viewMode === 'dashboard'
                  ? 'border-[#3A7AFE] text-[#3A7AFE]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 size={18} />
                Dashboard General
              </div>
            </button>
            <button
              onClick={() => setViewMode('sales')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                viewMode === 'sales'
                  ? 'border-[#3A7AFE] text-[#3A7AFE]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} />
                Ventas
              </div>
            </button>
            <button
              onClick={() => setViewMode('clients')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                viewMode === 'clients'
                  ? 'border-[#3A7AFE] text-[#3A7AFE]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users size={18} />
                Clientes
              </div>
            </button>
            <button
              onClick={() => setViewMode('financial')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                viewMode === 'financial'
                  ? 'border-[#3A7AFE] text-[#3A7AFE]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <DollarSign size={18} />
                Financiero
              </div>
            </button>
            <button
              onClick={() => setViewMode('kpis')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                viewMode === 'kpis'
                  ? 'border-[#3A7AFE] text-[#3A7AFE]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Target size={18} />
                KPIs
              </div>
            </button>
          </div>
        </div>

        {/* Filtros y Acciones */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex gap-2">
              {['month', 'year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setPeriodFilter(period as PeriodFilter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    periodFilter === period
                      ? 'bg-[#3A7AFE] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {period === 'month' ? 'Este Mes' : 'Este Año'}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => handleExport('PDF')}>
                <Download size={18} />
                Exportar PDF
              </Button>
              <Button variant="secondary" onClick={() => handleExport('Excel')}>
                <Download size={18} />
                Exportar Excel
              </Button>
            </div>
          </div>
        </div>

        {/* Contenido según vista */}
        <div className="p-6">
          {/* Dashboard General */}
          {viewMode === 'dashboard' && (
            <div className="space-y-6">
              {/* Métricas Principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-[#3A7AFE] to-[#1A2440] p-6 rounded-lg text-white">
                  <div className="flex items-center justify-between mb-4">
                    <DollarSign size={32} />
                    <ArrowUpRight size={20} className="text-green-300" />
                  </div>
                  <p className="text-sm opacity-90">Ventas Totales</p>
                  <p className="text-3xl font-bold mt-2">
                    {formatCurrency(dashboardMetrics?.ventasTotales || 0)}
                  </p>
                  <p className="text-xs mt-2 opacity-75">
                    {formatCurrency(dashboardMetrics?.ventasMes || 0)} este mes
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="text-[#3A7AFE]" size={32} />
                    <TrendingUp size={20} className="text-green-500" />
                  </div>
                  <p className="text-sm text-gray-600">Clientes Nuevos</p>
                  <p className="text-3xl font-bold text-[#1A2440] mt-2">
                    {formatNumber(dashboardMetrics?.clientesNuevos || 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    +15% vs mes anterior
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <Package className="text-purple-600" size={32} />
                    <Activity size={20} className="text-blue-500" />
                  </div>
                  <p className="text-sm text-gray-600">Reservas Activas</p>
                  <p className="text-3xl font-bold text-[#1A2440] mt-2">
                    {formatNumber(dashboardMetrics?.reservasActivas || 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {formatPercentage(dashboardMetrics?.tasaConversion || 0)} conversión
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <ShoppingCart className="text-green-600" size={32} />
                    <TrendingUp size={20} className="text-green-500" />
                  </div>
                  <p className="text-sm text-gray-600">Ticket Promedio</p>
                  <p className="text-3xl font-bold text-[#1A2440] mt-2">
                    {formatCurrency(dashboardMetrics?.ticketPromedio || 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {formatCurrency(dashboardMetrics?.ingresosMes || 0)} ingresos
                  </p>
                </div>
              </div>

              {/* Gráfico de Ventas Mensuales */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-[#1A2440] mb-4">Ventas Mensuales</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlySalesData}>
                    <defs>
                      <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3A7AFE" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3A7AFE" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="ingresos" 
                      stroke="#3A7AFE" 
                      fillOpacity={1} 
                      fill="url(#colorIngresos)" 
                      name="Ingresos"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Reportes de Ventas */}
          {viewMode === 'sales' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-[#1A2440] mb-4">Análisis de Ventas</h3>
                {loading ? (
                  <p className="text-gray-500 text-center py-12">Cargando datos...</p>
                ) : (
                  <SimpleTable
                    headers={['Fecha', 'Ventas', 'Cantidad', 'Ingresos', 'Ticket Promedio']}
                    data={(salesReports || []).map((report) => [
                      report.fecha,
                      formatNumber(report.totalVentas),
                      formatNumber(report.cantidadVentas),
                      formatCurrency(report.ingresos),
                      formatCurrency(report.ticketPromedio),
                    ])}
                  />
                )}
              </div>
            </div>
          )}

          {/* Analytics de Clientes */}
          {viewMode === 'clients' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-600">Total Clientes</p>
                  <p className="text-3xl font-bold text-[#1A2440] mt-2">
                    {formatNumber(clientAnalytics?.totalClientes || 0)}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-600">Clientes Activos</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {formatNumber(clientAnalytics?.clientesActivos || 0)}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-600">Clientes VIP</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">
                    {formatNumber(clientAnalytics?.clientesVIP || 0)}
                  </p>
                </div>
              </div>

              {/* Top Clientes */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-[#1A2440] mb-4">Top 10 Clientes</h3>
                <SimpleTable
                  headers={['Cliente', 'Compras', 'Total Gastado']}
                  data={(clientAnalytics?.topClientes || []).map((client) => [
                    client.nombre,
                    formatNumber(client.totalCompras),
                    formatCurrency(client.totalGastado),
                  ])}
                />
              </div>
            </div>
          )}

          {/* Reporte Financiero */}
          {viewMode === 'financial' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-600">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    {formatCurrency(financialReport?.ingresosTotales || 0)}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-600">Gastos Totales</p>
                  <p className="text-2xl font-bold text-red-600 mt-2">
                    {formatCurrency(financialReport?.gastosTotales || 0)}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-600">Utilidad Neta</p>
                  <p className="text-2xl font-bold text-[#3A7AFE] mt-2">
                    {formatCurrency(financialReport?.utilidadNeta || 0)}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-600">Margen de Utilidad</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">
                    {formatPercentage(financialReport?.margenUtilidad || 0)}
                  </p>
                </div>
              </div>

              {/* Gráficos Financieros */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-[#1A2440] mb-4">Ingresos por Categoría</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartsPieChart>
                      <Pie
                        data={financialReport?.ingresosPorCategoria || []}
                        dataKey="monto"
                        nameKey="categoria"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {(financialReport?.ingresosPorCategoria || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-[#1A2440] mb-4">Gastos por Categoría</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={financialReport?.gastosPorCategoria || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="categoria" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="monto" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* KPIs del Negocio */}
          {viewMode === 'kpis' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(kpis || []).map((kpi) => {
                  const Icon = getTrendIcon(kpi.tendencia);
                  const statusColor = getKPIColor(kpi.porcentajeCumplimiento);
                  
                  return (
                    <div key={kpi.nombre} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-600">{kpi.nombre}</h4>
                        <Icon className={statusColor} size={20} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-baseline justify-between">
                          <span className="text-3xl font-bold text-[#1A2440]">
                            {formatNumber(kpi.valor)}
                          </span>
                          <span className="text-sm text-gray-500">
                            / {formatNumber(kpi.objetivo)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              kpi.porcentajeCumplimiento >= 100
                                ? 'bg-green-500'
                                : kpi.porcentajeCumplimiento >= 75
                                ? 'bg-[#3A7AFE]'
                                : kpi.porcentajeCumplimiento >= 50
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(kpi.porcentajeCumplimiento, 100)}%` }}
                          />
                        </div>
                        <p className="text-sm text-gray-600">
                          {formatPercentage(kpi.porcentajeCumplimiento)} completado
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}