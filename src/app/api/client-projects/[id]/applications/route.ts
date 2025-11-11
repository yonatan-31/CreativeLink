import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import ClientProjects from '@/models/clientProjects';
import Application from '@/models/application';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || !session.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await connectDB();
    const project = await ClientProjects.findById(id);
    if (!project) return NextResponse.json({ message: 'Client project not found' }, { status: 404 });

    // Only the owner can view applications
    if (project.clientId.toString() !== session.user.id) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const applications = await Application.find({ opportunityId: id }).populate('designerId', 'name skills ratingAvg');

    return NextResponse.json(applications);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
