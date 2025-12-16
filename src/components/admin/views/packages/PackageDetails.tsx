import React from 'react';
import { Modal } from '../../../ui/Modal';
import { Badge } from '../../../ui/Badge';
import { Button } from '../../../ui/Button';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Star,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  List,
  Tag,
} from 'lucide-react';
import { TourPackage } from './types';

interface PackageDetailsProps {
  package: TourPackage | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (pkg: TourPackage) => void;
  onDelete: (id: string) => void;
}

export function PackageDetails({ package: pkg, isOpen, onClose, onEdit, onDelete }: PackageDetailsProps) {
  if (!pkg) return null;

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
      adventure: 'orange',
      relaxation: 'blue',
      cultural: 'purple',
      family: 'green',
      romantic: 'red',
      business: 'gray',
    };
    return colors[category as keyof typeof colors] || 'gray';
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      active: { label: 'Activo', color: 'green' as const, icon: CheckCircle2 },
      inactive: { label: 'Inactivo', color: 'gray' as const, icon: XCircle },
      draft: { label: 'Borrador', color: 'yellow' as const, icon: Clock },
      archived: { label: 'Archivado', color: 'red' as const, icon: XCircle },
    };
    return configs[status as keyof typeof configs] || configs.draft;
  };

  const statusConfig = getStatusConfig(pkg.status);
  const StatusIcon = statusConfig.icon;

  const handleDelete = () => {
    if (confirm('¿Está seguro de eliminar este paquete turístico?')) {
      onDelete(pkg.id);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="max-h-[90vh] overflow-y-auto">
        {/* Header with Image */}
        <div className="relative h-64 bg-gray-200">
          {pkg.thumbnailImage ? (
            <img
              src={pkg.thumbnailImage}
              alt={pkg.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon size={64} className="text-gray-400" />
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Title and Badges */}
          <div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-gray-900 mb-2">{pkg.name}</h3>
                <p className="text-sm text-gray-500">{pkg.code}</p>
              </div>
              <Badge variant={statusConfig.color} size="md">
                <StatusIcon size={16} />
                {statusConfig.label}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant={getCategoryColor(pkg.category) as any} size="sm">
                <Tag size={14} />
                {getCategoryLabel(pkg.category)}
              </Badge>
              <Badge variant="gray" size="sm">
                <MapPin size={14} />
                {pkg.destination.name}, {pkg.destination.country}
              </Badge>
              <Badge variant="blue" size="sm">
                <Clock size={14} />
                {pkg.duration} días / {pkg.nights} noches
              </Badge>
            </div>
          </div>

          {/* Description */}
          <div>
            <h6 className="text-sm text-gray-700 mb-2">Descripción</h6>
            <p className="text-gray-600">{pkg.description}</p>
          </div>

          {/* Key Information Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <DollarSign size={16} />
                <span className="text-xs">Precio Base</span>
              </div>
              <p className="text-lg text-gray-900">
                ${(pkg.basePrice / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-gray-500">COP por persona</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Users size={16} />
                <span className="text-xs">Grupo</span>
              </div>
              <p className="text-lg text-gray-900">
                {pkg.minGroupSize} - {pkg.maxGroupSize}
              </p>
              <p className="text-xs text-gray-500">personas</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Calendar size={16} />
                <span className="text-xs">Cupos</span>
              </div>
              <p className="text-lg text-gray-900">{pkg.availableSpots}</p>
              <p className="text-xs text-gray-500">disponibles</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Star size={16} className="text-yellow-500" />
                <span className="text-xs">Rating</span>
              </div>
              <p className="text-lg text-gray-900">{pkg.rating.toFixed(1)}</p>
              <p className="text-xs text-gray-500">{pkg.reviewsCount} reseñas</p>
            </div>
          </div>

          {/* Price Breakdown */}
          <div>
            <h6 className="text-sm text-gray-700 mb-3">Precios por Temporada</h6>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {pkg.prices.map((price) => (
                <div
                  key={price.season}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">
                      {price.season === 'high' && 'Temporada Alta'}
                      {price.season === 'mid' && 'Temporada Media'}
                      {price.season === 'low' && 'Temporada Baja'}
                    </span>
                    {price.discount && (
                      <Badge variant="green" size="sm">
                        -{price.discount}%
                      </Badge>
                    )}
                  </div>
                  <p className="text-xl text-gray-900">
                    ${(price.pricePerPerson / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-gray-500">COP por persona</p>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions */}
          <div>
            <h6 className="text-sm text-gray-700 mb-3 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-600" />
              Incluye
            </h6>
            <ul className="space-y-2">
              {pkg.inclusions.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Exclusions */}
          {pkg.exclusions.length > 0 && (
            <div>
              <h6 className="text-sm text-gray-700 mb-3 flex items-center gap-2">
                <XCircle size={16} className="text-red-600" />
                No Incluye
              </h6>
              <ul className="space-y-2">
                {pkg.exclusions.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <XCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Itinerary */}
          {pkg.itinerary.length > 0 && (
            <div>
              <h6 className="text-sm text-gray-700 mb-3 flex items-center gap-2">
                <List size={16} className="text-blue-600" />
                Itinerario
              </h6>
              <div className="space-y-4">
                {pkg.itinerary.map((day) => (
                  <div key={day.day} className="border-l-2 border-[#3A7AFE] pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="blue" size="sm">
                        Día {day.day}
                      </Badge>
                      <h6 className="text-sm text-gray-900">{day.title}</h6>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{day.description}</p>
                    {day.activities.length > 0 && (
                      <ul className="space-y-1">
                        {day.activities.map((activity, idx) => (
                          <li key={idx} className="text-sm text-gray-500 flex items-start gap-2">
                            <span className="text-[#3A7AFE]">•</span>
                            <span>{activity}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {day.meals.length > 0 && (
                      <div className="mt-2 flex gap-2">
                        {day.meals.map((meal) => (
                          <Badge key={meal} variant="gray" size="sm">
                            {meal === 'breakfast' && '🍳 Desayuno'}
                            {meal === 'lunch' && '🍽️ Almuerzo'}
                            {meal === 'dinner' && '🍷 Cena'}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Start Dates */}
          {pkg.startDates.length > 0 && (
            <div>
              <h6 className="text-sm text-gray-700 mb-3">Fechas de Salida Disponibles</h6>
              <div className="flex flex-wrap gap-2">
                {pkg.startDates.map((date, index) => (
                  <Badge key={index} variant="gray" size="sm">
                    <Calendar size={14} />
                    {new Date(date).toLocaleDateString('es-CO', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h6 className="text-sm text-gray-700 mb-3">Estadísticas</h6>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl text-gray-900">{pkg.totalSold}</p>
                <p className="text-xs text-gray-500">Total Vendido</p>
              </div>
              <div>
                <p className="text-2xl text-gray-900">
                  ${((pkg.totalSold * pkg.basePrice) / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-gray-500">Ingresos</p>
              </div>
              <div>
                <p className="text-2xl text-gray-900">{pkg.rating.toFixed(1)}</p>
                <p className="text-xs text-gray-500">Rating Promedio</p>
              </div>
              <div>
                <p className="text-2xl text-gray-900">{pkg.reviewsCount}</p>
                <p className="text-xs text-gray-500">Reseñas</p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Creado por:</span>
                <span className="text-gray-900 ml-2">{pkg.createdBy}</span>
              </div>
              <div>
                <span className="text-gray-500">Fecha de creación:</span>
                <span className="text-gray-900 ml-2">
                  {new Date(pkg.createdAt).toLocaleDateString('es-CO')}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Última actualización:</span>
                <span className="text-gray-900 ml-2">
                  {new Date(pkg.updatedAt).toLocaleDateString('es-CO')}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cerrar
            </Button>
            <Button
              variant="outline"
              onClick={handleDelete}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash2 size={18} />
              Eliminar
            </Button>
            <Button variant="primary" onClick={() => onEdit(pkg)} className="flex-1">
              <Edit size={18} />
              Editar Paquete
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
