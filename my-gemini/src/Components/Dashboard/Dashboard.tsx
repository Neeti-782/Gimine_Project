
// Components
import React from "react";
import CreateChatroom from "./CreateChatroom";
import ChatroomList from "./ChatroomList";
import { Toaster } from "react-hot-toast";
import { useUIStore } from "../../store/uiStore";

export default function Dashboard() {
  const { darkMode } = useUIStore();
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  // Debounce search input
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode? 'bg-[#101726]' : 'bg-[#f3f4f6]'}`}>
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        {/* Notifications */}
        <Toaster position="top-center" />
        {/* Header */}
        <h2 className="text-3xl font-extrabold text-blue-500 mb-4 tracking-tight">Your Chatrooms</h2>
        {/* Search bar */}
        <input
          type="text"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search chatrooms..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Escape') {
              setSearch("");
            }
          }}
          aria-label="Search chatrooms"
        />
        {/* Create chatroom */}
        <div className="mb-6">
          <CreateChatroom />
        </div>
        {/* List chatrooms */}
        <ChatroomList search={debouncedSearch} />
      </div>
    </div>
  );
}
