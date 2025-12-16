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
  Users,
  Building,
  Briefcase,
  DollarSign,
  Calendar,
  Clock,
  Eye,
  Edit,
  Trash2,
  Award,
} from 'lucide-react';
import { useEmployees } from '../../../../hooks/useEmployees';
import {
  getEmployeeFullName,
  getEmployeeStatusLabel,
  getEmployeeStatusColor,
  getEmployeeStatusIcon,
  getContractTypeLabel,
  getCommissionTypeLabel,
  formatCurrency,
  formatDate,
  formatTime,
  formatSeniority,
  formatScheduleDescription,
  calculateAge,
  hasBirthdaySoon,
  getEmployeeInitials,
  generateAvatarColor,
} from '../../../../utils/adapters/employeesAdapter';
import type { Empleado, Departamento, Cargo, Comision } from '../../../../hooks/useEmployees';

type ViewMode = 'employees' | 'departments' | 'positions' | 'commissions';

export function EmployeesManagement() {
  const {
    employees,
    departments,
    positions,
    commissions,
    loading,
    deleteEmployee,
    deleteDepartment,
    deletePosition,
    deleteCommission,
    loadDepartments,
    loadPositions,
    loadCommissions,
  } = useEmployees();

  const [viewMode, setViewMode] = useState<ViewMode>('employees');
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar datos según la vista
  useEffect(() => {
    if (viewMode === 'departments' && departments.length === 0) {
      loadDepartments();
    } else if (viewMode === 'positions' && positions.length === 0) {
      loadPositions();
    } else if (viewMode === 'commissions' && commissions.length === 0) {
      loadCommissions();
    }
  }, [viewMode, departments.length, positions.length, commissions.length, loadDepartments, loadPositions, loadCommissions]);

  // Filtrar empleados
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee =>
      searchTerm === '' ||
      getEmployeeFullName(employee).toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.numeroDocumento.includes(searchTerm) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  // Filtrar departamentos
  const filteredDepartments = useMemo(() => {
    return departments.filter(dept =>
      searchTerm === '' ||
      dept.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [departments, searchTerm]);

  // Filtrar cargos
  const filteredPositions = useMemo(() => {
    return positions.filter(position =>
      searchTerm === '' ||
      position.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [positions, searchTerm]);

  // Filtrar comisiones
  const filteredCommissions = useMemo(() => {
    return commissions.filter(commission =>
      searchTerm === '' ||
      commission.nombreEmpleado?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [commissions, searchTerm]);

  // Calcular métricas
  const metrics = useMemo(() => {
    const empleadosActivos = employees.filter(e => e.estadoEmpleado === 'Activo').length;
    const empleadosVacaciones = employees.filter(e => e.estadoEmpleado === 'Vacaciones').length;
    const nominaTotal = employees
      .filter(e => e.estadoEmpleado === 'Activo')
      .reduce((sum, e) => sum + e.salarioBase, 0);
    const comisionesActivas = commissions.filter(c => c.activa).length;

    return {
      totalEmpleados: employees.length,
      empleadosActivos,
      empleadosVacaciones,
      totalDepartamentos: departments.length,
      totalCargos: positions.length,
      totalComisiones: comisionesActivas,
      nominaTotal,
    };
  }, [employees, departments, positions, commissions]);

  // Handlers
  const handleDeleteEmployee = async (id: number) => {
    if (confirm('¿Está seguro de eliminar este empleado?')) {
      const result = await deleteEmployee(id);
      if (result.success) {
        toast.success('Empleado eliminado exitosamente');
      } else {
        toast.error(result.error || 'Error al eliminar empleado');
      }
    }
  };

  const handleDeleteDepartment = async (id: number) => {
    if (confirm('¿Está seguro de eliminar este departamento?')) {
      const result = await deleteDepartment(id);
      if (result.success) {
        toast.success('Departamento eliminado exitosamente');
      } else {
        toast.error(result.error || 'Error al eliminar departamento');
      }
    }
  };

  const handleDeletePosition = async (id: number) => {
    if (confirm('¿Está seguro de eliminar este cargo?')) {
      const result = await deletePosition(id);
      if (result.success) {
        toast.success('Cargo eliminado exitosamente');
      } else {
        toast.error(result.error || 'Error al eliminar cargo');
      }
    }
  };

  const handleDeleteCommission = async (id: number) => {
    if (confirm('¿Está seguro de eliminar esta comisión?')) {
      const result = await deleteCommission(id);
      if (result.success) {
        toast.success('Comisión eliminada exitosamente');
      } else {
        toast.error(result.error || 'Error al eliminar comisión');
      }
    }
  };

  // Columnas de tablas
  const employeesColumns = [
    {
      key: 'avatar',
      label: '',
      render: (employee: Empleado) => {
        const initials = getEmployeeInitials(employee);
        const color = generateAvatarColor(employee.nombres);
        return (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm"
            style={{ backgroundColor: color }}
          >
            {initials}
          </div>
        );
      },
    },
    {
      key: 'nombre',
      label: 'Empleado',
      render: (employee: Empleado) => (
        <div>
          <p className="text-sm text-gray-900">{getEmployeeFullName(employee)}</p>
          <p className="text-xs text-gray-500">{employee.numeroDocumento}</p>
          {hasBirthdaySoon(employee) && (
            <span className="text-xs text-purple-600">🎂 Cumple pronto</span>
          )}
        </div>
      ),
    },
    {
      key: 'cargo',
      label: 'Cargo/Departamento',
      render: (employee: Empleado) => (
        <div>
          <p className="text-sm text-gray-900">{employee.nombreCargo || 'Sin cargo'}</p>
          <p className="text-xs text-gray-500">{employee.nombreDepartamento || 'Sin departamento'}</p>
        </div>
      ),
    },
    {
      key: 'contacto',
      label: 'Contacto',
      render: (employee: Empleado) => (
        <div>
          <p className="text-sm text-gray-900">{employee?.email || 'N/A'}</p>
          <p className="text-xs text-gray-500">{employee?.telefono || 'N/A'}</p>
        </div>
      ),
    },
    {
      key: 'contrato',
      label: 'Contrato',
      render: (employee: Empleado) => (
        <div>
          <p className="text-sm text-gray-900">{getContractTypeLabel(employee.tipoContrato)}</p>
          <p className="text-xs text-gray-500">{formatSeniority(employee.fechaContratacion)}</p>
        </div>
      ),
    },
    {
      key: 'salario',
      label: 'Salario',
      render: (employee: Empleado) => (
        <span className="text-sm text-gray-900">{formatCurrency(employee.salarioBase)}</span>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (employee: Empleado) => (
        <Badge variant={getEmployeeStatusColor(employee.estadoEmpleado) as any} size="sm">
          {getEmployeeStatusIcon(employee.estadoEmpleado)} {getEmployeeStatusLabel(employee.estadoEmpleado)}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (employee: Empleado) => (
        <div className="flex gap-1">
          <button
            className="p-1.5 text-gray-600 hover:text-[#3A7AFE] hover:bg-gray-100 rounded transition-colors"
            title="Ver detalles"
          >
            <Eye size={16} />
          </button>
          <button
            className="p-1.5 text-gray-600 hover:text-[#3A7AFE] hover:bg-gray-100 rounded transition-colors"
            title="Editar"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDeleteEmployee(employee.idEmpleado)}
            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded transition-colors"
            title="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const departmentsColumns = [
    {
      key: 'nombre',
      label: 'Departamento',
      render: (dept: Departamento) => (
        <div>
          <p className="text-sm text-gray-900">{dept.nombre}</p>
          {dept.descripcion && <p className="text-xs text-gray-500">{dept.descripcion}</p>}
        </div>
      ),
    },
    {
      key: 'jefe',
      label: 'Jefe',
      render: (dept: Departamento) => (
        <span className="text-sm text-gray-900">{dept.nombreJefe || 'Sin asignar'}</span>
      ),
    },
    {
      key: 'empleados',
      label: 'Empleados',
      render: (dept: Departamento) => (
        <span className="text-sm text-gray-900">{dept.cantidadEmpleados || 0}</span>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (dept: Departamento) => (
        <Badge variant={dept.activo ? 'green' : 'red'} size="sm">
          {dept.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (dept: Departamento) => (
        <div className="flex gap-1">
          <button className="p-1.5 text-gray-600 hover:text-[#3A7AFE] hover:bg-gray-100 rounded transition-colors" title="Ver detalles">
            <Eye size={16} />
          </button>
          <button className="p-1.5 text-gray-600 hover:text-[#3A7AFE] hover:bg-gray-100 rounded transition-colors" title="Editar">
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDeleteDepartment(dept.idDepartamento)}
            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded transition-colors"
            title="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const positionsColumns = [
    {
      key: 'nombre',
      label: 'Cargo',
      render: (position: Cargo) => (
        <div>
          <p className="text-sm text-gray-900">{position.nombre}</p>
          {position.descripcion && <p className="text-xs text-gray-500">{position.descripcion}</p>}
        </div>
      ),
    },
    {
      key: 'rango',
      label: 'Rango Salarial',
      render: (position: Cargo) => (
        <div>
          <p className="text-sm text-gray-900">
            {formatCurrency(position.salarioMinimo)} - {formatCurrency(position.salarioMaximo)}
          </p>
        </div>
      ),
    },
    {
      key: 'empleados',
      label: 'Empleados',
      render: (position: Cargo) => (
        <span className="text-sm text-gray-900">{position.cantidadEmpleados || 0}</span>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (position: Cargo) => (
        <Badge variant={position.activo ? 'green' : 'red'} size="sm">
          {position.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (position: Cargo) => (
        <div className="flex gap-1">
          <button className="p-1.5 text-gray-600 hover:text-[#3A7AFE] hover:bg-gray-100 rounded transition-colors" title="Ver detalles">
            <Eye size={16} />
          </button>
          <button className="p-1.5 text-gray-600 hover:text-[#3A7AFE] hover:bg-gray-100 rounded transition-colors" title="Editar">
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDeletePosition(position.idCargo)}
            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded transition-colors"
            title="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const commissionsColumns = [
    {
      key: 'empleado',
      label: 'Empleado',
      render: (commission: Comision) => (
        <span className="text-sm text-gray-900">{commission.nombreEmpleado || 'N/A'}</span>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (commission: Comision) => (
        <span className="text-sm text-gray-900">{getCommissionTypeLabel(commission.tipoComision)}</span>
      ),
    },
    {
      key: 'valor',
      label: 'Valor',
      render: (commission: Comision) => (
        <div>
          {commission.porcentaje && <p className="text-sm text-gray-900">{commission.porcentaje}%</p>}
          {commission.montoFijo && <p className="text-sm text-gray-900">{formatCurrency(commission.montoFijo)}</p>}
        </div>
      ),
    },
    {
      key: 'periodo',
      label: 'Período',
      render: (commission: Comision) => (
        <div>
          <p className="text-sm text-gray-900">Desde: {formatDate(commission.fechaInicio)}</p>
          {commission.fechaFin && <p className="text-xs text-gray-500">Hasta: {formatDate(commission.fechaFin)}</p>}
        </div>
      ),
    },
    {
      key: 'meta',
      label: 'Meta',
      render: (commission: Comision) => (
        <span className="text-sm text-gray-900">
          {commission.meta ? formatCurrency(commission.meta) : 'Sin meta'}
        </span>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (commission: Comision) => (
        <Badge variant={commission.activa ? 'green' : 'red'} size="sm">
          {commission.activa ? 'Activa' : 'Inactiva'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (commission: Comision) => (
        <div className="flex gap-1">
          <button className="p-1.5 text-gray-600 hover:text-[#3A7AFE] hover:bg-gray-100 rounded transition-colors" title="Ver detalles">
            <Eye size={16} />
          </button>
          <button className="p-1.5 text-gray-600 hover:text-[#3A7AFE] hover:bg-gray-100 rounded transition-colors" title="Editar">
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDeleteCommission(commission.idComision)}
            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded transition-colors"
            title="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#3A7AFE] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Empleados</p>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users size={18} className="text-[#3A7AFE]" />
            </div>
          </div>
          <p className="text-2xl text-gray-900">{metrics.totalEmpleados}</p>
          <p className="text-xs text-gray-500 mt-1">{metrics.empleadosActivos} activos</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Departamentos</p>
            <div className="p-2 bg-green-50 rounded-lg">
              <Building size={18} className="text-green-600" />
            </div>
          </div>
          <p className="text-2xl text-gray-900">{metrics.totalDepartamentos}</p>
          <p className="text-xs text-gray-500 mt-1">activos</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Cargos</p>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Briefcase size={18} className="text-purple-600" />
            </div>
          </div>
          <p className="text-2xl text-gray-900">{metrics.totalCargos}</p>
          <p className="text-xs text-gray-500 mt-1">definidos</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Nómina Total</p>
            <div className="p-2 bg-orange-50 rounded-lg">
              <DollarSign size={18} className="text-orange-600" />
            </div>
          </div>
          <p className="text-2xl text-gray-900">{formatCurrency(metrics.nominaTotal)}</p>
          <p className="text-xs text-gray-500 mt-1">empleados activos</p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="bg-white border border-gray-200 rounded-lg">
        {/* Header con tabs */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4">
              <button
                onClick={() => setViewMode('employees')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'employees'
                    ? 'bg-[#3A7AFE] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Users size={18} className="inline mr-2" />
                Empleados
              </button>
              <button
                onClick={() => setViewMode('departments')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'departments'
                    ? 'bg-[#3A7AFE] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Building size={18} className="inline mr-2" />
                Departamentos
              </button>
              <button
                onClick={() => setViewMode('positions')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'positions'
                    ? 'bg-[#3A7AFE] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Briefcase size={18} className="inline mr-2" />
                Cargos
              </button>
              <button
                onClick={() => setViewMode('commissions')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'commissions'
                    ? 'bg-[#3A7AFE] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Award size={18} className="inline mr-2" />
                Comisiones
              </button>
            </div>

            <Button variant="primary">
              <Plus size={18} />
              Nuevo
            </Button>
          </div>

          {/* Búsqueda */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder={`Buscar ${viewMode === 'employees' ? 'empleados' : viewMode === 'departments' ? 'departamentos' : viewMode === 'positions' ? 'cargos' : 'comisiones'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={18} />}
              />
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="p-6">
          {viewMode === 'employees' && (
            filteredEmployees.length > 0 ? (
              <SimpleTable columns={employeesColumns} data={filteredEmployees} />
            ) : (
              <EmptyState
                icon={<Users size={48} />}
                title="No se encontraron empleados"
                description="Comienza agregando tu primer empleado"
                action={
                  <Button variant="primary">
                    <Plus size={18} />
                    Nuevo Empleado
                  </Button>
                }
              />
            )
          )}

          {viewMode === 'departments' && (
            filteredDepartments.length > 0 ? (
              <SimpleTable columns={departmentsColumns} data={filteredDepartments} />
            ) : (
              <EmptyState
                icon={<Building size={48} />}
                title="No se encontraron departamentos"
                description="Comienza creando tu primer departamento"
                action={
                  <Button variant="primary">
                    <Plus size={18} />
                    Nuevo Departamento
                  </Button>
                }
              />
            )
          )}

          {viewMode === 'positions' && (
            filteredPositions.length > 0 ? (
              <SimpleTable columns={positionsColumns} data={filteredPositions} />
            ) : (
              <EmptyState
                icon={<Briefcase size={48} />}
                title="No se encontraron cargos"
                description="Comienza creando tu primer cargo"
                action={
                  <Button variant="primary">
                    <Plus size={18} />
                    Nuevo Cargo
                  </Button>
                }
              />
            )
          )}

          {viewMode === 'commissions' && (
            filteredCommissions.length > 0 ? (
              <SimpleTable columns={commissionsColumns} data={filteredCommissions} />
            ) : (
              <EmptyState
                icon={<Award size={48} />}
                title="No se encontraron comisiones"
                description="Comienza creando tu primera comisión"
                action={
                  <Button variant="primary">
                    <Plus size={18} />
                    Nueva Comisión
                  </Button>
                }
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}