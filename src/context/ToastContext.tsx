import React, { createContext, useState, useContext, ReactNode } from 'react';

type ToastType = 'info' | 'success' | 'warning' | 'error';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

type ToastContextType = {
  toasts: Toast[];
  addToast: (message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

export const useToast = () => useContext(ToastContext);

type ToastProviderProps = {
  children: ReactNode;
};

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type };
    
    setToasts((currentToasts) => [...currentToasts, newToast]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((currentToasts) => 
      currentToasts.filter((toast) => toast.id !== id)
    );
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      
      {/* Toast container */}
      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`
                flex items-center justify-between rounded-md px-4 py-3 shadow-lg
                ${toast.type === 'info' && 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'}
                ${toast.type === 'success' && 'bg-green-50 text-green-700 border-l-4 border-green-500'}
                ${toast.type === 'warning' && 'bg-yellow-50 text-yellow-700 border-l-4 border-yellow-500'}
                ${toast.type === 'error' && 'bg-red-50 text-red-700 border-l-4 border-red-500'}
              `}
            >
              <p>{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
};