import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { TripModel } from "@/models/Trip";
import { UserModel } from "@/models/User";
import { z } from "zod";
import mongoose from "mongoose";

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await context.params;
  
  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid trip ID format" }, { status: 400 });
  }
  
  const trip = await TripModel.findById(id).lean();
  if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  return NextResponse.json(trip);
}

const UpdateSchema = z.object({ status: z.enum(["waiting", "picked_up", "completed", "cancelled"]).optional() });

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const body = await req.json();
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  
  const { id } = await context.params;
  
  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid trip ID format" }, { status: 400 });
  }
  
  const updated = await TripModel.findByIdAndUpdate(id, parsed.data, { new: true }).lean();
  if (!updated) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  
  // If trip is completed, add to user trip history
  if (parsed.data.status === "completed") {
    try {
      // Add to rider's trip history
      if (updated.riderId && updated.riderId !== "guest") {
        await UserModel.findByIdAndUpdate(updated.riderId, {
          $push: { tripHistory: id },
          $unset: { currentTrip: 1 } // Clear current trip
        });
      }
      
      // Add to driver's drive history
      if (updated.driverId && updated.driverId !== "unassigned") {
        await UserModel.findByIdAndUpdate(updated.driverId, {
          $push: { driveHistory: id }
        });
      }
    } catch (error) {
      console.error("Error updating user history:", error);
      // Don't fail the request if history update fails
    }
  }
  
  return NextResponse.json(updated);
}


