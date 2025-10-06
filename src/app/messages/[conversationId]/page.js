"use client";
import { useUser } from "@/context/UserContext";
import { socket } from "@/socket/socket";
import React, { useEffect, useState } from "react";

export default function MessagesPage({ params }) {
    const { conversationId } = React.use(params);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [sender, setSender] = useState();

    const { user } = useUser();

    // Fetch messages
    useEffect(() => {
        const fetchMessages = async () => {
            if (!user) return;
            try {
                const res = await fetch(
                    `/api/messages?conversationId=${conversationId}`
                );
                const data = await res.json();
                setSender(
                    data.conversation.participants.filter(
                        (p) => p != user.id
                    )[0]
                );

                setMessages(data.messages);
            } catch (err) {
                console.error("❌ Error fetching messages:", err);
            }
        };
        fetchMessages();

        // Listen for new messages
        socket.on("newMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        if (user) {
            socket.emit("join", user.id);
        }

        return () => {
            socket.off("newMessage");
        };
    }, [conversationId, user]);

    // Send new message
    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        if (!sender || !user) return;
        console.log("EMITTED");
        socket.emit("message", {
            conversationId,
            senderId: user.id,
            receiverId: sender,
            newMessage,
        });

        return;
        setLoading(true);
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    conversationId,
                    senderId: user.id, // TODO: replace with logged-in user
                    receiverId: sender, // TODO: replace with other user
                    message: newMessage,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessages((prev) => [...prev, data]);
                setNewMessage("");
            } else {
                console.error("❌ Failed to send message:", data.error);
            }
        } catch (err) {
            console.error("❌ Error sending message:", err);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col h-screen max-w-md mx-auto border rounded-lg shadow">
            {/* Messages list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
                {messages.length === 0 && (
                    <p className="text-gray-400 text-center">
                        No messages yet...
                    </p>
                )}
                {messages.map((msg) => (
                    <div
                        key={msg._id}
                        className={`p-2 rounded-lg max-w-[70%] ${
                            msg.senderId === user.id
                                ? "bg-blue-500 text-white self-end ml-auto"
                                : "bg-gray-200 text-black"
                        }`}
                    >
                        {msg.message}
                    </div>
                ))}
            </div>

            {/* Input box */}
            <div className="flex p-3 border-t bg-white">
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2 focus:outline-none"
                />
                <button
                    onClick={sendMessage}
                    disabled={loading}
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
