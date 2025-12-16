import React from 'react';
import { Settings, ShieldCheck, AlertTriangle } from 'lucide-react';

interface SettingsViewProps {
  canDelete: boolean;
}

export function SettingsView({ canDelete }: SettingsViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A2440]">Configuración del Sistema</h1>
        <p className="text-gray-600 mt-1">Administra configuración avanzada</p>
      </div>

      {canDelete && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-900 mb-1">Acceso Crítico</p>
            <p className="text-xs text-amber-700">
              Puedes modificar y eliminar configuraciones críticas del sistema. Procede con precaución.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="text-center">
          <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-lg text-[#1A2440] mb-2">Módulo de Configuración</h3>
          <p className="text-gray-600 mb-4">Vista completa con acceso administrativo total</p>
          <div className="flex gap-2 justify-center flex-wrap">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">✓ Ver Config</span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">✓ Modificar</span>
            <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">✓ Eliminar</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">✓ Backup</span>
          </div>
        </div>
      </div>
    </div>
  );
}
