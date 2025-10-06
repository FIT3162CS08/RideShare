import mongoose from "mongoose";
const { Schema, Model, InferSchemaType } = mongoose;

const DMessageSchema = new mongoose.Schema({
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

export type DMessage = InferSchemaType<typeof DMessageSchema> & { _id: string };

export const DMessageModel: Model<DMessage> =
    (mongoose.models.DMessage as Model<DMessage>) ||
    mongoose.model<DMessage>("DMessage", DMessageSchema);
