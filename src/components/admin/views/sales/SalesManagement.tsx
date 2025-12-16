import React, { useState, useMemo, useEffect } from 'react';
import { Card, MetricCard } from '../../../ui/Card';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';
import { Select } from '../../../ui/Select';
import { Badge } from '../../../ui/Badge';
import { toast } from '../../../ui/Toast';
import { SimpleTable } from '../../../ui/SimpleTable';
import { EmptyState } from '../../../ui/EmptyState';
import { Tabs } from '../../../ui/Tabs';
import {
  Plus,
  Search,
  Filter,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Eye,
  Edit,
  Trash2,
  Download,
} from 'lucide-react';
import { Venta, Cotizacion, EstadoVenta, TipoVenta } from './types';
import { useSales } from '../../../../hooks/useSales';
import {
  formatCurrency,
  formatDate,
  getSaleStatusLabel,
  getSaleStatusColor,
  getSaleTypeLabel,
  getQuotationStatusLabel,
  getQuotationStatusColor,
  extractSaleId,
  extractQuotationId,
} from '../../../../utils/adapters/salesAdapter';
import { SaleModal } from './SaleModal';
import { QuotationModal } from './QuotationModal';
import { SaleDetails } from './SaleDetails';
import { QuotationDetails } from './QuotationDetails';

type ViewMode = 'ventas' | 'cotizaciones';

