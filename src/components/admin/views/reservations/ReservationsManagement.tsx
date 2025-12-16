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
  Plane,
  Building,
  Package,
  MapPin,
  TrendingUp,
  Calendar,
  CreditCard,
  Clock,
} from 'lucide-react';
import { Reservation, ReservationFormData, ReservationFilters } from './types';
import { ReservationModal } from './ReservationModal';
import { ReservationDetails } from './ReservationDetails';
import { useReservations } from '../../../../hooks/useReservations';
import {
  apiReservationsToUiReservations,
  uiFormToCreateDTO,
  uiFormToUpdateDTO,
  extractReservationId,
} from '../../../../utils/adapters/reservationsAdapter';

export function ReservationsManagement() {
  // Hook de API
  const {
    reservations: apiReservations,
    loading,
    createReservation,
    updateReservation,
    deleteReservation,
    confirmReservation,
    cancelReservation,
    getStatistics,
  } = useReservations();

  // Convertir reservas de API a formato UI
  const reservations = useMemo(() => {
    return apiReservationsToUiReservations(apiReservations);
  }, [apiReservations]);

  const [filters, setFilters] = useState<ReservationFilters>({
    search: '',
    type: 'all',
    status: 'all',
    paymentStatus: 'all',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [showFilters, setShowFilters] = useState(false);

  // Filter reservations
  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const matchesSearch =
        filters.search === '' ||
        reservation.code.toLowerCase().includes(filters.search.toLowerCase()) ||
        reservation.client.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        reservation.client.email.toLowerCase().includes(filters.search.toLowerCase());

      const matchesType = filters.type === 'all' || reservation.type === filters.type;
      const matchesStatus = filters.status === 'all' || reservation.status === filters.status;
      const matchesPayment =
        filters.paymentStatus === 'all' || reservation.paymentStatus === filters.paymentStatus;

      return matchesSearch && matchesType && matchesStatus && matchesPayment;
    });
  }, [reservations, filters]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = reservations.length;
    const confirmed = reservations.filter((r) => r.status === 'confirmed').length;
    const pending = reservations.filter((r) => r.status === 'pending').length;
    const totalRevenue = reservations
      .filter((r) => r.status !== 'cancelled')
      .reduce((sum, r) => sum + r.totalAmount, 0);
    const paidAmount = reservations.reduce((sum, r) => sum + r.paidAmount, 0);
    const pendingAmount = reservations
      .filter((r) => r.status !== 'cancelled')
      .reduce((sum, r) => sum + r.balance, 0);

    return {
      total,
      confirmed,
      pending,
      totalRevenue,
      paidAmount,
      pendingAmount,
    };
  }, [reservations]);

  const handleCreateReservation = () => {
    setSelectedReservation(undefined);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsDetailsOpen(true);
  };

  const handleDeleteReservation = async (id: string) => {
    if (confirm('¿Está seguro de eliminar esta reserva?')) {
      const numId = extractReservationId(id);
      const result = await deleteReservation(numId);

      if (result.success) {
        toast.success('Reserva eliminada exitosamente');
      } else {
        toast.error(result.error || 'Error al eliminar reserva');
      }
    }
  };

  const handleSaveReservation = async (data: ReservationFormData) => {
    if (modalMode === 'create') {
      // Crear nueva reserva
      const createDTO = uiFormToCreateDTO(data);
      const result = await createReservation(createDTO);

      if (result.success) {
        toast.success('Reserva creada exitosamente');
        setIsModalOpen(false);
      } else {
        toast.error(result.error || 'Error al crear reserva');
        throw new Error(result.error);
      }
    } else {
      // Actualizar reserva existente
      if (selectedReservation) {
        const numId = extractReservationId(selectedReservation.id);
        const updateDTO = uiFormToUpdateDTO(data);
        const result = await updateReservation(numId, updateDTO);

        if (result.success) {
          toast.success('Reserva actualizada exitosamente');
          setIsModalOpen(false);
        } else {
          toast.error(result.error || 'Error al actualizar reserva');
          throw new Error(result.error);
        }
      }
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      flight: Plane,
      hotel: Building,
      package: Package,
      transport: MapPin,
    };
    return icons[type as keyof typeof icons] || Plane;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      flight: 'blue',
      hotel: 'green',
      package: 'orange',
      transport: 'purple',
    };
    return colors[type as keyof typeof colors] || 'blue';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'yellow',
      confirmed: 'blue',
      cancelled: 'red',
      completed: 'green',
    };
    return colors[status as keyof typeof colors] || 'gray';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      pending: 'yellow',
      partial: 'orange',
      paid: 'green',
      refunded: 'purple',
    };
    return colors[status as keyof typeof colors] || 'gray';
  };

  const columns = [
    {
      key: 'code',
      label: 'Código',
      render: (reservation: Reservation) => (
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-900">{reservation.code}</div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (reservation: Reservation) => {
        const Icon = getTypeIcon(reservation.type);
        return (
          <Badge variant={getTypeColor(reservation.type) as any} size="sm">
            <Icon size={14} />
            {reservation.type === 'flight' && 'Vuelo'}
            {reservation.type === 'hotel' && 'Hotel'}
            {reservation.type === 'package' && 'Paquete'}
            {reservation.type === 'transport' && 'Transporte'}
          </Badge>
        );
      },
    },
    {
      key: 'client',
      label: 'Cliente',
      render: (reservation: Reservation) => (
        <div>
          <div className="text-sm text-gray-900">{reservation.client.name}</div>
          <div className="text-xs text-gray-500">{reservation.client.email}</div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (reservation: Reservation) => (
        <Badge variant={getStatusColor(reservation.status) as any} size="sm">
          {reservation.status === 'pending' && 'Pendiente'}
          {reservation.status === 'confirmed' && 'Confirmada'}
          {reservation.status === 'cancelled' && 'Cancelada'}
          {reservation.status === 'completed' && 'Completada'}
        </Badge>
      ),
    },
    {
      key: 'payment',
      label: 'Pago',
      render: (reservation: Reservation) => (
        <div>
          <Badge variant={getPaymentStatusColor(reservation.paymentStatus) as any} size="sm">
            {reservation.paymentStatus === 'pending' && 'Pendiente'}
            {reservation.paymentStatus === 'partial' && 'Parcial'}
            {reservation.paymentStatus === 'paid' && 'Pagado'}
            {reservation.paymentStatus === 'refunded' && 'Reembolsado'}
          </Badge>
          <div className="text-xs text-gray-500 mt-1">
            ${reservation.paidAmount.toLocaleString('es-CO')} / $
            {reservation.totalAmount.toLocaleString('es-CO')}
          </div>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Fecha',
      render: (reservation: Reservation) => (
        <div className="text-sm text-gray-600">
          {new Date(reservation.createdAt).toLocaleDateString('es-CO', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (reservation: Reservation) => (
        <div className="flex gap-1">
          <button
            onClick={() => handleViewDetails(reservation)}
            className="p-1.5 text-gray-600 hover:text-[#3A7AFE] hover:bg-gray-100 rounded transition-colors"
            title="Ver detalles"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleEditReservation(reservation)}
            className="p-1.5 text-gray-600 hover:text-[#3A7AFE] hover:bg-gray-100 rounded transition-colors"
            title="Editar"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDeleteReservation(reservation.id)}
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
          <p className="mt-4 text-gray-600">Cargando reservas...</p>
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
            <p className="text-sm text-gray-600">Total Reservas</p>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar size={18} className="text-[#3A7AFE]" />
            </div>
          </div>
          <p className="text-2xl text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500 mt-1">{stats.confirmed} confirmadas</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Pendientes</p>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock size={18} className="text-yellow-600" />
            </div>
          </div>
          <p className="text-2xl text-gray-900">{stats.pending}</p>
          <p className="text-xs text-gray-500 mt-1">Requieren atención</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Ingresos Totales</p>
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp size={18} className="text-green-600" />
            </div>
          </div>
          <p className="text-2xl text-gray-900">
            ${(stats.totalRevenue / 1000000).toFixed(1)}M
          </p>
          <p className="text-xs text-gray-500 mt-1">COP</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Por Cobrar</p>
            <div className="p-2 bg-orange-50 rounded-lg">
              <CreditCard size={18} className="text-orange-600" />
            </div>
          </div>
          <p className="text-2xl text-gray-900">
            ${(stats.pendingAmount / 1000000).toFixed(1)}M
          </p>
          <p className="text-xs text-gray-500 mt-1">COP</p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por código, cliente o email..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              icon={<Search size={18} />}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-gray-100' : ''}
            >
              <Filter size={18} />
              Filtros
            </Button>
            <Button variant="outline">
              <Download size={18} />
              Exportar
            </Button>
            <Button variant="primary" onClick={handleCreateReservation}>
              <Plus size={18} />
              Nueva Reserva
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <Select
              label="Tipo"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value as any })}
              options={[
                { value: 'all', label: 'Todos los tipos' },
                { value: 'flight', label: '✈️ Vuelo' },
                { value: 'hotel', label: '🏨 Hotel' },
                { value: 'package', label: '📦 Paquete' },
                { value: 'transport', label: '🚗 Transporte' },
              ]}
            />
            <Select
              label="Estado"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
              options={[
                { value: 'all', label: 'Todos los estados' },
                { value: 'pending', label: 'Pendiente' },
                { value: 'confirmed', label: 'Confirmada' },
                { value: 'cancelled', label: 'Cancelada' },
                { value: 'completed', label: 'Completada' },
              ]}
            />
            <Select
              label="Estado de Pago"
              value={filters.paymentStatus}
              onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value as any })}
              options={[
                { value: 'all', label: 'Todos los pagos' },
                { value: 'pending', label: 'Pendiente' },
                { value: 'partial', label: 'Parcial' },
                { value: 'paid', label: 'Pagado' },
                { value: 'refunded', label: 'Reembolsado' },
              ]}
            />
          </div>
        )}

        {/* Table */}
        <div className="mt-6">
          {filteredReservations.length > 0 ? (
            <SimpleTable columns={columns} data={filteredReservations} />
          ) : (
            <EmptyState
              icon={<Calendar size={48} />}
              title="No se encontraron reservas"
              description={
                filters.search || filters.type !== 'all' || filters.status !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza creando tu primera reserva'
              }
              action={
                <Button variant="primary" onClick={handleCreateReservation}>
                  <Plus size={18} />
                  Nueva Reserva
                </Button>
              }
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveReservation}
        reservation={selectedReservation}
        mode={modalMode}
      />

      <ReservationDetails
        reservation={selectedReservation || null}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onEdit={handleEditReservation}
        onDelete={handleDeleteReservation}
      />
    </div>
  );
}
