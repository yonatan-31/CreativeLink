import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import ProjectRequest from '@/models/projectRequest';
import { authOptions } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { status } = req.body;

    if (!status || !['pending', 'accepted', 'declined', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    await connectDB();

    const project = await ProjectRequest.findById(id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the user is the designer for this project
    if (project.designerId.toString() !== session.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updatedProject = await ProjectRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
