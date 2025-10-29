import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DesignerProfile from "@/models/designerProfile";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const minRate = searchParams.get("minRate");
    const maxRate = searchParams.get("maxRate");
    const availability = searchParams.get("availability");

    // Build filter object
    const filter: Record<string, unknown> = {};

    if (category) {
      filter.category = category;
    }

    if (minRate || maxRate) {
      filter.rate = {};
      if (minRate)
        (filter.rate as Record<string, number>).$gte = Number(minRate);
      if (maxRate)
        (filter.rate as Record<string, number>).$lte = Number(maxRate);
    }

    if (availability) {
      filter.availability = availability;
    }

    // Fetch designers with user information
    const designers = await DesignerProfile.find(filter)
      .populate("userId", "name avatarUrl")
      .sort({ ratingAvg: -1, reviewsCount: -1 })
      .limit(50);

    return NextResponse.json(designers);
  } catch (error) {
    console.error("Error fetching designers:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
