import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ClientProjects from '@/models/clientProjects';

// GET /api/client-projects - list open client projects
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const q = req.nextUrl.searchParams;
    const status = q.get('status');
    const limit = Number(q.get('limit') || 50);
    const mine = q.get('mine') === 'true';
    const id = q.get('id');

    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    if (id) query._id = id;

    // if mine requested, try to get session via auth (lazy import)
    if (mine) {
      const { auth } = await import('@/lib/auth');
      const session = await auth();
      if (!session || !session.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      query.clientId = session.user.id;
    }
    const projects = await ClientProjects.find(query).sort({ createdAt: -1 }).limit(limit);
    return NextResponse.json({ projects });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
