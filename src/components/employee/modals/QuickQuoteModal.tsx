import React, { useState } from 'react';
import { X, Calculator, Download, Send, MapPin, Calendar, Users, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface QuickQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickQuoteModal({ isOpen, onClose }: QuickQuoteModalProps) {
  const [formData, setFormData] = useState({
    destination: '',
    travelers: 1,
    duration: 5,
    startDate: '',
    category: 'standard',
    includeFlights: true,
    includeHotel: true,
    includeTours: true,
    includeInsurance: false,
  });

  const [quote, setQuote] = useState<any>(null);

  const destinations = [
    { id: 'cartagena', name: 'Cartagena', basePrice: 500000 },
    { id: 'san-andres', name: 'San Andrés', basePrice: 650000 },
    { id: 'eje-cafetero', name: 'Eje Cafetero', basePrice: 400000 },
    { id: 'santa-marta', name: 'Santa Marta', basePrice: 450000 },
    { id: 'bogota', name: 'Bogotá', basePrice: 350000 },
  ];

  const calculateQuote = () => {
    const destination = destinations.find(d => d.id === formData.destination);
    if (!destination) {
      toast.error('Selecciona un destino');
      return;
    }

    let basePrice = destination.basePrice;
    
    // Multiplicadores
    const categoryMultipliers = {
      standard: 1,
      premium: 1.5,
      luxury: 2.2,
    };

    let total = basePrice * formData.travelers * formData.duration;
    total *= categoryMultipliers[formData.category as keyof typeof categoryMultipliers];

    // Servicios adicionales
    if (formData.includeFlights) total += 800000 * formData.travelers;
    if (formData.includeHotel) total += 300000 * formData.travelers * formData.duration;
    if (formData.includeTours) total += 150000 * formData.travelers;
    if (formData.includeInsurance) total += 120000 * formData.travelers;

    // Descuento por múltiples viajeros
    if (formData.travelers >= 4) {
      total *= 0.9; // 10% descuento
    }

    const breakdown = {
      destination: destination.name,
      travelers: formData.travelers,
      duration: formData.duration,
      category: formData.category,
      services: {
        flights: formData.includeFlights ? 800000 * formData.travelers : 0,
        hotel: formData.includeHotel ? 300000 * formData.travelers * formData.duration : 0,
        tours: formData.includeTours ? 150000 * formData.travelers : 0,
        insurance: formData.includeInsurance ? 120000 * formData.travelers : 0,
      },
      subtotal: total * 0.81, // Sin IVA
      tax: total * 0.19,
      discount: formData.travelers >= 4 ? total * 0.1 : 0,
      total: total,
    };

    setQuote(breakdown);
    toast.success('Cotización generada');
  };

  const handleDownloadPDF = () => {
    toast.success('Descargando cotización en PDF...');
    // Aquí iría la lógica para generar PDF
  };

  const handleSendEmail = () => {
    toast.success('Cotización enviada por email');
    // Aquí iría la lógica para enviar email
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#10B981] to-[#059669] p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Calculator size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Cotizador Rápido</h2>
                <p className="text-purple-100 text-sm">Genera cotizaciones instantáneas</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Formulario */}
            <div className="space-y-4">
              <h3 className="font-bold text-[#1A2440] mb-4">Información del Viaje</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} className="text-[#3A7AFE]" />
                  Destino
                </label>
                <select
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Selecciona un destino</option>
                  {destinations.map((dest) => (
                    <option key={dest.id} value={dest.id}>
                      {dest.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Users size={16} className="text-[#3A7AFE]" />
                    Viajeros
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.travelers}
                    onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar size={16} className="text-[#3A7AFE]" />
                    Duración (días)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Inicio (Aproximada)
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'standard', label: 'Standard' },
                    { value: 'premium', label: 'Premium' },
                    { value: 'luxury', label: 'Lujo' },
                  ].map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setFormData({ ...formData, category: cat.value })}
                      className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                        formData.category === cat.value
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Servicios Incluidos
                </label>
                <div className="space-y-2">
                  {[
                    { key: 'includeFlights', label: 'Vuelos' },
                    { key: 'includeHotel', label: 'Alojamiento' },
                    { key: 'includeTours', label: 'Tours' },
                    { key: 'includeInsurance', label: 'Seguro de Viaje' },
                  ].map((service) => (
                    <label key={service.key} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData[service.key as keyof typeof formData] as boolean}
                        onChange={(e) => setFormData({ ...formData, [service.key]: e.target.checked })}
                        className="w-5 h-5 rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 transition-all cursor-pointer"
                      />
                      <span className="text-gray-700">{service.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={calculateQuote}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Calculator size={20} />
                Generar Cotización
              </button>
            </div>

            {/* Resultado */}
            <div>
              {quote ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <DollarSign className="text-purple-600" size={24} />
                      <h3 className="font-bold text-[#1A2440]">Cotización Generada</h3>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-2 border-b border-purple-200">
                        <span className="text-gray-700">Destino:</span>
                        <span className="font-medium text-[#1A2440]">{quote.destination}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-purple-200">
                        <span className="text-gray-700">Viajeros:</span>
                        <span className="font-medium text-[#1A2440]">{quote.travelers} personas</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-purple-200">
                        <span className="text-gray-700">Duración:</span>
                        <span className="font-medium text-[#1A2440]">{quote.duration} días</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-purple-200">
                        <span className="text-gray-700">Categoría:</span>
                        <span className="font-medium text-[#1A2440] capitalize">{quote.category}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t-2 border-purple-300">
                      <h4 className="font-bold text-[#1A2440] mb-3">Desglose de Servicios</h4>
                      <div className="space-y-2 text-sm">
                        {quote.services.flights > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-700">Vuelos:</span>
                            <span className="font-medium">${quote.services.flights.toLocaleString('es-CO')}</span>
                          </div>
                        )}
                        {quote.services.hotel > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-700">Alojamiento:</span>
                            <span className="font-medium">${quote.services.hotel.toLocaleString('es-CO')}</span>
                          </div>
                        )}
                        {quote.services.tours > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-700">Tours:</span>
                            <span className="font-medium">${quote.services.tours.toLocaleString('es-CO')}</span>
                          </div>
                        )}
                        {quote.services.insurance > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-700">Seguro:</span>
                            <span className="font-medium">${quote.services.insurance.toLocaleString('es-CO')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t-2 border-purple-300 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">Subtotal:</span>
                        <span className="font-medium">${Math.round(quote.subtotal).toLocaleString('es-CO')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">IVA (19%):</span>
                        <span className="font-medium">${Math.round(quote.tax).toLocaleString('es-CO')}</span>
                      </div>
                      {quote.discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Descuento grupos (10%):</span>
                          <span className="font-medium">-${Math.round(quote.discount).toLocaleString('es-CO')}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg pt-3 border-t-2 border-purple-400">
                        <span className="font-bold text-[#1A2440]">TOTAL:</span>
                        <span className="font-bold text-purple-600 text-xl">
                          ${Math.round(quote.total).toLocaleString('es-CO')}
                        </span>
                      </div>
                    </div>

                    {quote.travelers >= 4 && (
                      <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                        <p className="text-sm text-green-800 font-medium">
                          🎉 ¡Descuento aplicado! Grupos de 4+ personas obtienen 10% de descuento
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleDownloadPDF}
                      className="px-4 py-3 bg-white border-2 border-purple-600 text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
                    >
                      <Download size={18} />
                      Descargar PDF
                    </button>
                    <button
                      onClick={handleSendEmail}
                      className="px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Send size={18} />
                      Enviar Email
                    </button>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-gray-600">
                      <strong>Nota:</strong> Esta cotización es referencial y puede variar según disponibilidad,
                      temporada y condiciones específicas. Válida por 48 horas.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Calculator size={64} className="mx-auto mb-4 opacity-50" />
                    <p className="font-medium">Completa el formulario</p>
                    <p className="text-sm">y genera la cotización</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-700 font-medium border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </div>
  );
}