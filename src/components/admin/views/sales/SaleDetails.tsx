import React from 'react';
import { Modal } from '../../../ui/Modal';
import { Button } from '../../../ui/Button';
import { Badge } from '../../../ui/Badge';
import { Card } from '../../../ui/Card';
import { Edit, Trash2, DollarSign, Calendar, User, CreditCard } from 'lucide-react';
import { Venta } from './types';

interface SaleDetailsProps {
  sale: Venta;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function SaleDetails({ sale, onClose, onEdit, onDelete }: SaleDetailsProps) {
  const getEstadoVariant = (estado: string) => {
    const variants: Record<string, 'success' | 'danger' | 'warning' | 'gray'> = {
      Borrador: 'gray',
      Confirmada: 'warning',
      Pagada: 'success',
      Completada: 'success',
      Cancelada: 'gray',
      Anulada: 'danger',
    };
    return variants[estado] || 'gray';
  };

  const formatCurrency = (value: number, currency: string = 'COP') => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Detalles de la Venta" size="xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b">
          <div>
            <h4>{sale.numeroVenta}</h4>
            <p className="text-gray-600 mt-1">
              {sale.nombreCliente || `Cliente #${sale.idCliente}`}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={getEstadoVariant(sale.estadoVenta)}>{sale.estadoVenta}</Badge>
              <Badge variant="default">{sale.tipoVenta.replace('_', ' ')}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={<Edit size={16} />} onClick={onEdit}>
              Editar
            </Button>
            <Button variant="secondary" size="sm" icon={<Trash2 size={16} />} onClick={onDelete}>
              Eliminar
            </Button>
          </div>
        </div>

        {/* Información General */}
        <Card>
          <h6 className="flex items-center gap-2 mb-4">
            <Calendar size={18} />
            Información General
          </h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Fecha de Venta</p>
              <p className="font-medium">{formatDate(sale.fechaVenta)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fecha de Viaje</p>
              <p className="font-medium">{formatDate(sale.fechaViaje)}</p>
            </div>
            {sale.fechaPago && (
              <div>
                <p className="text-sm text-gray-600">Fecha de Pago</p>
                <p className="font-medium">{formatDate(sale.fechaPago)}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Empleado</p>
              <p className="font-medium">{sale.nombreEmpleado || `Empleado #${sale.idEmpleado}`}</p>
            </div>
          </div>
        </Card>

        {/* Información Financiera */}
        <Card>
          <h6 className="flex items-center gap-2 mb-4">
            <DollarSign size={18} />
            Información Financiera
          </h6>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(sale.subtotal, sale.moneda)}</span>
            </div>
            <div className="flex justify-between items-center text-red-600">
              <span>Descuento</span>
              <span className="font-medium">-{formatCurrency(sale.descuento, sale.moneda)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Impuestos</span>
              <span className="font-medium">{formatCurrency(sale.impuestos, sale.moneda)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="font-semibold text-lg">Total</span>
              <span className="font-semibold text-lg text-[#3A7AFE]">
                {formatCurrency(sale.total, sale.moneda)}
              </span>
            </div>
          </div>
        </Card>

        {/* Método de Pago */}
        {sale.metodoPago && (
          <Card>
            <h6 className="flex items-center gap-2 mb-4">
              <CreditCard size={18} />
              Método de Pago
            </h6>
            <p className="font-medium">{sale.metodoPago.replace('_', ' ')}</p>
          </Card>
        )}

        {/* Observaciones */}
        {sale.observaciones && (
          <Card>
            <h6 className="mb-4">Observaciones</h6>
            <p className="text-gray-700 whitespace-pre-wrap">{sale.observaciones}</p>
          </Card>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
