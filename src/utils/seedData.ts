import type { Credential } from '../types/credential.types';

export const seedData: Credential[] = [
  // Logins
  {
    id: 1,
    type: 'login',
    title: 'Netflix',
    subtitle: 'dev@example.com',
    date: 'Jan 15',
    url: 'https://netflix.com',
    username: 'dev@example.com',
    password: 'N3tfl!x2024SecurePass'
  },
  {
    id: 2,
    type: 'login',
    title: 'GitHub',
    subtitle: 'developer',
    date: 'Jan 18',
    url: 'https://github.com',
    username: 'developer',
    password: 'gh_s3cur3_t0k3n_2024'
  },
  {
    id: 3,
    type: 'login',
    title: 'AWS Console',
    subtitle: 'admin@company.com',
    date: 'Jan 20',
    url: 'https://console.aws.amazon.com',
    username: 'admin@company.com',
    password: 'AWS_P@ssw0rd_Secure!'
  },
  
  // API Keys
  {
    id: 4,
    type: 'api',
    title: 'Stripe Production',
    subtitle: 'Production',
    date: 'Jan 10',
    env: 'Production',
    keyType: 'Standard API Key',
    secret: 'STRIPE_TEST_KEY_PLACEHOLDER'
  },
  {
    id: 5,
    type: 'api',
    title: 'OpenAI API',
    subtitle: 'Production',
    date: 'Jan 12',
    env: 'Production',
    keyType: 'Bearer Token',
    secret: 'OPENAI_KEY_PLACEHOLDER'
  },
  {
    id: 6,
    type: 'api',
    title: 'SendGrid Staging',
    subtitle: 'Staging',
    date: 'Jan 14',
    env: 'Staging',
    keyType: 'Standard API Key',
    secret: 'SENDGRID_KEY_PLACEHOLDER'
  },
  
  // Databases
  {
    id: 7,
    type: 'database',
    title: 'Production PostgreSQL',
    subtitle: 'admin@db-prod-01.aws.com',
    date: 'Jan 8',
    dbEngine: 'PostgreSQL',
    dbHost: 'db-prod-01.aws.com',
    dbPort: '5432',
    dbName: 'app_production',
    dbUser: 'admin',
    dbPass: 'PgSQL_Pr0d_P@ss_2024!'
  },
  {
    id: 8,
    type: 'database',
    title: 'Redis Cache',
    subtitle: 'cache_user@redis-cluster.local',
    date: 'Jan 16',
    dbEngine: 'Redis',
    dbHost: 'redis-cluster.local',
    dbPort: '6379',
    dbName: 'cache_db',
    dbUser: 'cache_user',
    dbPass: 'R3d!s_C@che_S3cur3'
  },
  {
    id: 9,
    type: 'database',
    title: 'MongoDB Analytics',
    subtitle: 'analytics@mongo-cluster.com',
    date: 'Jan 19',
    dbEngine: 'MongoDB',
    dbHost: 'mongo-cluster.com',
    dbPort: '27017',
    dbName: 'analytics',
    dbUser: 'analytics',
    dbPass: 'M0ng0_An@lyt!cs_2024'
  },
  
  // Secure Notes
  {
    id: 10,
    type: 'note',
    title: 'SSH Private Key',
    subtitle: 'Secure Note',
    date: 'Jan 5',
    content: '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA1234567890...\n(This is a placeholder for demonstration)\nNever store actual private keys in plaintext!\n-----END RSA PRIVATE KEY-----'
  },
  {
    id: 11,
    type: 'note',
    title: 'WiFi Passwords',
    subtitle: 'Secure Note',
    date: 'Jan 11',
    content: 'Home WiFi: MyHomeNetwork_5G - Pass: H0m3W!F!_2024\nOffice WiFi: CompanyGuest - Pass: Guest@2024!\nCafe WiFi: LocalCoffee - Pass: C0ff33L0v3r'
  },
  {
    id: 12,
    type: 'note',
    title: 'Recovery Codes',
    subtitle: 'Secure Note',
    date: 'Today',
    content: '2FA Backup Codes for GitHub:\n1. ABCD-1234-EFGH-5678\n2. IJKL-9012-MNOP-3456\n3. QRST-7890-UVWX-1234\n\nKeep these safe for account recovery!'
  }
];
