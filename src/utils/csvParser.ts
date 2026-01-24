import type { LoginCredential } from '../types/credential.types';
import { createDateString } from './dateFormatter';

export type BrowserFormat = 'chrome' | 'firefox' | 'safari' | 'edge' | 'unknown';

export interface ParseError {
  row: number;
  field?: string;
  message: string;
}

export interface CSVParseResult {
  success: boolean;
  credentials: LoginCredential[];
  errors: ParseError[];
  detectedFormat: BrowserFormat;
  totalRows: number;
}

interface CSVRow {
  [key: string]: string;
}

/**
 * Main CSV parser with auto-detection of browser format
 */
export function parseCSV(csvContent: string): CSVParseResult {
  const errors: ParseError[] = [];
  const credentials: LoginCredential[] = [];
  
  try {
    // Split into lines and filter empty ones
    const lines = csvContent
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    if (lines.length < 2) {
      return {
        success: false,
        credentials: [],
        errors: [{ row: 0, message: 'CSV file is empty or has no data rows' }],
        detectedFormat: 'unknown',
        totalRows: 0,
      };
    }
    
    // Parse header row
    const headerLine = lines[0];
    const headers = parseCSVLine(headerLine);
    
    // Detect browser format
    const format = detectBrowserFormat(headers);
    
    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const rowNumber = i + 1;
      const line = lines[i];
      
      try {
        const values = parseCSVLine(line);
        
        // Skip if row has no data
        if (values.every(v => !v || v.trim() === '')) {
          continue;
        }
        
        // Create row object
        const row: CSVRow = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        
        // Validate and convert
        const validation = validateRow(row, format);
        if (!validation.valid) {
          errors.push({
            row: rowNumber,
            message: validation.error || 'Invalid row data',
          });
          continue;
        }
        
        const credential = convertToCredential(row, format, rowNumber);
        if (credential) {
          credentials.push(credential);
        }
      } catch (error) {
        errors.push({
          row: rowNumber,
          message: error instanceof Error ? error.message : 'Failed to parse row',
        });
      }
    }
    
    return {
      success: credentials.length > 0,
      credentials,
      errors,
      detectedFormat: format,
      totalRows: lines.length - 1, // Exclude header
    };
  } catch (error) {
    return {
      success: false,
      credentials: [],
      errors: [{ row: 0, message: error instanceof Error ? error.message : 'Failed to parse CSV' }],
      detectedFormat: 'unknown',
      totalRows: 0,
    };
  }
}

/**
 * Parse a single CSV line, handling quoted fields and escaped characters
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add last field
  values.push(current.trim());
  
  return values;
}

/**
 * Detect browser format by analyzing CSV headers
 */
export function detectBrowserFormat(headers: string[]): BrowserFormat {
  const headerStr = headers.map(h => h.toLowerCase()).join(',');
  
  // Chrome/Edge: name,url,username,password or url,username,password,note
  if (
    (headerStr.includes('name') && headerStr.includes('url') && headerStr.includes('username') && headerStr.includes('password')) ||
    (headerStr.includes('url') && headerStr.includes('username') && headerStr.includes('password') && headerStr.includes('note'))
  ) {
    return 'chrome';
  }
  
  // Firefox: Contains guid, timeCreated, httpRealm
  if (headerStr.includes('guid') && headerStr.includes('timecreated') && headerStr.includes('httprealm')) {
    return 'firefox';
  }
  
  // Safari: Title,URL,Username,Password,Notes,OTPAuth
  if (headerStr.includes('title') && headerStr.includes('otpauth')) {
    return 'safari';
  }
  
  // Edge uses same format as Chrome
  if (headerStr.includes('url') && headerStr.includes('username') && headerStr.includes('password')) {
    return 'edge';
  }
  
  return 'unknown';
}

/**
 * Validate a CSV row has required fields
 */
function validateRow(row: CSVRow, format: BrowserFormat): { valid: boolean; error?: string } {
  // Get URL field based on format
  let url = '';
  let username = '';
  let password = '';
  
  switch (format) {
    case 'chrome':
    case 'edge':
      url = row['url'] || row['URL'] || '';
      username = row['username'] || row['Username'] || '';
      password = row['password'] || row['Password'] || '';
      break;
    case 'firefox':
      url = row['url'] || '';
      username = row['username'] || '';
      password = row['password'] || '';
      break;
    case 'safari':
      url = row['URL'] || '';
      username = row['Username'] || '';
      password = row['Password'] || '';
      break;
    default:
      // Try common field names
      url = row['url'] || row['URL'] || '';
      username = row['username'] || row['Username'] || '';
      password = row['password'] || row['Password'] || '';
  }
  
  // URL is required
  if (!url || url.trim() === '') {
    return { valid: false, error: 'Missing URL' };
  }
  
  // Either username or password should exist
  if ((!username || username.trim() === '') && (!password || password.trim() === '')) {
    return { valid: false, error: 'Missing both username and password' };
  }
  
  return { valid: true };
}

/**
 * Convert CSV row to LoginCredential format
 */
function convertToCredential(row: CSVRow, format: BrowserFormat, rowNumber: number): LoginCredential | null {
  try {
    let url = '';
    let username = '';
    let password = '';
    let title = '';
    
    switch (format) {
      case 'chrome':
      case 'edge':
        url = row['url'] || row['URL'] || '';
        username = row['username'] || row['Username'] || '';
        password = row['password'] || row['Password'] || '';
        title = row['name'] || row['Name'] || extractDomainFromUrl(url);
        break;
      case 'firefox':
        url = row['url'] || '';
        username = row['username'] || '';
        password = row['password'] || '';
        title = extractDomainFromUrl(url);
        break;
      case 'safari':
        url = row['URL'] || '';
        username = row['Username'] || '';
        password = row['Password'] || '';
        title = row['Title'] || extractDomainFromUrl(url);
        break;
      default:
        url = row['url'] || row['URL'] || '';
        username = row['username'] || row['Username'] || '';
        password = row['password'] || row['Password'] || '';
        title = row['name'] || row['Name'] || row['Title'] || extractDomainFromUrl(url);
    }
    
    return {
      id: Date.now() + rowNumber, // Temporary ID, will be regenerated on import
      type: 'login',
      title: title,
      subtitle: username || 'No username',
      date: createDateString(),
      url: normalizeUrl(url),
      username: username || '',
      password: password || '',
    };
  } catch (error) {
    return null;
  }
}

/**
 * Extract domain from URL for title
 */
function extractDomainFromUrl(url: string): string {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url.split('/')[0] || 'Unknown';
  }
}

/**
 * Normalize URL for consistency
 */
export function normalizeUrl(url: string): string {
  try {
    // Add protocol if missing
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    const urlObj = new URL(fullUrl);
    
    // Return protocol + hostname (remove trailing slash, query params)
    return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname === '/' ? '' : urlObj.pathname}`;
  } catch {
    return url;
  }
}
