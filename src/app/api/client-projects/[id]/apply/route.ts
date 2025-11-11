import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import ClientProjects from '@/models/clientProjects';
import Application from '@/models/application';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || !session.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { coverLetter } = body;
    if (!coverLetter) return NextResponse.json({ message: 'Cover letter required' }, { status: 400 });

    await connectDB();
    const clientProject = await ClientProjects.findById(id);
    if (!clientProject) return NextResponse.json({ message: 'Client project not found' }, { status: 404 });
    if (clientProject.status !== 'open') return NextResponse.json({ message: 'Project not open' }, { status: 400 });

    // prevent duplicate application
    const existing = await Application.findOne({ clientProjectId: clientProject._id, designerId: session.user.id });
    if (existing) return NextResponse.json({ message: 'You already applied' }, { status: 400 });

    const app = await Application.create({
      clientProjectId: clientProject._id,
      designerId: session.user.id,
      coverLetter,
    });

    return NextResponse.json({ application: app }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
