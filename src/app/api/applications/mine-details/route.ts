import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Application from '@/models/application';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const apps = await Application.find({ designerId: session.user.id }).sort({ createdAt: -1 }).populate('clientProjectId');
    return NextResponse.json(apps);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
