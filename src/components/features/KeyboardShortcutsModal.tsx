import { X } from '@phosphor-icons/react';
import { Modal } from '../ui/Modal';
import { useUIStore } from '../../store/uiStore';
import { isMac } from '../../hooks/useKeyboardShortcuts';

interface ShortcutItem {
  keys: string;
  description: string;
}

interface ShortcutCategory {
  title: string;
  shortcuts: ShortcutItem[];
}

export function KeyboardShortcutsModal() {
  const isOpen = useUIStore((state) => state.isShortcutsOpen);
  const closeShortcuts = useUIStore((state) => state.closeShortcuts);
  const mac = isMac();

  const categories: ShortcutCategory[] = [
    {
      title: 'Navigation',
      shortcuts: [
        { keys: mac ? '⌘1' : 'Ctrl+1', description: 'Show all credentials' },
        { keys: mac ? '⌘2' : 'Ctrl+2', description: 'Show logins' },
        { keys: mac ? '⌘3' : 'Ctrl+3', description: 'Show API keys' },
        { keys: mac ? '⌘4' : 'Ctrl+4', description: 'Show databases' },
        { keys: mac ? '⌘5' : 'Ctrl+5', description: 'Show notes' },
      ],
    },
    {
      title: 'Actions',
      shortcuts: [
        { keys: mac ? '⌘K' : 'Ctrl+K', description: 'Search credentials' },
        { keys: mac ? '⌘N' : 'Ctrl+N', description: 'New credential' },
        { keys: mac ? '⌘,' : 'Ctrl+,', description: 'Open settings' },
        { keys: 'Esc', description: 'Close modal or clear search' },
      ],
    },
    {
      title: 'Help',
      shortcuts: [
        { keys: mac ? '⌘/' : 'Ctrl+/', description: 'Show keyboard shortcuts' },
      ],
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={closeShortcuts} title="">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-main">Keyboard Shortcuts</h2>
            <p className="text-sm text-dim mt-1">Master these shortcuts to boost your productivity</p>
          </div>
          <button
            onClick={closeShortcuts}
            className="w-10 h-10 rounded-xl bg-surfaceHighlight/60 hover:bg-surfaceHighlight text-muted hover:text-main transition-all duration-200 flex items-center justify-center"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Shortcuts Grid */}
        <div className="space-y-6">
          {categories.map((category, idx) => (
            <div key={idx}>
              <h3 className="text-sm font-semibold text-dim uppercase tracking-wider mb-3">
                {category.title}
              </h3>
              <div className="space-y-2">
                {category.shortcuts.map((shortcut, sidx) => (
                  <div
                    key={sidx}
                    className="flex items-center justify-between py-3 px-4 rounded-xl bg-surfaceHighlight/40 hover:bg-surfaceHighlight/60 transition-colors"
                  >
                    <span className="text-main text-sm">{shortcut.description}</span>
                    <kbd className="flex items-center gap-1 px-3 py-1.5 bg-surface border border-border rounded-lg text-xs font-mono text-muted shadow-sm">
                      {shortcut.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-xs text-muted text-center">
            Press <kbd className="px-2 py-0.5 bg-surface border border-border rounded text-dim">Esc</kbd> to close this dialog
          </p>
        </div>
      </div>
    </Modal>
  );
}
