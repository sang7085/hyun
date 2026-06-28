// store/useLoadingStore.ts
import { create } from 'zustand';

interface LoadingStore {
  isLoading: boolean;
  setLoadingDone: () => void;
}

export const useLoadingStore = create<LoadingStore>((set) => ({
  isLoading: true,
  setLoadingDone: () => set({ isLoading: false }),
}));
