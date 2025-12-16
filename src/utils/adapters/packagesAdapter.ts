import type { 
  PaqueteTuristico, 
  CreatePaqueteDTO,
  UpdatePaqueteDTO,
  CategoriaPaquete,
  EstadoPaquete,
  Temporada,
  ItinerarioDia,
  PrecioPorTemporada
} from '../../services/api/packagesService';

import type { 
  TourPackage, 
  PackageFormData,
  PackageStatus,
  PackageCategory,
  Season,
  Itinerary,
  PackagePrice
} from '../../components/admin/views/packages/types';

// ==================== MAPEOS DE TIPOS ====================

const CATEGORY_MAP: Record<PackageCategory, CategoriaPaquete> = {
  'adventure': 'Aventura',
  'relaxation': 'Relax',
  'cultural': 'Cultural',
  'family': 'Familiar',
  'romantic': 'Romantico',
  'business': 'Negocios',
};

const CATEGORY_REVERSE_MAP: Record<CategoriaPaquete, PackageCategory> = {
  'Aventura': 'adventure',
  'Relax': 'relaxation',
  'Cultural': 'cultural',
  'Familiar': 'family',
  'Romantico': 'romantic',
  'Negocios': 'business',
};

const STATUS_MAP: Record<PackageStatus, EstadoPaquete> = {
  'active': 'Activo',
  'inactive': 'Inactivo',
  'draft': 'Borrador',
  'archived': 'Archivado',
};

const STATUS_REVERSE_MAP: Record<EstadoPaquete, PackageStatus> = {
  'Activo': 'active',
  'Inactivo': 'inactive',
  'Borrador': 'draft',
  'Archivado': 'archived',
};

const SEASON_MAP: Record<Season, Temporada> = {
  'high': 'Alta',
  'mid': 'Media',
  'low': 'Baja',
};

const SEASON_REVERSE_MAP: Record<Temporada, Season> = {
  'Alta': 'high',
  'Media': 'mid',
  'Baja': 'low',
};

// ==================== FUNCIONES DE CONVERSIÓN ====================

/**
 * Convierte un paquete de la API al formato de UI
 */
export function apiPackageToUiPackage(apiPackage: PaqueteTuristico): TourPackage {
  return {
    id: apiPackage.idPaquete.toString(),
    code: apiPackage.codigo,
    name: apiPackage.nombre,
    destination: apiPackage.destino ? {
      id: apiPackage.destino.idDestino.toString(),
      name: apiPackage.destino.nombre,
      country: apiPackage.destino.pais,
      description: apiPackage.destino.descripcion || '',
    } : {
      id: apiPackage.idDestino.toString(),
      name: 'Destino desconocido',
      country: 'N/A',
      description: '',
    },
    description: apiPackage.descripcion,
    duration: apiPackage.duracion,
    nights: apiPackage.noches,
    category: CATEGORY_REVERSE_MAP[apiPackage.categoria] || 'adventure',
    status: STATUS_REVERSE_MAP[apiPackage.estado] || 'draft',
    images: apiPackage.imagenes || [],
    thumbnailImage: apiPackage.imagenPrincipal || (apiPackage.imagenes?.[0] || ''),
    
    // Pricing
    basePrice: apiPackage.precioBase,
    prices: (apiPackage.precios || []).map(precio => ({
      season: SEASON_REVERSE_MAP[precio.temporada] || 'mid',
      pricePerPerson: precio.precioPorPersona,
      discount: precio.descuento,
    })),
    
    // Inclusions/Exclusions
    inclusions: apiPackage.inclusiones || [],
    exclusions: apiPackage.exclusiones || [],
    
    // Itinerary
    itinerary: (apiPackage.itinerario || []).map(dia => ({
      day: dia.dia,
      title: dia.titulo,
      description: dia.descripcion,
      activities: dia.actividades || [],
      meals: dia.comidas || [] as ('breakfast' | 'lunch' | 'dinner')[],
    })),
    
    // Details
    maxGroupSize: apiPackage.maxPersonas,
    minGroupSize: apiPackage.minPersonas,
    availableSpots: apiPackage.cuposDisponibles,
    
    // Dates
    startDates: apiPackage.fechasDisponibles || [],
    createdAt: apiPackage.fechaCreacion,
    updatedAt: apiPackage.fechaActualizacion,
    createdBy: apiPackage.creadoPor,
    
    // Stats
    totalSold: apiPackage.totalVendidos || 0,
    rating: apiPackage.calificacion || 0,
    reviewsCount: apiPackage.numeroResenas || 0,
  };
}

