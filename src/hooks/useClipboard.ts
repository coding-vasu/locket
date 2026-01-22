import { useUIStore } from '../store/uiStore';

/**
 * Custom hook for clipboard operations with toast notifications
 */
export function useClipboard() {
  const addToast = useUIStore((state) => state.addToast);
  
  const copyToClipboard = async (text: string, successMessage: string = 'Copied to clipboard') => {
    if (!text) {
      addToast('Nothing to copy');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(text);
      addToast(successMessage);
    } catch (err) {
      console.error('Failed to copy:', err);
      addToast('Failed to copy');
    }
  };
  
  return { copyToClipboard };
}
