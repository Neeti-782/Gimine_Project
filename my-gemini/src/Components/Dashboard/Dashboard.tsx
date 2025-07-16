
// Components
import CreateChatroom from "./CreateChatroom";
import ChatroomList from "./ChatroomList";
import { Toaster } from "react-hot-toast";
import { useUIStore } from "../../store/uiStore";

export default function Dashboard() {
  const { darkMode } = useUIStore();
  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode? 'bg-[#101726]' : 'bg-[#f3f4f6]'}`}>
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        {/* Notifications */}
        <Toaster position="top-center" />
        {/* Header */}
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Your Chatrooms</h2>
        {/* Create chatroom */}
        <div className="mb-6">
          <CreateChatroom />
        </div>
        {/* List chatrooms */}
        <ChatroomList />
      </div>
    </div>
  );
}
