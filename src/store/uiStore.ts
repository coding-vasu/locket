import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { Toast, ModalMode } from '../types/ui.types';
import type { CredentialFormData } from '../types/credential.types';

interface UIStore {
  // Toast state
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  
  // Modal state
  isModalOpen: boolean;
  modalMode: ModalMode;
  editingCredential: CredentialFormData | null;
  
  openAddModal: () => void;
  openEditModal: (credential: CredentialFormData) => void;
  closeModal: () => void;
  
  // Settings modal state
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  
  // Dock state
  dockSize: number; // in pixels
  setDockSize: (size: number) => void;

  // Keyboard shortcuts modal state
  isShortcutsOpen: boolean;
  openShortcuts: () => void;
  closeShortcuts: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      // Toast
      toasts: [],
      
      addToast: (message, type = 'success') => {
        const id = nanoid();
        const toast: Toast = { id, message, type, duration: 2000 };
        
        set((state) => ({
          toasts: [...state.toasts, toast],
        }));
        
        // Auto-remove after duration
        setTimeout(() => {
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
          }));
        }, toast.duration);
      },
      
      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },
      
      // Modal
      isModalOpen: false,
      modalMode: null,
      editingCredential: null,
      
      openAddModal: () => {
        set({
          isModalOpen: true,
          modalMode: 'add',
          editingCredential: null,
        });
      },
      
      openEditModal: (credential) => {
        set({
          isModalOpen: true,
          modalMode: 'edit',
          editingCredential: credential,
        });
      },
      
      closeModal: () => {
        set({
          isModalOpen: false,
        });
        
        // Delay resetting modal mode and editing credential until after close animation
        setTimeout(() => {
          set({
            modalMode: null,
            editingCredential: null,
          });
        }, 200); // Match the modal's leave animation duration
      },
      
      // Settings modal
      isSettingsOpen: false,
      
      openSettings: () => {
        set({ isSettingsOpen: true });
      },
      
      closeSettings: () => {
        set({ isSettingsOpen: false });
      },
      
      // Dock state
      dockSize: 35, // Default to 56px (w-14)
      setDockSize: (size) => set({ dockSize: size }),
    
      // Keyboard shortcuts modal
      isShortcutsOpen: false,
      
      openShortcuts: () => {
        set({ isShortcutsOpen: true });
      },
      
      closeShortcuts: () => {
        set({ isShortcutsOpen: false });
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ 
        dockSize: state.dockSize 
      }),
    }
  )
);
