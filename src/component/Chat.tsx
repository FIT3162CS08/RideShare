"use client";

import React, { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  text: string;
  sender: "rider" | "driver";
  timestamp: Date;
}

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
  riderName: string;
  driverName: string;
  role: "rider" | "driver";
}

const Chat: React.FC<ChatProps> = ({ isOpen, onClose, riderName, driverName, role }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Hi ${role === "rider" ? driverName : riderName}! I'm on my way to the pickup location.`,
      sender: role === "rider" ? "driver" : "rider",
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    },
    {
      id: "2",
      text: "Thanks! I'll be waiting at the main entrance.",
      sender: role,
      timestamp: new Date(Date.now() - 240000), // 4 minutes ago
    },
    {
      id: "3",
      text: "Perfect! I should be there in about 3 minutes. Look for a blue sedan.",
      sender: role === "rider" ? "driver" : "rider",
      timestamp: new Date(Date.now() - 120000), // 2 minutes ago
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: role,
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Simulate response from the other party
    setTimeout(() => {
      const responses = [
        "Got it, thanks!",
        "I'll be there shortly.",
        "Sounds good!",
        "No problem.",
        "I'm running a bit late, will be there in 5 minutes.",
        "I'm here! Look for me near the entrance.",
      ];
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: role === "rider" ? "driver" : "rider",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, response]);
    }, 1000 + Math.random() * 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="glass-strong rounded-3xl shadow-2xl w-full max-w-md h-[600px] flex flex-col overflow-hidden border border-white/30 animate-scaleIn">
        {/* Header with Gradient */}
        <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">
                  {role === "rider" ? driverName : riderName}
                </h3>
                <p className="text-xs text-white/80 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Active now
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all transform hover:scale-110 border border-white/30"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages with beautiful styling */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.sender === role ? "justify-end" : "justify-start"} animate-fadeIn`}
              style={{animationDelay: `${index * 0.05}s`}}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all ${
                  message.sender === role
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-sm"
                    : "bg-white text-gray-900 border border-gray-200 rounded-bl-sm"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className={`text-xs mt-1 flex items-center gap-1 ${
                  message.sender === role ? "text-white/70" : "text-gray-500"
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {message.sender === role && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  )}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Enhanced Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:bg-white transition-all text-sm"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-110 disabled:transform-none shadow-md"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
