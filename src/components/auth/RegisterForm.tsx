import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Mail, Lock, User, Phone } from 'lucide-react';
import { Logo } from '../layout/Logo';
import { motion } from 'motion/react';

interface RegisterFormProps {
  onRegister: (data: any) => void;
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onRegister, onSwitchToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    const newErrors: any = {};
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onRegister(formData);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Gradient */}
      <div className="hidden lg:flex lg:w-1/2 animated-gradient items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-white max-w-md"
        >
          <Logo size="lg" variant="light" className="justify-center mb-8" />
          <h2 className="text-white mb-4">Comienza tu aventura</h2>
          <p className="text-white/90 text-lg">
            Únete a miles de viajeros que confían en G2rism
          </p>
          <div className="mt-12 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&q=80"
              alt="Adventure"
              className="rounded-2xl shadow-2xl max-w-sm"
            />
          </div>
        </motion.div>
      </div>

      {/* Right side - Register form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size="md" />
          </div>

          <div className="mb-8">
            <h3 className="mb-2">Crear cuenta</h3>
            <p className="text-gray-600">Completa tus datos para registrarte</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              label="Nombre completo"
              placeholder="Juan Pérez"
              icon={<User size={18} />}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              type="email"
              label="Correo electrónico"
              placeholder="correo@ejemplo.com"
              icon={<Mail size={18} />}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              type="tel"
              label="Teléfono"
              placeholder="+52 123 456 7890"
              icon={<Phone size={18} />}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />

            <Input
              type="password"
              label="Contraseña"
              placeholder="••••••••"
              icon={<Lock size={18} />}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              helperText="Mínimo 8 caracteres"
              required
            />

            <Input
              type="password"
              label="Confirmar contraseña"
              placeholder="••••••••"
              icon={<Lock size={18} />}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
              required
            />

            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                  className="w-4 h-4 mt-0.5 rounded border-2 border-gray-300 bg-white text-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-0 cursor-pointer transition-all checked:bg-[#3A7AFE] checked:border-[#3A7AFE] hover:border-[#3A7AFE] accent-[#3A7AFE]"
                />
                <span className="text-sm text-gray-600">
                  Acepto los{' '}
                  <a href="#" className="text-[#3A7AFE] hover:underline">
                    términos y condiciones
                  </a>{' '}
                  y la{' '}
                  <a href="#" className="text-[#3A7AFE] hover:underline">
                    política de privacidad
                  </a>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="mt-1.5 text-sm text-[#EF4444]">{errors.acceptTerms}</p>
              )}
            </div>

            <Button type="submit" fullWidth loading={loading}>
              Crear cuenta
            </Button>

            <p className="text-center text-gray-600 mt-6">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-[#3A7AFE] hover:underline"
              >
                Iniciar sesión
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}