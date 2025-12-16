import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Mail, ArrowLeft, Lock } from 'lucide-react';
import { Logo } from '../layout/Logo';
import { motion } from 'motion/react';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [step, setStep] = useState<'email' | 'code' | 'newPassword'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStep('code');
    setLoading(false);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStep('newPassword');
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onBack();
    setLoading(false);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const passwordStrength = (password: string) => {
    if (password.length === 0) return { level: 0, text: '' };
    if (password.length < 6) return { level: 1, text: 'Débil', color: '#EF4444' };
    if (password.length < 10) return { level: 2, text: 'Media', color: '#F59E0B' };
    return { level: 3, text: 'Fuerte', color: '#10B981' };
  };

  const strength = passwordStrength(newPassword);

  return (
    <div className="min-h-screen flex">
      {/* Left side */}
      <div className="hidden lg:flex lg:w-1/2 animated-gradient items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-white max-w-md"
        >
          <Logo size="lg" variant="light" className="justify-center mb-8" />
          <h2 className="text-white mb-4">Recupera tu cuenta</h2>
          <p className="text-white/90 text-lg">
            No te preocupes, te ayudaremos a recuperar el acceso
          </p>
        </motion.div>
      </div>

      {/* Right side */}
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

          {/* Step 1: Email */}
          {step === 'email' && (
            <>
              <div className="mb-8">
                <h3 className="mb-2">Recuperar contraseña</h3>
                <p className="text-gray-600">Te enviaremos un código de verificación a tu correo</p>
              </div>

              <form onSubmit={handleSendCode} className="space-y-5">
                <Input
                  type="email"
                  label="Correo electrónico"
                  placeholder="correo@ejemplo.com"
                  icon={<Mail size={18} />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Button type="submit" fullWidth loading={loading}>
                  Enviar código
                </Button>

                <button
                  type="button"
                  onClick={onBack}
                  className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft size={18} />
                  Volver al login
                </button>
              </form>
            </>
          )}

          {/* Step 2: Verify Code */}
          {step === 'code' && (
            <>
              <div className="mb-8">
                <h3 className="mb-2">Verificar código</h3>
                <p className="text-gray-600">
                  Ingresa el código de 6 dígitos que enviamos a <strong>{email}</strong>
                </p>
              </div>

              <form onSubmit={handleVerifyCode} className="space-y-5">
                <div>
                  <label className="block text-sm text-gray-700 mb-3">Código de verificación</label>
                  <div className="flex gap-2 justify-center">
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        className="w-12 h-12 text-center rounded-lg border border-gray-300 focus:border-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE]/20 outline-none"
                      />
                    ))}
                  </div>
                </div>

                <Button type="submit" fullWidth loading={loading}>
                  Verificar
                </Button>

                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="w-full text-center text-[#3A7AFE] hover:underline"
                >
                  Reenviar código
                </button>
              </form>
            </>
          )}

          {/* Step 3: New Password */}
          {step === 'newPassword' && (
            <>
              <div className="mb-8">
                <h3 className="mb-2">Nueva contraseña</h3>
                <p className="text-gray-600">Crea una contraseña segura para tu cuenta</p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <Input
                    type="password"
                    label="Nueva contraseña"
                    placeholder="••••••••"
                    icon={<Lock size={18} />}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  {newPassword && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all duration-300"
                            style={{
                              width: `${(strength.level / 3) * 100}%`,
                              backgroundColor: strength.color,
                            }}
                          />
                        </div>
                        <span className="text-sm" style={{ color: strength.color }}>
                          {strength.text}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <Input
                  type="password"
                  label="Confirmar contraseña"
                  placeholder="••••••••"
                  icon={<Lock size={18} />}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={
                    confirmPassword && newPassword !== confirmPassword
                      ? 'Las contraseñas no coinciden'
                      : undefined
                  }
                  required
                />

                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  disabled={newPassword !== confirmPassword}
                >
                  Cambiar contraseña
                </Button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
