import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/user";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

  const body = await req.json();
  const role = body.role;
  const avatarUrl = body.avatarUrl;
    if (!role || (role !== "client" && role !== "designer")) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.role = role;
    if (avatarUrl) {
      user.avatarUrl = avatarUrl;
    }
    await user.save();

    return NextResponse.json({ ok: true });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
