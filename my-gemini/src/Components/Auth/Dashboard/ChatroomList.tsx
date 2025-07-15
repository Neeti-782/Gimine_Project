import toast from "react-hot-toast";
import { useChatroomStore } from "../../../store/chatroomStore";

export default function ChatroomList() {
  const { chatrooms, deleteChatroom, selectChatroom } = useChatroomStore();

  return (
    <div className="mt-4 space-y-3">
      {chatrooms.length === 0 ? (
        <p className="text-gray-400 text-center italic">No chatrooms yet.</p>
      ) : (
        chatrooms.map((room) => (
          <div
            key={room.id}
            className="flex justify-between items-center p-4 bg-white/90 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition group"
          >
            <span className="font-medium text-gray-900 group-hover:text-blue-700 transition truncate max-w-[60%]">{room.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => selectChatroom(room.id)}
                className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                Enter
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete \"${room.name}\"?`)) {
                    deleteChatroom(room.id);
                    toast.success(`Deleted \"${room.name}\"`);
                  }
                }}
                className="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
