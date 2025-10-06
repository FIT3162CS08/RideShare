import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { BookingModel } from "@/models/Booking";
import { TripModel } from "@/models/Trip";
import { UserModel } from "@/models/User";
import { z } from "zod";

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
  let fare = estimateFareKm(distanceKm, data.rideType);
  const pplFactor = 1 + (data.passengers - 1) * 0.07;
  const luggageFactor = 1 + data.luggage * 0.03;
  const scheduleFactor = data.whenNow ? 1 : 1.08;
  fare = fare * pplFactor * luggageFactor * scheduleFactor;
  if ((data.promo || "").trim().toUpperCase() === "WELCOME10") fare *= 0.9;

  const booking = await BookingModel.create({
    ...data,
    fareEstimate: Math.round(fare * 100) / 100,
    userId: data.userId,
  });

  // Find or create a default driver
  let driver = await UserModel.findOne({ role: "driver" });
  if (!driver) {
    // Create a default driver if none exists
    driver = await UserModel.create({
      name: "John D.",
      email: "john.driver@rideshare.com",
      phone: "0412345678",
      password: "password123", // In real app, this would be hashed
      role: "driver",
      address: "123 Driver St, Melbourne VIC 3000",
      birthday: "1990-01-01",
    });
  }

  // Get rider information
  const rider = data.userId ? await UserModel.findById(data.userId) : null;

  // Create a Trip placeholder linked to this booking
  const trip = await TripModel.create({
    pickup: booking.pickup,
    dropoff: booking.dropoff,
    fare: booking.fareEstimate,
    riderId: data.userId || "unknown",
    driverId: driver._id.toString(),
    riderName: rider?.name || "Rider",
    driverName: driver.name,
  });
  booking.tripId = trip._id;
  await booking.save();

  return NextResponse.json({ bookingId: booking._id, tripId: trip._id, fare: booking.fareEstimate });
}


