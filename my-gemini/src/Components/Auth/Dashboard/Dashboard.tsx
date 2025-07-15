import CreateChatroom from "./CreateChatroom";
import ChatroomList from "./ChatroomList";
import { Toaster } from "react-hot-toast";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#101726]">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        <Toaster position="top-center" />
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Your Chatrooms</h2>
        <div className="mb-6">
          <CreateChatroom />
        </div>
        <ChatroomList />
      </div>
    </div>
  );
}
