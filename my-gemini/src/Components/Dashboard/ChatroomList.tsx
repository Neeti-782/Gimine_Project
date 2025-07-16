
// Notifications
import toast from "react-hot-toast";
import React from "react";

// Store
import { useChatroomStore } from "../../store/chatroomStore";


type ChatroomListProps = {
  search?: string;
};

type ChatroomActionButtonProps = {
  label: string;
  onClick: () => void;
  ariaLabel: string;
  className: string;
};

const ChatroomActionButton: React.FC<ChatroomActionButtonProps> = ({ label, onClick, ariaLabel, className }) => (
  <button
    onClick={onClick}
    onKeyDown={e => {
      if (e.key === 'Enter' || e.key === ' ') {
        onClick();
      }
    }}
    tabIndex={0}
    aria-label={ariaLabel}
    className={className}
  >
    {label}
  </button>
);


const ChatroomList: React.FC<ChatroomListProps> = ({ search = "" }) => {
  const { chatrooms, deleteChatroom, selectChatroom } = useChatroomStore();

  const handleDelete = React.useCallback((roomId: string, roomName: string) => {
    if (confirm(`Delete "${roomName}"?`)) {
      deleteChatroom(roomId);
      toast.success(`Deleted "${roomName}"`);
    }
  }, [deleteChatroom]);

  const filtered = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    return term
      ? chatrooms.filter(room => room.name.toLowerCase().includes(term))
      : chatrooms;
  }, [chatrooms, search]);

  if (filtered.length === 0) {
    return <p className="text-gray-400 text-center italic">No chatrooms found.</p>;
  }

  return (
    <div className="mt-4 space-y-3">
      {filtered.map(room => (
        <div
          key={room.id}
          className="flex justify-between items-center p-4 bg-white/90 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition group"
        >
          {/* Chatroom name */}
          <span className="font-medium text-gray-900 group-hover:text-blue-700 transition truncate max-w-[60%]">{room.name}</span>
          {/* Actions */}
          <div className="flex gap-2">
            <ChatroomActionButton
              label="Enter"
              onClick={() => selectChatroom(room.id)}
              ariaLabel={`Enter chatroom ${room.name}`}
              className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <ChatroomActionButton
              label="Delete"
              onClick={() => handleDelete(room.id, room.name)}
              ariaLabel={`Delete chatroom ${room.name}`}
              className="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatroomList;
