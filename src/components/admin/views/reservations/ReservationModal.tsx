import React, { useState, useEffect } from 'react';
import { Modal } from '../../../ui/Modal';
import { Input } from '../../../ui/Input';
import { Select } from '../../../ui/Select';
import { Button } from '../../../ui/Button';
import { X, Plane, Building, Package, CreditCard } from 'lucide-react';
import { ReservationFormData, ReservationType, Reservation } from './types';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ReservationFormData) => void;
  reservation?: Reservation;
  mode: 'create' | 'edit';
}

/**
 * ⚠️ DATOS MOCK COMENTADOS - USAR API REAL
 * Fecha de comentado: 2025-12-16
 */

/* MOCK DATA COMENTADO - Usar API real
// Mock clients data
const mockClients = [
  { id: '1', name: 'Juan Pérez', email: 'juan@example.com', phone: '+57 300 123 4567' },
  { id: '2', name: 'María García', email: 'maria@example.com', phone: '+57 301 234 5678' },
  { id: '3', name: 'Carlos Rodríguez', email: 'carlos@example.com', phone: '+57 302 345 6789' },
  { id: '4', name: 'Ana Martínez', email: 'ana@example.com', phone: '+57 303 456 7890' },
];
*/ // FIN MOCK DATA COMENTADO

// ⚠️ Array vacío - Usar API real para obtener clientes
const mockClients: Array<{id: string; name: string; email: string; phone: string}> = [];

