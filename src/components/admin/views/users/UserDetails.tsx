import React from 'react';
import { Modal } from '../../../ui/Modal';
import { Badge } from '../../../ui/Badge';
import { Avatar } from '../../../ui/Avatar';
import {
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  Building2,
  Calendar,
  Clock,
  Activity,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { User } from './types';

interface UserDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export function UserDetails({ isOpen, onClose, user }: UserDetailsProps) {
  // Datos de actividad simulados
  const activityStats = {
    reservationsCreated: 45,
    salesGenerated: '$125,450',
    lastActivity: 'Creó una reserva para cliente "María López"',
    totalSessions: 156,
    avgSessionTime: '2h 15min',
  };

  const recentActivities = [
    {
      id: 1,
      type: 'reservation',
      description: 'Creó reserva #RES-2024-1234',
      timestamp: '2025-12-03 10:30',
    },
    {
      id: 2,
      type: 'sale',
      description: 'Registró venta de $2,450',
      timestamp: '2025-12-03 09:15',
    },
    {
      id: 3,
      type: 'client',
      description: 'Agregó nuevo cliente "Carlos Ruiz"',
      timestamp: '2025-12-02 16:45',
    },
    {
      id: 4,
      type: 'package',
      description: 'Modificó paquete turístico "Caribe Premium"',
      timestamp: '2025-12-02 14:20',
    },
    {
      id: 5,
      type: 'report',
      description: 'Generó reporte de ventas mensual',
      timestamp: '2025-12-01 11:00',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'reservation':
        return <Calendar size={14} className="text-blue-600" />;
      case 'sale':
        return <TrendingUp size={14} className="text-green-600" />;
      case 'client':
        return <UserIcon size={14} className="text-purple-600" />;
      case 'package':
        return <FileText size={14} className="text-orange-600" />;
      case 'report':
        return <Activity size={14} className="text-gray-600" />;
      default:
        return <FileText size={14} className="text-gray-600" />;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles del Usuario" size="lg">
      <div className="space-y-6">
        {/* Header con información principal */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-6 border-b">
          <Avatar src={user.avatar} name={user.name} size="xl" />
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl mb-2">{user.name}</h3>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
              <Badge variant={user.status === 'active' ? 'success' : 'gray'}>
                {user.status === 'active' ? 'Activo' : 'Inactivo'}
              </Badge>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: user.role.color }}
                />
                <span className="text-sm text-gray-700">{user.role.name}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={16} className="text-gray-400" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={16} className="text-gray-400" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 size={16} className="text-gray-400" />
                <span>{user.department}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={16} className="text-gray-400" />
                <span>Ingresó: {user.createdAt}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas de actividad */}
        <div>
          <h6 className="mb-4 flex items-center gap-2">
            <Activity size={18} className="text-[#3A7AFE]" />
            Estadísticas de Actividad
          </h6>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <p className="text-sm text-blue-600 mb-1">Reservas Creadas</p>
              <p className="text-2xl text-blue-900">{activityStats.reservationsCreated}</p>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-lg p-4">
              <p className="text-sm text-green-600 mb-1">Ventas Generadas</p>
              <p className="text-2xl text-green-900">{activityStats.salesGenerated}</p>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
              <p className="text-sm text-purple-600 mb-1">Sesiones Totales</p>
              <p className="text-2xl text-purple-900">{activityStats.totalSessions}</p>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
              <p className="text-sm text-orange-600 mb-1">Tiempo Promedio</p>
              <p className="text-2xl text-orange-900">{activityStats.avgSessionTime}</p>
            </div>
          </div>
        </div>

        {/* Información de sesión */}
        <div>
          <h6 className="mb-4 flex items-center gap-2">
            <Clock size={18} className="text-[#3A7AFE]" />
            Información de Sesión
          </h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Última Conexión</p>
              <p className="text-lg">{user.lastLogin}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Última Actividad</p>
              <p className="text-lg">{activityStats.lastActivity}</p>
            </div>
          </div>
        </div>

        {/* Actividad reciente */}
        <div>
          <h6 className="mb-4 flex items-center gap-2">
            <FileText size={18} className="text-[#3A7AFE]" />
            Actividad Reciente
          </h6>
          <div className="space-y-2">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permisos del rol */}
        <div>
          <h6 className="mb-4 flex items-center gap-2">
            <Shield size={18} className="text-[#3A7AFE]" />
            Permisos del Rol: {user.role.name}
          </h6>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              Este usuario tiene permisos según el rol <strong>{user.role.name}</strong>. Para
              modificar los permisos, edita la configuración del rol en el módulo de Roles y
              Permisos.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
