import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  Users,
  MapPin,
  Plane,
  Hotel,
  Car,
  Utensils,
  Shield,
  CreditCard,
  Lock,
  Star,
  Clock,
  X,
  Plus,
  Minus,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PaymentPage } from './payment/PaymentPage';

interface BookingFlowProps {
  selectedPackage?: any;
  onClose: () => void;
  onComplete: (booking: any) => void;
}

type BookingStep = 'search' | 'package-details' | 'travelers' | 'extras' | 'payment' | 'confirmation';

export function BookingFlow({ selectedPackage, onClose, onComplete }: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState<BookingStep>('search');
  const [bookingData, setBookingData] = useState({
    destination: selectedPackage?.name || '',
    departureDate: '',
    returnDate: '',
    adults: 2,
    children: 0,
    selectedPackage: selectedPackage || null,
    travelers: [] as any[],
    extras: {
      insurance: false,
      carRental: false,
      excursions: [],
    },
    payment: {
      method: 'credit-card',
      cardNumber: '',
      cardName: '',
      cardExpiry: '',
      cardCVV: '',
    },
  });

  const steps = [
    { id: 'search', label: 'Búsqueda', icon: MapPin },
    { id: 'package-details', label: 'Paquete', icon: Plane },
    { id: 'travelers', label: 'Viajeros', icon: Users },
    { id: 'extras', label: 'Extras', icon: Plus },
    { id: 'payment', label: 'Pago', icon: CreditCard },
    { id: 'confirmation', label: 'Confirmación', icon: CheckCircle2 },
  ];

  const availablePackages = [
    {
      id: 1,
      name: 'Santorini, Grecia',
      country: 'Grecia',
      duration: '7 días / 6 noches',
      price: 1500,
      originalPrice: 1800,
      rating: 4.8,
      reviews: 342,
      image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&q=80',
      includes: ['Vuelos ida y vuelta', 'Hotel 5★', 'Desayuno incluido', 'Tours guiados', 'Seguro básico'],
      highlights: ['Atardecer en Oia', 'Playas volcánicas', 'Vinos locales', 'Crucero por la caldera'],
    },
    {
      id: 2,
      name: 'Bali, Indonesia',
      country: 'Indonesia',
      duration: '10 días / 9 noches',
      price: 1200,
      originalPrice: 1500,
      rating: 4.9,
      reviews: 567,
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
      includes: ['Vuelos ida y vuelta', 'Resort 5★', 'Todo incluido', 'Spa y masajes', 'Tours culturales'],
      highlights: ['Templo Tanah Lot', 'Terrazas de arroz', 'Clases de surf', 'Gastronomía balinesa'],
    },
    {
      id: 3,
      name: 'Maldivas',
      country: 'Maldivas',
      duration: '5 días / 4 noches',
      price: 2000,
      originalPrice: 2200,
      rating: 5.0,
      reviews: 891,
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80',
      includes: ['Vuelos ida y vuelta', 'Villa sobre agua', 'Todo incluido premium', 'Deportes acuáticos', 'Spa'],
      highlights: ['Buceo y snorkel', 'Cenas románticas', 'Vida marina única', 'Aguas cristalinas'],
    },
  ];

  const availableExtras = [
    {
      id: 'insurance',
      name: 'Seguro de Viaje Premium',
      description: 'Cobertura completa con cancelación y emergencias médicas',
      price: 150,
      icon: Shield,
    },
    {
      id: 'carRental',
      name: 'Renta de Auto',
      description: 'Auto compacto por toda la estadía',
      price: 350,
      icon: Car,
    },
    {
      id: 'excursion1',
      name: 'Tour Gastronómico',
      description: 'Experiencia culinaria con chef local',
      price: 120,
      icon: Utensils,
    },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const handleNext = () => {
    const stepOrder: BookingStep[] = ['search', 'package-details', 'travelers', 'extras', 'payment', 'confirmation'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const stepOrder: BookingStep[] = ['search', 'package-details', 'travelers', 'extras', 'payment', 'confirmation'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const calculateTotal = () => {
    let total = bookingData.selectedPackage?.price || 0;
    total *= bookingData.adults + bookingData.children * 0.7; // Children 30% discount

    if (bookingData.extras.insurance) total += 150;
    if (bookingData.extras.carRental) total += 350;
    total += bookingData.extras.excursions.length * 120;

    return total;
  };

  const handleCompleteBooking = () => {
    const booking = {
      ...bookingData,
      bookingNumber: `G2R-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      total: calculateTotal(),
      status: 'Confirmado',
      createdAt: new Date().toISOString(),
    };
    onComplete(booking);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen py-8 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <div className="bg-white rounded-t-2xl p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2>Nueva Reserva</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = index < currentStepIndex;

                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : isActive
                            ? 'bg-[#3A7AFE] text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                      </div>
                      <span
                        className={`text-xs mt-2 hidden md:block ${
                          isActive ? 'text-[#3A7AFE] font-medium' : 'text-gray-500'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 -mt-6 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="bg-white p-6">
            <AnimatePresence mode="wait">
              {currentStep === 'search' && (
                <SearchStep
                  bookingData={bookingData}
                  setBookingData={setBookingData}
                  onNext={handleNext}
                />
              )}

              {currentStep === 'package-details' && (
                <PackageDetailsStep
                  packages={availablePackages}
                  bookingData={bookingData}
                  setBookingData={setBookingData}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}

              {currentStep === 'travelers' && (
                <TravelersStep
                  bookingData={bookingData}
                  setBookingData={setBookingData}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}

              {currentStep === 'extras' && (
                <ExtrasStep
                  availableExtras={availableExtras}
                  bookingData={bookingData}
                  setBookingData={setBookingData}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}

              {currentStep === 'payment' && (
                <PaymentPage
                  bookingData={bookingData}
                  total={calculateTotal()}
                  onBack={handleBack}
                  onComplete={(paymentData) => {
                    setBookingData({ ...bookingData, payment: paymentData });
                    handleNext();
                  }}
                />
              )}

              {currentStep === 'confirmation' && (
                <ConfirmationStep
                  bookingData={bookingData}
                  total={calculateTotal()}
                  onComplete={handleCompleteBooking}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Search Step Component
function SearchStep({ bookingData, setBookingData, onNext }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h4 className="mb-4">¿A dónde quieres viajar?</h4>
        <Input
          label="Destino"
          placeholder="Ej: París, Tokio, Cancún..."
          icon={<MapPin size={18} />}
          value={bookingData.destination}
          onChange={(e) => setBookingData({ ...bookingData, destination: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="date"
          label="Fecha de salida"
          icon={<Calendar size={18} />}
          value={bookingData.departureDate}
          onChange={(e) => setBookingData({ ...bookingData, departureDate: e.target.value })}
        />
        <Input
          type="date"
          label="Fecha de regreso"
          icon={<Calendar size={18} />}
          value={bookingData.returnDate}
          onChange={(e) => setBookingData({ ...bookingData, returnDate: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-2">Adultos</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setBookingData({
                  ...bookingData,
                  adults: Math.max(1, bookingData.adults - 1),
                })
              }
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              <Minus size={18} />
            </button>
            <span className="text-lg font-medium w-12 text-center">{bookingData.adults}</span>
            <button
              onClick={() =>
                setBookingData({
                  ...bookingData,
                  adults: Math.min(10, bookingData.adults + 1),
                })
              }
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2">Niños (2-12 años)</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setBookingData({
                  ...bookingData,
                  children: Math.max(0, bookingData.children - 1),
                })
              }
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              <Minus size={18} />
            </button>
            <span className="text-lg font-medium w-12 text-center">{bookingData.children}</span>
            <button
              onClick={() =>
                setBookingData({
                  ...bookingData,
                  children: Math.min(10, bookingData.children + 1),
                })
              }
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={onNext} icon={<ArrowRight size={18} />} iconPosition="right">
          Buscar Paquetes
        </Button>
      </div>
    </motion.div>
  );
}

// Package Details Step
function PackageDetailsStep({ packages, bookingData, setBookingData, onNext, onBack }: any) {
  const [selectedId, setSelectedId] = useState(bookingData.selectedPackage?.id || null);

  const handleSelectPackage = () => {
    const selected = packages.find((p: any) => p.id === selectedId);
    setBookingData({ ...bookingData, selectedPackage: selected });
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h4>Selecciona tu paquete</h4>

      <div className="grid grid-cols-1 gap-4">
        {packages.map((pkg: any) => (
          <div
            key={pkg.id}
            onClick={() => setSelectedId(pkg.id)}
            className={`cursor-pointer rounded-xl border-2 transition-all ${
              selectedId === pkg.id
                ? 'border-[#3A7AFE] bg-blue-50/50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex gap-4 p-4">
              <img
                src={pkg.image}
                alt={pkg.name}
                className="w-48 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h5 className="mb-1">{pkg.name}</h5>
                    <p className="text-sm text-gray-600">{pkg.country}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-yellow-500 mb-1">
                      <Star size={16} fill="currentColor" />
                      <span className="text-sm font-medium">{pkg.rating}</span>
                      <span className="text-xs text-gray-500">({pkg.reviews})</span>
                    </div>
                    <Badge variant="info">{pkg.duration}</Badge>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {pkg.includes.slice(0, 3).map((item: string, idx: number) => (
                    <Badge key={idx} variant="secondary" size="sm">
                      {item}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 line-through text-sm">
                      ${pkg.originalPrice}
                    </span>
                    <span className="text-2xl font-bold text-[#3A7AFE]">${pkg.price}</span>
                    <span className="text-sm text-gray-600">por persona</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4">
        <Button variant="secondary" onClick={onBack} icon={<ArrowLeft size={18} />}>
          Atrás
        </Button>
        <Button
          onClick={handleSelectPackage}
          disabled={!selectedId}
          icon={<ArrowRight size={18} />}
          iconPosition="right"
        >
          Continuar
        </Button>
      </div>
    </motion.div>
  );
}

// Travelers Step
function TravelersStep({ bookingData, setBookingData, onNext, onBack }: any) {
  const totalTravelers = bookingData.adults + bookingData.children;
  const [travelers, setTravelers] = useState(
    bookingData.travelers.length > 0
      ? bookingData.travelers
      : Array.from({ length: totalTravelers }, (_, i) => ({
          id: i,
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          documentType: 'passport',
          documentNumber: '',
          isChild: i >= bookingData.adults,
        }))
  );

  const handleContinue = () => {
    setBookingData({ ...bookingData, travelers });
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h4>Información de los viajeros</h4>

      <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
        {travelers.map((traveler: any, index: number) => (
          <Card key={traveler.id}>
            <h6 className="mb-4">
              {traveler.isChild ? 'Niño' : 'Adulto'} {index + 1}
            </h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre"
                placeholder="Nombre"
                value={traveler.firstName}
                onChange={(e) => {
                  const newTravelers = [...travelers];
                  newTravelers[index].firstName = e.target.value;
                  setTravelers(newTravelers);
                }}
              />
              <Input
                label="Apellido"
                placeholder="Apellido"
                value={traveler.lastName}
                onChange={(e) => {
                  const newTravelers = [...travelers];
                  newTravelers[index].lastName = e.target.value;
                  setTravelers(newTravelers);
                }}
              />
              <Input
                type="date"
                label="Fecha de nacimiento"
                value={traveler.dateOfBirth}
                onChange={(e) => {
                  const newTravelers = [...travelers];
                  newTravelers[index].dateOfBirth = e.target.value;
                  setTravelers(newTravelers);
                }}
              />
              <Input
                label="Número de pasaporte"
                placeholder="A12345678"
                value={traveler.documentNumber}
                onChange={(e) => {
                  const newTravelers = [...travelers];
                  newTravelers[index].documentNumber = e.target.value;
                  setTravelers(newTravelers);
                }}
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4">
        <Button variant="secondary" onClick={onBack} icon={<ArrowLeft size={18} />}>
          Atrás
        </Button>
        <Button onClick={handleContinue} icon={<ArrowRight size={18} />} iconPosition="right">
          Continuar
        </Button>
      </div>
    </motion.div>
  );
}

// Extras Step
function ExtrasStep({ availableExtras, bookingData, setBookingData, onNext, onBack }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h4 className="mb-2">Mejora tu experiencia</h4>
        <p className="text-gray-600">Agrega servicios adicionales a tu viaje</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {availableExtras.map((extra: any) => {
          const Icon = extra.icon;
          const isSelected =
            (extra.id === 'insurance' && bookingData.extras.insurance) ||
            (extra.id === 'carRental' && bookingData.extras.carRental) ||
            bookingData.extras.excursions.includes(extra.id);

          return (
            <div
              key={extra.id}
              onClick={() => {
                const newExtras = { ...bookingData.extras };
                if (extra.id === 'insurance') {
                  newExtras.insurance = !newExtras.insurance;
                } else if (extra.id === 'carRental') {
                  newExtras.carRental = !newExtras.carRental;
                } else {
                  if (newExtras.excursions.includes(extra.id)) {
                    newExtras.excursions = newExtras.excursions.filter((id: string) => id !== extra.id);
                  } else {
                    newExtras.excursions = [...newExtras.excursions, extra.id];
                  }
                }
                setBookingData({ ...bookingData, extras: newExtras });
              }}
              className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                isSelected
                  ? 'border-[#3A7AFE] bg-blue-50/50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Icon size={24} className="text-[#3A7AFE]" />
                </div>
                <div className="flex-1">
                  <h6 className="mb-1">{extra.name}</h6>
                  <p className="text-sm text-gray-600">{extra.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-[#3A7AFE]">+${extra.price}</p>
                  {isSelected && (
                    <Badge variant="success" size="sm" className="mt-1">
                      Agregado
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4">
        <Button variant="secondary" onClick={onBack} icon={<ArrowLeft size={18} />}>
          Atrás
        </Button>
        <Button onClick={onNext} icon={<ArrowRight size={18} />} iconPosition="right">
          Continuar al Pago
        </Button>
      </div>
    </motion.div>
  );
}

// Confirmation Step
function ConfirmationStep({ bookingData, total, onComplete }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6 py-8"
    >
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 size={48} className="text-green-600" />
      </div>

      <div>
        <h3 className="mb-2">¡Reserva Confirmada!</h3>
        <p className="text-gray-600">
          Tu viaje a <strong>{bookingData.selectedPackage?.name}</strong> ha sido confirmado
        </p>
      </div>

      <Card className="text-left max-w-md mx-auto">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Número de reserva:</span>
            <span className="font-medium">
              G2R-{new Date().getFullYear()}-{Math.floor(Math.random() * 1000).toString().padStart(3, '0')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Destino:</span>
            <span className="font-medium">{bookingData.selectedPackage?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Fecha de salida:</span>
            <span className="font-medium">{bookingData.departureDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Viajeros:</span>
            <span className="font-medium">
              {bookingData.adults} adultos, {bookingData.children} niños
            </span>
          </div>
          <div className="pt-3 border-t border-gray-200 flex justify-between">
            <span className="text-gray-600">Total pagado:</span>
            <span className="text-xl font-bold text-[#3A7AFE]">${total.toLocaleString()}</span>
          </div>
        </div>
      </Card>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-gray-700">
          📧 Hemos enviado la confirmación a tu correo electrónico con todos los detalles de tu
          viaje
        </p>
      </div>

      <Button onClick={onComplete} size="lg">
        Ver Mis Reservas
      </Button>
    </motion.div>
  );
}