import type { Credential } from '../types/credential.types';

/**
 * Formats a credential into readable text for copying to clipboard
 */
export function formatCredentialAsText(credential: Credential): string {
  const lines: string[] = [];
  
  // Header
  lines.push('═══════════════════════════════════════');
  lines.push(`  ${credential.title.toUpperCase()}`);
  lines.push('═══════════════════════════════════════');
  lines.push('');
  
  // Type-specific formatting
  switch (credential.type) {
    case 'login':
      lines.push('Type:       Login Credential');
      lines.push('');
      if (credential.url) {
        lines.push(`Website:    ${credential.url}`);
      }
      lines.push(`Username:   ${credential.username}`);
      lines.push(`Password:   ${credential.password}`);
      break;
      
    case 'api':
      lines.push('Type:       API Key');
      lines.push('');
      lines.push(`Environment: ${credential.env}`);
      lines.push(`Key Type:    ${credential.keyType}`);
      lines.push('');
      lines.push('Secret Key:');
      lines.push(`  ${credential.secret}`);
      break;
      
    case 'database': {
      lines.push('Type:       Database Credential');
      lines.push('');
      lines.push(`Engine:     ${credential.dbEngine}`);
      lines.push(`Host:       ${credential.dbHost}`);
      lines.push(`Port:       ${credential.dbPort}`);
      lines.push(`Database:   ${credential.dbName}`);
      lines.push(`Username:   ${credential.dbUser}`);
      lines.push(`Password:   ${credential.dbPass}`);
      lines.push('');
      lines.push('Connection String:');
      // Generate connection string based on engine
      const connStr = generateConnectionStringText(credential);
      lines.push(`  ${connStr}`);
      break;
    }
      
    case 'note':
      lines.push('Type:       Secure Note');
      lines.push('');
      lines.push('Content:');
      lines.push('─────────────────────────────────────');
      lines.push(credential.content);
      lines.push('─────────────────────────────────────');
      break;
  }
  
  // Footer
  lines.push('');
  lines.push(`Created:    ${credential.date}`);
  lines.push('═══════════════════════════════════════');
  
  return lines.join('\n');
}

function generateConnectionStringText(credential: Credential): string {
  if (credential.type !== 'database') return '';
  
  const { dbEngine, dbUser, dbPass, dbHost, dbPort, dbName } = credential;
  
  switch (dbEngine) {
    case 'PostgreSQL':
      return `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;
    case 'MySQL':
    case 'MariaDB':
      return `mysql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;
    case 'MongoDB':
      return `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;
    case 'Redis':
      return `redis://${dbUser}:${dbPass}@${dbHost}:${dbPort}`;
    default:
      return `${(dbEngine as string).toLowerCase()}://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;
  }
}
