import React, { useState } from 'react';
import { Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react';

interface HeaderProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
  breadcrumbs: string[];
  onLogout: () => void;
}

export function Header({ user, breadcrumbs, onLogout }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: 'Nueva reserva asignada',
      message: 'Se te ha asignado la reserva #RES-045',
      time: 'Hace 5 min',
      unread: true,
    },
    {
      id: 2,
      title: 'Venta aprobada',
      message: 'La venta #VEN-123 ha sido aprobada',
      time: 'Hace 1 hora',
      unread: true,
    },
    {
      id: 3,
      title: 'Recordatorio',
      message: 'Reunión de equipo a las 15:00',
      time: 'Hace 2 horas',
      unread: false,
    },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Breadcrumbs */}
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Portal Empleados</span>
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-2">
                <span>/</span>
                <span className={index === breadcrumbs.length - 1 ? 'text-[#3A7AFE] font-medium' : ''}>
                  {crumb}
                </span>
              </span>
            ))}
          </div>
          <h1 className="text-2xl font-bold text-[#1A2440] mt-1">
            {breadcrumbs[breadcrumbs.length - 1]}
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
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
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-[#1A2440]">
                    Notificaciones
                    {unreadCount > 0 && (
                      <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                        {unreadCount} nuevas
                      </span>
                    )}
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
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
                <div className="p-3 text-center border-t border-gray-200">
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
              <div className="w-10 h-10 bg-gradient-to-br from-[#3A7AFE] to-[#1A2440] rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-[#1A2440]">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="p-4 border-b border-gray-200">
                  <p className="font-medium text-[#1A2440]">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-1">{user.role}</p>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Mi Perfil</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Configuración</span>
                  </button>
                </div>
                <div className="p-2 border-t border-gray-200">
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