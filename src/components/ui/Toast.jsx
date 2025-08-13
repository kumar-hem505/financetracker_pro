import React from 'react';
import { toast, Toaster } from 'sonner';

// Toast provider component
export function ToastProvider({ children }) {
  return (
    <>
      {children}
      <Toaster 
        position="top-right"
        expand={true}
        richColors={true}
        duration={4000}
        closeButton={true}
        theme="light"
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid #e5e7eb',
            color: '#374151'
          }
        }}
      />
    </>
  );
}

// Toast utility functions
export const showToast = {
  success: (message, options = {}) => {
    toast?.success(message, {
      duration: 3000,
      ...options
    });
  },
  
  error: (message, options = {}) => {
    toast?.error(message, {
      duration: 5000,
      ...options
    });
  },
  
  info: (message, options = {}) => {
    toast?.info(message, {
      duration: 4000,
      ...options
    });
  },
  
  warning: (message, options = {}) => {
    toast?.warning(message, {
      duration: 4000,
      ...options
    });
  },
  
  loading: (message, options = {}) => {
    return toast?.loading(message, {
      duration: Infinity,
      ...options
    });
  },
  
  promise: (promise, messages) => {
    return toast?.promise(promise, messages);
  },
  
  dismiss: (toastId) => {
    toast?.dismiss(toastId);
  },
  
  custom: (component, options = {}) => {
    toast?.custom(component, options);
  }
};

export default showToast;