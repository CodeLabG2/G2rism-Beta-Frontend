import React, { useState } from 'react';
import { Modal } from '../../../ui/Modal';
import { Input } from '../../../ui/Input';
import { Select } from '../../../ui/Select';
import { Button } from '../../../ui/Button';
import { Factura, EstadoFactura } from './types';

interface InvoiceModalProps {
  invoice?: Factura;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export function InvoiceModal({ invoice, onClose, onSave }: InvoiceModalProps) {
  const isEditing = !!invoice;
  
  const [formData, setFormData] = useState({
    idVenta: invoice?.idVenta || 0,
    prefijo: invoice?.prefijo || 'FE',
    fechaEmision: invoice?.fechaEmision?.split('T')[0] || new Date().toISOString().split('T')[0],
    fechaVencimiento: invoice?.fechaVencimiento?.split('T')[0] || 
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    subtotal: invoice?.subtotal || 0,
    descuento: invoice?.descuento || 0,
    impuestos: invoice?.impuestos || 0,
    total: invoice?.total || 0,
    moneda: invoice?.moneda || 'COP',
    estadoFactura: invoice?.estadoFactura || 'Borrador' as EstadoFactura,
    observaciones: invoice?.observaciones || '',
  });

  const [loading, setLoading] = useState(false);

  const calculateTotal = (subtotal: number, descuento: number, impuestos: number) => {
    const afterDiscount = subtotal - descuento;
    return afterDiscount + impuestos;
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      
      // Recalcular total automáticamente
      if (field === 'subtotal' || field === 'descuento' || field === 'impuestos') {
        newData.total = calculateTotal(
          field === 'subtotal' ? value : prev.subtotal,
          field === 'descuento' ? value : prev.descuento,
          field === 'impuestos' ? value : prev.impuestos
        );
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.idVenta === 0) {
      alert('Debe seleccionar una venta');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error al guardar factura:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEditing ? 'Editar Factura' : 'Nueva Factura'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Las facturas deben crearse a partir de una venta existente. 
            Asegúrate de ingresar el ID de la venta correspondiente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="ID de Venta *"
            type="number"
            value={formData.idVenta}
            onChange={(e) => handleChange('idVenta', parseInt(e.target.value))}
            required
            disabled={isEditing}
          />

          <Input
            label="Prefijo"
            type="text"
            value={formData.prefijo}
            onChange={(e) => handleChange('prefijo', e.target.value)}
            placeholder="FE"
            maxLength={4}
          />

          <Input
            label="Fecha de Emisión *"
            type="date"
            value={formData.fechaEmision}
            onChange={(e) => handleChange('fechaEmision', e.target.value)}
            required
          />

          <Input
            label="Fecha de Vencimiento *"
            type="date"
            value={formData.fechaVencimiento}
            onChange={(e) => handleChange('fechaVencimiento', e.target.value)}
            required
          />

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
            label="Impuestos (IVA 19%) *"
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

          <Select
            label="Moneda *"
            value={formData.moneda}
            onChange={(e) => handleChange('moneda', e.target.value)}
          >
            <option value="COP">COP - Peso Colombiano</option>
            <option value="USD">USD - Dólar</option>
            <option value="EUR">EUR - Euro</option>
          </Select>

          <Select
            label="Estado *"
            value={formData.estadoFactura}
            onChange={(e) => handleChange('estadoFactura', e.target.value)}
          >
            <option value="Borrador">Borrador</option>
            <option value="Enviada_DIAN">Enviada DIAN</option>
            <option value="Aprobada_DIAN">Aprobada DIAN</option>
            <option value="Rechazada_DIAN">Rechazada DIAN</option>
            <option value="Anulada">Anulada</option>
          </Select>
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
            placeholder="Notas adicionales sobre la factura..."
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Importante:</strong> Una vez enviada a la DIAN, la factura no podrá ser modificada. 
            Solo podrá ser anulada mediante una nota crédito.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {isEditing ? 'Actualizar Factura' : 'Crear Factura'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
