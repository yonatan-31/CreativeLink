import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DesignerProfile from "@/models/designerProfile";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    const designer = await DesignerProfile.findOne({ userId: id }).populate(
      "userId",
      "name avatarUrl"
    );

    if (!designer) {
      return NextResponse.json(
        { message: "Designer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(designer);
  } catch (error) {
    console.error("Error fetching designer:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
