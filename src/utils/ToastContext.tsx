/**
 * Toast Context & Provider
 * Global toast notification system
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Toast } from '../components/common/Toast';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastData {
  id: number;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = (message: string, type: ToastType, duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (message: string, duration?: number) => {
    showToast(message, 'success', duration);
  };

  const error = (message: string, duration?: number) => {
    showToast(message, 'error', duration);
  };

  const warning = (message: string, duration?: number) => {
    showToast(message, 'warning', duration);
  };

  const info = (message: string, duration?: number) => {
    showToast(message, 'info', duration);
  };

  const value: ToastContextType = {
    showToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View style={styles.toastContainer} pointerEvents="box-none">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            visible
            onDismiss={() => removeToast(toast.id)}
            duration={toast.duration}
          />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
});
