
// React
import { useState } from "react";

// Store
import { useChatroomStore } from "../../store/chatroomStore";

// Notifications
import toast from "react-hot-toast";


export default function CreateChatroom() {
  // State for new chatroom name
  const [roomName, setRoomName] = useState("");

  // Store action
  const addChatroom = useChatroomStore((state) => state.addChatroom);

  // Handle create chatroom
  const handleCreate = () => {
    const trimmedName = roomName.trim();
    if (!trimmedName) {
      toast.error("Chatroom name cannot be empty.");
      return;
    }
    addChatroom(trimmedName);
    toast.success(`Chatroom "${trimmedName}" created!`);
    setRoomName("");
  };

  return (
    <div className="bg-white/90 border border-gray-200 rounded-xl shadow flex items-center gap-3 p-4 mb-2">
      {/* Chatroom name input */}
      <input
        type="text"
        placeholder="New Chatroom Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition placeholder-gray-400 text-gray-900 bg-gray-50 shadow-sm"
      />
      {/* Create button */}
      <button
        onClick={handleCreate}
        className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      >
        Create
      </button>
    </div>
  );
}
