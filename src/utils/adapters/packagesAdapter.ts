/**
 * ADAPTADOR DE PAQUETES TURÍSTICOS - VERSIÓN 2.0
 *
 * Convierte entre los tipos de la API backend y los tipos de la UI
 *
 * ⚠️ IMPORTANTE:
 * - El backend guarda arrays como JSON strings (incluye, noIncluye, destinosAdicionales, etc.)
 * - No hay objetos complejos: Destino, Itinerario, Precios por temporada
 * - La estructura es SIMPLE y PLANA
 *
 * Backend Type: PaqueteTuristico (destinoPrincipal: string, incluye: string, etc.)
 * UI Type: TourPackage (según se implemente en el futuro)
 *
 * Fecha: 17 de Diciembre de 2024
 * @author G2rism Team
 */

import type {
  PaqueteTuristico,
  CreatePaqueteDTO,
  UpdatePaqueteDTO
} from '../../services/api/packagesService';

// ==================== TIPOS HELPER ====================

/**
 * Paquete con campos JSON parseados
 */
export interface PaqueteConArrays extends Omit<PaqueteTuristico, 'incluye' | 'noIncluye' | 'destinosAdicionales' | 'requisitos' | 'recomendaciones' | 'imagenes'> {
  incluyeArray: string[];
  noIncluyeArray: string[];
  destinosAdicionalesArray: string[];
  requisitosArray: string[];
  recomendacionesArray: string[];
  imagenesArray: string[];
}

// ==================== FUNCIONES DE PARSEO JSON ====================

/**
 * Parsear campo JSON string a array
 * Maneja casos: null, undefined, "", "[]", '["item1","item2"]'
 */
export function parseJsonField(jsonString: string | null | undefined): string[] {
  if (!jsonString) return [];
  if (jsonString.trim() === '') return [];

  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (error) {
    console.warn('Error parsing JSON field:', jsonString, error);
    return [];
  }
}

/**
 * Convertir array a JSON string para enviar al backend
 */
export function arrayToJsonString(array: string[] | undefined | null): string {
  if (!array || array.length === 0) return '[]';
  return JSON.stringify(array);
}

/**
 * Parsear todos los campos JSON de un paquete
 */
export function parsePackageJsonFields(paquete: PaqueteTuristico): PaqueteConArrays {
  return {
    ...paquete,
    incluyeArray: parseJsonField(paquete.incluye),
    noIncluyeArray: parseJsonField(paquete.noIncluye),
    destinosAdicionalesArray: parseJsonField(paquete.destinosAdicionales),
    requisitosArray: parseJsonField(paquete.requisitos),
    recomendacionesArray: parseJsonField(paquete.recomendaciones),
    imagenesArray: parseJsonField(paquete.imagenes),
  };
}

/**
 * Parsear múltiples paquetes
 */
export function parsePackagesJsonFields(paquetes: PaqueteTuristico[]): PaqueteConArrays[] {
  return paquetes.map(parsePackageJsonFields);
}

// ==================== FUNCIONES DE CONVERSIÓN A UI ====================

/**
 * Convertir paquete de API a formato UI básico
 * (Para cuando se implemente el componente UI de paquetes)
 *
 * Por ahora, retorna el paquete con arrays parseados
 */
export function apiPackageToUiPackage(apiPackage: PaqueteTuristico): PaqueteConArrays {
  return parsePackageJsonFields(apiPackage);
}

/**
 * Convertir múltiples paquetes de API a UI
 */
export function apiPackagesToUiPackages(apiPackages: PaqueteTuristico[]): PaqueteConArrays[] {
  return parsePackagesJsonFields(apiPackages);
}

// ==================== FUNCIONES DE CONVERSIÓN A API ====================

/**
 * Convertir datos de formulario UI a CreatePaqueteDTO
 *
 * IMPORTANTE: Los arrays deben convertirse a JSON strings
 */
export function uiFormToCreateDTO(formData: any): CreatePaqueteDTO {
  return {
    nombre: formData.nombre || formData.name,
    detalle: formData.detalle || formData.description,
    destinoPrincipal: formData.destinoPrincipal || formData.mainDestination,
    destinosAdicionales: formData.destinosAdicionales
      ? arrayToJsonString(formData.destinosAdicionales)
      : undefined,
    duracion: formData.duracion || formData.duration,
    precio: formData.precio || formData.price,
    cuposDisponibles: formData.cuposDisponibles || formData.availableSpots,
    incluye: formData.incluye
      ? arrayToJsonString(formData.incluye)
      : undefined,
    noIncluye: formData.noIncluye
      ? arrayToJsonString(formData.noIncluye)
      : undefined,
    fechaInicio: formData.fechaInicio || formData.startDate,
    fechaFin: formData.fechaFin || formData.endDate,
    tipoPaquete: formData.tipoPaquete || formData.packageType,
    nivelDificultad: formData.nivelDificultad || formData.difficultyLevel,
    edadMinima: formData.edadMinima || formData.minAge,
    numeroMinimoPersonas: formData.numeroMinimoPersonas || formData.minPeople,
    numeroMaximoPersonas: formData.numeroMaximoPersonas || formData.maxPeople,
    requisitos: formData.requisitos
      ? arrayToJsonString(formData.requisitos)
      : undefined,
    recomendaciones: formData.recomendaciones
      ? arrayToJsonString(formData.recomendaciones)
      : undefined,
    imagenes: formData.imagenes
      ? arrayToJsonString(formData.imagenes)
      : undefined,
    itinerarioResumido: formData.itinerarioResumido || formData.itinerarySummary,
    politicasCancelacion: formData.politicasCancelacion || formData.cancellationPolicy,
    estado: formData.estado !== undefined ? formData.estado : true,
  };
}

