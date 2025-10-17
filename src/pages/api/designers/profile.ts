import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import DesignerProfile from '@/models/designerProfile';
import { authOptions } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await connectDB();

    if (req.method === 'GET') {
      const profile = await DesignerProfile.findOne({ userId: session.user.id });
      return res.status(200).json(profile);
    }

    if (req.method === 'POST') {
      const { title, bio, category, skills, rate, availability } = req.body;

      // Check if profile already exists
      const existingProfile = await DesignerProfile.findOne({ userId: session.user.id });
      if (existingProfile) {
        return res.status(400).json({ message: 'Profile already exists' });
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

      return res.status(201).json(profile);
    }

    if (req.method === 'PUT') {
      const { title, bio, category, skills, rate, availability } = req.body;

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

      return res.status(200).json(profile);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error with designer profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
