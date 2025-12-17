import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ForgotPasswordForm } from './components/auth/ForgotPasswordForm';
import { LandingPage } from './components/landing/LandingPage';
import { AboutPage } from './components/landing/AboutPage';
import { ContactPage } from './components/landing/ContactPage';
import { ClientPortal } from './components/client/ClientPortal';
import { SuperAdminPortal } from './components/superadmin/SuperAdminPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { WelcomeModal } from './components/onboarding/WelcomeModal';
import { Toaster, toast } from 'sonner';
import { authService } from './services/api/authService';
import type { AuthUser } from './services/api/types';
import type { UserWithRoles } from './services/types/users.types';

type AppView = 'landing' | 'about' | 'contact' | 'login' | 'register' | 'forgot-password' | 'superadmin' | 'admin' | 'client';
type AuthView = 'login' | 'register' | 'forgot-password';

/**
 * 🔄 Convierte AuthUser de la API a UserWithRoles para los portales
 * Esta es una función temporal de adaptación mientras migramos completamente a la nueva API
 */
function adaptAuthUserToUserWithRoles(authUser: AuthUser): UserWithRoles {
  return {
    idUsuario: parseInt(authUser.id) || 0,
    username: authUser.name,
    email: authUser.email,
    tipoUsuario: authUser.role.toLowerCase() as 'superadmin' | 'admin' | 'empleado' | 'cliente',
    estado: true,
    bloqueado: false,
    intentosFallidos: 0,
    ultimoAcceso: new Date().toISOString(),
    fechaCreacion: authUser.createdAt,
    roles: [], // Los permisos se manejarán directamente por el backend
  };
}

