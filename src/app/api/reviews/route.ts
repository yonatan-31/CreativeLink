// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/lib/db';
// import Review from '@/models/review';

// export async function GET(request: NextRequest) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(request.url);
//     const designerId = searchParams.get('designerId');

//     if (!designerId) {
//       return NextResponse.json(
//         { message: 'Designer ID is required' },
//         { status: 400 }
//       );
//     }

//     const reviews = await Review.find({ designerId })
//       .populate('clientId', 'name')
//       .sort({ createdAt: -1 });

//     return NextResponse.json(reviews);
//   } catch (error) {
//     console.error('Error fetching reviews:', error);
//     return NextResponse.json(
//       { message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

