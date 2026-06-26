// store/useTransitionStore.ts
// 페이지 이동 시 트랜지션 상태값 관리
import { create } from 'zustand';

interface TransitionState {
  isTransitionDone: boolean;
  setTransitionDone: (value: boolean) => void;
}

export const useTransitionStore = create<TransitionState>((set) => ({
  isTransitionDone: false,
  setTransitionDone: (value) => set({ isTransitionDone: value }),
}));
