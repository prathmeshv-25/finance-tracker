export const calculatePercentage = (current: number, total: number): number => {
  if (total <= 0) return 0;
  return Math.min(Math.round((current / total) * 100), 100);
};
