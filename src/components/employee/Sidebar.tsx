import React from 'react';
import { Logo } from '../layout/Logo';
import { 
  LayoutDashboard, 
  Calendar, 
  Package, 
  Users, 
  DollarSign,
  User,
  LucideIcon
} from 'lucide-react';
import type { PermissionSummary } from '../../services/types/roles.types';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  userType: 'employee';
  permissions: PermissionSummary[];
  onLogout?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  requiredModule: string;
  requiredAction: string;
}

export function Sidebar({ currentView, onViewChange, permissions, onLogout }: SidebarProps) {
  // Definir menús esenciales del portal de empleados
  const allMenuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      requiredModule: '', // Siempre visible
      requiredAction: '',
    },
    {
      id: 'reservations',
      label: 'Reservas',
      icon: Calendar,
      requiredModule: 'Reservas',
      requiredAction: 'Ver',
    },
    {
      id: 'clients-list',
      label: 'Clientes',
      icon: Users,
      requiredModule: 'Clientes',
      requiredAction: 'Ver',
    },
    {
      id: 'sales',
      label: 'Ventas',
      icon: DollarSign,
      requiredModule: 'Ventas',
      requiredAction: 'Ver',
    },
    {
      id: 'packages',
      label: 'Paquetes',
      icon: Package,
      requiredModule: 'Paquetes',
      requiredAction: 'Ver',
    },
  ];

  // Verificar si el usuario tiene el permiso requerido
  const hasPermission = (module: string, action: string): boolean => {
    if (!module || !action) return true; // Dashboard siempre visible
    
    return permissions.some(
      p => p.modulo === module && p.accion === action
    );
  };

  // Filtrar menús según permisos
  const menuItems = allMenuItems.filter(item => 
    hasPermission(item.requiredModule, item.requiredAction)
  );

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Logo size="sm" onClick={onLogout} />
        <p className="text-xs text-gray-500 mt-2">Portal Empleados</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-[#3A7AFE] to-[#2868ec] text-white shadow-lg shadow-blue-500/30'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profile Link */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => onViewChange('profile')}
          className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all
            ${
              currentView === 'profile'
                ? 'bg-gradient-to-r from-[#3A7AFE] to-[#2868ec] text-white shadow-lg shadow-blue-500/30'
                : 'text-gray-700 hover:bg-gray-100'
            }
          `}
        >
          <User className="w-5 h-5" />
          <span className="font-medium">Mi Perfil</span>
        </button>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>G2rism v1.0</p>
        </div>
      </div>
    </div>
  );
}