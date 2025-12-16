import React from 'react';
import { User, Mail, Shield, Calendar, ShieldCheck } from 'lucide-react';
import type { UserWithRoles } from '../../../services/types/users.types';

interface ProfileViewProps {
  user: UserWithRoles;
}

export function ProfileView({ user }: ProfileViewProps) {
  return (
    <div className="space-y-6">
      {/* Header con badge especial */}
      <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-[#3A7AFE] rounded-full flex items-center justify-center ring-4 ring-purple-200">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-[#1A2440]">{user.username}</h1>
              <span className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
                SUPER ADMIN
              </span>
            </div>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Información del perfil */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="font-semibold text-lg text-[#1A2440] mb-4">
          Información del Perfil
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Nombre de Usuario</p>
              <p className="font-medium text-[#1A2440]">{user.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Correo Electrónico</p>
              <p className="font-medium text-[#1A2440]">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Rol</p>
              <p className="font-medium text-purple-600">Super Administrador</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Último Acceso</p>
              <p className="font-medium text-[#1A2440]">
                {new Date(user.ultimoAcceso || '').toLocaleString('es-CO')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Permisos */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="font-semibold text-lg text-[#1A2440] mb-4">
          Nivel de Acceso
        </h2>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="w-6 h-6 text-purple-600" />
            <h3 className="font-semibold text-purple-900">Acceso Total al Sistema</h3>
          </div>
          <p className="text-sm text-purple-700 mb-3">
            Como Super Administrador, tienes permisos completos incluyendo:
          </p>
          <ul className="space-y-2 text-sm text-purple-700">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
              Crear, Leer, Modificar y <span className="font-semibold">Eliminar</span> en todos los módulos
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
              Gestión completa de usuarios y empleados
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
              Configuración avanzada del sistema
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
              Acceso a logs de auditoría y respaldos
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
