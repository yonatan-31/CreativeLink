import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DesignerProfile from "@/models/designerProfile";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const sizeParam = searchParams.get("size");
    const size = sizeParam ? Math.min(Number(sizeParam), 12) : 6;

    // Random portfolio items from all designers
    const randomPortfolios = await DesignerProfile.aggregate([
      { $unwind: "$portfolio" }, // Step 1: Split portfolio array
      { $sample: { size } },     // Step 2: Take random items
      {
        $lookup: {              // Step 3: Join with user info
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {             // Step 4: Shape the output
          "user._id": 1,
          "user.name": 1,
          "user.avatarUrl": 1,  
          "portfolio": 1,
          "skills": 1,
          "title": 1,
          "rate": 1,
          "reviewsCount": 1,
          "ratingAvg": 1,
        },
      },
    ]);

    return NextResponse.json(randomPortfolios);
  } catch (error) {
    console.error("Error fetching random portfolios:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
