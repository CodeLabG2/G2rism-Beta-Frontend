import React, { useState, useMemo } from 'react';
import { SimpleTable } from '../../../ui/SimpleTable';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';
import { Select } from '../../../ui/Select';
import { Badge } from '../../../ui/Badge';
import { EmptyState } from '../../../ui/EmptyState';
import { toast } from '../../../ui/Toast';
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Package as PackageIcon,
  MapPin,
  TrendingUp,
  DollarSign,
  Users,
  Star,
} from 'lucide-react';
import { TourPackage, PackageFormData, PackageFilters, Destination } from './types';
import { PackageModal } from './PackageModal';
import { PackageDetails } from './PackageDetails';
import { usePackages } from '../../../../hooks/usePackages';
import { 
  apiPackagesToUiPackages, 
  uiFormToCreateDTO, 
  uiFormToUpdateDTO,
  extractPackageId 
} from '../../../../utils/adapters/packagesAdapter';

// Mock destinations (temporal hasta que tengamos endpoint de destinos)
const mockDestinations: Destination[] = [
  { id: '1', name: 'San Andrés', country: 'Colombia', description: 'Isla paradisíaca del Caribe' },
  { id: '2', name: 'Cartagena', country: 'Colombia', description: 'Ciudad amurallada colonial' },
  { id: '3', name: 'Eje Cafetero', country: 'Colombia', description: 'Región cafetera de Colombia' },
  { id: '4', name: 'Amazonas', country: 'Colombia', description: 'Selva amazónica colombiana' },
  { id: '5', name: 'Bogotá', country: 'Colombia', description: 'Capital de Colombia' },
  { id: '6', name: 'Tayrona', country: 'Colombia', description: 'Parque Nacional Natural' },
];

