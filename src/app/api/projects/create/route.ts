// import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import connectDB from '@/lib/db';
// import ProjectRequest from '@/models/projectRequest';
// import { authOptions } from '@/lib/auth';

// export async function POST(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);
    
//     if (!session || !session.user) {
//       return NextResponse.json(
//         { message: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     const body = await request.json();
//     const { designerId, title, description, budget } = body;

//     if (!designerId || !title || !description || !budget) {
//       return NextResponse.json(
//         { message: 'All fields are required' },
//         { status: 400 }
//       );
//     }

//     await connectDB();

//     const projectRequest = await ProjectRequest.create({
//       clientId: session.user.id,
//       designerId,
//       title,
//       description,
//       budget,
//     });

//     return NextResponse.json(
//       {
//         message: 'Project request created successfully',
//         projectRequest,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('Error creating project request:', error);
//     return NextResponse.json(
//       { message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

