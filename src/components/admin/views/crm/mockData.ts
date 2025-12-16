import { Lead, CRMStats, LeadStatus, LeadSource } from './types';

export const mockLeads: Lead[] = [
  {
    id: 'LEAD-001',
    code: 'L000001',
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    fullName: 'Carlos Rodríguez',
    documentType: 'CC',
    documentNumber: '1234567890',
    dateOfBirth: '1985-06-15',
    contact: {
      email: 'carlos.rodriguez@email.com',
      phone: '+57 300 123 4567',
      mobile: '+57 310 987 6543',
      whatsapp: '+57 300 123 4567',
      preferredChannel: 'whatsapp'
    },
    address: {
      street: 'Calle 100 #15-45',
      city: 'Bogotá',
      state: 'Cundinamarca',
      country: 'Colombia',
      postalCode: '110111'
    },
    status: 'negotiation',
    source: 'website',
    clientType: 'individual',
    priority: 'high',
    interestedIn: ['PKG-001', 'PKG-002'],
    estimatedValue: 15000000,
    probability: 75,
    travelDate: '2025-03-15',
    numberOfTravelers: 2,
    assignedTo: 'admin',
    tags: ['familia', 'primera-vez', 'presupuesto-alto'],
    score: 85,
    interactions: [
      {
        id: 'INT-001',
        type: 'call',
        date: '2024-12-02T10:30:00',
        subject: 'Consulta inicial sobre paquete Eje Cafetero',
        description: 'Cliente interesado en paquete familiar para el Eje Cafetero. Discutimos opciones de hospedaje y actividades. Mostró especial interés en experiencias de café y actividades al aire libre.',
        duration: 25,
        nextFollowUp: '2024-12-05',
        outcome: 'Interesado',
        createdBy: 'admin'
      },
      {
        id: 'INT-002',
        type: 'email',
        date: '2024-12-01T14:15:00',
        subject: 'Envío de cotización Eje Cafetero',
        description: 'Se envió cotización detallada con dos opciones: Plan Estándar y Plan Premium. Incluye itinerario completo y políticas de cancelación.',
        createdBy: 'admin'
      },
      {
        id: 'INT-003',
        type: 'whatsapp',
        date: '2024-11-30T16:45:00',
        subject: 'Primera comunicación',
        description: 'Cliente contactó vía WhatsApp solicitando información sobre paquetes para marzo 2025.',
        duration: 10,
        createdBy: 'admin'
      }
    ],
    notes: [
      {
        id: 'NOTE-001',
        content: 'Cliente muy organizado, valora la puntualidad y el servicio personalizado. Prefiere pagar con tarjeta de crédito.',
        isPinned: true,
        createdAt: '2024-11-30T17:00:00',
        createdBy: 'admin'
      },
      {
        id: 'NOTE-002',
        content: 'Solicita actividades aptas para niños de 8 y 12 años. Evitar actividades de alto riesgo.',
        isPinned: true,
        createdAt: '2024-12-01T09:00:00',
        createdBy: 'admin'
      }
    ],
    tasks: [
      {
        id: 'TASK-001',
        title: 'Enviar opciones de hospedaje adicionales',
        description: 'Buscar hoteles con piscina y áreas de juego para niños',
        dueDate: '2024-12-04',
        priority: 'high',
        completed: false,
        assignedTo: 'admin',
        createdBy: 'admin',
        createdAt: '2024-12-02T11:00:00'
      },
      {
        id: 'TASK-002',
        title: 'Confirmar disponibilidad de vuelos',
        description: 'Verificar precios y disponibilidad para marzo 15-22',
        dueDate: '2024-12-03',
        priority: 'high',
        completed: true,
        completedAt: '2024-12-03T10:30:00',
        assignedTo: 'admin',
        createdBy: 'admin',
        createdAt: '2024-12-02T11:05:00'
      }
    ],
    documents: [
      {
        id: 'DOC-001',
        name: 'Cotización_EjeCafetero_V1.pdf',
        type: 'application/pdf',
        size: 245678,
        uploadedAt: '2024-12-01T14:15:00',
        uploadedBy: 'admin',
        url: '#'
      }
    ],
    lastContactDate: '2024-12-02T10:30:00',
    nextFollowUpDate: '2024-12-05',
    createdAt: '2024-11-30T16:45:00',
    updatedAt: '2024-12-02T10:30:00',
    createdBy: 'admin',
    totalInteractions: 3,
    totalSpent: 0,
    totalBookings: 0
  },
  {
    id: 'LEAD-002',
    code: 'L000002',
    firstName: 'María',
    lastName: 'González',
    fullName: 'María González',
    documentType: 'CC',
    documentNumber: '9876543210',
    contact: {
      email: 'maria.gonzalez@empresa.com',
      phone: '+57 320 456 7890',
      preferredChannel: 'email'
    },
    status: 'qualified',
    source: 'referral',
    clientType: 'corporate',
    priority: 'high',
    interestedIn: ['PKG-003'],
    estimatedValue: 25000000,
    probability: 60,
    travelDate: '2025-04-10',
    numberOfTravelers: 15,
    assignedTo: 'admin',
    tags: ['corporativo', 'team-building', 'urgente'],
    score: 78,
    interactions: [
      {
        id: 'INT-004',
        type: 'meeting',
        date: '2024-12-01T15:00:00',
        subject: 'Reunión presencial - Team Building Cartagena',
        description: 'Reunión con gerente de RRHH para planificar retiro corporativo. Requieren actividades de integración, conferencia y tiempo libre.',
        duration: 60,
        nextFollowUp: '2024-12-06',
        createdBy: 'admin'
      }
    ],
    notes: [
      {
        id: 'NOTE-003',
        content: 'Empresa de tecnología con 150 empleados. Presupuesto aprobado. Buscan experiencia premium.',
        isPinned: true,
        createdAt: '2024-12-01T16:00:00',
        createdBy: 'admin'
      }
    ],
    tasks: [
      {
        id: 'TASK-003',
        title: 'Preparar propuesta corporativa Cartagena',
        description: 'Incluir opciones de hoteles, transporte privado y actividades',
        dueDate: '2024-12-06',
        priority: 'urgent',
        completed: false,
        assignedTo: 'admin',
        createdBy: 'admin',
        createdAt: '2024-12-01T16:30:00'
      }
    ],
    documents: [],
    lastContactDate: '2024-12-01T15:00:00',
    nextFollowUpDate: '2024-12-06',
    createdAt: '2024-11-28T09:00:00',
    updatedAt: '2024-12-01T16:00:00',
    createdBy: 'admin',
    totalInteractions: 1,
    totalSpent: 0,
    totalBookings: 0
  },
  {
    id: 'LEAD-003',
    code: 'L000003',
    firstName: 'Andrea',
    lastName: 'Martínez',
    fullName: 'Andrea Martínez',
    documentType: 'CC',
    documentNumber: '5555444433',
    contact: {
      email: 'andrea.martinez@email.com',
      phone: '+57 315 222 3333',
      whatsapp: '+57 315 222 3333',
      preferredChannel: 'whatsapp'
    },
    status: 'contacted',
    source: 'social-media',
    clientType: 'individual',
    priority: 'medium',
    estimatedValue: 8000000,
    probability: 40,
    travelDate: '2025-05-20',
    numberOfTravelers: 2,
    assignedTo: 'admin',
    tags: ['luna-de-miel', 'romántico', 'instagram'],
    score: 65,
    interactions: [
      {
        id: 'INT-005',
        type: 'whatsapp',
        date: '2024-11-29T11:20:00',
        subject: 'Consulta por Instagram',
        description: 'Contacto inicial desde Instagram. Interesada en paquete para luna de miel en San Andrés.',
        duration: 15,
        nextFollowUp: '2024-12-04',
        createdBy: 'admin'
      }
    ],
    notes: [],
    tasks: [
      {
        id: 'TASK-004',
        title: 'Enviar opciones románticas San Andrés',
        description: 'Preparar propuesta con hoteles frente al mar y actividades para parejas',
        dueDate: '2024-12-04',
        priority: 'medium',
        completed: false,
        assignedTo: 'admin',
        createdBy: 'admin',
        createdAt: '2024-11-29T12:00:00'
      }
    ],
    documents: [],
    lastContactDate: '2024-11-29T11:20:00',
    nextFollowUpDate: '2024-12-04',
    createdAt: '2024-11-29T11:20:00',
    updatedAt: '2024-11-29T12:00:00',
    createdBy: 'admin',
    totalInteractions: 1,
    totalSpent: 0,
    totalBookings: 0
  },
  {
    id: 'LEAD-004',
    code: 'L000004',
    firstName: 'Roberto',
    lastName: 'Silva',
    fullName: 'Roberto Silva',
    documentType: 'CC',
    documentNumber: '7777888899',
    contact: {
      email: 'roberto.silva@email.com',
      phone: '+57 318 999 8888',
      preferredChannel: 'email'
    },
    status: 'proposal',
    source: 'website',
    clientType: 'individual',
    priority: 'medium',
    estimatedValue: 12000000,
    probability: 65,
    travelDate: '2025-06-01',
    numberOfTravelers: 4,
    assignedTo: 'admin',
    tags: ['familia', 'aventura', 'naturaleza'],
    score: 72,
    interactions: [
      {
        id: 'INT-006',
        type: 'call',
        date: '2024-11-27T10:00:00',
        subject: 'Seguimiento propuesta Tayrona',
        description: 'Discusión sobre itinerario y opciones de transporte. Cliente solicita incluir Ciudad Perdida.',
        duration: 30,
        nextFollowUp: '2024-12-07',
        createdBy: 'admin'
      },
      {
        id: 'INT-007',
        type: 'email',
        date: '2024-11-25T14:00:00',
        subject: 'Envío propuesta Tayrona + Santa Marta',
        description: 'Propuesta completa con dos opciones de paquete.',
        createdBy: 'admin'
      }
    ],
    notes: [
      {
        id: 'NOTE-004',
        content: 'Familia activa, buscan aventura. Hijos de 14 y 16 años.',
        isPinned: false,
        createdAt: '2024-11-25T14:30:00',
        createdBy: 'admin'
      }
    ],
    tasks: [],
    documents: [
      {
        id: 'DOC-002',
        name: 'Propuesta_Tayrona_SantaMarta.pdf',
        type: 'application/pdf',
        size: 312456,
        uploadedAt: '2024-11-25T14:00:00',
        uploadedBy: 'admin',
        url: '#'
      }
    ],
    lastContactDate: '2024-11-27T10:00:00',
    nextFollowUpDate: '2024-12-07',
    createdAt: '2024-11-22T09:15:00',
    updatedAt: '2024-11-27T10:30:00',
    createdBy: 'admin',
    totalInteractions: 2,
    totalSpent: 0,
    totalBookings: 0
  },
  {
    id: 'LEAD-005',
    code: 'L000005',
    firstName: 'Diana',
    lastName: 'López',
    fullName: 'Diana López',
    documentType: 'CC',
    documentNumber: '1111222233',
    contact: {
      email: 'diana.lopez@email.com',
      phone: '+57 312 111 2222',
      preferredChannel: 'phone'
    },
    status: 'new',
    source: 'phone',
    clientType: 'individual',
    priority: 'low',
    estimatedValue: 5000000,
    probability: 30,
    assignedTo: 'admin',
    tags: ['consulta-inicial'],
    score: 45,
    interactions: [
      {
        id: 'INT-008',
        type: 'call',
        date: '2024-12-03T09:00:00',
        subject: 'Primera llamada',
        description: 'Llamada de consulta general. Interesada en conocer opciones para viajar en diciembre.',
        duration: 10,
        nextFollowUp: '2024-12-10',
        createdBy: 'admin'
      }
    ],
    notes: [],
    tasks: [
      {
        id: 'TASK-005',
        title: 'Enviar catálogo de destinos disponibles',
        description: 'Enviar información general por email',
        dueDate: '2024-12-10',
        priority: 'low',
        completed: false,
        assignedTo: 'admin',
        createdBy: 'admin',
        createdAt: '2024-12-03T09:15:00'
      }
    ],
    documents: [],
    lastContactDate: '2024-12-03T09:00:00',
    nextFollowUpDate: '2024-12-10',
    createdAt: '2024-12-03T09:00:00',
    updatedAt: '2024-12-03T09:15:00',
    createdBy: 'admin',
    totalInteractions: 1,
    totalSpent: 0,
    totalBookings: 0
  },
  {
    id: 'LEAD-006',
    code: 'L000006',
    firstName: 'Jorge',
    lastName: 'Ramírez',
    fullName: 'Jorge Ramírez',
    documentType: 'CC',
    documentNumber: '3333444455',
    contact: {
      email: 'jorge.ramirez@email.com',
      phone: '+57 314 333 4444',
      preferredChannel: 'email'
    },
    status: 'won',
    source: 'referral',
    clientType: 'individual',
    priority: 'medium',
    estimatedValue: 18000000,
    probability: 100,
    travelDate: '2025-02-10',
    numberOfTravelers: 3,
    assignedTo: 'admin',
    tags: ['cliente-convertido', 'familia', 'vip'],
    score: 95,
    interactions: [
      {
        id: 'INT-009',
        type: 'call',
        date: '2024-11-20T11:00:00',
        subject: 'Confirmación de reserva',
        description: 'Cliente confirmó reserva y realizó pago del 50% de anticipo.',
        duration: 20,
        createdBy: 'admin'
      }
    ],
    notes: [
      {
        id: 'NOTE-005',
        content: 'Excelente cliente. Solicitó seguro de viaje completo. Viene referido por Carlos Rodríguez.',
        isPinned: true,
        createdAt: '2024-11-15T10:00:00',
        createdBy: 'admin'
      }
    ],
    tasks: [],
    documents: [
      {
        id: 'DOC-003',
        name: 'Voucher_Reserva_Confirmada.pdf',
        type: 'application/pdf',
        size: 189234,
        uploadedAt: '2024-11-20T12:00:00',
        uploadedBy: 'admin',
        url: '#'
      }
    ],
    lastContactDate: '2024-11-20T11:00:00',
    conversionDate: '2024-11-20',
    createdAt: '2024-11-15T09:30:00',
    updatedAt: '2024-11-20T12:00:00',
    createdBy: 'admin',
    totalInteractions: 4,
    totalSpent: 18000000,
    totalBookings: 1
  },
  {
    id: 'LEAD-007',
    code: 'L000007',
    firstName: 'Patricia',
    lastName: 'Herrera',
    fullName: 'Patricia Herrera',
    documentType: 'CC',
    documentNumber: '6666777788',
    contact: {
      email: 'patricia.herrera@email.com',
      phone: '+57 317 666 7777',
      preferredChannel: 'email'
    },
    status: 'lost',
    source: 'website',
    clientType: 'individual',
    priority: 'low',
    estimatedValue: 10000000,
    probability: 0,
    assignedTo: 'admin',
    tags: ['presupuesto', 'precio'],
    score: 30,
    interactions: [
      {
        id: 'INT-010',
        type: 'email',
        date: '2024-11-10T16:00:00',
        subject: 'Cliente decidió no continuar',
        description: 'Cliente informó que encontró opción más económica con otra agencia.',
        createdBy: 'admin'
      }
    ],
    notes: [
      {
        id: 'NOTE-006',
        content: 'Muy sensible al precio. No valoró servicios adicionales incluidos.',
        isPinned: false,
        createdAt: '2024-11-10T16:30:00',
        createdBy: 'admin'
      }
    ],
    tasks: [],
    documents: [],
    lastContactDate: '2024-11-10T16:00:00',
    createdAt: '2024-11-01T14:00:00',
    updatedAt: '2024-11-10T16:30:00',
    createdBy: 'admin',
    totalInteractions: 3,
    totalSpent: 0,
    totalBookings: 0
  },
  {
    id: 'LEAD-008',
    code: 'L000008',
    firstName: 'Luis',
    lastName: 'Mendoza',
    fullName: 'Luis Mendoza',
    documentType: 'CC',
    documentNumber: '9999000011',
    contact: {
      email: 'luis.mendoza@email.com',
      phone: '+57 319 999 0000',
      whatsapp: '+57 319 999 0000',
      preferredChannel: 'whatsapp'
    },
    status: 'qualified',
    source: 'event',
    clientType: 'individual',
    priority: 'high',
    estimatedValue: 20000000,
    probability: 70,
    travelDate: '2025-07-15',
    numberOfTravelers: 6,
    assignedTo: 'admin',
    tags: ['grupo', 'aniversario', 'premium'],
    score: 82,
    interactions: [
      {
        id: 'INT-011',
        type: 'meeting',
        date: '2024-11-18T17:00:00',
        subject: 'Reunión en feria de turismo',
        description: 'Conocimos al cliente en la feria Anato. Interesado en viaje grupal de aniversario.',
        duration: 45,
        nextFollowUp: '2024-12-08',
        createdBy: 'admin'
      }
    ],
    notes: [
      {
        id: 'NOTE-007',
        content: 'Grupo de amigos celebrando 25 años de graduación. Buscan experiencia memorable.',
        isPinned: true,
        createdAt: '2024-11-18T18:00:00',
        createdBy: 'admin'
      }
    ],
    tasks: [
      {
        id: 'TASK-006',
        title: 'Diseñar itinerario personalizado Caribe',
        description: 'Combinar Cartagena y San Andrés con actividades exclusivas',
        dueDate: '2024-12-08',
        priority: 'high',
        completed: false,
        assignedTo: 'admin',
        createdBy: 'admin',
        createdAt: '2024-11-18T18:15:00'
      }
    ],
    documents: [],
    lastContactDate: '2024-11-18T17:00:00',
    nextFollowUpDate: '2024-12-08',
    createdAt: '2024-11-18T17:00:00',
    updatedAt: '2024-11-18T18:15:00',
    createdBy: 'admin',
    totalInteractions: 1,
    totalSpent: 0,
    totalBookings: 0
  }
];

