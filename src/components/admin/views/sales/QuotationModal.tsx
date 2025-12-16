import React, { useState } from 'react';
import { Modal } from '../../../ui/Modal';
import { Input } from '../../../ui/Input';
import { Select } from '../../../ui/Select';
import { Button } from '../../../ui/Button';
import { Cotizacion, CotizacionFormData, EstadoCotizacion } from './types';

interface QuotationModalProps {
  quotation?: Cotizacion;
  onClose: () => void;
  onSave: (data: CotizacionFormData) => Promise<void>;
}

export function QuotationModal({ quotation, onClose, onSave }: QuotationModalProps) {
  const isEditing = !!quotation;
  
  const [formData, setFormData] = useState<CotizacionFormData>({
    idCliente: quotation?.idCliente || 1,
    idEmpleado: quotation?.idEmpleado || 1,
    fechaCotizacion: quotation?.fechaCotizacion?.split('T')[0] || new Date().toISOString().split('T')[0],
    fechaValidez: quotation?.fechaValidez?.split('T')[0] || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    subtotal: quotation?.subtotal || 0,
    descuento: quotation?.descuento || 0,
    impuestos: quotation?.impuestos || 0,
    total: quotation?.total || 0,
    moneda: quotation?.moneda || 'COP',
    estadoCotizacion: quotation?.estadoCotizacion || 'Pendiente',
    observaciones: quotation?.observaciones || '',
  });

  const [loading, setLoading] = useState(false);

  const calculateTotal = (subtotal: number, descuento: number, impuestos: number) => {
    const afterDiscount = subtotal - descuento;
    return afterDiscount + impuestos;
  };

  const handleChange = (field: keyof CotizacionFormData, value: any) => {
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
    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error al guardar cotización:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEditing ? 'Editar Cotización' : 'Nueva Cotización'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="ID Cliente *"
            type="number"
            value={formData.idCliente}
            onChange={(e) => handleChange('idCliente', parseInt(e.target.value))}
            required
          />
          <Input
            label="ID Empleado *"
            type="number"
            value={formData.idEmpleado}
            onChange={(e) => handleChange('idEmpleado', parseInt(e.target.value))}
            required
          />
          <Select
            label="Estado *"
            value={formData.estadoCotizacion}
            onChange={(e) => handleChange('estadoCotizacion', e.target.value as EstadoCotizacion)}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Enviada">Enviada</option>
            <option value="Aceptada">Aceptada</option>
            <option value="Rechazada">Rechazada</option>
          </Select>
          <Select
            label="Moneda *"
            value={formData.moneda}
            onChange={(e) => handleChange('moneda', e.target.value)}
          >
            <option value="COP">COP - Peso Colombiano</option>
            <option value="USD">USD - Dólar</option>
            <option value="EUR">EUR - Euro</option>
          </Select>
          <Input
            label="Fecha de Cotización *"
            type="date"
            value={formData.fechaCotizacion}
            onChange={(e) => handleChange('fechaCotizacion', e.target.value)}
            required
          />
          <Input
            label="Válida Hasta *"
            type="date"
            value={formData.fechaValidez}
            onChange={(e) => handleChange('fechaValidez', e.target.value)}
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
            placeholder="Notas adicionales sobre la cotización..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {isEditing ? 'Actualizar Cotización' : 'Crear Cotización'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
