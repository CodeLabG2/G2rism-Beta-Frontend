import React, { useState } from 'react';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';
import { Badge } from '../../../ui/Badge';
import { Card } from '../../../ui/Card';
import { Switch } from '../../../ui/Switch';
import { toast } from '../../../ui/Toast';
import {
  Settings,
  Building2,
  Database,
  FileText,
  Bell,
  HardDrive,
  Mail,
  Shield,
  Save,
  TestTube,
  Download,
  Edit,
  RefreshCw,
  CheckCircle,
  XCircle,
  Globe,
  CreditCard,
  Users,
  Palette,
  Lock,
  Clock,
  Server,
  Zap,
  DollarSign,
} from 'lucide-react';

type ViewMode = 
  | 'company' 
  | 'dian' 
  | 'system' 
  | 'notifications' 
  | 'backups' 
  | 'email' 
  | 'security' 
  | 'integrations'
  | 'branding'
  | 'billing';

export function AdminSettingsManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('company');
  const [editMode, setEditMode] = useState(false);

  // Mock data - Configuración de empresa
  const [companyData, setCompanyData] = useState({
    nombreEmpresa: 'G2RISM Travel Agency',
    nit: '900.123.456-7',
    direccion: 'Calle 100 #15-20',
    ciudad: 'Bogotá',
    pais: 'Colombia',
    telefono: '+57 (1) 234-5678',
    email: 'info@g2rism.com',
    sitioWeb: 'https://www.g2rism.com',
    representanteLegal: 'Juan Pérez González',
    cedulaRepresentante: '1.234.567-8',
    registroTuristico: 'RNT 12345',
    licenciaOperacion: 'LIC-2025-001',
  });

  // Mock data - Configuración DIAN
  const [dianData, setDianData] = useState({
    habilitado: true,
    modoProduccion: false,
    prefijo: 'FGTS',
    resolucion: '18764000001234',
    rangoInicial: 1,
    rangoFinal: 5000,
    numeroActual: 156,
    fechaExpiracion: '2025-12-31',
    certificado: 'certificado.pfx',
    clave: '••••••••',
  });

  // Mock data - Configuración de sistema
  const [systemData, setSystemData] = useState({
    nombreSistema: 'G2RISM Platform',
    version: '2.0.1',
    entorno: 'Producción',
    idiomaPredeterminado: 'es',
    zonaHoraria: 'America/Bogota',
    monedaPredeterminada: 'COP',
    formatoFecha: 'DD/MM/YYYY',
    formatoHora: '24h',
    mantenimientoProgramado: false,
    modoDebug: false,
  });

  // Mock data - Notificaciones
  const [notifications, setNotifications] = useState([
    { id: 1, nombre: 'Nuevas reservas', descripcion: 'Notificar al crear una reserva', email: true, push: true, sms: false },
    { id: 2, nombre: 'Pagos recibidos', descripcion: 'Notificar cuando se registre un pago', email: true, push: true, sms: true },
    { id: 3, nombre: 'Reservas próximas', descripcion: 'Recordatorio 48h antes del viaje', email: true, push: false, sms: true },
    { id: 4, nombre: 'Documentos vencidos', descripcion: 'Alerta de documentos por vencer', email: true, push: true, sms: false },
    { id: 5, nombre: 'Clientes nuevos', descripcion: 'Notificar registro de nuevo cliente', email: true, push: false, sms: false },
    { id: 6, nombre: 'Cotizaciones pendientes', descripcion: 'Recordatorio de cotizaciones sin respuesta', email: true, push: true, sms: false },
  ]);

  // Mock data - Respaldos
  const [backupData, setBackupData] = useState({
    habilitado: true,
    frecuencia: 'Diaria',
    horaEjecucion: '02:00',
    retencionDias: 30,
    ultimoRespaldo: '2024-12-06 02:00:00',
    proximoRespaldo: '2024-12-07 02:00:00',
    ubicacion: '/backups/g2rism',
    tamaño: '2.3 GB',
    automatico: true,
  });

  // Mock data - Configuración de email
  const [emailData, setEmailData] = useState({
    servidor: 'smtp.gmail.com',
    puerto: 587,
    usuario: 'noreply@g2rism.com',
    ssl: true,
    remitente: 'G2RISM Travel',
    emailRemitente: 'noreply@g2rism.com',
    plantillaReserva: 'template_reserva.html',
    plantillaPago: 'template_pago.html',
  });

  // Mock data - Seguridad
  const [securityData, setSecurityData] = useState({
    longitudMinima: 8,
    requerirMayusculas: true,
    requerirMinusculas: true,
    requerirNumeros: true,
    requerirEspeciales: true,
    expiracionDias: 90,
    intentosMaximos: 5,
    bloqueoMinutos: 30,
    sesionMaximaHoras: 8,
    autenticacion2FA: false,
    ipWhitelist: false,
    registroAuditoria: true,
  });

  // Mock data - Integraciones
  const [integrations, setIntegrations] = useState([
    { id: 1, nombre: 'Google Maps API', descripcion: 'Mapas y geolocalización', activo: true, apiKey: 'AIza••••••••••', ultimaConexion: '2024-12-06' },
    { id: 2, nombre: 'Stripe Payments', descripción: 'Procesamiento de pagos', activo: true, apiKey: 'sk_live••••••', ultimaConexion: '2024-12-06' },
    { id: 3, nombre: 'SendGrid Email', descripcion: 'Envío de emails transaccionales', activo: true, apiKey: 'SG.••••••', ultimaConexion: '2024-12-05' },
    { id: 4, nombre: 'Twilio SMS', descripcion: 'Envío de SMS', activo: false, apiKey: 'AC••••••', ultimaConexion: '2024-11-20' },
    { id: 5, nombre: 'WhatsApp Business', descripcion: 'Mensajería WhatsApp', activo: true, apiKey: 'EAA••••••', ultimaConexion: '2024-12-06' },
  ]);

  // Mock data - Marca/Branding
  const [brandingData, setBrandingData] = useState({
    colorPrimario: '#3A7AFE',
    colorSecundario: '#1A2440',
    colorAcento: '#FF6B6B',
    logoUrl: '',
    faviconUrl: '',
    emailHeaderUrl: '',
    emailFooterText: '© 2024 G2RISM. Todos los derechos reservados.',
    redesSociales: {
      facebook: 'https://facebook.com/g2rism',
      instagram: 'https://instagram.com/g2rism',
      twitter: 'https://twitter.com/g2rism',
      linkedin: 'https://linkedin.com/company/g2rism',
    }
  });

  // Mock data - Facturación
  const [billingData, setBillingData] = useState({
    planActual: 'Enterprise',
    usuariosContratados: 50,
    usuariosActivos: 32,
    almacenamientoGB: 500,
    almacenamientoUsado: 287,
    transaccionesMes: 1500,
    transaccionesUsadas: 873,
    proximaRenovacion: '2025-01-15',
    metodoPago: 'Tarjeta •••• 4532',
    montoMensual: 299000,
  });

  const handleSave = () => {
    toast.success('Configuración guardada exitosamente');
    setEditMode(false);
  };

  const handleTestConnection = (service: string) => {
    toast.success(`Conexión con ${service} exitosa`);
  };

  const handleExecuteBackup = () => {
    if (confirm('¿Desea ejecutar un respaldo manual del sistema?')) {
      toast.success('Respaldo iniciado. Se le notificará cuando finalice.');
    }
  };

  const tabs = [
    { id: 'company', label: 'Empresa', icon: Building2 },
    { id: 'dian', label: 'DIAN', icon: FileText },
    { id: 'system', label: 'Sistema', icon: Database },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'backups', label: 'Respaldos', icon: HardDrive },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'integrations', label: 'Integraciones', icon: Zap },
    { id: 'branding', label: 'Marca', icon: Palette },
    { id: 'billing', label: 'Facturación', icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-900">Configuración del Sistema</h3>
          <p className="text-gray-600 mt-1">
            Administra la configuración general de G2RISM
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="success">
            <CheckCircle size={14} />
            Sistema operativo
          </Badge>
          <span className="text-sm text-gray-600">v{systemData.version}</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border border-gray-200 rounded-lg p-2">
        <div className="grid grid-cols-5 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setViewMode(tab.id as ViewMode);
                  setEditMode(false);
                }}
                className={`px-4 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${
                  viewMode === tab.id
                    ? 'bg-[#3A7AFE] text-white shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={16} />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Company View */}
      {viewMode === 'company' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-gray-900">Información de la Empresa</h4>
            <div className="flex gap-2">
              {editMode ? (
                <>
                  <Button variant="outline" onClick={() => setEditMode(false)}>
                    Cancelar
                  </Button>
                  <Button variant="primary" onClick={handleSave}>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Nombre de la Empresa"
              value={companyData.nombreEmpresa}
              onChange={(e) => setCompanyData({ ...companyData, nombreEmpresa: e.target.value })}
              disabled={!editMode}
            />
            <Input
              label="NIT"
              value={companyData.nit}
              onChange={(e) => setCompanyData({ ...companyData, nit: e.target.value })}
              disabled={!editMode}
            />
            <Input
              label="Registro Turístico (RNT)"
              value={companyData.registroTuristico}
              onChange={(e) => setCompanyData({ ...companyData, registroTuristico: e.target.value })}
              disabled={!editMode}
            />
            <Input
              label="Dirección"
              value={companyData.direccion}
              onChange={(e) => setCompanyData({ ...companyData, direccion: e.target.value })}
              disabled={!editMode}
            />
            <Input
              label="Ciudad"
              value={companyData.ciudad}
              onChange={(e) => setCompanyData({ ...companyData, ciudad: e.target.value })}
              disabled={!editMode}
            />
            <Input
              label="País"
              value={companyData.pais}
              onChange={(e) => setCompanyData({ ...companyData, pais: e.target.value })}
              disabled={!editMode}
            />
            <Input
              label="Teléfono"
              value={companyData.telefono}
              onChange={(e) => setCompanyData({ ...companyData, telefono: e.target.value })}
              disabled={!editMode}
            />
            <Input
              label="Email"
              type="email"
              value={companyData.email}
              onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
              disabled={!editMode}
            />
            <Input
              label="Sitio Web"
              value={companyData.sitioWeb}
              onChange={(e) => setCompanyData({ ...companyData, sitioWeb: e.target.value })}
              disabled={!editMode}
            />
            <Input
              label="Representante Legal"
              value={companyData.representanteLegal}
              onChange={(e) => setCompanyData({ ...companyData, representanteLegal: e.target.value })}
              disabled={!editMode}
            />
            <Input
              label="Cédula Representante"
              value={companyData.cedulaRepresentante}
              onChange={(e) => setCompanyData({ ...companyData, cedulaRepresentante: e.target.value })}
              disabled={!editMode}
            />
            <Input
              label="Licencia de Operación"
              value={companyData.licenciaOperacion}
              onChange={(e) => setCompanyData({ ...companyData, licenciaOperacion: e.target.value })}
              disabled={!editMode}
            />
          </div>
        </Card>
      )}

      {/* DIAN View */}
      {viewMode === 'dian' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-gray-900">Configuración DIAN</h4>
              <p className="text-sm text-gray-600 mt-1">Facturación electrónica DIAN Colombia</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleTestConnection('DIAN')}>
                <TestTube size={18} />
                Probar Conexión
              </Button>
              {editMode ? (
                <>
                  <Button variant="outline" onClick={() => setEditMode(false)}>
                    Cancelar
                  </Button>
                  <Button variant="primary" onClick={handleSave}>
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

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Estado</span>
                <Badge variant="success">Activo</Badge>
              </div>
              <p className="text-2xl text-gray-900 mt-2">{dianData.habilitado ? 'Conectado' : 'Desconectado'}</p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-sm text-gray-600">Facturas Disponibles</span>
              <p className="text-2xl text-gray-900 mt-2">{dianData.rangoFinal - dianData.numeroActual}</p>
              <p className="text-xs text-gray-500 mt-1">de {dianData.rangoFinal} autorizadas</p>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <span className="text-sm text-gray-600">Facturas Emitidas</span>
              <p className="text-2xl text-gray-900 mt-2">{dianData.numeroActual}</p>
              <p className="text-xs text-gray-500 mt-1">en este periodo</p>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <span className="text-sm text-gray-600">Vence</span>
              <p className="text-2xl text-gray-900 mt-2">39 días</p>
              <p className="text-xs text-gray-500 mt-1">{dianData.fechaExpiracion}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Switch
                checked={dianData.habilitado}
                onChange={(checked) => setDianData({ ...dianData, habilitado: checked })}
                disabled={!editMode}
              />
              <div>
                <p className="text-sm text-gray-900">Facturación Electrónica</p>
                <p className="text-xs text-gray-500">Habilitar/deshabilitar DIAN</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Switch
                checked={dianData.modoProduccion}
                onChange={(checked) => setDianData({ ...dianData, modoProduccion: checked })}
                disabled={!editMode}
              />
              <div>
                <p className="text-sm text-gray-900">Modo Producción</p>
                <p className="text-xs text-gray-500">Pruebas / Producción</p>
              </div>
            </div>
            <div></div>
            <Input
              label="Prefijo"
              value={dianData.prefijo}
              onChange={(e) => setDianData({ ...dianData, prefijo: e.target.value })}
              disabled={!editMode}
            />
            <Input
              label="Resolución DIAN"
              value={dianData.resolucion}
              onChange={(e) => setDianData({ ...dianData, resolucion: e.target.value })}
              disabled={!editMode}
            />
            <Input
              label="Fecha de Expiración"
              type="date"
              value={dianData.fechaExpiracion}
              onChange={(e) => setDianData({ ...dianData, fechaExpiracion: e.target.value })}
              disabled={!editMode}
            />
            <Input
              label="Rango Inicial"
              type="number"
              value={dianData.rangoInicial.toString()}
              disabled={!editMode}
            />
            <Input
              label="Rango Final"
              type="number"
              value={dianData.rangoFinal.toString()}
              disabled={!editMode}
            />
            <Input
              label="Número Actual"
              type="number"
              value={dianData.numeroActual.toString()}
              disabled
            />
          </div>
        </Card>
      )}

      {/* System View */}
      {viewMode === 'system' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-gray-900">Configuración del Sistema</h4>
            <div className="flex gap-2">
              {editMode ? (
                <>
                  <Button variant="outline" onClick={() => setEditMode(false)}>
                    Cancelar
                  </Button>
                  <Button variant="primary" onClick={handleSave}>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Nombre del Sistema"
              value={systemData.nombreSistema}
              onChange={(e) => setSystemData({ ...systemData, nombreSistema: e.target.value })}
              disabled={!editMode}
            />
            <Input
              label="Versión"
              value={systemData.version}
              disabled
            />
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Badge variant={systemData.entorno === 'Producción' ? 'success' : 'warning'}>
                {systemData.entorno}
              </Badge>
              <span className="text-sm text-gray-600">Entorno actual</span>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Idioma Predeterminado</label>
              <select
                value={systemData.idiomaPredeterminado}
                onChange={(e) => setSystemData({ ...systemData, idiomaPredeterminado: e.target.value })}
                disabled={!editMode}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Zona Horaria</label>
              <select
                value={systemData.zonaHoraria}
                onChange={(e) => setSystemData({ ...systemData, zonaHoraria: e.target.value })}
                disabled={!editMode}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="America/Bogota">Bogotá (GMT-5)</option>
                <option value="America/New_York">New York (GMT-5)</option>
                <option value="Europe/Madrid">Madrid (GMT+1)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Moneda Predeterminada</label>
              <select
                value={systemData.monedaPredeterminada}
                onChange={(e) => setSystemData({ ...systemData, monedaPredeterminada: e.target.value })}
                disabled={!editMode}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="COP">COP - Peso Colombiano</option>
                <option value="USD">USD - Dólar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Formato de Fecha</label>
              <select
                value={systemData.formatoFecha}
                onChange={(e) => setSystemData({ ...systemData, formatoFecha: e.target.value })}
                disabled={!editMode}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Formato de Hora</label>
              <select
                value={systemData.formatoHora}
                onChange={(e) => setSystemData({ ...systemData, formatoHora: e.target.value })}
                disabled={!editMode}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="24h">24 horas</option>
                <option value="12h">12 horas (AM/PM)</option>
              </select>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Switch
                checked={systemData.mantenimientoProgramado}
                onChange={(checked) => setSystemData({ ...systemData, mantenimientoProgramado: checked })}
                disabled={!editMode}
              />
              <div>
                <p className="text-sm text-gray-900">Mantenimiento Programado</p>
                <p className="text-xs text-gray-500">Activar modo mantenimiento</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Notifications View */}
      {viewMode === 'notifications' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-gray-900">Configuración de Notificaciones</h4>
              <p className="text-sm text-gray-600 mt-1">Gestiona cómo y cuándo enviar notificaciones</p>
            </div>
          </div>

          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h5 className="text-sm text-gray-900">{notif.nombre}</h5>
                    <p className="text-xs text-gray-600 mt-0.5">{notif.descripcion}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-500" />
                      <Switch checked={notif.email} onChange={() => {}} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Bell size={16} className="text-gray-500" />
                      <Switch checked={notif.push} onChange={() => {}} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">SMS</span>
                      <Switch checked={notif.sms} onChange={() => {}} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Backups View */}
      {viewMode === 'backups' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-gray-900">Configuración de Respaldos</h4>
            <Button variant="primary" onClick={handleExecuteBackup}>
              <HardDrive size={18} />
              Ejecutar Respaldo Ahora
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Clock size={20} className="text-blue-600 mb-2" />
              <span className="text-sm text-gray-600">Frecuencia</span>
              <p className="text-xl text-gray-900 mt-1">{backupData.frecuencia}</p>
              <p className="text-xs text-gray-500">a las {backupData.horaEjecucion}</p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle size={20} className="text-green-600 mb-2" />
              <span className="text-sm text-gray-600">Último Respaldo</span>
              <p className="text-xl text-gray-900 mt-1">Hace 4h</p>
              <p className="text-xs text-gray-500">{backupData.ultimoRespaldo}</p>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <HardDrive size={20} className="text-purple-600 mb-2" />
              <span className="text-sm text-gray-600">Tamaño</span>
              <p className="text-xl text-gray-900 mt-1">{backupData.tamaño}</p>
              <p className="text-xs text-gray-500">último backup</p>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <RefreshCw size={20} className="text-orange-600 mb-2" />
              <span className="text-sm text-gray-600">Próximo</span>
              <p className="text-xl text-gray-900 mt-1">En 22h</p>
              <p className="text-xs text-gray-500">{backupData.proximoRespaldo}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Switch
                checked={backupData.habilitado}
                onChange={(checked) => setBackupData({ ...backupData, habilitado: checked })}
              />
              <div>
                <p className="text-sm text-gray-900">Respaldos Automáticos</p>
                <p className="text-xs text-gray-500">Ejecutar respaldos programados automáticamente</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Frecuencia</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option>Diaria</option>
                  <option>Semanal</option>
                  <option>Mensual</option>
                </select>
              </div>
              <Input
                label="Hora de Ejecución"
                type="time"
                value={backupData.horaEjecucion}
              />
              <Input
                label="Retención (días)"
                type="number"
                value={backupData.retencionDias.toString()}
              />
            </div>

            <Input
              label="Ubicación de Respaldos"
              value={backupData.ubicacion}
              disabled
            />
          </div>
        </Card>
      )}

      {/* Email View */}
      {viewMode === 'email' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-gray-900">Configuración de Email</h4>
              <p className="text-sm text-gray-600 mt-1">Servidor SMTP y plantillas de correo</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleTestConnection('Email')}>
                <TestTube size={18} />
                Enviar Prueba
              </Button>
              {editMode ? (
                <>
                  <Button variant="outline" onClick={() => setEditMode(false)}>
                    Cancelar
                  </Button>
                  <Button variant="primary" onClick={handleSave}>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Servidor SMTP"
              value={emailData.servidor}
              onChange={(e) => setEmailData({ ...emailData, servidor: e.target.value })}
              disabled={!editMode}
            />
            <Input
              label="Puerto"
              type="number"
              value={emailData.puerto.toString()}
              onChange={(e) => setEmailData({ ...emailData, puerto: parseInt(e.target.value) })}
              disabled={!editMode}
            />
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Switch
                checked={emailData.ssl}
                onChange={(checked) => setEmailData({ ...emailData, ssl: checked })}
                disabled={!editMode}
              />
              <div>
                <p className="text-sm text-gray-900">SSL/TLS</p>
                <p className="text-xs text-gray-500">Conexión segura</p>
              </div>
            </div>
            <Input
              label="Usuario SMTP"
              value={emailData.usuario}
              onChange={(e) => setEmailData({ ...emailData, usuario: e.target.value })}
              disabled={!editMode}
            />
            <Input
              label="Nombre del Remitente"
              value={emailData.remitente}
              onChange={(e) => setEmailData({ ...emailData, remitente: e.target.value })}
              disabled={!editMode}
            />
            <Input
              label="Email del Remitente"
              type="email"
              value={emailData.emailRemitente}
              onChange={(e) => setEmailData({ ...emailData, emailRemitente: e.target.value })}
              disabled={!editMode}
            />
          </div>

          <div className="mt-6">
            <h5 className="text-sm text-gray-900 mb-3">Plantillas de Email</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-900">Confirmación de Reserva</span>
                  <Badge variant="success">Activa</Badge>
                </div>
                <p className="text-xs text-gray-600 mb-3">Se envía al confirmar una reserva</p>
                <Button variant="outline" size="sm">
                  <Edit size={14} />
                  Editar Plantilla
                </Button>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-900">Confirmación de Pago</span>
                  <Badge variant="success">Activa</Badge>
                </div>
                <p className="text-xs text-gray-600 mb-3">Se envía al registrar un pago</p>
                <Button variant="outline" size="sm">
                  <Edit size={14} />
                  Editar Plantilla
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Security View */}
      {viewMode === 'security' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-gray-900">Configuración de Seguridad</h4>
              <p className="text-sm text-gray-600 mt-1">Políticas de contraseñas y sesiones</p>
            </div>
            <div className="flex gap-2">
              {editMode ? (
                <>
                  <Button variant="outline" onClick={() => setEditMode(false)}>
                    Cancelar
                  </Button>
                  <Button variant="primary" onClick={handleSave}>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password Policies */}
            <div>
              <h5 className="text-sm text-gray-900 mb-4">Políticas de Contraseña</h5>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Input
                    label="Longitud Mínima"
                    type="number"
                    value={securityData.longitudMinima.toString()}
                    onChange={(e) => setSecurityData({ ...securityData, longitudMinima: parseInt(e.target.value) })}
                    disabled={!editMode}
                  />
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 flex-1">
                    {securityData.requerirMayusculas ? (
                      <CheckCircle size={16} className="text-green-600" />
                    ) : (
                      <XCircle size={16} className="text-gray-400" />
                    )}
                    <span className="text-sm text-gray-700">Requerir mayúsculas</span>
                  </div>
                  <Switch
                    checked={securityData.requerirMayusculas}
                    onChange={(checked) => setSecurityData({ ...securityData, requerirMayusculas: checked })}
                    disabled={!editMode}
                  />
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 flex-1">
                    {securityData.requerirMinusculas ? (
                      <CheckCircle size={16} className="text-green-600" />
                    ) : (
                      <XCircle size={16} className="text-gray-400" />
                    )}
                    <span className="text-sm text-gray-700">Requerir minúsculas</span>
                  </div>
                  <Switch
                    checked={securityData.requerirMinusculas}
                    onChange={(checked) => setSecurityData({ ...securityData, requerirMinusculas: checked })}
                    disabled={!editMode}
                  />
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 flex-1">
                    {securityData.requerirNumeros ? (
                      <CheckCircle size={16} className="text-green-600" />
                    ) : (
                      <XCircle size={16} className="text-gray-400" />
                    )}
                    <span className="text-sm text-gray-700">Requerir números</span>
                  </div>
                  <Switch
                    checked={securityData.requerirNumeros}
                    onChange={(checked) => setSecurityData({ ...securityData, requerirNumeros: checked })}
                    disabled={!editMode}
                  />
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 flex-1">
                    {securityData.requerirEspeciales ? (
                      <CheckCircle size={16} className="text-green-600" />
                    ) : (
                      <XCircle size={16} className="text-gray-400" />
                    )}
                    <span className="text-sm text-gray-700">Requerir caracteres especiales</span>
                  </div>
                  <Switch
                    checked={securityData.requerirEspeciales}
                    onChange={(checked) => setSecurityData({ ...securityData, requerirEspeciales: checked })}
                    disabled={!editMode}
                  />
                </div>
              </div>
            </div>

            {/* Session Policies */}
            <div>
              <h5 className="text-sm text-gray-900 mb-4">Políticas de Sesión</h5>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Input
                    label="Expiración de Contraseña (días)"
                    type="number"
                    value={securityData.expiracionDias.toString()}
                    onChange={(e) => setSecurityData({ ...securityData, expiracionDias: parseInt(e.target.value) })}
                    disabled={!editMode}
                  />
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Input
                    label="Intentos Máximos Fallidos"
                    type="number"
                    value={securityData.intentosMaximos.toString()}
                    onChange={(e) => setSecurityData({ ...securityData, intentosMaximos: parseInt(e.target.value) })}
                    disabled={!editMode}
                  />
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Input
                    label="Bloqueo Temporal (minutos)"
                    type="number"
                    value={securityData.bloqueoMinutos.toString()}
                    onChange={(e) => setSecurityData({ ...securityData, bloqueoMinutos: parseInt(e.target.value) })}
                    disabled={!editMode}
                  />
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Input
                    label="Sesión Máxima (horas)"
                    type="number"
                    value={securityData.sesionMaximaHoras.toString()}
                    onChange={(e) => setSecurityData({ ...securityData, sesionMaximaHoras: parseInt(e.target.value) })}
                    disabled={!editMode}
                  />
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 flex-1">
                    <Lock size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-700">Autenticación de Dos Factores (2FA)</span>
                  </div>
                  <Switch
                    checked={securityData.autenticacion2FA}
                    onChange={(checked) => setSecurityData({ ...securityData, autenticacion2FA: checked })}
                    disabled={!editMode}
                  />
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 flex-1">
                    <Server size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-700">Registro de Auditoría</span>
                  </div>
                  <Switch
                    checked={securityData.registroAuditoria}
                    onChange={(checked) => setSecurityData({ ...securityData, registroAuditoria: checked })}
                    disabled={!editMode}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Integrations View */}
      {viewMode === 'integrations' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-gray-900">Integraciones de Terceros</h4>
              <p className="text-sm text-gray-600 mt-1">APIs y servicios externos conectados</p>
            </div>
          </div>

          <div className="space-y-3">
            {integrations.map((integration) => (
              <div
                key={integration.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      integration.activo ? 'bg-green-100' : 'bg-gray-200'
                    }`}>
                      <Zap size={20} className={integration.activo ? 'text-green-600' : 'text-gray-400'} />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm text-gray-900">{integration.nombre}</h5>
                      <p className="text-xs text-gray-600">{integration.descripcion}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        API Key: <code className="bg-white px-1 py-0.5 rounded">{integration.apiKey}</code>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Última conexión</p>
                      <p className="text-xs text-gray-900">{integration.ultimaConexion}</p>
                    </div>
                    <Badge variant={integration.activo ? 'success' : 'gray'}>
                      {integration.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                    <Switch checked={integration.activo} onChange={() => {}} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Button variant="outline" className="w-full">
              <Zap size={18} />
              Agregar Nueva Integración
            </Button>
          </div>
        </Card>
      )}

      {/* Branding View */}
      {viewMode === 'branding' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-gray-900">Configuración de Marca</h4>
              <p className="text-sm text-gray-600 mt-1">Personaliza la identidad visual de G2RISM</p>
            </div>
            <div className="flex gap-2">
              {editMode ? (
                <>
                  <Button variant="outline" onClick={() => setEditMode(false)}>
                    Cancelar
                  </Button>
                  <Button variant="primary" onClick={handleSave}>
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

          <div className="space-y-6">
            {/* Colors */}
            <div>
              <h5 className="text-sm text-gray-900 mb-3">Colores de Marca</h5>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Color Primario</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brandingData.colorPrimario}
                      onChange={(e) => setBrandingData({ ...brandingData, colorPrimario: e.target.value })}
                      disabled={!editMode}
                      className="w-12 h-12 rounded border border-gray-200 cursor-pointer"
                    />
                    <Input
                      value={brandingData.colorPrimario}
                      onChange={(e) => setBrandingData({ ...brandingData, colorPrimario: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Color Secundario</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brandingData.colorSecundario}
                      onChange={(e) => setBrandingData({ ...brandingData, colorSecundario: e.target.value })}
                      disabled={!editMode}
                      className="w-12 h-12 rounded border border-gray-200 cursor-pointer"
                    />
                    <Input
                      value={brandingData.colorSecundario}
                      onChange={(e) => setBrandingData({ ...brandingData, colorSecundario: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Color de Acento</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brandingData.colorAcento}
                      onChange={(e) => setBrandingData({ ...brandingData, colorAcento: e.target.value })}
                      disabled={!editMode}
                      className="w-12 h-12 rounded border border-gray-200 cursor-pointer"
                    />
                    <Input
                      value={brandingData.colorAcento}
                      onChange={(e) => setBrandingData({ ...brandingData, colorAcento: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Logos */}
            <div>
              <h5 className="text-sm text-gray-900 mb-3">Logotipos</h5>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <Palette size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Logo Principal</p>
                  <Button variant="outline" size="sm" disabled={!editMode}>
                    <Download size={14} />
                    Cargar
                  </Button>
                </div>
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <Palette size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Favicon</p>
                  <Button variant="outline" size="sm" disabled={!editMode}>
                    <Download size={14} />
                    Cargar
                  </Button>
                </div>
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <Palette size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Logo Email</p>
                  <Button variant="outline" size="sm" disabled={!editMode}>
                    <Download size={14} />
                    Cargar
                  </Button>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h5 className="text-sm text-gray-900 mb-3">Redes Sociales</h5>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Facebook"
                  value={brandingData.redesSociales.facebook}
                  disabled={!editMode}
                />
                <Input
                  label="Instagram"
                  value={brandingData.redesSociales.instagram}
                  disabled={!editMode}
                />
                <Input
                  label="Twitter"
                  value={brandingData.redesSociales.twitter}
                  disabled={!editMode}
                />
                <Input
                  label="LinkedIn"
                  value={brandingData.redesSociales.linkedin}
                  disabled={!editMode}
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Billing View */}
      {viewMode === 'billing' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-gray-900">Información de Facturación</h4>
              <p className="text-sm text-gray-600 mt-1">Plan actual y uso de recursos</p>
            </div>
            <Button variant="primary">
              <CreditCard size={18} />
              Actualizar Plan
            </Button>
          </div>

          {/* Plan Info */}
          <div className="p-6 bg-gradient-to-r from-[#3A7AFE] to-[#1A2440] rounded-lg text-white mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Plan Actual</p>
                <h3 className="text-white mt-1">{billingData.planActual}</h3>
                <p className="text-sm opacity-75 mt-2">Renovación: {billingData.proximaRenovacion}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Monto Mensual</p>
                <h3 className="text-white mt-1">${billingData.montoMensual.toLocaleString()}</h3>
                <p className="text-sm opacity-75 mt-2">{billingData.metodoPago}</p>
              </div>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Usuarios</span>
                <Users size={18} className="text-gray-400" />
              </div>
              <div className="flex items-end gap-2">
                <h4 className="text-gray-900">{billingData.usuariosActivos}</h4>
                <span className="text-sm text-gray-500">/ {billingData.usuariosContratados}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  className="bg-[#3A7AFE] h-2 rounded-full"
                  style={{ width: `${(billingData.usuariosActivos / billingData.usuariosContratados) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {Math.round((billingData.usuariosActivos / billingData.usuariosContratados) * 100)}% usado
              </p>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Almacenamiento</span>
                <HardDrive size={18} className="text-gray-400" />
              </div>
              <div className="flex items-end gap-2">
                <h4 className="text-gray-900">{billingData.almacenamientoUsado} GB</h4>
                <span className="text-sm text-gray-500">/ {billingData.almacenamientoGB} GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(billingData.almacenamientoUsado / billingData.almacenamientoGB) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {Math.round((billingData.almacenamientoUsado / billingData.almacenamientoGB) * 100)}% usado
              </p>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Transacciones</span>
                <DollarSign size={18} className="text-gray-400" />
              </div>
              <div className="flex items-end gap-2">
                <h4 className="text-gray-900">{billingData.transaccionesUsadas}</h4>
                <span className="text-sm text-gray-500">/ {billingData.transaccionesMes}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${(billingData.transaccionesUsadas / billingData.transaccionesMes) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {Math.round((billingData.transaccionesUsadas / billingData.transaccionesMes) * 100)}% usado
              </p>
            </div>
          </div>

          {/* Billing History */}
          <div>
            <h5 className="text-sm text-gray-900 mb-3">Historial de Facturación</h5>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs text-gray-600">Fecha</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600">Descripción</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600">Monto</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600">Estado</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-200">
                    <td className="px-4 py-3 text-sm text-gray-900">01/12/2024</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Plan Enterprise - Dic 2024</td>
                    <td className="px-4 py-3 text-sm text-gray-900">$299,000</td>
                    <td className="px-4 py-3">
                      <Badge variant="success">Pagado</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm">
                        <Download size={14} />
                        Descargar
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="px-4 py-3 text-sm text-gray-900">01/11/2024</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Plan Enterprise - Nov 2024</td>
                    <td className="px-4 py-3 text-sm text-gray-900">$299,000</td>
                    <td className="px-4 py-3">
                      <Badge variant="success">Pagado</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm">
                        <Download size={14} />
                        Descargar
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="px-4 py-3 text-sm text-gray-900">01/10/2024</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Plan Enterprise - Oct 2024</td>
                    <td className="px-4 py-3 text-sm text-gray-900">$299,000</td>
                    <td className="px-4 py-3">
                      <Badge variant="success">Pagado</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm">
                        <Download size={14} />
                        Descargar
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
