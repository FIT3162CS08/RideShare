import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/models/User";
import { TripModel } from "@/models/Trip";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const userId = params.id;
    
    // Get user first
    const user = await UserModel.findById(userId).exec();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get trip history with error handling
    let tripHistory = [];
    if (user.tripHistory && user.tripHistory.length > 0) {
      try {
        tripHistory = await TripModel.find({
          _id: { $in: user.tripHistory }
        })
        .sort({ createdAt: -1 })
        .lean();
      } catch (populateError) {
        console.error("Error populating trip history:", populateError);
        // Return empty array if populate fails
        tripHistory = [];
      }
    }

    return NextResponse.json({ tripHistory });
  } catch (error) {
    console.error("Error fetching trip history:", error);
    return NextResponse.json({ error: "Failed to fetch trip history" }, { status: 500 });
  }
}