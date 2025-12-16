import React, { useState } from 'react';
import { Search, Plus, Users, Mail, Phone, MapPin, Award, Eye, Edit2, MessageCircle } from 'lucide-react';
import { ClientDetailsModal } from '../modals/ClientDetailsModal';
import { motion } from 'motion/react';
import type { PermissionSummary } from '../../../services/types/roles.types';

interface ClientsViewProps {
  permissions: PermissionSummary[];
}

export function ClientsView({ permissions }: ClientsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  const canCreate = permissions.some(p => p.accion === 'Crear');
  const canEdit = permissions.some(p => p.accion === 'Editar');

  // Mock data - Solo clientes asignados al empleado
  const myClients = [
    {
      id: 'CLI-001',
      name: 'Juan Pérez',
      email: 'juan.perez@email.com',
      phone: '300-123-4567',
      address: 'Calle 123 #45-67, Bogotá',
      category: 'Gold',
      points: 850,
      totalSpent: 7500000,
      reservations: 3,
      lastReservation: '2024-12-10',
      status: 'Activo',
    },
    {
      id: 'CLI-002',
      name: 'María García',
      email: 'maria.garcia@email.com',
      phone: '301-234-5678',
      address: 'Carrera 45 #23-12, Medellín',
      category: 'Platinum',
      points: 1250,
      totalSpent: 12000000,
      reservations: 5,
      lastReservation: '2024-12-11',
      status: 'Activo',
    },
    {
      id: 'CLI-003',
      name: 'Carlos López',
      email: 'carlos.lopez@email.com',
      phone: '302-345-6789',
      address: 'Avenida 32 #78-90, Cali',
      category: 'Silver',
      points: 450,
      totalSpent: 3200000,
      reservations: 2,
      lastReservation: '2024-12-08',
      status: 'Activo',
    },
    {
      id: 'CLI-004',
      name: 'Laura Martínez',
      email: 'laura.martinez@email.com',
      phone: '303-456-7890',
      address: 'Calle 56 #12-34, Barranquilla',
      category: 'Gold',
      points: 920,
      totalSpent: 5800000,
      reservations: 3,
      lastReservation: '2024-12-05',
      status: 'Activo',
    },
    {
      id: 'CLI-005',
      name: 'Pedro Sánchez',
      email: 'pedro.sanchez@email.com',
      phone: '304-567-8901',
      address: 'Carrera 78 #45-23, Cartagena',
      category: 'Silver',
      points: 380,
      totalSpent: 2400000,
      reservations: 1,
      lastReservation: '2024-11-28',
      status: 'Inactivo',
    },
  ];

  const getCategoryConfig = (category: string) => {
    const configs = {
      Platinum: { color: 'from-purple-500 to-purple-700', text: 'text-purple-700', bg: 'bg-purple-100', border: 'border-purple-300' },
      Gold: { color: 'from-yellow-500 to-yellow-700', text: 'text-yellow-700', bg: 'bg-yellow-100', border: 'border-yellow-300' },
      Silver: { color: 'from-gray-400 to-gray-600', text: 'text-gray-700', bg: 'bg-gray-100', border: 'border-gray-300' },
    };
    return configs[category as keyof typeof configs] || configs.Silver;
  };

  const filteredClients = myClients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery);
    const matchesCategory = filterCategory === 'all' || client.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: myClients.length,
    active: myClients.filter(c => c.status === 'Activo').length,
    platinum: myClients.filter(c => c.category === 'Platinum').length,
    gold: myClients.filter(c => c.category === 'Gold').length,
    silver: myClients.filter(c => c.category === 'Silver').length,
  };

  const handleClientClick = (client: any) => {
    setSelectedClient(client);
    setShowClientDetails(true);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-[#3A7AFE] to-[#1A2440] rounded-xl p-6 text-white">
          <Users className="w-8 h-8 mb-3 opacity-90" />
          <p className="text-3xl font-bold mb-1">{stats.total}</p>
          <p className="text-blue-100 text-sm">Mis Clientes</p>
        </div>
        <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-6 text-white">
          <Award className="w-8 h-8 mb-3 opacity-90" />
          <p className="text-3xl font-bold mb-1">{stats.active}</p>
          <p className="text-green-100 text-sm">Activos</p>
        </div>
        <div className="bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-xl p-6 text-white">
          <Award className="w-8 h-8 mb-3 opacity-90" />
          <p className="text-3xl font-bold mb-1">{stats.platinum}</p>
          <p className="text-purple-100 text-sm">Platinum</p>
        </div>
        <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl p-6 text-white">
          <Award className="w-8 h-8 mb-3 opacity-90" />
          <p className="text-3xl font-bold mb-1">{stats.gold}</p>
          <p className="text-yellow-100 text-sm">Gold</p>
        </div>
        <div className="bg-gradient-to-br from-[#6B7280] to-[#4B5563] rounded-xl p-6 text-white">
          <Award className="w-8 h-8 mb-3 opacity-90" />
          <p className="text-3xl font-bold mb-1">{stats.silver}</p>
          <p className="text-gray-100 text-sm">Silver</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full md:w-auto flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar cliente por nombre, email o teléfono..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent"
            >
              <option value="all">Todas las categorías</option>
              <option value="Platinum">Platinum</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
            </select>
          </div>

          {canCreate && (
            <button className="px-6 py-2.5 bg-gradient-to-r from-[#3A7AFE] to-[#2868ec] text-white font-medium rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
              <Plus size={20} />
              Nuevo Cliente
            </button>
          )}
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client, index) => {
          const categoryConfig = getCategoryConfig(client.category);
          
          return (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl border-2 border-gray-200 hover:border-[#3A7AFE] hover:shadow-xl transition-all overflow-hidden group cursor-pointer"
              onClick={() => handleClientClick(client)}
            >
              {/* Header with Category Badge */}
              <div className={`h-3 bg-gradient-to-r ${categoryConfig.color}`} />
              
              <div className="p-6">
                {/* Avatar and Name */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${categoryConfig.color} rounded-full flex items-center justify-center ring-4 ring-white`}>
                    <span className="text-white font-bold text-xl">
                      {client.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#1A2440] group-hover:text-[#3A7AFE] transition-colors">
                      {client.name}
                    </h3>
                    <span className={`inline-block mt-1 px-3 py-1 ${categoryConfig.bg} ${categoryConfig.text} border ${categoryConfig.border} rounded-full text-xs font-bold`}>
                      {client.category}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={14} className="text-[#3A7AFE]" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={14} className="text-[#3A7AFE]" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={14} className="text-[#3A7AFE]" />
                    <span className="truncate">{client.address}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#3A7AFE]">{client.reservations}</p>
                    <p className="text-xs text-gray-600">Reservas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">
                      ${(client.totalSpent / 1000000).toFixed(1)}M
                    </p>
                    <p className="text-xs text-gray-600">Gastado</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-purple-600">{client.points}</p>
                    <p className="text-xs text-gray-600">Puntos</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClientClick(client);
                    }}
                    className="flex-1 px-4 py-2 bg-[#3A7AFE] text-white rounded-lg hover:bg-[#2868ec] transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Eye size={16} />
                    Ver Perfil
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <MessageCircle size={16} />
                  </button>
                  {canEdit && (
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredClients.length === 0 && (
        <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No se encontraron clientes</h3>
          <p className="text-gray-500">
            {searchQuery || filterCategory !== 'all'
              ? 'Intenta cambiar los filtros de búsqueda'
              : 'Comienza agregando tu primer cliente'}
          </p>
        </div>
      )}

      {/* Client Details Modal */}
      {selectedClient && (
        <ClientDetailsModal
          isOpen={showClientDetails}
          onClose={() => {
            setShowClientDetails(false);
            setSelectedClient(null);
          }}
          client={selectedClient}
        />
      )}
    </div>
  );
}