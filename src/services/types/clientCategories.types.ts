// ===========================
// CLIENT CATEGORIES TYPES
// ===========================

/**
 * Categoría de cliente
 */
export interface ClientCategory {
  idCategoria: number;
  nombre: string;
  descripcion?: string;
  colorHex: string;
  descuentoPorcentaje: number;
  beneficios?: string;
  criteriosClasificacion?: string;
  estado: boolean;
  fechaCreacion: string;
  fechaModificacion?: string;
}

/**
 * DTO para crear una categoría
 */
export interface CreateClientCategoryDto {
  nombre: string;
  descripcion?: string;
  colorHex: string;
  descuentoPorcentaje: number;
  beneficios?: string;
  criteriosClasificacion?: string;
  estado?: boolean;
}

/**
 * DTO para actualizar una categoría
 */
export interface UpdateClientCategoryDto {
  nombre?: string;
  descripcion?: string;
  colorHex?: string;
  descuentoPorcentaje?: number;
  beneficios?: string;
  criteriosClasificacion?: string;
  estado?: boolean;
}

/**
 * Filtros para categorías
 */
export interface ClientCategoriesFilters {
  estado?: boolean;
  descuentoMinimo?: number;
  descuentoMaximo?: number;
}
