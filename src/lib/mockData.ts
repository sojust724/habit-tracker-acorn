import type { Habit, HabitLog } from '../types/habit';

export const MOCK_HABITS: Habit[] = [
  { id: '1', user_id: 'mock', name: '물 2L 마시기', target_days: [1, 2, 3, 4, 5], created_at: '' },
  { id: '2', user_id: 'mock', name: '30분 운동', target_days: [1, 3, 5], created_at: '' },
  { id: '3', user_id: 'mock', name: '독서 20분', target_days: [0, 1, 2, 3, 4, 5, 6], created_at: '' },
  { id: '4', user_id: 'mock', name: '명상 10분', target_days: [1, 2, 3, 4, 5], created_at: '' },
];

export const MOCK_LOGS: HabitLog[] = [
  { id: 'l1', habit_id: '1', user_id: 'mock', date: getTodayStr(), completed: true },
  { id: 'l2', habit_id: '3', user_id: 'mock', date: getTodayStr(), completed: true },
];

function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const IS_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true';
