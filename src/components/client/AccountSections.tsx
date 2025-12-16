import React, { useState } from 'react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import {
  User,
  MapPin,
  Lock,
  FileText,
  CreditCard,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Check,
  X,
  Plus,
  Trash2,
  Download,
  Upload,
  Smartphone,
  Monitor,
  Mail,
  MessageSquare,
  Globe,
  Plane,
  Hotel,
  Car,
  DollarSign,
} from 'lucide-react';

interface AccountSectionsProps {
  user: { name: string; email: string; category: string; points: number };
  section: string;
}

export function AccountSections({ user, section }: AccountSectionsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  // PROFILE SECTION
  if (section === 'profile') {
    return (
      <>
        <h5 className="mb-6">Información Personal</h5>
        <div className="space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
            <Avatar name={user.name} size="xl" />
            <div>
              <Button variant="secondary" size="sm">
                Cambiar foto
              </Button>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG o GIF (máx. 2MB)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Nombre completo</label>
              <input
                type="text"
                defaultValue={user.name}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE]/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Email</label>
              <input
                type="email"
                defaultValue={user.email}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE]/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Teléfono</label>
              <input
                type="tel"
                placeholder="+57 300 123 4567"
                defaultValue="+57 300 123 4567"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE]/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">País</label>
              <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE]/20 outline-none">
                <option>Colombia</option>
                <option>México</option>
                <option>Argentina</option>
                <option>Chile</option>
                <option>Perú</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Ciudad</label>
              <input
                type="text"
                placeholder="Medellín"
                defaultValue="Medellín"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE]/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Fecha de nacimiento</label>
              <input
                type="date"
                defaultValue="1990-05-15"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE]/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Número de documento</label>
              <input
                type="text"
                placeholder="123456789"
                defaultValue="123456789"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE]/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Idioma preferido</label>
              <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE]/20 outline-none">
                <option>Español</option>
                <option>English</option>
                <option>Português</option>
              </select>
            </div>
          </div>

          {/* Loyalty Info */}
          <div className="pt-6 border-t border-gray-200">
            <h6 className="mb-4">Programa de Lealtad</h6>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#F5F6FA] rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Categoría</p>
                <p className="text-[#F59E0B]">{user.category}</p>
              </div>
              <div className="p-4 bg-[#F5F6FA] rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Puntos acumulados</p>
                <p className="text-[#3A7AFE]">{user.points}</p>
              </div>
              <div className="p-4 bg-[#F5F6FA] rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Próximo nivel</p>
                <p className="text-[#10B981]">Diamante (500 pts más)</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button>Guardar cambios</Button>
            <Button variant="ghost">Cancelar</Button>
          </div>
        </div>
      </>
    );
  }

  // PREFERENCES SECTION
  if (section === 'preferences') {
    return (
      <>
        <h5 className="mb-6">Preferencias de Viaje</h5>
        <div className="space-y-6">
          {/* Travel Preferences */}
          <div>
            <h6 className="mb-4">Tipos de destino preferidos</h6>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Playa', 'Montaña', 'Ciudad', 'Aventura', 'Cultural', 'Gastronómico', 'Relax', 'Naturaleza'].map((type) => (
                <label key={type} className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-[#3A7AFE] transition-colors">
                  <input 
                    type="checkbox" 
                    defaultChecked={['Playa', 'Cultural'].includes(type)} 
                    className="w-4 h-4 rounded border-2 border-gray-300 bg-white text-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-0 cursor-pointer transition-all checked:bg-[#3A7AFE] checked:border-[#3A7AFE] hover:border-[#3A7AFE]" 
                  />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Budget Range */}
          <div className="pt-6 border-t border-gray-200">
            <h6 className="mb-4">Rango de presupuesto preferido</h6>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-[#3A7AFE] transition-colors">
                <input type="radio" name="budget" className="text-[#3A7AFE]" />
                <div>
                  <p className="text-sm">Económico</p>
                  <p className="text-xs text-gray-600">Hasta $1,000</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border-2 border-[#3A7AFE] rounded-lg cursor-pointer bg-[#3A7AFE]/5">
                <input type="radio" name="budget" defaultChecked className="text-[#3A7AFE]" />
                <div>
                  <p className="text-sm">Moderado</p>
                  <p className="text-xs text-gray-600">$1,000 - $3,000</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-[#3A7AFE] transition-colors">
                <input type="radio" name="budget" className="text-[#3A7AFE]" />
                <div>
                  <p className="text-sm">Premium</p>
                  <p className="text-xs text-gray-600">$3,000+</p>
                </div>
              </label>
            </div>
          </div>

          {/* Accommodation */}
          <div className="pt-6 border-t border-gray-200">
            <h6 className="mb-4">Preferencias de alojamiento</h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Tipo de alojamiento</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE]/20 outline-none">
                  <option>Hotel 5 estrellas</option>
                  <option>Hotel 4 estrellas</option>
                  <option>Boutique hotel</option>
                  <option>Resort</option>
                  <option>Apartamento</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Ubicación preferida</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE]/20 outline-none">
                  <option>Centro de la ciudad</option>
                  <option>Cerca de la playa</option>
                  <option>Zona turística</option>
                  <option>Tranquilo/Apartado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Special Requirements */}
          <div className="pt-6 border-t border-gray-200">
            <h6 className="mb-4">Requerimientos especiales</h6>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-2 border-gray-300 bg-white text-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-0 cursor-pointer transition-all checked:bg-[#3A7AFE] checked:border-[#3A7AFE] hover:border-[#3A7AFE]" 
                />
                <span className="text-sm">Habitación accesible</span>
              </label>
              <label className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-2 border-gray-300 bg-white text-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-0 cursor-pointer transition-all checked:bg-[#3A7AFE] checked:border-[#3A7AFE] hover:border-[#3A7AFE]" 
                />
                <span className="text-sm">Cama extra</span>
              </label>
              <label className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  defaultChecked 
                  className="w-4 h-4 rounded border-2 border-gray-300 bg-white text-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-0 cursor-pointer transition-all checked:bg-[#3A7AFE] checked:border-[#3A7AFE] hover:border-[#3A7AFE]" 
                />
                <span className="text-sm">Vista al mar</span>
              </label>
              <label className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-2 border-gray-300 bg-white text-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-0 cursor-pointer transition-all checked:bg-[#3A7AFE] checked:border-[#3A7AFE] hover:border-[#3A7AFE]" 
                />
                <span className="text-sm">Piso alto</span>
              </label>
            </div>
          </div>

          {/* Dietary Preferences */}
          <div className="pt-6 border-t border-gray-200">
            <h6 className="mb-4">Preferencias alimentarias</h6>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Ninguna', 'Vegetariano', 'Vegano', 'Sin gluten', 'Kosher', 'Halal', 'Sin lactosa', 'Sin nueces'].map((diet) => (
                <label key={diet} className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-[#3A7AFE] transition-colors">
                  <input 
                    type="checkbox" 
                    defaultChecked={diet === 'Ninguna'} 
                    className="w-4 h-4 rounded border-2 border-gray-300 bg-white text-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-0 cursor-pointer transition-all checked:bg-[#3A7AFE] checked:border-[#3A7AFE] hover:border-[#3A7AFE]" 
                  />
                  <span className="text-sm">{diet}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button>Guardar preferencias</Button>
            <Button variant="ghost">Restablecer</Button>
          </div>
        </div>
      </>
    );
  }

  // SECURITY SECTION
  if (section === 'security') {
    return (
      <>
        <h5 className="mb-6">Seguridad de la Cuenta</h5>
        <div className="space-y-6">
          {/* Change Password */}
          <div>
            <h6 className="mb-4">Cambiar contraseña</h6>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Contraseña actual</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:border-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE]/20 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Nueva contraseña</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE]/20 outline-none"
                />
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <Check size={14} className="text-green-500" />
                    <span className="text-gray-600">Al menos 8 caracteres</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Check size={14} className="text-green-500" />
                    <span className="text-gray-600">Contiene mayúsculas y minúsculas</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <X size={14} className="text-gray-400" />
                    <span className="text-gray-600">Contiene números</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Confirmar nueva contraseña</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE]/20 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h6 className="mb-1">Autenticación de dos factores</h6>
                <p className="text-sm text-gray-600">Agrega una capa extra de seguridad a tu cuenta</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3A7AFE]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3A7AFE]"></div>
              </label>
            </div>
            {twoFactorEnabled && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield size={20} className="text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-green-800 mb-2">Autenticación de dos factores activada</p>
                    <p className="text-xs text-green-700">Recibirás un código de verificación por SMS cada vez que inicies sesión desde un nuevo dispositivo.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Active Sessions */}
          <div className="pt-6 border-t border-gray-200">
            <h6 className="mb-4">Sesiones activas</h6>
            <div className="space-y-3">
              {[
                { device: 'Windows - Chrome', location: 'Medellín, Colombia', time: 'Ahora', current: true },
                { device: 'iPhone 13', location: 'Medellín, Colombia', time: 'Hace 2 horas', current: false },
                { device: 'iPad Pro', location: 'Bogotá, Colombia', time: 'Hace 1 día', current: false },
              ].map((session, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    {session.device.includes('Windows') ? <Monitor size={20} className="text-gray-600" /> : <Smartphone size={20} className="text-gray-600" />}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm">{session.device}</p>
                        {session.current && <Badge variant="success" size="sm">Actual</Badge>}
                      </div>
                      <p className="text-xs text-gray-600">{session.location} • {session.time}</p>
                    </div>
                  </div>
                  {!session.current && (
                    <Button variant="ghost" size="sm">
                      Cerrar sesión
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button>Actualizar contraseña</Button>
            <Button variant="ghost">Cancelar</Button>
          </div>
        </div>
      </>
    );
  }

  // DOCUMENTS SECTION
  if (section === 'documents') {
    return (
      <>
        <h5 className="mb-6">Mis Documentos</h5>
        <div className="space-y-6">
          {/* Upload Documents */}
          <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-[#3A7AFE] transition-colors cursor-pointer">
            <Upload size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">Arrastra archivos aquí o haz click para seleccionar</p>
            <p className="text-xs text-gray-500">PDF, JPG, PNG (máx. 10MB cada uno)</p>
          </div>

          {/* Document List */}
          <div>
            <h6 className="mb-4">Documentos guardados</h6>
            <div className="space-y-3">
              {[
                { name: 'Pasaporte', type: 'PDF', date: '15 Nov 2024', size: '2.4 MB', status: 'Verificado', verified: true },
                { name: 'Visa Schengen', type: 'PDF', date: '10 Oct 2024', size: '1.8 MB', status: 'Verificado', verified: true },
                { name: 'Certificado de vacunación', type: 'PDF', date: '05 Sep 2024', size: '892 KB', status: 'Pendiente', verified: false },
                { name: 'Licencia de conducir', type: 'JPG', date: '20 Ago 2024', size: '1.2 MB', status: 'Verificado', verified: true },
              ].map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#3A7AFE] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#3A7AFE]/10 rounded-lg">
                      <FileText size={24} className="text-[#3A7AFE]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm">{doc.name}</p>
                        <Badge variant={doc.verified ? 'success' : 'warning'} size="sm">
                          {doc.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{doc.type} • {doc.size} • {doc.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" icon={<Download size={16} />}>
                      Descargar
                    </Button>
                    <Button variant="ghost" size="sm" icon={<Trash2 size={16} className="text-red-500" />}>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield size={20} className="text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800 mb-1">Tus documentos están seguros</p>
                <p className="text-xs text-blue-700">Todos los archivos están encriptados y solo tú puedes acceder a ellos.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button icon={<Plus size={16} />}>Agregar documento</Button>
          </div>
        </div>
      </>
    );
  }

  // PAYMENT METHODS SECTION
  if (section === 'payment') {
    return (
      <>
        <h5 className="mb-6">Métodos de Pago</h5>
        <div className="space-y-6">
          {/* Saved Cards */}
          <div>
            <h6 className="mb-4">Tarjetas guardadas</h6>
            <div className="space-y-3">
              {[
                { type: 'Visa', last4: '4242', expiry: '12/25', default: true },
                { type: 'Mastercard', last4: '5555', expiry: '08/26', default: false },
              ].map((card, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#3A7AFE] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#3A7AFE]/10 rounded-lg">
                      <CreditCard size={24} className="text-[#3A7AFE]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm">{card.type} ••••{' '}{card.last4}</p>
                        {card.default && <Badge variant="default" size="sm">Predeterminada</Badge>}
                      </div>
                      <p className="text-xs text-gray-600">Vence {card.expiry}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!card.default && (
                      <Button variant="ghost" size="sm">
                        Predeterminar
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" icon={<Trash2 size={16} className="text-red-500" />}>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Card */}
          <div className="pt-6 border-t border-gray-200">
            <h6 className="mb-4">Agregar nueva tarjeta</h6>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Número de tarjeta</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE]/20 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Fecha de expiración</label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE]/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE]/20 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Nombre en la tarjeta</label>
                <input
                  type="text"
                  placeholder="MARIA GONZALEZ"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE]/20 outline-none"
                />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="text-[#3A7AFE]" />
                <span className="text-sm text-gray-700">Guardar como método de pago predeterminado</span>
              </label>
            </div>
          </div>

          {/* Security Info */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield size={20} className="text-green-600 mt-0.5" />
              <div>
                <p className="text-sm text-green-800 mb-1">Pagos seguros</p>
                <p className="text-xs text-green-700">Tu información de pago está encriptada con SSL de 256 bits y no la compartimos con terceros.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button>Agregar tarjeta</Button>
            <Button variant="ghost">Cancelar</Button>
          </div>
        </div>
      </>
    );
  }

  // NOTIFICATIONS SECTION
  if (section === 'notifications') {
    return (
      <>
        <h5 className="mb-6">Preferencias de Notificaciones</h5>
        <div className="space-y-6">
          {/* Email Notifications */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#3A7AFE]/10 rounded-lg">
                  <Mail size={20} className="text-[#3A7AFE]" />
                </div>
                <div>
                  <h6>Notificaciones por email</h6>
                  <p className="text-sm text-gray-600">Recibe actualizaciones en tu correo</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3A7AFE]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3A7AFE]"></div>
              </label>
            </div>
            {emailNotifications && (
              <div className="ml-12 space-y-2">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="w-4 h-4 rounded border-2 border-gray-300 bg-white text-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-0 cursor-pointer transition-all checked:bg-[#3A7AFE] checked:border-[#3A7AFE] hover:border-[#3A7AFE]" 
                  />
                  <span className="text-sm">Confirmación de reservas</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="w-4 h-4 rounded border-2 border-gray-300 bg-white text-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-0 cursor-pointer transition-all checked:bg-[#3A7AFE] checked:border-[#3A7AFE] hover:border-[#3A7AFE]" 
                  />
                  <span className="text-sm">Actualizaciones de viaje</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="w-4 h-4 rounded border-2 border-gray-300 bg-white text-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-0 cursor-pointer transition-all checked:bg-[#3A7AFE] checked:border-[#3A7AFE] hover:border-[#3A7AFE]" 
                  />
                  <span className="text-sm">Ofertas especiales</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-2 border-gray-300 bg-white text-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-0 cursor-pointer transition-all checked:bg-[#3A7AFE] checked:border-[#3A7AFE] hover:border-[#3A7AFE]" 
                  />
                  <span className="text-sm">Newsletter mensual</span>
                </label>
              </div>
            )}
          </div>

          {/* SMS Notifications */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#3A7AFE]/10 rounded-lg">
                  <MessageSquare size={20} className="text-[#3A7AFE]" />
                </div>
                <div>
                  <h6>Notificaciones por SMS</h6>
                  <p className="text-sm text-gray-600">Recibe alertas importantes por mensaje</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsNotifications}
                  onChange={() => setSmsNotifications(!smsNotifications)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3A7AFE]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3A7AFE]"></div>
              </label>
            </div>
            {smsNotifications && (
              <div className="ml-12 space-y-2">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="w-4 h-4 rounded border-2 border-gray-300 bg-white text-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-0 cursor-pointer transition-all checked:bg-[#3A7AFE] checked:border-[#3A7AFE] hover:border-[#3A7AFE]" 
                  />
                  <span className="text-sm">Recordatorios de vuelo</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="w-4 h-4 rounded border-2 border-gray-300 bg-white text-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-0 cursor-pointer transition-all checked:bg-[#3A7AFE] checked:border-[#3A7AFE] hover:border-[#3A7AFE]" 
                  />
                  <span className="text-sm">Cambios de itinerario</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-2 border-gray-300 bg-white text-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-0 cursor-pointer transition-all checked:bg-[#3A7AFE] checked:border-[#3A7AFE] hover:border-[#3A7AFE]" 
                  />
                  <span className="text-sm">Ofertas urgentes</span>
                </label>
              </div>
            )}
          </div>

          {/* Push Notifications */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#3A7AFE]/10 rounded-lg">
                  <Bell size={20} className="text-[#3A7AFE]" />
                </div>
                <div>
                  <h6>Notificaciones push</h6>
                  <p className="text-sm text-gray-600">Recibe alertas en tu dispositivo</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushNotifications}
                  onChange={() => setPushNotifications(!pushNotifications)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3A7AFE]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3A7AFE]"></div>
              </label>
            </div>
            {pushNotifications && (
              <div className="ml-12 space-y-2">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="w-4 h-4 rounded border-2 border-gray-300 bg-white text-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-0 cursor-pointer transition-all checked:bg-[#3A7AFE] checked:border-[#3A7AFE] hover:border-[#3A7AFE]" 
                  />
                  <span className="text-sm">Recordatorios de check-in</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="w-4 h-4 rounded border-2 border-gray-300 bg-white text-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-0 cursor-pointer transition-all checked:bg-[#3A7AFE] checked:border-[#3A7AFE] hover:border-[#3A7AFE]" 
                  />
                  <span className="text-sm">Actualizaciones de puerta de embarque</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="w-4 h-4 rounded border-2 border-gray-300 bg-white text-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-0 cursor-pointer transition-all checked:bg-[#3A7AFE] checked:border-[#3A7AFE] hover:border-[#3A7AFE]" 
                  />
                  <span className="text-sm">Promociones personalizadas</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-2 border-gray-300 bg-white text-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-0 cursor-pointer transition-all checked:bg-[#3A7AFE] checked:border-[#3A7AFE] hover:border-[#3A7AFE]" 
                  />
                  <span className="text-sm">Sugerencias de destinos</span>
                </label>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button>Guardar preferencias</Button>
            <Button variant="ghost">Restablecer</Button>
          </div>
        </div>
      </>
    );
  }

  return null;
}