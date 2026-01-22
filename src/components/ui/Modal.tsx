import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from '@phosphor-icons/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, subtitle, children }: ModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal panel */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="transition duration-500 cubic-bezier(0.16, 1, 0.3, 1)"
              enterFrom="opacity-0 scale-95 translate-y-8"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="transition duration-200 ease-in"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-surface border border-border w-full max-w-xl rounded-2xl shadow-2xl ring-1 ring-white/10 flex flex-col max-h-[85vh] overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-surfaceHighlight/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                      <span className="text-zinc-400 text-lg">+</span>
                    </div>
                    <div>
                      <Dialog.Title className="text-base font-semibold text-white">
                        {title}
                      </Dialog.Title>
                      {subtitle && (
                        <p className="text-xs text-zinc-500">{subtitle}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-zinc-500 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/5"
                  >
                    <X size={20} weight="bold" />
                  </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
