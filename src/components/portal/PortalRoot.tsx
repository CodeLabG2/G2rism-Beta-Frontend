import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DashboardHome } from '../employee/DashboardHome';
import { ReservationsView } from '../employee/views/ReservationsView';
import { PackagesView } from '../employee/views/PackagesView';
import { ClientsView } from '../employee/views/ClientsView';
import { SalesView } from '../employee/views/SalesView';
import { ProfileView } from '../employee/views/ProfileView';
import { UsersView } from '../admin/views/UsersView';
import { EmployeesView } from '../admin/views/EmployeesView';
import { ProvidersView } from '../admin/views/ProvidersView';
import { InvoicingView } from '../admin/views/InvoicingView';
import { TransportView } from '../admin/views/TransportView';
import { ReportsView } from '../admin/views/ReportsView';
import { SettingsView } from '../admin/views/SettingsView';
import { usePermissions } from '../../hooks/usePermissions';
import type { UserWithRoles } from '../../services/types/users.types';

interface PortalRootProps {
  user: UserWithRoles;
  onLogout: () => void;
}

export function PortalRoot({ user, onLogout }: PortalRootProps) {
  const [currentView, setCurrentView] = useState('dashboard');
  const { hasPermission, hasAnyPermission, getModulePermissions } = usePermissions(user);

  // Breadcrumbs mapping
  const getBreadcrumbs = (): string[] => {
    const breadcrumbsMap: Record<string, string[]> = {
      dashboard: ['Dashboard'],
      users: ['Usuarios'],
      employees: ['Empleados'],
      reservations: ['Reservas'],
      'clients-list': ['Clientes'],
      packages: ['Paquetes Turísticos'],
      'providers-list': ['Proveedores'],
      sales: ['Ventas'],
      invoicing: ['Facturación'],
      transport: ['Transporte'],
      reports: ['Reportes'],
      settings: ['Configuración'],
      profile: ['Mi Perfil'],
    };
    return breadcrumbsMap[currentView] || ['Dashboard'];
  };

  // Render current view based on permissions
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardHome user={user} />;
      
      case 'users':
        if (hasAnyPermission('Usuarios', ['Ver', 'Crear', 'Editar'])) {
          return <UsersView permissions={getModulePermissions('Usuarios')} />;
        }
        return <AccessDenied />;
      
      case 'employees':
        if (hasAnyPermission('Empleados', ['Ver', 'Crear', 'Editar'])) {
          return <EmployeesView permissions={getModulePermissions('Empleados')} />;
        }
        return <AccessDenied />;
      
      case 'reservations':
        if (hasAnyPermission('Reservas', ['Ver', 'Crear', 'Editar'])) {
          return <ReservationsView permissions={getModulePermissions('Reservas')} />;
        }
        return <AccessDenied />;
      
      case 'clients-list':
        if (hasAnyPermission('Clientes', ['Ver', 'Crear', 'Editar'])) {
          return <ClientsView permissions={getModulePermissions('Clientes')} />;
        }
        return <AccessDenied />;
      
      case 'packages':
        if (hasAnyPermission('Paquetes', ['Ver', 'Crear', 'Editar'])) {
          return <PackagesView permissions={getModulePermissions('Paquetes')} />;
        }
        return <AccessDenied />;
      
      case 'providers-list':
        if (hasAnyPermission('Proveedores', ['Ver', 'Crear', 'Editar'])) {
          return <ProvidersView permissions={getModulePermissions('Proveedores')} />;
        }
        return <AccessDenied />;
      
      case 'sales':
        if (hasAnyPermission('Ventas', ['Ver', 'Crear', 'Editar'])) {
          return <SalesView permissions={getModulePermissions('Ventas')} />;
        }
        return <AccessDenied />;
      
      case 'invoicing':
        if (hasAnyPermission('Facturación', ['Ver', 'Crear', 'Editar'])) {
          return <InvoicingView permissions={getModulePermissions('Facturación')} />;
        }
        return <AccessDenied />;
      
      case 'transport':
        if (hasAnyPermission('Transporte', ['Ver', 'Crear', 'Editar'])) {
          return <TransportView permissions={getModulePermissions('Transporte')} />;
        }
        return <AccessDenied />;
      
      case 'reports':
        if (hasPermission('Reportes', 'Ver')) {
          return <ReportsView permissions={getModulePermissions('Reportes')} />;
        }
        return <AccessDenied />;
      
      case 'settings':
        if (hasPermission('Configuración', 'Ver')) {
          return <SettingsView permissions={getModulePermissions('Configuración')} />;
        }
        return <AccessDenied />;
      
      case 'profile':
        return <ProfileView user={user} />;
      
      default:
        return <DashboardHome user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F6FA]">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        permissions={user.roles.flatMap(r => r.permisos || [])}
        onLogout={onLogout}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          user={{
            name: user.username,
            email: user.email,
            role: user.roles.map(r => r.nombre).join(', '),
          }}
          breadcrumbs={getBreadcrumbs()}
          onLogout={onLogout}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

// Access Denied Component
function AccessDenied() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-md p-8">
        <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#1A2440] mb-3">
          Acceso Denegado
        </h2>
        <p className="text-gray-600 mb-6">
          No tienes permisos para acceder a este módulo. Por favor, contacta a tu
          administrador si necesitas acceso.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-[#3A7AFE] text-white rounded-lg hover:bg-[#2868ec] transition-colors"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
}