export function SalesManagement() {
  // Hook de sales
  const {
    sales,
    quotations,
    loading,
    createSale,
    updateSale,
    deleteSale,
    confirmSale,
    markAsPaid,
    cancelSale,
    createQuotation,
    updateQuotation,
    deleteQuotation,
    convertQuotationToSale,
    getStatistics,
    getDashboard,
    loadQuotations,
  } = useSales();

  const [viewMode, setViewMode] = useState<ViewMode>('ventas');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Modales
  const [showCreateSaleModal, setShowCreateSaleModal] = useState(false);
  const [showEditSaleModal, setShowEditSaleModal] = useState(false);
  const [showSaleDetailsModal, setShowSaleDetailsModal] = useState(false);
  const [showCreateQuotationModal, setShowCreateQuotationModal] = useState(false);
  const [showEditQuotationModal, setShowEditQuotationModal] = useState(false);
  const [showQuotationDetailsModal, setShowQuotationDetailsModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Venta | null>(null);
  const [selectedQuotation, setSelectedQuotation] = useState<Cotizacion | null>(null);

  // Cargar cotizaciones cuando cambiamos al tab
  useEffect(() => {
    if (viewMode === 'cotizaciones' && quotations.length === 0) {
      loadQuotations();
    }
  }, [viewMode, quotations.length, loadQuotations]);

  // Filtrar ventas
  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const matchesSearch =
        searchTerm === '' ||
        sale.numeroVenta.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.nombreCliente?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || sale.estadoVenta === statusFilter;
      const matchesType = typeFilter === 'all' || sale.tipoVenta === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [sales, searchTerm, statusFilter, typeFilter]);

  // Filtrar cotizaciones
  const filteredQuotations = useMemo(() => {
    return quotations.filter(quotation => {
      const matchesSearch =
        searchTerm === '' ||
        quotation.numeroCotizacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quotation.nombreCliente?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || quotation.estadoCotizacion === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [quotations, searchTerm, statusFilter]);

  // Calcular métricas
  const metrics = useMemo(() => {
    const totalVentas = sales.length;
    const ventasPagadas = sales.filter(s => s.estadoVenta === 'Pagada' || s.estadoVenta === 'Completada');
    const ingresosMes = ventasPagadas.reduce((sum, s) => sum + s.total, 0);
    const ticketPromedio = ventasPagadas.length > 0 ? ingresosMes / ventasPagadas.length : 0;
    const cotizacionesPendientes = quotations.filter(q => q.estadoCotizacion === 'Pendiente' || q.estadoCotizacion === 'Enviada').length;
    const cotizacionesConvertidas = quotations.filter(q => q.estadoCotizacion === 'Convertida').length;
    const tasaConversion = quotations.length > 0 ? (cotizacionesConvertidas / quotations.length) * 100 : 0;

    return {
      totalVentas,
      ventasPagadas: ventasPagadas.length,
      ingresosMes,
      ticketPromedio,
      cotizacionesPendientes,
      tasaConversion,
    };
  }, [sales, quotations]);

  // Handlers de ventas
  const handleCreateSale = () => {
    setSelectedSale(null);
    setShowCreateSaleModal(true);
  };

  const handleEditSale = (sale: Venta) => {
    setSelectedSale(sale);
    setShowEditSaleModal(true);
  };

  const handleViewSale = (sale: Venta) => {
    setSelectedSale(sale);
    setShowSaleDetailsModal(true);
  };

  const handleDeleteSale = async (id: number) => {
    if (confirm('¿Está seguro de eliminar esta venta?')) {
      const result = await deleteSale(id);
      if (result.success) {
        toast.success('Venta eliminada exitosamente');
      } else {
        toast.error(result.error || 'Error al eliminar venta');
      }
    }
  };

  // Handlers de cotizaciones
  const handleCreateQuotation = () => {
    setSelectedQuotation(null);
    setShowCreateQuotationModal(true);
  };

  const handleEditQuotation = (quotation: Cotizacion) => {
    setSelectedQuotation(quotation);
    setShowEditQuotationModal(true);
  };

  const handleViewQuotation = (quotation: Cotizacion) => {
    setSelectedQuotation(quotation);
    setShowQuotationDetailsModal(true);
  };

  const handleDeleteQuotation = async (id: number) => {
    if (confirm('¿Está seguro de eliminar esta cotización?')) {
      const result = await deleteQuotation(id);
      if (result.success) {
        toast.success('Cotización eliminada exitosamente');
      } else {
        toast.error(result.error || 'Error al eliminar cotización');
      }
    }
  };

  const handleConvertToSale = async (quotation: Cotizacion) => {
    if (confirm('¿Convertir esta cotización en venta?')) {
      const result = await convertQuotationToSale(quotation.idCotizacion);
      if (result.success) {
        toast.success('Cotización convertida a venta exitosamente');
        setViewMode('ventas');
      } else {
        toast.error(result.error || 'Error al convertir cotización');
      }
    }
  };

  // Columnas de la tabla de ventas
  const salesColumns = [
    {
      key: 'numeroVenta',
      label: 'Número',
      render: (sale: Venta) => (
        <span className="text-sm text-gray-900">{sale.numeroVenta}</span>
      ),
    },
    {
      key: 'cliente',
      label: 'Cliente',
      render: (sale: Venta) => (
        <span className="text-sm text-gray-900">{sale.nombreCliente || 'N/A'}</span>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (sale: Venta) => (
        <Badge variant="blue" size="sm">
          {getSaleTypeLabel(sale.tipoVenta)}
        </Badge>
      ),
    },
    {
      key: 'fecha',
      label: 'Fecha',
      render: (sale: Venta) => (
        <span className="text-sm text-gray-600">{formatDate(sale.fechaVenta)}</span>
      ),
    },
    {
      key: 'total',
      label: 'Total',
      render: (sale: Venta) => (
        <span className="text-sm text-gray-900">{formatCurrency(sale.total, sale.moneda)}</span>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (sale: Venta) => (
        <Badge variant={getSaleStatusColor(sale.estadoVenta) as any} size="sm">
          {getSaleStatusLabel(sale.estadoVenta)}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (sale: Venta) => (
        <div className="flex gap-1">
          <button
            onClick={() => handleViewSale(sale)}
            className="p-1.5 text-gray-600 hover:text-[#3A7AFE] hover:bg-gray-100 rounded transition-colors"
            title="Ver detalles"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleEditSale(sale)}
            className="p-1.5 text-gray-600 hover:text-[#3A7AFE] hover:bg-gray-100 rounded transition-colors"
            title="Editar"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDeleteSale(sale.idVenta)}
            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded transition-colors"
            title="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  // Columnas de la tabla de cotizaciones
  const quotationsColumns = [
    {
      key: 'numeroCotizacion',
      label: 'Número',
      render: (quotation: Cotizacion) => (
        <span className="text-sm text-gray-900">{quotation.numeroCotizacion}</span>
      ),
    },
    {
      key: 'cliente',
      label: 'Cliente',
      render: (quotation: Cotizacion) => (
        <span className="text-sm text-gray-900">{quotation.nombreCliente || 'N/A'}</span>
      ),
    },
    {
      key: 'fecha',
      label: 'Fecha',
      render: (quotation: Cotizacion) => (
        <span className="text-sm text-gray-600">{formatDate(quotation.fechaCotizacion)}</span>
      ),
    },
    {
      key: 'validez',
      label: 'Válido hasta',
      render: (quotation: Cotizacion) => (
        <span className="text-sm text-gray-600">{formatDate(quotation.fechaValidez)}</span>
      ),
    },
    {
      key: 'total',
      label: 'Total',
      render: (quotation: Cotizacion) => (
        <span className="text-sm text-gray-900">{formatCurrency(quotation.total, quotation.moneda)}</span>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (quotation: Cotizacion) => (
        <Badge variant={getQuotationStatusColor(quotation.estadoCotizacion) as any} size="sm">
          {getQuotationStatusLabel(quotation.estadoCotizacion)}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (quotation: Cotizacion) => (
        <div className="flex gap-1">
          <button
            onClick={() => handleViewQuotation(quotation)}
            className="p-1.5 text-gray-600 hover:text-[#3A7AFE] hover:bg-gray-100 rounded transition-colors"
            title="Ver detalles"
          >
            <Eye size={16} />
          </button>
          {quotation.estadoCotizacion === 'Aceptada' && (
            <button
              onClick={() => handleConvertToSale(quotation)}
              className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-gray-100 rounded transition-colors"
              title="Convertir a venta"
            >
              <CheckCircle size={16} />
            </button>
          )}
          <button
            onClick={() => handleEditQuotation(quotation)}
            className="p-1.5 text-gray-600 hover:text-[#3A7AFE] hover:bg-gray-100 rounded transition-colors"
            title="Editar"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDeleteQuotation(quotation.idCotizacion)}
            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded transition-colors"
            title="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#3A7AFE] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Ventas</p>
            <div className="p-2 bg-blue-50 rounded-lg">
              <ShoppingCart size={18} className="text-[#3A7AFE]" />
            </div>
          </div>
          <p className="text-2xl text-gray-900">{metrics.totalVentas}</p>
          <p className="text-xs text-gray-500 mt-1">{metrics.ventasPagadas} pagadas</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Ingresos del Mes</p>
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign size={18} className="text-green-600" />
            </div>
          </div>
          <p className="text-2xl text-gray-900">
            ${(metrics.ingresosMes / 1000000).toFixed(1)}M
          </p>
          <p className="text-xs text-gray-500 mt-1">COP</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Ticket Promedio</p>
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUp size={18} className="text-purple-600" />
            </div>
          </div>
          <p className="text-2xl text-gray-900">
            ${(metrics.ticketPromedio / 1000).toFixed(0)}K
          </p>
          <p className="text-xs text-gray-500 mt-1">COP</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Tasa Conversión</p>
            <div className="p-2 bg-orange-50 rounded-lg">
              <CheckCircle size={18} className="text-orange-600" />
            </div>
          </div>
          <p className="text-2xl text-gray-900">{metrics.tasaConversion.toFixed(1)}%</p>
          <p className="text-xs text-gray-500 mt-1">{metrics.cotizacionesPendientes} cotizaciones pendientes</p>
        </div>
      </div>

      {/* Tabs y contenido */}
      <div className="bg-white border border-gray-200 rounded-lg">
        {/* Header con tabs */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4">
              <button
                onClick={() => setViewMode('ventas')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'ventas'
                    ? 'bg-[#3A7AFE] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <ShoppingCart size={18} className="inline mr-2" />
                Ventas
              </button>
              <button
                onClick={() => setViewMode('cotizaciones')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'cotizaciones'
                    ? 'bg-[#3A7AFE] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FileText size={18} className="inline mr-2" />
                Cotizaciones
              </button>
            </div>

            <Button
              variant="primary"
              onClick={viewMode === 'ventas' ? handleCreateSale : handleCreateQuotation}
            >
              <Plus size={18} />
              {viewMode === 'ventas' ? 'Nueva Venta' : 'Nueva Cotización'}
            </Button>
          </div>

          {/* Búsqueda y filtros */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder={`Buscar ${viewMode}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={18} />}
              />
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-gray-100' : ''}
            >
              <Filter size={18} />
              Filtros
            </Button>
            <Button variant="secondary">
              <Download size={18} />
              Exportar
            </Button>
          </div>

          {/* Filtros avanzados */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
              <Select
                label="Estado"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={
                  viewMode === 'ventas'
                    ? [
                        { value: 'all', label: 'Todos' },
                        { value: 'Borrador', label: 'Borrador' },
                        { value: 'Confirmada', label: 'Confirmada' },
                        { value: 'Pagada', label: 'Pagada' },
                        { value: 'Completada', label: 'Completada' },
                        { value: 'Cancelada', label: 'Cancelada' },
                      ]
                    : [
                        { value: 'all', label: 'Todos' },
                        { value: 'Pendiente', label: 'Pendiente' },
                        { value: 'Enviada', label: 'Enviada' },
                        { value: 'Aceptada', label: 'Aceptada' },
                        { value: 'Rechazada', label: 'Rechazada' },
                        { value: 'Vencida', label: 'Vencida' },
                      ]
                }
              />
              {viewMode === 'ventas' && (
                <Select
                  label="Tipo"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'Todos' },
                    { value: 'Paquete', label: 'Paquete' },
                    { value: 'Servicio_Individual', label: 'Servicio Individual' },
                    { value: 'Personalizado', label: 'Personalizado' },
                  ]}
                />
              )}
            </div>
          )}
        </div>

        {/* Tabla */}
        <div className="p-6">
          {viewMode === 'ventas' ? (
            filteredSales.length > 0 ? (
              <SimpleTable columns={salesColumns} data={filteredSales} />
            ) : (
              <EmptyState
                icon={<ShoppingCart size={48} />}
                title="No se encontraron ventas"
                description="Comienza creando tu primera venta"
                action={
                  <Button variant="primary" onClick={handleCreateSale}>
                    <Plus size={18} />
                    Nueva Venta
                  </Button>
                }
              />
            )
          ) : filteredQuotations.length > 0 ? (
            <SimpleTable columns={quotationsColumns} data={filteredQuotations} />
          ) : (
            <EmptyState
              icon={<FileText size={48} />}
              title="No se encontraron cotizaciones"
              description="Comienza creando tu primera cotización"
              action={
                <Button variant="primary" onClick={handleCreateQuotation}>
                  <Plus size={18} />
                  Nueva Cotización
                </Button>
              }
            />
          )}
        </div>
      </div>

      {/* Modales de Ventas */}
      {showCreateSaleModal && (
        <SaleModal
          isOpen={showCreateSaleModal}
          onClose={() => setShowCreateSaleModal(false)}
          mode="create"
        />
      )}
      {showEditSaleModal && selectedSale && (
        <SaleModal
          isOpen={showEditSaleModal}
          onClose={() => setShowEditSaleModal(false)}
          sale={selectedSale}
          mode="edit"
        />
      )}
      {showSaleDetailsModal && selectedSale && (
        <SaleDetails
          isOpen={showSaleDetailsModal}
          onClose={() => setShowSaleDetailsModal(false)}
          sale={selectedSale}
          onEdit={handleEditSale}
        />
      )}

      {/* Modales de Cotizaciones */}
      {showCreateQuotationModal && (
        <QuotationModal
          isOpen={showCreateQuotationModal}
          onClose={() => setShowCreateQuotationModal(false)}
          mode="create"
        />
      )}
      {showEditQuotationModal && selectedQuotation && (
        <QuotationModal
          isOpen={showEditQuotationModal}
          onClose={() => setShowEditQuotationModal(false)}
          quotation={selectedQuotation}
          mode="edit"
        />
      )}
      {showQuotationDetailsModal && selectedQuotation && (
        <QuotationDetails
          isOpen={showQuotationDetailsModal}
          onClose={() => setShowQuotationDetailsModal(false)}
          quotation={selectedQuotation}
          onEdit={handleEditQuotation}
        />
      )}
    </div>
  );
}
