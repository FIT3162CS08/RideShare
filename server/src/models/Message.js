import mongoose from "mongoose";

const { Schema, models, model } = mongoose;

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // could also be Driver, but you can unify as "User"
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    seen: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Avoid model overwrite errors in dev (e.g., Next.js hot reload)
const Message = models.Message || model("Message", messageSchema);

export default Message;
