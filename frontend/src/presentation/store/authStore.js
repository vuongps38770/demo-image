import { create } from 'zustand';
import { authApi } from '../../data/api';

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,

  // Load from localStorage on init
  init: () => {
    const savedUser = localStorage.getItem('username');
    if (savedUser) set({ user: { username: savedUser } });
  },

  login: async (username) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authApi.login(username);
      localStorage.setItem('username', data.username);
      set({ user: data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('username');
    set({ user: null });
  }
}));
