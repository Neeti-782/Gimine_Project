
// Zustand state management for UI
import { create } from "zustand";
import { persist } from "zustand/middleware";


export interface UIStore {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// UI store hook
export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // Dark mode state
      darkMode: false,

      // Toggle dark mode
      toggleDarkMode: () => set({ darkMode: !get().darkMode }),
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({ darkMode: state.darkMode }),
    }
  )
);
