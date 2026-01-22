import { format, formatDistanceToNow } from 'date-fns';

/**
 * Formats a date for display in credentials
 * @param date - Date to format
 * @returns Formatted date string (e.g., "Jan 15" or "2d ago")
 */
export function formatCredentialDate(date: Date): string {
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks}w ago`;
  } else {
    return format(date, 'MMM d');
  }
}

/**
 * Creates a simple date string for new credentials
 */
export function createDateString(): string {
  return format(new Date(), 'MMM d');
}

/**
 * Gets relative time string
 */
export function getRelativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}
