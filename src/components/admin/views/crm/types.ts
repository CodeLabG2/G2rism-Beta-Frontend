export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
export type LeadSource = 'website' | 'referral' | 'social-media' | 'email' | 'phone' | 'event' | 'other';
export type ClientType = 'individual' | 'corporate' | 'travel-agency' | 'group';
export type InteractionType = 'call' | 'email' | 'meeting' | 'whatsapp' | 'note' | 'task';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface ClientContact {
  phone: string;
  mobile?: string;
  email: string;
  alternativeEmail?: string;
  whatsapp?: string;
  preferredChannel: 'email' | 'phone' | 'whatsapp';
}

export interface ClientAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface Interaction {
  id: string;
  type: InteractionType;
  date: string;
  subject: string;
  description: string;
  duration?: number; // in minutes
  outcome?: string;
  nextFollowUp?: string;
  createdBy: string;
  attachments?: string[];
}

export interface Note {
  id: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
  completedAt?: string;
  assignedTo: string;
  createdBy: string;
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  url: string;
}

export interface Lead {
  id: string;
  code: string;
  
  // Basic Info
  firstName: string;
  lastName: string;
  fullName: string;
  documentType: 'CC' | 'CE' | 'NIT' | 'Pasaporte';
  documentNumber: string;
  dateOfBirth?: string;
  
  // Contact
  contact: ClientContact;
  address?: ClientAddress;
  
  // Lead Info
  status: LeadStatus;
  source: LeadSource;
  clientType: ClientType;
  priority: Priority;
  
  // Business
  interestedIn?: string[]; // Package IDs or destinations
  estimatedValue: number;
  probability: number; // 0-100
  travelDate?: string;
  numberOfTravelers?: number;
  
  // Relationship
  assignedTo: string;
  tags: string[];
  score: number; // Lead scoring 0-100
  
  // Tracking
  interactions: Interaction[];
  notes: Note[];
  tasks: Task[];
  documents: Document[];
  
  // History
  lastContactDate?: string;
  nextFollowUpDate?: string;
  conversionDate?: string;
  
  // Dates
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  
  // Stats
  totalInteractions: number;
  totalSpent: number;
  totalBookings: number;
}

export interface CRMStats {
  totalLeads: number;
  activeLeads: number;
  convertedLeads: number;
  conversionRate: number;
  averageResponseTime: number; // hours
  averageLeadScore: number;
  totalEstimatedValue: number;
  
  // By Status
  leadsByStatus: {
    status: LeadStatus;
    count: number;
    percentage: number;
  }[];
  
  // By Source
  leadsBySource: {
    source: LeadSource;
    count: number;
    percentage: number;
  }[];
  
  // Recent Activity
  recentActivity: {
    leadsCreatedToday: number;
    interactionsToday: number;
    tasksToday: number;
    followUpsToday: number;
  };
}

export interface LeadFormData {
  firstName: string;
  lastName: string;
  documentType: 'CC' | 'CE' | 'NIT' | 'Pasaporte';
  documentNumber: string;
  email: string;
  phone: string;
  mobile?: string;
  whatsapp?: string;
  clientType: ClientType;
  source: LeadSource;
  priority: Priority;
  status: LeadStatus;
  assignedTo: string;
  estimatedValue: number;
  probability: number;
  travelDate?: string;
  numberOfTravelers?: number;
  tags: string[];
  notes?: string;
}

export interface LeadFilters {
  search: string;
  status: LeadStatus | 'all';
  source: LeadSource | 'all';
  clientType: ClientType | 'all';
  priority: Priority | 'all';
  assignedTo: string | 'all';
  dateFrom?: string;
  dateTo?: string;
  minValue?: number;
  maxValue?: number;
  minProbability?: number;
  tags?: string[];
}

export interface PipelineStage {
  status: LeadStatus;
  label: string;
  count: number;
  value: number;
  color: string;
}
