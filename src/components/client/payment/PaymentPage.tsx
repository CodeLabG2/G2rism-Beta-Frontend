import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Badge } from '../../ui/Badge';
import { Select } from '../../ui/Select';
import {
  CreditCard,
  Building2,
  Wallet,
  Banknote,
  Shield,
  Lock,
  CheckCircle2,
  AlertCircle,
  Info,
  ArrowLeft,
  FileText,
  User,
  MapPin,
  Phone,
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface PaymentPageProps {
  bookingData: any;
  total: number;
  onBack: () => void;
  onComplete: (paymentData: any) => void;
}

type PaymentMethod = 'credit-card' | 'pse' | 'bank-transfer' | 'paypal' | 'cash';

interface PaymentData {
  method: PaymentMethod;
  // Tarjeta de crédito
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCVV: string;
  cardType?: 'visa' | 'mastercard' | 'amex' | 'dinersclub';
  // PSE
  pseBank: string;
  pseDocType: string;
  pseDocNumber: string;
  // Datos fiscales DIAN
  invoiceType: 'factura' | 'factura-simplificada';
  fiscalName: string;
  fiscalDocType: 'NIT' | 'CC' | 'CE' | 'Pasaporte';
  fiscalDocNumber: string;
  fiscalAddress: string;
  fiscalCity: string;
  fiscalPhone: string;
  fiscalEmail: string;
  // Términos
  acceptedTerms: boolean;
  acceptedPolicies: boolean;
}

export function PaymentPage({ bookingData, total, onBack, onComplete }: PaymentPageProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit-card');
  const [processing, setProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData>({
    method: 'credit-card',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVV: '',
    pseBank: '',
    pseDocType: 'CC',
    pseDocNumber: '',
    invoiceType: 'factura',
    fiscalName: '',
    fiscalDocType: 'CC',
    fiscalDocNumber: '',
    fiscalAddress: '',
    fiscalCity: '',
    fiscalPhone: '',
    fiscalEmail: '',
    acceptedTerms: false,
    acceptedPolicies: false,
  });

  // Cálculos de costos
  const subtotal = bookingData.selectedPackage?.price * bookingData.adults || 0;
  const insuranceCost = bookingData.extras?.insurance ? 50 : 0;
  const extrasCost = bookingData.extras?.excursions?.length * 30 || 0;
  const discount = 0; // Aquí podrían aplicarse cupones
  const taxRate = 0.19; // IVA Colombia 19%
  const subtotalWithExtras = subtotal + insuranceCost + extrasCost - discount;
  const taxes = subtotalWithExtras * taxRate;
  const totalAmount = subtotalWithExtras + taxes;

  const paymentMethods = [
    {
      id: 'credit-card',
      name: 'Tarjeta de Crédito/Débito',
      icon: CreditCard,
      description: 'Visa, Mastercard, American Express',
      available: true,
    },
    {
      id: 'pse',
      name: 'PSE',
      icon: Building2,
      description: 'Pago Seguro en Línea',
      available: true,
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: Wallet,
      description: 'Pago rápido y seguro',
      available: true,
    },
    {
      id: 'bank-transfer',
      name: 'Transferencia Bancaria',
      icon: Building2,
      description: 'Confirmación en 1-2 días hábiles',
      available: true,
    },
    {
      id: 'cash',
      name: 'Efectivo en Oficina',
      icon: Banknote,
      description: 'Pagar en nuestras oficinas',
      available: true,
    },
  ];

  const colombianBanks = [
    'Bancolombia',
    'Banco de Bogotá',
    'Davivienda',
    'BBVA Colombia',
    'Banco Popular',
    'Banco de Occidente',
    'Banco Caja Social',
    'Banco AV Villas',
    'Banco Agrario',
    'Banco GNB Sudameris',
    'Banco Falabella',
    'Banco Pichincha',
    'Banco Cooperativo Coopcentral',
    'Bancoomeva',
    'Banco Santander',
  ];

  // Detectar tipo de tarjeta
  const detectCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^3(?:0[0-5]|[68])/.test(cleaned)) return 'dinersclub';
    return undefined;
  };

  // Formatear número de tarjeta
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  // Validar tarjeta (algoritmo Luhn simplificado)
  const validateCardNumber = (number: string): boolean => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.length < 13 || cleaned.length > 19) return false;
    // Simulación básica - en producción usar algoritmo Luhn completo
    return /^\d+$/.test(cleaned);
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value.replace(/\D/g, ''));
    const cardType = detectCardType(formatted);
    setPaymentData({
      ...paymentData,
      cardNumber: formatted,
      cardType,
    });
  };

  const handleProcessPayment = async () => {
    // Validaciones
    if (!paymentData.acceptedTerms || !paymentData.acceptedPolicies) {
      toast.error('Debes aceptar los términos y políticas');
      return;
    }

    if (!paymentData.fiscalDocNumber || !paymentData.fiscalName) {
      toast.error('Completa la información fiscal para facturación');
      return;
    }

    if (paymentMethod === 'credit-card') {
      if (!validateCardNumber(paymentData.cardNumber)) {
        toast.error('Número de tarjeta inválido');
        return;
      }
      if (!paymentData.cardName || !paymentData.cardExpiry || !paymentData.cardCVV) {
        toast.error('Completa todos los datos de la tarjeta');
        return;
      }
    }

    if (paymentMethod === 'pse') {
      if (!paymentData.pseBank || !paymentData.pseDocNumber) {
        toast.error('Completa todos los datos de PSE');
        return;
      }
    }

    setProcessing(true);

    // Simular procesamiento de pago
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Simular respuesta exitosa
    const paymentResult = {
      success: true,
      transactionId: `TXN-${Date.now()}`,
      authorizationCode: `AUTH-${Math.random().toString(36).substring(7).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      paymentMethod: paymentMethod,
      amount: totalAmount,
      ...paymentData,
    };

    setProcessing(false);
    toast.success('¡Pago procesado exitosamente!');
    onComplete(paymentResult);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda - Métodos de pago y formularios */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selección de método de pago */}
          <Card>
            <h5 className="mb-4">Método de Pago</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;

                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                    disabled={!method.available}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? 'border-[#3A7AFE] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${!method.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected ? 'bg-[#3A7AFE] text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <Icon size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-[#1A2440] mb-1">{method.name}</div>
                        <div className="text-xs text-gray-600">{method.description}</div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 size={20} className="text-[#3A7AFE] flex-shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Formularios según método seleccionado */}
          {paymentMethod === 'credit-card' && (
            <motion.div
              key="credit-card-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <h5 className="mb-4 flex items-center gap-2">
                  <CreditCard size={20} className="text-[#3A7AFE]" />
                  Datos de la Tarjeta
                </h5>
                <div className="space-y-4">
                  <Input
                    label="Número de tarjeta"
                    placeholder="1234 5678 9012 3456"
                    value={paymentData.cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    maxLength={19}
                    icon={<CreditCard size={18} />}
                  />

                  {paymentData.cardType && (
                    <div className="flex items-center gap-2">
                      <Badge variant="success">
                        {paymentData.cardType.toUpperCase()} detectada
                      </Badge>
                    </div>
                  )}

                  <Input
                    label="Nombre del titular"
                    placeholder="Como aparece en la tarjeta"
                    value={paymentData.cardName}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, cardName: e.target.value.toUpperCase() })
                    }
                    icon={<User size={18} />}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Fecha de expiración"
                      placeholder="MM/AA"
                      value={paymentData.cardExpiry}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + '/' + value.slice(2, 4);
                        }
                        setPaymentData({ ...paymentData, cardExpiry: value });
                      }}
                      maxLength={5}
                    />
                    <Input
                      label="CVV"
                      placeholder="123"
                      type="password"
                      value={paymentData.cardCVV}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          cardCVV: e.target.value.replace(/\D/g, ''),
                        })
                      }
                      maxLength={4}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {paymentMethod === 'pse' && (
            <motion.div key="pse-form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <h5 className="mb-4 flex items-center gap-2">
                  <Building2 size={20} className="text-[#3A7AFE]" />
                  Pago Seguro en Línea (PSE)
                </h5>
                <div className="space-y-4">
                  <Select
                    label="Banco"
                    value={paymentData.pseBank}
                    onChange={(e) => setPaymentData({ ...paymentData, pseBank: e.target.value })}
                    options={[
                      { value: '', label: 'Selecciona tu banco' },
                      ...colombianBanks.map((bank) => ({ value: bank, label: bank })),
                    ]}
                  />

                  <Select
                    label="Tipo de documento"
                    value={paymentData.pseDocType}
                    onChange={(e) => setPaymentData({ ...paymentData, pseDocType: e.target.value })}
                    options={[
                      { value: 'CC', label: 'Cédula de Ciudadanía' },
                      { value: 'CE', label: 'Cédula de Extranjería' },
                      { value: 'NIT', label: 'NIT' },
                      { value: 'Pasaporte', label: 'Pasaporte' },
                    ]}
                  />

                  <Input
                    label="Número de documento"
                    placeholder="Ingresa tu número de documento"
                    value={paymentData.pseDocNumber}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, pseDocNumber: e.target.value })
                    }
                  />

                  <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                    <Info size={20} className="text-[#3A7AFE] flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <p className="font-medium mb-1">Serás redirigido a tu banco</p>
                      <p>
                        Para completar el pago de forma segura a través del portal de tu banco. La
                        transacción será procesada en tiempo real.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {paymentMethod === 'paypal' && (
            <motion.div
              key="paypal-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <div className="text-center py-8">
                  <Wallet size={48} className="text-[#3A7AFE] mx-auto mb-4" />
                  <h5 className="mb-2">Pagar con PayPal</h5>
                  <p className="text-gray-600 mb-6">
                    Serás redirigido a PayPal para completar tu pago de forma segura
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg text-sm text-gray-700">
                    💡 Puedes pagar con tu cuenta de PayPal o con tarjeta sin necesidad de cuenta
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {paymentMethod === 'bank-transfer' && (
            <motion.div
              key="transfer-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <h5 className="mb-4 flex items-center gap-2">
                  <Building2 size={20} className="text-[#3A7AFE]" />
                  Transferencia Bancaria
                </h5>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Banco:</span>
                      <span className="font-medium">Bancolombia</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipo de cuenta:</span>
                      <span className="font-medium">Ahorros</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Número de cuenta:</span>
                      <span className="font-medium">123-456789-01</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Titular:</span>
                      <span className="font-medium">G2RISM S.A.S.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">NIT:</span>
                      <span className="font-medium">900.123.456-7</span>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-start gap-3">
                    <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <p className="font-medium mb-1">Importante</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Realiza la transferencia por el monto total</li>
                        <li>Envía el comprobante a: pagos@g2rism.com</li>
                        <li>Tu reserva será confirmada en 1-2 días hábiles</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {paymentMethod === 'cash' && (
            <motion.div key="cash-form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <h5 className="mb-4 flex items-center gap-2">
                  <Banknote size={20} className="text-[#3A7AFE]" />
                  Pago en Efectivo
                </h5>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h6 className="mb-3">Nuestras Oficinas</h6>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin size={18} className="text-[#3A7AFE] flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-medium">Oficina Principal</p>
                          <p className="text-sm text-gray-600">
                            Calle 100 #19-30, Bogotá
                            <br />
                            Lunes a Viernes: 9:00 AM - 6:00 PM
                            <br />
                            Sábados: 9:00 AM - 2:00 PM
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin size={18} className="text-[#3A7AFE] flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-medium">Sucursal Centro Comercial</p>
                          <p className="text-sm text-gray-600">
                            Centro Andino, Local 234
                            <br />
                            Lunes a Domingo: 10:00 AM - 8:00 PM
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                    <Info size={20} className="text-[#3A7AFE] flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <p className="font-medium mb-1">¿Cómo funciona?</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Confirma tu reserva aquí</li>
                        <li>Recibirás un código de referencia</li>
                        <li>Visita cualquiera de nuestras oficinas</li>
                        <li>Realiza el pago en efectivo o con tarjeta</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Información fiscal DIAN */}
          <Card>
            <h5 className="mb-4 flex items-center gap-2">
              <FileText size={20} className="text-[#3A7AFE]" />
              Información de Facturación DIAN
            </h5>
            <div className="space-y-4">
              <Select
                label="Tipo de factura"
                value={paymentData.invoiceType}
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    invoiceType: e.target.value as 'factura' | 'factura-simplificada',
                  })
                }
                options={[
                  { value: 'factura', label: 'Factura Electrónica' },
                  { value: 'factura-simplificada', label: 'Factura Simplificada' },
                ]}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Tipo de documento"
                  value={paymentData.fiscalDocType}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, fiscalDocType: e.target.value as any })
                  }
                  options={[
                    { value: 'CC', label: 'Cédula de Ciudadanía' },
                    { value: 'NIT', label: 'NIT' },
                    { value: 'CE', label: 'Cédula de Extranjería' },
                    { value: 'Pasaporte', label: 'Pasaporte' },
                  ]}
                />
                <Input
                  label="Número de documento"
                  placeholder="123456789"
                  value={paymentData.fiscalDocNumber}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, fiscalDocNumber: e.target.value })
                  }
                />
              </div>

              <Input
                label="Nombre o razón social"
                placeholder="Nombre completo o empresa"
                value={paymentData.fiscalName}
                onChange={(e) => setPaymentData({ ...paymentData, fiscalName: e.target.value })}
              />

              <Input
                label="Dirección"
                placeholder="Dirección completa"
                value={paymentData.fiscalAddress}
                onChange={(e) => setPaymentData({ ...paymentData, fiscalAddress: e.target.value })}
                icon={<MapPin size={18} />}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Ciudad"
                  placeholder="Ej: Bogotá"
                  value={paymentData.fiscalCity}
                  onChange={(e) => setPaymentData({ ...paymentData, fiscalCity: e.target.value })}
                />
                <Input
                  label="Teléfono"
                  placeholder="300 123 4567"
                  value={paymentData.fiscalPhone}
                  onChange={(e) => setPaymentData({ ...paymentData, fiscalPhone: e.target.value })}
                  icon={<Phone size={18} />}
                />
              </div>

              <Input
                label="Email para factura electrónica"
                type="email"
                placeholder="correo@ejemplo.com"
                value={paymentData.fiscalEmail}
                onChange={(e) => setPaymentData({ ...paymentData, fiscalEmail: e.target.value })}
              />
            </div>
          </Card>

          {/* Términos y condiciones */}
          <Card>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={paymentData.acceptedTerms}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, acceptedTerms: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 rounded border-2 border-gray-300 bg-white text-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-0 cursor-pointer transition-all checked:bg-[#3A7AFE] checked:border-[#3A7AFE] hover:border-[#3A7AFE] accent-[#3A7AFE]"
                />
                <span className="text-sm text-gray-700">
                  Acepto los{' '}
                  <a href="#" className="text-[#3A7AFE] hover:underline">
                    términos y condiciones
                  </a>{' '}
                  del servicio
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={paymentData.acceptedPolicies}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, acceptedPolicies: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 rounded border-2 border-gray-300 bg-white text-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-0 cursor-pointer transition-all checked:bg-[#3A7AFE] checked:border-[#3A7AFE] hover:border-[#3A7AFE] accent-[#3A7AFE]"
                />
                <span className="text-sm text-gray-700">
                  Acepto las{' '}
                  <a href="#" className="text-[#3A7AFE] hover:underline">
                    políticas de cancelación y reembolso
                  </a>
                </span>
              </label>
            </div>
          </Card>
        </div>

        {/* Columna derecha - Resumen */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            {/* Resumen de compra */}
            <Card>
              <h5 className="mb-4">Resumen de Compra</h5>
              <div className="space-y-3">
                <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
                  <img
                    src={bookingData.selectedPackage?.image}
                    alt={bookingData.selectedPackage?.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{bookingData.selectedPackage?.name}</p>
                    <p className="text-xs text-gray-600">
                      {bookingData.selectedPackage?.duration}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Paquete × {bookingData.adults} adultos
                    </span>
                    <span className="font-medium">${subtotal.toLocaleString()}</span>
                  </div>

                  {insuranceCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Seguro de viaje</span>
                      <span className="font-medium">${insuranceCost.toLocaleString()}</span>
                    </div>
                  )}

                  {extrasCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Extras y excursiones</span>
                      <span className="font-medium">${extrasCost.toLocaleString()}</span>
                    </div>
                  )}

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento aplicado</span>
                      <span>-${discount.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-200 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotalWithExtras.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">IVA (19%)</span>
                    <span className="font-medium">${taxes.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#3A7AFE]">
                        ${totalAmount.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">COP</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Seguridad */}
            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
              <div className="flex items-start gap-3">
                <Shield size={24} className="text-green-600 flex-shrink-0" />
                <div>
                  <h6 className="text-green-900 mb-2">Pago 100% Seguro</h6>
                  <ul className="text-xs text-green-800 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} />
                      Encriptación SSL 256-bit
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} />
                      Certificado PCI DSS
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} />
                      Protección de datos GDPR
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Botones de acción */}
            <div className="space-y-3">
              <Button
                onClick={handleProcessPayment}
                disabled={processing}
                fullWidth
                size="lg"
                icon={processing ? undefined : <Lock size={18} />}
                iconPosition="right"
              >
                {processing ? 'Procesando...' : `Pagar ${totalAmount.toLocaleString()} COP`}
              </Button>

              <Button onClick={onBack} variant="secondary" fullWidth icon={<ArrowLeft size={18} />}>
                Volver
              </Button>
            </div>

            {/* Garantías */}
            <div className="text-center text-xs text-gray-600 space-y-2">
              <div className="flex items-center justify-center gap-4">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                  alt="Visa"
                  className="h-5 opacity-60"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                  alt="Mastercard"
                  className="h-5 opacity-60"
                />
                <Lock size={16} className="text-gray-400" />
              </div>
              <p>Tu información está protegida y encriptada</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}