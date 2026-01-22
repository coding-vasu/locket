import { useEffect } from 'react';

export type KeyboardShortcut = {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: (event: KeyboardEvent) => void;
  description: string;
  preventDefault?: boolean;
};

interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

/**
 * Custom hook for managing global keyboard shortcuts
 * Handles both Mac (⌘) and Windows/Linux (Ctrl) modifier keys
 */
export function useKeyboardShortcuts({ shortcuts, enabled = true }: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if user is typing in an input field
      const target = event.target as HTMLElement;
      const isInputField = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable;

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        
        // Handle modifiers - simplified logic to avoid conflicts
        // We treat 'ctrl' in the config as "System Modifier" (Cmd on Mac, Ctrl on Win)
        const systemModifierPressed = event.ctrlKey || event.metaKey;
        
        // If shortcut.ctrl is true, we require the system modifier
        // If shortcut.ctrl is false/undefined, we require it NOT to be pressed
        // UNLESS shortcut.meta is explicitly set (though in this app we likely won't use that mix)
        const ctrlMatch = shortcut.ctrl 
          ? systemModifierPressed
          : !systemModifierPressed;
        
        // We ignore explicit 'meta' check if we are using the simple system modifier logic
        // This avoids the bug where checking "not meta" fails when Cmd is pressed
        const metaMatch = true; 
        
        const shiftMatch = shortcut.shift 
          ? event.shiftKey 
          : !event.shiftKey;
        
        const altMatch = shortcut.alt 
          ? event.altKey 
          : !event.altKey;

        // Special handling for Escape key - always allow
        const isEscape = event.key === 'Escape';
        
        if (keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch) {
          // Allow Escape to work even in input fields
          // Also allow shortcuts with modifiers (Cmd/Ctrl/Alt) to work in input fields
          // This ensures global shortcuts like Cmd+N or Cmd+K work everywhere
          const hasModifier = shortcut.ctrl || shortcut.meta || shortcut.alt;
          
          if (!isEscape && isInputField && !hasModifier) {
            continue;
          }

          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }
          
          shortcut.handler(event);
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts, enabled]);
}

/**
 * Utility to detect if user is on Mac
 */
export function isMac(): boolean {
  return typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
}

/**
 * Format keyboard shortcut display based on platform
 */
export function formatShortcut(shortcut: { key: string; ctrl?: boolean; meta?: boolean; shift?: boolean; alt?: boolean }): string {
  const parts: string[] = [];
  const mac = isMac();
  
  if (shortcut.ctrl || shortcut.meta) {
    parts.push(mac ? '⌘' : 'Ctrl');
  }
  
  if (shortcut.shift) {
    parts.push(mac ? '⇧' : 'Shift');
  }
  
  if (shortcut.alt) {
    parts.push(mac ? '⌥' : 'Alt');
  }
  
  // Format key display
  const keyDisplay = shortcut.key === ' ' ? 'Space' : shortcut.key.toUpperCase();
  parts.push(keyDisplay);
  
  return parts.join(mac ? '' : '+');
}
