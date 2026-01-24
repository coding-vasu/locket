import { invoke } from '@tauri-apps/api/core';
import { useUIStore } from '../store/uiStore';
import { useCredentialStore } from '../store/credentialStore';

export function useQuickCopy() {
  const setPinnedCredential = useUIStore((state) => state.setPinnedCredential);
  const credentials = useCredentialStore((state) => state.credentials);

  const openQuickCopy = async (credentialId: number) => {
    try {
      const credential = credentials.find((c) => c.id === credentialId);
      if (!credential) {
        console.error('Credential not found:', credentialId);
        return;
      }
      
      await invoke('open_quick_copy_window', { 
        credentialJson: JSON.stringify(credential) 
      });
      setPinnedCredential(credentialId);
    } catch (error) {
      console.error('Failed to open quick copy window:', error);
    }
  };

  const closeQuickCopy = async () => {
    try {
      await invoke('close_quick_copy_window');
      setPinnedCredential(null);
    } catch (error) {
      console.error('Failed to close quick copy window:', error);
    }
  };

  return { openQuickCopy, closeQuickCopy };
}
