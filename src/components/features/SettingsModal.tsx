import { Dialog, Transition, Tab } from '@headlessui/react';
import { Fragment } from 'react';
import { X, ShieldCheck, Lock, Palette, Info } from '@phosphor-icons/react';
import { useUIStore } from '../../store/uiStore';
import clsx from 'clsx';

export function SettingsModal() {
  const isSettingsOpen = useUIStore((state) => state.isSettingsOpen);
  const closeSettings = useUIStore((state) => state.closeSettings);
  const dockSize = useUIStore((state) => state.dockSize);
  const setDockSize = useUIStore((state) => state.setDockSize);
  
  const tabs = [
    { name: 'General', icon: Info },
    { name: 'Security', icon: Lock },
    { name: 'Appearance', icon: Palette },
    { name: 'About', icon: ShieldCheck },
  ];
  
  return (
    <Transition appear show={isSettingsOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeSettings}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-surface border border-border shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
                  <Dialog.Title className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                      <ShieldCheck size={18} weight="bold" className="text-white" />
                    </div>
                    Settings
                  </Dialog.Title>
                  <button
                    onClick={closeSettings}
                    className="p-2 rounded-lg hover:bg-surfaceHighlight/50 transition-colors text-zinc-400 hover:text-white"
                  >
                    <X size={20} weight="bold" />
                  </button>
                </div>

                {/* Tab Navigation */}
                <Tab.Group>
                  <div className="border-b border-border/50">
                    <Tab.List className="flex gap-1 px-6">
                      {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <Tab
                            key={tab.name}
                            className={({ selected }) =>
                              clsx(
                                'px-4 py-3 text-sm font-medium transition-all outline-none flex items-center gap-2',
                                selected
                                  ? 'text-white border-b-2 border-primary'
                                  : 'text-zinc-400 hover:text-zinc-200'
                              )
                            }
                          >
                            {({ selected }) => (
                              <>
                                <Icon size={16} weight={selected ? 'fill' : 'regular'} />
                                {tab.name}
                              </>
                            )}
                          </Tab>
                        );
                      })}
                    </Tab.List>
                  </div>

                  {/* Tab Panels */}
                  <Tab.Panels className="p-6">
                    {/* General */}
                    <Tab.Panel className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
                        <div className="space-y-3">
                          <div className="p-4 rounded-lg bg-surfaceHighlight/30 border border-border/30">
                            <p className="text-sm text-zinc-300">
                              Configure general application preferences and behavior.
                            </p>
                          </div>
                          <div className="text-xs text-zinc-500 italic">
                            Coming soon: Language preferences, default view, auto-lock timer
                          </div>
                        </div>
                      </div>
                    </Tab.Panel>

                    {/* Security */}
                    <Tab.Panel className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
                        <div className="space-y-3">
                          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                            <div className="flex items-start gap-3">
                              <Lock size={20} className="text-yellow-400 mt-0.5" weight="bold" />
                              <div>
                                <p className="text-sm font-medium text-yellow-300 mb-1">
                                  Security Notice
                                </p>
                                <p className="text-xs text-yellow-200/80">
                                  This application stores credentials in unencrypted LocalStorage. 
                                  For production use, implement encryption at rest and a master password.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-zinc-500 italic">
                            Coming soon: Master password, encryption, session timeout, 2FA
                          </div>
                        </div>
                      </div>
                    </Tab.Panel>

                    {/* Appearance */}
                    <Tab.Panel className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Appearance Settings</h3>
                        <div className="space-y-3">
                          <div className="p-4 rounded-lg bg-surfaceHighlight/30 border border-border/30">
                            <p className="text-sm text-zinc-300 mb-2">
                              Current theme: <span className="font-semibold text-white">Dark Mode</span>
                            </p>
                            <p className="text-xs text-zinc-400">
                              Glassmorphism effects and modern design enabled
                            </p>
                          </div>
                          <div className="text-xs text-zinc-500 italic">
                            Coming soon: Theme customization, accent colors, density options
                          </div>

                          {/* Dock Size Slider */}
                          <div className="p-4 rounded-lg bg-surfaceHighlight/30 border border-border/30">
                            <div className="flex items-center justify-between mb-2">
                              <label htmlFor="dock-size" className="text-sm font-medium text-white">
                                Dock Size
                              </label>
                              <span className="text-xs text-zinc-400">{dockSize}px</span>
                            </div>
                            <input
                              type="range"
                              id="dock-size"
                              min="30"
                              max="100"
                              value={dockSize}
                              onChange={(e) => setDockSize(Number(e.target.value))}
                              className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between mt-1">
                              <span className="text-[10px] text-zinc-500">Small</span>
                              <span className="text-[10px] text-zinc-500">Large</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab.Panel>

                    {/* About */}
                    <Tab.Panel className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">About Locket</h3>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
                              <ShieldCheck size={32} weight="bold" className="text-white" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-white">Locket</h4>
                              <p className="text-sm text-zinc-400">Developer Edition v1.0.0</p>
                            </div>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-surfaceHighlight/30 border border-border/30 space-y-2">
                            <p className="text-xs text-zinc-300">
                              <strong className="text-white">Built with:</strong> React 18, TypeScript, TailwindCSS, Zustand
                            </p>
                            <p className="text-xs text-zinc-300">
                              <strong className="text-white">Features:</strong> Multi-type credentials, Real-time search, Password generator
                            </p>
                            <p className="text-xs text-zinc-300">
                              <strong className="text-white">License:</strong> MIT
                            </p>
                          </div>
                          
                          <div className="text-xs text-zinc-500 text-center pt-2">
                            Built with ❤️ using modern web technologies
                          </div>
                        </div>
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
