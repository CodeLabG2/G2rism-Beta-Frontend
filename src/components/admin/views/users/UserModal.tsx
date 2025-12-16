import React, { useState, useEffect } from 'react';
import { Modal } from '../../../ui/Modal';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';
import { Select } from '../../../ui/Select';
import { Avatar } from '../../../ui/Avatar';
import { Upload, User as UserIcon, Mail, Phone, Building2, Shield } from 'lucide-react';
import { toast } from '../../../ui/Toast';
import { User, UserFormData, Role } from './types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserFormData) => void;
  availableRoles: Role[];
  departments: string[];
  initialData?: User;
  isCreating?: boolean;
  isUpdating?: boolean;
}

export function UserModal({
  isOpen,
  onClose,
  onSave,
  availableRoles,
  departments,
  initialData,
  isCreating,
  isUpdating,
}: UserModalProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
    roleId: availableRoles[4]?.id || '',
    department: '',
    avatar: '',
  });

  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone,
        roleId: initialData.role.id,
        department: initialData.department,
        avatar: initialData.avatar || '',
      });
      setAvatarPreview(initialData.avatar || '');
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        roleId: availableRoles[4]?.id || '',
        department: '',
        avatar: '',
      });
      setAvatarPreview('');
    }
    setErrors({});
  }, [initialData, availableRoles, isOpen]);

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo al escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamaño (máx 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('La imagen no puede superar 2MB');
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        toast.error('Solo se permiten archivos de imagen');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setFormData((prev) => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    }

    if (!formData.roleId) {
      newErrors.roleId = 'Debes seleccionar un rol';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'El departamento es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Usuario' : 'Nuevo Usuario'}
      size="lg"
    >
      <div className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-4 pb-6 border-b">
          <div className="relative">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon size={40} className="text-gray-400" />
              </div>
            )}
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 w-8 h-8 bg-[#3A7AFE] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#2d5fd6] transition-colors"
            >
              <Upload size={16} className="text-white" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-gray-600">Click para subir una foto de perfil</p>
        </div>

        {/* Formulario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Nombre Completo"
              placeholder="Ej: Juan Pérez García"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={errors.name}
              required
              icon={<UserIcon size={18} />}
            />
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="correo@g2rism.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            required
            icon={<Mail size={18} />}
          />

          <Input
            label="Teléfono"
            type="tel"
            placeholder="+57 300 123 4567"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            error={errors.phone}
            required
            icon={<Phone size={18} />}
          />

          <div className="relative">
            <label className="block text-sm text-gray-700 mb-2">
              Rol <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Shield
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
              />
              <Select
                value={formData.roleId}
                onChange={(e) => handleInputChange('roleId', e.target.value)}
                options={availableRoles.map((role) => ({
                  value: role.id,
                  label: role.name,
                }))}
                className="pl-10"
              />
            </div>
            {errors.roleId && <p className="text-sm text-red-500 mt-1">{errors.roleId}</p>}
          </div>

          <div className="relative">
            <label className="block text-sm text-gray-700 mb-2">
              Departamento <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
              />
              <Select
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                options={[
                  { value: '', label: 'Seleccionar departamento' },
                  ...departments.map((dept) => ({ value: dept, label: dept })),
                  { value: 'new', label: '+ Agregar nuevo departamento' },
                ]}
                className="pl-10"
              />
            </div>
            {errors.department && (
              <p className="text-sm text-red-500 mt-1">{errors.department}</p>
            )}
          </div>
        </div>

        {/* Info adicional si es nuevo usuario */}
        {!initialData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Nota:</strong> Se enviará un correo electrónico al usuario con las
              credenciales de acceso e instrucciones para activar su cuenta.
            </p>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="secondary" onClick={onClose} disabled={isCreating || isUpdating}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isCreating || isUpdating}>
            {isCreating || isUpdating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{initialData ? 'Guardando...' : 'Creando...'}</span>
              </div>
            ) : (
              <span>{initialData ? 'Guardar Cambios' : 'Crear Usuario'}</span>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}