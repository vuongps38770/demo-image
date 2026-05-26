import { create } from 'zustand';
import { jobsApi } from '../../data/api';

export const useJobStore = create((set, get) => ({
  jobs: [],
  isSubmitting: false,
  isFetching: false,

  submitJob: async (payload, username) => {
    set({ isSubmitting: true });
    try {
      await jobsApi.submitJob(payload, username);
      // Immediately fetch to update list
      get().fetchJobs(username);
    } catch (err) {
      console.error(err);
    } finally {
      set({ isSubmitting: false });
    }
  },

  fetchJobs: async (username) => {
    set({ isFetching: true });
    try {
      const data = await jobsApi.getUserJobs(username);
      set({ jobs: data });
    } catch (err) {
      console.error(err);
    } finally {
      set({ isFetching: false });
    }
  },

  deleteJob: async (id, username) => {
    try {
      await jobsApi.deleteJob(id);
      get().fetchJobs(username);
    } catch (err) {
      console.error(err);
    }
  }
}));
