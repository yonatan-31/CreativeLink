import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import ProjectRequest from '@/models/projectRequest';
import { authOptions } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { designerId, title, description, budget } = req.body;

    if (!designerId || !title || !description || !budget) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    await connectDB();

    const projectRequest = await ProjectRequest.create({
      clientId: session.user.id,
      designerId,
      title,
      description,
      budget,
    });

    res.status(201).json({
      message: 'Project request created successfully',
      projectRequest,
    });
  } catch (error) {
    console.error('Error creating project request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
