import mongoose, { Schema, Model, InferSchemaType } from "mongoose";

const TripSchema = new Schema(
  {
    riderName: { type: String },
    driverName: { type: String },
    riderId: { type: String, required: true },
    driverId: { type: String, required: true },
    pickup: { type: String, required: true },
    dropoff: { type: String, required: true },
    fare: { type: Number, required: true },
    status: { type: String, enum: ["waiting", "picked_up", "completed", "cancelled"], default: "waiting" },
  },
  { timestamps: true }
);

export type Trip = InferSchemaType<typeof TripSchema> & { _id: string };

export const TripModel: Model<Trip> =
  (mongoose.models.Trip as Model<Trip>) || mongoose.model<Trip>("Trip", TripSchema);


