import { useState, useCallback, createContext, useContext, type ReactNode } from 'react';
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, ToastIcon, type ToastType } from '@/components/ui/toast';

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastType;
}

interface ToastContextType {
  toast: (title: string, description?: string, variant?: ToastType) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastManager({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((title: string, description?: string, variant: ToastType = 'default') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, title, description, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const ctx: ToastContextType = {
    toast: addToast,
    success: (title, desc) => addToast(title, desc, 'success'),
    error: (title, desc) => addToast(title, desc, 'error'),
    warning: (title, desc) => addToast(title, desc, 'warning'),
    info: (title, desc) => addToast(title, desc, 'info'),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <ToastProvider>
        {toasts.map((t) => (
          <Toast key={t.id} variant={t.variant} onOpenChange={() => dismiss(t.id)}>
            <ToastIcon variant={t.variant} />
            <div className="flex-1">
              <ToastTitle>{t.title}</ToastTitle>
              {t.description && <ToastDescription>{t.description}</ToastDescription>}
            </div>
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastManager');
  return ctx;
}
