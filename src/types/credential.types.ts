// Base credential type
export type CredentialType = 'login' | 'api' | 'database' | 'note';

// Base credential interface
export interface BaseCredential {
  id: number;
  type: CredentialType;
  title: string;
  subtitle: string;
  date: string;
}

// Login credential
export interface LoginCredential extends BaseCredential {
  type: 'login';
  url: string;
  username: string;
  password: string;
}

// API Key credential
export interface ApiKeyCredential extends BaseCredential {
  type: 'api';
  env: 'Production' | 'Staging' | 'Development';
  keyType: string;
  secret: string;
}

// Database credential
export type DatabaseEngine = 'PostgreSQL' | 'MySQL' | 'MongoDB' | 'Redis' | 'MariaDB';

export interface DatabaseCredential extends BaseCredential {
  type: 'database';
  dbEngine: DatabaseEngine;
  dbHost: string;
  dbPort: string;
  dbName: string;
  dbUser: string;
  dbPass: string;
}

// Note credential
export interface NoteCredential extends BaseCredential {
  type: 'note';
  content: string;
}

// Union type for all credentials
export type Credential = 
  | LoginCredential 
  | ApiKeyCredential 
  | DatabaseCredential 
  | NoteCredential;

// Form data type (used for add/edit modal)
export interface CredentialFormData {
  id: number | null;
  type: CredentialType;
  title: string;
  subtitle: string;
  
  // Login fields
  url?: string;
  username?: string;
  password?: string;
  
  // API fields
  env?: 'Production' | 'Staging' | 'Development';
  keyType?: string;
  secret?: string;
  
  // Database fields
  dbEngine?: DatabaseEngine;
  dbHost?: string;
  dbPort?: string;
  dbName?: string;
  dbUser?: string;
  dbPass?: string;
  
  // Note fields
  content?: string;
}

// Filter type
export type FilterType = 'all' | CredentialType;
