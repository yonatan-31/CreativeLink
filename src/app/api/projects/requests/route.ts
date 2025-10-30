import { NextResponse } from 'next/server';
import { auth } from "@/lib/auth";
import connectDB from '@/lib/db';
import ProjectRequest from '@/models/projectRequest';

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get project requests for the current designer
    const requests = await ProjectRequest.find({ designerId: session.user.id })
      .populate('clientId', 'name email')
      .sort({ createdAt: -1 });
    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching project requests:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
