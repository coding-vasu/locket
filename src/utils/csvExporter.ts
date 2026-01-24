import type { LoginCredential } from '../types/credential.types';
import type { BrowserFormat } from './csvParser';

/**
 * Export login credentials to CSV format compatible with browsers
 */
export function exportToCSV(credentials: LoginCredential[], format: BrowserFormat): string {
  switch (format) {
    case 'chrome':
    case 'edge':
      return generateChromeCSV(credentials);
    case 'firefox':
      return generateFirefoxCSV(credentials);
    case 'safari':
      return generateSafariCSV(credentials);
    default:
      return generateChromeCSV(credentials); // Default to Chrome format
  }
}

/**
 * Generate Chrome/Edge compatible CSV
 * Format: name,url,username,password
 */
function generateChromeCSV(credentials: LoginCredential[]): string {
  const header = 'name,url,username,password';
  const rows = credentials.map(cred => {
    const name = escapeCSVValue(cred.title);
    const url = escapeCSVValue(cred.url);
    const username = escapeCSVValue(cred.username);
    const password = escapeCSVValue(cred.password);
    
    return `${name},${url},${username},${password}`;
  });
  
  return [header, ...rows].join('\n');
}

/**
 * Generate Firefox compatible CSV
 * Format: "url","username","password","httpRealm","formActionOrigin","guid","timeCreated","timeLastUsed","timePasswordChanged"
 */
function generateFirefoxCSV(credentials: LoginCredential[]): string {
  const header = '"url","username","password","httpRealm","formActionOrigin","guid","timeCreated","timeLastUsed","timePasswordChanged"';
  const rows = credentials.map(cred => {
    const url = quoteValue(cred.url);
    const username = quoteValue(cred.username);
    const password = quoteValue(cred.password);
    
    // Firefox requires all 9 columns, fill extras with empty quotes
    return `${url},${username},${password},"","","","","",""`;
  });
  
  return [header, ...rows].join('\n');
}

/**
 * Generate Safari compatible CSV
 * Format: Title,URL,Username,Password,Notes,OTPAuth
 */
function generateSafariCSV(credentials: LoginCredential[]): string {
  const header = 'Title,URL,Username,Password,Notes,OTPAuth';
  const rows = credentials.map(cred => {
    const title = escapeCSVValue(cred.title);
    const url = escapeCSVValue(cred.url);
    const username = escapeCSVValue(cred.username);
    const password = escapeCSVValue(cred.password);
    
    // Safari format: leave Notes and OTPAuth empty
    return `${title},${url},${username},${password},,`;
  });
  
  return [header, ...rows].join('\n');
}

/**
 * Escape CSV value (wrap in quotes if needed, escape internal quotes)
 */
function escapeCSVValue(value: string): string {
  if (!value) return '';
  
  // If value contains comma, quote, or newline, wrap in quotes
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    // Escape quotes by doubling them
    const escaped = value.replace(/"/g, '""');
    return `"${escaped}"`;
  }
  
  return value;
}

/**
 * Quote value for Firefox format (always quoted, escape internal quotes)
 */
function quoteValue(value: string): string {
  if (!value) return '""';
  
  // Escape quotes by doubling them
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Generate suggested filename for export
 */
export function generateExportFilename(format: BrowserFormat): string {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return `locket-passwords-${format}-${date}.csv`;
}
