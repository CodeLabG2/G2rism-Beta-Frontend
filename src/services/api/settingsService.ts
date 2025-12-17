import axiosInstance from './axiosConfig';

// ==================== TIPOS ====================

export interface CompanySettings {
  idConfiguracion: number;
  nombreEmpresa: string;
  nit: string;
  direccion: string;
  ciudad: string;
  pais: string;
  telefono: string;
  email: string;
  sitioWeb?: string;
  logo?: string;
  representanteLegal: string;
  cedulaRepresentante: string;
  descripcion?: string;
}

export interface SystemParameters {
  idParametro: number;
  clave: string;
  valor: string;
  tipo: 'String' | 'Number' | 'Boolean' | 'JSON';
  descripcion?: string;
  categoria: 'General' | 'Seguridad' | 'Facturacion' | 'Reservas' | 'Email';
}

export interface DianConfiguration {
  idConfiguracionDian: number;
  habilitarFacturacionElectronica: boolean;
  prefijo: string;
  resolucionDian: string;
  fechaResolucion: string;
  rangoInicial: number;
  rangoFinal: number;
  claveNumeracion?: string;
  urlWebService?: string;
  certificadoDigital?: string;
  passwordCertificado?: string;
  modoProduccion: boolean;
}

export interface NotificationSettings {
  idNotificacion: number;
  tipo: 'Email' | 'SMS' | 'Push' | 'Sistema';
  evento: string;
  habilitado: boolean;
  destinatarios?: string[];
  plantilla?: string;
}

export interface BackupConfiguration {
  idRespaldo: number;
  frecuencia: 'Diaria' | 'Semanal' | 'Mensual' | 'Manual';
  horaEjecucion: string;
  rutaDestino: string;
  mantencionDias: number;
  incluirArchivos: boolean;
  habilitado: boolean;
  ultimaEjecucion?: string;
}

export interface SystemLog {
  idLog: number;
  fecha: string;
  nivel: 'Info' | 'Warning' | 'Error' | 'Critical';
  modulo: string;
  usuario?: string;
  accion: string;
  descripcion: string;
  ipAddress?: string;
  detalles?: any;
}

export interface EmailConfiguration {
  idConfiguracionEmail: number;
  servidor: string;
  puerto: number;
  usuario: string;
  password?: string;
  usarSSL: boolean;
  remitente: string;
  nombreRemitente: string;
}

export interface SecuritySettings {
  idConfiguracionSeguridad: number;
  longitudMinimaPassword: number;
  requerirMayusculas: boolean;
  requerirMinusculas: boolean;
  requerirNumeros: boolean;
  requerirCaracteresEspeciales: boolean;
  diasExpiracionPassword: number;
  intentosMaximosFallidos: number;
  tiempoBloqueoMinutos: number;
  sesionMaximaMinutos: number;
  autenticacionDosFactor: boolean;
}

export interface CompanySettingsFormData {
  nombreEmpresa: string;
  nit: string;
  direccion: string;
  ciudad: string;
  pais: string;
  telefono: string;
  email: string;
  sitioWeb?: string;
  logo?: string;
  representanteLegal: string;
  cedulaRepresentante: string;
  descripcion?: string;
}

export interface SystemParameterFormData {
  clave: string;
  valor: string;
  tipo: 'String' | 'Number' | 'Boolean' | 'JSON';
  descripcion?: string;
  categoria: 'General' | 'Seguridad' | 'Facturacion' | 'Reservas' | 'Email';
}

export interface DianConfigurationFormData {
  habilitarFacturacionElectronica: boolean;
  prefijo: string;
  resolucionDian: string;
  fechaResolucion: string;
  rangoInicial: number;
  rangoFinal: number;
  claveNumeracion?: string;
  urlWebService?: string;
  certificadoDigital?: string;
  passwordCertificado?: string;
  modoProduccion: boolean;
}

/**
 * Servicio para gestión de configuración del sistema
 * 
 * @description
 * Maneja todas las operaciones de configuración, parámetros,
 * seguridad, respaldos y logs del sistema.
 * 
 * @author G2rism Team
 * @version 1.0
 */
class SettingsService {
  private readonly baseUrl = '/configuracion';

  // ==================== EMPRESA ====================

  /**
   * Obtener configuración de la empresa
   */
  async getCompanySettings(): Promise<CompanySettings> {
    const response = await axiosInstance.get(`${this.baseUrl}/empresa`);
    return response.data.data;
  }

