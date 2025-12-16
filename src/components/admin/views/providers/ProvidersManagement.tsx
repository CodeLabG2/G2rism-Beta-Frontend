import React, { useState, useEffect } from 'react';
import { Card, MetricCard } from '../../../ui/Card';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';
import { Select } from '../../../ui/Select';
import { Badge } from '../../../ui/Badge';
import { Modal } from '../../../ui/Modal';
import { toast } from '../../../ui/Toast';
import { DataTable } from '../../DataTable';
import { EmptyState } from '../../../ui/EmptyState';
import {
  Plus,
  Search,
  Filter,
  Building2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  FileText,
  TrendingUp,
  Edit,
  Trash2,
  Eye,
  Briefcase,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Proveedor, TipoProveedor, EstadoProveedor, ProveedorFilters } from './types';
import { useSuppliers } from '../../../../hooks/useSuppliers';
import { ProviderModal } from './ProviderModal';
import { ProviderDetails } from './ProviderDetails';

export function ProvidersManagement() {
  console.log('ProvidersManagement: Component rendering...');
  
  // Hook de API
  const {
    suppliers: providers,
    loading,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getStatistics,
  } = useSuppliers();
  
  console.log('ProvidersManagement: providers =', providers);
  console.log('ProvidersManagement: loading =', loading);
  
  const [filteredProviders, setFilteredProviders] = useState<Proveedor[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ProveedorFilters>({});
  const [activeTab, setActiveTab] = useState<'providers' | 'contracts'>('providers');
  
  // Modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Proveedor | null>(null);
  
  // Métricas
  const [metrics, setMetrics] = useState({
    total: 0,
    activos: 0,
    contratos: 0,
    calificacionPromedio: 0,
  });

  // Actualizar proveedores filtrados cuando cambia providers
  useEffect(() => {
    setFilteredProviders(providers);
    calculateMetrics(providers);
  }, [providers]);

  const calculateMetrics = (data: Proveedor[]) => {
    const total = data.length;
    const activos = data.filter((p) => p.estado === 'Activo').length;
    const sumCalificaciones = data.reduce((sum, p) => sum + p.calificacion, 0);
    const calificacionPromedio = total > 0 ? sumCalificaciones / total : 0;

    setMetrics({
      total,
      activos,
      contratos: 0, // Se actualizará cuando se carguen contratos
      calificacionPromedio,
    });
  };

  // Aplicar filtros y búsqueda
  useEffect(() => {
    let filtered = [...providers];

    // Búsqueda por término
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.nombreEmpresa.toLowerCase().includes(term) ||
          p.nombreContacto.toLowerCase().includes(term) ||
          p.nitRut.toLowerCase().includes(term) ||
          p.correoElectronico.toLowerCase().includes(term)
      );
    }

    // Filtro por tipo
    if (filters.tipoProveedor) {
      filtered = filtered.filter((p) => p.tipoProveedor === filters.tipoProveedor);
    }

    // Filtro por estado
    if (filters.estado) {
      filtered = filtered.filter((p) => p.estado === filters.estado);
    }

    // Filtro por ciudad
    if (filters.ciudad) {
      filtered = filtered.filter((p) => p?.ciudad?.toLowerCase().includes(filters.ciudad!.toLowerCase()));
    }

    // Filtro por calificación mínima
    if (filters.calificacionMin) {
      filtered = filtered.filter((p) => p.calificacion >= filters.calificacionMin!);
    }

    setFilteredProviders(filtered);
  }, [searchTerm, filters, providers]);

  const handleCreate = async (data: any) => {
    const result = await createSupplier(data);
    
    if (result.success) {
      toast.success('Proveedor creado exitosamente');
      setShowCreateModal(false);
    } else {
      toast.error(result.error || 'Error al crear proveedor');
      throw new Error(result.error);
    }
  };

  const handleEdit = async (data: any) => {
    if (!selectedProvider) return;
    
    const result = await updateSupplier(selectedProvider.idProveedor, data);
    
    if (result.success) {
      toast.success('Proveedor actualizado exitosamente');
      setShowEditModal(false);
      setSelectedProvider(null);
    } else {
      toast.error(result.error || 'Error al actualizar proveedor');
      throw new Error(result.error);
    }
  };

  const handleDelete = async (provider: Proveedor) => {
    if (!window.confirm(`¿Estás seguro de eliminar el proveedor "${provider.nombreEmpresa}"?`)) {
      return;
    }

    const result = await deleteSupplier(provider.idProveedor);
    
    if (result.success) {
      toast.success('Proveedor eliminado exitosamente');
    } else {
      toast.error(result.error || 'Error al eliminar proveedor');
    }
  };

  const handleViewDetails = (provider: Proveedor) => {
    setSelectedProvider(provider);
    setShowDetailsModal(true);
  };

  const handleEditClick = (provider: Proveedor) => {
    setSelectedProvider(provider);
    setShowEditModal(true);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const getTipoIcon = (tipo: TipoProveedor) => {
    const icons = {
      Hotel: '🏨',
      Aerolinea: '✈️',
      Transporte: '🚗',
      Servicios: '🎯',
      Mixto: '🔀',
    };
    return icons[tipo];
  };

  const getTipoColor = (tipo: TipoProveedor) => {
    const colors = {
      Hotel: '#3A7AFE',
      Aerolinea: '#8B5CF6',
      Transporte: '#10B981',
      Servicios: '#F59E0B',
      Mixto: '#6B7280',
    };
    return colors[tipo];
  };

  const getEstadoVariant = (estado: EstadoProveedor) => {
    const variants = {
      Activo: 'success' as const,
      Inactivo: 'gray' as const,
      Suspendido: 'danger' as const,
    };
    return variants[estado];
  };

  const columns = [
    {
      key: 'nombreEmpresa',
      label: 'Proveedor',
      render: (provider: Proveedor) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getTipoIcon(provider.tipoProveedor)}</span>
            <div>
              <p className="font-medium">{provider.nombreEmpresa}</p>
              <p className="text-sm text-gray-600">{provider.nombreContacto}</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'tipoProveedor',
      label: 'Tipo',
      render: (provider: Proveedor) => (
        <Badge
          variant="default"
          style={{ backgroundColor: `${getTipoColor(provider.tipoProveedor)}15`, color: getTipoColor(provider.tipoProveedor) }}
        >
          {provider.tipoProveedor}
        </Badge>
      ),
    },
    {
      key: 'ubicacion',
      label: 'Ubicación',
      render: (provider: Proveedor) => (
        <div>
          <p>{provider?.ciudad || 'N/A'}</p>
          <p className="text-sm text-gray-600">{provider?.pais || 'N/A'}</p>
        </div>
      ),
    },
    {
      key: 'contacto',
      label: 'Contacto',
      render: (provider: Proveedor) => (
        <div className="text-sm">
          <p>{provider?.telefono || 'N/A'}</p>
          <p className="text-gray-600">{provider?.correoElectronico || 'N/A'}</p>
        </div>
      ),
    },
    {
      key: 'calificacion',
      label: 'Calificación',
      render: (provider: Proveedor) => (
        <div className="flex items-center gap-1">
          <Star size={16} className="text-yellow-500 fill-yellow-500" />
          <span className="font-medium">{provider.calificacion?.toFixed(1) || '0.0'}</span>
        </div>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (provider: Proveedor) => (
        <Badge variant={getEstadoVariant(provider.estado)}>{provider.estado}</Badge>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (provider: Proveedor) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleViewDetails(provider)}>
            <Eye size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleEditClick(provider)}>
            <Edit size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(provider)}>
            <Trash2 size={16} className="text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  const metricsData = [
    {
      icon: <Building2 size={24} />,
      value: metrics.total.toString(),
      label: 'Total Proveedores',
      change: { value: 0, positive: true },
      color: '#3A7AFE',
    },
    {
      icon: <CheckCircle size={24} />,
      value: metrics.activos.toString(),
      label: 'Proveedores Activos',
      change: { value: 0, positive: true },
      color: '#10B981',
    },
    {
      icon: <FileText size={24} />,
      value: metrics.contratos.toString(),
      label: 'Contratos Vigentes',
      change: { value: 0, positive: true },
      color: '#F59E0B',
    },
    {
      icon: <Star size={24} />,
      value: (metrics.calificacionPromedio || 0).toFixed(1),
      label: 'Calificación Promedio',
      change: { value: 0, positive: true },
      color: '#8B5CF6',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A7AFE] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando proveedores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3>Gestión de Proveedores</h3>
          <p className="text-gray-600 mt-1">
            Administra los proveedores de servicios turísticos
          </p>
        </div>
        <Button icon={<Plus size={18} />} onClick={() => setShowCreateModal(true)}>
          Nuevo Proveedor
        </Button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MetricCard {...metric} />
          </motion.div>
        ))}
      </div>

      {/* Filtros y Búsqueda */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                icon={<Search size={18} />}
                placeholder="Buscar por nombre, NIT, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant={showFilters ? 'primary' : 'outline'}
              icon={<Filter size={18} />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filtros
            </Button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t"
            >
              <Select
                label="Tipo de Proveedor"
                value={filters.tipoProveedor || ''}
                onChange={(e) =>
                  setFilters({ ...filters, tipoProveedor: e.target.value as TipoProveedor || undefined })
                }
              >
                <option value="">Todos</option>
                <option value="Hotel">Hotel</option>
                <option value="Aerolinea">Aerolínea</option>
                <option value="Transporte">Transporte</option>
                <option value="Servicios">Servicios</option>
                <option value="Mixto">Mixto</option>
              </Select>

              <Select
                label="Estado"
                value={filters.estado || ''}
                onChange={(e) =>
                  setFilters({ ...filters, estado: e.target.value as EstadoProveedor || undefined })
                }
              >
                <option value="">Todos</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Suspendido">Suspendido</option>
              </Select>

              <Input
                label="Ciudad"
                placeholder="Filtrar por ciudad"
                value={filters.ciudad || ''}
                onChange={(e) => setFilters({ ...filters, ciudad: e.target.value || undefined })}
              />

              <div className="flex items-end gap-2">
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Limpiar Filtros
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </Card>

      {/* Tabla de Proveedores */}
      <Card>
        {filteredProviders.length === 0 ? (
          <EmptyState
            icon={<Building2 size={48} />}
            title="No hay proveedores"
            description={
              searchTerm || Object.keys(filters).length > 0
                ? 'No se encontraron proveedores con los filtros aplicados'
                : 'Comienza agregando tu primer proveedor'
            }
            action={
              <Button icon={<Plus size={18} />} onClick={() => setShowCreateModal(true)}>
                Crear Proveedor
              </Button>
            }
          />
        ) : (
          <DataTable columns={columns} data={filteredProviders} />
        )}
      </Card>

      {/* Modales */}
      {showCreateModal && (
        <ProviderModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreate}
        />
      )}

      {showEditModal && selectedProvider && (
        <ProviderModal
          provider={selectedProvider}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProvider(null);
          }}
          onSave={handleEdit}
        />
      )}

      {showDetailsModal && selectedProvider && (
        <ProviderDetails
          provider={selectedProvider}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedProvider(null);
          }}
          onEdit={() => {
            setShowDetailsModal(false);
            setShowEditModal(true);
          }}
          onDelete={() => {
            setShowDetailsModal(false);
            handleDelete(selectedProvider);
          }}
        />
      )}
    </div>
  );
}