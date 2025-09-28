import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    name:  { type: String, required: true },
    role:  { type: String, enum: ["rider","driver"], default: "rider", index: true },
    phone: String,
    // Profile fields
    bio: String,
    photo: String, // URL
    address: {
      street: String, city: String, state: String, zip: String,
    },
  },
  { timestamps: true }
);

// Avoid OverwriteModelError in dev/hot-reload
export default models.User || model("User", UserSchema);