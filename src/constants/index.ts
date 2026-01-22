import type { NavItem } from '../types/ui.types';

export const NAV_ITEMS: NavItem[] = [
  { id: 'all', label: 'All Items', icon: 'squares-four' },
  { id: 'login', label: 'Logins', icon: 'globe' },
  { id: 'api', label: 'API Keys', icon: 'code' },
  { id: 'database', label: 'Databases', icon: 'database' },
  { id: 'note', label: 'Secure Notes', icon: 'notepad' },
];

export const CREDENTIAL_ICONS = {
  login: { icon: 'globe', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20 via-indigo-500/5' },
  api: { icon: 'code', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20 via-rose-500/5' },
  database: { icon: 'database', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20 via-emerald-500/5' },
  note: { icon: 'notepad', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20 via-amber-500/5' },
};

export const DATABASE_ENGINES = [
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Redis',
  'MariaDB',
] as const;

export const API_ENVIRONMENTS = ['Production', 'Staging', 'Development'] as const;

export const API_KEY_TYPES = ['Standard API Key', 'Bearer Token'] as const;
