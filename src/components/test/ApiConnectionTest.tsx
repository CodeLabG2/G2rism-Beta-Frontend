/**
 * Componente de prueba de conexión con el backend
 * =================================================
 * Este componente verifica que la conexión con el backend .NET esté funcionando correctamente
 */

import { useState, useEffect } from 'react';
import { apiClient } from '../../../services/api/config/axios.config';
import { API_CONFIG } from '../../config/api.config';
import type { ApiResponse, ApiErrorResponse, Cliente } from '../../types/backend.types';

interface ConnectionStatus {
  status: 'checking' | 'connected' | 'error' | 'fallback';
  message: string;
  details?: any;
}

export const ApiConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'checking',
    message: 'Verificando conexión con el backend...',
  });
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  // Mock data para fallback
  const MOCK_CLIENTES: Cliente[] = [
    {
      idCliente: 1,
      idUsuario: 5,
      idCategoria: 2,
      nombre: "Juan",
      apellido: "Pérez García",
      documentoIdentidad: "1234567890",
      tipoDocumento: "CC",
      fechaNacimiento: "1990-05-15",
      correoElectronico: "juan.perez@example.com",
      telefono: "+57 300 123 4567",
      direccion: "Calle 123 #45-67",
      ciudad: "Medellín",
      pais: "Colombia",
      estado: true,
      fechaRegistro: new Date().toISOString(),
      categoriaNombre: "VIP",
    },
    {
      idCliente: 2,
      idUsuario: 6,
      idCategoria: 1,
      nombre: "María",
      apellido: "González López",
      documentoIdentidad: "0987654321",
      tipoDocumento: "CC",
      fechaNacimiento: "1985-08-22",
      correoElectronico: "maria.gonzalez@example.com",
      telefono: "+57 310 987 6543",
      direccion: "Carrera 45 #12-34",
      ciudad: "Bogotá",
      pais: "Colombia",
      estado: true,
      fechaRegistro: new Date().toISOString(),
      categoriaNombre: "Regular",
    },
  ];

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setConnectionStatus({
        status: 'checking',
        message: 'Conectando al backend...',
      });

      // Intentar obtener clientes del backend
      const response = await apiClient.get<ApiResponse<Cliente[]>>('/clientes');
      
      if (response.data.success) {
        setClientes(response.data.data);
        setConnectionStatus({
          status: 'connected',
          message: '✅ Conectado al backend exitosamente',
          details: {
            url: API_CONFIG.BASE_URL,
            clientesCount: response.data.data.length,
            timestamp: new Date().toISOString(),
          },
        });
      }
    } catch (error: any) {
      console.error('Error al conectar con el backend:', error);
      
      // Usar datos mock como fallback
      setClientes(MOCK_CLIENTES);
      
      const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
      
      setConnectionStatus({
        status: 'fallback',
        message: '⚠️ Backend no disponible - Usando datos de prueba',
        details: {
          error: errorMessage,
          url: API_CONFIG.BASE_URL,
          mockDataCount: MOCK_CLIENTES.length,
          suggestion: 'Verifica que el backend .NET esté corriendo en el puerto correcto',
        },
      });
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus.status) {
      case 'connected':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'fallback':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus.status) {
      case 'connected':
        return '✅';
      case 'error':
        return '❌';
      case 'fallback':
        return '⚠️';
      default:
        return '🔄';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl mb-2">🔌 Test de Conexión Backend G2rism</h1>
        <p className="text-gray-600">
          Verifica la comunicación entre el frontend React y el backend .NET 9.0
        </p>
      </div>

      {/* Status Card */}
      <div className={`rounded-lg border-2 p-6 ${getStatusColor()}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{getStatusIcon()}</span>
              <h2 className="text-xl">Estado de Conexión</h2>
            </div>
            <p className="text-gray-700 mb-4">{connectionStatus.message}</p>
            
            {connectionStatus.details && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-blue-600 hover:text-blue-700 underline"
              >
                {showDetails ? 'Ocultar detalles' : 'Ver detalles técnicos'}
              </button>
            )}
          </div>
          
          <button
            onClick={testConnection}
            disabled={connectionStatus.status === 'checking'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {connectionStatus.status === 'checking' ? 'Conectando...' : 'Reintentar'}
          </button>
        </div>

        {/* Detalles técnicos */}
        {showDetails && connectionStatus.details && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-2">Detalles Técnicos:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(connectionStatus.details, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Configuración actual */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg mb-4">⚙️ Configuración Actual</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">URL Backend:</span>
            <span className="font-mono">{API_CONFIG.BASE_URL}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Timeout:</span>
            <span>{API_CONFIG.TIMEOUT / 1000}s</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Token almacenado:</span>
            <span>{localStorage.getItem(API_CONFIG.TOKEN.STORAGE_KEY) ? '✅ Sí' : '❌ No'}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Modo:</span>
            <span>{import.meta.env.DEV ? '🔧 Desarrollo' : '🚀 Producción'}</span>
          </div>
        </div>
      </div>

      {/* Datos de prueba */}
      {clientes.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg mb-4">
            📊 Datos de Clientes ({clientes.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Nombre</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Ciudad</th>
                  <th className="px-4 py-2 text-left">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {clientes.map((cliente) => (
                  <tr key={cliente.idCliente} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{cliente.idCliente}</td>
                    <td className="px-4 py-2">{`${cliente.nombre} ${cliente.apellido}`}</td>
                    <td className="px-4 py-2">{cliente.correoElectronico}</td>
                    <td className="px-4 py-2">{cliente.ciudad}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        cliente.estado ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {cliente.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Instrucciones */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg mb-3">📖 ¿Cómo usar este test?</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
          <li>Asegúrate de que el backend .NET esté corriendo</li>
          <li>Verifica que el puerto en <code className="bg-white px-2 py-1 rounded">.env.local</code> sea correcto</li>
          <li>Revisa que CORS esté configurado en <code className="bg-white px-2 py-1 rounded">Program.cs</code></li>
          <li>Si ves datos mock, el backend no está disponible pero el frontend funciona</li>
          <li>Haz clic en "Reintentar" después de corregir problemas</li>
        </ol>
      </div>
    </div>
  );
};

export default ApiConnectionTest;
