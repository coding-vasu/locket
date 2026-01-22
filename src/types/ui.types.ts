// Toast notification types
export interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

export interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
}

// Modal types
export type ModalMode = 'add' | 'edit' | null;

export interface ModalState {
  isOpen: boolean;
  mode: ModalMode;
}

// Navigation item type
export interface NavItem {
  id: 'all' | 'login' | 'api' | 'database' | 'note';
  label: string;
  icon: string;
}
