import { ShieldCheck, MagnifyingGlass, X, Gear, Plus } from '@phosphor-icons/react';
import { useCredentialStore } from '../../store/credentialStore';
import { useUIStore } from '../../store/uiStore';

export function Header() {
  const searchQuery = useCredentialStore((state) => state.searchQuery);
  const setSearchQuery = useCredentialStore((state) => state.setSearchQuery);
  const openAddModal = useUIStore((state) => state.openAddModal);
  const openSettings = useUIStore((state) => state.openSettings);
  
  const handleClearSearch = () => {
    setSearchQuery('');
  };
  
  return (
    <header className="h-16 border-b border-border/50 flex items-center justify-between px-6 sticky top-0 bg-background/80 backdrop-blur-xl z-20">
      {/* Branding */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
          <ShieldCheck size={20} weight="bold" className="text-white" />
        </div>
        <span className="font-bold text-lg gradient-text tracking-tight">Locket</span>
      </div>
      
      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative group">
          <MagnifyingGlass 
            size={18} 
            weight="bold" 
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" 
          />
          <input
            type="text"
            placeholder="Search credentials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-11 pr-20 bg-zinc-900/50 border border-zinc-800 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-primary/50 focus:bg-zinc-900/70 transition-all"
            aria-label="Search credentials"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-12 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1 rounded hover:bg-zinc-800"
              title="Clear search"
              aria-label="Clear search"
            >
              <X size={16} weight="bold" />
            </button>
          )}
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 bg-zinc-800/50 border border-zinc-700 rounded">
            ⌘K
          </kbd>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all hover:scale-105 font-semibold text-sm shadow-lg shadow-primary/20"
          title="Add new credential (⌘N)"
          aria-label="Add new credential"
        >
          <Plus size={18} weight="bold" />
          <span className="hidden sm:inline">New</span>
        </button>
        <button
          onClick={openSettings}
          className="p-2.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/70 rounded-lg transition-all"
          title="Settings (⌘,)"
          aria-label="Open settings"
        >
          <Gear size={20} weight="bold" />
        </button>
      </div>
    </header>
  );
}
