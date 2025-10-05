import mongoose, { Schema, Model, InferSchemaType } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "driver", "admin"], default: "user" },
    address: { type: String },
    birthday: { type: String },
    pushNotifs: { type: Boolean, default: true },
    saveReceipts: { type: Boolean, default: false },
    card: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type User = InferSchemaType<typeof UserSchema> & { _id: string };

export const UserModel: Model<User> =
  (mongoose.models.User as Model<User>) || mongoose.model<User>("User", UserSchema);
