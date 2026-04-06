import { useQuery } from '@tanstack/react-query';
import { fetchLogsByDate } from '../api/habitLogs';

export const logsByDateKey = (date: string) => ['habit_logs', date] as const;

export function useHabitLogs(date: string) {
  return useQuery({
    queryKey: logsByDateKey(date),
    queryFn: () => fetchLogsByDate(date),
    staleTime: 1000 * 60, // 1분
  });
}
