import type { StateStorage } from 'zustand/middleware';
import { encryptData, decryptData, getMasterKey } from './crypto';
import { debounce } from './debounce';

const FILE_NAME = 'locket_data.enc';
const DEBOUNCE_DELAY = 500; // ms - balance between data safety and performance

// Detect if running in Tauri environment (v2 uses __TAURI_INTERNALS__)
const isTauri = typeof window !== 'undefined' && 
  (('__TAURI_INTERNALS__' in window) || ('__TAURI__' in window));

// Lazy imports for Tauri modules (only when available)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let BaseDirectory: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let exists: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let readTextFile: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let writeTextFile: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mkdir: any;

let initPromise: Promise<void> | null = null;

// Initialize Tauri modules once
const initTauriModules = () => {
  if (!isTauri) return Promise.resolve();
  if (initPromise) return initPromise;

  initPromise = import('@tauri-apps/plugin-fs').then(module => {
    BaseDirectory = module.BaseDirectory;
    exists = module.exists;
    readTextFile = module.readTextFile;
    writeTextFile = module.writeTextFile;
    mkdir = module.mkdir;
  }).catch(err => {
    console.error('Failed to load Tauri FS plugin:', err);
  });
  
  return initPromise;
};

// Start initialization immediately
if (isTauri) {
  initTauriModules();
}

interface EncryptedFileContent {
  iv: number[];
  content: number[];
  timestamp: number;
}

/**
 * Internal function that performs the actual write operation
 * Works in both Tauri and browser environments
 */
async function writeEncryptedFile(_name: string, value: string): Promise<void> {
  try {
    // Ensure modules are loaded
    await initTauriModules();
    
    const key = await getMasterKey();
    const encrypted = await encryptData(value, key);
    
    const fileData: EncryptedFileContent = {
      iv: encrypted.iv,
      content: encrypted.content,
      timestamp: Date.now(),
    };
    
    const jsonStr = JSON.stringify(fileData);

    if (isTauri && BaseDirectory) {
      // Tauri: Use file system
      try {
        await mkdir('store', { baseDir: BaseDirectory.AppData, recursive: true });
      } catch {
        // Ignore if directory creation fails (might be permission or already exists)
        // But likely it's fine
      }
      
      await writeTextFile('store/' + FILE_NAME, jsonStr, { 
        baseDir: BaseDirectory.AppData 
      });
    } else {
      // Browser: Use localStorage as fallback
      localStorage.setItem('locket_encrypted_storage', jsonStr);
    }
    
  } catch (error) {
    console.error('Failed to save encrypted data:', error);
  }
}

/**
 * Debounced version of the write function
 * Batches multiple rapid state changes into a single write operation
 */
const debouncedWrite = debounce(writeEncryptedFile, DEBOUNCE_DELAY);

/**
 * Storage implementation with debounced writes for performance
 */
export const encryptedStorage: StateStorage = {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getItem: async (_name: string): Promise<string | null> => {
    try {
      // Ensure modules are loaded before reading
      await initTauriModules();
      
      let fileContent: string;

      if (isTauri && BaseDirectory) {
        // Tauri: Use file system
        const fileExists = await exists('store/' + FILE_NAME, { baseDir: BaseDirectory.AppData });
        
        if (!fileExists) {
          return null;
        }

        fileContent = await readTextFile('store/' + FILE_NAME, { baseDir: BaseDirectory.AppData });
      } else {
        // Browser: Use localStorage as fallback
        const stored = localStorage.getItem('locket_encrypted_storage');
        if (!stored) {
          return null;
        }
        fileContent = stored;
      }

      const encryptedData: EncryptedFileContent = JSON.parse(fileContent);

      // Get key and decrypt
      const key = await getMasterKey();
      const decrypted = await decryptData(
        encryptedData.iv,
        encryptedData.content,
        key
      );

      return decrypted;
    } catch (error) {
      console.error('Failed to load encrypted data:', error);
      return null;
    }
  },

  setItem: async (_name: string, value: string): Promise<void> => {
    // Use debounced write to batch multiple rapid updates
    // Note: name parameter is ignored as we use a single file for all storage
    debouncedWrite(_name, value);
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeItem: async (_name: string): Promise<void> => {
    // We strictly probably shouldn't delete the whole file for one key if we shared it,
    // but here the store is monolithic.
    console.warn('removeItem called but not fully implemented for single key deletion in file mode');
  },
};