  /**
   * Actualizar configuración de la empresa
   */
  async updateCompanySettings(data: CompanySettingsFormData): Promise<CompanySettings> {
    const response = await axiosInstance.put(`${this.baseUrl}/empresa`, data);
    return response.data.data;
  }

  /**
   * Subir logo de la empresa
   */
  async uploadLogo(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('logo', file);
    const response = await axiosInstance.post(`${this.baseUrl}/empresa/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  }

  // ==================== PARÁMETROS DEL SISTEMA ====================

  /**
   * Obtener todos los parámetros
   */
  async getAllParameters(): Promise<SystemParameters[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/parametros`);
    return response.data.data;
  }

  /**
   * Obtener parámetro por clave
   */
  async getParameterByKey(clave: string): Promise<SystemParameters> {
    const response = await axiosInstance.get(`${this.baseUrl}/parametros/${clave}`);
    return response.data.data;
  }

  /**
   * Actualizar parámetro
   */
  async updateParameter(id: number, data: Partial<SystemParameterFormData>): Promise<SystemParameters> {
    const response = await axiosInstance.put(`${this.baseUrl}/parametros/${id}`, data);
    return response.data.data;
  }

  /**
   * Crear parámetro
   */
  async createParameter(data: SystemParameterFormData): Promise<SystemParameters> {
    const response = await axiosInstance.post(`${this.baseUrl}/parametros`, data);
    return response.data.data;
  }