/**
 * Convertir datos de formulario UI a UpdatePaqueteDTO
 * Solo incluye campos que fueron proporcionados
 */
export function uiFormToUpdateDTO(formData: Partial<any>): UpdatePaqueteDTO {
  const dto: UpdatePaqueteDTO = {};

  if (formData.nombre !== undefined || formData.name !== undefined) {
    dto.nombre = formData.nombre || formData.name;
  }
  if (formData.detalle !== undefined || formData.description !== undefined) {
    dto.detalle = formData.detalle || formData.description;
  }
  if (formData.destinoPrincipal !== undefined || formData.mainDestination !== undefined) {
    dto.destinoPrincipal = formData.destinoPrincipal || formData.mainDestination;
  }
  if (formData.destinosAdicionales !== undefined) {
    dto.destinosAdicionales = arrayToJsonString(formData.destinosAdicionales);
  }
  if (formData.duracion !== undefined || formData.duration !== undefined) {
    dto.duracion = formData.duracion || formData.duration;
  }
  if (formData.precio !== undefined || formData.price !== undefined) {
    dto.precio = formData.precio || formData.price;
  }
  if (formData.cuposDisponibles !== undefined || formData.availableSpots !== undefined) {
    dto.cuposDisponibles = formData.cuposDisponibles || formData.availableSpots;
  }
  if (formData.incluye !== undefined) {
    dto.incluye = arrayToJsonString(formData.incluye);
  }
  if (formData.noIncluye !== undefined) {
    dto.noIncluye = arrayToJsonString(formData.noIncluye);
  }
  if (formData.fechaInicio !== undefined || formData.startDate !== undefined) {
    dto.fechaInicio = formData.fechaInicio || formData.startDate;
  }
  if (formData.fechaFin !== undefined || formData.endDate !== undefined) {
    dto.fechaFin = formData.fechaFin || formData.endDate;
  }
  if (formData.tipoPaquete !== undefined || formData.packageType !== undefined) {
    dto.tipoPaquete = formData.tipoPaquete || formData.packageType;
  }
  if (formData.nivelDificultad !== undefined || formData.difficultyLevel !== undefined) {
    dto.nivelDificultad = formData.nivelDificultad || formData.difficultyLevel;
  }
  if (formData.edadMinima !== undefined || formData.minAge !== undefined) {
    dto.edadMinima = formData.edadMinima || formData.minAge;
  }
  if (formData.numeroMinimoPersonas !== undefined || formData.minPeople !== undefined) {
    dto.numeroMinimoPersonas = formData.numeroMinimoPersonas || formData.minPeople;
  }
  if (formData.numeroMaximoPersonas !== undefined || formData.maxPeople !== undefined) {
    dto.numeroMaximoPersonas = formData.numeroMaximoPersonas || formData.maxPeople;
  }
  if (formData.requisitos !== undefined) {
    dto.requisitos = arrayToJsonString(formData.requisitos);
  }
  if (formData.recomendaciones !== undefined) {
    dto.recomendaciones = arrayToJsonString(formData.recomendaciones);
  }
  if (formData.imagenes !== undefined) {
    dto.imagenes = arrayToJsonString(formData.imagenes);
  }
  if (formData.itinerarioResumido !== undefined || formData.itinerarySummary !== undefined) {
    dto.itinerarioResumido = formData.itinerarioResumido || formData.itinerarySummary;
  }
  if (formData.politicasCancelacion !== undefined || formData.cancellationPolicy !== undefined) {
    dto.politicasCancelacion = formData.politicasCancelacion || formData.cancellationPolicy;
  }
  if (formData.estado !== undefined) {
    dto.estado = formData.estado;
  }

  return dto;
}

// ==================== HELPERS ====================

/**
 * Extraer ID numérico de string
 */
export function extractPackageId(id: string | number): number {
  if (typeof id === 'number') return id;
  const numId = parseInt(id);
  if (isNaN(numId)) throw new Error(`ID de paquete inválido: ${id}`);
  return numId;
}

/**
 * Formatear precio para mostrar
 * 1500.50 -> "$1,500.50"
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Formatear duración para mostrar
 * 5 -> "5 días / 4 noches"
 */
export function formatDuration(days: number): string {
  const nights = Math.max(0, days - 1);
  return `${days} día${days !== 1 ? 's' : ''} / ${nights} noche${nights !== 1 ? 's' : ''}`;
}

/**
 * Obtener etiqueta de nivel de dificultad
 */
export function getDifficultyLabel(nivel: string | undefined): string {
  const labels: Record<string, string> = {
    'bajo': '🟢 Bajo',
    'medio': '🟡 Medio',
    'alto': '🔴 Alto',
  };
  return labels[nivel?.toLowerCase() || ''] || '⚪ No especificado';
}

/**
 * Obtener etiqueta de tipo de paquete
 */
export function getPackageTypeLabel(tipo: string | undefined): string {
  const labels: Record<string, string> = {
    'aventura': '🏔️ Aventura',
    'familiar': '👨‍👩‍👧‍👦 Familiar',
    'empresarial': '💼 Empresarial',
    'lujo': '💎 Lujo',
    'cultural': '🎭 Cultural',
    'ecologico': '🌿 Ecológico',
    'romantico': '💕 Romántico',
  };
  return labels[tipo?.toLowerCase() || ''] || '📦 Otro';
}
