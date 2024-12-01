import { format as fnsFormat } from 'date-fns';

export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return 'N/A';
  
  try {
    return fnsFormat(new Date(date), 'MMM dd, yyyy HH:mm');
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
}; 