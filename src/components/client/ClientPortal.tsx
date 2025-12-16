import React, { useState, useMemo } from 'react';
import { Logo } from '../layout/Logo';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AccountSections } from './AccountSections';
import { BookingFlow } from './BookingFlow';
import { BookingPaymentModal } from './payment/BookingPaymentModal';
import { NotificationsPanel } from './NotificationsPanel';
import { BookingDetailsModal } from './BookingDetailsModal';
import { DestinationDetailsModal } from './DestinationDetailsModal';
import { SupportModal } from './SupportModal';
import { FiltersModal } from './FiltersModal';
import {
  Home,
  Calendar,
  Compass,
  User,
  HelpCircle,
  LogOut,
  MapPin,
  Clock,
  Star,
  Settings,
  FileText,
  CreditCard,
  Bell,
  Heart,
  Download,
  Plane,
  Hotel,
  Shield,
  Award,
  TrendingUp,
  Search,
  Filter,
  ChevronDown,
  ArrowUpDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast, Toaster } from 'sonner@2.0.3';

interface ClientPortalProps {
  user: { name: string; email: string; category: string; points: number };
  onLogout?: () => void;
}

export function ClientPortal({ user, onLogout }: ClientPortalProps) {
  // View States
  const [currentView, setCurrentView] = useState('home');
  const [accountSection, setAccountSection] = useState('profile');

  // Data States
  const [bookings, setBookings] = useState([
    {
      id: 1,
      destination: 'París, Francia',
      dates: '15-20 Dic 2025',
      status: 'Confirmado',
      bookingNumber: 'G2R-2025-001',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80',
      type: 'Paquete Completo',
      travelers: 2,
      price: 2500,
      services: ['Vuelos', 'Hotel 5★', 'Tours', 'Desayuno'],
      hotel: 'Le Meurice Paris',
      flight: 'Air France AF4567',
    },
    {
      id: 2,
      destination: 'Tokio, Japón',
      dates: '10-18 Ene 2026',
      status: 'Pendiente pago',
      bookingNumber: 'G2R-2025-002',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80',
      type: 'Paquete Premium',
      travelers: 3,
      price: 4200,
      services: ['Vuelos', 'Hotel 5★', 'Tours', 'Todo incluido'],
      hotel: 'The Peninsula Tokyo',
      flight: 'ANA NH118',
    },
  ]);

  const [destinations] = useState([
    {
      id: 1,
      name: 'Santorini, Grecia',
      country: 'Grecia',
      price: 1500,
      rating: 4.8,
      reviews: 342,
      image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&q=80',
      discount: 15,
      duration: '7 días',
      type: 'Playa',
    },
    {
      id: 2,
      name: 'Bali, Indonesia',
      country: 'Indonesia',
      price: 1200,
      rating: 4.9,
      reviews: 567,
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80',
      discount: 20,
      duration: '10 días',
      type: 'Naturaleza',
    },
    {
      id: 3,
      name: 'Maldivas',
      country: 'Maldivas',
      price: 2000,
      rating: 5.0,
      reviews: 891,
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80',
      discount: 10,
      duration: '5 días',
      type: 'Lujo',
    },
    {
      id: 4,
      name: 'Dubai, EAU',
      country: 'Emiratos Árabes',
      price: 1800,
      rating: 4.7,
      reviews: 423,
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80',
      discount: 0,
      duration: '6 días',
      type: 'Ciudad',
    },
    {
      id: 5,
      name: 'Machu Picchu, Perú',
      country: 'Perú',
      price: 900,
      rating: 4.9,
      reviews: 678,
      image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400&q=80',
      discount: 25,
      duration: '4 días',
      type: 'Aventura',
    },
    {
      id: 6,
      name: 'Nueva York, USA',
      country: 'Estados Unidos',
      price: 1100,
      rating: 4.6,
      reviews: 1234,
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80',
      discount: 0,
      duration: '5 días',
      type: 'Ciudad',
    },
  ]);

  const [favorites, setFavorites] = useState([1, 5]); // IDs de destinos favoritos
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'booking' as const,
      title: 'Reserva Confirmada',
      message: 'Tu reserva a París ha sido confirmada',
      time: 'Hace 2 días',
      read: false,
      icon: <Calendar size={16} />,
    },
    {
      id: 2,
      type: 'payment' as const,
      title: 'Pago Procesado',
      message: 'Pago de $2,500 procesado exitosamente',
      time: 'Hace 3 días',
      read: false,
      icon: <CreditCard size={16} />,
    },
    {
      id: 3,
      type: 'document' as const,
      title: 'Documentos Listos',
      message: 'Tus documentos de viaje están disponibles',
      time: 'Hace 5 días',
      read: true,
      icon: <FileText size={16} />,
    },
  ]);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating' | 'discount'>('price-asc');
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    duration: [] as string[],
    rating: 0,
    types: [] as string[],
  });

  // Modal States
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [showDestinationDetails, setShowDestinationDetails] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Selected Items
  const [selectedPackageForBooking, setSelectedPackageForBooking] = useState<any>(null);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<any>(null);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [selectedDestination, setSelectedDestination] = useState<any>(null);

  const menuItems = [
    { id: 'home', label: 'Inicio', icon: <Home size={20} /> },
    { id: 'bookings', label: 'Mis Reservas', icon: <Calendar size={20} /> },
    { id: 'explore', label: 'Explorar', icon: <Compass size={20} /> },
    { id: 'favorites', label: 'Favoritos', icon: <Heart size={20} /> },
    { id: 'account', label: 'Mi Cuenta', icon: <User size={20} /> },
  ];

  const loyaltyBenefits = [
    { icon: <Award size={24} />, title: 'Descuentos exclusivos', description: 'Hasta 25% en destinos seleccionados' },
    { icon: <Star size={24} />, title: 'Prioridad en reservas', description: 'Acceso anticipado a ofertas' },
    { icon: <Shield size={24} />, title: 'Seguro de viaje gratis', description: 'En todas tus reservas' },
    { icon: <TrendingUp size={24} />, title: 'Puntos dobles', description: 'En viajes internacionales' },
  ];

  const recentActivity = [
    { action: 'Reserva confirmada', destination: 'París, Francia', time: 'Hace 2 días', icon: <Calendar size={16} /> },
    { action: 'Pago procesado', destination: 'Factura #G2R-2025-001', time: 'Hace 3 días', icon: <CreditCard size={16} /> },
    { action: 'Documentos actualizados', destination: 'Pasaporte', time: 'Hace 5 días', icon: <FileText size={16} /> },
    { action: 'Destino guardado', destination: 'Bali, Indonesia', time: 'Hace 1 semana', icon: <Heart size={16} /> },
  ];

  // Computed Values
  const upcomingBookings = useMemo(() => bookings.filter(b => b.status !== 'Completado'), [bookings]);
  const unreadNotifications = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);
  const favoriteDestinations = useMemo(() => destinations.filter(d => favorites.includes(d.id)), [destinations, favorites]);

  // Filtered and Sorted Destinations
  const filteredDestinations = useMemo(() => {
    let filtered = destinations.filter(dest => {
      // Search query
      if (searchQuery && !dest.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !dest.country.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Price range
      if (dest.price < filters.priceRange[0] || dest.price > filters.priceRange[1]) {
        return false;
      }

      // Rating
      if (dest.rating < filters.rating) {
        return false;
      }

      // Types
      if (filters.types.length > 0 && !filters.types.includes(dest.type)) {
        return false;
      }

      // Duration
      if (filters.duration.length > 0) {
        const days = parseInt(dest.duration);
        const matchesDuration = filters.duration.some(range => {
          if (range === '3-5 días') return days >= 3 && days <= 5;
          if (range === '6-8 días') return days >= 6 && days <= 8;
          if (range === '9-12 días') return days >= 9 && days <= 12;
          if (range === '+12 días') return days > 12;
          return false;
        });
        if (!matchesDuration) return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'discount':
          return b.discount - a.discount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [destinations, searchQuery, filters, sortBy]);

  // Handlers
  const handleToggleFavorite = (destinationId: number) => {
    setFavorites(prev => {
      if (prev.includes(destinationId)) {
        toast.success('Eliminado de favoritos');
        return prev.filter(id => id !== destinationId);
      } else {
        toast.success('Agregado a favoritos');
        return [...prev, destinationId];
      }
    });
  };

  const handleMarkNotificationAsRead = (notificationId: number) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('Todas las notificaciones marcadas como leídas');
  };

  const handleDeleteNotification = (notificationId: number) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    toast.success('Notificación eliminada');
  };

  const handleCompletBooking = (newBooking: any) => {
    const bookingWithId = {
      ...newBooking,
      id: bookings.length + 1,
      bookingNumber: `G2R-2025-${String(bookings.length + 1).padStart(3, '0')}`,
      status: 'Pendiente pago',
    };
    setBookings(prev => [...prev, bookingWithId]);
    setShowBookingFlow(false);
    setSelectedPackageForBooking(null);
    setCurrentView('bookings');
    
    // Add notification
    setNotifications(prev => [
      {
        id: prev.length + 1,
        type: 'booking' as const,
        title: 'Nueva Reserva Creada',
        message: `Reserva a ${newBooking.destination} creada exitosamente`,
        time: 'Ahora',
        read: false,
        icon: <Calendar size={16} />,
      },
      ...prev,
    ]);

    toast.success('Reserva creada exitosamente', {
      description: 'Completa el pago para confirmar tu reserva',
    });
  };

  const handlePaymentComplete = (paymentData: any) => {
    // Update booking status
    setBookings(prev =>
      prev.map(booking =>
        booking.id === selectedBookingForPayment?.id
          ? { ...booking, status: 'Confirmado' }
          : booking
      )
    );

    setShowPaymentModal(false);
    setSelectedBookingForPayment(null);

    // Add notification
    setNotifications(prev => [
      {
        id: prev.length + 1,
        type: 'payment' as const,
        title: 'Pago Procesado',
        message: `Pago de $${paymentData.amount.toLocaleString()} procesado exitosamente`,
        time: 'Ahora',
        read: false,
        icon: <CreditCard size={16} />,
      },
      ...prev,
    ]);

    toast.success('¡Pago procesado exitosamente!', {
      description: 'Tu reserva ha sido confirmada',
    });
  };

  const handleViewBookingDetails = (booking: any) => {
    setSelectedBooking(booking);
    setShowBookingDetails(true);
  };

  const handleViewDestinationDetails = (destination: any) => {
    setSelectedDestination(destination);
    setShowDestinationDetails(true);
  };

  const handleBookFromDetails = () => {
    setShowDestinationDetails(false);
    setSelectedPackageForBooking(selectedDestination);
    setShowBookingFlow(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo size="sm" onClick={onLogout} />

            <nav className="hidden lg:flex items-center gap-8">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 transition-colors ${
                    currentView === item.id ? 'text-[#3A7AFE]' : 'text-gray-700 hover:text-[#3A7AFE]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowNotifications(true)}
                className="relative p-2 text-gray-700 hover:text-[#3A7AFE] transition-colors"
              >
                <Bell size={20} />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <Button
                variant="secondary"
                size="sm"
                icon={<HelpCircle size={18} />}
                onClick={() => setShowSupport(true)}
              >
                Soporte
              </Button>
              
              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Avatar name={user.name} size="md" />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-10"
                    >
                      <div
                        className="absolute inset-0"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-20"
                      >
                        <div className="p-4 border-b border-gray-200">
                          <div className="flex items-center gap-3">
                            <Avatar name={user.name} size="md" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate">{user.name}</p>
                              <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <Badge variant="warning" size="sm">{user.category}</Badge>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <Star size={12} className="fill-[#F59E0B] text-[#F59E0B]" />
                              {user.points} pts
                            </div>
                          </div>
                        </div>
                        <div className="p-2">
                          <button 
                            onClick={() => {
                              setCurrentView('account');
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <User size={16} />
                            <span>Mi cuenta</span>
                          </button>
                          <button
                            onClick={() => {
                              setCurrentView('account');
                              setAccountSection('notifications');
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Settings size={16} />
                            <span>Configuración</span>
                          </button>
                        </div>
                        <div className="p-2 border-t border-gray-200">
                          <button
                            onClick={onLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#EF4444] hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <LogOut size={16} />
                            <span>Cerrar sesión</span>
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {/* HOME VIEW */}
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Welcome Banner */}
              <Card className="bg-gradient-to-r from-[#3A7AFE] to-[#1A2440] text-white overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-white mb-2">¡Hola, {user.name.split(' ')[0]}!</h3>
                    <p className="text-white/90 mb-4">
                      Bienvenido de vuelta a tu portal de viajes
                    </p>
                    <div className="flex items-center gap-4">
                      <Badge variant="warning" className="bg-white/20 text-white border-white/30">
                        {user.category}
                      </Badge>
                      <div className="flex items-center gap-2 text-white/90">
                        <Star size={16} className="fill-white text-white" />
                        <span>{user.points} puntos</span>
                      </div>
                    </div>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&q=80"
                    alt="Travel"
                    className="hidden lg:block w-48 h-32 object-cover rounded-lg"
                  />
                </div>
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Reservas activas', value: upcomingBookings.length, icon: <Calendar size={24} />, color: 'text-[#3A7AFE]' },
                  { label: 'Destinos visitados', value: 12, icon: <MapPin size={24} />, color: 'text-[#10B981]' },
                  { label: 'Puntos acumulados', value: user.points, icon: <Award size={24} />, color: 'text-[#F59E0B]' },
                  { label: 'Favoritos', value: favoriteDestinations.length, icon: <Heart size={24} />, color: 'text-[#EF4444]' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                          <h4>{stat.value}</h4>
                        </div>
                        <div className={`${stat.color}`}>
                          {stat.icon}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Upcoming Bookings */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h5>Mis Próximas Reservas</h5>
                  <button
                    onClick={() => setCurrentView('bookings')}
                    className="text-sm text-[#3A7AFE] hover:underline"
                  >
                    Ver todas
                  </button>
                </div>
                {upcomingBookings.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {upcomingBookings.map((booking) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Card hover className="cursor-pointer" onClick={() => handleViewBookingDetails(booking)}>
                          <div className="flex gap-4">
                            <img
                              src={booking.image}
                              alt={booking.destination}
                              className="w-32 h-32 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h6>{booking.destination}</h6>
                                  <p className="text-sm text-gray-600">{booking.type}</p>
                                </div>
                                <Badge
                                  variant={booking.status === 'Confirmado' ? 'success' : 'warning'}
                                  size="sm"
                                >
                                  {booking.status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600 mb-2">
                                <Clock size={14} />
                                <span className="text-sm">{booking.dates}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600 mb-3">
                                <User size={14} />
                                <span className="text-sm">{booking.travelers} viajeros</span>
                              </div>
                              <Button variant="secondary" size="sm" fullWidth>
                                Ver detalles
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <Card className="text-center py-12">
                    <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">No tienes reservas activas</p>
                    <Button onClick={() => setCurrentView('explore')}>
                      Explorar destinos
                    </Button>
                  </Card>
                )}
              </div>

              {/* Loyalty Program */}
              <Card className="bg-gradient-to-br from-[#F59E0B]/10 to-[#F59E0B]/5">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h5 className="mb-2">Programa de Lealtad {user.category}</h5>
                    <p className="text-gray-600">Disfruta de beneficios exclusivos</p>
                  </div>
                  <Award size={48} className="text-[#F59E0B]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {loyaltyBenefits.map((benefit, index) => (
                    <div key={index} className="text-center">
                      <div className="inline-flex p-3 bg-white rounded-lg text-[#3A7AFE] mb-2">
                        {benefit.icon}
                      </div>
                      <h6 className="text-sm mb-1">{benefit.title}</h6>
                      <p className="text-xs text-gray-600">{benefit.description}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recommended Destinations */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h5>Destinos Recomendados para ti</h5>
                  <button
                    onClick={() => setCurrentView('explore')}
                    className="text-sm text-[#3A7AFE] hover:underline"
                  >
                    Ver más
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {destinations.slice(0, 3).map((destination, index) => (
                    <motion.div
                      key={destination.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card hover className="overflow-hidden cursor-pointer" onClick={() => handleViewDestinationDetails(destination)}>
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={destination.image}
                            alt={destination.name}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                          />
                          {destination.discount > 0 && (
                            <div className="absolute top-3 left-3">
                              <Badge variant="error" className="bg-red-500 text-white border-0">
                                -{destination.discount}%
                              </Badge>
                            </div>
                          )}
                          <div className="absolute top-3 right-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorite(destination.id);
                              }}
                              className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
                            >
                              <Heart
                                size={18}
                                className={favorites.includes(destination.id) ? 'fill-red-500 text-red-500' : 'text-gray-700'}
                              />
                            </button>
                          </div>
                          <div className="absolute bottom-3 right-3">
                            <Badge variant="success" className="bg-white/90 text-gray-900 border-0">
                              <Star size={12} className="inline mr-1 fill-[#F59E0B] text-[#F59E0B]" />
                              {destination.rating}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4">
                          <h6 className="mb-1">{destination.name}</h6>
                          <p className="text-sm text-gray-600 mb-3">{destination.duration}</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs text-gray-500">Desde</span>
                              <p className="text-[#3A7AFE]">${destination.price}</p>
                            </div>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPackageForBooking(destination);
                                setShowBookingFlow(true);
                              }}
                            >
                              Reservar
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <Card>
                <h6 className="mb-4">Actividad Reciente</h6>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <div className="p-2 bg-[#3A7AFE]/10 text-[#3A7AFE] rounded-lg">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.action}</p>
                        <p className="text-xs text-gray-600">{activity.destination}</p>
                      </div>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* BOOKINGS VIEW */}
          {currentView === 'bookings' && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4>Mis Reservas</h4>
                  <p className="text-gray-600 mt-1">Gestiona tus viajes próximos</p>
                </div>
                <Button onClick={() => setCurrentView('explore')}>
                  Nueva reserva
                </Button>
              </div>

              {/* Bookings List */}
              {bookings.length === 0 ? (
                <Card className="text-center py-16">
                  <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
                  <h5 className="mb-2">No tienes reservas</h5>
                  <p className="text-gray-600 mb-6">Comienza a explorar destinos increíbles</p>
                  <Button onClick={() => setCurrentView('explore')}>
                    Explorar destinos
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id} hover className="cursor-pointer" onClick={() => handleViewBookingDetails(booking)}>
                      <div className="flex flex-col lg:flex-row gap-6">
                        <img
                          src={booking.image}
                          alt={booking.destination}
                          className="w-full lg:w-48 h-48 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h5 className="mb-1">{booking.destination}</h5>
                              <p className="text-sm text-gray-600">{booking.type} • {booking.bookingNumber}</p>
                            </div>
                            <Badge
                              variant={
                                booking.status === 'Confirmado' ? 'success' :
                                booking.status === 'Pendiente pago' ? 'warning' : 'default'
                              }
                            >
                              {booking.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock size={16} />
                              <div>
                                <p className="text-xs text-gray-500">Fechas</p>
                                <p className="text-sm">{booking.dates}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <User size={16} />
                              <div>
                                <p className="text-xs text-gray-500">Viajeros</p>
                                <p className="text-sm">{booking.travelers} personas</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Hotel size={16} />
                              <div>
                                <p className="text-xs text-gray-500">Hotel</p>
                                <p className="text-sm">{booking.hotel}</p>
                              </div>
                            </div>
                            {booking.flight && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Plane size={16} />
                                <div>
                                  <p className="text-xs text-gray-500">Vuelo</p>
                                  <p className="text-sm">{booking.flight}</p>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {booking.services.map((service, index) => (
                              <Badge key={index} variant="default" size="sm">
                                {service}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">Total</p>
                              <h5 className="text-[#3A7AFE]">${booking.price.toLocaleString()}</h5>
                            </div>
                            <div className="flex gap-2">
                              {booking.status === 'Pendiente pago' && (
                                <Button
                                  variant="primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedBookingForPayment(booking);
                                    setShowPaymentModal(true);
                                  }}
                                >
                                  Completar pago
                                </Button>
                              )}
                              <Button
                                variant="secondary"
                                icon={<Download size={16} />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.success('Descargando documentos...');
                                }}
                              >
                                Descargar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* EXPLORE VIEW */}
          {currentView === 'explore' && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div>
                <h4 className="mb-2">Explora Destinos</h4>
                <p className="text-gray-600">Descubre tu próxima aventura</p>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar destinos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="appearance-none px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A7AFE] focus:border-transparent bg-white cursor-pointer"
                    >
                      <option value="price-asc">Precio: Menor a mayor</option>
                      <option value="price-desc">Precio: Mayor a menor</option>
                      <option value="rating">Mejor valorados</option>
                      <option value="discount">Mayor descuento</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  <Button
                    variant="secondary"
                    icon={<Filter size={18} />}
                    onClick={() => setShowFilters(true)}
                  >
                    Filtros
                    {(filters.duration.length > 0 || filters.types.length > 0 || filters.rating > 0) && (
                      <Badge variant="error" size="sm" className="ml-2">
                        {filters.duration.length + filters.types.length + (filters.rating > 0 ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Mostrando {filteredDestinations.length} destinos
                </p>
                {(searchQuery || filters.duration.length > 0 || filters.types.length > 0 || filters.rating > 0) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({
                        priceRange: [0, 5000],
                        duration: [],
                        rating: 0,
                        types: [],
                      });
                      setSortBy('price-asc');
                      toast.success('Filtros limpiados');
                    }}
                    className="text-sm text-[#3A7AFE] hover:underline"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>

              {/* Destinations Grid */}
              {filteredDestinations.length === 0 ? (
                <Card className="text-center py-16">
                  <Search size={64} className="mx-auto text-gray-300 mb-4" />
                  <h5 className="mb-2">No se encontraron destinos</h5>
                  <p className="text-gray-600 mb-6">Intenta ajustar tus filtros de búsqueda</p>
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({
                        priceRange: [0, 5000],
                        duration: [],
                        rating: 0,
                        types: [],
                      });
                    }}
                  >
                    Ver todos los destinos
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDestinations.map((destination, index) => (
                    <motion.div
                      key={destination.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card hover className="overflow-hidden cursor-pointer" onClick={() => handleViewDestinationDetails(destination)}>
                        <div className="relative h-52 overflow-hidden">
                          <img
                            src={destination.image}
                            alt={destination.name}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                          />
                          {destination.discount > 0 && (
                            <div className="absolute top-3 left-3">
                              <Badge variant="error" className="bg-red-500 text-white border-0">
                                -{destination.discount}%
                              </Badge>
                            </div>
                          )}
                          <div className="absolute top-3 right-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorite(destination.id);
                              }}
                              className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
                            >
                              <Heart
                                size={18}
                                className={favorites.includes(destination.id) ? 'fill-red-500 text-red-500' : 'text-gray-700'}
                              />
                            </button>
                          </div>
                          <div className="absolute bottom-3 right-3">
                            <Badge variant="success" className="bg-white/90 text-gray-900 border-0">
                              <Star size={12} className="inline mr-1 fill-[#F59E0B] text-[#F59E0B]" />
                              {destination.rating} ({destination.reviews})
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4">
                          <h6 className="mb-1">{destination.name}</h6>
                          <p className="text-sm text-gray-600 mb-3">
                            <MapPin size={14} className="inline mr-1" />
                            {destination.country} • {destination.duration}
                          </p>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs text-gray-500">Desde</span>
                              <div className="flex items-center gap-2">
                                <p className="text-[#3A7AFE]">${destination.price}</p>
                                {destination.discount > 0 && (
                                  <span className="text-xs text-gray-400 line-through">
                                    ${Math.round(destination.price / (1 - destination.discount / 100))}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Button 
                              variant="primary" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPackageForBooking(destination);
                                setShowBookingFlow(true);
                              }}
                            >
                              Reservar
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* FAVORITES VIEW */}
          {currentView === 'favorites' && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div>
                <h4 className="mb-2">Mis Favoritos</h4>
                <p className="text-gray-600">Destinos que has guardado</p>
              </div>

              {favoriteDestinations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteDestinations.map((destination) => (
                    <Card key={destination.id} hover className="overflow-hidden cursor-pointer" onClick={() => handleViewDestinationDetails(destination)}>
                      <div className="relative h-48">
                        <img
                          src={destination.image}
                          alt={destination.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(destination.id);
                          }}
                          className="absolute top-3 right-3 p-2 bg-white rounded-full"
                        >
                          <Heart size={18} className="text-red-500 fill-red-500" />
                        </button>
                        {destination.discount > 0 && (
                          <div className="absolute top-3 left-3">
                            <Badge variant="error" className="bg-red-500 text-white border-0">
                              -{destination.discount}%
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h6 className="mb-1">{destination.name}</h6>
                        <p className="text-sm text-gray-600 mb-3">{destination.country} • {destination.duration}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-[#3A7AFE]">Desde ${destination.price}</p>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPackageForBooking(destination);
                              setShowBookingFlow(true);
                            }}
                          >
                            Reservar
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="text-center py-16">
                  <Heart size={64} className="mx-auto text-gray-300 mb-4" />
                  <h5 className="mb-2">No tienes favoritos aún</h5>
                  <p className="text-gray-600 mb-6">Guarda tus destinos favoritos para encontrarlos fácilmente</p>
                  <Button onClick={() => setCurrentView('explore')}>
                    Explorar destinos
                  </Button>
                </Card>
              )}
            </motion.div>
          )}

          {/* ACCOUNT VIEW */}
          {currentView === 'account' && (
            <motion.div
              key="account"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h4>Mi Cuenta</h4>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Account Menu */}
                <Card className="lg:col-span-1 h-fit">
                  <nav className="space-y-1">
                    {[
                      { icon: <User size={18} />, label: 'Mi Perfil', id: 'profile' },
                      { icon: <MapPin size={18} />, label: 'Preferencias', id: 'preferences' },
                      { icon: <Shield size={18} />, label: 'Seguridad', id: 'security' },
                      { icon: <FileText size={18} />, label: 'Documentos', id: 'documents' },
                      { icon: <CreditCard size={18} />, label: 'Métodos de pago', id: 'payment' },
                      { icon: <Bell size={18} />, label: 'Notificaciones', id: 'notifications' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setAccountSection(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          accountSection === item.id
                            ? 'bg-[#3A7AFE] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {item.icon}
                        <span className="text-sm">{item.label}</span>
                      </button>
                    ))}
                  </nav>
                </Card>

                {/* Profile Form */}
                <Card className="lg:col-span-3">
                  <AccountSections user={user} section={accountSection} />
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <NotificationsPanel
        show={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onDelete={handleDeleteNotification}
      />

      {showBookingFlow && (
        <BookingFlow
          selectedPackage={selectedPackageForBooking}
          onClose={() => {
            setShowBookingFlow(false);
            setSelectedPackageForBooking(null);
          }}
          onComplete={handleCompletBooking}
        />
      )}

      {showPaymentModal && selectedBookingForPayment && (
        <BookingPaymentModal
          booking={selectedBookingForPayment}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedBookingForPayment(null);
          }}
          onPaymentComplete={handlePaymentComplete}
        />
      )}

      {showBookingDetails && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => {
            setShowBookingDetails(false);
            setSelectedBooking(null);
          }}
          onPayment={() => {
            setShowBookingDetails(false);
            setSelectedBookingForPayment(selectedBooking);
            setShowPaymentModal(true);
          }}
        />
      )}

      {showDestinationDetails && selectedDestination && (
        <DestinationDetailsModal
          destination={selectedDestination}
          onClose={() => {
            setShowDestinationDetails(false);
            setSelectedDestination(null);
          }}
          onBook={handleBookFromDetails}
          isFavorite={favorites.includes(selectedDestination.id)}
          onToggleFavorite={() => handleToggleFavorite(selectedDestination.id)}
        />
      )}

      <SupportModal
        show={showSupport}
        onClose={() => setShowSupport(false)}
      />

      <FiltersModal
        show={showFilters}
        onClose={() => setShowFilters(false)}
        currentFilters={filters}
        onApply={(newFilters) => {
          setFilters(newFilters);
          toast.success('Filtros aplicados');
        }}
      />
    </div>
  );
}
