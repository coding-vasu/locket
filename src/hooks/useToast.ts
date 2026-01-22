import { useUIStore } from '../store/uiStore';

/**
 * Custom hook for toast notifications
 */
export function useToast() {
  const addToast = useUIStore((state) => state.addToast);
  const removeToast = useUIStore((state) => state.removeToast);
  const toasts = useUIStore((state) => state.toasts);
  
  return {
    toasts,
    showToast: addToast,
    hideToast: removeToast,
  };
}
