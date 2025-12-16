import React from 'react';
import { BarChart3, Download } from 'lucide-react';

export function ReportsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2440]">Reportes y Análisis</h1>
          <p className="text-gray-600 mt-1">Genera y exporta reportes del sistema</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#3A7AFE] text-white rounded-lg hover:bg-[#2868ec] transition-colors">
          <Download className="w-4 h-4" />
          Exportar Reporte
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-lg text-[#1A2440] mb-2">Módulo de Reportes</h3>
          <p className="text-gray-600 mb-4">Acceso completo a todos los reportes</p>
          <div className="flex gap-2 justify-center">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">✓ Ver Reportes</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">✓ Exportar</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">✓ Auditoría</span>
          </div>
        </div>
      </div>
    </div>
  );
}
