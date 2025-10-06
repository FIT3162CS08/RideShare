import { connectToDatabase } from "@/lib/db";
import { BookingModel } from "@/models/Booking";
import { UserModel } from "@/models/User"; // 👈 import the User model
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        console.log("/portal route");
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const driverId = searchParams.get("driverId"); // 🔹 e.g. /api/trips?userId=123

        // Get today's date in YYYY-MM-DD format
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];

        const userss = await UserModel.find({ name: "a" });

        const trips = await BookingModel.find({
            status: { $nin: ["waiting", "riding", "completed"] },
            date: { $gte: todayStr },
        })
            .populate("userId", "name rating ratingCount profilePic") // 👈 fetch only the needed fields from User
            .sort({ createdAt: -1 })
            .lean();

        const myTrips = await BookingModel.find({
            driverId: driverId,
            status: { $in: ["waiting"] },
            date: { $gte: todayStr },
        })
            .populate("userId", "name rating ratingCount profilePic") // 👈 fetch only the needed fields from User
            .sort({ createdAt: -1 })
            .lean();

        // Also fetch accepted rides --
        const activeRides = await BookingModel.find({
            driverId: driverId,
            status: { $in: ["riding"] },
            date: { $gte: todayStr },
        });

        return NextResponse.json({ trips, myTrips, activeRides });
    } catch (err) {
        console.error("❌ GET /api/bookings/me error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
