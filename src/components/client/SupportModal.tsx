import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  X,
  MessageSquare,
  Phone,
  Mail,
  HelpCircle,
  Send,
  User,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

interface SupportModalProps {
  show: boolean;
  onClose: () => void;
}

export function SupportModal({ show, onClose }: SupportModalProps) {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([
    {
      id: 1,
      type: 'agent' as const,
      message: '¡Hola! Soy María del equipo de soporte de G2rism. ¿En qué puedo ayudarte hoy?',
      time: '10:30',
    },
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    setChat([
      ...chat,
      {
        id: chat.length + 1,
        type: 'user' as const,
        message: message,
        time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    setMessage('');

    // Simulate agent response
    setTimeout(() => {
      setChat((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: 'agent' as const,
          message: 'Gracias por tu consulta. Un agente te responderá en breve con información detallada.',
          time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1500);
  };

  const faqs = [
    {
      question: '¿Cómo puedo modificar mi reserva?',
      answer: 'Ve a "Mis Reservas" y haz clic en la reserva que deseas modificar.',
    },
    {
      question: '¿Cuál es la política de cancelación?',
      answer: 'Puedes cancelar hasta 48 horas antes sin costo adicional.',
    },
    {
      question: '¿Qué documentos necesito?',
      answer: 'Pasaporte vigente, visa (si aplica) y certificado de vacunación.',
    },
  ];

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#3A7AFE] to-[#1A2440]">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white mb-1">Centro de Soporte</h4>
                <p className="text-white/90 text-sm">Estamos aquí para ayudarte 24/7</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(90vh-120px)]">
            {/* Left Side - Contact Options & FAQs */}
            <div className="md:col-span-1 border-r border-gray-200 overflow-y-auto p-6 space-y-6">
              <div>
                <h6 className="mb-4">Contacto Directo</h6>
                <div className="space-y-3">
                  <Card hover className="cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#3A7AFE]/10 text-[#3A7AFE] rounded-lg">
                        <Phone size={20} />
                      </div>
                      <div>
                        <p className="text-sm">Llámanos</p>
                        <p className="text-xs text-gray-600">+57 300 123 4567</p>
                      </div>
                    </div>
                  </Card>

                  <Card hover className="cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#10B981]/10 text-[#10B981] rounded-lg">
                        <Mail size={20} />
                      </div>
                      <div>
                        <p className="text-sm">Email</p>
                        <p className="text-xs text-gray-600">soporte@g2rism.com</p>
                      </div>
                    </div>
                  </Card>

                  <Card hover className="cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#F59E0B]/10 text-[#F59E0B] rounded-lg">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="text-sm">Horario</p>
                        <p className="text-xs text-gray-600">24/7 disponible</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <div>
                <h6 className="mb-4">Preguntas Frecuentes</h6>
                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <Card key={index} hover className="cursor-pointer">
                      <div className="flex gap-3">
                        <HelpCircle size={18} className="text-[#3A7AFE] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm mb-1">{faq.question}</p>
                          <p className="text-xs text-gray-600">{faq.answer}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Chat */}
            <div className="md:col-span-2 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#3A7AFE]/10 flex items-center justify-center text-[#3A7AFE]">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-sm">María - Agente de Soporte</p>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                      <span className="text-xs text-gray-600">En línea</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chat.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.type === 'user'
                          ? 'bg-[#3A7AFE] text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm mb-1">{msg.message}</p>
                      <span className={`text-xs ${msg.type === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent"
                  />
                  <Button
                    variant="primary"
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}