export function ReservationModal({ isOpen, onClose, onSave, reservation, mode }: ReservationModalProps) {
  const [formData, setFormData] = useState<ReservationFormData>({
    type: 'flight',
    clientId: '',
    status: 'pending',
    paymentStatus: 'pending',
    totalAmount: 0,
    paidAmount: 0,
    notes: '',
    flightClass: 'economy',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (reservation && mode === 'edit') {
      const data: ReservationFormData = {
        type: reservation.type,
        clientId: reservation.client.id,
        status: reservation.status,
        paymentStatus: reservation.paymentStatus,
        totalAmount: reservation.totalAmount,
        paidAmount: reservation.paidAmount,
        notes: reservation.notes,
      };

      // Flight data
      if (reservation.flight) {
        data.flightAirline = reservation.flight.airline;
        data.flightNumber = reservation.flight.flightNumber;
        data.flightOrigin = reservation.flight.origin;
        data.flightDestination = reservation.flight.destination;
        data.flightDeparture = reservation.flight.departure;
        data.flightArrival = reservation.flight.arrival;
        data.flightClass = reservation.flight.class;
      }

      // Hotel data
      if (reservation.hotel) {
        data.hotelName = reservation.hotel.name;
        data.hotelLocation = reservation.hotel.location;
        data.hotelCheckIn = reservation.hotel.checkIn;
        data.hotelCheckOut = reservation.hotel.checkOut;
        data.hotelRoomType = reservation.hotel.roomType;
      }

      // Package data
      if (reservation.package) {
        data.packageName = reservation.package.name;
        data.packageDestination = reservation.package.destination;
        data.packageStartDate = reservation.package.startDate;
        data.packageEndDate = reservation.package.endDate;
        data.packageIncludesFlights = reservation.package.includesFlights;
        data.packageIncludesHotel = reservation.package.includesHotel;
      }

      setFormData(data);
    } else if (mode === 'create') {
      setFormData({
        type: 'flight',
        clientId: '',
        status: 'pending',
        paymentStatus: 'pending',
        totalAmount: 0,
        paidAmount: 0,
        notes: '',
        flightClass: 'economy',
      });
    }
  }, [reservation, mode, isOpen]);

  const handleChange = (field: keyof ReservationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientId) newErrors.clientId = 'Seleccione un cliente';
    if (!formData.totalAmount || formData.totalAmount <= 0) newErrors.totalAmount = 'El monto debe ser mayor a 0';
    if (formData.paidAmount > formData.totalAmount) newErrors.paidAmount = 'El monto pagado no puede ser mayor al total';

    // Type-specific validations
    if (formData.type === 'flight') {
      if (!formData.flightAirline) newErrors.flightAirline = 'Requerido';
      if (!formData.flightNumber) newErrors.flightNumber = 'Requerido';
      if (!formData.flightOrigin) newErrors.flightOrigin = 'Requerido';
      if (!formData.flightDestination) newErrors.flightDestination = 'Requerido';
      if (!formData.flightDeparture) newErrors.flightDeparture = 'Requerido';
      if (!formData.flightArrival) newErrors.flightArrival = 'Requerido';
    } else if (formData.type === 'hotel') {
      if (!formData.hotelName) newErrors.hotelName = 'Requerido';
      if (!formData.hotelLocation) newErrors.hotelLocation = 'Requerido';
      if (!formData.hotelCheckIn) newErrors.hotelCheckIn = 'Requerido';
      if (!formData.hotelCheckOut) newErrors.hotelCheckOut = 'Requerido';
      if (!formData.hotelRoomType) newErrors.hotelRoomType = 'Requerido';
    } else if (formData.type === 'package') {
      if (!formData.packageName) newErrors.packageName = 'Requerido';
      if (!formData.packageDestination) newErrors.packageDestination = 'Requerido';
      if (!formData.packageStartDate) newErrors.packageStartDate = 'Requerido';
      if (!formData.packageEndDate) newErrors.packageEndDate = 'Requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const renderTypeSpecificFields = () => {
    switch (formData.type) {
      case 'flight':
        return (
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-gray-700">
              <Plane size={18} />
              Detalles del Vuelo
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Aerolínea"
                value={formData.flightAirline || ''}
                onChange={(e) => handleChange('flightAirline', e.target.value)}
                error={errors.flightAirline}
                placeholder="Ej: Avianca"
              />
              <Input
                label="Número de Vuelo"
                value={formData.flightNumber || ''}
                onChange={(e) => handleChange('flightNumber', e.target.value)}
                error={errors.flightNumber}
                placeholder="Ej: AV123"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Origen"
                value={formData.flightOrigin || ''}
                onChange={(e) => handleChange('flightOrigin', e.target.value)}
                error={errors.flightOrigin}
                placeholder="Ej: BOG - Bogotá"
              />
              <Input
                label="Destino"
                value={formData.flightDestination || ''}
                onChange={(e) => handleChange('flightDestination', e.target.value)}
                error={errors.flightDestination}
                placeholder="Ej: MIA - Miami"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="datetime-local"
                label="Fecha/Hora Salida"
                value={formData.flightDeparture || ''}
                onChange={(e) => handleChange('flightDeparture', e.target.value)}
                error={errors.flightDeparture}
              />
              <Input
                type="datetime-local"
                label="Fecha/Hora Llegada"
                value={formData.flightArrival || ''}
                onChange={(e) => handleChange('flightArrival', e.target.value)}
                error={errors.flightArrival}
              />
            </div>
            <Select
              label="Clase"
              value={formData.flightClass || 'economy'}
              onChange={(e) => handleChange('flightClass', e.target.value)}
              options={[
                { value: 'economy', label: 'Económica' },
                { value: 'business', label: 'Ejecutiva' },
                { value: 'first', label: 'Primera Clase' },
              ]}
            />
          </div>
        );

      case 'hotel':
        return (
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-gray-700">
              <Building size={18} />
              Detalles del Hotel
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nombre del Hotel"
                value={formData.hotelName || ''}
                onChange={(e) => handleChange('hotelName', e.target.value)}
                error={errors.hotelName}
                placeholder="Ej: Hotel Hilton"
              />
              <Input
                label="Ubicación"
                value={formData.hotelLocation || ''}
                onChange={(e) => handleChange('hotelLocation', e.target.value)}
                error={errors.hotelLocation}
                placeholder="Ej: Cartagena, Colombia"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                label="Check-in"
                value={formData.hotelCheckIn || ''}
                onChange={(e) => handleChange('hotelCheckIn', e.target.value)}
                error={errors.hotelCheckIn}
              />
              <Input
                type="date"
                label="Check-out"
                value={formData.hotelCheckOut || ''}
                onChange={(e) => handleChange('hotelCheckOut', e.target.value)}
                error={errors.hotelCheckOut}
              />
            </div>
            <Input
              label="Tipo de Habitación"
              value={formData.hotelRoomType || ''}
              onChange={(e) => handleChange('hotelRoomType', e.target.value)}
              error={errors.hotelRoomType}
              placeholder="Ej: Suite Doble con Vista al Mar"
            />
          </div>
        );

      case 'package':
        return (
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-gray-700">
              <Package size={18} />
              Detalles del Paquete Turístico
            </h3>
            <Input
              label="Nombre del Paquete"
              value={formData.packageName || ''}
              onChange={(e) => handleChange('packageName', e.target.value)}
              error={errors.packageName}
              placeholder="Ej: Caribe Total 5 Días"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Destino"
                value={formData.packageDestination || ''}
                onChange={(e) => handleChange('packageDestination', e.target.value)}
                error={errors.packageDestination}
                placeholder="Ej: San Andrés, Colombia"
              />
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.packageIncludesFlights || false}
                    onChange={(e) => handleChange('packageIncludesFlights', e.target.checked)}
                    className="w-4 h-4 rounded border-2 border-gray-300 bg-white text-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-0 cursor-pointer transition-all checked:bg-[#3A7AFE] checked:border-[#3A7AFE] hover:border-[#3A7AFE] accent-[#3A7AFE]"
                  />
                  Incluye Vuelos
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.packageIncludesHotel || false}
                    onChange={(e) => handleChange('packageIncludesHotel', e.target.checked)}
                    className="w-4 h-4 rounded border-2 border-gray-300 bg-white text-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-0 cursor-pointer transition-all checked:bg-[#3A7AFE] checked:border-[#3A7AFE] hover:border-[#3A7AFE] accent-[#3A7AFE]"
                  />
                  Incluye Hotel
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                label="Fecha Inicio"
                value={formData.packageStartDate || ''}
                onChange={(e) => handleChange('packageStartDate', e.target.value)}
                error={errors.packageStartDate}
              />
              <Input
                type="date"
                label="Fecha Fin"
                value={formData.packageEndDate || ''}
                onChange={(e) => handleChange('packageEndDate', e.target.value)}
                error={errors.packageEndDate}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Nueva Reserva' : 'Editar Reserva'}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-gray-700">Información Básica</h3>
          
          <Select
            label="Tipo de Reserva"
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value as ReservationType)}
            options={[
              { value: 'flight', label: '✈️ Vuelo' },
              { value: 'hotel', label: '🏨 Hotel' },
              { value: 'package', label: '📦 Paquete Turístico' },
              { value: 'transport', label: '🚗 Transporte' },
            ]}
          />

          <Select
            label="Cliente"
            value={formData.clientId}
            onChange={(e) => handleChange('clientId', e.target.value)}
            error={errors.clientId}
            options={[
              { value: '', label: 'Seleccione un cliente' },
              ...mockClients.map((client) => ({
                value: client.id,
                label: `${client.name} - ${client.email}`,
              })),
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Estado de Reserva"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              options={[
                { value: 'pending', label: 'Pendiente' },
                { value: 'confirmed', label: 'Confirmada' },
                { value: 'cancelled', label: 'Cancelada' },
                { value: 'completed', label: 'Completada' },
              ]}
            />
            <Select
              label="Estado de Pago"
              value={formData.paymentStatus}
              onChange={(e) => handleChange('paymentStatus', e.target.value)}
              options={[
                { value: 'pending', label: 'Pendiente' },
                { value: 'partial', label: 'Parcial' },
                { value: 'paid', label: 'Pagado' },
                { value: 'refunded', label: 'Reembolsado' },
              ]}
            />
          </div>
        </div>

        {/* Type-specific fields */}
        {renderTypeSpecificFields()}

        {/* Payment Information */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-gray-700">
            <CreditCard size={18} />
            Información de Pago
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Monto Total (COP)"
              value={formData.totalAmount}
              onChange={(e) => handleChange('totalAmount', parseFloat(e.target.value) || 0)}
              error={errors.totalAmount}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            <Input
              type="number"
              label="Monto Pagado (COP)"
              value={formData.paidAmount}
              onChange={(e) => handleChange('paidAmount', parseFloat(e.target.value) || 0)}
              error={errors.paidAmount}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
          {formData.totalAmount > 0 && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Saldo Pendiente:{' '}
                <span className="text-[#3A7AFE]">
                  ${(formData.totalAmount - formData.paidAmount).toLocaleString('es-CO')} COP
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">Notas Adicionales</label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent resize-none"
            rows={3}
            placeholder="Agregar notas o comentarios sobre la reserva..."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            {mode === 'create' ? 'Crear Reserva' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}