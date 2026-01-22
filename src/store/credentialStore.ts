import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Credential, CredentialFormData, FilterType } from '../types/credential.types';
import { createDateString } from '../utils/dateFormatter';
import { seedData } from '../utils/seedData';

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
          credentials: [...state.credentials, newCredential],
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
      
      getFilteredCredentials: () => {
        const { credentials, currentFilter, searchQuery } = get();
        let result = credentials;
        
        // Filter by type
        if (currentFilter !== 'all') {
          result = result.filter((cred) => cred.type === currentFilter);
        }
        
        // Filter by search
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
        
        // Return newest first (create shallow copy to avoid mutation)
        return [...result].reverse();
      },
      
      getCount: (type) => {
        const { credentials } = get();
        if (type === 'all') return credentials.length;
        return credentials.filter((cred) => cred.type === type).length;
      },
    }),
    {
      name: 'locket_items',
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
