import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, DollarSign, Award, History, FileText, Edit2, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: any;
}

export function ClientDetailsModal({ isOpen, onClose, client }: ClientDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'preferences'>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState(client);

  // Mock data
  const bookingHistory = [
    { id: 1, destination: 'Cartagena', date: '2024-01-15', amount: 2500000, status: 'Completado' },
    { id: 2, destination: 'San Andrés', date: '2024-06-20', amount: 3200000, status: 'Completado' },
    { id: 3, destination: 'Eje Cafetero', date: '2024-11-10', amount: 1800000, status: 'Confirmado' },
  ];

  const preferences = {
    destinations: ['Playa', 'Montaña', 'Ciudad'],
    accommodation: 'Hotel 4-5 estrellas',
    budget: '$2M - $4M COP',
    travelStyle: 'Familiar',
    dietaryRestrictions: 'Ninguna',
    specialNeeds: 'Habitación accesible',
  };

  const handleSave = () => {
    toast.success('Cliente actualizado exitosamente');
    setIsEditing(false);
  };

  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#3A7AFE] to-[#1A2440] p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {client.name?.split(' ').map((n: string) => n[0]).join('') || 'CL'}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{client.name}</h2>
                <p className="text-blue-100 text-sm">{client.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4">
            {[
              { id: 'info', label: 'Información', icon: User },
              { id: 'history', label: 'Historial', icon: History },
              { id: 'preferences', label: 'Preferencias', icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-white text-[#3A7AFE]'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
          {/* Tab: Información */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#1A2440]">Datos Personales</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-[#3A7AFE] text-white rounded-lg hover:bg-[#2868ec] transition-colors flex items-center gap-2"
                  >
                    <Edit2 size={16} />
                    Editar
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Save size={16} />
                      Guardar
                    </button>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <User size={16} className="text-[#3A7AFE]" />
                      Nombre Completo
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedClient.name}
                        onChange={(e) => setEditedClient({ ...editedClient, name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent"
                      />
                    ) : (
                      <p className="px-4 py-2.5 bg-gray-50 rounded-lg text-[#1A2440] font-medium">
                        {client.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Mail size={16} className="text-[#3A7AFE]" />
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedClient.email}
                        onChange={(e) => setEditedClient({ ...editedClient, email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent"
                      />
                    ) : (
                      <p className="px-4 py-2.5 bg-gray-50 rounded-lg text-[#1A2440] font-medium">
                        {client.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Phone size={16} className="text-[#3A7AFE]" />
                      Teléfono
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedClient.phone || ''}
                        onChange={(e) => setEditedClient({ ...editedClient, phone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent"
                      />
                    ) : (
                      <p className="px-4 py-2.5 bg-gray-50 rounded-lg text-[#1A2440] font-medium">
                        {client.phone || 'No registrado'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <MapPin size={16} className="text-[#3A7AFE]" />
                      Dirección
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedClient.address || ''}
                        onChange={(e) => setEditedClient({ ...editedClient, address: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent"
                      />
                    ) : (
                      <p className="px-4 py-2.5 bg-gray-50 rounded-lg text-[#1A2440] font-medium">
                        {client.address || 'No registrado'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Calendar size={16} className="text-[#3A7AFE]" />
                      Fecha de Nacimiento
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedClient.birthDate || ''}
                        onChange={(e) => setEditedClient({ ...editedClient, birthDate: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent"
                      />
                    ) : (
                      <p className="px-4 py-2.5 bg-gray-50 rounded-lg text-[#1A2440] font-medium">
                        {client.birthDate || 'No registrado'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Award size={16} className="text-[#3A7AFE]" />
                      Categoría Cliente
                    </label>
                    <div className="px-4 py-2.5 bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-lg">
                      <span className="font-bold text-yellow-800">
                        {client.category || 'Silver'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-[#1A2440]">
                    ${(bookingHistory.reduce((sum, b) => sum + b.amount, 0)).toLocaleString('es-CO')}
                  </p>
                  <p className="text-sm text-gray-600">Total Gastado</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-[#1A2440]">{bookingHistory.length}</p>
                  <p className="text-sm text-gray-600">Reservas Totales</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-[#1A2440]">850</p>
                  <p className="text-sm text-gray-600">Puntos Lealtad</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Historial */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#1A2440] mb-4 flex items-center gap-2">
                <History className="text-[#3A7AFE]" />
                Historial de Reservas
              </h3>

              {bookingHistory.length > 0 ? (
                <div className="space-y-3">
                  {bookingHistory.map((booking) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-[#3A7AFE] hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <MapPin className="text-[#3A7AFE]" size={20} />
                            <h4 className="font-bold text-[#1A2440]">{booking.destination}</h4>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                booking.status === 'Completado'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {booking.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign size={14} />
                              ${booking.amount.toLocaleString('es-CO')}
                            </span>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-[#3A7AFE] font-medium hover:bg-blue-50 rounded-lg transition-colors">
                          Ver Detalles
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <FileText size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No hay historial de reservas</p>
                </div>
              )}
            </div>
          )}

          {/* Tab: Preferencias */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-[#1A2440] mb-4 flex items-center gap-2">
                <Award className="text-[#3A7AFE]" />
                Preferencias de Viaje
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-[#1A2440] mb-3">Destinos Favoritos</h4>
                    <div className="flex flex-wrap gap-2">
                      {preferences.destinations.map((dest, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-white border border-blue-300 text-blue-700 rounded-full text-sm font-medium"
                        >
                          {dest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                    <h4 className="font-bold text-[#1A2440] mb-2">Alojamiento Preferido</h4>
                    <p className="text-gray-700">{preferences.accommodation}</p>
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                    <h4 className="font-bold text-[#1A2440] mb-2">Presupuesto Típico</h4>
                    <p className="text-gray-700">{preferences.budget}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                    <h4 className="font-bold text-[#1A2440] mb-2">Estilo de Viaje</h4>
                    <p className="text-gray-700">{preferences.travelStyle}</p>
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                    <h4 className="font-bold text-[#1A2440] mb-2">Restricciones Alimentarias</h4>
                    <p className="text-gray-700">{preferences.dietaryRestrictions}</p>
                  </div>

                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                    <h4 className="font-bold text-[#1A2440] mb-2">Necesidades Especiales</h4>
                    <p className="text-gray-700">{preferences.specialNeeds}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Nota:</strong> Esta información ayuda a personalizar las recomendaciones
                  y mejorar la experiencia del cliente.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-700 font-medium border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cerrar
          </button>
          <button
            className="px-6 py-2.5 bg-[#3A7AFE] text-white font-medium rounded-lg hover:bg-[#2868ec] transition-colors"
          >
            Nueva Reserva para este Cliente
          </button>
        </div>
      </motion.div>
    </div>
  );
}
