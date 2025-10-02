import mongoose, { Schema, Model, InferSchemaType } from "mongoose";

const MessageSchema = new Schema(
  {
    tripId: { type: Schema.Types.ObjectId, ref: "Trip", required: true },
    sender: { type: String, enum: ["rider", "driver"], required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export type Message = InferSchemaType<typeof MessageSchema> & { _id: string };

export const MessageModel: Model<Message> =
  (mongoose.models.Message as Model<Message>) || mongoose.model<Message>("Message", MessageSchema);


