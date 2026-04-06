export interface Habit {
  id: string;
  user_id: string;
  name: string;
  target_days: number[]; // 0=일, 1=월, 2=화, 3=수, 4=목, 5=금, 6=토
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

export interface CreateHabitInput {
  name: string;
  target_days: number[];
}

export interface UpdateHabitInput {
  id: string;
  name: string;
  target_days: number[];
}
