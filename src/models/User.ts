import mongoose, { Schema, Model, InferSchemaType } from "mongoose";

const ReviewSchema = new Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, maxlength: 500 },
  reviewerId: { type: String, required: true },
  reviewerName: { type: String, required: true },
  tripId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "driver", "admin"], default: "user" },
    address: { type: String, required: true },
    birthday: { type: String, required: true },
    pushNotifs: { type: Boolean, required: true, default: true },
    saveReceipts: { type: Boolean, required: true, default: false },
    card: { type: Boolean, required: true, default: true },
    bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
    reviews: [ReviewSchema], // Array of reviews received as a driver
  },
  { timestamps: true }
);

export type User = InferSchemaType<typeof UserSchema> & { _id: string };

export type UserType = Omit<User, "createdAt" | "updatedAt"> | null;

export const UserModel: Model<User> =
  (mongoose.models.User as Model<User>) || mongoose.model<User>("User", UserSchema);
