/**
 * Date utility functions for the Pharmacy Backend
 */

/**
 * Format date to ISO string
 * @param date - Date object or string
 * @returns ISO date string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString();
}

/**
 * Format date to local date string (YYYY-MM-DD)
 * @param date - Date object or string
 * @returns Local date string
 */
export function toLocalDateString(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().split("T")[0]!;
}

/**
 * Check if a date is in the past
 * @param date - Date to check
 * @returns True if date is in the past
 */
export function isPast(date: Date | string): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  return d < new Date();
}

/**
 * Check if a date is within X days from now
 * @param date - Date to check
 * @param days - Number of days
 * @returns True if date is within X days
 */
export function isWithinDays(date: Date | string, days: number): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffTime = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= days && diffDays >= 0;
}

/**
 * Add days to a date
 * @param date - Original date
 * @param days - Days to add
 * @returns New date with days added
 */
export function addDays(date: Date | string, days: number): Date {
  const d = typeof date === "string" ? new Date(date) : date;
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Get start of day
 * @param date - Date
 * @returns Start of day (00:00:00)
 */
export function startOfDay(date: Date | string = new Date()): Date {
  const d = typeof date === "string" ? new Date(date) : new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get end of day
 * @param date - Date
 * @returns End of day (23:59:59)
 */
export function endOfDay(date: Date | string = new Date()): Date {
  const d = typeof date === "string" ? new Date(date) : new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}
