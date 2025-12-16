import React, { useState, useEffect } from 'react';
import { Modal } from '../../../ui/Modal';
import { Input } from '../../../ui/Input';
import { Select } from '../../../ui/Select';
import { Button } from '../../../ui/Button';
import { Lead, LeadFormData } from './types';
import { X, User, Mail, Phone, Building2, Tag, DollarSign, Calendar, Users } from 'lucide-react';

interface LeadModalProps {
  lead: Lead | null;
  onClose: () => void;
  onSave: (data: LeadFormData) => void;
}

export function LeadModal({ lead, onClose, onSave }: LeadModalProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    firstName: '',
    lastName: '',
    documentType: 'CC',
    documentNumber: '',
    email: '',
    phone: '',
    mobile: '',
    whatsapp: '',
    clientType: 'individual',
    source: 'website',
    priority: 'medium',
    status: 'new',
    assignedTo: 'admin',
    estimatedValue: 0,
    probability: 50,
    travelDate: '',
    numberOfTravelers: 1,
    tags: [],
    notes: ''
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (lead) {
      const [firstName, ...lastNameParts] = lead.fullName.split(' ');
      setFormData({
        firstName: firstName || '',
        lastName: lastNameParts.join(' ') || '',
        documentType: lead.documentType,
        documentNumber: lead.documentNumber,
        email: lead.contact.email,
        phone: lead.contact.phone,
        mobile: lead.contact.mobile || '',
        whatsapp: lead.contact.whatsapp || '',
        clientType: lead.clientType,
        source: lead.source,
        priority: lead.priority,
        status: lead.status,
        assignedTo: lead.assignedTo,
        estimatedValue: lead.estimatedValue,
        probability: lead.probability,
        travelDate: lead.travelDate || '',
        numberOfTravelers: lead.numberOfTravelers || 1,
        tags: lead.tags,
        notes: ''
      });
    }
  }, [lead]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }
    if (!formData.documentNumber.trim()) {
      newErrors.documentNumber = 'El número de documento es requerido';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }
    if (formData.estimatedValue < 0) {
      newErrors.estimatedValue = 'El valor debe ser positivo';
    }
    if (formData.probability < 0 || formData.probability > 100) {
      newErrors.probability = 'La probabilidad debe estar entre 0 y 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={lead ? 'Editar Lead' : 'Nuevo Lead'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            Información Personal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Nombre *
              </label>
              <Input
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Nombre"
                error={errors.firstName}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Apellido *
              </label>
              <Input
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Apellido"
                error={errors.lastName}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Tipo de Documento *
              </label>
              <Select
                value={formData.documentType}
                onChange={(e) => setFormData({ ...formData, documentType: e.target.value as any })}
                options={[
                  { value: 'CC', label: 'Cédula de Ciudadanía' },
                  { value: 'CE', label: 'Cédula de Extranjería' },
                  { value: 'NIT', label: 'NIT' },
                  { value: 'Pasaporte', label: 'Pasaporte' }
                ]}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Número de Documento *
              </label>
              <Input
                value={formData.documentNumber}
                onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                placeholder="123456789"
                error={errors.documentNumber}
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Información de Contacto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Email *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@ejemplo.com"
                error={errors.email}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Teléfono *
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+57 300 123 4567"
                error={errors.phone}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Móvil
              </label>
              <Input
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="+57 300 123 4567"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                WhatsApp
              </label>
              <Input
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="+57 300 123 4567"
              />
            </div>
          </div>
        </div>

        {/* Lead Classification */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Clasificación del Lead
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Tipo de Cliente
              </label>
              <Select
                value={formData.clientType}
                onChange={(e) => setFormData({ ...formData, clientType: e.target.value as any })}
                options={[
                  { value: 'individual', label: 'Individual' },
                  { value: 'corporate', label: 'Corporativo' },
                  { value: 'travel-agency', label: 'Agencia de Viajes' },
                  { value: 'group', label: 'Grupo' }
                ]}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Fuente
              </label>
              <Select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
                options={[
                  { value: 'website', label: 'Sitio Web' },
                  { value: 'referral', label: 'Referido' },
                  { value: 'social-media', label: 'Redes Sociales' },
                  { value: 'email', label: 'Email' },
                  { value: 'phone', label: 'Teléfono' },
                  { value: 'event', label: 'Evento' },
                  { value: 'other', label: 'Otro' }
                ]}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Estado
              </label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                options={[
                  { value: 'new', label: 'Nuevo' },
                  { value: 'contacted', label: 'Contactado' },
                  { value: 'qualified', label: 'Calificado' },
                  { value: 'proposal', label: 'Propuesta' },
                  { value: 'negotiation', label: 'Negociación' },
                  { value: 'won', label: 'Ganado' },
                  { value: 'lost', label: 'Perdido' }
                ]}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Prioridad
              </label>
              <Select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                options={[
                  { value: 'low', label: 'Baja' },
                  { value: 'medium', label: 'Media' },
                  { value: 'high', label: 'Alta' },
                  { value: 'urgent', label: 'Urgente' }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Sales Information */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Información de Ventas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Valor Estimado (COP)
              </label>
              <Input
                type="number"
                value={formData.estimatedValue}
                onChange={(e) => setFormData({ ...formData, estimatedValue: Number(e.target.value) })}
                placeholder="0"
                error={errors.estimatedValue}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Probabilidad (%)
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.probability}
                onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })}
                placeholder="50"
                error={errors.probability}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Fecha de Viaje Estimada
              </label>
              <Input
                type="date"
                value={formData.travelDate}
                onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Número de Viajeros
              </label>
              <Input
                type="number"
                min="1"
                value={formData.numberOfTravelers}
                onChange={(e) => setFormData({ ...formData, numberOfTravelers: Number(e.target.value) })}
                placeholder="1"
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Etiquetas
          </h3>
          <div className="flex gap-2 mb-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Agregar etiqueta"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button type="button" onClick={handleAddTag} variant="secondary">
              Agregar
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <div
                key={index}
                className="bg-[#3A7AFE]/10 text-[#3A7AFE] px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:bg-[#3A7AFE]/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Notas Iniciales
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent"
            placeholder="Notas adicionales sobre el lead..."
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-[#3A7AFE] hover:bg-[#3A7AFE]/90">
            {lead ? 'Actualizar Lead' : 'Crear Lead'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
