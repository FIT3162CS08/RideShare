import mongoose, { Schema, Model, InferSchemaType } from "mongoose";

/* 
    This will be the list of bookings visible to the driver.
    When accepted it creates a Ride (ride.bookingId) which 
    has the details like: 
*/
const BookingSchema = new Schema(
    {
        // Destinations and Time
        pickup: { type: String, required: true },
        dropoff: { type: String, required: true },
        whenNow: { type: Boolean, default: true },
        date: { type: String },
        time: { type: String },

        // car details
        rideType: {
            type: String,
            enum: ["standard", "xl", "premium"],
            default: "standard",
        },
        passengers: { type: Number, default: 1 },
        luggage: { type: Number, default: 0 },
        phone: { type: String, required: true },
        notes: { type: String },
        promo: { type: String },
        payment: { type: String, enum: ["card", "cash"], default: "card" },
        fareEstimate: { type: Number, required: true },

        status: {
            type: String,
            enum: ["requested", "waiting", "riding", "completed"],
            default: "requested",
        },

        // FK
        // tripId: { type: Schema.Types.ObjectId, ref: "Trip" }, // Should Trip reference Booking or Booking reference Trip?
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        driverId: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

export type Booking = InferSchemaType<typeof BookingSchema> & { _id: string };

export const BookingModel: Model<Booking> =
    (mongoose.models.Booking as Model<Booking>) ||
    mongoose.model<Booking>("Booking", BookingSchema);
