// store/useVisualStore.ts
// visual section 준비 됬는지 상태관리
import { create } from 'zustand';

interface VisualStore {
  isVisualReady: boolean;
  setVisualReady: () => void;
}

export const useVisualStore = create<VisualStore>((set) => ({
  isVisualReady: false,
  setVisualReady: () => set({ isVisualReady: true }),
}));
