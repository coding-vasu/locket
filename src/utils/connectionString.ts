import type { DatabaseCredential, DatabaseEngine } from '../types/credential.types';

/**
 * Generates a database connection string based on engine type
 * @param credential - Database credential object
 * @returns Connection string in appropriate format
 */
export function generateConnectionString(credential: DatabaseCredential): string {
  const { dbEngine, dbHost, dbPort, dbName, dbUser, dbPass } = credential;
  
  let protocol = 'db';
  
  switch (dbEngine) {
    case 'PostgreSQL':
      protocol = 'postgres';
      break;
    case 'MySQL':
      protocol = 'mysql';
      break;
    case 'MongoDB':
      protocol = 'mongodb';
      break;
    case 'Redis':
      protocol = 'redis';
      break;
    case 'MariaDB':
      protocol = 'mysql';
      break;
  }
  
  const userPart = dbUser ? `${dbUser}:${dbPass}@` : '';
  const dbPart = dbName ? `/${dbName}` : '';
  
  return `${protocol}://${userPart}${dbHost}:${dbPort}${dbPart}`;
}

/**
 * Gets protocol for database engine
 */
export function getDatabaseProtocol(engine: DatabaseEngine): string {
  const protocolMap: Record<DatabaseEngine, string> = {
    PostgreSQL: 'postgres',
    MySQL: 'mysql',
    MongoDB: 'mongodb',
    Redis: 'redis',
    MariaDB: 'mysql',
  };
  
  return protocolMap[engine] || 'db';
}
