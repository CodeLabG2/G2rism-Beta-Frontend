import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  X,
  Sparkles,
  Users,
  Package,
  DollarSign,
  BarChart3,
  FileText,
  Calendar,
  Plane,
  Shield,
  Zap,
  Heart,
  TrendingUp,
  Briefcase,
  UserCog,
  CheckCircle,
} from 'lucide-react';
import { motion } from 'motion/react';

interface WelcomeModalProps {
  portalType: 'admin' | 'employee' | 'client';
  userName: string;
  onClose: () => void;
}

export function WelcomeModal({ portalType, userName, onClose }: WelcomeModalProps) {
  const [dontShowAgain, setDontShowAgain] = React.useState(false);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem(`g2rism-welcome-${portalType}`, 'seen');
    }
    onClose();
  };

  const getWelcomeContent = () => {
    switch (portalType) {
      case 'admin':
        return {
          title: '¡Bienvenido al Portal de Administración!',
          subtitle: 'Control total de tu plataforma turística',
          icon: <UserCog size={48} className="text-[#3A7AFE]" />,
          features: [
            {
              icon: <Users size={20} />,
              title: 'Gestión de Usuarios',
              description: 'Administra empleados, clientes y permisos',
              color: 'bg-blue-100 text-blue-600',
            },
            {
              icon: <Package size={20} />,
              title: 'Paquetes Turísticos',
              description: 'Crea y gestiona ofertas de viaje',
              color: 'bg-purple-100 text-purple-600',
            },
            {
              icon: <DollarSign size={20} />,
              title: 'Finanzas y Facturación',
              description: 'Control completo DIAN y reportes',
              color: 'bg-green-100 text-green-600',
            },
            {
              icon: <BarChart3 size={20} />,
              title: 'Analytics y Reportes',
              description: 'Métricas en tiempo real del negocio',
              color: 'bg-orange-100 text-orange-600',
            },
            {
              icon: <Shield size={20} />,
              title: 'Auditoría y Seguridad',
              description: 'Logs y seguimiento de actividades',
              color: 'bg-red-100 text-red-600',
            },
            {
              icon: <Briefcase size={20} />,
              title: 'Proveedores',
              description: 'Gestiona alianzas y contratos',
              color: 'bg-teal-100 text-teal-600',
            },
          ],
          quickActions: [
            { label: 'Ver Dashboard', action: 'dashboard' },
            { label: 'Gestionar Empleados', action: 'employees' },
            { label: 'Ver Reportes', action: 'reports' },
          ],
        };

      case 'employee':
        return {
          title: '¡Bienvenido al Portal de Empleados!',
          subtitle: 'Herramientas para brindar el mejor servicio',
          icon: <Briefcase size={48} className="text-[#3A7AFE]" />,
          features: [
            {
              icon: <Calendar size={20} />,
              title: 'Gestión de Reservas',
              description: 'Crea y administra reservas de clientes',
              color: 'bg-blue-100 text-blue-600',
            },
            {
              icon: <Users size={20} />,
              title: 'CRM de Clientes',
              description: 'Seguimiento y atención personalizada',
              color: 'bg-purple-100 text-purple-600',
            },
            {
              icon: <Package size={20} />,
              title: 'Catálogo de Paquetes',
              description: 'Explora ofertas para tus clientes',
              color: 'bg-green-100 text-green-600',
            },
            {
              icon: <FileText size={20} />,
              title: 'Facturación',
              description: 'Genera facturas y cotizaciones',
              color: 'bg-orange-100 text-orange-600',
            },
            {
              icon: <TrendingUp size={20} />,
              title: 'Comisiones',
              description: 'Revisa tus ventas y ganancias',
              color: 'bg-teal-100 text-teal-600',
            },
            {
              icon: <Zap size={20} />,
              title: 'Acciones Rápidas',
              description: 'Atajos para tareas frecuentes',
              color: 'bg-pink-100 text-pink-600',
            },
          ],
        };

      case 'client':
        return {
          title: '¡Bienvenido a G2rism!',
          subtitle: 'Tu próxima aventura comienza aquí',
          icon: <Plane size={48} className="text-[#3A7AFE]" />,
          features: [
            {
              icon: <Sparkles size={20} />,
              title: 'Destinos Increíbles',
              description: 'Explora paquetes únicos y personalizados',
              color: 'bg-blue-100 text-blue-600',
            },
            {
              icon: <Calendar size={20} />,
              title: 'Reservas Fáciles',
              description: 'Proceso simple en 6 pasos',
              color: 'bg-purple-100 text-purple-600',
            },
            {
              icon: <Heart size={20} />,
              title: 'Favoritos',
              description: 'Guarda destinos que te interesen',
              color: 'bg-red-100 text-red-600',
            },
            {
              icon: <Shield size={20} />,
              title: 'Pago Seguro',
              description: 'Encriptación de 256 bits',
              color: 'bg-green-100 text-green-600',
            },
            {
              icon: <TrendingUp size={20} />,
              title: 'Programa de Puntos',
              description: 'Acumula y canjea beneficios',
              color: 'bg-orange-100 text-orange-600',
            },
            {
              icon: <FileText size={20} />,
              title: 'Historial',
              description: 'Accede a tus viajes y facturas',
              color: 'bg-teal-100 text-teal-600',
            },
          ],
        };

      default:
        return null;
    }
  };

  const content = getWelcomeContent();
  if (!content) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#3A7AFE] to-[#1A2440] text-white p-6 rounded-t-2xl">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="p-3 bg-white rounded-full flex-shrink-0"
            >
              {content.icon}
            </motion.div>
            <div className="flex-1">
              <h4 className="text-white mb-1">{content.title}</h4>
              <p className="text-white/90 text-sm">Hola, {userName} 👋</p>
              <p className="text-white/70 text-sm mt-1">{content.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Features Grid */}
          <div className="mb-6">
            <h6 className="mb-3 flex items-center gap-2 text-sm">
              <Sparkles size={16} className="text-[#3A7AFE]" />
              Funcionalidades Principales
            </h6>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {content.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="p-3 border border-gray-200 rounded-lg hover:border-[#3A7AFE]/30 hover:bg-[#3A7AFE]/5 transition-all"
                >
                  <div className="flex items-start gap-2">
                    <div className={`p-1.5 rounded-lg ${feature.color} flex-shrink-0`}>
                      {React.cloneElement(feature.icon as React.ReactElement, { size: 16 })}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs mb-0.5 line-clamp-1">{feature.title}</p>
                      <p className="text-xs text-gray-600 line-clamp-2">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-2 border-gray-300 bg-white text-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-0 cursor-pointer transition-all checked:bg-[#3A7AFE] checked:border-[#3A7AFE] hover:border-[#3A7AFE] accent-[#3A7AFE]"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
              />
              <span className="text-xs text-gray-600 group-hover:text-gray-800 transition-colors">No mostrar de nuevo</span>
            </label>

            <Button onClick={handleClose} size="sm" icon={<CheckCircle size={16} />} iconPosition="right">
              ¡Comenzar!
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}