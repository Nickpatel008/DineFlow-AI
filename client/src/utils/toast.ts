import toastLib from 'react-hot-toast';

/**
 * Common toast notification utility using react-hot-toast
 * Usage:
 *   import { toast } from '@/utils/toast';
 *   toast.success('Operation completed!');
 *   toast.error('Something went wrong');
 *   toast.info('Information message');
 *   toast.warning('Warning message');
 */

export const toast = {
  success: (message: string, duration: number = 4000) => {
    toastLib.success(message, {
      duration,
      position: 'top-center',
      style: {
        background: '#ffffff',
        color: '#1f2937',
        borderRadius: '12px',
        padding: '14px 20px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        border: '1px solid #e5e7eb',
        minWidth: '300px',
        maxWidth: '500px',
      },
      iconTheme: {
        primary: '#10b981',
        secondary: '#ffffff',
      },
    });
  },
  error: (message: string, duration: number = 4000) => {
    toastLib.error(message, {
      duration,
      position: 'top-center',
      style: {
        background: '#ffffff',
        color: '#1f2937',
        borderRadius: '12px',
        padding: '14px 20px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        border: '1px solid #fee2e2',
        minWidth: '300px',
        maxWidth: '500px',
      },
      iconTheme: {
        primary: '#ef4444',
        secondary: '#ffffff',
      },
    });
  },
  info: (message: string, duration: number = 4000) => {
    toastLib(message, {
      duration,
      position: 'top-center',
      icon: 'ℹ️',
      style: {
        background: '#ffffff',
        color: '#1f2937',
        borderRadius: '12px',
        padding: '14px 20px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        border: '1px solid #dbeafe',
        minWidth: '300px',
        maxWidth: '500px',
      },
      iconTheme: {
        primary: '#3b82f6',
        secondary: '#ffffff',
      },
    });
  },
  warning: (message: string, duration: number = 4000) => {
    toastLib(message, {
      duration,
      position: 'top-center',
      icon: '⚠️',
      style: {
        background: '#ffffff',
        color: '#1f2937',
        borderRadius: '12px',
        padding: '14px 20px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        border: '1px solid #fef3c7',
        minWidth: '300px',
        maxWidth: '500px',
      },
      iconTheme: {
        primary: '#f59e0b',
        secondary: '#ffffff',
      },
    });
  },
  loading: (message: string) => {
    return toastLib.loading(message, {
      position: 'top-center',
      style: {
        background: '#ffffff',
        color: '#1f2937',
        borderRadius: '12px',
        padding: '14px 20px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        border: '1px solid #e5e7eb',
        minWidth: '300px',
        maxWidth: '500px',
      },
    });
  },
  dismiss: (toastId?: string) => {
    toastLib.dismiss(toastId);
  },
};

