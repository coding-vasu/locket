
// Helper to convert strings to buffers
const str2buf = (str: string) => new TextEncoder().encode(str);
const buf2str = (buf: ArrayBuffer) => new TextDecoder().decode(buf);

// Key storage key for localStorage (DEV ONLY - Replace with proper key management in prod)
const STORAGE_KEY_ID = 'locket_master_key_v1';

/**
 * Generate a new AES-GCM key
 */
export async function generateKey(): Promise<CryptoKey> {
  return window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Export key to raw format (for storage)
 */
export async function exportKey(key: CryptoKey): Promise<JsonWebKey> {
  return window.crypto.subtle.exportKey('jwk', key);
}

/**
 * Import key from raw format
 */
export async function importKey(jwk: JsonWebKey): Promise<CryptoKey> {
  return window.crypto.subtle.importKey(
    'jwk',
    jwk,
    {
      name: 'AES-GCM',
    },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Get or create the master encryption key
 * PERSISTS TO LOCALSTORAGE FOR NOW
 */
export async function getMasterKey(): Promise<CryptoKey> {
  const storedKey = localStorage.getItem(STORAGE_KEY_ID);
  
  if (storedKey) {
    try {
      const jwk = JSON.parse(storedKey);
      return await importKey(jwk);
    } catch (e) {
      console.error('Failed to load key, generating new one', e);
    }
  }
  
  const newKey = await generateKey();
  const exported = await exportKey(newKey);
  localStorage.setItem(STORAGE_KEY_ID, JSON.stringify(exported));
  return newKey;
}

/**
 * Encrypt data string
 * Returns IV + Ciphertext concatenated as hex string (or similar format)
 * Structure: [IV (12 bytes)][Combined Ciphertext (Data + Tag)]
 */
export async function encryptData(data: string, key: CryptoKey): Promise<{ iv: number[]; content: number[] }> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encodedData = str2buf(data);
  
  const encryptedContent = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encodedData
  );

  return {
    iv: Array.from(iv),
    content: Array.from(new Uint8Array(encryptedContent))
  };
}

/**
 * Decrypt data
 */
export async function decryptData(
  iv: number[],
  content: number[],
  key: CryptoKey
): Promise<string> {
  const ivArray = new Uint8Array(iv);
  const contentArray = new Uint8Array(content);
  
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: ivArray,
    },
    key,
    contentArray
  );
  
  return buf2str(decrypted);
}
