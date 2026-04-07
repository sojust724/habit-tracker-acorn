import { useQuery } from '@tanstack/react-query';
import { fetchLogsByDate, fetchLogsByMonth } from '../api/habitLogs';
import { IS_MOCK, MOCK_LOGS, MOCK_MONTH_LOGS } from '../lib/mockData';

export const logsByDateKey = (date: string) => ['habit_logs', date] as const;
export const logsByMonthKey = (start: string, end: string) => ['habit_logs_month', start, end] as const;

export function useHabitLogs(date: string) {
  return useQuery({
    queryKey: logsByDateKey(date),
    queryFn: IS_MOCK
      ? () => Promise.resolve(MOCK_LOGS.filter((l) => l.date === date))
      : () => fetchLogsByDate(date),
    staleTime: 1000 * 60,
  });
}

export function useHabitLogsByMonth(start: string, end: string) {
  return useQuery({
    queryKey: logsByMonthKey(start, end),
    queryFn: IS_MOCK
      ? () => Promise.resolve(MOCK_MONTH_LOGS.filter((l) => l.date >= start && l.date <= end))
      : () => fetchLogsByMonth(start, end),
    staleTime: 1000 * 60 * 5,
  });
}
