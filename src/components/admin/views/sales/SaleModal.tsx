import React, { useState } from 'react';
import { Modal } from '../../../ui/Modal';
import { Input } from '../../../ui/Input';
import { Select } from '../../../ui/Select';
import { Button } from '../../../ui/Button';
import { Venta, VentaFormData, TipoVenta, EstadoVenta, MetodoPago } from './types';

interface SaleModalProps {
  sale?: Venta;
  onClose: () => void;
  onSave: (data: VentaFormData) => Promise<void>;
}

export function SaleModal({ sale, onClose, onSave }: SaleModalProps) {
  const isEditing = !!sale;
  
  const [formData, setFormData] = useState<VentaFormData>({
    idCliente: sale?.idCliente || 1,
    idEmpleado: sale?.idEmpleado || 1,
    tipoVenta: sale?.tipoVenta || 'Paquete',
    fechaVenta: sale?.fechaVenta?.split('T')[0] || new Date().toISOString().split('T')[0],
    fechaViaje: sale?.fechaViaje?.split('T')[0] || new Date().toISOString().split('T')[0],
    subtotal: sale?.subtotal || 0,
    descuento: sale?.descuento || 0,
    impuestos: sale?.impuestos || 0,
    total: sale?.total || 0,
    moneda: sale?.moneda || 'COP',
    metodoPago: sale?.metodoPago,
    estadoVenta: sale?.estadoVenta || 'Borrador',
    observaciones: sale?.observaciones || '',
  });

  const [loading, setLoading] = useState(false);

  const calculateTotal = (subtotal: number, descuento: number, impuestos: number) => {
    const afterDiscount = subtotal - descuento;
    return afterDiscount + impuestos;
  };

  const handleChange = (field: keyof VentaFormData, value: any) => {
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
      console.error('Error al guardar venta:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEditing ? 'Editar Venta' : 'Nueva Venta'}
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
            label="Tipo de Venta *"
            value={formData.tipoVenta}
            onChange={(e) => handleChange('tipoVenta', e.target.value as TipoVenta)}
          >
            <option value="Paquete">Paquete</option>
            <option value="Servicio_Individual">Servicio Individual</option>
            <option value="Personalizado">Personalizado</option>
          </Select>
          <Select
            label="Estado *"
            value={formData.estadoVenta}
            onChange={(e) => handleChange('estadoVenta', e.target.value as EstadoVenta)}
          >
            <option value="Borrador">Borrador</option>
            <option value="Confirmada">Confirmada</option>
            <option value="Pagada">Pagada</option>
            <option value="Completada">Completada</option>
          </Select>
          <Input
            label="Fecha de Venta *"
            type="date"
            value={formData.fechaVenta}
            onChange={(e) => handleChange('fechaVenta', e.target.value)}
            required
          />
          <Input
            label="Fecha de Viaje *"
            type="date"
            value={formData.fechaViaje}
            onChange={(e) => handleChange('fechaViaje', e.target.value)}
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
            label="Método de Pago"
            value={formData.metodoPago || ''}
            onChange={(e) => handleChange('metodoPago', e.target.value as MetodoPago || undefined)}
          >
            <option value="">Seleccionar...</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Tarjeta_Credito">Tarjeta de Crédito</option>
            <option value="Tarjeta_Debito">Tarjeta de Débito</option>
            <option value="Transferencia">Transferencia</option>
            <option value="PSE">PSE</option>
            <option value="Otro">Otro</option>
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
            placeholder="Notas adicionales sobre la venta..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {isEditing ? 'Actualizar Venta' : 'Crear Venta'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
