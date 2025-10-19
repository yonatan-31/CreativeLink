import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import DesignerProfile from '@/models/designerProfile';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const profile = await DesignerProfile.findOne({ userId: session.user.id });
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching designer profile:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { title, bio, category, skills, rate, availability } = body;

    // Check if profile already exists
    const existingProfile = await DesignerProfile.findOne({ userId: session.user.id });
    if (existingProfile) {
      return NextResponse.json(
        { message: 'Profile already exists' },
        { status: 400 }
      );
    }

    const profile = await DesignerProfile.create({
      userId: session.user.id,
      title,
      bio,
      category,
      skills,
      rate,
      availability,
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error('Error creating designer profile:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { title, bio, category, skills, rate, availability } = body;

    const profile = await DesignerProfile.findOneAndUpdate(
      { userId: session.user.id },
      {
        title,
        bio,
        category,
        skills,
        rate,
        availability,
      },
      { new: true, upsert: true }
    );

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating designer profile:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
