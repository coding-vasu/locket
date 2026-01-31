import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { Ghost, Plus } from '@phosphor-icons/react';
import { useCredentialStore } from '../../store/credentialStore';
import { useUIStore } from '../../store/uiStore';
import { CredentialCard } from './CredentialCard';

const ITEMS_PER_PAGE = 18;

export function CredentialList() {
  // Select raw values from store (stable references)
  const credentials = useCredentialStore((state) => state.credentials);
  const currentFilter = useCredentialStore((state) => state.currentFilter);
  const searchQuery = useCredentialStore((state) => state.searchQuery);
  const openAddModal = useUIStore((state) => state.openAddModal);
  
  // Local state for virtualization/pagination
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const observerTarget = useRef<HTMLDivElement>(null);
  
  // Compute filtered credentials - use store's optimized logic but with memoization
  const filteredCredentials = useMemo(() => {
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
    
    // Credentials already in newest-first order, no reversal needed
    return result;
  }, [credentials, currentFilter, searchQuery]);

  // Reset visible count when filtered credentials change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [filteredCredentials]);

  // Infinite scroll observer
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting) {
      setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredCredentials.length));
    }
  }, [filteredCredentials.length]);

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '400px', // Load more before reaching the bottom
      threshold: 0,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  // Derived state for rendering
  const visibleCredentials = filteredCredentials.slice(0, visibleCount);
  
  if (filteredCredentials.length === 0) {
    const isSearching = searchQuery.length > 0;
    const isFiltered = currentFilter !== 'all';
    
    return (
      <div className="flex flex-col items-center justify-center pt-24 opacity-60">
        <Ghost size={72} weight="duotone" className="mb-5 text-muted" />
        <p className="text-dim text-lg font-medium mb-2">
          {isSearching ? 'No matching credentials' : isFiltered ? 'No items in this category' : 'No credentials yet'}
        </p>
        <p className="text-muted text-sm mb-6">
          {isSearching ? 'Try a different search term' : 'Get started by adding your first credential'}
        </p>
        {!isSearching && (
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all hover:scale-105 font-semibold shadow-lg shadow-primary/20"
          >
            <Plus size={20} weight="bold" />
            Add Credential
          </button>
        )}
      </div>
    );
  }
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6 auto-rows-auto">
        {visibleCredentials.map((credential) => (
          <CredentialCard key={credential.id} credential={credential} />
        ))}
      </div>
      
      {/* Sentinel element for intersection observer */}
      {visibleCount < filteredCredentials.length && (
        <div ref={observerTarget} className="h-20 w-full flex items-center justify-center mt-4">
           <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}
    </>
  );
}
