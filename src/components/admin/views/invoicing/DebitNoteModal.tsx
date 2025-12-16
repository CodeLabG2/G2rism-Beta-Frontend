import React, { useState } from 'react';
import { Modal } from '../../../ui/Modal';
import { Input } from '../../../ui/Input';
import { Select } from '../../../ui/Select';
import { Button } from '../../../ui/Button';
import { Factura } from './types';

interface DebitNoteModalProps {
  invoice: Factura;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export function DebitNoteModal({ invoice, onClose, onSave }: DebitNoteModalProps) {
  const [formData, setFormData] = useState({
    idFactura: invoice.idFactura,
    prefijo: 'ND',
    fechaEmision: new Date().toISOString().split('T')[0],
    motivo: '',
    subtotal: 0,
    descuento: 0,
    impuestos: 0,
    total: 0,
    moneda: invoice.moneda,
    observaciones: '',
  });

  const [loading, setLoading] = useState(false);

  const motivosComunes = [
    'Intereses de mora',
    'Gastos de cobranza',
    'Ajuste de precio',
    'Servicios adicionales',
    'Corrección de datos',
    'Otro',
  ];

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      
      // Recalcular total automáticamente
      if (field === 'subtotal' || field === 'descuento' || field === 'impuestos') {
        const subtotal = field === 'subtotal' ? value : prev.subtotal;
        const descuento = field === 'descuento' ? value : prev.descuento;
        const impuestos = field === 'impuestos' ? value : prev.impuestos;
        newData.total = (subtotal - descuento) + impuestos;
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.motivo) {
      alert('Debe especificar el motivo de la nota débito');
      return;
    }

    if (formData.total <= 0) {
      alert('El total debe ser mayor a cero');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error al guardar nota débito:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Crear Nota Débito"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Factura:</strong> {invoice.prefijo}{invoice.numeroFactura}
            <br />
            <strong>Cliente:</strong> {invoice.nombreCliente}
            <br />
            <strong>Total Factura:</strong> {new Intl.NumberFormat('es-CO', {
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
            placeholder="ND"
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
            onChange={(e) => handleChange('subtotal', parseFloat(e.target.value) || 0)}
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
            label="Impuestos (IVA 19%)"
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
            readOnly
            className="bg-gray-100"
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
            placeholder="Detalles adicionales sobre la nota débito..."
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Importante:</strong> La nota débito incrementará el saldo a favor del vendedor. 
            Será enviada automáticamente a la DIAN después de ser creada.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            Crear Nota Débito
          </Button>
        </div>
      </form>
    </Modal>
  );
}
