import { supabase } from '../lib/supabase';
import type { CreateHabitInput, Habit, UpdateHabitInput } from '../types/habit';

export async function fetchHabits(): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createHabit(input: CreateHabitInput): Promise<Habit> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  const { data, error } = await supabase
    .from('habits')
    .insert({ ...input, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateHabit(input: UpdateHabitInput): Promise<Habit> {
  const { id, ...rest } = input;
  const { data, error } = await supabase
    .from('habits')
    .update(rest)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteHabit(id: string): Promise<void> {
  const { error } = await supabase.from('habits').delete().eq('id', id);
  if (error) throw error;
}
