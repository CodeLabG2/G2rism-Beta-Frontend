import React, { useState } from 'react';
import { Logo } from '../layout/Logo';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Mail, Phone, MapPin, Clock, Send, ArrowLeft, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { motion } from 'motion/react';

interface ContactPageProps {
  onBackToHome: () => void;
}

export function ContactPage({ onBackToHome }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de envío real
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo size="sm" />
            <Button variant="secondary" onClick={onBackToHome}>
              <ArrowLeft size={18} className="mr-2" />
              Volver al inicio
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#3A7AFE] to-[#1A2440] text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-white mb-6">Contáctanos</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Estamos aquí para responder todas tus preguntas y ayudarte a comenzar tu próxima aventura
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="mb-4">Envíanos un mensaje</h2>
              <p className="text-gray-600 text-lg mb-8">
                Completa el formulario y nos pondremos en contacto contigo lo antes posible
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 mb-2">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent"
                      placeholder="Tu nombre"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent"
                      placeholder="+57 123 456 7890"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent"
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-gray-700 mb-2">
                    Asunto *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent"
                    required
                  >
                    <option value="">Selecciona un asunto</option>
                    <option value="info">Información general</option>
                    <option value="reserva">Consulta sobre reservas</option>
                    <option value="paquetes">Paquetes turísticos</option>
                    <option value="soporte">Soporte técnico</option>
                    <option value="ventas">Ventas y cotizaciones</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-700 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent resize-none"
                    placeholder="Cuéntanos, ¿en qué podemos ayudarte?"
                    required
                  />
                </div>

                <Button type="submit" size="lg" fullWidth>
                  Enviar mensaje <Send size={18} className="ml-2" />
                </Button>

                {formSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center"
                  >
                    ✓ ¡Tu mensaje ha sido enviado exitosamente! Nos pondremos en contacto contigo pronto.
                  </motion.div>
                )}
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h2 className="mb-6">Información de contacto</h2>
                <div className="space-y-6">
                  <Card className="flex items-start gap-4 hover:shadow-lg transition-shadow">
                    <div className="flex-shrink-0 p-3 bg-[#3A7AFE]/10 text-[#3A7AFE] rounded-lg">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h6 className="mb-1">Email</h6>
                      <p className="text-gray-600">info@g2rism.com</p>
                      <p className="text-gray-600">soporte@g2rism.com</p>
                    </div>
                  </Card>

                  <Card className="flex items-start gap-4 hover:shadow-lg transition-shadow">
                    <div className="flex-shrink-0 p-3 bg-[#3A7AFE]/10 text-[#3A7AFE] rounded-lg">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h6 className="mb-1">Teléfono</h6>
                      <p className="text-gray-600">+57 123 456 7890</p>
                      <p className="text-gray-600">+57 098 765 4321</p>
                    </div>
                  </Card>

                  <Card className="flex items-start gap-4 hover:shadow-lg transition-shadow">
                    <div className="flex-shrink-0 p-3 bg-[#3A7AFE]/10 text-[#3A7AFE] rounded-lg">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h6 className="mb-1">Ubicación</h6>
                      <p className="text-gray-600">Medellín, Antioquia</p>
                      <p className="text-gray-600">Colombia</p>
                    </div>
                  </Card>

                  <Card className="flex items-start gap-4 hover:shadow-lg transition-shadow">
                    <div className="flex-shrink-0 p-3 bg-[#3A7AFE]/10 text-[#3A7AFE] rounded-lg">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h6 className="mb-1">Horario de atención</h6>
                      <p className="text-gray-600">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-600">Sábados: 9:00 AM - 1:00 PM</p>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h5 className="mb-4">Síguenos en redes sociales</h5>
                <p className="text-gray-600 mb-4">
                  Mantente al día con nuestras últimas ofertas y destinos
                </p>
                <div className="flex gap-3">
                  <a 
                    href="#" 
                    className="p-3 bg-[#3A7AFE]/10 text-[#3A7AFE] hover:bg-[#3A7AFE] hover:text-white rounded-lg transition-all"
                  >
                    <Facebook size={24} />
                  </a>
                  <a 
                    href="#" 
                    className="p-3 bg-[#3A7AFE]/10 text-[#3A7AFE] hover:bg-[#3A7AFE] hover:text-white rounded-lg transition-all"
                  >
                    <Instagram size={24} />
                  </a>
                  <a 
                    href="#" 
                    className="p-3 bg-[#3A7AFE]/10 text-[#3A7AFE] hover:bg-[#3A7AFE] hover:text-white rounded-lg transition-all"
                  >
                    <Twitter size={24} />
                  </a>
                  <a 
                    href="#" 
                    className="p-3 bg-[#3A7AFE]/10 text-[#3A7AFE] hover:bg-[#3A7AFE] hover:text-white rounded-lg transition-all"
                  >
                    <Linkedin size={24} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="mb-4">Preguntas frecuentes</h2>
            <p className="text-gray-600 text-lg">
              Antes de contactarnos, quizás encuentres tu respuesta aquí
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              {
                question: '¿Cuánto tiempo tardan en responder?',
                answer: 'Respondemos todos los mensajes en menos de 24 horas hábiles.',
              },
              {
                question: '¿Tienen atención en otros idiomas?',
                answer: 'Sí, ofrecemos atención en español, inglés y portugués.',
              },
              {
                question: '¿Puedo agendar una videollamada?',
                answer: 'Por supuesto, menciona en tu mensaje que prefieres una videollamada.',
              },
              {
                question: '¿Tienen oficinas físicas?',
                answer: 'Actualmente operamos digitalmente, pero podemos coordinar reuniones presenciales en Medellín.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <h6 className="mb-2 text-[#1A2440]">{faq.question}</h6>
                  <p className="text-gray-600">{faq.answer}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-[#1A2440] mb-4">¿Prefieres hablar directamente?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Llámanos ahora y uno de nuestros asesores te atenderá de inmediato
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => window.location.href = 'tel:+571234567890'}>
              <Phone size={18} className="mr-2" />
              +57 123 456 7890
            </Button>
            <Button size="lg" variant="secondary" onClick={onBackToHome}>
              Volver al inicio
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
