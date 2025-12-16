import {
  Calendar,
  DollarSign,
  Users,
  Package,
  ArrowUpRight,
  TrendingUp,
  Shield,
  AlertCircle,
  FileText,
} from 'lucide-react';
import type { UserWithRoles } from '../../services/types/users.types';

interface DashboardHomeProps {
  user: UserWithRoles;
}

export function DashboardHome({ user }: DashboardHomeProps) {
  // Quick actions específicas para Admin (sin eliminar)
  const quickActions = [
    {
      icon: Users,
      label: 'Gestionar Usuarios',
      description: 'Crear y editar usuarios',
      color: 'blue',
      onClick: () => console.log('Gestionar usuarios'),
    },
    {
      icon: Calendar,
      label: 'Nueva Reserva',
      description: 'Registrar reserva',
      color: 'green',
      onClick: () => console.log('Nueva reserva'),
    },
    {
      icon: Package,
      label: 'Gestionar Paquetes',
      description: 'Crear y modificar paquetes',
      color: 'purple',
      onClick: () => console.log('Gestionar paquetes'),
    },
    {
      icon: FileText,
      label: 'Reportes',
      description: 'Ver y exportar reportes',
      color: 'orange',
      onClick: () => console.log('Reportes'),
    },
  ];

  // Stats específicas para Admin
  const stats = [
    {
      label: 'Reservas Activas',
      value: '284',
      change: '+18%',
      trend: 'up',
      icon: Calendar,
      color: 'blue',
    },
    {
      label: 'Clientes',
      value: '1,245',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'green',
    },
    {
      label: 'Ventas del Mes',
      value: '$148.5M',
      change: '+24%',
      trend: 'up',
      icon: DollarSign,
      color: 'purple',
    },
    {
      label: 'Paquetes Activos',
      value: '42',
      change: '+5',
      trend: 'stable',
      icon: Package,
      color: 'emerald',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Banner de Bienvenida Admin */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-4 sm:p-5 md:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#3A7AFE] to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base sm:text-lg text-[#1A2440] mb-1 sm:mb-2 break-words">
              Bienvenido, Administrador {user.username}
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Tienes acceso completo para <span className="font-semibold text-[#3A7AFE]">Crear, Leer y Modificar</span> registros. 
              Los permisos de eliminación están <span className="font-semibold text-amber-600">restringidos</span> al Super Administrador.
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
          Panel de Control
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Administra y gestiona el sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 hover:border-blue-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 text-${stat.color}-600`} />
                </div>
                {stat.trend === 'up' && (
                  <span className="text-xs font-medium text-green-600 flex items-center gap-1 whitespace-nowrap">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </span>
                )}
                {stat.trend === 'stable' && (
                  <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
                    {stat.change}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1A2440] mb-1">
                  {stat.value}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 truncate">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 sm:mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.onClick}
                className="group bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:border-blue-300 hover:shadow-lg transition-all text-left"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-${action.color}-100 rounded-lg flex items-center justify-center group-hover:bg-${action.color}-600 transition-colors shrink-0`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${action.color}-600 group-hover:text-white transition-colors`} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-[#1A2440] mb-1 break-words">
                  {action.label}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  {action.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Alerta de Restricción */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-blue-900 text-xs sm:text-sm mb-1">
            Rol de Administrador Activo
          </h4>
          <p className="text-xs text-blue-700 leading-relaxed">
            Tienes permisos para <span className="font-semibold">Crear, Leer y Modificar</span> todos los registros. 
            Para <span className="font-semibold text-amber-700">eliminar registros permanentemente</span>, 
            contacta al Super Administrador del sistema.
          </p>
        </div>
      </div>
    </div>
  );
}