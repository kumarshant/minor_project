// src/store/useAuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      // Auto-set token on store creation
      setToken: (token) => {
        if (token) {
          api.defaults.headers.Authorization = `Bearer ${token}`;
        } else {
          delete api.defaults.headers.Authorization;
        }
        set({ token });
      },

      login: async (credentials) => {
        try {
          const { data } = await api.post('/user/login', credentials);
          get().setToken(data.token);
          set({ user: data.user });
          toast.success(`Welcome back, ${data.user.username}!`);
          return true;
        } catch (err) {
          toast.error(err.response?.data?.message || 'Login failed');
          return false;
        }
      },

      register: async (credentials) => {
        try {
          const { data } = await api.post('/user/register', credentials);
          get().setToken(data.token);
          set({ user: data.user });
          toast.success('Account created!');
          return true;
        } catch (err) {
          toast.error(err.response?.data?.message || 'Signup failed');
          return false;
        }
      },

      logout: () => {
        get().setToken(null);
        set({ user: null });
        toast.success('Logged out');
      },
    }),
    {
      name: 'auth',
      onRehydrateStorage: () => (state) => {
        // This runs when store is rehydrated from localStorage
        if (state?.token) {
          api.defaults.headers.Authorization = `Bearer ${state.token}`;
        }
      },
    }
  )
);