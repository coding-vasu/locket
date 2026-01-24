import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { 
  X, 
  Download, 
  CheckCircle, 
  Warning,
  GoogleChromeLogo,
  Globe,
  AppleLogo,
} from '@phosphor-icons/react';
import { useUIStore } from '../../store/uiStore';
import { useCredentialStore } from '../../store/credentialStore';
import { exportToCSV, generateExportFilename } from '../../utils/csvExporter';
import type { BrowserFormat } from '../../utils/csvParser';
import { save } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import clsx from 'clsx';

type ExportStep = 'select' | 'exporting' | 'complete';

const formatOptions = [
  {
    format: 'chrome' as BrowserFormat,
    name: 'Chrome / Edge',
    icon: GoogleChromeLogo,
    color: 'text-[#4285F4]',
    description: 'Compatible with Google Chrome and Microsoft Edge',
  },
  {
    format: 'firefox' as BrowserFormat,
    name: 'Firefox',
    icon: Globe,
    color: 'text-[#FF7139]',
    description: 'Compatible with Mozilla Firefox',
  },
  {
    format: 'safari' as BrowserFormat,
    name: 'Safari',
    icon: AppleLogo,
    color: 'text-[#007AFF]',
    description: 'Compatible with Safari (macOS)',
  },
];

export function ExportModal() {
  const isExportOpen = useUIStore((state) => state.isExportOpen);
  const closeExport = useUIStore((state) => state.closeExport);
  const credentials = useCredentialStore((state) => state.credentials);
  
  const [step, setStep] = useState<ExportStep>('select');
  const [selectedFormat, setSelectedFormat] = useState<BrowserFormat>('chrome');
  const [acknowledged, setAcknowledged] = useState(false);
  const [exportedPath, setExportedPath] = useState('');
  
  // Filter to only login credentials
  const loginCredentials = credentials.filter(cred => cred.type === 'login');
  
  const handleExport = async () => {
    if (!acknowledged) return;
    
    try {
      setStep('exporting');
      
      // Open save dialog
      const filename = generateExportFilename(selectedFormat);
      const filePath = await save({
        defaultPath: filename,
        filters: [{
          name: 'CSV',
          extensions: ['csv']
        }]
      });
      
      if (!filePath) {
        setStep('select');
        return;
      }
      
      // Generate CSV content
      const csvContent = exportToCSV(loginCredentials, selectedFormat);
      
      // Write file
      await writeTextFile(filePath, csvContent);
      
      setExportedPath(filePath);
      setStep('complete');
    } catch (error) {
      console.error('Export error:', error);
      setStep('select');
    }
  };
  
  const handleClose = () => {
    setStep('select');
    setSelectedFormat('chrome');
    setAcknowledged(false);
    setExportedPath('');
    closeExport();
  };
  
  return (
    <Transition appear show={isExportOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-surface border border-border shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
                  <Dialog.Title className="text-xl font-bold text-main flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/10 border border-green-500/30 flex items-center justify-center">
                      <Download size={24} weight="bold" className="text-green-600 dark:text-green-400" />
                    </div>
                    Export Passwords
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-lg hover:bg-surfaceHighlight/50 transition-colors text-muted hover:text-main"
                  >
                    <X size={20} weight="bold" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {step === 'select' && (
                    <div className="space-y-4">
                      {/* Credential Count */}
                      <div className="p-4 rounded-lg bg-surfaceHighlight/30 border border-border/30">
                        <p className="text-sm text-main">
                          <strong>{loginCredentials.length}</strong> login password{loginCredentials.length !== 1 ? 's' : ''} will be exported
                        </p>
                        <p className="text-xs text-dim mt-1">
                          (API keys, databases, and notes are not included)
                        </p>
                      </div>

                      {/* Format Selection */}
                      <div>
                        <h3 className="text-sm font-medium text-main mb-3">Select Browser Format</h3>
                        <div className="space-y-2">
                          {formatOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                              <label
                                key={option.format}
                                className={clsx(
                                  'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                                  selectedFormat === option.format
                                    ? 'bg-primary/10 border-primary'
                                    : 'bg-surface border-border/50 hover:border-dim'
                                )}
                              >
                                <input
                                  type="radio"
                                  name="export-format"
                                  value={option.format}
                                  checked={selectedFormat === option.format}
                                  onChange={() => setSelectedFormat(option.format)}
                                  className="mt-0.5 accent-primary"
                                />
                                <Icon size={20} className={option.color} weight="fill" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-main">
                                    {option.name}
                                  </p>
                                  <p className="text-xs text-dim mt-0.5">
                                    {option.description}
                                  </p>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Security Warning */}
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        <div className="flex items-start gap-2">
                          <Warning size={18} className="text-red-600 dark:text-red-400 mt-0.5 shrink-0" weight="bold" />
                          <div className="flex-1">
                            <p className="text-xs font-medium text-red-800 dark:text-red-300 mb-1">
                              Security Warning
                            </p>
                            <p className="text-xs text-red-700/80 dark:text-red-200/80">
                              The exported CSV file will contain your passwords in <strong>plain text</strong>. 
                              Delete the file immediately after importing to your browser!
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Acknowledgment Checkbox */}
                      <label className="flex items-start gap-3 p-3 rounded-lg bg-surfaceHighlight/30 border border-border/30 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={acknowledged}
                          onChange={(e) => setAcknowledged(e.target.checked)}
                          className="mt-0.5 accent-primary"
                        />
                        <span className="text-xs text-dim">
                          I understand this file contains unencrypted passwords and will delete it after use
                        </span>
                      </label>

                      {/* Actions */}
                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          onClick={handleClose}
                          className="px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-main hover:bg-surfaceHighlight/50 transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleExport}
                          disabled={!acknowledged || loginCredentials.length === 0}
                          className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Download size={16} weight="bold" />
                          Export to CSV
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 'exporting' && (
                    <div className="py-12 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
                      </div>
                      <p className="text-sm text-main font-medium">Exporting passwords...</p>
                    </div>
                  )}

                  {step === 'complete' && (
                    <div className="py-12 text-center space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-2">
                        <CheckCircle size={40} weight="fill" className="text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-main mb-2">Export Complete!</h3>
                        <p className="text-sm text-muted mb-1">
                          {loginCredentials.length} password{loginCredentials.length !== 1 ? 's' : ''} exported successfully
                        </p>
                        <p className="text-xs text-dim mt-2 px-8 break-all">
                          Saved to: {exportedPath}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-left">
                        <p className="text-xs text-yellow-700 dark:text-yellow-300 font-medium mb-1">
                          ⚠️ Remember to:
                        </p>
                        <ul className="text-xs text-yellow-700/80 dark:text-yellow-200/80 space-y-0.5 ml-4">
                          <li>• Import the CSV to your browser immediately</li>
                          <li>• Delete the CSV file after importing</li>
                          <li>• Do not share or email this file</li>
                        </ul>
                      </div>
                      <div className="pt-4">
                        <button
                          onClick={handleClose}
                          className="px-6 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-all"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
