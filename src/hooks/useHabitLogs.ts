import { useQuery } from '@tanstack/react-query';
import { fetchLogsByDate } from '../api/habitLogs';
import { IS_MOCK, MOCK_LOGS } from '../lib/mockData';

export const logsByDateKey = (date: string) => ['habit_logs', date] as const;

export function useHabitLogs(date: string) {
  return useQuery({
    queryKey: logsByDateKey(date),
    queryFn: IS_MOCK
      ? () => Promise.resolve(MOCK_LOGS.filter((l) => l.date === date))
      : () => fetchLogsByDate(date),
    staleTime: 1000 * 60,
  });
}
