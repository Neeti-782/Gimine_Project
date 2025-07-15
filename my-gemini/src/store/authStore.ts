import { create } from "zustand";

type AuthStore = {
  phone: string | null;
  setPhone: (phone: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  phone: null,
  setPhone: (phone) => set({ phone }),
  logout: () => set({ phone: null }),
}));
