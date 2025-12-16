import React from 'react';
import { X } from 'lucide-react';
import { PaymentPage } from './PaymentPage';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface BookingPaymentModalProps {
  booking: any;
  onClose: () => void;
  onPaymentComplete: (paymentData: any) => void;
}

export function BookingPaymentModal({ booking, onClose, onPaymentComplete }: BookingPaymentModalProps) {
  // Simular datos del paquete para el componente de pago
  const bookingAsPackageData = {
    selectedPackage: {
      id: booking.id,
      name: booking.destination,
      image: booking.image,
      price: booking.price / booking.travelers, // Precio por persona
      duration: booking.type,
    },
    adults: booking.travelers,
    children: 0,
    departureDate: booking.dates.split('-')[0].trim(),
    returnDate: booking.dates.split('-')[1]?.trim() || '',
    extras: {
      insurance: booking.services.includes('Seguro'),
      carRental: false,
      excursions: [],
    },
  };

  const handlePaymentComplete = (paymentData: any) => {
    toast.success('¡Pago completado exitosamente!');
    onPaymentComplete({
      ...paymentData,
      bookingNumber: booking.bookingNumber,
      bookingId: booking.id,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen py-8 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="bg-white rounded-t-2xl p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3>Completar Pago</h3>
                <p className="text-gray-600 mt-1">
                  Reserva {booking.bookingNumber} • {booking.destination}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-b-2xl p-6">
            <PaymentPage
              bookingData={bookingAsPackageData}
              total={booking.price}
              onBack={onClose}
              onComplete={handlePaymentComplete}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
