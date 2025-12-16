import React, { useState } from 'react';
import { X, Calendar, Users, MapPin, Package, DollarSign, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface CreateReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (reservation: any) => void;
}

export function CreateReservationModal({ isOpen, onClose, onSuccess }: CreateReservationModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Cliente
    clientId: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    travelers: 1,
    
    // Step 2: Destino y Fechas
    destination: '',
    packageId: '',
    startDate: '',
    endDate: '',
    
    // Step 3: Servicios
    includeFlights: true,
    includeHotel: true,
    includeTours: false,
    includeInsurance: false,
    
    // Step 4: Confirmación
    specialRequests: '',
    paymentMethod: 'credit-card',
  });

  const packages = [
    { id: 'pkg-1', name: 'Cartagena Premium', destination: 'Cartagena', price: 2500000, duration: '5 días / 4 noches' },
    { id: 'pkg-2', name: 'San Andrés Paradise', destination: 'San Andrés', price: 3200000, duration: '7 días / 6 noches' },
    { id: 'pkg-3', name: 'Eje Cafetero Experience', destination: 'Eje Cafetero', price: 1800000, duration: '4 días / 3 noches' },
    { id: 'pkg-4', name: 'Santa Marta Beach', destination: 'Santa Marta', price: 2100000, duration: '5 días / 4 noches' },
  ];

  const clients = [
    { id: 'cli-1', name: 'Juan Pérez', email: 'juan@email.com', phone: '300-123-4567' },
    { id: 'cli-2', name: 'María García', email: 'maria@email.com', phone: '301-234-5678' },
    { id: 'cli-3', name: 'Carlos López', email: 'carlos@email.com', phone: '302-345-6789' },
  ];

  const handleNext = () => {
    if (step === 1 && !formData.clientId) {
      toast.error('Selecciona un cliente');
      return;
    }
    if (step === 2 && (!formData.packageId || !formData.startDate || !formData.endDate)) {
      toast.error('Completa todos los campos requeridos');
      return;
    }
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    const reservation = {
      id: `RES-${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'Pendiente',
    };

    toast.success('Reserva creada exitosamente');
    onSuccess?.(reservation);
    onClose();
  };

  const handleClientSelect = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setFormData({
        ...formData,
        clientId: client.id,
        clientName: client.name,
        clientEmail: client.email,
        clientPhone: client.phone,
      });
    }
  };

  const handlePackageSelect = (packageId: string) => {
    const pkg = packages.find(p => p.id === packageId);
    if (pkg) {
      setFormData({
        ...formData,
        packageId: pkg.id,
        destination: pkg.destination,
      });
    }
  };

  const calculateTotal = () => {
    const pkg = packages.find(p => p.id === formData.packageId);
    if (!pkg) return 0;
    
    let total = pkg.price * formData.travelers;
    if (formData.includeInsurance) total += 150000 * formData.travelers;
    
    return total;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#3A7AFE] to-[#1A2440] p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Nueva Reserva</h2>
              <p className="text-blue-100 text-sm mt-1">Paso {step} de 4</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full transition-all ${
                  s <= step ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
          <AnimatePresence mode="wait">
            {/* Step 1: Cliente */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-bold text-[#1A2440] mb-4 flex items-center gap-2">
                    <Users className="text-[#3A7AFE]" size={24} />
                    Información del Cliente
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Seleccionar Cliente
                      </label>
                      <select
                        value={formData.clientId}
                        onChange={(e) => handleClientSelect(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent"
                      >
                        <option value="">Selecciona un cliente</option>
                        {clients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.name} - {client.email}
                          </option>
                        ))}
                      </select>
                    </div>

                    {formData.clientId && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                      >
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Nombre</p>
                            <p className="font-medium text-[#1A2440]">{formData.clientName}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Email</p>
                            <p className="font-medium text-[#1A2440]">{formData.clientEmail}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Teléfono</p>
                            <p className="font-medium text-[#1A2440]">{formData.clientPhone}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Viajeros
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.travelers}
                        onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Destino y Fechas */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-bold text-[#1A2440] mb-4 flex items-center gap-2">
                    <MapPin className="text-[#3A7AFE]" size={24} />
                    Destino y Fechas
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Seleccionar Paquete
                      </label>
                      <div className="grid gap-3">
                        {packages.map((pkg) => (
                          <button
                            key={pkg.id}
                            onClick={() => handlePackageSelect(pkg.id)}
                            className={`text-left p-4 border-2 rounded-lg transition-all ${
                              formData.packageId === pkg.id
                                ? 'border-[#3A7AFE] bg-blue-50'
                                : 'border-gray-200 hover:border-[#3A7AFE] hover:bg-blue-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-bold text-[#1A2440]">{pkg.name}</h4>
                                <p className="text-sm text-gray-600">{pkg.destination} • {pkg.duration}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-[#3A7AFE]">
                                  ${pkg.price.toLocaleString('es-CO')}
                                </p>
                                <p className="text-xs text-gray-500">por persona</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fecha de Inicio
                        </label>
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fecha de Fin
                        </label>
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Servicios */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-bold text-[#1A2440] mb-4 flex items-center gap-2">
                    <Package className="text-[#3A7AFE]" size={24} />
                    Servicios Incluidos
                  </h3>

                  <div className="space-y-3">
                    {[
                      { key: 'includeFlights', label: 'Vuelos', description: 'Ida y vuelta incluidos' },
                      { key: 'includeHotel', label: 'Alojamiento', description: 'Hotel 4-5 estrellas' },
                      { key: 'includeTours', label: 'Tours Guiados', description: 'Tours principales del destino' },
                      { key: 'includeInsurance', label: 'Seguro de Viaje', description: '+$150,000 por persona' },
                    ].map((service) => (
                      <label
                        key={service.key}
                        className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#3A7AFE] hover:bg-blue-50 transition-all"
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={formData[service.key as keyof typeof formData] as boolean}
                            onChange={(e) => setFormData({ ...formData, [service.key]: e.target.checked })}
                            className="w-5 h-5 rounded border-2 border-gray-300 text-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-0 transition-all cursor-pointer appearance-none checked:bg-[#3A7AFE] checked:border-[#3A7AFE]"
                          />
                          {formData[service.key as keyof typeof formData] && (
                            <Check className="absolute top-0 left-0 w-5 h-5 text-white pointer-events-none" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-[#1A2440]">{service.label}</p>
                          <p className="text-sm text-gray-600">{service.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Confirmación */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-bold text-[#1A2440] mb-4 flex items-center gap-2">
                    <Check className="text-[#3A7AFE]" size={24} />
                    Confirmación
                  </h3>

                  {/* Resumen */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h4 className="font-bold text-[#1A2440] mb-4">Resumen de la Reserva</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cliente:</span>
                        <span className="font-medium text-[#1A2440]">{formData.clientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Destino:</span>
                        <span className="font-medium text-[#1A2440]">{formData.destination}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fechas:</span>
                        <span className="font-medium text-[#1A2440]">
                          {formData.startDate} - {formData.endDate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Viajeros:</span>
                        <span className="font-medium text-[#1A2440]">{formData.travelers}</span>
                      </div>
                      <div className="border-t border-blue-300 pt-3 mt-3">
                        <div className="flex justify-between text-lg">
                          <span className="font-bold text-[#1A2440]">Total:</span>
                          <span className="font-bold text-[#3A7AFE]">
                            ${calculateTotal().toLocaleString('es-CO')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notas especiales */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Solicitudes Especiales (Opcional)
                    </label>
                    <textarea
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                      rows={4}
                      placeholder="Ej: Habitación con vista al mar, dieta especial, celebración..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent"
                    />
                  </div>

                  {/* Método de pago */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Método de Pago
                    </label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent"
                    >
                      <option value="credit-card">Tarjeta de Crédito</option>
                      <option value="debit-card">Tarjeta de Débito</option>
                      <option value="transfer">Transferencia Bancaria</option>
                      <option value="cash">Efectivo</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={step === 1 ? onClose : handlePrevious}
              className="px-6 py-2.5 text-gray-700 font-medium border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              {step === 1 ? 'Cancelar' : 'Anterior'}
            </button>

            {step < 4 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-gradient-to-r from-[#3A7AFE] to-[#2868ec] text-white font-medium rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
              >
                Siguiente
                <ArrowRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Check size={20} />
                Crear Reserva
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
