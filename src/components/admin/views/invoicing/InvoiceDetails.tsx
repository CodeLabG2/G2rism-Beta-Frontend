import React from 'react';
import { Modal } from '../../../ui/Modal';
import { Button } from '../../../ui/Button';
import { Badge } from '../../../ui/Badge';
import { Card } from '../../../ui/Card';
import {
  Edit,
  Trash2,
  Send,
  Download,
  Mail,
  FileText,
  DollarSign,
  Calendar,
  CheckCircle,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { Factura } from './types';

interface InvoiceDetailsProps {
  invoice: Factura;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSendToDIAN: () => void;
  onDownloadPDF: () => void;
  onDownloadXML: () => void;
  onResendEmail: () => void;
  onCreateCreditNote: () => void;
  onCreateDebitNote: () => void;
}

export function InvoiceDetails({
  invoice,
  onClose,
  onEdit,
  onDelete,
  onSendToDIAN,
  onDownloadPDF,
  onDownloadXML,
  onResendEmail,
  onCreateCreditNote,
  onCreateDebitNote,
}: InvoiceDetailsProps) {
  const getEstadoVariant = (estado: string) => {
    const variants: Record<string, 'success' | 'danger' | 'warning' | 'gray'> = {
      Borrador: 'gray',
      Enviada_DIAN: 'warning',
      Aprobada_DIAN: 'success',
      Rechazada_DIAN: 'danger',
      Anulada: 'gray',
    };
    return variants[estado] || 'gray';
  };

  const formatCurrency = (value: number, currency: string = 'COP') => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Detalles de la Factura" size="xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b">
          <div>
            <h4>{invoice.prefijo}{invoice.numeroFactura}</h4>
            <p className="text-gray-600 mt-1">
              {invoice.nombreCliente || `Cliente #${invoice.idCliente}`}
            </p>
            {invoice.documentoCliente && (
              <p className="text-sm text-gray-500">{invoice.documentoCliente}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={getEstadoVariant(invoice.estadoFactura)}>
                {invoice.estadoFactura.replace('_', ' ')}
              </Badge>
              {invoice.emailEnviado && (
                <Badge variant="success">Email Enviado</Badge>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {invoice.estadoFactura === 'Borrador' && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Send size={16} />}
                  onClick={onSendToDIAN}
                >
                  Enviar a DIAN
                </Button>
                <Button variant="outline" size="sm" icon={<Edit size={16} />} onClick={onEdit}>
                  Editar
                </Button>
                <Button variant="outline" size="sm" icon={<Trash2 size={16} />} onClick={onDelete}>
                  Eliminar
                </Button>
              </>
            )}
            {invoice.estadoFactura === 'Aprobada_DIAN' && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Download size={16} />}
                  onClick={onDownloadPDF}
                >
                  Descargar PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Download size={16} />}
                  onClick={onDownloadXML}
                >
                  XML
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Mail size={16} />}
                  onClick={onResendEmail}
                >
                  Reenviar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<RefreshCw size={16} />}
                  onClick={onCreateCreditNote}
                >
                  Nota Crédito
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Plus size={16} />}
                  onClick={onCreateDebitNote}
                >
                  Nota Débito
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Información General */}
        <Card>
          <h6 className="flex items-center gap-2 mb-4">
            <Calendar size={18} />
            Información General
          </h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Fecha de Emisión</p>
              <p className="font-medium">{formatDate(invoice.fechaEmision)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fecha de Vencimiento</p>
              <p className="font-medium">{formatDate(invoice.fechaVencimiento)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Venta Asociada</p>
              <p className="font-medium">{invoice.numeroVenta || `#${invoice.idVenta}`}</p>
            </div>
            {invoice.fechaEnvioDIAN && (
              <div>
                <p className="text-sm text-gray-600">Enviado a DIAN</p>
                <p className="font-medium">{formatDateTime(invoice.fechaEnvioDIAN)}</p>
              </div>
            )}
            {invoice.fechaAprobacionDIAN && (
              <div>
                <p className="text-sm text-gray-600">Aprobado por DIAN</p>
                <p className="font-medium">{formatDateTime(invoice.fechaAprobacionDIAN)}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Información Financiera */}
        <Card>
          <h6 className="flex items-center gap-2 mb-4">
            <DollarSign size={18} />
            Información Financiera
          </h6>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(invoice.subtotal, invoice.moneda)}</span>
            </div>
            <div className="flex justify-between items-center text-red-600">
              <span>Descuento</span>
              <span className="font-medium">-{formatCurrency(invoice.descuento, invoice.moneda)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Impuestos (IVA 19%)</span>
              <span className="font-medium">{formatCurrency(invoice.impuestos, invoice.moneda)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="font-semibold text-lg">Total</span>
              <span className="font-semibold text-lg text-[#3A7AFE]">
                {formatCurrency(invoice.total, invoice.moneda)}
              </span>
            </div>
          </div>
        </Card>

        {/* Información DIAN */}
        {invoice.cufeDIAN && (
          <Card>
            <h6 className="flex items-center gap-2 mb-4">
              <CheckCircle size={18} />
              Información DIAN
            </h6>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">CUFE (Código Único de Factura Electrónica)</p>
                <p className="font-mono text-sm bg-gray-50 p-2 rounded border break-all">
                  {invoice.cufeDIAN}
                </p>
              </div>
              {invoice.mensajeRespuestaDIAN && (
                <div>
                  <p className="text-sm text-gray-600">Mensaje de Respuesta DIAN</p>
                  <p className="text-sm bg-gray-50 p-2 rounded border">
                    {invoice.mensajeRespuestaDIAN}
                  </p>
                </div>
              )}
              {invoice.archivoXML && (
                <div>
                  <p className="text-sm text-gray-600">Archivo XML</p>
                  <p className="text-sm text-gray-500">{invoice.archivoXML}</p>
                </div>
              )}
              {invoice.archivoPDF && (
                <div>
                  <p className="text-sm text-gray-600">Archivo PDF</p>
                  <p className="text-sm text-gray-500">{invoice.archivoPDF}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Observaciones */}
        {invoice.observaciones && (
          <Card>
            <h6 className="flex items-center gap-2 mb-4">
              <FileText size={18} />
              Observaciones
            </h6>
            <p className="text-gray-700 whitespace-pre-wrap">{invoice.observaciones}</p>
          </Card>
        )}

        {/* Alertas */}
        {invoice.estadoFactura === 'Rechazada_DIAN' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <strong>⚠️ Factura Rechazada por la DIAN</strong>
              <br />
              {invoice.mensajeRespuestaDIAN || 'Revisa los datos y contacta con soporte si el problema persiste.'}
            </p>
          </div>
        )}

        {invoice.estadoFactura === 'Enviada_DIAN' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>⏳ Esperando Respuesta de la DIAN</strong>
              <br />
              La factura ha sido enviada y está pendiente de validación. Esto puede tomar algunos minutos.
            </p>
          </div>
        )}

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
