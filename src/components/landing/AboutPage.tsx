import React from 'react';
import { Logo } from '../layout/Logo';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Target, Users, Heart, Award, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface AboutPageProps {
  onBackToHome: () => void;
}

export function AboutPage({ onBackToHome }: AboutPageProps) {
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
            <h1 className="text-white mb-6">Sobre G2rism</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Tu plataforma de gestión turística de confianza
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Us Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1601509876296-aba16d4c10a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlYW0lMjBjb2xsYWJvcmF0aW9ufGVufDF8fHx8MTc2NDk5MTc3M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Equipo G2rism"
                className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-[#1A2440] mb-4">Nuestra Historia</h3>
              <p className="text-gray-600 mb-6">
                Desde 2008, G2rism ha sido la plataforma líder en gestión turística para agencias de viajes.
                Con más de 15 años de experiencia, hemos ayudado a miles de empresas a transformar su manera
                de gestionar reservas, clientes y operaciones.
              </p>
              <p className="text-gray-600 mb-6">
                Nuestro compromiso es proporcionar tecnología innovadora que simplifique los procesos complejos
                del sector turístico, permitiendo a nuestros clientes enfocarse en lo que mejor saben hacer:
                crear experiencias inolvidables para sus viajeros.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-3xl text-[#3A7AFE] mb-2">10,000+</div>
                  <p className="text-gray-600 text-sm">Clientes Activos</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-3xl text-[#3A7AFE] mb-2">150+</div>
                  <p className="text-gray-600 text-sm">Países Atendidos</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: <Target size={32} />,
                title: 'Misión',
                description: 'Revolucionar la gestión turística con tecnología accesible e innovadora',
              },
              {
                icon: <Users size={32} />,
                title: 'Equipo',
                description: 'Profesionales apasionados por el turismo y la tecnología',
              },
              {
                icon: <Heart size={32} />,
                title: 'Valores',
                description: 'Compromiso, innovación y excelencia en cada servicio',
              },
              {
                icon: <Award size={32} />,
                title: 'Calidad',
                description: 'Certificados internacionales y reconocimientos del sector',
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center h-full">
                  <div className="inline-flex p-4 bg-[#3A7AFE]/10 text-[#3A7AFE] rounded-xl mb-4">
                    {value.icon}
                  </div>
                  <h6 className="mb-3">{value.title}</h6>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="mb-4">¿Por qué elegir G2rism?</h2>
            <p className="text-gray-600 text-lg">
              Más que una plataforma, somos tu socio estratégico
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <div className="text-4xl text-[#3A7AFE] mb-4">🚀</div>
              <h5 className="mb-3">Innovación Constante</h5>
              <p className="text-gray-600">
                Actualizaciones regulares con las últimas tecnologías y tendencias del sector turístico
              </p>
            </Card>

            <Card className="text-center">
              <div className="text-4xl text-[#3A7AFE] mb-4">🛡️</div>
              <h5 className="mb-3">Seguridad Garantizada</h5>
              <p className="text-gray-600">
                Protección de datos de nivel empresarial con certificaciones internacionales
              </p>
            </Card>

            <Card className="text-center">
              <div className="text-4xl text-[#3A7AFE] mb-4">💬</div>
              <h5 className="mb-3">Soporte Dedicado</h5>
              <p className="text-gray-600">
                Equipo de expertos disponible 24/7 para resolver cualquier duda o inconveniente
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-[#1A2440] mb-4">¿Listo para transformar tu agencia?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Únete a miles de agencias que ya confían en G2rism
          </p>
          <Button size="lg" onClick={onBackToHome}>
            Comenzar ahora
          </Button>
        </div>
      </section>
    </div>
  );
}
