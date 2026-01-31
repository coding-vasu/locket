import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Warning, X } from '@phosphor-icons/react';

interface ClearDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ClearDataModal({ isOpen, onClose, onConfirm }: ClearDataModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-surface border border-border shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
                  <Dialog.Title className="text-lg font-bold text-main flex items-center gap-2">
                    <Warning size={24} weight="bold" className="text-red-500" />
                    Clear All Data
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-surfaceHighlight/50 transition-colors text-muted hover:text-main"
                  >
                    <X size={20} weight="bold" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-2">
                      ⚠️ Warning: This action cannot be undone!
                    </p>
                    <p className="text-xs text-red-700/80 dark:text-red-200/80">
                      All your saved credentials, settings, and data will be permanently deleted.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-main">
                      This will delete:
                    </p>
                    <ul className="text-xs text-dim space-y-1 list-disc list-inside ml-2">
                      <li>All saved login credentials</li>
                      <li>API keys and database connections</li>
                      <li>Secure notes</li>
                      <li>All encrypted data files</li>
                    </ul>
                  </div>

                  <p className="text-xs text-muted italic">
                    The app will be completely empty after clearing. You can add new credentials anytime.
                  </p>
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 py-4 border-t border-border/50">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-surfaceHighlight border border-border text-main hover:bg-surfaceHighlight/80 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-all"
                  >
                    Clear All Data
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
