import { useMemo } from 'react';
import { useHabitLogsByMonth } from './useHabitLogs';
import { useHabits } from './useHabits';
import type { Habit, HabitLog } from '../types/habit';
import { getMonthRange } from '../lib/dateUtils';

export interface HabitAchievement {
  habit: Habit;
  targetCount: number;  // 해당 월에 해야 할 일수
  completedCount: number; // 실제 완료한 일수
  rate: number;         // 달성률 (0~100)
}

function getDatesInMonth(year: number, month: number): Date[] {
  const dates: Date[] = [];
  const lastDay = new Date(year, month, 0).getDate();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;
  const maxDay = isCurrentMonth ? today.getDate() : lastDay;

  for (let day = 1; day <= maxDay; day++) {
    dates.push(new Date(year, month - 1, day));
  }
  return dates;
}

function calcAchievements(
  habits: Habit[],
  logs: HabitLog[],
  year: number,
  month: number,
): HabitAchievement[] {
  const dates = getDatesInMonth(year, month);

  return habits.map((habit) => {
    const targetDates = dates.filter((d) => habit.target_days.includes(d.getDay()));
    const targetCount = targetDates.length;

    const completedCount = logs.filter(
      (l) => l.habit_id === habit.id && l.completed
    ).length;

    const rate = targetCount === 0 ? 0 : Math.round((completedCount / targetCount) * 100);

    return { habit, targetCount, completedCount, rate };
  });
}

export function useMonthlyStats(year: number, month: number) {
  const { start, end } = getMonthRange(year, month);
  const { data: habits = [], isLoading: habitsLoading } = useHabits();
  const { data: logs = [], isLoading: logsLoading } = useHabitLogsByMonth(start, end);

  const achievements = useMemo(
    () => calcAchievements(habits, logs, year, month),
    [habits, logs, year, month],
  );

  return {
    achievements,
    isLoading: habitsLoading || logsLoading,
  };
}
