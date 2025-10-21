import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/models/User";
import { TripModel } from "@/models/Trip";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }
    
    // Get user with populated drive history
    const user = await UserModel.findById(userId).exec();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get drive history with error handling
    let driveHistory = [];
    if (user.driveHistory && user.driveHistory.length > 0) {
      try {
        driveHistory = await TripModel.find({
          _id: { $in: user.driveHistory }
        })
        .sort({ createdAt: -1 })
        .lean();
      } catch (populateError) {
        console.error("Error populating drive history:", populateError);
        driveHistory = [];
      }
    }

    return NextResponse.json({ driveHistory });
  } catch (error) {
    console.error("Error fetching drive history:", error);
    return NextResponse.json({ error: "Failed to fetch drive history" }, { status: 500 });
  }
}