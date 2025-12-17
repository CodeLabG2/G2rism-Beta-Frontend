/**
 * ⚠️ ARCHIVO HOOK CON LÓGICA MOCK - COMENTADO PARA USAR API REAL
 *
 * Este hook contenía lógica mock embebida.
 * Ha sido comentado para forzar el uso de la API real del backend.
 *
 * Fecha de comentado: 2025-12-16
 * Razón: Pruebas de integración con API real G2rismBeta.API
 */

import { useState, useEffect, useCallback } from 'react';
import { clientsService } from '../services/api';
import type { Client, CreateClientDto, UpdateClientDto, ClientsFilters } from '../services/api';

/* LÓGICA MOCK COMENTADA - Usar API real
/**
 * ⚠️ DATOS MOCK COMENTADOS - USANDO API REAL
 *
 * Este hook ahora usa directamente la API real del backend.
 * Los datos mock han sido comentados.
 *
 * Fecha de comentado: 2025-12-16
 */

/* MOCK DATA COMENTADO - Usar API real
// ====================================
// DATOS MOCK TEMPORALES
// ====================================
const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const mockClients: Client[] = [
  {
    idCliente: 1,
    idUsuario: 101,
    idCategoria: 1,
    nombre: 'María',
    apellido: 'González Pérez',
    nombreCompleto: 'María González Pérez',
    documentoIdentidad: '1234567890',
    tipoDocumento: 'CC',
    fechaNacimiento: '1985-05-15',
    edad: calculateAge('1985-05-15'),
    correoElectronico: 'maria.gonzalez@email.com',
    telefono: '+57 300 123 4567',
    direccion: 'Calle 100 #15-20',
    ciudad: 'Bogotá',
    pais: 'Colombia',
    fechaRegistro: '2023-01-15T10:30:00',
    estado: true,
  },
  {
    idCliente: 2,
    idUsuario: 102,
    idCategoria: 2,
    nombre: 'Carlos',
    apellido: 'Ramírez López',
    nombreCompleto: 'Carlos Ramírez López',
    documentoIdentidad: '9876543210',
    tipoDocumento: 'CC',
    fechaNacimiento: '1978-08-22',
    edad: calculateAge('1978-08-22'),
    correoElectronico: 'carlos.ramirez@email.com',
    telefono: '+57 301 234 5678',
    direccion: 'Carrera 50 #80-35',
    ciudad: 'Medellín',
    pais: 'Colombia',
    fechaRegistro: '2023-06-20T14:15:00',
    estado: true,
  },
  {
    idCliente: 3,
    idUsuario: 103,
    idCategoria: 3,
    nombre: 'Ana Patricia',
    apellido: 'Moreno',
    nombreCompleto: 'Ana Patricia Moreno',
    documentoIdentidad: '3456789012',
    tipoDocumento: 'CE',
    fechaNacimiento: '1992-03-10',
    edad: calculateAge('1992-03-10'),
    correoElectronico: 'ana.moreno@email.com',
    telefono: '+57 302 345 6789',
    direccion: 'Avenida 68 #45-78',
    ciudad: 'Bogotá',
    pais: 'Colombia',
    fechaRegistro: '2024-12-02T09:45:00',
    estado: true,
  },
  {
    idCliente: 4,
    idUsuario: 104,
    idCategoria: 1,
    nombre: 'Roberto',
    apellido: 'Silva Martínez',
    nombreCompleto: 'Roberto Silva Martínez',
    documentoIdentidad: '5678901234',
    tipoDocumento: 'CC',
    fechaNacimiento: '1980-11-30',
    edad: calculateAge('1980-11-30'),
    correoElectronico: 'roberto.silva@email.com',
    telefono: '+57 303 456 7890',
    direccion: 'Calle 85 #10-50',
    ciudad: 'Cali',
    pais: 'Colombia',
    fechaRegistro: '2022-03-10T11:00:00',
    estado: true,
  },
  {
    idCliente: 5,
    idUsuario: 105,
    idCategoria: 1,
    nombre: 'Laura',
    apellido: 'Fernández Castro',
    nombreCompleto: 'Laura Fernández Castro',
    documentoIdentidad: '7890123456',
    tipoDocumento: 'CC',
    fechaNacimiento: '1988-07-18',
    edad: calculateAge('1988-07-18'),
    correoElectronico: 'laura.fernandez@email.com',
    telefono: '+57 304 567 8901',
    direccion: 'Carrera 15 #95-40',
    ciudad: 'Barranquilla',
    pais: 'Colombia',
    fechaRegistro: '2023-08-25T16:30:00',
    estado: true,
  },
  {
    idCliente: 6,
    idUsuario: 106,
    idCategoria: 2,
    nombre: 'Jorge Andrés',
    apellido: 'Parra',
    nombreCompleto: 'Jorge Andrés Parra',
    documentoIdentidad: '9012345678',
    tipoDocumento: 'CC',
    fechaNacimiento: '1975-12-05',
    edad: calculateAge('1975-12-05'),
    correoElectronico: 'jorge.parra@email.com',
    telefono: '+57 305 678 9012',
    direccion: 'Calle 45 #30-15',
    ciudad: 'Pereira',
    pais: 'Colombia',
    fechaRegistro: '2024-05-10T14:15:00',
    estado: true,
  },
  {
    idCliente: 7,
    idUsuario: 107,
    idCategoria: 2,
    nombre: 'Diana Carolina',
    apellido: 'Ruiz',
    nombreCompleto: 'Diana Carolina Ruiz',
    documentoIdentidad: '1098765432',
    tipoDocumento: 'TI',
    fechaNacimiento: '1995-02-14',
    edad: calculateAge('1995-02-14'),
    correoElectronico: 'diana.ruiz@email.com',
    telefono: '+57 306 789 0123',
    direccion: 'Avenida 30 #50-80',
    ciudad: 'Bucaramanga',
    pais: 'Colombia',
    fechaRegistro: '2024-03-15T10:20:00',
    estado: true,
  },
  {
    idCliente: 8,
    idUsuario: 108,
    idCategoria: 3,
    nombre: 'Felipe',
    apellido: 'Gómez Vargas',
    nombreCompleto: 'Felipe Gómez Vargas',
    documentoIdentidad: '2345678901',
    tipoDocumento: 'CC',
    fechaNacimiento: '1983-09-28',
    edad: calculateAge('1983-09-28'),
    correoElectronico: 'felipe.gomez@email.com',
    telefono: '+57 307 890 1234',
    direccion: 'Carrera 70 #25-90',
    ciudad: 'Cartagena',
    pais: 'Colombia',
    fechaRegistro: '2024-02-20T13:40:00',
    estado: false,
  },
];

/**
 * Hook personalizado para gestión de clientes (CRM)
 * Integra el clientsService con React state management
 * 
 * NOTA: Usando datos mock temporalmente hasta que la API esté disponible
 * 
 * @returns Funciones y estado para gestionar clientes
 */
