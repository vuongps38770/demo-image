import { create } from 'zustand';

export const useCursorStore = create((set, get) => ({
  isEnabled: false,

  init: () => {
    const saved = localStorage.getItem('custom-cursor');
    const isEnabled = saved === 'true';
    set({ isEnabled });
    get().applyCursorClass(isEnabled);
  },

  toggleCursor: () => {
    const nextState = !get().isEnabled;
    set({ isEnabled: nextState });
    localStorage.setItem('custom-cursor', String(nextState));
    get().applyCursorClass(nextState);
  },

  applyCursorClass: (enabled) => {
    const root = window.document.documentElement;
    if (enabled) {
      root.classList.add('custom-cursor-active');
    } else {
      root.classList.remove('custom-cursor-active');
    }
  }
}));
