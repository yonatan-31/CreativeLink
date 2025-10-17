import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import DesignerProfile from '@/models/designerProfile';
import User from '@/models/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { category, minRate, maxRate, availability } = req.query;

    // Build filter object
    const filter: any = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (minRate || maxRate) {
      filter.rate = {};
      if (minRate) filter.rate.$gte = Number(minRate);
      if (maxRate) filter.rate.$lte = Number(maxRate);
    }
    
    if (availability) {
      filter.availability = availability;
    }

    // Fetch designers with user information
    const designers = await DesignerProfile.find(filter)
      .populate('userId', 'name avatarUrl')
      .sort({ ratingAvg: -1, reviewsCount: -1 })
      .limit(50);

    res.status(200).json(designers);
  } catch (error) {
    console.error('Error fetching designers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
