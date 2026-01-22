import { MainLayout } from './components/layout/MainLayout';
import { CredentialList } from './components/credential/CredentialList';
import { CredentialModal } from './components/credential/CredentialModal';
import { SettingsModal } from './components/features/SettingsModal';
import { KeyboardShortcutsModal } from './components/features/KeyboardShortcutsModal';
import { ToastContainer } from './components/ui/Toast';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useUIStore } from './store/uiStore';
import { useCredentialStore } from './store/credentialStore';

function App() {
  const openAddModal = useUIStore((state) => state.openAddModal);
  const openSettings = useUIStore((state) => state.openSettings);
  const openShortcuts = useUIStore((state) => state.openShortcuts);
  const closeModal = useUIStore((state) => state.closeModal);
  const closeSettings = useUIStore((state) => state.closeSettings);
  const closeShortcuts = useUIStore((state) => state.closeShortcuts);
  const isModalOpen = useUIStore((state) => state.isModalOpen);
  const isSettingsOpen = useUIStore((state) => state.isSettingsOpen);
  const isShortcutsOpen = useUIStore((state) => state.isShortcutsOpen);
  const setFilter = useCredentialStore((state) => state.setFilter);
  const searchQuery = useCredentialStore((state) => state.searchQuery);
  const setSearchQuery = useCredentialStore((state) => state.setSearchQuery);

  // Keyboard shortcuts (using standard Cmd/Ctrl combinations)
  useKeyboardShortcuts({
    shortcuts: [

      {
        key: 'i',
        ctrl: true,
        handler: () => openAddModal(),
        description: 'New credential',
      },
      {
        key: ',',
        ctrl: true,
        handler: () => openSettings(),
        description: 'Open settings',
      },
      {
        key: '/',
        ctrl: true,
        handler: () => openShortcuts(),
        description: 'Show keyboard shortcuts',
      },
      {
        key: 'Escape',
        handler: () => {
          if (isShortcutsOpen) {
            closeShortcuts();
          } else if (isSettingsOpen) {
            closeSettings();
          } else if (isModalOpen) {
            closeModal();
          } else if (searchQuery) {
            setSearchQuery('');
          }
        },
        description: 'Close modal or clear search',
        preventDefault: false,
      },
      {
        key: '1',
        ctrl: true,
        handler: () => setFilter('all'),
        description: 'Show all credentials',
      },
      {
        key: '2',
        ctrl: true,
        handler: () => setFilter('login'),
        description: 'Show logins',
      },
      {
        key: '3',
        ctrl: true,
        handler: () => setFilter('api'),
        description: 'Show API keys',
      },
      {
        key: '4',
        ctrl: true,
        handler: () => setFilter('database'),
        description: 'Show databases',
      },
      {
        key: '5',
        ctrl: true,
        handler: () => setFilter('note'),
        description: 'Show notes',
      },
    ],
  });

  return (
    <>
      <MainLayout>
        <div className="flex-1 overflow-auto p-4 md:p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto w-full">
            <CredentialList />
          </div>
        </div>
      </MainLayout>
      
      <CredentialModal />
      <SettingsModal />
      <KeyboardShortcutsModal />
      <ToastContainer />
    </>
  );
}

export default App;

