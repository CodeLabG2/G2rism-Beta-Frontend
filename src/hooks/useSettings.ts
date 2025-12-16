import { useState, useCallback } from 'react';
import settingsService from '../services/api/settingsService';
import type {
  CompanySettings,
  CompanySettingsFormData,
  SystemParameters,
  SystemParameterFormData,
  DianConfiguration,
  DianConfigurationFormData,
  NotificationSettings,
  BackupConfiguration,
  SystemLog,
  EmailConfiguration,
  SecuritySettings,
} from '../services/api/settingsService';

/**
 * Hook personalizado para gestión de configuración
 * Integra settingsService con React state management
 * 
 * @returns Funciones y estado para gestionar configuración
 */
export function useSettings() {
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [systemParameters, setSystemParameters] = useState<SystemParameters[]>([]);
  const [dianConfiguration, setDianConfiguration] = useState<DianConfiguration | null>(null);
  const [notifications, setNotifications] = useState<NotificationSettings[]>([]);
  const [backupConfiguration, setBackupConfiguration] = useState<BackupConfiguration | null>(null);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [emailConfiguration, setEmailConfiguration] = useState<EmailConfiguration | null>(null);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ==================== EMPRESA ====================

  /**
   * Cargar configuración de la empresa
   */
  const loadCompanySettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsService.getCompanySettings();
      setCompanySettings(data);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar configuración';
      setError(errorMessage);
      console.error('Error loading company settings:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Actualizar configuración de la empresa
   */
  const updateCompanySettings = useCallback(async (data: CompanySettingsFormData) => {
    try {
      const updated = await settingsService.updateCompanySettings(data);
      setCompanySettings(updated);
      return { success: true, data: updated };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar configuración';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Subir logo
   */
  const uploadLogo = useCallback(async (file: File) => {
    try {
      const result = await settingsService.uploadLogo(file);
      return { success: true, data: result };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al subir logo';
      return { success: false, error: errorMessage };
    }
  }, []);

  // ==================== PARÁMETROS ====================

  /**
   * Cargar parámetros del sistema
   */
  const loadSystemParameters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsService.getAllParameters();
      setSystemParameters(data);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar parámetros';
      setError(errorMessage);
      console.error('Error loading parameters:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Actualizar parámetro
   */
  const updateParameter = useCallback(async (id: number, data: Partial<SystemParameterFormData>) => {
    try {
      const updated = await settingsService.updateParameter(id, data);
      setSystemParameters(prev => prev.map(p => p.idParametro === id ? updated : p));
      return { success: true, data: updated };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar parámetro';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Crear parámetro
   */
  const createParameter = useCallback(async (data: SystemParameterFormData) => {
    try {
      const created = await settingsService.createParameter(data);
      setSystemParameters(prev => [...prev, created]);
      return { success: true, data: created };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear parámetro';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Eliminar parámetro
   */
  const deleteParameter = useCallback(async (id: number) => {
    try {
      await settingsService.deleteParameter(id);
      setSystemParameters(prev => prev.filter(p => p.idParametro !== id));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar parámetro';
      return { success: false, error: errorMessage };
    }
  }, []);

  // ==================== DIAN ====================

  /**
   * Cargar configuración DIAN
   */
  const loadDianConfiguration = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsService.getDianConfiguration();
      setDianConfiguration(data);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar configuración DIAN';
      setError(errorMessage);
      console.error('Error loading DIAN configuration:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Actualizar configuración DIAN
   */
  const updateDianConfiguration = useCallback(async (data: DianConfigurationFormData) => {
    try {
      const updated = await settingsService.updateDianConfiguration(data);
      setDianConfiguration(updated);
      return { success: true, data: updated };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar configuración DIAN';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Probar conexión DIAN
   */
  const testDianConnection = useCallback(async () => {
    try {
      const result = await settingsService.testDianConnection();
      return { success: true, data: result };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al probar conexión DIAN';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener consecutivo actual
   */
  const getCurrentConsecutive = useCallback(async () => {
    try {
      const data = await settingsService.getCurrentConsecutive();
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener consecutivo';
      return { success: false, error: errorMessage };
    }
  }, []);

  // ==================== NOTIFICACIONES ====================

  /**
   * Cargar notificaciones
   */
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsService.getAllNotifications();
      setNotifications(data);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar notificaciones';
      setError(errorMessage);
      console.error('Error loading notifications:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Actualizar notificación
   */
  const updateNotification = useCallback(async (id: number, data: Partial<NotificationSettings>) => {
    try {
      const updated = await settingsService.updateNotification(id, data);
      setNotifications(prev => prev.map(n => n.idNotificacion === id ? updated : n));
      return { success: true, data: updated };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar notificación';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Habilitar/Deshabilitar notificación
   */
  const toggleNotification = useCallback(async (id: number, habilitado: boolean) => {
    try {
      const updated = await settingsService.toggleNotification(id, habilitado);
      setNotifications(prev => prev.map(n => n.idNotificacion === id ? updated : n));
      return { success: true, data: updated };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cambiar estado de notificación';
      return { success: false, error: errorMessage };
    }
  }, []);

  // ==================== RESPALDOS ====================

  /**
   * Cargar configuración de respaldos
   */
  const loadBackupConfiguration = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsService.getBackupConfiguration();
      setBackupConfiguration(data);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar configuración de respaldos';
      setError(errorMessage);
      console.error('Error loading backup configuration:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Actualizar configuración de respaldos
   */
  const updateBackupConfiguration = useCallback(async (data: Partial<BackupConfiguration>) => {
    try {
      const updated = await settingsService.updateBackupConfiguration(data);
      setBackupConfiguration(updated);
      return { success: true, data: updated };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar configuración de respaldos';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Ejecutar respaldo manual
   */
  const executeBackup = useCallback(async () => {
    try {
      const result = await settingsService.executeBackup();
      return { success: true, data: result };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al ejecutar respaldo';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener historial de respaldos
   */
  const getBackupHistory = useCallback(async () => {
    try {
      const data = await settingsService.getBackupHistory();
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener historial';
      return { success: false, error: errorMessage };
    }
  }, []);

  // ==================== LOGS ====================

  /**
   * Cargar logs del sistema
   */
  const loadSystemLogs = useCallback(async (params?: {
    nivel?: string;
    modulo?: string;
    fechaInicio?: string;
    fechaFin?: string;
    limite?: number;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsService.getSystemLogs(params);
      setSystemLogs(data);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar logs';
      setError(errorMessage);
      console.error('Error loading logs:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Limpiar logs antiguos
   */
  const clearOldLogs = useCallback(async (dias: number) => {
    try {
      const result = await settingsService.clearOldLogs(dias);
      return { success: true, data: result };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al limpiar logs';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Exportar logs
   */
  const exportLogs = useCallback(async (params: {
    fechaInicio: string;
    fechaFin: string;
    formato: 'CSV' | 'JSON';
  }) => {
    try {
      const blob = await settingsService.exportLogs(params);
      
      // Descargar archivo
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `logs_${params.fechaInicio}_${params.fechaFin}.${params.formato.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al exportar logs';
      return { success: false, error: errorMessage };
    }
  }, []);

  // ==================== EMAIL ====================

  /**
   * Cargar configuración de email
   */
  const loadEmailConfiguration = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsService.getEmailConfiguration();
      setEmailConfiguration(data);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar configuración de email';
      setError(errorMessage);
      console.error('Error loading email configuration:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Actualizar configuración de email
   */
  const updateEmailConfiguration = useCallback(async (data: Partial<EmailConfiguration>) => {
    try {
      const updated = await settingsService.updateEmailConfiguration(data);
      setEmailConfiguration(updated);
      return { success: true, data: updated };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar configuración de email';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Probar configuración de email
   */
  const testEmailConfiguration = useCallback(async (emailDestino: string) => {
    try {
      const result = await settingsService.testEmailConfiguration(emailDestino);
      return { success: true, data: result };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al probar configuración de email';
      return { success: false, error: errorMessage };
    }
  }, []);

  // ==================== SEGURIDAD ====================

  /**
   * Cargar configuración de seguridad
   */
  const loadSecuritySettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsService.getSecuritySettings();
      setSecuritySettings(data);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar configuración de seguridad';
      setError(errorMessage);
      console.error('Error loading security settings:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Actualizar configuración de seguridad
   */
  const updateSecuritySettings = useCallback(async (data: Partial<SecuritySettings>) => {
    try {
      const updated = await settingsService.updateSecuritySettings(data);
      setSecuritySettings(updated);
      return { success: true, data: updated };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar configuración de seguridad';
      return { success: false, error: errorMessage };
    }
  }, []);

  // ==================== SISTEMA ====================

  /**
   * Obtener información del sistema
   */
  const getSystemInfo = useCallback(async () => {
    try {
      const data = await settingsService.getSystemInfo();
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener información del sistema';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Limpiar caché
   */
  const clearCache = useCallback(async () => {
    try {
      const result = await settingsService.clearCache();
      return { success: true, data: result };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al limpiar caché';
      return { success: false, error: errorMessage };
    }
  }, []);

  return {
    // Estado
    companySettings,
    systemParameters,
    dianConfiguration,
    notifications,
    backupConfiguration,
    systemLogs,
    emailConfiguration,
    securitySettings,
    loading,
    error,

    // Empresa
    loadCompanySettings,
    updateCompanySettings,
    uploadLogo,

    // Parámetros
    loadSystemParameters,
    updateParameter,
    createParameter,
    deleteParameter,

    // DIAN
    loadDianConfiguration,
    updateDianConfiguration,
    testDianConnection,
    getCurrentConsecutive,

    // Notificaciones
    loadNotifications,
    updateNotification,
    toggleNotification,

    // Respaldos
    loadBackupConfiguration,
    updateBackupConfiguration,
    executeBackup,
    getBackupHistory,

    // Logs
    loadSystemLogs,
    clearOldLogs,
    exportLogs,

    // Email
    loadEmailConfiguration,
    updateEmailConfiguration,
    testEmailConfiguration,

    // Seguridad
    loadSecuritySettings,
    updateSecuritySettings,

    // Sistema
    getSystemInfo,
    clearCache,
  };
}

// Re-exportar tipos
export type {
  CompanySettings,
  CompanySettingsFormData,
  SystemParameters,
  SystemParameterFormData,
  DianConfiguration,
  DianConfigurationFormData,
  NotificationSettings,
  BackupConfiguration,
  SystemLog,
  EmailConfiguration,
  SecuritySettings,
};
