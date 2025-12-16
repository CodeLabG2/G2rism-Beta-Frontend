import React from 'react';
import { User, Mail, Shield, Calendar, AlertCircle } from 'lucide-react';
import type { UserWithRoles } from '../../../services/types/users.types';

interface ProfileViewProps {
  user: UserWithRoles;
}

export function ProfileView({ user }: ProfileViewProps) {
  return (
    <div className="space-y-6">
      {/* Header con badge de Admin */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-[#3A7AFE] to-blue-600 rounded-full flex items-center justify-center ring-4 ring-blue-200">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-[#1A2440]">{user.username}</h1>
              <span className="px-3 py-1 bg-[#3A7AFE] text-white text-xs font-semibold rounded-full">
                ADMINISTRADOR
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
              <p className="font-medium text-[#3A7AFE]">Administrador</p>
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-6 h-6 text-[#3A7AFE]" />
            <h3 className="font-semibold text-blue-900">Acceso de Administrador</h3>
          </div>
          <p className="text-sm text-blue-700 mb-3">
            Como Administrador, tienes los siguientes permisos:
          </p>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
              <span className="font-semibold">Crear</span> registros en todos los módulos
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
              <span className="font-semibold">Leer</span> toda la información del sistema
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></span>
              <span className="font-semibold">Modificar</span> registros existentes
            </li>
          </ul>
        </div>

        {/* Restricción de Eliminación */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-amber-900">Restricción de Permisos</h3>
          </div>
          <p className="text-xs text-amber-700 leading-relaxed">
            <span className="font-semibold">No tienes permiso para eliminar</span> registros permanentemente. 
            Esta acción está reservada exclusivamente para el Super Administrador del sistema. 
            Si necesitas eliminar un registro, contacta al Super Administrador.
          </p>
        </div>
      </div>
    </div>
  );
}
