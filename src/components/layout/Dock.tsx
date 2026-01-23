import { useState, useRef, useEffect } from 'react';
import { Gear, Plus, SquaresFour, Globe, Code, Database, Notepad, MagnifyingGlass } from '@phosphor-icons/react';
import clsx from 'clsx';
import { NAV_ITEMS } from '../../constants';
import { useCredentialStore } from '../../store/credentialStore';
import { useUIStore } from '../../store/uiStore';
import { isMac, useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

// DockIcon component with magnification effect
interface DockIconProps {
  index: number;
  hoveredIndex: number | null;
  isActive: boolean;
  count: number;
  Icon: typeof Globe;
  label: string;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  showShortcut?: boolean;
  shortcutKey?: string;
  size: number;
}

function DockIcon({
  index,
  hoveredIndex,
  isActive,
  count,
  Icon,
  label,
  onClick,
  onMouseEnter,
  onMouseLeave,
  showShortcut,
  shortcutKey,
  size,
}: DockIconProps) {
  const mac = isMac();
  const isHovered = hoveredIndex === index;
  
  // Dynamic styles
  const borderRadius = Math.round(size * 0.28); // Slightly rounded, ~16px at 56px size
  const iconSize = Math.round(size * 0.45); // ~25px at 56px size
  
  return (
    <div className="relative group dock-icon-wrapper">
      {/* Main Icon Button */}
      <button
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{ width: size, height: size, borderRadius }}
        className={clsx(
          'relative flex items-center justify-center',
          isActive
            ? 'bg-primary/10 text-primary shadow-sm border border-primary/20'
            : 'bg-surfaceHighlight/40 text-muted hover:bg-surfaceHighlight/70 hover:text-main hover:border-black/10 dark:hover:border-white/10 border border-black/5 dark:border-white/5'
        )}
      >
        <Icon size={iconSize} weight={isActive ? 'fill' : 'regular'} className="relative z-10" />
        
        {/* Count Badge */}
        {count > 0 && !isActive && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-semibold rounded-full flex items-center justify-center border border-white/20 shadow-lg">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>
      
      {/* Active Indicator - Glowing Pill */}
      {isActive && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-[3px] bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-70 rounded-full blur-[1px] shadow-[0_-1px_4px_rgba(99,102,241,0.3)]" />
      )}
      
      {/* Tooltip */}
      {isHovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-3 py-2 bg-zinc-900/95 border border-white/10 rounded-lg shadow-xl whitespace-nowrap z-50 animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="text-xs font-medium text-white">{label}</div>
            {showShortcut && shortcutKey && (
              <kbd className="text-[10px] px-1.5 py-0.5 bg-white/10 border border-white/20 rounded text-zinc-300">
                {mac ? '⌘' : 'Ctrl+'}{shortcutKey}
              </kbd>
            )}
          </div>
          {count > 0 && (
            <div className="text-[10px] text-zinc-400 mt-0.5">{count} items</div>
          )}
        </div>
      )}
    </div>
  );
}

// Action Button component (Search, Add, Settings)
interface ActionButtonProps {
  index: number;
  hoveredIndex: number | null;
  Icon: typeof Plus;
  label: string;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  variant?: 'primary' | 'secondary' | 'success';
  isActive?: boolean;
  shortcutKey?: string;
  subtitle?: string;
  size?: 'normal' | 'large';
  itemSize?: number;
}

function ActionButton({
  index,
  hoveredIndex,
  Icon,
  label,
  onClick,
  onMouseEnter,
  onMouseLeave,
  variant = 'secondary',
  isActive = false,
  shortcutKey,
  subtitle,
  size = 'normal',
  itemSize = 56, // Default fallback
}: ActionButtonProps) {
  const isHovered = hoveredIndex === index;
  
  // Calculate size based on itemSize
  // If large, we add ~14% to the base size (similar to 56 -> 64)
  const finalSize = size === 'large' ? Math.round(itemSize * 1.14) : itemSize;
  
  // Dynamic scaling
  const borderRadius = Math.round(finalSize * 0.28);
  const iconSize = Math.round(finalSize * 0.45);
  
  const variantStyles = {
    primary: 'bg-blue-500/90 text-white shadow-lg border border-blue-400/30 hover:bg-blue-600/90',
    secondary: 'bg-surfaceHighlight/40 text-muted hover:bg-surfaceHighlight/70 hover:text-main border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10',
    success: 'bg-emerald-500/90 text-white shadow-lg border border-emerald-400/30 hover:bg-emerald-600/90',
  };
  
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{ width: finalSize, height: finalSize, borderRadius }}
        className={clsx(
          'relative flex items-center justify-center',
          'transition-all duration-200 active:scale-95',
          isActive ? variantStyles.success : variantStyles[variant]
        )}
      >
        <Icon size={iconSize} weight="bold" className="relative z-10" />
      </button>
      
      {/* Tooltip */}
      {isHovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-3 py-2 bg-zinc-900/95 border border-white/10 rounded-lg shadow-xl whitespace-nowrap z-50 animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="text-xs font-medium text-white">{label}</div>
            {shortcutKey && (
              <kbd className="text-[10px] px-1.5 py-0.5 bg-white/10 border border-white/20 rounded text-zinc-300">
                {shortcutKey}
              </kbd>
            )}
          </div>
          {subtitle && (
            <div className="text-[10px] text-zinc-400 mt-0.5">{subtitle}</div>
          )}
        </div>
      )}
    </div>
  );
}

