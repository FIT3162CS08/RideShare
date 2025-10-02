import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { MessageModel } from "@/models/Message";
import { z } from "zod";

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const tripId = req.nextUrl.searchParams.get("tripId");
  if (!tripId) return NextResponse.json({ error: "tripId required" }, { status: 400 });
  const list = await MessageModel.find({ tripId }).sort({ createdAt: 1 }).lean();
  return NextResponse.json(list);
}

const MessageInput = z.object({ tripId: z.string(), sender: z.enum(["rider", "driver"]), text: z.string().min(1) });

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const body = await req.json();
  const parsed = MessageInput.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const created = await MessageModel.create(parsed.data);
  return NextResponse.json(created);
}