  /**
   * Eliminar parámetro
   */
  async deleteParameter(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/parametros/${id}`);
  }

  /**
   * Obtener parámetros por categoría
   */
  async getParametersByCategory(categoria: string): Promise<SystemParameters[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/parametros/categoria/${categoria}`);
    return response.data.data;
  }

  // ==================== CONFIGURACIÓN DIAN ====================

  /**
   * Obtener configuración DIAN
   */
  async getDianConfiguration(): Promise<DianConfiguration> {
    const response = await axiosInstance.get(`${this.baseUrl}/dian`);
    return response.data.data;
  }

  /**
   * Actualizar configuración DIAN
   */
  async updateDianConfiguration(data: DianConfigurationFormData): Promise<DianConfiguration> {
    const response = await axiosInstance.put(`${this.baseUrl}/dian`, data);
    return response.data.data;
  }

  /**
   * Probar conexión DIAN
   */
  async testDianConnection(): Promise<{ exito: boolean; mensaje: string }> {
    const response = await axiosInstance.post(`${this.baseUrl}/dian/test`);
    return response.data.data;
  }

  /**
   * Obtener consecutivo actual
   */
  async getCurrentConsecutive(): Promise<{ consecutivoActual: number; disponibles: number }> {
    const response = await axiosInstance.get(`${this.baseUrl}/dian/consecutivo`);
    return response.data.data;
  }

  // ==================== NOTIFICACIONES ====================

  /**
   * Obtener todas las notificaciones
   */
  async getAllNotifications(): Promise<NotificationSettings[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/notificaciones`);
    return response.data.data;
  }

  /**
   * Actualizar notificación
   */
  async updateNotification(id: number, data: Partial<NotificationSettings>): Promise<NotificationSettings> {
    const response = await axiosInstance.put(`${this.baseUrl}/notificaciones/${id}`, data);
    return response.data.data;
  }

  /**
   * Habilitar/Deshabilitar notificación
   */
  async toggleNotification(id: number, habilitado: boolean): Promise<NotificationSettings> {
    const response = await axiosInstance.patch(`${this.baseUrl}/notificaciones/${id}/toggle`, { habilitado });
    return response.data.data;
  }

  // ==================== RESPALDOS ====================

  /**
   * Obtener configuración de respaldos
   */
  async getBackupConfiguration(): Promise<BackupConfiguration> {
    const response = await axiosInstance.get(`${this.baseUrl}/respaldos`);
    return response.data.data;
  }

  /**
   * Actualizar configuración de respaldos
   */
  async updateBackupConfiguration(data: Partial<BackupConfiguration>): Promise<BackupConfiguration> {
    const response = await axiosInstance.put(`${this.baseUrl}/respaldos`, data);
    return response.data.data;
  }

  /**
   * Ejecutar respaldo manual
   */
  async executeBackup(): Promise<{ exito: boolean; mensaje: string; archivoGenerado?: string }> {
    const response = await axiosInstance.post(`${this.baseUrl}/respaldos/ejecutar`);
    return response.data.data;
  }

  /**
   * Obtener historial de respaldos
   */
  async getBackupHistory(): Promise<Array<{
    fecha: string;
    archivo: string;
    tamano: number;
    exito: boolean;
  }>> {
    const response = await axiosInstance.get(`${this.baseUrl}/respaldos/historial`);
    return response.data.data;
  }

  /**
   * Descargar respaldo
   */
  async downloadBackup(archivo: string): Promise<Blob> {
    const response = await axiosInstance.get(`${this.baseUrl}/respaldos/descargar/${archivo}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  // ==================== LOGS ====================

  /**
   * Obtener logs del sistema
   */
  async getSystemLogs(params?: {
    nivel?: string;
    modulo?: string;
    fechaInicio?: string;
    fechaFin?: string;
    limite?: number;
  }): Promise<SystemLog[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/logs`, { params });
    return response.data.data;
  }

  /**
   * Obtener log por ID
   */
  async getLogById(id: number): Promise<SystemLog> {
    const response = await axiosInstance.get(`${this.baseUrl}/logs/${id}`);
    return response.data.data;
  }

  /**
   * Limpiar logs antiguos
   */
  async clearOldLogs(dias: number): Promise<{ eliminados: number }> {
    const response = await axiosInstance.delete(`${this.baseUrl}/logs/limpiar?dias=${dias}`);
    return response.data.data;
  }

  /**
   * Exportar logs
   */
  async exportLogs(params: {
    fechaInicio: string;
    fechaFin: string;
    formato: 'CSV' | 'JSON';
  }): Promise<Blob> {
    const response = await axiosInstance.post(`${this.baseUrl}/logs/exportar`, params, {
      responseType: 'blob',
    });
    return response.data;
  }

  // ==================== EMAIL ====================

  /**
   * Obtener configuración de email
   */
  async getEmailConfiguration(): Promise<EmailConfiguration> {
    const response = await axiosInstance.get(`${this.baseUrl}/email`);
    return response.data.data;
  }

  /**
   * Actualizar configuración de email
   */
  async updateEmailConfiguration(data: Partial<EmailConfiguration>): Promise<EmailConfiguration> {
    const response = await axiosInstance.put(`${this.baseUrl}/email`, data);
    return response.data.data;
  }

  /**
   * Probar configuración de email
   */
  async testEmailConfiguration(emailDestino: string): Promise<{ exito: boolean; mensaje: string }> {
    const response = await axiosInstance.post(`${this.baseUrl}/email/test`, { emailDestino });
    return response.data.data;
  }

  // ==================== SEGURIDAD ====================

  /**
   * Obtener configuración de seguridad
   */
  async getSecuritySettings(): Promise<SecuritySettings> {
    const response = await axiosInstance.get(`${this.baseUrl}/seguridad`);
    return response.data.data;
  }

  /**
   * Actualizar configuración de seguridad
   */
  async updateSecuritySettings(data: Partial<SecuritySettings>): Promise<SecuritySettings> {
    const response = await axiosInstance.put(`${this.baseUrl}/seguridad`, data);
    return response.data.data;
  }

  // ==================== INFORMACIÓN DEL SISTEMA ====================

  /**
   * Obtener información del sistema
   */
  async getSystemInfo(): Promise<{
    version: string;
    entorno: string;
    baseDatos: string;
    espacioDisponible: number;
    espacioTotal: number;
    ultimoRespaldo?: string;
    uptime: number;
  }> {
    const response = await axiosInstance.get(`${this.baseUrl}/sistema/info`);
    return response.data.data;
  }

  /**
   * Reiniciar sistema
   */
  async restartSystem(): Promise<{ exito: boolean; mensaje: string }> {
    const response = await axiosInstance.post(`${this.baseUrl}/sistema/reiniciar`);
    return response.data.data;
  }

  /**
   * Limpiar caché
   */
  async clearCache(): Promise<{ exito: boolean; mensaje: string }> {
    const response = await axiosInstance.post(`${this.baseUrl}/sistema/limpiar-cache`);
    return response.data.data;
  }
}

// Exportar instancia única (singleton)
const settingsService = new SettingsService();
export default settingsService;
