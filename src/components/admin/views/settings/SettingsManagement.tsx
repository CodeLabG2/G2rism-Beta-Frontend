import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';
import { Badge } from '../../../ui/Badge';
import { toast } from '../../../ui/Toast';
import { SimpleTable } from '../../../ui/SimpleTable';
import { EmptyState } from '../../../ui/EmptyState';
import {
  Settings,
  Building2,
  Database,
  FileText,
  Bell,
  HardDrive,
  Mail,
  Shield,
  Info,
  Save,
  TestTube,
  Download,
  Trash2,
  Edit,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useSettings } from '../../../../hooks/useSettings';
import type { SystemParameters, NotificationSettings, SystemLog } from '../../../../hooks/useSettings';

type ViewMode = 'company' | 'dian' | 'parameters' | 'notifications' | 'backups' | 'logs' | 'email' | 'security';

export function SettingsManagement() {
  const {
    companySettings,
    systemParameters,
    dianConfiguration,
    notifications,
    backupConfiguration,
    systemLogs,
    emailConfiguration,
    securitySettings,
    loading,
    loadCompanySettings,
    loadSystemParameters,
    loadDianConfiguration,
    loadNotifications,
    loadBackupConfiguration,
    loadSystemLogs,
    loadEmailConfiguration,
    loadSecuritySettings,
    updateCompanySettings,
    updateDianConfiguration,
    toggleNotification,
    executeBackup,
    testDianConnection,
    testEmailConfiguration,
    clearCache,
    getSystemInfo,
  } = useSettings();

  const [viewMode, setViewMode] = useState<ViewMode>('company');
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>({});

  // Cargar datos iniciales
  useEffect(() => {
    loadCompanySettings();
    getSystemInfo().then(result => {
      if (result.success) {
        setSystemInfo(result.data);
      }
    });
  }, []);

  // Cargar datos según la vista activa
  useEffect(() => {
    switch (viewMode) {
      case 'company':
        loadCompanySettings();
        break;
      case 'dian':
        loadDianConfiguration();
        break;
      case 'parameters':
        loadSystemParameters();
        break;
      case 'notifications':
        loadNotifications();
        break;
      case 'backups':
        loadBackupConfiguration();
        break;
      case 'logs':
        loadSystemLogs({ limite: 50 });
        break;
      case 'email':
        loadEmailConfiguration();
        break;
      case 'security':
        loadSecuritySettings();
        break;
    }
  }, [viewMode]);

  // Inicializar datos del formulario
  useEffect(() => {
    if (viewMode === 'company' && companySettings) {
      setFormData(companySettings);
    } else if (viewMode === 'dian' && dianConfiguration) {
      setFormData(dianConfiguration);
    }
  }, [viewMode, companySettings, dianConfiguration]);

  // Handlers
  const handleSaveCompany = async () => {
    const result = await updateCompanySettings(formData);
    if (result.success) {
      toast.success('Configuración actualizada exitosamente');
      setEditMode(false);
    } else {
      toast.error(result.error || 'Error al actualizar configuración');
    }
  };

  const handleSaveDian = async () => {
    const result = await updateDianConfiguration(formData);
    if (result.success) {
      toast.success('Configuración DIAN actualizada exitosamente');
      setEditMode(false);
    } else {
      toast.error(result.error || 'Error al actualizar configuración DIAN');
    }
  };

  const handleTestDian = async () => {
    const result = await testDianConnection();
    if (result.success && result.data) {
      if (result.data.exito) {
        toast.success(result.data.mensaje || 'Conexión exitosa con DIAN');
      } else {
        toast.error(result.data.mensaje || 'Error al conectar con DIAN');
      }
    } else {
      toast.error(result.error || 'Error al probar conexión');
    }
  };

  const handleExecuteBackup = async () => {
    if (confirm('¿Desea ejecutar un respaldo manual del sistema?')) {
      const result = await executeBackup();
      if (result.success && result.data) {
        if (result.data.exito) {
          toast.success(result.data.mensaje || 'Respaldo ejecutado exitosamente');
        } else {
          toast.error(result.data.mensaje || 'Error al ejecutar respaldo');
        }
      } else {
        toast.error(result.error || 'Error al ejecutar respaldo');
      }
    }
  };

  const handleToggleNotification = async (id: number, habilitado: boolean) => {
    const result = await toggleNotification(id, habilitado);
    if (result.success) {
      toast.success(`Notificación ${habilitado ? 'habilitada' : 'deshabilitada'} exitosamente`);
    } else {
      toast.error(result.error || 'Error al cambiar estado de notificación');
    }
  };

  const handleTestEmail = async () => {
    if (!emailConfiguration) return;
    
    const result = await testEmailConfiguration(emailConfiguration.remitente);
    if (result.success && result.data) {
      if (result.data.exito) {
        toast.success(result.data.mensaje || 'Email de prueba enviado exitosamente');
      } else {
        toast.error(result.data.mensaje || 'Error al enviar email de prueba');
      }
    } else {
      toast.error(result.error || 'Error al probar configuración de email');
    }
  };

  const handleClearCache = async () => {
    if (confirm('¿Desea limpiar el caché del sistema?')) {
      const result = await clearCache();
      if (result.success && result.data) {
        if (result.data.exito) {
          toast.success(result.data.mensaje || 'Caché limpiado exitosamente');
        } else {
          toast.error(result.data.mensaje || 'Error al limpiar caché');
        }
      } else {
        toast.error(result.error || 'Error al limpiar caché');
      }
    }
  };

  // Columnas para tabla de parámetros
  const parametersColumns = [
    {
      key: 'clave',
      label: 'Clave',
      render: (param: SystemParameters) => (
        <span className="text-sm text-gray-900">{param.clave}</span>
      ),
    },
    {
      key: 'valor',
      label: 'Valor',
      render: (param: SystemParameters) => (
        <span className="text-sm text-gray-600">{param.valor}</span>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (param: SystemParameters) => (
        <Badge variant="default" size="sm">{param.tipo}</Badge>
      ),
    },
    {
      key: 'categoria',
      label: 'Categoría',
      render: (param: SystemParameters) => (
        <Badge variant="gray" size="sm">{param.categoria}</Badge>
      ),
    },
    {
      key: 'descripcion',
      label: 'Descripción',
      render: (param: SystemParameters) => (
        <span className="text-sm text-gray-500">{param.descripcion || 'N/A'}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (param: SystemParameters) => (
        <div className="flex gap-1">
          <button className="p-1.5 text-gray-600 hover:text-[#3A7AFE] hover:bg-gray-100 rounded transition-colors" title="Editar">
            <Edit size={16} />
          </button>
        </div>
      ),
    },
  ];

  // Columnas para tabla de notificaciones
  const notificationsColumns = [
    {
      key: 'evento',
      label: 'Evento',
      render: (notif: NotificationSettings) => (
        <div>
          <p className="text-sm text-gray-900">{notif.evento}</p>
          <p className="text-xs text-gray-500">{notif.tipo}</p>
        </div>
      ),
    },
    {
      key: 'habilitado',
      label: 'Estado',
      render: (notif: NotificationSettings) => (
        <Badge variant={notif.habilitado ? 'success' : 'gray'} size="sm">
          {notif.habilitado ? 'Habilitada' : 'Deshabilitada'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (notif: NotificationSettings) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={notif.habilitado}
            onChange={(e) => handleToggleNotification(notif.idNotificacion, e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3A7AFE]"></div>
        </label>
      ),
    },
  ];

  // Columnas para tabla de logs
  const logsColumns = [
    {
      key: 'fecha',
      label: 'Fecha',
      render: (log: SystemLog) => (
        <span className="text-sm text-gray-900">
          {new Date(log.fecha).toLocaleString('es-CO')}
        </span>
      ),
    },
    {
      key: 'nivel',
      label: 'Nivel',
      render: (log: SystemLog) => (
        <Badge
          variant={
            log.nivel === 'Critical' || log.nivel === 'Error' ? 'danger' :
            log.nivel === 'Warning' ? 'warning' :
            'success'
          }
          size="sm"
        >
          {log.nivel}
        </Badge>
      ),
    },
    {
      key: 'modulo',
      label: 'Módulo',
      render: (log: SystemLog) => (
        <span className="text-sm text-gray-900">{log.modulo}</span>
      ),
    },
    {
      key: 'usuario',
      label: 'Usuario',
      render: (log: SystemLog) => (
        <span className="text-sm text-gray-600">{log.usuario || 'Sistema'}</span>
      ),
    },
    {
      key: 'accion',
      label: 'Acción',
      render: (log: SystemLog) => (
        <span className="text-sm text-gray-900">{log.accion}</span>
      ),
    },
    {
      key: 'descripcion',
      label: 'Descripción',
      render: (log: SystemLog) => (
        <span className="text-sm text-gray-600 truncate max-w-xs">{log.descripcion}</span>
      ),
    },
  ];

  // Loading state
  if (loading && !companySettings && !systemInfo) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#3A7AFE] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3>Configuración del Sistema</h3>
          <p className="text-gray-600 mt-1">
            Administra la configuración general de G2rism
          </p>
        </div>
        {systemInfo && (
          <div className="text-right">
            <p className="text-sm text-gray-600">Versión {systemInfo.version}</p>
            <p className="text-xs text-gray-500">{systemInfo.entorno}</p>
          </div>
        )}
      </div>

      {/* Tabs de navegación */}
      <div className="bg-white border border-gray-200 rounded-lg p-2 grid grid-cols-4 gap-2">
        <button
          onClick={() => setViewMode('company')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'company'
              ? 'bg-[#3A7AFE] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Building2 size={18} className="inline mr-2" />
          Empresa
        </button>
        <button
          onClick={() => setViewMode('dian')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'dian'
              ? 'bg-[#3A7AFE] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <FileText size={18} className="inline mr-2" />
          DIAN
        </button>
        <button
          onClick={() => setViewMode('parameters')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'parameters'
              ? 'bg-[#3A7AFE] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Database size={18} className="inline mr-2" />
          Parámetros
        </button>
        <button
          onClick={() => setViewMode('notifications')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'notifications'
              ? 'bg-[#3A7AFE] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Bell size={18} className="inline mr-2" />
          Notificaciones
        </button>
        <button
          onClick={() => setViewMode('backups')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'backups'
              ? 'bg-[#3A7AFE] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <HardDrive size={18} className="inline mr-2" />
          Respaldos
        </button>
        <button
          onClick={() => setViewMode('logs')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'logs'
              ? 'bg-[#3A7AFE] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <FileText size={18} className="inline mr-2" />
          Logs
        </button>
        <button
          onClick={() => setViewMode('email')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'email'
              ? 'bg-[#3A7AFE] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Mail size={18} className="inline mr-2" />
          Email
        </button>
        <button
          onClick={() => setViewMode('security')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'security'
              ? 'bg-[#3A7AFE] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Shield size={18} className="inline mr-2" />
          Seguridad
        </button>
      </div>

      {/* Vista de Empresa */}
      {viewMode === 'company' && companySettings && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h4>Información de la Empresa</h4>
            <div className="flex gap-2">
              {editMode ? (
                <>
                  <Button variant="secondary" onClick={() => setEditMode(false)}>
                    Cancelar
                  </Button>
                  <Button variant="primary" onClick={handleSaveCompany}>
                    <Save size={18} />
                    Guardar
                  </Button>
                </>
              ) : (
                <Button variant="primary" onClick={() => setEditMode(true)}>
                  <Edit size={18} />
                  Editar
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre de la Empresa"
              value={formData.nombreEmpresa || ''}
              onChange={(e) => setFormData({ ...formData, nombreEmpresa: e.target.value })}
              disabled={!editMode}
            />
            <Input
              label="NIT"
              value={formData.nit || ''}
              onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
              disabled={!editMode}
            />
            <Input
              label="Dirección"
              value={formData.direccion || ''}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              disabled={!editMode}
            />
            <Input
              label="Ciudad"
              value={formData.ciudad || ''}
              onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
              disabled={!editMode}
            />
            <Input
              label="País"
              value={formData.pais || ''}
              onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
              disabled={!editMode}
            />
            <Input
              label="Teléfono"
              value={formData.telefono || ''}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              disabled={!editMode}
            />
            <Input
              label="Email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!editMode}
            />
            <Input
              label="Sitio Web"
              value={formData.sitioWeb || ''}
              onChange={(e) => setFormData({ ...formData, sitioWeb: e.target.value })}
              disabled={!editMode}
            />
            <Input
              label="Representante Legal"
              value={formData.representanteLegal || ''}
              onChange={(e) => setFormData({ ...formData, representanteLegal: e.target.value })}
              disabled={!editMode}
            />
            <Input
              label="Cédula Representante"
              value={formData.cedulaRepresentante || ''}
              onChange={(e) => setFormData({ ...formData, cedulaRepresentante: e.target.value })}
              disabled={!editMode}
            />
          </div>
        </div>
      )}

      {/* Vista de DIAN */}
      {viewMode === 'dian' && dianConfiguration && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h4>Configuración DIAN</h4>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleTestDian}>
                <TestTube size={18} />
                Probar Conexión
              </Button>
              {editMode ? (
                <>
                  <Button variant="secondary" onClick={() => setEditMode(false)}>
                    Cancelar
                  </Button>
                  <Button variant="primary" onClick={handleSaveDian}>
                    <Save size={18} />
                    Guardar
                  </Button>
                </>
              ) : (
                <Button variant="primary" onClick={() => setEditMode(true)}>
                  <Edit size={18} />
                  Editar
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.habilitarFacturacionElectronica || false}
                onChange={(e) => setFormData({ ...formData, habilitarFacturacionElectronica: e.target.checked })}
                disabled={!editMode}
                className="w-4 h-4 rounded border-2 border-gray-300 bg-white text-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-0 cursor-pointer transition-all checked:bg-[#3A7AFE] checked:border-[#3A7AFE] hover:border-[#3A7AFE] accent-[#3A7AFE] disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label className="text-sm text-gray-700">Habilitar Facturación Electrónica</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.modoProduccion || false}
                onChange={(e) => setFormData({ ...formData, modoProduccion: e.target.checked })}
                disabled={!editMode}
                className="w-4 h-4 rounded border-2 border-gray-300 bg-white text-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-0 cursor-pointer transition-all checked:bg-[#3A7AFE] checked:border-[#3A7AFE] hover:border-[#3A7AFE] accent-[#3A7AFE] disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label className="text-sm text-gray-700">Modo Producción</label>
            </div>
            <Input
              label="Prefijo"
              value={formData.prefijo || ''}
              onChange={(e) => setFormData({ ...formData, prefijo: e.target.value })}
              disabled={!editMode}
            />
            <Input
              label="Resolución DIAN"
              value={formData.resolucionDian || ''}
              onChange={(e) => setFormData({ ...formData, resolucionDian: e.target.value })}
              disabled={!editMode}
            />
            <Input
              label="Rango Inicial"
              type="number"
              value={formData.rangoInicial || ''}
              onChange={(e) => setFormData({ ...formData, rangoInicial: parseInt(e.target.value) })}
              disabled={!editMode}
            />
            <Input
              label="Rango Final"
              type="number"
              value={formData.rangoFinal || ''}
              onChange={(e) => setFormData({ ...formData, rangoFinal: parseInt(e.target.value) })}
              disabled={!editMode}
            />
          </div>
        </div>
      )}

      {/* Vista de Parámetros */}
      {viewMode === 'parameters' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="mb-6">Parámetros del Sistema</h4>
          {systemParameters.length > 0 ? (
            <SimpleTable columns={parametersColumns} data={systemParameters} />
          ) : (
            <EmptyState
              icon={<Database size={48} />}
              title="No hay parámetros configurados"
              description="Los parámetros del sistema aparecerán aquí"
            />
          )}
        </div>
      )}

      {/* Vista de Notificaciones */}
      {viewMode === 'notifications' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="mb-6">Configuración de Notificaciones</h4>
          {notifications.length > 0 ? (
            <SimpleTable columns={notificationsColumns} data={notifications} />
          ) : (
            <EmptyState
              icon={<Bell size={48} />}
              title="No hay notificaciones configuradas"
              description="Las notificaciones del sistema aparecerán aquí"
            />
          )}
        </div>
      )}

      {/* Vista de Respaldos */}
      {viewMode === 'backups' && backupConfiguration && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h4>Configuración de Respaldos</h4>
            <Button variant="primary" onClick={handleExecuteBackup}>
              <HardDrive size={18} />
              Ejecutar Respaldo Ahora
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Frecuencia</p>
              <p className="text-lg text-gray-900">{backupConfiguration.frecuencia}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Último Respaldo</p>
              <p className="text-lg text-gray-900">
                {backupConfiguration.ultimaEjecucion 
                  ? new Date(backupConfiguration.ultimaEjecucion).toLocaleString('es-CO')
                  : 'Nunca'}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Retención</p>
              <p className="text-lg text-gray-900">{backupConfiguration.mantencionDias} días</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Estado</p>
              <Badge variant={backupConfiguration.habilitado ? 'success' : 'gray'}>
                {backupConfiguration.habilitado ? 'Habilitado' : 'Deshabilitado'}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Vista de Logs */}
      {viewMode === 'logs' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h4>Logs del Sistema</h4>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleClearCache}>
                <RefreshCw size={18} />
                Limpiar Caché
              </Button>
              <Button variant="secondary">
                <Download size={18} />
                Exportar
              </Button>
            </div>
          </div>
          {systemLogs.length > 0 ? (
            <SimpleTable columns={logsColumns} data={systemLogs} />
          ) : (
            <EmptyState
              icon={<FileText size={48} />}
              title="No hay logs disponibles"
              description="Los logs del sistema aparecerán aquí"
            />
          )}
        </div>
      )}

      {/* Vista de Email */}
      {viewMode === 'email' && emailConfiguration && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h4>Configuración de Email</h4>
            <Button variant="primary" onClick={handleTestEmail}>
              <TestTube size={18} />
              Enviar Email de Prueba
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Servidor</p>
              <p className="text-lg text-gray-900">{emailConfiguration.servidor}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Puerto</p>
              <p className="text-lg text-gray-900">{emailConfiguration.puerto}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Usuario</p>
              <p className="text-lg text-gray-900">{emailConfiguration.usuario}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Remitente</p>
              <p className="text-lg text-gray-900">{emailConfiguration.remitente}</p>
            </div>
          </div>
        </div>
      )}

      {/* Vista de Seguridad */}
      {viewMode === 'security' && securitySettings && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="mb-6">Configuración de Seguridad</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-sm mb-3">Políticas de Contraseña</h5>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {securitySettings.requerirMayusculas ? 
                    <CheckCircle size={16} className="text-green-600" /> :
                    <XCircle size={16} className="text-gray-400" />
                  }
                  <span className="text-sm text-gray-700">Requerir mayúsculas</span>
                </div>
                <div className="flex items-center gap-2">
                  {securitySettings.requerirMinusculas ? 
                    <CheckCircle size={16} className="text-green-600" /> :
                    <XCircle size={16} className="text-gray-400" />
                  }
                  <span className="text-sm text-gray-700">Requerir minúsculas</span>
                </div>
                <div className="flex items-center gap-2">
                  {securitySettings.requerirNumeros ? 
                    <CheckCircle size={16} className="text-green-600" /> :
                    <XCircle size={16} className="text-gray-400" />
                  }
                  <span className="text-sm text-gray-700">Requerir números</span>
                </div>
                <div className="flex items-center gap-2">
                  {securitySettings.requerirCaracteresEspeciales ? 
                    <CheckCircle size={16} className="text-green-600" /> :
                    <XCircle size={16} className="text-gray-400" />
                  }
                  <span className="text-sm text-gray-700">Requerir caracteres especiales</span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-sm mb-3">Configuración de Sesiones</h5>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Longitud mínima de contraseña</p>
                  <p className="text-lg text-gray-900">{securitySettings.longitudMinimaPassword} caracteres</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Expiración de contraseña</p>
                  <p className="text-lg text-gray-900">{securitySettings.diasExpiracionPassword} días</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Intentos máximos fallidos</p>
                  <p className="text-lg text-gray-900">{securitySettings.intentosMaximosFallidos}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Duración máxima de sesión</p>
                  <p className="text-lg text-gray-900">{securitySettings.sesionMaximaMinutos} minutos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}