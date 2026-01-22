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
            <h2 className="text-2xl font-bold text-white">Keyboard Shortcuts</h2>
            <p className="text-sm text-zinc-400 mt-1">Master these shortcuts to boost your productivity</p>
          </div>
          <button
            onClick={closeShortcuts}
            className="w-10 h-10 rounded-xl bg-zinc-800/60 hover:bg-zinc-700/70 text-zinc-400 hover:text-white transition-all duration-200 flex items-center justify-center"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Shortcuts Grid */}
        <div className="space-y-6">
          {categories.map((category, idx) => (
            <div key={idx}>
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                {category.title}
              </h3>
              <div className="space-y-2">
                {category.shortcuts.map((shortcut, sidx) => (
                  <div
                    key={sidx}
                    className="flex items-center justify-between py-3 px-4 rounded-xl bg-zinc-800/40 hover:bg-zinc-800/60 transition-colors"
                  >
                    <span className="text-zinc-200 text-sm">{shortcut.description}</span>
                    <kbd className="flex items-center gap-1 px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs font-mono text-zinc-300 shadow-sm">
                      {shortcut.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-6 border-t border-zinc-800">
          <p className="text-xs text-zinc-500 text-center">
            Press <kbd className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-zinc-400">Esc</kbd> to close this dialog
          </p>
        </div>
      </div>
    </Modal>
  );
}
