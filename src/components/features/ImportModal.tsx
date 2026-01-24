import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { 
  X, 
  FileArrowUp, 
  CheckCircle, 
  WarningCircle,
  ArrowRight,
  ArrowLeft,
} from '@phosphor-icons/react';
import { useUIStore } from '../../store/uiStore';
import { useCredentialStore } from '../../store/credentialStore';
import { ImportInstructions } from './ImportInstructions';
import { parseCSV, type BrowserFormat } from '../../utils/csvParser';
import { findDuplicates, applyDuplicateStrategy, getCredentialsToRemove, type DuplicateStrategy, type DuplicateMatch } from '../../utils/duplicateDetection';
import type { LoginCredential } from '../../types/credential.types';
import type { ParseError } from '../../utils/csvParser';
import { open } from '@tauri-apps/plugin-dialog';
import { readTextFile } from '@tauri-apps/plugin-fs';
import clsx from 'clsx';

type ImportStep = 'instructions' | 'preview' | 'importing' | 'complete';

export function ImportModal() {
  const isImportOpen = useUIStore((state) => state.isImportOpen);
  const closeImport = useUIStore((state) => state.closeImport);
  const credentials = useCredentialStore((state) => state.credentials);
  const importCredentials = useCredentialStore((state) => state.importCredentials);
  
  const [step, setStep] = useState<ImportStep>('instructions');
  const [parsedData, setParsedData] = useState<LoginCredential[]>([]);
  const [duplicates, setDuplicates] = useState<DuplicateMatch[]>([]);
  const [errors, setErrors] = useState<ParseError[]>([]);
  const [detectedFormat, setDetectedFormat] = useState<BrowserFormat>('unknown');
  const [duplicateStrategy, setDuplicateStrategy] = useState<DuplicateStrategy>('skip');
  const [importCount, setImportCount] = useState(0);
  
  const handleFileSelect = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [{
          name: 'CSV',
          extensions: ['csv']
        }]
      });
      
      if (!selected || typeof selected !== 'string') {
        return;
      }
      
      // Read file content
      const content = await readTextFile(selected);
      
      // Parse CSV
      const result = parseCSV(content);
      
      if (!result.success && result.credentials.length === 0) {
        setErrors(result.errors);
        return;
      }
      
      setParsedData(result.credentials);
      setErrors(result.errors);
      setDetectedFormat(result.detectedFormat);
      
      // Find duplicates
      const dupes = findDuplicates(result.credentials, credentials);
      setDuplicates(dupes);
      
      setStep('preview');
    } catch (error) {
      setErrors([{ row: 0, message: error instanceof Error ? error.message : 'Failed to read file' }]);
    }
  };
  
  const handleImport = () => {
    setStep('importing');
    
    // Apply duplicate strategy
    const toImport = applyDuplicateStrategy(parsedData, duplicates, duplicateStrategy);
    
    // If replacing, get IDs to remove
    const toRemove = duplicateStrategy === 'replace' ? getCredentialsToRemove(duplicates) : [];
    
    // Import credentials
    importCredentials(toImport, toRemove);
    
    setImportCount(toImport.length);
    setStep('complete');
  };
  
  const handleClose = () => {
    // Reset state
    setStep('instructions');
    setParsedData([]);
    setDuplicates([]);
    setErrors([]);
    setDetectedFormat('unknown');
    setDuplicateStrategy('skip');
    setImportCount(0);
    closeImport();
  };
  
  return (
    <Transition appear show={isImportOpen} as={Fragment}>
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-surface border border-border shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
                  <Dialog.Title className="text-xl font-bold text-main flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex items-center justify-center">
                      <FileArrowUp size={24} weight="bold" className="text-primary" />
                    </div>
                    Import Passwords
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
                  {step === 'instructions' && (
                    <div className="space-y-6">
                      <ImportInstructions />
                      
                      <div className="flex justify-end gap-3 pt-4">
                        <button
                          onClick={handleClose}
                          className="px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-main hover:bg-surfaceHighlight/50 transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleFileSelect}
                          className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-all flex items-center gap-2"
                        >
                          Choose CSV File
                          <ArrowRight size={16} weight="bold" />
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 'preview' && (
                    <div className="space-y-4">
                      {/* Summary */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg bg-surfaceHighlight/30 border border-border/30">
                          <p className="text-xs text-dim mb-1">Total Found</p>
                          <p className="text-2xl font-bold text-main">{parsedData.length}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                          <p className="text-xs text-green-700 dark:text-green-300 mb-1">New</p>
                          <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                            {parsedData.length - duplicates.length}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                          <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-1">Duplicates</p>
                          <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
                            {duplicates.length}
                          </p>
                        </div>
                      </div>

                      {/* Format Detection */}
                      <div className="p-3 rounded-lg bg-surfaceHighlight/30 border border-border/30">
                        <p className="text-xs text-dim">
                          <strong className="text-main">Detected format:</strong>{' '}
                          <span className="capitalize">{detectedFormat}</span>
                        </p>
                      </div>

                      {/* Duplicate Strategy */}
                      {duplicates.length > 0 && (
                        <div className="p-4 rounded-lg bg-surfaceHighlight/30 border border-border/30 space-y-3">
                          <h4 className="text-sm font-medium text-main">Handle Duplicates</h4>
                          <div className="space-y-2">
                            {(['skip', 'replace', 'keep-both'] as const).map((strategy) => (
                              <label
                                key={strategy}
                                className={clsx(
                                  'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                                  duplicateStrategy === strategy
                                    ? 'bg-primary/10 border-primary'
                                    : 'bg-surface border-border/50 hover:border-dim'
                                )}
                              >
                                <input
                                  type="radio"
                                  name="duplicate-strategy"
                                  value={strategy}
                                  checked={duplicateStrategy === strategy}
                                  onChange={() => setDuplicateStrategy(strategy)}
                                  className="mt-0.5 accent-primary"
                                />
                                <div>
                                  <p className="text-sm font-medium text-main capitalize">
                                    {strategy.replace('-', ' ')}
                                  </p>
                                  <p className="text-xs text-dim mt-0.5">
                                    {strategy === 'skip' && 'Skip importing duplicate passwords (recommended)'}
                                    {strategy === 'replace' && 'Replace existing passwords with imported ones'}
                                    {strategy === 'keep-both' && 'Keep both existing and imported passwords'}
                                  </p>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Errors */}
                      {errors.length > 0 && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                          <div className="flex items-start gap-2">
                            <WarningCircle size={18} className="text-red-600 dark:text-red-400 mt-0.5" weight="bold" />
                            <div>
                              <p className="text-xs font-medium text-red-800 dark:text-red-300">
                                {errors.length} error{errors.length > 1 ? 's' : ''} during parsing
                              </p>
                              <div className="mt-1 space-y-0.5">
                                {errors.slice(0, 3).map((err, idx) => (
                                  <p key={idx} className="text-xs text-red-700/80 dark:text-red-200/80">
                                    Row {err.row}: {err.message}
                                  </p>
                                ))}
                                {errors.length > 3 && (
                                  <p className="text-xs text-red-700/80 dark:text-red-200/80">
                                    ...and {errors.length - 3} more
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex justify-between gap-3 pt-4">
                        <button
                          onClick={() => setStep('instructions')}
                          className="px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-main hover:bg-surfaceHighlight/50 transition-all flex items-center gap-2"
                        >
                          <ArrowLeft size={16} weight="bold" />
                          Back
                        </button>
                        <button
                          onClick={handleImport}
                          disabled={parsedData.length === 0}
                          className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Import {parsedData.length - (duplicateStrategy === 'skip' ? duplicates.length : 0)} Password{parsedData.length !== 1 ? 's' : ''}
                          <ArrowRight size={16} weight="bold" />
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 'importing' && (
                    <div className="py-12 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                      <p className="text-sm text-main font-medium">Importing passwords...</p>
                    </div>
                  )}

                  {step === 'complete' && (
                    <div className="py-12 text-center space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-2">
                        <CheckCircle size={40} weight="fill" className="text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-main mb-2">Import Complete!</h3>
                        <p className="text-sm text-muted">
                          Successfully imported {importCount} password{importCount !== 1 ? 's' : ''}
                        </p>
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
