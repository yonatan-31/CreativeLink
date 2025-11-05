import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Message from '@/models/message';
import Conversation from '@/models/conversation';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const conversationId = url.searchParams.get('conversationId');
    if (!conversationId) {
      return NextResponse.json({ message: 'conversationId required' }, { status: 400 });
    }

    await connectDB();

    const convo = await Conversation.findById(conversationId);
    if (!convo) return NextResponse.json({ message: 'Conversation not found' }, { status: 404 });

    // Ensure user is a participant
    if (!convo.participants.map(String).includes(session.user.id)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // mark as read for current user
    if (Array.isArray(convo.unreadBy) && convo.unreadBy.map(String).includes(session.user.id)) {
      convo.unreadBy = convo.unreadBy.map(String).filter((p: string) => p !== session.user.id);
      await convo.save();
    }

    const messages = await Message.find({ conversationId }).populate('sender', 'name avatarUrl').sort({ createdAt: 1 });

    return NextResponse.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId, text } = body;
    if (!conversationId || !text) {
      return NextResponse.json({ message: 'conversationId and text required' }, { status: 400 });
    }

    await connectDB();

    const convo = await Conversation.findById(conversationId);
    if (!convo) return NextResponse.json({ message: 'Conversation not found' }, { status: 404 });

    if (!convo.participants.map(String).includes(session.user.id)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const msg = await Message.create({ conversationId, sender: session.user.id, text });
    convo.lastMessage = text;
  // mark unread for other participants
  convo.unreadBy = convo.participants.map((p: mongoose.Types.ObjectId) => p.toString()).filter((p: string) => p !== session.user.id);
  await convo.save();

    const populated = await msg.populate('sender', 'name avatarUrl');

    return NextResponse.json(populated);
  } catch (err) {
    console.error('Error creating message:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
