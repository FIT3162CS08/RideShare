import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { ConversationModel } from "./src/models/Conversation.ts";
import { DMessageModel } from "./src/models/DMessage.ts";
import { connectToDatabase } from "./src/lib/db.ts";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("message", async (data) => {
            connectToDatabase();
            try {
                const { conversationId, senderId, receiverId, newMessage } =
                    data;

                if (
                    !conversationId ||
                    !senderId ||
                    !receiverId ||
                    !newMessage
                ) {
                    console.log("ERROR MISSING FIELDS");
                    return socket.emit("error", {
                        error: "Missing required fields",
                    });
                }

                // Save message in DB
                const newMessageRes = await DMessageModel.create({
                    conversationId,
                    senderId,
                    receiverId,
                    message: newMessage,
                });

                // Update conversation
                await ConversationModel.findByIdAndUpdate(conversationId, {
                    lastMessage: newMessage,
                    updatedAt: Date.now(),
                });

                // Emit the new message to sender + receiver
                io.to(senderId).emit("newMessage", {
                    msg: newMessageRes,
                    conversationId,
                });
                io.to(receiverId).emit("newMessage", {
                    msg: newMessageRes,
                    conversationId,
                });
            } catch (err) {
                console.log("❌ Socket message error:", err);
                socket.emit("error", { error: "Server error" });
            }
        });

        // Join rooms based on userId (so you can emit only to that user)
        socket.on("join", (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined room ${userId}`);
        });
    });

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});
