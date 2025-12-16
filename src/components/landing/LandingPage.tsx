import React, { useState } from 'react';
import { Logo } from '../layout/Logo';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import {
  Star,
  Plane,
  Package,
  Headphones,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LandingPageProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onAboutClick: () => void;
  onContactClick: () => void;
}

export function LandingPage({ onLoginClick, onRegisterClick, onAboutClick, onContactClick }: LandingPageProps) {
  const destinations = [
    {
      id: 1,
      name: 'París, Francia',
      price: 1200,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
    },
    {
      id: 2,
      name: 'Tokio, Japón',
      price: 1800,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',
    },
    {
      id: 3,
      name: 'Santorini, Grecia',
      price: 1500,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&q=80',
    },
    {
      id: 4,
      name: 'Nueva York, USA',
      price: 1100,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80',
    },
  ];

  const services = [
    {
      icon: <Plane size={32} />,
      title: 'Gestión de Vuelos',
      description: 'Reserva y gestiona vuelos con las mejores aerolíneas del mundo',
    },
    {
      icon: <Package size={32} />,
      title: 'Paquetes Personalizados',
      description: 'Crea tu viaje perfecto con nuestros paquetes a medida',
    },
    {
      icon: <Headphones size={32} />,
      title: 'Asesoría 24/7',
      description: 'Soporte dedicado en cualquier momento que lo necesites',
    },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Logo size="sm" />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              <a href="#inicio" className="text-sm lg:text-base text-gray-700 hover:text-[#3A7AFE] transition-colors">
                Inicio
              </a>
              <a href="#servicios" className="text-sm lg:text-base text-gray-700 hover:text-[#3A7AFE] transition-colors">
                Servicios
              </a>
              <a href="#destinos" className="text-sm lg:text-base text-gray-700 hover:text-[#3A7AFE] transition-colors">
                Destinos
              </a>
              <button onClick={onAboutClick} className="text-sm lg:text-base text-gray-700 hover:text-[#3A7AFE] transition-colors">
                Nosotros
              </button>
              <button onClick={onContactClick} className="text-sm lg:text-base text-gray-700 hover:text-[#3A7AFE] transition-colors">
                Contacto
              </button>
            </nav>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              <Button variant="secondary" onClick={onLoginClick} size="sm">
                Iniciar Sesión
              </Button>
              <Button onClick={onRegisterClick} size="sm">
                Registrarse
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden overflow-hidden"
              >
                <div className="py-4 space-y-3 border-t border-gray-200 mt-3">
                  <a
                    href="#inicio"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-[#3A7AFE] transition-colors"
                  >
                    Inicio
                  </a>
                  <a
                    href="#servicios"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-[#3A7AFE] transition-colors"
                  >
                    Servicios
                  </a>
                  <a
                    href="#destinos"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-[#3A7AFE] transition-colors"
                  >
                    Destinos
                  </a>
                  <button
                    onClick={() => {
                      onAboutClick();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-gray-700 hover:text-[#3A7AFE] transition-colors"
                  >
                    Nosotros
                  </button>
                  <button
                    onClick={() => {
                      onContactClick();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-gray-700 hover:text-[#3A7AFE] transition-colors"
                  >
                    Contacto
                  </button>

                  <div className="flex flex-col gap-2 pt-3">
                    <Button variant="secondary" onClick={onLoginClick} fullWidth>
                      Iniciar Sesión
                    </Button>
                    <Button onClick={onRegisterClick} fullWidth>
                      Registrarse
                    </Button>
                  </div>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative min-h-[600px] sm:min-h-[700px] md:min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A2440]/80 to-[#3A7AFE]/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 text-white w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-white mb-4 sm:mb-6 text-2xl sm:text-4xl md:text-5xl lg:text-6xl break-words px-2">
              Tu próxima aventura comienza aquí
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-12 px-4">
              Descubre el mundo con G2rism, tu plataforma de gestión turística de confianza
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8 mt-8 sm:mt-12 md:mt-16 px-2">
              {[
                { value: '10K+', label: 'Clientes Satisfechos' },
                { value: '150+', label: 'Destinos Disponibles' },
                { value: '15+', label: 'Años de Experiencia' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-center"
                >
                  <h2 className="text-white mb-1 sm:mb-2 text-xl sm:text-3xl md:text-4xl lg:text-5xl">{stat.value}</h2>
                  <p className="text-white/80 text-xs sm:text-sm md:text-base break-words">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section id="servicios" className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl">Nuestros Servicios</h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg px-4">Todo lo que necesitas para tu viaje perfecto</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center h-full">
                  <div className="inline-flex p-3 sm:p-4 bg-[#3A7AFE]/10 text-[#3A7AFE] rounded-xl mb-3 sm:mb-4">
                    {service.icon}
                  </div>
                  <h5 className="mb-2 sm:mb-3 text-base sm:text-lg">{service.title}</h5>
                  <p className="text-gray-600 text-sm sm:text-base">{service.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section id="destinos" className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl">Destinos Populares</h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg px-4">Explora los lugares más increíbles del mundo</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {destinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card hover className="overflow-hidden cursor-pointer">
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                      <Badge variant="success">
                        <Star size={12} className="inline mr-1" />
                        {destination.rating}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h6 className="mb-2 text-sm sm:text-base">{destination.name}</h6>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-xs sm:text-sm">Desde</span>
                      <span className="text-[#3A7AFE] text-sm sm:text-base font-semibold">${destination.price}</span>
                    </div>
                    <Button variant="secondary" size="sm" fullWidth className="mt-3">
                      Ver más
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#F5F6FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-[#1A2440] mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl">¿Listo para tu próxima aventura?</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 px-4">
            Únete a miles de viajeros que ya confían en nosotros
          </p>
          <Button size="lg" onClick={onRegisterClick}>
            Comenzar ahora <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="animated-gradient text-white py-8 sm:py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Left Column - Brand */}
            <div className="w-full md:w-[45%]">
              <h5 className="text-white mb-2 sm:mb-3 text-lg sm:text-xl">G2rism</h5>
              <p className="text-white/90 text-sm sm:text-base">
                Tu plataforma de gestión turística de confianza desde 2008.
              </p>
            </div>

            {/* Right Column - Social */}
            <div className="w-full md:w-[45%]">
              <h5 className="text-white mb-2 sm:mb-3 text-lg sm:text-xl">Síguenos</h5>
              <p className="text-white/90 mb-3 sm:mb-4 text-sm sm:text-base">
                Conecta con nosotros en redes sociales
              </p>
              <div className="flex gap-2 sm:gap-3">
                <a 
                  href="#" 
                  className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={18} className="sm:w-5 sm:h-5" />
                </a>
                <a 
                  href="#" 
                  className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={18} className="sm:w-5 sm:h-5" />
                </a>
                <a 
                  href="#" 
                  className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter size={18} className="sm:w-5 sm:h-5" />
                </a>
                <a 
                  href="#" 
                  className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} className="sm:w-5 sm:h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-4 sm:pt-6 border-t border-white/10 text-center text-xs sm:text-sm text-white/70">
            © 2025 codelab. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}