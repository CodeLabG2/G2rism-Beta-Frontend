import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DashboardHome } from './DashboardHome';
import { UsersView } from './views/UsersView';
import { EmployeesView } from './views/EmployeesView';
import { ReservationsView } from './views/ReservationsView';
import { PackagesView } from './views/PackagesView';
import { ClientsView } from './views/ClientsView';
import { ProvidersView } from './views/ProvidersView';
import { SalesView } from './views/SalesView';
import { InvoicingView } from './views/InvoicingView';
import { TransportView } from './views/TransportView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';
import { ProfileView } from './views/ProfileView';
import type { UserWithRoles } from '../../services/types/users.types';

interface SuperAdminPortalProps {
  user: UserWithRoles;
  onLogout: () => void;
}

export function SuperAdminPortal({ user, onLogout }: SuperAdminPortalProps) {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Render current view - Super Admin tiene acceso a TODO
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardHome user={user} />;
      
      case 'users':
        return <UsersView canDelete={true} />;
      
      case 'employees':
        return <EmployeesView canDelete={true} />;
      
      case 'reservations':
        return <ReservationsView canDelete={true} />;
      
      case 'clients-list':
        return <ClientsView canDelete={true} />;
      
      case 'packages':
        return <PackagesView canDelete={true} />;
      
      case 'providers-list':
        return <ProvidersView canDelete={true} />;
      
      case 'sales':
        return <SalesView canDelete={true} />;
      
      case 'invoicing':
        return <InvoicingView canDelete={true} />;
      
      case 'transport':
        return <TransportView canDelete={true} />;
      
      case 'reports':
        return <ReportsView />;
      
      case 'settings':
        return <SettingsView canDelete={true} />;
      
      case 'profile':
        return <ProfileView user={user} />;
      
      default:
        return <DashboardHome user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F6FA] overflow-hidden">
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar con responsive */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        transform lg:transform-none transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar
          currentView={currentView}
          onViewChange={(view) => {
            setCurrentView(view);
            setSidebarOpen(false);
          }}
          onLogout={onLogout}
        />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header
          user={{
            name: user.username,
            email: user.email,
            role: 'Super Administrador',
          }}
          breadcrumbs={getBreadcrumbs()}
          onLogout={onLogout}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="max-w-full mx-auto">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}