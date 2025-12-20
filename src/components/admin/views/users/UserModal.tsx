import { useState, useEffect } from 'react';
import { Modal } from '../../../ui/Modal';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';
import { Select } from '../../../ui/Select';
import { User as UserIcon, Mail, Shield, AlertCircle } from 'lucide-react';
import { toast } from '../../../ui/Toast';
import { User, UserFormData, Role } from './types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserFormData) => void;
  availableRoles: Role[];
  initialData?: User;
  isCreating?: boolean;
  isUpdating?: boolean;
}

/**
 * Modal para crear/editar usuarios
 *
 * BACKEND ESPERA (UsuarioCreateDto):
 * - username: string (3-50 chars, solo letras, números, ., -, _)
 * - email: string (formato email válido)
 * - password: string (8-100 chars, mayúscula, minúscula, número, especial)
 * - confirmPassword: string (debe coincidir con password)
 * - tipoUsuario: 'cliente' | 'empleado'
 * - rolesIds: number[] (opcional)
 *
 * BACKEND ESPERA (UsuarioUpdateDto):
 * - username?: string
 * - email?: string
 * - tipoUsuario?: 'cliente' | 'empleado'
 */
export function UserModal({
  isOpen,
  onClose,
  onSave,
  availableRoles,
  initialData,
  isCreating,
  isUpdating,
}: UserModalProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: '', // Se mapea a username en el adaptador
    email: '',
    phone: '', // NO se envía al backend (solo UI)
    roleId: '',
    department: 'Empleado', // Se mapea a tipoUsuario='empleado' en el adaptador
    avatar: '', // NO se envía al backend (solo UI)
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone || '',
        roleId: initialData.role.id,
        department: initialData.department,
        avatar: initialData.avatar || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        roleId: availableRoles[0]?.id || '',
        department: 'Empleado',
        avatar: '',
      });
    }
    setErrors({});
  }, [initialData, availableRoles, isOpen]);

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {};

    // Username: 3-50 caracteres, solo letras, números, ., -, _
    if (!formData.name.trim()) {
      newErrors.name = 'El username es obligatorio';
    } else if (formData.name.length < 3 || formData.name.length > 50) {
      newErrors.name = 'Debe tener entre 3 y 50 caracteres';
    } else if (!/^[a-zA-Z0-9._-]+$/.test(formData.name)) {
      newErrors.name = 'Solo letras, números, puntos, guiones';
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    } else if (formData.email.length > 100) {
      newErrors.email = 'Máximo 100 caracteres';
    }

    // Tipo de usuario
    if (!formData.department) {
      newErrors.department = 'Selecciona un tipo de usuario';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error('Completa todos los campos correctamente');
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
        {/* Formulario */}
        <div className="grid grid-cols-1 gap-4">
          {/* Username */}
          <div>
            <Input
              label="Username"
              placeholder="juan.perez (solo letras, números, . - _)"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={errors.name}
              required
              icon={<UserIcon size={18} />}
            />
            <p className="text-xs text-gray-500 mt-1">3-50 caracteres. Ejemplo: juan.perez, maria_garcia</p>
          </div>

          {/* Email */}
          <div>
            <Input
              label="Email"
              type="email"
              placeholder="usuario@g2rism.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              required
              icon={<Mail size={18} />}
            />
            <p className="text-xs text-gray-500 mt-1">Máximo 100 caracteres</p>
          </div>

          {/* Tipo de Usuario */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Usuario <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              options={[
                { value: 'Empleado', label: '👔 Empleado' },
                { value: 'Cliente', label: '👤 Cliente' },
              ]}
            />
            {errors.department && (
              <p className="text-sm text-red-500 mt-1">{errors.department}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Se envía al backend como: {formData.department === 'Cliente' ? "'cliente'" : "'empleado'"}
            </p>
          </div>

          {/* Roles */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol <span className="text-gray-400">(Opcional)</span>
            </label>
            <div className="relative">
              <Shield
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
              />
              <Select
                value={formData.roleId}
                onChange={(e) => handleInputChange('roleId', e.target.value)}
                options={[
                  { value: '', label: 'Sin rol' },
                  ...availableRoles.map((role) => ({
                    value: role.id,
                    label: role.name,
                  })),
                ]}
                className="pl-10"
              />
            </div>

            {/* Advertencia si no hay roles */}
            {availableRoles.length === 0 && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex gap-2">
                  <AlertCircle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-yellow-800">
                    <p className="font-semibold">⚠️ No hay roles disponibles</p>
                    <p className="mt-1">
                      Verifica que el backend esté corriendo y que existan roles en la tabla
                      <code className="bg-yellow-100 px-1 mx-1 rounded">Roles</code>
                      (Super Administrador, Administrador, Empleado, Cliente).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Info de roles cargados */}
            {availableRoles.length > 0 && (
              <p className="text-xs text-green-600 mt-1">
                ✅ {availableRoles.length} rol(es) cargados desde la base de datos
              </p>
            )}
          </div>
        </div>

        {/* Información sobre contraseña */}
        {!initialData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>🔒 Contraseña automática:</strong> Se generará una contraseña segura con:
              mayúscula, minúscula, número y carácter especial (8+ caracteres).
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
                <span>{initialData ? 'Actualizando...' : 'Creando...'}</span>
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
