import { User } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User> | User) => void;
  setHydrated: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hydrated: false,

      setHydrated: (v) => set({ hydrated: v }),

      login: (user) =>
        set({
          user,
          isAuthenticated: true,
          hydrated: true,
        }),

      updateUser: (updatedUser) =>
        set((state) => {
          if (!state.user) return state;

          if ("id" in updatedUser) {
            return { user: updatedUser as User, isAuthenticated: true };
          }

          return {
            user: { ...state.user, ...updatedUser },
            isAuthenticated: true,
          };
        }),

      logout: () => {
        localStorage.removeItem("auth-store");
        set({
          user: null,
          isAuthenticated: false,
          hydrated: true,
        });
      },
    }),
    {
      name: "auth-store",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
