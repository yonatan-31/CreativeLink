import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import Review from '@/models/review';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { designerId } = req.query;

    if (!designerId) {
      return res.status(400).json({ message: 'Designer ID is required' });
    }

    const reviews = await Review.find({ designerId })
      .populate('clientId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
