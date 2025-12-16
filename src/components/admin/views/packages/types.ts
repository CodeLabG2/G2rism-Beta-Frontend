export type PackageStatus = 'active' | 'inactive' | 'draft' | 'archived';
export type PackageCategory = 'adventure' | 'relaxation' | 'cultural' | 'family' | 'romantic' | 'business';
export type Season = 'high' | 'mid' | 'low';

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
}

export interface Itinerary {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: ('breakfast' | 'lunch' | 'dinner')[];
}

export interface PackagePrice {
  season: Season;
  pricePerPerson: number;
  discount?: number;
}

export interface TourPackage {
  id: string;
  code: string;
  name: string;
  destination: Destination;
  description: string;
  duration: number; // in days
  nights: number;
  category: PackageCategory;
  status: PackageStatus;
  images: string[];
  thumbnailImage: string;
  
  // Pricing
  basePrice: number;
  prices: PackagePrice[];
  
  // Inclusions/Exclusions
  inclusions: string[];
  exclusions: string[];
  
  // Itinerary
  itinerary: Itinerary[];
  
  // Details
  maxGroupSize: number;
  minGroupSize: number;
  availableSpots: number;
  
  // Dates
  startDates: string[]; // Available start dates
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  
  // Stats
  totalSold: number;
  rating: number;
  reviewsCount: number;
}

export interface PackageFormData {
  name: string;
  destinationId: string;
  description: string;
  duration: number;
  category: PackageCategory;
  status: PackageStatus;
  basePrice: number;
  maxGroupSize: number;
  minGroupSize: number;
  availableSpots: number;
  inclusions: string[];
  exclusions: string[];
  startDates: string[];
}

export interface PackageFilters {
  search: string;
  destination: string | 'all';
  category: PackageCategory | 'all';
  status: PackageStatus | 'all';
  minDuration?: number;
  maxDuration?: number;
  minPrice?: number;
  maxPrice?: number;
}
