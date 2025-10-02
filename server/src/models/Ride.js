import mongoose from "mongoose";

const { Schema, models, model } = mongoose;

const RideSchema = new Schema(
  {
    passenger: { type: Schema.Types.ObjectId, ref: "User", required: true },
    driver: { type: Schema.Types.ObjectId, ref: "User" },
    vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle" },

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
      enum: ["requested", "accepted", "ongoing", "completed", "cancelled"],
      default: "requested",
    },

    fare: { type: Number, required: true },

    requestedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

// Avoid model overwrite errors in dev (e.g., Next.js hot reload)
const Ride = models.Ride || model("Ride", RideSchema);

export default Ride;