export const mockCRMStats: CRMStats = {
  totalLeads: mockLeads.length,
  activeLeads: mockLeads.filter(l => !['won', 'lost'].includes(l.status)).length,
  convertedLeads: mockLeads.filter(l => l.status === 'won').length,
  conversionRate: (mockLeads.filter(l => l.status === 'won').length / mockLeads.length) * 100,
  averageResponseTime: 2.5,
  averageLeadScore: mockLeads.reduce((sum, lead) => sum + lead.score, 0) / mockLeads.length,
  totalEstimatedValue: mockLeads.reduce((sum, lead) => sum + lead.estimatedValue, 0),
  
  leadsByStatus: [
    { status: 'new', count: mockLeads.filter(l => l.status === 'new').length, percentage: 0 },
    { status: 'contacted', count: mockLeads.filter(l => l.status === 'contacted').length, percentage: 0 },
    { status: 'qualified', count: mockLeads.filter(l => l.status === 'qualified').length, percentage: 0 },
    { status: 'proposal', count: mockLeads.filter(l => l.status === 'proposal').length, percentage: 0 },
    { status: 'negotiation', count: mockLeads.filter(l => l.status === 'negotiation').length, percentage: 0 },
    { status: 'won', count: mockLeads.filter(l => l.status === 'won').length, percentage: 0 },
    { status: 'lost', count: mockLeads.filter(l => l.status === 'lost').length, percentage: 0 }
  ].map(item => ({
    ...item,
    percentage: (item.count / mockLeads.length) * 100
  })) as any,
  
  leadsBySource: [
    { source: 'website', count: mockLeads.filter(l => l.source === 'website').length, percentage: 0 },
    { source: 'referral', count: mockLeads.filter(l => l.source === 'referral').length, percentage: 0 },
    { source: 'social-media', count: mockLeads.filter(l => l.source === 'social-media').length, percentage: 0 },
    { source: 'email', count: mockLeads.filter(l => l.source === 'email').length, percentage: 0 },
    { source: 'phone', count: mockLeads.filter(l => l.source === 'phone').length, percentage: 0 },
    { source: 'event', count: mockLeads.filter(l => l.source === 'event').length, percentage: 0 }
  ].map(item => ({
    ...item,
    percentage: (item.count / mockLeads.length) * 100
  })).filter(item => item.count > 0) as any,
  
  recentActivity: {
    leadsCreatedToday: 1,
    interactionsToday: 3,
    tasksToday: 2,
    followUpsToday: 4
  }
};
