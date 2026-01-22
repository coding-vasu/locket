import type { DatabaseEngine } from '../types/credential.types';

/**
 * Centralized color configuration for the application
 * Provides consistent color schemes for database types, environments, and UI states
 */

// Database Engine Colors
export const DATABASE_ENGINE_COLORS: Record<DatabaseEngine, {
  bg: string;
  text: string;
  border: string;
  icon: string;
}> = {
  PostgreSQL: {
    bg: 'bg-blue-500/15',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    icon: 'text-blue-400',
  },
  MySQL: {
    bg: 'bg-orange-500/15',
    text: 'text-orange-400',
    border: 'border-orange-500/30',
    icon: 'text-orange-400',
  },
  MongoDB: {
    bg: 'bg-green-500/15',
    text: 'text-green-400',
    border: 'border-green-500/30',
    icon: 'text-green-400',
  },
  Redis: {
    bg: 'bg-red-500/15',
    text: 'text-red-400',
    border: 'border-red-500/30',
    icon: 'text-red-400',
  },
  MariaDB: {
    bg: 'bg-purple-500/15',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    icon: 'text-purple-400',
  },
};

// Environment Colors (for API Keys)
export const ENVIRONMENT_COLORS: Record<'Production' | 'Staging' | 'Development', {
  bg: string;
  text: string;
  border: string;
}> = {
  Production: {
    bg: 'bg-red-500/15',
    text: 'text-red-400',
    border: 'border-red-500/30',
  },
  Staging: {
    bg: 'bg-yellow-500/15',
    text: 'text-yellow-400',
    border: 'border-yellow-500/30',
  },
  Development: {
    bg: 'bg-green-500/15',
    text: 'text-green-400',
    border: 'border-green-500/30',
  },
};

// Password Strength Colors
export const PASSWORD_STRENGTH_COLORS = {
  weak: {
    bg: 'bg-red-500',
    text: 'text-red-400',
    label: 'Weak',
  },
  medium: {
    bg: 'bg-yellow-500',
    text: 'text-yellow-400',
    label: 'Medium',
  },
  strong: {
    bg: 'bg-green-500',
    text: 'text-green-400',
    label: 'Strong',
  },
  veryStrong: {
    bg: 'bg-emerald-500',
    text: 'text-emerald-400',
    label: 'Very Strong',
  },
};

// Toast Notification Colors
export const TOAST_COLORS = {
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-400',
    icon: 'text-green-400',
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    icon: 'text-red-400',
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    icon: 'text-blue-400',
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    icon: 'text-yellow-400',
  },
};

/**
 * Utility function to get database engine colors
 */
export function getDatabaseEngineColors(engine: DatabaseEngine) {
  return DATABASE_ENGINE_COLORS[engine] || {
    bg: 'bg-zinc-800/50',
    text: 'text-zinc-400',
    border: 'border-zinc-700',
    icon: 'text-zinc-400',
  };
}

/**
 * Utility function to get environment colors
 */
export function getEnvironmentColors(env: 'Production' | 'Staging' | 'Development') {
  return ENVIRONMENT_COLORS[env];
}

/**
 * Utility function to calculate password strength
 */
export function calculatePasswordStrength(password: string): keyof typeof PASSWORD_STRENGTH_COLORS {
  if (!password) return 'weak';
  
  let strength = 0;
  
  // Length check
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (password.length >= 16) strength++;
  
  // Character variety checks
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  
  if (strength <= 2) return 'weak';
  if (strength <= 4) return 'medium';
  if (strength <= 6) return 'strong';
  return 'veryStrong';
}
