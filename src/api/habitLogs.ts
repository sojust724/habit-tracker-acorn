import { supabase } from '../lib/supabase';
import type { HabitLog } from '../types/habit';

export async function fetchLogsByDate(date: string): Promise<HabitLog[]> {
  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('date', date);

  if (error) throw error;
  return data;
}

export async function fetchLogsByMonth(start: string, end: string): Promise<HabitLog[]> {
  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .gte('date', start)
    .lte('date', end);

  if (error) throw error;
  return data;
}

export async function upsertLog(habitId: string, date: string, completed: boolean): Promise<HabitLog> {
  const { data, error } = await supabase
    .rpc('upsert_habit_log', {
      p_habit_id: habitId,
      p_date: date,
      p_completed: completed,
    });

  if (error) throw error;
  return data;
}
