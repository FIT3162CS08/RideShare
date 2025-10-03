import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { email, password } = await req.json();

  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // const token = jwt.sign(
  //   { id: user._id.toString(), email: user.email, name: user.name },
  //   process.env.JWT_SECRET!,
  //   { expiresIn: "1d" }
  // );
  const payload = { id: user._id.toString(), email: user.email, name: user.name };
  
  const token = signToken(payload);

  const res = NextResponse.json(payload);
  res.cookies.set("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    path: "/",
    sameSite: "lax",
  });
  return res;
}
