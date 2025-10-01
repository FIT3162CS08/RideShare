import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { TripModel } from "@/models/Trip";
import { z } from "zod";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const trip = await TripModel.findById(params.id).lean();
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(trip);
}

const UpdateSchema = z.object({ status: z.enum(["waiting", "picked_up", "completed", "cancelled"]).optional() });

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const body = await req.json();
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const updated = await TripModel.findByIdAndUpdate(params.id, parsed.data, { new: true }).lean();
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}


