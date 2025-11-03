import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/lib/auth";
import connectDB from '@/lib/db';
import ProjectRequest from '@/models/projectRequest';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get project requests from the current client
    const requests = await ProjectRequest.find({ clientId: session.user.id })
      .populate('designerId', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching client project requests:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
