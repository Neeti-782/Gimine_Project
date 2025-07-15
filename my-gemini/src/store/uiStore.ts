import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIStore {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      darkMode: false,
      toggleDarkMode: () => set({ darkMode: !get().darkMode }),
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({ darkMode: state.darkMode }),
    }
  )
);
