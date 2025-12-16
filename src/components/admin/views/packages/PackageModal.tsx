import React, { useState, useEffect } from 'react';
import { Modal } from '../../../ui/Modal';
import { Input } from '../../../ui/Input';
import { Select } from '../../../ui/Select';
import { Button } from '../../../ui/Button';
import { X, Plus, Trash2 } from 'lucide-react';
import { PackageFormData, TourPackage, Destination } from './types';

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PackageFormData) => void;
  package?: TourPackage;
  mode: 'create' | 'edit';
  destinations: Destination[];
}

export function PackageModal({
  isOpen,
  onClose,
  onSave,
  package: pkg,
  mode,
  destinations,
}: PackageModalProps) {
  const [formData, setFormData] = useState<PackageFormData>({
    name: '',
    destinationId: '',
    description: '',
    duration: 5,
    category: 'relaxation',
    status: 'draft',
    basePrice: 0,
    maxGroupSize: 20,
    minGroupSize: 2,
    availableSpots: 20,
    inclusions: [''],
    exclusions: [''],
    startDates: [''],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (pkg && mode === 'edit') {
      setFormData({
        name: pkg.name,
        destinationId: pkg.destination.id,
        description: pkg.description,
        duration: pkg.duration,
        category: pkg.category,
        status: pkg.status,
        basePrice: pkg.basePrice,
        maxGroupSize: pkg.maxGroupSize,
        minGroupSize: pkg.minGroupSize,
        availableSpots: pkg.availableSpots,
        inclusions: pkg.inclusions.length > 0 ? pkg.inclusions : [''],
        exclusions: pkg.exclusions.length > 0 ? pkg.exclusions : [''],
        startDates: pkg.startDates.length > 0 ? pkg.startDates : [''],
      });
    } else {
      // Reset form for create mode
      setFormData({
        name: '',
        destinationId: '',
        description: '',
        duration: 5,
        category: 'relaxation',
        status: 'draft',
        basePrice: 0,
        maxGroupSize: 20,
        minGroupSize: 2,
        availableSpots: 20,
        inclusions: [''],
        exclusions: [''],
        startDates: [''],
      });
    }
    setErrors({});
  }, [pkg, mode, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.destinationId) {
      newErrors.destinationId = 'El destino es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (formData.duration < 1) {
      newErrors.duration = 'La duración debe ser al menos 1 día';
    }

    if (formData.basePrice <= 0) {
      newErrors.basePrice = 'El precio debe ser mayor a 0';
    }

    if (formData.minGroupSize < 1) {
      newErrors.minGroupSize = 'El tamaño mínimo debe ser al menos 1';
    }

    if (formData.maxGroupSize < formData.minGroupSize) {
      newErrors.maxGroupSize = 'El tamaño máximo debe ser mayor o igual al mínimo';
    }

    if (formData.availableSpots < 0) {
      newErrors.availableSpots = 'Los cupos disponibles no pueden ser negativos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Clean up empty strings from arrays
    const cleanedData = {
      ...formData,
      inclusions: formData.inclusions.filter((i) => i.trim() !== ''),
      exclusions: formData.exclusions.filter((e) => e.trim() !== ''),
      startDates: formData.startDates.filter((d) => d.trim() !== ''),
    };

    onSave(cleanedData);
    onClose();
  };

  const handleAddInclusion = () => {
    setFormData({ ...formData, inclusions: [...formData.inclusions, ''] });
  };

  const handleRemoveInclusion = (index: number) => {
    const newInclusions = formData.inclusions.filter((_, i) => i !== index);
    setFormData({ ...formData, inclusions: newInclusions.length > 0 ? newInclusions : [''] });
  };

  const handleInclusionChange = (index: number, value: string) => {
    const newInclusions = [...formData.inclusions];
    newInclusions[index] = value;
    setFormData({ ...formData, inclusions: newInclusions });
  };

  const handleAddExclusion = () => {
    setFormData({ ...formData, exclusions: [...formData.exclusions, ''] });
  };

  const handleRemoveExclusion = (index: number) => {
    const newExclusions = formData.exclusions.filter((_, i) => i !== index);
    setFormData({ ...formData, exclusions: newExclusions.length > 0 ? newExclusions : [''] });
  };

  const handleExclusionChange = (index: number, value: string) => {
    const newExclusions = [...formData.exclusions];
    newExclusions[index] = value;
    setFormData({ ...formData, exclusions: newExclusions });
  };

  const handleAddStartDate = () => {
    setFormData({ ...formData, startDates: [...formData.startDates, ''] });
  };

  const handleRemoveStartDate = (index: number) => {
    const newDates = formData.startDates.filter((_, i) => i !== index);
    setFormData({ ...formData, startDates: newDates.length > 0 ? newDates : [''] });
  };

  const handleStartDateChange = (index: number, value: string) => {
    const newDates = [...formData.startDates];
    newDates[index] = value;
    setFormData({ ...formData, startDates: newDates });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h4>{mode === 'create' ? 'Crear Nuevo Paquete' : 'Editar Paquete'}</h4>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h6 className="text-sm text-gray-700 border-b pb-2">Información Básica</h6>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Nombre del Paquete"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={errors.name}
                  required
                  placeholder="ej: Paraíso Caribeño - San Andrés"
                />
              </div>

              <Select
                label="Destino"
                value={formData.destinationId}
                onChange={(e) => setFormData({ ...formData, destinationId: e.target.value })}
                error={errors.destinationId}
                required
                options={[
                  { value: '', label: 'Selecciona un destino' },
                  ...destinations.map((d) => ({ value: d.id, label: `${d.name}, ${d.country}` })),
                ]}
              />

              <Select
                label="Categoría"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                required
                options={[
                  { value: 'adventure', label: 'Aventura' },
                  { value: 'relaxation', label: 'Relajación' },
                  { value: 'cultural', label: 'Cultural' },
                  { value: 'family', label: 'Familiar' },
                  { value: 'romantic', label: 'Romántico' },
                  { value: 'business', label: 'Negocios' },
                ]}
              />

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A7AFE] ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows={3}
                  placeholder="Describe el paquete turístico..."
                  required
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & Duration */}
          <div className="space-y-4">
            <h6 className="text-sm text-gray-700 border-b pb-2">Precios y Duración</h6>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Duración (días)"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                error={errors.duration}
                required
                min={1}
              />

              <Input
                label="Precio Base (COP)"
                type="number"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                error={errors.basePrice}
                required
                min={0}
                placeholder="2500000"
              />

              <Select
                label="Estado"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                required
                options={[
                  { value: 'draft', label: 'Borrador' },
                  { value: 'active', label: 'Activo' },
                  { value: 'inactive', label: 'Inactivo' },
                  { value: 'archived', label: 'Archivado' },
                ]}
              />
            </div>
          </div>

          {/* Group Size */}
          <div className="space-y-4">
            <h6 className="text-sm text-gray-700 border-b pb-2">Capacidad del Grupo</h6>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Tamaño Mínimo"
                type="number"
                value={formData.minGroupSize}
                onChange={(e) => setFormData({ ...formData, minGroupSize: Number(e.target.value) })}
                error={errors.minGroupSize}
                required
                min={1}
              />

              <Input
                label="Tamaño Máximo"
                type="number"
                value={formData.maxGroupSize}
                onChange={(e) => setFormData({ ...formData, maxGroupSize: Number(e.target.value) })}
                error={errors.maxGroupSize}
                required
                min={1}
              />

              <Input
                label="Cupos Disponibles"
                type="number"
                value={formData.availableSpots}
                onChange={(e) =>
                  setFormData({ ...formData, availableSpots: Number(e.target.value) })
                }
                error={errors.availableSpots}
                required
                min={0}
              />
            </div>
          </div>

          {/* Inclusions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h6 className="text-sm text-gray-700">Incluye</h6>
              <Button type="button" variant="ghost" size="sm" onClick={handleAddInclusion}>
                <Plus size={16} />
                Agregar
              </Button>
            </div>

            <div className="space-y-2">
              {formData.inclusions.map((inclusion, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={inclusion}
                    onChange={(e) => handleInclusionChange(index, e.target.value)}
                    placeholder="ej: Vuelos ida y vuelta"
                  />
                  {formData.inclusions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveInclusion(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Exclusions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h6 className="text-sm text-gray-700">No Incluye</h6>
              <Button type="button" variant="ghost" size="sm" onClick={handleAddExclusion}>
                <Plus size={16} />
                Agregar
              </Button>
            </div>

            <div className="space-y-2">
              {formData.exclusions.map((exclusion, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={exclusion}
                    onChange={(e) => handleExclusionChange(index, e.target.value)}
                    placeholder="ej: Gastos personales"
                  />
                  {formData.exclusions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveExclusion(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Start Dates */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h6 className="text-sm text-gray-700">Fechas de Salida Disponibles</h6>
              <Button type="button" variant="ghost" size="sm" onClick={handleAddStartDate}>
                <Plus size={16} />
                Agregar
              </Button>
            </div>

            <div className="space-y-2">
              {formData.startDates.map((date, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => handleStartDateChange(index, e.target.value)}
                  />
                  {formData.startDates.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStartDate(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              {mode === 'create' ? 'Crear Paquete' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
