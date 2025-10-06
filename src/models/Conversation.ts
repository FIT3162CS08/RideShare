import mongoose from "mongoose";
const { Schema, Model, InferSchemaType } = mongoose;

const ConversationSchema = new mongoose.Schema({
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

export type Conversation = InferSchemaType<typeof ConversationSchema> & {
    _id: string;
};

export const ConversationModel: Model<Conversation> =
    (mongoose.models.Conversation as Model<Conversation>) ||
    mongoose.model<Conversation>("Conversation", ConversationSchema);
