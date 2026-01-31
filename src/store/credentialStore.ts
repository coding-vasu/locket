import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Credential, CredentialFormData, FilterType } from '../types/credential.types';
import { createDateString } from '../utils/dateFormatter';
import { seedData } from '../utils/seedData';
import { createJSONStorage } from 'zustand/middleware';
import { encryptedStorage } from '../utils/storage';

interface CredentialStore {
  // State
  credentials: Credential[];
  currentFilter: FilterType;
  searchQuery: string;
  
  // Actions
  setFilter: (filter: FilterType) => void;
  setSearchQuery: (query: string) => void;
  addCredential: (data: CredentialFormData) => void;
  updateCredential: (id: number, data: CredentialFormData) => void;
  deleteCredential: (id: number) => void;
  importCredentials: (credentials: Credential[], idsToRemove?: number[]) => void;
  clearAllData: () => void;
  
  // Computed
  getFilteredCredentials: () => Credential[];
  getCount: (type: FilterType) => number;
}

export const useCredentialStore = create<CredentialStore>()(
  persist(
    (set, get) => ({
      credentials: seedData, // Initialize with seed data
      currentFilter: 'all',
      searchQuery: '',
      
      setFilter: (filter) => set({ currentFilter: filter }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      addCredential: (data) => {
        const newCredential: Credential = {
          ...data,
          id: Date.now(),
          date: createDateString(),
          subtitle: generateSubtitle(data),
        } as Credential;
        
        set((state) => ({
          // Prepend to keep newest first - eliminates need for .reverse()
          credentials: [newCredential, ...state.credentials],
        }));
      },
      
      updateCredential: (id, data) => {
        set((state) => ({
          credentials: state.credentials.map((cred) =>
            cred.id === id
              ? {
                  ...data,
                  id,
                  date: cred.date, // Keep original date
                  subtitle: generateSubtitle(data),
                } as Credential
              : cred
          ),
        }));
      },
      
      deleteCredential: (id) => {
        set((state) => ({
          credentials: state.credentials.filter((cred) => cred.id !== id),
        }));
      },
      
      importCredentials: (credentials, idsToRemove = []) => {
        set((state) => {
          // First remove duplicates if specified
          let updatedCredentials = state.credentials;
          if (idsToRemove.length > 0) {
            updatedCredentials = updatedCredentials.filter(
              (cred) => !idsToRemove.includes(cred.id)
            );
          }
          
          // Add new credentials at the end (they're typically older imports)
          // If importing newer items, they should still appear in chronological order
          return {
            credentials: [...updatedCredentials, ...credentials],
          };
        });
      },
      
      clearAllData: () => {
        set({
          credentials: [],
          currentFilter: 'all',
          searchQuery: '',
        });
      },
      
      getFilteredCredentials: () => {
        const { credentials, currentFilter, searchQuery } = get();
        let result = credentials;
        
        // Filter by type
        if (currentFilter !== 'all') {
          result = result.filter((cred) => cred.type === currentFilter);
        }
        
        // Filter by search - pre-lowercase query once for performance
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          result = result.filter((cred) => {
            const titleMatch = cred.title.toLowerCase().includes(q);
            const subtitleMatch = cred.subtitle.toLowerCase().includes(q);
            
            let extraMatch = false;
            if (cred.type === 'login') {
              extraMatch = cred.username.toLowerCase().includes(q);
            } else if (cred.type === 'database') {
              extraMatch = cred.dbHost.toLowerCase().includes(q);
            }
            
            return titleMatch || subtitleMatch || extraMatch;
          });
        }
        
        // Credentials already stored in newest-first order, no need to reverse
        return result;
      },
      
      getCount: (type) => {
        const { credentials } = get();
        if (type === 'all') return credentials.length;
        return credentials.filter((cred) => cred.type === type).length;
      },
    }),
    {
      name: 'locket_items',
      storage: createJSONStorage(() => encryptedStorage),
      partialize: (state) => ({ credentials: state.credentials }),
    }
  )
);

// Helper function to generate subtitle based on credential type
function generateSubtitle(data: CredentialFormData): string {
  switch (data.type) {
    case 'login':
      return data.username || 'No username';
    case 'api':
      return data.env || 'Production';
    case 'database':
      return `${data.dbUser}@${data.dbHost}`;
    case 'note':
      return 'Secure Note';
    default:
      return '';
  }
}
