import { z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  url: z.string().url('Must be a valid URL').or(z.literal('')),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

// API Key validation schema
export const apiKeySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  env: z.enum(['Production', 'Staging', 'Development']),
  keyType: z.string().min(1, 'Key type is required'),
  secret: z.string().min(1, 'Secret is required'),
});

// Database validation schema
export const databaseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  dbEngine: z.enum(['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'MariaDB']),
  dbHost: z.string().min(1, 'Host is required'),
  dbPort: z.string().min(1, 'Port is required'),
  dbName: z.string().min(1, 'Database name is required'),
  dbUser: z.string().min(1, 'Username is required'),
  dbPass: z.string().min(1, 'Password is required'),
});

// Note validation schema
export const noteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
});

// Export types from schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type ApiKeyFormData = z.infer<typeof apiKeySchema>;
export type DatabaseFormData = z.infer<typeof databaseSchema>;
export type NoteFormData = z.infer<typeof noteSchema>;
