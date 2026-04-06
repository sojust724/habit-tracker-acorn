import { create } from 'zustand';
import type { AcornType } from '../types/acorn';

interface AcornAnimationItem {
  id: string;
  type: AcornType;
}

interface AcornStore {
  queue: AcornAnimationItem[];
  trigger: (type: AcornType) => void;
  dismiss: (id: string) => void;
}

export const useAcornStore = create<AcornStore>((set) => ({
  queue: [],
  trigger: (type) =>
    set((state) => ({
      queue: [...state.queue, { id: Date.now().toString(), type }],
    })),
  dismiss: (id) =>
    set((state) => ({
      queue: state.queue.filter((item) => item.id !== id),
    })),
}));
