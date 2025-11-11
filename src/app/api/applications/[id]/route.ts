import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Application from "@/models/application";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { coverLetter } = body;
    if (coverLetter == null)
      return NextResponse.json(
        { message: "coverLetter required" },
        { status: 400 }
      );

    await connectDB();
    const app = await Application.findById(id);
    if (!app)
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    if (app.designerId.toString() !== session.user.id)
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    app.coverLetter = coverLetter;
    await app.save();
    await app.populate("clientProjectId");
    return NextResponse.json({ application: app });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = params;
    await connectDB();
    const app = await Application.findById(id);
    if (!app)
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    if (app.designerId.toString() !== session.user.id)
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    await Application.deleteOne({ _id: id });
    return NextResponse.json({ message: "Application withdrawn" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
