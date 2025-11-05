import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Conversation from "@/models/conversation";
import ProjectRequest from "@/models/projectRequest";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const projectId = url.searchParams.get("projectId");

    await connectDB();

    if (!projectId) {
      return NextResponse.json(
        { message: "projectId required" },
        { status: 400 }
      );
    }

    const project = await ProjectRequest.findById(projectId);
    if (!project)
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    // include both client and designer
    let participants = [project.clientId.toString(), project.designerId.toString()];

    // Find existing conversation with same participants and projectId 
    const query: any = {
      participants: { $all: participants.map((p) => p) },
      projectId: projectId,
    };

    let convo = await Conversation.findOne(query);
    if (!convo) {
      convo = await Conversation.create({
        participants,
        projectId: projectId,
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
