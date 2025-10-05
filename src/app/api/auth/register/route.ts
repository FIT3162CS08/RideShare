import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { email, password, name, phone, address, birthday } = await req.json();

  // Basic validation
  if (!email || !password || !name || !phone || !address || !birthday) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const existing = await UserModel.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 400 });
  }

  // Hash password
  const hashed = await bcrypt.hash(password, 10);

  // Create user with extra fields and hardcoded booleans
  const user = await UserModel.create({
    email,
    password: hashed,
    name,
    phone,
    address,
    birthday,
    pushNotifs: true,
    saveReceipts: true,
    card: true,
    bookings: [],
  });

  // const payload = { id: user._id.toString(), email: user.email, name: user.name };

  // Create JWT token
  const token = signToken({ id: user._id.toString() });

  const res = NextResponse.json({user});
  res.cookies.set("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    path: "/",
    sameSite: "lax",
  });

  return res;
}
