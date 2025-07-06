import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const MonthsDict: Record<number, { full: string; short: string }> = {
  1: { full: 'January', short: 'Jan' },
  2: { full: 'February', short: 'Feb' },
  3: { full: 'March', short: 'Mar' },
  4: { full: 'April', short: 'Apr' },
  5: { full: 'May', short: 'May' },
  6: { full: 'June', short: 'Jun' },
  7: { full: 'July', short: 'Jul' },
  8: { full: 'August', short: 'Aug' },
  9: { full: 'September', short: 'Sep' },
  10: { full: 'October', short: 'Oct' },
  11: { full: 'November', short: 'Nov' },
  12: { full: 'December', short: 'Dec' }
};
