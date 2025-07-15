import { useState } from "react";
import { useChatroomStore } from "../../../store/chatroomStore";
import toast from "react-hot-toast";

export default function CreateChatroom() {
  const [roomName, setRoomName] = useState("");
  const addChatroom = useChatroomStore((state) => state.addChatroom);

  const handleCreate = () => {
    if (!roomName.trim()) {
      toast.error("Chatroom name cannot be empty.");
      return;
    }
    addChatroom(roomName.trim());
    toast.success(`Chatroom "${roomName}" created!`);
    setRoomName("");
  };

  return (
    <div className="bg-white/90 border border-gray-200 rounded-xl shadow flex items-center gap-3 p-4 mb-2">
      <input
        type="text"
        placeholder="New Chatroom Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition placeholder-gray-400 text-gray-900 bg-gray-50 shadow-sm"
      />
      <button
        onClick={handleCreate}
        className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      >
        Create
      </button>
    </div>
  );
}
