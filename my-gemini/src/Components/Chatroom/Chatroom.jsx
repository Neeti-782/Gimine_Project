
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useChatroomStore } from "../../store/chatroomStore";
import { useAuthStore } from "../../store/authStore";
import { FiSend, FiImage } from "react-icons/fi";
import toast from "react-hot-toast";

function getFakeAIResponse(userMsg) {
  if (/image|photo|pic/i.test(userMsg)) {
    return "Here's an image for you!";
  }
  return `Gemini AI: This is a simulated response to: ${userMsg}`;
}

// Dummy data for simulating older messages
function getDummyMessages(page, pageSize, phone) {
  const total = 100;
  const start = Math.max(0, total - (page + 1) * pageSize);
  const end = total - page * pageSize;
  const arr = [];
  for (let i = start; i < end; i++) {
    arr.push({
      sender: i % 2 === 0 ? phone : "Gemini AI",
      text: i % 2 === 0 ? `Old message #${i}` : `Gemini reply #${i}`,
      image: null,
      timestamp: new Date(Date.now() - (total - i) * 60000).toISOString(),
    });
  }
  return arr;
}

function Chatroom() {
  const { selectedId, chatrooms, addMessage, selectChatroom } = useChatroomStore();
  const { phone, logout } = useAuthStore();
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [page, setPage] = useState(0); // for pagination
  const [paginatedMessages, setPaginatedMessages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const pageSize = 20;
  const [copyMsgIdx, setCopyMsgIdx] = useState(null);

  const chatroom = chatrooms.find((c) => c.id === selectedId);

  // Combine dummy older messages with real chatroom messages for demo
  const allMessages = chatroom
    ? [
        ...getDummyMessages(page, pageSize, phone),
        ...(chatroom.messages || []),
      ]
    : [];

  useEffect(() => {
    setPaginatedMessages(allMessages);
    setHasMore(page < 4); // simulate 5 pages max
  }, [chatroom, page]);

  // Auto-scroll to bottom on new message (only if not loading older)
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatroom?.messages, paginatedMessages.length, isTyping]);

  // Infinite scroll: load older messages when scrolled to top
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;
    if (messagesContainerRef.current.scrollTop < 50 && hasMore) {
      setPage((p) => p + 1);
    }
  }, [hasMore]);

  useEffect(() => {
    const ref = messagesContainerRef.current;
    if (ref) {
      ref.addEventListener("scroll", handleScroll);
      return () => ref.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // Throttled Gemini response
  const handleSend = () => {
    if (!input && !image) return;
    addMessage(selectedId, {
      sender: phone,
      text: input,
      image,
      timestamp: new Date().toISOString(),
    });
    setInput("");
    setImage(null);
    setIsTyping(true);
    setTimeout(() => {
      addMessage(selectedId, {
        sender: "Gemini AI",
        text: getFakeAIResponse(input),
        image: null,
        timestamp: new Date().toISOString(),
      });
      setIsTyping(false);
    }, 1200 + Math.random() * 1200); // random delay for realism
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select a valid image file.");
    }
  };

  const handleCopy = (msg) => {
    if (msg.text) {
      navigator.clipboard.writeText(msg.text);
      toast.success("Message copied!");
    }
  };


  return (
    <div className="relative flex flex-col h-[80vh] w-full max-w-2xl mx-auto rounded-3xl shadow-2xl overflow-hidden bg-white/60 dark:bg-gray-900/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-200/40 via-purple-200/30 to-pink-200/20 dark:from-blue-900/40 dark:via-purple-900/30 dark:to-pink-900/20 pointer-events-none" />
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-8 py-5 border-b bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white font-bold text-2xl shadow-md">
        <span className="tracking-wide drop-shadow-lg">{chatroom.name}</span>
        <div className="flex gap-2">
          <button
            className="bg-white/90 text-blue-700 px-4 py-1.5 rounded-lg hover:bg-blue-100 text-base font-semibold shadow transition"
            onClick={() => selectChatroom(null)}
            title="Exit Chatroom"
          >
            Exit
          </button>
          <button
            className="bg-red-500/90 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 text-base font-semibold shadow transition"
            onClick={() => { logout(); selectChatroom(null); }}
            title="Logout"
          >
            Logout
          </button>
        </div>
      </div>
      {/* Messages */}
      <div
        className="relative z-10 flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-transparent custom-scrollbar"
        ref={messagesContainerRef}
        style={{ display: "flex", flexDirection: "column-reverse" }}
      >
        <div ref={messagesEndRef} />
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[70%] rounded-2xl px-5 py-3 shadow-lg bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
              <span className="italic text-purple-500">Gemini is typing...</span>
            </div>
          </div>
        )}
        {paginatedMessages.slice().reverse().map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === phone ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-lg break-words relative group ${
                msg.sender === phone
                  ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white self-end"
                  : "bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
              }`}
              onMouseEnter={() => setCopyMsgIdx(idx)}
              onMouseLeave={() => setCopyMsgIdx(null)}
            >
              {msg.text && <div className="text-base leading-relaxed">{msg.text}</div>}
              {msg.image && (
                <img src={msg.image} alt="uploaded" className="mt-2 rounded-xl max-h-48 border border-gray-300 dark:border-gray-700 shadow" />
              )}
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-gray-400 dark:text-gray-400 font-mono">
                  {msg.timestamp && new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-xs text-gray-300 dark:text-gray-400 text-right font-mono">
                  {msg.sender === phone ? "You" : msg.sender}
                </div>
              </div>
              {copyMsgIdx === idx && msg.text && (
                <button
                  className="absolute top-2 right-2 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-xs text-gray-700 dark:text-gray-200 shadow hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                  onClick={() => handleCopy(msg)}
                >
                  Copy
                </button>
              )}
            </div>
          </div>
        ))}
        {hasMore && (
          <div className="flex justify-center my-2">
            <button
              className="px-4 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-mono shadow hover:bg-blue-100 dark:hover:bg-blue-900 transition"
              onClick={() => setPage((p) => p + 1)}
            >
              Load older messages
            </button>
          </div>
        )}
      </div>
      {/* Input */}
      <div className="relative z-10 p-5 border-t bg-white/80 dark:bg-gray-900/80 flex items-center gap-3 shadow-inner">
        <label className="cursor-pointer">
          <FiImage className="w-7 h-7 text-gray-500 hover:text-blue-500 transition" />
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </label>
        {image && (
          <img src={image} alt="preview" className="w-12 h-12 rounded-xl object-cover border border-gray-300 dark:border-gray-700 shadow" />
        )}
        <input
          className="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/90 dark:bg-gray-800/80 text-base shadow"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl px-6 py-3 flex items-center gap-2 shadow-lg text-lg font-bold transition-all duration-200"
          onClick={handleSend}
        >
          <FiSend />
        </button>
      </div>
      {/* Thinner custom scrollbar for a more decent UI */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 8px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #4f46e5; }
      `}</style>
    </div>
    
  );
}

export default Chatroom;

