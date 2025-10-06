import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { BookingModel } from "@/models/Booking";
import { TripModel } from "@/models/Trip";
import { UserModel } from "@/models/User";
import { z } from "zod";

const BookingInput = z.object({
  pickup: z.string().min(2),
  dropoff: z.string().min(2),
  distanceKm: z.number(),
  fare: z.number(),
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

export async function GET() {
  await connectToDatabase();
  const list = await BookingModel.find().sort({ createdAt: -1 }).limit(50).lean();
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const json = await req.json();
    const parsed = BookingInput.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;

    const booking = await BookingModel.create({
      ...data,
      open: true,
      fare: Math.round(data.fare * 100) / 100,
    });

    // return full booking document (as plain JSON)
    return NextResponse.json({
      ...booking.toObject(),
      open: true,
      bookingId: booking._id,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
