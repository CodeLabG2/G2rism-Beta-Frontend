import React from 'react';
import { Card } from '../../../ui/Card';
import { Badge } from '../../../ui/Badge';
import {
  Car,
  Users,
  MapPin,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
} from 'lucide-react';
import { mockVehiculos, mockConductores, mockRutas, mockAsignaciones } from '../../../../data/mockData';
import {
  formatCurrency,
  formatDistance,
  formatDuration,
  getVehicleTypeIcon,
  getVehicleStatusLabel,
  getVehicleStatusColor,
  isLicenseExpiringSoon,
  needsMaintenanceSoon,
} from '../../../../utils/adapters/transportAdapter';

/**
 * Componente de Ejemplos del Módulo de Transporte
 * 
 * Muestra datos de ejemplo y estadísticas del módulo de transporte
 */
export function TransportExamples() {
  // Calcular estadísticas
  const stats = {
    totalVehiculos: mockVehiculos.length,
    vehiculosDisponibles: mockVehiculos.filter(v => v.estadoVehiculo === 'Disponible').length,
    vehiculosEnServicio: mockVehiculos.filter(v => v.estadoVehiculo === 'En_Servicio').length,
    vehiculosMantenimiento: mockVehiculos.filter(v => v.estadoVehiculo === 'Mantenimiento').length,
    totalConductores: mockConductores.length,
    conductoresActivos: mockConductores.filter(c => c.activo).length,
    conductoresConAlerta: mockConductores.filter(c => isLicenseExpiringSoon(c)).length,
    totalRutas: mockRutas.length,
    rutasActivas: mockRutas.filter(r => r.estadoRuta === 'Activa').length,
    distanciaTotal: mockRutas.reduce((sum, r) => sum + r.distanciaKm, 0),
    totalAsignaciones: mockAsignaciones.length,
    asignacionesProgramadas: mockAsignaciones.filter(a => a.estadoAsignacion === 'Programada').length,
    asignacionesEnCurso: mockAsignaciones.filter(a => a.estadoAsignacion === 'En_Curso').length,
    asignacionesCompletadas: mockAsignaciones.filter(a => a.estadoAsignacion === 'Completada').length,
    ingresosTotales: mockAsignaciones.reduce((sum, a) => sum + a.tarifa, 0),
    capacidadTotal: mockVehiculos.reduce((sum, v) => sum + v.capacidadPasajeros, 0),
    vehiculosConAlerta: mockVehiculos.filter(v => needsMaintenanceSoon(v)).length,
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#3A7AFE] to-[#1A2440] rounded-lg p-6 text-white">
        <h1 className="text-2xl mb-2">🚗 Módulo de Transporte - Datos de Ejemplo</h1>
        <p className="text-blue-100">
          Sistema completo con {mockVehiculos.length} vehículos, {mockConductores.length} conductores, 
          {' '}{mockRutas.length} rutas y {mockAsignaciones.length} asignaciones de ejemplo
        </p>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Vehículos */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Car className="text-[#3A7AFE]" size={24} />
            </div>
            <Badge variant="blue" size="sm">{stats.vehiculosDisponibles} disponibles</Badge>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Total Vehículos</h3>
          <p className="text-3xl text-gray-900 mb-2">{stats.totalVehiculos}</p>
          <div className="flex gap-2 text-xs text-gray-500">
            <span>🔵 {stats.vehiculosEnServicio} en servicio</span>
            {stats.vehiculosConAlerta > 0 && (
              <span className="text-orange-600">⚠️ {stats.vehiculosConAlerta} alerta</span>
            )}
          </div>
        </Card>

        {/* Conductores */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <Users className="text-green-600" size={24} />
            </div>
            <Badge variant="green" size="sm">{stats.conductoresActivos} activos</Badge>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Conductores</h3>
          <p className="text-3xl text-gray-900 mb-2">{stats.totalConductores}</p>
          <div className="flex gap-2 text-xs text-gray-500">
            <span>✅ {stats.conductoresActivos} disponibles</span>
            {stats.conductoresConAlerta > 0 && (
              <span className="text-orange-600">⚠️ {stats.conductoresConAlerta} alerta</span>
            )}
          </div>
        </Card>

        {/* Rutas */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <MapPin className="text-purple-600" size={24} />
            </div>
            <Badge variant="purple" size="sm">{stats.rutasActivas} activas</Badge>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Rutas Turísticas</h3>
          <p className="text-3xl text-gray-900 mb-2">{stats.totalRutas}</p>
          <div className="text-xs text-gray-500">
            📍 {formatDistance(stats.distanciaTotal)} totales
          </div>
        </Card>

        {/* Ingresos */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <DollarSign className="text-orange-600" size={24} />
            </div>
            <Badge variant="orange" size="sm">{stats.asignacionesProgramadas} programadas</Badge>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Ingresos Totales</h3>
          <p className="text-2xl text-gray-900 mb-2">{formatCurrency(stats.ingresosTotales)}</p>
          <div className="text-xs text-gray-500">
            📋 {stats.totalAsignaciones} asignaciones
          </div>
        </Card>
      </div>

      {/* Ejemplos Destacados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehículos Destacados */}
        <Card className="p-6">
          <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Car size={20} className="text-[#3A7AFE]" />
            Vehículos Destacados
          </h2>
          <div className="space-y-3">
            {mockVehiculos.slice(0, 4).map((vehiculo) => (
              <div
                key={vehiculo.idVehiculo}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getVehicleTypeIcon(vehiculo.tipoVehiculo)}</span>
                  <div>
                    <p className="text-sm text-gray-900">
                      {vehiculo.marca} {vehiculo.modelo}
                    </p>
                    <p className="text-xs text-gray-500">
                      {vehiculo.placa} • {vehiculo.capacidadPasajeros} pasajeros
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={getVehicleStatusColor(vehiculo.estadoVehiculo) as any}
                    size="sm"
                  >
                    {getVehicleStatusLabel(vehiculo.estadoVehiculo)}
                  </Badge>
                  {needsMaintenanceSoon(vehiculo) && (
                    <AlertTriangle size={16} className="text-orange-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Conductores Destacados */}
        <Card className="p-6">
          <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Users size={20} className="text-green-600" />
            Conductores Destacados
          </h2>
          <div className="space-y-3">
            {mockConductores.slice(0, 4).map((conductor) => (
              <div
                key={conductor.idConductor}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#3A7AFE] to-[#1A2440] rounded-full flex items-center justify-center text-white">
                    {conductor.nombres.charAt(0)}{conductor.apellidos.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      {conductor.nombres} {conductor.apellidos}
                    </p>
                    <p className="text-xs text-gray-500">
                      Lic. {conductor.categoriaLicencia} • {conductor.ciudad}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={conductor.activo ? 'green' : 'red'} size="sm">
                    {conductor.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                  {isLicenseExpiringSoon(conductor) && (
                    <AlertTriangle size={16} className="text-orange-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Rutas Principales */}
      <Card className="p-6">
        <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
          <MapPin size={20} className="text-purple-600" />
          Rutas Turísticas Principales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockRutas.slice(0, 4).map((ruta) => (
            <div
              key={ruta.idRuta}
              className="p-4 border border-gray-200 rounded-lg hover:border-[#3A7AFE] transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-sm text-gray-900 mb-1">{ruta.nombre}</p>
                  <p className="text-xs text-gray-500">
                    {ruta.origen} → {ruta.destino}
                  </p>
                </div>
                <Badge variant={ruta.estadoRuta === 'Activa' ? 'green' : 'orange'} size="sm">
                  {ruta.estadoRuta}
                </Badge>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin size={12} />
                  <span>{formatDistance(ruta.distanciaKm)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={12} />
                  <span>{formatDuration(ruta.tiempoEstimadoHoras)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={12} />
                  <span>{formatCurrency(ruta.tarifaBase)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Asignaciones Recientes */}
      <Card className="p-6">
        <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-orange-600" />
          Asignaciones de Ejemplo
        </h2>
        <div className="space-y-2">
          {mockAsignaciones.slice(0, 5).map((asignacion) => (
            <div
              key={asignacion.idAsignacion}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#3A7AFE] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    {new Date(asignacion.fechaSalida).toLocaleDateString('es-CO', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </p>
                  <p className="text-sm text-gray-900">
                    {asignacion.horaSalida?.substring(0, 5)}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 mb-1">
                    {asignacion.nombreRuta}
                  </p>
                  <p className="text-xs text-gray-500">
                    🚐 {asignacion.placaVehiculo} • 👨‍✈️ {asignacion.nombreConductor?.split(' ')[0]}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900 mb-1">
                    {formatCurrency(asignacion.tarifa)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {asignacion.numeroPasajeros} pasajeros
                  </p>
                </div>
                <Badge
                  variant={
                    asignacion.estadoAsignacion === 'Completada' ? 'green' :
                    asignacion.estadoAsignacion === 'En_Curso' ? 'blue' :
                    asignacion.estadoAsignacion === 'Programada' ? 'purple' :
                    'red'
                  }
                  size="sm"
                >
                  {asignacion.estadoAsignacion === 'En_Curso' ? 'En Curso' :
                   asignacion.estadoAsignacion}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Estadísticas Adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="text-[#3A7AFE]" size={20} />
            </div>
            <h3 className="text-sm text-gray-600">Capacidad Total</h3>
          </div>
          <p className="text-2xl text-gray-900 mb-1">{stats.capacidadTotal}</p>
          <p className="text-xs text-gray-500">pasajeros simultáneos</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <h3 className="text-sm text-gray-600">Tasa de Completación</h3>
          </div>
          <p className="text-2xl text-gray-900 mb-1">
            {Math.round((stats.asignacionesCompletadas / stats.totalAsignaciones) * 100)}%
          </p>
          <p className="text-xs text-gray-500">
            {stats.asignacionesCompletadas} de {stats.totalAsignaciones} asignaciones
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <AlertTriangle className="text-orange-600" size={20} />
            </div>
            <h3 className="text-sm text-gray-600">Alertas Activas</h3>
          </div>
          <p className="text-2xl text-gray-900 mb-1">
            {stats.vehiculosConAlerta + stats.conductoresConAlerta}
          </p>
          <p className="text-xs text-gray-500">
            {stats.vehiculosConAlerta} vehículos, {stats.conductoresConAlerta} conductores
          </p>
        </Card>
      </div>

      {/* Footer con Info */}
      <div className="bg-[#F5F6FA] rounded-lg p-6 border border-gray-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-lg">
            <CheckCircle className="text-green-600" size={24} />
          </div>
          <div>
            <h3 className="text-sm text-gray-900 mb-1">
              ✅ Módulo de Transporte Completamente Funcional
            </h3>
            <p className="text-xs text-gray-600 mb-2">
              El módulo incluye datos de ejemplo completos con vehículos, conductores, rutas y asignaciones.
              Todos los datos están basados en operaciones reales de transporte turístico en Colombia.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="blue" size="sm">8 Vehículos</Badge>
              <Badge variant="green" size="sm">7 Conductores</Badge>
              <Badge variant="purple" size="sm">8 Rutas</Badge>
              <Badge variant="orange" size="sm">8 Asignaciones</Badge>
              <Badge variant="gray" size="sm">Datos Mock Automáticos</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
