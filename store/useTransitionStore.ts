// store/useTransitionStore.ts
import { create } from 'zustand';

interface TransitionState {
  isTransitionDone: boolean;
  setTransitionDone: (value: boolean) => void;
  isPageReady: boolean;
  setPageReady: (value: boolean) => void;
}

export const useTransitionStore = create<TransitionState>((set) => ({
  isTransitionDone: false,
  setTransitionDone: (value) => set({ isTransitionDone: value }),
  isPageReady: false,
  setPageReady: (value) => set({ isPageReady: value }),
}));
