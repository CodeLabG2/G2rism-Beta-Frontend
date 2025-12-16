import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  X,
  Calendar,
  Clock,
  User,
  MapPin,
  Plane,
  Hotel,
  Car,
  Utensils,
  Download,
  Share2,
  CreditCard,
  FileText,
  Phone,
  Mail,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface BookingDetailsModalProps {
  booking: any;
  onClose: () => void;
  onPayment?: () => void;
}

export function BookingDetailsModal({ booking, onClose, onPayment }: BookingDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'itinerary' | 'documents'>('details');

  const handleDownload = () => {
    toast.success('Descargando voucher...', {
      description: `Voucher de ${booking.destination}`,
    });
  };

  const handleShare = () => {
    toast.success('Enlace copiado al portapapeles', {
      description: 'Comparte tu reserva con quien quieras',
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header with Image */}
          <div className="relative h-64">
            <img
              src={booking.image}
              alt={booking.destination}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <div className="absolute bottom-4 left-6 right-6">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-white mb-2">{booking.destination}</h4>
                  <p className="text-white/90 text-sm">{booking.type} • {booking.bookingNumber}</p>
                </div>
                <Badge
                  variant={
                    booking.status === 'Confirmado' ? 'success' :
                    booking.status === 'Pendiente pago' ? 'warning' : 'default'
                  }
                  className="bg-white/90"
                >
                  {booking.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="px-6">
              <div className="flex gap-6">
                {[
                  { id: 'details', label: 'Detalles' },
                  { id: 'itinerary', label: 'Itinerario' },
                  { id: 'documents', label: 'Documentos' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-[#3A7AFE] text-[#3A7AFE]'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-400px)]">
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Quick Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#3A7AFE]/10 text-[#3A7AFE] rounded-lg">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Fechas</p>
                        <p className="text-sm">{booking.dates}</p>
                      </div>
                    </div>
                  </Card>
                  <Card>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#10B981]/10 text-[#10B981] rounded-lg">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Viajeros</p>
                        <p className="text-sm">{booking.travelers} personas</p>
                      </div>
                    </div>
                  </Card>
                  <Card>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#F59E0B]/10 text-[#F59E0B] rounded-lg">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Duración</p>
                        <p className="text-sm">6 días</p>
                      </div>
                    </div>
                  </Card>
                  <Card>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#3A7AFE]/10 text-[#3A7AFE] rounded-lg">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="text-sm text-[#3A7AFE]">${booking.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Services Included */}
                <Card>
                  <h6 className="mb-4">Servicios Incluidos</h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {booking.flight && (
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#3A7AFE]/10 text-[#3A7AFE] rounded-lg">
                          <Plane size={20} />
                        </div>
                        <div>
                          <p className="text-sm">Vuelo</p>
                          <p className="text-sm text-gray-600">{booking.flight}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#3A7AFE]/10 text-[#3A7AFE] rounded-lg">
                        <Hotel size={20} />
                      </div>
                      <div>
                        <p className="text-sm">Hotel</p>
                        <p className="text-sm text-gray-600">{booking.hotel}</p>
                      </div>
                    </div>
                    {booking.services.map((service: string, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle size={20} className="text-[#10B981]" />
                        <span className="text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Contact Info */}
                <Card>
                  <h6 className="mb-4">Información de Contacto</h6>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone size={18} />
                      <span className="text-sm">+57 300 123 4567</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Mail size={18} />
                      <span className="text-sm">soporte@g2rism.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin size={18} />
                      <span className="text-sm">Disponible 24/7 durante tu viaje</span>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'itinerary' && (
              <div className="space-y-4">
                <Card>
                  <h6 className="mb-4">Día 1 - Llegada</h6>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-[#3A7AFE]/10 flex items-center justify-center text-[#3A7AFE]">
                          <Plane size={16} />
                        </div>
                        <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                      </div>
                      <div className="pb-4">
                        <p className="text-sm">09:00 - Llegada al aeropuerto</p>
                        <p className="text-xs text-gray-600 mt-1">Recepción y traslado al hotel</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-[#3A7AFE]/10 flex items-center justify-center text-[#3A7AFE]">
                          <Hotel size={16} />
                        </div>
                        <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                      </div>
                      <div className="pb-4">
                        <p className="text-sm">12:00 - Check-in hotel</p>
                        <p className="text-xs text-gray-600 mt-1">{booking.hotel}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#3A7AFE]/10 flex items-center justify-center text-[#3A7AFE]">
                        <Utensils size={16} />
                      </div>
                      <div>
                        <p className="text-sm">19:00 - Cena de bienvenida</p>
                        <p className="text-xs text-gray-600 mt-1">Restaurante del hotel</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h6 className="mb-4">Día 2-5 - Tours y Actividades</h6>
                  <p className="text-sm text-gray-600">
                    Tours guiados por los principales atractivos turísticos, actividades programadas y tiempo libre para explorar.
                  </p>
                </Card>

                <Card>
                  <h6 className="mb-4">Día 6 - Salida</h6>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#3A7AFE]/10 flex items-center justify-center text-[#3A7AFE]">
                        <Hotel size={16} />
                      </div>
                      <div>
                        <p className="text-sm">10:00 - Check-out</p>
                        <p className="text-xs text-gray-600 mt-1">Traslado al aeropuerto</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-4">
                <Card>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#3A7AFE]/10 text-[#3A7AFE] rounded-lg">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-sm">Voucher de Reserva</p>
                        <p className="text-xs text-gray-600">PDF - 245 KB</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" icon={<Download size={16} />}>
                      Descargar
                    </Button>
                  </div>
                </Card>

                <Card>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#10B981]/10 text-[#10B981] rounded-lg">
                        <Plane size={20} />
                      </div>
                      <div>
                        <p className="text-sm">Boletos de Avión</p>
                        <p className="text-xs text-gray-600">PDF - 187 KB</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" icon={<Download size={16} />}>
                      Descargar
                    </Button>
                  </div>
                </Card>

                <Card>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#F59E0B]/10 text-[#F59E0B] rounded-lg">
                        <Hotel size={20} />
                      </div>
                      <div>
                        <p className="text-sm">Confirmación de Hotel</p>
                        <p className="text-xs text-gray-600">PDF - 156 KB</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" icon={<Download size={16} />}>
                      Descargar
                    </Button>
                  </div>
                </Card>

                <Card className="bg-[#F59E0B]/5 border-[#F59E0B]/20">
                  <div className="flex gap-3">
                    <FileText size={20} className="text-[#F59E0B] flex-shrink-0" />
                    <div>
                      <p className="text-sm mb-2">Documentos Requeridos</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Pasaporte vigente (mínimo 6 meses)</li>
                        <li>• Visa (si aplica)</li>
                        <li>• Certificado de vacunación</li>
                        <li>• Seguro de viaje</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-3">
              {booking.status === 'Pendiente pago' && onPayment && (
                <Button variant="primary" onClick={onPayment} fullWidth>
                  <CreditCard size={18} />
                  Completar Pago
                </Button>
              )}
              <Button variant="secondary" onClick={handleDownload} fullWidth>
                <Download size={18} />
                Descargar Todo
              </Button>
              <Button variant="secondary" onClick={handleShare} fullWidth>
                <Share2 size={18} />
                Compartir
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
