import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { BookingModel } from "@/models/Booking";
import { TripModel } from "@/models/Trip";
import { UserModel } from "@/models/User";
import { z } from "zod";

const AcceptBookingSchema = z.object({
  bookingId: z.string(),
  driverId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const parsed = AcceptBookingSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const { bookingId, driverId } = parsed.data;

    // Find the booking
    const booking = await BookingModel.findById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (!booking.open) {
      return NextResponse.json({ error: "Booking is no longer open" }, { status: 400 });
    }

    // Update booking to assign driver
    booking.driverId = driverId;
    booking.open = false;
    await booking.save();

    // Update the trip with driver details
    if (booking.tripId) {
      const trip = await TripModel.findById(booking.tripId);
      if (trip) {
        trip.driverId = driverId;
        trip.status = "waiting";
        await trip.save();
      }
    }

    // Add trip to driver's drive history
    await UserModel.findByIdAndUpdate(driverId, {
      $push: { driveHistory: booking.tripId }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Booking accepted successfully",
      booking: booking
    });
  } catch (error) {
    console.error("Error accepting booking:", error);
    return NextResponse.json({ error: "Failed to accept booking" }, { status: 500 });
  }
}