export function Dock() {
  const currentFilter = useCredentialStore((state) => state.currentFilter);
  const setFilter = useCredentialStore((state) => state.setFilter);
  const getCount = useCredentialStore((state) => state.getCount);
  const searchQuery = useCredentialStore((state) => state.searchQuery);
  const setSearchQuery = useCredentialStore((state) => state.setSearchQuery);
  const openAddModal = useUIStore((state) => state.openAddModal);
  const openSettings = useUIStore((state) => state.openSettings);
  const dockSize = useUIStore((state) => state.dockSize);
  
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [dockWidth, setDockWidth] = useState<number>(0);
  const dockRef = useRef<HTMLDivElement>(null);
  const mac = isMac();

  // Sync dock width
  useEffect(() => {
    if (dockRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
           if (entry.borderBoxSize) {
             setDockWidth(entry.borderBoxSize[0].inlineSize);
           } else {
             // Fallback for older browsers
             setDockWidth(entry.contentRect.width + 32); // Approximate padding if borderBox unavailable
           }
        }
      });
      resizeObserver.observe(dockRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  // Handle keyboard shortcuts
  useKeyboardShortcuts({
    shortcuts: [
      {
        key: 'k',
        ctrl: true,
        handler: (e) => {
          e.preventDefault();
          // Toggle search
          if (searchExpanded) {
             // If already open
             const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
             if (document.activeElement === searchInput) {
               // If focused, close it
               setSearchExpanded(false);
               if (searchQuery) setSearchQuery('');
             } else {
               // If open but not focused (clicked away?), focus it
               searchInput?.focus();
             }
          } else {
            // Open it (autoFocus will handle focus)
            setSearchExpanded(true);
          }
        },
        description: 'Toggle search',
      }
    ]
  });
  
  // Icon mapping for Phosphor Icons
  const iconMap: Record<string, typeof Globe> = {
    'squares-four': SquaresFour,
    'globe': Globe,
    'code': Code,
    'database': Database,
    'notepad': Notepad,
  };
  
  const handleSearchToggle = () => {
    if (searchExpanded && searchQuery) {
      setSearchQuery('');
    }
    setSearchExpanded(!searchExpanded);
  };
  
  // Calculate total items for indexing
  const navItemsCount = NAV_ITEMS.length;
  const searchIndex = navItemsCount;
  const addIndex = navItemsCount + 1;
  const settingsIndex = navItemsCount + 2;
  
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 transition-all duration-300 flex flex-col items-center">
      {/* Search Bar - Above Dock */}
      {searchExpanded && (
        <div 
          className="mb-3 origin-bottom transition-all duration-300 animate-slide-up-scale"
          style={{ width: dockWidth || 'auto' }}
        >
          <div className="w-full bg-surface/95 border border-white/10 rounded-3xl transition-all shadow-xl group focus-within:shadow-[0_0_0_2px_rgba(99,102,241,0.6)]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => {
                if (!searchQuery.trim()) {
                  setSearchExpanded(false);
                }
              }}
              placeholder="Search credentials..."
              autoFocus
              className="w-full bg-transparent border-none outline-none focus:outline-none focus-visible:!outline-none px-5 py-4 text-sm text-main placeholder-muted"
            />
          </div>
        </div>
      )}
      
      <div ref={dockRef} className="dock-glass rounded-3xl shadow-2xl px-4 py-4">
        <div className="flex items-center gap-3">
          {/* Navigation Items */}
          {NAV_ITEMS.map((item, idx) => {
            const isActive = currentFilter === item.id;
            const count = getCount(item.id);
            const Icon = iconMap[item.icon] || SquaresFour;
            
            return (
              <DockIcon
                key={item.id}
                index={idx}
                hoveredIndex={hoveredIndex}
                isActive={isActive}
                count={count}
                Icon={Icon}
                label={item.label}
                onClick={() => setFilter(item.id)}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                showShortcut={idx < 5}
                shortcutKey={idx < 5 ? `${idx + 1}` : undefined}
                size={dockSize}
              />
            );
          })}
          
          {/* Divider */}
          <div className="h-12 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent mx-1 self-center" />
          
          {/* Search Button */}
          <ActionButton
            index={searchIndex}
            hoveredIndex={hoveredIndex}
            Icon={MagnifyingGlass}
            label="Search"
            onClick={handleSearchToggle}
            onMouseEnter={() => setHoveredIndex(searchIndex)}
            onMouseLeave={() => setHoveredIndex(null)}
            variant="secondary"
            isActive={searchExpanded || !!searchQuery}
            shortcutKey={mac ? '⌘K' : 'Ctrl+K'}
            itemSize={dockSize}
          />
          
          {/* Add Button */}
          <ActionButton
            index={addIndex}
            hoveredIndex={hoveredIndex}
            Icon={Plus}
            label="New Item"
            onClick={openAddModal}
            onMouseEnter={() => setHoveredIndex(addIndex)}
            onMouseLeave={() => setHoveredIndex(null)}
            variant="primary"
            shortcutKey={mac ? '⌘I' : 'Ctrl+I'}
            subtitle="Add credential"
            size="large"
            itemSize={dockSize}
          />
          
          {/* Divider */}
          <div className="h-12 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent mx-1 self-center" />
          
          {/* Settings Button */}
          <ActionButton
            index={settingsIndex}
            hoveredIndex={hoveredIndex}
            Icon={Gear}
            label="Settings"
            onClick={openSettings}
            onMouseEnter={() => setHoveredIndex(settingsIndex)}
            onMouseLeave={() => setHoveredIndex(null)}
            variant="secondary"
            shortcutKey={mac ? '⌘,' : 'Ctrl+,'}
            itemSize={dockSize}
          />
        </div>
      </div>
    </div>
  );
}
