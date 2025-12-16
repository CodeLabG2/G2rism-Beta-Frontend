import React from 'react';
import { Modal } from '../../../ui/Modal';
import { Button } from '../../../ui/Button';
import { Badge } from '../../../ui/Badge';
import { Card } from '../../../ui/Card';
import { Edit, Trash2, DollarSign, Calendar, ArrowRight } from 'lucide-react';
import { Cotizacion } from './types';

interface QuotationDetailsProps {
  quotation: Cotizacion;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onConvertToSale: () => void;
}

export function QuotationDetails({ quotation, onClose, onEdit, onDelete, onConvertToSale }: QuotationDetailsProps) {
  const getEstadoVariant = (estado: string) => {
    const variants: Record<string, 'success' | 'danger' | 'warning' | 'gray'> = {
      Pendiente: 'warning',
      Enviada: 'warning',
      Aceptada: 'success',
      Rechazada: 'danger',
      Vencida: 'gray',
      Convertida: 'success',
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
    <Modal isOpen={true} onClose={onClose} title="Detalles de la Cotización" size="xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b">
          <div>
            <h4>{quotation.numeroCotizacion}</h4>
            <p className="text-gray-600 mt-1">
              {quotation.nombreCliente || `Cliente #${quotation.idCliente}`}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={getEstadoVariant(quotation.estadoCotizacion)}>
                {quotation.estadoCotizacion}
              </Badge>
              {quotation.estaVencida && <Badge variant="danger">Vencida</Badge>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {quotation.estadoCotizacion === 'Aceptada' && (
              <Button
                variant="primary"
                size="sm"
                icon={<ArrowRight size={16} />}
                onClick={onConvertToSale}
              >
                Convertir a Venta
              </Button>
            )}
            <Button variant="outline" size="sm" icon={<Edit size={16} />} onClick={onEdit}>
              Editar
            </Button>
            <Button variant="outline" size="sm" icon={<Trash2 size={16} />} onClick={onDelete}>
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
              <p className="text-sm text-gray-600">Fecha de Cotización</p>
              <p className="font-medium">{formatDate(quotation.fechaCotizacion)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Válida Hasta</p>
              <p className="font-medium">{formatDate(quotation.fechaValidez)}</p>
            </div>
            {quotation.diasValidez !== undefined && (
              <div>
                <p className="text-sm text-gray-600">Días de Validez</p>
                <p className="font-medium">{quotation.diasValidez} días</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Empleado</p>
              <p className="font-medium">
                {quotation.nombreEmpleado || `Empleado #${quotation.idEmpleado}`}
              </p>
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
              <span className="font-medium">{formatCurrency(quotation.subtotal, quotation.moneda)}</span>
            </div>
            <div className="flex justify-between items-center text-red-600">
              <span>Descuento</span>
              <span className="font-medium">-{formatCurrency(quotation.descuento, quotation.moneda)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Impuestos</span>
              <span className="font-medium">{formatCurrency(quotation.impuestos, quotation.moneda)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="font-semibold text-lg">Total</span>
              <span className="font-semibold text-lg text-[#3A7AFE]">
                {formatCurrency(quotation.total, quotation.moneda)}
              </span>
            </div>
          </div>
        </Card>

        {/* Observaciones */}
        {quotation.observaciones && (
          <Card>
            <h6 className="mb-4">Observaciones</h6>
            <p className="text-gray-700 whitespace-pre-wrap">{quotation.observaciones}</p>
          </Card>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
