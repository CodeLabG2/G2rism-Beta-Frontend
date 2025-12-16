import React from 'react';
import { Modal } from '../../../ui/Modal';
import { Badge } from '../../../ui/Badge';
import { Button } from '../../../ui/Button';
import {
  X,
  Calendar,
  User,
  CreditCard,
  MapPin,
  Plane,
  Building,
  Package,
  Clock,
  FileText,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Download,
} from 'lucide-react';
import { Reservation } from './types';

interface ReservationDetailsProps {
  reservation: Reservation | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (reservation: Reservation) => void;
  onDelete: (id: string) => void;
}

export function ReservationDetails({
  reservation,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: ReservationDetailsProps) {
  if (!reservation) return null;

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: { label: 'Pendiente', color: 'yellow' as const, icon: Clock },
      confirmed: { label: 'Confirmada', color: 'blue' as const, icon: CheckCircle2 },
      cancelled: { label: 'Cancelada', color: 'red' as const, icon: XCircle },
      completed: { label: 'Completada', color: 'green' as const, icon: CheckCircle2 },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const getPaymentStatusConfig = (status: string) => {
    const configs = {
      pending: { label: 'Pendiente', color: 'yellow' as const },
      partial: { label: 'Parcial', color: 'orange' as const },
      paid: { label: 'Pagado', color: 'green' as const },
      refunded: { label: 'Reembolsado', color: 'purple' as const },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const getTypeConfig = (type: string) => {
    const configs = {
      flight: { label: 'Vuelo', icon: Plane, color: '#3A7AFE' },
      hotel: { label: 'Hotel', icon: Building, color: '#10B981' },
      package: { label: 'Paquete', icon: Package, color: '#F59E0B' },
      transport: { label: 'Transporte', icon: MapPin, color: '#8B5CF6' },
    };
    return configs[type as keyof typeof configs] || configs.flight;
  };

  const statusConfig = getStatusConfig(reservation.status);
  const paymentConfig = getPaymentStatusConfig(reservation.paymentStatus);
  const typeConfig = getTypeConfig(reservation.type);
  const StatusIcon = statusConfig.icon;
  const TypeIcon = typeConfig.icon;

  const renderTypeDetails = () => {
    if (reservation.flight) {
      return (
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-gray-900">
            <Plane size={18} />
            Detalles del Vuelo
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Aerolínea</p>
              <p className="text-gray-900">{reservation.flight.airline}</p>
            </div>
            <div>
              <p className="text-gray-500">Número de Vuelo</p>
              <p className="text-gray-900">{reservation.flight.flightNumber}</p>
            </div>
            <div>
              <p className="text-gray-500">Origen</p>
              <p className="text-gray-900">{reservation.flight.origin}</p>
            </div>
            <div>
              <p className="text-gray-500">Destino</p>
              <p className="text-gray-900">{reservation.flight.destination}</p>
            </div>
            <div>
              <p className="text-gray-500">Salida</p>
              <p className="text-gray-900">
                {new Date(reservation.flight.departure).toLocaleString('es-CO', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Llegada</p>
              <p className="text-gray-900">
                {new Date(reservation.flight.arrival).toLocaleString('es-CO', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Clase</p>
              <p className="text-gray-900 capitalize">{reservation.flight.class}</p>
            </div>
          </div>
        </div>
      );
    }

    if (reservation.hotel) {
      return (
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-gray-900">
            <Building size={18} />
            Detalles del Hotel
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Hotel</p>
              <p className="text-gray-900">{reservation.hotel.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Ubicación</p>
              <p className="text-gray-900">{reservation.hotel.location}</p>
            </div>
            <div>
              <p className="text-gray-500">Check-in</p>
              <p className="text-gray-900">
                {new Date(reservation.hotel.checkIn).toLocaleDateString('es-CO', {
                  dateStyle: 'medium',
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Check-out</p>
              <p className="text-gray-900">
                {new Date(reservation.hotel.checkOut).toLocaleDateString('es-CO', {
                  dateStyle: 'medium',
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Tipo de Habitación</p>
              <p className="text-gray-900">{reservation.hotel.roomType}</p>
            </div>
            <div>
              <p className="text-gray-500">Noches</p>
              <p className="text-gray-900">{reservation.hotel.nights} noches</p>
            </div>
          </div>
        </div>
      );
    }

    if (reservation.package) {
      return (
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-gray-900">
            <Package size={18} />
            Detalles del Paquete
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Nombre del Paquete</p>
              <p className="text-gray-900">{reservation.package.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Destino</p>
              <p className="text-gray-900">{reservation.package.destination}</p>
            </div>
            <div>
              <p className="text-gray-500">Fecha Inicio</p>
              <p className="text-gray-900">
                {new Date(reservation.package.startDate).toLocaleDateString('es-CO', {
                  dateStyle: 'medium',
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Fecha Fin</p>
              <p className="text-gray-900">
                {new Date(reservation.package.endDate).toLocaleDateString('es-CO', {
                  dateStyle: 'medium',
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Duración</p>
              <p className="text-gray-900">{reservation.package.duration} días</p>
            </div>
            <div>
              <p className="text-gray-500">Incluye</p>
              <div className="flex gap-2">
                {reservation.package.includesFlights && (
                  <Badge variant="blue" size="sm">Vuelos</Badge>
                )}
                {reservation.package.includesHotel && (
                  <Badge variant="green" size="sm">Hotel</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles de la Reserva" maxWidth="3xl">
      <div className="space-y-6">
        {/* Header with status */}
        <div className="flex items-start justify-between pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${typeConfig.color}15` }}
              >
                <TypeIcon size={20} style={{ color: typeConfig.color }} />
              </div>
              <div>
                <h2 className="text-gray-900">Reserva #{reservation.code}</h2>
                <p className="text-sm text-gray-500">{typeConfig.label}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant={statusConfig.color} size="lg">
              <StatusIcon size={14} />
              {statusConfig.label}
            </Badge>
            <Badge variant={paymentConfig.color} size="lg">
              <CreditCard size={14} />
              {paymentConfig.label}
            </Badge>
          </div>
        </div>

        {/* Client Information */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-gray-900">
            <User size={18} />
            Información del Cliente
          </h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Nombre</p>
              <p className="text-gray-900">{reservation.client.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Email</p>
              <p className="text-gray-900">{reservation.client.email}</p>
            </div>
            <div>
              <p className="text-gray-500">Teléfono</p>
              <p className="text-gray-900">{reservation.client.phone}</p>
            </div>
          </div>
        </div>

        {/* Type-specific details */}
        {renderTypeDetails()}

        {/* Payment Information */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-gray-900">
            <CreditCard size={18} />
            Información de Pago
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Monto Total</p>
              <p className="text-xl text-gray-900">
                ${reservation.totalAmount.toLocaleString('es-CO')}
              </p>
              <p className="text-xs text-gray-500">COP</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Monto Pagado</p>
              <p className="text-xl text-green-600">
                ${reservation.paidAmount.toLocaleString('es-CO')}
              </p>
              <p className="text-xs text-gray-500">COP</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Saldo Pendiente</p>
              <p className="text-xl text-orange-600">
                ${reservation.balance.toLocaleString('es-CO')}
              </p>
              <p className="text-xs text-gray-500">COP</p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Creada por</p>
            <p className="text-gray-900">{reservation.createdBy}</p>
          </div>
          <div>
            <p className="text-gray-500">Fecha de Creación</p>
            <p className="text-gray-900">
              {new Date(reservation.createdAt).toLocaleString('es-CO', {
                dateStyle: 'long',
                timeStyle: 'short',
              })}
            </p>
          </div>
        </div>

        {/* Notes */}
        {reservation.notes && (
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-gray-900">
              <FileText size={18} />
              Notas
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{reservation.notes}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                alert('Descarga de comprobante - Funcionalidad pendiente');
              }}
            >
              <Download size={16} />
              Descargar Comprobante
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (confirm('¿Está seguro de eliminar esta reserva?')) {
                  onDelete(reservation.id);
                  onClose();
                }
              }}
            >
              <Trash2 size={16} />
              Eliminar
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onEdit(reservation);
                onClose();
              }}
            >
              <Edit size={16} />
              Editar
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
