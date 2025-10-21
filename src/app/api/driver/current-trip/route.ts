import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { TripModel } from "@/models/Trip";
import { UserModel } from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get the user ID from the request (you'll need to pass this from the frontend)
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }
    
    // Find the driver's current trip
    const trip = await TripModel.findOne({
      driverId: userId,
      status: { $in: ["waiting", "picked_up"] }
    })
    .populate('riderId', 'name phone')
    .lean();

    if (!trip) {
      return NextResponse.json({ error: "No current trip found" }, { status: 404 });
    }

    let riderName = "Rider";
    let riderPhone = null;

    if (trip.riderId) {
      const rider = await UserModel.findById(trip.riderId).lean();
      if (rider) {
        riderName = rider.name || riderName;
        riderPhone = rider.phone || riderPhone;
      }
    }

    // Combine trip info with rider details
    const formattedTrip = {
      ...trip,
      riderName,
      riderPhone,
    };

    return NextResponse.json(formattedTrip);
  } catch (error) {
    console.error("Error fetching driver's current trip:", error);
    return NextResponse.json({ error: "Failed to fetch current trip" }, { status: 500 });
  }
}