import { useAuthStore } from "./store/authStore";
import { useChatroomStore } from "./store/chatroomStore";

import { useUIStore } from "./store/uiStore";
import DarkModeToggle from "./Components/DarkModeToggle";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import PhoneLogin from "./Components/Auth/PhoneLogin";
import Dashboard from "./Components/Auth/Dashboard/Dashboard";
import ChatroomList from "./Components/Auth/Dashboard/ChatroomList";
import Chatroom from "./Components/Chatroom/Chatroom";

export default function App() {
  const phone = useAuthStore((s) => s.phone);
  const selectedId = useChatroomStore((s) => s.selectedId);
  const darkMode = useUIStore((s) => s.darkMode);
  const toggleDarkMode = useUIStore((s) => s.toggleDarkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Toaster position="top-center" />
      {!phone ? (
        <PhoneLogin />
      ) : selectedId ? (
        <div className="w-full max-w-3xl p-6 rounded-2xl shadow-2xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 flex flex-col gap-6 transition-all duration-300">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4 drop-shadow-lg">Welcome to the Chatroom</h2>
          <Chatroom />
        </div>
      ) : (
        <Dashboard />
      )}
    </div>
  );
}
