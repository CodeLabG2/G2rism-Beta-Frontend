import React from 'react';
import { Truck, Plus, ShieldCheck } from 'lucide-react';

interface TransportViewProps {
  canDelete: boolean;
}

export function TransportView({ canDelete }: TransportViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2440]">Gestión de Transporte</h1>
          <p className="text-gray-600 mt-1">Administra vehículos y conductores</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#3A7AFE] text-white rounded-lg hover:bg-[#2868ec] transition-colors">
          <Plus className="w-4 h-4" />
          Nuevo Vehículo
        </button>
      </div>

      {canDelete && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-purple-600" />
          <p className="text-sm text-purple-700">
            <span className="font-semibold">Modo Super Admin:</span> Puedes eliminar vehículos permanentemente
          </p>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="text-center">
          <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-lg text-[#1A2440] mb-2">Módulo de Transporte</h3>
          <p className="text-gray-600 mb-4">Vista completa con capacidad de eliminación</p>
          <div className="flex gap-2 justify-center">
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">✓ Crear</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">✓ Leer</span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">✓ Modificar</span>
            <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">✓ Eliminar</span>
          </div>
        </div>
      </div>
    </div>
  );
}
