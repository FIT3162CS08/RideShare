import { NextRequest, NextResponse } from "next/server";
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

export async function PUT(req: NextRequest) {
  await connectToDatabase();

  const token = req.cookies.get("access_token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  const body = await req.json();

  // Only update allowed fields
  const updateData = {
    name: body.name,
    phone: body.phone,
    email: body.email,
    birthday: body.birthday,
    address: body.address,
    pushNotifs: body.pushNotifs,
    saveReceipts: body.saveReceipts,
    card: body.card === "card",
  };

  const updatedUser = await UserModel.findByIdAndUpdate(decoded.id, { $set: updateData }, { new: true }).lean();

  if (!updatedUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ user: updatedUser });
}
