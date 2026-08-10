"use client";
import { create } from "zustand";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string;
  createdAt?: string;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<User | null>;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  initialized: false,

  setUser: (user) => set({ user }),

  checkAuth: async () => {
    if (get().isLoading) return get().user;
    set({ isLoading: true });
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      if (data.authenticated && data.user) {
        set({ user: data.user, isLoading: false, initialized: true });
        return data.user;
      } else {
        set({ user: null, isLoading: false, initialized: true });
        return null;
      }
    } catch (err) {
      console.error("checkAuth error:", err);
      set({ user: null, isLoading: false, initialized: true });
      return null;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      set({ user: null, isLoading: false });
    } catch (err) {
      console.error("logout error:", err);
      set({ user: null, isLoading: false });
    }
  },
}));
