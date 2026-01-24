import type { Credential, LoginCredential } from '../types/credential.types';
import { normalizeUrl } from './csvParser';

export type DuplicateStrategy = 'skip' | 'replace' | 'keep-both';

export interface DuplicateMatch {
  imported: LoginCredential;
  existing: Credential;
  similarity: number;
}

/**
 * Find duplicates between imported and existing credentials
 */
export function findDuplicates(
  imported: LoginCredential[],
  existing: Credential[]
): DuplicateMatch[] {
  const duplicates: DuplicateMatch[] = [];
  
  // Only check against login credentials
  const existingLogins = existing.filter(
    (cred): cred is LoginCredential => cred.type === 'login'
  );
  
  for (const importedCred of imported) {
    for (const existingCred of existingLogins) {
      const similarity = calculateSimilarity(importedCred, existingCred);
      
      // Consider it a duplicate if similarity > 0.8 (80%)
      if (similarity > 0.8) {
        duplicates.push({
          imported: importedCred,
          existing: existingCred,
          similarity,
        });
        break; // One duplicate per imported credential is enough
      }
    }
  }
  
  return duplicates;
}

/**
 * Calculate similarity between two login credentials
 */
function calculateSimilarity(cred1: LoginCredential, cred2: LoginCredential): number {
  const url1 = normalizeUrl(cred1.url);
  const url2 = normalizeUrl(cred2.url);
  const username1 = cred1.username.toLowerCase();
  const username2 = cred2.username.toLowerCase();
  
  // Exact URL and username match
  if (url1 === url2 && username1 === username2) {
    return 1.0;
  }
  
  // Same URL but different username
  if (url1 === url2) {
    return 0.7;
  }
  
  // Fuzzy URL match (domain similarity) and same username
  const urlSimilarity = calculateUrlSimilarity(url1, url2);
  if (urlSimilarity > 0.8 && username1 === username2) {
    return 0.9;
  }
  
  return 0;
}

/**
 * Calculate URL similarity based on domain
 */
function calculateUrlSimilarity(url1: string, url2: string): number {
  try {
    const domain1 = new URL(url1).hostname.replace('www.', '');
    const domain2 = new URL(url2).hostname.replace('www.', '');
    
    if (domain1 === domain2) {
      return 1.0;
    }
    
    // Check if one domain contains the other (e.g., github.com vs api.github.com)
    if (domain1.includes(domain2) || domain2.includes(domain1)) {
      return 0.85;
    }
    
    return 0;
  } catch {
    // Fallback to string comparison if URL parsing fails
    return url1 === url2 ? 1.0 : 0;
  }
}

/**
 * Apply duplicate strategy to filter credentials
 */
export function applyDuplicateStrategy(
  imported: LoginCredential[],
  duplicates: DuplicateMatch[],
  strategy: DuplicateStrategy
): LoginCredential[] {
  if (strategy === 'keep-both') {
    return imported;
  }
  
  if (strategy === 'skip') {
    // Filter out imported credentials that have duplicates
    const duplicateIds = new Set(duplicates.map(d => d.imported.id));
    return imported.filter(cred => !duplicateIds.has(cred.id));
  }
  
  // For 'replace' strategy, we'll handle replacement in the store
  // Just return all imported credentials
  return imported;
}

/**
 * Get credentials to remove when replacing duplicates
 */
export function getCredentialsToRemove(duplicates: DuplicateMatch[]): number[] {
  return duplicates.map(d => d.existing.id);
}
