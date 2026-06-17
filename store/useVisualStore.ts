// store/useVisualStore.ts
import { create } from 'zustand';

interface VisualStore {
  isVisualReady: boolean;
  setVisualReady: () => void;
}

export const useVisualStore = create<VisualStore>((set) => ({
  isVisualReady: false,
  setVisualReady: () => set({ isVisualReady: true }),
}));