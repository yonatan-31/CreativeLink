import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import DesignerProfile from '@/models/designerProfile';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const designer = await DesignerProfile.findById(id)
      .populate('userId', 'name avatarUrl');

    if (!designer) {
      return res.status(404).json({ message: 'Designer not found' });
    }

    res.status(200).json(designer);
  } catch (error) {
    console.error('Error fetching designer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