/**
 * Convierte múltiples paquetes de la API al formato de UI
 */
export function apiPackagesToUiPackages(apiPackages: PaqueteTuristico[]): TourPackage[] {
  return apiPackages.map(apiPackageToUiPackage);
}

/**
 * Convierte datos de formulario UI a DTO para crear paquete
 */
export function uiFormToCreateDTO(formData: PackageFormData): CreatePaqueteDTO {
  return {
    nombre: formData.name,
    idDestino: parseInt(formData.destinationId),
    descripcion: formData.description,
    duracion: formData.duration,
    categoria: CATEGORY_MAP[formData.category] || 'Aventura',
    estado: STATUS_MAP[formData.status] || 'Borrador',
    precioBase: formData.basePrice,
    maxPersonas: formData.maxGroupSize,
    minPersonas: formData.minGroupSize,
    cuposDisponibles: formData.availableSpots,
    inclusiones: formData.inclusions || [],
    exclusiones: formData.exclusions || [],
    fechasDisponibles: formData.startDates || [],
  };
}

/**
 * Convierte datos de formulario UI a DTO para actualizar paquete
 */
export function uiFormToUpdateDTO(formData: Partial<PackageFormData>): UpdatePaqueteDTO {
  const dto: UpdatePaqueteDTO = {};
  
  if (formData.name !== undefined) dto.nombre = formData.name;
  if (formData.destinationId !== undefined) dto.idDestino = parseInt(formData.destinationId);
  if (formData.description !== undefined) dto.descripcion = formData.description;
  if (formData.duration !== undefined) dto.duracion = formData.duration;
  if (formData.category !== undefined) dto.categoria = CATEGORY_MAP[formData.category];
  if (formData.status !== undefined) dto.estado = STATUS_MAP[formData.status];
  if (formData.basePrice !== undefined) dto.precioBase = formData.basePrice;
  if (formData.maxGroupSize !== undefined) dto.maxPersonas = formData.maxGroupSize;
  if (formData.minGroupSize !== undefined) dto.minPersonas = formData.minGroupSize;
  if (formData.availableSpots !== undefined) dto.cuposDisponibles = formData.availableSpots;
  if (formData.inclusions !== undefined) dto.inclusiones = formData.inclusions;
  if (formData.exclusions !== undefined) dto.exclusiones = formData.exclusions;
  if (formData.startDates !== undefined) dto.fechasDisponibles = formData.startDates;
  
  return dto;
}

/**
 * Convierte itinerario de UI a formato API
 */
export function uiItineraryToApiItinerary(uiItinerary: Itinerary[]): ItinerarioDia[] {
  return uiItinerary.map(dia => ({
    dia: dia.day,
    titulo: dia.title,
    descripcion: dia.description,
    actividades: dia.activities,
    comidas: dia.meals,
  }));
}

/**
 * Convierte precios de UI a formato API
 */
export function uiPricesToApiPrices(uiPrices: PackagePrice[]): PrecioPorTemporada[] {
  return uiPrices.map(precio => ({
    temporada: SEASON_MAP[precio.season] || 'Media',
    precioPorPersona: precio.pricePerPerson,
    descuento: precio.discount,
  }));
}

/**
 * Extrae el ID numérico de un string (útil para conversiones)
 */
export function extractPackageId(id: string | number): number {
  if (typeof id === 'number') return id;
  const numId = parseInt(id);
  if (isNaN(numId)) throw new Error(`ID inválido: ${id}`);
  return numId;
}

/**
 * Convierte categoría de UI a API
 */
export function uiCategoryToApiCategory(uiCategory: PackageCategory): CategoriaPaquete {
  return CATEGORY_MAP[uiCategory] || 'Aventura';
}

/**
 * Convierte estado de UI a API
 */
export function uiStatusToApiStatus(uiStatus: PackageStatus): EstadoPaquete {
  return STATUS_MAP[uiStatus] || 'Borrador';
}

/**
 * Convierte categoría de API a UI
 */
export function apiCategoryToUiCategory(apiCategory: CategoriaPaquete): PackageCategory {
  return CATEGORY_REVERSE_MAP[apiCategory] || 'adventure';
}

/**
 * Convierte estado de API a UI
 */
export function apiStatusToUiStatus(apiStatus: EstadoPaquete): PackageStatus {
  return STATUS_REVERSE_MAP[apiStatus] || 'draft';
}
