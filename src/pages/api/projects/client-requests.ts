import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import ProjectRequest from '@/models/projectRequest';
import { authOptions } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await connectDB();

    // Get project requests from the current client
    const requests = await ProjectRequest.find({ clientId: session.user.id })
      .populate('designerId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching client project requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
