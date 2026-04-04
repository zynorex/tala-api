export const formatTime = (seconds: number): string => {
  if (seconds <= 0) return '0s';
  
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString();
};

export const formatDatetime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString();
};

export const getTimeColor = (seconds: number): string => {
  if (seconds > 86400 * 7) return 'text-red-600'; // > 7 days
  if (seconds > 86400) return 'text-orange-500'; // > 1 day
  return 'text-green-600';
};
