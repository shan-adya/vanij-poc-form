import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RequestStatusBadgeProps {
  status: 'pending' | 'in-progress' | 'approved' | 'rejected' | 'cancelled';
}

export default function RequestStatusBadge({ status }: RequestStatusBadgeProps) {
  const variants = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  };

  const labels = {
    'in-progress': 'In Progress',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
  };

  return (
    <Badge className={cn(variants[status], 'capitalize')}>
      {labels[status]}
    </Badge>
  );
}