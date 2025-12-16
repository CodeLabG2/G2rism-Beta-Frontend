import React, { useState } from 'react';
import { Modal } from '../../../ui/Modal';
import { Input } from '../../../ui/Input';
import { Select } from '../../../ui/Select';
import { Button } from '../../../ui/Button';
import { Factura } from './types';

interface CreditNoteModalProps {
  invoice: Factura;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export function CreditNoteModal({ invoice, onClose, onSave }: CreditNoteModalProps) {
  const [formData, setFormData] = useState({
    idFactura: invoice.idFactura,
    prefijo: 'NC',
    fechaEmision: new Date().toISOString().split('T')[0],
    motivo: '',
    subtotal: invoice.subtotal,
    descuento: invoice.descuento,
    impuestos: invoice.impuestos,
    total: invoice.total,
    moneda: invoice.moneda,
    observaciones: '',
  });

  const [loading, setLoading] = useState(false);

  const motivosComunes = [
    'Devolución de mercancía',
    'Descuento no aplicado',
    'Error en facturación',
    'Anulación de servicio',
    'Corrección de datos',
    'Otro',
  ];

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.motivo) {
      alert('Debe especificar el motivo de la nota crédito');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error al guardar nota crédito:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Crear Nota Crédito"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Factura:</strong> {invoice.prefijo}{invoice.numeroFactura}
            <br />
            <strong>Cliente:</strong> {invoice.nombreCliente}
            <br />
            <strong>Total:</strong> {new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: invoice.moneda,
            }).format(invoice.total)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Prefijo"
            type="text"
            value={formData.prefijo}
            onChange={(e) => handleChange('prefijo', e.target.value)}
            placeholder="NC"
            maxLength={4}
          />

          <Input
            label="Fecha de Emisión *"
            type="date"
            value={formData.fechaEmision}
            onChange={(e) => handleChange('fechaEmision', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Motivo *
          </label>
          <Select
            value={formData.motivo}
            onChange={(e) => handleChange('motivo', e.target.value)}
            required
          >
            <option value="">Seleccionar motivo...</option>
            {motivosComunes.map((motivo) => (
              <option key={motivo} value={motivo}>
                {motivo}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Subtotal *"
            type="number"
            step="0.01"
            value={formData.subtotal}
            onChange={(e) => handleChange('subtotal', parseFloat(e.target.value))}
            required
          />

          <Input
            label="Descuento"
            type="number"
            step="0.01"
            value={formData.descuento}
            onChange={(e) => handleChange('descuento', parseFloat(e.target.value) || 0)}
          />

          <Input
            label="Impuestos"
            type="number"
            step="0.01"
            value={formData.impuestos}
            onChange={(e) => handleChange('impuestos', parseFloat(e.target.value) || 0)}
          />

          <Input
            label="Total *"
            type="number"
            step="0.01"
            value={formData.total}
            onChange={(e) => handleChange('total', parseFloat(e.target.value))}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observaciones
          </label>
          <textarea
            value={formData.observaciones}
            onChange={(e) => handleChange('observaciones', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent resize-none"
            placeholder="Detalles adicionales sobre la nota crédito..."
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Importante:</strong> La nota crédito será enviada automáticamente a la DIAN 
            después de ser creada. Asegúrate de que todos los datos sean correctos.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            Crear Nota Crédito
          </Button>
        </div>
      </form>
    </Modal>
  );
}
