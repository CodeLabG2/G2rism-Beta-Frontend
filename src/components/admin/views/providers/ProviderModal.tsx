import React, { useState, useEffect } from 'react';
import { Modal } from '../../../ui/Modal';
import { Input } from '../../../ui/Input';
import { Select } from '../../../ui/Select';
import { Button } from '../../../ui/Button';
import { Proveedor, CreateProveedorDTO, TipoProveedor, EstadoProveedor } from './types';
import { Building2, User, Mail, Phone, MapPin, Globe, Star, FileText } from 'lucide-react';

interface ProviderModalProps {
  provider?: Proveedor;
  onClose: () => void;
  onSave: (data: CreateProveedorDTO) => Promise<void>;
}

export function ProviderModal({ provider, onClose, onSave }: ProviderModalProps) {
  const isEditing = !!provider;
  
  const [formData, setFormData] = useState<CreateProveedorDTO>({
    nombreEmpresa: provider?.nombreEmpresa || '',
    nombreContacto: provider?.nombreContacto || '',
    telefono: provider?.telefono || '',
    telefonoAlternativo: provider?.telefonoAlternativo || '',
    correoElectronico: provider?.correoElectronico || '',
    correoAlternativo: provider?.correoAlternativo || '',
    direccion: provider?.direccion || '',
    ciudad: provider?.ciudad || '',
    pais: provider?.pais || 'Colombia',
    nitRut: provider?.nitRut || '',
    tipoProveedor: provider?.tipoProveedor || 'Hotel',
    sitioWeb: provider?.sitioWeb || '',
    calificacion: provider?.calificacion || 5.0,
    estado: provider?.estado || 'Activo',
    observaciones: provider?.observaciones || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombreEmpresa.trim()) {
      newErrors.nombreEmpresa = 'El nombre de la empresa es requerido';
    }

    if (!formData.nombreContacto.trim()) {
      newErrors.nombreContacto = 'El nombre del contacto es requerido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }

    if (!formData.correoElectronico.trim()) {
      newErrors.correoElectronico = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoElectronico)) {
      newErrors.correoElectronico = 'El correo electrónico no es válido';
    }

    if (!formData.ciudad.trim()) {
      newErrors.ciudad = 'La ciudad es requerida';
    }

    if (!formData.pais.trim()) {
      newErrors.pais = 'El país es requerido';
    }

    if (!formData.nitRut.trim()) {
      newErrors.nitRut = 'El NIT/RUT es requerido';
    }

    if (formData.calificacion && (formData.calificacion < 0 || formData.calificacion > 5)) {
      newErrors.calificacion = 'La calificación debe estar entre 0 y 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error al guardar proveedor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CreateProveedorDTO, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEditing ? 'Editar Proveedor' : 'Nuevo Proveedor'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información de la Empresa */}
        <div>
          <h6 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
            <Building2 size={16} />
            Información de la Empresa
          </h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre de la Empresa *"
              value={formData.nombreEmpresa}
              onChange={(e) => handleChange('nombreEmpresa', e.target.value)}
              error={errors.nombreEmpresa}
              placeholder="Hotel Paradise S.A."
            />
            <Input
              label="NIT/RUT *"
              value={formData.nitRut}
              onChange={(e) => handleChange('nitRut', e.target.value)}
              error={errors.nitRut}
              placeholder="900123456-7"
            />
            <Select
              label="Tipo de Proveedor *"
              value={formData.tipoProveedor}
              onChange={(e) => handleChange('tipoProveedor', e.target.value as TipoProveedor)}
            >
              <option value="Hotel">🏨 Hotel</option>
              <option value="Aerolinea">✈️ Aerolínea</option>
              <option value="Transporte">🚗 Transporte</option>
              <option value="Servicios">🎯 Servicios</option>
              <option value="Mixto">🔀 Mixto</option>
            </Select>
            <Select
              label="Estado *"
              value={formData.estado}
              onChange={(e) => handleChange('estado', e.target.value as EstadoProveedor)}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="Suspendido">Suspendido</option>
            </Select>
          </div>
        </div>

        {/* Información de Contacto */}
        <div>
          <h6 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
            <User size={16} />
            Información de Contacto
          </h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre del Contacto *"
              icon={<User size={18} />}
              value={formData.nombreContacto}
              onChange={(e) => handleChange('nombreContacto', e.target.value)}
              error={errors.nombreContacto}
              placeholder="Juan Pérez"
            />
            <Input
              label="Teléfono Principal *"
              icon={<Phone size={18} />}
              value={formData.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              error={errors.telefono}
              placeholder="+57 300 123 4567"
            />
            <Input
              label="Teléfono Alternativo"
              icon={<Phone size={18} />}
              value={formData.telefonoAlternativo}
              onChange={(e) => handleChange('telefonoAlternativo', e.target.value)}
              placeholder="+57 300 765 4321"
            />
            <Input
              label="Correo Electrónico *"
              type="email"
              icon={<Mail size={18} />}
              value={formData.correoElectronico}
              onChange={(e) => handleChange('correoElectronico', e.target.value)}
              error={errors.correoElectronico}
              placeholder="contacto@empresa.com"
            />
            <Input
              label="Correo Alternativo"
              type="email"
              icon={<Mail size={18} />}
              value={formData.correoAlternativo}
              onChange={(e) => handleChange('correoAlternativo', e.target.value)}
              placeholder="ventas@empresa.com"
            />
            <Input
              label="Sitio Web"
              icon={<Globe size={18} />}
              value={formData.sitioWeb}
              onChange={(e) => handleChange('sitioWeb', e.target.value)}
              placeholder="https://www.empresa.com"
            />
          </div>
        </div>

        {/* Ubicación */}
        <div>
          <h6 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
            <MapPin size={16} />
            Ubicación
          </h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Dirección"
              icon={<MapPin size={18} />}
              value={formData.direccion}
              onChange={(e) => handleChange('direccion', e.target.value)}
              placeholder="Calle 123 #45-67"
            />
            <Input
              label="Ciudad *"
              value={formData.ciudad}
              onChange={(e) => handleChange('ciudad', e.target.value)}
              error={errors.ciudad}
              placeholder="Bogotá"
            />
            <Input
              label="País *"
              value={formData.pais}
              onChange={(e) => handleChange('pais', e.target.value)}
              error={errors.pais}
              placeholder="Colombia"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Calificación
              </label>
              <div className="flex items-center gap-2">
                <Star size={18} className="text-yellow-500 fill-yellow-500" />
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.calificacion}
                  onChange={(e) => handleChange('calificacion', parseFloat(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent"
                />
              </div>
              {errors.calificacion && (
                <p className="text-sm text-red-600 mt-1">{errors.calificacion}</p>
              )}
            </div>
          </div>
        </div>

        {/* Observaciones */}
        <div>
          <h6 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
            <FileText size={16} />
            Observaciones
          </h6>
          <textarea
            value={formData.observaciones}
            onChange={(e) => handleChange('observaciones', e.target.value)}
            placeholder="Notas adicionales sobre el proveedor..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent resize-none"
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {isEditing ? 'Actualizar Proveedor' : 'Crear Proveedor'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}