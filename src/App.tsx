import React, { useState } from 'react';
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
import { Toaster, toast } from 'sonner@2.0.3';
import { getEmployeeByEmail } from './data/mockEmployees';
import type { UserWithRoles } from './services/types/users.types';

type AppView = 'landing' | 'about' | 'contact' | 'login' | 'register' | 'forgot-password' | 'superadmin' | 'admin' | 'client';
type AuthView = 'login' | 'register' | 'forgot-password';

export default function App() {
  const [appView, setAppView] = useState<AppView>('landing');
  const [authView, setAuthView] = useState<AuthView>('login');
  const [currentUser, setCurrentUser] = useState<UserWithRoles | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomePortalType, setWelcomePortalType] = useState<'portal' | 'client'>('portal');

  // 🔍 DEMO: Para probar diferentes portales
  // Cambiar el email aquí:
  // - 'juan.perez@g2rism.com' = Super Admin (todos los permisos, PUEDE ELIMINAR)
  // - 'maria.gonzalez@g2rism.com' = Administrador (todos los permisos, NO PUEDE ELIMINAR)
  React.useEffect(() => {
    const demoEmail = 'maria.gonzalez@g2rism.com'; // 👈 CAMBIAR AQUÍ PARA PROBAR
    if (demoEmail) {
      const employee = getEmployeeByEmail(demoEmail);
      if (employee) {
        setCurrentUser(employee);
        
        // Enrutar según el tipo de usuario
        if (employee.tipoUsuario === 'superadmin') {
          setAppView('superadmin');
        } else if (employee.tipoUsuario === 'admin') {
          setAppView('admin');
        } else {
          setAppView('client'); // Por ahora empleados van al cliente, después crear portal empleados
        }
        
        setWelcomePortalType('portal');
      }
    }
  }, []);

  const clientUser = {
    name: 'María González',
    email: 'maria@cliente.com',
    category: 'Platino',
    points: 2500,
  };

  // Auth handlers
  const handleLogin = (email: string, password: string) => {
    console.log('Login:', email, password);
    
    // Simulate authentication - Verificar primero si es un empleado registrado
    const employee = getEmployeeByEmail(email);
    
    if (employee) {
      // Es un empleado o admin registrado
      toast.success(`¡Bienvenido ${employee.username}!`);
      setCurrentUser(employee);
      
      // Enrutar según el tipo de usuario
      if (employee.tipoUsuario === 'superadmin') {
        setAppView('superadmin');
      } else if (employee.tipoUsuario === 'admin') {
        setAppView('admin');
      } else {
        setAppView('client'); // Por ahora empleados van al cliente, después crear portal empleados
      }
      
      setWelcomePortalType('portal');
      setShowWelcome(true);
    } else {
      // No es un empleado registrado - es un cliente
      toast.success('¡Bienvenido a tu Portal de Cliente!');
      setAppView('client');
      setWelcomePortalType('client');
      setShowWelcome(true);
    }
  };

  const handleRegister = (data: any) => {
    console.log('Register:', data);
    toast.success('¡Cuenta creada exitosamente!');
    setAppView('client');
    setWelcomePortalType('client');
    setShowWelcome(true);
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
    return (
      <>
        <Toaster position="top-right" />
        {showWelcome && welcomePortalType === 'portal' && !localStorage.getItem('g2rism-welcome-portal') && (
          <WelcomeModal
            portalType="employee"
            userName={currentUser?.username || 'Usuario'}
            onClose={() => setShowWelcome(false)}
          />
        )}
        <SuperAdminPortal
          user={currentUser!}
          onLogout={() => {
            setCurrentUser(null);
            setAppView('landing');
            toast.success('Sesión cerrada exitosamente');
          }}
        />
      </>
    );
  }

  if (appView === 'admin') {
    return (
      <>
        <Toaster position="top-right" />
        {showWelcome && welcomePortalType === 'portal' && !localStorage.getItem('g2rism-welcome-portal') && (
          <WelcomeModal
            portalType="employee"
            userName={currentUser?.username || 'Usuario'}
            onClose={() => setShowWelcome(false)}
          />
        )}
        <AdminPortal
          user={currentUser!}
          onLogout={() => {
            setCurrentUser(null);
            setAppView('landing');
            toast.success('Sesión cerrada exitosamente');
          }}
        />
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
            setAppView('landing');
            toast.success('Sesión cerrada exitosamente');
          }}
        />
      </>
    );
  }

  return null;
}