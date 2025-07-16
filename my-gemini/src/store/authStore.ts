
// Zustand state management for authentication
import { create } from "zustand";


export type AuthStore = {
  phone: string | null;
  setPhone: (phone: string) => void;
  logout: () => void;
};

// Auth store hook
export const useAuthStore = create<AuthStore>((set) => ({
  // User phone number (null if not logged in)
  phone: null,

  // Set phone number (login)
  setPhone: (phone) => set({ phone }),

  // Logout (clear phone)
  logout: () => set({ phone: null }),
}));
