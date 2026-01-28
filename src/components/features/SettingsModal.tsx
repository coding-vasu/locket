import { Dialog, Transition, Tab } from '@headlessui/react';
import { Fragment } from 'react';
import { X, ShieldCheck, Lock, Palette, Info, FileArrowUp, Download, Lightning } from '@phosphor-icons/react';
import { useUIStore } from '../../store/uiStore';
import { useCredentialStore } from '../../store/credentialStore';
import { generateLargeTestDataset } from '../../utils/performanceTest';
import clsx from 'clsx';

export function SettingsModal() {
  const isSettingsOpen = useUIStore((state) => state.isSettingsOpen);
  const closeSettings = useUIStore((state) => state.closeSettings);
  const openImport = useUIStore((state) => state.openImport);
  const openExport = useUIStore((state) => state.openExport);
  const dockSize = useUIStore((state) => state.dockSize);
  const setDockSize = useUIStore((state) => state.setDockSize);
  const theme = useUIStore((state) => state.theme);
  const setTheme = useUIStore((state) => state.setTheme);
  const addToast = useUIStore((state) => state.addToast);
  const importCredentials = useCredentialStore((state) => state.importCredentials);
  
  const tabs = [
    { name: 'General', icon: Info },
    { name: 'Security', icon: Lock },
    { name: 'Appearance', icon: Palette },
    { name: 'About', icon: ShieldCheck },
  ];

  const handleLoadTestData = () => {
    const data = generateLargeTestDataset(5000);
    importCredentials(data);
    addToast('Added 5,000 test credentials');
    closeSettings();
  };
  
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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-surface border border-border shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
                  <Dialog.Title className="text-xl font-bold text-main flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-surfaceHighlight to-surface border border-border flex items-center justify-center overflow-hidden shrink-0">
                      <img src="/icon.png" alt="Locket" className="w-full h-full object-cover" />
                    </div>
                    Settings
                  </Dialog.Title>
                  <button
                    onClick={closeSettings}
                    className="p-2 rounded-lg hover:bg-surfaceHighlight/50 transition-colors text-muted hover:text-main"
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
                                  ? 'text-main border-b-2 border-primary'
                                  : 'text-muted hover:text-main'
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
                        <h3 className="text-lg font-semibold text-main mb-4">General Settings</h3>
                        <div className="space-y-3">
                          {/* Import Passwords */}
                          <div className="p-4 rounded-lg bg-surfaceHighlight/30 border border-border/30">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-main mb-1 flex items-center gap-2">
                                  <FileArrowUp size={16} weight="bold" className="text-primary" />
                                  Import Passwords
                                </h4>
                                <p className="text-xs text-dim mb-3">
                                  Import your passwords from Chrome, Firefox, Edge, or Safari using CSV export files.
                                </p>
                                <button
                                  onClick={() => {
                                    closeSettings();
                                    openImport();
                                  }}
                                  className="px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-white hover:bg-primary/90 transition-all"
                                >
                                  Import from CSV
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Export Passwords */}
                          <div className="p-4 rounded-lg bg-surfaceHighlight/30 border border-border/30">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-main mb-1 flex items-center gap-2">
                                  <Download size={16} weight="bold" className="text-green-600 dark:text-green-400" />
                                  Export Passwords
                                </h4>
                                <p className="text-xs text-dim mb-3">
                                  Export your login credentials to browser-compatible CSV format for backup or migration.
                                </p>
                                <button
                                  onClick={() => {
                                    closeSettings();
                                    openExport();
                                  }}
                                  className="px-3 py-1.5 rounded-md text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition-all"
                                >
                                  Export to CSV
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Performance Test */}
                          <div className="p-4 rounded-lg bg-surfaceHighlight/30 border border-border/30">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-main mb-1 flex items-center gap-2">
                                  <Lightning size={16} weight="bold" className="text-amber-500" />
                                  Performance Test
                                </h4>
                                <p className="text-xs text-dim mb-3">
                                  Generate and inject 5,000 random credentials to test the application's rendering performance and infinite scroll.
                                </p>
                                <button
                                  onClick={handleLoadTestData}
                                  className="px-3 py-1.5 rounded-md text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 transition-all"
                                >
                                  Load 5,000 Test Items
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-surfaceHighlight/30 border border-border/30">
                            <p className="text-sm text-dim">
                              Configure general application preferences and behavior.
                            </p>
                          </div>
                          <div className="text-xs text-muted italic">
                            Coming soon: Language preferences, default view, auto-lock timer
                          </div>
                        </div>
                      </div>
                    </Tab.Panel>

                    {/* Security */}
                    <Tab.Panel className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-main mb-4">Security Settings</h3>
                        <div className="space-y-3">
                          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                            <div className="flex items-start gap-3">
                              <ShieldCheck size={20} className="text-green-600 dark:text-green-400 mt-0.5" weight="bold" />
                              <div>
                                <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">
                                  Encryption Active
                                </p>
                                <p className="text-xs text-green-700/80 dark:text-green-200/80">
                                  Your data is secured using AES-GCM encryption and stored locally on your device.
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-surfaceHighlight/30 border border-border/30 space-y-3">
                            <div>
                                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Method</p>
                                <p className="text-sm text-main font-mono">AES-GCM (256-bit)</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Storage Location</p>
                                <p className="text-sm text-main font-mono">~/Library/Application Support/com.locket.app/store/locket_data.enc</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab.Panel>

                    {/* Appearance */}
                    <Tab.Panel className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-main mb-4">Appearance Settings</h3>
                        <div className="space-y-3">
                          <div className="p-4 rounded-lg bg-surfaceHighlight/30 border border-border/30">
                            <p className="text-sm text-muted mb-2">
                              Current theme: <span className="font-semibold text-main capitalize">{theme} Mode</span>
                            </p>
                            <p className="text-xs text-dim">
                              Glassmorphism effects and modern design enabled
                            </p>
                          </div>
                          <div className="text-xs text-muted italic">
                            Coming soon: Accent colors, density options
                          </div>

                          {/* Theme Selector */}
                          <div className="p-4 rounded-lg bg-surfaceHighlight/30 border border-border/30">
                            <h4 className="text-sm font-medium text-main mb-3">Theme</h4>
                            <div className="grid grid-cols-3 gap-2">
                              {(['light', 'dark', 'system'] as const).map((t) => (
                                <button
                                  key={t}
                                  onClick={() => setTheme(t)}
                                  className={clsx(
                                    'px-3 py-2 rounded-md text-sm font-medium transition-all border',
                                    theme === t
                                      ? 'bg-primary text-white border-primary'
                                      : 'bg-surface border-border text-muted hover:text-main hover:border-dim'
                                  )}
                                >
                                  {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Dock Size Slider */}
                          <div className="p-4 rounded-lg bg-surfaceHighlight/30 border border-border/30">
                            <div className="flex items-center justify-between mb-2">
                              <label htmlFor="dock-size" className="text-sm font-medium text-main">
                                Dock Size
                              </label>
                              <span className="text-xs text-muted">{dockSize}px</span>
                            </div>
                            <input
                              type="range"
                              id="dock-size"
                              min="30"
                              max="100"
                              value={dockSize}
                              onChange={(e) => setDockSize(Number(e.target.value))}
                              className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between mt-1">
                              <span className="text-[10px] text-dim">Small</span>
                              <span className="text-[10px] text-dim">Large</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab.Panel>

                    {/* About */}
                    <Tab.Panel className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-main mb-4">About Locket</h3>
                        <div className="space-y-4">
                          <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-surfaceHighlight to-surface border border-border flex items-center justify-center shadow-2xl overflow-hidden shrink-0">
                              <img src="/icon.png" alt="Locket Logo" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-main">Locket</h4>
                              <p className="text-sm text-muted">Developer Edition v1.0.0</p>
                            </div>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-surfaceHighlight/30 border border-border/30 space-y-2">
                            <p className="text-xs text-dim">
                              <strong className="text-main">Built with:</strong> React 18, TypeScript, TailwindCSS, Zustand
                            </p>
                            <p className="text-xs text-dim">
                              <strong className="text-main">Features:</strong> Multi-type credentials, Real-time search, Password generator
                            </p>
                            <p className="text-xs text-dim">
                              <strong className="text-main">License:</strong> MIT
                            </p>
                          </div>
                          
                          <div className="text-xs text-muted text-center pt-2">
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
