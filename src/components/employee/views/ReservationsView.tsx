import React, { useState } from 'react';
import { Search, Filter, Plus, Calendar, MapPin, User, DollarSign, Eye, Edit2, Download } from 'lucide-react';
import { CreateReservationModal } from '../modals/CreateReservationModal';
import { motion } from 'motion/react';
import type { PermissionSummary } from '../../../services/types/roles.types';

interface ReservationsViewProps {
  permissions: PermissionSummary[];
}

export function ReservationsView({ permissions }: ReservationsViewProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Permisos
  const canCreate = permissions.some(p => p.accion === 'Crear');
  const canEdit = permissions.some(p => p.accion === 'Editar');
  const canDelete = permissions.some(p => p.accion === 'Eliminar');

  /**
   * ⚠️ DATOS HARDCODEADOS COMENTADOS - USAR API REAL
   * Fecha de comentado: 2025-12-16
   */

  /* DATOS HARDCODEADOS COMENTADOS - Usar API real
  // Mock data - Solo reservas del empleado actual
  const myReservations = [
    {
      id: 'RES-2025-045',
      client: { name: 'Juan Pérez', email: 'juan@email.com' },
      destination: 'Cartagena, Colombia',
      dates: { start: '2025-01-15', end: '2025-01-20' },
      travelers: 2,
      package: 'Cartagena Premium',
      total: 2500000,
      status: 'Confirmado',
      createdAt: '2024-12-10',
      services: ['Vuelos', 'Hotel 5★', 'Tours'],
    },
    {
      id: 'RES-2025-046',
      client: { name: 'María García', email: 'maria@email.com' },
      destination: 'San Andrés, Colombia',
      dates: { start: '2025-02-01', end: '2025-02-08' },
      travelers: 4,
      package: 'San Andrés Paradise',
      total: 6400000,
      status: 'Pendiente Pago',
      createdAt: '2024-12-11',
      services: ['Vuelos', 'Hotel 4★', 'All Inclusive'],
    },
    {
      id: 'RES-2025-042',
      client: { name: 'Carlos López', email: 'carlos@email.com' },
      destination: 'Eje Cafetero, Colombia',
      dates: { start: '2025-01-22', end: '2025-01-26' },
      travelers: 3,
      package: 'Eje Cafetero Experience',
      total: 1800000,
      status: 'Confirmado',
      createdAt: '2024-12-08',
      services: ['Transporte', 'Hotel 4★', 'Tours Café'],
    },
    {
      id: 'RES-2024-198',
      client: { name: 'Laura Martínez', email: 'laura@email.com' },
      destination: 'Santa Marta, Colombia',
      dates: { start: '2024-12-20', end: '2024-12-25' },
      travelers: 2,
      package: 'Santa Marta Beach',
      total: 2100000,
      status: 'Completado',
      createdAt: '2024-11-15',
      services: ['Vuelos', 'Hotel 5★', 'Desayuno'],
    },
  ];
  */ // FIN DATOS HARDCODEADOS COMENTADOS

  // ⚠️ Array vacío - Usar API real para obtener reservas del empleado
  const myReservations: any[] = [];

  const getStatusConfig = (status: string) => {
    const configs = {
      'Confirmado': { color: 'bg-green-100 text-green-700 border-green-300', icon: '✓' },
      'Pendiente Pago': { color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: '⏳' },
      'En Proceso': { color: 'bg-blue-100 text-blue-700 border-blue-300', icon: '⚙️' },
      'Completado': { color: 'bg-gray-100 text-gray-700 border-gray-300', icon: '✔️' },
      'Cancelado': { color: 'bg-red-100 text-red-700 border-red-300', icon: '✗' },
    };
    return configs[status as keyof typeof configs] || configs['En Proceso'];
  };

  const filteredReservations = myReservations.filter(res => {
    const matchesSearch = res.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         res.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         res.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || res.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    active: myReservations.filter(r => r.status === 'Confirmado' || r.status === 'Pendiente Pago').length,
    pending: myReservations.filter(r => r.status === 'Pendiente Pago').length,
    completed: myReservations.filter(r => r.status === 'Completado').length,
    totalRevenue: myReservations.reduce((sum, r) => sum + r.total, 0),
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#3A7AFE] to-[#1A2440] rounded-xl p-6 text-white">
          <Calendar className="w-8 h-8 mb-3 opacity-90" />
          <p className="text-3xl font-bold mb-1">{stats.active}</p>
          <p className="text-blue-100 text-sm">Reservas Activas</p>
        </div>
        <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl p-6 text-white">
          <DollarSign className="w-8 h-8 mb-3 opacity-90" />
          <p className="text-3xl font-bold mb-1">{stats.pending}</p>
          <p className="text-yellow-100 text-sm">Pendientes Pago</p>
        </div>
        <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-6 text-white">
          <Calendar className="w-8 h-8 mb-3 opacity-90" />
          <p className="text-3xl font-bold mb-1">{stats.completed}</p>
          <p className="text-green-100 text-sm">Completadas</p>
        </div>
        <div className="bg-gradient-to-br from-[#1A2440] to-[#0F172A] rounded-xl p-6 text-white">
          <DollarSign className="w-8 h-8 mb-3 opacity-90" />
          <p className="text-3xl font-bold mb-1">${(stats.totalRevenue / 1000000).toFixed(1)}M</p>
          <p className="text-gray-100 text-sm">Valor Total</p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full md:w-auto flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por reserva, cliente o destino..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="Confirmado">Confirmado</option>
              <option value="Pendiente Pago">Pendiente Pago</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Completado">Completado</option>
            </select>
          </div>

          {canCreate && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2.5 bg-gradient-to-r from-[#3A7AFE] to-[#2868ec] text-white font-medium rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus size={20} />
              Nueva Reserva
            </button>
          )}
        </div>
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        {filteredReservations.map((reservation, index) => {
          const statusConfig = getStatusConfig(reservation.status);
          
          return (
            <motion.div
              key={reservation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border-2 border-gray-200 hover:border-[#3A7AFE] hover:shadow-lg transition-all overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-[#1A2440]">{reservation.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border-2 ${statusConfig.color}`}>
                        {statusConfig.icon} {reservation.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User size={16} className="text-[#3A7AFE]" />
                        <span className="font-medium">{reservation.client.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={16} className="text-[#3A7AFE]" />
                        <span>{reservation.destination}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={16} className="text-[#3A7AFE]" />
                        <span>{reservation.dates.start} - {reservation.dates.end}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#3A7AFE]">
                      ${reservation.total.toLocaleString('es-CO')}
                    </p>
                    <p className="text-sm text-gray-600">{reservation.travelers} viajeros</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Paquete:</span>
                    <span className="text-sm font-medium text-[#1A2440]">{reservation.package}</span>
                    <div className="flex gap-1 ml-3">
                      {reservation.services.map((service, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="p-2 text-[#3A7AFE] hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye size={20} />
                    </button>
                    {canEdit && (
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Edit2 size={20} />
                      </button>
                    )}
                    <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                      <Download size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredReservations.length === 0 && (
        <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No se encontraron reservas</h3>
          <p className="text-gray-500">
            {searchQuery || filterStatus !== 'all' 
              ? 'Intenta cambiar los filtros de búsqueda'
              : 'Comienza creando tu primera reserva'}
          </p>
        </div>
      )}

      {/* Create Modal */}
      <CreateReservationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          // Aquí recargarías la lista
        }}
      />
    </div>
  );
}