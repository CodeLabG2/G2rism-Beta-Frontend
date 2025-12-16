import { toast as sonnerToast, Toaster } from 'sonner@2.0.3';

export const toast = {
  success: (message: string) => {
    sonnerToast.success(message, {
      style: {
        background: '#10B981',
        color: '#FFFFFF',
        border: 'none',
      },
    });
  },
  error: (message: string) => {
    sonnerToast.error(message, {
      style: {
        background: '#EF4444',
        color: '#FFFFFF',
        border: 'none',
      },
    });
  },
  warning: (message: string) => {
    sonnerToast.warning(message, {
      style: {
        background: '#F59E0B',
        color: '#FFFFFF',
        border: 'none',
      },
    });
  },
  info: (message: string) => {
    sonnerToast.info(message, {
      style: {
        background: '#3A7AFE',
        color: '#FFFFFF',
        border: 'none',
      },
    });
  },
};

export { Toaster };
