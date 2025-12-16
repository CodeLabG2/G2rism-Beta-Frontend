import { useState, useEffect } from 'react';
import { Card } from '../../../ui/Card';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';
import { Select } from '../../../ui/Select';
import { Badge } from '../../../ui/Badge';
import { toast } from '../../../ui/Toast';
import { LeadModal } from './LeadModal';
import { LeadDetails } from './LeadDetails';
import { PipelineView } from './PipelineView';
import { 
  Lead, 
  LeadFilters, 
  CRMStats,
  LeadStatus,
  LeadSource,
  Priority
} from './types';
import { mockCRMStats } from './mockData';
import { useClients } from '../../../../hooks/useClients';
import {
  apiClientsToUiLeads,
  uiLeadFormToApiCreateClient,
  uiLeadFormToApiUpdateClient,
  extractClientIdFromLeadId,
} from '../../../../utils/adapters/clientsAdapter';
import {
  Users,
  TrendingUp,
  Target,
  DollarSign,
  Clock,
  Star,
  Phone,
  Mail,
  Calendar,
  Search,
  Download,
  Plus,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';

export function CRMManagement() {
  // Hook para obtener datos de la API
  const {
    clients: apiClients,
    loading: isClientsLoading,
    createClient,
    updateClient,
    deleteClient: deleteApiClient,
    getStatistics: getApiStatistics,
  } = useClients();
  
  // Estados locales
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<CRMStats>(mockCRMStats);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [activeView, setActiveView] = useState<'list' | 'pipeline' | 'dashboard'>('dashboard');
  
  // Estados de loading para operaciones
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [filters, setFilters] = useState<LeadFilters>({
    search: '',
    status: 'all',
    source: 'all',
    clientType: 'all',
    priority: 'all',
    assignedTo: 'all'
  });
  
  // Cargar clientes de la API y convertirlos a leads
  useEffect(() => {
    if (apiClients.length > 0) {
      const convertedLeads = apiClientsToUiLeads(apiClients);
      setLeads(convertedLeads);
    }
  }, [apiClients]);
  
  // Cargar estadísticas de la API
  useEffect(() => {
    const loadStats = async () => {
      const result = await getApiStatistics();
      if (result.success && result.data) {
        // Actualizar estadísticas con datos reales
        setStats(prev => ({
          ...prev,
          totalLeads: result.data.total,
          activeLeads: result.data.activos,
        }));
      }
    };
    loadStats();
  }, [getApiStatistics]);

  const getStatusColor = (status: LeadStatus): string => {
    const colors = {
      new: 'bg-blue-500',
      contacted: 'bg-purple-500',
      qualified: 'bg-cyan-500',
      proposal: 'bg-yellow-500',
      negotiation: 'bg-orange-500',
      won: 'bg-green-500',
      lost: 'bg-gray-500'
    };
    return colors[status];
  };

  const getStatusVariant = (status: LeadStatus): any => {
    const variants = {
      new: 'info',
      contacted: 'purple',
      qualified: 'cyan',
      proposal: 'warning',
      negotiation: 'warning',
      won: 'success',
      lost: 'gray'
    };
    return variants[status];
  };

  const getPriorityVariant = (priority: Priority): any => {
    const variants = {
      low: 'gray',
      medium: 'info',
      high: 'warning',
      urgent: 'danger'
    };
    return variants[priority];
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatStatusLabel = (status: LeadStatus): string => {
    const labels = {
      new: 'Nuevo',
      contacted: 'Contactado',
      qualified: 'Calificado',
      proposal: 'Propuesta',
      negotiation: 'Negociación',
      won: 'Ganado',
      lost: 'Perdido'
    };
    return labels[status];
  };

  const formatSourceLabel = (source: LeadSource): string => {
    const labels = {
      website: 'Sitio Web',
      referral: 'Referido',
      'social-media': 'Redes Sociales',
      email: 'Email',
      phone: 'Teléfono',
      event: 'Evento',
      other: 'Otro'
    };
    return labels[source];
  };

  const formatPriorityLabel = (priority: Priority): string => {
    const labels = {
      low: 'Baja',
      medium: 'Media',
      high: 'Alta',
      urgent: 'Urgente'
    };
    return labels[priority];
  };

  const filteredLeads = leads.filter(lead => {
    if (filters.search && !lead.fullName.toLowerCase().includes(filters.search.toLowerCase()) &&
        !lead.code.toLowerCase().includes(filters.search.toLowerCase()) &&
        !lead.contact.email.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status !== 'all' && lead.status !== filters.status) return false;
    if (filters.source !== 'all' && lead.source !== filters.source) return false;
    if (filters.clientType !== 'all' && lead.clientType !== filters.clientType) return false;
    if (filters.priority !== 'all' && lead.priority !== filters.priority) return false;
    if (filters.assignedTo !== 'all' && lead.assignedTo !== filters.assignedTo) return false;
    return true;
  });

  const handleAddLead = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailsOpen(true);
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('¿Está seguro de eliminar este cliente?')) {
      return;
    }
    
    try {
      const clientId = extractClientIdFromLeadId(leadId);
      const result = await deleteApiClient(clientId);
      
      if (result.success) {
        setLeads(leads.filter(l => l.id !== leadId));
        toast.success('Cliente eliminado exitosamente');
      } else {
        toast.error(result.error || 'Error al eliminar cliente');
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Error al eliminar cliente');
    }
  };

  const handleSaveLead = async (leadData: any) => {
    if (editingLead) {
      // ====== ACTUALIZAR CLIENTE EXISTENTE ======
      setIsUpdating(true);
      
      try {
        const clientId = extractClientIdFromLeadId(editingLead.id);
        const apiData = uiLeadFormToApiUpdateClient(leadData);
        const result = await updateClient(clientId, apiData);
        
        if (result.success) {
          // Convertir cliente actualizado a formato Lead
          const updatedLead = apiClientsToUiLeads([result.data!])[0];
          
          // Actualizar estado local
          setLeads(leads.map(l => 
            l.id === editingLead.id ? updatedLead : l
          ));
          
          setIsModalOpen(false);
          setEditingLead(null);
          toast.success('Cliente actualizado exitosamente');
        } else {
          toast.error(result.error || 'Error al actualizar cliente');
        }
      } catch (error) {
        console.error('Error updating client:', error);
        toast.error('Error al actualizar cliente');
      } finally {
        setIsUpdating(false);
      }
      
    } else {
      // ====== CREAR NUEVO CLIENTE ======
      setIsCreating(true);
      
      try {
        const apiData = uiLeadFormToApiCreateClient(leadData);
        const result = await createClient(apiData);
        
        if (result.success) {
          // Convertir cliente creado a formato Lead
          const newLead = apiClientsToUiLeads([result.data!])[0];
          
          // Agregar al estado local
          setLeads([newLead, ...leads]);
          
          setIsModalOpen(false);
          toast.success('Cliente creado exitosamente');
        } else {
          toast.error(result.error || 'Error al crear cliente');
        }
      } catch (error) {
        console.error('Error creating client:', error);
        toast.error('Error al crear cliente');
      } finally {
        setIsCreating(false);
      }
    }
  };

  // Dashboard Stats Cards
  const StatsCard = ({ icon: Icon, label, value, change, changeType }: any) => (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-3xl mb-2">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 text-sm ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              <ArrowUpRight className={`w-4 h-4 ${changeType === 'negative' ? 'rotate-90' : ''}`} />
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 rounded-lg bg-[#3A7AFE]/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-[#3A7AFE]" />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">CRM - Gestión de Clientes</h1>
          <p className="text-gray-500">
            Gestiona leads, seguimiento de ventas y relaciones con clientes
          </p>
        </div>
        <Button onClick={handleAddLead} className="bg-[#3A7AFE] hover:bg-[#3A7AFE]/90">
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Lead
        </Button>
      </div>

      {/* View Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`py-4 px-1 border-b-2 transition-colors ${
              activeView === 'dashboard'
                ? 'border-[#3A7AFE] text-[#3A7AFE]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveView('pipeline')}
            className={`py-4 px-1 border-b-2 transition-colors ${
              activeView === 'pipeline'
                ? 'border-[#3A7AFE] text-[#3A7AFE]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pipeline de Ventas
          </button>
          <button
            onClick={() => setActiveView('list')}
            className={`py-4 px-1 border-b-2 transition-colors ${
              activeView === 'list'
                ? 'border-[#3A7AFE] text-[#3A7AFE]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Lista de Leads
          </button>
        </nav>
      </div>

      {/* Dashboard View */}
      {activeView === 'dashboard' && (
        <div className="space-y-6">
          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              icon={Users}
              label="Total Leads"
              value={stats.totalLeads}
              change="+12.5%"
              changeType="positive"
            />
            <StatsCard
              icon={Target}
              label="Leads Activos"
              value={stats.activeLeads}
              change="+8.2%"
              changeType="positive"
            />
            <StatsCard
              icon={TrendingUp}
              label="Tasa de Conversión"
              value={`${stats.conversionRate.toFixed(1)}%`}
              change="+2.3%"
              changeType="positive"
            />
            <StatsCard
              icon={DollarSign}
              label="Valor Estimado"
              value={formatCurrency(stats.totalEstimatedValue)}
              change="+15.7%"
              changeType="positive"
            />
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              icon={CheckCircle2}
              label="Leads Convertidos"
              value={stats.convertedLeads}
            />
            <StatsCard
              icon={Clock}
              label="Tiempo de Respuesta"
              value={`${stats.averageResponseTime}h`}
            />
            <StatsCard
              icon={Star}
              label="Score Promedio"
              value={stats.averageLeadScore.toFixed(0)}
            />
            <StatsCard
              icon={AlertCircle}
              label="Seguimientos Hoy"
              value={stats.recentActivity.followUpsToday}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Leads by Status */}
            <Card className="p-6">
              <h3 className="text-lg mb-4">Leads por Estado</h3>
              <div className="space-y-4">
                {stats.leadsByStatus.map(item => (
                  <div key={item.status}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`} />
                        <span className="text-sm">{formatStatusLabel(item.status)}</span>
                      </div>
                      <span className="text-sm">
                        {item.count} ({item.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getStatusColor(item.status)}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Leads by Source */}
            <Card className="p-6">
              <h3 className="text-lg mb-4">Leads por Fuente</h3>
              <div className="space-y-4">
                {stats.leadsBySource.map(item => (
                  <div key={item.source}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">{formatSourceLabel(item.source)}</span>
                      <span className="text-sm">
                        {item.count} ({item.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#3A7AFE] h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="text-lg mb-4">Actividad de Hoy</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl">{stats.recentActivity.leadsCreatedToday}</p>
                  <p className="text-sm text-gray-500">Nuevos Leads</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl">{stats.recentActivity.interactionsToday}</p>
                  <p className="text-sm text-gray-500">Interacciones</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl">{stats.recentActivity.tasksToday}</p>
                  <p className="text-sm text-gray-500">Tareas</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl">{stats.recentActivity.followUpsToday}</p>
                  <p className="text-sm text-gray-500">Seguimientos</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Pipeline View */}
      {activeView === 'pipeline' && (
        <PipelineView
          leads={filteredLeads}
          onViewLead={handleViewLead}
          onEditLead={handleEditLead}
          formatCurrency={formatCurrency}
        />
      )}

      {/* List View */}
      {activeView === 'list' && (
        <Card>
          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-2">
                <Input
                  placeholder="Buscar por nombre, código o email..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  icon={<Search className="w-5 h-5" />}
                />
              </div>
              <Select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                options={[
                  { value: 'all', label: 'Todos los estados' },
                  { value: 'new', label: 'Nuevo' },
                  { value: 'contacted', label: 'Contactado' },
                  { value: 'qualified', label: 'Calificado' },
                  { value: 'proposal', label: 'Propuesta' },
                  { value: 'negotiation', label: 'Negociación' },
                  { value: 'won', label: 'Ganado' },
                  { value: 'lost', label: 'Perdido' }
                ]}
              />
              <Select
                value={filters.source}
                onChange={(e) => setFilters({ ...filters, source: e.target.value as any })}
                options={[
                  { value: 'all', label: 'Todas las fuentes' },
                  { value: 'website', label: 'Sitio Web' },
                  { value: 'referral', label: 'Referido' },
                  { value: 'social-media', label: 'Redes Sociales' },
                  { value: 'email', label: 'Email' },
                  { value: 'phone', label: 'Teléfono' },
                  { value: 'event', label: 'Evento' }
                ]}
              />
              <Select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value as any })}
                options={[
                  { value: 'all', label: 'Todas las prioridades' },
                  { value: 'low', label: 'Baja' },
                  { value: 'medium', label: 'Media' },
                  { value: 'high', label: 'Alta' },
                  { value: 'urgent', label: 'Urgente' }
                ]}
              />
              <Button variant="secondary" className="w-full">
                <Download className="w-5 h-5 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {isClientsLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A7AFE] mb-4"></div>
                <p className="text-gray-600">Cargando clientes...</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Lead
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Prioridad
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Valor Estimado
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Próximo Seguimiento
                    </th>
                    <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">{lead.fullName}</div>
                          <div className="text-sm text-gray-500">{lead.code}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{lead.contact.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{lead.contact.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusVariant(lead.status)}>
                          {formatStatusLabel(lead.status)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getPriorityVariant(lead.priority)}>
                          {formatPriorityLabel(lead.priority)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {formatCurrency(lead.estimatedValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-[#3A7AFE] h-2 rounded-full"
                              style={{ width: `${lead.score}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{lead.score}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.nextFollowUpDate ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(lead.nextFollowUpDate).toLocaleDateString('es-CO')}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewLead(lead)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditLead(lead)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteLead(lead.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Empty State */}
          {filteredLeads.length === 0 && (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg mb-2">No se encontraron leads</h3>
              <p className="text-gray-500 mb-4">
                {filters.search || filters.status !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza agregando tu primer lead'}
              </p>
              {!filters.search && filters.status === 'all' && (
                <Button onClick={handleAddLead} className="bg-[#3A7AFE] hover:bg-[#3A7AFE]/90">
                  <Plus className="w-5 h-5 mr-2" />
                  Nuevo Lead
                </Button>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Modals */}
      {isModalOpen && (
        <LeadModal
          lead={editingLead}
          onClose={() => {
            setIsModalOpen(false);
            setEditingLead(null);
          }}
          onSave={handleSaveLead}
        />
      )}

      {isDetailsOpen && selectedLead && (
        <LeadDetails
          lead={selectedLead}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedLead(null);
          }}
          onEdit={() => {
            setIsDetailsOpen(false);
            handleEditLead(selectedLead);
          }}
          onUpdate={(updatedLead) => {
            setLeads(leads.map(l => l.id === updatedLead.id ? updatedLead : l));
            setSelectedLead(updatedLead);
          }}
        />
      )}
    </div>
  );
}