export default function App() {
  const [appView, setAppView] = useState<AppView>('landing');
  const [authView, setAuthView] = useState<AuthView>('login');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomePortalType, setWelcomePortalType] = useState<'portal' | 'client'>('portal');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 🔄 RESTAURAR SESIÓN desde localStorage al cargar la app
   * Si hay un token y usuario guardado, restaurar la sesión automáticamente
   */
  useEffect(() => {
    const restoreSession = () => {
      const token = authService.getToken();
      const user = authService.getUser();

      if (token && user) {
        console.log('🔄 Restaurando sesión desde localStorage:', user);
        setCurrentUser(user);

        // Enrutar según el rol del usuario
        const userRole = user.role.toLowerCase();

        if (userRole === 'admin') {
          setAppView('superadmin');
        } else if (userRole === 'employee') {
          setAppView('admin');
        } else {
          setAppView('client');
        }
      }
    };

    restoreSession();
  }, []);

  /* DATOS HARDCODEADOS COMENTADOS - Usar API real
  const clientUser = {
    name: 'María González',
    email: 'maria@cliente.com',
    category: 'Platino',
    points: 2500,
  };
  */ // FIN DATOS HARDCODEADOS COMENTADOS

  // ⚠️ Objeto vacío - Se llenará desde la API después del login
  const clientUser = {
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    category: currentUser?.category || '',
    points: currentUser?.points || 0,
  };

  // Auth handlers
  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('🔐 Intentando login con API real:', email);

      // Llamar a la API real de autenticación
      const loginResponse = await authService.login({ email, password });

      console.log('✅ Login exitoso:', loginResponse);

      // Guardar usuario actual
      setCurrentUser(loginResponse.user);

      // Enrutar según el rol del usuario
      const userRole = loginResponse.user.role.toLowerCase();

      if (userRole === 'admin') {
        // Puede ser superadmin o admin regular - por ahora todos a superadmin
        toast.success(`¡Bienvenido ${loginResponse.user.name}!`);
        setAppView('superadmin');
        setWelcomePortalType('portal');
      } else if (userRole === 'employee') {
        toast.success(`¡Bienvenido ${loginResponse.user.name}!`);
        setAppView('admin'); // Empleados van a admin portal
        setWelcomePortalType('portal');
      } else {
        // Cliente
        toast.success('¡Bienvenido a tu Portal de Cliente!');
        setAppView('client');
        setWelcomePortalType('client');
      }

      setShowWelcome(true);
    } catch (error: any) {
      console.error('❌ Error en login:', error);

      // Mostrar mensaje de error específico
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.errors?.[0] ||
                          'Credenciales inválidas. Por favor verifica tu email y contraseña.';

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: any) => {
    try {
      setIsLoading(true);
      console.log('📝 Registrando nuevo cliente con API real:', data);

      // Llamar a la API real de registro con los datos correctos
      await authService.register({
        username: data.username,      // Backend requiere username (ingresado por el usuario)
        nombre: data.name,            // Backend espera "nombre"
        email: data.email,            // Backend espera "email"
        password: data.password,      // Backend espera "password"
        confirmPassword: data.confirmPassword, // Backend espera "confirmPassword"
        telefono: data.phone || '',   // Backend espera "telefono" (opcional)
        documento: data.document || '', // Backend espera "documento" (opcional)
        acceptTerms: data.acceptTerms, // Backend espera "aceptaTerminos"
      });

      console.log('✅ Registro exitoso y auto-login completado');

      // El authService ya hizo auto-login, solo necesitamos obtener el usuario
      const user = authService.getUser();
      if (user) {
        setCurrentUser(user);

        // Cliente registrado va al portal de cliente
        toast.success('¡Cuenta creada exitosamente!');
        setAppView('client');
        setWelcomePortalType('client');
        setShowWelcome(true);
      }
    } catch (error: any) {
      console.error('❌ Error en registro:', error);

      // Mostrar mensaje de error específico
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.errors?.[0] ||
                          'Error al crear la cuenta. Por favor intenta de nuevo.';

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Render auth views
  if (appView === 'login' || appView === 'register' || appView === 'forgot-password') {
    return (
      <>
        <Toaster position="top-right" />
        {authView === 'login' && (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToRegister={() => {
              setAuthView('register');
              setAppView('register');
            }}
            onForgotPassword={() => {
              setAuthView('forgot-password');
              setAppView('forgot-password');
            }}
          />
        )}
        {authView === 'register' && (
          <RegisterForm
            onRegister={handleRegister}
            onSwitchToLogin={() => {
              setAuthView('login');
              setAppView('login');
            }}
          />
        )}
        {authView === 'forgot-password' && (
          <ForgotPasswordForm
            onBack={() => {
              setAuthView('login');
              setAppView('login');
            }}
          />
        )}
      </>
    );
  }

  // Render landing page
  if (appView === 'landing') {
    return (
      <>
        <Toaster position="top-right" />
        <LandingPage
          onLoginClick={() => {
            setAuthView('login');
            setAppView('login');
          }}
          onRegisterClick={() => {
            setAuthView('register');
            setAppView('register');
          }}
          onAboutClick={() => {
            setAppView('about');
          }}
          onContactClick={() => {
            setAppView('contact');
          }}
        />
      </>
    );
  }

  // Render about page
  if (appView === 'about') {
    return (
      <>
        <Toaster position="top-right" />
        <AboutPage 
          onBackToHome={() => {
            setAppView('landing');
          }}
        />
      </>
    );
  }

  // Render contact page
  if (appView === 'contact') {
    return (
      <>
        <Toaster position="top-right" />
        <ContactPage 
          onBackToHome={() => {
            setAppView('landing');
          }}
        />
      </>
    );
  }

  // Render Portal Unificado (empleados/admins)
  if (appView === 'superadmin') {
    // Adaptar AuthUser a UserWithRoles para el portal
    const adaptedUser = currentUser ? adaptAuthUserToUserWithRoles(currentUser) : null;

    return (
      <>
        <Toaster position="top-right" />
        {showWelcome && welcomePortalType === 'portal' && !localStorage.getItem('g2rism-welcome-portal') && (
          <WelcomeModal
            portalType="employee"
            userName={currentUser?.name || 'Usuario'}
            onClose={() => setShowWelcome(false)}
          />
        )}
        {adaptedUser && (
          <SuperAdminPortal
            user={adaptedUser}
            onLogout={() => {
              authService.logout();
              setCurrentUser(null);
              setAppView('landing');
              toast.success('Sesión cerrada exitosamente');
            }}
          />
        )}
      </>
    );
  }

  if (appView === 'admin') {
    // Adaptar AuthUser a UserWithRoles para el portal
    const adaptedUser = currentUser ? adaptAuthUserToUserWithRoles(currentUser) : null;

    return (
      <>
        <Toaster position="top-right" />
        {showWelcome && welcomePortalType === 'portal' && !localStorage.getItem('g2rism-welcome-portal') && (
          <WelcomeModal
            portalType="employee"
            userName={currentUser?.name || 'Usuario'}
            onClose={() => setShowWelcome(false)}
          />
        )}
        {adaptedUser && (
          <AdminPortal
            user={adaptedUser}
            onLogout={() => {
              authService.logout();
              setCurrentUser(null);
              setAppView('landing');
              toast.success('Sesión cerrada exitosamente');
            }}
          />
        )}
      </>
    );
  }

  // Render client portal
  if (appView === 'client') {
    return (
      <>
        <Toaster position="top-right" />
        {showWelcome && welcomePortalType === 'client' && (
          <WelcomeModal
            portalType="client"
            userName={clientUser.name}
            onClose={() => setShowWelcome(false)}
          />
        )}
        <ClientPortal
          user={clientUser}
          onLogout={() => {
            authService.logout();
            setCurrentUser(null);
            setAppView('landing');
            toast.success('Sesión cerrada exitosamente');
          }}
        />
      </>
    );
  }

  return null;
}