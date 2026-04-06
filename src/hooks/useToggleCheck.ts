import { useMutation, useQueryClient } from '@tanstack/react-query';
import { insertAcorn } from '../api/acorns';
import { fetchLogsByDate, upsertLog } from '../api/habitLogs';
import { useAcornStore } from '../store/acornStore';
import type { HabitLog } from '../types/habit';
import { logsByDateKey } from './useHabitLogs';
import { HABITS_KEY } from './useHabits';

interface ToggleInput {
  habitId: string;
  date: string;
  completed: boolean;
}

export function useToggleCheck() {
  const queryClient = useQueryClient();
  const triggerAcorn = useAcornStore((s) => s.trigger);

  return useMutation({
    mutationFn: ({ habitId, date, completed }: ToggleInput) =>
      upsertLog(habitId, date, completed),

    // 낙관적 업데이트: 네트워크 응답 전에 즉시 UI 반영
    onMutate: async ({ habitId, date, completed }) => {
      const key = logsByDateKey(date);
      await queryClient.cancelQueries({ queryKey: key });

      const previous = queryClient.getQueryData<HabitLog[]>(key);

      queryClient.setQueryData<HabitLog[]>(key, (old) => {
        if (!old) return [];
        const exists = old.find((l) => l.habit_id === habitId);
        if (exists) {
          return old.map((l) =>
            l.habit_id === habitId ? { ...l, completed } : l
          );
        }
        return [
          ...old,
          {
            id: 'temp-' + habitId,
            habit_id: habitId,
            user_id: '',
            date,
            completed,
          },
        ];
      });

      return { previous };
    },

    onError: (_err, { date }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(logsByDateKey(date), context.previous);
      }
    },

    onSuccess: async (_, { date, completed }) => {
      if (!completed) return;

      // GAME-001: 체크 시 도토리 +1
      await insertAcorn('normal', 'GAME-001');
      triggerAcorn('normal');

      // GAME-002: 당일 전체 달성 시 보너스 도토리 +3
      const habits = queryClient.getQueryData<{ id: string; target_days: number[] }[]>(HABITS_KEY);
      const logs = await fetchLogsByDate(date);

      const todayWeekday = new Date(date + 'T00:00:00').getDay();
      const todayHabits = habits?.filter((h) => h.target_days.includes(todayWeekday)) ?? [];

      if (todayHabits.length > 0) {
        const allDone = todayHabits.every((h) =>
          logs.some((l) => l.habit_id === h.id && l.completed)
        );
        if (allDone) {
          await Promise.all([
            insertAcorn('normal', 'GAME-002'),
            insertAcorn('normal', 'GAME-002'),
            insertAcorn('normal', 'GAME-002'),
          ]);
          triggerAcorn('normal');
        }
      }
    },

    onSettled: (_data, _err, { date }) => {
      queryClient.invalidateQueries({ queryKey: logsByDateKey(date) });
    },
  });
}