export function useClients() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [loading, setLoading] = useState(false); // Changed to false for mock data
  const [error, setError] = useState<string | null>(null);

  /**
   * Cargar todos los clientes
   */
  const loadClients = useCallback(async (filters?: ClientsFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Aplicar filtros a datos mock
      let data = [...mockClients];
      
      if (filters?.estado !== undefined) {
        data = data.filter(c => c.estado === filters.estado);
      }
      if (filters?.ciudad) {
        data = data.filter(c => c.ciudad === filters.ciudad);
      }
      if (filters?.pais) {
        data = data.filter(c => c.pais === filters.pais);
      }
      if (filters?.categoria) {
        data = data.filter(c => c.idCategoria === filters.categoria);
      }
      if (filters?.tipoDocumento) {
        data = data.filter(c => c.tipoDocumento === filters.tipoDocumento);
      }
      
      setClients(data);
      
      // Mantener código original comentado para cuando la API esté disponible
      // const data = await clientsService.getAll(filters);
      // setClients(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al cargar clientes');
      console.error('Error loading clients:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crear nuevo cliente
   */
  const createClient = useCallback(async (data: CreateClientDto) => {
    try {
      // Simular creación con mock
      const newClient: Client = {
        idCliente: Math.max(...mockClients.map(c => c.idCliente)) + 1,
        idUsuario: data.idUsuario,
        idCategoria: data.idCategoria,
        nombre: data.nombre,
        apellido: data.apellido,
        nombreCompleto: `${data.nombre} ${data.apellido}`,
        documentoIdentidad: data.documentoIdentidad,
        tipoDocumento: data.tipoDocumento,
        fechaNacimiento: data.fechaNacimiento,
        edad: calculateAge(data.fechaNacimiento),
        correoElectronico: data.correoElectronico,
        telefono: data.telefono,
        direccion: data.direccion,
        ciudad: data.ciudad,
        pais: data.pais,
        fechaRegistro: new Date().toISOString(),
        estado: data.estado !== undefined ? data.estado : true,
      };
      
      mockClients.push(newClient);
      setClients(prev => [...prev, newClient]);
      return { success: true, data: newClient };
      
      // const newClient = await clientsService.create(data);
      // setClients(prev => [...prev, newClient]);
      // return { success: true, data: newClient };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear cliente';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Actualizar cliente existente
   */
  const updateClient = useCallback(async (id: number, data: UpdateClientDto) => {
    try {
      // Simular actualización con mock
      const clientIndex = mockClients.findIndex(c => c.idCliente === id);
      if (clientIndex !== -1) {
        const updatedClient = {
          ...mockClients[clientIndex],
          ...data,
          nombreCompleto: data.nombre || data.apellido 
            ? `${data.nombre || mockClients[clientIndex].nombre} ${data.apellido || mockClients[clientIndex].apellido}`
            : mockClients[clientIndex].nombreCompleto,
        };
        mockClients[clientIndex] = updatedClient;
        setClients(prev => prev.map(client => 
          client.idCliente === id ? updatedClient : client
        ));
        return { success: true, data: updatedClient };
      }
      throw new Error('Cliente no encontrado');
      
      // const updatedClient = await clientsService.update(id, data);
      // setClients(prev => prev.map(client => 
      //   client.idCliente === id ? updatedClient : client
      // ));
      // return { success: true, data: updatedClient };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar cliente';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Eliminar cliente
   */
  const deleteClient = useCallback(async (id: number) => {
    try {
      // Simular eliminación con mock
      const clientIndex = mockClients.findIndex(c => c.idCliente === id);
      if (clientIndex !== -1) {
        mockClients.splice(clientIndex, 1);
        setClients(prev => prev.filter(client => client.idCliente !== id));
        return { success: true };
      }
      throw new Error('Cliente no encontrado');
      
      // await clientsService.delete(id);
      // setClients(prev => prev.filter(client => client.idCliente !== id));
      // return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar cliente';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Activar cliente
   */
  const activateClient = useCallback(async (id: number) => {
    try {
      // Simular con mock
      const clientIndex = mockClients.findIndex(c => c.idCliente === id);
      if (clientIndex !== -1) {
        const updatedClient = { ...mockClients[clientIndex], estado: true };
        mockClients[clientIndex] = updatedClient;
        setClients(prev => prev.map(client => 
          client.idCliente === id ? updatedClient : client
        ));
        return { success: true, data: updatedClient };
      }
      throw new Error('Cliente no encontrado');
      
      // const updatedClient = await clientsService.activate(id);
      // setClients(prev => prev.map(client => 
      //   client.idCliente === id ? updatedClient : client
      // ));
      // return { success: true, data: updatedClient };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al activar cliente';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Desactivar cliente
   */
  const deactivateClient = useCallback(async (id: number) => {
    try {
      // Simular con mock
      const clientIndex = mockClients.findIndex(c => c.idCliente === id);
      if (clientIndex !== -1) {
        const updatedClient = { ...mockClients[clientIndex], estado: false };
        mockClients[clientIndex] = updatedClient;
        setClients(prev => prev.map(client => 
          client.idCliente === id ? updatedClient : client
        ));
        return { success: true, data: updatedClient };
      }
      throw new Error('Cliente no encontrado');
      
      // const updatedClient = await clientsService.deactivate(id);
      // setClients(prev => prev.map(client => 
      //   client.idCliente === id ? updatedClient : client
      // ));
      // return { success: true, data: updatedClient };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al desactivar cliente';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Alternar estado activo/inactivo
   */
  const toggleClientStatus = useCallback(async (id: number) => {
    try {
      // Simular con mock
      const client = mockClients.find(c => c.idCliente === id);
      if (!client) throw new Error('Cliente no encontrado');
      
      return client.estado ? deactivateClient(id) : activateClient(id);
      
      // const updatedClient = await clientsService.toggleActive(id);
      // setClients(prev => prev.map(client => 
      //   client.idCliente === id ? updatedClient : client
      // ));
      // return { success: true, data: updatedClient };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cambiar estado';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [activateClient, deactivateClient]);

  /**
   * Buscar clientes
   */
  const searchClients = useCallback(async (term: string) => {
    try {
      // Simular búsqueda con mock
      const lowerTerm = term.toLowerCase();
      const results = mockClients.filter(client =>
        client.nombre.toLowerCase().includes(lowerTerm) ||
        client.apellido.toLowerCase().includes(lowerTerm) ||
        client.nombreCompleto.toLowerCase().includes(lowerTerm) ||
        client.correoElectronico.toLowerCase().includes(lowerTerm) ||
        client.documentoIdentidad.includes(term)
      );
      
      return { success: true, data: results };
      
      // const results = await clientsService.search(term);
      // return { success: true, data: results };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al buscar clientes';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener cliente con categoría
   */
  const getClientWithCategory = useCallback(async (id: number) => {
    try {
      // Simular con mock
      const client = mockClients.find(c => c.idCliente === id);
      if (!client) throw new Error('Cliente no encontrado');
      
      return { success: true, data: client };
      
      // const client = await clientsService.getWithCategory(id);
      // return { success: true, data: client };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener cliente';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener cliente completo (con todas las relaciones)
   */
  const getClientComplete = useCallback(async (id: number) => {
    try {
      // Simular con mock
      const client = mockClients.find(c => c.idCliente === id);
      if (!client) throw new Error('Cliente no encontrado');
      
      return { success: true, data: client };
      
      // const client = await clientsService.getComplete(id);
      // return { success: true, data: client };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener cliente completo';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener estadísticas
   */
  const getStatistics = useCallback(async () => {
    try {
      // Calcular estadísticas de mock
      const porCategoria: { [key: string]: number } = {};
      const porCiudad: { [key: string]: number } = {};
      const porPais: { [key: string]: number } = {};
      
      let totalEdad = 0;
      
      mockClients.forEach(client => {
        // Por categoría
        const catKey = client.idCategoria?.toString() || 'Sin categoría';
        porCategoria[catKey] = (porCategoria[catKey] || 0) + 1;
        
        // Por ciudad
        porCiudad[client.ciudad] = (porCiudad[client.ciudad] || 0) + 1;
        
        // Por país
        porPais[client.pais] = (porPais[client.pais] || 0) + 1;
        
        // Edad
        totalEdad += client.edad;
      });
      
      const stats = {
        total: mockClients.length,
        activos: mockClients.filter(c => c.estado).length,
        inactivos: mockClients.filter(c => !c.estado).length,
        porCategoria,
        porCiudad,
        porPais,
        edadPromedio: mockClients.length > 0 ? totalEdad / mockClients.length : 0,
      };
      
      return { success: true, data: stats };
      
      // const stats = await clientsService.getStatistics();
      // return { success: true, data: stats };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener estadísticas';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener ciudades únicas
   */
  const getCities = useCallback(async () => {
    try {
      // Calcular con mock
      const cities = [...new Set(mockClients.map(c => c.ciudad))].sort();
      return { success: true, data: cities };
      
      // const cities = await clientsService.getCities();
      // return { success: true, data: cities };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener ciudades';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Obtener países únicos
   */
  const getCountries = useCallback(async () => {
    try {
      // Calcular con mock
      const countries = [...new Set(mockClients.map(c => c.pais))].sort();
      return { success: true, data: countries };
      
      // const countries = await clientsService.getCountries();
      // return { success: true, data: countries };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener países';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Cargar clientes al montar el componente
   */
  useEffect(() => {
    loadClients();
  }, [loadClients]);

  return {
    clients,
    loading,
    error,
    loadClients,
    createClient,
    updateClient,
    deleteClient,
    activateClient,
    deactivateClient,
    toggleClientStatus,
    searchClients,
    getClientWithCategory,
    getClientComplete,
    getStatistics,
    getCities,
    getCountries,
  };
}
// */ FIN LÓGICA MOCK COMENTADA

// ⚠️ NUEVA IMPLEMENTACIÓN USANDO API REAL
/**
 * Hook personalizado para gestión de clientes (CRM)
 * Usa directamente la API real del backend
 */
export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadClients = useCallback(async (filters?: ClientsFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await clientsService.getAll(filters);
      setClients(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al cargar clientes');
      console.error('Error loading clients:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createClient = useCallback(async (data: CreateClientDto) => {
    try {
      const newClient = await clientsService.create(data);
      setClients(prev => [...prev, newClient]);
      return { success: true, data: newClient };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear cliente';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const updateClient = useCallback(async (id: number, data: UpdateClientDto) => {
    try {
      const updatedClient = await clientsService.update(id, data);
      setClients(prev => prev.map(client => client.idCliente === id ? updatedClient : client));
      return { success: true, data: updatedClient };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar cliente';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const deleteClient = useCallback(async (id: number) => {
    try {
      await clientsService.delete(id);
      setClients(prev => prev.filter(client => client.idCliente !== id));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar cliente';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const activateClient = useCallback(async (id: number) => {
    try {
      const updatedClient = await clientsService.activate(id);
      setClients(prev => prev.map(client => client.idCliente === id ? updatedClient : client));
      return { success: true, data: updatedClient };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al activar cliente';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const deactivateClient = useCallback(async (id: number) => {
    try {
      const updatedClient = await clientsService.deactivate(id);
      setClients(prev => prev.map(client => client.idCliente === id ? updatedClient : client));
      return { success: true, data: updatedClient };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al desactivar cliente';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const toggleClientStatus = useCallback(async (id: number) => {
    try {
      const updatedClient = await clientsService.toggleActive(id);
      setClients(prev => prev.map(client => client.idCliente === id ? updatedClient : client));
      return { success: true, data: updatedClient };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cambiar estado';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const searchClients = useCallback(async (term: string) => {
    try {
      const results = await clientsService.search(term);
      return { success: true, data: results };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al buscar clientes';
      return { success: false, error: errorMessage };
    }
  }, []);

  const getClientWithCategory = useCallback(async (id: number) => {
    try {
      const client = await clientsService.getWithCategory(id);
      return { success: true, data: client };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener cliente';
      return { success: false, error: errorMessage };
    }
  }, []);

  const getClientComplete = useCallback(async (id: number) => {
    try {
      const client = await clientsService.getComplete(id);
      return { success: true, data: client };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener cliente completo';
      return { success: false, error: errorMessage };
    }
  }, []);

  const getStatistics = useCallback(async () => {
    try {
      const stats = await clientsService.getStatistics();
      return { success: true, data: stats };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener estadísticas';
      return { success: false, error: errorMessage };
    }
  }, []);

  const getCities = useCallback(async () => {
    try {
      const cities = await clientsService.getCities();
      return { success: true, data: cities };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener ciudades';
      return { success: false, error: errorMessage };
    }
  }, []);

  const getCountries = useCallback(async () => {
    try {
      const countries = await clientsService.getCountries();
      return { success: true, data: countries };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener países';
      return { success: false, error: errorMessage };
    }
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  return {
    clients,
    loading,
    error,
    loadClients,
    createClient,
    updateClient,
    deleteClient,
    activateClient,
    deactivateClient,
    toggleClientStatus,
    searchClients,
    getClientWithCategory,
    getClientComplete,
    getStatistics,
    getCities,
    getCountries,
  };
}