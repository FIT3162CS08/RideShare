import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { BookingModel } from "@/models/Booking";
import { TripModel } from "@/models/Trip";
import { z } from "zod";
import { UserModel } from "@/models/User";

const BookingInput = z.object({
  pickup: z.string().min(2),
  dropoff: z.string().min(2),
  whenNow: z.boolean(),
  date: z.string().optional(),
  time: z.string().optional(),
  rideType: z.enum(["standard", "xl", "premium"]),
  passengers: z.number().min(1).max(6),
  luggage: z.number().min(0).max(6),
  phone: z.string().min(6),
  notes: z.string().optional().default(""),
  promo: z.string().optional().default(""),
  payment: z.enum(["card", "cash"]).default("card"),
  userId: z.string().optional(),
});

function estimateFareKm(km: number, rideType: "standard" | "xl" | "premium") {
  const base = rideType === "premium" ? 7.5 : rideType === "xl" ? 5.5 : 4.0;
  const start = rideType === "premium" ? 7 : rideType === "xl" ? 4 : 3;
  return (start + km * base) * 1.1; // +GST
}

function estimateDistanceKm(pickup: string, dropoff: string) {
  if (!pickup || !dropoff) return 0;
  const s = Math.abs(pickup.length - dropoff.length) + Math.min(pickup.length, dropoff.length) * 0.1;
  return Math.max(2, Math.min(18, Math.round(s)));
}

export async function GET() {
  await connectToDatabase();
  const list = await BookingModel.find().sort({ createdAt: -1 }).limit(50).lean();
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const json = await req.json();
  const parsed = BookingInput.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const distanceKm = estimateDistanceKm(data.pickup, data.dropoff);
 let fare = typeof json.fare === "number" ? json.fare : estimateFareKm(distanceKm, data.rideType);
  const pplFactor = 1 + (data.passengers - 1) * 0.07;
  const luggageFactor = 1 + data.luggage * 0.03;
  const scheduleFactor = data.whenNow ? 1 : 1.08;
  fare = fare * pplFactor * luggageFactor * scheduleFactor;
  if ((data.promo || "").trim().toUpperCase() === "WELCOME10") fare *= 0.9;

  const finalFare = Math.round(fare * 100) / 100;
  
  const booking = await BookingModel.create({
    ...data,
    fare: finalFare,
    userId: data.userId,
  });

  // Create a Trip placeholder linked to this booking
  const trip = await TripModel.create({
    pickup: booking.pickup,
    dropoff: booking.dropoff,
    fare: finalFare,
    riderId: data.userId || "guest",
    driverId: "unassigned",
  });
  
  // Link trip to booking
  booking.tripId = trip._id as any;
  await booking.save();

  if (data.userId) {
    console.log("FROMAPI", JSON.stringify(data));
    console.log("Trip ID to set:", trip._id);

    try {
      // First, let's check the user before update
      const userBefore = await UserModel.findById(data.userId).exec();
      console.log("User before update:", userBefore?.toObject());
      console.log("User before currentTrip:", userBefore?.currentTrip);

      const updatedUser = await UserModel.findByIdAndUpdate(
        data.userId,
        { $set: { currentTrip: trip._id } },
        { new: true, runValidators: true, useFindAndModify: false }
      ).exec();

      if (updatedUser) {
        console.log("Updated user with currentTrip:", updatedUser.toObject());
        console.log("currentTrip field exists:", 'currentTrip' in updatedUser);
        console.log("currentTrip value:", updatedUser.currentTrip);
        console.log("currentTrip type:", typeof updatedUser.currentTrip);
        
        // Double-check by querying the user again
        const verifyUser = await UserModel.findById(data.userId).exec();
        console.log("Verification query - currentTrip:", verifyUser?.currentTrip);
      } else {
        console.error("Failed to update user - user not found:", data.userId);
      }
    } catch (error) {
      console.error("Error updating user currentTrip:", error);
    }
  }

  
  return NextResponse.json({ bookingId: booking._id, tripId: trip._id, fare: finalFare });
}


