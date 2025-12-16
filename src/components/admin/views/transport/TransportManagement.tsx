import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';
import { Badge } from '../../../ui/Badge';
import { toast } from '../../../ui/Toast';
import { SimpleTable } from '../../../ui/SimpleTable';
import { EmptyState } from '../../../ui/EmptyState';
import {
  Plus,
  Search,
  Car,
  Users,
  MapPin,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Wrench,
} from 'lucide-react';
import { useTransport } from '../../../../hooks/useTransport';
import {
  getVehicleTypeIcon,
  getVehicleStatusLabel,
  getVehicleStatusColor,
  getDriverFullName,
  getRouteDescription,
  getAssignmentStatusLabel,
  getAssignmentStatusColor,
  formatDate,
  formatCurrency,
  formatDistance,
  formatDuration,
  isLicenseExpiringSoon,
  needsMaintenanceSoon,
} from '../../../../utils/adapters/transportAdapter';
import type { Vehiculo, Conductor, Ruta, Asignacion } from '../../../../hooks/useTransport';

type ViewMode = 'vehicles' | 'drivers' | 'routes' | 'assignments';

export function TransportManagement() {
  const {
    vehicles,
    drivers,
    routes,
    assignments,
    loading,
    deleteVehicle,
    deleteDriver,
    deleteRoute,
    deleteAssignment,
    loadDrivers,
    loadRoutes,
    loadAssignments,
  } = useTransport();

  const [viewMode, setViewMode] = useState<ViewMode>('vehicles');
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar datos según la vista
  useEffect(() => {
    if (viewMode === 'drivers' && drivers.length === 0) {
      loadDrivers();
    } else if (viewMode === 'routes' && routes.length === 0) {
      loadRoutes();
    } else if (viewMode === 'assignments' && assignments.length === 0) {
      loadAssignments();
    }
  }, [viewMode, drivers.length, routes.length, assignments.length, loadDrivers, loadRoutes, loadAssignments]);

  // Filtrar vehículos
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle =>
      searchTerm === '' ||
      vehicle.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.modelo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [vehicles, searchTerm]);

  // Filtrar conductores
  const filteredDrivers = useMemo(() => {
    return drivers.filter(driver =>
      searchTerm === '' ||
      getDriverFullName(driver).toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.numeroDocumento.includes(searchTerm) ||
      driver.numeroLicencia.includes(searchTerm)
    );
  }, [drivers, searchTerm]);

  // Filtrar rutas
  const filteredRoutes = useMemo(() => {
    return routes.filter(route =>
      searchTerm === '' ||
      route.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.origen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.destino.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [routes, searchTerm]);

  // Filtrar asignaciones
  const filteredAssignments = useMemo(() => {
    return assignments.filter(assignment =>
      searchTerm === '' ||
      assignment.placaVehiculo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.nombreConductor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.nombreRuta?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [assignments, searchTerm]);

  // Estadísticas del dashboard
  const stats = useMemo(() => {
    const vehiculosDisponibles = vehicles.filter(v => v.estadoVehiculo === 'Disponible').length;
    const vehiculosEnServicio = vehicles.filter(v => v.estadoVehiculo === 'En_Servicio').length;
    const vehiculosMantenimiento = vehicles.filter(v => v.estadoVehiculo === 'Mantenimiento').length;
    const conductoresActivos = drivers.filter(d => d.activo).length;
    const rutasActivas = routes.filter(r => r.estadoRuta === 'Activa').length;
    const asignacionesHoy = assignments.filter(a => {
      const today = new Date().toISOString().split('T')[0];
      return a.fechaSalida === today;
    }).length;

    return {
      totalVehiculos: vehicles.length,
      vehiculosDisponibles,
      vehiculosEnServicio,
      vehiculosMantenimiento,
      totalConductores: drivers.length,
      conductoresActivos,
      totalRutas: routes.length,
      rutasActivas,
      asignacionesHoy,
    };
  }, [vehicles, drivers, routes, assignments]);

  // Handlers
  const handleDeleteVehicle = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este vehículo?')) {
      const result = await deleteVehicle(id);
      if (result.success) {
        toast.success('Vehículo eliminado exitosamente');
      } else {
        toast.error(result.error || 'Error al eliminar vehículo');
      }
    }
  };

  const handleDeleteDriver = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este conductor?')) {
      const result = await deleteDriver(id);
      if (result.success) {
        toast.success('Conductor eliminado exitosamente');
      } else {
        toast.error(result.error || 'Error al eliminar conductor');
      }
    }
  };

  const handleDeleteRoute = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta ruta?')) {
      const result = await deleteRoute(id);
      if (result.success) {
        toast.success('Ruta eliminada exitosamente');
      } else {
        toast.error(result.error || 'Error al eliminar ruta');
      }
    }
  };

  const handleDeleteAssignment = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta asignación?')) {
      const result = await deleteAssignment(id);
      if (result.success) {
        toast.success('Asignación eliminada exitosamente');
      } else {
        toast.error(result.error || 'Error al eliminar asignación');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Vehículos</p>
              <p className="text-3xl font-bold text-[#1A2440] mt-1">{stats.totalVehiculos}</p>
              <p className="text-xs text-gray-500 mt-2">
                {stats.vehiculosDisponibles} disponibles
              </p>
            </div>
            <div className="bg-[#3A7AFE]/10 p-3 rounded-lg">
              <Car className="text-[#3A7AFE]" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conductores</p>
              <p className="text-3xl font-bold text-[#1A2440] mt-1">{stats.totalConductores}</p>
              <p className="text-xs text-gray-500 mt-2">
                {stats.conductoresActivos} activos
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Users className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rutas</p>
              <p className="text-3xl font-bold text-[#1A2440] mt-1">{stats.totalRutas}</p>
              <p className="text-xs text-gray-500 mt-2">
                {stats.rutasActivas} activas
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <MapPin className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Asignaciones Hoy</p>
              <p className="text-3xl font-bold text-[#1A2440] mt-1">{stats.asignacionesHoy}</p>
              <p className="text-xs text-gray-500 mt-2">
                {stats.vehiculosEnServicio} en servicio
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <Calendar className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de Navegación */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => setViewMode('vehicles')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                viewMode === 'vehicles'
                  ? 'border-[#3A7AFE] text-[#3A7AFE]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Car size={18} />
                Vehículos ({vehicles.length})
              </div>
            </button>
            <button
              onClick={() => setViewMode('drivers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                viewMode === 'drivers'
                  ? 'border-[#3A7AFE] text-[#3A7AFE]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users size={18} />
                Conductores ({drivers.length})
              </div>
            </button>
            <button
              onClick={() => setViewMode('routes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                viewMode === 'routes'
                  ? 'border-[#3A7AFE] text-[#3A7AFE]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                Rutas ({routes.length})
              </div>
            </button>
            <button
              onClick={() => setViewMode('assignments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                viewMode === 'assignments'
                  ? 'border-[#3A7AFE] text-[#3A7AFE]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                Asignaciones ({assignments.length})
              </div>
            </button>
          </div>
        </div>

        {/* Barra de Búsqueda y Acciones */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder={`Buscar ${viewMode === 'vehicles' ? 'vehículos' : viewMode === 'drivers' ? 'conductores' : viewMode === 'routes' ? 'rutas' : 'asignaciones'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="primary">
              <Plus size={20} />
              Nuevo{' '}
              {viewMode === 'vehicles'
                ? 'Vehículo'
                : viewMode === 'drivers'
                ? 'Conductor'
                : viewMode === 'routes'
                ? 'Ruta'
                : 'Asignación'}
            </Button>
          </div>
        </div>

        {/* Contenido según tab */}
        <div className="p-6">
          {/* Vista de Vehículos */}
          {viewMode === 'vehicles' && (
            <>
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Cargando vehículos...</p>
                </div>
              ) : filteredVehicles.length === 0 ? (
                <EmptyState
                  icon={<Car size={48} />}
                  title="No hay vehículos"
                  description="Comienza agregando tu primer vehículo"
                />
              ) : (
                <SimpleTable
                  headers={['Placa', 'Marca/Modelo', 'Tipo', 'Capacidad', 'Estado', 'Acciones']}
                  data={filteredVehicles.map((vehicle) => [
                    <div key={vehicle.idVehiculo} className="font-medium text-gray-900">
                      {vehicle.placa}
                      {needsMaintenanceSoon(vehicle) && (
                        <Wrench className="inline-block ml-2 text-orange-500" size={16} />
                      )}
                    </div>,
                    <div>
                      <div className="font-medium text-gray-900">{vehicle.marca}</div>
                      <div className="text-sm text-gray-500">{vehicle.modelo} ({vehicle.anio})</div>
                    </div>,
                    <Badge variant="secondary">{vehicle.tipoVehiculo}</Badge>,
                    <span className="text-gray-700">{vehicle.capacidadPasajeros} pasajeros</span>,
                    <Badge variant={getVehicleStatusColor(vehicle.estadoVehiculo)}>
                      {getVehicleStatusLabel(vehicle.estadoVehiculo)}
                    </Badge>,
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye size={18} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteVehicle(vehicle.idVehiculo)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>,
                  ])}
                />
              )}
            </>
          )}

          {/* Vista de Conductores */}
          {viewMode === 'drivers' && (
            <>
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Cargando conductores...</p>
                </div>
              ) : filteredDrivers.length === 0 ? (
                <EmptyState
                  icon={<Users size={48} />}
                  title="No hay conductores"
                  description="Comienza agregando tu primer conductor"
                />
              ) : (
                <SimpleTable
                  headers={['Nombre', 'Documento', 'Licencia', 'Teléfono', 'Estado', 'Acciones']}
                  data={filteredDrivers.map((driver) => [
                    <div key={driver.idConductor}>
                      <div className="font-medium text-gray-900">{getDriverFullName(driver)}</div>
                      {isLicenseExpiringSoon(driver) && (
                        <div className="text-xs text-orange-600 mt-1">⚠️ Licencia próxima a vencer</div>
                      )}
                    </div>,
                    <div>
                      <div className="text-gray-900">{driver.numeroDocumento}</div>
                      <div className="text-sm text-gray-500">{driver.tipoDocumento}</div>
                    </div>,
                    <div>
                      <div className="text-gray-900">{driver.numeroLicencia}</div>
                      <div className="text-sm text-gray-500">{driver.categoriaLicencia}</div>
                    </div>,
                    <span className="text-gray-700">{driver.telefono}</span>,
                    <Badge variant={driver.activo ? 'success' : 'secondary'}>
                      {driver.activo ? 'Activo' : 'Inactivo'}
                    </Badge>,
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye size={18} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteDriver(driver.idConductor)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>,
                  ])}
                />
              )}
            </>
          )}

          {/* Vista de Rutas */}
          {viewMode === 'routes' && (
            <>
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Cargando rutas...</p>
                </div>
              ) : filteredRoutes.length === 0 ? (
                <EmptyState
                  icon={<MapPin size={48} />}
                  title="No hay rutas"
                  description="Comienza agregando tu primera ruta"
                />
              ) : (
                <SimpleTable
                  headers={['Ruta', 'Origen → Destino', 'Distancia', 'Tiempo', 'Tarifa', 'Acciones']}
                  data={filteredRoutes.map((route) => [
                    <div key={route.idRuta} className="font-medium text-gray-900">
                      {route.nombre}
                    </div>,
                    <div>
                      <div className="text-gray-900">{route.origen}</div>
                      <div className="text-sm text-gray-500">→ {route.destino}</div>
                    </div>,
                    <span className="text-gray-700">{formatDistance(route.distanciaKm)}</span>,
                    <span className="text-gray-700">{formatDuration(route.tiempoEstimadoHoras)}</span>,
                    <span className="text-gray-900 font-medium">{formatCurrency(route.tarifaBase)}</span>,
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye size={18} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteRoute(route.idRuta)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>,
                  ])}
                />
              )}
            </>
          )}

          {/* Vista de Asignaciones */}
          {viewMode === 'assignments' && (
            <>
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Cargando asignaciones...</p>
                </div>
              ) : filteredAssignments.length === 0 ? (
                <EmptyState
                  icon={<Calendar size={48} />}
                  title="No hay asignaciones"
                  description="Comienza creando tu primera asignación"
                />
              ) : (
                <SimpleTable
                  headers={['Fecha', 'Vehículo', 'Conductor', 'Ruta', 'Pasajeros', 'Estado', 'Acciones']}
                  data={filteredAssignments.map((assignment) => [
                    <div key={assignment.idAsignacion}>
                      <div className="font-medium text-gray-900">{formatDate(assignment.fechaSalida)}</div>
                      <div className="text-sm text-gray-500">{assignment.horaSalida}</div>
                    </div>,
                    <span className="text-gray-900">{assignment.placaVehiculo || 'N/A'}</span>,
                    <span className="text-gray-900">{assignment.nombreConductor || 'N/A'}</span>,
                    <span className="text-gray-900">{assignment.nombreRuta || 'N/A'}</span>,
                    <span className="text-gray-700">{assignment.numeroPasajeros}</span>,
                    <Badge variant={getAssignmentStatusColor(assignment.estadoAsignacion)}>
                      {getAssignmentStatusLabel(assignment.estadoAsignacion)}
                    </Badge>,
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye size={18} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteAssignment(assignment.idAsignacion)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>,
                  ])}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}