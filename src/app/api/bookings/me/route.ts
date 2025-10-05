import { connectToDatabase } from "@/lib/db";
import { BookingModel } from "@/models/Booking";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    console.log("USER ID: ", userId);

    if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    try {
        const trips = await BookingModel.find({
            $or: [{ userId: userId }],
            status: { $nin: ["completed"] },
        })
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(trips);
    } catch (err) {
        console.error("❌ GET trips error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
