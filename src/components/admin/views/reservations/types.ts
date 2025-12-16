export type ReservationType = 'flight' | 'hotel' | 'package' | 'transport';
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Flight {
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  class: 'economy' | 'business' | 'first';
}

export interface Hotel {
  name: string;
  location: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  nights: number;
}

export interface TourPackage {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  duration: number;
  includesFlights: boolean;
  includesHotel: boolean;
}

export interface Reservation {
  id: string;
  code: string;
  type: ReservationType;
  client: Client;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  createdBy: string;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  notes?: string;
  
  // Type-specific details
  flight?: Flight;
  hotel?: Hotel;
  package?: TourPackage;
}

export interface ReservationFormData {
  type: ReservationType;
  clientId: string;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  paidAmount: number;
  notes?: string;
  
  // Flight data
  flightAirline?: string;
  flightNumber?: string;
  flightOrigin?: string;
  flightDestination?: string;
  flightDeparture?: string;
  flightArrival?: string;
  flightClass?: 'economy' | 'business' | 'first';
  
  // Hotel data
  hotelName?: string;
  hotelLocation?: string;
  hotelCheckIn?: string;
  hotelCheckOut?: string;
  hotelRoomType?: string;
  
  // Package data
  packageName?: string;
  packageDestination?: string;
  packageStartDate?: string;
  packageEndDate?: string;
  packageIncludesFlights?: boolean;
  packageIncludesHotel?: boolean;
}

export interface ReservationFilters {
  search: string;
  type: ReservationType | 'all';
  status: ReservationStatus | 'all';
  paymentStatus: PaymentStatus | 'all';
  dateFrom?: string;
  dateTo?: string;
}
