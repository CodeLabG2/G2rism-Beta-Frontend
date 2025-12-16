import React, { useState } from 'react';
import {
  User,
  Mail,
  Shield,
  Key,
  Calendar,
  Clock,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
} from 'lucide-react';
import type { UserWithRoles } from '../../../services/types/users.types';
import { toast } from '../../ui/Toast';

interface ProfileViewProps {
  user: UserWithRoles;
}

export function ProfileView({ user }: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'permissions' | 'security'>('info');
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    // Aquí iría la llamada al backend
    toast.success('Contraseña actualizada exitosamente');
    setIsEditingPassword(false);
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  // Agrupar permisos por módulo
  const permissionsByModule = user.roles.reduce((acc, role) => {
    role.permisos?.forEach(permiso => {
      if (!acc[permiso.modulo]) {
        acc[permiso.modulo] = [];
      }
      if (!acc[permiso.modulo].some(p => p.idPermiso === permiso.idPermiso)) {
        acc[permiso.modulo].push(permiso);
      }
    });
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-[#3A7AFE] to-[#1A2440]"></div>
        <div className="px-8 pb-6">
          <div className="flex items-end gap-6 -mt-16">
            <div className="w-32 h-32 bg-gradient-to-br from-[#3A7AFE] to-[#1A2440] rounded-xl flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-white font-bold text-4xl">
                {user.username.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-3xl font-bold text-[#1A2440]">{user.username}</h1>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                {user.roles.map(role => (
                  <span
                    key={role.idRol}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {role.nombre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <div className="flex gap-8 px-6">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'info'
                  ? 'border-[#3A7AFE] text-[#3A7AFE]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>Información Personal</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'permissions'
                  ? 'border-[#3A7AFE] text-[#3A7AFE]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Mis Permisos</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'security'
                  ? 'border-[#3A7AFE] text-[#3A7AFE]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                <span>Seguridad</span>
              </div>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Información Personal */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usuario
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-[#1A2440]">{user.username}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-[#1A2440]">{user.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Usuario
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <span className="text-[#1A2440] capitalize">{user.tipoUsuario}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${user.estado ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-[#1A2440]">{user.estado ? 'Activo' : 'Inactivo'}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Creación
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-[#1A2440]">
                      {new Date(user.fechaCreacion).toLocaleDateString('es-CO')}
                    </span>
                  </div>
                </div>

                {user.ultimoAcceso && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Último Acceso
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span className="text-[#1A2440]">
                        {new Date(user.ultimoAcceso).toLocaleString('es-CO')}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Roles */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Roles Asignados
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.roles.map(role => (
                    <div
                      key={role.idRol}
                      className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-[#1A2440]">{role.nombre}</h4>
                        <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                          Nivel {role.nivelAcceso}
                        </span>
                      </div>
                      {role.descripcion && (
                        <p className="text-sm text-gray-600">{role.descripcion}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Asignado el {new Date(role.fechaAsignacion).toLocaleDateString('es-CO')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Permisos */}
          {activeTab === 'permissions' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-[#1A2440] mb-2">
                  Tus Permisos en el Sistema
                </h3>
                <p className="text-sm text-gray-600">
                  Estos permisos definen a qué módulos y acciones tienes acceso en la plataforma.
                </p>
              </div>

              {Object.keys(permissionsByModule).length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No tienes permisos asignados</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(permissionsByModule).map(([modulo, permisos]) => (
                    <div
                      key={modulo}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h4 className="font-semibold text-[#1A2440]">{modulo}</h4>
                      </div>
                      <div className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {permisos.map(permiso => (
                            <span
                              key={permiso.idPermiso}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                            >
                              <Check className="w-4 h-4" />
                              {permiso.accion}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Seguridad */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-[#1A2440] mb-2 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Seguridad de tu Cuenta
                </h3>
                <p className="text-sm text-gray-600">
                  Mantén tu cuenta segura cambiando tu contraseña regularmente.
                </p>
              </div>

              {/* Cambiar Contraseña */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-[#1A2440] mb-4">Cambiar Contraseña</h4>

                {!isEditingPassword ? (
                  <button
                    onClick={() => setIsEditingPassword(true)}
                    className="px-4 py-2 bg-[#3A7AFE] text-white rounded-lg hover:bg-[#2868ec] transition-colors"
                  >
                    Cambiar Contraseña
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña Actual
                      </label>
                      <div className="relative">
                        <input
                          type={showOldPassword ? 'text' : 'password'}
                          value={passwordForm.oldPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent"
                          placeholder="Ingresa tu contraseña actual"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nueva Contraseña
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent"
                          placeholder="Ingresa tu nueva contraseña"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Nueva Contraseña
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent"
                          placeholder="Confirma tu nueva contraseña"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleChangePassword}
                        className="px-4 py-2 bg-[#3A7AFE] text-white rounded-lg hover:bg-[#2868ec] transition-colors"
                      >
                        Guardar Cambios
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingPassword(false);
                          setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Información de Seguridad */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-[#1A2440] mb-2">Intentos Fallidos</h5>
                  <p className="text-2xl font-bold text-gray-900">{user.intentosFallidos}</p>
                  <p className="text-sm text-gray-500">veces</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-[#1A2440] mb-2">Estado de Cuenta</h5>
                  <div className="flex items-center gap-2">
                    {user.bloqueado ? (
                      <>
                        <X className="w-5 h-5 text-red-500" />
                        <span className="text-red-600 font-medium">Bloqueada</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5 text-green-500" />
                        <span className="text-green-600 font-medium">Desbloqueada</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
