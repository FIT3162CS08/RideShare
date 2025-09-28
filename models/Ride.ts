import mongoose, { Schema, Document, Model } from "mongoose";

// Define a TypeScript interface for Ride documents
export interface IRide extends Document {
  passenger: mongoose.Types.ObjectId;   // User ID (who booked the ride)
  driver: mongoose.Types.ObjectId;      // User ID (who drives the ride)
  vehicle: mongoose.Types.ObjectId;     // Reference to a Vehicle
  origin: {
    address: string;
    lat: number;
    lng: number;
  };
  destination: {
    address: string;
    lat: number;
    lng: number;
  };
  status: "requested" | "accepted" | "ongoing" | "completed" | "cancelled";
  fare: number;
  requestedAt: Date;
  completedAt?: Date;
}

// Define the schema
const RideSchema: Schema<IRide> = new Schema(
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

// Avoid model overwrite errors in dev (Next.js hot reload)
const Ride: Model<IRide> =
  mongoose.models.Ride || mongoose.model<IRide>("Ride", RideSchema);

export default Ride;