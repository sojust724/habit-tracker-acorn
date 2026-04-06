import { supabase } from '../lib/supabase';
import type { Acorn, AcornReason, AcornType } from '../types/acorn';

export async function insertAcorn(type: AcornType, reason: AcornReason): Promise<Acorn> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  const { data, error } = await supabase
    .from('acorns')
    .insert({ user_id: user.id, type, reason })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchAcornsByMonth(start: string, end: string): Promise<Acorn[]> {
  const { data, error } = await supabase
    .from('acorns')
    .select('*')
    .gte('earned_at', start)
    .lte('earned_at', end)
    .order('earned_at', { ascending: false });

  if (error) throw error;
  return data;
}
