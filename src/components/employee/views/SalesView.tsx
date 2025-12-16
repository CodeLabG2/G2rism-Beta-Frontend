import React, { useState } from 'react';
import { DollarSign, TrendingUp, Calendar, Award, Package, User, Eye, Download, Calculator } from 'lucide-react';
import { QuickQuoteModal } from '../modals/QuickQuoteModal';
import { motion } from 'motion/react';
import type { PermissionSummary } from '../../../services/types/roles.types';

interface SalesViewProps {
  permissions: PermissionSummary[];
}

export function SalesView({ permissions }: SalesViewProps) {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Mock data - Ventas personales del empleado
  const mySales = [
    {
      id: 'VEN-2025-089',
      client: 'Juan Pérez',
      package: 'Cartagena Premium',
      amount: 2500000,
      commission: 212500,
      status: 'Pagado',
      date: '2024-12-10',
      paymentMethod: 'Tarjeta de Crédito',
    },
    {
      id: 'VEN-2025-090',
      client: 'María García',
      package: 'San Andrés Paradise',
      amount: 6400000,
      commission: 544000,
      status: 'Pendiente',
      date: '2024-12-11',
      paymentMethod: 'Transferencia',
    },
    {
      id: 'VEN-2025-087',
      client: 'Carlos López',
      package: 'Eje Cafetero Experience',
      amount: 1800000,
      commission: 153000,
      status: 'Pagado',
      date: '2024-12-08',
      paymentMethod: 'Efectivo',
    },
    {
      id: 'VEN-2025-083',
      client: 'Laura Martínez',
      package: 'Santa Marta Beach',
      amount: 2100000,
      commission: 178500,
      status: 'Pagado',
      date: '2024-12-05',
      paymentMethod: 'Tarjeta de Débito',
    },
    {
      id: 'VEN-2025-091',
      client: 'Pedro Sánchez',
      package: 'Bogotá Cultural',
      amount: 1200000,
      commission: 102000,
      status: 'Pendiente',
      date: '2024-12-12',
      paymentMethod: 'Transferencia',
    },
  ];

  const stats = {
    totalSales: mySales.reduce((sum, s) => sum + s.amount, 0),
    totalCommissions: mySales.reduce((sum, s) => sum + s.commission, 0),
    paidCommissions: mySales.filter(s => s.status === 'Pagado').reduce((sum, s) => sum + s.commission, 0),
    pendingCommissions: mySales.filter(s => s.status === 'Pendiente').reduce((sum, s) => sum + s.commission, 0),
    salesCount: mySales.length,
    averageTicket: mySales.reduce((sum, s) => sum + s.amount, 0) / mySales.length,
  };

  // Datos mensuales para el gráfico
  const monthlyData = [
    { month: 'Jul', sales: 18000000, commission: 1530000 },
    { month: 'Ago', sales: 22000000, commission: 1870000 },
    { month: 'Sep', sales: 28000000, commission: 2380000 },
    { month: 'Oct', sales: 35000000, commission: 2975000 },
    { month: 'Nov', sales: 42000000, commission: 3570000 },
    { month: 'Dic', sales: 48500000, commission: 4122500 },
  ];

  const getStatusConfig = (status: string) => {
    return status === 'Pagado'
      ? { color: 'bg-green-100 text-green-700 border-green-300', icon: '✓' }
      : { color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: '⏳' };
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-6 text-white"
        >
          <DollarSign className="w-10 h-10 mb-3 opacity-90" />
          <p className="text-3xl font-bold mb-1">${(stats.totalSales / 1000000).toFixed(1)}M</p>
          <p className="text-green-100 text-sm">Ventas Totales</p>
          <p className="text-xs text-green-200 mt-2">{stats.salesCount} transacciones</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#3A7AFE] to-[#1A2440] rounded-xl p-6 text-white"
        >
          <Award className="w-10 h-10 mb-3 opacity-90" />
          <p className="text-3xl font-bold mb-1">${(stats.totalCommissions / 1000000).toFixed(2)}M</p>
          <p className="text-blue-100 text-sm">Comisiones Totales</p>
          <p className="text-xs text-blue-200 mt-2">8.5% promedio</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl p-6 text-white"
        >
          <TrendingUp className="w-10 h-10 mb-3 opacity-90" />
          <p className="text-3xl font-bold mb-1">${(stats.paidCommissions / 1000000).toFixed(2)}M</p>
          <p className="text-orange-100 text-sm">Comisiones Cobradas</p>
          <p className="text-xs text-orange-200 mt-2">Este mes</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[#1A2440] to-[#0F172A] rounded-xl p-6 text-white"
        >
          <Package className="w-10 h-10 mb-3 opacity-90" />
          <p className="text-3xl font-bold mb-1">${(stats.averageTicket / 1000000).toFixed(1)}M</p>
          <p className="text-gray-100 text-sm">Ticket Promedio</p>
          <p className="text-xs text-gray-200 mt-2">Por venta</p>
        </motion.div>
      </div>

      {/* Chart - Progreso Mensual */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#1A2440] mb-1">Evolución de Ventas</h3>
            <p className="text-sm text-gray-600">Últimos 6 meses</p>
          </div>
          <button
            onClick={() => setShowQuoteModal(true)}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Calculator size={20} />
            Cotizador Rápido
          </button>
        </div>

        {/* Simple Bar Chart */}
        <div className="space-y-4">
          {monthlyData.map((data, index) => {
            const maxSales = Math.max(...monthlyData.map(d => d.sales));
            const widthPercent = (data.sales / maxSales) * 100;
            
            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 w-12">{data.month}</span>
                  <span className="text-sm font-bold text-[#3A7AFE]">
                    ${(data.sales / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="relative w-full h-8 bg-gray-100 rounded-lg overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPercent}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#3A7AFE] to-purple-600 rounded-lg flex items-center justify-end pr-3"
                  >
                    <span className="text-xs font-medium text-white">
                      {widthPercent.toFixed(0)}%
                    </span>
                  </motion.div>
                </div>
                <div className="flex items-center justify-end mt-1">
                  <span className="text-xs text-gray-500">
                    Comisión: ${(data.commission / 1000000).toFixed(2)}M
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-[#1A2440]">Mis Ventas Recientes</h3>
          <p className="text-sm text-gray-600 mt-1">Últimas transacciones realizadas</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  ID Venta
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Paquete
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Comisión
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mySales.map((sale, index) => {
                const statusConfig = getStatusConfig(sale.status);
                
                return (
                  <motion.tr
                    key={sale.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-bold text-[#3A7AFE]">{sale.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User size={14} className="text-white" />
                        </div>
                        <span className="font-medium text-[#1A2440]">{sale.client}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{sale.package}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-green-600">
                        ${sale.amount.toLocaleString('es-CO')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-blue-600">
                        ${sale.commission.toLocaleString('es-CO')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border-2 ${statusConfig.color}`}>
                        {statusConfig.icon} {sale.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar size={14} />
                        {sale.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-2 text-[#3A7AFE] hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye size={18} />
                        </button>
                        <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                          <Download size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commission Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <DollarSign className="text-white" size={24} />
            </div>
            <div>
              <h4 className="font-bold text-[#1A2440]">Comisiones Cobradas</h4>
              <p className="text-sm text-gray-600">Ya recibidas</p>
            </div>
          </div>
          <p className="text-4xl font-bold text-green-600">
            ${(stats.paidCommissions / 1000000).toFixed(2)}M
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
              <Calendar className="text-white" size={24} />
            </div>
            <div>
              <h4 className="font-bold text-[#1A2440]">Comisiones Pendientes</h4>
              <p className="text-sm text-gray-600">Por cobrar</p>
            </div>
          </div>
          <p className="text-4xl font-bold text-yellow-600">
            ${(stats.pendingCommissions / 1000000).toFixed(2)}M
          </p>
        </div>
      </div>

      {/* Quote Modal */}
      <QuickQuoteModal
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
      />
    </div>
  );
}