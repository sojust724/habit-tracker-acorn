import type { Habit, HabitLog } from '../types/habit';

export const MOCK_HABITS: Habit[] = [
  { id: '1', user_id: 'mock', name: '물 2L 마시기', target_days: [1, 2, 3, 4, 5], created_at: '' },
  { id: '2', user_id: 'mock', name: '30분 운동', target_days: [1, 3, 5], created_at: '' },
  { id: '3', user_id: 'mock', name: '독서 20분', target_days: [0, 1, 2, 3, 4, 5, 6], created_at: '' },
  { id: '4', user_id: 'mock', name: '명상 10분', target_days: [1, 2, 3, 4, 5], created_at: '' },
];

function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getDateStr(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// 이번 달 mock 로그 생성 (오늘까지)
function generateMockMonthLogs(): HabitLog[] {
  const logs: HabitLog[] = [];
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  let logId = 100;

  for (let day = 1; day <= today.getDate(); day++) {
    const date = new Date(year, month, day);
    const weekday = date.getDay();
    const dateStr = getDateStr(date);

    for (const habit of MOCK_HABITS) {
      if (!habit.target_days.includes(weekday)) continue;
      // 습관별로 다른 달성률 시뮬레이션
      const rand = ((habit.id.charCodeAt(0) * day * 7) % 100);
      const thresholds: Record<string, number> = { '1': 80, '2': 50, '3': 90, '4': 60 };
      const completed = rand < (thresholds[habit.id] ?? 70);
      logs.push({
        id: `mock-${logId++}`,
        habit_id: habit.id,
        user_id: 'mock',
        date: dateStr,
        completed,
      });
    }
  }
  return logs;
}

export const MOCK_LOGS: HabitLog[] = [
  { id: 'l1', habit_id: '1', user_id: 'mock', date: getTodayStr(), completed: true },
  { id: 'l2', habit_id: '3', user_id: 'mock', date: getTodayStr(), completed: true },
];

export const MOCK_MONTH_LOGS: HabitLog[] = generateMockMonthLogs();

export const IS_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true';
