import React, { useState } from 'react';
import {
  Calendar,
  DollarSign,
  Users,
  Package,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Database,
} from 'lucide-react';
import type { UserWithRoles } from '../../services/types/users.types';

interface DashboardHomeProps {
  user: UserWithRoles;
}

export function DashboardHome({ user }: DashboardHomeProps) {
  // Quick actions específicas para Super Admin
  const quickActions = [
    {
      icon: Users,
      label: 'Gestionar Usuarios',
      description: 'Crear, editar, eliminar usuarios',
      color: 'blue',
      onClick: () => console.log('Gestionar usuarios'),
    },
    {
      icon: ShieldCheck,
      label: 'Roles y Permisos',
      description: 'Configurar accesos del sistema',
      color: 'purple',
      onClick: () => console.log('Roles y permisos'),
    },
    {
      icon: Database,
      label: 'Respaldo de Datos',
      description: 'Backup y restauración',
      color: 'green',
      onClick: () => console.log('Respaldo de datos'),
    },
    {
      icon: AlertTriangle,
      label: 'Auditoría',
      description: 'Logs y actividad del sistema',
      color: 'orange',
      onClick: () => console.log('Auditoría'),
    },
  ];

  // Stats específicas para Super Admin
  const stats = [
    {
      label: 'Total Usuarios',
      value: '156',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'blue',
    },
    {
      label: 'Total Reservas',
      value: '2,845',
      change: '+18%',
      trend: 'up',
      icon: Calendar,
      color: 'green',
    },
    {
      label: 'Ingresos Totales',
      value: '$248.5M',
      change: '+24%',
      trend: 'up',
      icon: DollarSign,
      color: 'purple',
    },
    {
      label: 'Sistema Activo',
      value: '99.8%',
      change: 'Óptimo',
      trend: 'stable',
      icon: Activity,
      color: 'emerald',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Banner de Bienvenida Super Admin */}
      <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-4 sm:p-5 md:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-[#3A7AFE] rounded-lg flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base sm:text-lg text-[#1A2440] mb-1 sm:mb-2 break-words">
              Bienvenido, Super Administrador {user.username}
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Tienes <span className="font-semibold text-purple-600">acceso total</span> al sistema G2rism. 
              Puedes gestionar usuarios, configurar permisos, realizar respaldos y <span className="font-semibold">eliminar registros</span> cuando sea necesario.
            </p>
          </div>
        </div>
      </div>

      {/* Header Simple */}
      <div className="space-y-1 sm:space-y-2">
        <p className="text-xs sm:text-sm text-gray-500">
          {new Date().toLocaleDateString('es-CO', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A2440]">
          Panel de Control Total
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Monitorea y administra todo el sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 hover:border-purple-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 text-${stat.color}-600`} />
                </div>
                {stat.trend === 'up' && (
                  <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </span>
                )}
                {stat.trend === 'stable' && (
                  <span className="text-xs font-medium text-gray-600">
                    {stat.change}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#1A2440] mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Acciones Administrativas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.onClick}
                className="group bg-white border border-gray-200 rounded-lg p-6 hover:border-purple-300 hover:shadow-lg transition-all text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-${action.color}-100 rounded-lg flex items-center justify-center group-hover:bg-${action.color}-600 transition-colors`}>
                    <Icon className={`w-6 h-6 text-${action.color}-600 group-hover:text-white transition-colors`} />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-semibold text-[#1A2440] mb-1">
                  {action.label}
                </h3>
                <p className="text-sm text-gray-500">
                  {action.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Alerta de Privilegios */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-amber-900 text-sm mb-1">
            Privilegios de Super Administrador Activos
          </h4>
          <p className="text-xs text-amber-700 leading-relaxed">
            Estás operando con permisos totales. Todas las acciones críticas como eliminación de registros, 
            modificación de roles y configuración del sistema están disponibles. Actúa con responsabilidad.
          </p>
        </div>
      </div>
    </div>
  );
}