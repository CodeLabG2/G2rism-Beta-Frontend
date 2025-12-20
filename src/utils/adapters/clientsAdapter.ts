import type { Client, CreateClientDto, UpdateClientDto } from '../../services/types/clients.types';
import type { Lead } from '../../components/admin/views/crm/types';

/**
 * ADAPTADOR DE CLIENTES
 * 
 * Convierte entre los tipos de la API backend y los tipos de la UI del CRM
 * 
 * Backend Type: Client (idCliente, nombre, apellido, etc.)
 * UI Type: Lead (id, fullName, code, etc.)
 */

/**
 * Convertir Cliente de API a Lead de UI
 */
export function apiClientToUiLead(client: Client): Lead {
  return {
    id: client.idCliente.toString(),
    code: `C${String(client.idCliente).padStart(6, '0')}`,
    fullName: client.nombreCompleto,
    firstName: client.nombre,
    lastName: client.apellido,
    clientType: 'individual', // Por defecto, puede ser extendido
    status: client.estado ? 'qualified' : 'lost', // Mapeo básico de estado
    priority: 'medium', // Por defecto
    source: 'other', // Por defecto
    estimatedValue: 0, // No disponible en el modelo actual
    probability: client.estado ? 75 : 0,
    contact: {
      email: client.correoElectronico,
      phone: client.telefono,
      mobile: client.telefono,
      whatsapp: client.telefono,
      preferredChannel: 'email'
    },
    address: {
      street: client.direccion || '',
      city: client.ciudad,
      state: '', // No disponible
      country: client.pais
    },
    company: '', // No disponible en el modelo actual
    position: '', // No disponible
    assignedTo: '', // No disponible
    tags: [],
    interactions: [],
    notes: [],
    documents: [],
    createdAt: client.fechaRegistro,
    updatedAt: client.fechaRegistro,
    lastContact: client.fechaRegistro
  };
}

/**
 * Convertir múltiples clientes de API a Leads de UI
 */
export function apiClientsToUiLeads(clients: Client[]): Lead[] {
  return clients.map(apiClientToUiLead);
}

/**
 * Convertir datos de formulario UI a CreateClientDto para API
 */
export function uiLeadFormToApiCreateClient(formData: any): CreateClientDto {
  return {
    idUsuario: 1, // TODO: Obtener del usuario logueado
    nombre: formData.firstName,
    apellido: formData.lastName,
    documentoIdentidad: formData.documentId || 'SIN-DOC',
    tipoDocumento: formData.documentType || 'CC',
    fechaNacimiento: formData.birthDate || new Date().toISOString().split('T')[0],
    correoElectronico: formData.email,
    telefono: formData.phone,
    direccion: formData.address || '',
    ciudad: formData.city || 'Bogotá',
    pais: formData.country || 'Colombia',
    idCategoria: formData.categoryId ? parseInt(formData.categoryId) : undefined,
  };
}

/**
 * Convertir datos de formulario UI a UpdateClientDto para API
 * IMPORTANTE: UpdateClientDto requiere TODOS los campos (no opcionales)
 * según ClienteUpdateDto del backend
 */
export function uiLeadFormToApiUpdateClient(formData: any, clientId: number): UpdateClientDto {
  return {
    idCliente: clientId, // REQUERIDO por el backend
    idCategoria: formData.categoryId ? parseInt(formData.categoryId) : undefined,
    nombre: formData.firstName || '',
    apellido: formData.lastName || '',
    documentoIdentidad: formData.documentId || '',
    tipoDocumento: formData.documentType || 'CC',
    fechaNacimiento: formData.birthDate || new Date().toISOString().split('T')[0],
    correoElectronico: formData.email || '',
    telefono: formData.phone || '',
    direccion: formData.address,
    ciudad: formData.city || '',
    pais: formData.country || '',
    estado: formData.estado !== undefined ? formData.estado : true,
  };
}

/**
 * Extraer ID numérico del código de lead
 * Ejemplo: "C000123" -> 123
 */
export function extractClientIdFromCode(code: string): number {
  const match = code.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
}

/**
 * Extraer ID numérico del ID de lead
 * Ejemplo: "123" -> 123
 */
export function extractClientIdFromLeadId(leadId: string): number {
  return parseInt(leadId);
}
