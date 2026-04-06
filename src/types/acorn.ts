export type AcornType = 'normal' | 'golden';

export type AcornReason = 'GAME-001' | 'GAME-002' | 'GAME-003';

export interface Acorn {
  id: string;
  user_id: string;
  type: AcornType;
  reason: AcornReason;
  earned_at: string;
}
