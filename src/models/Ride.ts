import mongoose, { Schema, Model, InferSchemaType } from "mongoose";

// After the driver accepts it. Visible to passenger and driver
const RideSchema = new Schema(
    {
        passenger: { type: Schema.Types.ObjectId, ref: "User", required: true },
        driver: { type: Schema.Types.ObjectId, ref: "User" },

        /*
        origin: {
            address: { type: String, required: true },
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },
        destination: {
            address: { type: String, required: true },
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },

        status: {
            type: String,
            enum: ["requested", "accepted", "completed", "cancelled"],
            default: "requested",
        },

        fare: { type: Number, required: true },
        */

        requestedAt: { type: Date, default: Date.now },
        completedAt: { type: Date },
    },
    { timestamps: true }
);

export type Ride = InferSchemaType<typeof RideSchema> & { _id: string };

export const RideModel: Model<Ride> =
    (mongoose.models.Ride as Model<Ride>) ||
    mongoose.model<Ride>("Ride", RideSchema);
