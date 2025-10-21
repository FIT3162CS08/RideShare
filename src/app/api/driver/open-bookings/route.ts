import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { BookingModel } from "@/models/Booking";

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get all open bookings (no driver assigned)
    const openBookings = await BookingModel.find({ 
      open: true,
      driverId: { $in: [null, "unassigned"] }
    })
    .sort({ createdAt: -1 })
    .lean();

    return NextResponse.json(openBookings);
  } catch (error) {
    console.error("Error fetching open bookings:", error);
    return NextResponse.json({ error: "Failed to fetch open bookings" }, { status: 500 });
  }
}