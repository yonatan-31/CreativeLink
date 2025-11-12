import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Conversation, { IConversation } from "@/models/conversation";
import mongoose, { FilterQuery } from "mongoose";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const designerId = url.searchParams.get("designerId");
    const clientId = url.searchParams.get("clientId");

    await connectDB();

    let participants: string[] = [session.user.id];

    if (designerId) {
      participants = [session.user.id, designerId];
    } else if (clientId) {
      participants = [session.user.id, clientId];
    } else {
      return NextResponse.json(
        { message: "designerId or projectId required" },
        { status: 400 }
      );
    }

    const objectIds = participants.map((id) => new mongoose.Types.ObjectId(id));

    // Find existing conversation with same participants and projectId (if provided)
    const query: FilterQuery<IConversation> = {
      participants: { $all: objectIds },
    };

    let convo = await Conversation.findOne(query);
    if (!convo) {
      convo = await Conversation.create({
        objectIds,
      });
    }

    return NextResponse.json({ conversationId: convo._id.toString() });
  } catch (err) {
    console.error("Error in conversation GET:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
