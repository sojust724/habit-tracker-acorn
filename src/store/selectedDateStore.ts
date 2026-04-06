import { create } from 'zustand';
import { formatDate } from '../lib/dateUtils';

interface SelectedDateState {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export const useSelectedDateStore = create<SelectedDateState>((set) => ({
  selectedDate: formatDate(new Date()),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));
