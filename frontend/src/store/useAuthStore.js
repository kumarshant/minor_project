import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../services/api";
import toast from "react-hot-toast";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,

      /*
      -------------------------
      SET TOKEN
      -------------------------
      */
      setToken: (token) => {
        console.log("Setting token...");

        if (token) {
          api.defaults.headers.Authorization = `Bearer ${token}`;
        } else {
          delete api.defaults.headers.Authorization;
        }

        set({ token });
      },

      /*
      -------------------------
      FETCH FULL USER PROFILE
      -------------------------
      */
      fetchProfile: async () => {
        try {
          console.log("Fetching latest profile...");

          const { data } = await api.get("/user/me");

          console.log("Profile fetched:", data);

          set({
            user: data.user || data
          });

        } catch (error) {
          console.log("fetchProfile error:", error);

          // token invalid -> logout
          if (error.response?.status === 401) {
            get().logout();
          }
        }
      },

      /*
      -------------------------
      LOGIN
      -------------------------
      */
      login: async (credentials) => {
        try {
          set({ loading: true });

          console.log("Logging in...");

          const { data } = await api.post(
            "/user/login",
            credentials
          );

          get().setToken(data.token);

          set({
            user: data.user
          });

          // fetch full latest profile
          await get().fetchProfile();

          toast.success(
            `Welcome back ${data.user.username}`
          );

          return true;

        } catch (err) {
          console.log("login error:", err);

          toast.error(
            err.response?.data?.message ||
              "Login failed"
          );

          return false;

        } finally {
          set({ loading: false });
        }
      },

      /*
      -------------------------
      REGISTER
      -------------------------
      */
      register: async (credentials) => {
        try {
          set({ loading: true });

          console.log("Registering user...");

          const { data } = await api.post(
            "/user/register",
            credentials
          );

          get().setToken(data.token);

          set({
            user: data.user
          });

          await get().fetchProfile();

          toast.success("Account created!");

          return true;

        } catch (err) {
          console.log("register error:", err);

          toast.error(
            err.response?.data?.message ||
              "Signup failed"
          );

          return false;

        } finally {
          set({ loading: false });
        }
      },

      /*
      -------------------------
      LOGOUT
      -------------------------
      */
      logout: () => {
        console.log("Logging out...");

        delete api.defaults.headers.Authorization;

        set({
          user: null,
          token: null
        });

        toast.success("Logged out");
      }
    }),
    {
      name: "auth",

      onRehydrateStorage: () => (state) => {
        console.log("Rehydrating auth store...");

        if (state?.token) {
          api.defaults.headers.Authorization =
            `Bearer ${state.token}`;

          // fetch latest user profile after refresh
          state.fetchProfile();
        }
      }
    }
  )
);