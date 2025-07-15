import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";


type Message = {
  sender: string;
  text: string;
  image?: string | null;
  timestamp: string;
};

type Chatroom = {
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
};

export const useChatroomStore = create<Store>()(
  persist(
    (set) => ({
      chatrooms: [],
      selectedId: null,
      addChatroom: (name) =>
        set((state) => ({
          chatrooms: [
            ...state.chatrooms,
            { id: uuidv4(), name, messages: [] },
          ],
        })),
      deleteChatroom: (id) =>
        set((state) => ({
          chatrooms: state.chatrooms.filter((r) => r.id !== id),
          selectedId: null,
        })),
      selectChatroom: (id) => set({ selectedId: id }),
      addMessage: (chatroomId, message) =>
        set((state) => ({
          chatrooms: state.chatrooms.map((room) =>
            room.id === chatroomId
              ? { ...room, messages: [...room.messages, message] }
              : room
          ),
        })),
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
