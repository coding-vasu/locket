import type { Credential, LoginCredential, ApiKeyCredential, DatabaseCredential, NoteCredential } from '../types/credential.types';
import { createDateString } from './dateFormatter';

/**
 * Generate a large dataset of test credentials for performance testing
 */
export function generateLargeTestDataset(count: number): Credential[] {
  const credentials: Credential[] = [];
  const types = ['login', 'api', 'database', 'note'] as const;
  
  for (let i = 0; i < count; i++) {
    const type = types[i % types.length];
    const date = createDateString();
    const id = Date.now() + i;
    
    switch (type) {
      case 'login':
        credentials.push({
          id,
          type: 'login',
          title: `Test Login ${i}`,
          subtitle: `user${i}@example.com`,
          username: `user${i}@example.com`,
          password: `password${i}`,
          url: `https://example-${i % 100}.com`,
          date,
        } as LoginCredential);
        break;
        
      case 'api':
        credentials.push({
          id,
          type: 'api',
          title: `Test API Key ${i}`,
          subtitle: i % 2 === 0 ? 'Production' : 'Development',
          keyType: 'Standard API Key',
          secret: `api_key_${i}_${'x'.repeat(32)}`,
          env: i % 2 === 0 ? 'Production' : 'Development',
          date,
        } as ApiKeyCredential);
        break;
        
      case 'database':
        credentials.push({
          id,
          type: 'database',
          title: `Test Database ${i}`,
          subtitle: `dbuser${i}@db-${i % 50}.example.com`,
          dbHost: `db-${i % 50}.example.com`,
          dbPort: '5432',
          dbName: `database_${i}`,
          dbUser: `dbuser${i}`,
          dbPass: `dbpass${i}`,
          dbEngine: 'PostgreSQL',
          date,
        } as DatabaseCredential);
        break;
        
      case 'note':
        credentials.push({
          id,
          type: 'note',
          title: `Test Note ${i}`,
          subtitle: 'Secure Note',
          content: `This is test note ${i} with some content for testing performance.\n`.repeat(3),
          date,
        } as NoteCredential);
        break;
    }
  }
  
  return credentials;
}

/**
 * Benchmark a function's execution time
 */
export function benchmark<T>(fn: () => T, label: string): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`[BENCHMARK] ${label}: ${(end - start).toFixed(2)}ms`);
  return result;
}

/**
 * Test search performance with various query lengths
 */
export function testSearchPerformance(credentials: Credential[], queries: string[]) {
  console.log('\n=== Search Performance Test ===');
  
  queries.forEach(query => {
    const q = query.toLowerCase();
    benchmark(() => {
      return credentials.filter(cred => {
        const titleMatch = cred.title.toLowerCase().includes(q);
        const subtitleMatch = cred.subtitle.toLowerCase().includes(q);
        let extraMatch = false;
        if (cred.type === 'login') {
          extraMatch = cred.username.toLowerCase().includes(q);
        } else if (cred.type === 'database') {
          extraMatch = cred.dbHost.toLowerCase().includes(q);
        }
        return titleMatch || subtitleMatch || extraMatch;
      });
    }, `Search for "${query}" in ${credentials.length} items`);
  });
}

/**
 * Test filter performance
 */
export function testFilterPerformance(credentials: Credential[]) {
  console.log('\n=== Filter Performance Test ===');
  
  const types = ['all', 'login', 'api', 'database', 'note'] as const;
  
  types.forEach(type => {
    benchmark(() => {
      if (type === 'all') return credentials;
      return credentials.filter(cred => cred.type === type);
    }, `Filter by type: ${type}`);
  });
}
