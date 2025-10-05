import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt, {MyJwtPayload} from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/models/User";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as MyJwtPayload;

    await connectToDatabase();

    // Fetch the full user from DB
    const user = await UserModel.findById(decoded.id).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}