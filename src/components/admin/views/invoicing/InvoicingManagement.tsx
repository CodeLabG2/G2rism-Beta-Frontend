import React, { useState, useEffect } from 'react';
import { Card, MetricCard } from '../../../ui/Card';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';
import { Select } from '../../../ui/Select';
import { Badge } from '../../../ui/Badge';
import { toast } from '../../../ui/Toast';
import { DataTable } from '../../DataTable';
import { EmptyState } from '../../../ui/EmptyState';
import { Tabs } from '../../../ui/Tabs';
import {
  Plus,
  Search,
  Filter,
  FileText,
  Send,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Mail,
  RefreshCw,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Factura, NotaCredito, NotaDebito, EstadoFactura, FacturaFilters } from './types';
import invoicesService from '../../../../services/api/invoicesService';
import { InvoiceModal } from './InvoiceModal';
import { InvoiceDetails } from './InvoiceDetails';
import { CreditNoteModal } from './CreditNoteModal';
import { DebitNoteModal } from './DebitNoteModal';

type ViewMode = 'facturas' | 'notas-credito' | 'notas-debito';

export function InvoicingManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('facturas');
  const [invoices, setInvoices] = useState<Factura[]>([]);
  const [creditNotes, setCreditNotes] = useState<NotaCredito[]>([]);
  const [debitNotes, setDebitNotes] = useState<NotaDebito[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FacturaFilters>({});
  
  // Modales
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [showEditInvoiceModal, setShowEditInvoiceModal] = useState(false);
  const [showInvoiceDetailsModal, setShowInvoiceDetailsModal] = useState(false);
  const [showCreditNoteModal, setShowCreditNoteModal] = useState(false);
  const [showDebitNoteModal, setShowDebitNoteModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Factura | null>(null);
  
  // Métricas
  const [metrics, setMetrics] = useState({
    totalFacturas: 0,
    facturasMes: 0,
    facturasAprobadas: 0,
    facturasPendientes: 0,
    totalFacturado: 0,
    totalFacturadoMes: 0,
  });

  // Cargar datos
  useEffect(() => {
    if (viewMode === 'facturas') {
      loadInvoices();
    } else if (viewMode === 'notas-credito') {
      loadCreditNotes();
    } else {
      loadDebitNotes();
    }
  }, [viewMode]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await invoicesService.getAll(filters);
      setInvoices(data);
      setFilteredInvoices(data);
      
      // Cargar dashboard
      const dashboard = await invoicesService.getDashboard();
      setMetrics({
        totalFacturas: dashboard.totalFacturas,
        facturasMes: dashboard.facturasMes,
        facturasAprobadas: dashboard.facturasAprobadas,
        facturasPendientes: dashboard.facturasPendientes,
        totalFacturado: dashboard.totalFacturado,
        totalFacturadoMes: dashboard.totalFacturadoMes,
      });
    } catch (error) {
      console.error('Error loading invoices:', error);
      toast.error('Error al cargar facturas');
    } finally {
      setLoading(false);
    }
  };

  const loadCreditNotes = async () => {
    setLoading(true);
    // Cargar notas de crédito (simulado)
    setCreditNotes([]);
    setLoading(false);
  };

  const loadDebitNotes = async () => {
    setLoading(true);
    // Cargar notas de débito (simulado)
    setDebitNotes([]);
    setLoading(false);
  };

  // Filtrar facturas por búsqueda
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredInvoices(invoices);
    } else {
      const filtered = invoices.filter(invoice =>
        invoice.numeroFactura.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.nombreCliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.numeroVenta?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInvoices(filtered);
    }
  }, [searchTerm, invoices]);

  const handleSendToDIAN = async (invoiceId: number) => {
    try {
      await invoicesService.enviarDIAN(invoiceId);
      toast.success('Factura enviada a DIAN exitosamente');
      loadInvoices();
    } catch (error) {
      toast.error('Error al enviar factura a DIAN');
    }
  };

  const handleDownloadPDF = async (invoiceId: number) => {
    try {
      toast.success('Descargando factura PDF...');
      // await invoicesService.generarPDF(invoiceId);
    } catch (error) {
      toast.error('Error al descargar PDF');
    }
  };

  const handleDeleteInvoice = async (invoiceId: number) => {
    if (confirm('¿Estás seguro de eliminar esta factura?')) {
      try {
        await invoicesService.delete(invoiceId);
        toast.success('Factura eliminada exitosamente');
        loadInvoices();
      } catch (error) {
        toast.error('Error al eliminar factura');
      }
    }
  };

  const handleViewDetails = (invoice: Factura) => {
    setSelectedInvoice(invoice);
    setShowInvoiceDetailsModal(true);
  };

  const handleEditInvoice = (invoice: Factura) => {
    setSelectedInvoice(invoice);
    setShowEditInvoiceModal(true);
  };

  const getStatusBadge = (estado: EstadoFactura) => {
    const statusConfig = {
      'Borrador': { variant: 'secondary' as const, label: 'Borrador' },
      'Enviada_DIAN': { variant: 'warning' as const, label: 'Enviada DIAN' },
      'Aprobada_DIAN': { variant: 'success' as const, label: 'Aprobada DIAN' },
      'Rechazada_DIAN': { variant: 'error' as const, label: 'Rechazada DIAN' },
      'Anulada': { variant: 'error' as const, label: 'Anulada' },
    };
    
    const config = statusConfig[estado] || statusConfig['Borrador'];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Dashboard de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#3A7AFE] to-[#1A2440] p-6 rounded-lg text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <FileText size={32} />
            <CheckCircle size={24} className="text-green-300" />
          </div>
          <p className="text-sm opacity-90">Total Facturado</p>
          <p className="text-3xl font-bold mt-2">{formatCurrency(metrics.totalFacturado)}</p>
          <p className="text-xs mt-2 opacity-75">
            {formatCurrency(metrics.totalFacturadoMes)} este mes
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <FileText className="text-[#3A7AFE]" size={32} />
            <span className="text-2xl font-bold text-[#1A2440]">{metrics.totalFacturas}</span>
          </div>
          <p className="text-sm text-gray-600">Total Facturas</p>
          <p className="text-xs text-gray-500 mt-2">{metrics.facturasMes} este mes</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4">
              <div className="text-center">
                <CheckCircle className="text-green-500 mx-auto" size={24} />
                <p className="text-lg font-bold text-[#1A2440] mt-1">{metrics.facturasAprobadas}</p>
                <p className="text-xs text-gray-500">Aprobadas</p>
              </div>
              <div className="text-center">
                <Clock className="text-orange-500 mx-auto" size={24} />
                <p className="text-lg font-bold text-[#1A2440] mt-1">{metrics.facturasPendientes}</p>
                <p className="text-xs text-gray-500">Pendientes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs y Contenido */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Tabs Header */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => setViewMode('facturas')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                viewMode === 'facturas'
                  ? 'border-[#3A7AFE] text-[#3A7AFE]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText size={18} />
                Facturas ({invoices.length})
              </div>
            </button>
            <button
              onClick={() => setViewMode('notas-credito')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                viewMode === 'notas-credito'
                  ? 'border-[#3A7AFE] text-[#3A7AFE]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <RefreshCw size={18} />
                Notas Crédito ({creditNotes.length})
              </div>
            </button>
            <button
              onClick={() => setViewMode('notas-debito')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                viewMode === 'notas-debito'
                  ? 'border-[#3A7AFE] text-[#3A7AFE]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Plus size={18} />
                Notas Débito ({debitNotes.length})
              </div>
            </button>
          </div>
        </div>

        {/* Barra de Búsqueda y Acciones */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Buscar por número, cliente, CUFE..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <Filter size={18} />
                Filtros
              </Button>
              {viewMode === 'facturas' && (
                <Button variant="primary" onClick={() => setShowCreateInvoiceModal(true)}>
                  <Plus size={18} />
                  Nueva Factura
                </Button>
              )}
              {viewMode === 'notas-credito' && (
                <Button variant="primary" onClick={() => setShowCreditNoteModal(true)}>
                  <Plus size={18} />
                  Nueva Nota Crédito
                </Button>
              )}
              {viewMode === 'notas-debito' && (
                <Button variant="primary" onClick={() => setShowDebitNoteModal(true)}>
                  <Plus size={18} />
                  Nueva Nota Débito
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Contenido según vista */}
        <div className="p-6">
          {viewMode === 'facturas' && (
            <>
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Cargando facturas...</p>
                </div>
              ) : filteredInvoices.length === 0 ? (
                <EmptyState
                  icon={<FileText size={48} />}
                  title="No hay facturas"
                  description="Comienza creando tu primera factura electrónica"
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CUFE</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredInvoices.map((invoice) => (
                        <tr key={invoice.idFactura} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="font-medium text-gray-900">
                              {invoice.prefijo}-{invoice.numeroFactura}
                            </div>
                            <div className="text-sm text-gray-500">{invoice.numeroVenta}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-medium text-gray-900">{invoice.nombreCliente}</div>
                            <div className="text-sm text-gray-500">{invoice.documentoCliente}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">{formatDate(invoice.fechaEmision)}</div>
                            <div className="text-xs text-gray-500">Vence: {formatDate(invoice.fechaVencimiento)}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-medium text-gray-900">{formatCurrency(invoice.total)}</div>
                            <div className="text-xs text-gray-500">{invoice.moneda}</div>
                          </td>
                          <td className="px-4 py-4">
                            {getStatusBadge(invoice.estadoFactura)}
                          </td>
                          <td className="px-4 py-4">
                            {invoice.cufeDIAN ? (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="text-green-500" size={16} />
                                <span className="text-xs text-gray-600">
                                  {invoice.cufeDIAN.substring(0, 8)}...
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">Sin CUFE</span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleViewDetails(invoice)}
                                className="text-blue-600 hover:text-blue-800"
                                title="Ver detalles"
                              >
                                <Eye size={18} />
                              </button>
                              {invoice.estadoFactura === 'Borrador' && (
                                <>
                                  <button
                                    onClick={() => handleEditInvoice(invoice)}
                                    className="text-gray-600 hover:text-gray-800"
                                    title="Editar"
                                  >
                                    <Edit size={18} />
                                  </button>
                                  <button
                                    onClick={() => handleSendToDIAN(invoice.idFactura)}
                                    className="text-green-600 hover:text-green-800"
                                    title="Enviar a DIAN"
                                  >
                                    <Send size={18} />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleDownloadPDF(invoice.idFactura)}
                                className="text-purple-600 hover:text-purple-800"
                                title="Descargar PDF"
                              >
                                <Download size={18} />
                              </button>
                              {invoice.estadoFactura === 'Borrador' && (
                                <button
                                  onClick={() => handleDeleteInvoice(invoice.idFactura)}
                                  className="text-red-600 hover:text-red-800"
                                  title="Eliminar"
                                >
                                  <Trash2 size={18} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {viewMode === 'notas-credito' && (
            <EmptyState
              icon={<RefreshCw size={48} />}
              title="No hay notas de crédito"
              description="Las notas de crédito aparecerán aquí cuando sean creadas"
            />
          )}

          {viewMode === 'notas-debito' && (
            <EmptyState
              icon={<Plus size={48} />}
              title="No hay notas de débito"
              description="Las notas de débito aparecerán aquí cuando sean creadas"
            />
          )}
        </div>
      </div>

      {/* Modales */}
      {showCreateInvoiceModal && (
        <InvoiceModal
          isOpen={showCreateInvoiceModal}
          onClose={() => setShowCreateInvoiceModal(false)}
          onSave={() => {
            setShowCreateInvoiceModal(false);
            loadInvoices();
          }}
        />
      )}

      {showEditInvoiceModal && selectedInvoice && (
        <InvoiceModal
          isOpen={showEditInvoiceModal}
          onClose={() => {
            setShowEditInvoiceModal(false);
            setSelectedInvoice(null);
          }}
          invoice={selectedInvoice}
          onSave={() => {
            setShowEditInvoiceModal(false);
            setSelectedInvoice(null);
            loadInvoices();
          }}
        />
      )}

      {showInvoiceDetailsModal && selectedInvoice && (
        <InvoiceDetails
          isOpen={showInvoiceDetailsModal}
          onClose={() => {
            setShowInvoiceDetailsModal(false);
            setSelectedInvoice(null);
          }}
          invoice={selectedInvoice}
        />
      )}

      {showCreditNoteModal && (
        <CreditNoteModal
          isOpen={showCreditNoteModal}
          onClose={() => setShowCreditNoteModal(false)}
          onSave={() => {
            setShowCreditNoteModal(false);
            loadCreditNotes();
          }}
        />
      )}

      {showDebitNoteModal && (
        <DebitNoteModal
          isOpen={showDebitNoteModal}
          onClose={() => setShowDebitNoteModal(false)}
          onSave={() => {
            setShowDebitNoteModal(false);
            loadDebitNotes();
          }}
        />
      )}
    </div>
  );
}