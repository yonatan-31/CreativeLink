import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import ClientProjects from "@/models/clientProjects";
import Application from "@/models/application";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params; // client project id
    const body = await req.json();
    const { applicationId } = body;
    if (!applicationId)
      return NextResponse.json(
        { message: "applicationId required" },
        { status: 400 }
      );

    await connectDB();
    const proj = await ClientProjects.findById(id);
    if (!proj)
      return NextResponse.json(
        { message: "Client project not found" },
        { status: 404 }
      );
    if (proj.clientId.toString() !== session.user.id)
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    // mark selected application accepted and close others
    const app = await Application.findById(applicationId);
    if (!app)
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );

    app.status = "accepted";
    await app.save();

    // reject other applications
    await Application.updateMany(
      { clientProjectId: id, _id: { $ne: applicationId } },
      { $set: { status: "rejected" } }
    );

    proj.status = "in_progress";
    await proj.save();

    return NextResponse.json({ message: "Designer selected" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Accept POST from forms as well
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const data = await req.formData();
    const applicationId = data.get("applicationId") as string | null;
    if (!applicationId)
      return NextResponse.json(
        { message: "applicationId required" },
        { status: 400 }
      );

    // reuse PATCH logic by calling the same flow
    // Build a synthetic request body and call PATCH handler logic inline
    const session = await auth();
    if (!session || !session.user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectDB();
    const proj = await ClientProjects.findById(id);
    if (!proj)
      return NextResponse.json(
        { message: "Client project not found" },
        { status: 404 }
      );
    //check if the posted project belongs to the client
    if (proj.clientId.toString() !== session.user.id)
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const app = await Application.findById(applicationId);
    if (!app)
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );

    app.status = "accepted";
    await app.save();

    await Application.updateMany(
      { clientProjectId: id, _id: { $ne: applicationId } },
      { $set: { status: "rejected" } }
    );

    proj.status = "in_progress";
    await proj.save();

    return NextResponse.redirect(
      `/dashboard/client/projects/${id}/applications`
    );
  } catch (err) {
    console.error(err);
    return NextResponse.redirect(
      new URL(`/dashboard/client/projects/${id}/applications`, req.url)
    );
  }
}
