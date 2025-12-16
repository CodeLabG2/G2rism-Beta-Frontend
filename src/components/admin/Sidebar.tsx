import {
  LayoutDashboard,
  Users,
  UserCog,
  Calendar,
  Package,
  Building2,
  DollarSign,
  FileText,
  Truck,
  BarChart3,
  Settings,
  LogOut,
  Shield,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

export function Sidebar({ currentView, onViewChange, onLogout }: SidebarProps) {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', view: 'dashboard' },
    { icon: Users, label: 'Usuarios', view: 'users' },
    { icon: UserCog, label: 'Empleados', view: 'employees' },
    { icon: Calendar, label: 'Reservas', view: 'reservations' },
    { icon: Users, label: 'Clientes', view: 'clients-list' },
    { icon: Package, label: 'Paquetes', view: 'packages' },
    { icon: Building2, label: 'Proveedores', view: 'providers-list' },
    { icon: DollarSign, label: 'Ventas', view: 'sales' },
    { icon: FileText, label: 'Facturación', view: 'invoicing' },
    { icon: Truck, label: 'Transporte', view: 'transport' },
    { icon: BarChart3, label: 'Reportes', view: 'reports' },
    { icon: Settings, label: 'Configuración', view: 'settings' },
  ];

  return (
    <div className="w-64 sm:w-72 lg:w-64 bg-[#1A2440] text-white flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 sm:p-6 border-b border-white/10">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#3A7AFE] rounded-lg flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-base sm:text-lg truncate">G2rism</h1>
            <p className="text-xs text-gray-400 truncate">Administrador</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-2 sm:py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.view;
          
          return (
            <button
              key={item.view}
              onClick={() => onViewChange(item.view)}
              className={`w-full flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 transition-colors ${
                isActive
                  ? 'bg-[#3A7AFE] text-white'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="text-xs sm:text-sm truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-3 sm:p-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}