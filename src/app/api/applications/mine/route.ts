import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import Application from '@/models/application';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const apps = await Application.find({ designerId: session.user.id }).select('clientProjectId -_id');
    const ids = apps.map((a: any) => a.clientProjectId?.toString()).filter(Boolean);
    return NextResponse.json({ appliedProjectIds: ids });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
