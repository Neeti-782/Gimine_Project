
// Zustand state management
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Utilities
import { v4 as uuidv4 } from "uuid";


// Types
export type Message = {
  sender: string;
  text: string;
  image?: string | null;
  timestamp: string;
};

export type Chatroom = {
  id: string;
  name: string;
  messages: Message[];
};

type Store = {
  chatrooms: Chatroom[];
  selectedId: string | null;
  addChatroom: (name: string) => void;
  deleteChatroom: (id: string) => void;
  selectChatroom: (id: string | null) => void;
  addMessage: (chatroomId: string, message: Message) => void;
  reset: () => void;
};

// Zustand store for chatrooms
export const useChatroomStore = create<Store>()(
  persist(
    (set) => ({
      // State
      chatrooms: [],
      selectedId: null,

      // Add a new chatroom
      addChatroom: (name) =>
        set((state) => ({
          chatrooms: [
            ...state.chatrooms,
            { id: uuidv4(), name, messages: [] },
          ],
        })),

      // Delete a chatroom and reset selection
      deleteChatroom: (id) =>
        set((state) => ({
          chatrooms: state.chatrooms.filter((r) => r.id !== id),
          selectedId: null,
        })),

      // Select a chatroom by id
      selectChatroom: (id) => set({ selectedId: id }),

      // Add a message to a chatroom
      addMessage: (chatroomId, message) =>
        set((state) => ({
          chatrooms: state.chatrooms.map((room) =>
            room.id === chatroomId
              ? { ...room, messages: [...room.messages, message] }
              : room
          ),
        })),

      // Reset all chatrooms and selection
      reset: () => set({ chatrooms: [], selectedId: null }),
    }),
    {
      name: "chatroom-storage",
      partialize: (state) => ({
        chatrooms: state.chatrooms,
        selectedId: state.selectedId,
      }),
    }
  )
);
