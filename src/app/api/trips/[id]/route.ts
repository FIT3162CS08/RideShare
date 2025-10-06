import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { TripModel } from "@/models/Trip";
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
  return NextResponse.json(updated);
}


