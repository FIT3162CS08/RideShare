"use client";
import { useUser } from "@/context/UserContext";
import { socket } from "@/socket/socket";
import React, { useEffect, useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";

export default function Message() {
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [activeChat, setActiveChat] = useState(null);

    const [newMessage, setNewMessage] = useState("");
    const [socketData, setSocketData] = useState({
        msg: null,
        conversationId: null,
    });
    const [loading, setLoading] = useState(false);
    const [reciever, setReciever] = useState();

    const { user } = useUser();

    // Fetch messages
    useEffect(() => {
        const fetchMessages = async () => {
            if (!user) return;
            try {
                // console.log(`/api/messages?driverId=${user.id}`, user)
                const res = await fetch(`/api/messages?driverId=${user._id}`);
                const conversations = await res.json();

                console.log("CONVERSATION: ", conversations)
                
                setConversations(conversations);
            } catch (err) {
                console.log("❌ Error fetching messages:", err);
            }
        };
        fetchMessages();

        // Listen for new messages
        socket.on("newMessage", ({ msg, conversationId }) => {
            setSocketData({ msg, conversationId });
        });

        if (user) {
            socket.emit("join", user.id);
        }

        return () => {
            socket.off("newMessage");
        };
    }, [user]);

    useEffect(() => {
        if (socketData.conversationId) {
            setConversations((c) =>
                c.map((conversation) =>
                    conversation._id == socketData.conversationId
                        ? {
                              ...conversation,
                              messages: [
                                  ...conversation.messages,
                                  socketData.msg,
                              ],
                          }
                        : conversation
                )
            );

            setSocketData({
                msg: null,
                conversationId: null,
            });
        }
    }, [socketData]);

    useEffect(() => {
        if (activeChat && conversations) {
            // refill the new messages
            setMessages(
                conversations.filter((c) => c._id === activeChat)[0].messages
            );

            setReciever(
                conversations
                    .filter((c) => c._id === activeChat)[0]
                    .participants.filter(({ _id }) => {
                        return _id != user.id;
                    })[0]._id
            );
        }
    }, [activeChat, conversations]);

    // Send new message
    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        if (!reciever || !user) return;

        console.log("SEND MESSAGE")
        socket.emit("message", {
            conversationId: activeChat,
            senderId: user.id,
            receiverId: reciever,
            newMessage,
        });
        console.log("SEND MESSAGE")
        setNewMessage("");

        return;
    };

    
    if (conversations.error) {
        console.log(conversations.error)
        return <h1></h1>
    }

    return (
        <div className="flex fixed h-64 w-1/2 right-5 bottom-5 border rounded-lg overflow-hidden shadow-md bg-white">
            {/* Sidebar */}
            <div className="w-1/4 border-r bg-gray-50 flex flex-col">
                <div className="px-4 py-3 border-b font-semibold text-gray-700">
                    Messages
                </div>
                <div className="flex-1 overflow-y-auto overflow-x-clip">
                    {conversations.map((conv) => (
                        <div
                            key={conv._id}
                            onClick={() => setActiveChat(conv._id)}
                            className={`p-3 border-b cursor-pointer hover:bg-gray-100 ${
                                activeChat === conv._id ? "bg-gray-200" : ""
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-800">
                                    {
                                        conv.participants.filter(
                                            (e) => e !== user.id
                                        )[0].name
                                    }
                                </span>
                                {conv.unread > 0 && (
                                    <span className="text-xs bg-blue-600 text-white rounded-full px-2 py-0.5">
                                        {conv.lastMessage}
                                    </span>
                                )}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                                {conv.lastMessage}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col ">
                {/* Header */}
                <div className="px-4 py-3 border-b bg-blue-600 text-white flex justify-between items-center">
                    <span className="font-semibold">
                        {
                            // activeChat &&
                            // conversations
                            //     .filter((c) => c._id === activeChat)[0]
                            //     .participants.filter(({ _id }) => {
                            //         return _id == user.id;
                            //     })[0].name
                        }
                    </span>
                    <span className="text-sm text-blue-100">Online</span>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-2">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${
                                msg.senderId === user.id
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`px-3 py-2 rounded-lg max-w-[70%] ${
                                    msg.senderId === user.id
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-800"
                                }`}
                            >
                                {msg.message}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className="border-t p-3 flex items-center bg-white">
                    <input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 border rounded-lg px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
