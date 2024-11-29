type StatusConfig = {
  label: string;
  className: string;
};

const STATUS_CONFIGS: Record<string, StatusConfig> = {
  active: {
    label: 'Active',
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  completed: {
    label: 'Completed',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  },
  'in_progress': {
    label: 'In Progress',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  planned: {
    label: 'Planned',
    className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  },
};

export const getStatusConfig = (status: string): StatusConfig => {
  // Convert status to lowercase and replace spaces/special chars with underscore
  const normalizedStatus = status.toLowerCase().replace(/[\s-]/g, '_');
  
  return STATUS_CONFIGS[normalizedStatus] || {
    label: status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' '),
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  };
}; 