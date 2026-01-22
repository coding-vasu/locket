import type { StateStorage } from 'zustand/middleware';
import { BaseDirectory, exists, readTextFile, writeTextFile, mkdir } from '@tauri-apps/plugin-fs';

import { encryptData, decryptData, getMasterKey } from './crypto';

const FILE_NAME = 'locket_data.enc';

interface EncryptedFileContent {
  iv: number[];
  content: number[];
  timestamp: number;
}

export const encryptedStorage: StateStorage = {

  getItem: async (_name: string): Promise<string | null> => {
    try {
      // Check if file exists in AppData directory
      const fileExists = await exists('store/' + FILE_NAME, { baseDir: BaseDirectory.AppData });
      
      if (!fileExists) {
        return null;
      }

      // Read encrypted content
      const fileContent = await readTextFile('store/' + FILE_NAME, { baseDir: BaseDirectory.AppData });
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
    try {
      const key = await getMasterKey();
      const encrypted = await encryptData(value, key);
      
      const fileData: EncryptedFileContent = {
        iv: encrypted.iv,
        content: encrypted.content,
        timestamp: Date.now(),
      };

      // Ensure directory exists
      await mkdir('store', { baseDir: BaseDirectory.AppData, recursive: true });
      
      const jsonStr = JSON.stringify(fileData);
      await writeTextFile('store/' + FILE_NAME, jsonStr, { 
        baseDir: BaseDirectory.AppData 
      });
      
    } catch (error) {
      console.error('Failed to save encrypted data:', error);
    }
  },

  removeItem: async (_name: string): Promise<void> => {
    // We strictly probably shouldn't delete the whole file for one key if we shared it,
    // but here the store is monolithic.
    console.warn('removeItem called but not fully implemented for single key deletion in file mode');
  },
};
