import mongoose, { Schema, Model, InferSchemaType } from "mongoose";

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        role: {
            type: String,
            enum: ["user", "driver", "admin"],
            default: "user",
        },

        // 🔹 Ratings (avg rating + count)
        rating: { type: Number, default: 0 }, // average rating
        ratingCount: { type: Number, default: 0 },

        // 🔹 Profile info
        description: { type: String }, // about me / bio
        phone: { type: String },
        profilePic: {
            type: String,
            default:
                "https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4855.jpg",
        },

        // 🔹 Accessibility / Mobility
        disabilityDescription: { type: String },

        // 🔹 Driver-specific fields
        licenseNumber: { type: String },
        vehicleInfo: {
            make: { type: String },
            model: { type: String },
            plate: { type: String },
            year: { type: Number },
        },

        // 🔹 General settings
        isActive: { type: Boolean, default: true },
        lastLogin: { type: Date },
    },
    { timestamps: true }
);

export type User = InferSchemaType<typeof UserSchema> & { _id: string };
export type UserType = User | null;

export const UserModel: Model<User> =
    (mongoose.models.User as Model<User>) || mongoose.model("User", UserSchema);
