import React, { useState, useEffect } from 'react';
import { Modal } from '../../../ui/Modal';
import { Button } from '../../../ui/Button';
import { Badge } from '../../../ui/Badge';
import { Tabs } from '../../../ui/Tabs';
import { Card } from '../../../ui/Card';
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Star,
  FileText,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { Proveedor } from './types';
import { ContratoProveedor } from './types';
import contractsService from '../../../../services/api/contractsService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ProviderDetailsProps {
  provider: Proveedor;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProviderDetails({ provider, onClose, onEdit, onDelete }: ProviderDetailsProps) {
  const [activeTab, setActiveTab] = useState('info');
  const [contracts, setContracts] = useState<ContratoProveedor[]>([]);
  const [loadingContracts, setLoadingContracts] = useState(false);

  useEffect(() => {
    loadContracts();
  }, [provider.idProveedor]);

  const loadContracts = async () => {
    try {
      setLoadingContracts(true);
      const data = await contractsService.getByProveedor(provider.idProveedor);
      setContracts(data);
    } catch (error) {
      console.error('Error al cargar contratos:', error);
    } finally {
      setLoadingContracts(false);
    }
  };

  const getTipoIcon = (tipo: string) => {
    const icons: Record<string, string> = {
      Hotel: '🏨',
      Aerolinea: '✈️',
      Transporte: '🚗',
      Servicios: '🎯',
      Mixto: '🔀',
    };
    return icons[tipo] || '📦';
  };

  const getEstadoVariant = (estado: string) => {
    const variants: Record<string, 'success' | 'danger' | 'warning' | 'gray'> = {
      Activo: 'success',
      Inactivo: 'gray',
      Suspendido: 'danger',
    };
    return variants[estado] || 'gray';
  };

  const getEstadoContratoVariant = (estado: string) => {
    const variants: Record<string, 'success' | 'danger' | 'warning' | 'gray'> = {
      Vigente: 'success',
      Vencido: 'danger',
      Cancelado: 'gray',
      En_Negociacion: 'warning',
    };
    return variants[estado] || 'gray';
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d 'de' MMMM, yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (value: number, currency: string = 'COP') => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  const tabs = [
    { id: 'info', label: 'Información General', icon: <Building2 size={16} /> },
    { id: 'contratos', label: 'Contratos', icon: <FileText size={16} /> },
    { id: 'estadisticas', label: 'Estadísticas', icon: <TrendingUp size={16} /> },
  ];

  return (
    <Modal isOpen={true} onClose={onClose} title="Detalles del Proveedor" size="xl">
      <div className="space-y-6">
        {/* Header con Badge */}
        <div className="flex items-start justify-between pb-4 border-b">
          <div className="flex items-start gap-4">
            <div className="text-5xl">{getTipoIcon(provider.tipoProveedor)}</div>
            <div>
              <h4>{provider.nombreEmpresa}</h4>
              <p className="text-gray-600 mt-1">{provider.nombreContacto}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={getEstadoVariant(provider.estado)}>{provider.estado}</Badge>
                <Badge variant="default">{provider.tipoProveedor}</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={<Edit size={16} />} onClick={onEdit}>
              Editar
            </Button>
            <Button variant="outline" size="sm" icon={<Trash2 size={16} />} onClick={onDelete}>
              Eliminar
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* Contenido de Tabs */}
        <div className="min-h-[400px]">
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Información de Contacto */}
              <Card>
                <h6 className="flex items-center gap-2 mb-4">
                  <User size={18} />
                  Información de Contacto
                </h6>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Mail size={18} className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Email Principal</p>
                      <p className="font-medium">{provider.correoElectronico}</p>
                      {provider.correoAlternativo && (
                        <p className="text-sm text-gray-600 mt-1">{provider.correoAlternativo}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Teléfono Principal</p>
                      <p className="font-medium">{provider?.telefono || 'N/A'}</p>
                      {provider?.telefonoAlternativo && (
                        <p className="text-sm text-gray-600 mt-1">{provider.telefonoAlternativo}</p>
                      )}
                    </div>
                  </div>
                  {provider.sitioWeb && (
                    <div className="flex items-start gap-3">
                      <Globe size={18} className="text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Sitio Web</p>
                        <a
                          href={provider.sitioWeb}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-[#3A7AFE] hover:underline"
                        >
                          {provider.sitioWeb}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Ubicación */}
              <Card title="Ubicación" icon={<MapPin size={18} />}>
                <div className="space-y-2">
                  {provider.direccion && <p>{provider.direccion}</p>}
                  <p>
                    {provider?.ciudad || 'N/A'}, {provider?.pais || 'N/A'}
                  </p>
                </div>
              </Card>

              {/* Datos Comerciales */}
              <Card>
                <h6 className="flex items-center gap-2 mb-4">
                  <Building2 size={18} />
                  Datos Comerciales
                </h6>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">NIT/RUT</p>
                    <p className="font-medium">{provider.nitRut}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={18} className="text-yellow-500 fill-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-600">Calificación</p>
                      <p className="font-medium">{provider.calificacion.toFixed(1)} / 5.0</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Registro</p>
                    <p className="font-medium">{formatDate(provider.fechaRegistro)}</p>
                  </div>
                </div>
              </Card>

              {/* Observaciones */}
              {provider.observaciones && (
                <Card>
                  <h6 className="flex items-center gap-2 mb-4">
                    <FileText size={18} />
                    Observaciones
                  </h6>
                  <p className="text-gray-700 whitespace-pre-wrap">{provider.observaciones}</p>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'contratos' && (
            <div className="space-y-4">
              {loadingContracts ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A7AFE] mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando contratos...</p>
                </div>
              ) : contracts.length === 0 ? (
                <Card>
                  <div className="text-center py-12">
                    <FileText size={48} className="text-gray-300 mx-auto mb-4" />
                    <h6 className="text-gray-600">No hay contratos registrados</h6>
                    <p className="text-sm text-gray-500 mt-2">
                      Este proveedor aún no tiene contratos asociados
                    </p>
                  </div>
                </Card>
              ) : (
                contracts.map((contrato) => (
                  <Card key={contrato.idContrato} hover>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h6>{contrato.numeroContrato}</h6>
                          <Badge variant={getEstadoContratoVariant(contrato.estadoContrato)}>
                            {contrato.estadoContrato.replace('_', ' ')}
                          </Badge>
                          {contrato.proximoAVencer && (
                            <Badge variant="warning">Próximo a Vencer</Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Tipo</p>
                            <p className="font-medium">{contrato.tipoContrato}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Inicio</p>
                            <p className="font-medium">{formatDate(contrato.fechaInicio)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Fin</p>
                            <p className="font-medium">{formatDate(contrato.fechaFin)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Valor</p>
                            <p className="font-medium">
                              {formatCurrency(contrato.valorContrato, contrato.moneda)}
                            </p>
                          </div>
                        </div>
                        {contrato.diasRestantes !== undefined && contrato.estaVigente && (
                          <p className="text-sm text-gray-600 mt-2">
                            {contrato.diasRestantes} días restantes
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === 'estadisticas' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <div className="text-center">
                    <FileText size={32} className="text-[#3A7AFE] mx-auto mb-2" />
                    <h4>{contracts.length}</h4>
                    <p className="text-sm text-gray-600">Total Contratos</p>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <DollarSign size={32} className="text-[#10B981] mx-auto mb-2" />
                    <h4>
                      {contracts
                        .filter((c) => c.estaVigente)
                        .reduce((sum, c) => sum + c.valorContrato, 0)
                        .toLocaleString('es-CO')}
                    </h4>
                    <p className="text-sm text-gray-600">Valor Contratos Vigentes</p>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <Star size={32} className="text-[#F59E0B] mx-auto mb-2" />
                    <h4>{provider.calificacion.toFixed(1)}</h4>
                    <p className="text-sm text-gray-600">Calificación</p>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}