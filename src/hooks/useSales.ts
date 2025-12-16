import { useState, useEffect, useCallback } from 'react';
import salesService from '../services/api/salesService';
import { mockSales } from '../data/mockData';
import type { 
  Venta,
  VentaFormData,
  Cotizacion,
  CotizacionFormData,
  VentaFilters,
  CotizacionFilters,
  VentaDashboard,
  VentaStatistics,
  EstadoVenta,
  EstadoCotizacion,
  TipoVenta,
  MetodoPago,
  DetalleVenta,
  DetalleCotizacion,
} from '../services/api/salesService';

/**
 * Hook personalizado para gestión de ventas y cotizaciones
 * Integra salesService con React state management
 * 
 * @returns Funciones y estado para gestionar ventas y cotizaciones
 */
export function useSales() {
  const [sales, setSales] = useState<Venta[]>([]);
  const [quotations, setQuotations] = useState<Cotizacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ==================== VENTAS ====================

  /**
   * Cargar todas las ventas
   */
  const loadSales = useCallback(async (filters?: VentaFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        const data = await salesService.getAll(filters);
        setSales(data);
        return data;
      } catch (apiError) {
        // Si falla la API, usar datos mock
        console.log('API no disponible, usando datos mock de ventas');
        setSales(mockSales as any);
        return mockSales as any;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar ventas';
      setError(errorMessage);
      console.error('Error loading sales:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crear nueva venta
   */
  const createSale = useCallback(async (data: VentaFormData) => {
    try {
      const newSale = await salesService.create(data);
      setSales(prev => [newSale, ...prev]);
      return { success: true, data: newSale };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear venta';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Actualizar venta existente
   */
  const updateSale = useCallback(async (id: number, data: Partial<VentaFormData>) => {
    try {
      const updatedSale = await salesService.update(id, data);
      setSales(prev => prev.map(sale => sale.idVenta === id ? updatedSale : sale));
      return { success: true, data: updatedSale };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar venta';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Eliminar venta
   */
  const deleteSale = useCallback(async (id: number) => {
    try {
      await salesService.delete(id);
      setSales(prev => prev.filter(sale => sale.idVenta !== id));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar venta';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener venta por ID
   */
  const getSaleById = useCallback(async (id: number) => {
    try {
      const sale = await salesService.getById(id);
      return { success: true, data: sale };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener venta';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Cambiar estado de la venta
   */
  const changeSaleStatus = useCallback(async (id: number, estadoVenta: EstadoVenta) => {
    try {
      const updatedSale = await salesService.changeStatus(id, estadoVenta);
      setSales(prev => prev.map(sale => sale.idVenta === id ? updatedSale : sale));
      return { success: true, data: updatedSale };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cambiar estado';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Confirmar venta
   */
  const confirmSale = useCallback(async (id: number) => {
    try {
      const updatedSale = await salesService.confirm(id);
      setSales(prev => prev.map(sale => sale.idVenta === id ? updatedSale : sale));
      return { success: true, data: updatedSale };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al confirmar venta';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Marcar como pagada
   */
  const markAsPaid = useCallback(async (id: number, metodoPago: MetodoPago, fechaPago?: string) => {
    try {
      const updatedSale = await salesService.markAsPaid(id, metodoPago, fechaPago);
      setSales(prev => prev.map(sale => sale.idVenta === id ? updatedSale : sale));
      return { success: true, data: updatedSale };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al marcar como pagada';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Cancelar venta
   */
  const cancelSale = useCallback(async (id: number, motivo?: string) => {
    try {
      const updatedSale = await salesService.cancel(id, motivo);
      setSales(prev => prev.map(sale => sale.idVenta === id ? updatedSale : sale));
      return { success: true, data: updatedSale };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cancelar venta';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Anular venta
   */
  const annulSale = useCallback(async (id: number, motivo: string) => {
    try {
      const updatedSale = await salesService.annul(id, motivo);
      setSales(prev => prev.map(sale => sale.idVenta === id ? updatedSale : sale));
      return { success: true, data: updatedSale };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al anular venta';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener ventas por cliente
   */
  const getSalesByClient = useCallback(async (idCliente: number) => {
    try {
      const data = await salesService.getByClient(idCliente);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener ventas del cliente';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener ventas por empleado
   */
  const getSalesByEmployee = useCallback(async (idEmpleado: number) => {
    try {
      const data = await salesService.getByEmployee(idEmpleado);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener ventas del empleado';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener ventas por estado
   */
  const getSalesByStatus = useCallback(async (estadoVenta: EstadoVenta) => {
    try {
      const data = await salesService.getByStatus(estadoVenta);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener ventas por estado';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener ventas por tipo
   */
  const getSalesByType = useCallback(async (tipoVenta: TipoVenta) => {
    try {
      const data = await salesService.getByType(tipoVenta);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener ventas por tipo';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener ventas del día
   */
  const getTodaySales = useCallback(async () => {
    try {
      const data = await salesService.getToday();
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener ventas del día';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener ventas del mes
   */
  const getThisMonthSales = useCallback(async () => {
    try {
      const data = await salesService.getThisMonth();
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener ventas del mes';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener estadísticas
   */
  const getStatistics = useCallback(async (): Promise<VentaStatistics | null> => {
    try {
      const stats = await salesService.getStatistics();
      return stats;
    } catch (err: any) {
      console.error('Error getting statistics:', err);
      return null;
    }
  }, []);

  /**
   * Obtener dashboard
   */
  const getDashboard = useCallback(async (): Promise<VentaDashboard | null> => {
    try {
      const dashboard = await salesService.getDashboard();
      return dashboard;
    } catch (err: any) {
      console.error('Error getting dashboard:', err);
      return null;
    }
  }, []);

  /**
   * Buscar ventas
   */
  const searchSales = useCallback(async (searchTerm: string) => {
    try {
      const data = await salesService.search(searchTerm);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al buscar ventas';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Generar factura
   */
  const generateInvoice = useCallback(async (id: number) => {
    try {
      const blob = await salesService.generateInvoice(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `factura-${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al generar factura';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Enviar factura por email
   */
  const sendInvoiceEmail = useCallback(async (id: number, email?: string) => {
    try {
      await salesService.sendInvoiceEmail(id, email);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al enviar factura';
      return { success: false, error: errorMessage };
    }
  }, []);

  // ==================== COTIZACIONES ====================

  /**
   * Cargar todas las cotizaciones
   */
  const loadQuotations = useCallback(async (filters?: CotizacionFilters) => {
    try {
      const data = await salesService.getAllQuotations(filters);
      setQuotations(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar cotizaciones';
      setError(errorMessage);
      console.error('Error loading quotations:', err);
      return [];
    }
  }, []);

  /**
   * Crear nueva cotización
   */
  const createQuotation = useCallback(async (data: CotizacionFormData) => {
    try {
      const newQuotation = await salesService.createQuotation(data);
      setQuotations(prev => [newQuotation, ...prev]);
      return { success: true, data: newQuotation };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear cotización';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Actualizar cotización
   */
  const updateQuotation = useCallback(async (id: number, data: Partial<CotizacionFormData>) => {
    try {
      const updatedQuotation = await salesService.updateQuotation(id, data);
      setQuotations(prev => prev.map(q => q.idCotizacion === id ? updatedQuotation : q));
      return { success: true, data: updatedQuotation };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar cotización';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Eliminar cotización
   */
  const deleteQuotation = useCallback(async (id: number) => {
    try {
      await salesService.deleteQuotation(id);
      setQuotations(prev => prev.filter(q => q.idCotizacion !== id));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar cotización';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Cambiar estado de cotización
   */
  const changeQuotationStatus = useCallback(async (id: number, estadoCotizacion: EstadoCotizacion) => {
    try {
      const updatedQuotation = await salesService.changeQuotationStatus(id, estadoCotizacion);
      setQuotations(prev => prev.map(q => q.idCotizacion === id ? updatedQuotation : q));
      return { success: true, data: updatedQuotation };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cambiar estado';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Aceptar cotización
   */
  const acceptQuotation = useCallback(async (id: number) => {
    try {
      const updatedQuotation = await salesService.acceptQuotation(id);
      setQuotations(prev => prev.map(q => q.idCotizacion === id ? updatedQuotation : q));
      return { success: true, data: updatedQuotation };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al aceptar cotización';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Rechazar cotización
   */
  const rejectQuotation = useCallback(async (id: number, motivo?: string) => {
    try {
      const updatedQuotation = await salesService.rejectQuotation(id, motivo);
      setQuotations(prev => prev.map(q => q.idCotizacion === id ? updatedQuotation : q));
      return { success: true, data: updatedQuotation };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al rechazar cotización';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Convertir cotización a venta
   */
  const convertQuotationToSale = useCallback(async (id: number) => {
    try {
      const newSale = await salesService.convertToSale(id);
      setSales(prev => [newSale, ...prev]);
      // Actualizar estado de la cotización
      setQuotations(prev => prev.map(q => 
        q.idCotizacion === id ? { ...q, estadoCotizacion: 'Convertida' as EstadoCotizacion } : q
      ));
      return { success: true, data: newSale };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al convertir cotización';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Enviar cotización por email
   */
  const sendQuotationEmail = useCallback(async (id: number, email?: string) => {
    try {
      await salesService.sendQuotationEmail(id, email);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al enviar cotización';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Generar PDF de cotización
   */
  const generateQuotationPDF = useCallback(async (id: number) => {
    try {
      const blob = await salesService.generateQuotationPDF(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cotizacion-${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al generar PDF';
      return { success: false, error: errorMessage };
    }
  }, []);

  // Cargar ventas al montar el componente
  useEffect(() => {
    loadSales();
  }, [loadSales]);

  return {
    // Estado
    sales,
    quotations,
    loading,
    error,
    
    // Funciones CRUD de Ventas
    loadSales,
    createSale,
    updateSale,
    deleteSale,
    getSaleById,
    
    // Funciones de estado de Ventas
    changeSaleStatus,
    confirmSale,
    markAsPaid,
    cancelSale,
    annulSale,
    
    // Funciones de consulta de Ventas
    getSalesByClient,
    getSalesByEmployee,
    getSalesByStatus,
    getSalesByType,
    getTodaySales,
    getThisMonthSales,
    
    // Utilidades de Ventas
    getStatistics,
    getDashboard,
    searchSales,
    generateInvoice,
    sendInvoiceEmail,
    
    // Funciones CRUD de Cotizaciones
    loadQuotations,
    createQuotation,
    updateQuotation,
    deleteQuotation,
    
    // Funciones de estado de Cotizaciones
    changeQuotationStatus,
    acceptQuotation,
    rejectQuotation,
    convertQuotationToSale,
    
    // Utilidades de Cotizaciones
    sendQuotationEmail,
    generateQuotationPDF,
  };
}

// Re-exportar tipos para facilitar uso
export type { 
  Venta,
  VentaFormData,
  Cotizacion,
  CotizacionFormData,
  VentaFilters,
  CotizacionFilters,
  VentaDashboard,
  EstadoVenta,
  EstadoCotizacion,
  TipoVenta,
  MetodoPago
};