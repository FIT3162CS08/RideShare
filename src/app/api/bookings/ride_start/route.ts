import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { BookingModel } from "@/models/Booking";

// The driver accepts a booking by adding it's id to it.
export async function POST(req: NextRequest) {
    await connectToDatabase();

    try {
        const body = await req.json();
        const { driverId, bookingId } = body;
        if (!driverId) {
            return NextResponse.json(
                { error: "Missing driverId" },
                { status: 400 }
            );
        }

        // Find booking and update
        const booking = await BookingModel.findById(bookingId);
        if (!booking) {
            return NextResponse.json(
                { error: "Booking not found" },
                { status: 404 }
            );
        }

        booking.driverId = driverId;
        booking.status = "riding"; // or "riding" if you immediately start the ride
        await booking.save();

        return NextResponse.json({ success: true, booking }, { status: 200 });
    } catch (err) {
        console.error("❌ Accept ride error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