export function PackagesManagement() {
  // Hook de API
  const {
    packages: apiPackages,
    loading,
    createPackage,
    updatePackage,
    deletePackage,
    getStatistics,
  } = usePackages();

  // Convertir paquetes de API a formato UI
  const packages = useMemo(() => {
    return apiPackagesToUiPackages(apiPackages);
  }, [apiPackages]);

  const [filters, setFilters] = useState<PackageFilters>({
    search: '',
    destination: 'all',
    category: 'all',
    status: 'all',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [showFilters, setShowFilters] = useState(false);

  // Filter packages
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchesSearch =
        filters.search === '' ||
        pkg.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        pkg.code.toLowerCase().includes(filters.search.toLowerCase()) ||
        pkg.destination.name.toLowerCase().includes(filters.search.toLowerCase());

      const matchesDestination =
        filters.destination === 'all' || pkg.destination.id === filters.destination;
      const matchesCategory = filters.category === 'all' || pkg.category === filters.category;
      const matchesStatus = filters.status === 'all' || pkg.status === filters.status;

      const matchesMinDuration = !filters.minDuration || pkg.duration >= filters.minDuration;
      const matchesMaxDuration = !filters.maxDuration || pkg.duration <= filters.maxDuration;
      const matchesMinPrice = !filters.minPrice || pkg.basePrice >= filters.minPrice;
      const matchesMaxPrice = !filters.maxPrice || pkg.basePrice <= filters.maxPrice;

      return (
        matchesSearch &&
        matchesDestination &&
        matchesCategory &&
        matchesStatus &&
        matchesMinDuration &&
        matchesMaxDuration &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });
  }, [packages, filters]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = packages.length;
    const active = packages.filter((p) => p.status === 'active').length;
    const totalSold = packages.reduce((sum, p) => sum + p.totalSold, 0);
    const totalRevenue = packages.reduce((sum, p) => sum + p.totalSold * p.basePrice, 0);

    return { total, active, totalSold, totalRevenue };
  }, [packages]);

  const handleCreatePackage = () => {
    setSelectedPackage(undefined);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditPackage = (pkg: TourPackage) => {
    setSelectedPackage(pkg);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleViewDetails = (pkg: TourPackage) => {
    setSelectedPackage(pkg);
    setIsDetailsOpen(true);
  };

  const handleDeletePackage = async (id: string) => {
    if (confirm('¿Está seguro de eliminar este paquete turístico?')) {
      const numId = extractPackageId(id);
      const result = await deletePackage(numId);
      
      if (result.success) {
        toast.success('Paquete eliminado exitosamente');
      } else {
        toast.error(result.error || 'Error al eliminar paquete');
      }
    }
  };

  const handleSavePackage = async (data: PackageFormData) => {
    if (modalMode === 'create') {
      // Crear nuevo paquete
      const createDTO = uiFormToCreateDTO(data);
      const result = await createPackage(createDTO);
      
      if (result.success) {
        toast.success('Paquete creado exitosamente');
        setIsModalOpen(false);
      } else {
        toast.error(result.error || 'Error al crear paquete');
        throw new Error(result.error);
      }
    } else {
      // Actualizar paquete existente
      if (selectedPackage) {
        const numId = extractPackageId(selectedPackage.id);
        const updateDTO = uiFormToUpdateDTO(data);
        const result = await updatePackage(numId, updateDTO);
        
        if (result.success) {
          toast.success('Paquete actualizado exitosamente');
          setIsModalOpen(false);
        } else {
          toast.error(result.error || 'Error al actualizar paquete');
          throw new Error(result.error);
        }
      }
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      adventure: 'Aventura',
      relaxation: 'Relajación',
      cultural: 'Cultural',
      family: 'Familiar',
      romantic: 'Romántico',
      business: 'Negocios',
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      adventure: 'warning',
      relaxation: 'blue',
      cultural: 'purple',
      family: 'green',
      romantic: 'red',
      business: 'gray',
    };
    return colors[category as keyof typeof colors] || 'gray';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'green',
      inactive: 'gray',
      draft: 'yellow',
      archived: 'red',
    };
    return colors[status as keyof typeof colors] || 'gray';
  };

  const columns = [
    {
      key: 'thumbnail',
      label: 'Imagen',
      render: (pkg: TourPackage) => (
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={pkg.thumbnailImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'}
            alt={pkg.name}
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      key: 'info',
      label: 'Paquete',
      render: (pkg: TourPackage) => (
        <div>
          <div className="text-sm text-gray-900 mb-1">{pkg.name}</div>
          <div className="flex items-center gap-2">
            <Badge variant={getCategoryColor(pkg.category) as any} size="sm">
              {getCategoryLabel(pkg.category)}
            </Badge>
            <span className="text-xs text-gray-500">{pkg.code}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'destination',
      label: 'Destino',
      render: (pkg: TourPackage) => (
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-gray-400" />
          <span className="text-sm text-gray-900">{pkg.destination.name}</span>
        </div>
      ),
    },
    {
      key: 'duration',
      label: 'Duración',
      render: (pkg: TourPackage) => (
        <div className="text-sm text-gray-900">
          {pkg.duration} días / {pkg.nights} noches
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Precio Base',
      render: (pkg: TourPackage) => (
        <div>
          <div className="text-sm text-gray-900">
            ${(pkg.basePrice / 1000000).toFixed(1)}M
          </div>
          <div className="text-xs text-gray-500">COP por persona</div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (pkg: TourPackage) => (
        <div>
          <Badge variant={getStatusColor(pkg.status) as any} size="sm">
            {pkg.status === 'active' && 'Activo'}
            {pkg.status === 'inactive' && 'Inactivo'}
            {pkg.status === 'draft' && 'Borrador'}
            {pkg.status === 'archived' && 'Archivado'}
          </Badge>
          <div className="text-xs text-gray-500 mt-1">
            {pkg.availableSpots} cupos disponibles
          </div>
        </div>
      ),
    },
    {
      key: 'stats',
      label: 'Estadísticas',
      render: (pkg: TourPackage) => (
        <div>
          <div className="flex items-center gap-1 text-sm text-gray-900">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            {pkg.rating.toFixed(1)} ({pkg.reviewsCount})
          </div>
          <div className="text-xs text-gray-500 mt-1">{pkg.totalSold} vendidos</div>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (pkg: TourPackage) => (
        <div className="flex gap-1">
          <button
            onClick={() => handleViewDetails(pkg)}
            className="p-1.5 text-gray-600 hover:text-[#3A7AFE] hover:bg-gray-100 rounded transition-colors"
            title="Ver detalles"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleEditPackage(pkg)}
            className="p-1.5 text-gray-600 hover:text-[#3A7AFE] hover:bg-gray-100 rounded transition-colors"
            title="Editar"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDeletePackage(pkg.id)}
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
          <p className="mt-4 text-gray-600">Cargando paquetes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Paquetes</p>
            <div className="p-2 bg-blue-50 rounded-lg">
              <PackageIcon size={18} className="text-[#3A7AFE]" />
            </div>
          </div>
          <p className="text-2xl text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500 mt-1">{stats.active} activos</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Paquetes Vendidos</p>
            <div className="p-2 bg-green-50 rounded-lg">
              <Users size={18} className="text-green-600" />
            </div>
          </div>
          <p className="text-2xl text-gray-900">{stats.totalSold}</p>
          <p className="text-xs text-gray-500 mt-1">Este año</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Ingresos Totales</p>
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUp size={18} className="text-purple-600" />
            </div>
          </div>
          <p className="text-2xl text-gray-900">
            ${(stats.totalRevenue / 1000000).toFixed(1)}M
          </p>
          <p className="text-xs text-gray-500 mt-1">COP</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Promedio Precio</p>
            <div className="p-2 bg-orange-50 rounded-lg">
              <DollarSign size={18} className="text-orange-600" />
            </div>
          </div>
          <p className="text-2xl text-gray-900">
            ${stats.totalSold > 0 ? ((stats.totalRevenue / stats.totalSold) / 1000000).toFixed(1) : '0'}M
          </p>
          <p className="text-xs text-gray-500 mt-1">COP por venta</p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar paquetes por nombre, código o destino..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              icon={<Search size={18} />}
            />
          </div>
          <div className="flex gap-2">
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
            <Button variant="primary" onClick={handleCreatePackage}>
              <Plus size={18} />
              Nuevo Paquete
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <Select
              label="Destino"
              value={filters.destination}
              onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
              options={[
                { value: 'all', label: 'Todos los destinos' },
                ...mockDestinations.map((d) => ({ value: d.id, label: d.name })),
              ]}
            />
            <Select
              label="Categoría"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value as any })}
              options={[
                { value: 'all', label: 'Todas las categorías' },
                { value: 'adventure', label: 'Aventura' },
                { value: 'relaxation', label: 'Relajación' },
                { value: 'cultural', label: 'Cultural' },
                { value: 'family', label: 'Familiar' },
                { value: 'romantic', label: 'Romántico' },
                { value: 'business', label: 'Negocios' },
              ]}
            />
            <Select
              label="Estado"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
              options={[
                { value: 'all', label: 'Todos los estados' },
                { value: 'active', label: 'Activo' },
                { value: 'inactive', label: 'Inactivo' },
                { value: 'draft', label: 'Borrador' },
                { value: 'archived', label: 'Archivado' },
              ]}
            />
            <div>
              <label className="block text-sm text-gray-700 mb-1">Duración (días)</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minDuration || ''}
                  onChange={(e) =>
                    setFilters({ ...filters, minDuration: Number(e.target.value) || undefined })
                  }
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxDuration || ''}
                  onChange={(e) =>
                    setFilters({ ...filters, maxDuration: Number(e.target.value) || undefined })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="mt-6">
          {filteredPackages.length > 0 ? (
            <SimpleTable columns={columns} data={filteredPackages} />
          ) : (
            <EmptyState
              icon={<PackageIcon size={48} />}
              title="No se encontraron paquetes"
              description={
                filters.search ||
                filters.destination !== 'all' ||
                filters.category !== 'all' ||
                filters.status !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza creando tu primer paquete turístico'
              }
              action={
                <Button variant="primary" onClick={handleCreatePackage}>
                  <Plus size={18} />
                  Nuevo Paquete
                </Button>
              }
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <PackageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePackage}
        package={selectedPackage}
        mode={modalMode}
        destinations={mockDestinations}
      />

      <PackageDetails
        package={selectedPackage || null}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onEdit={handleEditPackage}
        onDelete={handleDeletePackage}
      />
    </div>
  );
}
