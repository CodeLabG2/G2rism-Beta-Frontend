import React, { useState } from 'react';
import { Bell, ChevronDown, LogOut, User, Settings, ShieldCheck, Menu } from 'lucide-react';

interface HeaderProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
  breadcrumbs: string[];
  onLogout: () => void;
  onMenuClick?: () => void;
}

export function Header({ user, breadcrumbs, onLogout, onMenuClick }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock notifications for Super Admin
  const notifications = [
    {
      id: 1,
      title: 'Alerta de seguridad',
      message: 'Usuario bloqueado por intentos fallidos',
      time: 'Hace 5 min',
      unread: true,
    },
    {
      id: 2,
      title: 'Nuevo empleado registrado',
      message: 'Se ha creado el usuario: carlos.lopez@g2rism.com',
      time: 'Hace 1 hora',
      unread: true,
    },
    {
      id: 3,
      title: 'Configuración actualizada',
      message: 'Se modificó la configuración del sistema',
      time: 'Hace 2 horas',
      unread: false,
    },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 py-3 md:py-4">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button + Breadcrumbs */}
        <div className="flex items-center gap-3">
          {/* Botón de menú móvil */}
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}

          {/* Breadcrumbs */}
          <div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
              <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-[#3A7AFE]" />
              <span className="hidden sm:inline font-medium text-[#3A7AFE]">Super Admin</span>
              <span className="sm:hidden font-medium text-[#3A7AFE]">SA</span>
              {breadcrumbs.map((crumb, index) => (
                <span key={index} className="flex items-center gap-2">
                  <span>/</span>
                  <span className={`truncate max-w-[100px] sm:max-w-none ${index === breadcrumbs.length - 1 ? 'text-[#1A2440] font-medium' : ''}`}>
                    {crumb}
                  </span>
                </span>
              ))}
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1A2440] mt-1 truncate max-w-[200px] sm:max-w-none">
              {breadcrumbs[breadcrumbs.length - 1]}
            </h1>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Menu Button */}
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="hidden lg:block p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="p-4 border-b border-gray-200 relative z-20">
                  <h3 className="font-semibold text-[#1A2440]">
                    Notificaciones
                    {unreadCount > 0 && (
                      <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                        {unreadCount} nuevas
                      </span>
                    )}
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto relative z-20">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        notification.unread ? 'bg-blue-50' : ''
                      }`}
                    >
                      <h4 className="font-medium text-sm text-[#1A2440]">
                        {notification.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-gray-200 relative z-20">
                  <button className="text-sm text-[#3A7AFE] hover:text-[#2868ec] font-medium">
                    Ver todas las notificaciones
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-[#1A2440] rounded-full flex items-center justify-center ring-2 ring-purple-400">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-[#1A2440]">{user.name}</p>
                <p className="text-xs text-purple-600 font-medium">Super Admin</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="p-4 border-b border-gray-200 relative z-20 bg-gradient-to-br from-purple-50 to-blue-50">
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck className="w-5 h-5 text-purple-600" />
                    <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                      Acceso Total
                    </span>
                  </div>
                  <p className="font-medium text-[#1A2440]">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="p-2 relative z-20">
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Mi Perfil</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Configuración</span>
                  </button>
                </div>
                <div className="p-2 border-t border-gray-200 relative z-20">
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}