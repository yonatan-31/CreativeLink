import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import ProjectRequest from "@/models/projectRequest";
import Review from "@/models/review";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get project requests from the current client
    const projects = await ProjectRequest.find({ clientId: session.user.id })
      .populate("designerId", "_id name")
      .sort({ createdAt: -1 });

    const reviews = await Review.find({ clientId: session.user.id });
    const reviewedIds = new Set(reviews.map((r) => r.projectId.toString()));

    const projectsWithReviewStatus = projects.map((p) => ({
      ...p.toObject(),
      reviewed: reviewedIds.has(p._id.toString()),
    }));

    return NextResponse.json(projectsWithReviewStatus);
  } catch (error) {
    console.error("Error fetching client project requests:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
