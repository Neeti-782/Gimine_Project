// React & hooks
import { useEffect } from "react";

// Store hooks
import { useAuthStore } from "./store/authStore";
import { useChatroomStore } from "./store/chatroomStore";
import { useUIStore } from "./store/uiStore";

// Components
import DarkModeToggle from "./Components/DarkModeToggle";
import { Toaster } from "react-hot-toast";
import PhoneLogin from "./Components/Auth/PhoneLogin";
import Dashboard from "./Components/Dashboard/Dashboard";
import Chatroom from "./Components/Chatroom/Chatroom";

export default function App() {
  // Store state
  const phone = useAuthStore((s) => s.phone);
  const selectedId = useChatroomStore((s) => s.selectedId);
  const { darkMode, toggleDarkMode } = useUIStore();

  // Sync dark mode with document
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Render main content based on auth and chatroom state
  let mainContent;
  if (!phone) {
    mainContent = <PhoneLogin />;
  } else if (selectedId) {
    mainContent = (
      <div className="w-full max-w-3xl p-6 rounded-2xl shadow-2xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 flex flex-col gap-6 transition-all duration-300">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4 drop-shadow-lg">Welcome to the Chatroom</h2>
        <Chatroom />
      </div>
    );
  } else {
    mainContent = <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      {/* Dark mode toggle and notifications */}
      <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Toaster position="top-center" />
      {/* Main content */}
      {mainContent}
    </div>
  );
}
