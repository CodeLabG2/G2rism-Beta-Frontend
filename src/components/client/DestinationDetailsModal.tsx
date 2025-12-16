import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  X,
  Star,
  MapPin,
  Calendar,
  Users,
  Heart,
  Share2,
  Plane,
  Hotel,
  Utensils,
  Camera,
  Shield,
  ThumbsUp,
  Clock,
  DollarSign,
  Check,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface DestinationDetailsModalProps {
  destination: any;
  onClose: () => void;
  onBook: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function DestinationDetailsModal({
  destination,
  onClose,
  onBook,
  isFavorite,
  onToggleFavorite,
}: DestinationDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'reviews'>('overview');

  const handleShare = () => {
    toast.success('Enlace copiado al portapapeles', {
      description: `Comparte ${destination.name} con tus amigos`,
    });
  };

  const highlights = [
    'Tours guiados en español',
    'Traslados incluidos',
    'Desayuno buffet',
    'Seguro de viaje',
    'Guía turística',
    'Atención 24/7',
  ];

  const reviews = [
    {
      id: 1,
      name: 'María González',
      rating: 5,
      date: 'Hace 1 semana',
      comment: 'Experiencia increíble, todo perfectamente organizado. El hotel superó nuestras expectativas.',
      avatar: 'MG',
    },
    {
      id: 2,
      name: 'Carlos Ramírez',
      rating: 5,
      date: 'Hace 2 semanas',
      comment: 'Excelente atención y los tours fueron espectaculares. 100% recomendado.',
      avatar: 'CR',
    },
    {
      id: 3,
      name: 'Ana Martínez',
      rating: 4,
      date: 'Hace 1 mes',
      comment: 'Muy buen paquete, solo le faltó un poco más de tiempo libre.',
      avatar: 'AM',
    },
  ];

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
          <div className="relative h-80">
            <img
              src={destination.image}
              alt={destination.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            
            {/* Top Actions */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={onToggleFavorite}
                className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
              >
                <Heart
                  size={20}
                  className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}
                />
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
              >
                <Share2 size={20} />
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-4 left-6 right-6">
              <div className="flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="error" className="bg-red-500 text-white border-0">
                      {destination.discount > 0 && `-${destination.discount}%`}
                    </Badge>
                    <Badge variant="success" className="bg-white/90 text-gray-900 border-0">
                      <Star size={12} className="inline mr-1 fill-[#F59E0B] text-[#F59E0B]" />
                      {destination.rating} ({destination.reviews} reviews)
                    </Badge>
                  </div>
                  <h3 className="text-white mb-1">{destination.name}</h3>
                  <p className="text-white/90 flex items-center gap-2">
                    <MapPin size={16} />
                    {destination.country} • {destination.duration}
                  </p>
                </div>
                <div className="text-right">
                  {destination.discount > 0 && (
                    <p className="text-white/70 line-through text-sm">
                      ${Math.round(destination.price / (1 - destination.discount / 100))}
                    </p>
                  )}
                  <p className="text-white text-sm">Desde</p>
                  <h4 className="text-white">${destination.price}</h4>
                  <p className="text-white/70 text-xs">por persona</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="px-6">
              <div className="flex gap-6">
                {[
                  { id: 'overview', label: 'Descripción' },
                  { id: 'itinerary', label: 'Itinerario' },
                  { id: 'reviews', label: 'Reviews' },
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
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-500px)]">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <div className="flex items-center gap-3">
                      <Calendar size={20} className="text-[#3A7AFE]" />
                      <div>
                        <p className="text-xs text-gray-500">Duración</p>
                        <p className="text-sm">{destination.duration}</p>
                      </div>
                    </div>
                  </Card>
                  <Card>
                    <div className="flex items-center gap-3">
                      <Users size={20} className="text-[#3A7AFE]" />
                      <div>
                        <p className="text-xs text-gray-500">Grupo</p>
                        <p className="text-sm">2-15 personas</p>
                      </div>
                    </div>
                  </Card>
                  <Card>
                    <div className="flex items-center gap-3">
                      <ThumbsUp size={20} className="text-[#3A7AFE]" />
                      <div>
                        <p className="text-xs text-gray-500">Satisfacción</p>
                        <p className="text-sm">98%</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Description */}
                <Card>
                  <h6 className="mb-3">Descripción</h6>
                  <p className="text-gray-600 mb-4">
                    Descubre la magia de {destination.name} en este increíble paquete de {destination.duration}. 
                    Explora los lugares más emblemáticos, disfruta de la gastronomía local y vive experiencias únicas 
                    que recordarás para siempre.
                  </p>
                  <p className="text-gray-600">
                    Este paquete todo incluido te ofrece la mejor combinación de confort, aventura y cultura, 
                    con guías expertos que te llevarán a descubrir los secretos mejor guardados de este destino.
                  </p>
                </Card>

                {/* What's Included */}
                <Card>
                  <h6 className="mb-4">¿Qué incluye?</h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#3A7AFE]/10 text-[#3A7AFE] rounded-lg flex-shrink-0">
                        <Plane size={20} />
                      </div>
                      <div>
                        <p className="text-sm">Vuelos</p>
                        <p className="text-xs text-gray-600">Ida y vuelta desde Bogotá</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#3A7AFE]/10 text-[#3A7AFE] rounded-lg flex-shrink-0">
                        <Hotel size={20} />
                      </div>
                      <div>
                        <p className="text-sm">Alojamiento</p>
                        <p className="text-xs text-gray-600">Hotel 5★ con desayuno</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#3A7AFE]/10 text-[#3A7AFE] rounded-lg flex-shrink-0">
                        <Camera size={20} />
                      </div>
                      <div>
                        <p className="text-sm">Tours</p>
                        <p className="text-xs text-gray-600">Guías en español</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#3A7AFE]/10 text-[#3A7AFE] rounded-lg flex-shrink-0">
                        <Shield size={20} />
                      </div>
                      <div>
                        <p className="text-sm">Seguro</p>
                        <p className="text-xs text-gray-600">Cobertura completa</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Highlights */}
                <Card>
                  <h6 className="mb-4">Destacados</h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check size={16} className="text-[#10B981]" />
                        <span className="text-sm text-gray-600">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'itinerary' && (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <Card key={day}>
                    <h6 className="mb-3">Día {day}</h6>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-[#3A7AFE]/10 flex items-center justify-center text-[#3A7AFE] text-xs">
                            <Clock size={16} />
                          </div>
                          {day < 7 && <div className="w-0.5 h-12 bg-gray-200 mt-2"></div>}
                        </div>
                        <div>
                          <p className="text-sm mb-1">
                            {day === 1 ? 'Llegada y bienvenida' :
                             day === 7 ? 'Check-out y regreso' :
                             `Tour por los principales atractivos`}
                          </p>
                          <p className="text-xs text-gray-600">
                            {day === 1 ? 'Traslado al hotel y tiempo libre' :
                             day === 7 ? 'Desayuno y traslado al aeropuerto' :
                             'Incluye almuerzo y guía profesional'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {/* Rating Summary */}
                <Card className="bg-[#3A7AFE]/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3>{destination.rating}</h3>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={20}
                              className={i < Math.floor(destination.rating) ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{destination.reviews} valoraciones</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm mb-1"><span className="text-[#10B981]">98%</span> Recomendado</p>
                      <p className="text-xs text-gray-600">Basado en opiniones verificadas</p>
                    </div>
                  </div>
                </Card>

                {/* Reviews List */}
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#3A7AFE]/10 flex items-center justify-center text-[#3A7AFE] flex-shrink-0">
                        {review.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm mb-1">{review.name}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    className={i < review.rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-gray-300'}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{review.comment}</p>
                      </div>
                    </div>
                  </Card>
                ))}

                <Button variant="secondary" fullWidth>
                  Ver todas las reviews
                </Button>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-600">Precio por persona</p>
                <div className="flex items-center gap-2">
                  <h4 className="text-[#3A7AFE]">${destination.price}</h4>
                  {destination.discount > 0 && (
                    <span className="text-sm text-gray-400 line-through">
                      ${Math.round(destination.price / (1 - destination.discount / 100))}
                    </span>
                  )}
                </div>
              </div>
              <Button variant="primary" onClick={onBook} size="lg">
                Reservar Ahora
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
