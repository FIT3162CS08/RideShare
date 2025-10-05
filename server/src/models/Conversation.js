import mongoose from "mongoose";

const { Schema, models, model } = mongoose;

const conversationSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // could be user + driver
        },
    ],
    lastMessage: {
        type: String,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Avoid model overwrite errors in dev (e.g., Next.js hot reload)
const Conversation =
    models.Conversation || model("Conversation", conversationSchema);

export default Conversation;
