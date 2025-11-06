import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Review from "@/models/review";
import ProjectRequest from "@/models/projectRequest";
import designerProfile from "@/models/designerProfile";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const designerId = searchParams.get("designerId");

    if (!designerId) {
      return NextResponse.json(
        { message: "Designer ID is required" },
        { status: 400 }
      );
    }

    const reviews = await Review.find({ designerId })
      .populate("clientId", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, rating, comment } = body;
    if (!projectId || !rating) {
      return NextResponse.json(
        { message: "projectId and rating required" },
        { status: 400 }
      );
    }

    await connectDB();

    const project = await ProjectRequest.findById(projectId);
    if (!project)
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );

    // only the client who created the project can leave a review
    if (project.clientId.toString() !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // ensure one review per project
    const existing = await Review.findOne({ projectId });
    if (existing) {
      return NextResponse.json(
        { message: "Review already exists for this project" },
        { status: 400 }
      );
    }
    const numberOfReviews = await Review.countDocuments({
      designerId: project.designerId,
    });
    const designer = await designerProfile.findOneAndUpdate({
      userId: project.designerId,
    });
    if (designer) {
      const totalRating = designer.ratingAvg * numberOfReviews + Number(rating);
      designer.ratingAvg = totalRating / (numberOfReviews + 1);
      designer.reviewsCount = numberOfReviews + 1;
      await designer.save();
    }
    const review = await Review.create({
      projectId,
      clientId: session.user.id,
      designerId: project.designerId,
      rating: Number(rating),
      comment: comment || "",
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
