import { Tab } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  GoogleChromeLogo, 
  Globe, 
  AppleLogo,
  Warning
} from '@phosphor-icons/react';
import clsx from 'clsx';

const browsers = [
  {
    name: 'Chrome',
    icon: GoogleChromeLogo,
    color: 'text-[#4285F4]',
    steps: [
      'Open Chrome and click the three-dot menu (⋮) in the top right',
      'Select "Settings" → "Autofill and passwords" → "Google Password Manager"',
      'Click the settings icon (⚙️) in the top right',
      'Select "Export passwords"',
      'Enter your computer password to confirm',
      'Choose where to save the CSV file',
    ],
  },
  {
    name: 'Firefox',
    icon: Globe,
    color: 'text-[#FF7139]',
    steps: [
      'Open Firefox and click the menu button (≡) in the top right',
      'Select "Passwords"',
      'Click the three-dot menu (⋯) in the top right',
      'Select "Export Logins..."',
      'Click "Export" to confirm',
      'Save the CSV file to your computer',
    ],
  },
  {
    name: 'Edge',
    icon: Globe,
    color: 'text-[#0078D4]',
    steps: [
      'Open Edge and click the three-dot menu (⋯) in the top right',
      'Select "Settings" → "Profiles" → "Passwords"',
      'Click the three-dot menu (⋯) next to "Saved passwords"',
      'Select "Export passwords"',
      'Enter your computer password to confirm',
      'Choose where to save the CSV file',
    ],
  },
  {
    name: 'Safari',
    icon: AppleLogo,
    color: 'text-[#007AFF]',
    steps: [
      'Open Safari on macOS',
      'Click "File" in the menu bar',
      'Select "Export Passwords..."',
      'Enter your Mac password to confirm',
      'Choose where to save the CSV file',
      '(Note: This feature requires macOS Monterey or later)',
    ],
  },
];

export function ImportInstructions() {
  return (
    <div className="space-y-4">
      {/* Security Warning */}
      <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
        <div className="flex items-start gap-2">
          <Warning size={18} className="text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" weight="bold" />
          <div>
            <p className="text-xs font-medium text-yellow-800 dark:text-yellow-300">
              Security Notice
            </p>
            <p className="text-xs text-yellow-700/80 dark:text-yellow-200/80 mt-0.5">
              Exported CSV files contain your passwords in plain text. Delete the file after importing!
            </p>
          </div>
        </div>
      </div>

      {/* Browser Tabs */}
      <Tab.Group>
        <Tab.List className="flex gap-2 p-1 bg-surfaceHighlight/30 rounded-lg border border-border/30">
          {browsers.map((browser) => {
            const Icon = browser.icon;
            return (
              <Tab key={browser.name} as={Fragment}>
                {({ selected }) => (
                  <button
                    className={clsx(
                      'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all outline-none',
                      selected
                        ? 'bg-surface border border-border shadow-sm text-main'
                        : 'text-muted hover:text-main'
                    )}
                  >
                    <Icon size={16} weight={selected ? 'fill' : 'regular'} className={selected ? browser.color : ''} />
                    {browser.name}
                  </button>
                )}
              </Tab>
            );
          })}
        </Tab.List>

        <Tab.Panels className="mt-4">
          {browsers.map((browser) => (
            <Tab.Panel key={browser.name} className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                {(() => {
                  const Icon = browser.icon;
                  return <Icon size={24} className={browser.color} weight="fill" />;
                })()}
                <h4 className="text-sm font-semibold text-main">
                  Export from {browser.name}
                </h4>
              </div>
              
              <ol className="space-y-2">
                {browser.steps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-xs text-dim leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>

      {/* Format Info */}
      <div className="p-3 rounded-lg bg-surfaceHighlight/30 border border-border/30">
        <p className="text-xs text-dim">
          <strong className="text-main">Supported formats:</strong> Chrome, Firefox, Edge, and Safari CSV exports. 
          Locket will automatically detect your browser format.
        </p>
      </div>
    </div>
  );
}
