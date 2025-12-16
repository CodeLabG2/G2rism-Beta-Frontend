import React, { useState } from 'react';
import { Modal } from '../../../ui/Modal';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';
import { Badge } from '../../../ui/Badge';
import { Card } from '../../../ui/Card';
import { Tabs } from '../../../ui/Tabs';
import { Lead, Interaction, Note, Task } from './types';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  Edit2,
  MessageSquare,
  FileText,
  CheckSquare,
  Paperclip,
  Plus,
  Clock,
  Target,
  Tag,
  Send,
  X,
  Save,
  Trash2,
  PhoneCall,
  Video,
  MessageCircle,
  Star
} from 'lucide-react';

interface LeadDetailsProps {
  lead: Lead;
  onClose: () => void;
  onEdit: () => void;
  onUpdate: (lead: Lead) => void;
}

export function LeadDetails({ lead, onClose, onEdit, onUpdate }: LeadDetailsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [newInteraction, setNewInteraction] = useState({
    type: 'call' as const,
    subject: '',
    description: '',
    duration: 0,
    nextFollowUp: ''
  });
  const [newNote, setNewNote] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as const
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getInteractionIcon = (type: string) => {
    const icons = {
      call: PhoneCall,
      email: Mail,
      meeting: Video,
      whatsapp: MessageCircle,
      note: FileText,
      task: CheckSquare
    };
    return icons[type as keyof typeof icons] || MessageSquare;
  };

  const handleAddInteraction = () => {
    if (!newInteraction.subject || !newInteraction.description) return;

    const interaction: Interaction = {
      id: `INT-${Date.now()}`,
      type: newInteraction.type,
      date: new Date().toISOString(),
      subject: newInteraction.subject,
      description: newInteraction.description,
      duration: newInteraction.duration,
      nextFollowUp: newInteraction.nextFollowUp || undefined,
      createdBy: 'admin'
    };

    const updatedLead = {
      ...lead,
      interactions: [interaction, ...lead.interactions],
      totalInteractions: lead.totalInteractions + 1,
      lastContactDate: new Date().toISOString(),
      nextFollowUpDate: newInteraction.nextFollowUp || lead.nextFollowUpDate
    };

    onUpdate(updatedLead);
    setNewInteraction({
      type: 'call',
      subject: '',
      description: '',
      duration: 0,
      nextFollowUp: ''
    });
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note: Note = {
      id: `NOTE-${Date.now()}`,
      content: newNote,
      isPinned: false,
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    };

    const updatedLead = {
      ...lead,
      notes: [note, ...lead.notes]
    };

    onUpdate(updatedLead);
    setNewNote('');
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.dueDate) return;

    const task: Task = {
      id: `TASK-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate,
      priority: newTask.priority,
      completed: false,
      assignedTo: 'admin',
      createdBy: 'admin',
      createdAt: new Date().toISOString()
    };

    const updatedLead = {
      ...lead,
      tasks: [task, ...lead.tasks]
    };

    onUpdate(updatedLead);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium'
    });
  };

  const handleToggleTask = (taskId: string) => {
    const updatedLead = {
      ...lead,
      tasks: lead.tasks.map(task =>
        task.id === taskId
          ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date().toISOString() : undefined }
          : task
      )
    };
    onUpdate(updatedLead);
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedLead = {
      ...lead,
      tasks: lead.tasks.filter(task => task.id !== taskId)
    };
    onUpdate(updatedLead);
  };

  const handlePinNote = (noteId: string) => {
    const updatedLead = {
      ...lead,
      notes: lead.notes.map(note =>
        note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
      )
    };
    onUpdate(updatedLead);
  };

  const handleDeleteNote = (noteId: string) => {
    const updatedLead = {
      ...lead,
      notes: lead.notes.filter(note => note.id !== noteId)
    };
    onUpdate(updatedLead);
  };

  const InfoRow = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-start gap-3 py-2">
      <Icon className="w-5 h-5 text-gray-400 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-gray-900">{value || '-'}</p>
      </div>
    </div>
  );

  return (
    <Modal isOpen={true} onClose={onClose} title="Detalles del Lead" size="extra-large">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-6 border-b border-gray-200">
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-[#3A7AFE]/10 flex items-center justify-center">
                <User className="w-8 h-8 text-[#3A7AFE]" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl mb-1">{lead.fullName}</h2>
                <p className="text-gray-500 mb-2">{lead.code}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="info">{lead.status}</Badge>
                  <Badge variant="gray">{lead.source}</Badge>
                  <Badge variant="purple">{lead.clientType}</Badge>
                  <Badge
                    variant={
                      lead.priority === 'urgent' ? 'danger' :
                      lead.priority === 'high' ? 'warning' :
                      lead.priority === 'medium' ? 'info' : 'gray'
                    }
                  >
                    {lead.priority}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Valor Estimado</p>
                <p className="text-lg text-gray-900">{formatCurrency(lead.estimatedValue)}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Probabilidad</p>
                <p className="text-lg text-gray-900">{lead.probability}%</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Score</p>
                <p className="text-lg text-gray-900">{lead.score}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Interacciones</p>
                <p className="text-lg text-gray-900">{lead.totalInteractions}</p>
              </div>
            </div>
          </div>

          <Button onClick={onEdit} variant="outline">
            <Edit2 className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>

        {/* Tabs */}
        <Tabs
          tabs={[
            { id: 'overview', label: 'Resumen' },
            { id: 'interactions', label: `Interacciones (${lead.interactions.length})` },
            { id: 'notes', label: `Notas (${lead.notes.length})` },
            { id: 'tasks', label: `Tareas (${lead.tasks.filter(t => !t.completed).length})` },
            { id: 'documents', label: `Documentos (${lead.documents.length})` }
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Information */}
              <Card className="p-6">
                <h3 className="text-lg mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#3A7AFE]" />
                  Información de Contacto
                </h3>
                <div className="space-y-1">
                  <InfoRow icon={Mail} label="Email" value={lead.contact.email} />
                  <InfoRow icon={Phone} label="Teléfono" value={lead.contact.phone} />
                  {lead.contact.mobile && (
                    <InfoRow icon={Phone} label="Móvil" value={lead.contact.mobile} />
                  )}
                  {lead.contact.whatsapp && (
                    <InfoRow icon={MessageCircle} label="WhatsApp" value={lead.contact.whatsapp} />
                  )}
                </div>
              </Card>

              {/* Personal Information */}
              <Card className="p-6">
                <h3 className="text-lg mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#3A7AFE]" />
                  Información Personal
                </h3>
                <div className="space-y-1">
                  <InfoRow
                    icon={FileText}
                    label="Documento"
                    value={`${lead.documentType} - ${lead.documentNumber}`}
                  />
                  {lead.dateOfBirth && (
                    <InfoRow
                      icon={Calendar}
                      label="Fecha de Nacimiento"
                      value={new Date(lead.dateOfBirth).toLocaleDateString('es-CO')}
                    />
                  )}
                  {lead.address && (
                    <InfoRow
                      icon={MapPin}
                      label="Dirección"
                      value={`${lead.address.city}, ${lead.address.country}`}
                    />
                  )}
                </div>
              </Card>

              {/* Sales Information */}
              <Card className="p-6">
                <h3 className="text-lg mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#3A7AFE]" />
                  Información de Ventas
                </h3>
                <div className="space-y-1">
                  <InfoRow
                    icon={DollarSign}
                    label="Valor Estimado"
                    value={formatCurrency(lead.estimatedValue)}
                  />
                  <InfoRow icon={TrendingUp} label="Probabilidad" value={`${lead.probability}%`} />
                  {lead.travelDate && (
                    <InfoRow
                      icon={Calendar}
                      label="Fecha de Viaje"
                      value={new Date(lead.travelDate).toLocaleDateString('es-CO')}
                    />
                  )}
                  {lead.numberOfTravelers && (
                    <InfoRow icon={User} label="Viajeros" value={lead.numberOfTravelers} />
                  )}
                </div>
              </Card>

              {/* Activity Information */}
              <Card className="p-6">
                <h3 className="text-lg mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#3A7AFE]" />
                  Información de Actividad
                </h3>
                <div className="space-y-1">
                  <InfoRow
                    icon={Calendar}
                    label="Fecha de Creación"
                    value={new Date(lead.createdAt).toLocaleDateString('es-CO')}
                  />
                  {lead.lastContactDate && (
                    <InfoRow
                      icon={Phone}
                      label="Último Contacto"
                      value={new Date(lead.lastContactDate).toLocaleDateString('es-CO')}
                    />
                  )}
                  {lead.nextFollowUpDate && (
                    <InfoRow
                      icon={Target}
                      label="Próximo Seguimiento"
                      value={new Date(lead.nextFollowUpDate).toLocaleDateString('es-CO')}
                    />
                  )}
                  <InfoRow icon={User} label="Asignado a" value={lead.assignedTo} />
                </div>
              </Card>

              {/* Tags */}
              {lead.tags && lead.tags.length > 0 && (
                <Card className="p-6 lg:col-span-2">
                  <h3 className="text-lg mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#3A7AFE]" />
                    Etiquetas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {lead.tags.map((tag, index) => (
                      <Badge key={index} variant="gray">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Interactions Tab */}
          {activeTab === 'interactions' && (
            <div className="space-y-6">
              {/* Add Interaction Form */}
              <Card className="p-6">
                <h3 className="text-lg mb-4">Nueva Interacción</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Tipo</label>
                      <select
                        value={newInteraction.type}
                        onChange={(e) => setNewInteraction({ ...newInteraction, type: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A7AFE]"
                      >
                        <option value="call">Llamada</option>
                        <option value="email">Email</option>
                        <option value="meeting">Reunión</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="note">Nota</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Duración (min)</label>
                      <Input
                        type="number"
                        value={newInteraction.duration}
                        onChange={(e) => setNewInteraction({ ...newInteraction, duration: Number(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Asunto</label>
                    <Input
                      value={newInteraction.subject}
                      onChange={(e) => setNewInteraction({ ...newInteraction, subject: e.target.value })}
                      placeholder="Asunto de la interacción"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Descripción</label>
                    <textarea
                      value={newInteraction.description}
                      onChange={(e) => setNewInteraction({ ...newInteraction, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A7AFE]"
                      placeholder="Detalles de la interacción..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Próximo Seguimiento</label>
                    <Input
                      type="date"
                      value={newInteraction.nextFollowUp}
                      onChange={(e) => setNewInteraction({ ...newInteraction, nextFollowUp: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAddInteraction} className="bg-[#3A7AFE] hover:bg-[#3A7AFE]/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Interacción
                  </Button>
                </div>
              </Card>

              {/* Interactions List */}
              <div className="space-y-4">
                {lead.interactions.length > 0 ? (
                  lead.interactions.map((interaction) => {
                    const Icon = getInteractionIcon(interaction.type);
                    return (
                      <Card key={interaction.id} className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#3A7AFE]/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-[#3A7AFE]" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium text-gray-900">{interaction.subject}</h4>
                                <p className="text-sm text-gray-500">
                                  {new Date(interaction.date).toLocaleString('es-CO')}
                                  {interaction.duration && ` • ${interaction.duration} min`}
                                </p>
                              </div>
                              <Badge variant="gray">{interaction.type}</Badge>
                            </div>
                            <p className="text-gray-600 mb-2">{interaction.description}</p>
                            {interaction.nextFollowUp && (
                              <div className="flex items-center gap-2 text-sm text-[#3A7AFE]">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  Próximo seguimiento: {new Date(interaction.nextFollowUp).toLocaleDateString('es-CO')}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No hay interacciones registradas</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-6">
              {/* Add Note Form */}
              <Card className="p-6">
                <h3 className="text-lg mb-4">Nueva Nota</h3>
                <div className="space-y-4">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A7AFE]"
                    placeholder="Escribe una nota..."
                  />
                  <Button onClick={handleAddNote} className="bg-[#3A7AFE] hover:bg-[#3A7AFE]/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Nota
                  </Button>
                </div>
              </Card>

              {/* Notes List */}
              <div className="space-y-4">
                {lead.notes.length > 0 ? (
                  lead.notes
                    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
                    .map((note) => (
                      <Card key={note.id} className={`p-6 ${note.isPinned ? 'border-[#3A7AFE] border-2' : ''}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {new Date(note.createdAt).toLocaleString('es-CO')}
                            </span>
                            {note.isPinned && <Badge variant="info">Fijada</Badge>}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePinNote(note.id)}
                            >
                              <Star className={`w-4 h-4 ${note.isPinned ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteNote(note.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-900 whitespace-pre-wrap">{note.content}</p>
                      </Card>
                    ))
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No hay notas registradas</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              {/* Add Task Form */}
              <Card className="p-6">
                <h3 className="text-lg mb-4">Nueva Tarea</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Título</label>
                      <Input
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="Título de la tarea"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Fecha de Vencimiento</label>
                      <Input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Prioridad</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A7AFE]"
                    >
                      <option value="low">Baja</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Descripción</label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A7AFE]"
                      placeholder="Descripción de la tarea..."
                    />
                  </div>
                  <Button onClick={handleAddTask} className="bg-[#3A7AFE] hover:bg-[#3A7AFE]/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Tarea
                  </Button>
                </div>
              </Card>

              {/* Tasks List */}
              <div className="space-y-4">
                {lead.tasks.length > 0 ? (
                  lead.tasks.map((task) => (
                    <Card key={task.id} className={`p-6 ${task.completed ? 'opacity-60' : ''}`}>
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleTask(task.id)}
                          className="mt-1 w-5 h-5 rounded border-2 border-gray-300 bg-white text-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-0 cursor-pointer transition-all checked:bg-[#3A7AFE] checked:border-[#3A7AFE] hover:border-[#3A7AFE] accent-[#3A7AFE]"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className={`font-medium text-gray-900 ${task.completed ? 'line-through' : ''}`}>
                                {task.title}
                              </h4>
                              <p className="text-sm text-gray-500">
                                Vence: {new Date(task.dueDate).toLocaleDateString('es-CO')}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  task.priority === 'urgent' ? 'danger' :
                                  task.priority === 'high' ? 'warning' :
                                  task.priority === 'medium' ? 'info' : 'gray'
                                }
                              >
                                {task.priority}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          {task.description && (
                            <p className="text-gray-600 text-sm">{task.description}</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No hay tareas registradas</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              {/* Upload Section */}
              <Card className="p-6">
                <h3 className="text-lg mb-4">Subir Documento</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <Paperclip className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Arrastra archivos aquí o haz clic para seleccionar</p>
                  <Button variant="outline">
                    Seleccionar Archivos
                  </Button>
                </div>
              </Card>

              {/* Documents List */}
              <div className="space-y-4">
                {lead.documents.length > 0 ? (
                  lead.documents.map((doc) => (
                    <Card key={doc.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-[#3A7AFE]/10 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-[#3A7AFE]" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{doc.name}</h4>
                            <p className="text-sm text-gray-500">
                              {(doc.size / 1024).toFixed(2)} KB • {new Date(doc.uploadedAt).toLocaleDateString('es-CO')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Descargar
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Paperclip className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No hay documentos adjuntos</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}