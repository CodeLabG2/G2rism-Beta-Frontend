import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { X, Calendar, CreditCard, FileText, MapPin, Check, Trash2 } from 'lucide-react';

interface Notification {
  id: number;
  type: 'booking' | 'payment' | 'document' | 'offer';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: React.ReactNode;
}

interface NotificationsPanelProps {
  show: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: number) => void;
}

export function NotificationsPanel({
  show,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
}: NotificationsPanelProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-end pt-20 pr-6"
      >
        <div
          className="absolute inset-0 bg-black/20"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, x: 20, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 20, y: -20 }}
          className="relative w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h6>Notificaciones</h6>
                {unreadCount > 0 && (
                  <Badge variant="error" size="sm">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                onClick={onMarkAllAsRead}
              >
                Marcar todas como leídas
              </Button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Check size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-600">No tienes notificaciones</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-[#3A7AFE]/5' : ''
                    }`}
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className={`p-2 rounded-lg flex-shrink-0 h-fit ${
                        notification.type === 'booking' ? 'bg-[#3A7AFE]/10 text-[#3A7AFE]' :
                        notification.type === 'payment' ? 'bg-[#10B981]/10 text-[#10B981]' :
                        notification.type === 'document' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                        'bg-[#EF4444]/10 text-[#EF4444]'
                      }`}>
                        {notification.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-[#3A7AFE] rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{notification.time}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(notification.id);
                            }}
                            className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
