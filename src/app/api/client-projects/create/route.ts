import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import ClientProjects from '@/models/clientProjects';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { title, description, budget, category, deadline } = body;
    if (!title || !description || budget == null) return NextResponse.json({ message: 'Missing fields' }, { status: 400 });

    await connectDB();
    const project = await ClientProjects.create({
      clientId: session.user.id,
      title,
      description,
      budget,
      category,
      deadline: deadline ? new Date(deadline) : undefined,
    });

    return NextResponse.json({ clientProject: project }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
