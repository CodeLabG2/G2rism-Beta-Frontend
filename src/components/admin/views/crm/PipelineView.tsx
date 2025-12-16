import React from 'react';
import { Card } from '../../../ui/Card';
import { Badge } from '../../../ui/Badge';
import { Button } from '../../../ui/Button';
import { Lead, LeadStatus, PipelineStage } from './types';
import {
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Users,
  Eye,
  Edit2,
  TrendingUp
} from 'lucide-react';

interface PipelineViewProps {
  leads: Lead[];
  onViewLead: (lead: Lead) => void;
  onEditLead: (lead: Lead) => void;
  formatCurrency: (value: number) => string;
}

export function PipelineView({ leads, onViewLead, onEditLead, formatCurrency }: PipelineViewProps) {
  const stages: PipelineStage[] = [
    { status: 'new', label: 'Nuevo', count: 0, value: 0, color: 'bg-blue-500' },
    { status: 'contacted', label: 'Contactado', count: 0, value: 0, color: 'bg-purple-500' },
    { status: 'qualified', label: 'Calificado', count: 0, value: 0, color: 'bg-cyan-500' },
    { status: 'proposal', label: 'Propuesta', count: 0, value: 0, color: 'bg-yellow-500' },
    { status: 'negotiation', label: 'Negociación', count: 0, value: 0, color: 'bg-orange-500' },
    { status: 'won', label: 'Ganado', count: 0, value: 0, color: 'bg-green-500' }
  ];

  // Calculate stage metrics
  const stageMetrics = stages.map(stage => {
    const stageLeads = leads.filter(lead => lead.status === stage.status);
    const totalValue = stageLeads.reduce((sum, lead) => sum + lead.estimatedValue, 0);
    return {
      ...stage,
      count: stageLeads.length,
      value: totalValue,
      leads: stageLeads
    };
  });

  const LeadCard = ({ lead }: { lead: Lead }) => (
    <Card className="p-4 mb-3 hover:shadow-md transition-shadow cursor-pointer">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-1">{lead.fullName}</h4>
            <p className="text-sm text-gray-500">{lead.code}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onViewLead(lead);
              }}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEditLead(lead);
              }}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="truncate">{lead.contact.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-gray-400" />
            <span>{lead.contact.phone}</span>
          </div>
        </div>

        {/* Value & Probability */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1 text-sm">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-gray-900">{formatCurrency(lead.estimatedValue)}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4 text-[#3A7AFE]" />
            <span className="text-gray-600">{lead.probability}%</span>
          </div>
        </div>

        {/* Next Follow-up */}
        {lead.nextFollowUpDate && (
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
            <Calendar className="w-3 h-3" />
            <span>
              Próximo: {new Date(lead.nextFollowUpDate).toLocaleDateString('es-CO', {
                day: 'numeric',
                month: 'short'
              })}
            </span>
          </div>
        )}

        {/* Tags */}
        {lead.tags && lead.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {lead.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="gray" className="text-xs">
                {tag}
              </Badge>
            ))}
            {lead.tags.length > 2 && (
              <Badge variant="gray" className="text-xs">
                +{lead.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Score Bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-[#3A7AFE] h-1.5 rounded-full transition-all"
              style={{ width: `${lead.score}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 w-8 text-right">{lead.score}</span>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Pipeline Overview */}
      <Card className="p-6">
        <h3 className="text-lg mb-4">Resumen del Pipeline</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stageMetrics.map((stage) => (
            <div key={stage.status} className="text-center">
              <div className={`w-12 h-12 ${stage.color} rounded-full mx-auto mb-2 flex items-center justify-center`}>
                <span className="text-white text-lg">{stage.count}</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stage.label}</p>
              <p className="text-xs text-gray-500">{formatCurrency(stage.value)}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Pipeline Columns */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stageMetrics.map((stage) => (
          <div key={stage.status} className="flex-shrink-0 w-80">
            <Card className="h-full">
              {/* Column Header */}
              <div className={`${stage.color} text-white p-4 rounded-t-lg`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{stage.label}</h3>
                  <Badge variant="white" className="bg-white/20 text-white border-0">
                    {stage.count}
                  </Badge>
                </div>
                <p className="text-sm opacity-90">{formatCurrency(stage.value)}</p>
              </div>

              {/* Column Body */}
              <div className="p-4 max-h-[calc(100vh-400px)] overflow-y-auto">
                {stage.leads && stage.leads.length > 0 ? (
                  stage.leads.map(lead => (
                    <LeadCard key={lead.id} lead={lead} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No hay leads</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
