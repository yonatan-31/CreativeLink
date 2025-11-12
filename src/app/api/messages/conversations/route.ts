import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Conversation, { IConversation } from "@/models/conversation";
import { IUser } from "@/models/user";

type PopulatedConversation = Omit<IConversation, "participants"> & {
  participants: (IUser & { _id: string })[];
};

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const convos = (await Conversation.find({ participants: session.user.id })
      .populate("participants", "name avatarUrl")
      .sort({ updatedAt: -1 })) as PopulatedConversation[];

    const results = convos.map((c) => {
      const participants = (c.participants).map((p) => ({
        _id: p._id,
        name: p.name,
        avatarUrl: p.avatarUrl,
      }));
      const other =
        participants.find((p) => p._id.toString() !== session.user.id) ||
        participants[0];
      return {
        _id: c._id,
        projectId: c.projectId || null,
        lastMessage: c.lastMessage || "",
        updatedAt: c.updatedAt,
        otherParticipant: other,
        unread:
          Array.isArray(c.unreadBy) &&
          c.unreadBy.map(String).includes(session.user.id),
      };
    });

    return NextResponse.json(results);
  } catch (err) {
    console.error("Error fetching conversations:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
