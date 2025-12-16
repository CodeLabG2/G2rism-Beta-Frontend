import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Mail, Lock, Chrome, Facebook, User, UserCog, Briefcase, AlertCircle, CheckCircle } from 'lucide-react';
import { Logo } from '../layout/Logo';
import { motion } from 'motion/react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
}

type PortalType = 'admin' | 'employee' | 'client';

export function LoginForm({ onLogin, onSwitchToRegister, onForgotPassword }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [portalType, setPortalType] = useState<PortalType>('employee');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password: string) => {
    return {
      length: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    };
  };

  const emailValid = validateEmail(email);
  const passwordValidation = validatePassword(password);
  const passwordValid = Object.values(passwordValidation).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);
    setPasswordTouched(true);
    
    if (!emailValid || !passwordValid) {
      return;
    }
    
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onLogin(email, password);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Gradient with illustration */}
      <div className="hidden lg:flex lg:w-1/2 animated-gradient items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-white max-w-md"
        >
          <Logo size="lg" variant="light" className="justify-center mb-8" />
          <h2 className="text-white mb-4">Descubre el mundo con G2rism</h2>
          <p className="text-white/90 text-lg">
            La plataforma más completa para gestionar tus experiencias turísticas
          </p>
          <div className="mt-12 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&q=80"
              alt="Travel illustration"
              className="rounded-2xl shadow-2xl max-w-sm"
            />
          </div>
        </motion.div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
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
            <h3 className="mb-2">Bienvenido a G2rism</h3>
            <p className="text-gray-600">Inicia sesión para continuar</p>
          </div>

          {/* Portal Type Selector */}
          <div className="mb-6">
            <label className="block text-sm mb-2 text-gray-700">Tipo de Usuario</label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                onClick={() => setPortalType('admin')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-md transition-all ${
                  portalType === 'admin'
                    ? 'bg-white shadow-sm text-[#3A7AFE]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <UserCog size={18} />
                <span className="text-sm">Admin</span>
              </button>
              <button
                type="button"
                onClick={() => setPortalType('employee')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-md transition-all ${
                  portalType === 'employee'
                    ? 'bg-white shadow-sm text-[#3A7AFE]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Briefcase size={18} />
                <span className="text-sm">Empleado</span>
              </button>
              <button
                type="button"
                onClick={() => setPortalType('client')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-md transition-all ${
                  portalType === 'client'
                    ? 'bg-white shadow-sm text-[#3A7AFE]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <User size={18} />
                <span className="text-sm">Cliente</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <div className="relative">
                <Input
                  type="email"
                  label="Correo electrónico"
                  placeholder="correo@ejemplo.com"
                  icon={<Mail size={18} />}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (!emailTouched) setEmailTouched(true);
                  }}
                  onBlur={() => setEmailTouched(true)}
                  required
                />
                {email && emailTouched && (
                  <div className="absolute right-3 top-9">
                    {emailValid ? (
                      <CheckCircle size={18} className="text-green-500" />
                    ) : (
                      <AlertCircle size={18} className="text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {email && !emailValid && emailTouched && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs mt-1 flex items-center gap-1"
                >
                  <AlertCircle size={14} />
                  Por favor, ingresa un correo electrónico válido
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <Input
                  type="password"
                  label="Contraseña"
                  placeholder="••••••••"
                  icon={<Lock size={18} />}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (!passwordTouched) setPasswordTouched(true);
                  }}
                  onBlur={() => setPasswordTouched(true)}
                  required
                />
              </div>
              
              {/* Password Requirements */}
              {password && passwordTouched && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 space-y-1"
                >
                  <div className="flex items-center gap-2">
                    {passwordValidation.length ? (
                      <CheckCircle size={14} className="text-green-500" />
                    ) : (
                      <AlertCircle size={14} className="text-red-500" />
                    )}
                    <span className={`text-xs ${passwordValidation.length ? 'text-green-600' : 'text-red-500'}`}>
                      Mínimo 8 caracteres
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordValidation.hasUpperCase ? (
                      <CheckCircle size={14} className="text-green-500" />
                    ) : (
                      <AlertCircle size={14} className="text-red-500" />
                    )}
                    <span className={`text-xs ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-red-500'}`}>
                      Una letra mayúscula
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordValidation.hasLowerCase ? (
                      <CheckCircle size={14} className="text-green-500" />
                    ) : (
                      <AlertCircle size={14} className="text-red-500" />
                    )}
                    <span className={`text-xs ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-red-500'}`}>
                      Una letra minúscula
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordValidation.hasNumber ? (
                      <CheckCircle size={14} className="text-green-500" />
                    ) : (
                      <AlertCircle size={14} className="text-red-500" />
                    )}
                    <span className={`text-xs ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-500'}`}>
                      Un número
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className={`w-4 h-4 border-2 rounded transition-all ${
                    remember 
                      ? 'bg-[#3A7AFE] border-[#3A7AFE]' 
                      : 'bg-white border-gray-300 group-hover:border-gray-400'
                  }`}>
                    {remember && (
                      <svg
                        className="w-full h-full text-white"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M13 4L6 11L3 8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-600">Recordarme</span>
              </label>

              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-[#3A7AFE] hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <Button type="submit" fullWidth loading={loading}>
              Iniciar Sesión
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">o continúa con</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" type="button" icon={<Chrome size={18} />}>
                Google
              </Button>
              <Button variant="secondary" type="button" icon={<Facebook size={18} />}>
                Facebook
              </Button>
            </div>

            <p className="text-center text-gray-600 mt-6">
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-[#3A7AFE] hover:underline"
              >
                Regístrate
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}