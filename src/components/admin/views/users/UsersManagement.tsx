import React, { useState, useEffect } from 'react';
import { Card } from '../../../ui/Card';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';
import { Select } from '../../../ui/Select';
import { Badge } from '../../../ui/Badge';
import { Avatar } from '../../../ui/Avatar';
import { Modal } from '../../../ui/Modal';
import { Switch } from '../../../ui/Switch';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Mail,
  Phone,
  Shield,
  Calendar,
  UserX,
  UserCheck,
  Key,
  AlertCircle,
  Download,
  Upload,
} from 'lucide-react';
import { toast } from '../../../ui/Toast';
import { UserModal } from './UserModal';
import { UserDetails } from './UserDetails';
import { User, UserFormData } from './types';
import { useUsers } from '../../../../hooks/useUsers';
import { useRoles } from '../../../../hooks/useRoles';
import { apiUserToUiUser, uiFormDataToApiCreateUser, uiFormDataToApiUpdateUser } from '../../../../utils/adapters/usersAdapter';

export function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  // Hooks para obtener datos de la API
  const {
    users: apiUsers,
    loading: isUsersLoading,
    createUser,
    updateUser,
    toggleUserStatus,
    deleteUser: deleteApiUser
  } = useUsers();
  
  const { roles: apiRoles, loading: isRolesLoading } = useRoles();
  
  // Estados de loading para operaciones
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Convertir usuarios de API a formato UI
  useEffect(() => {
    if (!isUsersLoading && apiUsers) {
      const uiUsers = apiUsers.map(apiUser => apiUserToUiUser(apiUser));
      setUsers(uiUsers);
    }
  }, [apiUsers, isUsersLoading]);

  // Convertir roles de API a formato UI
  const availableRoles = (apiRoles || []).map(role => ({
    id: role.idRol.toString(),
    name: role.nombre,
    color: '#3A7AFE', // Usar color por defecto
  }));

  // Obtener departamentos únicos
  const departments = Array.from(new Set(users.map((u) => u.department)));

  // Filtrar usuarios
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role.id === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    const matchesDepartment =
      selectedDepartment === 'all' || user.department === selectedDepartment;

    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  // Estadísticas
  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    inactive: users.filter((u) => u.status === 'inactive').length,
  };

  const handleAddUser = async (data: UserFormData) => {
    setIsCreating(true);
    const newUser: User = {
      id: Date.now().toString(),
      ...data,
      role: availableRoles.find((r) => r.id === data.roleId) || availableRoles[4],
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Nunca',
    };

    const result = await createUser(uiFormDataToApiCreateUser(data));
    if (result.success) {
      setUsers([...users, newUser]);
      setIsAddModalOpen(false);
      toast.success('Usuario creado exitosamente');
    } else {
      toast.error(result.error || 'Error al crear usuario');
    }
    setIsCreating(false);
  };

  const handleEditUser = async (data: UserFormData) => {
    if (!selectedUser) return;
    setIsUpdating(true);

    setUsers(
      users.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              ...data,
              role: availableRoles.find((r) => r.id === data.roleId) || user.role,
            }
          : user
      )
    );

    const result = await updateUser(parseInt(selectedUser.id), uiFormDataToApiUpdateUser(data));
    if (result.success) {
      setIsEditModalOpen(false);
      setSelectedUser(null);
      toast.success('Usuario actualizado exitosamente');
    } else {
      toast.error(result.error || 'Error al actualizar usuario');
    }
    setIsUpdating(false);
  };

  const handleDeleteUser = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (
      window.confirm(
        `¿Estás seguro de eliminar al usuario "${user?.name}"? Esta acción no se puede deshacer.`
      )
    ) {
      const result = await deleteApiUser(parseInt(userId));
      if (result.success) {
        setUsers(users.filter((u) => u.id !== userId));
        toast.success('Usuario eliminado exitosamente');
      } else {
        toast.error(result.error || 'Error al eliminar usuario');
      }
    }
  };

  const handleToggleStatus = async (userId: string) => {
    const result = await toggleUserStatus(parseInt(userId));
    
    if (result.success) {
      setUsers(
        users.map((user) =>
          user.id === userId
            ? {
                ...user,
                status: user.status === 'active' ? 'inactive' as const : 'active' as const,
              }
            : user
        )
      );

      const user = users.find((u) => u.id === userId);
      toast.success(
        `Usuario ${user?.status === 'active' ? 'desactivado' : 'activado'} exitosamente`
      );
    } else {
      toast.error(result.error || 'Error al cambiar estado');
    }
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    console.log('Changing password for user:', selectedUser?.id);
    setIsChangePasswordModalOpen(false);
    setPasswordData({ newPassword: '', confirmPassword: '' });
    toast.success('Contraseña cambiada exitosamente');
  };

  const handleExportUsers = () => {
    console.log('Exporting users:', filteredUsers);
    toast.success('Usuarios exportados exitosamente');
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Usuarios</p>
              <p className="text-3xl mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-[#3A7AFE]/10 flex items-center justify-center">
              <Users size={24} className="text-[#3A7AFE]" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Usuarios Activos</p>
              <p className="text-3xl mt-1">{stats.active}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
              <UserCheck size={24} className="text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Usuarios Inactivos</p>
              <p className="text-3xl mt-1">{stats.inactive}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
              <UserX size={24} className="text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabla de usuarios */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h5>Gestión de Usuarios</h5>
            <p className="text-sm text-gray-600">
              {filteredUsers.length} de {users.length} usuarios
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleExportUsers}>
              <Download size={16} />
              Exportar
            </Button>
            <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={16} />
              Nuevo Usuario
            </Button>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <div className="relative lg:col-span-2">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            options={[
              { value: 'all', label: 'Todos los roles' },
              ...availableRoles.map((role) => ({ value: role.id, label: role.name })),
            ]}
          />

          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={[
              { value: 'all', label: 'Todos los estados' },
              { value: 'active', label: 'Activos' },
              { value: 'inactive', label: 'Inactivos' },
            ]}
          />

          <Select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            options={[
              { value: 'all', label: 'Todos los departamentos' },
              ...departments.map((dept) => ({ value: dept, label: dept })),
            ]}
          />
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm text-gray-600">Usuario</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Contacto</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Rol</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Departamento</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Estado</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Última Conexión</th>
                <th className="text-right py-3 px-4 text-sm text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isUsersLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A7AFE]"></div>
                      <p className="text-gray-600">Cargando usuarios...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <Users size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No se encontraron usuarios</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Intenta ajustar los filtros de búsqueda
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={user.avatar} name={user.name} size="md" />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail size={14} className="text-gray-400" />
                          <span className="text-gray-700">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone size={14} className="text-gray-400" />
                          <span className="text-gray-700">{user.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: user.role.color }}
                        />
                        <span className="text-sm">{user.role.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">{user.department}</span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={user.status === 'active' ? 'success' : 'gray'}>
                        {user.status === 'active' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} />
                        {user.lastLogin}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setIsDetailsModalOpen(true);
                          }}
                          className="p-2 text-gray-600 hover:text-[#3A7AFE] hover:bg-[#3A7AFE]/5 rounded transition-colors"
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setIsEditModalOpen(true);
                          }}
                          className="p-2 text-gray-600 hover:text-[#3A7AFE] hover:bg-[#3A7AFE]/5 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setIsChangePasswordModalOpen(true);
                          }}
                          className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                          title="Cambiar contraseña"
                        >
                          <Key size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={`p-2 rounded transition-colors ${
                            user.status === 'active'
                              ? 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                              : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                          }`}
                          title={user.status === 'active' ? 'Desactivar' : 'Activar'}
                        >
                          {user.status === 'active' ? (
                            <UserX size={16} />
                          ) : (
                            <UserCheck size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Agregar Usuario */}
      {isAddModalOpen && (
        <UserModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddUser}
          availableRoles={availableRoles}
          departments={departments}
          isCreating={isCreating}
        />
      )}

      {/* Modal Editar Usuario */}
      {isEditModalOpen && selectedUser && (
        <UserModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          onSave={handleEditUser}
          availableRoles={availableRoles}
          departments={departments}
          initialData={selectedUser}
          isUpdating={isUpdating}
        />
      )}

      {/* Modal Detalles Usuario */}
      {isDetailsModalOpen && selectedUser && (
        <UserDetails
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
        />
      )}

      {/* Modal Cambiar Contraseña */}
      <Modal
        isOpen={isChangePasswordModalOpen}
        onClose={() => {
          setIsChangePasswordModalOpen(false);
          setPasswordData({ newPassword: '', confirmPassword: '' });
        }}
        title="Cambiar Contraseña"
      >
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-900">
              <p>
                Cambiarás la contraseña de <strong>{selectedUser?.name}</strong>. El usuario
                recibirá un correo con la nueva contraseña.
              </p>
            </div>
          </div>

          <Input
            type="password"
            label="Nueva Contraseña"
            placeholder="Mínimo 8 caracteres"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, newPassword: e.target.value })
            }
          />

          <Input
            type="password"
            label="Confirmar Contraseña"
            placeholder="Repite la contraseña"
            value={passwordData.confirmPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, confirmPassword: e.target.value })
            }
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setIsChangePasswordModalOpen(false);
                setPasswordData({ newPassword: '', confirmPassword: '' });
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleChangePassword}>
              <Key size={18} />
              Cambiar Contraseña
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}