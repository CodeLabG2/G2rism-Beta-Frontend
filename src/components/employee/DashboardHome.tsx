import React, { useState, useMemo } from 'react';
import {
  Calendar,
  DollarSign,
  Users,
  Package,
  ArrowUpRight,
  Clock,
  TrendingUp,
  FileText,
  Truck,
  BarChart3,
  Building2,
  Settings,
} from 'lucide-react';
import { CreateReservationModal } from './modals/CreateReservationModal';
import { QuickQuoteModal } from './modals/QuickQuoteModal';
import { usePermissions } from '../../hooks/usePermissions';
import type { UserWithRoles } from '../../services/types/users.types';

interface DashboardHomeProps {
  user?: UserWithRoles; // ✅ Opcional para prevenir crashes
}

export function DashboardHome({ user }: DashboardHomeProps) {
  const [showCreateReservation, setShowCreateReservation] = useState(false);
  const [showQuickQuote, setShowQuickQuote] = useState(false);
  
  // ✅ Manejo defensivo: si no hay usuario, no usar usePermissions
  const permissions = user ? usePermissions(user) : null;
  const { hasPermission, hasAnyPermission, isSuperAdmin } = permissions || {
    hasPermission: () => false,
    hasAnyPermission: () => false,
    isSuperAdmin: () => false,
  };

  // Definir todas las acciones rápidas posibles con sus requisitos de permisos
  const allQuickActions = useMemo(() => [
    {
      icon: Calendar,
      label: 'Nueva Reserva',
      description: 'Crear una nueva reserva',
      onClick: () => setShowCreateReservation(true),
      requiredModule: 'Reservas',
      requiredAction: 'Crear',
    },
    {
      icon: DollarSign,
      label: 'Cotizar',
      description: 'Generar cotización',
      onClick: () => setShowQuickQuote(true),
      requiredModule: 'Ventas',
      requiredAction: 'Ver',
    },
    {
      icon: Users,
      label: 'Nuevo Cliente',
      description: 'Registrar cliente',
      onClick: () => console.log('Navegar a nuevo cliente'),
      requiredModule: 'Clientes',
      requiredAction: 'Crear',
    },
    {
      icon: Package,
      label: 'Ver Paquetes',
      description: 'Catálogo de paquetes',
      onClick: () => console.log('Navegar a paquetes'),
      requiredModule: 'Paquetes',
      requiredAction: 'Ver',
    },
    {
      icon: FileText,
      label: 'Nueva Factura',
      description: 'Crear factura',
      onClick: () => console.log('Navegar a nueva factura'),
      requiredModule: 'Facturación',
      requiredAction: 'Crear',
    },
    {
      icon: Truck,
      label: 'Transporte',
      description: 'Gestionar vehículos',
      onClick: () => console.log('Navegar a transporte'),
      requiredModule: 'Transporte',
      requiredAction: 'Ver',
    },
    {
      icon: BarChart3,
      label: 'Reportes',
      description: 'Ver estadísticas',
      onClick: () => console.log('Navegar a reportes'),
      requiredModule: 'Reportes',
      requiredAction: 'Ver',
    },
    {
      icon: Building2,
      label: 'Proveedores',
      description: 'Gestionar proveedores',
      onClick: () => console.log('Navegar a proveedores'),
      requiredModule: 'Proveedores',
      requiredAction: 'Ver',
    },
  ], []);

  // Filtrar acciones rápidas según permisos del usuario
  const quickActions = useMemo(() => {
    // Si es super admin, mostrar todas las acciones
    if (isSuperAdmin()) {
      return allQuickActions;
    }

    // Filtrar según permisos
    return allQuickActions.filter(action => 
      hasPermission(action.requiredModule, action.requiredAction)
    );
  }, [allQuickActions, hasPermission, isSuperAdmin]);

  // Stats dinámicas según permisos
  const simpleStats = useMemo(() => {
    const stats = [];

    // Reservas
    if (hasAnyPermission('Reservas', ['Ver', 'Crear', 'Editar'])) {
      stats.push({
        label: 'Mis Reservas',
        value: '12',
        icon: Calendar,
      });
    }

    // Clientes
    if (hasAnyPermission('Clientes', ['Ver', 'Crear', 'Editar'])) {
      stats.push({
        label: 'Clientes Activos',
        value: '8',
        icon: Users,
      });
    }

    // Tareas (siempre visible)
    stats.push({
      label: 'Tareas Pendientes',
      value: '5',
      icon: Clock,
    });

    // Ventas
    if (hasAnyPermission('Ventas', ['Ver', 'Crear', 'Editar'])) {
      stats.push({
        label: 'Este Mes',
        value: '$48.5M',
        icon: TrendingUp,
      });
    }

    return stats;
  }, [hasAnyPermission]);

  return (
    <div className="space-y-8">
      {/* Información Simple - Movido arriba */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#3A7AFE] rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[#1A2440] mb-2">
              Bienvenido a G2rism, {user?.username}
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {quickActions.length > 0 
                ? `Tienes acceso a ${quickActions.length} acciones rápidas según tu rol de ${user?.roles[0]?.nombre}.`
                : 'Tu perfil está configurado con permisos de solo lectura.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Header Simple */}
      <div>
        <p className="text-sm text-gray-500 mb-1">
          {new Date().toLocaleDateString('es-CO', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}
        </p>
        <h1 className="text-3xl font-bold text-[#1A2440]">
          Panel de Control
        </h1>
        <p className="text-gray-600 mt-2">
          Gestiona tus actividades y tareas diarias
        </p>
      </div>

      {/* Stats Cards Simples */}
      {simpleStats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {simpleStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:border-[#3A7AFE] transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-[#F5F6FA] rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#3A7AFE]" />
                  </div>
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
      )}

      {/* Quick Actions */}
      {quickActions.length > 0 ? (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Acciones Rápidas ({quickActions.length})
          </h2>
          <div className={`grid grid-cols-1 md:grid-cols-2 ${quickActions.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4`}>
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="group bg-white border border-gray-200 rounded-lg p-6 hover:border-[#3A7AFE] hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-[#F5F6FA] rounded-lg flex items-center justify-center group-hover:bg-[#3A7AFE] transition-colors">
                      <Icon className="w-6 h-6 text-[#3A7AFE] group-hover:text-white transition-colors" />
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
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <Settings className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-semibold text-[#1A2440] mb-2">
            Sin Acciones Rápidas
          </h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Tu perfil no tiene permisos para realizar acciones rápidas. 
            Contacta al administrador para solicitar acceso.
          </p>
        </div>
      )}

      {/* Modals */}
      <CreateReservationModal
        isOpen={showCreateReservation}
        onClose={() => setShowCreateReservation(false)}
        onSuccess={(reservation) => {
          console.log('Nueva reserva:', reservation);
          setShowCreateReservation(false);
        }}
      />

      <QuickQuoteModal
        isOpen={showQuickQuote}
        onClose={() => setShowQuickQuote(false)}
      />
    </div>
  );
}