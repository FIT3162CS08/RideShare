import mongoose, { Schema, Model, InferSchemaType } from "mongoose";

const BookingSchema = new Schema(
  {
    pickup: { type: String, required: true },
    dropoff: { type: String, required: true },
    whenNow: { type: Boolean, default: true },
    date: { type: String },
    time: { type: String },
    rideType: { type: String, enum: ["standard", "xl", "premium"], default: "standard" },
    passengers: { type: Number, default: 1 },
    luggage: { type: Number, default: 0 },
    phone: { type: String, required: true },
    notes: { type: String },
    promo: { type: String },
    payment: { type: String, enum: ["card", "cash"], default: "card" },
    fare: { type: Number, required: true },
    status: { type: String, enum: ["requested", "accepted", "completed", "cancelled"], default: "requested" },
    open: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type Booking = InferSchemaType<typeof BookingSchema> & { _id: string };

export const BookingModel: Model<Booking> =
  (mongoose.models.Booking as Model<Booking>) || mongoose.model<Booking>("Booking", BookingSchema);


